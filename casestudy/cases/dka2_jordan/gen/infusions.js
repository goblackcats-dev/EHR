/* DKA patient 2: IV timeline used for the I&O blocks, the orders and DESIGN.md (one place for the arithmetic).
   PERIPHERAL POTASSIUM RULE (instructor, whole DKA series): through a peripheral IV no more than 10 mEq potassium per hour, as separate
   riders (KCl 10 mEq/100 mL over 1 h), one at a time. Jordan has peripheral IVs only, so the main fluid is 0.9% sodium chloride with NO
   potassium (lactated Ringer's would add 4 mEq/L) and the D10 line has none; all potassium goes in as riders by the 4-hour lab table.
   While a rider runs the saline is lowered by 50 mL/h. */
const { hOf } = require('./lib');
const M = (d, t) => Math.round(hOf(d, t) * 60);   // minutes after Mon 0700
const OFF = M('Tue', '09:30');                      // insulin, saline and D10 off (transition)
const HOLD = [M('Mon', '19:20'), M('Mon', '22:00')]; // insulin and D10 held for K 3.3
// riders [day, start, end, why]
const RIDERS = [
  ['Mon', '04:00', '05:00', 'ED: K 4.6 (0300), voiding: 10 mEq'],
  ['Mon', '07:30', '08:30', 'K 4.1 (0630): 20 mEq this cycle'], ['Mon', '08:30', '09:30', ''],
  ['Mon', '11:30', '12:30', 'K 3.8 (1030): 30 mEq this cycle'], ['Mon', '12:30', '13:30', ''], ['Mon', '13:30', '14:30', ''],
  ['Mon', '15:30', '16:30', 'K 3.6 (1430): 30 mEq this cycle'], ['Mon', '16:30', '17:30', ''], ['Mon', '17:30', '18:30', ''],
  ['Mon', '19:30', '20:30', 'K 3.3 (1830): insulin held, 4 riders back to back'], ['Mon', '20:30', '21:30', ''], ['Mon', '21:30', '22:30', ''], ['Mon', '22:30', '23:30', ''],
  ['Mon', '23:30', '00:30', 'K 3.7 (2130): 30 mEq this cycle (riders 3, 4 and this one)'],
  ['Tue', '02:30', '03:30', 'K 4.0 (0130): 20 mEq this cycle'], ['Tue', '03:30', '04:30', ''],
  ['Tue', '06:30', '07:30', 'K 4.1 (0530): 20 mEq this cycle'], ['Tue', '07:30', '08:30', '']
].map(([d, a, b, why]) => { const s = M(d, a); let e = M(d, b); if (e <= s) e += 1440; return { s, e, why, day: d, from: a, to: b }; });
const riderAt = m => RIDERS.find(r => m >= r.s && m < r.e);
function salineRate(m) {
  if (m < M('Mon', '00:55') || m >= OFF) return 0;
  if (m < M('Mon', '01:55')) return 1000;          // 1 L bolus over 1 hour
  if (m < M('Mon', '02:00')) return 0;
  if (m < M('Mon', '04:00')) return 500;
  const base = m < M('Mon', '08:05') ? 250 : 100;
  return riderAt(m) ? base - 50 : base;
}
const holding = m => m >= HOLD[0] && m < HOLD[1];
const d10Rate = m => (m < M('Mon', '08:05') || m >= OFF || holding(m) ? 0 : m < M('Tue', '03:00') ? 100 : 150);
const insulinRate = m => (m < M('Mon', '02:15') || m >= OFF || holding(m) ? 0 : 7.2);
const sum = (f, a, b) => { let v = 0; for (let m = a; m < b; m++) v += f(m) / 60; return v; };
const vol = (a, b) => ({ saline: Math.round(sum(salineRate, a, b)), d10: Math.round(sum(d10Rate, a, b)), riders: Math.round(sum(m => (riderAt(m) ? 100 : 0), a, b)), insulin: Math.round(sum(insulinRate, a, b)),
  kMeq: Math.round(sum(m => (riderAt(m) ? 10 : 0), a, b)), list: RIDERS.filter(r => r.s < b && r.e > a) });
module.exports = { M, RIDERS, salineRate, d10Rate, insulinRate, vol, OFF, HOLD };
if (require.main === module) {
  const blocks = [['ED', M('Mon', '00:30'), M('Mon', '07:00')], ...[0, 4, 8, 12, 16, 20, 24].map(h => [`${h}-${h + 4}h`, h * 60, h * 60 + 240])];
  blocks.forEach(([n, a, b]) => { const v = vol(a, b); console.log(n, 'saline', v.saline, 'D10', v.d10, 'riders', v.riders, 'insulin', v.insulin, 'K mEq', v.kMeq, v.list.map(r => `${r.from}-${r.to}`).join(', ')); });
  console.log('total K mEq', vol(-400, 1700).kMeq, 'riders', RIDERS.length, 'max K mEq/h 10 (one rider at a time, no K in any bag)');
}
