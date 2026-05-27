'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface Series { key: string; color: string; label?: string; dashed?: boolean; }
interface Props {
  data: Record<string, string | number | null>[];
  series: Series[];
  height?: number;
  yTickFmt?: (v: number) => string;
  tooltipFmt?: (v: number) => string;
  yDomain?: [number | string, number | string];
}

function CustomTooltip({ active, payload, label, fmt }: {
  active?: boolean; payload?: { name: string; value: number; color: string }[];
  label?: string; fmt?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bs-surface)', border: '1px solid var(--bs-border)',
      borderRadius: 10, padding: '10px 14px', minWidth: 160,
    }}>
      <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: 'var(--bs-muted)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ margin: '3px 0', fontSize: 12, color: p.color, fontFamily: 'var(--font-ibm-mono)' }}>
          <span style={{ color: 'var(--bs-muted)' }}>{p.name}: </span>
          {fmt ? fmt(p.value) : (p.value?.toFixed(2) ?? 'N/A')}
        </p>
      ))}
    </div>
  );
}

export default function MultiLineChart({ data, series, height = 260, yTickFmt, tooltipFmt, yDomain }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--bs-border)" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--bs-muted)', fontFamily: 'var(--font-ibm-mono)' }} tickLine={false} axisLine={false} />
        <YAxis
          tickFormatter={yTickFmt}
          domain={yDomain}
          tick={{ fontSize: 10, fill: 'var(--bs-muted)', fontFamily: 'var(--font-ibm-mono)' }}
          tickLine={false} axisLine={false} width={48}
        />
        <Tooltip content={<CustomTooltip fmt={tooltipFmt} />} />
        {series.length > 1 && <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />}
        {series.map(s => (
          <Line
            key={s.key} type="monotone" dataKey={s.key} name={s.label ?? s.key}
            stroke={s.color} strokeWidth={2}
            strokeDasharray={s.dashed ? '5 3' : undefined}
            dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
