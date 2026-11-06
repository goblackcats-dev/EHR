/* DKA patient 5 (Ruth Nakamura): the IV timeline, one place for the arithmetic (used by the I&O blocks, the orders, the potassium check and DESIGN.md).
   PERIPHERAL POTASSIUM RULE (instructor, whole DKA series): peripheral IVs only, never more than 10 mEq potassium per hour from ALL sources.
   No potassium is added to any maintenance fluid. The only potassium: KCl 10 mEq/100 mL riders, ONE at a time, 0330-0430, 0430-0530 (ED), 0700-1100 (four) and 1500-1700 (two) = 80 mEq,
   plus the intrinsic 4 mEq/L of lactated Ringer's (LR) when LR is running (never during a rider: potassium-free saline is used then).
   Weight 60.0 kg. Insulin 6 units/h (0.1 x 60) from 0200, HELD 0700-0915 (K 3.3), 6 units/h 0915-D2 0100. D10W 100 mL/h from 0200 (50 during the hold, 100 from 0915, 150 from 1300).
   M(day, 'hh:mm') = minutes after Thu 0700 (negative before). */
const { hOf } = require('./lib');
const M = (d, t) => Math.round(hOf(d, t) * 60);
// main fluids: [from, to, mL/h, mEq K per L, name]
const FLUIDS = [
  [M('Thu', '01:00'), M('Thu', '01:30'), 1000, 4, 'LR bolus 1'], [M('Thu', '01:30'), M('Thu', '02:00'), 1000, 4, 'LR bolus 2'], [M('Thu', '02:00'), M('Thu', '03:00'), 800, 4, 'LR bolus 3'],
  [M('Thu', '03:00'), M('Thu', '03:30'), 100, 4, 'LR'], [M('Thu', '03:30'), M('Thu', '05:30'), 100, 0, 'NS (potassium-free, during riders)'], [M('Thu', '05:30'), M('Thu', '07:00'), 100, 4, 'LR'],
  [M('Thu', '07:00'), M('Thu', '11:00'), 100, 0, 'NS (potassium-free, during riders)']
];
// D10W: [from, to, mL/h]
const D10 = [[M('Thu', '02:00'), M('Thu', '07:00'), 100], [M('Thu', '07:00'), M('Thu', '09:15'), 50], [M('Thu', '09:15'), M('Thu', '13:00'), 100], [M('Thu', '13:00'), M('Fri', '01:00'), 150]];
const INS = [[M('Thu', '02:00'), M('Thu', '07:00'), 6], [M('Thu', '07:00'), M('Thu', '09:15'), 0], [M('Thu', '09:15'), M('Fri', '01:00'), 6]];   // [from, to, units/h]
const KCL = [['Thu', '03:30'], ['Thu', '04:30'], ['Thu', '07:00'], ['Thu', '08:00'], ['Thu', '09:00'], ['Thu', '10:00'], ['Thu', '15:00'], ['Thu', '16:00']].map(([d, t]) => ({ s: M(d, t), e: M(d, t) + 60 }));
const MG = { s: M('Thu', '11:30'), e: M('Thu', '12:30'), ml: 50 };
const CTX = [{ s: M('Thu', '01:40'), e: M('Thu', '02:10') }, { s: M('Fri', '01:40'), e: M('Fri', '02:10') }];   // ceftriaxone 2 g in 100 mL over 30 min
const ONDANSETRON = { t: M('Thu', '01:20'), ml: 2 };
// 10 mL saline flushes (design Section 5): ED, then per shift
const FLUSH = [['Thu', '01:25'], ['Thu', '02:10'], ['Thu', '05:30'], ['Thu', '11:05'], ['Thu', '12:30'], ['Thu', '17:00'], ['Thu', '18:30'], ['Thu', '21:00'], ['Fri', '01:10'], ['Fri', '02:10'], ['Fri', '06:30'],
  ['Fri', '08:00'], ['Fri', '12:00'], ['Fri', '16:00'], ['Fri', '18:30'], ['Fri', '21:00'], ['Sat', '06:30'], ['Sat', '08:00'], ['Sat', '12:00'], ['Sat', '16:00'], ['Sat', '18:30'], ['Sat', '21:00'], ['Sun', '06:30']].map(([d, t]) => M(d, t));
