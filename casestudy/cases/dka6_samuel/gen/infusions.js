/* DKA patient 6 (Samuel Okafor): the IV timeline, one place for the arithmetic (used by the I&O blocks, the orders, the potassium check and DESIGN.md).
   PERIPHERAL POTASSIUM RULE (instructor, whole DKA series): peripheral IVs only (two 18 g), never more than 10 mEq potassium per hour from ALL sources.
   The only potassium: KCl 10 mEq/100 mL riders, ONE at a time, Mon 0715-1115 (four = 40 mEq), plus the 20 mEq/L carrier (D5 0.45% NaCl or 0.45% NaCl + KCl 20 mEq/L) that runs at 150 mL/h = 3 mEq/h
   0500-0715 and 1130-2130. DURING THE FOUR RIDERS THE CARRIER IS POTASSIUM-FREE (D5 0.45% NaCl, 50 mL/h): the source ran its 20 mEq/L bag at 150 mL/h alongside the riders (13 mEq/h): corrected.
   Weight 80.0 kg. Insulin 8 units/h (0.1 x 80) 0215-0715, HELD 0715-1130 (K 3.3), 4 units/h (0.05 x 80) 1130-1915, 2 units/h 1915-2130 (overlap with glargine 22 units at 1930).
   Heparin: bolus 4,000 units (60 units/kg = 4,800, capped at the 4,000 maximum) at 0500, then 960 units/h (12 units/kg/h; maximum 1,000) of a 25,000 units/250 mL bag (100 units/mL) = 9.6 mL/h until the 1030 hold on Tue.
   M(day, 'hh:mm') = minutes after Mon 0700 (negative before). */
