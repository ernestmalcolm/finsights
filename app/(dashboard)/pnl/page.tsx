'use client';
import { useMemo } from 'react';
import { useYear, useBanks } from '@/lib/context';
import {
  getSectorPnLByYear, getBanksPnLComparison, getAllBankSummaries,
  getBankPnLSummary, YEARS,
  fmtTZS, fmtNum, BANK_COLORS, Bank,
} from '@/lib/data';
import StackedBarChart from '@/components/charts/StackedBarChart';
import HorizBarChart from '@/components/charts/HorizBarChart';
import MultiLineChart from '@/components/charts/MultiLineChart';
import KPICard from '@/components/cards/KPICard';
import { IconTrendingUp, IconTrendingDown, IconCurrencyDollar, IconPercentage } from '@tabler/icons-react';

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

export default function PnLPage() {
  const { year } = useYear();
  const { selectedBanks } = useBanks();

  const sectorByYear = useMemo(() =>
    YEARS.map(y => {
      const t = selectedBanks.reduce(
        (acc, bank) => {
          const b = getBankPnLSummary(bank, y);
          return {
            nii:         acc.nii         + b.nii,
            feeIncome:   acc.feeIncome   + b.feeIncome,
            fxProfit:    acc.fxProfit    + b.fxProfit,
            otherIncome: acc.otherIncome + b.otherIncome,
            totalOpex:   acc.totalOpex   + b.totalOpex,
            creditCosts: acc.creditCosts + b.creditCosts,
            pat:         acc.pat         + b.pat,
            totalIncome: acc.totalIncome + b.totalIncome,
          };
        },
        { nii: 0, feeIncome: 0, fxProfit: 0, otherIncome: 0, totalOpex: 0, creditCosts: 0, pat: 0, totalIncome: 0 }
      );
      return { year: y, ...t };
    }),
    [selectedBanks]
  );
  const bankComp  = useMemo(() =>
    getBanksPnLComparison(year).filter(b => selectedBanks.includes(b.bank as Bank)),
    [year, selectedBanks]
  );
  const summaries = useMemo(() =>
    getAllBankSummaries(year).filter(b => selectedBanks.includes(b.bank as Bank)),
    [year, selectedBanks]
  );

  const latestSector = sectorByYear.find(d => d.year === year);
  const prevSector   = sectorByYear.find(d => d.year === year - 1);

  const patGrowth = prevSector && prevSector.pat > 0
    ? ((latestSector!.pat - prevSector.pat) / prevSector.pat) * 100 : 0;
  const incomeGrowth = prevSector && prevSector.totalIncome > 0
    ? ((latestSector!.totalIncome - prevSector.totalIncome) / prevSector.totalIncome) * 100 : 0;

  const netIncomeData = bankComp.map(b => ({ name: b.bank, value: b.pat, color: b.pat > 0 ? BANK_COLORS[b.bank] : 'var(--bs-red)' }));
  const roaData       = summaries.sort((a,b) => b.roa - a.roa).map(b => ({ name: b.bank, value: b.roa, color: BANK_COLORS[b.bank] }));
  const nimData       = summaries.sort((a,b) => b.nim - a.nim).map(b => ({ name: b.bank, value: b.nim, color: BANK_COLORS[b.bank] }));
  const costData      = summaries.sort((a,b) => a.costToIncome - b.costToIncome).map(b => ({ name: b.bank, value: b.costToIncome, color: BANK_COLORS[b.bank] }));

  const nimTrend = summaries.slice(0, 5).map(b => b.bank);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI row */}
      {latestSector && (
        <div className="rg-kpi">
          <KPICard title="Sector Net Income" value={fmtTZS(latestSector.pat)} change={patGrowth} sub={`vs ${year-1}`} icon={<IconTrendingUp size={15}/>} accent="green" />
          <KPICard title="Total Income" value={fmtTZS(latestSector.totalIncome)} change={incomeGrowth} sub={`vs ${year-1}`} icon={<IconCurrencyDollar size={15}/>} accent="amber" />
          <KPICard title="Net Interest Income" value={fmtTZS(latestSector.nii)} sub={`${year}`} icon={<IconPercentage size={15}/>} accent="teal" />
          <KPICard title="Total Operating Costs" value={fmtTZS(latestSector.totalOpex)} sub={`${year}`} icon={<IconTrendingDown size={15}/>} accent="red" />
        </div>
      )}

      {/* Sector income breakdown by year */}
      <Card>
        <SectionTitle sub="Sector-wide revenue composition over time (TZS M)">Revenue Breakdown</SectionTitle>
        <StackedBarChart
          data={sectorByYear}
          series={[
            { key: 'nii',         color: '#F59E0B', label: 'Net Interest Income' },
            { key: 'feeIncome',   color: '#0EA5E9', label: 'Fee Income' },
            { key: 'fxProfit',    color: '#10B981', label: 'FX Profit' },
            { key: 'otherIncome', color: '#8B5CF6', label: 'Other Income' },
          ]}
          height={240}
          yTickFmt={v => fmtNum(v)}
          tooltipFmt={v => fmtTZS(v)}
        />
      </Card>

      {/* Bank profitability metrics */}
      <div className="rg-2">
        <Card>
          <SectionTitle sub={`Net income by bank · ${year}`}>Net Income Ranking</SectionTitle>
          <HorizBarChart data={netIncomeData} fmt={v => fmtTZS(v)} label="Net Income" height={280} />
        </Card>
        <Card>
          <SectionTitle sub={`Return on assets · ${year}`}>ROA (%)</SectionTitle>
          <HorizBarChart data={roaData} fmt={v => `${v.toFixed(2)}%`} label="ROA" height={280} />
        </Card>
      </div>

      <div className="rg-2">
        <Card>
          <SectionTitle sub={`Net interest margin · ${year}`}>Net Interest Margin (%)</SectionTitle>
          <HorizBarChart data={nimData} fmt={v => `${v.toFixed(2)}%`} label="NIM" height={280} />
        </Card>
        <Card>
          <SectionTitle sub={`Opex / total income · ${year} (lower is better)`}>Cost/Income Ratio (%)</SectionTitle>
          <HorizBarChart data={costData} fmt={v => `${v.toFixed(0)}%`} label="Cost/Income" height={280} />
        </Card>
      </div>
    </div>
  );
}
