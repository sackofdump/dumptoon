-- Dumptoon TCG — Supabase schema.
-- Paste into the SQL editor in your Supabase dashboard.
-- Designed for client-side calls under the anon key, with RLS protecting user rows.

-- Profiles ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique,
  coins_cents integer not null default 500,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profile read self" on public.profiles
  for select using (auth.uid() = id);
create policy "profile insert self" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profile update self" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Inventory --------------------------------------------------------
-- One row per (user, card_id). qty tracks copy count.
create table if not exists public.inventory (
  user_id uuid not null references auth.users on delete cascade,
  card_id text not null,
  qty integer not null default 1 check (qty >= 0),
  acquired_at timestamp with time zone default now(),
  primary key (user_id, card_id)
);

alter table public.inventory enable row level security;

create policy "inventory read self"   on public.inventory for select using (auth.uid() = user_id);
create policy "inventory insert self" on public.inventory for insert with check (auth.uid() = user_id);
create policy "inventory update self" on public.inventory for update using (auth.uid() = user_id);
create policy "inventory delete self" on public.inventory for delete using (auth.uid() = user_id);

-- Decks ------------------------------------------------------------
-- Each deck is a 20-card list as text[]. RLS-locked to owner.
create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null default 'untitled deck',
  card_ids text[] not null default '{}',
  updated_at timestamp with time zone default now()
);

alter table public.decks enable row level security;

create policy "deck read self"   on public.decks for select using (auth.uid() = user_id);
create policy "deck insert self" on public.decks for insert with check (auth.uid() = user_id);
create policy "deck update self" on public.decks for update using (auth.uid() = user_id);
create policy "deck delete self" on public.decks for delete using (auth.uid() = user_id);

-- Match history (optional, for ranking later) ----------------------
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  player_a uuid references auth.users on delete set null,
  player_b uuid references auth.users on delete set null,
  winner   uuid references auth.users on delete set null,
  ended_at timestamp with time zone default now()
);
alter table public.matches enable row level security;
create policy "match read participants" on public.matches
  for select using (auth.uid() = player_a or auth.uid() = player_b);
