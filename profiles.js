
const DIAGNOSIS_PROFILES = {
  pneumonia: {
    label: "Community-Acquired Pneumonia",
    type: "acute",
    description: "Typical inpatient pneumonia with cough, fever, hypoxia, leukocytosis, chest imaging findings, antibiotics, pulmonary hygiene, and oxygen needs.",
    problem: { name: "Community-acquired pneumonia", status: "Active", details: "Acute lower respiratory infection with hypoxia." },
    vitals: { temp: 100.8, hr: 104, sbp: 138, dbp: 78, rr: 24, spo2: 91, pain: 3 },
    labs: [
      { category:"CBC", code:"WBC", value:15.2, units:"K/uL", flag:"High", reference:"4.0-10.5" },
      { category:"CBC", code:"Hemoglobin", value:12.4, units:"g/dL", flag:"", reference:"12.0-16.0" },
      { category:"CMP", code:"Sodium", value:134, units:"mmol/L", flag:"Low", reference:"136-145" },
      { category:"CMP", code:"Creatinine", value:0.9, units:"mg/dL", flag:"", reference:"0.6-1.2" }
    ],
    medications: [
      { name:"ceftriaxone", dose:"1 g", route:"IV", frequency:"Daily", drugClass:"Cephalosporin antibiotic", importantInfo:"Verify allergy history and monitor response to antimicrobial therapy." },
      { name:"azithromycin", dose:"500 mg", route:"Oral", frequency:"Daily", drugClass:"Macrolide antibiotic", importantInfo:"Monitor GI tolerance and QT-risk factors when clinically relevant." }
    ],
    orders: [
      { name:"Oxygen via nasal cannula", category:"Respiratory", frequency:"Continuous, titrate", instructions:"Maintain SpO₂ 92% or greater and wean as tolerated." },
      { name:"Incentive spirometry", category:"Respiratory", frequency:"10 times hourly while awake", instructions:"Encourage pulmonary hygiene." },
      { name:"Vital signs", category:"Nursing", frequency:"Every 4 hours", instructions:"Trend respiratory status and temperature." },
      { name:"CBC with differential", category:"Laboratory", frequency:"Daily AM", instructions:"Trend leukocytosis." }
    ],
    diet: null,
    assessments: [
      ["Respiratory","Breath Sounds","Crackles left lower lobe"],
      ["Respiratory","Cough","Productive"],
      ["Respiratory","Oxygen Device","2 L nasal cannula"]
    ],
    notes: ["Left lower lobe infiltrate on chest imaging", "Encourage ambulation and incentive spirometry"]
  },

  chf: {
    label: "Acute Decompensated Heart Failure",
    type: "acute",
    description: "Volume overload with dyspnea, edema, crackles, elevated BNP, IV diuresis, daily weights, strict I&O, and sodium restriction.",
    problem: { name:"Acute decompensated heart failure", status:"Active", details:"Volume overload with pulmonary and peripheral congestion." },
    vitals: { temp:98.4, hr:98, sbp:154, dbp:88, rr:24, spo2:91, pain:1 },
    labs: [
      { category:"Cardiac", code:"BNP", value:980, units:"pg/mL", flag:"High", reference:"<100" },
      { category:"CMP", code:"Creatinine", value:1.3, units:"mg/dL", flag:"High", reference:"0.6-1.2" },
      { category:"CMP", code:"Potassium", value:3.7, units:"mmol/L", flag:"", reference:"3.5-5.1" }
    ],
    medications: [
      { name:"furosemide", dose:"40 mg", route:"IV", frequency:"BID", drugClass:"Loop diuretic", importantInfo:"Monitor BP, urine output, potassium, renal function, and volume status." }
    ],
    orders: [
      { name:"Strict intake and output", category:"Nursing", frequency:"Every shift", instructions:"Record all intake and output." },
      { name:"Daily weight", category:"Nursing", frequency:"Daily", instructions:"Same scale and similar clothing when possible." },
      { name:"Oxygen via nasal cannula", category:"Respiratory", frequency:"As needed", instructions:"Maintain ordered oxygen saturation goal." },
      { name:"Echocardiogram", category:"Imaging", frequency:"Once", instructions:"Evaluate cardiac function." }
    ],
    diet: "2 gram sodium diet; fluid restriction 1500 mL/day",
    assessments: [
      ["Respiratory","Breath Sounds","Bibasilar crackles"],
      ["Cardiac","Edema","2+ bilateral lower extremity edema"],
      ["Cardiac","Rhythm","Regular"],
      ["Musculoskeletal / Mobility","Activity Tolerance","Dyspnea with exertion"]
    ],
    notes: ["Orthopnea and increasing lower extremity edema", "Daily weight and net fluid balance are key trends"]
  },

  copd_exacerbation: {
    label: "COPD Exacerbation",
    type: "acute",
    description: "Increased dyspnea/wheeze with oxygen, bronchodilators, steroids, respiratory assessment, and cautious oxygen titration.",
    problem: { name:"COPD exacerbation", status:"Active", details:"Worsening airflow obstruction with increased work of breathing." },
    vitals: { temp:99.1, hr:102, sbp:144, dbp:82, rr:26, spo2:88, pain:0 },
    labs: [
      { category:"ABG", code:"PaCO2", value:52, units:"mmHg", flag:"High", reference:"35-45" },
      { category:"ABG", code:"PaO2", value:64, units:"mmHg", flag:"Low", reference:"80-100" }
    ],
    medications: [
      { name:"albuterol-ipratropium", dose:"3 mL", route:"Nebulized", frequency:"Every 4 hours", drugClass:"Bronchodilator combination", importantInfo:"Assess respiratory effort, lung sounds, and heart rate." },
      { name:"prednisone", dose:"40 mg", route:"Oral", frequency:"Daily", drugClass:"Corticosteroid", importantInfo:"Monitor glucose and infection risk." }
    ],
    orders: [
      { name:"Oxygen via nasal cannula", category:"Respiratory", frequency:"Continuous, titrate", instructions:"Use ordered target saturation range." },
      { name:"Respiratory therapy treatments", category:"Respiratory", frequency:"Every 4 hours", instructions:"Bronchodilator treatments." }
    ],
    diet: null,
    assessments: [["Respiratory","Breath Sounds","Expiratory wheezes"],["Respiratory","Work of Breathing","Accessory muscle use"]],
    notes: ["Use oxygen target appropriate to patient baseline/order", "Monitor response to bronchodilator treatment"]
  },

  sepsis: {
    label: "Sepsis",
    type: "acute",
    description: "Systemic infection with fever, tachycardia, hypotension risk, elevated lactate, cultures, antibiotics, fluid resuscitation, and close monitoring.",
    problem: { name:"Sepsis", status:"Active", details:"Systemic response to infection with risk of organ dysfunction." },
    vitals: { temp:102.2, hr:118, sbp:96, dbp:58, rr:26, spo2:93, pain:4 },
    labs: [
      { category:"Other", code:"Lactate", value:3.4, units:"mmol/L", flag:"High", reference:"0.5-2.0" },
      { category:"CBC", code:"WBC", value:18.4, units:"K/uL", flag:"High", reference:"4.0-10.5" },
      { category:"CMP", code:"Creatinine", value:1.6, units:"mg/dL", flag:"High", reference:"0.6-1.2" }
    ],
    medications: [
      { name:"cefepime", dose:"2 g", route:"IV", frequency:"Every 8 hours", drugClass:"Cephalosporin antibiotic", importantInfo:"Verify renal dosing and allergy history." }
    ],
    orders: [
      { name:"Blood cultures x2", category:"Laboratory", frequency:"Once", instructions:"Collect before antibiotics if this does not delay treatment." },
      { name:"Lactate", category:"Laboratory", frequency:"Now and repeat", instructions:"Trend perfusion marker." },
      { name:"0.9% sodium chloride bolus", category:"Medication", frequency:"Once", instructions:"Administer ordered fluid resuscitation." },
      { name:"Vital signs", category:"Nursing", frequency:"Every 1 hour initially", instructions:"Monitor for deterioration." }
    ],
    diet: null,
    assessments: [["Neurologic","Mental Status","Alert but fatigued"],["Safety","Perfusion Concern","Hypotension risk"]],
    notes: ["Frequent reassessment after fluids", "Monitor urine output and organ function"]
  },

  stroke: {
    label: "Acute Ischemic Stroke",
    type: "acute",
    description: "Focal neurologic deficit requiring frequent neuro assessment, swallowing screen, fall/aspiration precautions, imaging, and therapy evaluation.",
    problem: { name:"Acute ischemic stroke", status:"Active", details:"Acute focal neurologic deficit." },
    vitals: { temp:98.1, hr:86, sbp:178, dbp:94, rr:18, spo2:96, pain:0 },
    labs: [
      { category:"CBC", code:"Platelets", value:228, units:"K/uL", flag:"", reference:"150-400" },
      { category:"Coagulation", code:"INR", value:1.0, units:"", flag:"", reference:"0.9-1.2" },
      { category:"CMP", code:"Glucose", value:164, units:"mg/dL", flag:"High", reference:"70-110" }
    ],
    medications: [
      { name:"aspirin", dose:"81 mg", route:"Oral", frequency:"Daily", drugClass:"Antiplatelet", importantInfo:"Verify swallow status/route and assess bleeding risk." }
    ],
    orders: [
      { name:"Neurologic assessment", category:"Nursing", frequency:"Every 4 hours", instructions:"Monitor for change from baseline." },
      { name:"Swallow screen before oral intake", category:"Nursing", frequency:"Once", instructions:"Aspiration safety." },
      { name:"PT/OT/SLP evaluation", category:"Consult / Therapy", frequency:"Evaluate and treat", instructions:"Assess mobility, ADLs, and swallowing/speech." }
    ],
    diet: "NPO until swallow screen completed",
    assessments: [["Neurologic","Orientation","Alert and oriented x3"],["Neurologic","Motor Strength","Right arm 3/5; left arm 5/5"],["Safety","Fall Risk","High"]],
    notes: ["Maintain aspiration precautions until swallow safety confirmed", "Frequent neurologic trend is central to the scenario"]
  },

  uti: {
    label: "Complicated Urinary Tract Infection",
    type: "acute",
    description: "Dysuria/urinary symptoms with pyuria or positive culture, antibiotics, hydration, and monitoring for systemic infection.",
    problem: { name:"Complicated urinary tract infection", status:"Active", details:"Symptomatic urinary infection requiring inpatient treatment." },
    vitals: { temp:100.4, hr:96, sbp:132, dbp:74, rr:18, spo2:97, pain:4 },
    labs: [
      { category:"Urinalysis", code:"Leukocyte esterase", value:"Positive", units:"", flag:"Abnormal", reference:"Negative" },
      { category:"Urinalysis", code:"WBC urine", value:35, units:"/HPF", flag:"High", reference:"0-5" },
      { category:"CBC", code:"WBC", value:13.1, units:"K/uL", flag:"High", reference:"4.0-10.5" }
    ],
    medications: [
      { name:"ceftriaxone", dose:"1 g", route:"IV", frequency:"Daily", drugClass:"Cephalosporin antibiotic", importantInfo:"Review culture and allergy history." }
    ],
    orders: [
      { name:"Urine culture", category:"Laboratory", frequency:"Once", instructions:"Obtain before antibiotics when feasible." },
      { name:"Encourage oral fluids", category:"Nursing", frequency:"As tolerated", instructions:"Unless fluid restriction applies." }
    ],
    diet: null,
    assessments: [["GU","Urinary Symptoms","Dysuria and frequency"]],
    notes: ["Review urine culture for antimicrobial adjustment"]
  },

  post_op_abdominal: {
    label: "Postoperative Abdominal Surgery",
    type: "acute",
    description: "Post-op patient with pain, incision, IV fluids, mobility, incentive spirometry, bowel function, DVT prevention, and possible drains.",
    problem: { name:"Status post abdominal surgery", status:"Active", details:"Immediate postoperative recovery." },
    vitals: { temp:99.0, hr:92, sbp:126, dbp:72, rr:20, spo2:95, pain:6 },
    labs: [
      { category:"CBC", code:"Hemoglobin", value:10.8, units:"g/dL", flag:"Low", reference:"12.0-16.0" },
      { category:"CBC", code:"WBC", value:12.4, units:"K/uL", flag:"High", reference:"4.0-10.5" }
    ],
    medications: [
      { name:"acetaminophen", dose:"650 mg", route:"Oral", frequency:"Every 6 hours", drugClass:"Non-opioid analgesic", importantInfo:"Track total acetaminophen exposure." },
      { name:"oxycodone", dose:"5 mg", route:"Oral", frequency:"Every 4 hours PRN", drugClass:"Opioid analgesic", importantInfo:"Assess pain, sedation, respiratory rate, and oxygen saturation." }
    ],
    orders: [
      { name:"Ambulate with assistance", category:"Activity", frequency:"Three times daily", instructions:"Early postoperative mobility." },
      { name:"Incentive spirometry", category:"Respiratory", frequency:"10 times hourly while awake", instructions:"Postoperative pulmonary hygiene." },
      { name:"Incision assessment", category:"Nursing", frequency:"Every shift", instructions:"Assess dressing and incision." }
    ],
    diet: "Advance diet as tolerated",
    assessments: [["GI","Bowel Sounds","Hypoactive"],["Skin","Surgical Incision","Dressing clean, dry, intact"],["Pain","Pain Score","6/10"]],
    notes: ["Monitor bowel function, pain, mobility, and incision"]
  },

  htn: {
    label: "Hypertension",
    type: "history",
    description: "Raises baseline BP and contributes antihypertensive therapy and BP monitoring.",
    problem: { name:"Hypertension", status:"Chronic", details:"Chronic hypertension." },
    vitalAdjust: { sbp: 12, dbp: 6 },
    medications: [
      { name:"lisinopril", dose:"20 mg", route:"Oral", frequency:"Daily", drugClass:"ACE inhibitor", importantInfo:"Check BP, potassium, and creatinine. Monitor for cough/angioedema." }
    ],
    labs: [],
    orders: [],
    diet: null,
    monitoring: ["Blood pressure", "Potassium", "Creatinine"],
    notes: ["Avoid reflexively normalizing BP if acute condition supports elevation"]
  },

  dm2: {
    label: "Type 2 Diabetes Mellitus",
    type: "history",
    description: "Adds hyperglycemia tendency, glucose monitoring, diabetic diet considerations, and typical antihyperglycemic therapy.",
    problem: { name:"Type 2 diabetes mellitus", status:"Chronic", details:"Chronic diabetes requiring glucose monitoring." },
    vitalAdjust: {},
    medications: [
      { name:"insulin lispro", dose:"Correction scale", route:"Subcutaneous", frequency:"ACHS", drugClass:"Rapid-acting insulin", importantInfo:"Check blood glucose and coordinate with meal status." }
    ],
    labs: [
      { category:"CMP", code:"Glucose", value:212, units:"mg/dL", flag:"High", reference:"70-110" },
      { category:"Endocrine", code:"Hemoglobin A1c", value:8.1, units:"%", flag:"High", reference:"<5.7" }
    ],
    orders: [
      { name:"Point-of-care blood glucose", category:"Lab / Bedside Testing", frequency:"ACHS", instructions:"Coordinate with meals and insulin." }
    ],
    diet: "Consistent carbohydrate",
    monitoring: ["Blood glucose", "Meal intake"],
    notes: ["Acute illness may worsen glucose control"]
  },

  ckd3: {
    label: "Chronic Kidney Disease Stage 3",
    type: "history",
    description: "Adds reduced eGFR/creatinine elevation, renal medication considerations, avoidance of nephrotoxins, and renal diet logic.",
    problem: { name:"Chronic kidney disease stage 3", status:"Chronic", details:"Chronic renal impairment with reduced eGFR." },
    vitalAdjust: { sbp: 6, dbp: 2 },
    medications: [],
    labs: [
      { category:"CMP", code:"Creatinine", value:1.8, units:"mg/dL", flag:"High", reference:"0.6-1.2" },
      { category:"CMP", code:"BUN", value:32, units:"mg/dL", flag:"High", reference:"7-20" },
      { category:"CMP", code:"eGFR", value:38, units:"mL/min/1.73m²", flag:"Low", reference:">60" }
    ],
    orders: [
      { name:"Avoid nephrotoxic medications when alternatives are available", category:"Nursing", frequency:"Continuous", instructions:"Review renal dosing and nephrotoxic exposure." }
    ],
    diet: "Renal diet",
    monitoring: ["Creatinine", "BUN", "eGFR", "Potassium", "Fluid balance"],
    notes: ["Renally dose medications", "Avoid NSAIDs and unnecessary nephrotoxic exposure"]
  },

  cad: {
    label: "Coronary Artery Disease",
    type: "history",
    description: "Adds antiplatelet/statin therapy and cardiovascular monitoring.",
    problem: { name:"Coronary artery disease", status:"Chronic", details:"Known atherosclerotic cardiovascular disease." },
    vitalAdjust: {},
    medications: [
      { name:"aspirin", dose:"81 mg", route:"Oral", frequency:"Daily", drugClass:"Antiplatelet", importantInfo:"Monitor bleeding risk." },
      { name:"atorvastatin", dose:"40 mg", route:"Oral", frequency:"Nightly", drugClass:"Statin", importantInfo:"Review liver symptoms/labs when clinically indicated." }
    ],
    labs: [],
    orders: [],
    diet: "Heart healthy",
    monitoring: ["Chest pain", "Cardiac symptoms"],
    notes: []
  },

  afib: {
    label: "Atrial Fibrillation",
    type: "history",
    description: "Adds irregular rhythm, anticoagulation/rate control logic, HR monitoring, and coagulation monitoring if warfarin is selected.",
    problem: { name:"Atrial fibrillation", status:"Chronic", details:"Chronic atrial fibrillation requiring rate control and anticoagulation." },
    vitalAdjust: { hr: 8 },
    medications: [
      { name:"metoprolol tartrate", dose:"25 mg", route:"Oral", frequency:"BID", drugClass:"Beta blocker", importantInfo:"Check BP and HR before administration.", monitoring:["BP","HR"] },
      { name:"warfarin", dose:"5 mg", route:"Oral", frequency:"Daily at 1800", drugClass:"Anticoagulant", importantInfo:"Review PT/INR and bleeding risk before administration.", monitoring:["PT","INR"] }
    ],
    labs: [
      { category:"Coagulation", code:"PT", value:24.6, units:"sec", flag:"High", reference:"11-14" },
      { category:"Coagulation", code:"INR", value:2.4, units:"", flag:"", reference:"2.0-3.0" }
    ],
    orders: [],
    diet: null,
    monitoring: ["Heart rate", "Blood pressure", "PT/INR", "Bleeding"],
    notes: ["Irregular rhythm is expected unless rate/rhythm converted"]
  },

  copd: {
    label: "COPD",
    type: "history",
    description: "Adds chronic respiratory baseline, inhaler therapy, and lower baseline oxygen saturation.",
    problem: { name:"Chronic obstructive pulmonary disease", status:"Chronic", details:"Chronic obstructive lung disease." },
    vitalAdjust: { spo2:-3, rr:2 },
    medications: [
      { name:"tiotropium", dose:"2 inhalations", route:"Inhaled", frequency:"Daily", drugClass:"Long-acting anticholinergic bronchodilator", importantInfo:"Assess respiratory status and inhaler technique." }
    ],
    labs: [],
    orders: [],
    diet: null,
    monitoring: ["SpO₂", "Respiratory rate", "Breath sounds"],
    notes: ["Use patient-specific oxygen goal when appropriate"]
  },

  hyperlipidemia: {
    label: "Hyperlipidemia",
    type: "history",
    description: "Adds statin therapy without major acute changes to vitals.",
    problem: { name:"Hyperlipidemia", status:"Chronic", details:"Chronic dyslipidemia." },
    vitalAdjust: {},
    medications: [
      { name:"atorvastatin", dose:"40 mg", route:"Oral", frequency:"Nightly", drugClass:"Statin", importantInfo:"Monitor for muscle symptoms and liver-related adverse effects when indicated." }
    ],
    labs: [],
    orders: [],
    diet: "Heart healthy",
    monitoring: [],
    notes: []
  },

  obesity: {
    label: "Obesity",
    type: "history",
    description: "Adds mobility/skin/DVT-risk considerations and commonly coexists with HTN/DM2.",
    problem: { name:"Obesity", status:"Chronic", details:"Obesity affecting mobility and cardiometabolic risk." },
    vitalAdjust: {},
    medications: [],
    labs: [],
    orders: [
      { name:"Skin assessment", category:"Nursing", frequency:"Every shift", instructions:"Pay attention to skin folds and pressure risk." }
    ],
    diet: null,
    monitoring: ["Mobility", "Skin integrity"],
    notes: ["Consider equipment sizing and mobility assistance"]
  },

  dementia: {
    label: "Dementia",
    type: "history",
    description: "Adds cognitive impairment, fall/safety precautions, reorientation, and discharge planning complexity.",
    problem: { name:"Dementia", status:"Chronic", details:"Chronic cognitive impairment." },
    vitalAdjust: {},
    medications: [],
    labs: [],
    orders: [
      { name:"Fall precautions", category:"Precautions", frequency:"Continuous", instructions:"Frequent rounding, orientation, and safety measures." }
    ],
    diet: null,
    monitoring: ["Orientation", "Safety", "Delirium change from baseline"],
    notes: ["Differentiate chronic baseline cognition from acute delirium"]
  },

  anemia: {
    label: "Chronic Anemia",
    type: "history",
    description: "Adds lower hemoglobin and fatigue/activity tolerance considerations.",
    problem: { name:"Chronic anemia", status:"Chronic", details:"Baseline anemia." },
    vitalAdjust: { hr:3 },
    medications: [],
    labs: [
      { category:"CBC", code:"Hemoglobin", value:10.4, units:"g/dL", flag:"Low", reference:"12.0-16.0" }
    ],
    orders: [],
    diet: null,
    monitoring: ["Hemoglobin", "Fatigue", "Activity tolerance"],
    notes: []
  }
};

const PRIMARY_KEYS = ["pneumonia","chf","copd_exacerbation","sepsis","stroke","uti","post_op_abdominal"];
const HISTORY_KEYS = ["htn","dm2","ckd3","cad","afib","copd","hyperlipidemia","obesity","dementia","anemia"];
