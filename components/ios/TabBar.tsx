
import React from 'react';
import { TabType } from '../../types';
import { COLORS, Icons } from '../../constants';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabType[] = ['Receipts', 'Scan', 'Analytics', 'Settings'];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="ios-blur bg-white/80 dark:bg-black/80 border-t-[0.5px] border-[#3C3C4320] dark:border-[#EBEBF520] safe-area-bottom">
        <div className="flex justify-around h-[50px] items-center">
          {tabs.map((tab) => {
            const Icon = Icons[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`flex flex-col items-center justify-center flex-1 space-y-0.5 ${
                  isActive ? 'text-[#007AFF]' : 'text-[#8E8E93]'
                }`}
              >
                <Icon active={isActive} />
                <span className="text-[10px] font-medium">{tab}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
