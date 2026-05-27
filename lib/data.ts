import assetsData from '@/data/assets.json';
import liabilitiesData from '@/data/liabilities.json';
import pnlData from '@/data/pnl.json';
import macroData from '@/data/macro.json';
import macroMappingData from '@/data/macro_mapping.json';
import glMappingData from '@/data/gl_mapping.json';
import otherItemsData from '@/data/other_items.json';

type AssetRow = { Bank: string; Year: number; ClassID: string; Amount: number };
type LiabilityRow = { Bank: string; Year: number; ClassID: string; Amount: number };
type PnLRow = { Bank: string; 'Financial Year': number; ClassID: string; 'Interest Income': number };
type MacroRow = { Country: string; MetricID: string; Year: number; Amount: number };
type OtherItemRow = { Bank: string; Year: number; SubClassID: string; Amount: number };
type GLMappingRow = { SubClassID: string; 'Account Type': string; Class: string; Subclass: string };
type MacroMappingRow = { MetricID: string; Continent: string; Region: string; Country: string; Metric: string };

const assets = assetsData as AssetRow[];
const liabilities = liabilitiesData as LiabilityRow[];
const pnl = pnlData as PnLRow[];
const macroRaw = macroData as MacroRow[];
const macroMapping = macroMappingData as MacroMappingRow[];
const glMapping = glMappingData as GLMappingRow[];
const otherItems = otherItemsData as OtherItemRow[];

export const BANKS = ['ABSA', 'AZANIA', 'CITIBANK', 'CRDB', 'DTB', 'EXIM', 'NBC', 'NMB', 'PBZ', 'STANBIC'] as const;
export type Bank = (typeof BANKS)[number];
export const YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] as const;
export type Year = (typeof YEARS)[number];
export const LATEST_YEAR = 2024;

export const BANK_COLORS: Record<string, string> = {
  CRDB: '#F59E0B', NMB: '#0EA5E9', ABSA: '#10B981', NBC: '#8B5CF6',
  STANBIC: '#F97316', DTB: '#EC4899', EXIM: '#14B8A6', CITIBANK: '#6366F1',
  AZANIA: '#84CC16', PBZ: '#EF4444',
};

export const BANK_FULL_NAMES: Record<string, string> = {
  CRDB: 'CRDB Bank', NMB: 'National Microfinance Bank', ABSA: 'Absa Bank Tanzania',
  NBC: 'National Bank of Commerce', STANBIC: 'Stanbic Bank Tanzania',
  DTB: 'Diamond Trust Bank', EXIM: 'Exim Bank Tanzania',
  CITIBANK: 'Citibank Tanzania', AZANIA: 'Azania Bank',
  PBZ: "People's Bank of Zanzibar",
};

function sumFilter<T>(arr: T[], filter: (r: T) => boolean, val: (r: T) => number): number {
  return arr.filter(filter).reduce((s, r) => {
    const v = val(r);
    const n = typeof v === 'number' && !Number.isNaN(v) ? v : 0;
    return s + n;
  }, 0);
}
function pct(a: number, b: number, dp = 1) {
  return b > 0 ? parseFloat(((a / b) * 100).toFixed(dp)) : 0;
}

// ── Assets ─────────────────────────────────────────────────────────────────
export function getBankTotalAssets(bank: string, year: number) {
  return sumFilter(assets, r => r.Bank === bank && r.Year === year, r => r.Amount);
}
export function getSectorTotalAssets(year: number) {
  return sumFilter(assets, r => r.Year === year, r => r.Amount);
}
export function getSectorAssetsTrend() {
  return YEARS.map(year => ({ year, total: getSectorTotalAssets(year) }));
}
export function getAllBanksAssetsTrend() {
  return YEARS.map(year => {
    const row: Record<string, number | string> = { year };
    BANKS.forEach(b => { row[b] = getBankTotalAssets(b, year); });
    return row;
  });
}
export function getMarketShare(year: number) {
  const total = getSectorTotalAssets(year);
  return BANKS.map(bank => ({
    bank, assets: getBankTotalAssets(bank, year),
    share: pct(getBankTotalAssets(bank, year), total),
  })).sort((a, b) => b.assets - a.assets);
}
export function getAssetComposition(year: number) {
  const map = Object.fromEntries(
    glMapping.filter(g => g.SubClassID.startsWith('A')).map(g => [g.SubClassID, g.Subclass])
  );
  const agg: Record<string, number> = {};
  assets.filter(r => r.Year === year).forEach(r => {
    const name = map[r.ClassID] || r.ClassID;
    agg[name] = (agg[name] || 0) + r.Amount;
  });
  return Object.entries(agg).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value).slice(0, 8);
}

