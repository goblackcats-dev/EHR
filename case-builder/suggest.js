// Suggested medical / surgical history per primary diagnosis (used by the "Suggest history" panel in app.js).
// Keys must exist in NS.HX.M (hx) and NS.HX.SURGERIES (surg). Diagnoses not listed fall back to NS.SUGGEST_CAT[cat].
(function (NS) {
  'use strict';
  const S = (hx, surg, note) => ({ hx, surg, note });
  NS.SUGGEST = {
    appendicitis: S([], [], 'Usually a healthy young adult; no prior history needed.'),
    sbo: S(['crohns', 'constipation', 'htn'], ['abd_other', 'colectomy', 'hysterectomy', 'hernia'], 'Prior abdominal surgery (adhesions) is the leading cause of obstruction.'),
    cholecystitis: S(['obesity', 'hld', 'dm2', 'htn'], ['csection'], 'Gallstone risk: obesity, hyperlipidemia, diabetes, prior pregnancy.'),
    pneumonia: S(['copd', 'asthma', 'dm2', 'htn'], [], 'Chronic lung disease and diabetes raise pneumonia risk.'),
    chf: S(['htn', 'hld', 'cad', 'dm2', 'ckd3', 'afib'], ['pci'], 'Typical heart failure comorbidities and prior coronary stenting.'),
    copd_exac: S(['copd', 'htn', 'hld', 'osa', 'depression'], [], 'COPD with common smoker comorbidities.'),
    sepsis: S(['dm2', 'ckd3', 'htn', 'recurrent_uti'], ['cholecystectomy'], 'Diabetes, CKD and urinary source risk factors.'),
    stroke: S(['htn', 'hld', 'dm2', 'afib', 'cad'], ['carotid_endarterectomy'], 'Vascular risk factors for ischemic stroke.'),
    dka: S(['dm1', 'depression'], [], 'Type 1 diabetes is the usual background.'),
    hhs: S(['dm2', 'htn', 'hld', 'ckd3', 'obesity'], [], 'Older type 2 diabetic with metabolic comorbidities.'),
    adrenal_crisis: S(['adrenal_insuff', 'chronic_steroids', 'hypothyroid'], [], 'Known adrenal insufficiency or long-term steroid use.'),
    myxedema: S(['hypothyroid', 'depression', 'hld', 'cad'], ['thyroidectomy_total'], 'Hypothyroidism (possibly post-thyroidectomy) with missed levothyroxine.'),
    thyroid_storm: S(['graves', 'afib'], [], 'Graves disease is the usual cause.'),
    nstemi: S(['htn', 'hld', 'dm2', 'cad', 'obesity'], ['pci'], 'Coronary risk factors with prior stenting.'),
    stemi: S(['htn', 'hld', 'dm2', 'obesity'], [], 'Coronary risk factors.'),
    afib_rvr: S(['afib', 'htn', 'hf', 'osa', 'hypothyroid'], [], 'Atrial fibrillation with common triggers and comorbidities.'),
    pe: S(['hx_vte', 'obesity', 'thrombophilia'], ['tka', 'orif_ankle'], 'VTE risk factors: prior clot, obesity, recent orthopedic surgery.'),
    asthma_exac: S(['asthma', 'allergic_rhinitis', 'gerd', 'obesity'], ['tonsil'], 'Asthma with atopic and reflux comorbidities.'),
    hip_fracture: S(['osteoporosis', 'htn', 'hld', 'fall_history', 'frailty'], ['cholecystectomy'], 'Older, frail, osteoporotic patient who fell.'),
    ugib: S(['pud', 'gerd', 'cirrhosis', 'anemia', 'chronic_steroids', 'osteoarthritis'], [], 'Ulcer, liver disease, NSAID or steroid risk.'),
    pancreatitis: S(['aud', 'hypertg', 'hld', 'obesity'], ['cholecystectomy'], 'Alcohol, triglycerides and gallstones are the main causes.'),
    diverticulitis: S(['diverticulosis', 'constipation', 'obesity', 'htn'], [], 'Known diverticulosis, low-fiber diet and obesity.'),
    aki: S(['ckd3', 'htn', 'dm2', 'hf', 'bph'], [], 'CKD, diabetes and heart failure predispose to AKI.'),
    cellulitis: S(['dm2', 'obesity', 'venous_stasis_ulcer', 'recurrent_cellulitis'], [], 'Diabetes, obesity, venous disease and prior episodes.'),
    etoh_withdrawal: S(['aud', 'depression', 'anxiety', 'nafld', 'gerd'], [], 'Chronic alcohol use with psychiatric and liver comorbidities.'),
    seizure: S(['epilepsy', 'hx_tbi', 'depression'], ['craniotomy'], 'Known seizure disorder, possible prior head injury.'),
    hyponatremia: S(['htn', 'depression', 'siadh', 'hf'], [], 'Thiazides, SSRIs, SIADH and heart failure contribute.'),
    tka: S(['osteoarthritis', 'htn', 'obesity', 'hld'], ['knee_scope'], 'Knee osteoarthritis with prior arthroscopy.'),
    ankle_fracture: S(['obesity', 'osteoporosis', 'dm2'], [], 'Bone health and diabetes affect healing.'),
    diabetic_foot_infection: S(['dm2', 'neuropathy', 'pad', 'diabetic_foot_ulcer', 'ckd3'], ['amp_toe'], 'Long-standing diabetes with neuropathy and vascular disease.'),
    pressure_injury: S(['frailty', 'dementia', 'dm2', 'malnutrition', 'urinary_incontinence'], [], 'Immobile, undernourished, incontinent patient.'),
    burn_scald: S([], [], 'Usually an otherwise healthy patient; add history if the scenario needs it.'),
    sjs_ten: S(['hiv', 'epilepsy', 'lupus_sle', 'gout'], [], 'Drug-trigger context: anticonvulsants, allopurinol, immune disease.'),
    tha: S(['osteoarthritis', 'htn', 'obesity', 'hld'], [], 'Hip osteoarthritis with common comorbidities.'),
    lumbar_fusion: S(['spinal_stenosis', 'chronic_back_neck_pain', 'obesity', 'htn'], ['laminectomy'], 'Degenerative spine disease with prior decompression.'),
    femur_fracture: S(['osteoporosis', 'htn', 'fall_history'], [], 'Fall in an older adult with weak bone.'),
    septic_arthritis: S(['rheumatoid_arthritis', 'dm2', 'osteoarthritis'], ['tka'], 'Joint disease, diabetes or prosthetic joint raise risk.'),
    necrotizing_fasciitis: S(['dm2', 'obesity', 'ckd3', 'pad'], [], 'Diabetes and vascular disease are major risk factors.'),
    erythroderma: S(['psoriasis', 'eczema', 'chronic_steroids'], [], 'Underlying inflammatory skin disease.')
  };
  // Category defaults for any diagnosis without an entry above. LPN Med Pass cases stay intentionally minimal.
  NS.SUGGEST_CAT = {
    'Cardiovascular': S(['htn', 'hld', 'dm2'], [], 'Common cardiovascular risk factors.'),
    'Pulmonary': S(['copd', 'asthma', 'htn'], [], 'Common chronic lung disease and hypertension.'),
    'Endocrine': S(['dm2', 'htn', 'hld'], [], 'Common metabolic comorbidities.'),
    'Gastrointestinal / Abdominal Surgery': S(['gerd', 'htn', 'obesity'], ['appendectomy'], 'Common GI-surgical background.'),
    'Renal / Fluid & Electrolytes': S(['htn', 'dm2', 'ckd3'], [], 'Kidney-related comorbidities.'),
    'Neurologic': S(['htn', 'hld', 'dm2'], [], 'Vascular risk factors.'),
    'Infectious Disease': S(['dm2', 'obesity', 'htn'], [], 'Host factors that raise infection risk.'),
    'Orthopedic / Trauma': S(['osteoarthritis', 'htn', 'obesity'], [], 'Common orthopedic comorbidities.'),
    'Dermatologic / Wound': S(['dm2', 'obesity', 'pad'], [], 'Factors that impair wound healing.'),
    'Toxicology / Substance Use': S(['depression', 'anxiety'], [], 'Common co-occurring mental health conditions.'),
    'LPN Med Pass': S([], [], '')
  };
  // Returns {hx, surg, note} for a primary diagnosis key; lpn_* and unknown categories give empty lists.
  NS.suggestFor = function (key) {
    const p = (NS.PRIMARY || {})[key]; if (!p) return { hx: [], surg: [], note: '' };
    if (/^lpn_/.test(key) || p.cat === 'LPN Med Pass') return { hx: [], surg: [], note: '' };
    const s = NS.SUGGEST[key] || NS.SUGGEST_CAT[p.cat] || { hx: [], surg: [], note: '' };
    const M = (NS.HX && NS.HX.M) || {}, SX = new Set(((NS.HX && NS.HX.SURGERIES) || []).map(t => t[0]));
    return { hx: s.hx.filter(k => M[k]), surg: s.surg.filter(k => SX.has(k)), note: s.note };
  };
})(window.NS = window.NS || {});
