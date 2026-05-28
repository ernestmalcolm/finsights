'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Modal } from '@mantine/core';
import Logo from '@/components/Logo';
import {
  IconChartBar, IconBuildingBank, IconBook2, IconWorld,
  IconAlertTriangle, IconLayoutDashboard, IconBrandWhatsapp,
  IconMail, IconBrandLinkedin, IconArrowRight, IconExternalLink,
  IconCheck, IconTrendingUp, IconLock, IconLockOpen,
  IconRocket, IconChartCandle, IconBriefcase, IconClock,
} from '@tabler/icons-react';

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
      <div style={{ padding: '8px 4px 12px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Logo size={32} />
          <h2 style={{ margin: '16px 0 4px', fontSize: 20, fontWeight: 700, color: 'var(--bs-text)' }}>
            Get in Touch
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--bs-muted)' }}>
            Questions, data requests, or partnership inquiries
          </p>
        </div>

        {/* Person card */}
        <div style={{
          background: 'var(--bs-surface)', border: '1px solid var(--bs-border)',
          borderRadius: 12, padding: '16px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--bs-amber), #F97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 18, fontWeight: 700, color: '#000',
          }}>
            E
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: 'var(--bs-text)' }}>
              Eric-Alex Hamissi
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--bs-muted)' }}>
              FinSights · Tanzania
            </p>
          </div>
          <a
            href="https://www.linkedin.com/in/eric-alex-hamissi-b0b02119b/"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px',
              borderRadius: 7, background: 'rgba(14,165,233,0.12)',
              border: '1px solid rgba(14,165,233,0.3)', color: 'var(--bs-teal)',
              textDecoration: 'none', fontSize: 12, fontWeight: 600,
              flexShrink: 0,
            }}
          >
            <IconBrandLinkedin size={14} />
            LinkedIn
          </a>
        </div>

        {/* Contact buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            href="https://wa.me/255748726803"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 16px', borderRadius: 10,
              background: 'rgba(37, 211, 102, 0.12)',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              textDecoration: 'none', color: '#25D366',
            }}
          >
            <IconBrandWhatsapp size={20} />
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: '#25D366' }}>WhatsApp</p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--bs-muted)', fontFamily: 'var(--font-ibm-mono)' }}>+255 748 726 803</p>
            </div>
          </a>

          <a
            href="mailto:erichamissi1@gmail.com"
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 16px', borderRadius: 10,
              background: 'var(--bs-amber-dim)', border: '1px solid rgba(245,158,11,0.3)',
              textDecoration: 'none', color: 'var(--bs-amber)',
            }}
          >
            <IconMail size={20} />
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: 'var(--bs-amber)' }}>Email</p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--bs-muted)', fontFamily: 'var(--font-ibm-mono)' }}>erichamissi1@gmail.com</p>
            </div>
          </a>
        </div>
      </div>
    </Modal>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 24px' }}>
      <div className="num" style={{ fontSize: 36, fontWeight: 700, color: 'var(--bs-amber)', lineHeight: 1, letterSpacing: '-0.02em' }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--bs-muted)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </div>
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, href }: { icon: React.ElementType; title: string; desc: string; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--bs-card)', border: '1px solid var(--bs-border)',
        borderRadius: 14, padding: '22px', cursor: 'pointer',
        transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 14,
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--bs-amber)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--bs-border)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'var(--bs-amber-dim)', border: '1px solid rgba(245,158,11,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--bs-amber)',
        }}>
          <Icon size={20} />
        </div>
        <div>
          <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 15, color: 'var(--bs-text)' }}>{title}</p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--bs-muted)', lineHeight: 1.55 }}>{desc}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--bs-amber)', fontSize: 12, fontWeight: 600, marginTop: 'auto' }}>
          Explore <IconArrowRight size={13} />
        </div>
      </div>
    </Link>
  );
}

// ── Coming soon card ─────────────────────────────────────────────────────────
function ComingSoonCard({ icon: Icon, title, desc, eta }: { icon: React.ElementType; title: string; desc: string; eta?: string }) {
  return (
    <div style={{
      background: 'var(--bs-card)', border: '1px dashed var(--bs-border)',
      borderRadius: 14, padding: '22px', display: 'flex', flexDirection: 'column', gap: 14,
      opacity: 0.75, position: 'relative', overflow: 'hidden',
    }}>
      {/* Coming soon ribbon */}
      <div style={{
        position: 'absolute', top: 14, right: -22,
        background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
        color: '#a78bfa', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
        padding: '3px 32px', transform: 'rotate(40deg)', textTransform: 'uppercase',
      }}>
        Soon
      </div>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#a78bfa',
      }}>
        <Icon size={20} />
      </div>
      <div>
        <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 15, color: 'var(--bs-text)' }}>{title}</p>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--bs-muted)', lineHeight: 1.55 }}>{desc}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#a78bfa', fontSize: 12, fontWeight: 600, marginTop: 'auto' }}>
        <IconClock size={12} /> {eta ?? 'Coming soon'}
      </div>
    </div>
  );
}

