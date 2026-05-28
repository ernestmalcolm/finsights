'use client';

import { useState, useCallback, type ElementType, type MouseEvent } from 'react';
import Link from 'next/link';
import { Modal, useMantineColorScheme } from '@mantine/core';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import RotatingWords from '@/components/landing/RotatingWords';
import HeroBento from '@/components/landing/HeroBento';
import './landing.css';
import {
  IconChartBar, IconBuildingBank, IconBook2, IconWorld,
  IconAlertTriangle, IconLayoutDashboard, IconBrandWhatsapp,
  IconMail, IconBrandLinkedin, IconArrowRight, IconExternalLink,
  IconTrendingUp, IconSun, IconMoon, IconLogin, IconRocket,
  IconChartCandle, IconBriefcase, IconClock, IconChevronRight,
} from '@tabler/icons-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// ── Contact modal ────────────────────────────────────────────────────────────
function ContactModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null}
      centered
      radius="lg"
      size="sm"
      styles={{
        content: { background: 'var(--bs-card)', border: '1px solid var(--bs-border)' },
        overlay: { backdropFilter: 'blur(6px)' },
      }}
    >
      <div className="px-1 py-3">
        <div className="text-center mb-6">
          <Logo size={32} />
          <h2 className="mt-4 mb-1 text-xl font-bold text-[var(--bs-text)]">Get in Touch</h2>
          <p className="m-0 text-sm text-[var(--bs-muted)]">Data requests, partnerships, or analyst access</p>
        </div>
        <div className="flex items-center gap-3.5 p-4 rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] mb-5">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-lg font-bold text-black"
            style={{ background: 'linear-gradient(135deg, var(--bs-amber), #F97316)' }}
          >
            E
          </div>
          <div className="flex-1 min-w-0">
            <p className="m-0 font-bold text-[var(--bs-text)]">Eric-Alex Hamissi</p>
            <p className="m-0 mt-0.5 text-xs text-[var(--bs-muted)]">FinSights · Tanzania</p>
          </div>
          <a
            href="https://www.linkedin.com/in/eric-alex-hamissi-b0b02119b/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold no-underline shrink-0"
            style={{
              background: 'rgba(14,165,233,0.12)',
              border: '1px solid rgba(14,165,233,0.3)',
              color: 'var(--bs-teal)',
            }}
          >
            <IconBrandLinkedin size={14} /> LinkedIn
          </a>
        </div>
        <div className="flex flex-col gap-2.5">
          <a
            href="https://wa.me/255748726803"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 rounded-xl no-underline"
            style={{
              background: 'rgba(37, 211, 102, 0.12)',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              color: '#25D366',
            }}
          >
            <IconBrandWhatsapp size={20} />
            <div>
              <p className="m-0 font-semibold text-sm">WhatsApp</p>
              <p className="m-0 text-xs text-[var(--bs-muted)] num">+255 748 726 803</p>
            </div>
          </a>
          <a
            href="mailto:erichamissi1@gmail.com"
            className="flex items-center gap-3 p-3.5 rounded-xl no-underline"
            style={{
              background: 'var(--bs-amber-dim)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: 'var(--bs-amber)',
            }}
          >
            <IconMail size={20} />
            <div>
              <p className="m-0 font-semibold text-sm">Email</p>
              <p className="m-0 text-xs text-[var(--bs-muted)] num">erichamissi1@gmail.com</p>
            </div>
          </a>
        </div>
      </div>
    </Modal>
  );
}

function BentoCard({
  icon: Icon,
  title,
  desc,
  href,
  className = '',
  tag,
}: {
  icon: ElementType;
  title: string;
  desc: string;
  href: string;
  className?: string;
  tag?: string;
}) {
  return (
    <Link href={href} className={`no-underline ${className}`}>
      <div className="landing-card landing-card-glow h-full p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
            style={{
              background: 'var(--bs-amber-dim)',
              border: '1px solid rgba(245,158,11,0.2)',
              color: 'var(--bs-amber)',
            }}
          >
            <Icon size={20} />
          </div>
          {tag && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: 'var(--bs-amber-dim)', color: 'var(--bs-amber)' }}
            >
              {tag}
            </span>
          )}
        </div>
        <div className="flex-1">
          <p className="m-0 mb-1.5 font-bold text-[15px] text-[var(--bs-text)]">{title}</p>
          <p className="m-0 text-[13px] leading-relaxed text-[var(--bs-muted)]">{desc}</p>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--bs-amber)' }}>
          Open module <IconArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}

