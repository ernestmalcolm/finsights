'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  fmt?: (v: number) => string;
  label?: string;
}

function CustomTooltip({ active, payload, fmt }: {
  active?: boolean; payload?: { value: number; name: string }[]; fmt?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bs-surface)', border: '1px solid var(--bs-border)',
      borderRadius: 8, padding: '8px 12px',
    }}>
      <p className="num" style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--bs-text)' }}>
        {fmt ? fmt(payload[0].value) : payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function HorizBarChart({ data, height = 280, fmt, label }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
        <XAxis
          type="number" tickFormatter={fmt} hide
          tick={{ fontSize: 10, fill: 'var(--bs-muted)', fontFamily: 'var(--font-ibm-mono)' }}
        />
        <YAxis
          type="category" dataKey="name" width={70}
          tick={{ fontSize: 12, fill: 'var(--bs-text)', fontFamily: 'var(--font-sora)' }}
          tickLine={false} axisLine={false}
        />
        <Tooltip content={<CustomTooltip fmt={fmt} />} cursor={{ fill: 'var(--bs-border)', radius: 4 }} />
        <Bar dataKey="value" name={label ?? 'Value'} radius={[0, 4, 4, 0]} barSize={20}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color ?? 'var(--bs-amber)'} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
