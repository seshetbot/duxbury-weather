create table if not exists public.weather_views (
  id uuid primary key default gen_random_uuid(),
  location text not null,
  viewed_at timestamptz not null default now(),
  inserted_at timestamptz not null default now()
);

alter table public.weather_views enable row level security;

drop policy if exists "Anon can read weather views" on public.weather_views;
drop policy if exists "Service role can insert weather views" on public.weather_views;

create policy "Anon can read weather views"
  on public.weather_views
  for select
  using (true);

create policy "Service role can insert weather views"
  on public.weather_views
  for insert
  with check (true);
