-- Fully fictional, public demo data. Safe to use locally; do not replace it with real customer data.
insert into public.clinics (id, name, city, address, phone, neighborhood, category, service_focus, service_description, pricing_note) values
  ('aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Northside Dental', 'Oslo', 'Sampleveien 12, 0480 Oslo', '+47 00 10 20 30', 'Nydalen', 'dental', array['checkup', 'cleaning'], 'General dental appointments and checkups.', 'Checkup from 1,100 NOK.'),
  ('aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'Central Smile', 'Oslo', 'Eksempelveien 4, 0160 Oslo', '+47 00 10 20 31', 'Sentrum', 'dental', array['checkup', 'cleaning'], 'General dental appointments and checkups.', 'Checkup from 950 NOK.'),
  ('aaaaaaa3-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'Studio Wave', 'Oslo', 'Demogata 8, 0550 Oslo', '+47 00 10 20 32', 'Grünerløkka', 'hair', array['perm', 'haircut', 'styling'], 'Hair studio specialising in perms, cuts, and styling.', 'Perm from 1,700 NOK.');

insert into public.dentists (id, clinic_id, name) values
  ('bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Alex Nord'),
  ('bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'Sam Central'),
  ('bbbbbbb3-bbbb-4bbb-8bbb-bbbbbbbbbbb3', 'aaaaaaa3-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'Robin Wave');

insert into public.slots (dentist_id, start_time, end_time, price_nok)
select d.id,
  (date_trunc('day', now() at time zone 'Europe/Oslo') + (day_offset || ' days')::interval + interval '14 hours') at time zone 'Europe/Oslo',
  (date_trunc('day', now() at time zone 'Europe/Oslo') + (day_offset || ' days')::interval + interval '14 hours 45 minutes') at time zone 'Europe/Oslo',
  case d.clinic_id
    when 'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1'::uuid then 1100
    when 'aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2'::uuid then 950
    else 1700
  end
from public.dentists d
cross join generate_series(1, 10) as day_offset
where extract(isodow from date_trunc('day', now() at time zone 'Europe/Oslo') + (day_offset || ' days')::interval) < 6;
