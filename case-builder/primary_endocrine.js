/* Endocrine emergencies: diabetic ketoacidosis, hyperosmolar hyperglycemic state, adrenal crisis, myxedema coma, thyroid storm.
   Shared helpers first, then one diagnosis profile per section. Everything is in hours since admission (h = 0 is arrival).
   Chemistry that must agree with itself (anion gap = Na - Cl - CO2, venous pH from CO2 and pCO2, serum osmolality from Na, glucose, BUN)
   is written as a step table and expanded with plateau(): each lab result equals the table row for its draw, so it never drifts by rounding. */
(() => {
  const U = NS.util, C = NS.C;
  const add = (code, def) => { if (!NS.LABS.C[code]) NS.LABS.C[code] = def; };
  add('Venous pH', { cat: 'Blood gas', units: '', ref: [7.31, 7.41], dec: 2, base: 7.36, crit: [7.20, 7.55], specimen: 'Venous blood' });
  add('Venous pCO2', { cat: 'Blood gas', units: 'mmHg', ref: [41, 51], dec: 0, base: 46, crit: [20, 80], specimen: 'Venous blood' });

  // ---------- shared helpers ----------
  const hh = (hco3, pco2) => U.round(6.1 + Math.log10(hco3 / (0.03 * pco2)), 2);           // Henderson-Hasselbalch
  const col = (rows, i) => rows.map(r => [r[0], r[i]]);                                      // smooth keyframes from a table column
  const plateau = (rows, i) => { const f = []; rows.forEach((r, k) => { if (k) f.push([r[0] - 0.01, rows[k - 1][i]]); f.push([r[0], r[i]]); }); return f; };
  const clockHours = (ctx, clocks, from, to) => {
    const admitMs = U.parse(ctx.admit), d0 = new Date(admitMs); d0.setUTCHours(0, 0, 0, 0);
    const out = [];
    for (let d = 0; d <= 24; d++) clocks.forEach(c => {
      const h = (d0.getTime() + d * 86400000 + (+c.slice(0, 2)) * 3600000 + (+c.slice(2)) * 60000 - admitMs) / 3600000;
      if (h >= from && h <= to) out.push(h);
    });
    return out.sort((a, b) => a - b);
  };
  const every = (from, to, step) => { const o = []; for (let h = from; h <= to + 1e-6; h += step) o.push(h); return o; };
  // History modules apply after the profile and push home medications; drop the ones this emergency makes unsafe and say so on the home-medication list.
  const guardHome = (spec, test, note) => {
    const push = spec.meds.push.bind(spec.meds);
    spec.meds.push = (...items) => push(...items.filter(m => {
      if (m && m.home === true && test(m)) { spec.heldHome = spec.heldHome || []; if (!spec.heldHome.includes(note)) spec.heldHome.push(note); return false; }
      return true;
    }));
  };
  const rnd5 = n => Math.max(5, Math.round(n / 5) * 5);
  const consultAuthor = 'R. Castellanos, MD (Endocrinology)';
  const ivSite = (placeH, loc, gauge, infusing) => ({ deviceType: 'IV', type: 'Peripheral IV', location: loc, siteMarker: loc.includes('Left') ? (/antecubital/i.test(loc) ? 'leftAC' : 'leftForearm') : (/antecubital/i.test(loc) ? 'rightAC' : 'rightForearm'), gauge, placeH, infusing, status: 'Patent', assess: 'site clean, dry, intact; flushes easily; no redness or swelling' });
  const hypoMeds = () => [
    { key: 'dextrose50', name: 'dextrose 50% injection', dose: '25 mL (12.5 g)', route: 'IV', freq: 'q15min', prn: true, prnInterval: 'Every 15 minutes', prnFor: 'glucose below 70 mg/dL when NPO or unable to swallow', cls: 'Carbohydrate / antihypoglycemic', info: 'Hypoglycemia protocol. Give through a patent IV, flush after (vesicant). Recheck glucose in 15 minutes and repeat until above 100 mg/dL; notify provider.', monitor: ['Glucose'], indication: 'Hypoglycemia rescue', startH: 1, prnGiven: [], by: 'hospitalist' },
    { key: 'glucagon', name: 'glucagon injection', dose: '1 mg', route: 'IM', freq: 'q15min', prn: true, prnInterval: 'Every 15 minutes', prnFor: 'glucose below 70 mg/dL with no IV access and unable to swallow', cls: 'Antihypoglycemic', info: 'Use only if no IV access. Turn patient on side (vomiting). Recheck glucose in 15 minutes; give carbohydrate when awake.', monitor: ['Glucose'], indication: 'Hypoglycemia rescue', startH: 1, prnGiven: [], by: 'hospitalist' }
  ];

  // ============================================================================ DIABETIC KETOACIDOSIS
  NS.PRIMARY.dka = {
    key: 'dka', label: 'Diabetic Ketoacidosis (DKA)', group: 'Medical', cat: 'Endocrine', typicalLOS: [3, 4],
    desc: 'Type 1 diabetes, missed insulin during illness. Day 1: ICU/step-down insulin infusion with hourly glucose, fluids, potassium replacement and q2-4h chemistries. Day 2: anion gap closes, overlap SC basal insulin, stop drip. Day 3-4: basal-bolus titration, diabetes teaching, discharge.',
    build(ctx) {
      const wt = ctx.weightKg;
      const r1 = Math.max(2, Math.round(wt * 0.1)), r2 = Math.max(2, Math.round(wt * 0.06));
      const tdd = Math.round(wt * 0.5), basal = Math.round(tdd * 0.5), meal = Math.max(2, Math.round(tdd * 0.5 / 3));
      const closeH = 28.5, glargineH = 29.5, dripOff = 31.5, lisproH = 30, late = ctx.L >= 5;
      // h, Na, K, Cl, CO2, glucose, BUN, venous pCO2, beta-hydroxybutyrate
      const T = [
        [0.5, 132, 5.6, 95, 7, 612, 31, 24, 7.2], [2.5, 134, 5.4, 98, 8, 540, 29, 24, 6.8], [4.5, 135, 4.9, 100, 9, 452, 26, 25, 6.1], [6.5, 136, 4.5, 102, 11, 361, 24, 27, 5.2],
        [8.5, 137, 4.2, 104, 12, 268, 21, 28, 4.4], [10.5, 138, 4.0, 106, 13, 214, 19, 29, 3.7], [12.5, 138, 3.8, 107, 14, 188, 18, 30, 3.1], [16.5, 138, 3.4, 108, 16, 176, 16, 32, 2.3],
        [20.5, 139, 3.6, 108, 19, 172, 15, 34, 1.5], [24.5, 139, 3.8, 107, 21, 168, 14, 36, 0.9], [closeH, 139, 4.0, 106, 24, 158, 13, 40, 0.5], [52, 139, 4.2, 105, 25, 148, 12, 42, 0.2], [76, 140, 4.3, 104, 26, 141, 11, 44, 0.1]
      ];
      const ag = T.map(r => [r[0], r[1] - r[3] - r[4]]);
      const vph = T.map(r => [r[0], hh(r[4], r[7] + 0)]);
      const cluster = ['Sodium', 'Potassium', 'Chloride', 'CO2', 'Anion gap', 'Glucose', 'BUN'];
      const dkaRows = T.filter(r => r[0] <= closeH);
      const infusing = h => (h < 2.6 ? '0.9% NaCl bolus' : h < 5 ? '0.9% NaCl at 250 mL/hr' : h < 9 ? '0.9% NaCl + KCl 20 mEq/L at 250 mL/hr' : h < 32 ? 'D5-1/2NS + KCl 20 mEq/L at 150 mL/hr' : 'Saline lock');
      const spec = {
        primaryTeam: 'hospitalist', typicalLOS: [3, 4], noAutoProlonged: late,
        problem: { name: 'Diabetic ketoacidosis', details: 'Type 1 diabetes with DKA after missed insulin during a viral illness: glucose 612, anion gap 30, venous pH 7.09.' },
        chief: 'Nausea, vomiting, abdominal pain and rapid breathing',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with type 1 diabetes since adolescence, brought in with 2 days of nausea, vomiting, diffuse abdominal pain, extreme thirst, frequent urination and fast deep breathing. Had a stomach virus and skipped basal and mealtime insulin for 2 days because of vomiting and poor intake. Weakness and sleepiness today. In the ED: heart rate 118, deep rapid respirations (Kussmaul, RR 28) with fruity breath odor, dry mucous membranes, glucose 612 mg/dL, beta-hydroxybutyrate 7.2, anion gap 30 and venous pH 7.09. Potassium 5.6 (total body potassium is depleted). Admitted to the ICU/step-down unit on an insulin infusion.`,
        ros: 'Positive for polyuria, polydipsia, nausea, vomiting, abdominal pain, fatigue and weight loss. Negative for fever above 101 F, cough, dysuria, chest pain and diarrhea after day 1.',
        keyLabs: ['Glucose', 'Sodium', 'Potassium', 'Chloride', 'CO2', 'Anion gap', 'Beta-hydroxybutyrate', 'Venous pH', 'BUN', 'Creatinine'],
        hpLabs: ['Glucose', 'Sodium', 'Potassium', 'Chloride', 'CO2', 'Anion gap', 'Beta-hydroxybutyrate', 'Venous pH', 'Venous pCO2', 'BUN', 'Creatinine', 'Hemoglobin A1c', 'WBC'],
        isolation: 'None', fluidSensitive: false,
        flags: { npo: [[0.5, 20]], hypotension: [[0, 30]] },
        vitals: [
          { h: 0, temp: 98.2, hr: 118, sbp: 104, dbp: 62, rr: 28, spo2: 98, pain: 5, o2: 'Room air' }, { h: 2, temp: 98.0, hr: 112, sbp: 106, dbp: 64, rr: 26, spo2: 98, pain: 4 },
          { h: 6, temp: 98.2, hr: 104, sbp: 110, dbp: 66, rr: 24, spo2: 98, pain: 3 }, { h: 12, temp: 98.4, hr: 96, sbp: 114, dbp: 68, rr: 22, spo2: 98, pain: 2 },
          { h: 24, temp: 98.4, hr: 88, sbp: 118, dbp: 72, rr: 18, spo2: 98, pain: 1 }, { h: 48, temp: 98.4, hr: 80, sbp: 122, dbp: 74, rr: 16, spo2: 98, pain: 0 }, { h: 80, temp: 98.2, hr: 76, sbp: 120, dbp: 74, rr: 16, spo2: 98, pain: 0 }
        ],
        labs: {
          Sodium: { abs: plateau(T, 1), exact: true }, Potassium: { abs: col(T, 2), exact: true }, Chloride: { abs: plateau(T, 3), exact: true }, CO2: { abs: plateau(T, 4), exact: true },
          'Anion gap': { abs: plateau(ag, 1), exact: true }, Glucose: { abs: col(T, 5) }, BUN: { abs: col(T, 6) },
          'Venous pH': { abs: plateau(vph, 1), exact: true }, 'Venous pCO2': { abs: plateau(T.map(r => [r[0], r[7]]), 1), exact: true }, 'Beta-hydroxybutyrate': { abs: col(T, 8), exact: true },
          Creatinine: { add: [[0, 0.55], [12, 0.3], [30, 0.1], [54, 0]] }, WBC: { abs: [[0, 16.2], [12, 12.4], [30, 9.2], [60, 7.6]] }, Phosphorus: { abs: [[0.5, 4.6], [8.5, 2.6], [16.5, 2.1], [28.5, 2.9], [52, 3.3]] },
          Magnesium: { abs: [[0, 1.6], [24, 1.9], [60, 2.0]] }, 'Hemoglobin A1c': { abs: [[0, 12.4]], exact: true }, Lipase: { abs: [[0, 96], [30, 52]] }, Hemoglobin: { add: [[0, 1.0], [24, 0]] },
          Albumin: { add: [[0, 0.2], [30, 0]] }, 'Serum osmolality': { abs: [[0.5, Math.round(2 * 132 + 612 / 18 + 31 / 2.8)], [12.5, Math.round(2 * 138 + 188 / 18 + 18 / 2.8)]], exact: true }
        },
        labSchedule: [
          ...T.filter(r => r[0] <= closeH).map(r => ({ h: r[0], codes: r[0] < 1 ? [...cluster, 'Magnesium', 'Venous pH', 'Venous pCO2', 'Beta-hydroxybutyrate', 'Hemoglobin A1c', 'Lipase', 'Serum osmolality', 'Albumin'] : [...cluster, 'Venous pH', 'Venous pCO2', 'Beta-hydroxybutyrate'] })),
          { h: 12.5, codes: ['Serum osmolality'] },
          ...T.filter(r => r[0] > closeH).map(r => ({ h: r[0], codes: cluster })),
          { h: 8.5, codes: ['Phosphorus'] }, { h: 16.5, codes: ['Phosphorus'] }, { h: 28.5, codes: ['Phosphorus'] }, { h: 52, codes: ['Phosphorus'] },
          { daily: true, fromH: 20, codes: ['Anion gap'] },
          ...every(1.5, 12.5, 1).map(h => ({ h, codes: ['Glucose'] })), ...every(14.5, 31.5, 2).map(h => ({ h, codes: ['Glucose'] })),
          ...clockHours(ctx, ['0730', '1130', '1630', '2100'], 32, 400).map(h => ({ h, codes: ['Glucose'] }))
        ],
        quals: [
          { h: 0.8, category: 'Urinalysis', code: 'Urinalysis - glucose', value: '4+ (>1000 mg/dL)', reference: 'Negative', flag: 'Abnormal', specimen: 'Urine' },
          { h: 0.8, category: 'Urinalysis', code: 'Urinalysis - ketones', value: 'Large (>80 mg/dL)', reference: 'Negative', flag: 'Abnormal', specimen: 'Urine' },
          { h: 0.8, category: 'Urinalysis', code: 'Urinalysis - leukocyte esterase / nitrite', value: 'Negative / Negative', reference: 'Negative', specimen: 'Urine' },
          { h: 3, category: 'Microbiology', code: 'Influenza A/B, RSV, SARS-CoV-2 PCR', value: 'Not detected', reference: 'Not detected', specimen: 'Nasopharyngeal swab' },
          { h: 50, category: 'Microbiology', code: 'Blood cultures x2', value: 'No growth at 48 hours', specimen: 'Blood', status: 'Preliminary' },
          ...(ctx.female && ctx.age <= 50 ? [{ h: 0.8, category: 'Other', code: 'Urine hCG (pregnancy test)', value: 'Negative', reference: 'Negative', specimen: 'Urine' }] : [])
        ],
        events: [
          { type: 'imaging', h: 1.0, study: 'Chest x-ray, portable', modality: 'X-ray', indication: 'Tachypnea, rule out pneumonia as precipitant', findings: 'Clear lungs. No consolidation, effusion or edema. Normal heart size.', impression: 'No acute cardiopulmonary process.' },
          { type: 'cardiology', h: 0.7, study: '12-lead ECG', label: 'ECG', indication: 'Hyperkalemia, tachycardia', impression: ctx.has('afib') ? 'Atrial fibrillation with rapid ventricular response (rate 122). Mildly peaked T waves V2-V4. No ST elevation.' : 'Sinus tachycardia, rate 118. Mildly peaked T waves V2-V4 (K 5.6). QTc 440 ms. No ST elevation.' },
          { type: 'cardiology', h: 17.5, study: '12-lead ECG', label: 'ECG (potassium 3.4)', indication: 'Falling potassium on insulin', impression: ctx.has('afib') ? 'Atrial fibrillation, controlled rate 88. Flattened T waves with U waves. No ectopy.' : 'Normal sinus rhythm, rate 88. Flattened T waves with U waves (low potassium). No ectopy. QTc 452 ms.' },
          { type: 'transfer', h: 3.5, label: 'Admitted to the ICU / step-down unit (insulin infusion)', text: 'Transferred from the ED to the ICU / step-down unit for insulin infusion with hourly glucose.' },
          { type: 'transfer', h: dripOff + 1.5, label: 'Transferred to the medical unit', text: 'Insulin infusion off and subcutaneous insulin established; transferred to the medical unit.' },
          { type: 'consult', h: 6, service: 'Endocrinology', author: consultAuthor, reason: 'New DKA in a patient with type 1 diabetes', label: 'Endocrinology consulted', recommendation: 'Continue DKA protocol; close the gap (bicarbonate 18 or higher, venous pH above 7.30, beta-hydroxybutyrate below 0.6) before stopping the drip. Give glargine 2 hours before stopping the infusion. Total daily dose about 0.5 units/kg (half basal, half mealtime). Carbohydrate counting, sick-day rules and ketone testing education before discharge. Outpatient endocrinology in 1-2 weeks.' },
          { type: 'consult', h: 50, service: 'Diabetes Education', author: 'S. Brandt, RN, CDCES', reason: 'Insulin teaching, sick-day rules, glucometer and ketone testing', label: 'Diabetes educator consulted', recommendation: 'First teaching session completed with return demonstration of pen injection and glucometer use. Reviewed sick-day rules: never stop basal insulin, check glucose and ketones every 4 hours when ill, call or go to the ED for vomiting, ketones, or glucose above 300 twice. Second session planned before discharge.' }
        ],
        meds: [
          C.bolus('0.9% sodium chloride bolus (liter 1)', 1000, { start: 0.6, by: 'ed', indication: 'DKA: volume resuscitation (15-20 mL/kg in the first hour)' }),
          C.bolus('0.9% sodium chloride bolus (liter 2)', 1000, { start: 1.6, by: 'ed', indication: 'DKA: continued resuscitation' }),
          C.nsMaintenance({ start: 2.6, stop: 5, rate: 250 }),
          { key: 'ns_kcl', name: '0.9% sodium chloride with potassium chloride 20 mEq/L infusion', dose: '250 mL/hr', rate: '250 mL/hr', mlPerHr: 250, route: 'IV', freq: 'continuous', fluid: true, cls: 'Crystalloid with electrolyte', startH: 5, stopH: 9, highAlert: true, info: 'Potassium added once K is below 5.0 and urine is flowing. Potassium falls quickly on insulin. Hold the potassium and call the provider if K is above 5.2 or urine output is below 0.5 mL/kg/hr.', monitor: ['K', 'Na'], indication: 'DKA: fluid and potassium replacement', by: 'hospitalist', renal: { ckd3: { avoid: true, sub: { name: '0.9% sodium chloride with potassium chloride 10 mEq/L infusion', info: 'Half-strength potassium for reduced kidney function; recheck K every 2 hours.' } }, esrd: { avoid: true, sub: { name: '0.9% sodium chloride infusion (no potassium: ESRD)', info: 'No potassium added in ESRD; replace only by protocol with frequent K checks.' } } } },
          { key: 'd5_half_ns_kcl', name: 'dextrose 5% in 0.45% sodium chloride with potassium chloride 20 mEq/L infusion', dose: '150 mL/hr', rate: '150 mL/hr', mlPerHr: 150, route: 'IV', freq: 'continuous', fluid: true, cls: 'Dextrose-containing fluid with electrolyte', startH: 9, stopH: 32, highAlert: true, info: 'Started when glucose is below 250 mg/dL so the insulin infusion can continue until the ketoacidosis clears. Do NOT stop insulin for a normal glucose; add dextrose instead.', monitor: ['Glucose', 'K'], indication: 'DKA: glucose below 250; keep glucose 150-200 while the anion gap closes', by: 'hospitalist', renal: { ckd3: { avoid: true, sub: { name: 'dextrose 5% in 0.45% sodium chloride with potassium chloride 10 mEq/L infusion' } }, esrd: { avoid: true, sub: { name: 'dextrose 5% in 0.45% sodium chloride infusion (no potassium: ESRD)' } } } },
          { key: 'insulin_drip', name: 'insulin regular (HUMULIN R) infusion 100 units/100 mL 0.9% NaCl', dose: `${r1} units/hr`, rate: `${r1} units/hr (0.1 units/kg/hr)`, mlPerHr: r1, route: 'IV', freq: 'continuous', cls: 'Short-acting insulin', startH: 1.2, stopH: 9, highAlert: true, concentration: '1 unit/mL', info: 'HIGH-ALERT. Dedicated line, two-RN verification of rate. Hourly glucose; titrate per DKA protocol (aim for glucose fall of 50-75 mg/dL/hr). Confirm K is 3.3 or higher before starting and every dose change.', hold: 'HOLD insulin and call provider immediately if K is below 3.3 mEq/L. Do not stop the infusion for glucose below 250; add dextrose and call the provider.', monitor: ['Glucose', 'K'], indication: 'DKA (0.1 units/kg/hr)', by: 'ed', nursing: ['Hourly glucose with documentation of every rate change.', 'Renal impairment prolongs insulin action: watch for hypoglycemia.', 'Never stop the infusion without an overlapping subcutaneous insulin dose.'], renal: { ckd3: { note: 'Reduced insulin clearance in kidney disease: expect lower requirement and prolonged effect; check glucose hourly.' }, esrd: { note: 'ESRD: insulin clears slowly; high hypoglycemia risk; check glucose hourly.' } } },
          { key: 'insulin_drip_2', name: 'insulin regular (HUMULIN R) infusion 100 units/100 mL 0.9% NaCl', dose: `${r2} units/hr`, rate: `${r2} units/hr (titrated per protocol)`, mlPerHr: r2, route: 'IV', freq: 'continuous', cls: 'Short-acting insulin', startH: 9, stopH: dripOff, highAlert: true, concentration: '1 unit/mL', info: 'HIGH-ALERT. Rate lowered after dextrose started; continue until anion gap is closed AND subcutaneous basal insulin has overlapped by 2 hours. Hourly then every 2 hour glucose.', hold: 'HOLD and call provider for K below 3.3 mEq/L. Call for glucose below 100 mg/dL on the infusion.', monitor: ['Glucose', 'K'], indication: 'DKA until anion gap closed', by: 'hospitalist', nursing: ['Check glucose every 1-2 hours; goal 150-200 mg/dL.', 'Anion gap closed and basal insulin given 2 hours before the infusion is stopped.'], renal: { ckd3: { note: 'Reduced insulin clearance in kidney disease: reduced requirement likely.' }, esrd: { note: 'ESRD: insulin clears slowly; high hypoglycemia risk.' } } },
          { key: 'kcl_iv_a', name: 'potassium chloride IVPB', dose: '10 mEq in 100 mL', route: 'IV', freq: 'once', startH: 17, volume: 100, highAlert: true, cls: 'Electrolyte replacement', info: 'K 3.4 on insulin. Peripheral IV maximum 10 mEq/hr. Burns: check site; give on a pump; continuous ECG. Recheck K after 2 doses.', monitor: ['K'], indication: 'Hypokalemia during insulin therapy (K 3.4)', by: 'hospitalist', renal: { esrd: { avoid: true }, ckd3: { note: 'Kidney disease: give only after the K result; recheck K before any extra dose.' } } },
          { key: 'kcl_iv_b', name: 'potassium chloride IVPB', dose: '10 mEq in 100 mL', route: 'IV', freq: 'once', startH: 18, volume: 100, highAlert: true, cls: 'Electrolyte replacement', info: 'Second dose; peripheral maximum 10 mEq/hr; recheck K 2 hours after.', monitor: ['K'], indication: 'Hypokalemia during insulin therapy', by: 'hospitalist', renal: { esrd: { avoid: true } } },
          { key: 'insulin_glargine', name: 'insulin glargine (LANTUS) injection', dose: `${basal} units`, route: 'Subcutaneous', freq: 'q24h', anchorStart: true, startH: glargineH, cls: 'Long-acting insulin', highAlert: true, info: 'Basal insulin. First dose given 2 hours BEFORE the insulin infusion is stopped (overlap prevents rebound ketoacidosis). Do not mix with other insulins. Never hold basal insulin in type 1 diabetes, even if NPO.', hold: 'Check glucose first. Do NOT withhold in type 1 diabetes; call provider if glucose is below 100 mg/dL for a dose adjustment.', monitor: ['Glucose'], indication: 'Type 1 diabetes: basal (about 0.25 units/kg/day)', by: 'hospitalist', renal: { ckd3: { dose: `${Math.round(basal * 0.75)} units`, note: 'Dose reduced about 25% for reduced kidney function.' }, esrd: { dose: `${Math.round(basal * 0.5)} units`, note: 'Dose reduced about 50% for ESRD.' } } },
          { key: 'insulin_lispro', name: 'insulin lispro (HUMALOG) injection', dose: `${meal} units + correction scale`, route: 'Subcutaneous', freq: 'AC', startH: lisproH, cls: 'Rapid-acting insulin', highAlert: true, info: 'Mealtime dose given within 15 minutes BEFORE eating plus correction by scale. Check glucose first. Hold the mealtime dose if the patient is not eating or vomiting (give correction only) and call provider.', hold: 'Hold mealtime dose if not eating or glucose below 70 mg/dL; call provider.', monitor: ['Glucose'], indication: 'Type 1 diabetes: mealtime and correction insulin', by: 'hospitalist', variants: { npo: { freq: 'q6h', dose: 'Correction scale only' } }, renal: { ckd3: { dose: `${Math.max(2, Math.round(meal * 0.75))} units + low-dose correction scale`, note: 'Dose reduced for reduced kidney function.' }, esrd: { dose: `${Math.max(2, Math.round(meal * 0.5))} units + low-dose correction scale`, note: 'Dose reduced for ESRD.' } } },
          C.ondansetron({ start: 0.8, given: [1.0, 9] }),
          ...hypoMeds()
        ],
        orders: [
          C.diet('NPO except ice chips and medications with sips', 0.5, 20, 'Nausea and vomiting; reassess for clear liquids when nausea resolves and bicarbonate is rising.'),
          C.diet('Clear liquid diet', 20, 26, 'Sugar-free clear liquids; advance when no nausea. Insulin infusion still running.'),
          C.diet('Carbohydrate-consistent diet (1800 kcal)', 26, undefined, 'Consistent carbohydrate at each meal; basal insulin and mealtime insulin matched to meals.'),
          C.activity('Bed rest with bathroom privileges (urinal or commode)', 0.5, 30, 'Orthostatic precautions; dangle before standing; measure urine output.'),
          C.activity('Up with assistance; ambulate in hall three times daily', 30, undefined, 'Encourage activity as tolerated.'),
          { name: 'DKA insulin infusion protocol', category: 'Nursing', frequency: 'Per protocol while infusing', startH: 1.2, stopH: dripOff, instructions: 'Hourly glucose; fluids and potassium per protocol. Continue insulin until bicarbonate 18 or higher, venous pH above 7.30 and beta-hydroxybutyrate below 0.6 (anion gap 12 or less). Add dextrose at glucose below 250 mg/dL.', nursing: ['Hold insulin and call provider for K below 3.3 mEq/L.', 'Call for glucose below 100 mg/dL, K above 5.2 or below 3.5, urine output below 0.5 mL/kg/hr, or new confusion.', 'Transition: give subcutaneous basal insulin 2 hours before stopping the drip.'] },
          { name: 'Point-of-care glucose: hourly on insulin infusion', category: 'Lab / Bedside Testing', frequency: 'Every 1 hour (every 2 hours once stable)', startH: 1.2, stopH: dripOff, instructions: 'Hourly while infusing; every 2 hours when 3 consecutive values are in range. Treat per hypoglycemia protocol.' },
          { name: 'Point-of-care blood glucose', category: 'Lab / Bedside Testing', frequency: 'ACHS (every 6 hours if NPO)', startH: dripOff, instructions: 'Before meals and at bedtime; 0300 check on the first night after the drip. Treat per hypoglycemia protocol.' },
          { name: 'BMP, beta-hydroxybutyrate, venous pH: serial', category: 'Laboratory', frequency: 'Every 2 hours x 3, then every 4 hours until anion gap closed', startH: 0.5, stopH: closeH + 4, instructions: 'Calculate anion gap (Na - Cl - CO2). Report K, anion gap and pH to the provider with each result.' },
          { name: 'Phosphorus and magnesium', category: 'Laboratory', frequency: 'Every 8-12 hours while on insulin infusion', startH: 4, stopH: 32, instructions: 'Insulin drives phosphorus and magnesium into cells.' },
          { name: 'Intake and output (strict, hourly urine output)', category: 'Nursing', frequency: 'Every hour', startH: 0.5, stopH: 36, instructions: 'Urine output goal at least 0.5 mL/kg/hr. Notify provider for urine output below 30 mL/hr for 2 hours.' },
          { name: 'Neurologic checks (GCS, orientation)', category: 'Nursing', frequency: 'Every 2 hours', startH: 0.5, stopH: 36, instructions: 'Report new headache, vomiting, confusion, lethargy or falling GCS (cerebral edema is rare but dangerous).' },
          { name: 'Vital signs', category: 'Nursing', frequency: 'Every 1 hour', startH: 0.5, stopH: 12.5, instructions: 'Include respiratory pattern. Notify provider for SBP below 90, HR above 120, RR above 30 or temperature above 100.4 F.' },
          { name: 'Vital signs', category: 'Nursing', frequency: 'Every 2 hours', startH: 12.5, stopH: 32, instructions: 'Notify provider for SBP below 90, HR above 120 or new fever.' },
          { name: 'Continuous cardiac monitoring (telemetry)', category: 'Nursing', frequency: 'Continuous', startH: 0.5, stopH: 36, instructions: 'Potassium shifts can cause arrhythmia. Notify provider for peaked T waves, flattened T waves or U waves, ectopy or HR above 130.' },
          { name: 'Hypoglycemia protocol', category: 'Nursing', frequency: 'PRN glucose below 70 mg/dL', startH: 1, instructions: 'Awake and able to swallow: 15 g fast carbohydrate, recheck in 15 minutes. NPO or unable to swallow: dextrose 50% IV (glucagon IM if no IV). Recheck every 15 minutes until above 100; notify provider.' },
          { name: 'Diabetes self-management education', category: 'Nursing', frequency: 'Daily teaching sessions', startH: 36, instructions: 'Insulin pen technique, glucometer, injection site rotation, carbohydrate counting, sick-day rules (never stop basal insulin), ketone testing, hypoglycemia treatment. Use teach-back.', nursing: ['Observe the patient give insulin and check glucose; document return demonstration.'] },
          { name: 'Daily weight', category: 'Nursing', frequency: 'Daily', startH: 6, instructions: 'Same scale each morning.' },
          { name: 'Sequential compression devices', category: 'Nursing', frequency: 'Continuous when in bed', startH: 3, stopH: 54, instructions: 'Dehydration and immobility raise clot risk; stop when ambulating.' }
        ],
        devices: [
          ivSite(0.4, 'Right forearm', '18 gauge', infusing(ctx.nowH)),
          ivSite(0.6, 'Left antecubital', '20 gauge', ctx.nowH < dripOff ? 'Insulin infusion (dedicated line)' : 'Saline lock')
        ],
        assessments: [
          { fromH: 0, items: [['Neurologic', 'Level of Consciousness', 'Alert but drowsy; slow to answer'], ['Neurologic', 'Orientation', 'Oriented x4'], ['Respiratory', 'Respiratory Effort', 'Kussmaul respirations: deep, rapid, labored; no accessory muscle use'], ['Respiratory', 'Breath Sounds', 'Clear bilaterally; fruity (acetone) breath odor'], ['Cardiac', 'Rhythm', ctx.has('afib') ? 'Atrial fibrillation, rapid ventricular response' : 'Sinus tachycardia'], ['Cardiac', 'Capillary Refill', '3-4 seconds'], ['Skin', 'Skin', 'Warm, dry, poor turgor; dry mucous membranes, cracked lips'], ['GI', 'Abdomen', 'Diffuse mild tenderness, soft, no guarding or rebound'], ['GI', 'Bowel Sounds', 'Hypoactive'], ['GI', 'Nausea / Vomiting', 'Nausea with vomiting x4'], ['GU', 'Urinary Elimination', 'Polyuria (urinal, large volumes)'], ['GU', 'Urine Appearance', 'Pale, dilute'], ['Pain', 'Pain Location', 'Diffuse abdominal cramping, 5/10'], ['Safety', 'Diabetes Care', 'Insulin infusion with hourly glucose; hypoglycemia and potassium monitoring']] },
          { fromH: 8, items: [['Neurologic', 'Level of Consciousness', 'Alert'], ['Respiratory', 'Respiratory Effort', 'Deep respirations slowing (RR 22), unlabored'], ['Respiratory', 'Breath Sounds', 'Clear bilaterally; acetone odor fading'], ['Cardiac', 'Rhythm', ctx.has('afib') ? 'Atrial fibrillation, rate controlled' : 'Sinus rhythm'], ['Cardiac', 'Capillary Refill', 'Less than 3 seconds'], ['Skin', 'Skin', 'Warm, mucous membranes moist, turgor improving'], ['GI', 'Nausea / Vomiting', 'Mild nausea; no emesis in 4 hours'], ['Pain', 'Pain Location', 'Abdominal soreness, 3/10']] },
          { fromH: 20, items: [['Respiratory', 'Respiratory Effort', 'Unlabored, normal rate and depth'], ['Respiratory', 'Breath Sounds', 'Clear bilaterally'], ['GI', 'Abdomen', 'Soft, minimal tenderness'], ['GI', 'Bowel Sounds', 'Active in all four quadrants'], ['GI', 'Nausea / Vomiting', 'None; tolerating clear liquids'], ['Pain', 'Pain Location', 'Mild abdominal soreness, 1/10']] },
          { fromH: 32, items: [['Skin', 'Skin', 'Warm, dry, good turgor; insulin injection sites abdomen clear, no lipohypertrophy'], ['GU', 'Urine Appearance', 'Clear, yellow'], ['Pain', 'Pain Location', 'None'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulating independently'], ['Safety', 'Diabetes Care', 'Basal-bolus insulin; glucose before meals and at bedtime; injection teaching in progress']] },
          { fromH: 56, items: [['Safety', 'Diabetes Care', 'Self-administers insulin pen with return demonstration; verbalizes sick-day rules']] }
        ],
        io: [{ fromH: 0, po: 0, urine: 650, ice: true }, { fromH: 8, po: 0, urine: 520, ice: true }, { fromH: 16, po: 30, urine: 400 }, { fromH: 24, po: 220, urine: 330 }, { fromH: 36, po: 420, urine: 330 }, { fromH: 56, po: 600, urine: 340 }],
        stages: [
          { fromH: 0, id: 'resus', label: 'DKA: insulin infusion and fluid resuscitation', problem: 'Diabetic ketoacidosis (glucose 612, anion gap 30, venous pH 7.09, K 5.6) on an insulin infusion in the ICU/step-down unit.',
            subj: 'Nausea, abdominal cramping and thirst; very tired. Breathing "fast" but no chest pain. No fever.',
            assess: 'Moderate DKA from missed insulin during gastroenteritis. Severe volume depletion (about 6-8 L deficit), anion gap acidosis with respiratory compensation, total-body potassium deficit hidden by a high serum K.',
            plan: ['Isotonic fluid 15-20 mL/kg in the first hour, then 250-500 mL/hr; add potassium when K is below 5.0.', 'Insulin infusion 0.1 units/kg/hr once K is 3.3 or higher; hourly glucose; chemistries and venous pH every 2-4 hours.', 'Add dextrose when glucose is below 250 mg/dL and keep the insulin infusion running until the gap closes.', 'Search for the precipitant: ECG, chest x-ray, urinalysis, viral PCR and cultures; continuous ECG monitoring; strict intake and output.'],
            nursing: ['Kussmaul respirations RR 28 with fruity breath odor; HR 118; dry mucous membranes; weak thirst-driven intake with vomiting.', 'Insulin infusion on a dedicated line with hourly glucose; K and anion gap trended with every BMP.', 'Neurologic check every 2 hours; strict intake and output; urinal used for hourly volume.'],
            teach: ['Explained why insulin and fluids are given together and why labs are drawn so often; explained that insulin is never stopped just because the glucose is lower.'],
            dispo: 'Expect 3-4 days: gap closure within 24 hours, then subcutaneous insulin and diabetes teaching.',
            stickies: [{ title: 'DKA infusion safety', body: 'Hourly glucose. HOLD insulin and call for K below 3.3. Never stop the drip for a low-normal glucose: add dextrose. Overlap basal insulin 2 hours before stopping the drip.' }, { title: 'Potassium falls with insulin', body: 'K 5.6 on arrival will drop. Watch for flat T waves, U waves, weakness, ileus and ectopy. Replacement only with urine output.' }] },
          { fromH: 9, id: 'dextrose', label: 'Glucose below 250: dextrose added; gap still open', problem: 'DKA improving: glucose 268 and falling; anion gap 21, bicarbonate 12; dextrose and potassium added to fluids.',
            subj: 'Less nauseated; breathing easier; still thirsty and tired.',
            assess: 'Glucose falling about 60-70 mg/dL/hr as expected; acidosis resolving slowly (venous pH 7.25); potassium falling on insulin.',
            plan: ['D5-1/2NS with KCl 20 mEq/L at 150 mL/hr; continue insulin infusion at a lower rate and titrate to glucose 150-200.', 'Replace potassium to keep K 4-5; BMP every 2-4 hours; check phosphorus and magnesium.', 'Advance to clear liquids once vomiting has stopped.'],
            nursing: ['RR 22 and unlabored; HR 100; glucose checked hourly then every 2 hours; K 4.2 and falling.', 'Tolerating ice chips; no emesis for 4 hours.', 'Potassium replacement on pump with ECG monitoring.'],
            teach: ['Explained that dextrose is given so insulin can keep clearing ketones.'],
            dispo: 'Gap expected to close within 12-18 hours.' },
          { fromH: 16.5, id: 'closing', label: 'Anion gap closing: potassium replacement', problem: 'DKA resolving: anion gap 14, bicarbonate 16, venous pH 7.32; mild hypokalemia (K 3.4) treated.',
            subj: 'Feels much better; hungry; mild abdominal soreness. Some leg weakness.',
            assess: 'Ketoacidosis resolving; hypokalemia from insulin effect and osmotic diuresis; hypophosphatemia mild.',
            plan: ['KCl IV 10 mEq x2, recheck K in 2 hours; ECG for U waves.', 'Continue insulin infusion until bicarbonate at least 18, venous pH above 7.30 and beta-hydroxybutyrate below 0.6.', 'Clear liquids; carbohydrate-consistent diet when the gap is closed.', 'Plan basal glargine now and stop the infusion 2 hours after the dose.'],
            nursing: ['Flat T waves with U waves on monitor; leg weakness reported; K repleted by protocol.', 'Glucose 170-190 on infusion with dextrose running.'],
            teach: ['Reviewed warning signs of low potassium (weakness, palpitations, cramps).'],
            dispo: 'Transition to subcutaneous insulin tonight/tomorrow.' },
          { fromH: closeH, id: 'transition', label: 'Gap closed: overlap with SC basal insulin', problem: 'DKA resolved biochemically (anion gap 8, bicarbonate 24, beta-hydroxybutyrate 0.5). Transition to subcutaneous insulin.',
            subj: 'No nausea; eating without trouble. Worried about managing insulin at home.',
            assess: 'DKA resolved; glucose stable 150s. Starting basal-bolus insulin with overlap before stopping the infusion; total daily dose about 0.5 units/kg.',
            plan: [`Glargine ${basal} units now, then stop insulin infusion 2 hours later; mealtime lispro ${meal} units + correction with meals.`, 'Carbohydrate-consistent diet; glucose before meals and at bedtime; 0300 glucose tonight.', 'Diabetes educator and endocrinology; plan for discharge on basal-bolus insulin.', 'Move to the medical unit once off the infusion.'],
            nursing: ['Glargine given at the planned time; infusion stopped after the 2 hour overlap; glucose checked every 2 hours then ACHS.', 'Tolerating carbohydrate-consistent meals; ambulating with standby assist.', 'Hypoglycemia teaching started; glucose 130-190.'],
            teach: ['Basal insulin is never skipped, even when sick or not eating; pen technique demonstrated.'],
            dispo: 'Discharge in 1-2 days after teaching and dose titration.',
            stickies: [{ title: 'Transition checklist', body: 'Basal insulin given 2 hours before stopping the infusion. Mealtime insulin only with a meal. Check glucose before every dose and at 0300 the first night.' }] },
          { fromH: 52, id: 'education', label: 'Basal-bolus titration and diabetes education', problem: 'Type 1 diabetes after DKA; stable on SC basal-bolus insulin.',
            subj: 'Feeling well; eating full meals; learning insulin pens. Fasting glucose in the 140s.',
            assess: 'DKA resolved, electrolytes normal; insulin doses being titrated to glucose 100-180; knowledge deficit being addressed.',
            plan: ['Adjust glargine and mealtime doses 10-20% for fasting and pre-meal values.', 'Second diabetes education session with teach-back; sick-day rules, ketone strips, glucagon prescription.', 'Social work/case management: insulin supplies, coverage and follow-up in 1 week.', 'Discharge tomorrow if self-injection and glucose checks are demonstrated.'],
            nursing: ['Self-injects with return demonstration; glucose 120-170; no hypoglycemia.', 'Eating 100% of meals; ambulating independently.'],
            teach: ['Sick-day rules, ketone testing, hypoglycemia treatment (rule of 15), when to call or return to the ED.'],
            dispo: 'Discharge in 1 day.' },
          { fromH: 72, id: 'ready', label: late ? 'Medically ready: discharge delayed' : 'Discharge planning', problem: late ? 'Diabetic ketoacidosis resolved; discharge delayed until insulin supply, coverage and follow-up are confirmed.' : 'Diabetic ketoacidosis resolved; ready for discharge on basal-bolus insulin.',
            subj: late ? 'Feels well; waiting on insulin supplies and coverage. Worried about affording insulin at home.' : 'Feels back to baseline. Confident with injections.',
            assess: late ? 'Clinically stable; remaining stay driven by insulin access, supplies and follow-up arrangements, not by acute illness.' : 'Stable on SC insulin with glucose 100-180, normal electrolytes and no ketosis.',
            plan: late ? ['Case management and pharmacy to secure insulin, pen needles, glucometer and ketone strips (prior authorization).', 'Repeat teach-back; endocrinology and PCP follow-up booked.', 'Continue current basal-bolus doses; glucose before meals and at bedtime.'] : ['Discharge home on glargine and mealtime lispro with pen needles, glucometer, strips, ketone strips and glucagon.', 'Endocrinology follow-up in 1-2 weeks; PCP in 1 week; call for glucose above 300 twice or ketones.', 'Prescriptions picked up before leaving.'],
            nursing: ['Teach-back complete; verbalizes sick-day rules and hypoglycemia treatment.', 'Glucose stable; no nausea; ambulating independently.'],
            teach: ['Never stop basal insulin; check glucose and ketones when ill; seek care for vomiting; carry fast sugar; wear a medical ID.'],
            dispo: late ? 'Discharge once insulin supply and coverage are confirmed.' : 'Discharge home today.', stickies: [{ title: 'Discharge planning', body: late ? 'Insulin supply, pen needles and strips authorization pending; teach-back done.' : 'Insulin pen teach-back, glucagon prescription, follow-up in 1-2 weeks.' }] }
        ],
        therapy: { pt: false },
        discharge: { dispo: () => 'Home with insulin pens, supplies, glucagon and diabetes follow-up', estimate: 'day 3-4 once teach-back and prescriptions are complete', barrier: 'insulin supply, coverage and diabetes teaching completion' },
        objectives: ['Manage an insulin infusion safely: hourly glucose, hold parameters, potassium before and during insulin, and never stop the drip without overlap.', 'Interpret DKA labs: anion gap (Na - Cl - CO2), bicarbonate, venous pH, beta-hydroxybutyrate and potassium trends, and recognize gap closure.', 'Teach sick-day rules, insulin injection technique and hypoglycemia treatment with teach-back.']
      };
      guardHome(spec, m => /metformin|sglt2|empagliflozin|dapagliflozin|canagliflozin/i.test(m.name), 'Home oral diabetes medication held (metformin / SGLT2 inhibitor): DKA and acute illness.');
      return spec;
    }
  };

})();
