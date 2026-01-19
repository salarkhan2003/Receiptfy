
import React, { useState, useEffect, useCallback } from 'react';
import { TabType, Receipt, AppSettings, Category, ReceiptItem, TaxDetail } from './types';
import { TabBar } from './components/ios/TabBar';
import { LibraryScreen } from './screens/LibraryScreen';
import { ScannerScreen } from './screens/ScannerScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { storageService } from './services/storageService';
import { LoadingOverlay } from './components/ios/ActivityIndicator';
import { NavBar } from './components/ios/NavBar';
import { COLORS, CATEGORIES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Receipts');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [settings, setSettings] = useState<AppSettings>(storageService.getSettings());
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [manualInitialData, setManualInitialData] = useState<Partial<Receipt> | null>(null);

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
  }, []);

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
    setManualInitialData(null);
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setIsNavigating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsNavigating(false);
    }, 120);
  };

  const handleToggleFavorite = () => {
    if (!selectedReceipt) return;
    const updated = { ...selectedReceipt, isFavorite: !selectedReceipt.isFavorite };
    storageService.saveReceipt(updated);
    setReceipts(storageService.getReceipts());
    setSelectedReceipt(updated);
  };

  const ManualEntryForm = () => {
    const [formData, setFormData] = useState<Partial<Receipt>>({
      merchant: manualInitialData?.merchant || '',
      date: manualInitialData?.date || new Date().toISOString().split('T')[0],
      category: manualInitialData?.category || 'Others',
      total: manualInitialData?.total || 0,
      items: manualInitialData?.items || [],
      taxes: manualInitialData?.taxes || [],
      paymentMethod: manualInitialData?.paymentMethod || 'UPI',
      image: manualInitialData?.image
    });

    const addItem = () => {
      setFormData(prev => ({
        ...prev,
        items: [...(prev.items || []), { name: '', price: 0 }]
      }));
    };

    const addTax = () => {
      setFormData(prev => ({
        ...prev,
        taxes: [...(prev.taxes || []), { name: 'GST', amount: 0, rate: 0 }]
      }));
    };

    const saveManual = () => {
      if (!formData.merchant) {
        alert("Enter store or merchant name.");
        return;
      }
      if (!formData.total || formData.total <= 0) {
        alert("Enter a valid transaction amount.");
        return;
      }
      const newRec: Receipt = {
        id: crypto.randomUUID(),
        merchant: formData.merchant!,
        date: formData.date!,
        total: Number(formData.total),
        tax: formData.taxes?.reduce((s, t) => s + t.amount, 0) || 0,
        taxes: formData.taxes,
        items: formData.items,
        paymentMethod: formData.paymentMethod,
        category: formData.category as Category,
        currency: settings.currencySymbol,
        image: formData.image,
        isReimbursed: false,
        isFavorite: false,
        createdAt: Date.now()
      };
      handleCapture(newRec);
    };

    const isPDF = formData.image?.startsWith('data:application/pdf');

    return (
      <div className="flex-1 bg-[#F2F2F7] dark:bg-black overflow-y-auto pb-32">
        <NavBar 
          title="Manual Archive" 
          largeTitle={false} 
          leftAction={<button onClick={() => setManualInitialData(null)} className="text-[#007AFF] font-medium">Cancel</button>} 
        />
        <div className="p-4 space-y-6">
          {formData.image && (
            <div className="relative rounded-3xl overflow-hidden aspect-video bg-white dark:bg-[#1C1C1E] border border-[#3C3C431F] dark:border-white/10 shadow-lg">
               {isPDF ? (
                 <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
                    <div className="text-4xl text-[#FF3B30]">📄</div>
                    <span className="text-[13px] font-bold opacity-60">PDF Document Attached</span>
                 </div>
               ) : (
                 <img src={formData.image} alt="Receipt preview" className="w-full h-full object-contain" />
               )}
            </div>
          )}

          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden divide-y divide-[#3C3C430D]">
            <div className="p-4 flex items-center justify-between">
              <span className="text-[15px] font-semibold text-[#8E8E93]">Merchant</span>
              <input type="text" className="text-right bg-transparent outline-none font-bold text-black dark:text-white" placeholder="Store Name" value={formData.merchant} onChange={e => setFormData({...formData, merchant: e.target.value})} />
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-[15px] font-semibold text-[#8E8E93]">Total ({settings.currencySymbol})</span>
              <input type="number" className="text-right bg-transparent outline-none font-black text-[#007AFF] text-2xl" placeholder="0.00" value={formData.total === 0 ? '' : formData.total} onChange={e => setFormData({...formData, total: Number(e.target.value)})} />
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-[15px] font-semibold text-[#8E8E93]">Date</span>
              <input type="date" className="text-right bg-transparent outline-none font-bold text-black dark:text-white" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-[15px] font-semibold text-[#8E8E93]">Category</span>
              <select className="bg-transparent outline-none font-bold text-right text-black dark:text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="px-2 text-[12px] font-black uppercase text-[#8E8E93] tracking-widest">Line Items</h3>
            <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl divide-y divide-[#3C3C430D]">
              {formData.items?.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center space-x-2">
                  <input type="text" className="flex-1 bg-transparent outline-none text-black dark:text-white" placeholder="Item name" value={item.name} onChange={e => {
                    const newItems = [...formData.items!];
                    newItems[idx].name = e.target.value;
                    setFormData({...formData, items: newItems});
                  }} />
                  <input type="number" className="w-20 text-right bg-transparent outline-none font-bold text-[#007AFF]" placeholder="0.00" value={item.price === 0 ? '' : item.price} onChange={e => {
                    const newItems = [...formData.items!];
                    newItems[idx].price = Number(e.target.value);
                    setFormData({...formData, items: newItems});
                  }} />
                </div>
              ))}
              <button onClick={addItem} className="w-full p-4 text-[#007AFF] font-bold text-center active:bg-[#7676801F] transition-colors">+ Add Line Item</button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="px-2 text-[12px] font-black uppercase text-[#8E8E93] tracking-widest">Taxes (GST/SGST)</h3>
            <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl divide-y divide-[#3C3C430D]">
              {formData.taxes?.map((tax, idx) => (
                <div key={idx} className="p-4 flex items-center space-x-2">
                  <input type="text" className="flex-1 bg-transparent outline-none text-black dark:text-white" placeholder="Tax label" value={tax.name} onChange={e => {
                    const newTaxes = [...formData.taxes!];
                    newTaxes[idx].name = e.target.value;
                    setFormData({...formData, taxes: newTaxes});
                  }} />
                  <input type="number" className="w-24 text-right bg-transparent outline-none font-bold text-black dark:text-white" placeholder="Amount" value={tax.amount === 0 ? '' : tax.amount} onChange={e => {
                    const newTaxes = [...formData.taxes!];
                    newTaxes[idx].amount = Number(e.target.value);
                    setFormData({...formData, taxes: newTaxes});
                  }} />
                </div>
              ))}
              <button onClick={addTax} className="w-full p-4 text-[#007AFF] font-bold text-center active:bg-[#7676801F] transition-colors">+ Add Tax Row</button>
            </div>
          </div>

          <button onClick={saveManual} className="w-full py-5 bg-[#007AFF] text-white rounded-[24px] font-black text-xl shadow-xl active:scale-95 transition-all mt-4">Save Receipt</button>
        </div>
      </div>
    );
  };

  const renderDetailView = (receipt: Receipt) => {
    const catColor = CATEGORIES.find(c => c.name === receipt.category)?.color || COLORS.blue;
    const isPDF = receipt.image?.startsWith('data:application/pdf');

    return (
      <div className="flex-1 flex flex-col bg-[#F2F2F7] dark:bg-black animate-in slide-in-from-right duration-300 overflow-hidden">
        <div className="flex-shrink-0 bg-white/80 dark:bg-black/80 ios-blur sticky top-0 border-b-[0.5px] border-[#3C3C4320] dark:border-[#EBEBF520] flex items-center justify-between h-11 px-4 pt-[env(safe-area-inset-top)] z-50">
          <button onClick={() => setSelectedReceipt(null)} className="text-[#007AFF] text-[17px] font-medium">Activity</button>
          <span className="font-semibold text-[17px] text-black dark:text-white">Record Detail</span>
          <button onClick={handleToggleFavorite} className="text-[#007AFF] text-xl">{receipt.isFavorite ? '★' : '☆'}</button>
        </div>
        
        <div className="flex-1 overflow-y-auto pb-32">
          {/* Hero Card */}
          <div className="px-4 pt-6 pb-2">
            <div 
              className="relative rounded-[32px] p-7 shadow-2xl overflow-hidden border border-[#3C3C4315] dark:border-white/10"
              style={{ background: isDarkMode ? '#1c1c1e' : '#ffffff' }}
            >
               <div className="absolute top-0 right-0 w-48 h-48 -mr-16 -mt-16 rounded-full blur-3xl opacity-20" style={{ backgroundColor: catColor }} />
               <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md" style={{ backgroundColor: catColor }}>
                    {receipt.merchant[0].toUpperCase()}
                  </div>
                  <div className="text-right">
                    <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-widest">Digital Archive</p>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>#{receipt.id.slice(0,6).toUpperCase()}</p>
                  </div>
               </div>
               <h2 className={`text-3xl font-black tracking-tighter mb-6 relative z-10 leading-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>{receipt.merchant}</h2>
               
               <div className="bg-[#7676801F] dark:bg-white/5 p-6 rounded-3xl relative z-10 mb-2 border border-[#3C3C430A] dark:border-white/5">
                 <div className="flex items-baseline space-x-1">
                   <span className="text-2xl font-black text-[#007AFF]">{receipt.currency}</span>
                   <span className={`text-[52px] font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
                     {receipt.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   </span>
                 </div>
                 <p className="text-[#8E8E93] text-[11px] font-black mt-3 uppercase tracking-[0.2em] opacity-80">Verified Transaction Total</p>
               </div>
            </div>
          </div>

          <div className="px-4 py-2">
            <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-[#3C3C431F] dark:border-white/5 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#3C3C431F] dark:border-white/5 bg-[#F9F9F9] dark:bg-[#252527] flex justify-between">
                <span className="text-[12px] font-black text-[#8E8E93] uppercase tracking-[0.15em]">Financial Analysis</span>
                <span className="text-[12px] font-black text-[#007AFF] uppercase">{receipt.category}</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-[#8E8E93] font-medium">Net Value</span>
                  <span className="font-bold text-black dark:text-white">{(receipt.subtotal || receipt.total - receipt.tax).toFixed(2)}</span>
                </div>
                {receipt.taxes?.map((t, i) => (
                  <div key={i} className="flex justify-between items-center text-[15px]">
                    <span className="text-[#8E8E93] font-medium">{t.name}</span>
                    <span className="font-bold text-[#34C759]">+{t.amount.toFixed(2)}</span>
                  </div>
                ))}
                {!receipt.taxes?.length && receipt.tax > 0 && (
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-[#8E8E93] font-medium">Total Tax</span>
                    <span className="font-bold text-[#34C759]">+{receipt.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-[#3C3C431F] dark:border-white/5 flex justify-between items-center">
                   <span className="text-[13px] font-black text-[#8E8E93] uppercase">Grand Total</span>
                   <span className="text-[22px] font-black text-[#007AFF]">{receipt.currency}{receipt.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {receipt.items && receipt.items.length > 0 && (
            <div className="px-4 py-2">
               <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-[#3C3C431F] dark:border-white/5 divide-y divide-[#3C3C431F] dark:divide-white/5 shadow-sm">
                  {receipt.items.map((item, idx) => (
                    <div key={idx} className="p-5 flex justify-between items-center">
                      <div className="flex flex-col">
                         <span className="font-bold text-[17px] text-black dark:text-white">{item.name}</span>
                         <span className="text-[12px] text-[#8E8E93] font-medium">Qty: {item.quantity || 1}</span>
                      </div>
                      <span className="font-black text-[18px] text-black dark:text-white">{receipt.currency}{item.price.toFixed(2)}</span>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {receipt.image && (
            <div className="px-4 py-2">
              <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl overflow-hidden border border-[#3C3C431F] dark:border-white/5 shadow-lg min-h-[120px] flex items-center justify-center">
                {isPDF ? (
                   <div className="p-10 flex flex-col items-center">
                      <div className="text-5xl mb-4">📄</div>
                      <span className="text-[15px] font-bold text-[#8E8E93]">PDF Attachment</span>
                      <button onClick={() => window.open(receipt.image, '_blank')} className="mt-4 text-[#007AFF] font-bold">View Document</button>
                   </div>
                ) : (
                   <img src={receipt.image} alt="Receipt proof" className="w-full h-full object-contain" />
                )}
              </div>
            </div>
          )}

          <div className="px-4 py-8 space-y-4">
            <button onClick={() => storageService.exportToPDF(receipt)} className="w-full py-5 bg-[#1C1C1E] dark:bg-white text-white dark:text-black rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all">Export Summary PDF</button>
            <button onClick={() => {
              if(confirm('Delete this record permanently?')) {
                storageService.deleteReceipt(receipt.id);
                setReceipts(storageService.getReceipts());
                setSelectedReceipt(null);
              }
            }} className="w-full py-4 text-[#FF3B30] font-bold text-lg">Remove Transaction</button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (selectedReceipt) return renderDetailView(selectedReceipt);
    if (manualInitialData !== null) return <ManualEntryForm />;

    switch (activeTab) {
      case 'Receipts': return <LibraryScreen receipts={receipts} onSelect={setSelectedReceipt} />;
      case 'Scan': return <ScannerScreen onCapture={handleCapture} onCancel={() => setActiveTab('Receipts')} onManualEntry={(data) => setManualInitialData(data || {})} />;
      case 'Analytics': return <AnalyticsScreen receipts={receipts} />;
      case 'Settings': return <SettingsScreen settings={settings} onUpdateSettings={handleUpdateSettings} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F2F2F7] dark:bg-black relative overflow-hidden shadow-2xl">
      {isNavigating && <LoadingOverlay />}
      {renderContent()}
      {!selectedReceipt && manualInitialData === null && <TabBar activeTab={activeTab} onTabChange={handleTabChange} />}
    </div>
  );
};

export default App;
