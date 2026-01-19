
import React, { useState } from 'react';
import { NavBar } from '../components/ios/NavBar';
import { ListSection, ListItem } from '../components/ios/List';
import { storageService } from '../services/storageService';
import { AppLogo, CURRENCIES } from '../constants';
import { AppSettings } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, onUpdateSettings }) => {
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const handleCurrencySelect = (currency: { code: string, symbol: string }) => {
    onUpdateSettings({ ...settings, currencyCode: currency.code, currencySymbol: currency.symbol });
    setShowCurrencyPicker(false);
  };

  const toggleTheme = () => {
    const themes: AppSettings['theme'][] = ['system', 'light', 'dark'];
    const next = themes[(themes.indexOf(settings.theme) + 1) % themes.length];
    onUpdateSettings({ ...settings, theme: next });
  };

  if (showCurrencyPicker) {
    return (
      <div className="flex-1 flex flex-col bg-[#F2F2F7] dark:bg-black animate-in slide-in-from-bottom duration-300 z-[100]">
        <NavBar 
          title="Choose Currency" 
          largeTitle={false}
          leftAction={<button onClick={() => setShowCurrencyPicker(false)} className="text-[#007AFF]">Cancel</button>}
        />
        <div className="flex-1 overflow-y-auto pt-4 pb-20">
          <ListSection>
            {CURRENCIES.map(curr => (
              <ListItem 
                key={curr.code}
                title={`${curr.name} (${curr.code})`}
                detail={curr.symbol}
                accessory={settings.currencyCode === curr.code}
                onClick={() => handleCurrencySelect(curr)}
                icon={<div className="w-8 h-8 rounded-full bg-[#7676801F] flex items-center justify-center text-[14px] font-semibold">{curr.symbol}</div>}
              />
            ))}
          </ListSection>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <NavBar title="Settings" />
      
      <div className="flex flex-col items-center py-8 space-y-2">
        <AppLogo />
        <h2 className="text-[24px] font-bold tracking-tight">Receiptify</h2>
        <p className="text-[#8E8E93] text-[14px] font-medium">Version 1.4.2 &bull; PRO</p>
      </div>

      <ListSection title="Regional">
        <ListItem 
          title="Default Currency" 
          detail={`${settings.currencyCode} (${settings.currencySymbol})`} 
          onClick={() => setShowCurrencyPicker(true)}
        />
        <ListItem title="Expense Categories" detail="7 Managed" />
      </ListSection>

      <ListSection title="App Customization">
        <ListItem 
          title="Interface Appearance" 
          detail={settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)} 
          onClick={toggleTheme}
        />
        <ListItem title="App Icon" detail="Default" />
      </ListSection>

      <ListSection title="Reporting & Export">
        <ListItem 
          title="Consolidated PDF Report" 
          subtitle="Generate full summary of all records" 
          onClick={() => storageService.exportAllToPDF()}
          icon={<div className="text-[#007AFF] text-[20px]">📄</div>}
        />
        <ListItem 
          title="Legacy JSON Export" 
          subtitle="Developer backup format" 
          onClick={() => storageService.exportData()}
          icon={<div className="text-[#8E8E93] text-[20px]">⚙️</div>}
        />
      </ListSection>

      <ListSection title="Security & Data">
        <ListItem title="Local Sync" detail="Enabled" accessory={false} />
        <ListItem title="Data Ownership" subtitle="Stored on-device only" accessory={false} />
        <ListItem title="Privacy Policy" />
      </ListSection>

      <div className="px-4 py-10 text-center space-y-1">
        <p className="text-[13px] text-[#3C3C4399] dark:text-[#EBEBF599]">Crafted with Apple HIG & Gemini AI.</p>
        <p className="text-[13px] text-[#3C3C4399] dark:text-[#EBEBF599] font-semibold">Receiptify iOS</p>
      </div>
    </div>
  );
};