// ── Liabilities ────────────────────────────────────────────────────────────
export function getBankTotalDeposits(bank: string, year: number) {
  return sumFilter(liabilities, r => r.Bank === bank && r.Year === year && r.ClassID === 'L2', r => r.Amount);
}
export function getSectorTotalDeposits(year: number) {
  return sumFilter(liabilities, r => r.Year === year && r.ClassID === 'L2', r => r.Amount);
}
export function getLiabilityComposition(year: number) {
  const map = Object.fromEntries(
    glMapping.filter(g => g.SubClassID.startsWith('L')).map(g => [g.SubClassID, g.Subclass])
  );
  const agg: Record<string, number> = {};
  liabilities.filter(r => r.Year === year).forEach(r => {
    const name = map[r.ClassID] || r.ClassID;
    agg[name] = (agg[name] || 0) + r.Amount;
  });
  return Object.entries(agg).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value).slice(0, 8);
}

// ── Loans ──────────────────────────────────────────────────────────────────
export function getBankLoans(bank: string, year: number) {
  return sumFilter(assets, r => r.Bank === bank && r.Year === year && r.ClassID === 'A11', r => r.Amount);
}
export function getSectorLoans(year: number) {
  return sumFilter(assets, r => r.Year === year && r.ClassID === 'A11', r => r.Amount);
}

// ── P&L ────────────────────────────────────────────────────────────────────
function getPnLVal(bank: string, year: number, classId: string) {
  return sumFilter(pnl, r => r.Bank === bank && r['Financial Year'] === year && r.ClassID === classId, r => r['Interest Income']);
}

export function getBankPnLSummary(bank: string, year: number) {
  const interestIncome = getPnLVal(bank, year, 'PL1');
  const interestExpense = getPnLVal(bank, year, 'PL2');
  const fxProfit = getPnLVal(bank, year, 'PL5');
  const feeIncome = getPnLVal(bank, year, 'PL6');
  const dividendIncome = getPnLVal(bank, year, 'PL7');
  const otherIncome = getPnLVal(bank, year, 'PL8');
  const badDebts = getPnLVal(bank, year, 'PL3');
  const impairment = getPnLVal(bank, year, 'PL4');
  const salaries = getPnLVal(bank, year, 'PL9');
  const feesExp = getPnLVal(bank, year, 'PL10');
  const otherOpex = getPnLVal(bank, year, 'PL11');
  const provisions = getPnLVal(bank, year, 'PL12');
  const tax = getPnLVal(bank, year, 'OT7');

  // Expenses (PL2, PL3, PL4, PL9–PL12, OT7) are stored as negatives in the source
  // so we ADD them rather than subtract
  const nii = interestIncome + interestExpense;
  const nonInterestIncome = fxProfit + feeIncome + dividendIncome + otherIncome;
  const totalIncome = nii + nonInterestIncome;
  const totalOpex = salaries + feesExp + otherOpex;          // all negative
  const creditCosts = badDebts + impairment + provisions;    // all negative
  const pbt = totalIncome + totalOpex + creditCosts;
  const pat = pbt + tax;                                     // tax negative
  const totalAssets = getBankTotalAssets(bank, year);
  const totalLoans = getBankLoans(bank, year);

  return {
    interestIncome, interestExpense, nii, fxProfit, feeIncome, dividendIncome,
    otherIncome, nonInterestIncome, totalIncome, salaries, feesExp, otherOpex,
    totalOpex, badDebts, impairment, provisions, creditCosts, tax, pbt, pat,
    roa: parseFloat(pct(pat, totalAssets, 2).toFixed(2)),
    nim: parseFloat(pct(nii, totalLoans, 2).toFixed(2)),
    costToIncome: parseFloat(pct(totalOpex, totalIncome, 1).toFixed(1)),
  };
}

export function getSectorPnLByYear() {
  return YEARS.map(year => {
    const t = BANKS.reduce(
      (acc, bank) => {
        const b = getBankPnLSummary(bank, year);
        return {
          nii: acc.nii + b.nii, feeIncome: acc.feeIncome + b.feeIncome,
          fxProfit: acc.fxProfit + b.fxProfit, otherIncome: acc.otherIncome + b.otherIncome,
          totalOpex: acc.totalOpex + b.totalOpex, creditCosts: acc.creditCosts + b.creditCosts,
          pat: acc.pat + b.pat, totalIncome: acc.totalIncome + b.totalIncome,
        };
      },
      { nii: 0, feeIncome: 0, fxProfit: 0, otherIncome: 0, totalOpex: 0, creditCosts: 0, pat: 0, totalIncome: 0 }
    );
    return { year, ...t };
  });
}

