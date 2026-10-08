const samplePatient = {
  patient: {
    mrn: "SIM-000184",
    name: "Jordan Miller",
    preferredName: "Jordan",
    dob: "1972-04-18",
    age: 54,
    sex: "Female",
    pronouns: "she/her",
    allergies: [
      { substance: "Penicillin", reaction: "Hives", severity: "High" },
      { substance: "Latex", reaction: "Contact dermatitis", severity: "Moderate" }
    ]
  },
  encounter: {
    location: "4 Medical",
    room: "412B",
    attending: "S. Patel, MD",
    admitDate: "2026-06-16 21:42",
    diagnosis: "Community-acquired pneumonia",
    chiefComplaint: "Shortness of breath and productive cough",
    codeStatus: "Full Code",
    isolation: "Droplet precautions",
    dietOrder: "Regular, diabetic consistent carbohydrate",
    ambulationOrder: "Up with assistance. Ambulate in hall TID as tolerated.",
    fallRisk: "Moderate",
    lastUpdated: "2026-06-17 08:30"
  },
  stickyNotes: [
    { title: "Discharge planning", body: "Case management following. Anticipated discharge home with spouse when oxygen is weaned and patient tolerates ambulation." },
    { title: "Nurse handoff", body: "Encourage incentive spirometer hourly while awake. Monitor exertional SpO₂ during hallway ambulation." }
  ],
  ivs: [
    { type: "Peripheral IV", location: "Left forearm", siteMarker: "leftForearm", gauge: "20 gauge", infusing: "Saline lock", placementDate: "2026-06-16 21:58", lastAssessment: "2026-06-17 08:00 - site clean, dry, intact, flushes without difficulty", status: "Patent" },
    { type: "Peripheral IV", location: "Right AC", siteMarker: "rightAC", gauge: "18 gauge", infusing: "0.9% NS at 75 mL/hr", placementDate: "2026-06-16 22:05", lastAssessment: "2026-06-17 08:00 - dressing intact, no redness or swelling", status: "Infusing" }
  ],
  drains: [
    { type: "JP drain", location: "Right lower quadrant", siteMarker: "abdomenRLQ", placementDate: "2026-06-15 13:30", lastAssessment: "2026-06-17 07:30 - bulb compressed, insertion site clean", drainage: "35 mL serosanguineous this shift", status: "Active" },
    { type: "Chest tube", location: "Left chest", siteMarker: "chestLeft", placementDate: "2026-06-16 04:10", lastAssessment: "2026-06-17 08:00 - occlusive dressing intact, tidaling present, no air leak noted", drainage: "120 mL serosanguineous in collection chamber", status: "To suction -20 cm" }
  ],
  tubes: [
    { type: "Nasal cannula", location: "Nares", siteMarker: "nares", placementDate: "2026-06-16 21:45", lastAssessment: "2026-06-17 08:00 - in place, skin intact behind ears", drainage: "N/A", status: "2 L/min oxygen" },
    { type: "Foley catheter", location: "Urinary", siteMarker: "pelvis", placementDate: "2026-06-16 23:30", lastAssessment: "2026-06-17 07:00 - secured, draining clear yellow urine", drainage: "550 mL urine this shift", status: "Active" },
    { type: "NG tube", location: "Left nare to stomach", siteMarker: "ngTube", placementDate: "2026-06-16 22:15", lastAssessment: "2026-06-17 06:30 - placement verified per order, to low intermittent suction", drainage: "100 mL green drainage", status: "LIS" }
  ],
  problems: [
    { name: "Community-acquired pneumonia", status: "Active", details: "Receiving ceftriaxone and azithromycin. Oxygen at 2 L nasal cannula." },
    { name: "Type 2 diabetes mellitus", status: "Chronic", details: "ACHS glucose checks ordered. Sliding scale insulin available." },
    { name: "Hypertension", status: "Chronic", details: "Home lisinopril continued." }
  ],
  vitals: { time: "2026-06-17 08:00", temp: "100.8 °F", hr: "104", bp: "146/84", rr: "24", spo2: "93% on 2 L NC", pain: "3/10" },
  nursingOrders: [
    { order: "Vital signs", frequency: "Every 4 hours", status: "Active" },
    { order: "Strict intake and output", frequency: "Every shift", status: "Active" },
    { order: "Incentive spirometry", frequency: "10 times hourly while awake", status: "Active" },
    { order: "Point-of-care blood glucose", frequency: "ACHS", status: "Active" },
    { order: "Ambulate in hallway with assistance", frequency: "Three times daily as tolerated", status: "Active" }
  ],
  orders: [
    {
      name: "Vital signs",
      category: "Nursing",
      status: "Active",
      frequency: "Every 4 hours",
      start: "2026-06-16 22:15",
      provider: "J. Reynolds, NP",
      instructions: "Notify provider for SBP less than 90, HR greater than 120, RR greater than 28, SpO₂ less than 90%, or temperature greater than 101.5 °F.",
      rationale: "Ongoing monitoring for pneumonia, hypoxia, and clinical deterioration.",
      linkedData: ["Current vitals", "Oxygen requirement", "Pneumonia diagnosis"],
      nursingConsiderations: ["Trend respiratory rate and oxygen saturation.", "Escalate sustained abnormal values promptly."]
    },
    {
      name: "Strict intake and output",
      category: "Nursing",
      status: "Active",
      frequency: "Every shift",
      start: "2026-06-16 22:15",
      provider: "J. Reynolds, NP",
      instructions: "Record all oral intake, IV intake, urine output, drains, and emesis each shift.",
      rationale: "Monitoring hydration status, renal perfusion, and drainage totals.",
      linkedData: ["Foley catheter", "JP drain", "IV fluids"],
      nursingConsiderations: ["Document drain output separately.", "Report low urine output per unit policy."]
    },
    {
      name: "Regular diabetic consistent carbohydrate diet",
      category: "Diet",
      status: "Active",
      frequency: "Meals",
      start: "2026-06-17 07:00",
      provider: "S. Patel, MD",
      instructions: "Consistent carbohydrate meal tray. Allow oral fluids as tolerated.",
      rationale: "Supports oral intake while maintaining glucose control.",
      linkedData: ["Type 2 diabetes mellitus", "Glucose 214 mg/dL"],
      nursingConsiderations: ["Coordinate meal delivery with point-of-care glucose checks and insulin administration."]
    },
    {
      name: "Up with assistance, ambulate in hall",
      category: "Activity",
      status: "Active",
      frequency: "Three times daily as tolerated",
      start: "2026-06-17 08:00",
      provider: "S. Patel, MD",
      instructions: "Ambulate with staff assistance. Monitor exertional dyspnea and oxygen saturation.",
      rationale: "Promotes mobility and pulmonary hygiene while maintaining safety.",
      linkedData: ["Moderate fall risk", "PT evaluation", "Oxygen requirement"],
      nursingConsiderations: ["Use gait belt if needed.", "Pause activity if SpO₂ drops below ordered threshold."]
    },
    {
      name: "Oxygen via nasal cannula",
      category: "Respiratory",
      status: "Active",
      frequency: "Continuous, titrate per order",
      start: "2026-06-16 21:45",
      provider: "M. Carter, PA-C",
      instructions: "Maintain SpO₂ 92% or greater. Wean as tolerated.",
      rationale: "Treats hypoxia related to pneumonia.",
      linkedData: ["SpO₂ 89% room air in ED", "Nasal cannula active on avatar"],
      nursingConsiderations: ["Assess skin behind ears.", "Document oxygen flow rate with vitals."]
    },
    {
      name: "Incentive spirometry",
      category: "Respiratory",
      status: "Active",
      frequency: "10 times hourly while awake",
      start: "2026-06-16 22:30",
      provider: "J. Reynolds, NP",
      instructions: "Coach patient to use incentive spirometer while awake.",
      rationale: "Supports lung expansion and pulmonary hygiene.",
      linkedData: ["Community-acquired pneumonia", "Productive cough"],
      nursingConsiderations: ["Document patient tolerance and education."]
    },
    {
      name: "Ceftriaxone 1 g IV",
      category: "Medication",
      status: "Active",
      frequency: "Daily",
      start: "2026-06-16 22:05",
      provider: "M. Carter, PA-C",
      instructions: "Administer IV antibiotic per MAR.",
      rationale: "Antimicrobial coverage for community-acquired pneumonia.",
      linkedData: ["Left lower lobe infiltrate", "WBC 15.2 K/uL"],
      nursingConsiderations: ["Assess allergy history.", "Monitor for rash, diarrhea, or infusion reaction."]
    },
    {
      name: "Azithromycin 500 mg PO",
      category: "Medication",
      status: "Active",
      frequency: "Daily",
      start: "2026-06-17 09:00",
      provider: "S. Patel, MD",
      instructions: "Administer PO antibiotic with or without food as tolerated.",
      rationale: "Additional pneumonia coverage.",
      linkedData: ["Community-acquired pneumonia"],
      nursingConsiderations: ["Monitor for GI upset.", "Verify route tolerance."]
    },
    {
      name: "Point-of-care blood glucose",
      category: "Lab / Bedside Testing",
      status: "Active",
      frequency: "ACHS",
      start: "2026-06-16 22:30",
      provider: "J. Reynolds, NP",
      instructions: "Check blood glucose before meals and at bedtime.",
      rationale: "Glucose monitoring for diabetes and illness-related hyperglycemia.",
      linkedData: ["Type 2 diabetes mellitus", "Glucose 214 mg/dL", "Sliding scale insulin"],
      nursingConsiderations: ["Coordinate with meals.", "Treat per sliding scale order."]
    },
    {
      name: "CBC with differential",
      category: "Laboratory",
      status: "Active",
      frequency: "Daily AM",
      start: "2026-06-17 05:00",
      provider: "S. Patel, MD",
      instructions: "Collect daily morning CBC.",
      rationale: "Trend leukocytosis and response to treatment.",
      linkedData: ["WBC 15.2 K/uL", "Pneumonia"],
      nursingConsiderations: ["Review abnormal results and notify provider as ordered."]
    },
    {
      name: "Comprehensive metabolic panel",
      category: "Laboratory",
      status: "Active",
      frequency: "Daily AM",
      start: "2026-06-17 05:00",
      provider: "S. Patel, MD",
      instructions: "Collect daily morning CMP.",
      rationale: "Monitor electrolytes, renal function, and glucose trend.",
      linkedData: ["Creatinine 0.9 mg/dL", "Sodium 134 mmol/L"],
      nursingConsiderations: ["Review potassium and renal function before relevant medications."]
    },
    {
      name: "Chest X-ray portable",
      category: "Imaging",
      status: "Completed",
      frequency: "Once",
      start: "2026-06-16 20:40",
      provider: "M. Carter, PA-C",
      instructions: "Portable chest radiograph completed in ED.",
      rationale: "Evaluate shortness of breath and suspected pneumonia.",
      linkedData: ["Left basilar infiltrate"],
      nursingConsiderations: ["Review results in Imaging tab."]
    },
    {
      name: "Physical therapy evaluation and treat",
      category: "Consult / Therapy",
      status: "Active",
      frequency: "Evaluate and treat",
      start: "2026-06-17 08:00",
      provider: "S. Patel, MD",
      instructions: "PT to evaluate mobility, endurance, and discharge needs.",
      rationale: "Patient has reduced endurance and exertional dyspnea.",
      linkedData: ["PT note", "Ambulation order", "Discharge planning"],
      nursingConsiderations: ["Coordinate pain control and oxygen availability before therapy."]
    },
    {
      name: "Droplet precautions",
      category: "Precautions",
      status: "Active",
      frequency: "Continuous",
      start: "2026-06-16 22:00",
      provider: "J. Reynolds, NP",
      instructions: "Use droplet precautions per facility policy.",
      rationale: "Respiratory infection precautions.",
      linkedData: ["Productive cough", "Pneumonia"],
      nursingConsiderations: ["Ensure signage and appropriate PPE are available."]
    },
    {
      name: "Blood cultures x2",
      category: "Laboratory",
      status: "Completed",
      frequency: "Once",
      start: "2026-06-16 21:25",
      provider: "M. Carter, PA-C",
      instructions: "Collected prior to antibiotics.",
      rationale: "Evaluate for bacteremia prior to antimicrobial therapy.",
      linkedData: ["Fever", "Leukocytosis"],
      nursingConsiderations: ["Monitor for final culture results."]
    },
    {
      name: "Cefoxitin IV",
      category: "Medication",
      status: "Discontinued",
      frequency: "Every 6 hours",
      start: "2026-06-16 04:15",
      end: "2026-06-17 13:00",
      provider: "S. Patel, MD",
      instructions: "Discontinued after medication reconciliation and updated antimicrobial plan.",
      rationale: "Historical/completed antimicrobial order.",
      linkedData: ["Completed medication section in MAR"],
      nursingConsiderations: ["Do not administer discontinued medication."]
    }
  ],
  intakeOutput: [
    { time: "2300-0300", intake: 240, output: 450 },
    { time: "0300-0700", intake: 120, output: 350 },
    { time: "0700-1100", intake: 480, output: 300 },
    { time: "1100-1500", intake: 360, output: 250 }
  ],
  medications: [
    { name: "Ceftriaxone", dose: "1 g", route: "IV", frequency: "Daily" },
    { name: "Azithromycin", dose: "500 mg", route: "PO", frequency: "Daily" },
    { name: "Lisinopril", dose: "20 mg", route: "PO", frequency: "Daily" },
    { name: "Insulin lispro", dose: "Sliding scale", route: "SubQ", frequency: "ACHS PRN" }
  ],
  mar: {
    date: "Friday September 13, 2026",
    timeSlots: ["0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500"],
    medications: [
      {
        name: "cetirizine (ZyrTEC) tablet",
        dose: "10 mg",
        route: "Oral",
        frequency: "Daily",
        adminDose: "1 tablet (1 × 10 mg tablet)",
        category: "scheduled",
        orderStartIndex: 0,
        events: [
          { slotIndex: 4, time: "1230", state: "given", label: "1230 Given 10 mg" }
        ],
        lastAdmin: "Today 09/13/26 at 1230 (Given)",
        dispenseLocation: "Pharmacy to load in ADS"
      },
      {
        name: "metoprolol tartrate tablet",
        dose: "25 mg",
        route: "Oral",
        frequency: "BID",
        adminDose: "25 mg",
        category: "scheduled",
        orderStartIndex: 0,
        events: [
          { slotIndex: 3, time: "1130", state: "given", label: "1130 Given 25 mg" }
        ],
        lastAdmin: "Today 09/13/26 at 1130 (Given)",
        dispenseLocation: "Central Pharmacy",
        detail: {
          drugClass: "Beta blocker",
          importantInfo: "Check blood pressure and heart rate before administration. Hold and notify provider if SBP is below ordered parameter or HR is below ordered parameter.",
          keyMonitoring: [
            { label: "Blood Pressure", value: "118/72", note: "Current reading before dose", flagged: true },
            { label: "Heart Rate", value: "68 bpm", note: "Current reading before dose", flagged: true }
          ],
          lastThreeDoses: [
            { time: "09/13/26 1130", dose: "25 mg PO", status: "Given" },
            { time: "09/12/26 2100", dose: "25 mg PO", status: "Given" },
            { time: "09/12/26 0900", dose: "25 mg PO", status: "Given" }
          ]
        }
      },
      {
        name: "warfarin (Coumadin) tablet",
        dose: "5 mg",
        route: "Oral",
        frequency: "Daily at 1800",
        adminDose: "5 mg",
        category: "scheduled",
        orderStartIndex: 0,
        events: [
          { slotIndex: 4, time: "1200", state: "due", label: "1200 Due" }
        ],
        lastAdmin: "Yesterday 09/12/26 at 1800 (Given)",
        dispenseLocation: "Central Pharmacy",
        detail: {
          drugClass: "Anticoagulant",
          importantInfo: "Review PT/INR before administration. Monitor for bleeding, bruising, and changes in anticoagulation plan.",
          keyMonitoring: [
            { label: "PT", value: "24.6 sec", note: "Most recent coagulation result", flagged: true },
            { label: "INR", value: "2.4", note: "Therapeutic range for current indication", flagged: true }
          ],
          lastThreeDoses: [
            { time: "09/12/26 1800", dose: "5 mg PO", status: "Given" },
            { time: "09/11/26 1800", dose: "5 mg PO", status: "Given" },
            { time: "09/10/26 1800", dose: "2.5 mg PO", status: "Given" }
          ]
        }
      },
      {
        name: "cefOXitin (Mefoxin) IV syringe",
        dose: "900 mg",
        route: "Intravenous",
        frequency: "Every 6 hours",
        adminDose: "900 mg = 22.5 mL",
        concentration: "40 mg/mL",
        category: "scheduled",
        orderStartIndex: 0,
        discontinuedIndex: 5,
        events: [
          { slotIndex: 0, time: "0415", state: "given", label: "0415 Given 900 mg" },
          { slotIndex: 5, time: "1300", state: "discontinued", label: "1300 Discontinued" }
        ],
        lastAdmin: "Today 09/13/26 at 0415 (New Bag)",
        dispenseLocation: "Central Pharmacy",
        completed: true
      },
      {
        name: "0.9% sodium chloride infusion",
        dose: "75 mL/hr",
        route: "Intravenous",
        frequency: "Continuous",
        adminDose: "Continuous infusion",
        category: "continuous",
        orderStartIndex: 2,
        events: [
          { slotIndex: 2, time: "1000", state: "given", label: "1000 Running" }
        ],
        lastAdmin: "Running now",
        dispenseLocation: "Pump channel A"
      },
      {
        name: "digoxin (Lanoxin) tablet",
        dose: "0.125 mg",
        route: "Oral",
        frequency: "Daily",
        adminDose: "0.125 mg",
        category: "prn",
        orderStartIndex: 1,
        events: [
          { slotIndex: 6, time: "1445", state: "due", label: "1445 Due" }
        ],
        lastAdmin: "09/12/26 at 0900 (Given)",
        dispenseLocation: "Patient-specific bin",
        detail: {
          drugClass: "Cardiac glycoside",
          importantInfo: "Assess apical pulse before administration. Monitor potassium and digoxin level if ordered. Hold and notify provider for low pulse per order parameters.",
          keyMonitoring: [
            { label: "Apical Pulse", value: "62 bpm", note: "Assess before administration", flagged: true },
            { label: "Potassium", value: "4.3 mmol/L", note: "Most recent chemistry result", flagged: true }
          ],
          lastThreeDoses: [
            { time: "09/12/26 0900", dose: "0.125 mg PO", status: "Given" },
            { time: "09/11/26 0900", dose: "0.125 mg PO", status: "Given" },
            { time: "09/10/26 0900", dose: "0.125 mg PO", status: "Given" }
          ]
        }
      }
    ]
  },
  recentLabs: [
    { category: "CBC", test: "WBC", result: "15.2 K/uL", flag: "High", reference: "4.0-10.5", collected: "2026-06-17 05:10" },
    { category: "CBC", test: "Hemoglobin", result: "12.1 g/dL", flag: "", reference: "12.0-16.0", collected: "2026-06-17 05:10" },
    { category: "CMP", test: "Creatinine", result: "0.9 mg/dL", flag: "", reference: "0.6-1.2", collected: "2026-06-17 05:10" },
    { category: "CMP", test: "Glucose", result: "214 mg/dL", flag: "High", reference: "70-110", collected: "2026-06-17 05:10" }
  ],
  labResults: [
    { category: "CBC", test: "WBC", result: "15.2", units: "K/uL", flag: "High", reference: "4.0-10.5", collected: "2026-06-17 05:10", specimen: "Blood", status: "Final", history: [{ collected: "2026-06-16 21:30", result: "16.1", units: "K/uL", flag: "High" }, { collected: "2026-06-17 05:10", result: "15.2", units: "K/uL", flag: "High" }] },
    { category: "CBC", test: "Hemoglobin", result: "12.1", units: "g/dL", flag: "", reference: "12.0-16.0", collected: "2026-06-17 05:10", specimen: "Blood", status: "Final", history: [{ collected: "2026-06-16 21:30", result: "12.8", units: "g/dL", flag: "" }, { collected: "2026-06-17 05:10", result: "12.1", units: "g/dL", flag: "" }] },
    { category: "CBC", test: "Platelets", result: "286", units: "K/uL", flag: "", reference: "150-400", collected: "2026-06-17 05:10", specimen: "Blood", status: "Final" },
    { category: "CMP", test: "Sodium", result: "134", units: "mmol/L", flag: "Low", reference: "136-145", collected: "2026-06-17 05:10", specimen: "Blood", status: "Final" },
    { category: "CMP", test: "Potassium", result: "4.3", units: "mmol/L", flag: "", reference: "3.5-5.1", collected: "2026-06-17 05:10", specimen: "Blood", status: "Final" },
    { category: "CMP", test: "Creatinine", result: "0.9", units: "mg/dL", flag: "", reference: "0.6-1.2", collected: "2026-06-17 05:10", specimen: "Blood", status: "Final" },
    { category: "CMP", test: "Glucose", result: "214", units: "mg/dL", flag: "High", reference: "70-110", collected: "2026-06-17 05:10", specimen: "Blood", status: "Final", history: [{ collected: "2026-06-16 21:30", result: "246", units: "mg/dL", flag: "High" }, { collected: "2026-06-17 05:10", result: "214", units: "mg/dL", flag: "High" }] },
    { category: "Coagulation", test: "PT", result: "13.5", units: "sec", flag: "", reference: "11.0-14.0", collected: "2026-06-16 21:30", specimen: "Blood", status: "Final" },
    { category: "Coagulation", test: "INR", result: "1.1", units: "", flag: "", reference: "0.9-1.2", collected: "2026-06-16 21:30", specimen: "Blood", status: "Final" },
    { category: "Cardiac", test: "Troponin I", result: "0.01", units: "ng/mL", flag: "", reference: "<0.04", collected: "2026-06-16 21:30", specimen: "Blood", status: "Final" },
    { category: "ABG", test: "pH", result: "7.43", units: "", flag: "", reference: "7.35-7.45", collected: "2026-06-16 22:05", specimen: "Arterial blood", status: "Final" },
    { category: "ABG", test: "PaO2", result: "68", units: "mmHg", flag: "Low", reference: "80-100", collected: "2026-06-16 22:05", specimen: "Arterial blood", status: "Final" },
    { category: "Urinalysis", test: "Leukocyte esterase", result: "Negative", units: "", flag: "", reference: "Negative", collected: "2026-06-17 06:12", specimen: "Urine", status: "Final" }
  ],
  chartReview: {
    progressNotes: [
      { title: "Hospitalist Progress Note", author: "S. Patel, MD", datetime: "2026-06-17 08:42", category: "Progress Note", summary: "Patient improving on antibiotics but continues to require low-flow oxygen.", body: "**Community-acquired pneumonia**\n- WBC 15.2 K/uL.\n- Chest x-ray with left basilar infiltrate.\n- CTA chest with multifocal left lower lobe pneumonia.\n- Oxygen saturation 93% on 2 L nasal cannula.\n- Continue ceftriaxone.\n- Continue azithromycin.\n- Wean oxygen as tolerated.\n- Encourage incentive spirometry and ambulation.\n\n**Type 2 diabetes mellitus**\n- Serum glucose 214 mg/dL.\n- ACHS point-of-care glucose monitoring in place.\n- Continue ACHS glucose checks.\n- Use sliding scale insulin lispro as ordered.\n\n**Hypertension**\n- Blood pressure 146/84 this morning.\n- Continue home lisinopril.\n- Monitor blood pressure trend." },
      { title: "Nursing Progress Note", author: "A. Smith, RN", datetime: "2026-06-17 07:15", category: "Progress Note", summary: "Patient tolerated morning hygiene and transfer to chair with one-assist.", body: "Patient awake, alert, and oriented x4. O2 at 2 L NC maintained. Productive cough noted. Incentive spirometer use reinforced. Foley draining clear yellow urine. Patient transferred to chair with assistance and tolerated well." }
    ],
    hp: [
      { title: "History and Physical", author: "J. Reynolds, NP", datetime: "2026-06-16 22:10", category: "H&P", summary: "Admission evaluation for dyspnea, fever, and productive cough.", body: "Chief Complaint:\nShortness of breath and productive cough.\n\nHistory of Present Illness:\n54-year-old female presented to the emergency department with two days of worsening cough, fever, fatigue, and dyspnea.\n\nPast Medical History:\nType 2 diabetes mellitus, hypertension.\n\nAssessment:\nCommunity-acquired pneumonia with hypoxia requiring inpatient management." }
    ],
    erVisitSummary: [
      { title: "ED Provider Note", author: "M. Carter, PA-C", datetime: "2026-06-16 20:58", category: "ER Visit Summary", summary: "Patient presented with fever, cough, shortness of breath, and abnormal chest x-ray.", body: "Arrival complaint of increasing shortness of breath and productive cough. Initial oxygen saturation 89% on room air, improved to 94% on 2 L nasal cannula. Chest x-ray consistent with left lower lobe infiltrate. Blood cultures obtained and IV antibiotics initiated prior to admission." }
    ],
    therapyNotes: [
      { title: "Physical Therapy Evaluation", author: "L. Gomez, PT", datetime: "2026-06-17 10:20", category: "PT", summary: "Patient ambulates 80 feet with contact guard assistance and mild exertional dyspnea.", body: "Patient demonstrates reduced endurance and mild balance deficits. O2 saturation decreased to 90% during ambulation and recovered to 93% with rest. Recommend continued gait training and discharge home with family assistance when medically stable." },
      { title: "Occupational Therapy Evaluation", author: "D. Hall, OT", datetime: "2026-06-17 11:05", category: "OT", summary: "Patient requires supervision to minimal assistance with lower body dressing and bathing.", body: "Patient limited primarily by fatigue and shortness of breath. Education provided regarding pacing and energy conservation. Recommend continued OT for ADL progression." },
      { title: "Speech Therapy Screen", author: "P. Nguyen, SLP", datetime: "2026-06-17 12:12", category: "SLP", summary: "No acute speech or swallow concerns identified at this time.", body: "Patient tolerated thin liquids and regular textures without overt signs of aspiration during screening. Formal SLP evaluation not indicated currently." }
    ],
    caseManagement: [
      { title: "Case Management Note", author: "R. Lewis, RN CM", datetime: "2026-06-17 09:25", category: "Case Management", summary: "Anticipated discharge home with spouse; no durable medical equipment currently in place.", body: "Met with patient regarding anticipated discharge plan. Patient lives with spouse in single-level home. No home oxygen baseline. Monitoring for potential oxygen need at discharge depending on weaning progress. Transportation home available." }
    ],
    imaging: [
      { title: "Chest X-Ray Portable", author: "Radiology", datetime: "2026-06-16 20:40", category: "Imaging", summary: "Left basilar airspace opacity suspicious for pneumonia.", study: "Portable chest radiograph", impression: "Left basilar infiltrate concerning for pneumonia. No pleural effusion or pneumothorax.", body: "Findings:\nPortable AP chest demonstrates focal left basilar airspace opacity. Cardiomediastinal silhouette is within normal limits. No pleural effusion or pneumothorax." },
      { title: "CT Angiogram Chest", author: "Radiology", datetime: "2026-06-16 23:02", category: "Imaging", summary: "No pulmonary embolism. Multifocal left lower lobe pneumonia.", study: "CTA chest with contrast", impression: "No evidence of pulmonary embolism. Multifocal left lower lobe consolidative change consistent with pneumonia.", body: "Findings:\nPulmonary arteries opacify normally without filling defect. Patchy consolidative changes seen in the left lower lobe. Mild reactive mediastinal adenopathy present." }
    ],
    cardiology: [
      { title: "12-Lead ECG", author: "Cardiology", datetime: "2026-06-16 20:36", category: "Cardiology", summary: "Sinus tachycardia without acute ischemic change.", study: "ECG 12 lead", impression: "Sinus tachycardia, rate 108. No ST elevation or acute ischemic changes.", body: "Measurements:\nRate 108 bpm.\nPR 154 ms.\nQRS 90 ms.\nQTc 431 ms.\n\nInterpretation:\nSinus tachycardia. Otherwise unremarkable ECG." },
      { title: "Echocardiogram", author: "Cardiology", datetime: "2026-06-17 13:10", category: "Cardiology", summary: "Normal left ventricular systolic function.", study: "Transthoracic echocardiogram", impression: "LVEF estimated 60-65%. No major valvular abnormality.", body: "Findings:\nNormal left ventricular size and systolic function. No regional wall motion abnormalities. Right ventricular function preserved. No significant pericardial effusion." }
    ]
  }
};

