'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, NumberInput, Select } from '@mantine/core';
import { IconPlus, IconPencil, IconTrash, IconLoader2, IconWorld } from '@tabler/icons-react';
import {
  adminGetMacroByMetric, adminGetMacroMapping, adminUpsertMacroRow, adminDeleteMacroRow,
  type MacroRow, type MacroMappingRow,
} from '@/lib/supabase-data';
import { formatError } from '@/lib/format-error';

export default function AdminMacroPage() {
  const [metricId,  setMetricId]  = useState<string>('');
  const [mapping,   setMapping]   = useState<MacroMappingRow[]>([]);
  const [rows,      setRows]      = useState<MacroRow[]>([]);
  const [mappingLoading, setMappingLoading] = useState(true);
  const [rowsLoading,    setRowsLoading]    = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow,   setEditRow]   = useState<Partial<MacroRow> & { id?: string }>({});
  const [deleteId,  setDeleteId]  = useState<string | null>(null);

  const loading = mappingLoading || rowsLoading;

  const metricIdValid = useMemo(
    () => !!metricId && mapping.some(m => m.metric_id === metricId),
    [mapping, metricId],
  );

  const selected = useMemo(
    () => mapping.find(m => m.metric_id === metricId),
    [mapping, metricId],
  );

  const metricOptions = useMemo(
    () => mapping.map(m => ({
      value: m.metric_id,
      label: m.metric ?? m.metric_id,
    })),
    [mapping],
  );

  // Load metric list once
  useEffect(() => {
    setMappingLoading(true);
    adminGetMacroMapping()
      .then(map => {
        setMapping(map);
        if (map.length > 0) setMetricId(map[0].metric_id);
      })
      .catch(() => setError('Failed to load metrics.'))
      .finally(() => setMappingLoading(false));
  }, []);

  const loadRows = useCallback(async () => {
    if (!metricId || !metricIdValid) return;
    setRowsLoading(true);
    setError('');
    try {
      setRows(await adminGetMacroByMetric(metricId));
    } catch (err) {
      setError(formatError(err, 'Failed to load data for this metric.'));
    } finally {
      setRowsLoading(false);
    }
  }, [metricId, metricIdValid]);

  useEffect(() => {
    let cancelled = false;
    if (!metricId || !metricIdValid) {
      setRows([]);
      return;
    }
    setRowsLoading(true);
    setError('');
    (async () => {
      try {
        const data = await adminGetMacroByMetric(metricId);
        if (!cancelled) setRows(data);
      } catch (err) {
        if (!cancelled) setError(formatError(err, 'Failed to load data for this metric.'));
      } finally {
        if (!cancelled) setRowsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [metricId, metricIdValid]);

  function openAdd() {
    setError('');
    setEditRow({
      country: selected?.country ?? 'Tanzania',
      metric_id: metricId,
      year: new Date().getFullYear(),
      amount: null,
    });
    setModalOpen(true);
  }

  function openEdit(r: MacroRow) {
    setError('');
    setEditRow({ ...r });
    setModalOpen(true);
  }

  async function handleSave() {
    if (editRow.amount === null || editRow.amount === undefined) {
      setError('Value is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await adminUpsertMacroRow({
        id: editRow.id,
        country: editRow.country ?? 'Tanzania',
        metric_id: metricId,
        year: editRow.year ?? new Date().getFullYear(),
        amount: editRow.amount,
      } as MacroRow);
      setModalOpen(false);
      await loadRows();
    } catch (err) {
      setError(formatError(err, 'Save failed.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    try {
      await adminDeleteMacroRow(id);
      await loadRows();
    } catch (err) {
      setError(formatError(err, 'Delete failed.'));
    } finally {
      setSaving(false);
      setDeleteId(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin</span>
        </div>
        <h1 style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--bs-text)' }}>Macro Data</h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--bs-muted)' }}>
          Select an indicator, then view or edit its values by year
        </p>
      </div>

      {/* Metric selector — same pattern as Financial Data bank/year row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Select
          label="Metric"
          searchable
          value={metricId || null}
          onChange={v => setMetricId(v ?? '')}
          data={metricOptions}
          style={{ minWidth: 260, flex: '1 1 260px' }}
          nothingFoundMessage="No metrics found"
        />
        <button
          onClick={openAdd}
          disabled={!metricId}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto',
            background: 'var(--bs-amber)', border: 'none', borderRadius: 8,
            color: '#000', padding: '9px 14px', fontSize: 13, fontWeight: 700,
            cursor: metricId ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-sora)', whiteSpace: 'nowrap',
            opacity: metricId ? 1 : 0.5,
          }}
        >
          <IconPlus size={14} /> Add Year
        </button>
      </div>

      {/* Selected metric summary */}
      {selected && (
        <div className="bs-card" style={{
          padding: '14px 18px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa',
          }}>
            <IconWorld size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--bs-text)' }}>
              {selected.metric ?? selected.metric_id}
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--bs-muted)' }}>
              <span style={{ fontFamily: 'var(--font-ibm-mono)', color: 'var(--bs-amber)', fontWeight: 600 }}>{selected.metric_id}</span>
              {' · '}{selected.country ?? 'Tanzania'}
              {selected.region ? ` · ${selected.region}` : ''}
              {!loading && ` · ${rows.length} year${rows.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div style={{ padding: '10px 14px', marginBottom: 12, borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#ef4444' }}>{error}</div>
      )}

      {loading ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--bs-muted)', fontSize: 13, padding: '24px 0' }}>
          <IconLoader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Loading…
        </div>
      ) : (
        <div className="bs-card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 360 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bs-border)', background: 'var(--bs-surface)' }}>
                {['Year', 'Value', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                    color: 'var(--bs-muted)', textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--bs-border)', transition: 'background 0.12s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bs-surface)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <td style={{ padding: '11px 14px', fontWeight: 600, color: 'var(--bs-text)' }}>{r.year}</td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--font-ibm-mono)', color: r.amount !== null ? 'var(--bs-text)' : 'var(--bs-muted)' }}>
                    {r.amount !== null ? r.amount.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—'}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(r)} title="Edit" style={{ background: 'var(--bs-card)', border: '1px solid var(--bs-border)', borderRadius: 5, padding: '4px 7px', cursor: 'pointer', color: 'var(--bs-muted)', display: 'flex' }}>
                        <IconPencil size={13} />
                      </button>
                      <button onClick={() => setDeleteId(r.id)} title="Delete" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 5, padding: '4px 7px', cursor: 'pointer', color: '#ef4444', display: 'flex' }}>
                        <IconTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && metricIdValid && (
                <tr>
                  <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: 'var(--bs-muted)' }}>
                    <IconWorld size={28} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
                    No values for this metric yet. Click <strong>Add Year</strong> to enter one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editRow.id ? 'Edit Value' : 'Add Year'}
        centered radius="lg" size="sm"
        styles={{ content: { background: 'var(--bs-card)', border: '1px solid var(--bs-border)' }, overlay: { backdropFilter: 'blur(6px)' } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            padding: '10px 12px', borderRadius: 8,
            background: 'var(--bs-surface)', border: '1px solid var(--bs-border)',
            fontSize: 13,
          }}>
            <span style={{ color: 'var(--bs-muted)' }}>Metric: </span>
            <strong style={{ color: 'var(--bs-text)' }}>{selected?.metric ?? metricId}</strong>
            <span style={{ fontFamily: 'var(--font-ibm-mono)', fontSize: 11, color: 'var(--bs-amber)', marginLeft: 8 }}>{metricId}</span>
          </div>
          <NumberInput
            label="Year"
            value={editRow.year ?? new Date().getFullYear()}
            onChange={v => setEditRow(p => ({ ...p, year: Number(v) }))}
            min={2000}
            max={2100}
            disabled={!!editRow.id}
          />
          <NumberInput
            label="Value"
            value={editRow.amount ?? ''}
            onChange={v => setEditRow(p => ({ ...p, amount: v === '' ? null : Number(v) }))}
            allowDecimal
            required
          />
          {error && <p style={{ margin: 0, fontSize: 12, color: '#ef4444' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '9px', background: 'var(--bs-surface)', border: '1px solid var(--bs-border)', borderRadius: 8, color: 'var(--bs-text)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sora)' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '9px', background: 'var(--bs-amber)', border: 'none', borderRadius: 8, color: '#000', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sora)', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal opened={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Value" centered radius="lg" size="sm"
        styles={{ content: { background: 'var(--bs-card)', border: '1px solid var(--bs-border)' }, overlay: { backdropFilter: 'blur(6px)' } }}>
        <p style={{ fontSize: 14, margin: '0 0 18px', color: 'var(--bs-text)', lineHeight: 1.5 }}>
          Delete this year&apos;s value for <strong>{selected?.metric ?? metricId}</strong>?
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
