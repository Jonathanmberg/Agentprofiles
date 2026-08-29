-- Private operational seed data is intentionally excluded from the public release.
-- See supabase/seed.example.sql for the shape of your own fictional demo data.

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
  provider_name text;
  business_name text;
  business_address text;
  business_phone text;
  business_category text;
begin
  update public.slots set is_booked = true
  where id = slot_id and is_booked = false
  returning * into claimed_slot;
  if claimed_slot.id is null then
    raise exception 'This appointment slot is no longer available.' using errcode = 'P0001';
  end if;

  insert into public.appointments (slot_id, patient_name, patient_email, patient_phone)
  values (slot_id, patient_name, patient_email, patient_phone)
  returning id into appointment_id;

  select d.name, c.name, c.address, c.phone, c.category
  into provider_name, business_name, business_address, business_phone, business_category
  from public.dentists d join public.clinics c on c.id = d.clinic_id
  where d.id = claimed_slot.dentist_id;

  return jsonb_build_object(
    'appointment_id', appointment_id, 'slot_id', claimed_slot.id, 'patient_name', patient_name,
    'clinic_name', business_name, 'clinic_address', business_address, 'clinic_phone', business_phone,
    'dentist_name', provider_name, 'provider_name', provider_name, 'business_category', business_category,
    'start_time', claimed_slot.start_time, 'end_time', claimed_slot.end_time
  );
end;
$$;

revoke all on function public.book_open_slot(uuid, text, text, text) from public;
grant execute on function public.book_open_slot(uuid, text, text, text) to service_role;