const schemaExample = {
  patient: { mrn: "SIM-000001", name: "First Last", preferredName: "First", dob: "YYYY-MM-DD", age: 0, sex: "Female/Male/Other", pronouns: "optional", allergies: [{ substance: "Medication or material", reaction: "Reaction", severity: "High/Moderate/Low" }] },
  encounter: { location: "Unit", room: "Room", attending: "Provider", admitDate: "YYYY-MM-DD HH:mm", diagnosis: "Primary diagnosis", chiefComplaint: "Chief complaint", codeStatus: "Full Code", isolation: "None", dietOrder: "Diet order", ambulationOrder: "Ambulation or activity order", fallRisk: "Low/Moderate/High", lastUpdated: "YYYY-MM-DD HH:mm" },
  stickyNotes: [{ title: "Discharge planning", body: "Nurse note" }],
  ivs: [{ type: "Peripheral IV", location: "Left forearm", siteMarker: "leftForearm", gauge: "20 gauge", infusing: "Saline lock", placementDate: "YYYY-MM-DD HH:mm", lastAssessment: "Assessment text", status: "Patent" }],
  drains: [{ type: "JP drain", location: "Right lower quadrant", siteMarker: "abdomenRLQ", placementDate: "YYYY-MM-DD HH:mm", lastAssessment: "Assessment text", drainage: "35 mL serosanguineous", status: "Active" }],
  tubes: [{ type: "Foley catheter", location: "Urinary", siteMarker: "pelvis", placementDate: "YYYY-MM-DD HH:mm", lastAssessment: "Assessment text", drainage: "Output text", status: "Active" }],
  problems: [{ name: "Problem", status: "Active/Chronic/Resolved", details: "Brief supporting detail" }],
  vitals: { time: "YYYY-MM-DD HH:mm", temp: "98.6 °F", hr: "80", bp: "120/80", rr: "16", spo2: "98% RA", pain: "0/10" },
  nursingOrders: [{ order: "Nursing order", frequency: "Every 4 hours / Daily / PRN", status: "Active/Completed/Discontinued" }],
  orders: [{ name: "Order name", category: "Nursing / Diet / Activity / Medication / Laboratory / Imaging / Respiratory / Consult / Precautions", status: "Active/Pending/Completed/Discontinued", frequency: "Frequency", start: "YYYY-MM-DD HH:mm", end: "optional", provider: "Provider", instructions: "Order instructions", rationale: "Why this order exists", linkedData: ["Related lab, note, MAR item, or condition"], nursingConsiderations: ["Nursing consideration"] }],
  intakeOutput: [{ time: "0700-1100", intake: 480, output: 300 }],
  medications: [{ name: "Medication", dose: "Dose", route: "Route", frequency: "Frequency" }],
  mar: { date: "Day Month DD, YYYY", timeSlots: ["0800", "0900", "1000"], medications: [{ name: "Medication", dose: "Dose", route: "Route", frequency: "Frequency", adminDose: "1 tablet", category: "scheduled/prn/continuous", orderStartIndex: 0, discontinuedIndex: 2, events: [{ slotIndex: 1, time: "0930", state: "given/due/discontinued", label: "0930 Given 10 mg" }], lastAdmin: "Today ...", dispenseLocation: "Pharmacy", completed: false }] },
  recentLabs: [{ category: "CBC", test: "WBC", result: "8.0 K/uL", flag: "", reference: "4.0-10.5", collected: "YYYY-MM-DD HH:mm" }],
  labResults: [{ category: "CBC", test: "WBC", result: "8.0", units: "K/uL", flag: "", reference: "4.0-10.5", collected: "YYYY-MM-DD HH:mm", specimen: "Blood", status: "Final", history: [{ collected: "YYYY-MM-DD HH:mm", result: "7.8", units: "K/uL", flag: "" }] }],
  chartReview: {
    progressNotes: [{ title: "Title", author: "Author", datetime: "YYYY-MM-DD HH:mm", category: "Progress Note", summary: "Brief summary", body: "Full note text" }],
    hp: [{ title: "H&P", author: "Author", datetime: "YYYY-MM-DD HH:mm", category: "H&P", summary: "Brief summary", body: "Full note text" }],
    erVisitSummary: [{ title: "ED Note", author: "Author", datetime: "YYYY-MM-DD HH:mm", category: "ER Visit Summary", summary: "Brief summary", body: "Full note text" }],
    therapyNotes: [{ title: "PT Note", author: "Author", datetime: "YYYY-MM-DD HH:mm", category: "PT/OT/SLP", summary: "Brief summary", body: "Full note text" }],
    caseManagement: [{ title: "Case Management Note", author: "Author", datetime: "YYYY-MM-DD HH:mm", category: "Case Management", summary: "Brief summary", body: "Full note text" }],
    imaging: [{ title: "Chest X-Ray", author: "Radiology", datetime: "YYYY-MM-DD HH:mm", category: "Imaging", summary: "Brief summary", study: "Study name", impression: "Impression text", body: "Full report text" }],
    cardiology: [{ title: "ECG", author: "Cardiology", datetime: "YYYY-MM-DD HH:mm", category: "Cardiology", summary: "Brief summary", study: "Study name", impression: "Impression text", body: "Full report text" }]
  }
};


const canonicalSchemaExample = {
  schemaVersion: "2.0",
  caseMeta: {
    caseId: "case_pneumonia_001",
    title: "Community-Acquired Pneumonia",
    studentLevel: "ADN second year",
    complexity: "moderate",
    learningObjectives: [
      "Recognize hypoxia and worsening respiratory status",
      "Interpret CBC/CMP trends",
      "Safely administer medications using linked monitoring"
    ]
  },
  patient: {
    id: "patient_001",
    mrn: "SIM-000001",
    name: "Jordan Miller",
    preferredName: "Jordan",
    dob: "1972-04-18",
    age: 54,
    sex: "Female",
    pronouns: "she/her",
    allergies: [
      { substance: "Penicillin", reaction: "Hives", severity: "High" }
    ]
  },
  encounter: {
    id: "encounter_001",
    location: "4 Medical",
    room: "412B",
    attending: "S. Patel, MD",
    admitDate: "2026-06-16 21:42",
    diagnosis: "Community-acquired pneumonia",
    chiefComplaint: "Shortness of breath and productive cough",
    codeStatus: "Full Code",
    isolation: "Droplet precautions",
    dietOrder: "Regular diabetic consistent carbohydrate",
    ambulationOrder: "Up with assistance",
    fallRisk: "Moderate",
    lastUpdated: "2026-06-17 08:30"
  },
  problems: [
    {
      id: "problem_pneumonia",
      name: "Community-acquired pneumonia",
      status: "Active",
      details: "Hypoxia and leukocytosis."
    }
  ],
  observations: [
    {
      id: "vital_bp_0800",
      type: "vital",
      code: "BP",
      label: "Blood Pressure",
      value: "118/72",
      units: "",
      collected: "2026-06-17 08:00"
    },
    {
      id: "vital_hr_0800",
      type: "vital",
      code: "HR",
      label: "Heart Rate",
      value: "68",
      units: "bpm",
      collected: "2026-06-17 08:00"
    },
    {
      id: "lab_inr_0510",
      type: "lab",
      category: "Coagulation",
      code: "INR",
      label: "INR",
      value: "2.4",
      units: "",
      flag: "",
      reference: "2.0-3.0",
      specimen: "Blood",
      status: "Final",
      collected: "2026-06-17 05:10"
    }
  ],
  orders: [
    {
      id: "order_warfarin",
      name: "warfarin (Coumadin) tablet",
      category: "Medication",
      status: "Active",
      frequency: "Daily at 1800",
      start: "2026-06-16 18:00",
      provider: "S. Patel, MD",
      instructions: "Administer per MAR.",
      rationale: "Therapeutic anticoagulation.",
      linkedData: ["problem_afib"],
      nursingConsiderations: ["Assess for bleeding."],
      medication: {
        medKey: "warfarin",
        drugClass: "Anticoagulant",
        dose: "5 mg",
        route: "Oral",
        importantInfo: "Review PT/INR and bleeding risk before administration.",
        monitoringRules: [
          { label: "PT", sourceType: "lab", code: "PT" },
          { label: "INR", sourceType: "lab", code: "INR" }
        ]
      },
      mar: {
        category: "scheduled",
        orderStartIndex: 0,
        completed: false,
        dispenseLocation: "Central Pharmacy"
      }
    }
  ],
  administrations: [
    {
      id: "admin_warfarin_1",
      orderId: "order_warfarin",
      slotIndex: 4,
      time: "1200",
      state: "due",
      label: "1200 Due",
      dose: "5 mg",
      route: "Oral"
    }
  ],
  devices: [
    {
      id: "device_piv_left_forearm",
      deviceType: "IV",
      type: "Peripheral IV",
      location: "Left forearm",
      siteMarker: "leftForearm",
      gauge: "20 gauge",
      infusing: "Saline lock",
      placementDate: "2026-06-16 21:58",
      lastAssessment: "Site clean, dry, intact",
      status: "Patent"
    }
  ],
  ioEvents: [
    { id: "io_0700_1100", time: "0700-1100", intake: 480, output: 300 }
  ],
  stickyNotes: [
    { title: "Discharge planning", body: "Anticipated discharge home when oxygen is weaned." }
  ],
  notes: [
    {
      id: "note_hospitalist_1",
      type: "progressNotes",
      title: "Hospitalist Progress Note",
      author: "S. Patel, MD",
      datetime: "2026-06-17 08:42",
      category: "Progress Note",
      summary: "Patient improving but remains on oxygen.",
      problemSections: [
        {
          problemId: "problem_pneumonia",
          problem: "Community-acquired pneumonia",
          evidence: [
            "WBC elevated",
            "Chest x-ray with left basilar infiltrate"
          ],
          treatments: [
            "Continue antibiotics",
            "Wean oxygen as tolerated"
          ]
        }
      ]
    }
  ],
  timeline: {
    marDate: "Friday June 17, 2026",
    marTimeSlots: ["0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500"],
    simulationStart: "2026-06-17 08:30",
    simulationEnd: "2026-06-17 15:30"
  },
  simulationTasks: []
};

function makeStableId(prefix, ...parts) {
  const raw = parts.filter(Boolean).join('_').toLowerCase();
  const cleaned = raw.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 80);
  return `${prefix}_${cleaned || 'item'}`;
}

