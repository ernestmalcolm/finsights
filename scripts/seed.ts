/**
 * Seed script — populates all Supabase tables from the existing static JSON files.
 *
 * Prerequisites:
 *  1. Create your Supabase project at https://supabase.com
 *  2. Run the SQL in supabase/schema.sql in the Supabase SQL editor
 *  3. Fill in .env.local with your NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *
 * Run: npx tsx scripts/seed.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey || serviceKey === 'your-service-role-key-here') {
  console.error('❌  Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function readJson<T>(file: string): T {
  const p = path.join(__dirname, '../data', file);
  return JSON.parse(fs.readFileSync(p, 'utf8')) as T;
}

const BANK_COLORS: Record<string, string> = {
  CRDB: '#F59E0B', NMB: '#0EA5E9', ABSA: '#10B981', NBC: '#8B5CF6',
  STANBIC: '#F97316', DTB: '#EC4899', EXIM: '#14B8A6', CITIBANK: '#6366F1',
  AZANIA: '#84CC16', PBZ: '#EF4444',
};

const BANK_FULL_NAMES: Record<string, string> = {
  CRDB: 'CRDB Bank', NMB: 'National Microfinance Bank', ABSA: 'Absa Bank Tanzania',
  NBC: 'National Bank of Commerce', STANBIC: 'Stanbic Bank Tanzania',
  DTB: 'Diamond Trust Bank', EXIM: 'Exim Bank Tanzania',
  CITIBANK: 'Citibank Tanzania', AZANIA: 'Azania Bank',
  PBZ: "People's Bank of Zanzibar",
};

const BANKS = ['ABSA', 'AZANIA', 'CITIBANK', 'CRDB', 'DTB', 'EXIM', 'NBC', 'NMB', 'PBZ', 'STANBIC'];

async function upsertBatch<T extends object>(
  table: string,
  rows: T[],
  onConflict: string = 'id',
  chunkSize = 500
) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).upsert(chunk, { onConflict, ignoreDuplicates: false });
    if (error) throw new Error(`${table}: ${error.message}`);
    process.stdout.write(`  ${table}: ${Math.min(i + chunkSize, rows.length)}/${rows.length} rows\r`);
  }
  console.log(`  ✓ ${table}: ${rows.length} rows`);
}

async function main() {
  console.log('🌱 FinSights seed script starting...\n');

  // ── Banks ──────────────────────────────────────────────────────────────────
  console.log('Seeding banks...');
  await upsertBatch('banks', BANKS.map(name => ({
    name, full_name: BANK_FULL_NAMES[name] ?? name,
    color: BANK_COLORS[name] ?? '#888', active: true,
  })), 'name');

  // ── GL Mapping ─────────────────────────────────────────────────────────────
  console.log('Seeding gl_mapping...');
  type GLRow = { SubClassID: string; 'Account Type': string; Class: string; Subclass: string };
  const glRaw = readJson<GLRow[]>('gl_mapping.json');
  await upsertBatch('gl_mapping', glRaw.map(r => ({
    sub_class_id: r.SubClassID,
    account_type: r['Account Type'],
    class:        r.Class,
    subclass:     r.Subclass,
  })), 'sub_class_id');

  // ── Macro Mapping ──────────────────────────────────────────────────────────
  console.log('Seeding macro_mapping...');
  type MacroMapRow = { MetricID: string; Continent: string; Region: string; Country: string; Metric: string };
  const macroMapRaw = readJson<MacroMapRow[]>('macro_mapping.json');
  await upsertBatch('macro_mapping', macroMapRaw.map(r => ({
    metric_id: r.MetricID, continent: r.Continent,
    region: r.Region, country: r.Country, metric: r.Metric,
  })), 'metric_id');

  // ── Assets ─────────────────────────────────────────────────────────────────
  console.log('Seeding assets...');
  type AssetRaw = { Bank: string; Year: number; ClassID: string; Amount: number };
  const assetsRaw = readJson<AssetRaw[]>('assets.json');
  await upsertBatch('assets', assetsRaw.map(r => ({
    bank_name: r.Bank, year: r.Year, class_id: r.ClassID, amount: r.Amount,
  })), 'id');

  // ── Liabilities ────────────────────────────────────────────────────────────
  console.log('Seeding liabilities...');
  type LiabRaw = { Bank: string; Year: number; ClassID: string; Amount: number };
  const liabRaw = readJson<LiabRaw[]>('liabilities.json');
  await upsertBatch('liabilities', liabRaw.map(r => ({
    bank_name: r.Bank, year: r.Year, class_id: r.ClassID, amount: r.Amount,
  })), 'id');

  // ── P&L ────────────────────────────────────────────────────────────────────
  console.log('Seeding pnl_records...');
  type PnLRaw = { Bank: string; 'Financial Year': number; ClassID: string; 'Interest Income': number };
  const pnlRaw = readJson<PnLRaw[]>('pnl.json');
  await upsertBatch('pnl_records', pnlRaw.map(r => ({
    bank_name: r.Bank, year: r['Financial Year'], class_id: r.ClassID, amount: r['Interest Income'],
  })), 'id');

  // ── Other Items (NPL, Provisions, Contingent) ──────────────────────────────
  console.log('Seeding other_items...');
  type OtherRaw = { Bank: string; Year: number; SubClassID: string; Amount: number };
  const otherRaw = readJson<OtherRaw[]>('other_items.json');
  await upsertBatch('other_items', otherRaw.map(r => ({
    bank_name: r.Bank, year: r.Year, sub_class_id: r.SubClassID, amount: r.Amount,
  })), 'id');

  // ── Macro Data ─────────────────────────────────────────────────────────────
  console.log('Seeding macro_data...');
  type MacroRaw = { Country: string; MetricID: string; Year: number | string; Amount: number };
  const macroRaw = readJson<MacroRaw[]>('macro.json');
  await upsertBatch('macro_data', macroRaw.map(r => ({
    country: r.Country, metric_id: r.MetricID,
    year: typeof r.Year === 'string' ? parseInt(r.Year, 10) : r.Year,
    amount: r.Amount,
  })), 'id');

  console.log('\n✅ Seed complete! All data is now in Supabase.');
  console.log('\nNext steps:');
  console.log('  1. Go to Supabase Dashboard → Authentication → Users');
  console.log('  2. Create your admin and user accounts');
  console.log('  3. In Supabase SQL editor, promote admin:');
  console.log("     UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin@email.com';");
  console.log('  4. Run supabase/admin_rls.sql if admin saves fail with permission denied');
}

main().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
