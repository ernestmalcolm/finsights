'use client';
import { BANKS, BANK_COLORS } from '@/lib/data';
import { useBanks } from '@/lib/context';

export default function BankFilter() {
  const { selectedBanks, toggleBank, selectAll, clearAll } = useBanks();
  const allSelected  = selectedBanks.length === BANKS.length;
  const noneSelected = selectedBanks.length === 0;

  return (
    <div style={{
      background: 'var(--bs-surface)',
      borderBottom: '1px solid var(--bs-border)',
      padding: '8px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      minHeight: 48,
    }}>
      {/* Label */}
      <span style={{
        fontSize: 10.5, fontWeight: 600, color: 'var(--bs-muted)',
        textTransform: 'uppercase', letterSpacing: '0.07em',
        marginRight: 4, flexShrink: 0,
      }}>
        Banks
      </span>

      {/* All / None quick actions */}
      <button
        onClick={allSelected ? clearAll : selectAll}
        style={{
          padding: '3px 9px', borderRadius: 5, fontSize: 11, fontWeight: 600,
          cursor: 'pointer', border: '1px solid var(--bs-border)',
          background: allSelected ? 'var(--bs-amber-dim)' : 'transparent',
          color: allSelected ? 'var(--bs-amber)' : 'var(--bs-muted)',
          flexShrink: 0, transition: 'all 0.15s',
        }}
      >
        {allSelected ? 'All ✓' : 'All'}
      </button>

      <div style={{ width: 1, height: 16, background: 'var(--bs-border)', flexShrink: 0 }} />

      {/* Individual bank chips */}
      {BANKS.map(bank => {
        const active = selectedBanks.includes(bank);
        const color  = BANK_COLORS[bank];
        return (
          <button
            key={bank}
            onClick={() => toggleBank(bank)}
            title={bank}
            style={{
              padding: '3px 10px', borderRadius: 5, fontSize: 11.5, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.01em',
              border: `1px solid ${active ? color : 'var(--bs-border)'}`,
              background: active ? `${color}20` : 'transparent',
              color: active ? color : 'var(--bs-muted)',
              opacity: noneSelected ? 0.4 : 1,
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
              background: active ? color : 'var(--bs-border)',
              transition: 'background 0.15s',
            }} />
            {bank}
          </button>
        );
      })}

      {/* Selected count badge */}
      {!allSelected && selectedBanks.length > 0 && (
        <span style={{
          marginLeft: 'auto', fontSize: 11, color: 'var(--bs-muted)',
          flexShrink: 0, fontFamily: 'var(--font-ibm-mono)',
        }}>
          {selectedBanks.length}/{BANKS.length} selected
        </span>
      )}
    </div>
  );
}