const inR = (m, [a, b]) => m >= a && m < b;
const fluidRate = m => FLUIDS.reduce((s, f) => s + (m >= f[0] && m < f[1] ? f[2] : 0), 0);
const fluidK = m => FLUIDS.reduce((s, f) => s + (m >= f[0] && m < f[1] ? f[2] * f[3] / 1000 : 0), 0);   // mEq/h from the carrier
const d10Rate = m => D10.reduce((s, f) => s + (m >= f[0] && m < f[1] ? f[2] : 0), 0);
const insulinRate = m => { const r = INS.find(([a, b]) => m >= a && m < b); return r ? r[2] : 0; };
const kclRate = m => (KCL.find(b => m >= b.s && m < b.e) ? 10 : 0);
const kPerHour = m => fluidK(m) + kclRate(m);   // mEq/h, all sources, all lines
const sum = (f, a, b) => { let v = 0; for (let m = a; m < b; m++) v += f(m); return v; };
const vol = (a, b) => {
  const fluidMl = sum(m => (fluidRate(m) + d10Rate(m)) / 60, a, b);
  const insulin = sum(m => insulinRate(m) / 60, a, b);                                    // 1 unit/mL = mL
  const kcl = sum(m => kclRate(m) * 10 / 60, a, b);                                       // 100 mL per 60 min
  const mg = sum(m => (m >= MG.s && m < MG.e ? MG.ml / 60 : 0), a, b);
  const ctx = sum(m => (CTX.some(c => m >= c.s && m < c.e) ? 100 / 30 : 0), a, b);
  const ond = ONDANSETRON.t >= a && ONDANSETRON.t < b ? ONDANSETRON.ml : 0;
  const fl = FLUSH.filter(t => t >= a && t < b).length * 10;
  return { fluid: fluidMl, lr: sum(m => (FLUIDS.some(f => /^LR/.test(f[4]) && m >= f[0] && m < f[1]) ? fluidRate(m) / 60 : 0), a, b), ns: sum(m => (FLUIDS.some(f => /^NS/.test(f[4]) && m >= f[0] && m < f[1]) ? fluidRate(m) / 60 : 0), a, b), d10: sum(d10Rate, 0 + a, b) / 60,
    insulin, kcl, mg, ctx, ond, flush: fl, ivmed: insulin + kcl + mg + ctx + ond + fl, kMeq: sum(kPerHour, a, b) / 60, dexG: sum(m => d10Rate(m) / 60 * 0.1, a, b) };
};
module.exports = { M, FLUIDS, D10, INS, KCL, MG, CTX, FLUSH, fluidRate, d10Rate, insulinRate, kclRate, kPerHour, vol };
if (require.main === module) {
  const r1 = x => Math.round(x * 100) / 100;
  const show = (n, v) => console.log(n.padEnd(22), Object.fromEntries(Object.entries(v).map(([k, x]) => [k, r1(x)])));
  show('ED 0100-0700', vol(M('Thu', '01:00'), 0));
  [0, 4, 8, 12, 16, 20, 24].forEach(h => show(`${h}-${h + 4}h after 0700`, vol(h * 60, h * 60 + 240)));
  show('shift 1 0700-1900', vol(0, 720)); show('shift 2 1900-0700', vol(720, 1440));
  let max = 0, at = 0; for (let m = M('Thu', '01:00'); m < M('Fri', '07:00'); m++) if (kPerHour(m) > max) { max = kPerHour(m); at = m; }
  console.log('max potassium rate over any minute (mEq/h):', r1(max), 'at minute', at, '| total potassium 0100-D2 0700', r1(vol(M('Thu', '01:00'), M('Fri', '07:00')).kMeq), 'mEq (KCl 80 + LR intrinsic)');
  // when a rider runs, is the carrier potassium-free?
  let overlap = 0; for (let m = M('Thu', '01:00'); m < M('Fri', '07:00'); m++) if (kclRate(m) && fluidK(m) > 0) overlap++; console.log('minutes with a KCl rider AND potassium-containing carrier:', overlap);
}
