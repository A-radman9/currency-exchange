/**
 * قائمة العملات الأجنبية المعتمدة في المملكة العربية السعودية
 * مع أسعار الشراء الافتراضية والفئات النقدية الشائعة
 */

export const DEFAULT_CURRENCIES = [
  {
    code: 'USD',
    nameAr: 'دولار أمريكي',
    nameEn: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    defaultRate: 3.7500,
    denominations: [5, 10, 20, 50, 100],
    isPopular: true
  },
  {
    code: 'EUR',
    nameAr: 'يورو أوروبي',
    nameEn: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    defaultRate: 4.0500,
    denominations: [5, 10, 20, 50, 100, 200],
    isPopular: true
  },
  {
    code: 'GBP',
    nameAr: 'جنيه إسترليني',
    nameEn: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    defaultRate: 4.8500,
    denominations: [5, 10, 20, 50],
    isPopular: true
  },
  {
    code: 'AED',
    nameAr: 'درهم إماراتي',
    nameEn: 'UAE Dirham',
    symbol: 'د.إ',
    flag: '🇦🇪',
    defaultRate: 1.0200,
    denominations: [5, 10, 20, 50, 100, 200, 500],
    isPopular: true
  },
  {
    code: 'KWD',
    nameAr: 'دينار كويتي',
    nameEn: 'Kuwaiti Dinar',
    symbol: 'د.ك',
    flag: '🇰🇼',
    defaultRate: 12.1000,
    denominations: [1, 5, 10, 20],
    isPopular: true
  },
  {
    code: 'BHD',
    nameAr: 'دينار بحريني',
    nameEn: 'Bahraini Dinar',
    symbol: 'د.ب',
    flag: '🇧🇭',
    defaultRate: 9.9500,
    denominations: [1, 5, 10, 20],
    isPopular: true
  },
  {
    code: 'OMR',
    nameAr: 'ريال عماني',
    nameEn: 'Omani Rial',
    symbol: 'ر.ع',
    flag: '🇴🇲',
    defaultRate: 9.7500,
    denominations: [1, 5, 10, 20, 50],
    isPopular: true
  },
  {
    code: 'QAR',
    nameAr: 'ريال قطري',
    nameEn: 'Qatari Riyal',
    symbol: 'ر.ق',
    flag: '🇶🇦',
    defaultRate: 1.0300,
    denominations: [1, 5, 10, 50, 100, 500],
    isPopular: true
  },
  {
    code: 'EGP',
    nameAr: 'جنيه مصري',
    nameEn: 'Egyptian Pound',
    symbol: 'ج.م',
    flag: '🇪🇬',
    defaultRate: 0.0760,
    denominations: [10, 20, 50, 100, 200],
    isPopular: true
  },
  {
    code: 'JOD',
    nameAr: 'دينار أردني',
    nameEn: 'Jordanian Dinar',
    symbol: 'د.أ',
    flag: '🇯🇴',
    defaultRate: 5.2900,
    denominations: [1, 5, 10, 20, 50],
    isPopular: false
  },
  {
    code: 'INR',
    nameAr: 'روبية هندية',
    nameEn: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    defaultRate: 0.0435,
    denominations: [50, 100, 200, 500],
    isPopular: false
  },
  {
    code: 'PHP',
    nameAr: 'بيزو فلبيني',
    nameEn: 'Philippine Peso',
    symbol: '₱',
    flag: '🇵🇭',
    defaultRate: 0.0650,
    denominations: [20, 50, 100, 500, 1000],
    isPopular: false
  },
  {
    code: 'PKR',
    nameAr: 'روبية باكستانية',
    nameEn: 'Pakistani Rupee',
    symbol: '₨',
    flag: '🇵🇰',
    defaultRate: 0.0135,
    denominations: [100, 500, 1000, 5000],
    isPopular: false
  },
  {
    code: 'TRY',
    nameAr: 'ليرة تركية',
    nameEn: 'Turkish Lira',
    symbol: '₺',
    flag: '🇹🇷',
    defaultRate: 0.1080,
    denominations: [50, 100, 200],
    isPopular: false
  },
  {
    code: 'CHF',
    nameAr: 'فرنك سويسري',
    nameEn: 'Swiss Franc',
    symbol: 'Fr',
    flag: '🇨🇭',
    defaultRate: 4.2500,
    denominations: [10, 20, 50, 100, 200],
    isPopular: false
  },
  {
    code: 'CAD',
    nameAr: 'دولار كندي',
    nameEn: 'Canadian Dollar',
    symbol: 'C$',
    flag: '🇨🇦',
    defaultRate: 2.7000,
    denominations: [5, 10, 20, 50, 100],
    isPopular: false
  }
];

/**
 * الفئات النقدية الرسمية المتداولة في المملكة العربية السعودية
 * مرتبة تنازلياً لحساب الباقي الدقيق
 */
export const SAUDI_DENOMINATIONS = [
  { value: 500, type: 'note', labelAr: '500 ريال', color: '#1d5a7d' },
  { value: 200, type: 'note', labelAr: '200 ريال', color: '#886241' },
  { value: 100, type: 'note', labelAr: '100 ريال', color: '#b93a38' },
  { value: 50, type: 'note', labelAr: '50 ريال', color: '#3d6c54' },
  { value: 20, type: 'note', labelAr: '20 ريال', color: '#444c68' },
  { value: 10, type: 'note', labelAr: '10 ريال', color: '#9c6644' },
  { value: 5, type: 'note', labelAr: '5 ريال', color: '#566679' },
  { value: 2, type: 'coin', labelAr: '2 ريال (معدني)', color: '#c59b27' },
  { value: 1, type: 'coin', labelAr: '1 ريال (معدني)', color: '#d4af37' },
  { value: 0.50, type: 'coin', labelAr: '50 هللة (نصف ريال)', color: '#b0b0b0' },
  { value: 0.25, type: 'coin', labelAr: '25 هللة (ربع ريال)', color: '#c0c0c0' }
];
