
import React, { useState, useMemo } from 'react';
import { NavBar } from '../components/ios/NavBar';
import { ListItem, ListSection } from '../components/ios/List';
import { Receipt } from '../types';
import { COLORS } from '../constants';
import { storageService } from '../services/storageService';

interface LibraryScreenProps {
  receipts: Receipt[];
  onSelect: (receipt: Receipt) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ receipts, onSelect }) => {
  const [search, setSearch] = useState('');
  const settings = storageService.getSettings();

  const filteredReceipts = useMemo(() => {
    return receipts.filter(r => 
      r.merchant.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [receipts, search]);

  const groupedByMonth = useMemo(() => {
    const groups: Record<string, Receipt[]> = {};
    filteredReceipts.forEach(r => {
      const date = new Date(r.date);
      const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    return groups;
  }, [filteredReceipts]);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <NavBar 
        title="Receipts" 
        rightAction={<button onClick={() => alert('Editing coming soon')} className="text-[#007AFF]">Edit</button>}
      />
      
      <div className="px-4 py-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-[#7676801F] dark:bg-[#7676803D] rounded-xl text-[17px] focus:outline-none placeholder-[#3C3C4399] dark:placeholder-[#EBEBF599]"
            placeholder="Search merchants or categories"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {receipts.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 px-8 text-center">
          <div className="w-20 h-20 bg-[#7676801F] rounded-full flex items-center justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-[#8E8E93]">
              <path d="M4 21V9M4 9L12 3L20 9M4 9H20M20 9V21M12 12V18M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-[20px] font-semibold mb-2">No Receipts Yet</h3>
          <p className="text-[#3C3C4399] dark:text-[#EBEBF599]">Tap the Scan icon to capture your first receipt.</p>
        </div>
      ) : (
        (Object.entries(groupedByMonth) as [string, Receipt[]][]).map(([month, items]) => (
          <ListSection key={month} title={month}>
            {items.map((receipt) => (
              <ListItem
                key={receipt.id}
                title={receipt.merchant}
                subtitle={`${receipt.date} • ${receipt.category}`}
                detail={`${receipt.currency}${receipt.total.toFixed(2)}`}
                onClick={() => onSelect(receipt)}
                icon={
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-[16px] font-bold`} 
                       style={{ backgroundColor: receipt.isReimbursed ? COLORS.green : COLORS.blue }}>
                    {receipt.isFavorite ? '⭐️' : receipt.merchant[0].toUpperCase()}
                  </div>
                }
              />
            ))}
          </ListSection>
        ))
      )}
    </div>
  );
};
