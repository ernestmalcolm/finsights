'use client';
import { ReactNode } from 'react';

interface Props {
  title: string;
  value: string;
  sub?: string;
  change?: number;
  icon?: ReactNode;
  accent?: 'amber' | 'teal' | 'green' | 'red';
}

export default function KPICard({ title, value, sub, change, icon, accent = 'amber' }: Props) {
  const accentVar = `var(--bs-${accent})`;
  const accentDim = `var(--bs-${accent === 'amber' ? 'amber' : accent === 'teal' ? 'teal' : accent}-dim)`;
  const dimVar = accent === 'amber' ? 'var(--bs-amber-dim)' : accent === 'teal' ? 'var(--bs-teal-dim)' : accentDim;

  const changeColor = change === undefined ? 'var(--bs-muted)'
    : change > 0 ? 'var(--bs-green)' : change < 0 ? 'var(--bs-red)' : 'var(--bs-muted)';
  const changeSign = change !== undefined && change > 0 ? '+' : '';

  return (
    <div className="bs-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--bs-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </span>
        {icon && (
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: dimVar,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: accentVar, flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>
      <div>
        <div className="num" style={{ fontSize: 24, fontWeight: 600, color: 'var(--bs-text)', lineHeight: 1, letterSpacing: '-0.01em' }}>
          {value}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          {change !== undefined && (
            <span className="num" style={{ fontSize: 12, fontWeight: 600, color: changeColor }}>
              {changeSign}{change.toFixed(1)}%
            </span>
          )}
          {sub && (
            <span style={{ fontSize: 11.5, color: 'var(--bs-muted)' }}>{sub}</span>
          )}
        </div>
      </div>
    </div>
  );
}
