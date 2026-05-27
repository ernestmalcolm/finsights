'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface Series { key: string; color: string; label?: string; }
interface Props {
  data: Record<string, string | number>[];
  series: Series[];
  height?: number;
  yTickFmt?: (v: number) => string;
  tooltipFmt?: (v: number) => string;
  stacked?: boolean;
  xKey?: string;
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
      {[...payload].reverse().map(p => (
        <p key={p.name} style={{ margin: '3px 0', fontSize: 12, color: p.color, fontFamily: 'var(--font-ibm-mono)' }}>
          <span style={{ color: 'var(--bs-muted)' }}>{p.name}: </span>
          {fmt ? fmt(p.value) : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function StackedBarChart({
  data, series, height = 260, yTickFmt, tooltipFmt, stacked = true, xKey = 'year',
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={stacked ? 28 : 14}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--bs-border)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: 'var(--bs-muted)', fontFamily: 'var(--font-ibm-mono)' }} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={yTickFmt} tick={{ fontSize: 10, fill: 'var(--bs-muted)', fontFamily: 'var(--font-ibm-mono)' }} tickLine={false} axisLine={false} width={55} />
        <Tooltip content={<CustomTooltip fmt={tooltipFmt} />} cursor={{ fill: 'var(--bs-border)', opacity: 0.4 }} />
        <Legend iconSize={8} iconType="square" wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
        {series.map((s, i) => (
          <Bar
            key={s.key} dataKey={s.key} name={s.label ?? s.key}
            stackId={stacked ? 'stack' : undefined}
            fill={s.color} fillOpacity={0.85}
            radius={i === series.length - 1 && stacked ? [3, 3, 0, 0] : (stacked ? [0, 0, 0, 0] : [3, 3, 0, 0])}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
