
import React from 'react';

export const COLORS = {
  blue: '#007AFF',
  green: '#34C759',
  red: '#FF3B30',
  orange: '#FF9500',
  gray: '#8E8E93',
  systemBackground: 'bg-[#F2F2F7] dark:bg-black',
  secondaryBackground: 'bg-white dark:bg-[#1C1C1E]',
  label: 'text-black dark:text-white',
  secondaryLabel: 'text-[#3C3C4399] dark:text-[#EBEBF599]',
};

export const CATEGORIES: { name: string; color: string }[] = [
  { name: 'Food', color: '#FF9500' },
  { name: 'Travel', color: '#007AFF' },
  { name: 'Shopping', color: '#AF52DE' },
  { name: 'Utilities', color: '#34C759' },
  { name: 'Health', color: '#FF2D55' },
  { name: 'Entertainment', color: '#5856D6' },
  { name: 'Others', color: '#8E8E93' },
];

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'AFN', symbol: '؋', name: 'Afghan Afghani' },
  { code: 'ALL', symbol: 'L', name: 'Albanian Lek' },
  { code: 'AMD', symbol: '֏', name: 'Armenian Dram' },
  { code: 'ANG', symbol: 'ƒ', name: 'Antillean Guilder' },
  { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  { code: 'AWG', symbol: 'ƒ', name: 'Aruban Florin' },
  { code: 'AZN', symbol: '₼', name: 'Azerbaijani Manat' },
  { code: 'BAM', symbol: 'KM', name: 'Bosnia-Herzegovina Mark' },
  { code: 'BBD', symbol: '$', name: 'Barbadian Dollar' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar' },
  { code: 'BIF', symbol: 'FBu', name: 'Burundian Franc' },
  { code: 'BMD', symbol: '$', name: 'Bermudan Dollar' },
  { code: 'BND', symbol: '$', name: 'Brunei Dollar' },
  { code: 'BOB', symbol: '$b', name: 'Bolivian Boliviano' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'BSD', symbol: '$', name: 'Bahamian Dollar' },
  { code: 'BTN', symbol: 'Nu.', name: 'Bhutanese Ngultrum' },
  { code: 'BWP', symbol: 'P', name: 'Botswanan Pula' },
  { code: 'BYN', symbol: 'Br', name: 'Belarusian Ruble' },
  { code: 'BZD', symbol: 'BZ$', name: 'Belize Dollar' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  { code: 'CRC', symbol: '₡', name: 'Costa Rican Colón' },
  { code: 'CUP', symbol: '₱', name: 'Cuban Peso' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'DOP', symbol: 'RD$', name: 'Dominican Peso' },
  { code: 'DZD', symbol: 'دج', name: 'Algerian Dinar' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
  { code: 'FJD', symbol: '$', name: 'Fijian Dollar' },
  { code: 'GEL', symbol: '₾', name: 'Georgian Lari' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
  { code: 'GMD', symbol: 'D', name: 'Gambian Dalasi' },
  { code: 'GNF', symbol: 'FG', name: 'Guinean Franc' },
  { code: 'GTQ', symbol: 'Q', name: 'Guatemalan Quetzal' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'HNL', symbol: 'L', name: 'Honduran Lempira' },
  { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
  { code: 'HTG', symbol: 'G', name: 'Haitian Gourde' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel' },
  { code: 'IQD', symbol: 'ع.د', name: 'Iraqi Dinar' },
  { code: 'IRR', symbol: '﷼', name: 'Iranian Rial' },
  { code: 'ISK', symbol: 'kr', name: 'Icelandic Króna' },
  { code: 'JMD', symbol: 'J$', name: 'Jamaican Dollar' },
  { code: 'JOD', symbol: 'JD', name: 'Jordanian Dinar' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'KGS', symbol: 'лв', name: 'Kyrgystani Som' },
  { code: 'KHR', symbol: '៛', name: 'Cambodian Riel' },
  { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar' },
  { code: 'KZT', symbol: 'лв', name: 'Kazakhstani Tenge' },
  { code: 'LBP', symbol: '£', name: 'Lebanese Pound' },
  { code: 'LKR', symbol: '₨', name: 'Sri Lankan Rupee' },
  { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
];

export const AppLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#007AFF"/>
    <path d="M12 10C10.8954 10 10 10.8954 10 12V28C10 29.1046 10.8954 30 12 30H28C29.1046 30 30 29.1046 30 28V12C30 10.8954 29.1046 10 28 10H12Z" fill="white" fillOpacity="0.2"/>
    <path d="M15 16H25M15 20H25M15 24H20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const Icons = {
  Receipts: ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? COLORS.blue : 'currentColor'}>
      <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20ZM16 11H8V9H16V11ZM16 15H8V13H16V15ZM12 19H8V17H12V19Z" />
    </svg>
  ),
  Scan: ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? COLORS.blue : 'currentColor'}>
      <path d="M12 8V16M8 12H16M4 8V4H8M16 4H20V8M20 16V20H16M8 20H4V16" stroke={active ? COLORS.blue : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  Analytics: ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? COLORS.blue : 'currentColor'}>
      <path d="M4 20H20V22H4V20ZM4 10H7V18H4V10ZM9 5H12V18H9V5ZM14 12H17V18H14V12ZM19 8H22V18H19V8Z" />
    </svg>
  ),
  Settings: ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? COLORS.blue : 'currentColor'}>
      <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
};
