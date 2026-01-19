
import React, { useState, useRef } from 'react';
import { NavBar } from '../components/ios/NavBar';
import { LoadingOverlay } from '../components/ios/ActivityIndicator';
import { extractReceiptData } from '../services/geminiService';
import { Receipt, Category } from '../types';
import { storageService } from '../services/storageService';

interface ScannerScreenProps {
  onCapture: (receipt: Receipt) => void;
  onCancel: () => void;
  onManualEntry: (initialData?: Partial<Receipt>) => void;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({ onCapture, onCancel, onManualEntry }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const optimizeImage = (file: File): Promise<{ dataUrl: string; mimeType: string }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve({ dataUrl, mimeType: 'image/jpeg' });
      };
    });
  };

  const processFile = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      let base64Data: string;
      let mimeType: string = file.type;

      if (file.type.startsWith('image/')) {
        const optimized = await optimizeImage(file);
        base64Data = optimized.dataUrl;
        mimeType = optimized.mimeType;
      } else {
        const reader = new FileReader();
        const readPromise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        base64Data = await readPromise;
      }

      // Check if API Key exists, if not skip AI and go straight to manual
      if (!process.env.API_KEY) {
        console.warn("API Key missing, skipping AI extraction.");
        onManualEntry({ image: base64Data, merchant: file.name.split('.')[0] });
        return;
      }

      const ocrData = await extractReceiptData(base64Data, mimeType);
      const settings = storageService.getSettings();

      const newReceipt: Receipt = {
        id: crypto.randomUUID(),
        merchant: ocrData.merchant || file.name.split('.')[0] || 'Unknown Merchant',
        date: ocrData.date || new Date().toISOString().split('T')[0],
        total: ocrData.total || 0,
        subtotal: ocrData.subtotal,
        tax: ocrData.tax || 0,
        taxRate: ocrData.taxRate,
        taxes: ocrData.taxes || [],
        paymentMethod: ocrData.paymentMethod,
        items: ocrData.items,
        currency: settings.currencySymbol,
        category: (ocrData.category as Category) || 'Others',
        image: base64Data,
        isReimbursed: false,
        isFavorite: false,
        createdAt: Date.now()
      };
      onCapture(newReceipt);
    } catch (err) {
      console.error("OCR/AI Error:", err);
      // Fail gracefully: fallback to manual entry with the image/doc preserved
      const reader = new FileReader();
      reader.onload = () => {
        onManualEntry({ image: reader.result as string, merchant: file.name.split('.')[0] });
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 bg-black flex flex-col relative h-full">
      <NavBar 
        title="Import Receipt" 
        largeTitle={false}
        leftAction={<button onClick={onCancel} className="text-[#007AFF] font-medium">Cancel</button>}
      />
      
      {isProcessing && <LoadingOverlay message="AI Extracting Details..." />}

      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 overflow-y-auto pb-32">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] rounded-[28px] flex items-center justify-center mx-auto shadow-2xl transform hover:rotate-6 transition-transform">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M7 3H5C3.89543 3 3 3.89543 3 5V7M17 3H19C20.1046 3 21 3.89543 21 5V7M21 17V19C21 20.1046 20.1046 21 19 21H17M7 21H5C3.89543 21 3 20.1046 3 19V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
             </svg>
          </div>
          <h2 className="text-white text-[28px] font-black tracking-tighter">Capture & Log</h2>
          <p className="text-[#8E8E93] text-[15px] font-medium px-4">Instant AI extraction or manual archive.</p>
        </div>

        <div className="w-full space-y-3 max-w-sm">
          <button 
            onClick={() => cameraInputRef.current?.click()}
            className="w-full bg-white text-black py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98] transition-all flex items-center justify-center space-x-3 shadow-lg"
          >
            <span className="text-xl">📸</span>
            <span>Camera Scan</span>
          </button>
          
          <button 
            onClick={() => galleryInputRef.current?.click()}
            className="w-full bg-[#1C1C1E] text-white py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98] transition-all flex items-center justify-center space-x-3 border border-white/10 shadow-lg"
          >
            <span className="text-xl">🖼️</span>
            <span>Photo Library</span>
          </button>

          <button 
            onClick={() => pdfInputRef.current?.click()}
            className="w-full bg-[#1C1C1E] text-white py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98] transition-all flex items-center justify-center space-x-3 border border-white/10 shadow-lg"
          >
            <span className="text-xl">📄</span>
            <span>Import Document (PDF)</span>
          </button>

          <div className="pt-8 text-center">
            <div className="h-[1px] bg-white/10 w-full mb-6 relative">
               <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4 text-[#8E8E93] text-[11px] font-black uppercase tracking-[0.2em]">Quick Action</span>
            </div>
            <button 
              onClick={() => onManualEntry()}
              className="text-[#007AFF] text-[17px] font-bold active:opacity-60 transition-opacity flex items-center justify-center w-full space-x-2"
            >
              <span>Manual Entry Without AI</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7H13M13 7L9 3M13 7L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Inputs */}
      <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={(e) => processFile(e.target.files?.[0]!)} className="hidden" />
      <input type="file" accept="image/*" ref={galleryInputRef} onChange={(e) => processFile(e.target.files?.[0]!)} className="hidden" />
      <input type="file" accept="application/pdf" ref={pdfInputRef} onChange={(e) => processFile(e.target.files?.[0]!)} className="hidden" />
    </div>
  );
};
