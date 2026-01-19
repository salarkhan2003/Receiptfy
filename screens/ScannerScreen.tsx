
import React, { useState, useRef } from 'react';
import { NavBar } from '../components/ios/NavBar';
import { LoadingOverlay } from '../components/ios/ActivityIndicator';
import { extractReceiptData } from '../services/geminiService';
import { Receipt, Category } from '../types';
import { storageService } from '../services/storageService';

interface ScannerScreenProps {
  onCapture: (receipt: Receipt) => void;
  onCancel: () => void;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({ onCapture, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Helper to compress and resize image for ultra-fast OCR processing
  const optimizeImage = (file: File): Promise<{ dataUrl: string; mimeType: string }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Target reasonable resolution for OCR (max 1200px side)
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
        
        // Export as JPEG with 0.8 quality to keep file size small but details sharp
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
      let mimeType: string;

      if (file.type.startsWith('image/')) {
        // High-speed optimization: resize before sending
        const optimized = await optimizeImage(file);
        base64Data = optimized.dataUrl;
        mimeType = optimized.mimeType;
      } else {
        // For PDFs, just read directly
        const reader = new FileReader();
        const readPromise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        base64Data = await readPromise;
        mimeType = file.type;
      }

      const ocrData = await extractReceiptData(base64Data, mimeType);
      
      const merchant = ocrData.merchant || file.name.split('.')[0] || 'Unknown Merchant';
      const total = typeof ocrData.total === 'number' ? ocrData.total : 0;
      const tax = typeof ocrData.tax === 'number' ? ocrData.tax : 0;
      
      const settings = storageService.getSettings();

      const newReceipt: Receipt = {
        id: crypto.randomUUID(),
        merchant: merchant,
        date: ocrData.date || new Date().toISOString().split('T')[0],
        total: total,
        tax: tax,
        taxRate: ocrData.taxRate,
        paymentMethod: ocrData.paymentMethod,
        items: ocrData.items,
        currency: settings.currencySymbol,
        category: (ocrData.category as Category) || 'Others',
        image: base64Data, // We save the optimized (smaller) version for faster loads
        isReimbursed: false,
        isFavorite: false,
        createdAt: Date.now()
      };

      onCapture(newReceipt);
    } catch (err) {
      console.error("Fast OCR Error:", err);
      alert("Extraction failed. Please ensure the image is clear and you are online.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="flex-1 bg-black flex flex-col relative h-full">
      <NavBar 
        title="Quick Import" 
        largeTitle={false}
        leftAction={<button onClick={onCancel} className="text-[#007AFF] font-medium">Cancel</button>}
      />
      
      {isProcessing && <LoadingOverlay message="AI Extraction..." />}

      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-10 overflow-y-auto">
        <div className="text-center space-y-4">
          <div className="w-28 h-28 bg-gradient-to-br from-[#007AFF] to-[#5856D6] rounded-[32px] flex items-center justify-center mx-auto shadow-[0_25px_50px_-12px_rgba(0,122,255,0.5)] transform rotate-3">
             <div className="bg-black/10 w-full h-full rounded-[32px] flex items-center justify-center">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M7 3H5C3.89543 3 3 3.89543 3 5V7M17 3H19C20.1046 3 21 3.89543 21 5V7M21 17V19C21 20.1046 20.1046 21 19 21H17M7 21H5C3.89543 21 3 20.1046 3 19V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M7 12H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
                </svg>
             </div>
          </div>
          <h2 className="text-white text-[32px] font-black tracking-tighter leading-none pt-4">Instant Scan</h2>
          <p className="text-[#8E8E93] text-[17px] font-semibold max-w-[280px] mx-auto opacity-80">
            Powered by Gemini 3 Flash for zero-lag documentation.
          </p>
        </div>

        <div className="w-full space-y-3.5 pb-12 max-w-sm">
          <button 
            onClick={() => cameraInputRef.current?.click()}
            className="w-full bg-white text-black py-4.5 rounded-[22px] text-[18px] font-bold active:scale-[0.96] transition-all flex items-center justify-center space-x-3 shadow-2xl"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
              <path fillRule="evenodd" d="M9.344 3.071a2.25 2.25 0 012.232-1.321h.848a2.25 2.25 0 012.232 1.321l.657 1.625h4.437A2.25 2.25 0 0122 6.926v11.648a2.25 2.25 0 01-2.25 2.25H4.25A2.25 2.25 0 012 18.574V6.926a2.25 2.25 0 012.25-2.25h4.437l.657-1.605zM12 7.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z" clipRule="evenodd" />
            </svg>
            <span>Take Photo</span>
          </button>
          
          <button 
            onClick={() => galleryInputRef.current?.click()}
            className="w-full bg-[#1C1C1E] text-white py-4.5 rounded-[22px] text-[18px] font-bold active:scale-[0.96] transition-all flex items-center justify-center space-x-3 border border-white/5"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
            </svg>
            <span>Choose Image</span>
          </button>

          <button 
            onClick={() => pdfInputRef.current?.click()}
            className="w-full bg-transparent text-[#8E8E93] py-3 rounded-[22px] text-[15px] font-bold active:opacity-60 transition-all flex items-center justify-center space-x-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span>Import PDF File</span>
          </button>
        </div>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={cameraInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      <input 
        type="file" 
        accept="image/*" 
        ref={galleryInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      <input 
        type="file" 
        accept="application/pdf" 
        ref={pdfInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );
};
