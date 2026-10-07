/* NursingSim Case Builder v2 - generation engine.

   Everything is expressed in HOURS SINCE ADMISSION (h = 0 is arrival).
   The simulation starts at hour `nowH`; anything earlier is chart history, anything in the next 8 hours
   is released into the chart as the simulation clock advances. */
NS.engine = (() => {
  const U = NS.util;

  // ---------- Providers (all fictional) ----------
  const TEAM = {
    ed: 'J. Whitaker, MD', hospitalist: 'S. Patel, MD', surgeon: 'R. Alvarez, MD', cardiology: 'H. Banerjee, MD',
    nephrology: 'O. Lindqvist, MD', neurology: 'F. Okafor, MD', pulm: 'G. Mehta, MD',
    rnDay: 'T. Nguyen, RN', rnNight: 'L. Bennett, RN', rt: 'D. Moore, RRT', pt: 'A. Kim, PT, DPT',
    ot: 'C. Rivera, OTR/L', slp: 'E. Hart, CCC-SLP', rd: 'N. Foster, RD, LDN', cm: 'P. Lawson, RN, CCM',
    radiology: 'W. Chen, MD (Radiology)', pharm: 'Inpatient Pharmacy'
  };

  // ---------- Medication schedules ----------
  const FREQ = {
    once:  { text: 'Once' },
    stat:  { text: 'Once (STAT)' },
    daily: { text: 'Daily', clock: ['0900'] },
    BID:   { text: 'BID', clock: ['0900', '2100'], gap: 6 },
    TID:   { text: 'TID', clock: ['0900', '1400', '2100'], gap: 4 },
    QID:   { text: 'QID', clock: ['0900', '1300', '1700', '2100'], gap: 3 },
    q4h:   { text: 'Every 4 hours', clock: ['0000', '0400', '0800', '1200', '1600', '2000'], gap: 2 },
    q6h:   { text: 'Every 6 hours', clock: ['0000', '0600', '1200', '1800'], gap: 3 },
    q8h:   { text: 'Every 8 hours', clock: ['0600', '1400', '2200'], gap: 4 },
    q12h:  { text: 'Every 12 hours', clock: ['0900', '2100'], gap: 6 },
    q24h:  { text: 'Every 24 hours', clock: ['0900'], gap: 12 },
    qHS:   { text: 'Nightly at bedtime', clock: ['2100'], gap: 12 },
    ACHS:  { text: 'ACHS (before meals and at bedtime)', clock: ['0730', '1130', '1630', '2100'], gap: 3 },
    AC:    { text: 'Before meals', clock: ['0730', '1130', '1630'], gap: 3 },
    continuous: { text: 'Continuous infusion' }
  };

  const MONITOR = {
    BP:   { label: 'Blood Pressure', sourceType: 'vital', code: 'BP' },
    HR:   { label: 'Heart Rate', sourceType: 'vital', code: 'HR' },
    RR:   { label: 'Respiratory Rate', sourceType: 'vital', code: 'RR' },
    SPO2: { label: 'SpO2', sourceType: 'vital', code: 'SPO2' },
    Temp: { label: 'Temperature', sourceType: 'vital', code: 'TEMP' },
    Pain: { label: 'Pain', sourceType: 'vital', code: 'PAIN' },
    K: { label: 'Potassium', sourceType: 'lab', code: 'Potassium' },
    Na: { label: 'Sodium', sourceType: 'lab', code: 'Sodium' },
    Mg: { label: 'Magnesium', sourceType: 'lab', code: 'Magnesium' },
    Cr: { label: 'Creatinine', sourceType: 'lab', code: 'Creatinine' },
    BUN: { label: 'BUN', sourceType: 'lab', code: 'BUN' },
    Glucose: { label: 'Glucose', sourceType: 'lab', code: 'Glucose' },
    INR: { label: 'INR', sourceType: 'lab', code: 'INR' },
    PT: { label: 'PT', sourceType: 'lab', code: 'PT' },
    WBC: { label: 'WBC', sourceType: 'lab', code: 'WBC' },
    Hgb: { label: 'Hemoglobin', sourceType: 'lab', code: 'Hemoglobin' },
    Plt: { label: 'Platelets', sourceType: 'lab', code: 'Platelets' },
    Lactate: { label: 'Lactate', sourceType: 'lab', code: 'Lactate' },
    Lipase: { label: 'Lipase', sourceType: 'lab', code: 'Lipase' },
    LFT: { label: 'ALT', sourceType: 'lab', code: 'ALT' }
  };

  // ---------- Context ----------
  function makeCtx(input) {
    const start = `${input.simDate} ${input.startTime || '07:00'}`;
    const L = U.clamp(parseInt(input.hospitalDay, 10) || 1, 1, 21);
    const nowH = 5 + 24 * (L - 1);
    const admit = U.addH(start, -nowH);
    const hx = new Set(input.hx || []);
    const surg = new Set(input.surg || []);
    const renal = (hx.has('esrd') || hx.has('ckd5')) ? 'esrd' : (hx.has('ckd4') || hx.has('ckd3')) ? 'ckd3' : 'none';
    const sex = input.sex || 'Male';
    const age = parseInt(input.age, 10) || 60;
    const heightCm = Number(input.heightCm) || (sex === 'Female' ? 163 : 177);
    let weightKg = Number(input.weightKg) || (sex === 'Female' ? 70 : 84);
    const bmi = U.round(weightKg / Math.pow(heightCm / 100, 2), 1);
    const allergies = (input.allergies || []).filter(a => a && a.substance && !/^(nkda|none)$/i.test(a.substance));
    const seed = U.hashString([input.mrn, input.name, input.primary, L, [...hx].sort().join(','), input.simDate].join('|'));
    const rng = U.mulberry32(seed);
    const ctx = {
      input, L, nowH, start, admit, hx, surg, renal, sex, age, heightCm, weightKg, bmi, allergies, rng,
      female: sex === 'Female', male: sex !== 'Female',
      name: input.name, social: input.social || {}, team: TEAM,
      windowEnd: nowH + 8,
      ts: h => U.addH(admit, h),
      hOf: text => (U.parse(text) - U.parse(admit)) / 3600000,
      has: key => hx.has(key),
      surgYears: input.surgYears || {},
      surgYear: key => (input.surgYears || {})[key] || '',
      allergic: word => allergies.some(a => new RegExp(word, 'i').test(a.substance)),
      noise: (amp) => (rng() - 0.5) * 2 * amp
    };
    return ctx;
  }

  // ---------- Spec normalisation ----------
  function normalizeSpec(spec) {
    const s = Object.assign({
      extraProblems: [], flags: {}, vitals: [], labs: {}, labSchedule: [], quals: [], events: [], meds: [], orders: [],
      devices: [], assessments: [], io: [], stages: [], stickies: [], objectives: [], notesPlan: {}, comorb: [],
      vitalAdjust: [], labBase: {}, labAdd: {}, ioMult: {}, planExtra: [], applied: [], warnings: []
    }, spec);
    s.vitals.sort((a, b) => a.h - b.h);
    s.stages.sort((a, b) => a.fromH - b.fromH);
    return s;
  }

  const stageAt = (spec, h) => U.stepAt(spec.stages, h) || spec.stages[0] || {};
  const flagAt = (spec, name, h) => U.inWindow(spec.flags[name], h);

  // ---------- Vitals ----------
  function vitalsAt(ctx, spec, h, noisy) {
    const out = {};
    ['temp', 'hr', 'sbp', 'dbp', 'rr', 'spo2', 'pain'].forEach(k => {
      const frames = spec.vitals.filter(v => v[k] !== undefined).map(v => [v.h, v[k]]);
      let val = U.interp(frames, h);
      if (val === undefined) val = { temp: 98.4, hr: 76, sbp: 124, dbp: 76, rr: 16, spo2: 98, pain: 0 }[k];
      spec.vitalAdjust.forEach(adj => { if (adj[k] && (adj.fromH === undefined || h >= adj.fromH)) val += adj[k]; });
      if (noisy) {
        const amp = { temp: 0.25, hr: 3, sbp: 5, dbp: 3, rr: 1, spo2: 0.8, pain: 0.6 }[k];
        val += ctx.noise(amp);
      }
      out[k] = val;
    });
    out.temp = U.round(U.clamp(out.temp, 95.5, 106), 1);
    out.hr = Math.round(U.clamp(out.hr, 38, 190));
    out.sbp = Math.round(U.clamp(out.sbp, 70, 230));
    out.dbp = Math.round(U.clamp(out.dbp, 38, 130));
    out.rr = Math.round(U.clamp(out.rr, 8, 40));
    out.spo2 = Math.round(U.clamp(out.spo2, 70, 100));
    out.pain = Math.round(U.clamp(out.pain, 0, 10));
    const frame = U.stepAt(spec.vitals.filter(v => v.o2), h, 'h');
    out.o2 = frame ? frame.o2 : 'Room air';
    return out;
  }

  function vitalFlag(code, v, ctx) {
    const copd = ctx.has('copd') ? 88 : 92;
    if (code === 'TEMP') return v >= 100.4 || v <= 96.8 ? 'Abnormal' : '';
    if (code === 'HR') return v > 100 || v < 55 ? 'Abnormal' : '';
    if (code === 'RR') return v > 22 || v < 10 ? 'Abnormal' : '';
    if (code === 'SPO2') return v < copd ? 'Abnormal' : '';
    return '';
  }

  function buildVitalObservations(ctx, spec, obs) {
    // ED sets close together, then every 4 hours on the clock.
    const times = [0.1, 1.0, 2.4];
    const firstClock = U.parse(ctx.ts(3));
    for (let ms = Math.ceil(firstClock / (4 * 3600000)) * 4 * 3600000; ms <= U.parse(ctx.ts(ctx.nowH)); ms += 4 * 3600000) {
      times.push((ms - U.parse(ctx.admit)) / 3600000);
    }
    const keep = times.filter(h => h <= ctx.nowH && h >= ctx.nowH - 96);
    keep.forEach(h => {
      const stamp = ctx.ts(h);
      const v = vitalsAt(ctx, spec, h, true);
      const slug = U.slug(stamp);
      const push = (code, label, value, units) => obs.push({
        id: `vital_${code.toLowerCase()}_${slug}`, type: 'vital', code, label, value, units: units || '',
        flag: vitalFlag(code, code === 'BP' ? v.sbp : v[code.toLowerCase()], ctx),
        collected: stamp
      });
      push('TEMP', 'Temperature', `${v.temp.toFixed(1)} °F`, '');
      push('HR', 'Heart Rate', String(v.hr), 'bpm');
      push('BP', 'Blood Pressure', `${v.sbp}/${v.dbp}`, '');
      push('RR', 'Respiratory Rate', String(v.rr), '/min');
      push('SPO2', 'SpO2', String(v.spo2), '%');
      push('PAIN', 'Pain', `${v.pain}/10`, '');
      const last = obs[obs.length - 3];
      if (last && (v.sbp > 180 || v.sbp < 90)) last.flag = 'Abnormal';
    });
  }

  // ---------- Labs ----------
  function labValueAt(ctx, spec, code, h) {
    const def = NS.LABS.C[code];
    const own = spec.labs[code];
    let base = spec.labBase[code] !== undefined ? spec.labBase[code] : NS.LABS.baseValue(code, ctx.sex);
    let value;
    if (own && own.abs) value = U.interp(own.abs, h);
    else value = base + (own && own.add ? U.interp(own.add, h) : 0);
    if (spec.labAdd[code]) value += spec.labAdd[code];
    // small natural variation
    const jitter = { Sodium: 1, Potassium: 0.12, Chloride: 1, CO2: 0.8, BUN: 1, Creatinine: 0.03, Glucose: 6, WBC: 0.4, Hemoglobin: 0.15, Platelets: 8 }[code] || 0;
    if (jitter && !(own && own.exact)) value += ctx.noise(jitter);
    const dec = def.dec;
    value = dec === 0 ? Math.round(value) : U.round(value, dec);
    return Math.max(value, 0);
  }

  function buildLabs(ctx, spec, obs) {
    const draws = [];
    spec.labSchedule.forEach(item => {
      if (item.daily) {
        // 05:00 every calendar day, skipping a draw that would duplicate the ED draw.
        const admitMs = U.parse(ctx.admit);
        const d0 = new Date(admitMs); d0.setUTCHours(5, 0, 0, 0);
        for (let ms = d0.getTime(); ms <= U.parse(ctx.ts(ctx.windowEnd)); ms += 24 * 3600000) {
          const h = (ms - admitMs) / 3600000;
          if (h < (item.fromH ?? 20)) continue;
          if (item.toH !== undefined && h >= item.toH) continue;
          draws.push({ h, codes: item.codes });
        }
      } else if (item.h <= ctx.windowEnd) draws.push({ h: item.h, codes: item.codes });
    });
    // Merge draws at the same time, de-duplicate codes
    draws.sort((a, b) => a.h - b.h);
    const merged = [];
    draws.forEach(d => {
      const prev = merged.find(m => Math.abs(m.h - d.h) < 0.01);
      if (prev) prev.codes = prev.codes.concat(d.codes); else merged.push({ h: d.h, codes: d.codes.slice() });
    });
    merged.forEach(draw => {
      const stamp = ctx.ts(draw.h);
      const codes = U.uniq(draw.codes);
      codes.forEach(code => {
        const def = NS.LABS.C[code];
        if (!def) return;
        let value;
        if (code === 'eGFR') {
          const cr = labValueAt(ctx, spec, 'Creatinine', draw.h);
          value = NS.LABS.egfr(cr, ctx.age, ctx.sex);
        } else if (code === 'Hematocrit') {
          // hematocrit follows hemoglobin (about 3x)
          value = U.round(labValueAt(ctx, spec, 'Hemoglobin', draw.h) * 3 + ctx.noise(0.4), 1);
        } else value = labValueAt(ctx, spec, code, draw.h);
        if (draw.h > ctx.nowH) { /* result returns during the simulation */ }
        obs.push({
          id: `lab_${U.slug(code)}_${U.slug(stamp)}`, type: 'lab', category: def.cat, code, label: code,
          value: NS.LABS.fmtValue(code, value), units: def.units, flag: NS.LABS.flagFor(code, value, ctx.sex),
          reference: NS.LABS.refText(code, ctx.sex), specimen: def.specimen || 'Blood', status: 'Final',
          collected: stamp
        });
      });
    });
    // Qualitative / microbiology results written by the diagnosis profile
    spec.quals.forEach((q, i) => {
      if (q.h > ctx.windowEnd) return;
      const stamp = ctx.ts(q.h);
      obs.push({
        id: `lab_${U.slug(q.code)}_${U.slug(stamp)}_${i}`, type: 'lab', category: q.category || 'Other', code: q.code, label: q.code,
        value: q.value, units: q.units || '', flag: q.flag || '', reference: q.reference || '', specimen: q.specimen || 'Blood',
        status: q.status || 'Final', collected: stamp
      });
    });
  }

  return { TEAM, FREQ, MONITOR, makeCtx, normalizeSpec, stageAt, flagAt, vitalsAt, buildVitalObservations, buildLabs, labValueAt };
})();
