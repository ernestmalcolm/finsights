/**
 * Async data layer — queries Supabase tables.
 * Used by admin pages for CRUD. Dashboard pages still read static JSON via lib/data.ts.
 */

import { createClient } from '@/lib/supabase/client';

function assertDbOk(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

// ── Types matching Supabase table shapes ─────────────────────────────────────

export type BankRow = {
  id: string; name: string; full_name: string | null;
  color: string | null; active: boolean;
};

export type AssetRow = {
  id: string; bank_name: string; year: number; class_id: string; amount: number;
};

export type LiabilityRow = {
  id: string; bank_name: string; year: number; class_id: string; amount: number;
};

export type PnLRow = {
  id: string; bank_name: string; year: number; class_id: string; amount: number;
};

export type MacroRow = {
  id: string; country: string; metric_id: string; year: number; amount: number | null;
};

export type MacroMappingRow = {
  metric_id: string; continent: string | null; region: string | null;
  country: string | null; metric: string | null;
};

export type OtherItemRow = {
  id: string; bank_name: string; year: number; sub_class_id: string; amount: number;
};

export type GLMappingRow = {
  sub_class_id: string;
  account_type: string | null;
  class: string | null;
  subclass: string | null;
};

export type ProfileRow = {
  id: string; role: 'admin' | 'user'; full_name: string | null; email: string | null; created_at: string;
};

// ── Admin: banks table ───────────────────────────────────────────────────────

export async function adminGetBanks(): Promise<BankRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('banks').select('*').order('name');
  assertDbOk(error);
  return data ?? [];
}

export async function adminUpsertBank(bank: Omit<BankRow, 'id'> & { id?: string }) {
  const supabase = createClient();
  const { error } = await supabase.from('banks').upsert(bank);
  assertDbOk(error);
}

export async function adminDeleteBank(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('banks').delete().eq('id', id);
  assertDbOk(error);
}

// ── Admin: assets table ──────────────────────────────────────────────────────

export async function adminGetAssets(bankName: string, year: number): Promise<AssetRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('assets').select('*')
    .eq('bank_name', bankName).eq('year', year)
    .order('class_id');
  assertDbOk(error);
  return data ?? [];
}

export async function adminUpsertAsset(row: Omit<AssetRow, 'id'> & { id?: string }) {
  const supabase = createClient();
  const { error } = await supabase.from('assets').upsert(row);
  assertDbOk(error);
}

export async function adminDeleteAsset(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('assets').delete().eq('id', id);
  assertDbOk(error);
}

export async function adminGetAssetsByClass(bankName: string, classId: string): Promise<AssetRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('assets').select('*')
    .eq('bank_name', bankName).eq('class_id', classId)
    .order('year', { ascending: false });
  assertDbOk(error);
  return data ?? [];
}

// ── Admin: liabilities table ─────────────────────────────────────────────────

export async function adminGetLiabilities(bankName: string, year: number): Promise<LiabilityRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('liabilities').select('*')
    .eq('bank_name', bankName).eq('year', year)
    .order('class_id');
  assertDbOk(error);
  return data ?? [];
}

export async function adminUpsertLiability(row: Omit<LiabilityRow, 'id'> & { id?: string }) {
  const supabase = createClient();
  const { error } = await supabase.from('liabilities').upsert(row);
  assertDbOk(error);
}

export async function adminDeleteLiability(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('liabilities').delete().eq('id', id);
  assertDbOk(error);
}

export async function adminGetLiabilitiesByClass(bankName: string, classId: string): Promise<LiabilityRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('liabilities').select('*')
    .eq('bank_name', bankName).eq('class_id', classId)
    .order('year', { ascending: false });
  assertDbOk(error);
  return data ?? [];
}

// ── Admin: pnl_records table ─────────────────────────────────────────────────

export async function adminGetPnL(bankName: string, year: number): Promise<PnLRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('pnl_records').select('*')
    .eq('bank_name', bankName).eq('year', year)
    .order('class_id');
  assertDbOk(error);
  return data ?? [];
}

