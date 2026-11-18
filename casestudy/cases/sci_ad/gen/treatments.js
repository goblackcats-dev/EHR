/* In-class SCI patient (Wesley Harcourt): orders, MAR, devices, sticky notes. See ../DESIGN.md sections 11-13.
   ED doses are charted 'given'; the 0.9% sodium chloride shows "0700 Running"; EVERY dose after Mon 0700 is 'due' (the unit RN gives it).
   The indwelling catheter order stays Active at the 1900 stop (the RN removes the catheter by the order's criteria; the device removal is charted by the RN). */
const { at, hOfStamp, hhmm, slug, HOURS } = require('./lib');
const WHO = { ed: 'P. Tolliver, MD', hospN: 'N. Haverty, MD', hospD: 'M. Kincaid, MD', pmr: 'J. Okerlund, DO', wound: 'L. Dunleavy, RN, CWOCN', diet: 'E. Wexford, RD', pharm: 'F. Ashby, PharmD' };
const RN = { ed: 'G. Sotelo, RN' };
const epic = t => `${t.slice(5, 7)}/${t.slice(8, 10)}/${t.slice(2, 4)} ${t.slice(11, 13)}${t.slice(14, 16)}`;
const N = HOURS + 1;                     // MAR columns Mon 03/08 0700 .. Tue 03/09 0700 (25)
const slot = h => (h < 0 ? -1 : Math.min(N - 1, Math.floor(h + 1e-6)));
const T = (d, t) => at(d, t);
const orders = [], admins = []; let seq = 0;
const oid = (k, n) => `order_${k}_${slug(n).slice(0, 40)}_${seq++}`;
const mon = (l, t, c) => ({ label: l, sourceType: t, code: c });
const WBC = mon('WBC', 'lab', 'WBC'), CRP = mon('C-reactive protein (CRP)', 'lab', 'C-reactive protein (CRP)'), UCX = mon('Urine culture (new catheter)', 'lab', 'Urine culture (new catheter)'), CR = mon('Creatinine', 'lab', 'Creatinine'), PLT = mon('Platelets', 'lab', 'Platelets');

function plain(category, name, start, o = {}) {
  const id = oid(slug(category).slice(0, 6), name);
  orders.push(Object.assign({ id, name, category, status: 'Active', frequency: 'Continuous', start, end: '', orderedAt: start, provider: WHO.hospN, instructions: '', rationale: '', linkedData: [], nursingConsiderations: [] }, o)); return id;
}
function med(c) {
  const id = oid('med', c.key || c.name), startH = hOfStamp(c.start), endStamp = c.end || '', dose = c.dose, route = c.route;
  const o = {
    id, name: c.name, category: 'Medication', status: c.status || 'Active', frequency: c.frequency, start: c.start, end: endStamp, orderedAt: c.orderedAt, provider: c.provider || WHO.hospN,
    instructions: c.instructions || `Give ${dose} ${route} ${c.frequency}.`, rationale: c.rationale || '', linkedData: [], nursingConsiderations: c.nursing || [],
    medication: { medKey: c.key || slug(c.name), drugClass: c.drugClass || '', dose, route, importantInfo: c.info || '', monitoringRules: c.monitor || [], highAlert: !!c.highAlert, freqKey: c.frequency, prn: !!c.prn, at: [], hold: c.hold || '', expires: '', barcode: '', expiredDecoy: false, edited: false, custom: false },
    mar: { category: c.kind === 'cont' ? 'continuous' : c.prn ? 'prn' : 'scheduled', orderStartIndex: Math.max(0, Math.min(N - 1, slot(startH))), adminDose: c.adminDose || dose, dispenseLocation: c.dispense || (/^IV/i.test(route) ? 'Central Pharmacy (IV room)' : 'Pharmacy to load in ADS'), completed: false, lastAdmin: '' }
  };
  if (c.concentration) o.mar.concentration = c.concentration;
  if (endStamp) { o.stoppedEarly = !!c.stoppedEarly; o.mar.discontinuedIndex = Math.max(0, Math.min(N - 1, slot(hOfStamp(endStamp)))); }
  orders.push(o);
  const give = (t, state, label, d, extra) => { const h = hOfStamp(t); admins.push(Object.assign({ id: `admin_${id}_${admins.length}`, orderId: id, slotIndex: slot(h), time: hhmm(h), state, label, dose: d || dose, route }, state === 'given' ? { administeredTime: epic(t), administeredAt: t, administeredBy: c.by || RN.ed, availableAt: t } : {}, extra || {})); };
  (c.times || []).forEach((t, i) => give(t, 'given', `${hhmm(hOfStamp(t))} Given ${(c.doses && c.doses[i]) || dose}`, (c.doses && c.doses[i]) || dose));
  (c.events || []).forEach(([t, label, d]) => give(t, 'given', `${hhmm(hOfStamp(t))} ${label}`, d));
  if (c.running) give(T('Mon', '07:00'), 'given', `0700 Running ${c.running} (started in the ED; checked at handoff)`, c.running, { administeredBy: `${RN.ed} (handoff)` });
  // due: [time, dose text, availableAt (optional: the box appears only from then)]
  (c.due || []).forEach(([t, d, avail]) => give(t, 'due', `${hhmm(hOfStamp(t))} Due`, d || dose, avail ? { availableAt: avail } : {}));
  return id;
}

