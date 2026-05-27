'use client';
import { useMemo } from 'react';
import { useYear, useBanks } from '@/lib/context';
import {
  getAssetComposition, getLiabilityComposition, getAllBankSummaries,
  getSectorTotalDeposits, getSectorLoans, getBankLoans, getBankTotalDeposits,
  fmtTZS, fmtNum, BANK_COLORS, YEARS, Bank,
} from '@/lib/data';
import DonutChart from '@/components/charts/DonutChart';
import HorizBarChart from '@/components/charts/HorizBarChart';
import TrendAreaChart from '@/components/charts/TrendAreaChart';

const ASSET_COLORS = ['#F59E0B','#0EA5E9','#10B981','#8B5CF6','#F97316','#EC4899','#14B8A6','#6366F1'];
const LIAB_COLORS  = ['#0EA5E9','#F59E0B','#10B981','#8B5CF6','#F97316','#EC4899','#14B8A6','#6366F1'];

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="bs-card" style={{ padding: 20, ...style }}>{children}</div>;
}
function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--bs-text)' }}>{children}</h2>
      {sub && <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--bs-muted)' }}>{sub}</p>}
    </div>
  );
}

export default function BalanceSheetPage() {
  const { year } = useYear();
  const { selectedBanks } = useBanks();

  const assetComp = useMemo(() => getAssetComposition(year), [year]);
  const liabComp  = useMemo(() => getLiabilityComposition(year), [year]);
  const banks     = useMemo(() =>
    getAllBankSummaries(year).filter(b => selectedBanks.includes(b.bank as Bank)),
    [year, selectedBanks]
  );

  const ldData   = banks.map(b => ({ name: b.bank, value: b.ldRatio,   color: BANK_COLORS[b.bank] }));
  const loanData = banks.map(b => ({ name: b.bank, value: b.loans,     color: BANK_COLORS[b.bank] }));
  const depData  = banks.map(b => ({ name: b.bank, value: b.deposits,  color: BANK_COLORS[b.bank] }));

  const sectorTrend = YEARS.map(y => ({
    year: y,
    Loans:    selectedBanks.reduce((s, b) => s + getBankLoans(b, y), 0),
    Deposits: selectedBanks.reduce((s, b) => s + getBankTotalDeposits(b, y), 0),
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Asset and Liab composition */}
      <div className="rg-2">
        <Card>
          <SectionTitle sub={`Sector asset breakdown · ${year}`}>Asset Composition</SectionTitle>
          <DonutChart data={assetComp} colors={ASSET_COLORS} height={280} fmt={v => fmtTZS(v)} />
        </Card>
        <Card>
          <SectionTitle sub={`Sector liability breakdown · ${year}`}>Liability Composition</SectionTitle>
          <DonutChart data={liabComp} colors={LIAB_COLORS} height={280} fmt={v => fmtTZS(v)} />
        </Card>
      </div>

      {/* Loans vs Deposits trend */}
      <Card>
        <SectionTitle sub="Sector-wide loans vs customer deposits trend">Loans vs Deposits Growth</SectionTitle>
        <TrendAreaChart
          data={sectorTrend}
          series={[
            { key: 'Loans',    color: '#F59E0B', label: 'Total Loans' },
            { key: 'Deposits', color: '#0EA5E9', label: 'Customer Deposits' },
          ]}
          height={220}
          yTickFmt={v => fmtNum(v)}
          tooltipFmt={v => fmtTZS(v)}
        />
      </Card>

      {/* L/D ratio + loans + deposits by bank */}
      <div className="rg-3">
        <Card>
          <SectionTitle sub={`${year}`}>Loans/Deposits Ratio</SectionTitle>
          <HorizBarChart data={ldData} fmt={v => `${v.toFixed(0)}%`} label="L/D Ratio" height={280} />
        </Card>
        <Card>
          <SectionTitle sub={`${year}`}>Loans by Bank</SectionTitle>
          <HorizBarChart data={loanData} fmt={v => fmtTZS(v)} label="Loans" height={280} />
        </Card>
        <Card>
          <SectionTitle sub={`${year}`}>Deposits by Bank</SectionTitle>
          <HorizBarChart data={depData} fmt={v => fmtTZS(v)} label="Deposits" height={280} />
        </Card>
      </div>
    </div>
  );
}
