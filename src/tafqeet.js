/**
 * محرك التفقيط المالي باللغة العربية للريال السعودي والهللات
 * مصمم بدقة حسابية عالية لمنع أخطاء قراءة المبالغ لدى الكاشير
 */

const ONES = [
  '', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
  'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر',
  'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'
];

const TENS = [
  '', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'
];

const HUNDREDS = [
  '', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'
];

/**
 * تحويل رقم مكون من 1 إلى 3 خانات (0 - 999) إلى نص عربي
 * @param {number} n 
 * @returns {string}
 */
function convertThreeDigits(n) {
  if (n === 0) return '';
  
  const h = Math.floor(n / 100);
  const remainder = n % 100;
  let parts = [];

  if (h > 0) {
    parts.push(HUNDREDS[h]);
  }

  if (remainder > 0) {
    if (remainder < 20) {
      parts.push(ONES[remainder]);
    } else {
      const o = remainder % 10;
      const t = Math.floor(remainder / 10);
      if (o > 0) {
        parts.push(ONES[o] + ' و' + TENS[t]);
      } else {
        parts.push(TENS[t]);
      }
    }
  }

  return parts.join(' و');
}

/**
 * تحويل عدد صحيح كبير إلى كلمات عربية
 * @param {number} number 
 * @returns {string}
 */
function convertIntegerToWords(number) {
  if (number === 0) return 'صفر';
  if (number < 0) return 'سالب ' + convertIntegerToWords(Math.abs(number));

  const scales = [
    { value: 1000000000, singular: 'مليار', dual: 'ملياران', plural: 'مليارات', accusative: 'ملياراً' },
    { value: 1000000, singular: 'مليون', dual: 'مليونان', plural: 'ملايين', accusative: 'مليوناً' },
    { value: 1000, singular: 'ألف', dual: 'ألفان', plural: 'آلاف', accusative: 'ألفاً' }
  ];

  let current = number;
  let parts = [];

  for (const scale of scales) {
    if (current >= scale.value) {
      const count = Math.floor(current / scale.value);
      current = current % scale.value;

      if (count === 1) {
        parts.push(scale.singular);
      } else if (count === 2) {
        parts.push(scale.dual);
      } else if (count >= 3 && count <= 10) {
        parts.push(convertThreeDigits(count) + ' ' + scale.plural);
      } else {
        parts.push(convertThreeDigits(count) + ' ' + scale.accusative);
      }
    }
  }

  if (current > 0) {
    parts.push(convertThreeDigits(current));
  }

  return parts.filter(Boolean).join(' و');
}

/**
 * صياغة تمييز الريال السعودي حسب العدد
 * @param {number} riyals 
 * @returns {string}
 */
function getRiyalWording(riyals) {
  if (riyals === 0) return '';
  if (riyals === 1) return 'ريال سعودي واحد';
  if (riyals === 2) return 'ريالان سعوديان';
  
  const words = convertIntegerToWords(riyals);
  const lastTwo = riyals % 100;
  
  // مضاعفات المائة والألف الصريحة (100، 200، 1000، إلخ) يكون تمييزها مفرداً مجروراً: ريال سعودي
  if (lastTwo === 0) {
    return `${words} ريال سعودي`;
  }
  
  if (lastTwo >= 3 && lastTwo <= 10) {
    return `${words} ريالات سعودية`;
  } else if (lastTwo === 1) {
    return `${words} ريال سعودي`;
  } else if (lastTwo === 2) {
    return `${words} ريالان سعوديان`;
  } else {
    return `${words} ريالاً سعودياً`;
  }
}

/**
 * صياغة تمييز الهللات (مؤنث)
 * @param {number} halalas 
 * @returns {string}
 */
const FEMININE_ONES = [
  '', 'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثمان', 'تسع',
  'عشر', 'إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة', 'خمس عشرة', 'ست عشرة',
  'سبع عشرة', 'ثماني عشرة', 'تسع عشرة'
];

function getHalalaWording(halalas) {
  if (halalas === 0) return '';
  if (halalas === 1) return 'هللة واحدة';
  if (halalas === 2) return 'هللتان';

  let words = '';
  if (halalas < 20) {
    words = FEMININE_ONES[halalas];
  } else {
    const o = halalas % 10;
    const t = Math.floor(halalas / 10);
    if (o > 0) {
      words = FEMININE_ONES[o] + ' و' + TENS[t];
    } else {
      words = TENS[t];
    }
  }

  if (halalas >= 3 && halalas <= 10) {
    return `${words} هللات`;
  } else {
    return `${words} هللة`;
  }
}

/**
 * الدالة الرئيسية لتفقيط المبلغ بالريال السعودي والهللات
 * @param {number} amount المبلغ بالريال السعودي
 * @returns {string} النص العربي المفقط مع صيغة التوكيد المالي
 */
export function tafqeetSAR(amount) {
  if (amount == null || isNaN(amount)) return 'صفر ريال سعودي';
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // الحساب المالي الدقيق بدون أخطاء فاصلة عشرية
  const totalHalalas = Math.round(absAmount * 100);
  const riyals = Math.floor(totalHalalas / 100);
  const halalas = totalHalalas % 100;

  if (riyals === 0 && halalas === 0) {
    return 'صفر ريال سعودي فقط لا غير';
  }

  let textParts = [];

  if (riyals > 0) {
    textParts.push(getRiyalWording(riyals));
  }

  if (halalas > 0) {
    textParts.push(getHalalaWording(halalas));
  }

  let result = (isNegative ? 'سالب ' : '') + textParts.join(' و') + ' فقط لا غير';
  return result;
}

/**
 * تفقيط العملة الأجنبية
 * @param {number} amount 
 * @param {string} currencyNameArabic 
 * @returns {string}
 */
export function tafqeetForeign(amount, currencyNameArabic) {
  if (amount == null || isNaN(amount) || amount === 0) return `صفر ${currencyNameArabic}`;
  const rounded = Math.round(amount * 100) / 100;
  const integerPart = Math.floor(rounded);
  const fraction = Math.round((rounded - integerPart) * 100);

  let text = convertIntegerToWords(integerPart) + ' ' + currencyNameArabic;
  if (fraction > 0) {
    text += ' و' + convertIntegerToWords(fraction) + ' سنت/كسر';
  }
  return text + ' فقط لا غير';
}
