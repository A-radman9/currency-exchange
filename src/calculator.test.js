import { describe, it, expect } from 'vitest';
import { calculateExchange, calculateDenominationBreakdown } from './calculator.js';
import { tafqeetSAR } from './tafqeet.js';

describe('Tafqeet SAR tests', () => {
  it('correctly expresses basic riyals', () => {
    expect(tafqeetSAR(1)).toContain('ريال سعودي واحد');
    expect(tafqeetSAR(2)).toContain('ريالان سعوديان');
    expect(tafqeetSAR(5)).toContain('خمسة ريالات سعودية');
    expect(tafqeetSAR(10)).toContain('عشرة ريالات سعودية');
    expect(tafqeetSAR(15)).toContain('خمسة عشر ريالاً سعودياً');
    expect(tafqeetSAR(100)).toContain('مائة ريال سعودي');
    expect(tafqeetSAR(375)).toContain('ثلاثمائة وخمسة وسبعون ريالاً سعودياً');
  });

  it('correctly expresses halalas', () => {
    expect(tafqeetSAR(0.50)).toContain('خمسون هللة');
    expect(tafqeetSAR(0.25)).toContain('خمس وعشرون هللة');
    expect(tafqeetSAR(150.75)).toContain('مائة وخمسون ريالاً سعودياً وخمس وسبعون هللة');
  });
});

describe('Exchange and Change Calculation tests', () => {
  it('handles 100 USD with bill 150 SAR (3.75 rate)', () => {
    // 100 * 3.75 = 375.00 SAR
    // Bill = 150.00 SAR
    // Change = 225.00 SAR
    const res = calculateExchange({
      foreignAmount: 100,
      buyRate: 3.75,
      billAmount: 150,
      currencyCode: 'USD',
      currencyNameAr: 'دولار أمريكي'
    });

    expect(res.totalSAR).toBe(375);
    expect(res.isCovered).toBe(true);
    expect(res.changeSAR).toBe(225);
    expect(res.remainingDueSAR).toBe(0);
    expect(res.changeSARFormatted).toBe('225.00');
    expect(res.changeSARText).toContain('مائتان وخمسة وعشرون ريالاً سعودياً');

    // Denominations for 225 SAR: 1x200, 1x20, 1x5
    expect(res.denominations).toEqual([
      expect.objectContaining({ value: 200, count: 1 }),
      expect.objectContaining({ value: 20, count: 1 }),
      expect.objectContaining({ value: 5, count: 1 })
    ]);
  });

  it('handles exact payment (0 change)', () => {
    // 40 USD * 3.75 = 150 SAR, bill = 150 SAR -> change = 0
    const res = calculateExchange({
      foreignAmount: 40,
      buyRate: 3.75,
      billAmount: 150
    });
    expect(res.totalSAR).toBe(150);
    expect(res.isCovered).toBe(true);
    expect(res.changeSAR).toBe(0);
    expect(res.remainingDueSAR).toBe(0);
    expect(res.denominations.length).toBe(0);
  });

  it('handles underpayment / partial payment', () => {
    // 20 USD * 3.75 = 75 SAR, bill = 100 SAR -> remaining due = 25 SAR
    const res = calculateExchange({
      foreignAmount: 20,
      buyRate: 3.75,
      billAmount: 100
    });
    expect(res.totalSAR).toBe(75);
    expect(res.isCovered).toBe(false);
    expect(res.changeSAR).toBe(0);
    expect(res.remainingDueSAR).toBe(25);
    expect(res.verbalScript).toContain('يتبقى عليك 25.00 ريال سعودي');
  });

  it('handles pure currency exchange (0 bill)', () => {
    // 50 EUR * 4.05 = 202.50 SAR
    const res = calculateExchange({
      foreignAmount: 50,
      buyRate: 4.05,
      billAmount: 0,
      currencyCode: 'EUR',
      currencyNameAr: 'يورو أوروبي'
    });
    expect(res.totalSAR).toBe(202.50);
    expect(res.changeSAR).toBe(202.50);
    // Denominations for 202.50: 1x200, 1x2, 1x0.50
    expect(res.denominations).toEqual([
      expect.objectContaining({ value: 200, count: 1 }),
      expect.objectContaining({ value: 2, count: 1 }),
      expect.objectContaining({ value: 0.50, count: 1 })
    ]);
  });

  it('handles floating point trap without loss of halalas', () => {
    // Testing precision with 10.33 * 3.75
    // 10.33 * 3.75 = 38.7375 -> rounded to 38.74 SAR
    const res = calculateExchange({
      foreignAmount: 10.33,
      buyRate: 3.75,
      billAmount: 30
    });
    expect(res.totalSAR).toBe(38.74);
    expect(res.changeSAR).toBe(8.74);
  });

  it('correctly handles small coins (50 and 25 halalas)', () => {
    // 10 USD = 37.50 SAR, bill = 36.75 SAR -> Change = 0.75 SAR
    const res = calculateExchange({
      foreignAmount: 10,
      buyRate: 3.75,
      billAmount: 36.75
    });
    expect(res.changeSAR).toBe(0.75);
    expect(res.denominations).toEqual([
      expect.objectContaining({ value: 0.50, count: 1 }),
      expect.objectContaining({ value: 0.25, count: 1 })
    ]);
  });

  it('handles KWD high value exchange', () => {
    // 20 KWD * 12.10 = 242.00 SAR, bill = 42.00 SAR -> Change = 200.00 SAR
    const res = calculateExchange({
      foreignAmount: 20,
      buyRate: 12.10,
      billAmount: 42,
      currencyCode: 'KWD',
      currencyNameAr: 'دينار كويتي'
    });
    expect(res.totalSAR).toBe(242);
    expect(res.changeSAR).toBe(200);
    expect(res.denominations).toEqual([
      expect.objectContaining({ value: 200, count: 1 })
    ]);
  });
});
