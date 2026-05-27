'use client';
import { useMemo, useState } from 'react';
import { useYear, useBanks } from '@/lib/context';
import { getAllBankSummaries, getAllBanksAssetsTrend, BANK_COLORS, BANKS, fmtTZS, fmtNum } from '@/lib/data';
import TrendAreaChart from '@/components/charts/TrendAreaChart';
import HorizBarChart from '@/components/charts/HorizBarChart';

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

function DeltaBadge({ val }: { val: number }) {
  const color = val > 0 ? 'var(--bs-green)' : val < 0 ? 'var(--bs-red)' : 'var(--bs-muted)';
  return (
    <span className="num" style={{ fontSize: 12, color, fontWeight: 600 }}>
      {val > 0 ? '+' : ''}{val.toFixed(1)}%
    </span>
  );
}

const COLS = [
  { key: 'totalAssets', label: 'Total Assets', fmt: (v: number) => fmtTZS(v) },
  { key: 'marketShare', label: 'Mkt Share', fmt: (v: number) => `${v.toFixed(1)}%` },
  { key: 'loans', label: 'Loans', fmt: (v: number) => fmtTZS(v) },
  { key: 'deposits', label: 'Deposits', fmt: (v: number) => fmtTZS(v) },
  { key: 'ldRatio', label: 'L/D Ratio', fmt: (v: number) => `${v.toFixed(0)}%` },
  { key: 'nplRatio', label: 'NPL %', fmt: (v: number) => `${v.toFixed(1)}%` },
  { key: 'roa', label: 'ROA', fmt: (v: number) => `${v.toFixed(2)}%` },
  { key: 'nim', label: 'NIM', fmt: (v: number) => `${v.toFixed(2)}%` },
  { key: 'yoyGrowth', label: 'YoY', fmt: null },
];

export default function BanksPage() {
  const { year } = useYear();
  const { selectedBanks } = useBanks();
  const [sortKey, setSortKey] = useState('totalAssets');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const summaries = useMemo(() =>
    getAllBankSummaries(year).filter(b => selectedBanks.includes(b.bank as (typeof BANKS)[number])),
    [year, selectedBanks]
  );
  const trendData = useMemo(() => getAllBanksAssetsTrend(), []);
  const sorted = useMemo(() => {
    return [...summaries].sort((a, b) => {
      const va = a[sortKey as keyof typeof a] as number;
      const vb = b[sortKey as keyof typeof b] as number;
      return sortDir === 'desc' ? vb - va : va - vb;
    });
  }, [summaries, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const barData = sorted.map(b => ({ name: b.bank, value: b.totalAssets, color: BANK_COLORS[b.bank] }));

  const activeSeries = BANKS.filter(b => selectedBanks.includes(b)).map(b => ({
    key: b, color: BANK_COLORS[b], label: b,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Summary table */}
      <Card>
        <SectionTitle sub={`All 10 banks · ${year}`}>Bank Comparison</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--bs-muted)', fontWeight: 500, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Bank</th>
                {COLS.map(c => (
                  <th key={c.key}
                    onClick={() => handleSort(c.key)}
                    style={{ textAlign: 'right', padding: '8px 12px', color: sortKey === c.key ? 'var(--bs-amber)' : 'var(--bs-muted)', fontWeight: 500, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}>
                    {c.label} {sortKey === c.key ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((b, i) => (
                <tr key={b.bank} style={{ borderTop: '1px solid var(--bs-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: BANK_COLORS[b.bank], flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--bs-text)', fontSize: 13 }}>{b.bank}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--bs-muted)' }}>{b.fullName}</div>
                      </div>
                    </div>
                  </td>
                  {COLS.map(c => (
                    <td key={c.key} style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-ibm-mono)', whiteSpace: 'nowrap' }}>
                      {c.key === 'yoyGrowth'
                        ? <DeltaBadge val={b.yoyGrowth} />
                        : <span style={{ color: 'var(--bs-text)', fontSize: 12 }}>{c.fmt!(b[c.key as keyof typeof b] as number)}</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts row */}
      <div className="rg-2">
        <Card>
          <SectionTitle sub={`Assets ranking · ${year}`}>Asset Rankings</SectionTitle>
          <HorizBarChart data={barData} fmt={v => fmtTZS(v)} label="Total Assets" height={300} />
        </Card>
        <Card>
          <SectionTitle sub="Sector asset growth by bank (TZS M)">Asset Growth Trends</SectionTitle>
          <TrendAreaChart
            data={trendData}
            series={activeSeries}
            height={260}
            yTickFmt={v => fmtNum(v)}
            tooltipFmt={v => fmtTZS(v)}
          />
        </Card>
      </div>
    </div>
  );
}
