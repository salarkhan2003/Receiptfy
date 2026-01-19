
import React, { useState, useEffect, useCallback } from 'react';
import { TabType, Receipt, AppSettings } from './types';
import { TabBar } from './components/ios/TabBar';
import { LibraryScreen } from './screens/LibraryScreen';
import { ScannerScreen } from './screens/ScannerScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { storageService } from './services/storageService';
import { LoadingOverlay } from './components/ios/ActivityIndicator';
import { COLORS, CATEGORIES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Receipts');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [settings, setSettings] = useState<AppSettings>(storageService.getSettings());
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const checkDarkMode = useCallback(() => {
    const dark = settings.theme === 'dark' || 
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(dark);
  }, [settings.theme]);

  useEffect(() => {
    storageService.applyTheme(settings);
    checkDarkMode();
  }, [settings, checkDarkMode]);

  useEffect(() => {
    setReceipts(storageService.getReceipts());
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (settings.theme === 'system') {
        storageService.applyTheme(settings);
        checkDarkMode();
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [settings.theme, checkDarkMode]);

  const handleUpdateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  }, []);

  const handleCapture = (newReceipt: Receipt) => {
    const finalReceipt = { ...newReceipt, currency: settings.currencySymbol };
    storageService.saveReceipt(finalReceipt);
    setReceipts(storageService.getReceipts());
    setSelectedReceipt(finalReceipt);
    setActiveTab('Receipts');
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setIsNavigating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsNavigating(false);
    }, 120);
  };

  const handleToggleReimbursed = () => {
    if (!selectedReceipt) return;
    const updated = { ...selectedReceipt, isReimbursed: !selectedReceipt.isReimbursed };
    storageService.saveReceipt(updated);
    setReceipts(storageService.getReceipts());
    setSelectedReceipt(updated);
  };

  const handleToggleFavorite = () => {
    if (!selectedReceipt) return;
    const updated = { ...selectedReceipt, isFavorite: !selectedReceipt.isFavorite };
    storageService.saveReceipt(updated);
    setReceipts(storageService.getReceipts());
    setSelectedReceipt(updated);
  };

  const renderDetailView = (receipt: Receipt) => {
    const catColor = CATEGORIES.find(c => c.name === receipt.category)?.color || COLORS.blue;
    
    return (
      <div className="flex-1 flex flex-col bg-[#F2F2F7] dark:bg-black animate-in slide-in-from-right duration-300 overflow-hidden">
        {/* iOS Glass Header */}
        <div className="flex-shrink-0 bg-white/80 dark:bg-black/80 ios-blur sticky top-0 border-b-[0.5px] border-[#3C3C4320] dark:border-[#EBEBF520] flex items-center justify-between h-11 px-4 pt-[env(safe-area-inset-top)] z-50">
          <button onClick={() => setSelectedReceipt(null)} className="text-[#007AFF] text-[17px] font-medium flex items-center">
            <svg width="12" height="21" viewBox="0 0 12 21" className="mr-2">
              <path d="M11 1L1 10.5L11 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            Activity
          </button>
          <span className="font-semibold text-[17px] text-black dark:text-white">Transaction</span>
          <button onClick={handleToggleFavorite} className="text-[#007AFF] focus:outline-none">
             <span className="text-2xl leading-none">{receipt.isFavorite ? '★' : '☆'}</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto pb-32">
          {/* Fixed Visibility Hero Card */}
          <div className="px-4 pt-6 pb-2">
            <div 
              className="relative rounded-[32px] p-7 shadow-2xl overflow-hidden border border-[#3C3C4315] dark:border-white/10"
              style={{ background: `linear-gradient(145deg, ${isDarkMode ? '#1c1c1e' : '#ffffff'} 0%, ${isDarkMode ? '#000000' : '#f5f5f7'} 100%)` }}
            >
               <div 
                 className="absolute top-0 right-0 w-48 h-48 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 pointer-events-none" 
                 style={{ backgroundColor: catColor }}
               />
               
               <div className="flex items-start justify-between mb-8">
                  <div 
                    className="w-16 h-16 rounded-[22px] flex items-center justify-center text-white text-[28px] font-black shadow-lg transform rotate-3"
                    style={{ backgroundColor: catColor }}
                  >
                    {receipt.merchant[0].toUpperCase()}
                  </div>
                  <div className="text-right">
                    <p className="text-[#8E8E93] text-[11px] font-extrabold uppercase tracking-widest mb-1 opacity-70">Payment Ref</p>
                    <p className={`text-[14px] font-mono font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>#{receipt.id.slice(0,6).toUpperCase()}</p>
                  </div>
               </div>

               {/* Force black/white text for high contrast */}
               <h2 className={`text-[28px] font-black tracking-tight mb-2 leading-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
                 {receipt.merchant}
               </h2>
               
               <div className="flex items-center space-x-2 mb-8">
                  <span 
                    className="text-[12px] font-black px-3.5 py-1.5 rounded-full text-white uppercase tracking-wider shadow-sm"
                    style={{ backgroundColor: catColor }}
                  >
                    {receipt.category}
                  </span>
                  <span className="text-[#8E8E93] text-[15px] font-bold">•</span>
                  <span className="text-[#8E8E93] text-[15px] font-bold">
                    {new Date(receipt.date).toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
               </div>

               <div className="flex items-baseline space-x-1">
                 <span className="text-[28px] font-black text-[#007AFF]">{receipt.currency}</span>
                 <span className={`text-[52px] font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
                   {receipt.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </span>
               </div>
            </div>
          </div>

          {/* Detailed Item List */}
          {receipt.items && receipt.items.length > 0 && (
            <div className="px-4 py-2">
               <div className="bg-white dark:bg-[#1C1C1E] rounded-[28px] border border-[#3C3C431F] dark:border-white/5 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-[#3C3C431F] dark:border-white/5 bg-[#F9F9F9] dark:bg-[#252527] flex justify-between items-center">
                     <h3 className="text-[13px] font-black text-black dark:text-white uppercase tracking-[0.1em]">Itemized Bill</h3>
                     <span className="text-[11px] font-bold text-[#8E8E93]">{receipt.items.length} units</span>
                  </div>
                  <div className="divide-y divide-[#3C3C431F] dark:divide-white/5">
                    {receipt.items.map((item, idx) => (
                      <div key={idx} className="px-6 py-4 flex justify-between items-start group transition-colors">
                        <div className="flex-1 pr-4">
                          <p className="text-[17px] font-bold text-black dark:text-white leading-tight mb-1">{item.name}</p>
                          {item.quantity && <p className="text-[13px] font-bold text-[#8E8E93]">Qty: {item.quantity} @ {receipt.currency}{(item.price / (item.quantity || 1)).toFixed(2)}</p>}
                        </div>
                        <p className="text-[17px] font-black text-black dark:text-white">{receipt.currency}{item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* Advanced Tax Breakdown Section */}
          <div className="px-4 py-2">
            <div className="bg-white dark:bg-[#1C1C1E] rounded-[28px] border border-[#3C3C431F] dark:border-white/5 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#3C3C431F] dark:border-white/5 bg-[#F9F9F9] dark:bg-[#252527]">
                <h3 className="text-[13px] font-black text-black dark:text-white uppercase tracking-[0.15em]">Tax & Additional Fees</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-[16px]">
                  <span className="text-[#8E8E93] font-semibold">Subtotal</span>
                  <span className="text-black dark:text-white font-bold">{receipt.currency}{(receipt.subtotal || (receipt.total - (receipt.tax || 0))).toFixed(2)}</span>
                </div>
                
                {/* Individual Taxes (GST, SGST, CGST, etc.) */}
                <div className="space-y-2 py-3 border-y border-[#3C3C431F] dark:border-white/5">
                  {receipt.taxes && receipt.taxes.length > 0 ? (
                    receipt.taxes.map((tax, i) => (
                      <div key={i} className="flex justify-between items-center text-[14px]">
                        <span className="text-[#8E8E93] font-medium">{tax.name} {tax.rate ? `(${tax.rate}%)` : ''}</span>
                        <span className="text-black dark:text-white font-semibold">+{receipt.currency}{tax.amount.toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-[#8E8E93] font-medium">Total Aggregate Tax</span>
                      <span className="text-black dark:text-white font-semibold">+{receipt.currency}{(receipt.tax || 0).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {receipt.serviceCharge ? (
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-[#8E8E93] font-medium">Service Charge</span>
                      <span className="text-black dark:text-white font-semibold">+{receipt.currency}{receipt.serviceCharge.toFixed(2)}</span>
                    </div>
                  ) : null}

                  {receipt.discount ? (
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-[#FF3B30] font-medium">Discount</span>
                      <span className="text-[#FF3B30] font-bold">-{receipt.currency}{Math.abs(receipt.discount).toFixed(2)}</span>
                    </div>
                  ) : null}
                </div>

                {/* Highly visible Total Pay-box to avoid mixed colors */}
                <div className="mt-2 p-5 rounded-2xl bg-[#007AFF] flex justify-between items-center shadow-lg transform active:scale-95 transition-transform cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Final Amount Paid</span>
                    <span className="text-[20px] font-black leading-tight text-white uppercase tracking-tighter">Grand Total</span>
                  </div>
                  <span className="text-[30px] font-black tracking-tighter text-white">
                    {receipt.currency}{receipt.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleToggleReimbursed}
                className={`py-5 rounded-[24px] border-2 flex flex-col items-center justify-center space-y-3 transition-all active:scale-95 ${receipt.isReimbursed ? 'bg-[#34C75910] border-[#34C759] text-[#34C759]' : 'bg-white dark:bg-[#1C1C1E] border-[#3C3C431F] dark:border-white/5 text-black dark:text-white'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${receipt.isReimbursed ? 'bg-[#34C759] shadow-lg' : 'bg-[#7676801F] dark:bg-[#7676803D]'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={receipt.isReimbursed ? 'white' : 'currentColor'} strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[14px] font-black uppercase tracking-widest">Verify Paid</span>
              </button>
              
              <button 
                onClick={() => storageService.exportToPDF(receipt)}
                className="py-5 rounded-[24px] bg-white dark:bg-[#1C1C1E] border border-[#3C3C431F] dark:border-white/5 flex flex-col items-center justify-center space-y-3 text-[#007AFF] active:scale-95 transition-all shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-[#007AFF15] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <span className="text-[14px] font-black uppercase tracking-widest">Report PDF</span>
              </button>
            </div>

            <button 
               onClick={() => {
                  if(confirm('Permanently purge this record from local storage?')) {
                     storageService.deleteReceipt(receipt.id);
                     setReceipts(storageService.getReceipts());
                     setSelectedReceipt(null);
                  }
               }}
               className="w-full py-5 rounded-[24px] bg-[#FF3B30] text-white text-[18px] font-black active:scale-[0.97] transition-all shadow-xl shadow-[#FF3B3040]"
            >
               Purge Record
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (selectedReceipt) {
      return renderDetailView(selectedReceipt);
    }

    switch (activeTab) {
      case 'Receipts':
        return <LibraryScreen receipts={receipts} onSelect={setSelectedReceipt} />;
      case 'Scan':
        return <ScannerScreen onCapture={handleCapture} onCancel={() => setActiveTab('Receipts')} />;
      case 'Analytics':
        return <AnalyticsScreen receipts={receipts} />;
      case 'Settings':
        return <SettingsScreen settings={settings} onUpdateSettings={handleUpdateSettings} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto overflow-hidden bg-[#F2F2F7] dark:bg-black shadow-[0_0_80px_rgba(0,0,0,0.15)] relative">
      {isNavigating && <LoadingOverlay />}
      {renderContent()}
      {!selectedReceipt && activeTab !== 'Scan' && (
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
};

export default App;
