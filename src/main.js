import './style.css';
import { tafqeetSAR } from './tafqeet.js';

// العملات المدمجة والفئات الشائعة
const CURRENCY_DATA = {
  USD: { name: 'دولار أمريكي', symbol: '$', rate: 3.75, quick: [10, 20, 50, 100] },
  EUR: { name: 'يورو أوروبي', symbol: '€', rate: 4.05, quick: [10, 20, 50, 100] },
  AED: { name: 'درهم إماراتي', symbol: 'د.إ', rate: 1.02, quick: [50, 100, 200, 500] },
  KWD: { name: 'دينار كويتي', symbol: 'د.ك', rate: 12.10, quick: [5, 10, 20] },
  BHD: { name: 'دينار بحريني', symbol: 'د.ب', rate: 9.95, quick: [5, 10, 20] },
  OMR: { name: 'ريال عماني', symbol: 'ر.ع', rate: 9.75, quick: [5, 10, 20, 50] },
  QAR: { name: 'ريال قطري', symbol: 'ر.ق', rate: 1.03, quick: [50, 100, 500] }
};

// عناصر DOM
const currencySelect = document.getElementById('currencySelect');
const fixedRateDisplay = document.getElementById('fixedRateDisplay');
const billInput = document.getElementById('billInput');
const foreignInput = document.getElementById('foreignInput');
const foreignUnitBadge = document.getElementById('foreignUnitBadge');
const foreignUnitText = document.getElementById('foreignUnitText');
const quickCashButtons = document.getElementById('quickCashButtons');

const resultCard = document.getElementById('resultCard');
const resultGrid = document.getElementById('resultGrid');
const boxForeign = document.getElementById('boxForeign');
const statusIcon = document.getElementById('statusIcon');
const statusTitle = document.getElementById('statusTitle');
const sarBoxLabel = document.getElementById('sarBoxLabel');
const sarAmountDisplay = document.getElementById('sarAmountDisplay');
const foreignBoxLabel = document.getElementById('foreignBoxLabel');
const foreignAmountDisplay = document.getElementById('foreignAmountDisplay');
const foreignBoxUnit = document.getElementById('foreignBoxUnit');
const tafqeetDisplay = document.getElementById('tafqeetDisplay');
const mathExplanation = document.getElementById('mathExplanation');
const btnClear = document.getElementById('btnClear');

// تحديث الأزرار النقدية السريعة والرموز
function updateCurrencyDetails() {
  const code = currencySelect.value;
  const data = CURRENCY_DATA[code] || CURRENCY_DATA.USD;

  fixedRateDisplay.textContent = data.rate.toFixed(2);
  foreignUnitBadge.textContent = `بـ (${data.name}) [${data.symbol}]`;
  foreignUnitText.textContent = data.symbol;
  foreignBoxUnit.textContent = data.symbol;
  foreignBoxLabel.textContent = `أو باقي عليه بـ (${data.name})`;

  // ملء أزرار المبالغ السريعة
  quickCashButtons.innerHTML = '';
  data.quick.forEach(amount => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-cash-quick';
    btn.textContent = `${amount} ${data.symbol}`;
    btn.addEventListener('click', () => {
      foreignInput.value = amount;
      calculate();
    });
    quickCashButtons.appendChild(btn);
  });
}

