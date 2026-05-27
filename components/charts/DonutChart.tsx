'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  fmt?: (v: number) => string;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#F59E0B', '#0EA5E9', '#10B981', '#8B5CF6',
  '#F97316', '#EC4899', '#14B8A6', '#6366F1', '#84CC16', '#EF4444',
];

function CustomTooltip({ active, payload, fmt }: {
  active?: boolean; payload?: { name: string; value: number; payload: { color?: string } }[]; fmt?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div style={{
      background: 'var(--bs-surface)', border: '1px solid var(--bs-border)',
      borderRadius: 8, padding: '8px 12px',
    }}>
      <p style={{ margin: '0 0 2px', fontSize: 12, color: 'var(--bs-muted)' }}>{p.name}</p>
      <p className="num" style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--bs-text)' }}>
        {fmt ? fmt(p.value) : p.value.toLocaleString()}
      </p>
    </div>
  );
}

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number;
}) => {
  if (!percent || percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const iR = innerRadius ?? 0;
  const oR = outerRadius ?? 0;
  const radius = iR + (oR - iR) * 0.55;
  const x = (cx ?? 0) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = (cy ?? 0) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);
  return (
    <text x={x} y={y} fill="rgba(255,255,255,0.9)" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 10, fontFamily: 'var(--font-ibm-mono)', fontWeight: 600 }}>
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

export default function DonutChart({ data, height = 260, fmt, colors = DEFAULT_COLORS }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data} cx="50%" cy="45%"
          innerRadius="50%" outerRadius="75%"
          dataKey="value" paddingAngle={2}
          labelLine={false} label={renderLabel}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip fmt={fmt} />} />
        <Legend
          iconType="circle" iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 4, fontFamily: 'var(--font-sora)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
