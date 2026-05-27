'use client';
import { useMemo } from 'react';
import { useYear, useBanks } from '@/lib/context';
import {
  getSectorTotalAssets, getSectorTotalDeposits, getSectorLoans,
  getSectorAssetsTrend, getMarketShare, getAllMacroSeries,
  getBankTotalAssets, getBankTotalDeposits, getBankLoans,
  fmtTZS, fmtPct, fmtNum, BANK_COLORS, BANKS, Bank,
} from '@/lib/data';
import KPICard from '@/components/cards/KPICard';
import TrendAreaChart from '@/components/charts/TrendAreaChart';
import DonutChart from '@/components/charts/DonutChart';
import HorizBarChart from '@/components/charts/HorizBarChart';
import MultiLineChart from '@/components/charts/MultiLineChart';
import {
  IconBuildingBank, IconPigMoney, IconCreditCard,
  IconAlertTriangle, IconTrendingUp, IconCurrencyDollar,
} from '@tabler/icons-react';

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--bs-text)' }}>{children}</h2>
      {sub && <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--bs-muted)' }}>{sub}</p>}
    </div>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="bs-card" style={{ padding: 20, ...style }}>{children}</div>;
}

export default function OverviewPage() {
  const { year } = useYear();
  const { selectedBanks } = useBanks();

  // Filtered totals based on selected banks
  const totalAssets = useMemo(() =>
    selectedBanks.reduce((s, b) => s + getBankTotalAssets(b, year), 0), [year, selectedBanks]);
  const prevAssets  = useMemo(() =>
    selectedBanks.reduce((s, b) => s + getBankTotalAssets(b, year - 1), 0), [year, selectedBanks]);
  const deposits    = useMemo(() =>
    selectedBanks.reduce((s, b) => s + getBankTotalDeposits(b, year), 0), [year, selectedBanks]);
  const prevDep     = useMemo(() =>
    selectedBanks.reduce((s, b) => s + getBankTotalDeposits(b, year - 1), 0), [year, selectedBanks]);
  const loans       = useMemo(() =>
    selectedBanks.reduce((s, b) => s + getBankLoans(b, year), 0), [year, selectedBanks]);
  const prevLoans   = useMemo(() =>
    selectedBanks.reduce((s, b) => s + getBankLoans(b, year - 1), 0), [year, selectedBanks]);

  const assetsTrend = useMemo(() => {
    return [2017,2018,2019,2020,2021,2022,2023,2024].map(y => ({
      year: y, total: selectedBanks.reduce((s, b) => s + getBankTotalAssets(b, y), 0),
    }));
  }, [selectedBanks]);

  const marketShare = useMemo(() => {
    const filtered = getMarketShare(year).filter(b => selectedBanks.includes(b.bank as Bank));
    const total = filtered.reduce((s, b) => s + b.assets, 0);
    return filtered.map(b => ({ ...b, share: total > 0 ? parseFloat(((b.assets / total) * 100).toFixed(1)) : 0 }));
  }, [year, selectedBanks]);

  const macro       = useMemo(() => getAllMacroSeries(), []);
  const topBanks    = useMemo(() => marketShare.map(b => ({
    name: b.bank, value: b.assets, color: BANK_COLORS[b.bank],
  })), [marketShare]);

  const assetGrowth  = prevAssets  > 0 ? ((totalAssets - prevAssets)  / prevAssets)  * 100 : 0;
  const depGrowth    = prevDep     > 0 ? ((deposits    - prevDep)     / prevDep)     * 100 : 0;
  const loansGrowth  = prevLoans   > 0 ? ((loans       - prevLoans)   / prevLoans)   * 100 : 0;

  const gdpSeries  = macro.find(m => m.id === 'M1');
  const exSeries   = macro.find(m => m.id === 'M6');
  const lendSeries = macro.find(m => m.id === 'M5');
  const depSeries  = macro.find(m => m.id === 'M10');
  const infSeries  = macro.find(m => m.id === 'M3');

  const gdpLatest   = gdpSeries?.data.find(d => d.year === year)?.value;
  const exLatest    = exSeries?.data.find(d => d.year === year)?.value;
  const lendLatest  = lendSeries?.data.find(d => d.year === year)?.value;
  const infLatest   = infSeries?.data.find(d => d.year === year)?.value;

  const donutData = marketShare.map(b => ({ name: b.bank, value: b.assets, color: BANK_COLORS[b.bank] }));
  const donutColors = marketShare.map(b => BANK_COLORS[b.bank]);

  const rateData = (lendSeries && depSeries)
    ? lendSeries.data.map((d, i) => ({ year: d.year, 'Lending Rate': d.value, 'Deposit Rate': depSeries.data[i]?.value }))
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI Row */}
      <div className="rg-kpi">
        <KPICard title="Total Sector Assets" value={fmtTZS(totalAssets)} sub={`vs ${year - 1}`} change={assetGrowth} icon={<IconBuildingBank size={15} />} accent="amber" />
        <KPICard title="Customer Deposits"  value={fmtTZS(deposits)}    sub={`vs ${year - 1}`} change={depGrowth}   icon={<IconPigMoney size={15} />}    accent="teal" />
        <KPICard title="Total Loans"        value={fmtTZS(loans)}       sub={`vs ${year - 1}`} change={loansGrowth} icon={<IconCreditCard size={15} />}   accent="teal" />
        <KPICard title="No. of Banks"       value="10"                   sub="Active institutions"                  icon={<IconBuildingBank size={15} />}  accent="amber" />
        {lendLatest != null && <KPICard title="Lending Rate" value={`${lendLatest?.toFixed(1)}%`} sub={`${year}`} icon={<IconCurrencyDollar size={15} />} accent="amber" />}
        {infLatest  != null && <KPICard title="Headline Inflation" value={`${infLatest?.toFixed(1)}%`} sub={`${year}`} icon={<IconAlertTriangle size={15} />} accent="red" />}
      </div>

      {/* Sector Trend + Market Share */}
      <div className="rg-2-1">
        <Card>
          <SectionTitle sub="Total sector assets (TZS Millions)">Sector Asset Growth</SectionTitle>
          <TrendAreaChart
            data={assetsTrend}
            series={[{ key: 'total', color: 'var(--bs-amber)', label: 'Total Assets' }]}
            height={220}
            yTickFmt={v => fmtNum(v)}
            tooltipFmt={v => fmtTZS(v)}
          />
        </Card>
        <Card>
          <SectionTitle sub={`Market share by assets · ${year}`}>Market Share</SectionTitle>
          <DonutChart data={donutData} colors={donutColors} height={260} fmt={v => fmtTZS(v)} />
        </Card>
      </div>

      {/* Banks Ranking + Macro */}
      <div className="rg-2">
        <Card>
          <SectionTitle sub={`Ranked by total assets · ${year}`}>Top Banks by Assets</SectionTitle>
          <HorizBarChart data={topBanks} fmt={v => fmtTZS(v)} label="Assets" height={300} />
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Macro mini cards */}
          <div className="rg-2" style={{ gap: 12 }}>
            {[
              { label: 'GDP Growth',      val: gdpLatest,  unit: '%', accent: '#10B981' },
              { label: 'Exchange Rate',   val: exLatest,   unit: ' TZS/USD', accent: '#F59E0B' },
            ].map(item => (
              <div key={item.label} className="bs-card" style={{ padding: '14px 16px' }}>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--bs-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                <p className="num" style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 700, color: item.accent, lineHeight: 1 }}>
                  {item.val != null ? `${item.val?.toFixed(1)}${item.unit}` : 'N/A'}
                </p>
              </div>
            ))}
          </div>

          {/* Interest rate spread */}
          <Card style={{ flex: 1 }}>
            <SectionTitle sub="Lending vs deposit rates (%)">Interest Rate Corridor</SectionTitle>
            {rateData.length > 0 && (
              <MultiLineChart
                data={rateData}
                series={[
                  { key: 'Lending Rate', color: 'var(--bs-amber)', label: 'Lending Rate' },
                  { key: 'Deposit Rate', color: 'var(--bs-teal)',  label: 'Deposit Rate', dashed: true },
                ]}
                height={140}
                tooltipFmt={v => `${v?.toFixed(1)}%`}
              />
            )}
          </Card>
        </div>
      </div>

      {/* GDP Growth trend */}
      {gdpSeries && (
        <Card>
          <SectionTitle sub="Annual real GDP growth rate (%)">Tanzania GDP Growth</SectionTitle>
          <MultiLineChart
            data={gdpSeries.data.map(d => ({ year: d.year, 'GDP Growth': d.value }))}
            series={[{ key: 'GDP Growth', color: '#10B981' }]}
            height={160}
            tooltipFmt={v => `${v?.toFixed(1)}%`}
          />
        </Card>
      )}
    </div>
  );
}
