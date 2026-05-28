'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IconBuildingBank, IconDatabase, IconWorld,
  IconLoader2, IconArrowRight,
  IconChartBar, IconRefresh,
} from '@tabler/icons-react';
import { adminGetStats } from '@/lib/supabase-data';

type Stats = Awaited<ReturnType<typeof adminGetStats>>;

function StatCard({ label, value, sub }: { label: string; value: number | null; sub?: string }) {
  return (
    <div className="bs-card" style={{ padding: '18px 20px' }}>
      <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: 'var(--bs-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'var(--bs-amber)', letterSpacing: '-0.02em', fontFamily: 'var(--font-ibm-mono)', lineHeight: 1 }}>
        {value === null ? '—' : value.toLocaleString()}
      </p>
      {sub && <p style={{ margin: '6px 0 0', fontSize: 11, color: 'var(--bs-muted)' }}>{sub}</p>}
    </div>
  );
}

function QuickLink({ href, label, desc, icon: Icon }: { href: string; label: string; desc: string; icon: React.ElementType }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div className="bs-card" style={{
        padding: '16px 18px', cursor: 'pointer', transition: 'border-color 0.15s',
        display: 'flex', alignItems: 'center', gap: 14,
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#a78bfa'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--bs-border)'; }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
          background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa',
        }}>
          <Icon size={17} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--bs-text)' }}>{label}</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--bs-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{desc}</p>
        </div>
        <IconArrowRight size={14} style={{ color: 'var(--bs-muted)', flexShrink: 0 }} />
      </div>
    </Link>
  );
}

export default function AdminOverviewPage() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  async function load() {
    setLoading(true); setError('');
    try { setStats(await adminGetStats()); }
    catch { setError('Could not load stats — check Supabase connection.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Panel</span>
          </div>
          <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--bs-text)' }}>Overview</h1>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--bs-muted)' }}>Database record counts and quick links.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bs-card)', border: '1px solid var(--bs-border)',
            borderRadius: 8, color: 'var(--bs-muted)', padding: '8px 14px',
            fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-sora)', opacity: loading ? 0.6 : 1,
          }}
        >
          <IconRefresh size={14} style={loading ? { animation: 'spin 0.8s linear infinite' } : {}} />
          Refresh
        </button>
      </div>

      {error && (
        <div style={{ padding: '11px 14px', marginBottom: 20, borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#ef4444' }}>
          {error}
        </div>
      )}

      {loading && !stats ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--bs-muted)', fontSize: 13, padding: '20px 0' }}>
          <IconLoader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Loading stats…
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 32 }}>
            <StatCard label="Banks"         value={stats?.bankCount  ?? null} sub="institutions" />
            <StatCard label="Assets"        value={stats?.assetCount ?? null} sub="records" />
            <StatCard label="Liabilities"   value={stats?.liabCount  ?? null} sub="records" />
            <StatCard label="P&L"           value={stats?.pnlCount   ?? null} sub="records" />
            <StatCard label="Risk / NPL"    value={stats?.otherCount ?? null} sub="records" />
            <StatCard label="Macro"         value={stats?.macroCount ?? null} sub="data points" />
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <IconChartBar size={14} style={{ color: 'var(--bs-muted)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--bs-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Manage</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
            <QuickLink href="/admin/banks" icon={IconBuildingBank} label="Banks"          desc="Add, edit or deactivate bank entries" />
            <QuickLink href="/admin/data"  icon={IconDatabase}     label="Financial Data" desc="Assets, liabilities, P&L and risk per bank/year" />
            <QuickLink href="/admin/macro" icon={IconWorld}        label="Macro Data"     desc="Tanzania macroeconomic indicators" />
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
