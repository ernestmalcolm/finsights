'use client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

interface Series { key: string; color: string; label?: string; }
interface Props {
  data: Record<string, string | number>[];
  series: Series[];
  height?: number;
  yTickFmt?: (v: number) => string;
  tooltipFmt?: (v: number) => string;
}

function CustomTooltip({ active, payload, label, fmt }: {
  active?: boolean; payload?: { name: string; value: number; color: string }[];
  label?: string; fmt?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bs-surface)', border: '1px solid var(--bs-border)',
      borderRadius: 10, padding: '10px 14px', minWidth: 150,
    }}>
      <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: 'var(--bs-muted)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ margin: '3px 0', fontSize: 12, color: p.color, fontFamily: 'var(--font-ibm-mono)' }}>
          <span style={{ color: 'var(--bs-muted)' }}>{p.name}: </span>
          {fmt ? fmt(p.value) : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function TrendAreaChart({ data, series, height = 240, yTickFmt, tooltipFmt }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {series.map(s => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0.01} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--bs-border)" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--bs-muted)', fontFamily: 'var(--font-ibm-mono)' }} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={yTickFmt} tick={{ fontSize: 10, fill: 'var(--bs-muted)', fontFamily: 'var(--font-ibm-mono)' }} tickLine={false} axisLine={false} width={55} />
        <Tooltip content={<CustomTooltip fmt={tooltipFmt} />} />
        {series.length > 1 && <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />}
        {series.map(s => (
          <Area
            key={s.key} type="monotone" dataKey={s.key} name={s.label ?? s.key}
            stroke={s.color} strokeWidth={2} fill={`url(#grad-${s.key})`} dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