function SoonCard({
  icon: Icon,
  title,
  desc,
  className = '',
}: {
  icon: ElementType;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <div
      className={`landing-card h-full p-5 flex flex-col gap-3 opacity-80 ${className}`}
      style={{ borderStyle: 'dashed' }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center"
          style={{
            background: 'color-mix(in srgb, var(--bs-muted) 12%, transparent)',
            border: '1px solid var(--bs-border)',
            color: 'var(--bs-muted)',
          }}
        >
          <Icon size={20} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--bs-muted)] flex items-center gap-1">
          <IconClock size={11} /> Soon
        </span>
      </div>
      <div className="flex-1">
        <p className="m-0 mb-1.5 font-bold text-[15px] text-[var(--bs-text)]">{title}</p>
        <p className="m-0 text-[13px] leading-relaxed text-[var(--bs-muted)]">{desc}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [contactOpen, setContactOpen] = useState(false);
  const { toggleColorScheme } = useMantineColorScheme();

  const onHeroMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--spot-x', `${x}%`);
    e.currentTarget.style.setProperty('--spot-y', `${y}%`);
  }, []);

  return (
    <div className="landing-page min-h-screen overflow-x-hidden text-[var(--bs-text)]" style={{ background: 'var(--bs-bg)' }}>
      <ContactModal opened={contactOpen} onClose={() => setContactOpen(false)} />

      {/* Nav */}
      <nav className="landing-nav-blur sticky top-0 z-[100] h-16 px-6 md:px-8 flex items-center justify-between border-b border-[var(--bs-border)]">
        <Logo size={30} />
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => toggleColorScheme()}
            className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border border-[var(--bs-border)] bg-[var(--bs-card)] text-[var(--bs-text)]"
            title="Toggle theme"
          >
            <span className="theme-icon-sun"><IconSun size={15} /></span>
            <span className="theme-icon-moon"><IconMoon size={15} /></span>
          </button>
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="hidden sm:block px-4 py-1.5 rounded-lg text-[13px] cursor-pointer border border-[var(--bs-border)] text-[var(--bs-muted)] bg-transparent"
            style={{ fontFamily: 'var(--font-sora)' }}
          >
            Contact
          </button>
          <Link href="/login">
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-bold cursor-pointer border-0 text-black"
              style={{ background: 'var(--bs-amber)', fontFamily: 'var(--font-sora)' }}
            >
              <span className="hidden xs:inline">Sign In</span>
              <IconLogin size={14} />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="landing-hero-section relative overflow-hidden px-6 md:px-8 landing-grain"
        onMouseMove={onHeroMove}
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 20% 0%, rgba(245,158,11,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(14,165,233,0.05) 0%, transparent 50%),
            var(--bs-bg)
          `,
        }}
      >
        <div className="landing-spotlight" aria-hidden />
        <div className="relative z-[2] landing-hero-grid">
          <div className="landing-hero-copy text-center lg:text-left">
            <motion.h1
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="landing-hero-title landing-display m-0 text-[var(--bs-text)]"
            >
              <span className="landing-hero-lead">
                Tanzania&apos;s <RotatingWords />
              </span>
              <br />
              <span className="landing-hero-tagline italic text-[var(--bs-muted)]">
                — one platform to learn it.
              </span>
            </motion.h1>

            <motion.p
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="landing-hero-desc m-0 max-w-[540px] leading-relaxed text-[var(--bs-muted)] mx-auto lg:mx-0"
            >
              Built for analysts and finance enthusiasts who want clarity, not PDF archaeology.
              Compare banks, track NPLs, and read macro context — with more sectors on the way.
            </motion.p>

            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="landing-cta-row flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <Link href="/login">
                <button
                  type="button"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-[10px] text-[15px] font-bold cursor-pointer border-0 text-black"
                  style={{ background: 'var(--bs-amber)', fontFamily: 'var(--font-sora)' }}
                >
                  <IconLayoutDashboard size={18} /> Explore Dashboard
                </button>
              </Link>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="px-7 py-3.5 rounded-[10px] text-[15px] font-semibold cursor-pointer border border-[var(--bs-border)] bg-transparent text-[var(--bs-text)]"
                style={{ fontFamily: 'var(--font-sora)' }}
              >
                Contact
              </button>
            </motion.div>
          </div>

          <HeroBento />
        </div>
      </section>

      {/* Modules bento */}
      <section className="px-6 md:px-8 py-16 md:py-24 max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-14"
        >
          <p className="m-0 mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--bs-amber)]">
            Platform modules
          </p>
          <h2 className="landing-display m-0 text-[clamp(1.75rem,4vw,2.5rem)] font-normal text-[var(--bs-text)]">
            Six live dashboards. More loading in.
          </h2>
          <p className="mt-4 mb-0 max-w-[520px] text-[15px] text-[var(--bs-muted)] leading-relaxed">
            Each module is built around how analysts actually work — filters, ratios, and trends
            you can drill into, not static tables.
          </p>
        </motion.div>

        <p className="m-0 mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--bs-amber)]">
          Banking · Live
        </p>
        <div className="landing-bento mb-10">
          <BentoCard
            className="landing-bento-feature landing-bento-feature--hero"
            href="/overview"
            icon={IconLayoutDashboard}
            title="Sector Overview"
            desc="Sector KPIs, asset growth, market share, and macro snapshot — your entry point before drilling into any bank."
            tag="Start here"
          />
          <BentoCard
            className="landing-bento-feature landing-bento-feature--std"
            href="/banks"
            icon={IconBuildingBank}
            title="Bank Comparison"
            desc="Side-by-side metrics for all 10 institutions."
          />
          <BentoCard
            className="landing-bento-feature landing-bento-feature--std"
            href="/pnl"
            icon={IconChartBar}
            title="Profit & Loss"
            desc="Revenue, costs, NIM, and net income."
          />
          <BentoCard
            className="landing-bento-feature landing-bento-feature--std"
            href="/balance-sheet"
            icon={IconBook2}
            title="Balance Sheet"
            desc="Composition, LDR, and 8-year structure."
          />
          <BentoCard
            className="landing-bento-feature landing-bento-feature--std"
            href="/macro"
            icon={IconWorld}
            title="Macro Indicators"
            desc="GDP, inflation, FX, and policy rates."
          />
          <BentoCard
            className="landing-bento-feature landing-bento-feature--std"
            href="/risk"
            icon={IconAlertTriangle}
            title="Credit & Risk"
            desc="NPL ratios, provisions, and risk tiers."
          />
        </div>

        <p className="m-0 mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--bs-muted)]">
          Roadmap
        </p>
        <div className="grid gap-3.5 sm:grid-cols-3">
          <SoonCard icon={IconRocket} title="Startups & SMEs" desc="Funding, growth, and sector breakdown for Tanzania's startup ecosystem." />
          <SoonCard icon={IconBriefcase} title="Investment Funds" desc="Unit trusts, pensions, and portfolio performance." />
          <SoonCard icon={IconChartCandle} title="DSE Stocks & Bonds" desc="Listed company financials and auction results from the DSE." />
        </div>
      </section>

      {/* Why — institutional compare */}
      <section className="px-6 md:px-8 py-16 md:py-24 border-t border-[var(--bs-border)] bg-[var(--bs-surface)]">
        <div className="max-w-[720px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="m-0 mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--bs-amber)]">
              Why FinSights
            </p>
            <h2 className="landing-display m-0 text-[clamp(1.6rem,3.5vw,2.25rem)]">
              The data exists. The friction shouldn&apos;t.
            </h2>
            <p className="mt-4 mb-0 text-[15px] text-[var(--bs-muted)] leading-relaxed">
              Annual reports scattered across ten sites, buried in PDFs. FinSights consolidates
              and visualises what analysts need to compare and learn faster.
            </p>
          </motion.div>

          <div className="landing-compare-table landing-compare-header">
            <div
              className="grid grid-cols-2 text-[10px] font-bold uppercase tracking-[0.08em] py-3 px-4 border-b border-[var(--bs-border)]"
              style={{ background: 'var(--bs-card)' }}
            >
              <span className="text-[var(--bs-muted)]">Status quo</span>
              <span style={{ color: 'var(--bs-amber)' }}>FinSights</span>
            </div>
            {[
              ['Static PDFs and annual reports', 'Interactive charts with filters'],
              ['Outdated charts, no benchmarks', 'Sector KPIs and peer comparison'],
              ['Data on 10 separate websites', 'All institutions in one workspace'],
              ['Hours of manual spreadsheet work', '2017–2024 trends in seconds'],
            ].map(([bad, good]) => (
              <div key={bad} className="landing-compare-row">
                <div className="px-4 py-3.5 text-[13px] text-[var(--bs-muted)] border-r border-[var(--bs-border)] max-sm:border-r-0 max-sm:border-b max-sm:border-[var(--bs-border)]">
                  {bad}
                </div>
                <div className="px-4 py-3.5 text-[13px] font-medium text-[var(--bs-text)] flex items-center gap-2">
                  <IconChevronRight size={14} style={{ color: 'var(--bs-amber)', flexShrink: 0 }} />
                  {good}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-8 py-20 md:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="landing-display m-0 mb-4 text-[clamp(1.75rem,4vw,2.75rem)]">
            Start learning the sector today.
          </h2>
          <p className="m-0 mx-auto mb-9 max-w-[480px] text-[15px] text-[var(--bs-muted)] leading-relaxed">
            Free to explore. Built for people who care about Tanzania&apos;s financial system —
            from banking today to startups and markets tomorrow.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/login">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[10px] text-[15px] font-bold cursor-pointer border-0 text-black"
                style={{ background: 'var(--bs-amber)', fontFamily: 'var(--font-sora)' }}
              >
                <IconTrendingUp size={18} /> Open Dashboard
              </button>
            </Link>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[10px] text-[15px] font-semibold cursor-pointer border border-[var(--bs-border)] bg-transparent text-[var(--bs-text)]"
              style={{ fontFamily: 'var(--font-sora)' }}
            >
              <IconMail size={16} /> Contact
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--bs-border)] bg-[var(--bs-surface)]">
        <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-start">
          <Logo size={24} />
          <span className="text-xs text-[var(--bs-muted)]">
            © {new Date().getFullYear()} FinSights · Tanzania Banking Intelligence
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <a
            href="https://www.linkedin.com/in/eric-alex-hamissi-b0b02119b/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-[var(--bs-muted)] no-underline"
          >
            <IconBrandLinkedin size={16} /> Eric-Alex Hamissi
          </a>
          <Link href="/login" className="flex items-center gap-1 text-[13px] text-[var(--bs-muted)] no-underline">
            Dashboard <IconExternalLink size={13} />
          </Link>
        </div>
      </footer>

    </div>
  );
}
