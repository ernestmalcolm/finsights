'use client';
import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMantineColorScheme } from '@mantine/core';
import {
  IconLayoutDashboard, IconBuildingBank, IconDatabase,
  IconWorld, IconUsers, IconSun, IconMoon, IconLogout,
  IconArrowLeft, IconMenu2, IconX,
} from '@tabler/icons-react';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/admin',        label: 'Overview',       icon: IconLayoutDashboard },
  { href: '/admin/banks',  label: 'Banks',           icon: IconBuildingBank },
  { href: '/admin/data',   label: 'Financial Data',  icon: IconDatabase },
  { href: '/admin/macro',  label: 'Macro Data',      icon: IconWorld },
  { href: '/admin/users',  label: 'Users',           icon: IconUsers },
];

const SIDEBAR_W = 220;

export default function AdminShell({ children }: { children: ReactNode }) {
  const [open,     setOpen]     = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname   = usePathname();
  const router     = useRouter();
  const { toggleColorScheme } = useMantineColorScheme();
  const supabase   = createClient();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close sidebar when navigating on mobile
  useEffect(() => { if (isMobile) setOpen(false); }, [pathname, isMobile]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const sidebarVisible = isMobile ? open : true;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bs-bg)', color: 'var(--bs-text)' }}>

      {/* Mobile backdrop */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: SIDEBAR_W,
        minWidth: SIDEBAR_W,
        height: '100vh',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        zIndex: 50,
        background: 'var(--bs-surface)',
        borderRight: '1px solid var(--bs-border)',
        display: 'flex',
        flexDirection: 'column',
        transform: sidebarVisible ? 'translateX(0)' : `translateX(-${SIDEBAR_W}px)`,
        transition: 'transform 0.25s ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          height: 56, display: 'flex', alignItems: 'center',
          padding: '0 16px', borderBottom: '1px solid var(--bs-border)',
          gap: 10,
        }}>
          <Logo size={22} />
          {isMobile && (
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bs-muted)', display: 'flex', padding: 4 }}>
              <IconX size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
                  background: active ? 'rgba(139,92,246,0.12)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(139,92,246,0.25)' : 'transparent'}`,
                  color: active ? '#a78bfa' : 'var(--bs-muted)',
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  transition: 'all 0.13s',
                }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bs-card)'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <Icon size={16} />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid var(--bs-border)', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Link href="/overview" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '8px 12px', borderRadius: 8, color: 'var(--bs-muted)', fontSize: 13, cursor: 'pointer',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bs-card)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <IconArrowLeft size={15} /> View Dashboard
            </div>
          </Link>

          <button onClick={toggleColorScheme} style={{
            display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px',
            borderRadius: 8, color: 'var(--bs-muted)', fontSize: 13, cursor: 'pointer',
            background: 'none', border: 'none', width: '100%', fontFamily: 'var(--font-sora)',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bs-card)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <span className="theme-icon-sun"><IconSun size={15} /></span>
            <span className="theme-icon-moon"><IconMoon size={15} /></span>
            <span>Theme</span>
          </button>

          <button onClick={signOut} style={{
            display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px',
            borderRadius: 8, color: '#ef4444', fontSize: 13, cursor: 'pointer',
            background: 'none', border: 'none', width: '100%', fontFamily: 'var(--font-sora)',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <IconLogout size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar — mobile only */}
        {isMobile && (
          <header style={{
            height: 52, display: 'flex', alignItems: 'center',
            padding: '0 16px', gap: 12,
            background: 'var(--bs-surface)', borderBottom: '1px solid var(--bs-border)',
            position: 'sticky', top: 0, zIndex: 30,
          }}>
            <button onClick={() => setOpen(true)} style={{
              background: 'var(--bs-card)', border: '1px solid var(--bs-border)',
              borderRadius: 7, color: 'var(--bs-muted)', width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <IconMenu2 size={17} />
            </button>
            <Logo size={20} />
          </header>
        )}

        <main style={{ flex: 1, padding: isMobile ? '20px 16px' : '28px 32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
