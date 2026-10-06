/**
 * إدارة التخزين المحلي (LocalStorage) لأسعار الصرف وإعدادات الصندوق وسجل عمليات الشفت
 */

import { DEFAULT_CURRENCIES } from './currencies.js';

const STORAGE_KEYS = {
  RATES: 'sar_cashier_rates_v1',
  SETTINGS: 'sar_cashier_settings_v1',
  TRANSACTIONS: 'sar_cashier_shift_transactions_v1',
  HISTORY: 'sar_cashier_closed_shifts_history_v1'
};

const DEFAULT_SETTINGS = {
  storeName: 'متجر التميز التجاري',
  cashierName: 'كاشير الصندوق #1',
  branchName: 'الفرع الرئيسي',
  vatNumber: '310000000000003',
  adminPin: '1234',
  soundEnabled: true,
  speechEnabled: false,
  theme: 'dark' // 'dark' | 'light'
};

/**
 * جلب أسعار الصرف الحالية
 */
export function getStoredRates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RATES);
    if (!raw) {
      saveStoredRates(DEFAULT_CURRENCIES);
      return DEFAULT_CURRENCIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CURRENCIES;
  } catch (e) {
    console.error('Error reading rates:', e);
    return DEFAULT_CURRENCIES;
  }
}

/**
 * حفظ قائمة أسعار الصرف
 */
export function saveStoredRates(currencies) {
  try {
    localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(currencies));
  } catch (e) {
    console.error('Error saving rates:', e);
  }
}

/**
 * تحديث سعر صرف لعملة معينة
 */
export function updateCurrencyRate(code, newRate) {
  const currencies = getStoredRates();
  const index = currencies.findIndex(c => c.code === code);
  if (index !== -1) {
    currencies[index].defaultRate = parseFloat(newRate);
    saveStoredRates(currencies);
    return true;
  }
  return false;
}

/**
 * إعادة تعيين أسعار الصرف للقيم القياسية الافتراضية
 */
export function resetRatesToDefault() {
  saveStoredRates(DEFAULT_CURRENCIES);
  return DEFAULT_CURRENCIES;
}

/**
 * جلب إعدادات النظام
 */
export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

/**
 * حفظ إعدادات النظام
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

/**
 * جلب قائمة عمليات الشفت الحالي
 */
export function getShiftTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * إضافة عملية جديدة لسجل الشفت
 */
export function logTransaction(txData) {
  const transactions = getShiftTransactions();
  const txNumber = transactions.length + 1;
  const dateObj = new Date();

  const newTx = {
    id: `TX-${String(txNumber).padStart(4, '0')}`,
    timestamp: dateObj.toISOString(),
    displayTime: dateObj.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    displayDate: dateObj.toLocaleDateString('ar-SA'),
    ...txData
  };

  transactions.unshift(newTx); // الأحدث في البداية
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Error logging tx:', e);
  }
  return newTx;
}

/**
 * حذف عملية محددة
 */
export function deleteTransaction(txId) {
  const transactions = getShiftTransactions().filter(t => t.id !== txId);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  return transactions;
}

/**
 * احتساب ملخص ومطابقة الصندوق للشفت الحالي
 */
export function calculateShiftSummary() {
  const transactions = getShiftTransactions();
  
  const foreignSummary = {};
  let totalSARCollected = 0;
  let totalBillSAR = 0;
  let totalChangeHandedSAR = 0;

  for (const tx of transactions) {
    // تجميع العملات الأجنبية في الدرج
    if (!foreignSummary[tx.currencyCode]) {
      foreignSummary[tx.currencyCode] = {
        code: tx.currencyCode,
        nameAr: tx.currencyNameAr,
        flag: tx.flag || '',
        totalAmount: 0,
        sarEquivalent: 0
      };
    }
    foreignSummary[tx.currencyCode].totalAmount += (tx.foreignAmount || 0);
    foreignSummary[tx.currencyCode].sarEquivalent += (tx.totalSAR || 0);

    totalSARCollected += (tx.totalSAR || 0);
    totalBillSAR += (tx.billAmount || 0);
    totalChangeHandedSAR += (tx.changeSAR || 0);
  }

  return {
    totalCount: transactions.length,
    foreignCurrencies: Object.values(foreignSummary),
    totalSARCollected: Math.round(totalSARCollected * 100) / 100,
    totalBillSAR: Math.round(totalBillSAR * 100) / 100,
    totalChangeHandedSAR: Math.round(totalChangeHandedSAR * 100) / 100,
    netSAROutflow: Math.round(totalChangeHandedSAR * 100) / 100
  };
}

/**
 * إغلاق الشفت الحالي وحفظه في الأرشيف
 */
export function closeShift() {
  const transactions = getShiftTransactions();
  if (transactions.length === 0) return null;

  const summary = calculateShiftSummary();
  const shiftRecord = {
    closedAt: new Date().toISOString(),
    displayClosed: new Date().toLocaleString('ar-SA'),
    transactionsCount: transactions.length,
    summary,
    transactions
  };

  try {
    const rawHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const history = rawHistory ? JSON.parse(rawHistory) : [];
    history.unshift(shiftRecord);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 30))); // حفظ آخر 30 شفت
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([])); // تصفير الشفت الحالي
  } catch (e) {
    console.error('Error closing shift:', e);
  }

  return shiftRecord;
}
