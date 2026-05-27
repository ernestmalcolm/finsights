'use client';
import { useMemo } from 'react';
import { useYear } from '@/lib/context';
import { getAllMacroSeries, getMacroValue } from '@/lib/data';
import MultiLineChart from '@/components/charts/MultiLineChart';
import TrendAreaChart from '@/components/charts/TrendAreaChart';
import KPICard from '@/components/cards/KPICard';
import { IconTrendingUp, IconCurrencyDollar, IconPercentage, IconWorld } from '@tabler/icons-react';

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

export default function MacroPage() {
  const { year } = useYear();
  const all = useMemo(() => getAllMacroSeries(), []);

  const byId = Object.fromEntries(all.map(m => [m.id, m]));

  const gdpGrowth  = getMacroValue('M1', year);
  const inflation  = getMacroValue('M3', year);
  const fxRate     = getMacroValue('M6', year);
  const lendRate   = getMacroValue('M5', year);
  const depRate    = getMacroValue('M10', year);
  const cbr        = getMacroValue('M8', year);
  const totalGDP   = getMacroValue('M9', year);
  const popGrowth  = getMacroValue('M7', year);

  const gdpData    = byId['M1']?.data.map(d => ({ year: d.year, 'GDP Growth': d.value })) ?? [];
  const inflData   = byId['M3'] && byId['M2']
    ? byId['M3'].data.map((d, i) => ({ year: d.year, 'Headline': d.value, 'Core': byId['M2'].data[i]?.value }))
    : [];
  const fxData     = byId['M6']?.data.map(d => ({ year: d.year, 'TZS/USD': d.value ?? 0 })) ?? [];
  const totalGDPD  = byId['M9']?.data.map(d => ({ year: d.year, 'Total GDP': d.value ?? 0 })) ?? [];
  const rateData   = byId['M5'] && byId['M10'] && byId['M8']
    ? byId['M5'].data.map((d, i) => ({
        year: d.year,
        'Lending': d.value,
        'Deposit': byId['M10'].data[i]?.value,
        'CBR':     byId['M8'].data[i]?.value,
      }))
    : [];

  const spread = (lendRate != null && depRate != null) ? lendRate - depRate : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI strip */}
      <div className="rg-kpi-sm">
        {gdpGrowth   != null && <KPICard title="GDP Growth"      value={`${gdpGrowth.toFixed(1)}%`}   sub={`${year}`} icon={<IconTrendingUp size={15}/>}    accent="teal" />}
        {inflation   != null && <KPICard title="Inflation"       value={`${inflation.toFixed(1)}%`}   sub={`${year}`} icon={<IconPercentage size={15}/>}   accent="red" />}
        {fxRate      != null && <KPICard title="Exchange Rate"   value={`${fxRate?.toFixed(0)} TZS`}  sub="/USD"      icon={<IconCurrencyDollar size={15}/>} accent="amber" />}
        {lendRate    != null && <KPICard title="Lending Rate"    value={`${lendRate.toFixed(1)}%`}    sub={`${year}`} icon={<IconPercentage size={15}/>}   accent="amber" />}
        {cbr         != null && <KPICard title="Central Bank Rate" value={`${cbr.toFixed(1)}%`}       sub={`${year}`} icon={<IconWorld size={15}/>}         accent="teal" />}
        {spread      != null && <KPICard title="Rate Spread"     value={`${spread.toFixed(1)}%`}      sub="Lending − Deposit" icon={<IconPercentage size={15}/>} accent="amber" />}
        {totalGDP    != null && <KPICard title="Total GDP"       value={`$${totalGDP.toFixed(1)}B`}   sub={`${year}`} icon={<IconWorld size={15}/>}         accent="teal" />}
        {popGrowth   != null && <KPICard title="Population Growth" value={`${popGrowth.toFixed(1)}%`} sub={`${year}`} icon={<IconTrendingUp size={15}/>}    accent="teal" />}
      </div>

      {/* GDP Growth + Total GDP */}
      <div className="rg-2">
        <Card>
          <SectionTitle sub="Real GDP growth rate (%)">GDP Growth Rate</SectionTitle>
          <MultiLineChart
            data={gdpData}
            series={[{ key: 'GDP Growth', color: '#10B981', label: 'GDP Growth %' }]}
            height={200}
            tooltipFmt={v => `${v?.toFixed(1)}%`}
          />
        </Card>
        <Card>
          <SectionTitle sub="Total GDP (USD Billions)">Total GDP</SectionTitle>
          <TrendAreaChart
            data={totalGDPD}
            series={[{ key: 'Total GDP', color: '#0EA5E9', label: 'GDP (USD B)' }]}
            height={200}
            tooltipFmt={v => `$${v?.toFixed(1)}B`}
          />
        </Card>
      </div>

      {/* Inflation */}
      {inflData.length > 0 && (
        <Card>
          <SectionTitle sub="Headline vs core inflation (%)">Inflation Trends</SectionTitle>
          <MultiLineChart
            data={inflData}
            series={[
              { key: 'Headline', color: '#EF4444', label: 'Headline Inflation' },
              { key: 'Core',     color: '#F97316', label: 'Core Inflation', dashed: true },
            ]}
            height={220}
            tooltipFmt={v => `${v?.toFixed(1)}%`}
          />
        </Card>
      )}

      {/* Exchange rate */}
      {fxData.length > 0 && (
        <Card>
          <SectionTitle sub="Tanzanian Shilling vs US Dollar">Exchange Rate (TZS/USD)</SectionTitle>
          <TrendAreaChart
            data={fxData}
            series={[{ key: 'TZS/USD', color: '#F59E0B', label: 'TZS per USD' }]}
            height={200}
            yTickFmt={v => v.toLocaleString()}
            tooltipFmt={v => `TZS ${v?.toLocaleString()}`}
          />
        </Card>
      )}

      {/* Interest rate corridor */}
      {rateData.length > 0 && (
        <Card>
          <SectionTitle sub="Lending, deposit and central bank rates (%)">Interest Rate Corridor</SectionTitle>
          <MultiLineChart
            data={rateData}
            series={[
              { key: 'Lending', color: '#F59E0B', label: 'Lending Rate' },
              { key: 'Deposit', color: '#0EA5E9', label: 'Deposit Rate', dashed: true },
              { key: 'CBR',     color: '#10B981', label: 'Central Bank Rate', dashed: true },
            ]}
            height={220}
            tooltipFmt={v => `${v?.toFixed(1)}%`}
          />
        </Card>
      )}
    </div>
  );
}