function normalizeMedicationKey(name) {
  return safe(name, '').toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/\b(tablet|capsule|injection|syringe|solution|infusion|iv|po|subcutaneous|oral)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function medicationLeadWord(name) {
  // First real drug word, ignoring doses/units (e.g. "azithromycin 500 mg" -> "azithromycin").
  return normalizeMedicationKey(name).split(' ')
    .find(token => token && !/^(\d+|mg|g|mcg|ml|l|hr|meq|units?)$/.test(token)) || '';
}

function sameMedication(nameA, nameB) {
  const a = medicationLeadWord(nameA);
  const b = medicationLeadWord(nameB);
  return a.length > 2 && a === b;
}

function isCanonicalCase(data) {
  return !!(
    data &&
    String(data.schemaVersion || '').startsWith('2') &&
    Array.isArray(data.observations) &&
    Array.isArray(data.orders)
  );
}

function latestBy(items, predicate) {
  return items
    .filter(predicate)
    .sort((a, b) => safe(a.collected || a.datetime || '').localeCompare(safe(b.collected || b.datetime || '')))
    .pop() || null;
}

function inferMonitoringRule(label, legacyValue = '') {
  const l = safe(label, '').toLowerCase();

  if (l.includes('blood pressure') || l === 'bp') return { label, sourceType: 'vital', code: 'BP', legacyValue };
  if (l.includes('heart rate') || l.includes('apical pulse') || l === 'hr') return { label, sourceType: 'vital', code: 'HR', legacyValue };
  if (l.includes('oxygen') || l.includes('spo2')) return { label, sourceType: 'vital', code: 'SPO2', legacyValue };
  if (l.includes('respiratory rate') || l === 'rr') return { label, sourceType: 'vital', code: 'RR', legacyValue };
  if (l.includes('pain')) return { label, sourceType: 'vital', code: 'PAIN', legacyValue };

  const labMap = [
    ['inr', 'INR'],
    ['pt', 'PT'],
    ['potassium', 'Potassium'],
    ['creatinine', 'Creatinine'],
    ['glucose', 'Glucose'],
    ['digoxin', 'Digoxin'],
    ['wbc', 'WBC']
  ];

  const match = labMap.find(([needle]) => l.includes(needle));
  if (match) return { label, sourceType: 'lab', code: match[1], legacyValue };

  return { label, sourceType: 'manual', code: label, legacyValue };
}

function buildHospitalistBodyFromSections(note) {
  if (!Array.isArray(note.problemSections) || !note.problemSections.length) return safe(note.body, '');

  return note.problemSections.map(section => {
    const lines = [`**${safe(section.problem, 'Problem')}**`];
    (section.evidence || []).forEach(item => lines.push(`- ${safe(item)}`));
    (section.treatments || []).forEach(item => lines.push(`- ${safe(item)}`));
    return lines.join('\n');
  }).join('\n\n');
}

function legacyToCanonical(data) {
  const canonical = {
    schemaVersion: '2.0',
    caseMeta: {
      caseId: makeStableId('case', data.patient?.mrn || data.patient?.name || 'legacy'),
      title: safe(data.encounter?.diagnosis, 'Imported simulated patient'),
      studentLevel: '',
      complexity: '',
      learningObjectives: []
    },
    patient: structuredClone(data.patient || {}),
    encounter: structuredClone(data.encounter || {}),
    problems: structuredClone(data.problems || []),
    observations: [],
    orders: structuredClone(data.orders || []),
    administrations: [],
    devices: [],
    ioEvents: structuredClone(data.intakeOutput || []),
    stickyNotes: structuredClone(data.stickyNotes || []),
    notes: [],
    timeline: {
      marDate: safe(data.mar?.date, ''),
      marTimeSlots: structuredClone(
        data.mar?.timeSlots || ['0800','0900','1000','1100','1200','1300','1400','1500']
      )
    }
  };

  canonical.patient.id = canonical.patient.id || makeStableId('patient', canonical.patient.mrn || canonical.patient.name);
  canonical.encounter.id = canonical.encounter.id || makeStableId(
    'encounter',
    canonical.patient.mrn || canonical.patient.name,
    canonical.encounter.admitDate
  );

  canonical.problems = canonical.problems.map((problem, idx) => ({
    ...problem,
    id: problem.id || makeStableId('problem', problem.name || idx)
  }));

  const vitalMap = [
    ['TEMP', 'Temperature', data.vitals?.temp],
    ['HR', 'Heart Rate', data.vitals?.hr],
    ['BP', 'Blood Pressure', data.vitals?.bp],
    ['RR', 'Respiratory Rate', data.vitals?.rr],
    ['SPO2', 'SpO2', data.vitals?.spo2],
    ['PAIN', 'Pain', data.vitals?.pain]
  ];

  vitalMap.forEach(([code, label, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      canonical.observations.push({
        id: makeStableId('obs', code, data.vitals?.time || 'latest'),
        type: 'vital',
        code,
        label,
        value: safe(value),
        units: '',
        collected: safe(data.vitals?.time, data.encounter?.lastUpdated || '')
      });
    }
  });


  const assessmentTime = safe(data.vitals?.time, data.encounter?.lastUpdated || data.encounter?.admitDate || '');
  const addAssessment = (section, code, label, value, source = 'Imported / derived nursing assessment') => {
    if (value === undefined || value === null || value === '') return;
    canonical.observations.push({
      id: makeStableId('assessment', section, code, assessmentTime),
      type: 'assessment', section, code, label, value: safe(value), units: '', collected: assessmentTime, source
    });
  };

  addAssessment('Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', data.tubes?.find(item => /nasal cannula|oxygen/i.test(safe(item.type)))?.status || '');
  addAssessment('Respiratory', 'COUGH', 'Cough', /productive cough/i.test(safe(data.encounter?.chiefComplaint)) ? 'Productive' : '');
  addAssessment('Musculoskeletal / Mobility', 'AMBULATION', 'Ambulation', data.encounter?.ambulationOrder || '');
  addAssessment('Safety', 'FALL_RISK', 'Fall Risk', data.encounter?.fallRisk || '');
  addAssessment('Pain', 'PAIN_SCORE', 'Pain Score', data.vitals?.pain || '');
  addAssessment('GI', 'DIET', 'Diet', data.encounter?.dietOrder || '');
  addAssessment('Safety', 'ISOLATION', 'Isolation', data.encounter?.isolation || '');

  const foley = (data.tubes || []).find(item => /foley|urinary/i.test(`${safe(item.type)} ${safe(item.location)}`));
  if (foley) {
    addAssessment('GU', 'URINARY_DEVICE', 'Urinary Device', safe(foley.type));
    addAssessment('GU', 'URINE_DESCRIPTION', 'Urine / Drainage', safe(foley.drainage, ''));
  }

  const labSeen = new Set();
  (data.labResults || data.recentLabs || []).forEach((lab, idx) => {
    const addLab = (entry, collectedOverride = null) => {
      const collected = safe(collectedOverride || entry.collected, '');
      const result = safe(entry.result, '');
      const key = `${safe(entry.category)}|${safe(entry.test)}|${collected}|${result}`;
      if (labSeen.has(key)) return;
      labSeen.add(key);

      canonical.observations.push({
        id: makeStableId('lab', entry.category, entry.test, collected, idx),
        type: 'lab',
        category: safe(entry.category, 'Other'),
        code: safe(entry.test),
        label: safe(entry.test),
        value: result,
        units: safe(entry.units, ''),
        flag: safe(entry.flag, ''),
        reference: safe(entry.reference, ''),
        specimen: safe(entry.specimen, 'Blood'),
        status: safe(entry.status, 'Final'),
        collected
      });
    };

    (lab.history || []).forEach(h => addLab({ ...lab, ...h }, h.collected));
    addLab(lab);
  });

  [
    ['IV', data.ivs || []],
    ['Drain', data.drains || []],
    ['Tube', data.tubes || []]
  ].forEach(([deviceType, items]) => {
    items.forEach((device, idx) => {
      canonical.devices.push({
        ...structuredClone(device),
        id: device.id || makeStableId('device', deviceType, device.type, device.location, idx),
        deviceType
      });
    });
  });

  [
    ['progressNotes', data.chartReview?.progressNotes || []],
    ['hp', data.chartReview?.hp || []],
    ['erVisitSummary', data.chartReview?.erVisitSummary || []],
    ['therapyNotes', data.chartReview?.therapyNotes || []],
    ['caseManagement', data.chartReview?.caseManagement || []],
    ['imaging', data.chartReview?.imaging || []],
    ['cardiology', data.chartReview?.cardiology || []]
  ].forEach(([type, items]) => {
    items.forEach((note, idx) => {
      canonical.notes.push({
        ...structuredClone(note),
        id: note.id || makeStableId('note', type, note.datetime, idx),
        type
      });
    });
  });

  canonical.orders = canonical.orders.map((order, idx) => ({
    ...order,
    id: order.id || makeStableId('order', order.category, order.name, idx)
  }));

  (data.medications || []).forEach((med, idx) => {
    const medKey = normalizeMedicationKey(med.name);

    const existing = canonical.orders.find(order =>
      safe(order.category).toLowerCase() === 'medication' &&
      sameMedication(order.name, med.name)
    );

    if (existing && !existing.medication) {
      // The order exists but carries no dose/route: fill it in from the medication list.
      existing.medication = {
        medKey,
        drugClass: '',
        dose: safe(med.dose, ''),
        route: safe(med.route, ''),
        importantInfo: '',
        monitoringRules: []
      };
    }

    if (!existing) {
      canonical.orders.push({
        id: makeStableId('order', 'medication', med.name, idx),
        name: safe(med.name),
        category: 'Medication',
        status: 'Active',
        frequency: safe(med.frequency),
        start: safe(data.encounter?.admitDate, ''),
        provider: safe(data.encounter?.attending, ''),
        instructions: 'Imported from current medication list.',
        rationale: '',
        linkedData: [],
        nursingConsiderations: [],
        medication: {
          medKey,
          drugClass: '',
          dose: safe(med.dose),
          route: safe(med.route),
          importantInfo: '',
          monitoringRules: []
        }
      });
    }
  });

  (data.mar?.medications || []).forEach((med, medIdx) => {
    const medKey = normalizeMedicationKey(med.name);

    let order = canonical.orders.find(candidate =>
      safe(candidate.category).toLowerCase() === 'medication' &&
      sameMedication(candidate.name, med.name)
    );

    if (!order) {
      order = {
        id: makeStableId('order', 'mar', med.name, medIdx),
        name: safe(med.name),
        category: 'Medication',
        status: med.completed
          ? 'Completed'
          : Number.isFinite(med.discontinuedIndex)
            ? 'Discontinued'
            : 'Active',
        frequency: safe(med.frequency),
        start: safe(data.encounter?.admitDate, ''),
        provider: safe(data.encounter?.attending, ''),
        instructions: '',
        rationale: '',
        linkedData: [],
        nursingConsiderations: []
      };
      canonical.orders.push(order);
    }

    order.medication = {
      ...(order.medication || {}),
      medKey,
      drugClass: safe(med.detail?.drugClass, order.medication?.drugClass || ''),
      dose: safe(med.dose, order.medication?.dose || ''),
      route: safe(med.route, order.medication?.route || ''),
      importantInfo: safe(med.detail?.importantInfo, order.medication?.importantInfo || ''),
      monitoringRules: (med.detail?.keyMonitoring || []).map(item =>
        inferMonitoringRule(item.label, item.value)
      )
    };

    order.mar = {
      category: safe(med.category, 'scheduled'),
      orderStartIndex: Number.isFinite(med.orderStartIndex) ? med.orderStartIndex : 0,
      discontinuedIndex: Number.isFinite(med.discontinuedIndex) ? med.discontinuedIndex : undefined,
      completed: !!med.completed,
      adminDose: safe(med.adminDose, med.dose),
      concentration: safe(med.concentration, ''),
      lastAdmin: safe(med.lastAdmin, ''),
      dispenseLocation: safe(med.dispenseLocation, '')
    };

    (med.events || []).forEach((event, eventIdx) => {
      canonical.administrations.push({
        id: makeStableId('admin', order.id, event.slotIndex, event.time, eventIdx),
        orderId: order.id,
        slotIndex: Number(event.slotIndex),
        time: safe(event.time),
        state: safe(event.state),
        label: safe(event.label),
        dose: safe(med.dose),
        route: safe(med.route)
      });
    });
  });


  // Staged demonstration data for the built-in sample case.
  if (safe(canonical.patient?.mrn) === 'SIM-000184') {
    canonical.timeline.marDate = 'Wednesday June 17, 2026';
    canonical.timeline.simulationStart = '2026-06-17 08:30';
    canonical.timeline.simulationEnd = '2026-06-17 15:30';

    if (!(canonical.observations || []).some(obs => obs.id === 'lab_potassium_future_1000')) {
      canonical.observations.push({
        id: 'lab_potassium_future_1000',
        type: 'lab',
        category: 'CMP',
        code: 'Potassium',
        label: 'Potassium',
        value: '3.0',
        units: 'mmol/L',
        flag: 'Low',
        reference: '3.5-5.1',
        specimen: 'Blood',
        status: 'Final',
        collected: '2026-06-17 10:00'
      });
    }

    if (!(canonical.observations || []).some(obs => obs.id === 'assessment_resp_future_0930')) {
      canonical.observations.push({
        id: 'assessment_resp_future_0930',
        type: 'assessment',
        section: 'Respiratory',
        code: 'BREATH_SOUNDS',
        label: 'Breath Sounds',
        value: 'Crackles left lower lobe',
        collected: '2026-06-17 09:30',
        source: 'Nursing reassessment'
      });
    }

    if (!(canonical.orders || []).some(order => order.id === 'order_kcl_future_1015')) {
      canonical.orders.push({
        id: 'order_kcl_future_1015',
        name: 'potassium chloride (K-Dur) tablet',
        category: 'Medication',
        status: 'Active',
        frequency: 'Once',
        start: '2026-06-17 10:15',
        provider: 'S. Patel, MD',
        instructions: 'Give potassium chloride 40 mEq PO once. Repeat potassium after replacement.',
        rationale: 'Replace hypokalemia.',
        linkedData: ['lab_potassium_future_1000'],
        nursingConsiderations: ['Verify patient can take PO medication.', 'Review repeat potassium result when available.'],
        medication: {
          medKey: 'potassium chloride',
          drugClass: 'Electrolyte replacement',
          dose: '40 mEq',
          route: 'Oral',
          importantInfo: 'Review potassium and renal function before replacement.',
          monitoringRules: [
            { label: 'Potassium', sourceType: 'lab', code: 'Potassium' },
            { label: 'Creatinine', sourceType: 'lab', code: 'Creatinine' }
          ]
        },
        mar: {
          category: 'scheduled',
          orderStartIndex: 2,
          adminDose: '40 mEq',
          dispenseLocation: 'Central Pharmacy'
        }
      });
      canonical.administrations.push({
        id: 'admin_kcl_future_1100',
        orderId: 'order_kcl_future_1015',
        slotIndex: 3,
        time: '1100',
        state: 'due',
        label: '1100 Due',
        dose: '40 mEq',
        route: 'Oral'
      });
    }

    if (!(canonical.orders || []).some(order => order.id === 'order_repeat_k_future_1100')) {
      canonical.orders.push({
        id: 'order_repeat_k_future_1100',
        name: 'Repeat potassium level',
        category: 'Laboratory',
        status: 'Pending',
        frequency: 'Once',
        start: '2026-06-17 11:00',
        provider: 'S. Patel, MD',
        instructions: 'Collect potassium after replacement.',
        rationale: 'Confirm response to potassium replacement.',
        linkedData: ['lab_potassium_future_1000'],
        nursingConsiderations: ['Review result when available.']
      });
    }
  }

  return canonical;
}

function resolveMonitoringRule(rule, canonical) {
  if (!rule) return null;

  if (rule.sourceType === 'vital') {
    const obs = latestBy(
      canonical.observations || [],
      item =>
        item.type === 'vital' &&
        safe(item.code).toUpperCase() === safe(rule.code).toUpperCase()
    );

    if (!obs) return null;

    return {
      label: rule.label,
      value: `${safe(obs.value)}${obs.units ? ' ' + obs.units : ''}`.trim(),
      note: `Latest vital: ${safe(obs.collected)}`,
      flagged: true,
      sourceId: obs.id
    };
  }

  if (rule.sourceType === 'lab') {
    const obs = latestBy(
      canonical.observations || [],
      item =>
        item.type === 'lab' &&
        (
          safe(item.code).toLowerCase() === safe(rule.code).toLowerCase() ||
          safe(item.label).toLowerCase() === safe(rule.code).toLowerCase()
        )
    );

    if (!obs) return null;

    return {
      label: rule.label,
      value: `${safe(obs.value)}${obs.units ? ' ' + obs.units : ''}`.trim(),
      note: `Latest lab: ${safe(obs.collected)}`,
      flagged: true,
      sourceId: obs.id,
      flag: safe(obs.flag, '')
    };
  }

  if (rule.legacyValue) {
    return {
      label: rule.label,
      value: rule.legacyValue,
      note: 'Imported manual monitoring value',
      flagged: true
    };
  }

  return null;
}

function canonicalToViewModel(canonical) {
  const view = {
    patient: structuredClone(canonical.patient || {}),
    encounter: structuredClone(canonical.encounter || {}),
    stickyNotes: structuredClone(canonical.stickyNotes || []),
    problems: structuredClone(canonical.problems || []),
    ivs: [],
    drains: [],
    tubes: [],
    nursingOrders: [],
    medications: [],
    intakeOutput: structuredClone(canonical.ioEvents || []),
    recentLabs: [],
    labResults: [],
    chartReview: {
      progressNotes: [],
      hp: [],
      erVisitSummary: [],
      therapyNotes: [],
      caseManagement: [],
      imaging: [],
      cardiology: []
    },
    orders: structuredClone(canonical.orders || []),
    mar: {
      date: safe(canonical.timeline?.marDate, ''),
      timeSlots: structuredClone(
        canonical.timeline?.marTimeSlots ||
        ['0800','0900','1000','1100','1200','1300','1400','1500']
      ),
      medications: []
    }
  };

  (canonical.devices || []).forEach(device => {
    const copy = structuredClone(device);
    delete copy.deviceType;

    if (device.deviceType === 'IV') view.ivs.push(copy);
    else if (device.deviceType === 'Drain') view.drains.push(copy);
    else view.tubes.push(copy);
  });

  const vitalCodes = {
    TEMP: 'temp',
    HR: 'hr',
    BP: 'bp',
    RR: 'rr',
    SPO2: 'spo2',
    PAIN: 'pain'
  };

  const latestVitals = {};
  Object.entries(vitalCodes).forEach(([code, key]) => {
    const obs = latestBy(
      canonical.observations || [],
      item =>
        item.type === 'vital' &&
        safe(item.code).toUpperCase() === code
    );

    if (obs) {
      latestVitals[key] = `${safe(obs.value)}${obs.units ? ' ' + obs.units : ''}`.trim();
    }
  });

  latestVitals.time = (canonical.observations || [])
    .filter(item => item.type === 'vital')
    .map(item => safe(item.collected, ''))
    .sort()
    .pop() || '';

  view.vitals = latestVitals;

  const labObs = (canonical.observations || []).filter(item => item.type === 'lab');
  const grouped = {};

  labObs.forEach(obs => {
    const key = `${safe(obs.category)}|${safe(obs.label || obs.code)}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(obs);
  });

  Object.values(grouped).forEach(series => {
    series.sort((a, b) => safe(a.collected).localeCompare(safe(b.collected)));

    series.forEach(obs => {
      view.labResults.push({
        id: obs.id,
        category: safe(obs.category, 'Other'),
        test: safe(obs.label || obs.code),
        result: safe(obs.value),
        units: safe(obs.units, ''),
        flag: safe(obs.flag, ''),
        reference: safe(obs.reference, ''),
        collected: safe(obs.collected, ''),
        specimen: safe(obs.specimen, ''),
        status: safe(obs.status, 'Final'),
        history: series.map(item => ({
          collected: safe(item.collected),
          result: safe(item.value),
          units: safe(item.units, ''),
          flag: safe(item.flag, '')
        }))
      });
    });
  });

  const latestLabs = Object.values(grouped)
    .map(series => series.slice().sort((a, b) => safe(a.collected).localeCompare(safe(b.collected))).pop())
    .filter(Boolean)
    .sort((a, b) => {
      const score = item => safe(item.flag, '') ? 1 : 0;
      return score(b) - score(a) || safe(b.collected).localeCompare(safe(a.collected));
    })
    .slice(0, 8);

  view.recentLabs = latestLabs.map(obs => ({
    category: safe(obs.category),
    test: safe(obs.label || obs.code),
    result: `${safe(obs.value)}${obs.units ? ' ' + obs.units : ''}`.trim(),
    flag: safe(obs.flag, ''),
    reference: safe(obs.reference, ''),
    collected: safe(obs.collected, '')
  }));

  (canonical.notes || []).forEach(note => {
    if (!view.chartReview[note.type]) return;

    const copy = structuredClone(note);
    copy.body = buildHospitalistBodyFromSections(note);
    view.chartReview[note.type].push(copy);
  });

  view.nursingOrders = (canonical.orders || [])
    .filter(order =>
      ['nursing', 'respiratory', 'activity', 'lab / bedside testing', 'precautions']
        .includes(safe(order.category).toLowerCase())
    )
    .filter(order => !safe(order.status).toLowerCase().includes('discontinued'))
    .slice(0, 10)
    .map(order => ({
      order: safe(order.name),
      frequency: safe(order.frequency),
      status: safe(order.status, 'Active')
    }));

  const medicationOrders = (canonical.orders || []).filter(
    order => safe(order.category).toLowerCase() === 'medication'
  );

  view.medications = medicationOrders
    .filter(order =>
      !safe(order.status).toLowerCase().includes('discontinued') &&
      !safe(order.status).toLowerCase().includes('completed')
    )
    .map(order => ({
      name: safe(order.name),
      dose: safe(order.medication?.dose, ''),
      route: safe(order.medication?.route, ''),
      frequency: safe(order.frequency)
    }));

  medicationOrders.forEach(order => {
    const administrations = (canonical.administrations || [])
      .filter(admin => admin.orderId === order.id)
      .sort((a, b) => safe(a.administeredAt || a.time).localeCompare(safe(b.administeredAt || b.time)));

    const monitoring = (order.medication?.monitoringRules || [])
      .map(rule => resolveMonitoringRule(rule, canonical))
      .filter(Boolean);

    const lastThreeDoses = administrations
      .filter(admin => safe(admin.state).toLowerCase() === 'given')
      .slice(-3)
      .reverse()
      .map(admin => ({
        time: safe(admin.administeredTime || admin.time),
        dose: `${safe(admin.dose, order.medication?.dose)} ${safe(admin.route, order.medication?.route)}`.trim(),
        status: 'Given'
      }));

    view.mar.medications.push({
      name: safe(order.name),
      dose: safe(order.medication?.dose, ''),
      route: safe(order.medication?.route, ''),
      frequency: safe(order.frequency),
      adminDose: safe(order.mar?.adminDose, order.medication?.dose || ''),
      concentration: safe(order.mar?.concentration, ''),
      category: safe(order.mar?.category, 'scheduled'),
      orderStartIndex: Number.isFinite(order.mar?.orderStartIndex)
        ? order.mar.orderStartIndex
        : 0,
      discontinuedIndex: Number.isFinite(order.mar?.discontinuedIndex)
        ? order.mar.discontinuedIndex
        : undefined,
      completed:
        !!order.mar?.completed ||
        safe(order.status).toLowerCase().includes('completed'),
      events: administrations.map(admin => ({
        slotIndex: Number(admin.slotIndex),
        time: safe(admin.time),
        state: safe(admin.state),
        label: safe(admin.label)
      })),
      lastAdmin: safe(order.mar?.lastAdmin, lastThreeDoses[0]?.time || ''),
      dispenseLocation: safe(order.mar?.dispenseLocation, ''),
      detail: {
        drugClass: safe(order.medication?.drugClass, ''),
        importantInfo: safe(order.medication?.importantInfo, ''),
        keyMonitoring: monitoring,
        lastThreeDoses
      },
      orderId: order.id
    });
  });

  view.__canonical = canonical;
  return view;
}

function normalizeCaseData(data) {
  // A file saved from the patient library wraps the case; unwrap it.
  if (data && data.format === 'nursingsim-case' && data.canonical) data = data.canonical;
  const canonical = isCanonicalCase(data)
    ? structuredClone(data)
    : legacyToCanonical(data);

  return {
    canonical,
    view: canonicalToViewModel(canonical)
  };
}

function collectAllIds(canonical) {
  return [
    canonical.problems || [],
    canonical.observations || [],
    canonical.orders || [],
    canonical.administrations || [],
    canonical.devices || [],
    canonical.notes || []
  ].flatMap(items => items.map(item => item.id).filter(Boolean));
}

function validateCanonicalCase(canonical) {
  const results = [];
  const add = (severity, message) => results.push({ severity, message });

  if (!canonical.patient?.name) add('error', 'Patient name is missing.');
  else add('pass', `Patient identified as ${canonical.patient.name}.`);

  if (!canonical.encounter?.diagnosis) add('warning', 'Primary encounter diagnosis is missing.');
  if (!canonical.encounter?.admitDate) add('warning', 'Encounter admit date/time is missing.');

  const ids = collectAllIds(canonical);
  const duplicateIds = ids.filter((id, idx) => ids.indexOf(id) !== idx);

  if (duplicateIds.length) {
    add('error', `Duplicate object IDs found: ${Array.from(new Set(duplicateIds)).join(', ')}`);
  } else {
    add('pass', `${ids.length} clinical object IDs are unique.`);
  }

  const orderIds = new Set((canonical.orders || []).map(order => order.id));
  const danglingAdmins = (canonical.administrations || [])
    .filter(admin => !orderIds.has(admin.orderId));

  if (danglingAdmins.length) {
    add('error', `${danglingAdmins.length} MAR administration(s) reference an orderId that does not exist.`);
  } else {
    add('pass', 'All MAR administrations link to valid medication orders.');
  }

  const supportedMarkers = new Set([
    'leftForearm','rightForearm','leftAC','rightAC','leftUpperArm','rightUpperArm',
    'chestLeft','chestRight','abdomenLUQ','abdomenRUQ','abdomenLLQ','abdomenRLQ',
    'nares','mouth','ngTube','trach','pelvis'
  ]);

  const invalidDevices = (canonical.devices || [])
    .filter(device => device.siteMarker && !supportedMarkers.has(device.siteMarker));

  if (invalidDevices.length) {
    add('warning', `${invalidDevices.length} device(s) use an unsupported avatar siteMarker.`);
  }

  const medicationOrders = (canonical.orders || [])
    .filter(order => safe(order.category).toLowerCase() === 'medication');

  let missingMonitoring = 0;
  let legacyMismatches = 0;

  medicationOrders.forEach(order => {
    (order.medication?.monitoringRules || []).forEach(rule => {
      const resolved = resolveMonitoringRule(rule, canonical);
      if (!resolved) missingMonitoring++;
      if (
        resolved &&
        rule.legacyValue &&
        safe(rule.legacyValue) !== safe(resolved.value)
      ) {
        legacyMismatches++;
      }
    });
  });

  if (missingMonitoring) {
    add('warning', `${missingMonitoring} medication monitoring rule(s) could not find a linked vital or lab result.`);
  } else if (
    medicationOrders.some(order => (order.medication?.monitoringRules || []).length)
  ) {
    add('pass', 'Medication monitoring rules successfully resolve from chart observations.');
  }

  if (legacyMismatches) {
    add(
      'warning',
      `${legacyMismatches} imported medication monitoring value(s) disagree with current linked chart data. The linked chart value will be displayed.`
    );
  }


  const malformedAssessments = (canonical.observations || []).filter(
    obs => obs.type === 'assessment' && (!obs.section || !(obs.label || obs.code) || !obs.collected)
  );
  if (malformedAssessments.length) {
    add('warning', `${malformedAssessments.length} flowsheet assessment observation(s) are missing section, field label/code, or documentation time.`);
  } else if ((canonical.observations || []).some(obs => obs.type === 'assessment')) {
    add('pass', 'Flowsheet assessment observations contain section, field, and documentation time.');
  }

  const activeProblems = (canonical.problems || [])
    .filter(problem => safe(problem.status).toLowerCase() === 'active');

  const hospitalistNotes = (canonical.notes || [])
    .filter(note =>
      (note.type === 'progressNotes' || note.type === 'hp') &&
      /hospitalist|physician|md|np|pa|surgery/i.test(`${safe(note.title)} ${safe(note.author)}`)
    );

  let uncoveredProblems = 0;

  activeProblems.forEach(problem => {
    const covered = hospitalistNotes.some(note => {
      if (
        (note.problemSections || []).some(
          section =>
            section.problemId === problem.id ||
            safe(section.problem).toLowerCase() === safe(problem.name).toLowerCase()
        )
      ) {
        return true;
      }

      return safe(note.body, '')
        .toLowerCase()
        .includes(safe(problem.name).toLowerCase());
    });

    if (!covered) {
      uncoveredProblems++;
      add(
        'warning',
        `Active problem "${problem.name}" is not clearly addressed in a hospitalist progress note.`
      );
    }
  });

  if (activeProblems.length && !uncoveredProblems) {
    add('pass', 'All active problems are addressed in hospitalist progress documentation.');
  }

  // Only orders that are in effect at the start of the simulation count as possible duplicates
  // (an IV drug that hands over to its oral form later in the stay is not a duplicate).
  const simStart = parseSimDate(safe(canonical.timeline?.simulationStart, ''));
  const inEffectNow = order => {
    if (!simStart) return true;
    const start = parseSimDate(safe(order.start, ''));
    const end = parseSimDate(safe(order.end, ''));
    return (!start || start <= simStart) && (!end || end > simStart);
  };

  const activeMedicationNames = medicationOrders
    .filter(order => !/discontinued|completed/i.test(safe(order.status)))
    .filter(inEffectNow)
    // same drug, route AND dose: split-dose regimens (such as hydrocortisone 20 mg AM / 10 mg PM) are not duplicates
    .map(order => `${normalizeMedicationKey(order.name)}${order.medication ? '|' + safe(order.medication.route) + '|' + safe(order.medication.dose) : ''}`);

  const duplicateMedicationKeys = activeMedicationNames
    .filter((key, idx) => key && activeMedicationNames.indexOf(key) !== idx)
    .map(key => key.split('|')[0]);

  if (duplicateMedicationKeys.length) {
    add(
      'warning',
      `Potential duplicate active medication orders detected: ${Array.from(new Set(duplicateMedicationKeys)).join(', ')}`
    );
  }

  const errors = results.filter(item => item.severity === 'error').length;
  const warnings = results.filter(item => item.severity === 'warning').length;
  const passes = results.filter(item => item.severity === 'pass').length;

  return { results, errors, warnings, passes };
}

function validateCaseInput(data) {
  try {
    const normalized = normalizeCaseData(data);
    return {
      ...validateCanonicalCase(normalized.canonical),
      canonical: normalized.canonical,
      view: normalized.view
    };
  } catch (error) {
    return {
      results: [{ severity: 'error', message: error.message }],
      errors: 1,
      warnings: 0,
      passes: 0,
      canonical: null,
      view: null
    };
  }
}

function renderValidationReport(report) {
  if (!elements.validationResults || !elements.validationSummary) return;

  clearChildren(elements.validationResults);

  elements.validationSummary.textContent =
    `${report.errors} error(s), ${report.warnings} warning(s), ${report.passes} pass check(s)`;

  if (!report.results.length) {
    elements.validationResults.innerHTML =
      '<div class="validation-empty">No validation results.</div>';
    return;
  }

  report.results.forEach(item => {
    const row = document.createElement('div');
    row.className = `validation-item validation-${item.severity}`;
    row.innerHTML = `
      <div class="validation-level">${escapeHtml(item.severity)}</div>
      <div>${escapeHtml(item.message)}</div>
    `;
    elements.validationResults.appendChild(row);
  });
}


function parseSimDate(value) {
  const text = safe(value, '');
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(text)) return null;
  const date = new Date(text.replace(' ', 'T') + ':00');
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatSimDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const pad = value => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function addSimMinutes(value, minutes) {
  const date = parseSimDate(value);
  if (!date) return value;
  date.setMinutes(date.getMinutes() + minutes);
  return formatSimDate(date);
}

function simMinutesBetween(a, b) {
  const ad = parseSimDate(a);
  const bd = parseSimDate(b);
  if (!ad || !bd) return 0;
  return Math.round((bd - ad) / 60000);
}

function objectAvailabilityTime(item, fallback = '') {
  return safe(
    item?.availableAt ||
    item?.releasedAt ||
    item?.orderedAt ||
    item?.collected ||
    item?.datetime ||
    item?.placementDate ||
    fallback,
    ''
  );
}

function availableAtSimulationTime(item, fallback = '') {
  if (!simulationTime) return true;
  const stamp = objectAvailabilityTime(item, fallback);
  const stampDate = parseSimDate(stamp);
  const simDate = parseSimDate(simulationTime);
  if (!stampDate || !simDate) return true;
  return stampDate <= simDate;
}

function getVisibleCanonicalCase(canonical) {
  const visible = structuredClone(canonical || {});
  visible.observations = (canonical.observations || []).filter(item => availableAtSimulationTime(item));
  visible.notes = (canonical.notes || []).filter(item => availableAtSimulationTime(item));
  visible.orders = (canonical.orders || []).filter(item => availableAtSimulationTime(item, canonical.encounter?.admitDate));
  visible.devices = (canonical.devices || []).filter(item => availableAtSimulationTime(item));
  visible.ioEvents = (canonical.ioEvents || []).filter(item => {
    const stamp = safe(item.availableAt || item.collected, '');
    return stamp ? availableAtSimulationTime({ availableAt: stamp }) : true;
  });

  const visibleOrderIds = new Set(visible.orders.map(order => order.id));
  visible.administrations = (canonical.administrations || []).filter(admin => visibleOrderIds.has(admin.orderId));

  return visible;
}

function getSimulationReleaseObjects(canonical) {
  const objects = [];

  (canonical.notes || []).forEach(item => objects.push({
    id: item.id,
    category: 'chartReview',
    time: objectAvailabilityTime(item)
  }));

  (canonical.observations || []).forEach(item => {
    if (item.type === 'lab') {
      objects.push({ id: item.id, category: 'labResults', time: objectAvailabilityTime(item) });
    }
    if (item.type === 'assessment' || item.type === 'vital') {
      objects.push({ id: item.id, category: 'flowsheets', time: objectAvailabilityTime(item) });
    }
  });

  (canonical.orders || []).forEach(item => objects.push({
    id: item.id,
    category: 'orders',
    time: objectAvailabilityTime(item, canonical.encounter?.admitDate)
  }));

  return objects.filter(item => parseSimDate(item.time));
}

function registerSimulationReleases(oldTime, newTime) {
  if (!currentCanonicalCase || !oldTime || !newTime) return;
  const oldDate = parseSimDate(oldTime);
  const newDate = parseSimDate(newTime);
  if (!oldDate || !newDate || newDate <= oldDate) return;

  getSimulationReleaseObjects(currentCanonicalCase).forEach(item => {
    const time = parseSimDate(item.time);
    if (time && time > oldDate && time <= newDate) {
      simulationUnacknowledged[item.category]?.add(item.id);
    }
  });
}

function initializeSimulationState(canonical) {
  simulationTime = safe(
    canonical.timeline?.simulationStart ||
    canonical.timeline?.currentTime ||
    canonical.encounter?.lastUpdated ||
    canonical.encounter?.admitDate,
    ''
  );

  simulationStartTime = simulationTime;
  simulationEndTime = safe(canonical.timeline?.simulationEnd, '');

  simulationUnacknowledged = {
    chartReview: new Set(),
    labResults: new Set(),
    orders: new Set(),
    flowsheets: new Set()
  };
  completedBrainTaskIds = new Set();

  if (!Array.isArray(canonical.simulationTasks)) canonical.simulationTasks = [];
  renderSimulationClock();
}

function renderSimulationClock() {
  if (!elements.simulationClockDisplay) return;
  elements.simulationClockDisplay.textContent = simulationTime ? epicDate(simulationTime) : 'No simulation time';
}

function refreshSimulationView(preserveSection = true) {
  if (!currentCanonicalCase) return;

  const visibleCanonical = getVisibleCanonicalCase(currentCanonicalCase);
  const view = canonicalToViewModel(visibleCanonical);
  view.__canonical = visibleCanonical;
  currentPatientData = view;

  renderViewData(view);
  renderSimulationClock();
  renderBrainPage();
  updateNavigationBadges();

  if (preserveSection) {
    showCurrentSectionOnly();
  }

  persistCase();
}

const SAVED_CASE_KEY = 'nursingsim.case.v1';

function persistCase() {
  // Autosave so a refresh (or iPad Safari reloading the tab) does not lose the patient.
  try {
    localStorage.setItem(SAVED_CASE_KEY, JSON.stringify({ canonical: currentCanonicalCase, simulationTime }));
  } catch (error) { /* storage full or blocked (private browsing): carry on without saving */ }
}

function loadSavedCase() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_CASE_KEY) || 'null');
    if (saved && saved.canonical && saved.canonical.patient) return saved;
  } catch (error) { /* ignore a corrupt save */ }
  return null;
}

function advanceSimulation(minutes) {
  if (!simulationTime) return;
  const oldTime = simulationTime;
  let next = addSimMinutes(simulationTime, minutes);

  if (simulationEndTime) {
    const nextDate = parseSimDate(next);
    const endDate = parseSimDate(simulationEndTime);
    if (nextDate && endDate && nextDate > endDate) next = simulationEndTime;
  }

  simulationTime = next;
  registerSimulationReleases(oldTime, simulationTime);
  refreshSimulationView();
}

function getNextSimulationEventTime() {
  if (!currentCanonicalCase || !simulationTime) return null;
  const current = parseSimDate(simulationTime);
  if (!current) return null;

  const candidates = getSimulationReleaseObjects(currentCanonicalCase)
    .map(item => item.time)
    .filter(time => {
      const date = parseSimDate(time);
      return date && date > current;
    });

  getBrainTasks(true).forEach(task => {
    if (task.dueAt && parseSimDate(task.dueAt) > current) candidates.push(task.dueAt);
  });

  candidates.sort((a, b) => parseSimDate(a) - parseSimDate(b));
  return candidates[0] || null;
}

function advanceToNextSimulationEvent() {
  const next = getNextSimulationEventTime();
  if (!next) return;
  const old = simulationTime;
  simulationTime = next;
  registerSimulationReleases(old, simulationTime);
  refreshSimulationView();
}

function resetSimulation() {
  if (!currentCanonicalCase || !simulationStartTime) return;
  simulationTime = simulationStartTime;
  simulationUnacknowledged = {
    chartReview: new Set(),
    labResults: new Set(),
    orders: new Set(),
    flowsheets: new Set()
  };
  completedBrainTaskIds.clear();

  // Reset student-entered administrations and observations, but preserve imported chart data.
  currentCanonicalCase.administrations = (currentCanonicalCase.administrations || [])
    .filter(admin => !admin.studentEntered);

  (currentCanonicalCase.administrations || []).forEach(admin => {
    if (admin.studentModified) {
      admin.state = admin.originalState;
      admin.label = admin.originalLabel;
      delete admin.originalState;
      delete admin.originalLabel;
      delete admin.studentModified;
      delete admin.administeredAt;
      delete admin.comment;
    }
  });

  currentCanonicalCase.observations = (currentCanonicalCase.observations || [])
    .filter(obs => !obs.studentEntered);
  currentCanonicalCase.simulationTasks = (currentCanonicalCase.simulationTasks || [])
    .filter(task => !task.studentEntered);

  refreshSimulationView();
}

function combineSimDateAndClock(clockText) {
  if (!simulationTime || !clockText) return '';
  const datePart = simulationTime.slice(0, 10);
  const raw = String(clockText).replace(':', '').padStart(4, '0');
  return `${datePart} ${raw.slice(0,2)}:${raw.slice(2,4)}`;
}

function taskTimeStatus(dueAt) {
  if (!dueAt || !simulationTime) return 'upcoming';
  const minutes = simMinutesBetween(simulationTime, dueAt);
  if (minutes < 0) return 'overdue';
  if (minutes <= 60) return 'due';
  return 'upcoming';
}

function nextClockOccurrence(hours) {
  if (!simulationTime) return '';
  const now = parseSimDate(simulationTime);
  if (!now) return '';

  const candidates = hours.map(hour => {
    const d = new Date(now);
    d.setHours(hour, 0, 0, 0);
    if (d < now) d.setDate(d.getDate() + 1);
    return d;
  }).sort((a, b) => a - b);

  return formatSimDate(candidates[0]);
}

function getBrainTasks(includeCompleted = false) {
  if (!currentCanonicalCase) return [];
  const visible = getVisibleCanonicalCase(currentCanonicalCase);
  const tasks = [];

  // Medication tasks from due MAR administrations.
  const orderMap = new Map((visible.orders || []).map(order => [order.id, order]));
  (visible.administrations || []).forEach(admin => {
    const state = safe(admin.state).toLowerCase();
    if (!['due', 'held', 'refused', 'notgiven'].includes(state)) return;

    const order = orderMap.get(admin.orderId);
    if (!order) return;

    const dueAt = combineSimDateAndClock(admin.time);
    const id = `mar_${admin.id}`;
    const completed = state !== 'due' || completedBrainTaskIds.has(id);

    tasks.push({
      id,
      type: 'medication',
      title: `${safe(order.name)} ${safe(order.medication?.dose, '')}`.trim(),
      detail: state === 'due' ? 'Medication administration due.' : `Medication marked ${state}.`,
      dueAt,
      target: 'mar',
      priority: taskTimeStatus(dueAt),
      completed
    });
  });

  // New order review tasks.
  simulationUnacknowledged.orders.forEach(orderId => {
    const order = (visible.orders || []).find(item => item.id === orderId);
    if (!order) return;
    tasks.push({
      id: `neworder_${orderId}`,
      type: 'order',
      title: `Review new order: ${safe(order.name)}`,
      detail: `${safe(order.category)} | ${safe(order.frequency)}`,
      dueAt: simulationTime,
      target: 'orders',
      priority: 'due',
      completed: completedBrainTaskIds.has(`neworder_${orderId}`)
    });
  });

  // Abnormal/critical labs visible in chart.
  (visible.observations || []).filter(obs => obs.type === 'lab' && safe(obs.flag, '')).forEach(obs => {
    const critical = safe(obs.flag).toLowerCase().includes('critical');
    const newLab = simulationUnacknowledged.labResults.has(obs.id);
    if (!critical && !newLab) return;

    tasks.push({
      id: `lab_${obs.id}`,
      type: 'lab',
      title: `${critical ? 'Critical' : 'New abnormal'} result: ${safe(obs.label || obs.code)}`,
      detail: `${safe(obs.value)}${obs.units ? ' ' + obs.units : ''} (${safe(obs.flag)})`,
      dueAt: safe(obs.collected, simulationTime),
      target: 'labResults',
      priority: critical ? 'overdue' : 'due',
      completed: completedBrainTaskIds.has(`lab_${obs.id}`)
    });
  });

  // Nursing care tasks derived from active orders.
  (visible.orders || []).filter(order => /active|pending/i.test(safe(order.status))).forEach(order => {
    const name = safe(order.name).toLowerCase();
    let dueAt = '';
    let title = '';
    let detail = '';
    let id = '';

    if (name.includes('incentive spirom')) {
      const now = parseSimDate(simulationTime);
      if (now) {
        now.setMinutes(0,0,0);
        now.setHours(now.getHours() + 1);
        dueAt = formatSimDate(now);
      }
      title = 'Incentive spirometry';
      detail = safe(order.frequency);
      id = `care_is_${dueAt}`;
    } else if (name.includes('point-of-care blood glucose')) {
      dueAt = nextClockOccurrence([9,12,17,21]);
      title = 'Point-of-care blood glucose';
      detail = 'Coordinate with meal/insulin timing.';
      id = `care_glucose_${dueAt}`;
    } else if (name.includes('ambulate')) {
      dueAt = nextClockOccurrence([10,14,18]);
      title = 'Ambulate patient';
      detail = safe(order.frequency);
      id = `care_ambulate_${dueAt}`;
    } else if (name.includes('strict intake and output')) {
      dueAt = nextClockOccurrence([15,23]);
      title = 'Complete intake and output';
      detail = 'Review and document shift totals.';
      id = `care_io_${dueAt}`;
    } else if (name.includes('vital signs')) {
      const now = parseSimDate(simulationTime);
      if (now) {
        const nextHour = Math.ceil((now.getHours() + 0.01) / 4) * 4;
        if (nextHour >= 24) {
          now.setDate(now.getDate()+1);
          now.setHours(0,0,0,0);
        } else {
          now.setHours(nextHour,0,0,0);
        }
        dueAt = formatSimDate(now);
      }
      title = 'Vital signs';
      detail = safe(order.frequency);
      id = `care_vitals_${dueAt}`;
    }

    if (id) {
      tasks.push({
        id,
        type: 'care',
        title,
        detail,
        dueAt,
        target: 'flowsheets',
        priority: taskTimeStatus(dueAt),
        completed: completedBrainTaskIds.has(id)
      });
    }
  });

  // PRN effectiveness and other generated follow-up tasks.
  (currentCanonicalCase.simulationTasks || []).forEach(task => {
    tasks.push({
      ...task,
      priority: taskTimeStatus(task.dueAt),
      completed: task.status === 'completed' || completedBrainTaskIds.has(task.id)
    });
  });

  // Dedupe task IDs.
  const deduped = Array.from(new Map(tasks.map(task => [task.id, task])).values());
  return includeCompleted ? deduped : deduped.filter(task => !task.completed);
}

function renderBrainTask(task) {
  const wrapper = document.createElement('div');
  wrapper.className = `brain-task ${task.priority} ${task.completed ? 'completed' : ''}`;

  wrapper.innerHTML = `
    <div class="brain-task-title">${escapeHtml(task.title)}</div>
    <div class="brain-task-meta">${task.dueAt ? `Due: ${escapeHtml(epicDate(task.dueAt))}` : 'No specific due time'}</div>
    <div class="brain-task-detail">${escapeHtml(safe(task.detail, ''))}</div>
    <div class="brain-task-actions">
      ${task.target ? `<button class="brain-task-button" data-action="open">Open</button>` : ''}
      ${!task.completed && task.type !== 'medication' ? `<button class="brain-task-button" data-action="complete">Complete</button>` : ''}
    </div>
  `;

  const openBtn = wrapper.querySelector('[data-action="open"]');
  if (openBtn) {
    openBtn.addEventListener('click', () => setMainSection(task.target));
  }

  const completeBtn = wrapper.querySelector('[data-action="complete"]');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      completedBrainTaskIds.add(task.id);
      const generated = (currentCanonicalCase.simulationTasks || []).find(item => item.id === task.id);
      if (generated) generated.status = 'completed';
      renderBrainPage();
      updateNavigationBadges();
    });
  }

  return wrapper;
}

function fillBrainList(container, tasks) {
  clearChildren(container);
  if (!tasks.length) {
    container.innerHTML = '<div class="brain-empty">No tasks in this category.</div>';
    return;
  }
  tasks.forEach(task => container.appendChild(renderBrainTask(task)));
}

function renderBrainPage() {
  if (!elements.brainStatus) return;
  const all = getBrainTasks(true);
  const open = all.filter(task => !task.completed);
  const urgent = open.filter(task => task.priority === 'overdue');
  const due = open.filter(task => task.priority === 'due');
  const upcoming = open.filter(task => task.priority === 'upcoming');
  const completed = all.filter(task => task.completed);

  elements.brainStatus.textContent = `${open.length} open tasks`;
  elements.brainTimeLabel.textContent = `Simulation time ${simulationTime || '—'}`;
  elements.brainUrgentCount.textContent = urgent.length;
  elements.brainDueCount.textContent = due.length;
  elements.brainUpcomingCount.textContent = upcoming.length;
  elements.brainCompletedCount.textContent = completed.length;

  fillBrainList(elements.brainUrgentList, brainFilter === 'all' ? urgent : urgent);
  fillBrainList(elements.brainDueList, due);
  fillBrainList(elements.brainUpcomingList, upcoming);
  fillBrainList(elements.brainCompletedList, brainFilter === 'all' ? completed : completed.slice(0, 6));
}

function setNavBadge(element, text = '', variant = '') {
  if (!element) return;
  element.textContent = text;
  element.className = `nav-badge ${variant}`.trim();
  element.classList.toggle('hidden', !text);
}

function updateNavigationBadges() {
  if (!currentCanonicalCase) return;
  const visible = getVisibleCanonicalCase(currentCanonicalCase);
  const openTasks = getBrainTasks(false);

  setNavBadge(elements.badgeBrain, openTasks.length ? String(openTasks.length) : '', openTasks.some(t => t.priority === 'overdue') ? 'critical' : 'due');

  const noteNew = simulationUnacknowledged.chartReview.size;
  setNavBadge(elements.badgeChartReview, noteNew ? `${noteNew} NEW` : '', 'warning');

  const visibleLabs = (visible.observations || []).filter(obs => obs.type === 'lab');
  const criticalLabs = visibleLabs.filter(obs => safe(obs.flag).toLowerCase().includes('critical')).length;
  const labNew = simulationUnacknowledged.labResults.size;
  if (criticalLabs) setNavBadge(elements.badgeLabResults, `${criticalLabs} CRIT`, 'critical');
  else setNavBadge(elements.badgeLabResults, labNew ? `${labNew} NEW` : '', 'warning');

  const dueMeds = (visible.administrations || []).filter(admin => {
    if (safe(admin.state).toLowerCase() !== 'due') return false;
    const dueAt = combineSimDateAndClock(admin.time);
    return simMinutesBetween(simulationTime, dueAt) <= 60;
  }).length;
  setNavBadge(elements.badgeMAR, dueMeds ? `${dueMeds} DUE` : '', 'due');

  const orderNew = simulationUnacknowledged.orders.size;
  setNavBadge(elements.badgeOrders, orderNew ? `${orderNew} NEW` : '', 'warning');

  const flowNew = simulationUnacknowledged.flowsheets.size;
  setNavBadge(elements.badgeFlowsheets, flowNew ? `${flowNew} NEW` : '', 'warning');
}

function acknowledgeSection(section) {
  if (section === 'chartReview') simulationUnacknowledged.chartReview.clear();
  if (section === 'labResults') simulationUnacknowledged.labResults.clear();
  if (section === 'orders') simulationUnacknowledged.orders.clear();
  if (section === 'flowsheets') simulationUnacknowledged.flowsheets.clear();
  updateNavigationBadges();
}

function showCurrentSectionOnly() {
  const sections = {
    summary: elements.summarySection,
    brain: elements.brainSection,
    chartReview: elements.chartReviewSection,
    labResults: elements.labResultsSection,
    mar: elements.marSection,
    orders: elements.ordersSection,
    flowsheets: elements.flowsheetsSection
  };

  Object.entries(sections).forEach(([key, element]) => {
    if (element) element.classList.toggle('hidden', key !== currentMainSection);
  });

  elements.navItems.forEach(btn => btn.classList.toggle('active', btn.dataset.section === currentMainSection));
  updateChartReviewDropdown(currentMainSection);
}

function renderViewData(data) {
  validatePatientData(data);
  const patient = data.patient || {};
  const encounter = data.encounter || {};

  elements.patientName.textContent = safe(patient.name, 'Unnamed simulated patient');
  elements.patientDemographics.textContent = formatDemographics(patient, encounter);
  renderPatientAlerts(patient, encounter);
  elements.patientStatus.textContent = encounter.diagnosis ? `Active encounter: ${encounter.diagnosis}` : 'Active encounter';
  elements.lastUpdated.textContent = `Simulation ${epicDate(simulationTime || encounter.lastUpdated)}`;
  elements.chiefComplaint.textContent = safe(encounter.chiefComplaint);
  elements.codeStatus.textContent = safe(encounter.codeStatus);
  elements.isolation.textContent = safe(encounter.isolation);
  elements.dietOrder.textContent = safe(encounter.dietOrder || encounter.diet);
  elements.ambulationOrder.textContent = safe(encounter.ambulationOrder || encounter.activity);
  elements.fallRisk.textContent = safe(encounter.fallRisk);

  renderStickyNotes(data.stickyNotes || []);
  renderAllergies(patient.allergies || []);
  renderCombinedDevices(data);
  renderProblems(data.problems || []);
  renderVitals(data.vitals || {});
  renderNursingOrders(data.nursingOrders || []);
  renderMedications(data.medications || []);
  renderIntakeOutput(data.intakeOutput || []);
  renderLabs(getSummaryLabs(data));
  renderChartReviewTab(currentChartTab, 0);
  renderLabResultsPage(data);
  renderMARPage(data);
  renderOrdersPage(data);
  renderFlowsheetsPage(data);
}

const chartTabLabels = { notes: "Notes", hp: "H&P", imaging: "Imaging", cardiology: "Cardiology" };
const noteGroups = [
  { key: 'progressNotes', label: 'Progress Notes' },
  { key: 'erVisitSummary', label: 'ER Visit Summary' },
  { key: 'therapyNotes', label: 'Therapy / RT / Nutrition' },
  { key: 'caseManagement', label: 'Case Management' }
];

const elements = {
  patientName: document.getElementById('patientName'), patientDemographics: document.getElementById('patientDemographics'), patientStatus: document.getElementById('patientStatus'), lastUpdated: document.getElementById('lastUpdated'), chiefComplaint: document.getElementById('chiefComplaint'), codeStatus: document.getElementById('codeStatus'), isolation: document.getElementById('isolation'), dietOrder: document.getElementById('dietOrder'), ambulationOrder: document.getElementById('ambulationOrder'), fallRisk: document.getElementById('fallRisk'), stickyNotes: document.getElementById('stickyNotes'), allergiesList: document.getElementById('allergiesList'), problemsList: document.getElementById('problemsList'), vitalsTime: document.getElementById('vitalsTime'), vitalsGrid: document.getElementById('vitalsGrid'), nursingOrdersTable: document.getElementById('nursingOrdersTable'), ordersCount: document.getElementById('ordersCount'), medicationsTable: document.getElementById('medicationsTable'), labsTable: document.getElementById('labsTable'), ioTotals: document.getElementById('ioTotals'), ioChart: document.getElementById('ioChart'), ioTable: document.getElementById('ioTable'), baseBody: document.getElementById('baseBody'), allMarkers: document.getElementById('allMarkers'), combinedTooltip: document.getElementById('combinedTooltip'), deviceList: document.getElementById('deviceList'), deviceSummary: document.getElementById('deviceSummary'), summarySection: document.getElementById('summarySection'), brainSection: document.getElementById('brainSection'), chartReviewSection: document.getElementById('chartReviewSection'), labResultsSection: document.getElementById('labResultsSection'), marSection: document.getElementById('marSection'), ordersSection: document.getElementById('ordersSection'), flowsheetsSection: document.getElementById('flowsheetsSection'), chartReviewDropdown: document.getElementById('chartReviewDropdown'), chartReviewCaret: document.getElementById('chartReviewCaret'), chartTabs: document.querySelectorAll('.chart-tab'), recordListTitle: document.getElementById('recordListTitle'), recordCount: document.getElementById('recordCount'), recordList: document.getElementById('recordList'), detailTitle: document.getElementById('detailTitle'), detailMeta: document.getElementById('detailMeta'), recordDetail: document.getElementById('recordDetail'), chartReviewStatus: document.getElementById('chartReviewStatus'), navItems: document.querySelectorAll('.nav-item[data-section]'), navSubItems: document.querySelectorAll('.nav-subitem[data-chart-tab]'), labStatus: document.getElementById('labStatus'), labCategoryFilters: document.getElementById('labCategoryFilters'), labTableTitle: document.getElementById('labTableTitle'), labCount: document.getElementById('labCount'), labResultsTable: document.getElementById('labResultsTable'),
  resultsGridHead: document.getElementById('resultsGridHead'),
  resultsGridBody: document.getElementById('resultsGridBody'),
  resultsGridTable: document.getElementById('resultsGridTable'),
  timebarRange: document.getElementById('timebarRange'),
  timebarLabel: document.getElementById('timebarLabel'),
  showAllLabsBtn: document.getElementById('showAllLabsBtn'),
  showFlaggedLabsBtn: document.getElementById('showFlaggedLabsBtn'),
  marStatus: document.getElementById('marStatus'),
  marDateTitle: document.getElementById('marDateTitle'),
  marTimelineHeader: document.getElementById('marTimelineHeader'),
  marRows: document.getElementById('marRows'),
  marCompletedRows: document.getElementById('marCompletedRows'),
  marFilterBtns: document.querySelectorAll('.mar-filter-btn'),
  marDetailCard: document.getElementById('marDetailCard'),
  marDetailTitle: document.getElementById('marDetailTitle'),
  marDetailSubtitle: document.getElementById('marDetailSubtitle'),
  marDetailBadge: document.getElementById('marDetailBadge'),
  marDetailBody: document.getElementById('marDetailBody'),
  ordersStatus: document.getElementById('ordersStatus'),
  ordersTableTitle: document.getElementById('ordersTableTitle'),
  ordersPageCount: document.getElementById('ordersPageCount'),
  orderCategoryFilters: document.getElementById('orderCategoryFilters'),
  ordersListHeading: document.getElementById('ordersListHeading'),
  ordersListCount: document.getElementById('ordersListCount'),
  ordersTableBody: document.getElementById('ordersTableBody'),
  orderDetailTitle: document.getElementById('orderDetailTitle'),
  orderDetailMeta: document.getElementById('orderDetailMeta'),
  orderDetailBody: document.getElementById('orderDetailBody'),
  orderFilterBtns: document.querySelectorAll('.order-filter-btn'),
  flowsheetStatus: document.getElementById('flowsheetStatus'),
  flowsheetDateLabel: document.getElementById('flowsheetDateLabel'),
  flowsheetSectionCount: document.getElementById('flowsheetSectionCount'),
  flowsheetSectionNav: document.getElementById('flowsheetSectionNav'),
  flowsheetGridHead: document.getElementById('flowsheetGridHead'),
  flowsheetGridBody: document.getElementById('flowsheetGridBody'),
  flowsheetFooterMeta: document.getElementById('flowsheetFooterMeta'),
  flowsheetDetailTitle: document.getElementById('flowsheetDetailTitle'),
  flowsheetDetailMeta: document.getElementById('flowsheetDetailMeta'),
  flowsheetDetailBody: document.getElementById('flowsheetDetailBody'),
  flowsheetExpandAll: document.getElementById('flowsheetExpandAll'),
  flowsheetCollapseAll: document.getElementById('flowsheetCollapseAll'),
  flowsheetLatestOnly: document.getElementById('flowsheetLatestOnly'),
  flowsheetChartBtn: document.getElementById('flowsheetChartBtn'),
  simulationClockDisplay: document.getElementById('simulationClockDisplay'),
  simulationResetBtn: document.getElementById('simulationResetBtn'),
  simulationAdvance30Btn: document.getElementById('simulationAdvance30Btn'),
  simulationAdvance60Btn: document.getElementById('simulationAdvance60Btn'),
  simulationNextEventBtn: document.getElementById('simulationNextEventBtn'),
  badgeBrain: document.getElementById('badgeBrain'),
  badgeChartReview: document.getElementById('badgeChartReview'),
  badgeLabResults: document.getElementById('badgeLabResults'),
  badgeMAR: document.getElementById('badgeMAR'),
  badgeOrders: document.getElementById('badgeOrders'),
  badgeFlowsheets: document.getElementById('badgeFlowsheets'),
  brainStatus: document.getElementById('brainStatus'),
  brainTimeLabel: document.getElementById('brainTimeLabel'),
  brainUrgentCount: document.getElementById('brainUrgentCount'),
  brainDueCount: document.getElementById('brainDueCount'),
  brainUpcomingCount: document.getElementById('brainUpcomingCount'),
  brainCompletedCount: document.getElementById('brainCompletedCount'),
  brainUrgentList: document.getElementById('brainUrgentList'),
  brainDueList: document.getElementById('brainDueList'),
  brainUpcomingList: document.getElementById('brainUpcomingList'),
  brainCompletedList: document.getElementById('brainCompletedList'),
  brainFilterBtns: document.querySelectorAll('.brain-filter-btn'),
  marActionDialog: document.getElementById('marActionDialog'),
  marActionTitle: document.getElementById('marActionTitle'),
  marActionSubtitle: document.getElementById('marActionSubtitle'),
  marActionMonitoring: document.getElementById('marActionMonitoring'),
  marActionReason: document.getElementById('marActionReason'),
  marActionChoices: document.querySelectorAll('.mar-action-choice'),
  flowsheetChartDialog: document.getElementById('flowsheetChartDialog'),
  chartAssessmentSection: document.getElementById('chartAssessmentSection'),
  chartAssessmentTime: document.getElementById('chartAssessmentTime'),
  chartAssessmentField: document.getElementById('chartAssessmentField'),
  chartAssessmentValue: document.getElementById('chartAssessmentValue'),
  chartAssessmentAbnormal: document.getElementById('chartAssessmentAbnormal'),
  chartAssessmentMessage: document.getElementById('chartAssessmentMessage'), labDetailTitle: document.getElementById('labDetailTitle'), labDetailMeta: document.getElementById('labDetailMeta'), labDetailBody: document.getElementById('labDetailBody'), importDialog: document.getElementById('importDialog'), jsonInput: document.getElementById('jsonInput'), importMessage: document.getElementById('importMessage'), validationSummary: document.getElementById('validationSummary'), validationResults: document.getElementById('validationResults'), schemaBlock: document.getElementById('schemaBlock')
};

let currentPatientData = structuredClone(samplePatient);
let currentCanonicalCase = null;
let currentMainSection = 'summary';
let currentChartTab = 'notes';
let currentRecordIndex = 0;
let currentLabCategory = 'All Results';
let currentLabIndex = 0;
let labFlaggedOnly = false;
let selectedLabTime = null;
let currentMARFilter = 'all';
let currentMARSelectedKey = null;
let currentOrderCategory = 'All Orders';
let currentOrderStatus = 'all';
let currentOrderIndex = 0;
let flowsheetCollapsedSections = new Set();
let currentFlowsheetSelection = null;
let flowsheetLatestOnlyMode = false;
let simulationTime = null;
let simulationStartTime = null;
let simulationEndTime = null;
let simulationUnacknowledged = { chartReview: new Set(), labResults: new Set(), orders: new Set(), flowsheets: new Set() };
let completedBrainTaskIds = new Set();
let brainFilter = 'open';
let activeMARAction = null;

const markerCoordinates = { leftForearm: { x: 254, y: 206, labelX: 212, labelY: 176 }, rightForearm: { x: 86, y: 206, labelX: 18, labelY: 176 }, leftAC: { x: 224, y: 170, labelX: 210, labelY: 144 }, rightAC: { x: 116, y: 170, labelX: 22, labelY: 144 }, leftUpperArm: { x: 230, y: 136, labelX: 208, labelY: 112 }, rightUpperArm: { x: 110, y: 136, labelX: 20, labelY: 112 }, chestLeft: { x: 194, y: 138, labelX: 214, labelY: 122 }, chestRight: { x: 146, y: 138, labelX: 26, labelY: 122 }, abdomenLUQ: { x: 191, y: 210, labelX: 226, labelY: 198 }, abdomenRUQ: { x: 149, y: 210, labelX: 22, labelY: 198 }, abdomenLLQ: { x: 191, y: 254, labelX: 226, labelY: 244 }, abdomenRLQ: { x: 149, y: 254, labelX: 22, labelY: 244 }, nares: { x: 170, y: 64, labelX: 206, labelY: 56 }, mouth: { x: 170, y: 82, labelX: 208, labelY: 84 }, ngTube: { x: 177, y: 68, labelX: 212, labelY: 70 }, trach: { x: 170, y: 104, labelX: 212, labelY: 106 }, pelvis: { x: 170, y: 282, labelX: 212, labelY: 284 } };

function safe(value, fallback = '—') { if (value === null || value === undefined || value === '') return fallback; return String(value); }
function escapeHtml(str) { return String(str).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }
function epicDate(value) {
  // "2026-06-17 08:30" -> "06/17/26 0830"; "1972-04-18" -> "04/18/1972"
  const text = safe(value, '');
  let m = text.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (m) return `${m[2]}/${m[3]}/${m[1].slice(2)} ${m[4]}${m[5]}`;
  m = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[2]}/${m[3]}/${m[1]}`;
  return text || '—';
}

function renderPatientAlerts(patient, encounter) {
  const box = document.getElementById('patientAlerts');
  if (!box) return;
  const chips = [];
  const allergies = (patient.allergies || []).filter(a => a && a.substance && !/^(nkda|nka|none)/i.test(a.substance));
  if (allergies.length) chips.push(['alert-red', `Allergies: ${allergies.map(a => a.substance).join(', ')}`]);
  else chips.push(['alert-gray', 'No known allergies']);
  const code = safe(encounter.codeStatus, '');
  if (code) chips.push([/full/i.test(code) ? 'alert-green' : 'alert-red', code]);
  const iso = safe(encounter.isolation, '');
  if (iso && !/^none$/i.test(iso)) chips.push(['alert-yellow', iso]);
  const fall = safe(encounter.fallRisk, '');
  if (/high/i.test(fall)) chips.push(['alert-orange', 'Fall risk: High']);
  box.innerHTML = chips.map(([cls, text]) => `<span class="alert-chip ${cls}">${escapeHtml(text)}</span>`).join('');
}

function formatDemographics(patient, encounter) { return [`MRN ${safe(patient.mrn, '—')}`, `${safe(patient.age, '—')} y.o.`, safe(patient.sex, '—'), `DOB ${epicDate(patient.dob)}`, encounter.location ? `${encounter.location} ${safe(encounter.room, '')}`.trim() : ''].filter(Boolean).join('  |  '); }
function clearChildren(node) { while (node.firstChild) node.removeChild(node.firstChild); }
function flagClass(flag) { const f = safe(flag, '').toLowerCase(); return f.includes('critical') ? 'flag-critical' : (f.includes('high') || f.includes('low')) ? 'flag-high' : ''; }

function renderBaseBody() {
  elements.baseBody.innerHTML = `<circle cx="170" cy="55" r="34" class="body-shape"></circle><rect x="132" y="94" width="76" height="150" rx="28" class="body-shape"></rect><line x1="134" y1="118" x2="82" y2="220" class="limb"></line><line x1="206" y1="118" x2="258" y2="220" class="limb"></line><line x1="150" y1="240" x2="132" y2="394" class="limb"></line><line x1="190" y1="240" x2="208" y2="394" class="limb"></line><circle cx="82" cy="220" r="9" class="joint"></circle><circle cx="258" cy="220" r="9" class="joint"></circle><circle cx="132" cy="394" r="9" class="joint"></circle><circle cx="208" cy="394" r="9" class="joint"></circle>`;
}

function makeListItem(main, sub, badgeText, badgeClass = '') { const item = document.createElement('div'); item.className = 'list-item'; item.innerHTML = `<div><div class="list-main">${escapeHtml(safe(main))}</div><div class="list-sub">${escapeHtml(safe(sub, ''))}</div></div><div class="badge ${badgeClass}">${escapeHtml(safe(badgeText, ''))}</div>`; return item; }
function renderStickyNotes(notes = []) { clearChildren(elements.stickyNotes); if (!notes.length) { elements.stickyNotes.textContent = 'No nurse sticky notes loaded.'; return; } notes.forEach(note => { const wrapper = document.createElement('div'); wrapper.className = 'sticky-note'; wrapper.innerHTML = `<div class="sticky-note-title">${escapeHtml(safe(note.title, 'Nurse note'))}</div><div class="sticky-note-body">${escapeHtml(safe(note.body, ''))}</div>`; elements.stickyNotes.appendChild(wrapper); }); }
function renderAllergies(allergies = []) { clearChildren(elements.allergiesList); if (!allergies.length) { elements.allergiesList.className = 'list-block empty'; elements.allergiesList.textContent = 'No known allergies documented'; return; } elements.allergiesList.className = 'list-block'; allergies.forEach(allergy => { const severity = safe(allergy.severity, 'Unknown'); const severityClass = severity.toLowerCase() === 'high' ? 'high' : severity.toLowerCase() === 'moderate' ? 'moderate' : ''; elements.allergiesList.appendChild(makeListItem(allergy.substance, allergy.reaction, severity, severityClass)); }); }
function renderProblems(problems = []) { clearChildren(elements.problemsList); if (!problems.length) { elements.problemsList.className = 'list-block empty'; elements.problemsList.textContent = 'No active problems loaded'; return; } elements.problemsList.className = 'list-block'; problems.forEach(problem => { const statusClass = safe(problem.status, '').toLowerCase() === 'active' ? 'high' : ''; elements.problemsList.appendChild(makeListItem(problem.name, problem.details, problem.status, statusClass)); }); }
function renderVitals(vitals = {}) { elements.vitalsTime.textContent = safe(vitals.time); clearChildren(elements.vitalsGrid); [['Temp', vitals.temp],['HR', vitals.hr],['BP', vitals.bp],['RR', vitals.rr],['SpO₂', vitals.spo2],['Pain', vitals.pain]].forEach(([label, value]) => { const box = document.createElement('div'); box.className = 'vital-box'; box.innerHTML = `<span>${escapeHtml(label)}</span><strong>${escapeHtml(safe(value))}</strong>`; elements.vitalsGrid.appendChild(box); }); }
function renderNursingOrders(orders = []) { clearChildren(elements.nursingOrdersTable); elements.ordersCount.textContent = `${orders.length} orders`; if (!orders.length) { elements.nursingOrdersTable.innerHTML = '<tr><td colspan="3" class="empty-cell">No nursing orders loaded</td></tr>'; return; } orders.forEach(order => { const row = document.createElement('tr'); [order.order, order.frequency, order.status].forEach(value => { const cell = document.createElement('td'); cell.textContent = safe(value); row.appendChild(cell); }); elements.nursingOrdersTable.appendChild(row); }); }
function renderMedications(medications = []) { clearChildren(elements.medicationsTable); if (!medications.length) { elements.medicationsTable.innerHTML = '<tr><td colspan="4" class="empty-cell">No medications loaded</td></tr>'; return; } medications.forEach(med => { const row = document.createElement('tr'); [med.name, med.dose, med.route, med.frequency].forEach(value => { const cell = document.createElement('td'); cell.textContent = safe(value); row.appendChild(cell); }); elements.medicationsTable.appendChild(row); }); }
function getSummaryLabs(data) { if (Array.isArray(data.recentLabs) && data.recentLabs.length) return data.recentLabs; const all = getAllLabResults(data); return all.slice(0, 6).map(lab => ({ category: lab.category, test: lab.test, result: `${lab.result}${lab.units ? ' ' + lab.units : ''}`.trim(), flag: lab.flag, reference: lab.reference, collected: lab.collected })); }
function renderLabs(labs = []) { clearChildren(elements.labsTable); if (!labs.length) { elements.labsTable.innerHTML = '<tr><td colspan="5" class="empty-cell">No labs loaded</td></tr>'; return; } labs.forEach(lab => { const row = document.createElement('tr'); [lab.test, lab.result, lab.flag, lab.reference, lab.collected].forEach((value, index) => { const cell = document.createElement('td'); cell.textContent = safe(value, index === 2 ? '' : '—'); if (index === 2 && value) cell.className = flagClass(value); row.appendChild(cell); }); elements.labsTable.appendChild(row); }); }

function ioLabel(record) { return record.date ? `${epicDate(record.date).slice(0, 5)} ${safe(record.time)}` : safe(record.time); }
function renderIntakeOutput(records = []) { clearChildren(elements.ioTable); clearChildren(elements.ioChart); if (!records.length) { elements.ioTable.innerHTML = '<tr><td colspan="4" class="empty-cell">No I/O loaded</td></tr>'; elements.ioTotals.textContent = 'No I/O data'; elements.ioChart.innerHTML = '<div class="empty">No I/O chart available.</div>'; return; } let totalIntake = 0, totalOutput = 0; records.forEach(record => { const intake = Number(record.intake) || 0; const output = Number(record.output) || 0; const net = intake - output; totalIntake += intake; totalOutput += output; const row = document.createElement('tr'); [ioLabel(record), `${intake} mL`, `${output} mL`, `${net >= 0 ? '+' : ''}${net} mL`].forEach(value => { const cell = document.createElement('td'); cell.textContent = safe(value); row.appendChild(cell); }); elements.ioTable.appendChild(row); }); const netTotal = totalIntake - totalOutput; elements.ioTotals.textContent = `Intake ${totalIntake} mL | Output ${totalOutput} mL | Net ${netTotal >= 0 ? '+' : ''}${netTotal} mL`; drawIOChart(records); }
function drawIOChart(records) { const width = 720, height = 260, margin = { top: 22, right: 20, bottom: 42, left: 50 }, chartWidth = width - margin.left - margin.right, chartHeight = height - margin.top - margin.bottom; const maxValue = Math.max(...records.flatMap(r => [Number(r.intake) || 0, Number(r.output) || 0]), 100), yMax = Math.ceil(maxValue / 100) * 100, barGroupWidth = chartWidth / records.length, barWidth = Math.min(34, barGroupWidth / 4); const yScale = value => margin.top + chartHeight - ((value / yMax) * chartHeight), xCenter = index => margin.left + (barGroupWidth * index) + barGroupWidth / 2; let svg = `<div class="avatar-legend" style="margin-bottom:8px;"><span class="legend-item"><span class="legend-dot iv-dot"></span> Intake</span><span class="legend-item"><span class="legend-dot" style="background:#64748b;"></span> Output</span></div><svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">`; [0, 0.25, 0.5, 0.75, 1].forEach(step => { const value = Math.round(yMax * step), y = yScale(value); svg += `<line x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" class="io-grid"></line><text x="${margin.left - 8}" y="${y + 4}" text-anchor="end" class="io-label">${value}</text>`; }); svg += `<line x1="${margin.left}" y1="${margin.top + chartHeight}" x2="${width - margin.right}" y2="${margin.top + chartHeight}" class="io-axis"></line><line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + chartHeight}" class="io-axis"></line>`; records.forEach((record, index) => { const intake = Number(record.intake) || 0, output = Number(record.output) || 0, center = xCenter(index), intakeHeight = (intake / yMax) * chartHeight, outputHeight = (output / yMax) * chartHeight; svg += `<rect x="${center - barWidth - 3}" y="${margin.top + chartHeight - intakeHeight}" width="${barWidth}" height="${intakeHeight}" rx="4" class="io-bar-intake"></rect><rect x="${center + 3}" y="${margin.top + chartHeight - outputHeight}" width="${barWidth}" height="${outputHeight}" rx="4" class="io-bar-output"></rect><text x="${center}" y="${height - 14}" text-anchor="middle" class="io-label">${escapeHtml(ioLabel(record))}</text>`; }); svg += `<text x="16" y="${margin.top + 18}" transform="rotate(-90,16,${margin.top + 18})" class="io-label">mL</text></svg>`; elements.ioChart.innerHTML = svg; }

function getTooltipHtml(device) { return `<div class="tooltip-title">${escapeHtml(safe(device.type))} - ${escapeHtml(safe(device.location))}</div><div class="tooltip-row"><strong>Category:</strong> ${escapeHtml(safe(device.category))}</div><div class="tooltip-row"><strong>Status:</strong> ${escapeHtml(safe(device.status))}</div><div class="tooltip-row"><strong>Placed:</strong> ${escapeHtml(safe(device.placementDate))}</div><div class="tooltip-row"><strong>Last assessment:</strong> ${escapeHtml(safe(device.lastAssessment))}</div>${device.gauge ? `<div class="tooltip-row"><strong>Gauge:</strong> ${escapeHtml(safe(device.gauge))}</div>` : ''}${device.infusing ? `<div class="tooltip-row"><strong>Infusing:</strong> ${escapeHtml(safe(device.infusing))}</div>` : ''}${device.drainage ? `<div class="tooltip-row"><strong>Drainage / output:</strong> ${escapeHtml(safe(device.drainage))}</div>` : ''}`; }
function positionTooltip(event, tooltip) { const wrapper = tooltip.parentElement.getBoundingClientRect(); let left = event.clientX - wrapper.left + 12, top = event.clientY - wrapper.top + 12; const maxLeft = wrapper.width - 290, maxTop = wrapper.height - 170; if (left > maxLeft) left = Math.max(8, maxLeft); if (top > maxTop) top = Math.max(8, maxTop); tooltip.style.left = `${left}px`; tooltip.style.top = `${top}px`; }
function attachTooltipEvents(group, device) {
  const show = event => { elements.combinedTooltip.innerHTML = getTooltipHtml(device); elements.combinedTooltip.classList.remove('hidden'); positionTooltip(event, elements.combinedTooltip); };
  // Mouse: hover. Touch (iPad): tap to show, tap anywhere else to dismiss.
  group.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') show(event); });
  group.addEventListener('pointermove', event => { if (event.pointerType === 'mouse') positionTooltip(event, elements.combinedTooltip); });
  group.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') elements.combinedTooltip.classList.add('hidden'); });
  group.addEventListener('click', event => { event.stopPropagation(); show(event); });
}
document.addEventListener('click', () => { if (elements.combinedTooltip) elements.combinedTooltip.classList.add('hidden'); });
function getTypeClass(category) { if (category === 'IV') return 'hotspot-iv'; if (category === 'Drain') return 'hotspot-drain'; return 'hotspot-tube'; }
function getBadgeClass(category) { if (category === 'IV') return 'type-iv'; if (category === 'Drain') return 'type-drain'; return 'type-tube'; }
function createMarker(device) { const marker = markerCoordinates[device.siteMarker]; if (!marker) return null; const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); const shortLabel = safe(device.type, 'Item').slice(0, 16), labelWidth = Math.max(60, shortLabel.length * 6.6); g.innerHTML = `<line x1="${marker.x}" y1="${marker.y}" x2="${marker.labelX}" y2="${marker.labelY}" class="hotspot-label-line"></line><rect x="${marker.labelX - 4}" y="${marker.labelY - 14}" width="${labelWidth}" height="20" rx="4" class="hotspot-label-bg"></rect><text x="${marker.labelX + 2}" y="${marker.labelY}" class="hotspot-label-text">${escapeHtml(shortLabel)}</text><circle cx="${marker.x}" cy="${marker.y}" r="22" fill="transparent"></circle><circle cx="${marker.x}" cy="${marker.y}" r="8" class="hotspot-circle ${getTypeClass(device.category)}"></circle>`; attachTooltipEvents(g, device); return g; }
function normalizeDevices(data) { return [...(data.ivs || []).map(item => ({ ...item, category: 'IV' })), ...(data.drains || []).map(item => ({ ...item, category: 'Drain' })), ...(data.tubes || []).map(item => ({ ...item, category: 'Tube' }))]; }
function renderCombinedDevices(data) { clearChildren(elements.allMarkers); clearChildren(elements.deviceList); const devices = normalizeDevices(data); elements.deviceSummary.textContent = `${devices.length} active devices`; if (!devices.length) { elements.deviceList.className = 'device-list empty'; elements.deviceList.textContent = 'No devices loaded.'; return; } elements.deviceList.className = 'device-list'; devices.forEach(device => { const marker = createMarker(device); if (marker) elements.allMarkers.appendChild(marker); const item = document.createElement('div'); item.className = 'device-item'; item.innerHTML = `<div class="device-name-line"><span class="type-badge ${getBadgeClass(device.category)}">${escapeHtml(device.category)}</span><span class="device-name">${escapeHtml(safe(device.type))} - ${escapeHtml(safe(device.location))}</span></div><div class="device-meta">Status: ${escapeHtml(safe(device.status))}<br>Placed: ${escapeHtml(safe(device.placementDate))}<br>Last assessment: ${escapeHtml(safe(device.lastAssessment))}${device.gauge ? `<br>Gauge: ${escapeHtml(safe(device.gauge))}` : ''}${device.infusing ? `<br>Infusing: ${escapeHtml(safe(device.infusing))}` : ''}${device.drainage ? `<br>Drainage / output: ${escapeHtml(safe(device.drainage))}` : ''}</div>`; elements.deviceList.appendChild(item); }); }

function flattenNotes(data) { const chartReview = data.chartReview || {}; const flattened = []; noteGroups.forEach(group => { const records = Array.isArray(chartReview[group.key]) ? chartReview[group.key] : []; records.forEach(record => flattened.push({ ...record, noteGroupKey: group.key, noteGroupLabel: group.label })); }); return flattened; }
function getChartReviewArray(data, tabKey) { const chartReview = data.chartReview || {}; if (tabKey === 'notes') return flattenNotes(data); return Array.isArray(chartReview[tabKey]) ? chartReview[tabKey] : []; }
function formatBodyToHtml(bodyText) {
  const lines = safe(bodyText, '').split('\n');
  let html = '';
  let inList = false;

  lines.forEach(line => {
    const trimmed = line.trim();

    if (!trimmed) {
      if (inList) { html += '</ul>'; inList = false; }
      html += '<br>';
      return;
    }

    if (trimmed.startsWith('- ')) {
      if (!inList) { html += '<ul style="margin:6px 0 10px 20px;padding:0;">'; inList = true; }
      const content = escapeHtml(trimmed.slice(2)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html += `<li style="margin:4px 0;">${content}</li>`;
      return;
    }

    if (inList) { html += '</ul>'; inList = false; }
    const content = escapeHtml(trimmed).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html += `<div style="margin:4px 0;">${content}</div>`;
  });

  if (inList) html += '</ul>';
  return html;
}
function renderNotesList(flatRecords, selectedIndex) { clearChildren(elements.recordList); if (!flatRecords.length) { elements.recordList.innerHTML = '<div class="empty-state">No notes loaded in this section.</div>'; return; } noteGroups.forEach(group => { const records = flatRecords.filter(r => r.noteGroupKey === group.key); if (!records.length) return; const heading = document.createElement('div'); heading.className = 'record-group-heading'; heading.textContent = group.label; elements.recordList.appendChild(heading); records.forEach(record => { const index = flatRecords.indexOf(record); const card = document.createElement('div'); card.className = `record-card ${index === selectedIndex ? 'active' : ''}`; card.innerHTML = `<div class="record-card-title">${escapeHtml(safe(record.title))}</div><div class="record-card-meta">${escapeHtml(safe(record.author))} | ${escapeHtml(safe(record.datetime))} | ${escapeHtml(safe(record.category))}</div><div class="record-card-summary">${escapeHtml(safe(record.summary, ''))}</div>`; card.addEventListener('click', () => renderChartReviewTab('notes', index)); elements.recordList.appendChild(card); }); }); }
function renderStandardRecordList(records, tabKey, selectedIndex) { clearChildren(elements.recordList); if (!records.length) { elements.recordList.innerHTML = '<div class="empty-state">No records loaded for this tab.</div>'; return; } records.forEach((record, index) => { const card = document.createElement('div'); card.className = `record-card ${index === selectedIndex ? 'active' : ''}`; card.innerHTML = `<div class="record-card-title">${escapeHtml(safe(record.title))}</div><div class="record-card-meta">${escapeHtml(safe(record.author))} | ${escapeHtml(safe(record.datetime))} | ${escapeHtml(safe(record.category))}</div><div class="record-card-summary">${escapeHtml(safe(record.summary, ''))}</div>`; card.addEventListener('click', () => renderChartReviewTab(tabKey, index)); elements.recordList.appendChild(card); }); }
function renderChartReviewDetail(record) { elements.detailTitle.textContent = safe(record.title, 'Record Detail'); const groupText = record.noteGroupLabel ? ` | ${record.noteGroupLabel}` : ''; elements.detailMeta.textContent = `${safe(record.author)} | ${safe(record.datetime)} | ${safe(record.category)}${groupText}`; let html = `<div class="detail-section"><span class="detail-label">Summary</span><div class="detail-value">${escapeHtml(safe(record.summary, ''))}</div></div>`; if (record.study) html += `<div class="detail-section"><span class="detail-label">Study</span><div class="detail-value">${escapeHtml(safe(record.study))}</div></div>`; if (record.impression) html += `<div class="detail-section"><span class="detail-label">Impression</span><div class="detail-value">${escapeHtml(safe(record.impression))}</div></div>`; if (record.noteGroupLabel) html += `<div class="detail-section"><span class="detail-label">Note Type</span><div class="detail-value">${escapeHtml(safe(record.noteGroupLabel))}</div></div>`; html += `<div class="detail-section"><span class="detail-label">Full Content</span><div class="detail-value">${formatBodyToHtml(record.body)}</div></div>`; elements.recordDetail.innerHTML = html; }
function renderChartReviewTab(tabKey, recordIndex = 0) { currentChartTab = tabKey; const records = getChartReviewArray(currentPatientData, tabKey); const safeIndex = Math.max(0, Math.min(recordIndex, Math.max(records.length - 1, 0))); currentRecordIndex = safeIndex; document.querySelectorAll('.chart-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.chartTab === tabKey)); elements.navSubItems.forEach(btn => btn.classList.toggle('active', btn.dataset.chartTab === tabKey)); elements.recordListTitle.textContent = chartTabLabels[tabKey] || 'Chart Review'; elements.recordCount.textContent = `${records.length} records`; if (!records.length) { clearChildren(elements.recordList); elements.recordList.innerHTML = '<div class="empty-state">No records loaded for this tab.</div>'; elements.detailTitle.textContent = 'Record Detail'; elements.detailMeta.textContent = 'No record selected'; elements.recordDetail.innerHTML = '<div class="empty-state">There are no records in this chart review category.</div>'; elements.chartReviewStatus.textContent = `${chartTabLabels[tabKey]}: 0 records`; return; } if (tabKey === 'notes') renderNotesList(records, safeIndex); else renderStandardRecordList(records, tabKey, safeIndex); renderChartReviewDetail(records[safeIndex]); elements.chartReviewStatus.textContent = `${chartTabLabels[tabKey]}: ${safeIndex + 1} of ${records.length}`; }

function getAllLabResults(data) { if (Array.isArray(data.labResults) && data.labResults.length) return data.labResults; return (data.recentLabs || []).map(lab => ({ ...lab, units: '', specimen: '', status: 'Final' })); }
function getLabCategories(labs) { return ['All Results', ...Array.from(new Set(labs.map(l => safe(l.category, 'Other'))))]; }
function filterLabsByCategory(labs, category) { if (category === 'All Results') return labs; return labs.filter(lab => safe(lab.category, 'Other') === category); }
let labNewestLeft = false;   // false: oldest on the left, newest on the right (default); true: newest on the left
function getLabDateColumns(labs) {
  const cols = Array.from(new Set(labs.map(lab => safe(lab.collected, 'Unknown'))))
    .sort((a, b) => String(a).localeCompare(String(b)));
  return labNewestLeft ? cols.reverse() : cols;
}
const newestLabTime = times => (labNewestLeft ? times[0] : times[times.length - 1]);

function getLabGroups(labs) {
  const groups = {};
  labs.forEach(lab => {
    const category = safe(lab.category, 'Other');
    const test = safe(lab.test, 'Unknown test');
    if (!groups[category]) groups[category] = {};
    if (!groups[category][test]) groups[category][test] = [];
    groups[category][test].push(lab);
  });
  return groups;
}

function getFilteredLabsForGrid(allLabs) {
  let labs = currentLabCategory === 'All Results'
    ? allLabs
    : allLabs.filter(lab => safe(lab.category, 'Other') === currentLabCategory);

  if (labFlaggedOnly) {
    labs = labs.filter(lab => safe(lab.flag, ''));
  }

  return labs;
}

function renderLabCategoryFilters(labs) {
  clearChildren(elements.labCategoryFilters);
  const categories = getLabCategories(labs);
  categories.forEach(category => {
    const categoryLabs = category === 'All Results'
      ? labs
      : labs.filter(lab => safe(lab.category, 'Other') === category);

    const group = document.createElement('div');
    group.className = 'tree-group';

    const header = document.createElement('div');
    header.className = `tree-group-header ${category === currentLabCategory ? 'active' : ''}`;
    header.innerHTML = `
      <span class="tree-caret">▾</span>
      <span>${escapeHtml(category)}</span>
      <span class="tree-count">${categoryLabs.length}</span>
    `;
    header.addEventListener('click', () => {
      currentLabCategory = category;
      currentLabIndex = 0;
      selectedLabTime = null;
      renderLabResultsPage(currentPatientData);
    });
    group.appendChild(header);

    if (category !== 'All Results') {
      const children = document.createElement('div');
      children.className = 'tree-children';
      Array.from(new Set(categoryLabs.map(lab => safe(lab.test, 'Unknown test')))).forEach(test => {
        const item = document.createElement('div');
        item.className = 'tree-item';
        item.innerHTML = `
          <span class="tree-check">✓</span>
          <span>${escapeHtml(test)}</span>
          <span class="tree-count">${categoryLabs.filter(lab => safe(lab.test) === test).length}</span>
        `;
        item.addEventListener('click', event => {
          event.stopPropagation();
          currentLabCategory = category;
          currentLabIndex = categoryLabs.findIndex(lab => safe(lab.test) === test);
          selectedLabTime = null;
          renderLabResultsPage(currentPatientData);
        });
        children.appendChild(item);
      });
      group.appendChild(children);
    }

    elements.labCategoryFilters.appendChild(group);
  });
}

function getResultForCell(testLabs, time) {
  return testLabs.find(lab => safe(lab.collected, 'Unknown') === time);
}

function renderLabGridHeader(times) {
  clearChildren(elements.resultsGridHead);
  const headerRow = document.createElement('tr');

  const testHead = document.createElement('th');
  testHead.className = 'results-test-col';
  testHead.textContent = 'Component';
  headerRow.appendChild(testHead);

  times.forEach(time => {
    const th = document.createElement('th');
    th.className = `results-date-col ${time === selectedLabTime ? 'selected' : ''}`;
    th.innerHTML = formatLabTimeHeader(time);
    th.addEventListener('click', () => {
      selectedLabTime = time;
      renderLabResultsPage(currentPatientData);
    });
    headerRow.appendChild(th);
  });

  elements.resultsGridHead.appendChild(headerRow);
}

function formatLabTimeHeader(time) {
  const parts = epicDate(time).split(' ');
  if (parts.length >= 2) {
    return `${escapeHtml(parts[0])}<br>${escapeHtml(parts.slice(1).join(' '))}`;
  }
  return escapeHtml(safe(time));
}

function formatLabResultValue(lab) {
  if (!lab) return '';
  const value = `${safe(lab.result, '')}${lab.units ? ' ' + lab.units : ''}`.trim();
  const flag = safe(lab.flag, '');
  const arrow = flag.toLowerCase().includes('high') ? '▲' : flag.toLowerCase().includes('low') ? '▼' : flag.toLowerCase().includes('critical') ? '!' : '';
  return `${escapeHtml(value)}${arrow ? `<span class="result-flag-symbol">${arrow}</span>` : ''}`;
}

function renderLabResultsPage(data) {
  const allLabs = getAllLabResults(data);
  const filtered = getFilteredLabsForGrid(allLabs);
  const times = getLabDateColumns(filtered);

  if (!selectedLabTime && times.length) selectedLabTime = newestLabTime(times);
  if (selectedLabTime && !times.includes(selectedLabTime)) selectedLabTime = newestLabTime(times) || null;

  renderLabCategoryFilters(allLabs);

  if (elements.showAllLabsBtn) elements.showAllLabsBtn.classList.toggle('active', !labFlaggedOnly);
  if (elements.showFlaggedLabsBtn) elements.showFlaggedLabsBtn.classList.toggle('active', labFlaggedOnly);

  const abnormalCount = allLabs.filter(lab => safe(lab.flag, '')).length;
  elements.labStatus.textContent = `${allLabs.length} total results | ${abnormalCount} flagged`;
  elements.labTableTitle.textContent = currentLabCategory === 'All Results' ? 'Most Recent Hospitalization' : currentLabCategory;
  elements.labCount.textContent = `${filtered.length} results`;

  clearChildren(elements.resultsGridBody);
  renderLabGridHeader(times);

  if (!filtered.length) {
    elements.resultsGridBody.innerHTML = '<tr><td class="empty-cell">No lab results in this category</td></tr>';
    elements.labDetailTitle.textContent = 'Result Detail';
    elements.labDetailMeta.textContent = 'No result selected';
    elements.labDetailBody.innerHTML = '<div class="empty-state">No result selected for this category.</div>';
    elements.timebarLabel.textContent = 'No collection timeline loaded';
    return;
  }

  const groups = getLabGroups(filtered);
  let selectableLabs = [];

  Object.keys(groups).forEach(category => {
    const groupRow = document.createElement('tr');
    groupRow.className = 'group-row';
    groupRow.innerHTML = `<td class="results-test-col">${escapeHtml(category)}</td><td colspan="${times.length}"></td>`;
    elements.resultsGridBody.appendChild(groupRow);

    Object.keys(groups[category]).forEach(test => {
      const testLabs = groups[category][test].sort((a, b) => safe(a.collected).localeCompare(safe(b.collected)));
      const latest = testLabs[testLabs.length - 1];
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.className = 'results-test-col test-name-cell';
      nameCell.innerHTML = `${escapeHtml(test)} <span class="test-reference">${escapeHtml(safe(latest.reference, ''))}</span>`;
      row.appendChild(nameCell);

      times.forEach(time => {
        const lab = getResultForCell(testLabs, time);
        const td = document.createElement('td');
        td.className = `result-cell ${time === selectedLabTime ? 'selected-time' : ''}`;

        if (!lab) {
          td.classList.add('empty-result');
          td.textContent = '';
        } else {
          selectableLabs.push(lab);
          const fClass = flagClass(lab.flag);
          if (fClass) td.classList.add(fClass.includes('critical') ? 'critical' : 'flagged');
          if (currentLabIndex === selectableLabs.length - 1) td.classList.add('selected-cell');
          td.innerHTML = formatLabResultValue(lab);
          td.addEventListener('click', () => {
            currentLabIndex = selectableLabs.indexOf(lab);
            selectedLabTime = time;
            renderLabResultsPage(currentPatientData);
          });
        }

        row.appendChild(td);
      });

      elements.resultsGridBody.appendChild(row);
    });
  });

  if (!selectableLabs.length) {
    elements.labDetailTitle.textContent = 'Result Detail';
    elements.labDetailMeta.textContent = 'No result selected';
    elements.labDetailBody.innerHTML = '<div class="empty-state">No lab cell selected.</div>';
  } else {
    currentLabIndex = Math.max(0, Math.min(currentLabIndex, selectableLabs.length - 1));
    renderLabDetail(selectableLabs[currentLabIndex]);
  }

  renderTimebar(times);
}

function renderTimebar(times) {
  if (!times.length) {
    elements.timebarLabel.textContent = 'No collection timeline loaded';
    return;
  }

  const first = times[0];
  const last = times[times.length - 1];
  elements.timebarLabel.textContent = `${first}  →  ${last}`;

  if (times.length === 1 || !selectedLabTime) {
    elements.timebarRange.style.left = '10%';
    elements.timebarRange.style.right = '10%';
    return;
  }

  const index = Math.max(0, times.indexOf(selectedLabTime));
  const percent = (index / (times.length - 1)) * 80 + 10;
  elements.timebarRange.style.left = `${Math.max(5, percent - 6)}%`;
  elements.timebarRange.style.right = `${Math.max(5, 100 - percent - 6)}%`;
}

function renderLabDetail(lab) {
  elements.labDetailTitle.textContent = safe(lab.test, 'Result Detail');
  elements.labDetailMeta.textContent = `${safe(lab.category)} | ${safe(lab.collected)} | ${safe(lab.status, 'Final')}`;

  const resultText = `${safe(lab.result, '')}${lab.units ? ' ' + lab.units : ''}`.trim();
  let historyHtml = '<div class="empty-state">No prior trend available.</div>';

  if (Array.isArray(lab.history) && lab.history.length) {
    historyHtml = `
      <table class="history-table">
        <thead><tr><th>Collected</th><th>Result</th><th>Flag</th></tr></thead>
        <tbody>
          ${lab.history.map(item => `
            <tr>
              <td>${escapeHtml(safe(item.collected))}</td>
              <td>${escapeHtml(`${safe(item.result, '')}${item.units ? ' ' + item.units : ''}`.trim())}</td>
              <td class="${flagClass(item.flag)}">${escapeHtml(safe(item.flag, ''))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  elements.labDetailBody.innerHTML = `
    <div class="selected-result-grid">
      <div class="selected-result-box">
        <span class="detail-label">Result</span>
        <div class="detail-value ${flagClass(lab.flag)}">${escapeHtml(resultText)}</div>
      </div>
      <div class="selected-result-box">
        <span class="detail-label">Reference</span>
        <div class="detail-value">${escapeHtml(safe(lab.reference))}</div>
      </div>
      <div class="selected-result-box">
        <span class="detail-label">Flag</span>
        <div class="detail-value ${flagClass(lab.flag)}">${escapeHtml(safe(lab.flag, 'Normal'))}</div>
      </div>
      <div class="selected-result-box">
        <span class="detail-label">Specimen</span>
        <div class="detail-value">${escapeHtml(safe(lab.specimen, '—'))}</div>
      </div>
    </div>
    <div class="detail-section">
      <span class="detail-label">Collected</span>
      <div class="detail-value">${escapeHtml(safe(lab.collected))}</div>
    </div>
    <div class="detail-section">
      <span class="detail-label">History / Trend</span>
      ${historyHtml}
    </div>
  `;
}



function getMARData(data) {
  return data.mar || { date: 'No date loaded', timeSlots: ['0800', '0900', '1000', '1100'], medications: [] };
}

function getMARRowKey(med) {
  return `${safe(med.name)}|${safe(med.dose)}|${safe(med.frequency)}`;
}

function getFilteredMARMeds(marData, completed = false) {
  let meds = Array.isArray(marData.medications) ? marData.medications.filter(med => !!med.completed === completed) : [];
  if (currentMARFilter !== 'all') {
    meds = meds.filter(med => safe(med.category, 'scheduled').toLowerCase() === currentMARFilter);
  }
  return meds;
}

function renderMARTimelineHeader(timeSlots) {
  clearChildren(elements.marTimelineHeader);
  (timeSlots || []).forEach(slot => {
    const cell = document.createElement('div');
    cell.className = 'mar-hour-header';
    cell.textContent = safe(slot);
    elements.marTimelineHeader.appendChild(cell);
  });
}

function createMAREventPill(event) {
  if (!event) return '';
  const state = safe(event.state, '').toLowerCase();
  let cls = 'mar-event-discontinued';
  if (state === 'given') cls = 'mar-event-given';
  else if (state === 'due') cls = 'mar-event-due actionable';
  else if (state === 'held') cls = 'mar-event-held';
  else if (state === 'refused') cls = 'mar-event-refused';
  else if (state === 'notgiven') cls = 'mar-event-notgiven';
  return `<div class="mar-event-pill ${cls}" data-mar-state="${escapeHtml(state)}">${escapeHtml(safe(event.label))}</div>`;
}

function renderMARDetail(med) {
  if (!med) {
    elements.marDetailTitle.textContent = 'Medication Detail';
    elements.marDetailSubtitle.textContent = 'Click a medication row to review linked details.';
    elements.marDetailBadge.classList.add('hidden');
    elements.marDetailBody.innerHTML = '<div class="empty-state">Select a medication from the MAR to see drug class, last 3 doses, and important monitoring information.</div>';
    return;
  }

  const detail = med.detail || {};
  const monitoring = Array.isArray(detail.keyMonitoring) ? detail.keyMonitoring : [];
  const doses = Array.isArray(detail.lastThreeDoses) ? detail.lastThreeDoses : [];
  const hasMonitoring = monitoring.length > 0;

  elements.marDetailTitle.textContent = safe(med.name, 'Medication Detail');
  elements.marDetailSubtitle.textContent = `${safe(med.dose)} | ${safe(med.route)} | ${safe(med.frequency)}`;
  elements.marDetailBadge.classList.toggle('hidden', !hasMonitoring);
  elements.marDetailBadge.textContent = hasMonitoring ? 'Monitoring Linked from JSON' : 'No Monitoring Linked';

  const monitoringHtml = monitoring.length ? monitoring.map(item => `
    <div class="mar-monitor-row">
      <div>
        <div class="mar-monitor-main">${escapeHtml(safe(item.label))}</div>
        <div class="mar-monitor-sub">${escapeHtml(safe(item.note, ''))}</div>
      </div>
      <div class="mar-monitor-value ${item.flagged ? 'flag' : ''}">${escapeHtml(safe(item.value))}</div>
    </div>
  `).join('') : '<div class="empty-state">No linked monitoring information.</div>';

  const dosesHtml = doses.length ? doses.map(item => `
    <div class="mar-dose-row">
      <div>
        <div class="mar-dose-main">${escapeHtml(safe(item.time))}</div>
        <div class="mar-dose-sub">${escapeHtml(safe(item.dose))}</div>
      </div>
      <div></div>
      <div class="mar-dose-status ${safe(item.status, '').toLowerCase().includes('hold') ? 'flag' : ''}">${escapeHtml(safe(item.status))}</div>
    </div>
  `).join('') : '<div class="empty-state">No dose history provided.</div>';

  elements.marDetailBody.innerHTML = `
    <div class="mar-detail-topline">
      <span class="mar-chip">Drug Class: ${escapeHtml(safe(detail.drugClass, 'Not provided'))}</span>
      <span class="mar-chip">Last Admin: ${escapeHtml(safe(med.lastAdmin, '—'))}</span>
    </div>
    <div class="mar-detail-grid">
      <div class="mar-detail-section">
        <h3>Important Nursing Information</h3>
        <div class="detail-value">${escapeHtml(safe(detail.importantInfo, 'No additional medication guidance provided.'))}</div>
      </div>
      <div class="mar-detail-section">
        <h3>Key Monitoring</h3>
        ${monitoringHtml}
      </div>
      <div class="mar-detail-section">
        <h3>Last 3 Doses</h3>
        ${dosesHtml}
      </div>
    </div>
  `;
}

function renderMARRow(med, timeSlots) {
  const row = document.createElement('div');
  const rowKey = getMARRowKey(med);
  row.className = `mar-row mar-clickable ${currentMARSelectedKey === rowKey ? 'selected-mar-row' : ''}`;

  const metaBits = [safe(med.dose), safe(med.route), safe(med.frequency)].filter(Boolean).join(' • ');
  const hasDetail = !!med.detail;
  const left = document.createElement('div');
  left.className = 'mar-row-left';
  left.innerHTML = `
    <div class="mar-med-name">${escapeHtml(safe(med.name))} ${med.dose ? `<span style="font-weight:400;color:#44576c;">• Dose ${escapeHtml(safe(med.dose))}</span>` : ''}</div>
    <div class="mar-med-meta">${escapeHtml(metaBits)}</div>
    <div class="mar-med-subtext">Ordered Admin Amount: ${escapeHtml(safe(med.adminDose, '—'))}${med.concentration ? `<br>Concentration: ${escapeHtml(safe(med.concentration))}` : ''}<br>Last Admin: ${escapeHtml(safe(med.lastAdmin, '—'))}<br>Dispense Location: ${escapeHtml(safe(med.dispenseLocation, '—'))}</div>
    ${hasDetail ? '<span class="mar-hint">Click row for medication details</span>' : ''}
  `;

  const grid = document.createElement('div');
  grid.className = 'mar-row-grid';
  const events = Array.isArray(med.events) ? med.events : [];

  (timeSlots || []).forEach((slot, idx) => {
    const cell = document.createElement('div');
    let classes = ['mar-cell'];
    if (typeof med.orderStartIndex === 'number' && idx < med.orderStartIndex) classes.push('mar-before');
    if (typeof med.discontinuedIndex === 'number' && idx >= med.discontinuedIndex) classes.push('mar-discontinued');
    cell.className = classes.join(' ');

    const event = events.find(ev => Number(ev.slotIndex) === idx);
    let html = event ? createMAREventPill(event) : '';
    if (idx === (timeSlots || []).length - 1 || event) {
      html += `<div class="mar-admin-line">${escapeHtml(safe(slot))}</div>`;
    }
    cell.innerHTML = html;

    const eventPill = cell.querySelector('.mar-event-pill');
    if (eventPill && event && safe(event.state).toLowerCase() === 'due') {
      eventPill.addEventListener('click', clickEvent => {
        clickEvent.stopPropagation();
        openMARActionDialog(med, event);
      });
    }

    grid.appendChild(cell);
  });

  function selectThisMed() {
    currentMARSelectedKey = rowKey;
    renderMARDetail(med);
    renderMARPage(currentPatientData);
  }
  row.addEventListener('click', selectThisMed);

  row.appendChild(left);
  row.appendChild(grid);
  return row;
}

function renderMARPage(data) {
  const marData = getMARData(data);
  const timeSlots = marData.timeSlots || [];
  const activeMeds = getFilteredMARMeds(marData, false);
  const completedMeds = getFilteredMARMeds(marData, true);
  const allVisibleMeds = [...activeMeds, ...completedMeds];

  elements.marDateTitle.textContent = safe(marData.date, 'No date loaded');
  elements.marStatus.textContent = `${activeMeds.length} active meds | ${completedMeds.length} completed/historical`;
  elements.marFilterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.marFilter === currentMARFilter));
  renderMARTimelineHeader(timeSlots);

  if (!currentMARSelectedKey && allVisibleMeds.length) {
    const firstDetailed = allVisibleMeds.find(m => m.detail) || allVisibleMeds[0];
    currentMARSelectedKey = getMARRowKey(firstDetailed);
  }
  if (currentMARSelectedKey && !allVisibleMeds.some(m => getMARRowKey(m) === currentMARSelectedKey)) {
    currentMARSelectedKey = allVisibleMeds.length ? getMARRowKey(allVisibleMeds[0]) : null;
  }

  clearChildren(elements.marRows);
  if (!activeMeds.length) {
    elements.marRows.innerHTML = '<div class="empty-state" style="padding:16px;">No MAR rows loaded for this filter.</div>';
  } else {
    activeMeds.forEach(med => elements.marRows.appendChild(renderMARRow(med, timeSlots)));
  }

  clearChildren(elements.marCompletedRows);
  if (!completedMeds.length) {
    elements.marCompletedRows.innerHTML = '<div class="empty-state" style="padding:16px;">No completed medications loaded.</div>';
  } else {
    completedMeds.forEach(med => elements.marCompletedRows.appendChild(renderMARRow(med, timeSlots)));
  }

  const selected = allVisibleMeds.find(m => getMARRowKey(m) === currentMARSelectedKey) || allVisibleMeds[0] || null;
  renderMARDetail(selected);
}


function getVisibleMedicationOrder(orderId) {
  return (getVisibleCanonicalCase(currentCanonicalCase).orders || []).find(order => order.id === orderId) || null;
}

function openMARActionDialog(med, event) {
  const order = getVisibleMedicationOrder(med.orderId);
  if (!order) return;

  activeMARAction = {
    orderId: med.orderId,
    slotIndex: Number(event.slotIndex),
    time: safe(event.time),
    dose: safe(med.dose),
    route: safe(med.route),
    category: safe(med.category),
    medName: safe(med.name)
  };

  elements.marActionTitle.textContent = safe(med.name);
  elements.marActionSubtitle.textContent = `${safe(med.dose)} | ${safe(med.route)} | Scheduled ${safe(event.time)}`;
  elements.marActionReason.value = '';

  const visibleCanonical = getVisibleCanonicalCase(currentCanonicalCase);
  const monitoring = (order.medication?.monitoringRules || [])
    .map(rule => resolveMonitoringRule(rule, visibleCanonical))
    .filter(Boolean);

  if (monitoring.length) {
    elements.marActionMonitoring.innerHTML = `
      <strong>Pre-administration monitoring</strong>
      ${monitoring.map(item => `
        <div class="mar-monitor-row">
          <div>
            <div class="mar-monitor-main">${escapeHtml(safe(item.label))}</div>
            <div class="mar-monitor-sub">${escapeHtml(safe(item.note))}</div>
          </div>
          <div class="mar-monitor-value flag">${escapeHtml(safe(item.value))}</div>
        </div>
      `).join('')}
    `;
  } else {
    elements.marActionMonitoring.innerHTML = '<div class="empty-state">No linked pre-administration monitoring is configured for this medication.</div>';
  }

  elements.marActionDialog.showModal();
}

function applyMARAction(action) {
  if (!activeMARAction || !currentCanonicalCase) return;

  let admin = (currentCanonicalCase.administrations || []).find(item =>
    item.orderId === activeMARAction.orderId &&
    Number(item.slotIndex) === Number(activeMARAction.slotIndex) &&
    safe(item.time) === safe(activeMARAction.time)
  );

  if (!admin) {
    admin = {
      id: makeStableId('student_admin', activeMARAction.orderId, activeMARAction.time, Date.now()),
      orderId: activeMARAction.orderId,
      slotIndex: activeMARAction.slotIndex,
      time: activeMARAction.time,
      dose: activeMARAction.dose,
      route: activeMARAction.route,
      studentEntered: true
    };
    currentCanonicalCase.administrations.push(admin);
  } else if (!admin.studentEntered && !admin.studentModified) {
    admin.originalState = admin.state;
    admin.originalLabel = admin.label;
    admin.studentModified = true;
  }

  admin.state = action;
  admin.administeredAt = simulationTime;
  admin.comment = elements.marActionReason.value.trim();

  const labelMap = {
    given: `${activeMARAction.time} Given ${activeMARAction.dose}`,
    held: `${activeMARAction.time} Held`,
    refused: `${activeMARAction.time} Refused`,
    notgiven: `${activeMARAction.time} Not Given`
  };
  admin.label = labelMap[action] || `${activeMARAction.time} ${action}`;

  completedBrainTaskIds.add(`mar_${admin.id}`);

  // A PRN administration creates a reassessment task 60 minutes later.
  if (
    action === 'given' &&
    safe(activeMARAction.category).toLowerCase() === 'prn'
  ) {
    const taskId = makeStableId('task_prn_reassessment', admin.id);
    if (!(currentCanonicalCase.simulationTasks || []).some(task => task.id === taskId)) {
      currentCanonicalCase.simulationTasks.push({
        id: taskId,
        type: 'reassessment',
        title: `Reassess response to ${activeMARAction.medName}`,
        detail: 'Document effectiveness and relevant follow-up assessment.',
        dueAt: addSimMinutes(simulationTime, 60),
        target: 'flowsheets',
        status: 'open',
        studentEntered: true
      });
    }
  }

  elements.marActionDialog.close();
  activeMARAction = null;
  refreshSimulationView();
}

function openFlowsheetChartDialog(section = '', field = '', time = '') {
  elements.chartAssessmentSection.value = section || 'Respiratory';
  elements.chartAssessmentField.value = field || '';
  elements.chartAssessmentValue.value = '';
  elements.chartAssessmentTime.value = time && parseSimDate(time) ? time : simulationTime;
  elements.chartAssessmentAbnormal.checked = false;
  elements.chartAssessmentMessage.textContent = '';
  elements.flowsheetChartDialog.showModal();
}

function saveFlowsheetAssessment() {
  if (!currentCanonicalCase) return;

  const section = elements.chartAssessmentSection.value;
  const field = elements.chartAssessmentField.value.trim();
  const value = elements.chartAssessmentValue.value.trim();
  const collected = elements.chartAssessmentTime.value.trim() || simulationTime;

  if (!field || !value) {
    elements.chartAssessmentMessage.textContent = 'Assessment field and value are required.';
    elements.chartAssessmentMessage.className = 'import-message error';
    return;
  }

  if (!parseSimDate(collected)) {
    elements.chartAssessmentMessage.textContent = 'Use YYYY-MM-DD HH:mm for documentation time.';
    elements.chartAssessmentMessage.className = 'import-message error';
    return;
  }

  const id = makeStableId('student_assessment', section, field, collected, Date.now());
  currentCanonicalCase.observations.push({
    id,
    type: 'assessment',
    section,
    code: field.toUpperCase().replace(/[^A-Z0-9]+/g, '_'),
    label: field,
    value,
    collected,
    source: 'Student charting',
    abnormal: elements.chartAssessmentAbnormal.checked,
    studentEntered: true
  });

  currentFlowsheetSelection = id;
  completedBrainTaskIds.add(`care_${field.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${collected}`);

  elements.flowsheetChartDialog.close();
  refreshSimulationView();
  setMainSection('flowsheets');
}

function updateChartReviewDropdown(section) {
  const isOpen = section === 'chartReview';
  if (elements.chartReviewDropdown) elements.chartReviewDropdown.classList.toggle('hidden', !isOpen);
  if (elements.chartReviewCaret) elements.chartReviewCaret.textContent = isOpen ? '▴' : '▾';
}


function getOrdersData(data) {
  const direct = Array.isArray(data.orders) ? data.orders : [];
  if (direct.length) return direct;

  const generated = [];
  (data.nursingOrders || []).forEach(order => {
    generated.push({
      name: order.order,
      category: 'Nursing',
      status: order.status || 'Active',
      frequency: order.frequency || '—',
      start: safe((data.encounter || {}).admitDate, ''),
      provider: safe((data.encounter || {}).attending, ''),
      instructions: '',
      rationale: 'Imported from nursing orders.',
      linkedData: [],
      nursingConsiderations: []
    });
  });

  if ((data.encounter || {}).dietOrder) {
    generated.push({
      name: (data.encounter || {}).dietOrder,
      category: 'Diet',
      status: 'Active',
      frequency: 'Meals',
      start: safe((data.encounter || {}).admitDate, ''),
      provider: safe((data.encounter || {}).attending, ''),
      instructions: 'Diet order imported from encounter snapshot.',
      rationale: '',
      linkedData: [],
      nursingConsiderations: []
    });
  }

  if ((data.encounter || {}).ambulationOrder) {
    generated.push({
      name: (data.encounter || {}).ambulationOrder,
      category: 'Activity',
      status: 'Active',
      frequency: 'As ordered',
      start: safe((data.encounter || {}).admitDate, ''),
      provider: safe((data.encounter || {}).attending, ''),
      instructions: 'Ambulation order imported from encounter snapshot.',
      rationale: '',
      linkedData: [],
      nursingConsiderations: []
    });
  }

  return generated;
}

function normalizeOrderStatus(status) {
  return safe(status, 'Active').toLowerCase();
}

function getOrderStatusClass(status) {
  const normalized = normalizeOrderStatus(status);
  if (normalized.includes('discontinued')) return 'order-status-discontinued';
  if (normalized.includes('completed')) return 'order-status-completed';
  if (normalized.includes('pending')) return 'order-status-pending';
  return 'order-status-active';
}

function getOrderCategories(orders) {
  return ['All Orders', ...Array.from(new Set(orders.map(order => safe(order.category, 'Other'))))];
}

function getFilteredOrders(data) {
  let orders = getOrdersData(data);
  if (currentOrderCategory !== 'All Orders') {
    orders = orders.filter(order => safe(order.category, 'Other') === currentOrderCategory);
  }
  if (currentOrderStatus !== 'all') {
    orders = orders.filter(order => normalizeOrderStatus(order.status).includes(currentOrderStatus));
  }
  return orders;
}

function renderOrderCategoryFilters(orders) {
  clearChildren(elements.orderCategoryFilters);
  getOrderCategories(orders).forEach(category => {
    const categoryOrders = category === 'All Orders'
      ? orders
      : orders.filter(order => safe(order.category, 'Other') === category);

    const btn = document.createElement('button');
    btn.className = `order-category-button ${category === currentOrderCategory ? 'active' : ''}`;
    btn.innerHTML = `
      <span>${escapeHtml(category)}</span>
      <span class="order-category-count">${categoryOrders.length}</span>
    `;
    btn.addEventListener('click', () => {
      currentOrderCategory = category;
      currentOrderIndex = 0;
      renderOrdersPage(currentPatientData);
    });
    elements.orderCategoryFilters.appendChild(btn);
  });
}

function renderOrdersTable(filteredOrders) {
  clearChildren(elements.ordersTableBody);

  if (!filteredOrders.length) {
    elements.ordersTableBody.innerHTML = '<tr><td colspan="6" class="empty-cell">No orders match the selected filters</td></tr>';
    return;
  }

  currentOrderIndex = Math.max(0, Math.min(currentOrderIndex, filteredOrders.length - 1));

  filteredOrders.forEach((order, index) => {
    const row = document.createElement('tr');
    row.className = `order-row ${index === currentOrderIndex ? 'active' : ''}`;
    row.innerHTML = `
      <td>
        <div class="order-name">${escapeHtml(safe(order.name))}</div>
        <div class="order-subtext">${escapeHtml(safe(order.instructions, ''))}</div>
      </td>
      <td>${escapeHtml(safe(order.category))}</td>
      <td><span class="order-status-pill ${getOrderStatusClass(order.status)}">${escapeHtml(safe(order.status, 'Active'))}</span></td>
      <td>${escapeHtml(safe(order.frequency))}</td>
      <td>${escapeHtml(safe(order.start))}</td>
      <td>${escapeHtml(safe(order.provider))}</td>
    `;
    row.addEventListener('click', () => {
      currentOrderIndex = index;
      renderOrdersPage(currentPatientData);
    });
    elements.ordersTableBody.appendChild(row);
  });
}

function renderOrderDetail(order) {
  if (!order) {
    elements.orderDetailTitle.textContent = 'Order Detail';
    elements.orderDetailMeta.textContent = 'Select an order';
    elements.orderDetailBody.innerHTML = '<div class="empty-state">Select an order to review detail, instructions, linked rationale, and nursing considerations.</div>';
    return;
  }

  const linkedData = Array.isArray(order.linkedData) ? order.linkedData : [];
  const nursingConsiderations = Array.isArray(order.nursingConsiderations) ? order.nursingConsiderations : [];

  const linkedHtml = linkedData.length
    ? linkedData.map(item => `<span class="order-linked-chip">${escapeHtml(safe(item))}</span>`).join('')
    : '<div class="empty-state">No linked chart data provided.</div>';

  const considerationsHtml = nursingConsiderations.length
    ? `<ul class="order-detail-list">${nursingConsiderations.map(item => `<li>${escapeHtml(safe(item))}</li>`).join('')}</ul>`
    : '<div class="empty-state">No nursing considerations provided.</div>';

  elements.orderDetailTitle.textContent = safe(order.name, 'Order Detail');
  elements.orderDetailMeta.textContent = `${safe(order.category)} | ${safe(order.status, 'Active')} | ${safe(order.provider)}`;

  elements.orderDetailBody.innerHTML = `
    <div class="order-detail-grid">
      <div class="order-detail-box">
        <span class="detail-label">Status</span>
        <div class="detail-value"><span class="order-status-pill ${getOrderStatusClass(order.status)}">${escapeHtml(safe(order.status, 'Active'))}</span></div>
      </div>
      <div class="order-detail-box">
        <span class="detail-label">Frequency</span>
        <div class="detail-value">${escapeHtml(safe(order.frequency))}</div>
      </div>
      <div class="order-detail-box">
        <span class="detail-label">Start</span>
        <div class="detail-value">${escapeHtml(safe(order.start))}</div>
      </div>
      <div class="order-detail-box">
        <span class="detail-label">End</span>
        <div class="detail-value">${escapeHtml(safe(order.end, '—'))}</div>
      </div>
    </div>

    <div class="order-detail-section">
      <h3>Instructions</h3>
      <div>${escapeHtml(safe(order.instructions, 'No specific instructions provided.'))}</div>
    </div>

    <div class="order-detail-section">
      <h3>Rationale / Clinical Link</h3>
      <div>${escapeHtml(safe(order.rationale, 'No rationale provided.'))}</div>
    </div>

    <div class="order-detail-section">
      <h3>Linked Chart Data</h3>
      <div>${linkedHtml}</div>
    </div>

    <div class="order-detail-section">
      <h3>Nursing Considerations</h3>
      ${considerationsHtml}
    </div>
  `;
}

function renderOrdersPage(data) {
  const allOrders = getOrdersData(data);
  const filteredOrders = getFilteredOrders(data);
  const activeCount = allOrders.filter(order => normalizeOrderStatus(order.status).includes('active')).length;
  const pendingCount = allOrders.filter(order => normalizeOrderStatus(order.status).includes('pending')).length;

  elements.ordersStatus.textContent = `${allOrders.length} total orders | ${activeCount} active | ${pendingCount} pending`;
  elements.ordersPageCount.textContent = `${allOrders.length} orders`;
  elements.ordersTableTitle.textContent = currentOrderCategory;
  elements.ordersListHeading.textContent = currentOrderCategory;
  elements.ordersListCount.textContent = `${filteredOrders.length} displayed`;

  elements.orderFilterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.orderStatus === currentOrderStatus);
  });

  renderOrderCategoryFilters(allOrders);
  renderOrdersTable(filteredOrders);
  renderOrderDetail(filteredOrders[currentOrderIndex] || null);
}


const flowsheetSectionOrder = [
  'Vital Signs','Neurologic','Respiratory','Cardiac','GI','GU','Skin','Musculoskeletal / Mobility','Pain','Safety','Lines / Drains / Airways','Intake / Output'
];
const flowsheetVitalSectionMap = {
  TEMP: ['Vital Signs','Temperature'], HR: ['Vital Signs','Heart Rate'], BP: ['Vital Signs','Blood Pressure'],
  RR: ['Respiratory','Respiratory Rate'], SPO2: ['Respiratory','SpO2'], PAIN: ['Pain','Pain Score']
};
function buildFlowsheetRecords(canonical) {
  const records = [];
  (canonical.observations || []).forEach(obs => {
    if (obs.type === 'assessment') {
      records.push({ id: obs.id, section: safe(obs.section,'Other'), field: safe(obs.label || obs.code), value: `${safe(obs.value)}${obs.units ? ' ' + obs.units : ''}`.trim(), collected: safe(obs.collected), source: safe(obs.source,'Nursing assessment'), details: safe(obs.details,''), abnormal: !!obs.abnormal || !!safe(obs.flag,'') });
    } else if (obs.type === 'vital') {
      const map = flowsheetVitalSectionMap[safe(obs.code).toUpperCase()];
      if (map) records.push({ id: obs.id, section: map[0], field: map[1], value: `${safe(obs.value)}${obs.units ? ' ' + obs.units : ''}`.trim(), collected: safe(obs.collected), source: 'Vital signs', abnormal: !!safe(obs.flag,'') });
    }
  });
  (canonical.devices || []).forEach(device => {
    const collected = safe(device.lastAssessment).match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)?.[0] || safe(device.placementDate);
    records.push({ id: device.id, section: 'Lines / Drains / Airways', field: `${safe(device.deviceType,'Device')}: ${safe(device.type)}`, value: `${safe(device.location)} — ${safe(device.status)}`, collected, source: 'Device record', details: safe(device.lastAssessment), abnormal: false });
    if (device.drainage) records.push({ id: `${device.id}_output`, section: 'Lines / Drains / Airways', field: `${safe(device.type)} Output`, value: safe(device.drainage), collected, source: 'Device record', details: safe(device.lastAssessment), abnormal: false });
  });
  (canonical.ioEvents || []).forEach((io, idx) => {
    if (io.intake !== undefined) records.push({ id: io.id ? `${io.id}_intake` : `io_intake_${idx}`, section: 'Intake / Output', field: 'Intake', value: `${Number(io.intake)||0} mL`, collected: io.date ? `${io.date} ${safe(io.time)}` : safe(io.time), source: 'I&O record', abnormal: false });
    if (io.output !== undefined) records.push({ id: io.id ? `${io.id}_output` : `io_output_${idx}`, section: 'Intake / Output', field: 'Output', value: `${Number(io.output)||0} mL`, collected: io.date ? `${io.date} ${safe(io.time)}` : safe(io.time), source: 'I&O record', abnormal: false });
  });
  // Place every value in an hourly column so the grid reads like an Epic flowsheet
  // instead of one sparse column per exact timestamp.
  const simDate = safe(canonical.timeline?.simulationStart || canonical.encounter?.admitDate, '').slice(0, 10);
  records.forEach(r => { r.col = flowsheetColumnKey(r.collected, simDate); });
  return records;
}

function flowsheetColumnKey(collected, simDate) {
  const text = safe(collected, '');
  let m = text.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}):\d{2}/);
  if (m) return `${m[1]} ${m[2]}:00`;
  // I&O period such as "0700-1100": show it in the column where the period ends.
  m = text.match(/^(?:(\d{4}-\d{2}-\d{2}) )?(\d{2})(\d{2})\s*-\s*(\d{2})(\d{2})$/);
  if (m && (m[1] || simDate)) return `${m[1] || simDate} ${m[4]}:00`;
  return text;
}
function getFlowsheetSections(records) {
  const present = Array.from(new Set(records.map(r => r.section)));
  return [...flowsheetSectionOrder.filter(s => present.includes(s)), ...present.filter(s => !flowsheetSectionOrder.includes(s))];
}
function getFlowsheetTimes(records) { return Array.from(new Set(records.filter(r => !r.practiceHidden).map(r => safe(r.col || r.collected)).filter(Boolean))).sort((a,b)=>String(a).localeCompare(String(b))); }
function renderFlowsheetSectionNav(sections, records) {
  clearChildren(elements.flowsheetSectionNav);
  sections.forEach(section => {
    const btn = document.createElement('button');
    btn.className = 'flowsheet-section-button';
    btn.innerHTML = `<span>${flowsheetCollapsedSections.has(section) ? '▸' : '▾'}</span><span>${escapeHtml(section)}</span><span class="flowsheet-section-count">${records.filter(r=>r.section===section).length}</span>`;
    btn.addEventListener('click',()=>{ flowsheetCollapsedSections.has(section) ? flowsheetCollapsedSections.delete(section) : flowsheetCollapsedSections.add(section); renderFlowsheetsPage(currentPatientData); });
    elements.flowsheetSectionNav.appendChild(btn);
  });
}
function renderFlowsheetHeader(times) {
  clearChildren(elements.flowsheetGridHead);
  const row = document.createElement('tr');
  const label = document.createElement('th'); label.className='flowsheet-label-col'; label.textContent='Assessment'; row.appendChild(label);
  times.forEach(time => { const th=document.createElement('th'); th.className='flowsheet-time-col'; const stamp=epicDate(time).split(' '); th.innerHTML=stamp.length>1 ? `${escapeHtml(stamp[0])}<br><span class="flowsheet-muted">${escapeHtml(stamp[1])}</span>` : escapeHtml(time); row.appendChild(th); });
  elements.flowsheetGridHead.appendChild(row);
}
function renderFlowsheetCellDetail(record) {
  if (!record) { elements.flowsheetDetailTitle.textContent='Flowsheet Detail'; elements.flowsheetDetailMeta.textContent='Select a documented value'; elements.flowsheetDetailBody.innerHTML='<div class="empty-state">Select a flowsheet cell to review its source, documentation time, and related chart data.</div>'; return; }
  elements.flowsheetDetailTitle.textContent=record.field; elements.flowsheetDetailMeta.textContent=`${record.section} | ${safe(record.collected)}`;
  elements.flowsheetDetailBody.innerHTML=`<div class="flowsheet-detail-grid"><div class="flowsheet-detail-box"><span class="detail-label">Value</span><div class="detail-value ${record.abnormal?'flowsheet-abnormal':''}">${escapeHtml(safe(record.value))}</div></div><div class="flowsheet-detail-box"><span class="detail-label">Section</span><div class="detail-value">${escapeHtml(safe(record.section))}</div></div><div class="flowsheet-detail-box"><span class="detail-label">Documented</span><div class="detail-value">${escapeHtml(safe(record.collected))}</div></div><div class="flowsheet-detail-box"><span class="detail-label">Source</span><div class="detail-value">${escapeHtml(safe(record.source))}</div></div></div><div class="flowsheet-detail-section"><h3>Source Record</h3><span class="flowsheet-source-chip">${escapeHtml(safe(record.id))}</span></div>${record.details?`<div class="flowsheet-detail-section"><h3>Additional Detail</h3><div>${escapeHtml(record.details)}</div></div>`:''}`;
}
function renderFlowsheetGrid(records, sections, times) {
  clearChildren(elements.flowsheetGridBody);
  if (!records.length) { elements.flowsheetGridBody.innerHTML='<tr><td class="empty-cell">No flowsheet data loaded.</td></tr>'; return; }
  sections.forEach(section => {
    const sectionRecords=records.filter(r=>r.section===section);
    const sr=document.createElement('tr'); sr.className='flowsheet-section-row';
    const sl=document.createElement('td'); sl.className='flowsheet-label-col flowsheet-section-toggle'; sl.textContent=`${flowsheetCollapsedSections.has(section)?'▸':'▾'} ${section}`; sl.addEventListener('click',()=>{ flowsheetCollapsedSections.has(section)?flowsheetCollapsedSections.delete(section):flowsheetCollapsedSections.add(section); renderFlowsheetsPage(currentPatientData); }); sr.appendChild(sl);
    const spacer=document.createElement('td'); spacer.colSpan=times.length; sr.appendChild(spacer); elements.flowsheetGridBody.appendChild(sr);
    if (flowsheetCollapsedSections.has(section)) return;
    Array.from(new Set(sectionRecords.map(r=>r.field))).forEach(field => {
      const fr=sectionRecords.filter(r=>r.field===field); const row=document.createElement('tr'); const fc=document.createElement('td'); fc.className='flowsheet-label-col flowsheet-field-name'; fc.textContent=field; row.appendChild(fc);
      times.forEach(time=>{ const inCell=fr.filter(r=>!r.practiceHidden && safe(r.col||r.collected)===time); const record=inCell.slice(-1)[0]; const td=document.createElement('td'); td.className='flowsheet-cell'; if(!record){td.classList.add('empty-cell-value'); td.title='Click to chart this assessment'; td.addEventListener('click',()=>openFlowsheetChartDialog(section, field, time));} else { if(record.abnormal) td.classList.add('flowsheet-abnormal'); if(currentFlowsheetSelection===record.id) td.classList.add('selected'); td.textContent=safe(record.value); if(inCell.length>1) td.title=inCell.map(r=>`${epicDate(r.collected)}  ${r.value}`).join('\n'); td.addEventListener('click',()=>{ currentFlowsheetSelection=record.id; renderFlowsheetsPage(currentPatientData); }); } row.appendChild(td); });
      elements.flowsheetGridBody.appendChild(row);
    });
  });
}
function renderFlowsheetsPage(data) {
  const canonical=data?.__canonical || currentCanonicalCase || normalizeCaseData(data).canonical; const records=buildFlowsheetRecords(canonical); const sections=getFlowsheetSections(records); let times=getFlowsheetTimes(records); if(flowsheetLatestOnlyMode && times.length) times=[times[times.length-1]];
  elements.flowsheetStatus.textContent=`${records.length} documented values | ${sections.length} sections`; elements.flowsheetSectionCount.textContent=`${sections.length} sections`; elements.flowsheetDateLabel.textContent=canonical.encounter?.admitDate ? epicDate(canonical.encounter.admitDate) : 'Current encounter'; elements.flowsheetFooterMeta.textContent=times.length?`${times.length} documentation time(s)`:'No documentation times'; elements.flowsheetLatestOnly.classList.toggle('active',flowsheetLatestOnlyMode);
  renderFlowsheetSectionNav(sections,records); renderFlowsheetHeader(times); renderFlowsheetGrid(records,sections,times);
  const selected=records.find(r=>!r.practiceHidden && r.id===currentFlowsheetSelection)||records.find(r=>!r.practiceHidden)||null; if(selected) currentFlowsheetSelection=selected.id; renderFlowsheetCellDetail(selected);
}

