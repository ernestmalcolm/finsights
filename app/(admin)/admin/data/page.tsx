'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Select, NumberInput, Tabs } from '@mantine/core';
import { IconLoader2, IconPencil, IconTrash, IconPlus, IconDatabase } from '@tabler/icons-react';
import {
  adminGetAssetsByClass, adminUpsertAsset, adminDeleteAsset,
  adminGetLiabilitiesByClass, adminUpsertLiability, adminDeleteLiability,
  adminGetPnLByClass, adminUpsertPnL, adminDeletePnL,
  adminGetOtherItemsByClass, adminUpsertOtherItem, adminDeleteOtherItem,
  adminGetGLMapping,
  type AssetRow, type LiabilityRow, type PnLRow, type OtherItemRow, type GLMappingRow,
} from '@/lib/supabase-data';
import { BANKS, YEARS } from '@/lib/data';
import { formatError } from '@/lib/format-error';

type DataRow = AssetRow | LiabilityRow | PnLRow | OtherItemRow;
type TabType  = 'assets' | 'liabilities' | 'pnl' | 'risk';

function mappingForTab(mapping: GLMappingRow[], tab: TabType): GLMappingRow[] {
  return mapping.filter(m => {
    const id = m.sub_class_id;
    if (tab === 'assets')      return id.startsWith('A');
    if (tab === 'liabilities') return id.startsWith('L') || id.startsWith('E');
    if (tab === 'pnl')         return id.startsWith('PL');
    if (tab === 'risk')        return id.startsWith('OT');
    return false;
  });
}

