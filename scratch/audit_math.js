import { tafqeetSAR } from '../src/tafqeet.js';

const CURRENCIES = {
  USD: 3.75,
  EUR: 4.05,
  AED: 1.02,
  KWD: 12.10,
  BHD: 9.95,
  OMR: 9.75,
  QAR: 1.03
};

console.log('=== بدء التدقيق الحسابي الشامل لمشروع درع الكاشير ===\n');

let errors = 0;
let testsRun = 0;

// فحص حالات دفع مختلفة
for (const [code, rate] of Object.entries(CURRENCIES)) {
  for (let bill = 1; bill <= 500; bill += 5.5) {
    for (let foreign = 1; foreign <= 500; foreign += 7.25) {
      testsRun++;
      
      const totalSARHalalas = Math.round(foreign * rate * 100);
      const billHalalas = Math.round(bill * 100);
      const diffHalalas = totalSARHalalas - billHalalas;

      const totalSAR = totalSARHalalas / 100;
      const billSAR = billHalalas / 100;
      
      if (diffHalalas > 0) {
        const changeSAR = diffHalalas / 100;
        // التحقق من أن: المستلم - الفاتورة = الباقي بدقة متناهية
        const expectedChange = Math.round((totalSAR - billSAR) * 100) / 100;
        if (changeSAR !== expectedChange) {
          console.error(`خطأ في الباقي: currency=${code}, foreign=${foreign}, bill=${bill}`);
          errors++;
        }
      } else if (diffHalalas < 0) {
        const dueSAR = Math.abs(diffHalalas) / 100;
        const expectedDue = Math.round((billSAR - totalSAR) * 100) / 100;
        if (dueSAR !== expectedDue) {
          console.error(`خطأ في المتبقي: currency=${code}, foreign=${foreign}, bill=${bill}`);
          errors++;
        }
      }
    }
  }
}

console.log(`تم فحص ${testsRun} عملية حسابية معقدة عبر 7 عملات مختلفة.`);
console.log(`عدد الأخطاء الحسابية المكتشفة: ${errors}`);

// فحص أمثلة واقعية دقيقة في السوق السعودي
const realWorldCases = [
  { desc: '100 دولار وفاتورة 150 ريال', foreign: 100, rate: 3.75, bill: 150, expectedChange: 225.00 },
  { desc: '50 دولار وفاتورة 187.50 ريال (تطابق تام)', foreign: 50, rate: 3.75, bill: 187.50, expectedChange: 0 },
  { desc: '20 دولار وفاتورة 100 ريال (نقص 25 ريال)', foreign: 20, rate: 3.75, bill: 100, expectedDue: 25.00, expectedDueForeign: 6.67 },
  { desc: '10 دينار كويتي وفاتورة 50 ريال (باقي 71 ريال)', foreign: 10, rate: 12.10, bill: 50, expectedChange: 71.00 },
  { desc: '50 يورو وفاتورة 120 ريال (باقي 82.50 ريال)', foreign: 50, rate: 4.05, bill: 120, expectedChange: 82.50 },
  { desc: '100 درهم إماراتي وفاتورة 95 ريال (باقي 7 ريال)', foreign: 100, rate: 1.02, bill: 95, expectedChange: 7.00 },
  { desc: '20 دينار بحريني وفاتورة 150 ريال (باقي 49 ريال)', foreign: 20, rate: 9.95, bill: 150, expectedChange: 49.00 },
  { desc: '10 ريال عماني وفاتورة 80 ريال (باقي 17.50 ريال)', foreign: 10, rate: 9.75, bill: 80, expectedChange: 17.50 },
  { desc: '100 ريال قطري وفاتورة 103 ريال (تطابق تام)', foreign: 100, rate: 1.03, bill: 103, expectedChange: 0 }
];

console.log('\n=== فحص الأمثلة الواقعية المباشرة: ===');
for (const c of realWorldCases) {
  const totalHalalas = Math.round(c.foreign * c.rate * 100);
  const billHalalas = Math.round(c.bill * 100);
  const diffHalalas = totalHalalas - billHalalas;

  const totalSAR = (totalHalalas / 100).toFixed(2);
  const changeSAR = diffHalalas > 0 ? (diffHalalas / 100).toFixed(2) : '0.00';
  const dueSAR = diffHalalas < 0 ? (Math.abs(diffHalalas) / 100).toFixed(2) : '0.00';
  const tafqeet = diffHalalas > 0 ? tafqeetSAR(diffHalalas / 100) : (diffHalalas < 0 ? tafqeetSAR(Math.abs(diffHalalas) / 100) : 'خالص');

  console.log(`\n• الحالة: ${c.desc}`);
  console.log(`  المستلم: ${c.foreign} × ${c.rate} = ${totalSAR} ريال`);
  if (diffHalalas > 0) {
    console.log(`  الباقي للزبون: ${changeSAR} ريال [${tafqeet}]`);
    if (parseFloat(changeSAR) !== c.expectedChange) {
      console.error(`  ❌ خطأ! المتوقع ${c.expectedChange} والناتج ${changeSAR}`);
      errors++;
    } else {
      console.log(`  ✓ النتيجة مطابقة 100%`);
    }
  } else if (diffHalalas < 0) {
    console.log(`  باقي على الزبون: ${dueSAR} ريال [${tafqeet}]`);
    if (parseFloat(dueSAR) !== c.expectedDue) {
      console.error(`  ❌ خطأ! المتوقع ${c.expectedDue} والناتج ${dueSAR}`);
      errors++;
    } else {
      console.log(`  ✓ النتيجة مطابقة 100%`);
    }
  } else {
    console.log(`  ✓ الفاتورة مدفوعة بالكامل بالتمام والكمال`);
  }
}