// ---------------- protocol text (DESIGN.md sections 7-8)
const ADP = 'AUTONOMIC DYSREFLEXIA (AD) PROTOCOL (nurse-driven; injury at T4). His baseline SBP is 90-100. SUSPECT AD with SBP 20-40 mmHg above baseline (SBP 120-140 or higher for him) OR any symptom: pounding headache, flushing or sweating above the injury, stuffy nose, blurred vision, slow pulse, goose bumps, anxiety. 1) Stay with him and call for help; SIT HIM UP and LOWER THE LEGS. 2) LOOSEN anything tight: abdominal binder, compression stockings, clothing, leg-bag straps. 3) BP and HR EVERY 2-5 MINUTES until resolved. 4) BLADDER FIRST: check the whole catheter for kinks, clamps, a full bag or a bag above the bladder; if no flow, irrigate gently with 10-15 mL 0.9% sodium chloride at body temperature; if still no flow, replace the catheter (lidocaine 2% jelly). 5) If not the bladder: BOWEL (lidocaine 2% jelly, wait, then check for stool; if SBP is 150 or more give the antihypertensive first), then SKIN (pressure, wrinkles, wounds, nails, tight shoes). 6) A second person CALLS THE PROVIDER at the same time. 7) Antihypertensive ONLY if SBP stays 150 or more after the cause is removed or no cause is found (nitroglycerin 2% ointment order; check for sildenafil in the last 24 h or tadalafil in the last 48 h first). 8) After resolution: BP every 15 minutes for 2 hours; watch urine flow. 9) Document and teach prevention.';

