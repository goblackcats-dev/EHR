/* DKA patient 1: IV timeline used for the I&O blocks, the orders and DESIGN.md (one place for the arithmetic).
   PERIPHERAL POTASSIUM RULE (instructor, whole DKA series): through a peripheral IV no more than 10 mEq potassium per hour, as separate
   riders (KCl 10 mEq/100 mL over 1 h; potassium phosphate 5 mmol = 7.3 mEq K in 100 mL over 2 h), one at a time. 40 mEq/L in a bag is the
   CENTRAL-line strength cap. Maya has peripheral IVs only, so her two-bag fluids have NO potassium; maintenance fluid after the transition has
   KCl 20 mEq/L (under the peripheral limit) and no riders run with it.
   Riders add volume, so while one runs the two-bag total is lowered (same Bag A : Bag B ratio). */
const { hOf } = require('./lib');
const M = (d, t) => Math.round(hOf(d, t) * 60);   // minutes after Mon 0700
// two-bag base total (mL/h): 125 from 0545 (ED), 70 from 1145 Mon (cerebral edema: one-third less overall), off at 0915 Tue
const TB_ON = M('Mon', '05:45'), TB_CUT = M('Mon', '11:45'), TB_OFF = M('Tue', '09:15');
// [start, end, kind] kind: 'KCl' (10 mEq / 100 mL over 1 h) or 'KPhos' (5 mmol phosphate = 7.3 mEq K / 100 mL over 2 h)
const RIDERS = [
  ['Mon', '05:45', '06:45', 'KCl', 'ED: K 4.7 (0430), voiding'],
  ['Mon', '09:30', '10:30', 'KCl', 'K 3.9 (0830): 20 mEq this cycle'],
  ['Mon', '10:30', '12:30', 'KPhos', 'phosphorus 2.6 (0830)'],
  ['Mon', '13:00', '14:00', 'KCl', 'K 3.5 (1140): 20 mEq this cycle'],
  ['Mon', '15:00', '16:00', 'KCl', ''],
  ['Mon', '17:30', '18:30', 'KCl', 'K 3.3 (1630): 4 riders back to back'],
  ['Mon', '18:30', '19:30', 'KCl', ''],
  ['Mon', '19:30', '20:30', 'KCl', ''],
  ['Mon', '20:30', '21:30', 'KCl', ''],
  ['Mon', '21:30', '23:30', 'KPhos', 'phosphorus 1.8 (1630), 1.6 (2030)'],
  ['Mon', '23:30', '00:30', 'KCl', 'K 3.6 (2030): 20 mEq this cycle'],
  ['Tue', '01:30', '03:30', 'KPhos', 'K 3.8, phosphorus 1.9 (0030)'],
  ['Tue', '03:30', '04:30', 'KCl', ''],
  ['Tue', '05:30', '07:30', 'KPhos', 'K 3.9, phosphorus 2.4 (0430)'],
  ['Tue', '07:30', '08:30', 'KCl', '']
].map(([d, a, b, kind, why]) => { const s = M(d, a); let e = M(d, b); if (e <= s) e += 1440; return { s, e, kind, why, day: d, from: a, to: b }; });
const riderAt = m => RIDERS.find(r => m >= r.s && m < r.e);
const riderRate = r => (r ? (r.kind === 'KCl' ? 100 : 50) : 0);
function twoBagRate(m) {
  if (m < TB_ON || m >= TB_OFF) return 0;
  const base = m < TB_CUT ? 125 : 70, r = riderAt(m);
  if (!r) return base;
  if (r.kind === 'KCl') return base === 125 ? 75 : 40;   // two-bag + KCl rider = 175 (before 1145) or 140 (after)
  return base === 125 ? 100 : 60;                         // two-bag + potassium phosphate rider = 150 or 110
}
// insulin infusion 1 unit/mL: 4.9 mL/h from 0400 Mon, 3.6 mL/h from 0310 Tue, off 0915 Tue
const insulinRate = m => (m < M('Mon', '04:00') || m >= TB_OFF ? 0 : m < M('Tue', '03:10') ? 4.9 : 3.6);
const sum = (f, a, b) => { let v = 0; for (let m = a; m < b; m++) v += f(m) / 60; return v; };
const vol = (a, b) => ({ twoBag: Math.round(sum(twoBagRate, a, b)), riders: Math.round(sum(m => riderRate(riderAt(m)), a, b)), insulin: Math.round(sum(insulinRate, a, b)),
  kMeq: Math.round(sum(m => { const r = riderAt(m); return r ? (r.kind === 'KCl' ? 10 : 3.65) : 0; }, a, b)), list: RIDERS.filter(r => r.s < b && r.e > a) });
module.exports = { M, RIDERS, twoBagRate, insulinRate, vol, TB_ON, TB_CUT, TB_OFF };
if (require.main === module) {
  const blocks = [['ED', M('Mon', '02:05'), M('Mon', '07:00')], ...[0, 4, 8, 12, 16, 20, 24].map(h => [`${h}-${h + 4}h`, h * 60, h * 60 + 240])];
  blocks.forEach(([n, a, b]) => { const v = vol(a, b); console.log(n, 'twoBag', v.twoBag, 'riders', v.riders, 'insulin', v.insulin, 'K mEq', v.kMeq, v.list.map(r => `${r.kind} ${r.from}-${r.to}`).join(', ')); });
  let maxK = 0; for (let m = -300; m < 1700; m++) { const r = riderAt(m); maxK = Math.max(maxK, r ? (r.kind === 'KCl' ? 10 : 3.65) : 0); }
  console.log('max K mEq/h', maxK, 'total K mEq', vol(-300, 1700).kMeq, 'phosphate mmol', RIDERS.filter(r => r.kind === 'KPhos').length * 5);
}
