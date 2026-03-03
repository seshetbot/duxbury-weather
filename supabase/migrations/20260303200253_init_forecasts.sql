create table if not exists public.forecasts (
  id uuid primary key default gen_random_uuid(),
  location text not null,
  region text not null,
  species text[] default '{}',
  tide_phase text,
  moon_phase text,
  wind text,
  temperature text,
  water_temp text,
  rating int default 4,
  window_start timestamptz not null,
  window_end timestamptz not null,
  notes text,
  inserted_at timestamptz default now()
);

alter table public.forecasts enable row level security;

drop policy if exists "Anon can read forecasts" on public.forecasts;
drop policy if exists "Service role can insert" on public.forecasts;

create policy "Anon can read forecasts"
  on public.forecasts
  for select
  using (true);

create policy "Service role can insert"
  on public.forecasts
  for insert
  with check (true);