// ---------------- ED (P. Tolliver, MD, Sun 2150), charted as given
const E0 = T('Sun', '21:50');
plain('Lab / Bedside Testing', 'ED labs: CBC with differential, BMP, magnesium, lactate, procalcitonin, CRP, ESR, blood cultures x2 (two sites, before antibiotics), urinalysis and urine culture from a NEW catheter', T('Sun', '22:00'), { orderedAt: E0, provider: WHO.ed, frequency: 'Once', end: T('Sun', '22:10') });
plain('Nursing', 'Insert indwelling urinary catheter 16 Fr (lidocaine 2% jelly); send urine specimens from the new catheter', T('Sun', '22:00'), { orderedAt: E0, provider: WHO.ed, frequency: 'Once', end: T('Sun', '22:00'), rationale: 'Clean specimen from a new catheter (not from his reused intermittent catheter); fever with a neurogenic bladder.' });
med({ key: 'nacl_bolus_ed', name: 'sodium chloride 0.9% bolus (ED)', dose: '1,000 mL over 1 hour', route: 'IV', frequency: 'Once', kind: 'sched', start: T('Sun', '22:00'), end: T('Sun', '23:00'), orderedAt: E0, provider: WHO.ed, drugClass: 'Isotonic crystalloid', rationale: 'Fever, poor intake, BUN/creatinine 31.', times: [T('Sun', '22:00')], doses: ['1,000 mL over 1 hour (2200-2300)'], status: 'Completed' });
med({ key: 'apap_ed', name: 'acetaminophen tablet (ED dose)', dose: '1,000 mg', route: 'Oral', frequency: 'Once', kind: 'sched', start: T('Sun', '22:30'), end: T('Sun', '22:40'), orderedAt: E0, provider: WHO.ed, drugClass: 'Analgesic / antipyretic', rationale: 'Temperature 101.8 F.', times: [T('Sun', '22:30')], status: 'Completed' });
med({ key: 'ceftriaxone_ed', name: 'ceftriaxone injection (ED dose, after cultures)', dose: '1 g', route: 'IV', frequency: 'Once', kind: 'sched', start: T('Sun', '23:00'), end: T('Sun', '23:30'), orderedAt: E0, provider: WHO.ed, drugClass: 'Cephalosporin (third generation)', rationale: 'Febrile complicated UTI; childhood penicillin rash (low cross-reactivity). Give after the blood and urine cultures.', times: [T('Sun', '23:00')], status: 'Completed' });
med({ key: 'nacl09_main', name: 'sodium chloride 0.9% 1,000 mL', dose: '100 mL/h', route: 'IV', frequency: 'Continuous', kind: 'cont', start: T('Sun', '23:00'), end: T('Mon', '11:00'), stoppedEarly: true, orderedAt: T('Sun', '22:50'), provider: WHO.ed, drugClass: 'Isotonic crystalloid', concentration: '1,000 mL bag', dispense: 'Unit stock',
  rationale: 'Maintenance fluid while febrile and drinking poorly.', instructions: '100 mL/h through the left forearm 20 g IV.',
  events: [[T('Sun', '23:00'), 'Started 100 mL/h', '100 mL/h']], running: '100 mL/h', due: [[T('Mon', '07:00'), '100 mL/h (verify rate and bag)'], [T('Mon', '11:00'), 'Stop and saline-lock (order 1050)', T('Mon', '10:50')]] });

// ---------------- admission orders (N. Haverty, MD, Mon 0115)
const A0 = T('Mon', '01:15');
const adm = (cat, name, o = {}) => plain(cat, name, o.start || A0, Object.assign({ orderedAt: A0, provider: WHO.hospN }, o));
adm('Admission', 'Admit inpatient to 4 West Medical-Surgical, room 4W-14: complicated UTI (febrile) in neurogenic bladder, chronic T4 AIS A spinal cord injury; stage 2 sacral pressure injury (present on admission). Attending M. Kincaid, MD (days); N. Haverty, MD (nights)', { frequency: 'Once' });
adm('Code Status', 'Full Code');
adm('Nursing', 'Vital signs every 4 hours. Call provider for SBP greater than 160 or less than 90, HR greater than 120 or less than 50, temperature over 101.5 F, SpO2 under 92%', { end: T('Mon', '10:05'), stoppedEarly: true, frequency: 'Every 4 hours', instructions: 'Standard adult order set call parameters.' });
adm('Nursing', 'Autonomic dysreflexia protocol (nurse-driven)', { instructions: ADP, rationale: 'Chronic T4 injury (above T6), past spinal shock; 3 AD episodes at home. Consortium for Spinal Cord Medicine guideline (2020).' });
med({ key: 'ntg_oint_prn', name: 'nitroglycerin 2% ointment', dose: '1 inch', route: 'Topical', frequency: 'PRN per the AD protocol: SBP 150 or more after the cause search; may repeat once in 30 minutes, then call', kind: 'prn', prn: true, start: A0, orderedAt: A0, provider: WHO.hospN, drugClass: 'Nitrate (vasodilator)',
  instructions: 'Apply 1 inch to the chest ABOVE T4 (where he can feel and where the vessels respond). Do NOT give if sildenafil was taken in the last 24 hours (tadalafil 48 hours). WIPE OFF if SBP falls under 100 or he is lightheaded. Call the provider with every use.', rationale: 'AD rescue if the BP stays high after the cause is removed. Ointment can be wiped off to stop the effect.', info: 'Fast vasodilator. Last sildenafil about 10 days ago (02/26, per patient).' });
