/**
 * محرك الحسابات المالية الدقيقة لنظام حماية الكاشير
 * جميع العمليات الحسابية الوسيطة تتم بالهللات كأعداد صحيحة لمنع أي خطأ تقريب
 */

import { tafqeetSAR, tafqeetForeign } from './tafqeet.js';
import { SAUDI_DENOMINATIONS } from './currencies.js';

/**
 * حساب تفكيك الفئات النقدية السعودية للباقي المستحق للعميل
 * @param {number} changeSAR المبلغ المستحق إرجاعه للعميل بالريال السعودي
 * @returns {Array} مصفوفة الفئات النقدية وعدد كل فئة
 */
export function calculateDenominationBreakdown(changeSAR) {
  if (!changeSAR || changeSAR <= 0) return [];

  let remainingHalalas = Math.round(changeSAR * 100);
  const breakdown = [];

  for (const denom of SAUDI_DENOMINATIONS) {
    const denomHalalas = Math.round(denom.value * 100);
    if (remainingHalalas >= denomHalalas) {
      const count = Math.floor(remainingHalalas / denomHalalas);
      if (count > 0) {
        breakdown.push({
          value: denom.value,
          labelAr: denom.labelAr,
          count: count,
          type: denom.type,
          color: denom.color,
          totalSAR: (count * denomHalalas) / 100
        });
        remainingHalalas -= count * denomHalalas;
      }
    }
  }

  // إذا تبقى كسور بسيطة أقل من 25 هللة (مثلاً 5 أو 10 هللات)
  if (remainingHalalas > 0) {
    breakdown.push({
      value: remainingHalalas / 100,
      labelAr: `${remainingHalalas} هللة (كسر بسيط)`,
      count: 1,
      type: 'coin',
      color: '#9e9e9e',
      totalSAR: remainingHalalas / 100,
      isFraction: true
    });
  }

  return breakdown;
}

/**
 * الحساب الشامل لعملية الصرف ودفع الفاتورة
 * @param {Object} params
 * @param {number|string} params.foreignAmount المبلغ المسلم بالعملة الأجنبية
 * @param {number|string} params.buyRate سعر شراء العملة بالريال السعودي
 * @param {number|string} params.billAmount قيمة الفاتورة بالريال (0 إذا كان صرف فقط)
 * @param {string} params.currencyCode رمز العملة الأجنبية
 * @param {string} params.currencyNameAr اسم العملة بالعربية
 * @returns {Object} نتيجة الحساب الكاملة والمدققة
 */
export function calculateExchange({
  foreignAmount,
  buyRate,
  billAmount = 0,
  currencyCode = 'USD',
  currencyNameAr = 'دولار أمريكي'
}) {
  const fAmount = Math.max(0, parseFloat(foreignAmount) || 0);
  const rate = Math.max(0, parseFloat(buyRate) || 0);
  const bAmount = Math.max(0, parseFloat(billAmount) || 0);

  const warnings = [];

  // التحقق من المدخلات
  if (fAmount <= 0) {
    warnings.push('يرجى إدخال المبلغ المسلم بالعملة الأجنبية.');
  }

  if (rate <= 0) {
    warnings.push('سعر الصرف غير صالح أو يساوي صفراً.');
  }

  // تنبيه الحماية من الأصفار الزائدة (أكثر من 10,000 وحدة نقدية أجنبية)
  if (fAmount >= 10000 && ['USD', 'EUR', 'GBP', 'KWD', 'BHD', 'OMR'].includes(currencyCode)) {
    warnings.push('⚠️ تنبيه أمان للكاشير: المبلغ المدخل كبير جداً، تأكد من عدد الأصفار والورق النقدي المسلم.');
  }

  // الحساب المالي الدقيق بدون أخطاء فاصلة عشرية
  // تحويل كل شيء إلى هللات (Halalas)
  const totalSARInHalalas = Math.round(fAmount * rate * 100);
  const totalSAR = totalSARInHalalas / 100;

  const billInHalalas = Math.round(bAmount * 100);
  const diffInHalalas = totalSARInHalalas - billInHalalas;

  const isCovered = diffInHalalas >= 0;
  const changeInHalalas = isCovered ? diffInHalalas : 0;
  const changeSAR = changeInHalalas / 100;

  const remainingDueInHalalas = !isCovered ? Math.abs(diffInHalalas) : 0;
  const remainingDueSAR = remainingDueInHalalas / 100;

  // تفكيك فئات الباقي
  const denominationBreakdown = calculateDenominationBreakdown(changeSAR);

  // نصوص التفقيط
  const totalSARText = tafqeetSAR(totalSAR);
  const changeSARText = tafqeetSAR(changeSAR);
  const billSARText = tafqeetSAR(bAmount);
  const remainingDueSARText = tafqeetSAR(remainingDueSAR);
  const foreignAmountText = tafqeetForeign(fAmount, currencyNameAr);

  // صياغة بروتوكول التأكيد الشفهي للكاشير
  let verbalScript = '';
  if (bAmount > 0) {
    if (isCovered) {
      if (changeSAR > 0) {
        verbalScript = `«استلمت منك ${fAmount} ${currencyNameAr} (تساوي ${totalSAR.toFixed(2)} ريال)، قيمة فاتورتك ${bAmount.toFixed(2)} ريال، وباقي لك ${changeSAR.toFixed(2)} ريال سعودي.»`;
      } else {
        verbalScript = `«استلمت منك ${fAmount} ${currencyNameAr} (تساوي ${totalSAR.toFixed(2)} ريال)، والمبلغ مطابق تماماً لقيمة الفاتورة بدون باقي.»`;
      }
    } else {
      verbalScript = `«المبلغ المسلم ${fAmount} ${currencyNameAr} يعادل ${totalSAR.toFixed(2)} ريال، وفاتورتك ${bAmount.toFixed(2)} ريال. يتبقى عليك ${remainingDueSAR.toFixed(2)} ريال سعودي لسداد الفاتورة.»`;
    }
  } else {
    verbalScript = `«تحويل ${fAmount} ${currencyNameAr} بسعر صرف ${rate} يعادل تماماً ${totalSAR.toFixed(2)} ريال سعودي.»`;
  }

  return {
    foreignAmount: fAmount,
    buyRate: rate,
    billAmount: bAmount,
    currencyCode,
    currencyNameAr,
    totalSAR,
    totalSARFormatted: totalSAR.toFixed(2),
    totalSARText,
    isCovered,
    changeSAR,
    changeSARFormatted: changeSAR.toFixed(2),
    changeSARText,
    remainingDueSAR,
    remainingDueSARFormatted: remainingDueSAR.toFixed(2),
    remainingDueSARText,
    billSARText,
    foreignAmountText,
    denominations: denominationBreakdown,
    verbalScript,
    warnings,
    hasError: warnings.length > 0 && fAmount === 0
  };
}
