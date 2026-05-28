'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconLayoutDashboard, IconArrowRight } from '@tabler/icons-react';

const STATS = [
  { value: '10+', label: 'Banks covered', wide: false },
  { value: '8', label: 'Years of data', wide: false },
  { value: 'TZS 28T+', label: 'Assets tracked', wide: true },
  { value: '6', label: 'Live modules', wide: false },
  { value: '4+', label: 'Sectors planned', wide: false },
] as const;

export default function HeroBento() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
      className="landing-hero-bento"
    >
      <Link href="/login" className="landing-hero-bento-teaser no-underline">
        <div className="landing-hero-bento-card landing-hero-bento-card--teaser h-full">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
              style={{
                background: 'var(--bs-amber-dim)',
                border: '1px solid rgba(245,158,11,0.25)',
                color: 'var(--bs-amber)',
              }}
            >
              <IconLayoutDashboard size={20} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0"
              style={{
                background: 'var(--bs-amber-dim)',
                color: 'var(--bs-amber)',
                border: '1px solid rgba(245,158,11,0.28)',
              }}
            >
              Sign in to explore
            </span>
          </div>
          <div className="mt-4">
            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--bs-muted)]">
              Sector Overview
            </p>
            <p className="m-0 mt-2 text-[15px] font-semibold leading-snug text-[var(--bs-text)]">
              Live KPIs, asset trends, market share &amp; macro — inside the dashboard.
            </p>
          </div>
          <span className="flex items-center gap-1 mt-4 text-xs font-semibold" style={{ color: 'var(--bs-amber)' }}>
            Open dashboard <IconArrowRight size={13} />
          </span>
        </div>
      </Link>

      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28 + i * 0.06, ease: [0.22, 1, 0.36, 1] as const }}
          className={stat.wide ? 'landing-hero-bento-wide' : ''}
        >
          <div className="landing-hero-bento-card landing-hero-bento-card--stat h-full">
            <div className="num landing-hero-bento-value">{stat.value}</div>
            <div className="landing-hero-bento-label">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