adm('Nursing', 'Hold home sildenafil while in the hospital (nitrate PRN ordered)', { rationale: 'Sildenafil plus a nitrate can cause severe low blood pressure.' });
med({ key: 'ceftriaxone_q24', name: 'ceftriaxone injection', dose: '1 g', route: 'IV', frequency: 'Every 24 hours (next dose 2300)', kind: 'sched', start: T('Mon', '23:00'), end: T('Tue', '05:45'), stoppedEarly: true, orderedAt: A0, provider: WHO.hospN, drugClass: 'Cephalosporin (third generation)',
  rationale: 'Febrile complicated UTI; first dose in the ED at 2300 (03/07). Childhood penicillin rash only (low cross-reactivity).', instructions: 'Give 1 g IV over 30 minutes every 24 hours. Next dose Mon 2300.', monitor: [WBC, CRP, UCX], due: [[T('Mon', '23:00'), '1 g IV over 30 minutes']] });
med({ key: 'apap_prn', name: 'acetaminophen tablet', dose: '650 mg', route: 'Oral', frequency: 'Every 6 hours as needed for temperature over 100.4 F or pain (maximum 3,000 mg per day)', kind: 'prn', prn: true, start: A0, orderedAt: A0, provider: WHO.hospN, drugClass: 'Analgesic / antipyretic', rationale: 'Fever; chronic shoulder pain.', times: [T('Mon', '04:30')], by: RN.ed });
adm('Nursing', 'Indwelling urinary catheter: maintain', { end: T('Mon', '19:15'), stoppedEarly: true,
  instructions: 'Secure to the thigh; bag below the bladder and off the floor; CHECK THE TUBING FOR KINKS EVERY 2 HOURS AND WITH EVERY TURN; empty when half full; catheter care daily. RN MAY REMOVE when: afebrile 8 hours or more (without acetaminophen), IV fluids off, and no hourly output needed. Then start intermittent catheterization. Tell the provider when removed.',
  rationale: 'Placed in the ED for a clean specimen and close output monitoring while febrile. His home method is intermittent catheterization; remove as soon as the criteria are met (catheter-associated UTI prevention).' });
adm('Nursing', 'Intermittent catheterization every 4 hours after the indwelling catheter is removed (14 Fr hydrophilic catheter; his own supplies OK); keep volumes under 500 mL', { frequency: 'Every 4 hours', instructions: 'Begin about 3 hours after the indwelling catheter is removed. Lidocaine 2% jelly. Bladder scan if a volume is over 500 mL or with any sign of AD.' });
adm('Nursing', 'Strict intake and output');
adm('Nursing', 'Turn every 2 hours (30-degree side-lying, no lying flat on the sacrum); float heels off the bed; low-air-loss mattress', { frequency: 'Every 2 hours', instructions: 'Check the catheter tubing with every turn.' });
adm('Nursing', 'Wound care, sacrum (stage 2): cleanse with 0.9% sodium chloride, silicone foam border dressing; change every 3 days and as needed if soiled; assess every shift', { instructions: 'Wound/ostomy nurse to see today.' });
med({ key: 'enoxaparin', name: 'enoxaparin injection', dose: '40 mg', route: 'Subcutaneous', frequency: 'Daily at 0900', kind: 'sched', start: T('Mon', '09:00'), orderedAt: A0, provider: WHO.hospN, drugClass: 'Anticoagulant (low molecular weight heparin)', highAlert: true,
  rationale: 'VTE prophylaxis. Clot-risk factors: spinal cord injury with immobility (no leg movement) plus an acute infection.', instructions: 'Abdomen, rotate sites; do not expel the air bubble; do not rub.', monitor: [PLT, CR], due: [[T('Mon', '09:00'), '40 mg']] });
