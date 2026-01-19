
import React from 'react';

interface ListItemProps {
  title: string;
  subtitle?: string;
  detail?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  accessory?: boolean;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({ 
  title, subtitle, detail, icon, onClick, accessory = true, className = "" 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left flex items-center bg-white dark:bg-[#1C1C1E] active:bg-[#D1D1D6] dark:active:bg-[#3A3A3C] transition-colors ${className}`}
    >
      <div className="pl-4 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 flex items-center justify-between py-2.5 pr-4 ml-4 ios-list-separator min-h-[44px]">
        <div className="flex flex-col">
          <span className="text-[17px] font-normal leading-tight">{title}</span>
          {subtitle && <span className="text-[14px] text-[#3C3C4399] dark:text-[#EBEBF599] leading-tight">{subtitle}</span>}
        </div>
        <div className="flex items-center space-x-2">
          {detail && <span className="text-[17px] text-[#3C3C4399] dark:text-[#EBEBF599]">{detail}</span>}
          {accessory && (
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" className="text-[#C7C7CC]">
              <path d="M1.5 1L7 6.5L1.5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
    </button>
  );
};

export const ListSection: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="mb-8">
      {title && <h2 className="px-4 mb-2 text-[13px] font-normal uppercase tracking-wider text-[#3C3C4399] dark:text-[#EBEBF599]">{title}</h2>}
      <div className="overflow-hidden border-t-[0.5px] border-b-[0.5px] border-[#3C3C4320] dark:border-[#EBEBF520]">
        {children}
      </div>
    </div>
  );
};
