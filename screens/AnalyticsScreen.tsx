
import React, { useMemo } from 'react';
import { NavBar } from '../components/ios/NavBar';
import { ListSection, ListItem } from '../components/ios/List';
import { Receipt } from '../types';
import { CATEGORIES } from '../constants';
import { storageService } from '../services/storageService';

export const AnalyticsScreen: React.FC<{ receipts: Receipt[] }> = ({ receipts }) => {
  const settings = storageService.getSettings();
  
  const stats = useMemo(() => {
    const total = receipts.reduce((sum, r) => sum + r.total, 0);
    const byCategory: Record<string, number> = {};
    
    receipts.forEach(r => {
      byCategory[r.category] = (byCategory[r.category] || 0) + r.total;
    });

    const sortedCategories = CATEGORIES.map(cat => ({
      ...cat,
      amount: byCategory[cat.name] || 0,
      percentage: total > 0 ? ((byCategory[cat.name] || 0) / total) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);

    return { total, byCategory, sortedCategories };
  }, [receipts]);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <NavBar title="Analytics" />
      
      {/* Primary Card */}
      <div className="px-4 py-6">
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-8 text-center space-y-1 shadow-sm border-[0.5px] border-[#3C3C431F] dark:border-[#EBEBF51F]">
          <p className="text-[#3C3C4399] dark:text-[#EBEBF599] text-[13px] font-bold uppercase tracking-widest mb-2">Total Monthly Expenditure</p>
          <h2 className="text-[48px] font-black tracking-tighter text-black dark:text-white leading-none">
            <span className="text-[24px] font-bold align-top mt-2 inline-block mr-1">{settings.currencySymbol}</span>
            {stats.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            <span className="text-[20px] font-bold opacity-30">.{stats.total.toFixed(2).split('.')[1]}</span>
          </h2>
          <div className="pt-6 flex justify-center space-x-1 h-12 items-end">
            {stats.sortedCategories.map((cat, idx) => (
              <div 
                key={cat.name}
                className="w-4 rounded-t-sm transition-all duration-700"
                style={{ 
                  height: `${Math.max(10, cat.percentage)}%`, 
                  backgroundColor: cat.color,
                  opacity: 1 - (idx * 0.1)
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <ListSection title="Distribution">
        {stats.sortedCategories.map(cat => {
          if (cat.amount === 0) return null;
          return (
            <ListItem
              key={cat.name}
              title={cat.name}
              detail={`${settings.currencySymbol}${cat.amount.toFixed(2)}`}
              subtitle={`${cat.percentage.toFixed(1)}% of total`}
              accessory={false}
              icon={
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: cat.color }}>
                  {cat.name[0]}
                </div>
              }
            />
          );
        })}
      </ListSection>

      <div className="px-4 pb-10">
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 border border-[#3C3C431F] dark:border-white/5 shadow-sm">
          <p className="mb-4 font-extrabold text-[17px] text-black dark:text-white tracking-tight">Financial Insights</p>
          <div className="space-y-4">
             <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF] mt-1.5" />
                <p className="flex-1 text-[15px] text-[#3C3C4399] dark:text-[#EBEBF599]">
                  Most of your spending goes to <span className="text-black dark:text-white font-bold">{stats.sortedCategories[0]?.name || 'N/A'}</span>.
                </p>
             </div>
             <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34C759] mt-1.5" />
                <p className="flex-1 text-[15px] text-[#3C3C4399] dark:text-[#EBEBF599]">
                   You've processed <span className="text-black dark:text-white font-bold">{receipts.length} transactions</span> this billing period.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
