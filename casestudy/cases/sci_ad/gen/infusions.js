/* In-class SCI patient (Wesley Harcourt): IV timeline used for the I&O blocks (one place for the arithmetic). See ../DESIGN.md sections 6, 11 and 14.
   0.9% sodium chloride 1,000 mL bolus Sun 2200-2300; 0.9% sodium chloride 100 mL/h Sun 2300 to Mon 1100 (stopped by order, saline lock); flushes 20 mL in the 1100-1500 block.
   No potassium is ordered for this patient (K 3.9-4.2). */
const { hOf } = require('./lib');
const M = (d, t) => Math.round(hOf(d, t) * 60);   // minutes after Mon 0700
const OFF = M('Mon', '11:00');
function salineRate(m) {
  if (m >= M('Sun', '22:00') && m < M('Sun', '23:00')) return 1000;   // bolus over 1 hour
  if (m >= M('Sun', '23:00') && m < OFF) return 100;
  return 0;
}
const FLUSH = [[M('Mon', '11:00'), 10], [M('Mon', '13:00'), 10]];   // saline-lock flushes (mL)
const sum = (f, a, b) => { let v = 0; for (let m = a; m < b; m++) v += f(m) / 60; return v; };
const vol = (a, b) => ({ saline: sum(salineRate, a, b), flush: FLUSH.filter(([m]) => m >= a && m < b).reduce((s, [, v]) => s + v, 0) });
const kPerHour = () => 0;
module.exports = { M, salineRate, vol, OFF, kPerHour };
if (require.main === module) [['ED', M('Sun', '21:30'), M('Sun', '23:00')], ...[-8, -4, 0, 4, 8, 12, 16, 20].map(h => [`${h}h`, h * 60, h * 60 + 240])].forEach(([n, a, b]) => { const v = vol(a, b); console.log(n, v.saline.toFixed(0), v.flush); });
