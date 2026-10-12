/* Lab catalog: reference ranges, units, normal baselines, critical limits. */
NS.LABS = (() => {
  // ref: [low, high] or { M:[..], F:[..] }; base is the "normal healthy adult" value a lab starts from.
  const C = {
    WBC:        { cat: 'CBC', units: 'K/uL', ref: [4.0, 10.5], dec: 1, base: 7.0, crit: [2.0, 30] },
    Hemoglobin: { cat: 'CBC', units: 'g/dL', ref: { M: [13.5, 17.5], F: [12.0, 16.0] }, dec: 1, base: { M: 14.6, F: 13.1 }, crit: [7.0, null] },
    Hematocrit: { cat: 'CBC', units: '%', ref: { M: [41, 53], F: [36, 46] }, dec: 1, base: { M: 43.5, F: 39.0 }, crit: [21, null] },
    Platelets:  { cat: 'CBC', units: 'K/uL', ref: [150, 400], dec: 0, base: 240, crit: [20, 1000] },

    Sodium:     { cat: 'CMP', units: 'mmol/L', ref: [136, 145], dec: 0, base: 139, crit: [120, 160] },
    Potassium:  { cat: 'CMP', units: 'mmol/L', ref: [3.5, 5.1], dec: 1, base: 4.1, crit: [2.8, 6.2] },
    Chloride:   { cat: 'CMP', units: 'mmol/L', ref: [98, 107], dec: 0, base: 103 },
    CO2:        { cat: 'CMP', units: 'mmol/L', ref: [22, 29], dec: 0, base: 25, crit: [10, 40] },
    BUN:        { cat: 'CMP', units: 'mg/dL', ref: [7, 20], dec: 0, base: 14 },
    Creatinine: { cat: 'CMP', units: 'mg/dL', ref: { M: [0.7, 1.3], F: [0.5, 1.1] }, dec: 2, base: { M: 0.95, F: 0.78 }, crit: [null, 7.0] },
    Glucose:    { cat: 'CMP', units: 'mg/dL', ref: [70, 110], dec: 0, base: 98, crit: [50, 450] },
    Calcium:    { cat: 'CMP', units: 'mg/dL', ref: [8.5, 10.5], dec: 1, base: 9.3, crit: [6.5, 13] },
    Magnesium:  { cat: 'CMP', units: 'mg/dL', ref: [1.7, 2.4], dec: 1, base: 2.0, crit: [1.0, 4.9] },
    Phosphorus: { cat: 'CMP', units: 'mg/dL', ref: [2.5, 4.5], dec: 1, base: 3.4 },
    eGFR:       { cat: 'CMP', units: 'mL/min/1.73m²', ref: [60, null], dec: 0, base: 95, computed: true, refText: '>60' },

    AST:        { cat: 'Hepatic', units: 'U/L', ref: [10, 40], dec: 0, base: 24 },
    ALT:        { cat: 'Hepatic', units: 'U/L', ref: [7, 56], dec: 0, base: 25 },
    ALP:        { cat: 'Hepatic', units: 'U/L', ref: [44, 147], dec: 0, base: 78 },
    'Total bilirubin': { cat: 'Hepatic', units: 'mg/dL', ref: [0.1, 1.2], dec: 1, base: 0.6 },
    Albumin:    { cat: 'Hepatic', units: 'g/dL', ref: [3.5, 5.0], dec: 1, base: 4.1 },
    Lipase:     { cat: 'Hepatic', units: 'U/L', ref: [13, 60], dec: 0, base: 30 },

    PT:         { cat: 'Coagulation', units: 'sec', ref: [11, 14], dec: 1, base: 12.4 },
    INR:        { cat: 'Coagulation', units: '', ref: [0.9, 1.2], dec: 1, base: 1.0, crit: [null, 5.0] },
    aPTT:       { cat: 'Coagulation', units: 'sec', ref: [25, 35], dec: 0, base: 29 },

    Lactate:    { cat: 'Other', units: 'mmol/L', ref: [0.5, 2.0], dec: 1, base: 1.1, crit: [null, 4.0] },
    CRP:        { cat: 'Other', units: 'mg/L', ref: [0, 10], dec: 0, base: 3, refText: '<10' },
    Procalcitonin: { cat: 'Other', units: 'ng/mL', ref: [0, 0.1], dec: 2, base: 0.05, refText: '<0.10' },
    'Hemoglobin A1c': { cat: 'Endocrine', units: '%', ref: [4.0, 5.6], dec: 1, base: 5.3, refText: '<5.7' },
    TSH:        { cat: 'Endocrine', units: 'mIU/L', ref: [0.4, 4.0], dec: 2, base: 1.8 },

    'LDL cholesterol': { cat: 'Lipid', units: 'mg/dL', ref: [0, 100], dec: 0, base: 105, refText: '<100' },
    BNP:        { cat: 'Cardiac', units: 'pg/mL', ref: [0, 100], dec: 0, base: 45, refText: '<100' },
    'Troponin I': { cat: 'Cardiac', units: 'ng/mL', ref: [0, 0.04], dec: 2, base: 0.01, refText: '<0.04' },

    pH:         { cat: 'ABG', units: '', ref: [7.35, 7.45], dec: 2, base: 7.40, crit: [7.20, 7.60], specimen: 'Arterial blood' },
    PaCO2:      { cat: 'ABG', units: 'mmHg', ref: [35, 45], dec: 0, base: 40, crit: [20, 70], specimen: 'Arterial blood' },
    PaO2:       { cat: 'ABG', units: 'mmHg', ref: [80, 100], dec: 0, base: 92, crit: [50, null], specimen: 'Arterial blood' },
    HCO3:       { cat: 'ABG', units: 'mmol/L', ref: [22, 26], dec: 0, base: 24, specimen: 'Arterial blood' }
  };

  const range = (code, sex) => {
    const r = C[code].ref;
    return Array.isArray(r) ? r : r[sex === 'Female' ? 'F' : 'M'];
  };
  const baseValue = (code, sex) => {
    const b = C[code].base;
    return typeof b === 'object' ? b[sex === 'Female' ? 'F' : 'M'] : b;
  };
  function refText(code, sex) {
    const def = C[code];
    if (def.refText) return def.refText;
    const [lo, hi] = range(code, sex);
    if (lo === null || lo === undefined) return `<${hi}`;
    if (hi === null || hi === undefined) return `>${lo}`;
    return `${lo}-${hi}`;
  }
  function flagFor(code, value, sex) {
    const def = C[code];
    if (!def || typeof value !== 'number') return '';
    const [lo, hi] = range(code, sex);
    const [clo, chi] = def.crit || [null, null];
    if (clo !== null && clo !== undefined && value <= clo) return 'Critical Low';
    if (chi !== null && chi !== undefined && value >= chi) return 'Critical High';
    if (lo !== null && lo !== undefined && value < lo) return 'Low';
    if (hi !== null && hi !== undefined && value > hi) return 'High';
    return '';
  }
  // CKD-EPI 2021 creatinine equation.
  function egfr(creatinine, age, sex) {
    const female = sex === 'Female';
    const k = female ? 0.7 : 0.9, a = female ? -0.241 : -0.302;
    const v = 142 * Math.pow(Math.min(creatinine / k, 1), a) * Math.pow(Math.max(creatinine / k, 1), -1.2) * Math.pow(0.9938, age) * (female ? 1.012 : 1);
    return Math.round(v);
  }
  const fmtValue = (code, value) => {
    const d = C[code].dec;
    return d === 0 ? String(Math.round(value)) : value.toFixed(d);
  };

  return { C, range, baseValue, refText, flagFor, egfr, fmtValue };
})();
