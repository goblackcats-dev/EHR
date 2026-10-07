
let selectedHistory = new Set(["htn", "dm2"]);
let generatedCase = null;
let activeGeneratedTab = "overview";

const $ = id => document.getElementById(id);

function safe(value, fallback = "") {
  return value === undefined || value === null || value === "" ? fallback : String(value);
}

function slug(value) {
  return safe(value).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function uniqueBy(items, keyFn) {
  const map = new Map();
  items.forEach(item => map.set(keyFn(item), item));
  return Array.from(map.values());
}

function getSelectedPrimary() {
  return DIAGNOSIS_PROFILES[$("primaryDiagnosis").value];
}

function init() {
  PRIMARY_KEYS.forEach(key => {
    const profile = DIAGNOSIS_PROFILES[key];
    const option = document.createElement("option");
    option.value = key;
    option.textContent = profile.label;
    $("primaryDiagnosis").appendChild(option);
  });
  $("primaryDiagnosis").value = "pneumonia";

  renderHistoryGrid();
  renderPrimaryDescription();
  renderEffects();
  buildPatient();

  $("primaryDiagnosis").addEventListener("change", () => {
    renderPrimaryDescription();
    renderEffects();
  });

  $("clearHistoryBtn").addEventListener("click", () => {
    selectedHistory.clear();
    renderHistoryGrid();
    renderEffects();
  });

  $("buildBtn").addEventListener("click", buildPatient);
  $("rebuildBtn").addEventListener("click", buildPatient);
  $("resetBtn").addEventListener("click", resetBuilder);
  $("validateBtn").addEventListener("click", () => {
    validateGeneratedCase();
    switchGeneratedTab("validation");
  });
  $("downloadBtn").addEventListener("click", downloadJson);
  $("copyJsonBtn").addEventListener("click", copyJson);
  $("formatJsonBtn").addEventListener("click", formatJsonFromEditor);

  document.querySelectorAll(".generated-tab").forEach(btn => {
    btn.addEventListener("click", () => switchGeneratedTab(btn.dataset.tab));
  });
}

function resetBuilder() {
  $("patientName").value = "Taylor Morgan";
  $("patientAge").value = "68";
  $("patientSex").value = "Male";
  $("patientMrn").value = "SIM-001001";
  $("patientUnit").value = "4 Medical";
  $("patientRoom").value = "414A";
  $("studentLevel").value = "ADN second year";
  $("complexity").value = "moderate";
  $("simulationStart").value = "2026-09-02 07:00";
  $("primaryDiagnosis").value = "pneumonia";
  $("facultyNotes").value = "";
  selectedHistory = new Set(["htn", "dm2"]);
  renderHistoryGrid();
  renderPrimaryDescription();
  renderEffects();
  buildPatient();
}

function renderPrimaryDescription() {
  const profile = getSelectedPrimary();
  $("primaryDescription").textContent = profile.description;
}

function renderHistoryGrid() {
  const grid = $("historyGrid");
  grid.innerHTML = "";

  HISTORY_KEYS.forEach(key => {
    const profile = DIAGNOSIS_PROFILES[key];
    const card = document.createElement("div");
    card.className = `diagnosis-card ${selectedHistory.has(key) ? "selected" : ""}`;
    card.innerHTML = `<strong>${profile.label}</strong><small>${profile.description}</small>`;
    card.addEventListener("click", () => {
      if (selectedHistory.has(key)) selectedHistory.delete(key);
      else selectedHistory.add(key);
      renderHistoryGrid();
      renderEffects();
    });
    grid.appendChild(card);
  });
}

function compactList(items, formatter = x => x) {
  const list = items || [];
  if (!list.length) return "None";
  return list.slice(0, 5).map(formatter).join(", ") + (list.length > 5 ? "…" : "");
}

function renderEffects() {
  const effects = $("effectsList");
  const profiles = [
    { key: $("primaryDiagnosis").value, role: "Primary", profile: getSelectedPrimary() },
    ...Array.from(selectedHistory).map(key => ({ key, role: "History", profile: DIAGNOSIS_PROFILES[key] }))
  ];

  $("effectsEmpty").classList.toggle("hidden", profiles.length > 0);
  effects.innerHTML = "";

  profiles.forEach(item => {
    const p = item.profile;
    const card = document.createElement("div");
    card.className = "effect-card";
    card.innerHTML = `
      <div class="effect-card-header">${item.role}: ${p.label}</div>
      <div class="effect-grid">
        <div><strong>Vitals</strong>${describeVitalEffect(p)}</div>
        <div><strong>Medications</strong>${compactList(p.medications, m => m.name)}</div>
        <div><strong>Labs / Monitoring</strong>${compactList([...(p.labs || []).map(l => l.code), ...(p.monitoring || [])])}</div>
        <div><strong>Diet / Nursing</strong>${safe(p.diet, "No automatic diet change")}${p.orders?.length ? `; ${p.orders.length} order effect(s)` : ""}</div>
      </div>`;
    effects.appendChild(card);
  });
}

function describeVitalEffect(profile) {
  if (profile.vitals) {
    return `Typical acute pattern: BP ${profile.vitals.sbp}/${profile.vitals.dbp}, HR ${profile.vitals.hr}, RR ${profile.vitals.rr}, SpO₂ ${profile.vitals.spo2}%`;
  }
  const a = profile.vitalAdjust || {};
  const parts = [];
  if (a.sbp) parts.push(`SBP ${a.sbp > 0 ? "+" : ""}${a.sbp}`);
  if (a.dbp) parts.push(`DBP ${a.dbp > 0 ? "+" : ""}${a.dbp}`);
  if (a.hr) parts.push(`HR ${a.hr > 0 ? "+" : ""}${a.hr}`);
  if (a.rr) parts.push(`RR ${a.rr > 0 ? "+" : ""}${a.rr}`);
  if (a.spo2) parts.push(`SpO₂ ${a.spo2 > 0 ? "+" : ""}${a.spo2}%`);
  return parts.length ? parts.join(", ") : "No automatic vital adjustment";
}

function buildPatient() {
  const primary = getSelectedPrimary();
  const histories = Array.from(selectedHistory).map(key => DIAGNOSIS_PROFILES[key]);

  const patient = {
    id: `patient_${slug($("patientMrn").value || $("patientName").value)}`,
    mrn: $("patientMrn").value.trim() || `SIM-${Math.floor(100000 + Math.random()*900000)}`,
    name: $("patientName").value.trim() || "Simulated Patient",
    preferredName: ($("patientName").value.trim().split(" ")[0] || "Patient"),
    dob: deriveDob(Number($("patientAge").value || 60)),
    age: Number($("patientAge").value || 60),
    sex: $("patientSex").value,
    pronouns: inferPronouns($("patientSex").value),
    allergies: [{ substance:"NKDA", reaction:"", severity:"" }]
  };

  let vitals = deepClone(primary.vitals || { temp:98.6, hr:80, sbp:124, dbp:76, rr:16, spo2:97, pain:0 });
  histories.forEach(h => applyVitalAdjustments(vitals, h.vitalAdjust || {}));
  normalizeVitals(vitals);

  const problems = [primary.problem, ...histories.map(h => h.problem)].map((problem, idx) => ({
    id: `problem_${slug(problem.name)}`,
    ...deepClone(problem)
  }));

  let labs = [...(primary.labs || []), ...histories.flatMap(h => h.labs || [])];
  labs = mergeLabs(labs);

  let medications = [...(primary.medications || []), ...histories.flatMap(h => h.medications || [])];
  medications = reconcileMedications(medications);

  let orders = [...(primary.orders || []), ...histories.flatMap(h => h.orders || [])];

  const diet = resolveDiet(primary, histories);
  if (diet) {
    orders.push({ name:diet, category:"Diet", frequency:"Meals", instructions:"Diet generated from diagnosis profile.", status:"Active" });
  }

  const renal = selectedHistory.has("ckd3");
  medications = applyRenalSafety(medications, renal);
  orders = applyCrossDiagnosisOrders(orders, selectedHistory, primary);

  const start = $("simulationStart").value.trim() || "2026-09-02 07:00";
  const observations = buildObservations(vitals, labs, primary, histories, start);
  const canonicalOrders = buildCanonicalOrders(orders, medications, start);
  const administrations = buildAdministrations(canonicalOrders, start);
  const notes = buildNotes(primary, histories, problems, vitals, labs, medications, start);
  const devices = inferDevices(primary, histories, start);
  const ioEvents = buildIO(primary, histories, start);

  generatedCase = {
    schemaVersion: "2.0",
    caseMeta: {
      caseId: `case_${slug(primary.label)}_${Date.now()}`,
      title: primary.label,
      studentLevel: $("studentLevel").value,
      complexity: $("complexity").value,
      learningObjectives: buildLearningObjectives(primary, histories)
    },
    patient,
    encounter: {
      id: `encounter_${slug(patient.mrn)}_${start.slice(0,10)}`,
      location: $("patientUnit").value.trim() || "Medical Unit",
      room: $("patientRoom").value.trim() || "SIM",
      attending: "Simulation Hospitalist, MD",
      admitDate: addHours(start, -8),
      diagnosis: primary.problem.name,
      chiefComplaint: deriveChiefComplaint(primary),
      codeStatus: "Full Code",
      isolation: inferIsolation(primary),
      dietOrder: diet || "Regular diet",
      ambulationOrder: inferAmbulation(primary, histories),
      fallRisk: inferFallRisk(primary, histories),
      lastUpdated: start
    },
    problems,
    observations,
    orders: canonicalOrders,
    administrations,
    devices,
    ioEvents,
    stickyNotes: buildStickyNotes(primary, histories),
    notes,
    timeline: {
      marDate: humanDate(start),
      marTimeSlots: ["0800","0900","1000","1100","1200","1300","1400","1500"],
      simulationStart: start,
      simulationEnd: addHours(start, 8)
    },
    simulationTasks: [],
    facultyBuilder: {
      primaryDiagnosisKey: $("primaryDiagnosis").value,
      historyDiagnosisKeys: Array.from(selectedHistory),
      facultyNotes: $("facultyNotes").value.trim()
    }
  };

  renderGeneratedCase();
  validateGeneratedCase();
}

function deriveDob(age) {
  const y = new Date().getFullYear() - age;
  return `${y}-04-18`;
}

function inferPronouns(sex) {
  if (sex === "Female") return "she/her";
  if (sex === "Male") return "he/him";
  return "they/them";
}

function applyVitalAdjustments(v, adj) {
  Object.keys(adj || {}).forEach(key => {
    if (typeof v[key] === "number") v[key] += Number(adj[key] || 0);
  });
}

function normalizeVitals(v) {
  v.sbp = Math.max(82, Math.min(210, Math.round(v.sbp)));
  v.dbp = Math.max(44, Math.min(120, Math.round(v.dbp)));
  v.hr = Math.max(48, Math.min(150, Math.round(v.hr)));
  v.rr = Math.max(10, Math.min(36, Math.round(v.rr)));
  v.spo2 = Math.max(82, Math.min(100, Math.round(v.spo2)));
}

function mergeLabs(labs) {
  const map = new Map();
  labs.forEach(lab => {
    const key = lab.code.toLowerCase();
    if (!map.has(key)) map.set(key, deepClone(lab));
    else {
      const current = map.get(key);
      // Prefer the more clinically abnormal contributor rather than averaging it away.
      if (lab.flag && !current.flag) map.set(key, deepClone(lab));
      else if (lab.code === "Creatinine" && Number(lab.value) > Number(current.value)) map.set(key, deepClone(lab));
      else if (lab.code === "Glucose" && Number(lab.value) > Number(current.value)) map.set(key, deepClone(lab));
      else if (lab.code === "Hemoglobin" && Number(lab.value) < Number(current.value)) map.set(key, deepClone(lab));
    }
  });
  return Array.from(map.values());
}

function reconcileMedications(meds) {
  const map = new Map();
  meds.forEach(med => {
    const key = med.name.toLowerCase();
    if (!map.has(key)) map.set(key, deepClone(med));
  });

  // Avoid duplicate ACEi + conflicting history defaults when not needed.
  return Array.from(map.values());
}

function applyRenalSafety(meds, renal) {
  if (!renal) return meds;
  return meds.map(med => ({
    ...med,
    renalConsideration: true,
    importantInfo: `${safe(med.importantInfo)} ${med.name.toLowerCase().includes("cef") ? "Review renal dosing." : ""}`.trim()
  }));
}

function resolveDiet(primary, histories) {
  const diets = [primary.diet, ...histories.map(h => h.diet)].filter(Boolean);
  if (!diets.length) return null;

  if (selectedHistory.has("ckd3") && selectedHistory.has("dm2")) return "Renal consistent carbohydrate diet";
  if (selectedHistory.has("ckd3") && primary.label.includes("Heart Failure")) return "Renal low-sodium diet; fluid restriction per order";
  if (primary.label.includes("Heart Failure")) return primary.diet;
  if (selectedHistory.has("ckd3")) return "Renal diet";
  if (selectedHistory.has("dm2")) return "Consistent carbohydrate diet";
  if (diets.some(d => /heart healthy/i.test(d))) return "Heart healthy diet";
  return diets[0];
}

function applyCrossDiagnosisOrders(orders, historySet, primary) {
  let result = [...orders];

  if (historySet.has("ckd3")) {
    result.push({
      name:"Renal dosing review",
      category:"Nursing",
      frequency:"With medication reconciliation",
      instructions:"Review renally cleared medications and avoid unnecessary nephrotoxic agents."
    });
  }

  if (historySet.has("dm2")) {
    result.push({
      name:"Hypoglycemia protocol",
      category:"Nursing",
      frequency:"PRN",
      instructions:"Follow facility protocol for low blood glucose."
    });
  }

  if (historySet.has("dementia") || primary.label.includes("Stroke")) {
    result.push({
      name:"Fall precautions",
      category:"Precautions",
      frequency:"Continuous",
      instructions:"Safety interventions and frequent reorientation."
    });
  }

  return uniqueBy(result, o => `${o.category}|${o.name}`.toLowerCase());
}

function buildObservations(vitals, labs, primary, histories, start) {
  const obs = [
    { id:`vital_temp_${slug(start)}`, type:"vital", code:"TEMP", label:"Temperature", value:`${vitals.temp.toFixed(1)} °F`, units:"", collected:start },
    { id:`vital_hr_${slug(start)}`, type:"vital", code:"HR", label:"Heart Rate", value:String(vitals.hr), units:"bpm", collected:start },
    { id:`vital_bp_${slug(start)}`, type:"vital", code:"BP", label:"Blood Pressure", value:`${vitals.sbp}/${vitals.dbp}`, units:"", collected:start },
    { id:`vital_rr_${slug(start)}`, type:"vital", code:"RR", label:"Respiratory Rate", value:String(vitals.rr), units:"/min", collected:start },
    { id:`vital_spo2_${slug(start)}`, type:"vital", code:"SPO2", label:"SpO2", value:String(vitals.spo2), units:"%", collected:start },
    { id:`vital_pain_${slug(start)}`, type:"vital", code:"PAIN", label:"Pain", value:`${vitals.pain}/10`, units:"", collected:start }
  ];

  labs.forEach((lab, idx) => {
    obs.push({
      id:`lab_${slug(lab.code)}_${idx}`,
      type:"lab",
      category:lab.category,
      code:lab.code,
      label:lab.code,
      value:String(lab.value),
      units:lab.units || "",
      flag:lab.flag || "",
      reference:lab.reference || "",
      specimen:"Blood",
      status:"Final",
      collected:addHours(start, -2)
    });
  });

  const assessments = [
    ...(primary.assessments || []),
    ...histories.flatMap(h => h.assessments || [])
  ];

  assessments.forEach((a, idx) => {
    obs.push({
      id:`assessment_${slug(a[0])}_${slug(a[1])}_${idx}`,
      type:"assessment",
      section:a[0],
      code:slug(a[1]).toUpperCase(),
      label:a[1],
      value:a[2],
      collected:start,
      source:"Generated baseline nursing assessment"
    });
  });

  return obs;
}

function buildCanonicalOrders(orders, medications, start) {
  const result = [];

  orders.forEach((o, idx) => {
    result.push({
      id:`order_${slug(o.name)}_${idx}`,
      name:o.name,
      category:o.category,
      status:o.status || "Active",
      frequency:o.frequency || "As ordered",
      start,
      provider:"Simulation Hospitalist, MD",
      instructions:o.instructions || "",
      rationale:"Generated from the patient's diagnosis profile.",
      linkedData:[],
      nursingConsiderations:[]
    });
  });

  medications.forEach((m, idx) => {
    const monitoringRules = [];
    const lname = m.name.toLowerCase();

    if (lname.includes("metoprolol") || lname.includes("carvedilol")) {
      monitoringRules.push({label:"Blood Pressure", sourceType:"vital", code:"BP"});
      monitoringRules.push({label:"Heart Rate", sourceType:"vital", code:"HR"});
    }
    if (lname.includes("warfarin")) {
      monitoringRules.push({label:"PT", sourceType:"lab", code:"PT"});
      monitoringRules.push({label:"INR", sourceType:"lab", code:"INR"});
    }
    if (lname.includes("insulin")) {
      monitoringRules.push({label:"Glucose", sourceType:"lab", code:"Glucose"});
    }
    if (lname.includes("furosemide")) {
      monitoringRules.push({label:"Potassium", sourceType:"lab", code:"Potassium"});
      monitoringRules.push({label:"Creatinine", sourceType:"lab", code:"Creatinine"});
      monitoringRules.push({label:"Blood Pressure", sourceType:"vital", code:"BP"});
    }
    if (lname.includes("lisinopril")) {
      monitoringRules.push({label:"Blood Pressure", sourceType:"vital", code:"BP"});
      monitoringRules.push({label:"Potassium", sourceType:"lab", code:"Potassium"});
      monitoringRules.push({label:"Creatinine", sourceType:"lab", code:"Creatinine"});
    }
    if (lname.includes("oxycodone") || lname.includes("morphine")) {
      monitoringRules.push({label:"Pain", sourceType:"vital", code:"PAIN"});
      monitoringRules.push({label:"Respiratory Rate", sourceType:"vital", code:"RR"});
      monitoringRules.push({label:"SpO2", sourceType:"vital", code:"SPO2"});
    }

    result.push({
      id:`order_med_${slug(m.name)}_${idx}`,
      name:m.name,
      category:"Medication",
      status:"Active",
      frequency:m.frequency,
      start,
      provider:"Simulation Hospitalist, MD",
      instructions:`Administer ${m.dose} ${m.route} ${m.frequency}.`,
      rationale:"Generated from diagnosis profile.",
      linkedData:[],
      nursingConsiderations:m.renalConsideration ? ["Review renal function and renal dosing."] : [],
      medication:{
        medKey:slug(m.name),
        drugClass:m.drugClass || "",
        dose:m.dose,
        route:m.route,
        importantInfo:m.importantInfo || "",
        monitoringRules
      },
      mar:{
        category:/prn/i.test(m.frequency) ? "prn" : "scheduled",
        orderStartIndex:0,
        adminDose:m.dose,
        dispenseLocation:"Central Pharmacy"
      }
    });
  });

  return result;
}

function buildAdministrations(orders, start) {
  const slots = ["0800","0900","1000","1100","1200","1300","1400","1500"];
  const result = [];
  orders.filter(o => o.category === "Medication").forEach((order, idx) => {
    let time = "0900";
    if (/BID/i.test(order.frequency)) time = "0900";
    if (/night/i.test(order.frequency)) time = "2100";
    if (/1800/.test(order.frequency)) time = "1800";
    if (/PRN/i.test(order.frequency)) time = "1200";
    const slotIndex = Math.max(0, slots.indexOf(time));
    result.push({
      id:`admin_${slug(order.id)}_1`,
      orderId:order.id,
      slotIndex,
      time,
      state:"due",
      label:`${time} Due`,
      dose:order.medication?.dose || "",
      route:order.medication?.route || ""
    });
  });
  return result;
}

function buildNotes(primary, histories, problems, vitals, labs, meds, start) {
  const problemSections = problems.map(problem => {
    const evidence = [];
    const treatments = [];

    if (problem.name === primary.problem.name) {
      (primary.notes || []).forEach(n => evidence.push(n));
      labs.filter(l => primary.labs?.some(pl => pl.code === l.code)).slice(0,3).forEach(l => evidence.push(`${l.code} ${l.value} ${l.units}${l.flag ? ` (${l.flag})` : ""}`));
      meds.filter(m => primary.medications?.some(pm => pm.name === m.name)).forEach(m => treatments.push(`${m.name} ${m.dose} ${m.route} ${m.frequency}`));
    } else {
      const h = histories.find(x => x.problem?.name === problem.name);
      (h?.notes || []).forEach(n => evidence.push(n));
      (h?.labs || []).slice(0,2).forEach(l => evidence.push(`${l.code} ${l.value} ${l.units}${l.flag ? ` (${l.flag})` : ""}`));
      meds.filter(m => h?.medications?.some(hm => hm.name === m.name)).forEach(m => treatments.push(`${m.name} ${m.dose} ${m.route} ${m.frequency}`));
    }

    if (!evidence.length) evidence.push("Diagnosis present in medical history and incorporated into current plan.");
    if (!treatments.length) treatments.push("Continue monitoring and chronic disease management as appropriate.");

    return {
      problemId:`problem_${slug(problem.name)}`,
      problem:problem.name,
      evidence,
      treatments
    };
  });

  return [
    {
      id:"note_hospitalist_generated",
      type:"progressNotes",
      title:"Hospitalist Progress Note",
      author:"Simulation Hospitalist, MD",
      datetime:addHours(start, 1),
      category:"Progress Note",
      summary:`Generated problem-oriented progress note for ${primary.label}.`,
      problemSections
    },
    {
      id:"note_nursing_generated",
      type:"progressNotes",
      title:"Nursing Progress Note",
      author:"Simulation RN",
      datetime:start,
      category:"Progress Note",
      summary:"Baseline nursing assessment completed.",
      body:`Patient assessed at ${start}. Primary concern: ${primary.problem.name}. Current BP ${vitals.sbp}/${vitals.dbp}, HR ${vitals.hr}, RR ${vitals.rr}, SpO2 ${vitals.spo2}%. Continue ordered monitoring and safety interventions.`
    }
  ];
}

function inferDevices(primary, histories, start) {
  const devices = [
    {
      id:"device_piv_right_forearm",
      deviceType:"IV",
      type:"Peripheral IV",
      location:"Right forearm",
      siteMarker:"rightForearm",
      gauge:"20 gauge",
      infusing:"Saline lock",
      placementDate:addHours(start,-4),
      lastAssessment:`${start} - site clean, dry, intact`,
      status:"Patent"
    }
  ];

  if (primary.label.includes("Heart Failure") || primary.label.includes("Sepsis")) {
    devices[0].infusing = primary.label.includes("Sepsis") ? "0.9% NS per order" : "Saline lock";
  }

  if (primary.label.includes("Postoperative")) {
    devices.push({
      id:"device_jp_rlq",
      deviceType:"Drain",
      type:"JP drain",
      location:"Right lower quadrant",
      siteMarker:"abdomenRLQ",
      placementDate:addHours(start,-12),
      lastAssessment:`${start} - compressed and patent`,
      drainage:"35 mL serosanguineous",
      status:"Active"
    });
  }

  return devices;
}

function buildIO(primary, histories, start) {
  const lowOutput = selectedHistory.has("ckd3");
  return [
    { id:"io_0700_1100", time:"0700-1100", intake:480, output:lowOutput ? 180 : 320 },
    { id:"io_1100_1500", time:"1100-1500", intake:360, output:lowOutput ? 160 : 300 }
  ];
}

function buildStickyNotes(primary, histories) {
  const notes = [
    { title:"Nurse handoff", body:`Primary issue: ${primary.problem.name}. Review generated orders and priority monitoring.` }
  ];
  if (selectedHistory.has("dementia")) notes.push({ title:"Safety", body:"Baseline cognitive impairment. Reorient frequently and compare any acute change with baseline." });
  if (selectedHistory.has("ckd3")) notes.push({ title:"Renal considerations", body:"Review renal dosing and avoid unnecessary nephrotoxic agents." });
  return notes;
}

function buildLearningObjectives(primary, histories) {
  const objectives = [
    `Prioritize nursing care for ${primary.problem.name}.`,
    "Connect abnormal assessment and laboratory findings to active orders and medications.",
    "Use the MAR and flowsheet to safely document care."
  ];
  if (selectedHistory.has("ckd3")) objectives.push("Recognize renal implications for diet, medication selection, and monitoring.");
  if (selectedHistory.has("dm2")) objectives.push("Coordinate glucose monitoring, meals, and insulin administration.");
  if (selectedHistory.has("afib")) objectives.push("Apply rate-control and anticoagulation monitoring.");
  return objectives.slice(0,5);
}

function deriveChiefComplaint(primary) {
  const map = {
    pneumonia:"Shortness of breath and productive cough",
    chf:"Increasing dyspnea, orthopnea, and bilateral leg swelling",
    copd_exacerbation:"Worsening shortness of breath and wheezing",
    sepsis:"Fever, weakness, and worsening clinical status",
    stroke:"New unilateral weakness and speech difficulty",
    uti:"Dysuria, urinary frequency, and fever",
    post_op_abdominal:"Postoperative pain and recovery after abdominal surgery"
  };
  return map[$("primaryDiagnosis").value] || primary.problem.name;
}

function inferIsolation(primary) {
  if ($("primaryDiagnosis").value === "pneumonia") return "Droplet precautions";
  return "None";
}

function inferAmbulation(primary, histories) {
  if ($("primaryDiagnosis").value === "stroke") return "Up with assistance; fall precautions";
  if ($("primaryDiagnosis").value === "post_op_abdominal") return "Up with assistance; ambulate TID";
  if (selectedHistory.has("dementia")) return "Up with assistance";
  return "Up as tolerated with assistance as needed";
}

function inferFallRisk(primary, histories) {
  if ($("primaryDiagnosis").value === "stroke" || selectedHistory.has("dementia")) return "High";
  if ($("primaryDiagnosis").value === "post_op_abdominal" || selectedHistory.has("obesity")) return "Moderate";
  return "Moderate";
}

function addHours(value, hours) {
  const d = new Date(value.replace(" ","T") + ":00");
  d.setHours(d.getHours()+hours);
  const pad = n => String(n).padStart(2,"0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function humanDate(value) {
  const d = new Date(value.replace(" ","T") + ":00");
  return d.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
}

function renderGeneratedCase() {
  if (!generatedCase) return;

  $("summaryProblems").textContent = generatedCase.problems.length;
  $("summaryOrders").textContent = generatedCase.orders.length;
  $("summaryMeds").textContent = generatedCase.orders.filter(o => o.category === "Medication").length;
  $("summaryLabs").textContent = generatedCase.observations.filter(o => o.type === "lab").length;

  renderOverview();
  renderProblems();
  renderVitals();
  renderMedications();
  renderOrders();
  renderLabs();
  renderDiet();
  $("jsonOutput").value = JSON.stringify(generatedCase,null,2);
}

function sectionCard(title, body) {
  return `<div class="section-card"><h3>${title}</h3><div class="section-card-body">${body}</div></div>`;
}

function renderOverview() {
  const c = generatedCase;
  const history = c.problems.slice(1).map(p => `<span class="chip">${p.name}</span>`).join("");
  $("generatedOverview").innerHTML =
    sectionCard("Patient", `<strong>${c.patient.name}</strong>, ${c.patient.age}-year-old ${c.patient.sex.toLowerCase()}<br>${c.encounter.location}, Room ${c.encounter.room}<br>Simulation starts ${c.timeline.simulationStart}`) +
    sectionCard("Primary Problem", `<strong>${c.encounter.diagnosis}</strong><br>${c.encounter.chiefComplaint}`) +
    sectionCard("Medical History", history || "No history diagnoses selected.") +
    sectionCard("Generated Care Context", `<strong>Diet:</strong> ${c.encounter.dietOrder}<br><strong>Activity:</strong> ${c.encounter.ambulationOrder}<br><strong>Fall Risk:</strong> ${c.encounter.fallRisk}<br><strong>Isolation:</strong> ${c.encounter.isolation}`) +
    sectionCard("Faculty Direction", safe(c.facultyBuilder.facultyNotes,"No additional faculty direction supplied."));
}

function renderProblems() {
  $("generatedProblems").innerHTML = generatedCase.problems.map(p =>
    sectionCard(p.name, `<span class="chip">${p.status}</span><br>${p.details}`)
  ).join("");
}

function renderVitals() {
  const codes = ["TEMP","HR","BP","RR","SPO2","PAIN"];
  const obs = generatedCase.observations.filter(o => o.type === "vital" && codes.includes(o.code));
  $("generatedVitals").innerHTML = `<table class="data-table"><thead><tr><th>Vital</th><th>Value</th><th>Time</th></tr></thead><tbody>${
    obs.map(o => `<tr><td>${o.label}</td><td>${o.value}${o.units ? " "+o.units : ""}</td><td>${o.collected}</td></tr>`).join("")
  }</tbody></table>`;
}

function renderMedications() {
  const meds = generatedCase.orders.filter(o => o.category === "Medication");
  $("generatedMedications").innerHTML = `<table class="data-table"><thead><tr><th>Medication</th><th>Dose / Route</th><th>Frequency</th><th>Class</th><th>Important Nursing Information</th></tr></thead><tbody>${
    meds.map(o => `<tr><td>${o.name}</td><td>${o.medication.dose} ${o.medication.route}</td><td>${o.frequency}</td><td>${o.medication.drugClass}</td><td>${o.medication.importantInfo}</td></tr>`).join("")
  }</tbody></table>`;
}

function renderOrders() {
  $("generatedOrders").innerHTML = `<table class="data-table"><thead><tr><th>Order</th><th>Category</th><th>Frequency</th><th>Instructions</th></tr></thead><tbody>${
    generatedCase.orders.map(o => `<tr><td>${o.name}</td><td>${o.category}</td><td>${o.frequency}</td><td>${o.instructions}</td></tr>`).join("")
  }</tbody></table>`;
}

function renderLabs() {
  const labs = generatedCase.observations.filter(o => o.type === "lab");
  $("generatedLabs").innerHTML = `<table class="data-table"><thead><tr><th>Lab</th><th>Result</th><th>Flag</th><th>Reference</th></tr></thead><tbody>${
    labs.map(o => `<tr><td>${o.label}</td><td>${o.value} ${o.units}</td><td>${o.flag || ""}</td><td>${o.reference || ""}</td></tr>`).join("")
  }</tbody></table>`;
}

function renderDiet() {
  const specialOrders = generatedCase.orders.filter(o => ["Diet","Precautions","Activity","Nursing"].includes(o.category));
  $("generatedDiet").innerHTML =
    sectionCard("Diet", generatedCase.encounter.dietOrder) +
    sectionCard("Activity", generatedCase.encounter.ambulationOrder) +
    sectionCard("Safety / Nursing", specialOrders.map(o => `<div><span class="chip">${o.category}</span> <strong>${o.name}</strong>: ${o.instructions}</div>`).join("") || "No additional safety orders.");
}

function validateGeneratedCase() {
  if (!generatedCase) return [];

  const results = [];
  const add = (level,msg) => results.push({level,msg});

  if (!generatedCase.patient.name) add("error","Patient name is missing.");
  else add("pass","Patient identity is populated.");

  if (!generatedCase.problems.length) add("error","No problems generated.");
  else add("pass",`${generatedCase.problems.length} problem(s) generated.`);

  const ids = [
    ...generatedCase.problems.map(x=>x.id),
    ...generatedCase.observations.map(x=>x.id),
    ...generatedCase.orders.map(x=>x.id),
    ...generatedCase.administrations.map(x=>x.id),
    ...generatedCase.devices.map(x=>x.id),
    ...generatedCase.notes.map(x=>x.id)
  ];
  const dup = ids.filter((id,i)=>ids.indexOf(id)!==i);
  if (dup.length) add("error",`Duplicate IDs: ${Array.from(new Set(dup)).join(", ")}`);
  else add("pass","All clinical object IDs are unique.");

  const orderIds = new Set(generatedCase.orders.map(o=>o.id));
  const dangling = generatedCase.administrations.filter(a=>!orderIds.has(a.orderId));
  if (dangling.length) add("error","One or more MAR administrations do not reference a valid medication order.");
  else add("pass","All MAR administrations link to valid orders.");

  if (selectedHistory.has("ckd3")) {
    if (!/renal/i.test(generatedCase.encounter.dietOrder)) add("warning","CKD is selected but diet is not explicitly renal.");
    else add("pass","CKD contributes a renal diet.");
    if (!generatedCase.orders.some(o=>/renal dosing/i.test(o.name))) add("warning","CKD is selected but no renal dosing review order is present.");
    else add("pass","CKD contributes renal medication-safety logic.");
  }

  if (selectedHistory.has("dm2")) {
    const hasGlucose = generatedCase.observations.some(o=>o.type==="lab" && o.code==="Glucose");
    const hasPoc = generatedCase.orders.some(o=>/point-of-care blood glucose/i.test(o.name));
    if (!hasGlucose || !hasPoc) add("warning","Diabetes is selected but glucose monitoring is incomplete.");
    else add("pass","Diabetes contributes hyperglycemia and ACHS monitoring.");
  }

  if (selectedHistory.has("htn")) {
    const bp = generatedCase.observations.find(o=>o.code==="BP");
    const hasAntihypertensive = generatedCase.orders.some(o=>o.category==="Medication" && /lisinopril|metoprolol|carvedilol|amlodipine/i.test(o.name));
    if (!bp || !hasAntihypertensive) add("warning","Hypertension profile did not fully populate BP/medication logic.");
    else add("pass","Hypertension contributes BP trend and antihypertensive therapy.");
  }

  if (selectedHistory.has("afib")) {
    const hasINR = generatedCase.observations.some(o=>o.code==="INR");
    const hasWarfarin = generatedCase.orders.some(o=>/warfarin/i.test(o.name));
    if (hasWarfarin && !hasINR) add("error","Warfarin is present without INR data.");
    else add("pass","Atrial fibrillation anticoagulation monitoring is internally linked.");
  }

  const activeProblemNames = generatedCase.problems.filter(p=>p.status==="Active").map(p=>p.name);
  const hospitalist = generatedCase.notes.find(n=>n.title==="Hospitalist Progress Note");
  const covered = activeProblemNames.every(name => hospitalist?.problemSections?.some(s=>s.problem===name));
  if (!covered) add("warning","Not every active problem is addressed in the hospitalist note.");
  else add("pass","Hospitalist note addresses every active problem.");

  const warnings = results.filter(r=>r.level==="warning").length;
  $("summaryWarnings").textContent = warnings;

  $("generatedValidation").innerHTML = results.map(r =>
    `<div class="validation-row validation-${r.level}"><strong>${r.level}</strong><div>${r.msg}</div></div>`
  ).join("");

  return results;
}

function switchGeneratedTab(tab) {
  activeGeneratedTab = tab;
  document.querySelectorAll(".generated-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.tab===tab));
  const map = {
    overview:"generatedOverview",
    problems:"generatedProblems",
    vitals:"generatedVitals",
    medications:"generatedMedications",
    orders:"generatedOrders",
    labs:"generatedLabs",
    diet:"generatedDiet",
    json:"generatedJson",
    validation:"generatedValidation"
  };
  Object.entries(map).forEach(([key,id]) => $(id).classList.toggle("hidden", key!==tab));
}

function formatJsonFromEditor() {
  try {
    const parsed = JSON.parse($("jsonOutput").value);
    $("jsonOutput").value = JSON.stringify(parsed,null,2);
    generatedCase = parsed;
  } catch (e) {
    alert("JSON could not be parsed: "+e.message);
  }
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText($("jsonOutput").value);
    $("copyJsonBtn").textContent = "Copied";
    setTimeout(()=>$("copyJsonBtn").textContent="Copy JSON",1000);
  } catch {
    $("jsonOutput").select();
    document.execCommand("copy");
  }
}

function downloadJson() {
  if (!generatedCase) return;
  try {
    const parsed = JSON.parse($("jsonOutput").value);
    generatedCase = parsed;
  } catch {}
  const blob = new Blob([JSON.stringify(generatedCase,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug(generatedCase.caseMeta?.title || "nursingsim_case")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

init();
