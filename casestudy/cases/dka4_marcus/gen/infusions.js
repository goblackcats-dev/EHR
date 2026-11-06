/* DKA patient 4 (Marcus Reyes): the IV timeline, one place for the arithmetic (used by the I&O blocks, the orders and DESIGN.md).
   PERIPHERAL POTASSIUM RULE (instructor, whole DKA series): peripheral IVs only, never more than 10 mEq potassium per hour from ALL sources.
   Here (AKI on CKD G3b): NO potassium in any carrier fluid. The only potassium is two KCl 10 mEq/100 mL riders, one at a time, 1100-1200 and 1200-1300
   (10 mEq/h, 20 mEq total).  Insulin 8 units/h (0.1 x 80 kg) from 0300; 4 units/h (0.05 x 80) from 0900; HELD 1100-1300; 4 units/h to 2100.
   Fluids: NS 250 mL bolus x2 (ED), NS 100 mL/h 0300-0900, D5NS 100 mL/h 0900-1300, D10W 50 mL/h 1300-2100 (same 5 g dextrose/h with half the volume).
   M(day, 'hh:mm') = minutes after Thu 0700 (negative before). */
const { hOf } = require('./lib');
const M = (d, t) => Math.round(hOf(d, t) * 60);
const T = { ed: M('Thu', '02:00'), b2: M('Thu', '02:30'), ns100: M('Thu', '03:00'), d5: M('Thu', '09:00'), d10: M('Thu', '13:00'), off: M('Thu', '21:00') };
const INS = [[M('Thu', '03:00'), M('Thu', '09:00'), 8], [M('Thu', '09:00'), M('Thu', '11:00'), 4], [M('Thu', '11:00'), M('Thu', '13:00'), 0], [M('Thu', '13:00'), M('Thu', '21:00'), 4]];   // [from, to, units/h]
const KCL_BAGS = [['11:00', '12:00'], ['12:00', '13:00']].map(([a, b]) => ({ s: M('Thu', a), e: M('Thu', b) }));
// main fluid: [mL/h, mEq K per L, dextrose g per 100 mL, name]
function fluid(m) {
  if (m < T.ed || m >= T.off) return null;
  if (m < T.b2) return { rate: 500, k: 0, dex: 0, name: 'NS' };        // 250 mL over 30 min
  if (m < T.ns100) return { rate: 500, k: 0, dex: 0, name: 'NS' };     // second 250 mL over 30 min
  if (m < T.d5) return { rate: 100, k: 0, dex: 0, name: 'NS' };
  if (m < T.d10) return { rate: 100, k: 0, dex: 5, name: 'D5NS' };
  return { rate: 50, k: 0, dex: 10, name: 'D10W' };
}
const insulinRate = m => { const r = INS.find(([a, b]) => m >= a && m < b); return r ? r[2] : 0; };
const bagAt = m => KCL_BAGS.find(b => m >= b.s && m < b.e);
const kPerHour = m => { const f = fluid(m); return (f ? f.rate * f.k / 1000 : 0) + (bagAt(m) ? 10 : 0); };   // mEq/h, all sources, both lines
const sum = (f, a, b) => { let v = 0; for (let m = a; m < b; m++) v += f(m) / 60; return v; };
const vol = (a, b) => ({
  fluid: Math.round(sum(m => (fluid(m) ? fluid(m).rate : 0), a, b)),
  insulin: Math.round(sum(insulinRate, a, b) * 10) / 10,                 // 1 unit/mL = mL
  kcl: Math.round(sum(m => (bagAt(m) ? 100 : 0), a, b)),
  kMeq: Math.round(sum(kPerHour, a, b) * 10) / 10, dexG: Math.round(sum(m => (fluid(m) ? fluid(m).rate * fluid(m).dex / 100 : 0), a, b))
});
module.exports = { M, T, fluid, insulinRate, kPerHour, vol, KCL_BAGS };
if (require.main === module) {
  const blocks = [['ED 0200-0700', M('Thu', '02:00'), 0], ...[0, 4, 8, 12, 16, 20, 24].map(h => [`${h}-${h + 4}h after 0700`, h * 60, h * 60 + 240])];
  blocks.forEach(([n, a, b]) => { const v = vol(a, b); console.log(n.padEnd(18), JSON.stringify(v)); });
  let max = 0; for (let m = M('Thu', '02:00'); m < M('Fri', '07:00'); m++) max = Math.max(max, kPerHour(m));
  console.log('max potassium rate over any minute (mEq/h):', max, '| total potassium', vol(M('Thu', '02:00'), 1500).kMeq, 'mEq');
  console.log('shift 1 (0700-1900): fluid', vol(0, 720).fluid, 'insulin mL', vol(0, 720).insulin, 'KCl mL', vol(0, 720).kcl, '| shift 2 fluid', vol(720, 1440).fluid, 'insulin', vol(720, 1440).insulin);
  console.log('ED 0200-0700: fluid', vol(M('Thu', '02:00'), 0).fluid, 'insulin', vol(M('Thu', '02:00'), 0).insulin, '| insulin 0300-0900', vol(M('Thu', '03:00'), 120).insulin, 'units; total', vol(M('Thu', '03:00'), 1500).insulin);
}
