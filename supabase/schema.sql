-- ============================================================
-- FinSights — Supabase Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Banks ────────────────────────────────────────────────────
create table if not exists public.banks (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,  -- e.g. 'CRDB'
  full_name  text,
  color      text,
  active     boolean not null default true,
  created_at timestamptz default now()
);

-- ── Assets ───────────────────────────────────────────────────
create table if not exists public.assets (
  id        uuid primary key default gen_random_uuid(),
  bank_name text not null,
  year      integer not null,
  class_id  text not null,
  amount    numeric not null default 0
);
create index if not exists assets_bank_year on public.assets (bank_name, year);

-- ── Liabilities ──────────────────────────────────────────────
create table if not exists public.liabilities (
  id        uuid primary key default gen_random_uuid(),
  bank_name text not null,
  year      integer not null,
  class_id  text not null,
  amount    numeric not null default 0
);
create index if not exists liabilities_bank_year on public.liabilities (bank_name, year);

-- ── P&L ──────────────────────────────────────────────────────
create table if not exists public.pnl_records (
  id        uuid primary key default gen_random_uuid(),
  bank_name text not null,
  year      integer not null,
  class_id  text not null,
  amount    numeric not null default 0
);
create index if not exists pnl_bank_year on public.pnl_records (bank_name, year);

-- ── Macro Data ───────────────────────────────────────────────
create table if not exists public.macro_data (
  id        uuid primary key default gen_random_uuid(),
  country   text not null,
  metric_id text not null,
  year      integer not null,
  amount    numeric
);
create index if not exists macro_country_metric on public.macro_data (country, metric_id);

-- ── Other Items (NPL, Provisions, Contingent) ────────────────
create table if not exists public.other_items (
  id           uuid primary key default gen_random_uuid(),
  bank_name    text not null,
  year         integer not null,
  sub_class_id text not null,
  amount       numeric not null default 0
);
create index if not exists other_items_bank_year on public.other_items (bank_name, year);

-- ── GL Mapping ───────────────────────────────────────────────
create table if not exists public.gl_mapping (
  sub_class_id text primary key,
  account_type text,
  class        text,
  subclass     text
);

-- ── Macro Mapping ────────────────────────────────────────────
create table if not exists public.macro_mapping (
  metric_id text primary key,
  continent text,
  region    text,
  country   text,
  metric    text
);

-- ── Profiles (extends auth.users) ────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'user' check (role in ('admin', 'user')),
  full_name  text,
  email      text,
  created_at timestamptz default now()
);

-- Auto-create profile on new user sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Row Level Security ────────────────────────────────────────
alter table public.banks        enable row level security;
alter table public.assets       enable row level security;
alter table public.liabilities  enable row level security;
alter table public.pnl_records  enable row level security;
alter table public.macro_data   enable row level security;
alter table public.other_items  enable row level security;
alter table public.gl_mapping   enable row level security;
alter table public.macro_mapping enable row level security;
alter table public.profiles     enable row level security;

-- Authenticated users can read all data tables
create policy "authed_read_banks"        on public.banks        for select to authenticated using (true);
create policy "authed_read_assets"       on public.assets       for select to authenticated using (true);
create policy "authed_read_liabilities"  on public.liabilities  for select to authenticated using (true);
create policy "authed_read_pnl"          on public.pnl_records  for select to authenticated using (true);
create policy "authed_read_macro"        on public.macro_data   for select to authenticated using (true);
create policy "authed_read_other_items"  on public.other_items  for select to authenticated using (true);
create policy "authed_read_gl_mapping"   on public.gl_mapping   for select to authenticated using (true);
create policy "authed_read_macro_mapping" on public.macro_mapping for select to authenticated using (true);

-- Admin helper — checks profiles.role (security definer bypasses RLS on profiles)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Users can read their own profile; admins can read all
create policy "read_profiles" on public.profiles for select to authenticated
  using (auth.uid() = id or public.is_admin());

-- Admin write access on all managed tables
create policy "admin_write_banks" on public.banks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_write_assets" on public.assets
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_write_liabilities" on public.liabilities
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_write_pnl" on public.pnl_records
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_write_other_items" on public.other_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_write_macro" on public.macro_data
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_update_profiles" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Promote a user to admin ───────────────────────────────────
-- Run manually after creating the admin account:
-- update public.profiles set role = 'admin' where email = 'admin@finsights.app';