med({ key: 'baclofen', name: 'baclofen tablet', dose: '10 mg', route: 'Oral', frequency: 'Three times a day (0800, 1400, 2000)', kind: 'sched', start: T('Mon', '08:00'), orderedAt: A0, provider: WHO.hospN, drugClass: 'Skeletal muscle relaxant (antispasticity)',
  instructions: 'Give 10 mg by mouth at 0800, 1400 and 2000. DO NOT HOLD OR STOP SUDDENLY.', info: 'Stopping suddenly can cause withdrawal: seizures, high fever, confusion and rebound spasticity.', due: [[T('Mon', '08:00')], [T('Mon', '14:00')], [T('Mon', '20:00')]] });
med({ key: 'oxybutynin', name: 'oxybutynin tablet', dose: '5 mg', route: 'Oral', frequency: 'Three times a day (0800, 1400, 2000)', kind: 'sched', start: T('Mon', '08:00'), orderedAt: A0, provider: WHO.hospN, drugClass: 'Antimuscarinic (bladder)', rationale: 'Bladder spasms and leaking between caths.', due: [[T('Mon', '08:00')], [T('Mon', '14:00')], [T('Mon', '20:00')]] });
med({ key: 'senna', name: 'sennosides 8.6 mg tablet', dose: '17.2 mg (2 tablets)', route: 'Oral', frequency: 'Daily at 1200 (8 hours before the bowel program)', kind: 'sched', start: T('Mon', '12:00'), orderedAt: A0, provider: WHO.hospN, drugClass: 'Stimulant laxative', due: [[T('Mon', '12:00')]] });
med({ key: 'docusate', name: 'docusate sodium capsule', dose: '100 mg', route: 'Oral', frequency: 'Twice a day (0800, 2000)', kind: 'sched', start: T('Mon', '08:00'), orderedAt: A0, provider: WHO.hospN, drugClass: 'Stool softener', due: [[T('Mon', '08:00')], [T('Mon', '20:00')]] });
adm('Nursing', 'Bowel program daily at 2000 on a padded commode chair or left side in bed: lidocaine 2% jelly first, bisacodyl 10 mg suppository, digital stimulation every 10 minutes until done; STOP and follow the AD protocol if symptoms', { start: T('Mon', '20:00'), frequency: 'Daily at 2000', rationale: 'Neurogenic bowel (T4). Last BM Sat 03/06 2100.' });
med({ key: 'bisacodyl_pr', name: 'bisacodyl suppository', dose: '10 mg', route: 'Rectal', frequency: 'Daily at 2000 (bowel program)', kind: 'sched', start: T('Mon', '20:00'), orderedAt: A0, provider: WHO.hospN, drugClass: 'Stimulant laxative', instructions: 'Lidocaine 2% jelly first and wait about 5 minutes; insert against the bowel wall; digital stimulation every 10 minutes. Stop if AD symptoms.', due: [[T('Mon', '20:00')]] });
med({ key: 'lidocaine_jelly', name: 'lidocaine 2% jelly', dose: 'Thin layer (about 5 mL)', route: 'Topical', frequency: 'As needed before bowel care, catheterization, catheter care or a rectal check', kind: 'prn', prn: true, start: A0, orderedAt: A0, provider: WHO.hospN, drugClass: 'Local anesthetic', rationale: 'Blocks the stimulus that can trigger AD.' });
med({ key: 'cholecalciferol', name: 'cholecalciferol (vitamin D3) tablet', dose: '2,000 units', route: 'Oral', frequency: 'Daily at 0800', kind: 'sched', start: T('Mon', '08:00'), orderedAt: A0, provider: WHO.hospN, drugClass: 'Vitamin', rationale: 'Bone loss after SCI.', due: [[T('Mon', '08:00')]] });
adm('Diet', 'Regular diet, high protein; fluids about 2-2.5 L per day spread over the day (less after 2000)', { frequency: 'Meals' });
adm('Activity', 'Slide-board transfers with assist; abdominal binder and thigh-high compression stockings ON before sitting up; raise the head of the bed slowly; orthostatic vital signs with the first sit');
adm('Nursing', 'Incentive spirometer 10 times every hour while awake; assisted (quad) cough as needed', { frequency: 'Every 1 hour while awake' });
adm('Lab / Bedside Testing', 'AM labs Mon 0500: CBC, BMP, magnesium, CRP, ESR, albumin, prealbumin, 25-hydroxy vitamin D', { start: T('Mon', '05:00'), end: T('Mon', '05:00'), frequency: 'Once' });
adm('Consults', 'Consults: wound/ostomy nurse; physical therapy; occupational therapy; physiatry (physical medicine and rehabilitation); dietitian; pharmacy (medication history); case management', { frequency: 'Once' });