export function getBanksPnLComparison(year: number) {
  return BANKS.map(bank => {
    const s = getBankPnLSummary(bank, year);
    return { bank, nii: s.nii, feeIncome: s.feeIncome, totalOpex: s.totalOpex, pat: s.pat, roa: s.roa, nim: s.nim, costToIncome: s.costToIncome };
  }).sort((a, b) => b.pat - a.pat);
}

// ── NPL / Risk ─────────────────────────────────────────────────────────────
export function getBankNPL(bank: string, year: number) {
  return sumFilter(otherItems, r => r.Bank === bank && r.Year === year && r.SubClassID === 'OT1', r => r.Amount);
}
export function getBankProvisions(bank: string, year: number) {
  return sumFilter(otherItems, r => r.Bank === bank && r.Year === year && r.SubClassID === 'OT2', r => r.Amount);
}
export function getBankContingent(bank: string, year: number) {
  return sumFilter(otherItems, r => r.Bank === bank && r.Year === year && r.SubClassID === 'OT3', r => r.Amount);
}
export function getNPLRatio(bank: string, year: number) {
  return parseFloat(pct(getBankNPL(bank, year), getBankLoans(bank, year), 2).toFixed(2));
}
export function getProvisionCoverage(bank: string, year: number) {
  const npl = getBankNPL(bank, year);
  return parseFloat(pct(getBankProvisions(bank, year), npl, 1).toFixed(1));
}
export function getNPLData(year: number) {
  return BANKS.map(bank => ({
    bank, npl: getBankNPL(bank, year), loans: getBankLoans(bank, year),
    provisions: getBankProvisions(bank, year), nplRatio: getNPLRatio(bank, year),
    coverage: getProvisionCoverage(bank, year),
  })).sort((a, b) => b.nplRatio - a.nplRatio);
}
export function getNPLTrend() {
  return YEARS.map(year => {
    const row: Record<string, number | string> = { year };
    BANKS.forEach(b => { row[b] = getNPLRatio(b, year); });
    return row;
  });
}

// ── Macro ──────────────────────────────────────────────────────────────────
export function getMacroValue(metricId: string, year: number): number | null {
  return macroRaw.find(r => r.MetricID === metricId && r.Year === year)?.Amount ?? null;
}
export function getMacroSeries(metricId: string) {
  const metric = macroMapping.find(m => m.MetricID === metricId);
  return {
    name: metric?.Metric ?? metricId,
    data: YEARS.map(year => ({ year, value: getMacroValue(metricId, year) })),
  };
}
export function getAllMacroSeries() {
  return macroMapping.map(m => ({ id: m.MetricID, name: m.Metric, data: getMacroSeries(m.MetricID).data }));
}

// ── Bank Summary Table ─────────────────────────────────────────────────────
export function getBankSummary(bank: string, year: number) {
  const totalAssets = getBankTotalAssets(bank, year);
  const prevAssets = getBankTotalAssets(bank, year - 1);
  const sectorTotal = getSectorTotalAssets(year);
  const loans = getBankLoans(bank, year);
  const deposits = getBankTotalDeposits(bank, year);
  const p = getBankPnLSummary(bank, year);
  return {
    bank, fullName: BANK_FULL_NAMES[bank] ?? bank, color: BANK_COLORS[bank] ?? '#888',
    totalAssets, marketShare: pct(totalAssets, sectorTotal),
    loans, deposits, ldRatio: pct(loans, deposits),
    nplRatio: getNPLRatio(bank, year),
    yoyGrowth: prevAssets > 0 ? parseFloat((((totalAssets - prevAssets) / prevAssets) * 100).toFixed(1)) : 0,
    roa: p.roa, nim: p.nim, costToIncome: p.costToIncome, netIncome: p.pat,
  };
}
export function getAllBankSummaries(year: number) {
  return BANKS.map(b => getBankSummary(b, year)).sort((a, b) => b.totalAssets - a.totalAssets);
}

// ── Formatting ─────────────────────────────────────────────────────────────
export function fmtTZS(val: number): string {
  if (val == null || Number.isNaN(val)) return 'TZS —';
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}TZS ${(abs / 1_000_000).toFixed(1)}T`;
  if (abs >= 1_000) return `${sign}TZS ${(abs / 1_000).toFixed(1)}B`;
  return `${sign}TZS ${abs.toFixed(0)}M`;
}
export function fmtNum(val: number): string {
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}T`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}B`;
  return `${sign}${abs.toFixed(0)}M`;
}
export function fmtPct(val: number, showSign = false): string {
  const sign = showSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
}