export default function AdminDataPage() {
  const [tab,       setTab]       = useState<TabType>('assets');
  const [bank,      setBank]      = useState<string>(BANKS[0]);
  const [classId,   setClassId]   = useState('');
  const [mapping,   setMapping]   = useState<GLMappingRow[]>([]);
  const [rows,      setRows]      = useState<DataRow[]>([]);
  const [mappingLoading, setMappingLoading] = useState(true);
  const [rowsLoading,    setRowsLoading]    = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow,   setEditRow]   = useState<Partial<DataRow> & { id?: string }>({});
  const [deleteId,  setDeleteId]  = useState<string | null>(null);

  const loading = mappingLoading || rowsLoading;

  const tabMapping = useMemo(() => mappingForTab(mapping, tab), [mapping, tab]);

  const classIdValid = useMemo(
    () => !!classId && tabMapping.some(m => m.sub_class_id === classId),
    [tabMapping, classId],
  );

  const selectedMeta = useMemo(
    () => mapping.find(m => m.sub_class_id === classId),
    [mapping, classId],
  );

  const lineItemOptions = useMemo(
    () => tabMapping.map(m => ({
      value: m.sub_class_id,
      label: m.subclass ? `${m.subclass} (${m.sub_class_id})` : m.sub_class_id,
    })),
    [tabMapping],
  );

  const existingYears = useMemo(() => new Set(rows.map(r => r.year)), [rows]);

  useEffect(() => {
    setMappingLoading(true);
    adminGetGLMapping()
      .then(map => {
        setMapping(map);
        const items = mappingForTab(map, 'assets');
        if (items.length > 0) setClassId(items[0].sub_class_id);
      })
      .catch(err => setError(formatError(err, 'Failed to load line item definitions.')))
      .finally(() => setMappingLoading(false));
  }, []);

  function handleTabChange(newTab: TabType) {
    setTab(newTab);
    const items = mappingForTab(mapping, newTab);
    setClassId(items.length > 0 ? items[0].sub_class_id : '');
    setRows([]);
  }

  const loadRows = useCallback(async () => {
    if (!classId || !classIdValid) return;
    setRowsLoading(true);
    setError('');
    try {
      let data: DataRow[] = [];
      if (tab === 'assets')      data = await adminGetAssetsByClass(bank, classId);
      if (tab === 'liabilities') data = await adminGetLiabilitiesByClass(bank, classId);
      if (tab === 'pnl')         data = await adminGetPnLByClass(bank, classId);
      if (tab === 'risk')        data = await adminGetOtherItemsByClass(bank, classId);
      setRows(data);
    } catch (err) {
      setError(formatError(err, 'Failed to load data.'));
    } finally {
      setRowsLoading(false);
    }
  }, [tab, bank, classId, classIdValid]);

  useEffect(() => {
    let cancelled = false;
    if (!classId || !classIdValid) {
      setRows([]);
      return;
    }
    setRowsLoading(true);
    setError('');
    (async () => {
      try {
        let data: DataRow[] = [];
        if (tab === 'assets')      data = await adminGetAssetsByClass(bank, classId);
        if (tab === 'liabilities') data = await adminGetLiabilitiesByClass(bank, classId);
        if (tab === 'pnl')         data = await adminGetPnLByClass(bank, classId);
        if (tab === 'risk')        data = await adminGetOtherItemsByClass(bank, classId);
        if (!cancelled) setRows(data);
      } catch (err) {
        if (!cancelled) setError(formatError(err, 'Failed to load data.'));
      } finally {
        if (!cancelled) setRowsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tab, bank, classId, classIdValid]);

  function openAdd() {
    setError('');
    const nextYear = [...YEARS].reverse().find(y => !existingYears.has(y)) ?? new Date().getFullYear();
    const base = { bank_name: bank, year: nextYear, amount: 0 };
    if (tab === 'risk') setEditRow({ ...base, sub_class_id: classId });
    else                setEditRow({ ...base, class_id: classId });
    setModalOpen(true);
  }

  function openEdit(row: DataRow) {
    setError('');
    setEditRow({ ...row });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const r = editRow as DataRow & { id?: string };
      const year = Number(r.year ?? new Date().getFullYear());
      const amount = Number(r.amount ?? 0);
      const id = r.id;

      if (tab === 'assets') {
        await adminUpsertAsset({ ...(id ? { id } : {}), bank_name: bank, year, class_id: classId, amount });
      } else if (tab === 'liabilities') {
        await adminUpsertLiability({ ...(id ? { id } : {}), bank_name: bank, year, class_id: classId, amount });
      } else if (tab === 'pnl') {
        await adminUpsertPnL({ ...(id ? { id } : {}), bank_name: bank, year, class_id: classId, amount });
      } else if (tab === 'risk') {
        await adminUpsertOtherItem({ ...(id ? { id } : {}), bank_name: bank, year, sub_class_id: classId, amount });
      }

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
      if (tab === 'assets')      await adminDeleteAsset(id);
      if (tab === 'liabilities') await adminDeleteLiability(id);
      if (tab === 'pnl')         await adminDeletePnL(id);
      if (tab === 'risk')        await adminDeleteOtherItem(id);
      await loadRows();
    } catch (err) {
      setError(formatError(err, 'Delete failed.'));
    } finally {
      setSaving(false);
      setDeleteId(null);
    }
  }

  const deleteRow = rows.find(r => r.id === deleteId);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin</span>
        </div>
        <h1 style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--bs-text)' }}>Financial Data</h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--bs-muted)' }}>
          Select bank and line item — view and edit amounts across all years
        </p>
      </div>

      <Tabs value={tab} onChange={v => v && handleTabChange(v as TabType)}>
        <Tabs.List mb="md">
          <Tabs.Tab value="assets">Assets</Tabs.Tab>
          <Tabs.Tab value="liabilities">Liabilities</Tabs.Tab>
          <Tabs.Tab value="pnl">P&amp;L</Tabs.Tab>
          <Tabs.Tab value="risk">Risk / NPL</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Select
          label="Bank"
          value={bank}
          onChange={v => setBank(v ?? BANKS[0])}
          data={BANKS.map(b => ({ value: b, label: b }))}
          style={{ minWidth: 120 }}
        />
        <Select
          label="Line Item"
          searchable
          value={classId || null}
          onChange={v => setClassId(v ?? '')}
          data={lineItemOptions}
          style={{ minWidth: 320, flex: '1 1 320px' }}
          nothingFoundMessage="No line items found"
        />
        <button
          onClick={openAdd}
          disabled={!classId}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto',
            background: 'var(--bs-amber)', border: 'none', borderRadius: 8,
            color: '#000', padding: '9px 14px', fontSize: 13, fontWeight: 700,
            cursor: classId ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-sora)', whiteSpace: 'nowrap',
            opacity: classId ? 1 : 0.5,
          }}
        >
          <IconPlus size={14} /> Add Year
        </button>
      </div>

      {selectedMeta && (
        <div className="bs-card" style={{ padding: '14px 18px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa',
            }}>
              <IconDatabase size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--bs-text)', lineHeight: 1.35 }}>
                {selectedMeta.subclass ?? classId}
              </p>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--bs-muted)', lineHeight: 1.5 }}>
                <span style={{ fontFamily: 'var(--font-ibm-mono)', color: 'var(--bs-amber)', fontWeight: 600 }}>{classId}</span>
                {selectedMeta.class && <> · {selectedMeta.class}</>}
                {selectedMeta.account_type && <> · {selectedMeta.account_type}</>}
                <> · {bank}</>
                {!loading && <> · {rows.length} year{rows.length === 1 ? '' : 's'} of data</>}
              </p>
            </div>
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
                {['Year', 'Amount (TZS M)', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                    color: 'var(--bs-muted)', textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--bs-border)', transition: 'background 0.12s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bs-surface)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <td style={{ padding: '11px 14px', fontWeight: 600, color: 'var(--bs-text)' }}>{row.year}</td>
                  <td style={{
                    padding: '11px 14px', fontFamily: 'var(--font-ibm-mono)',
                    color: row.amount < 0 ? '#ef4444' : 'var(--bs-text)',
                  }}>
                    {row.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(row)} title="Edit" style={{ background: 'var(--bs-card)', border: '1px solid var(--bs-border)', borderRadius: 5, padding: '4px 7px', cursor: 'pointer', color: 'var(--bs-muted)', display: 'flex' }}>
                        <IconPencil size={13} />
                      </button>
                      <button onClick={() => setDeleteId(row.id)} title="Delete" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 5, padding: '4px 7px', cursor: 'pointer', color: '#ef4444', display: 'flex' }}>
                        <IconTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && classIdValid && (
                <tr>
                  <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: 'var(--bs-muted)' }}>
                    <IconDatabase size={28} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
                    No values yet for this line item. Click <strong>Add Year</strong> to enter one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

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
            background: 'var(--bs-surface)', border: '1px solid var(--bs-border)', fontSize: 13,
          }}>
            <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--bs-text)', lineHeight: 1.4 }}>
              {selectedMeta?.subclass ?? classId}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--bs-muted)' }}>
              <span style={{ fontFamily: 'var(--font-ibm-mono)', color: 'var(--bs-amber)' }}>{classId}</span>
              {' · '}{bank}
            </p>
          </div>
          {editRow.id ? (
            <div style={{ fontSize: 13, color: 'var(--bs-muted)' }}>
              Year: <strong style={{ color: 'var(--bs-text)' }}>{editRow.year}</strong>
            </div>
          ) : (
            <Select
              label="Year"
              value={String(editRow.year ?? YEARS[YEARS.length - 1])}
              onChange={v => setEditRow(p => ({ ...p, year: Number(v) }))}
              data={[...YEARS].reverse()
                .filter(y => !existingYears.has(y))
                .map(y => ({ value: String(y), label: String(y) }))}
              nothingFoundMessage="All years already have values"
            />
          )}
          <NumberInput
            label="Amount (TZS Millions)"
            value={(editRow as DataRow).amount ?? 0}
            onChange={v => setEditRow(p => ({ ...p, amount: Number(v) }))}
            allowNegative
            required
          />
          {error && <p style={{ margin: 0, fontSize: 12, color: '#ef4444' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '9px', background: 'var(--bs-surface)', border: '1px solid var(--bs-border)', borderRadius: 8, color: 'var(--bs-text)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sora)' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '9px', background: 'var(--bs-amber)', border: 'none', borderRadius: 8, color: '#000', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sora)', opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {saving ? <><IconLoader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</> : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal opened={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Value" centered radius="lg" size="sm"
        styles={{ content: { background: 'var(--bs-card)', border: '1px solid var(--bs-border)' }, overlay: { backdropFilter: 'blur(6px)' } }}>
        <p style={{ fontSize: 14, margin: '0 0 18px', color: 'var(--bs-text)', lineHeight: 1.5 }}>
          Delete the {deleteRow?.year} value for <strong>{selectedMeta?.subclass ?? classId}</strong> ({bank})?
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
