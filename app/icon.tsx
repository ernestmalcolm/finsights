import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {/* Left half — amber, F in black */}
        <div
          style={{
            width: 16,
            height: 32,
            background: '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#000',
              fontWeight: 900,
              fontSize: 18,
              lineHeight: 1,
              fontFamily: 'sans-serif',
              letterSpacing: '-1px',
            }}
          >
            F
          </span>
        </div>
        {/* Right half — dark, I in white */}
        <div
          style={{
            width: 16,
            height: 32,
            background: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#ffffff',
              fontWeight: 900,
              fontSize: 18,
              lineHeight: 1,
              fontFamily: 'sans-serif',
            }}
          >
            I
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
