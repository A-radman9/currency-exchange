/**
 * مولد سند استلام العملة وصرف الباقي (POS Thermal 80mm & A4)
 * لحماية الكاشير وتوثيق العملية في الصندوق اليومي
 */

/**
 * إنشاء وطباعة سند العملية الحراري
 * @param {Object} tx بيانات العملية الحسابية
 * @param {Object} settings إعدادات المتجر والكاشير
 */
export function printReceipt(tx, settings) {
  const printWindow = window.open('', '_blank', 'width=450,height=750');
  if (!printWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة لطباعة الإيصال.');
    return;
  }

  const receiptHtml = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>سند استلام وصرف عملة - ${tx.id || 'TX'}</title>
  <style>
    @page {
      margin: 0;
      size: 80mm auto;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 10px;
      color: #000;
      background: #fff;
      font-size: 13px;
      line-height: 1.4;
      direction: rtl;
    }
    .receipt-container {
      max-width: 80mm;
      margin: 0 auto;
      text-align: center;
    }
    .store-name {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 2px;
    }
    .store-branch {
      font-size: 12px;
      color: #444;
      margin-bottom: 4px;
    }
    .voucher-title {
      display: inline-block;
      border: 1px solid #000;
      padding: 3px 8px;
      font-weight: bold;
      font-size: 13px;
      margin: 6px 0;
      border-radius: 3px;
    }
    .divider {
      border-top: 1px dashed #000;
      margin: 8px 0;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 3px;
    }
    .table-details {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      text-align: right;
    }
    .table-details td {
      padding: 4px 0;
      font-size: 12.5px;
    }
    .table-details td:last-child {
      text-align: left;
      font-weight: 600;
      direction: ltr;
    }
    .highlight-box {
      border: 1.5px solid #000;
      background: #f7f7f7;
      padding: 6px;
      margin: 8px 0;
      border-radius: 4px;
      text-align: center;
    }
    .highlight-title {
      font-size: 12px;
      font-weight: bold;
    }
    .highlight-amount {
      font-size: 20px;
      font-weight: 900;
      margin: 2px 0;
    }
    .tafqeet-text {
      font-size: 11px;
      color: #222;
      font-style: italic;
    }
    .denominations-box {
      text-align: right;
      font-size: 11.5px;
      background: #fafafa;
      padding: 5px;
      border-radius: 3px;
      margin: 6px 0;
    }
    .denominations-title {
      font-weight: bold;
      margin-bottom: 3px;
    }
    .denominations-list {
      margin: 0;
      padding-right: 15px;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      font-size: 11px;
      text-align: center;
    }
    .sig-col {
      width: 45%;
      border-top: 1px solid #000;
      padding-top: 4px;
    }
    .footer-note {
      font-size: 10px;
      color: #555;
      margin-top: 10px;
      text-align: center;
    }
    @media print {
      body {
        padding: 5px;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="store-name">${settings.storeName || 'متجر التميز'}</div>
    <div class="store-branch">${settings.branchName || 'الفرع الرئيسي'}</div>
    ${settings.vatNumber ? `<div style="font-size:11px;">الرقم الضريبي: ${settings.vatNumber}</div>` : ''}
    
    <div class="voucher-title">سند استلام وصرف عملة أجنبية</div>

    <div class="divider"></div>

    <div class="meta-row">
      <span>رقم السند: <b>${tx.id || 'TX-NEW'}</b></span>
      <span>الكاشير: <b>${settings.cashierName || 'كاشير #1'}</b></span>
    </div>
    <div class="meta-row">
      <span>التاريخ: ${tx.displayDate || new Date().toLocaleDateString('ar-SA')}</span>
      <span>الوقت: ${tx.displayTime || new Date().toLocaleTimeString('ar-SA')}</span>
    </div>

    <div class="divider"></div>

    <table class="table-details">
      <tr>
        <td>العملة المستلمة:</td>
        <td>${tx.currencyCode} (${tx.currencyNameAr})</td>
      </tr>
      <tr>
        <td>المبلغ المسلم:</td>
        <td>${tx.foreignAmount.toFixed(2)} ${tx.currencyCode}</td>
      </tr>
      <tr>
        <td>سعر الصرف المعتمد:</td>
        <td>1 ${tx.currencyCode} = ${tx.buyRate.toFixed(4)} SAR</td>
      </tr>
      <tr>
        <td>المعادل بالريال السعودي:</td>
        <td>${tx.totalSARFormatted} SAR</td>
      </tr>
      ${tx.billAmount > 0 ? `
      <tr>
        <td>قيمة الفاتورة المخصومة:</td>
        <td>${tx.billAmount.toFixed(2)} SAR</td>
      </tr>
      ` : ''}
    </table>

    <div class="highlight-box">
      <div class="highlight-title">${tx.billAmount > 0 ? 'الباقي المرجع للعميل بالريال:' : 'المبلغ المصروف للعميل بالريال:'}</div>
      <div class="highlight-amount">${tx.changeSARFormatted} ريال</div>
      <div class="tafqeet-text">${tx.changeSARText}</div>
    </div>

    ${tx.denominations && tx.denominations.length > 0 ? `
    <div class="denominations-box">
      <div class="denominations-title">فئات النقد المسلمة كباقي:</div>
      <ul class="denominations-list">
        ${tx.denominations.map(d => `<li>${d.labelAr}: عدد ( ${d.count} ) = ${(d.totalSAR).toFixed(2)} ريال</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <div class="divider"></div>

    <div style="font-size: 10.5px; text-align: justify; margin: 5px 0;">
      إقرار: أقر أنا العميل باستلام كامل المبلغ المتبقي بالريال السعودي ومطابقته لسعر الصرف الموضح أعلاه.
    </div>

    <div class="signatures">
      <div class="sig-col">
        توقيع العميل
      </div>
      <div class="sig-col">
        توقيع الكاشير
      </div>
    </div>

    <div class="divider"></div>
    <div class="footer-note">
      * قسيمة رسمية لحفظ حقوق الكاشير وتدقيق الصندوق اليومي *
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => {
        window.print();
      }, 250);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(receiptHtml);
  printWindow.document.close();
}