function setMainSection(section, tabKey = null) { currentMainSection = section; acknowledgeSection(section); showCurrentSectionOnly(); if (section === 'brain') renderBrainPage(); if (section === 'chartReview') renderChartReviewTab(tabKey || currentChartTab, currentRecordIndex); if (section === 'labResults') renderLabResultsPage(currentPatientData); if (section === 'mar') renderMARPage(currentPatientData); if (section === 'orders') renderOrdersPage(currentPatientData); if (section === 'flowsheets') renderFlowsheetsPage(currentPatientData); }
function validatePatientData(data) { ['patient', 'encounter'].forEach(key => { if (!data || typeof data !== 'object' || !data[key]) throw new Error(`Missing required section: ${key}`); }); if (!data.patient.name) throw new Error('Missing required field: patient.name'); return true; }
function renderPatient(data) { const normalized = normalizeCaseData(data); currentCanonicalCase = normalized.canonical; initializeSimulationState(currentCanonicalCase); refreshSimulationView(false); setMainSection(currentMainSection, currentChartTab); }

function openImportDialog() { elements.importMessage.textContent = ''; elements.importMessage.className = 'import-message'; if (elements.validationSummary) elements.validationSummary.textContent = 'Validation has not been run.'; if (elements.validationResults) elements.validationResults.innerHTML = ''; if (!elements.jsonInput.value.trim()) elements.jsonInput.value = JSON.stringify(legacyToCanonical(samplePatient), null, 2); elements.importDialog.showModal(); }
function applyImport() { try { const parsed = JSON.parse(elements.jsonInput.value); const report = validateCaseInput(parsed); renderValidationReport(report); if (report.errors > 0) { elements.importMessage.textContent = 'Import blocked. Resolve validation errors first.'; elements.importMessage.className = 'import-message error'; return; } renderPatient(report.canonical); elements.importMessage.textContent = report.warnings ? `Patient imported with ${report.warnings} warning(s).` : 'Patient imported successfully.'; elements.importMessage.className = report.warnings ? 'import-message' : 'import-message success'; setTimeout(() => elements.importDialog.close(), 650); } catch (error) { elements.importMessage.textContent = `Import failed: ${error.message}`; elements.importMessage.className = 'import-message error'; } }