// ---------------- Day 1 later orders
plain('Cardiology', 'ECG 12-lead once (phone order during the AD episode)', T('Mon', '09:22'), { orderedAt: T('Mon', '09:22'), provider: WHO.hospD, frequency: 'Once', end: T('Mon', '09:23') });
plain('Nursing', 'Call parameters (replaces the 0115 order-set values): call for SBP 130 or more, OR any AD symptom at any BP; SBP under 80 or a symptomatic drop on sitting up; HR under 50 or over 110; temperature over 100.4 F; SpO2 under 92%. Vital signs every 4 hours', T('Mon', '10:05'), { orderedAt: T('Mon', '10:05'), provider: WHO.hospD, frequency: 'Every 4 hours', rationale: 'His baseline SBP is 90-100: AD starts 20-40 above that, and SBP in the low 90s is his normal.' });
plain('Lab / Bedside Testing', 'CBC and CRP at 1700', T('Mon', '17:00'), { orderedAt: T('Mon', '10:05'), provider: WHO.hospD, frequency: 'Once', end: T('Mon', '17:00') });
plain('Nursing', 'Discontinue 0.9% sodium chloride at 1100; saline lock; flush with 10 mL 0.9% sodium chloride every 8 hours and as needed', T('Mon', '11:00'), { orderedAt: T('Mon', '10:50'), provider: WHO.hospD, frequency: 'Every 8 hours', rationale: 'Drinking well; volume restored (BUN 16).' });
plain('Nursing', 'Wound care update (sacrum, stage 2): same cleansing and silicone foam dressing; in the chair: pressure relief every 15 minutes; use his own air-cell cushion; limit sitting to 1 hour at a time until the sacrum is healing', T('Mon', '12:15'), { orderedAt: T('Mon', '12:15'), provider: WHO.wound });
med({ key: 'protein_supp', name: 'high-protein oral nutrition supplement (8 oz bottle)', dose: '1 bottle', route: 'Oral', frequency: 'Twice a day (1000, 1600)', kind: 'sched', start: T('Mon', '14:00'), orderedAt: T('Mon', '13:10'), provider: `${WHO.hospD} (per ${WHO.diet})`, drugClass: 'Nutrition supplement', rationale: 'Stage 2 pressure injury: protein goal 90-108 g/day (1.25-1.5 g/kg x 72 kg).', due: [[T('Mon', '16:00')]] });
med({ key: 'multivitamin', name: 'multivitamin with minerals tablet', dose: '1 tablet', route: 'Oral', frequency: 'Daily at 0900 (first dose Tue 03/09)', kind: 'sched', start: T('Mon', '14:00'), orderedAt: T('Mon', '13:10'), provider: `${WHO.hospD} (per ${WHO.diet})`, drugClass: 'Vitamin', rationale: 'Wound healing.' });
plain('Lab / Bedside Testing', 'AM labs Tue 0500: CBC, BMP, magnesium, CRP, ESR', T('Tue', '05:00'), { orderedAt: T('Mon', '17:30'), provider: WHO.hospD, frequency: 'Once', end: T('Tue', '05:00') });
// ---------------- Day 2 (culture-guided change)
med({ key: 'ciprofloxacin', name: 'ciprofloxacin tablet', dose: '500 mg', route: 'Oral', frequency: 'Every 12 hours (first dose Tue 0900)', kind: 'sched', start: T('Tue', '05:45'), orderedAt: T('Tue', '05:45'), provider: WHO.hospN, drugClass: 'Fluoroquinolone antibiotic',
  rationale: 'Urine culture: E. coli susceptible to ciprofloxacin and ceftriaxone; RESISTANT to trimethoprim-sulfamethoxazole and ampicillin. Oral step-down to finish 7 days total (through Sun 03/14 0900). Replaces ceftriaxone.',
  instructions: 'First dose Tue 0900, then every 12 hours. Give 2 hours before or 6 hours after calcium, magnesium, iron or zinc products (multivitamin with minerals, antacids, dairy alone).', info: 'Can cause tendon pain, dizziness, sun sensitivity, and low or high glucose. Drink fluids.', monitor: [UCX] });

