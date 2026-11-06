/* DKA patient 7 (Priya Desai): the IV timeline, one place for the arithmetic (I&O blocks, orders, potassium check, DESIGN.md).
   PERIPHERAL POTASSIUM RULE (series): two peripheral 18 g IVs, never more than 10 mEq potassium per hour from ALL sources.
   The source ran KCl 10 mEq riders (0415, and 0715-1015) while D5 0.45% NaCl + KCl 20 mEq/L ran at 250 mL/h (5 mEq/h) = 15 mEq/h: corrected.
   Here the carrier is POTASSIUM-FREE (D5 0.45% NaCl) during EVERY rider and the 20 mEq/L bag runs only when no rider runs.
   Weight 70.0 kg. Insulin 7 units/h (0.1 x 70) 0215-0710, HELD 0710-0930 (K 3.2; dextrose-containing carrier kept for the fetus), 3.5 units/h (0.05 x 70) 0930-2130.
   Riders (KCl 10 mEq/100 mL over 1 h, one at a time): 0420 (ED), 0715, 0815 (hold), 0930 (restart, K 3.6). Mg sulfate 2 g/100 mL 0730-0930 on the other line.
   M(day, 'hh:mm') = minutes after Mon 0700 (negative before). */
const { hOf } = require('./lib');
const M = (d, t) => Math.round(hOf(d, t) * 60);
// main fluids: [from, to, mL/h, mEq K per L, name, dextrose g per 100 mL]
const FLUIDS = [
  [M('Mon', '01:50'), M('Mon', '02:50'), 1000, 0, 'NS bolus', 0],
  [M('Mon', '02:50'), M('Mon', '03:00'), 250, 0, '0.9% NaCl', 0],
  [M('Mon', '03:00'), M('Mon', '04:20'), 250, 20, 'D5 0.45% NaCl + KCl 20 mEq/L', 5],
  [M('Mon', '04:20'), M('Mon', '05:20'), 150, 0, 'D5 0.45% NaCl (potassium-free, during rider 1)', 5],
  [M('Mon', '05:20'), M('Mon', '07:10'), 250, 20, 'D5 0.45% NaCl + KCl 20 mEq/L', 5],
  [M('Mon', '07:10'), M('Mon', '10:30'), 100, 0, 'D5 0.45% NaCl (potassium-free, during riders 2-4 and the hold)', 5],
  [M('Mon', '10:30'), M('Mon', '21:30'), 200, 20, 'D5 0.45% NaCl + KCl 20 mEq/L', 5]
];
const INS = [[M('Mon', '02:15'), M('Mon', '07:10'), 7], [M('Mon', '07:10'), M('Mon', '09:30'), 0], [M('Mon', '09:30'), M('Mon', '21:30'), 3.5]];   // [from, to, units/h]
const KCL = [['Mon', '04:20'], ['Mon', '07:15'], ['Mon', '08:15'], ['Mon', '09:30']].map(([d, t]) => ({ s: M(d, t), e: M(d, t) + 60 }));
const MG = { s: M('Mon', '07:30'), e: M('Mon', '09:30'), mlh: 50 };
const ONDANSETRON = { t: M('Mon', '01:55'), ml: 2 };
const FLUSH = [['Mon', '01:50'], ['Mon', '05:25'], ['Mon', '10:35'], ['Mon', '15:30'], ['Mon', '21:35'], ['Tue', '06:00'], ['Tue', '18:00'], ['Wed', '06:00'], ['Wed', '18:00']].map(([d, t]) => M(d, t));
const fluidRate = m => FLUIDS.reduce((s, f) => s + (m >= f[0] && m < f[1] ? f[2] : 0), 0);
const fluidK = m => FLUIDS.reduce((s, f) => s + (m >= f[0] && m < f[1] ? f[2] * f[3] / 1000 : 0), 0);
const dexG = m => FLUIDS.reduce((s, f) => s + (m >= f[0] && m < f[1] ? f[2] * f[5] / 100 / 60 : 0), 0);
const insulinRate = m => { const r = INS.find(([a, b]) => m >= a && m < b); return r ? r[2] : 0; };
const kclRate = m => (KCL.find(b => m >= b.s && m < b.e) ? 10 : 0);
const mgRate = m => (m >= MG.s && m < MG.e ? MG.mlh : 0);
const kPerHour = m => fluidK(m) + kclRate(m);
const sum = (f, a, b) => { let v = 0; for (let m = a; m < b; m++) v += f(m); return v; };
const point = (t, ml, a, b) => (t >= a && t < b ? ml : 0);
const vol = (a, b) => {
  const fluidMl = sum(m => fluidRate(m) / 60, a, b);
  const insulin = sum(m => insulinRate(m) / 60, a, b);
  const kcl = sum(m => kclRate(m) * 10 / 60, a, b);
  const mg = sum(m => mgRate(m) / 60, a, b);
  const ond = point(ONDANSETRON.t, ONDANSETRON.ml, a, b);
  const fl = FLUSH.filter(t => t >= a && t < b).length * 10;
  return { fluid: fluidMl, insulin, kcl, mg, ond, flush: fl, ivmed: insulin + kcl + mg + ond + fl, kMeq: sum(kPerHour, a, b) / 60, dexG: sum(dexG, a, b) };
};
module.exports = { M, FLUIDS, INS, KCL, MG, FLUSH, ONDANSETRON, fluidRate, insulinRate, kclRate, mgRate, kPerHour, fluidK, vol };
if (require.main === module) {
  const r1 = x => Math.round(x * 100) / 100;
  const show = (n, v) => console.log(n.padEnd(22), Object.fromEntries(Object.entries(v).map(([k, x]) => [k, r1(x)])));
  show('ED 0130-0700', vol(M('Mon', '01:30'), 0));
  [['shift 1', 0, 720], ['shift 2', 720, 1440], ['shift 3', 1440, 2160], ['shift 4', 2160, 2880], ['shift 5', 2880, 3600], ['shift 6', 3600, 4320]].forEach(([n, a, b]) => show(n, vol(a, b)));
  let max = 0; for (let m = M('Mon', '01:30'); m < M('Wed', '07:00'); m++) max = Math.max(max, kPerHour(m));
  console.log('max potassium rate over any minute (mEq/h):', r1(max), '| total potassium', r1(vol(M('Mon', '01:30'), M('Wed', '07:00')).kMeq), 'mEq');
  let overlap = 0; for (let m = M('Mon', '01:30'); m < M('Tue', '07:00'); m++) if (kclRate(m) && fluidK(m) > 0) overlap++; console.log('minutes with a rider AND a potassium-containing carrier:', overlap);
  console.log('insulin units total', r1(sum(insulinRate, M('Mon', '01:30'), M('Wed', '07:00')) / 60), 'dextrose g', r1(sum(dexG, M('Mon', '01:30'), M('Wed', '07:00'))));
}
