'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import {
  IconLayoutDashboard, IconBuildingBank, IconBook2,
  IconChartBar, IconWorld, IconAlertTriangle,
  IconChevronLeft, IconChevronRight, IconX,
} from '@tabler/icons-react';

const NAV = [
  { href: '/overview',      label: 'Overview',      Icon: IconLayoutDashboard },
  { href: '/banks',         label: 'Banks',          Icon: IconBuildingBank },
  { href: '/balance-sheet', label: 'Balance Sheet',  Icon: IconBook2 },
  { href: '/pnl',           label: 'P&L',            Icon: IconChartBar },
  { href: '/macro',         label: 'Macro',          Icon: IconWorld },
  { href: '/risk',          label: 'Risk',           Icon: IconAlertTriangle },
];

interface Props { collapsed: boolean; isMobile?: boolean; onToggle: () => void; }

export default function Sidebar({ collapsed, isMobile = false, onToggle }: Props) {
  const path = usePathname();
  const w = collapsed ? 64 : 240;

  // On mobile: sidebar is an overlay that slides in/out
  const transform = isMobile && collapsed ? 'translateX(-100%)' : 'translateX(0)';
  const zIndex = isMobile ? 100 : 100;

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: isMobile ? 240 : w,
      background: 'var(--bs-surface)', borderRight: '1px solid var(--bs-border)',
      display: 'flex', flexDirection: 'column', zIndex,
      transition: 'width 0.3s ease, transform 0.3s ease',
      transform,
      overflow: 'hidden',
    }}>
      {/* Brand */}
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: (!isMobile && collapsed) ? '0 16px' : '0 20px',
        borderBottom: '1px solid var(--bs-border)',
        flexShrink: 0,
        justifyContent: (!isMobile && collapsed) ? 'center' : 'space-between',
        gap: 10,
      }}>
        <Logo
          size={32}
          iconOnly={!isMobile && collapsed}
        />
        {/* Close button on mobile */}
        {isMobile && (
          <button onClick={onToggle} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--bs-muted)', padding: 4, borderRadius: 6, display: 'flex',
          }}>
            <IconX size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV.map(({ href, label, Icon }) => {
          const active = path === href || path.startsWith(href + '/');
          const showLabel = isMobile || !collapsed;
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }} onClick={isMobile ? onToggle : undefined}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: showLabel ? '10px 12px' : '10px 0',
                borderRadius: 8,
                justifyContent: showLabel ? 'flex-start' : 'center',
                background: active ? 'var(--bs-amber-dim)' : 'transparent',
                color: active ? 'var(--bs-amber)' : 'var(--bs-muted)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bs-border)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
                {showLabel && (
                  <span style={{ fontSize: 13.5, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap', lineHeight: 1 }}>
                    {label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle — desktop only */}
      {!isMobile && (
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--bs-border)' }}>
          <button onClick={onToggle} style={{
            width: '100%', height: 36, border: 'none', cursor: 'pointer',
            borderRadius: 8, background: 'transparent', display: 'flex',
            alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 12px', gap: 8, color: 'var(--bs-muted)',
          }}>
            {collapsed
              ? <IconChevronRight size={16} />
              : <><IconChevronLeft size={16} /><span style={{ fontSize: 12 }}>Collapse</span></>}
          </button>
        </div>
      )}
    </aside>
  );
}
