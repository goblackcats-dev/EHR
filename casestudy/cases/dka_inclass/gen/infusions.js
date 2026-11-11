/* In-class DKA patient (Caleb Mercer): IV timeline used for the I&O blocks and the potassium checks (one place for the arithmetic). See ../DESIGN.md section 8.
   Peripheral IVs only: NO potassium in any bag. All potassium goes in as KCl 10 mEq/100 mL riders over 1 hour, one at a time (10 mEq/h maximum), at most 4 in a row.
   The saline is NOT lowered while a rider runs (young, normal heart and kidneys; DESIGN.md section 5). */
const { hOf } = require('./lib');
const M = (d, t) => Math.round(hOf(d, t) * 60);   // minutes after Mon 0700
const OFF = M('Tue', '09:30');                     // insulin, D10 and saline off (transition)
const HOLD = [M('Mon', '15:00'), M('Mon', '17:50')]; // insulin held for K 3.2 (D10 off 1500-1900)
const DISC = [M('Tue', '01:11'), M('Tue', '03:10')]; // D10 tubing apart at the Y-site: pumped into the bed, not received
// riders [day, start, end]; the 1805 rider was stopped at 1900 (infiltration) with 92 mL in
const RIDERS = [
  ['Mon', '07:15', '08:15', 'K 4.6 (0500): 10 mEq'],
  ['Mon', '10:30', '11:30', 'K 3.9 (0930): 30 mEq'], ['Mon', '11:30', '12:30', ''], ['Mon', '12:30', '13:30', ''],
  ['Mon', '15:05', '16:05', 'K 3.2 (1400): 4 riders back to back'], ['Mon', '16:05', '17:05', ''], ['Mon', '17:05', '18:05', ''], ['Mon', '18:05', '19:00', 'stopped at 1900 (infiltration), 92 mL in'],
  ['Mon', '22:30', '23:30', 'K 3.7 (2130): 30 mEq'], ['Mon', '23:30', '00:30', ''], ['Tue', '00:30', '01:30', ''],
  ['Tue', '03:30', '04:30', 'K 4.0 (0130): 20 mEq'], ['Tue', '04:30', '05:30', ''],
  ['Tue', '07:30', '08:30', 'K 4.2 (0530): 20 mEq'], ['Tue', '08:30', '09:30', '']
].map(([d, a, b, why]) => { const s = M(d, a); let e = M(d, b); if (e <= s) e += 1440; return { s, e, why, day: d, from: a, to: b }; });
const riderAt = m => RIDERS.filter(r => m >= r.s && m < r.e);
function salineRate(m) {
  if (m >= M('Mon', '01:55') && m < M('Mon', '02:55')) return 1000;   // 1 L bolus over 1 hour
  if (m >= M('Mon', '03:00') && m < M('Mon', '05:00')) return 500;
  if (m >= M('Mon', '05:00') && m < M('Mon', '07:05')) return 250;
  if (m >= M('Mon', '07:05') && m < M('Mon', '19:00')) return 150;
  if (m >= M('Mon', '19:00') && m < OFF) return 100;
  return 0;
}
// D10 pump rate (what the pump ran) and what the patient received
function d10Pump(m) {
  if (m >= M('Mon', '07:05') && m < M('Mon', '15:00')) return 100;
  if (m >= M('Mon', '19:00') && m < M('Tue', '02:10')) return 100;
  if (m >= M('Tue', '02:10') && m < OFF) return 150;
  return 0;
}
const d10Rate = m => (m >= DISC[0] && m < DISC[1] ? 0 : d10Pump(m));
function insulinRate(m) {
  if (m < M('Mon', '03:05') || m >= OFF) return 0;
  if (m >= HOLD[0] && m < HOLD[1]) return 0;
  return m < M('Tue', '03:05') ? 7.6 : 3.8;
}
const mgRate = m => (m >= M('Mon', '15:15') && m < M('Mon', '17:15') ? 25 : 0);          // 2 g in 50 mL over 2 h
const apapRate = m => (m >= M('Mon', '02:30') && m < M('Mon', '02:45') ? 400 : 0);        // 100 mL over 15 min
const kPerHour = m => riderAt(m).length * 10;   // no potassium in any bag that runs
const sum = (f, a, b) => { let v = 0; for (let m = a; m < b; m++) v += f(m) / 60; return v; };
const vol = (a, b) => ({ saline: sum(salineRate, a, b), d10: sum(d10Rate, a, b), d10Pumped: sum(d10Pump, a, b), insulin: sum(insulinRate, a, b), riders: sum(m => riderAt(m).length * 100, a, b), mg: sum(mgRate, a, b), apap: sum(apapRate, a, b),
  d50: (M('Tue', '03:05') >= a && M('Tue', '03:05') < b) ? 25 : 0, list: RIDERS.filter(r => r.s < b && r.e > a) });
module.exports = { M, RIDERS, salineRate, d10Rate, d10Pump, insulinRate, kPerHour, vol, OFF, HOLD, DISC };
if (require.main === module) {
  const blocks = [['ED', M('Mon', '01:30'), 0], ...[0, 4, 8, 12, 16, 20, 24, 28, 32].map(h => [`${h}-${h + 4}h`, h * 60, h * 60 + 240])];
  blocks.forEach(([n, a, b]) => { const v = vol(a, b); console.log(n, 'saline', v.saline.toFixed(1), 'D10', v.d10.toFixed(1), '(pumped', v.d10Pumped.toFixed(1) + ')', 'insulin', v.insulin.toFixed(1), 'riders', v.riders.toFixed(1), 'mg', v.mg, 'apap', v.apap, 'd50', v.d50); });
  let mx = 0; for (let m = -400; m < 2200; m++) mx = Math.max(mx, kPerHour(m)); console.log('max K mEq/h', mx, 'total insulin', vol(-400, 2200).insulin.toFixed(1));
}
