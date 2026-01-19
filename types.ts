
export type Category = 'Food' | 'Travel' | 'Shopping' | 'Utilities' | 'Health' | 'Entertainment' | 'Others';

export interface ReceiptItem {
  name: string;
  price: number;
  quantity?: number;
}

export interface TaxDetail {
  name: string;
  amount: number;
  rate?: number;
}

export interface Receipt {
  id: string;
  merchant: string;
  date: string;
  total: number;
  subtotal?: number;
  tax: number;
  taxRate?: number;
  taxes?: TaxDetail[]; // New: Detailed tax breakdown (GST, SGST, etc)
  serviceCharge?: number;
  discount?: number;
  paymentMethod?: string;
  items?: ReceiptItem[];
  currency: string;
  category: Category;
  image?: string;
  notes?: string;
  isReimbursed: boolean;
  isFavorite: boolean;
  createdAt: number;
}

export type TabType = 'Receipts' | 'Scan' | 'Analytics' | 'Settings';

export interface OCRResult {
  merchant?: string;
  date?: string;
  total?: number;
  subtotal?: number;
  tax?: number;
  taxRate?: number;
  taxes?: TaxDetail[];
  serviceCharge?: number;
  discount?: number;
  paymentMethod?: string;
  category?: Category;
  items?: ReceiptItem[];
}

export interface AppSettings {
  currencySymbol: string;
  currencyCode: string;
  theme: 'system' | 'light' | 'dark';
}