// ---------------- devices (the indwelling catheter is removed by the unit RN per the order; that removal is charted by the RN)
const dev = (deviceType, type, location, siteMarker, placed, o = {}) => ({ id: `device_${slug(type)}_${slug(location)}_${slug(placed)}`, deviceType, type, location, siteMarker, placementDate: placed, status: o.status || 'Patent', lastAssessment: `${o.assessedAt || placed} - ${o.assess || 'site clean, dry, intact'}`, ...(o.gauge ? { gauge: o.gauge } : {}), ...(o.infusing ? { infusing: o.infusing } : {}), ...(o.drainage ? { drainage: o.drainage } : {}) });
const devices = [
  dev('IV', 'Peripheral IV', 'Left forearm', 'leftForearm', T('Sun', '22:00'), { gauge: '20 gauge', status: 'Infusing', infusing: '0.9% sodium chloride 100 mL/h', assess: 'placed in the ED; clear dressing dated 03/07 2200; no redness or swelling', assessedAt: T('Mon', '06:45') }),
  dev('Tube', 'Indwelling urinary catheter, 16 Fr (10 mL balloon)', 'Urethra to drainage bag', 'pelvis', T('Sun', '22:00'), { status: 'Draining to gravity', drainage: 'Cloudy amber urine with sediment', assess: 'placed in the ED with lidocaine jelly; bag below the bladder; tubing not secured to the thigh', assessedAt: T('Mon', '06:45') })
];
const stickyNotes = [
  { title: 'His baseline BP', body: 'Normal for him: 90-100/56-62, HR 60s-70s (T4 SCI). AD = SBP 20-40 above that or any symptom. AD card at bedside.', availableAt: T('Mon', '07:00') },
  { title: 'Catheter tubing', body: 'Check for kinks with every turn and every 2 h. Bag below bladder, off the floor.', availableAt: T('Mon', '07:00') },
  { title: 'Binder and stockings', body: 'Loosened 0917 for AD. Put them back on before he sits up.', availableAt: T('Mon', '09:50') },
  { title: 'Sister', body: 'Claire Harcourt (emergency contact) bringing his air-cell cushion and supplies about 1600.', availableAt: T('Mon', '10:30') }
];
module.exports = { orders, admins, devices, stickyNotes, WHO, RN, N };
if (require.main === module) { const late = orders.filter(o => o.orderedAt > o.start); console.log('orders', orders.length, 'admins', admins.length, 'devices', devices.length, 'orderedAt after start', late.length); admins.filter(a => a.state !== 'given').forEach(a => console.log(a.time, a.slotIndex, a.state, a.availableAt || '', a.label, orders.find(o => o.id === a.orderId).name.slice(0, 50))); }
