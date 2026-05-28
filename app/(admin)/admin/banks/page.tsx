'use client';
import { useEffect, useState } from 'react';
import { Modal, TextInput, ColorInput } from '@mantine/core';
import { IconPlus, IconPencil, IconTrash, IconLoader2, IconBuildingBank } from '@tabler/icons-react';
import { adminGetBanks, adminUpsertBank, adminDeleteBank, type BankRow } from '@/lib/supabase-data';
import { formatError } from '@/lib/format-error';

const EMPTY: Omit<BankRow, 'id'> & { id?: string } = { name: '', full_name: '', color: '#F59E0B', active: true };

export default function AdminBanksPage() {
  const [banks,     setBanks]     = useState<BankRow[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState<typeof EMPTY>(EMPTY);
  const [deleteId,  setDeleteId]  = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try { setBanks(await adminGetBanks()); }
    catch (err) { setError(formatError(err, 'Failed to load banks.')); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openAdd()            { setError(''); setEditing({ ...EMPTY }); setModalOpen(true); }
  function openEdit(b: BankRow) { setError(''); setEditing({ ...b });      setModalOpen(true); }

  async function handleSave() {
    if (!editing.name.trim()) { setError('Bank code is required.'); return; }
    setSaving(true); setError('');
    try { await adminUpsertBank(editing); setModalOpen(false); await load(); }
    catch (err) { setError(formatError(err, 'Save failed.')); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    try { await adminDeleteBank(id); await load(); }
    catch (err) { setError(formatError(err, 'Delete failed.')); }
    finally { setSaving(false); setDeleteId(null); }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin</span>
          </div>
          <h1 style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--bs-text)' }}>Banks</h1>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--bs-muted)' }}>Manage registered bank institutions</p>
        </div>
        <button onClick={openAdd} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--bs-amber)', border: 'none', borderRadius: 8,
          color: '#000', padding: '9px 16px', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'var(--font-sora)', whiteSpace: 'nowrap',
        }}>
          <IconPlus size={14} /> Add Bank
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', marginBottom: 14, borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#ef4444' }}>{error}</div>
      )}

      {loading ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--bs-muted)', fontSize: 13, padding: '20px 0' }}>
          <IconLoader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Loading…
        </div>
      ) : (
        <div className="bs-card" style={{ overflow: 'auto', width: 'fit-content', maxWidth: '100%' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bs-border)', background: 'var(--bs-surface)' }}>
                {['Color', 'Code', 'Full Name', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                    color: 'var(--bs-muted)', textTransform: 'uppercase', letterSpacing: '0.07em',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {banks.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--bs-border)', transition: 'background 0.12s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bs-surface)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, background: b.color ?? '#888', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </td>
                  <td style={{ padding: '11px 14px', fontWeight: 700, color: 'var(--bs-text)', fontFamily: 'var(--font-ibm-mono)', fontSize: 12 }}>{b.name}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--bs-muted)', maxWidth: 280 }}>{b.full_name || '—'}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(b)} title="Edit" style={{ background: 'var(--bs-card)', border: '1px solid var(--bs-border)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: 'var(--bs-muted)', display: 'flex', alignItems: 'center' }}>
                        <IconPencil size={13} />
                      </button>
                      <button onClick={() => setDeleteId(b.id)} title="Delete" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                        <IconTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {banks.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--bs-muted)' }}>
                    <IconBuildingBank size={28} style={{ marginBottom: 8, opacity: 0.4, display: 'block', margin: '0 auto 8px' }} />
                    No banks yet. Add one above or run the seed script.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit */}
      <Modal
        opened={modalOpen} onClose={() => setModalOpen(false)}
        title={editing.id ? 'Edit Bank' : 'Add Bank'}
        centered radius="lg" size="sm"
        styles={{ content: { background: 'var(--bs-card)', border: '1px solid var(--bs-border)' }, overlay: { backdropFilter: 'blur(6px)' } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <TextInput label="Bank Code (e.g. CRDB)" value={editing.name} onChange={e => setEditing(p => ({ ...p, name: e.target.value.toUpperCase() }))} required placeholder="CRDB" />
          <TextInput label="Full Name" value={editing.full_name ?? ''} onChange={e => setEditing(p => ({ ...p, full_name: e.target.value }))} placeholder="CRDB Bank Tanzania Ltd" />
          <ColorInput label="Chart Colour" value={editing.color ?? '#F59E0B'} onChange={c => setEditing(p => ({ ...p, color: c }))} />
          {error && <p style={{ margin: 0, fontSize: 12, color: '#ef4444' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '10px', background: 'var(--bs-surface)', border: '1px solid var(--bs-border)', borderRadius: 8, color: 'var(--bs-text)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sora)' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '10px', background: 'var(--bs-amber)', border: 'none', borderRadius: 8, color: '#000', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sora)', opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {saving ? <><IconLoader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</> : 'Save Bank'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        opened={!!deleteId} onClose={() => setDeleteId(null)}
        title="Delete Bank" centered radius="lg" size="sm"
        styles={{ content: { background: 'var(--bs-card)', border: '1px solid var(--bs-border)' }, overlay: { backdropFilter: 'blur(6px)' } }}
      >
        <p style={{ fontSize: 14, color: 'var(--bs-text)', margin: '0 0 20px', lineHeight: 1.5 }}>
          Are you sure? This won't delete associated financial records.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '9px', background: 'var(--bs-surface)', border: '1px solid var(--bs-border)', borderRadius: 8, color: 'var(--bs-text)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sora)' }}>Cancel</button>
          <button onClick={() => deleteId && handleDelete(deleteId)} disabled={saving} style={{ flex: 1, padding: '9px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sora)', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </Modal>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