document.getElementById('openImportBtn').addEventListener('click', openImportDialog);
document.getElementById('closeImportBtn').addEventListener('click', () => elements.importDialog.close());
document.getElementById('applyImportBtn').addEventListener('click', applyImport);

document.getElementById('validateImportBtn').addEventListener('click', () => {
  try {
    const parsed = JSON.parse(elements.jsonInput.value);
    const report = validateCaseInput(parsed);
    renderValidationReport(report);

    elements.importMessage.textContent = report.errors
      ? 'Validation found blocking errors.'
      : report.warnings
        ? 'Validation passed with warnings.'
        : 'Validation passed.';

    elements.importMessage.className = report.errors
      ? 'import-message error'
      : report.warnings
        ? 'import-message'
        : 'import-message success';
  } catch (error) {
    renderValidationReport({
      errors: 1,
      warnings: 0,
      passes: 0,
      results: [{ severity: 'error', message: `Invalid JSON: ${error.message}` }]
    });

    elements.importMessage.textContent = 'JSON could not be parsed.';
    elements.importMessage.className = 'import-message error';
  }
});

document.getElementById('loadSampleBtn').addEventListener('click', () => { elements.jsonInput.value = JSON.stringify(legacyToCanonical(samplePatient), null, 2); elements.importMessage.textContent = 'Canonical v2 sample loaded. Validate it before importing.'; elements.importMessage.className = 'import-message'; if (elements.validationSummary) elements.validationSummary.textContent = 'Validation has not been run.'; if (elements.validationResults) elements.validationResults.innerHTML = ''; });
document.getElementById('fileInput').addEventListener('change', event => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { elements.jsonInput.value = reader.result; elements.importMessage.textContent = `Loaded file: ${file.name}`; elements.importMessage.className = 'import-message'; }; reader.onerror = () => { elements.importMessage.textContent = 'Unable to read selected file.'; elements.importMessage.className = 'import-message error'; }; reader.readAsText(file); });
elements.navItems.forEach(btn => btn.addEventListener('click', () => setMainSection(btn.dataset.section)));
elements.navSubItems.forEach(btn => btn.addEventListener('click', () => setMainSection('chartReview', btn.dataset.chartTab)));
elements.chartTabs.forEach(btn => btn.addEventListener('click', () => renderChartReviewTab(btn.dataset.chartTab, 0)));
elements.marFilterBtns.forEach(btn => btn.addEventListener('click', () => { currentMARFilter = btn.dataset.marFilter; renderMARPage(currentPatientData); }));
elements.orderFilterBtns.forEach(btn => btn.addEventListener('click', () => { currentOrderStatus = btn.dataset.orderStatus; currentOrderIndex = 0; renderOrdersPage(currentPatientData); }));
elements.flowsheetExpandAll.addEventListener('click', () => { flowsheetCollapsedSections.clear(); renderFlowsheetsPage(currentPatientData); });
elements.flowsheetCollapseAll.addEventListener('click', () => { const canonical=currentPatientData?.__canonical || currentCanonicalCase || normalizeCaseData(currentPatientData).canonical; getFlowsheetSections(buildFlowsheetRecords(canonical)).forEach(section=>flowsheetCollapsedSections.add(section)); renderFlowsheetsPage(currentPatientData); });
elements.flowsheetLatestOnly.addEventListener('click', () => { flowsheetLatestOnlyMode=!flowsheetLatestOnlyMode; renderFlowsheetsPage(currentPatientData); });

