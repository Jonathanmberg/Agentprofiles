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
  if claimed_slot.id is null then
    raise exception 'This appointment slot is no longer available.' using errcode = 'P0001';
  end if;

  insert into public.appointments (slot_id, patient_name, patient_email, patient_phone)
  values (slot_id, patient_name, patient_email, patient_phone)
  returning id into appointment_id;

  select d.name into dentist_name from public.dentists d where d.id = claimed_slot.dentist_id;
  select c.name, c.address, c.phone
  into clinic_name, clinic_address, clinic_phone
  from public.clinics c join public.dentists d on d.clinic_id = c.id
  where d.id = claimed_slot.dentist_id;

  return jsonb_build_object(
    'appointment_id', appointment_id,
    'slot_id', claimed_slot.id,
    'patient_name', patient_name,
    'clinic_name', clinic_name,
    'clinic_address', clinic_address,
    'clinic_phone', clinic_phone,
    'dentist_name', dentist_name,
    'start_time', claimed_slot.start_time,
    'end_time', claimed_slot.end_time
  );
end;
$$;

revoke all on function public.book_open_slot(uuid, text, text, text) from public;
grant execute on function public.book_open_slot(uuid, text, text, text) to service_role;
