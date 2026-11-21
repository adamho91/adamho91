-- fal Slides cloud schema (optional)
create table if not exists public.decks (
  id text primary key,
  title text not null,
  payload jsonb not null,
  share_id text unique,
  updated_at timestamptz not null default now(),
  owner uuid references auth.users (id)
);

alter table public.decks enable row level security;

create policy "Owners can manage own decks"
  on public.decks
  for all
  using (auth.uid() = owner)
  with check (auth.uid() = owner);

create policy "Anyone can read by share payload via RPC later"
  on public.decks
  for select
  using (true);
