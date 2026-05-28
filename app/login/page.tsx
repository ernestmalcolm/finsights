'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon, IconArrowLeft, IconEye, IconEyeOff, IconLoader2 } from '@tabler/icons-react';

import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { toggleColorScheme } = useMantineColorScheme();
  const supabase     = createClient();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const next = searchParams.get('next') ?? '/overview';

  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) setError('Authentication failed. Please try again.');
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check role — admins go to /admin, everyone else goes to /overview (or ?next=)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    const destination = profile?.role === 'admin' ? '/admin' : next;
    router.push(destination);
    router.refresh();
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bs-bg)', color: 'var(--bs-text)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bs-surface)', borderBottom: '1px solid var(--bs-border)',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexShrink: 0 }} title="FinSights Home">
          <Logo size={26} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => toggleColorScheme()}
            style={{
              background: 'var(--bs-card)', border: '1px solid var(--bs-border)',
              borderRadius: 7, color: 'var(--bs-text)', width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="Toggle theme"
          >
            <span className="theme-icon-sun"><IconSun size={14} /></span>
            <span className="theme-icon-moon"><IconMoon size={14} /></span>
          </button>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--bs-muted)', textDecoration: 'none', fontSize: 13 }}>
            <IconArrowLeft size={14} /> Back
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px',
        background: `
          radial-gradient(ellipse 70% 50% at 20% 20%, rgba(245,158,11,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 80%, rgba(14,165,233,0.05) 0%, transparent 60%)
        `,
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Card */}
          <div style={{
            background: 'var(--bs-card)', border: '1px solid var(--bs-border)',
            borderRadius: 20, padding: '36px 32px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'var(--bs-amber-dim)', border: '1px solid rgba(245,158,11,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Logo size={28} iconOnly />
              </div>
              <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--bs-text)' }}>
                Sign in to FinSights
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--bs-muted)' }}>
                Tanzania Banking Intelligence Platform
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--bs-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  style={{
                    width: '100%', padding: '10px 14px', boxSizing: 'border-box',
                    background: 'var(--bs-surface)', border: '1px solid var(--bs-border)',
                    borderRadius: 9, color: 'var(--bs-text)', fontSize: 14,
                    fontFamily: 'var(--font-sora)', outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--bs-amber)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--bs-border)')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--bs-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '10px 40px 10px 14px', boxSizing: 'border-box',
                      background: 'var(--bs-surface)', border: '1px solid var(--bs-border)',
                      borderRadius: 9, color: 'var(--bs-text)', fontSize: 14,
                      fontFamily: 'var(--font-sora)', outline: 'none',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--bs-amber)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--bs-border)')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--bs-muted)', padding: 0, display: 'flex',
                    }}
                  >
                    {showPwd ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  padding: '10px 14px', borderRadius: 9,
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  fontSize: 13, color: '#ef4444',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '12px 16px', marginTop: 4,
                  background: loading ? 'rgba(245,158,11,0.6)' : 'var(--bs-amber)',
                  border: 'none', borderRadius: 10,
                  color: '#000', fontSize: 14, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-sora)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  transition: 'all 0.15s',
                }}
              >
                {loading
                  ? <><IconLoader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Signing in...</>
                  : 'Sign In'
                }
              </button>
            </form>
          </div>

          {/* Footer note */}
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--bs-muted)' }}>
            Access is by invitation only. Questions?{' '}
            <a href="mailto:gmem200197@gmail.com" style={{ color: 'var(--bs-amber)', textDecoration: 'none' }}>
              Contact us
            </a>
          </p>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
