'use client';
import { useState, useEffect, ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BankFilter from './BankFilter';
import { YearProvider } from '@/lib/context';

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // On mobile: sidebar overlays, no margin shift
  // On desktop: sidebar pushes content right
  const sidebarW = collapsed ? 64 : 240;
  const marginLeft = isMobile ? 0 : sidebarW;
  const sidebarOpen = !collapsed;

  return (
    <YearProvider>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bs-bg)' }}>
        {/* Mobile backdrop */}
        {isMobile && sidebarOpen && (
          <div
            className="sidebar-backdrop active"
            onClick={() => setCollapsed(true)}
          />
        )}

        <Sidebar
          collapsed={collapsed}
          isMobile={isMobile}
          onToggle={() => setCollapsed(c => !c)}
        />

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft,
          transition: 'margin-left 0.3s ease',
          minWidth: 0,
        }}>
          <TopBar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
          <BankFilter />
          <main style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    </YearProvider>
  );
}
