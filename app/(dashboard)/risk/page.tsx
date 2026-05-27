'use client';
import { useMemo } from 'react';
import { useYear, useBanks } from '@/lib/context';
import {
  getNPLData, getNPLTrend, getAllBankSummaries,
  BANK_COLORS, BANKS, fmtTZS, fmtNum, Bank,
} from '@/lib/data';
import HorizBarChart from '@/components/charts/HorizBarChart';
import MultiLineChart from '@/components/charts/MultiLineChart';
import KPICard from '@/components/cards/KPICard';
import { IconAlertTriangle, IconShield, IconPercentage } from '@tabler/icons-react';

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

function RiskBadge({ val }: { val: number }) {
  const color = val > 10 ? 'var(--bs-red)' : val > 5 ? 'var(--bs-amber)' : 'var(--bs-green)';
  const label = val > 10 ? 'High' : val > 5 ? 'Medium' : 'Low';
  return (
    <span style={{
      padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600,
      background: `${color}22`, color, border: `1px solid ${color}44`,
    }}>{label}</span>
  );
}

export default function RiskPage() {
  const { year } = useYear();
  const { selectedBanks } = useBanks();

  const nplData   = useMemo(() =>
    getNPLData(year).filter(d => selectedBanks.includes(d.bank as Bank)),
    [year, selectedBanks]
  );
  const nplTrend  = useMemo(() => getNPLTrend(), []);
  const summaries = useMemo(() =>
    getAllBankSummaries(year).filter(b => selectedBanks.includes(b.bank as Bank)),
    [year, selectedBanks]
  );

  const avgNPL  = nplData.reduce((s, d) => s + d.nplRatio, 0) / nplData.length;
  const maxNPL  = Math.max(...nplData.map(d => d.nplRatio));
  const avgCov  = nplData.filter(d => d.coverage > 0).reduce((s, d) => s + d.coverage, 0) / nplData.filter(d => d.coverage > 0).length;

  const nplBarData  = nplData.map(d => ({
    name: d.bank, value: d.nplRatio,
    color: d.nplRatio > 10 ? '#EF4444' : d.nplRatio > 5 ? '#F59E0B' : '#10B981',
  }));
  const covBarData  = nplData.map(d => ({ name: d.bank, value: d.coverage, color: BANK_COLORS[d.bank] }));
  const nplAbsData  = nplData.map(d => ({ name: d.bank, value: d.npl, color: BANK_COLORS[d.bank] }));

  const topBankSeries = selectedBanks.slice(0, 6).map(b => ({ key: b, color: BANK_COLORS[b], label: b }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI row */}
      <div className="rg-kpi">
        <KPICard title="Avg Sector NPL Ratio" value={`${avgNPL.toFixed(1)}%`} sub={`${year}`} icon={<IconAlertTriangle size={15}/>} accent="red" />
        <KPICard title="Highest NPL (Single)"  value={`${maxNPL.toFixed(1)}%`} sub={nplData[0]?.bank}      icon={<IconAlertTriangle size={15}/>} accent="red" />
        <KPICard title="Avg Provision Coverage" value={isFinite(avgCov) ? `${avgCov.toFixed(0)}%` : 'N/A'} sub={`${year}`} icon={<IconShield size={15}/>}        accent="teal" />
        <KPICard title="Banks with NPL > 5%"   value={`${nplData.filter(d => d.nplRatio > 5).length}`}     sub="of 10 banks" icon={<IconPercentage size={15}/>}   accent="amber" />
      </div>

      {/* NPL Ratio + trend */}
      <div className="rg-2">
        <Card>
          <SectionTitle sub={`Non-performing loan ratio · ${year}`}>NPL Ratio by Bank</SectionTitle>
          <HorizBarChart data={nplBarData} fmt={v => `${v.toFixed(1)}%`} label="NPL Ratio" height={280} />
        </Card>
        <Card>
          <SectionTitle sub="NPL ratio trend (top 5 banks)">NPL Ratio Trend</SectionTitle>
          <MultiLineChart
            data={nplTrend}
            series={topBankSeries}
            height={280}
            tooltipFmt={v => `${v?.toFixed(1)}%`}
          />
        </Card>
      </div>

      {/* Provision coverage + NPL absolute */}
      <div className="rg-2">
        <Card>
          <SectionTitle sub={`Provisions ÷ NPLs · ${year}`}>Provision Coverage (%)</SectionTitle>
          <HorizBarChart data={covBarData} fmt={v => `${v.toFixed(0)}%`} label="Coverage" height={280} />
        </Card>
        <Card>
          <SectionTitle sub={`Absolute NPL book (TZS M) · ${year}`}>NPL Book Size</SectionTitle>
          <HorizBarChart data={nplAbsData} fmt={v => fmtTZS(v)} label="NPL Amount" height={280} />
        </Card>
      </div>

      {/* Detailed risk table */}
      <Card>
        <SectionTitle sub={`Full risk snapshot · ${year}`}>Risk Detail Table</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Bank', 'Total Loans', 'NPL Amount', 'NPL Ratio', 'Provisions', 'Coverage', 'Risk Level'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Bank' ? 'left' : 'right', padding: '8px 12px', color: 'var(--bs-muted)', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nplData.map((d, i) => (
                <tr key={d.bank} style={{ borderTop: '1px solid var(--bs-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: BANK_COLORS[d.bank] }} />
                      <span style={{ fontWeight: 600, color: 'var(--bs-text)' }}>{d.bank}</span>
                    </div>
                  </td>
                  {[
                    fmtTZS(d.loans),
                    fmtTZS(d.npl),
                    `${d.nplRatio.toFixed(1)}%`,
                    fmtTZS(d.provisions),
                    `${d.coverage.toFixed(0)}%`,
                  ].map((v, j) => (
                    <td key={j} className="num" style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, color: 'var(--bs-text)' }}>{v}</td>
                  ))}
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}><RiskBadge val={d.nplRatio} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
