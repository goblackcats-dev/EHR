/* DKA patient 3 (Denise Carter): the IV timeline, one place for the arithmetic (used by the I&O blocks, the orders and DESIGN.md).
   PERIPHERAL POTASSIUM RULE (instructor, whole DKA series): peripheral IVs only, never more than 10 mEq potassium per hour from ALL sources.
   Here: NS + KCl 20 mEq/L at 250 mL/h (5 mEq/h) 0500-0800; potassium-free saline 250 mL/h while four KCl 10 mEq/100 mL piggybacks run
   back to back 0800-1200 (10 mEq/h, no K in the carrier); D5NS + KCl 20 mEq/L at 200 mL/h (4 mEq/h) 1200-1830; no potassium after 1830.
   M(day, 'hh:mm') = minutes after Mon 0700 (negative before). */
const { hOf } = require('./lib');
const M = (d, t) => Math.round(hOf(d, t) * 60);
const T = { ed: M('Mon', '02:00'), ns500: M('Mon', '03:00'), k20: M('Mon', '05:00'), plain: M('Mon', '08:00'), d5: M('Mon', '12:00'), off: M('Mon', '18:30'), stop: M('Tue', '07:00') };
const INS = [[M('Mon', '03:00'), M('Mon', '08:00'), 6], [M('Mon', '08:00'), M('Mon', '10:00'), 0], [M('Mon', '10:00'), M('Mon', '12:00'), 6], [M('Mon', '12:00'), M('Mon', '18:30'), 3]];   // [from, to, units/h]
const KCL_BAGS = [['08:00', '09:00'], ['09:00', '10:00'], ['10:00', '11:00'], ['11:00', '12:00']].map(([a, b]) => ({ s: M('Mon', a), e: M('Mon', b) }));
const MG = { s: M('Mon', '08:00'), e: M('Mon', '10:00'), mL: 100 };
// main fluid: [mL/h, mEq K per L, dextrose g per 100 mL, name]
function fluid(m) {
  if (m < T.ed || m >= T.stop) return null;
  if (m < T.ns500) return { rate: 1000, k: 0, dex: 0, name: 'NS' };
  if (m < T.k20) return { rate: 500, k: 0, dex: 0, name: 'NS' };
  if (m < T.plain) return { rate: 250, k: 20, dex: 0, name: 'NS+K20' };
  if (m < T.d5) return { rate: 250, k: 0, dex: 0, name: 'NS' };
  if (m < T.off) return { rate: 200, k: 20, dex: 5, name: 'D5NS+K20' };
  return { rate: 100, k: 0, dex: 0, name: 'NS' };
}
const insulinRate = m => { const r = INS.find(([a, b]) => m >= a && m < b); return r ? r[2] : 0; };
const bagAt = m => KCL_BAGS.find(b => m >= b.s && m < b.e);
const kPerHour = m => { const f = fluid(m); return (f ? f.rate * f.k / 1000 : 0) + (bagAt(m) ? 10 : 0); };   // mEq/h, all sources, both lines
const sum = (f, a, b) => { let v = 0; for (let m = a; m < b; m++) v += f(m) / 60; return v; };
const vol = (a, b) => ({
  fluid: Math.round(sum(m => (fluid(m) ? fluid(m).rate : 0), a, b)),
  d5ns: Math.round(sum(m => (fluid(m) && fluid(m).dex ? fluid(m).rate : 0), a, b)),
  insulin: Math.round(sum(insulinRate, a, b) * 10) / 10,                 // 1 unit/mL = mL
  kcl: Math.round(sum(m => (bagAt(m) ? 100 : 0), a, b)),
  mg: Math.round(sum(m => (m >= MG.s && m < MG.e ? 50 : 0), a, b)),
  kMeq: Math.round(sum(kPerHour, a, b) * 10) / 10, dexG: Math.round(sum(m => (fluid(m) ? fluid(m).rate * fluid(m).dex / 100 : 0), a, b))
});
module.exports = { M, T, fluid, insulinRate, kPerHour, vol, KCL_BAGS, MG };
if (require.main === module) {
  const blocks = [['ED 0200-0700', M('Mon', '02:00'), 0], ...[0, 4, 8, 12, 16, 20, 24].map(h => [`${h}-${h + 4}h after 0700`, h * 60, h * 60 + 240])];
  blocks.forEach(([n, a, b]) => { if (typeof b !== 'number') return; const v = vol(a, b || 0); console.log(n.padEnd(18), JSON.stringify(v)); });
  let max = 0; for (let m = M('Mon', '02:00'); m < M('Tue', '07:00'); m++) max = Math.max(max, kPerHour(m));
  console.log('max potassium rate over any minute (mEq/h):', max);
  console.log('potassium ED (0200-0700):', vol(M('Mon', '02:00'), 0).kMeq, '| unit 0700-0800:', vol(0, 60).kMeq, '| 0800-1200:', vol(60, 300).kMeq, '| 1200-1830:', vol(300, 690).kMeq, '| total', vol(M('Mon', '02:00'), 1500).kMeq);
  console.log('day-1 shift (0700-1900) fluid', vol(0, 720).fluid, 'insulin mL', vol(0, 720).insulin, 'KCl mL', vol(0, 720).kcl, 'Mg mL', vol(0, 720).mg, '| night fluid', vol(720, 1440).fluid, '| dextrose g', vol(0, 1440).dexG);
  console.log('insulin units before 0700:', vol(M('Mon', '03:00'), 0).insulin, '(ED 6 x 4 h) | unit day 1:', vol(0, 720).insulin);
}
