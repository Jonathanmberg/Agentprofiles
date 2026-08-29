-- Public example only. Use fictional businesses and never commit real customer data.
insert into public.clinics (name, city, address, phone, neighborhood, category, service_focus, service_description, pricing_note)
values ('Example Studio', 'Oslo', 'Example street 1', '+47 00 00 00 00', 'Example area', 'hair', array['haircut'], 'Example service description.', 'From 700 NOK.');

-- Add a provider and appointment slots using the generated clinic id in your own project.
