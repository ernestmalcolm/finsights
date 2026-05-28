import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'FinSights — Tanzania Banking Intelligence';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0c0f1a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 100px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background accent circles */}
        <div style={{
          position: 'absolute', top: -120, left: -80,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, right: -50,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
        }} />

        {/* Logo mark */}
        <div style={{
          display: 'flex', flexDirection: 'row',
          width: 72, height: 72, borderRadius: 16, overflow: 'hidden', marginBottom: 36,
        }}>
          <div style={{ width: 36, height: 72, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontWeight: 900, fontSize: 40, lineHeight: 1 }}>F</span>
          </div>
          <div style={{ width: 36, height: 72, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 40, lineHeight: 1 }}>I</span>
          </div>
        </div>

        {/* Brand name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
          <span style={{ color: '#e2e8f0', fontWeight: 800, fontSize: 42, letterSpacing: '-1px' }}>
            Fin
          </span>
          <span style={{ color: '#F59E0B', fontWeight: 800, fontSize: 42, letterSpacing: '-1px' }}>
            Sights
          </span>
        </div>

        {/* Headline */}
        <div style={{
          color: '#f8fafc', fontWeight: 800, fontSize: 58,
          lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 24, maxWidth: 780,
        }}>
          Tanzania&apos;s Banking Sector.{' '}
          <span style={{ color: '#F59E0B' }}>Decoded.</span>
        </div>

        {/* Sub */}
        <div style={{ color: '#94a3b8', fontSize: 24, lineHeight: 1.5, maxWidth: 680, marginBottom: 48 }}>
          Interactive analytics across 10 major banks — P&L, NPLs, macro indicators and more. 2017–2024.
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 14 }}>
          {['Banking', 'Investments', 'Startups', 'DSE Stocks'].map((tag) => (
            <div key={tag} style={{
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 100, padding: '8px 20px',
              color: '#F59E0B', fontWeight: 600, fontSize: 18,
            }}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