elements.flowsheetChartBtn.addEventListener('click', () => openFlowsheetChartDialog());
elements.simulationAdvance30Btn.addEventListener('click', () => advanceSimulation(30));
elements.simulationAdvance60Btn.addEventListener('click', () => advanceSimulation(60));
elements.simulationNextEventBtn.addEventListener('click', advanceToNextSimulationEvent);
elements.simulationResetBtn.addEventListener('click', resetSimulation);

elements.brainFilterBtns.forEach(btn => btn.addEventListener('click', () => {
  brainFilter = btn.dataset.brainFilter;
  elements.brainFilterBtns.forEach(item => item.classList.toggle('active', item.dataset.brainFilter === brainFilter));
  renderBrainPage();
}));

document.getElementById('closeMarActionBtn').addEventListener('click', () => elements.marActionDialog.close());
elements.marActionChoices.forEach(btn => btn.addEventListener('click', () => applyMARAction(btn.dataset.marAction)));

document.getElementById('closeFlowsheetChartBtn').addEventListener('click', () => elements.flowsheetChartDialog.close());
document.getElementById('saveChartAssessmentBtn').addEventListener('click', () => saveFlowsheetAssessment());


if (elements.showAllLabsBtn) elements.showAllLabsBtn.addEventListener('click', () => {
  labFlaggedOnly = false;
  currentLabIndex = 0;
  renderLabResultsPage(currentPatientData);
});
if (elements.showFlaggedLabsBtn) elements.showFlaggedLabsBtn.addEventListener('click', () => {
  labFlaggedOnly = true;
  currentLabIndex = 0;
  renderLabResultsPage(currentPatientData);
});
if (elements.timebarBack) elements.timebarBack.addEventListener('click', () => {
  const times = getLabDateColumns(getFilteredLabsForGrid(getAllLabResults(currentPatientData)));
  const idx = Math.max(0, times.indexOf(selectedLabTime) - 1);
  selectedLabTime = times[idx] || selectedLabTime;
  renderLabResultsPage(currentPatientData);
});
if (elements.timebarForward) elements.timebarForward.addEventListener('click', () => {
  const times = getLabDateColumns(getFilteredLabsForGrid(getAllLabResults(currentPatientData)));
  const idx = Math.min(times.length - 1, times.indexOf(selectedLabTime) + 1);
  selectedLabTime = times[idx] || selectedLabTime;
  renderLabResultsPage(currentPatientData);
});


