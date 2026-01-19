
import React from 'react';
import { COLORS } from '../../constants';

interface NavBarProps {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  largeTitle?: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ title, leftAction, rightAction, largeTitle = true }) => {
  return (
    <div className="sticky top-0 z-40 w-full">
      <div className="ios-blur bg-white/80 dark:bg-black/80 pt-[env(safe-area-inset-top)] border-b-[0.5px] border-[#3C3C4320] dark:border-[#EBEBF520]">
        <div className="flex items-center justify-between h-11 px-4">
          <div className="w-20 flex justify-start text-[#007AFF] text-[17px] font-normal">
            {leftAction}
          </div>
          {!largeTitle && (
            <div className="flex-1 text-center font-semibold text-[17px] truncate px-2">
              {title}
            </div>
          )}
          <div className="w-20 flex justify-end text-[#007AFF] text-[17px] font-normal">
            {rightAction}
          </div>
        </div>
        {largeTitle && (
          <div className="px-4 pb-2 pt-1">
            <h1 className="text-[34px] font-bold tracking-tight">
              {title}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};
