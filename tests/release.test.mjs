import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCalendarDate, formatDateForInput } from '../js/utils/date-utils.js';
import { calculateShippingWindow } from '../js/features/calculator/logic/transit/shipping-window.js';
import { calculateDistance } from '../js/features/calculator/logic/transit/distance-source.js';
import { getTransitDetails } from '../js/features/calculator/logic/transit/transit-calculator.js';
import { createFiscalMonths } from '../js/features/fiscal-months/state.js';

for (const zone of ['Europe/Rome','America/Los_Angeles','Pacific/Auckland']) {
  test(`closing dates stay on the selected calendar day in ${zone}`, () => {
    const previous = process.env.TZ;
    try {
      process.env.TZ = zone;
      const date = parseCalendarDate('2026-11-30');
      assert.equal(formatDateForInput(date), '2026-11-30');
      assert.equal(formatDateForInput(calculateShippingWindow(date, 4).adjustedDeadline), '2026-11-30');
    } finally {
      if (previous === undefined) delete process.env.TZ;
      else process.env.TZ = previous;
    }
  });
}
test('invalid calendar dates are rejected', () => {
  assert.throws(() => parseCalendarDate('2026-02-30'), RangeError);
  assert.throws(() => parseCalendarDate(''), RangeError);
});
test('same-day shipment and four-working-day planning window', () => {
  const result = calculateShippingWindow(parseCalendarDate('2026-11-30'), 8);
  assert.equal(formatDateForInput(result.lastShippingDate), '2026-11-30');
  assert.equal(formatDateForInput(result.windowStart), '2026-11-24');
});
test('weekend deadlines and multi-day transit skip weekends', () => {
  const result = calculateShippingWindow(parseCalendarDate('2026-11-29'), 19);
  assert.equal(formatDateForInput(result.adjustedDeadline), '2026-11-27');
  assert.equal(formatDateForInput(result.lastShippingDate), '2026-11-25');
});
test('distance is symmetric and zero for coincident points', () => {
  const a={lat:45.4642,lon:9.19}, b={lat:52.52,lon:13.405};
  assert.equal(calculateDistance(a,a),0);
  assert.ok(Math.abs(calculateDistance(a,b)-calculateDistance(b,a))<0.000001);
  assert.ok(calculateDistance(a,b)>1000);
});
test('multiple vehicles use the slowest vehicle and non-EU customs allowance', () => {
 const result=getTransitDetails({transitInput:{departureCoords:{lat:45,lon:9},destinationCoords:{lat:47,lon:8},vehiclesArr:[{type:'van'},{type:'exceptional-load'}],departureCountry:'it',destinationCountry:'ch',fiscalDeadline:parseCalendarDate('2026-11-30')}});
 assert.equal(result.slowestVehicleType,'exceptional-load');
 assert.equal(result.customsDelay,6);
 assert.ok(result.lastShippingDate<=result.adjustedDeadline);
});
test('calendar defaults handle leap years and year-end correctly', () => {
 const months=createFiscalMonths([{index:1,label:'February'},{index:11,label:'December'}],2028);
 assert.equal(months[0].closingDate,'2028-02-29');
 assert.equal(months[1].closingDate,'2028-12-31');
});