// ── Compare row ──────────────────────────────────────────────────────────────
function CompareRow({ them, us }: { them: string; us: string }) {
  return (
    <div className="fs-compare-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        borderRadius: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
      }}>
        <IconLock size={14} style={{ color: 'var(--bs-red)', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: 'var(--bs-muted)' }}>{them}</span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        borderRadius: 10, background: 'var(--bs-amber-dim)', border: '1px solid rgba(245,158,11,0.2)',
      }}>
        <IconCheck size={14} style={{ color: 'var(--bs-amber)', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: 'var(--bs-text)', fontWeight: 500 }}>{us}</span>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div style={{ background: 'var(--bs-bg)', minHeight: '100vh', color: 'var(--bs-text)' }}>
      <ContactModal opened={contactOpen} onClose={() => setContactOpen(false)} />

      {/* ── Navbar ── */}
      <nav className="fs-nav" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bs-surface)', borderBottom: '1px solid var(--bs-border)',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backdropFilter: 'blur(12px)',
      }}>
        <Logo size={30} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="fs-nav-contact"
            onClick={() => setContactOpen(true)}
            style={{
              background: 'transparent', border: '1px solid var(--bs-border)',
              borderRadius: 8, color: 'var(--bs-muted)', padding: '7px 16px',
              fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-sora)',
            }}
          >
            Contact
          </button>
          <Link href="/overview">
            <button style={{
              background: 'var(--bs-amber)', border: 'none', borderRadius: 8,
              color: '#000', padding: '8px 18px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-sora)',
            }}>
              <span className="fs-nav-btn-text">View Dashboard</span>
              <span style={{ display: 'none' }} className="fs-nav-btn-icon">Dashboard</span>
              <IconArrowRight size={14} />
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="fs-hero" style={{
        position: 'relative', overflow: 'hidden',
        padding: '100px 32px 80px',
        background: `
          radial-gradient(ellipse 80% 60% at 10% 10%, rgba(245,158,11,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 90% 90%, rgba(14,165,233,0.06) 0%, transparent 60%)
        `,
      }}>
        {/* Dot grid background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'radial-gradient(var(--bs-border) 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.6,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          {/* Eyebrow */}
          <div className="fs-eyebrow" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--bs-amber-dim)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 32,
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bs-amber)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bs-amber)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Tanzania Financial Sector · Banking · Startups · Investments · Stocks
            </span>
          </div>

          {/* Headline */}
          <h1 className="fs-hero-h1" style={{
            margin: '0 0 24px', fontWeight: 800, lineHeight: 1.1,
            fontSize: 'clamp(36px, 6vw, 66px)',
            letterSpacing: '-0.03em', color: 'var(--bs-text)',
          }}>
            Tanzania&apos;s banking sector.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 45%, #F97316 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Decoded.
            </span>
          </h1>

          <p style={{
            margin: '0 auto 40px', maxWidth: 600, fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'var(--bs-muted)', lineHeight: 1.65,
          }}>
            Starting with Tanzania&apos;s banking sector — P&amp;L, NPLs, macro trends and
            KPIs across 10 major banks. Expanding soon to startups, investment funds,
            and DSE-listed stocks.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/overview">
              <button style={{
                background: 'var(--bs-amber)', border: 'none', borderRadius: 10,
                color: '#000', padding: '14px 28px', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-sora)',
              }}>
                <IconLayoutDashboard size={18} /> View Dashboard
              </button>
            </Link>
            <button
              onClick={() => setContactOpen(true)}
              style={{
                background: 'transparent', border: '1px solid var(--bs-border)',
                borderRadius: 10, color: 'var(--bs-text)', padding: '14px 28px',
                fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sora)',
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="fs-stats" style={{
        borderTop: '1px solid var(--bs-border)', borderBottom: '1px solid var(--bs-border)',
        padding: '40px 32px', background: 'var(--bs-surface)',
      }}>
        <div style={{
          maxWidth: 860, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 24,
        }}>
          <StatCard value="10+"     label="Banks Covered" />
          <StatCard value="8"       label="Years of Data" />
          <StatCard value="6"       label="Live Modules" />
          <StatCard value="TZS 28T+" label="Assets Tracked" />
          <StatCard value="4+"      label="Sectors Planned" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="fs-section" style={{ padding: '80px 32px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--bs-amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            What&apos;s Inside
          </p>
          <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--bs-text)' }}>
            Six modules live. More on the way.
          </h2>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 100, padding: '5px 14px',
          }}>
            <span style={{ fontSize: 13 }}>✦</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', letterSpacing: '0.04em' }}>
              AI-powered analysis layer — coming soon
            </span>
          </div>
        </div>
        {/* Live modules */}
        <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: 'var(--bs-amber)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
          Live now — Banking Sector
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
          <FeatureCard href="/overview"      icon={IconLayoutDashboard} title="Sector Overview"    desc="High-level KPIs, asset growth trend, market share and macro snapshot across the full sector." />
          <FeatureCard href="/banks"         icon={IconBuildingBank}    title="Bank Comparison"    desc="Side-by-side metrics for all 10 banks — assets, deposits, loans, NPL ratios, ROA and YoY growth." />
          <FeatureCard href="/balance-sheet" icon={IconBook2}           title="Balance Sheet"      desc="Asset and liability composition, loans-to-deposits ratios, and structural trends over 8 years." />
          <FeatureCard href="/pnl"           icon={IconChartBar}        title="Profit & Loss"      desc="Revenue breakdown, operating costs, cost-to-income ratios, NIM and net income by bank." />
          <FeatureCard href="/macro"         icon={IconWorld}           title="Macro Indicators"   desc="GDP growth, inflation, exchange rate, lending and deposit rates — Tanzania's economic backdrop." />
          <FeatureCard href="/risk"          icon={IconAlertTriangle}   title="Credit & Risk"      desc="NPL ratios, provision coverage and risk tier classification across every institution." />
        </div>

        {/* Roadmap */}
        <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
          Expanding soon
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <ComingSoonCard icon={IconRocket}      title="Startups & SMEs"     eta="Coming soon" desc="Funding rounds, growth metrics and sector breakdown for Tanzania's emerging startup ecosystem." />
          <ComingSoonCard icon={IconBriefcase}   title="Investment Funds"    eta="Coming soon" desc="Unit trusts, pension fund allocations, and investment portfolio performance across fund managers." />
          <ComingSoonCard icon={IconChartCandle} title="DSE Stocks & Bonds"  eta="Coming soon" desc="Listed company financials, price trends, T-bill and T-bond auction results from the Dar es Salaam Stock Exchange." />
        </div>
      </section>

      {/* ── Why FinSights ── */}
      <section className="fs-surface" style={{
        padding: '80px 32px',
        background: 'var(--bs-surface)',
        borderTop: '1px solid var(--bs-border)',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--bs-amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              The Gap We Fill
            </p>
            <h2 style={{ margin: '0 0 14px', fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--bs-text)' }}>
              Why FinSights exists
            </h2>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--bs-muted)', lineHeight: 1.6, maxWidth: 520, marginInline: 'auto' }}>
              Tanzania&apos;s banking data exists — but it&apos;s buried in PDFs, split across 10 institution websites,
              and presented in formats that demand hours of manual work. FinSights consolidates and visualises it all.
            </p>
          </div>

          {/* Column headers */}
          <div className="fs-compare-headers" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 16 }}>
              <IconLock size={13} style={{ color: 'var(--bs-red)' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--bs-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>The status quo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 16 }}>
              <IconLockOpen size={13} style={{ color: 'var(--bs-amber)' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--bs-amber)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>FinSights</span>
            </div>
          </div>

          <div className="fs-compare-grid" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <CompareRow them="Static PDFs and annual reports"    us="Live interactive charts & dynamic filters" />
            <CompareRow them="Outdated, hard-to-read charts"     us="Modern visualisations built for clarity" />
            <CompareRow them="Data scattered across 10 websites" us="All 10 banks consolidated in one place" />
            <CompareRow them="Generic tables with no context"    us="Sector-specific KPIs, ratios & benchmarks" />
            <CompareRow them="No intelligent analysis layer"     us="AI-powered analysis — coming soon ✦" />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="fs-cta" style={{
        padding: '80px 32px', textAlign: 'center',
        background: `
          radial-gradient(ellipse 100% 100% at 50% 50%, rgba(245,158,11,0.07) 0%, transparent 70%)
        `,
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--bs-text)' }}>
          Ready to decode Tanzania&apos;s banking sector?
        </h2>
        <p style={{ margin: '0 auto 36px', maxWidth: 500, fontSize: 15, color: 'var(--bs-muted)', lineHeight: 1.6 }}>
          Start with banking — then watch FinSights grow into Tanzania&apos;s most
          comprehensive financial intelligence platform, covering banks, startups,
          investments, and stocks.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/overview">
            <button style={{
              background: 'var(--bs-amber)', border: 'none', borderRadius: 10,
              color: '#000', padding: '14px 30px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-sora)',
            }}>
              <IconTrendingUp size={18} /> Explore Dashboard
            </button>
          </Link>
          <button
            onClick={() => setContactOpen(true)}
            style={{
              background: 'transparent', border: '1px solid var(--bs-border)',
              borderRadius: 10, color: 'var(--bs-text)', padding: '14px 30px',
              fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sora)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <IconMail size={16} /> Get in Touch
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="fs-footer" style={{
        borderTop: '1px solid var(--bs-border)', background: 'var(--bs-surface)',
        padding: '32px 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <Logo size={24} />
          <span style={{ fontSize: 12, color: 'var(--bs-muted)' }}>
            © {new Date().getFullYear()} FinSights · Tanzania Banking Intelligence
          </span>
        </div>

        <div className="fs-footer-links" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a
            href="https://www.linkedin.com/in/eric-alex-hamissi-b0b02119b/"
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--bs-muted)', textDecoration: 'none', fontSize: 13 }}
          >
            <IconBrandLinkedin size={16} /> Eric-Alex Hamissi
          </a>
          <button
            onClick={() => setContactOpen(true)}
            style={{
              background: 'var(--bs-amber-dim)', border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 7, color: 'var(--bs-amber)', padding: '6px 14px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sora)',
            }}
          >
            Contact
          </button>
          <Link href="/overview" style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: 'var(--bs-muted)', textDecoration: 'none', fontSize: 13,
          }}>
            Dashboard <IconExternalLink size={13} />
          </Link>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ── Responsive homepage ── */
        @media (max-width: 640px) {
          .fs-nav         { padding: 0 16px !important; }
          .fs-nav-contact { display: none !important; }
          .fs-hero        { padding: 60px 20px 48px !important; }
          .fs-eyebrow     { padding: 4px 10px !important; }
          .fs-eyebrow span { font-size: 10px !important; letter-spacing: 0.04em !important; white-space: normal !important; text-align: center; }
          .fs-stats       { padding: 28px 16px !important; }
          .fs-section     { padding: 52px 20px !important; max-width: 100% !important; }
          .fs-surface     { padding: 52px 20px !important; }
          .fs-cta         { padding: 56px 20px !important; }
          .fs-compare-row { grid-template-columns: 1fr !important; }
          .fs-compare-headers { display: none !important; }
          .fs-footer      { flex-direction: column !important; gap: 20px !important; padding: 24px 20px !important; }
          .fs-footer-links { flex-wrap: wrap !important; gap: 12px !important; }
          .fs-nav-btn-text { display: none !important; }
          .fs-nav-btn-icon { display: inline !important; }
        }

        @media (max-width: 480px) {
          .fs-hero-h1 { font-size: 34px !important; }
        }
      `}</style>
    </div>
  );
}
