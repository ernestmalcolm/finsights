'use client';
import { useEffect, useState } from 'react';
import { Modal, Select } from '@mantine/core';
import { IconLoader2, IconPencil, IconShield, IconUser, IconUsers } from '@tabler/icons-react';
import { adminGetProfiles, adminUpdateProfileRole, type ProfileRow } from '@/lib/supabase-data';
import { formatError } from '@/lib/format-error';

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [editing,  setEditing]  = useState<ProfileRow | null>(null);
  const [newRole,  setNewRole]  = useState<'admin' | 'user'>('user');

  async function load() {
    setLoading(true);
    try { setProfiles(await adminGetProfiles()); }
    catch (err) { setError(formatError(err, 'Failed to load users.')); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openEdit(p: ProfileRow) { setError(''); setEditing(p); setNewRole(p.role); }

  async function handleSave() {
    if (!editing) return;
    setSaving(true); setError('');
    try { await adminUpdateProfileRole(editing.id, newRole); setEditing(null); await load(); }
    catch (err) { setError(formatError(err, 'Failed to update role.')); }
    finally { setSaving(false); }
  }

  function fmt(dt: string) {
    return new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const adminCount = profiles.filter(p => p.role === 'admin').length;
  const userCount  = profiles.filter(p => p.role === 'user').length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin</span>
        </div>
        <h1 style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--bs-text)' }}>Users</h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--bs-muted)' }}>
          Manage accounts and roles. New users are created in the{' '}
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--bs-amber)' }}>Supabase Auth dashboard</a>.
        </p>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', marginBottom: 14, borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#ef4444' }}>{error}</div>
      )}

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
          <div className="bs-card" style={{ padding: '16px 18px' }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: 'var(--bs-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--bs-amber)', fontFamily: 'var(--font-ibm-mono)' }}>{profiles.length}</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--bs-muted)' }}>accounts</p>
          </div>
          <div className="bs-card" style={{ padding: '16px 18px' }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: 'var(--bs-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admins</p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#a78bfa', fontFamily: 'var(--font-ibm-mono)' }}>{adminCount}</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--bs-muted)' }}>full access</p>
          </div>
          <div className="bs-card" style={{ padding: '16px 18px' }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: 'var(--bs-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Users</p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0ea5e9', fontFamily: 'var(--font-ibm-mono)' }}>{userCount}</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--bs-muted)' }}>dashboard only</p>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--bs-muted)', fontSize: 13, padding: '20px 0' }}>
          <IconLoader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Loading…
        </div>
      ) : (
        <div className="bs-card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bs-border)', background: 'var(--bs-surface)' }}>
                {['Email', 'Name', 'Role', 'Joined', ''].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--bs-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--bs-border)', transition: 'background 0.12s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bs-surface)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <td style={{ padding: '11px 14px', fontWeight: 500, color: 'var(--bs-text)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.email ?? '—'}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--bs-muted)' }}>{p.full_name || '—'}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 9px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                      background: p.role === 'admin' ? 'rgba(139,92,246,0.12)' : 'rgba(14,165,233,0.1)',
                      color: p.role === 'admin' ? '#a78bfa' : '#0ea5e9',
                      border: `1px solid ${p.role === 'admin' ? 'rgba(139,92,246,0.25)' : 'rgba(14,165,233,0.25)'}`,
                    }}>
                      {p.role === 'admin' ? <IconShield size={10} /> : <IconUser size={10} />}
                      {p.role}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', color: 'var(--bs-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(p.created_at)}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <button onClick={() => openEdit(p)} style={{
                      background: 'var(--bs-card)', border: '1px solid var(--bs-border)',
                      borderRadius: 6, padding: '5px 10px', cursor: 'pointer', color: 'var(--bs-muted)',
                      display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, whiteSpace: 'nowrap',
                    }}>
                      <IconPencil size={12} /> Role
                    </button>
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--bs-muted)' }}>
                    <IconUsers size={28} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Info */}
      <div style={{ marginTop: 18, padding: '13px 16px', borderRadius: 10, background: 'var(--bs-surface)', border: '1px solid var(--bs-border)', fontSize: 12, color: 'var(--bs-muted)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--bs-text)' }}>Creating users:</strong> Go to your{' '}
        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--bs-amber)' }}>Supabase project</a>{' '}
        → Authentication → Users → Invite or Create User, then assign a role here.
        <br />
        <strong style={{ color: 'var(--bs-text)' }}>Roles:</strong>{' '}
        <code style={{ fontFamily: 'var(--font-ibm-mono)' }}>user</code> — dashboard read access.{' '}
        <code style={{ fontFamily: 'var(--font-ibm-mono)' }}>admin</code> — full admin panel access.
      </div>

      {/* Role modal */}
      <Modal
        opened={!!editing} onClose={() => setEditing(null)}
        title="Change Role" centered radius="lg" size="sm"
        styles={{ content: { background: 'var(--bs-card)', border: '1px solid var(--bs-border)' }, overlay: { backdropFilter: 'blur(6px)' } }}
      >
        <p style={{ fontSize: 13, color: 'var(--bs-muted)', margin: '0 0 16px' }}>
          User: <strong style={{ color: 'var(--bs-text)' }}>{editing?.email}</strong>
        </p>
        <Select
          label="Role"
          value={newRole}
          onChange={v => setNewRole(v as 'admin' | 'user')}
          data={[
            { value: 'user',  label: 'User — dashboard access only' },
            { value: 'admin', label: 'Admin — full access' },
          ]}
          mb="md"
        />
        {error && <p style={{ margin: '0 0 12px', fontSize: 12, color: '#ef4444' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setEditing(null)} style={{ flex: 1, padding: '9px', background: 'var(--bs-surface)', border: '1px solid var(--bs-border)', borderRadius: 8, color: 'var(--bs-text)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sora)' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '9px', background: 'var(--bs-amber)', border: 'none', borderRadius: 8, color: '#000', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sora)', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Update Role'}
          </button>
        </div>
      </Modal>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
