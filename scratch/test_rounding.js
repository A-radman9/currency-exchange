const CURRENCIES = {
  USD: 3.75,
  EUR: 4.05,
  AED: 1.02,
  KWD: 12.10,
  BHD: 9.95,
  OMR: 9.75,
  QAR: 1.03
};

let shortfalls = 0;
for (const [code, rate] of Object.entries(CURRENCIES)) {
  for (let dueHalalas = 1; dueHalalas <= 50000; dueHalalas++) {
    const dueSAR = dueHalalas / 100;
    // التقريب الرياضي العادي
    const dueForeign = Math.round((dueSAR / rate) * 100) / 100;
    const receivedSARHalalas = Math.round(dueForeign * rate * 100);
    
    if (receivedSARHalalas < dueHalalas) {
      shortfalls++;
      // console.log(`Shortfall: ${code}, due: ${dueSAR}, foreign: ${dueForeign}, received: ${receivedSARHalalas/100}`);
    }
  }
}

console.log(`عدد الحالات التي قد ينقص فيها المبلغ بهللة واحدة عند التقريب العادي: ${shortfalls}`);

// فحص التقريب للأعلى (Math.ceil) لصالح المحل دائماً
let ceilShortfalls = 0;
for (const [code, rate] of Object.entries(CURRENCIES)) {
  for (let dueHalalas = 1; dueHalalas <= 50000; dueHalalas++) {
    const dueSAR = dueHalalas / 100;
    // التقريب للأعلى لصالح صندوق الكاشير دائماً
    const dueForeignCeil = Math.ceil((dueSAR / rate) * 100) / 100;
    const receivedSARHalalas = Math.round(dueForeignCeil * rate * 100);
    
    if (receivedSARHalalas < dueHalalas) {
      ceilShortfalls++;
    }
  }
}
console.log(`عدد الحالات التي قد ينقص فيها المبلغ عند التقريب للأعلى (Math.ceil): ${ceilShortfalls}`);
