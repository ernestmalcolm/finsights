'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { LATEST_YEAR, BANKS, Bank } from './data';

interface AppCtx {
  year: number;
  setYear: (y: number) => void;
  selectedBanks: Bank[];
  setSelectedBanks: (banks: Bank[]) => void;
  toggleBank: (bank: Bank) => void;
  selectAll: () => void;
  clearAll: () => void;
}

const AppContext = createContext<AppCtx>({
  year: LATEST_YEAR, setYear: () => {},
  selectedBanks: [...BANKS], setSelectedBanks: () => {},
  toggleBank: () => {}, selectAll: () => {}, clearAll: () => {},
});

export function YearProvider({ children }: { children: ReactNode }) {
  const [year, setYear] = useState(LATEST_YEAR);
  const [selectedBanks, setSelectedBanks] = useState<Bank[]>([...BANKS]);

  const toggleBank = (bank: Bank) =>
    setSelectedBanks(prev =>
      prev.includes(bank) ? prev.filter(b => b !== bank) : [...prev, bank]
    );
  const selectAll = () => setSelectedBanks([...BANKS]);
  const clearAll  = () => setSelectedBanks([]);

  return (
    <AppContext.Provider value={{ year, setYear, selectedBanks, setSelectedBanks, toggleBank, selectAll, clearAll }}>
      {children}
    </AppContext.Provider>
  );
}

export function useYear()  { return useContext(AppContext); }
export function useBanks() { return useContext(AppContext); }
