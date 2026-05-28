-- ============================================================
-- FinSights — Admin write policies
-- Run this in Supabase SQL Editor if admin saves fail with
-- "permission denied" or "Save failed"
-- ============================================================

-- Returns true when the logged-in user has role = 'admin'
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

-- Banks
drop policy if exists "admin_write_banks" on public.banks;
create policy "admin_write_banks" on public.banks
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Financial data tables
drop policy if exists "admin_write_assets" on public.assets;
create policy "admin_write_assets" on public.assets
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_write_liabilities" on public.liabilities;
create policy "admin_write_liabilities" on public.liabilities
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_write_pnl" on public.pnl_records;
create policy "admin_write_pnl" on public.pnl_records
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_write_other_items" on public.other_items;
create policy "admin_write_other_items" on public.other_items
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin_write_macro" on public.macro_data;
create policy "admin_write_macro" on public.macro_data
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Profiles: admins can read all users and update roles
drop policy if exists "read_own_profile" on public.profiles;
create policy "read_profiles" on public.profiles
  for select to authenticated
  using (auth.uid() = id or public.is_admin());

drop policy if exists "admin_update_profiles" on public.profiles;
create policy "admin_update_profiles" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
