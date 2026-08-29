create extension if not exists pgcrypto;

create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  address text not null,
  phone text not null
);
create table public.dentists (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null
);
create table public.slots (
  id uuid primary key default gen_random_uuid(),
  dentist_id uuid not null references public.dentists(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  is_booked boolean not null default false,
  constraint slots_time_order check (end_time > start_time),
  unique (dentist_id, start_time)
);
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null unique references public.slots(id) on delete restrict,
  patient_name text not null,
  patient_email text not null,
  patient_phone text not null,
  created_at timestamptz not null default now()
);

create index slots_available_lookup on public.slots (dentist_id, start_time) where is_booked = false;
create index dentists_clinic_lookup on public.dentists (clinic_id);

alter table public.clinics enable row level security;
alter table public.dentists enable row level security;
alter table public.slots enable row level security;
alter table public.appointments enable row level security;
create policy "Public clinic discovery" on public.clinics for select using (true);
create policy "Public dentist discovery" on public.dentists for select using (true);
create policy "Public open slot discovery" on public.slots for select using (is_booked = false);
-- Appointments have no public read/write policy. The Next.js server uses the service role.

create or replace function public.book_open_slot(
  slot_id uuid,
  patient_name text,
  patient_email text,
  patient_phone text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  claimed_slot public.slots;
  appointment_id uuid;
  dentist_name text;
  clinic_name text;
  clinic_address text;
  clinic_phone text;
begin
  update public.slots set is_booked = true
  where id = slot_id and is_booked = false
  returning * into claimed_slot;
  if claimed_slot.id is null then raise exception 'This appointment slot is no longer available.' using errcode = 'P0001'; end if;
  insert into public.appointments (slot_id, patient_name, patient_email, patient_phone)
  values (slot_id, patient_name, patient_email, patient_phone) returning id into appointment_id;
  select d.name into dentist_name from public.dentists d where d.id = claimed_slot.dentist_id;
  select c.name, c.address, c.phone
  into clinic_name, clinic_address, clinic_phone
  from public.clinics c join public.dentists d on d.clinic_id = c.id
  where d.id = claimed_slot.dentist_id;
  return jsonb_build_object('appointment_id', appointment_id, 'slot_id', claimed_slot.id, 'patient_name', patient_name, 'clinic_name', clinic_name, 'clinic_address', clinic_address, 'clinic_phone', clinic_phone, 'dentist_name', dentist_name, 'start_time', claimed_slot.start_time, 'end_time', claimed_slot.end_time);
end;
$$;

revoke all on function public.book_open_slot(uuid, text, text, text) from public;
grant execute on function public.book_open_slot(uuid, text, text, text) to service_role;