const { hOf } = require('./lib');
const M = (d, t) => Math.round(hOf(d, t) * 60);
// main fluids: [from, to, mL/h, mEq K per L, name, dextrose g per 100 mL]
const FLUIDS = [
  [M('Mon', '01:45'), M('Mon', '02:45'), 1000, 0, 'NS bolus', 0],
  [M('Mon', '02:45'), M('Mon', '05:00'), 200, 0, '0.45% NaCl', 0],
  [M('Mon', '05:00'), M('Mon', '07:15'), 150, 20, '0.45% NaCl + KCl 20 mEq/L', 0],
  [M('Mon', '07:15'), M('Mon', '11:30'), 50, 0, 'D5 0.45% NaCl (potassium-free, during riders)', 5],
  [M('Mon', '11:30'), M('Mon', '21:30'), 150, 20, 'D5 0.45% NaCl + KCl 20 mEq/L', 5],
  [M('Tue', '07:00'), M('Tue', '19:00'), 100, 0, 'NS (cath hydration)', 0]
];
const INS = [[M('Mon', '02:15'), M('Mon', '07:15'), 8], [M('Mon', '07:15'), M('Mon', '11:30'), 0], [M('Mon', '11:30'), M('Mon', '19:15'), 4], [M('Mon', '19:15'), M('Mon', '21:30'), 2]];   // [from, to, units/h]
const HEP = { s: M('Mon', '05:00'), e: M('Tue', '10:30'), mlh: 9.6, bolus: { t: M('Mon', '05:00'), ml: 4 } };   // 1,000 units/mL vial: 4,000 units = 4 mL
const KCL = [['Mon', '07:15'], ['Mon', '08:15'], ['Mon', '09:15'], ['Mon', '10:15']].map(([d, t]) => ({ s: M(d, t), e: M(d, t) + 60 }));
const ONDANSETRON = { t: M('Mon', '01:45'), ml: 2 };
const CATH = [{ t: M('Tue', '11:30'), ml: 20, what: 'cath-lab IV medicines and saline flushes (fentanyl 50 mcg, midazolam 1 mg, radial vasodilator mix, procedural heparin, flushes)' }, { t: M('Tue', '11:45'), ml: 85, what: 'iohexol 350 contrast' }];
// 10 mL saline flushes (ED and per shift; a lock flush per shift once the infusions end)
const FLUSH = [['Mon', '01:50'], ['Mon', '05:05'], ['Mon', '08:30'], ['Mon', '11:20'], ['Mon', '15:30'], ['Mon', '21:35'], ['Tue', '19:05'], ['Wed', '08:00'], ['Wed', '20:00']].map(([d, t]) => M(d, t));
const inR = (m, [a, b]) => m >= a && m < b;
const fluidRate = m => FLUIDS.reduce((s, f) => s + (m >= f[0] && m < f[1] ? f[2] : 0), 0);
const fluidK = m => FLUIDS.reduce((s, f) => s + (m >= f[0] && m < f[1] ? f[2] * f[3] / 1000 : 0), 0);   // mEq/h from the carrier
const dexG = m => FLUIDS.reduce((s, f) => s + (m >= f[0] && m < f[1] ? f[2] * f[5] / 100 / 60 : 0), 0);
const insulinRate = m => { const r = INS.find(([a, b]) => m >= a && m < b); return r ? r[2] : 0; };
const kclRate = m => (KCL.find(b => m >= b.s && m < b.e) ? 10 : 0);
const kPerHour = m => fluidK(m) + kclRate(m);   // mEq/h, all sources, all lines
const sum = (f, a, b) => { let v = 0; for (let m = a; m < b; m++) v += f(m); return v; };
const point = (t, ml, a, b) => (t >= a && t < b ? ml : 0);
const vol = (a, b) => {
  const fluidMl = sum(m => fluidRate(m) / 60, a, b);
  const insulin = sum(m => insulinRate(m) / 60, a, b);                                    // 1 unit/mL = mL (100 units/100 mL)
  const hep = sum(m => (m >= HEP.s && m < HEP.e ? HEP.mlh / 60 : 0), a, b) + point(HEP.bolus.t, HEP.bolus.ml, a, b);
  const kcl = sum(m => kclRate(m) * 10 / 60, a, b);                                       // 100 mL per 60 min
  const cathMl = CATH.reduce((s, c) => s + point(c.t, c.ml, a, b), 0);
  const ond = point(ONDANSETRON.t, ONDANSETRON.ml, a, b);
  const fl = FLUSH.filter(t => t >= a && t < b).length * 10;
  return { fluid: fluidMl, insulin, hep, kcl, cath: cathMl, ond, flush: fl, ivmed: insulin + hep + kcl + cathMl + ond + fl, kMeq: sum(kPerHour, a, b) / 60, dexG: sum(dexG, a, b) };
};
module.exports = { M, FLUIDS, INS, HEP, KCL, CATH, FLUSH, fluidRate, insulinRate, kclRate, kPerHour, fluidK, vol };
if (require.main === module) {
  const r1 = x => Math.round(x * 100) / 100;
  const show = (n, v) => console.log(n.padEnd(22), Object.fromEntries(Object.entries(v).map(([k, x]) => [k, r1(x)])));
  show('ED 0130-0700', vol(M('Mon', '01:30'), 0));
  [['shift 1 0700-1900', 0, 720], ['shift 2 1900-0700', 720, 1440], ['shift 3 D2 0700-1900', 1440, 2160], ['shift 4', 2160, 2880], ['shift 5', 2880, 3600], ['shift 6', 3600, 4320]].forEach(([n, a, b]) => show(n, vol(a, b)));
  let max = 0, at = 0; for (let m = M('Mon', '01:30'); m < M('Wed', '07:00'); m++) if (kPerHour(m) > max) { max = kPerHour(m); at = m; }
  console.log('max potassium rate over any minute (mEq/h):', r1(max), 'at minute', at, '| total potassium 0130 Mon - 0700 Wed', r1(vol(M('Mon', '01:30'), M('Wed', '07:00')).kMeq), 'mEq');
  let overlap = 0; for (let m = M('Mon', '01:30'); m < M('Tue', '07:00'); m++) if (kclRate(m) && fluidK(m) > 0) overlap++; console.log('minutes with a KCl rider AND a potassium-containing carrier:', overlap);
}
