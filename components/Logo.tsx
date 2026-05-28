/**
 * FinSights Logo — split FI mark + optional wordmark.
 *
 * Variants:
 *   <Logo />              — mark + wordmark (default)
 *   <Logo iconOnly />     — mark only (collapsed sidebar, small spaces)
 *   <Logo size={24} />    — scale the mark
 */

interface LogoProps {
  size?: number;
  iconOnly?: boolean;
}

export default function Logo({ size = 32, iconOnly = false }: LogoProps) {
  const r = Math.round(size * 0.22);   // corner radius scales with size
  const half = size / 2;
  const fontSize = Math.round(size * 0.5);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(size * 0.3), flexShrink: 0 }}>
      {/* ── Split F|I mark ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <defs>
          <clipPath id={`fi-clip-${size}`}>
            <rect width="64" height="64" rx={r * 2} />
          </clipPath>
        </defs>
        <g clipPath={`url(#fi-clip-${size})`}>
          {/* Left half — amber */}
          <rect x="0" y="0" width="32" height="64" fill="#F59E0B" />
          {/* Right half — dark */}
          <rect x="32" y="0" width="32" height="64" fill="#0f172a" />
          {/* Centre glow line */}
          <rect x="30" y="0" width="4" height="64" fill="#F59E0B" opacity="0.18" />

          {/* F — black on amber */}
          {/* stem */}
          <rect x="7"  y="10" width="7"  height="44" rx="2" fill="#000" />
          {/* top bar */}
          <rect x="7"  y="10" width="19" height="7"  rx="2" fill="#000" />
          {/* mid bar */}
          <rect x="7"  y="27" width="15" height="7"  rx="2" fill="#000" />

          {/* I — white on dark */}
          {/* top serif */}
          <rect x="36" y="10" width="20" height="6"  rx="2" fill="#fff" />
          {/* stem */}
          <rect x="43" y="16" width="6"  height="32" rx="2" fill="#fff" />
          {/* bottom serif */}
          <rect x="36" y="48" width="20" height="6"  rx="2" fill="#fff" />
        </g>
      </svg>

      {/* ── Wordmark ── */}
      {!iconOnly && (
        <span style={{
          fontWeight: 700,
          fontSize: fontSize,
          color: 'var(--bs-text)',
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}>
          Fin<span style={{ color: 'var(--bs-amber)' }}>Sights</span>
        </span>
      )}
    </div>
  );
}
