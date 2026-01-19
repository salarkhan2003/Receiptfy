
import { Receipt, AppSettings } from "../types";

const STORAGE_KEY = 'ios_receiptify_tracker_data';
const SETTINGS_KEY = 'ios_receiptify_tracker_settings';

const DEFAULT_SETTINGS: AppSettings = {
  currencySymbol: '₹',
  currencyCode: 'INR',
  theme: 'system'
};

export const storageService = {
  getReceipts: (): Receipt[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveReceipt: (receipt: Receipt) => {
    const receipts = storageService.getReceipts();
    const existingIndex = receipts.findIndex(r => r.id === receipt.id);
    if (existingIndex > -1) {
      receipts[existingIndex] = receipt;
    } else {
      receipts.unshift(receipt);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
  },

  deleteReceipt: (id: string) => {
    const receipts = storageService.getReceipts().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
  },

  getSettings: (): AppSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    storageService.applyTheme(settings);
  },

  applyTheme: (settings: AppSettings) => {
    const isDark = settings.theme === 'dark' || 
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#000000');
    } else {
      document.documentElement.classList.remove('dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2F2F7');
    }
  },

  exportData: () => {
    const receipts = storageService.getReceipts();
    const settings = storageService.getSettings();
    const dataToExport = {
      receipts,
      settings,
      exportedAt: new Date().toISOString(),
      app: 'Receiptify iOS'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receiptify_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportAllToPDF: () => {
    const receipts = storageService.getReceipts();
    if (receipts.length === 0) {
      alert("No receipts to export.");
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const totalSpent = receipts.reduce((sum, r) => sum + r.total, 0);
    const settings = storageService.getSettings();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Aggregate Report - Receiptify</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1c1c1e; line-height: 1.5; }
            .header { border-bottom: 3px solid #007AFF; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end; }
            .title h1 { margin: 0; color: #007AFF; font-size: 32px; font-weight: 800; letter-spacing: -1px; }
            .title p { margin: 4px 0 0; color: #8E8E93; font-weight: 600; text-transform: uppercase; font-size: 12px; }
            .summary-card { background: #F2F2F7; border-radius: 20px; padding: 32px; margin-bottom: 48px; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); }
            .receipt-row { border-bottom: 1px solid #E5E5EA; padding: 16px 0; display: flex; justify-content: space-between; align-items: center; }
            .receipt-row:last-child { border-bottom: none; }
            .receipt-info h3 { margin: 0; font-size: 17px; font-weight: 700; }
            .receipt-info p { margin: 2px 0 0; font-size: 14px; color: #8E8E93; font-weight: 500; }
            .receipt-amount { font-weight: 800; font-size: 18px; color: #000; }
            h2 { font-size: 22px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">
              <h1>Receiptify</h1>
              <p>Consolidated Expense Summary</p>
            </div>
            <div style="text-align: right">
              <p style="margin:0; font-weight:700; font-size: 18px;">${receipts.length} Documents</p>
              <p style="margin:0; font-size:13px; color:#8E8E93">Generated ${new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div class="summary-card">
            <div style="font-size: 13px; text-transform: uppercase; color: #8E8E93; font-weight: 700; margin-bottom: 12px;">Total Expenditure</div>
            <div style="font-size: 42px; font-weight: 800; color: #007AFF;">${settings.currencySymbol}${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>

          <h2>Archive History</h2>
          <div style="border-top: 1px solid #E5E5EA">
            ${receipts.map(r => `
              <div class="receipt-row">
                <div class="receipt-info">
                  <h3>${r.merchant}</h3>
                  <p>${new Date(r.date).toLocaleDateString()} &bull; ${r.category}</p>
                </div>
                <div class="receipt-amount">${r.currency}${r.total.toFixed(2)}</div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  },

  exportToPDF: (receipt: Receipt) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${receipt.merchant}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1c1c1e; }
            .brand { color: #007AFF; font-size: 24px; font-weight: 800; margin-bottom: 40px; }
            .hero { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
            .merchant h2 { margin: 0; font-size: 32px; font-weight: 800; }
            .total-box { background: #007AFF; color: white; padding: 24px; border-radius: 16px; text-align: right; }
            .total-box div { font-size: 14px; font-weight: 600; opacity: 0.8; margin-bottom: 4px; }
            .total-box span { font-size: 36px; font-weight: 800; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { text-align: left; border-bottom: 2px solid #E5E5EA; padding: 12px; color: #8E8E93; font-size: 12px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #E5E5EA; font-size: 15px; }
            .summary { margin-top: 30px; width: 300px; margin-left: auto; }
            .summary-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #E5E5EA; }
            .summary-row.final { border-bottom: none; font-weight: 800; font-size: 18px; margin-top: 10px; color: #007AFF; }
          </style>
        </head>
        <body>
          <div class="brand">Receiptify</div>
          <div class="hero">
            <div class="merchant">
              <h2>${receipt.merchant}</h2>
              <p>${receipt.date} &bull; ${receipt.category}</p>
              <p style="font-size: 12px; color: #8E8E93;">ID: ${receipt.id.toUpperCase()}</p>
            </div>
            <div class="total-box">
              <div>Amount Paid</div>
              <span>${receipt.currency}${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          ${receipt.items && receipt.items.length > 0 ? `
            <table>
              <thead>
                <tr><th>Description</th><th style="text-align: right">Price</th></tr>
              </thead>
              <tbody>
                ${receipt.items.map(i => `<tr><td>${i.name} ${i.quantity ? `x${i.quantity}` : ''}</td><td style="text-align: right">${receipt.currency}${i.price.toFixed(2)}</td></tr>`).join('')}
              </tbody>
            </table>
          ` : ''}

          <div class="summary">
            <div class="summary-row"><span>Subtotal</span><span>${receipt.currency}${(receipt.subtotal || receipt.total - receipt.tax).toFixed(2)}</span></div>
            ${receipt.taxes ? receipt.taxes.map(t => `<div class="summary-row"><span>${t.name}</span><span>+${receipt.currency}${t.amount.toFixed(2)}</span></div>`).join('') : `<div class="summary-row"><span>Tax</span><span>+${receipt.currency}${receipt.tax.toFixed(2)}</span></div>`}
            ${receipt.serviceCharge ? `<div class="summary-row"><span>Service Charge</span><span>+${receipt.currency}${receipt.serviceCharge.toFixed(2)}</span></div>` : ''}
            ${receipt.discount ? `<div class="summary-row" style="color:#FF3B30"><span>Discount</span><span>-${receipt.currency}${Math.abs(receipt.discount).toFixed(2)}</span></div>` : ''}
            <div class="summary-row final"><span>Total Paid</span><span>${receipt.currency}${receipt.total.toFixed(2)}</span></div>
          </div>

          ${receipt.image ? `<div style="margin-top:50px; text-align:center;"><img src="${receipt.image}" style="max-width:100%; border-radius:12px; border:1px solid #E5E5EA;" /></div>` : ''}
          <footer style="margin-top: 100px; text-align: center; color: #8E8E93; font-size: 12px;">Generated by Receiptify iOS</footer>
          <script>setTimeout(() => window.print(), 500);</script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
};