export async function adminUpsertPnL(row: Omit<PnLRow, 'id'> & { id?: string }) {
  const supabase = createClient();
  const { error } = await supabase.from('pnl_records').upsert(row);
  assertDbOk(error);
}

export async function adminDeletePnL(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('pnl_records').delete().eq('id', id);
  assertDbOk(error);
}

export async function adminGetPnLByClass(bankName: string, classId: string): Promise<PnLRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('pnl_records').select('*')
    .eq('bank_name', bankName).eq('class_id', classId)
    .order('year', { ascending: false });
  assertDbOk(error);
  return data ?? [];
}

// ── Admin: other_items table ─────────────────────────────────────────────────

export async function adminGetOtherItems(bankName: string, year: number): Promise<OtherItemRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('other_items').select('*')
    .eq('bank_name', bankName).eq('year', year)
    .order('sub_class_id');
  assertDbOk(error);
  return data ?? [];
}

export async function adminUpsertOtherItem(row: Omit<OtherItemRow, 'id'> & { id?: string }) {
  const supabase = createClient();
  const { error } = await supabase.from('other_items').upsert(row);
  assertDbOk(error);
}

export async function adminDeleteOtherItem(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('other_items').delete().eq('id', id);
  assertDbOk(error);
}

export async function adminGetOtherItemsByClass(bankName: string, classId: string): Promise<OtherItemRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('other_items').select('*')
    .eq('bank_name', bankName).eq('sub_class_id', classId)
    .order('year', { ascending: false });
  assertDbOk(error);
  return data ?? [];
}

// ── Admin: gl_mapping table ──────────────────────────────────────────────────

export async function adminGetGLMapping(): Promise<GLMappingRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('gl_mapping')
    .select('*')
    .order('sub_class_id');
  assertDbOk(error);
  return data ?? [];
}

// ── Admin: macro_data table ──────────────────────────────────────────────────

export async function adminGetMacroData(): Promise<MacroRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('macro_data').select('*')
    .order('metric_id').order('year');
  assertDbOk(error);
  return data ?? [];
}

export async function adminGetMacroByMetric(metricId: string): Promise<MacroRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('macro_data').select('*')
    .eq('metric_id', metricId)
    .order('year', { ascending: false });
  assertDbOk(error);
  return data ?? [];
}

export async function adminUpsertMacroRow(row: Omit<MacroRow, 'id'> & { id?: string }) {
  const supabase = createClient();
  const { error } = await supabase.from('macro_data').upsert(row);
  assertDbOk(error);
}

export async function adminDeleteMacroRow(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('macro_data').delete().eq('id', id);
  assertDbOk(error);
}

// ── Admin: macro_mapping table ───────────────────────────────────────────────

export async function adminGetMacroMapping(): Promise<MacroMappingRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('macro_mapping')
    .select('*')
    .order('metric_id');
  assertDbOk(error);
  return data ?? [];
}

// ── Admin: profiles / users table ───────────────────────────────────────────

export async function adminGetProfiles(): Promise<ProfileRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles').select('*').order('created_at');
  assertDbOk(error);
  return data ?? [];
}

export async function adminUpdateProfileRole(id: string, role: 'admin' | 'user') {
  const supabase = createClient();
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
  assertDbOk(error);
}

// ── Admin: overview stats ────────────────────────────────────────────────────

export async function adminGetStats() {
  const supabase = createClient();
  const results = await Promise.all([
    supabase.from('assets').select('*', { count: 'exact', head: true }),
    supabase.from('liabilities').select('*', { count: 'exact', head: true }),
    supabase.from('pnl_records').select('*', { count: 'exact', head: true }),
    supabase.from('other_items').select('*', { count: 'exact', head: true }),
    supabase.from('macro_data').select('*', { count: 'exact', head: true }),
    supabase.from('banks').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);
  results.forEach(r => assertDbOk(r.error));
  const [assetCount, liabCount, pnlCount, otherCount, macroCount, bankCount, userCount] =
    results.map(r => r.count);
  return { assetCount, liabCount, pnlCount, otherCount, macroCount, bankCount, userCount };
}
