/* In-class new-onset DKA patient (Nora Whitcombe): IV timeline used for the I&O blocks and the potassium checks (one place for the arithmetic). See ../DESIGN.md section 8.
   Peripheral IVs only: NO potassium in any bag. All potassium goes in as KCl 10 mEq/100 mL riders over 1 hour, one at a time (10 mEq/h maximum), at most 4 in a row,
   on their own pump into the right forearm IV. The KCl 20 mEq/100 mL order (1500) is discontinued at 1510 and never runs. */
const { hOf } = require('./lib');
const M = (d, t) => Math.round(hOf(d, t) * 60);   // minutes after Mon 0700
const OFF = M('Mon', '21:00');                     // insulin infusion and D5W/0.45% NaCl off (2 hours after glargine)
// riders [day, start, end, why]
const RIDERS = [
  ['Mon', '07:15', '08:15', 'K 4.7 (0530): 10 mEq'],
  ['Mon', '10:30', '11:30', 'K 4.1 (0930): 20 mEq'], ['Mon', '11:30', '12:30', ''],
  ['Mon', '15:05', '16:05', 'K 3.6 (1330): 40 mEq, 4 riders back to back'], ['Mon', '16:05', '17:05', ''], ['Mon', '17:05', '18:05', ''], ['Mon', '18:05', '19:05', '']
].map(([d, a, b, why]) => { const s = M(d, a); let e = M(d, b); if (e <= s) e += 1440; return { s, e, why, day: d, from: a, to: b }; });
const riderAt = m => RIDERS.filter(r => m >= r.s && m < r.e);
// sodium chloride (0.9% bolus and rates in the ED, then 0.45% on the unit) without dextrose
function salineRate(m) {
  if (m >= M('Mon', '02:00') && m < M('Mon', '03:00')) return 1000;   // 0.9% 1 L bolus over 1 hour
  if (m >= M('Mon', '03:00') && m < M('Mon', '05:00')) return 500;    // 0.9%
  if (m >= M('Mon', '05:00') && m < M('Mon', '07:00')) return 250;    // 0.9%
  if (m >= M('Mon', '07:00') && m < M('Mon', '08:05')) return 250;    // 0.45%
  return 0;
}
const d5Rate = m => (m >= M('Mon', '08:05') && m < OFF ? 150 : 0);   // D5W/0.45% NaCl
const insulinRate = m => (m >= M('Mon', '03:05') && m < OFF ? 5.5 : 0);
const mgRate = m => (m >= M('Mon', '15:05') && m < M('Mon', '17:05') ? 25 : 0);          // 2 g in 50 mL over 2 h
const kPerHour = m => riderAt(m).length * 10;   // no potassium in any bag that runs
const sum = (f, a, b) => { let v = 0; for (let m = a; m < b; m++) v += f(m) / 60; return v; };
const vol = (a, b) => ({ saline: sum(salineRate, a, b), d5: sum(d5Rate, a, b), insulin: sum(insulinRate, a, b), riders: sum(m => riderAt(m).length * 100, a, b), mg: sum(mgRate, a, b), list: RIDERS.filter(r => r.s < b && r.e > a) });
module.exports = { M, RIDERS, salineRate, d5Rate, insulinRate, mgRate, kPerHour, vol, OFF };
if (require.main === module) {
  const blocks = [['ED 0140-0300', M('Mon', '01:40'), M('Mon', '03:00')], ['ED 0300-0700', M('Mon', '03:00'), 0], ...[0, 4, 8, 12, 16, 20].map(h => [`${h}-${h + 4}h`, h * 60, h * 60 + 240])];
  blocks.forEach(([n, a, b]) => { const v = vol(a, b); console.log(n, 'saline', v.saline.toFixed(1), 'D5', v.d5.toFixed(1), 'insulin', v.insulin.toFixed(1), 'riders', v.riders.toFixed(1), 'mg', v.mg); });
  let mx = 0; for (let m = -400; m < 1500; m++) mx = Math.max(mx, kPerHour(m)); console.log('max K mEq/h', mx, 'total insulin', vol(-400, 1500).insulin.toFixed(1), 'D5 mL', vol(-400, 1500).d5.toFixed(0));
}
