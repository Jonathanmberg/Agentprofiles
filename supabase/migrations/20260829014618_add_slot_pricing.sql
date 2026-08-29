alter table public.clinics
  add column if not exists neighborhood text,
  add column if not exists category text not null default 'dental' check (category in ('dental', 'hair')),
  add column if not exists service_focus text[] not null default '{}',
  add column if not exists service_description text,
  add column if not exists pricing_note text;

alter table public.slots
  add column if not exists price_nok integer not null default 0 check (price_nok >= 0);

create index if not exists clinics_category_city_lookup on public.clinics (category, city);
