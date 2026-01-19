
import React from 'react';

export const ActivityIndicator: React.FC<{ size?: number; color?: string }> = ({ 
  size = 24, 
  color = 'currentColor' 
}) => {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        className="animate-ios-spinner"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[...Array(8)].map((_, i) => (
          <rect
            key={i}
            x="11"
            y="2"
            width="2"
            height="6"
            rx="1"
            fill={color}
            transform={`rotate(${i * 45} 12 12)`}
            style={{ opacity: 1 - i * 0.1 }}
          />
        ))}
      </svg>
      <style>{`
        @keyframes ios-spinner {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-ios-spinner {
          animation: ios-spinner 0.8s steps(8) infinite;
        }
      `}</style>
    </div>
  );
};

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center ios-blur bg-white/60 dark:bg-black/60 transition-opacity duration-300">
      <div className="bg-white/90 dark:bg-[#1C1C1E]/90 p-8 rounded-[20px] shadow-2xl flex flex-col items-center space-y-4 border border-white/20">
        <ActivityIndicator size={32} color="#007AFF" />
        {message && (
          <p className="text-[17px] font-semibold text-black dark:text-white tracking-tight">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