// دالة الحساب الفوري
function calculate() {
  const foreignVal = parseFloat(foreignInput.value) || 0;
  const billVal = parseFloat(billInput.value) || 0;
  const code = currencySelect.value;
  const data = CURRENCY_DATA[code] || CURRENCY_DATA.USD;
  const rate = data.rate;
  const symbol = data.symbol || '';

  foreignBoxUnit.textContent = symbol;

  // في حال عدم إدخال مبلغ بعد
  if (foreignVal <= 0 && billVal <= 0) {
    resultGrid.classList.add('single-box');
    boxForeign.style.display = 'none';

    setResultState(
      'neutral',
      '⏳',
      'حط الفاتورة والمبلغ اللي استلمته',
      '0.00',
      '0.00',
      '🇸🇦 بالريال السعودي',
      `بـ (${data.name})`,
      'صفر ريال سعودي فقط لا غير',
      'استلمت منه: 0 = 0 ريال  |  الفاتورة: 0 ريال'
    );
    return;
  }

  // الحساب المالي الدقيق بنظام الهللات لمنع أي خطأ كسور
  const totalSARHalalas = Math.round(foreignVal * rate * 100);
  const billHalalas = Math.round(billVal * 100);
  const diffHalalas = totalSARHalalas - billHalalas;

  const totalSARFormatted = (totalSARHalalas / 100).toFixed(2);
  const billFormatted = (billHalalas / 100).toFixed(2);

  if (diffHalalas > 0) {
    // 🟢 باقي له فلوس -> يحسبها بالسعودي فقط!
    resultGrid.classList.add('single-box');
    boxForeign.style.display = 'none'; // إخفاء العملة الأجنبية لأن الباقي يُرجع بالريال فقط

    const changeSAR = (diffHalalas / 100).toFixed(2);
    const tafqeet = tafqeetSAR(diffHalalas / 100);
    const formula = `استلمت منه ${foreignVal} ${symbol} (تطلع ${totalSARFormatted} ريال) - الفاتورة ${billFormatted} ريال = الباقي للزبون: ${changeSAR} ريال`;

    setResultState(
      'change',
      '🟢',
      'رجّع للزبون الباقي بالريال السعودي:',
      changeSAR,
      '0.00',
      '🇸🇦 رجّع له بالريال السعودي:',
      '',
      tafqeet,
      formula
    );
  } else if (diffHalalas < 0) {
    // 🔴 باقي عليه فلوس -> يحسبها سعودي وعملة الزبون معاً!
    resultGrid.classList.remove('single-box');
    boxForeign.style.display = 'flex'; // إظهار الصندوقين معاً

    const dueSAR = (Math.abs(diffHalalas) / 100).toFixed(2);
    // تقريب العملة الأجنبية للأعلى دائماً لضمان عدم نقص أي هللة على الكاشير
    const dueForeign = rate > 0 ? (Math.ceil(((Math.abs(diffHalalas) / 100) / rate) * 100) / 100).toFixed(2) : '0.00';
    const tafqeet = tafqeetSAR(Math.abs(diffHalalas) / 100);
    const formula = `استلمت منه ${foreignVal} ${symbol} (تطلع ${totalSARFormatted} ريال) - الفاتورة ${billFormatted} ريال = باقي عليه ${dueSAR} ريال (أو ${dueForeign} ${symbol})`;

    setResultState(
      'due',
      '🔴',
      'المبلغ ما يكفي! باقي على الزبون:',
      dueSAR,
      dueForeign,
      '🇸🇦 باقي عليه بالريال:',
      `أو باقي عليه بـ (${data.name}):`,
      tafqeet,
      formula
    );
  } else {
    // 🔵 المبلغ مطابق تماماً
    resultGrid.classList.add('single-box');
    boxForeign.style.display = 'none';

    const formula = `المبلغ اللي عطاك إياه (${totalSARFormatted} ريال) مغطي الفاتورة بالتمام.`;

    setResultState(
      'exact',
      '🔵',
      'حسابه مضبوط بالملّي (ما له ولا عليه)',
      '0.00',
      '0.00',
      '🇸🇦 المبلغ بالريال السعودي',
      '',
      'الفاتورة مدفوعة بالكامل ولا فيه باقي مطلوب',
      formula
    );
  }
}

function setResultState(type, icon, title, sarAmount, foreignAmount, sarLabel, foreignLabel, tafqeet, math) {
  resultCard.className = `result-card state-${type}`;
  statusIcon.textContent = icon;
  statusTitle.textContent = title;
  sarAmountDisplay.textContent = sarAmount;
  foreignAmountDisplay.textContent = foreignAmount;
  sarBoxLabel.textContent = sarLabel;
  foreignBoxLabel.textContent = foreignLabel;
  tafqeetDisplay.textContent = tafqeet;
  mathExplanation.textContent = math;
}

// مسح وتصفير
function resetAll() {
  billInput.value = '';
  foreignInput.value = '';
  calculate();
  billInput.focus();
}

// ربط الأحداث
currencySelect.addEventListener('change', () => {
  updateCurrencyDetails();
  calculate();
});

billInput.addEventListener('input', calculate);
foreignInput.addEventListener('input', calculate);
btnClear.addEventListener('click', resetAll);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    resetAll();
  }
});

// بدء التشغيل
updateCurrencyDetails();
calculate();