// ---------------------------------------------------------------------------------------------
// Saved patients (library.js)
let currentLibraryId = null, currentLibraryName = '';
function libEl(id) { return document.getElementById(id); }
function libMessage(text, kind = '') { const box = libEl('libMessage'); box.textContent = text || ''; box.className = `lib-message ${kind}`; }
function libWhen(iso) { try { const d = new Date(iso); return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${String(d.getFullYear()).slice(2)} ${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`; } catch (e) { return ''; } }

async function refreshLibrary() {
  const list = libEl('libList');
  try {
    const rows = await NSLib.list();
    if (!rows.length) { list.innerHTML = '<div class="empty-state">Nothing saved yet. Open a patient, then press Save.</div>'; return; }
    list.innerHTML = rows.map(r => `
      <div class="lib-row ${r.id === currentLibraryId ? 'current' : ''}" data-id="${escapeHtml(r.id)}">
        <div class="lib-info">
          <div class="lib-name">${escapeHtml(r.name)} ${r.id === currentLibraryId ? '<span class="lib-badge">open now</span>' : ''}</div>
          <div class="lib-meta">${escapeHtml(safe(r.meta && r.meta.patientName, ''))}${r.meta && r.meta.age ? ', ' + escapeHtml(String(r.meta.age)) + ' y.o.' : ''} | ${escapeHtml(safe(r.meta && r.meta.diagnosis, '—'))}${r.meta && r.meta.hospitalDay ? ' | hospital day ' + escapeHtml(String(r.meta.hospitalDay)) : ''} | sim ${escapeHtml(epicDate(r.simulationTime))} | saved ${libWhen(r.updatedAt)} | ${r.source === 'ehr' ? 'saved from EHR' : 'from Case Builder'}</div>
        </div>
        <div class="lib-actions">
          <button data-act="load" class="primary-button">Load</button>
          <button data-act="rename" class="secondary-button">Rename</button>
          <button data-act="copy" class="secondary-button">Duplicate</button>
          <button data-act="export" class="secondary-button">Export</button>
          <button data-act="delete" class="secondary-button danger">Delete</button>
        </div>
      </div>`).join('');
  } catch (error) { list.innerHTML = ''; libMessage(error.message, 'error'); }
}

async function saveToLibrary(asNew) {
  if (!currentCanonicalCase) { libMessage('There is no patient open to save.', 'error'); return; }
  try {
    const name = libEl('libSaveName').value.trim();
    const row = await NSLib.save({ id: asNew ? null : currentLibraryId, name, canonical: currentCanonicalCase, simulationTime, source: 'ehr' });
    currentLibraryId = row.id; currentLibraryName = row.name; libEl('libSaveName').value = row.name;
    libMessage(`Saved "${row.name}" at simulation time ${epicDate(simulationTime)}.`, 'success');
    await refreshLibrary();
  } catch (error) { libMessage(error.message, 'error'); }
}

async function loadFromLibrary(id) {
  try {
    const row = await NSLib.get(id);
    if (!row) { libMessage('That saved patient was not found.', 'error'); return; }
    renderPatient(row.canonical);
    if (row.simulationTime) { simulationTime = row.simulationTime; refreshSimulationView(); }
    currentLibraryId = row.id; currentLibraryName = row.name;
    libEl('libSaveName').value = row.name;
    libEl('libraryDialog').close();
  } catch (error) { libMessage(error.message, 'error'); }
}

libEl('openLibraryBtn').addEventListener('click', () => { libMessage(''); libEl('libSaveName').value = currentLibraryName || ''; libEl('libraryDialog').showModal(); refreshLibrary(); });
libEl('closeLibraryBtn').addEventListener('click', () => libEl('libraryDialog').close());
libEl('libSaveBtn').addEventListener('click', () => saveToLibrary(false));
libEl('libSaveNewBtn').addEventListener('click', () => saveToLibrary(true));
libEl('libImportFile').addEventListener('change', async event => {
  const file = event.target.files[0]; if (!file) return;
  try { const row = await NSLib.importFile(file); libMessage(`Imported "${row.name}".`, 'success'); await refreshLibrary(); }
  catch (error) { libMessage(error.message, 'error'); }
  event.target.value = '';
});
libEl('libList').addEventListener('click', async event => {
  const button = event.target.closest('button[data-act]'); if (!button) return;
  const id = button.closest('.lib-row').dataset.id, act = button.dataset.act;
  try {
    if (act === 'load') await loadFromLibrary(id);
    else if (act === 'rename') { const row = await NSLib.get(id); const name = window.prompt('New name for this saved patient:', row.name); if (name) { await NSLib.rename(id, name); if (id === currentLibraryId) currentLibraryName = name; await refreshLibrary(); } }
    else if (act === 'copy') { await NSLib.duplicate(id); await refreshLibrary(); }
    else if (act === 'export') { NSLib.download(await NSLib.get(id)); }
    else if (act === 'delete') { if (window.confirm('Delete this saved patient? This cannot be undone.')) { await NSLib.remove(id); if (id === currentLibraryId) currentLibraryId = null; await refreshLibrary(); } }
  } catch (error) { libMessage(error.message, 'error'); }
});

elements.schemaBlock.textContent = JSON.stringify(canonicalSchemaExample, null, 2);
renderBaseBody();
const savedCase = loadSavedCase();
try {
  if (savedCase) {
    renderPatient(savedCase.canonical);
    if (savedCase.simulationTime) { simulationTime = savedCase.simulationTime; refreshSimulationView(); }
  } else {
    renderPatient(samplePatient);
  }
} catch (error) {
  renderPatient(samplePatient);
}