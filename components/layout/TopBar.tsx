'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon, IconMenu2, IconLogout } from '@tabler/icons-react';
import { useYear } from '@/lib/context';
import { YEARS } from '@/lib/data';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';

const PAGE_TITLES: Record<string, string> = {
  '/overview':      'Sector Overview',
  '/banks':         'Bank Comparison',
  '/balance-sheet': 'Balance Sheet',
  '/pnl':           'Profit & Loss',
  '/macro':         'Macro Indicators',
  '/risk':          'Credit & Risk',
};

interface Props { collapsed: boolean; onToggle: () => void; }

export default function TopBar({ collapsed, onToggle }: Props) {
  const path     = usePathname();
  const router   = useRouter();
  const { toggleColorScheme } = useMantineColorScheme();
  const { year, setYear } = useYear();
  const title    = PAGE_TITLES[path] ?? 'FinSights';
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header style={{
      height: 64, background: 'var(--bs-surface)', borderBottom: '1px solid var(--bs-border)',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
      position: 'sticky', top: 0, zIndex: 90, flexShrink: 0, overflow: 'hidden',
    }}>
      <button onClick={onToggle} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--bs-muted)', padding: 4, borderRadius: 6, display: 'flex',
      }}>
        <IconMenu2 size={18} />
      </button>

      {/* Logo mark — home link, shown when sidebar is collapsed (desktop icon-only / mobile hidden) */}
      {collapsed && (
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex' }} title="FinSights Home">
          <Logo size={28} iconOnly />
        </Link>
      )}

      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <h1 style={{
          margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--bs-text)',
          lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {title}
        </h1>
        <p style={{
          margin: '3px 0 0', fontSize: 11, color: 'var(--bs-muted)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}
          className="topbar-sub"
        >
          FinSights · Tanzania Banking · 2017–2024
        </p>
      </div>

      {/* Year selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span className="year-label" style={{ fontSize: 11, color: 'var(--bs-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Year</span>
        <select
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          style={{
            background: 'var(--bs-card)', border: '1px solid var(--bs-border)', borderRadius: 8,
            color: 'var(--bs-text)', padding: '6px 10px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', outline: 'none', fontFamily: 'var(--font-ibm-mono)',
          }}
        >
          {[...YEARS].reverse().map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => toggleColorScheme()}
        style={{
          background: 'var(--bs-card)', border: '1px solid var(--bs-border)', borderRadius: 8,
          color: 'var(--bs-text)', width: 36, height: 36, display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}
        title="Toggle theme"
      >
        {/* Both icons always in DOM; CSS shows the correct one based on data-mantine-color-scheme */}
        <span className="theme-icon-sun"><IconSun size={16} /></span>
        <span className="theme-icon-moon"><IconMoon size={16} /></span>
      </button>

      {/* Data badge — hidden on very small screens */}
      <div style={{
        background: 'var(--bs-amber-dim)', border: '1px solid var(--bs-amber)',
        borderRadius: 6, padding: '4px 10px',
        fontSize: 11, fontWeight: 600, color: 'var(--bs-amber)',
        letterSpacing: '0.03em', whiteSpace: 'nowrap',
      }}
        className="hidden-xs"
      >
        Tanzania
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        title="Sign out"
        style={{
          background: 'var(--bs-card)', border: '1px solid var(--bs-border)', borderRadius: 8,
          color: 'var(--bs-muted)', width: 36, height: 36, display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
        }}
      >
        <IconLogout size={15} />
      </button>
    </header>
  );
}
