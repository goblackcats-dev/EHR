/* Orthopedic / GI primary diagnoses: hip fracture, upper GI bleed, acute pancreatitis, acute diverticulitis.
   Everything is in hours since admission (h = 0 is arrival). */
NS.PRIMARY = NS.PRIMARY || {};
NS.OG = NS.OG || {};

// shared helpers for the four profiles in this file
(() => {
  const U = NS.util;
  // first clock time ("HH:MM") strictly after hour `afterH` (hours since admission)
  NS.OG.atClock = (ctx, hhmm, afterH) => {
    let h = ctx.hOf(`${U.dateOnly(ctx.admit)} ${hhmm}`);
    while (h <= afterH + 1e-6) h += 24;
    return Math.round(h * 100) / 100;
  };
  NS.OG.clock = (ctx, h) => U.hhmm(ctx.ts(h));
})();

// ================================================================================================
// HIP FRACTURE
// ================================================================================================
(() => {
  const U = NS.util, C = NS.C, { atClock, clock } = NS.OG;

  NS.PRIMARY.hip_fracture = {
    key: 'hip_fracture', label: 'Hip Fracture', group: 'Surgical', cat: 'Orthopedic / Trauma', typicalLOS: [4, 6],
    desc: 'Fall with femoral neck or intertrochanteric fracture in an older adult. Day 1: ED, nerve block, NPO after midnight. Day 2: surgery (hemiarthroplasty or IM nail). Day 3-4: POD 1-2 mobilization, Foley out, anemia watch. Day 4-6: SNF/rehab. Day 7+: discharge delayed.',
    build(ctx) {
      const arthro = ctx.age >= 75;                                   // displaced femoral neck -> hemiarthroplasty; otherwise intertrochanteric -> IM nail
      const side = ctx.age % 2 ? 'Right' : 'Left', sl = side.toLowerCase();
      const npoH = atClock(ctx, '00:00', 6), orH = atClock(ctx, '08:00', npoH), dur = arthro ? 1.5 : 1.25, orEnd = orH + dur;
      const foleyOut = atClock(ctx, '06:00', orEnd + 6), pod1 = atClock(ctx, '05:00', orEnd + 6), pod2 = pod1 + 24, pod3 = pod1 + 48, pod4 = pod1 + 72;
      const ptH = atClock(ctx, '10:00', orEnd + 6), dietH = orEnd + 2;
      const orTime = clock(ctx, orH);
      const lowDose = ctx.age >= 85 || ctx.weightKg < 55;
      const hm = Object.assign(C.hydromorphone(), { dose: '0.25 mg', prnInterval: 'Every 3 hours' });
      const morphine = Object.assign(C.opioidIV(ctx, { start: 0.5, stop: orEnd + 22, given: [0.5, 3.4, 9.6, 15.5, 21.5, 26.5, orEnd + 2.5, orEnd + 7, orEnd + 13, orEnd + 19] }),
        { dose: '2 mg', by: 'ed', alt: hm, renal: { ckd3: { avoid: true, sub: hm }, esrd: { avoid: true, sub: hm } }, info: 'HIGH-ALERT. Low starting dose for an older adult. Assess pain, sedation (RASS), RR and SpO2 before and 15-30 minutes after. Hold for RR below 10 or oversedation. Watch for new confusion.' });
      const oxy = Object.assign(C.opioidPO(ctx, { start: 3, given: [7.5, 14, 20, 27.5, orEnd + 11, orEnd + 24, orEnd + 31, orEnd + 40, orEnd + 52] }),
        { dose: lowDose ? '2.5 mg' : '5 mg', sips: true, by: 'surgeon', info: 'HIGH-ALERT. Low dose for age. Assess pain and sedation before and 30-60 minutes after. Hold for RR below 10 or oversedation. Give with a bowel regimen. Opioids are a leading cause of post-operative delirium and falls.', alt: Object.assign(C.tramadol(), { dose: ctx.age >= 75 ? '25 mg' : '50 mg' }) });
      const cefazolin = { key: 'cefazolin', name: 'cefazolin (ANCEF) IVPB', dose: ctx.weightKg >= 120 ? '3 g' : '2 g', route: 'IV', freq: 'q8h', stat: true, startH: orH - 0.5, stopH: orH + 20, volume: 100, cls: 'Cephalosporin antibiotic',
        info: 'Surgical prophylaxis: first dose within 60 minutes before incision, then every 8 hours for no more than 24 hours. Low cross-reactivity with penicillin; verify reaction history. Infuse over 30 minutes.', monitor: ['Temp', 'WBC', 'Cr'], indication: 'Surgical site infection prophylaxis (24 hours)', by: 'surgeon',
        avoid: ['cephalosporin', 'cefazolin'], alt: { key: 'vancomycin_ppx', name: 'vancomycin IVPB', dose: `${Math.round(ctx.weightKg * 15 / 250) * 250} mg`, freq: 'q12h', cls: 'Glycopeptide antibiotic', info: 'Used because of cephalosporin allergy. Start infusion 60-120 minutes before incision; infuse over at least 90 minutes. Watch for red man reaction.', monitor: ['Cr'] },
        renal: { ckd3: { freq: 'q12h', note: 'Interval extended for reduced kidney function.' }, esrd: { freq: 'q24h', note: 'Interval extended for ESRD.' } } };
      const spec = {
        primaryTeam: 'surgeon', typicalLOS: [4, 6], fallRiskBoost: 2, noBowelRegimen: true,
        problem: { name: arthro ? 'Hip fracture (femoral neck)' : 'Hip fracture (intertrochanteric)', details: `${side} hip fracture after a ground-level fall; ${arthro ? 'hemiarthroplasty' : 'intramedullary nail fixation'} planned within 24-48 hours.` },
        chief: `${side} hip pain after a fall; unable to bear weight`,
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} who tripped on the way to the bathroom at night and fell onto the ${sl} side from standing height. Immediate severe ${sl} hip and groin pain with inability to stand or bear weight; the ${sl} leg was shortened and turned outward when EMS arrived. No loss of consciousness, head strike, chest pain, palpitations or preceding dizziness. Denies numbness or tingling in the foot. Received fentanyl 25 mcg IV from EMS.`,
        ros: 'Positive for hip/groin pain and inability to walk. Negative for head injury, neck pain, chest pain, dyspnea, abdominal pain, focal weakness, numbness, fever, or urinary symptoms.',
        keyLabs: ['Hemoglobin', 'WBC', 'Platelets', 'Sodium', 'Potassium', 'Creatinine', 'INR', 'Glucose'],
        isolation: 'None', famHxExtra: 'Mother had a hip fracture in her 80s. No known family history of bleeding disorders.',
        flags: { npo: [[npoH, dietH]], preop: [[0, orH]], surgeryWindow: [[0, orH + 48]], postop: [[orEnd, 9999]] },
        ppxStartH: 4,
        vitals: [
          { h: 0, temp: 98.2, hr: 94, sbp: 150, dbp: 86, rr: 20, spo2: 96, pain: 9, o2: 'Room air' },
          { h: 1.5, temp: 98.2, hr: 88, sbp: 146, dbp: 82, rr: 18, spo2: 96, pain: 7 },
          { h: 3, temp: 98.4, hr: 82, sbp: 140, dbp: 80, rr: 16, spo2: 96, pain: 3 },
          { h: 10, temp: 98.4, hr: 78, sbp: 136, dbp: 78, rr: 16, spo2: 96, pain: 3 },
          { h: 15, temp: 98.6, hr: 84, sbp: 142, dbp: 82, rr: 16, spo2: 96, pain: 6 },
          { h: 22, temp: 98.4, hr: 80, sbp: 136, dbp: 78, rr: 16, spo2: 96, pain: 5 },
          { h: orH - 1, temp: 98.4, hr: 82, sbp: 138, dbp: 80, rr: 16, spo2: 96, pain: 5 },
          { h: orEnd, temp: 97.8, hr: 76, sbp: 108, dbp: 62, rr: 14, spo2: 95, pain: 1, o2: '2 L nasal cannula' },
          { h: orEnd + 3, temp: 98.2, hr: 80, sbp: 118, dbp: 68, rr: 16, spo2: 95, pain: 4 },
          { h: orEnd + 8, temp: 99.0, hr: 86, sbp: 122, dbp: 70, rr: 16, spo2: 95, pain: 5, o2: 'Room air' },
          { h: pod1 + 4, temp: 99.6, hr: 88, sbp: 124, dbp: 72, rr: 16, spo2: 95, pain: 4 },
          { h: pod1 + 20, temp: 99.2, hr: 86, sbp: 124, dbp: 72, rr: 16, spo2: 96, pain: 4 },
          { h: pod2 + 6, temp: 98.8, hr: 82, sbp: 128, dbp: 74, rr: 16, spo2: 96, pain: 3 },
          { h: pod3 + 6, temp: 98.4, hr: 78, sbp: 130, dbp: 76, rr: 16, spo2: 96, pain: 3 },
          { h: pod4 + 6, temp: 98.2, hr: 76, sbp: 130, dbp: 76, rr: 16, spo2: 97, pain: 2 }
        ],
        labs: {
          Hemoglobin: { add: [[0, -1.0], [orH - 1, -1.7], [orEnd, -2.2], [orEnd + 6, -2.9], [pod1, -3.3], [pod2, -3.7], [pod3, -3.6], [pod4 + 24, -3.3]] },
          WBC: { add: [[0, 2.6], [24, 1.6], [orEnd + 6, 3.6], [pod1, 3.0], [pod2, 1.6], [pod3, 0.6], [pod4, 0]] },
          Platelets: { add: [[0, -10], [pod1, -40], [pod2, -50], [pod3, -20], [pod4 + 24, 20]] },
          Sodium: { add: [[0, -2], [24, -1], [pod1, -2], [pod3, -1]] },
          Potassium: { add: [[0, 0], [pod1, 0.1]] },
          Chloride: { add: [[0, -1], [24, 0]] },
          Creatinine: { add: [[0, 0.18], [18, 0.04], [pod1, 0.12], [pod3, 0.04]] },
          BUN: { add: [[0, 6], [18, 2], [pod1, 4], [pod3, 1]] },
          Glucose: { add: [[0, 24], [30, 12], [orEnd + 6, 32], [pod2, 14], [pod3, 8]] },
          Calcium: { add: [[0, -0.3], [pod1, -0.5], [pod3, -0.3]] },
          Albumin: { add: [[0, -0.5], [pod1, -0.8]] },
          Magnesium: { abs: [[0, 1.9], [pod1, 1.8], [pod3, 1.9]] },
          INR: { add: [[0, 0]] }
        },
        labBase: { '25-OH Vitamin D': 19, Albumin: 3.8 },
        labSchedule: [
          { h: 0.5, codes: ['PT', 'INR', 'aPTT', 'Albumin', 'Magnesium', 'Phosphorus'] },
          { h: 6, codes: ['25-OH Vitamin D'] },
          { h: orH - 3, codes: ['Hemoglobin', 'Hematocrit', 'Potassium', 'Creatinine'] },
          { h: orEnd + 6, codes: ['Hemoglobin', 'Hematocrit'] },
          { h: pod1 + 14, codes: ['Hemoglobin', 'Hematocrit'] }
        ],
        quals: [
          { h: 1.2, category: 'Blood Bank', code: 'Type and screen', value: 'O positive; antibody screen negative', specimen: 'Blood' },
          { h: 1.4, category: 'Urinalysis', code: 'Urinalysis - leukocyte esterase', value: 'Negative', reference: 'Negative', specimen: 'Urine' },
          { h: 1.4, category: 'Urinalysis', code: 'Urinalysis - nitrite', value: 'Negative', reference: 'Negative', specimen: 'Urine' },
          { h: 4, category: 'Microbiology', code: 'MRSA nasal screen (PCR)', value: 'Negative', reference: 'Negative', specimen: 'Nares' },
          ...(ctx.female && ctx.age < 55 ? [{ h: 1.4, category: 'Other', code: 'Urine hCG (pregnancy test)', value: 'Negative', reference: 'Negative', specimen: 'Urine' }] : [])
        ],
        events: [
          { type: 'imaging', h: 0.9, study: `X-ray ${sl} hip and pelvis (AP pelvis, AP and cross-table lateral ${sl} hip)`, modality: 'X-ray', indication: `${side} hip pain and shortened, externally rotated leg after a fall`,
            findings: arthro ? `Displaced, valgus-impacted-to-displaced subcapital ${sl} femoral neck fracture (Garden type III-IV) with proximal migration of the femoral shaft. Osteopenia. Hip joint space preserved. No acetabular or pelvic ring fracture. Contralateral hip unremarkable.` : `Comminuted intertrochanteric ${sl} femoral fracture with varus angulation and lesser trochanter involvement. Diffuse osteopenia. No femoral neck or acetabular fracture. Pelvic ring intact.`,
            impression: arthro ? `Displaced ${sl} femoral neck fracture.` : `Unstable ${sl} intertrochanteric femur fracture.` },
          { type: 'imaging', h: 2.1, study: 'Chest x-ray, portable', modality: 'X-ray', indication: 'Pre-operative evaluation', findings: 'Lungs are clear without focal consolidation, effusion or pneumothorax. Heart size is upper normal. Aortic calcification. No acute rib fracture.', impression: 'No acute cardiopulmonary process.' },
          { type: 'cardiology', h: 2.3, study: '12-lead ECG', label: 'Pre-operative ECG', indication: 'Pre-operative evaluation (syncope excluded as cause of fall)',
            impression: ctx.has('afib') ? 'Atrial fibrillation with controlled ventricular response (rate 84). No acute ST-T wave changes. QTc 436 ms.' : 'Normal sinus rhythm, rate 82. Normal axis and intervals. No acute ST-T wave changes. QTc 430 ms.' },
          { type: 'procedure', h: 1.8, duration: 0.4, name: 'Fascia iliaca compartment nerve block', label: `Ultrasound-guided fascia iliaca nerve block, ${sl} hip`, by: 'ed', service: 'Emergency Medicine', indication: 'Hip fracture analgesia (opioid sparing)',
            findings: `Ultrasound-guided fascia iliaca block with 30 mL of ropivacaine 0.2% (below maximum dose for weight) injected deep to the fascia iliaca; good spread seen. Pain improved from 9/10 to 3/10 within 20 minutes. No paresthesia or vascular puncture. Expect 8-12 hours of relief; monitor for quadriceps weakness.` },
          { type: 'consult', h: 2.4, service: 'Orthopedic Surgery', author: 'surgeon', orderedBy: 'ed', reason: `${side} hip fracture`, label: 'Orthopedic surgery consulted; operative plan',
            recommendation: `Admit to Orthopedic Surgery. ${arthro ? 'Hemiarthroplasty' : 'Cephalomedullary (intramedullary) nail fixation'} within 24-48 hours of arrival. NPO after midnight. Hold anticoagulants; type and screen. ${arthro ? 'Posterior hip precautions after surgery.' : ''} Weight bearing as tolerated after surgery. PT/OT post-op day 1. Consent obtained from the patient or health care proxy.` },
          { type: 'consult', h: 3.4, service: 'Hospital Medicine (pre-operative co-management)', author: 'hospitalist', orderedBy: 'ed', reason: 'Medical optimization before hip surgery', label: 'Hospitalist co-management; medically optimized for surgery',
            recommendation: 'Acceptable cardiac risk for surgery; do not delay for further testing. Hold diuretics and anticoagulants as directed; continue beta blocker. Delirium prevention bundle. Daily CBC/BMP; transfuse for Hgb below 8 g/dL or symptoms. Early mobilization and PT/OT after surgery.' },
          { type: 'transfer', h: 4.0, label: 'Admitted to the orthopedic unit', text: 'Transferred from the ED to the orthopedic unit.' },
          { type: 'surgery', h: orH, duration: dur, name: arthro ? `${side} hip hemiarthroplasty (cemented)` : `${side} cephalomedullary nail fixation of intertrochanteric fracture`, label: arthro ? `${side} hip hemiarthroplasty` : `${side} hip intramedullary nail`, anesthesia: 'Spinal anesthesia with light sedation', orderH: 8,
            indication: arthro ? 'Displaced femoral neck fracture' : 'Unstable intertrochanteric fracture',
            findings: arthro ? 'Displaced subcapital femoral neck fracture with good bone stock for cemented stem. Acetabular cartilage intact. Stable hemiprosthesis through range of motion.' : 'Comminuted intertrochanteric fracture reduced on the fracture table under fluoroscopy; good lag screw position (tip-apex distance under 25 mm).',
            procedure: arthro ? `Posterior approach in the lateral decubitus position. Femoral head removed and sized. Cemented stem and bipolar head placed; posterior capsule and short external rotators repaired. Wound irrigated and closed in layers. Sterile dressing applied. Abduction pillow placed.` : `Supine on the fracture table with closed reduction under fluoroscopy. Entry point at the greater trochanter; nail passed, lag screw and distal interlocking screw placed under fluoroscopy. Small incisions closed with absorbable suture and skin glue.`,
            ebl: arthro ? '300 mL' : '150 mL', fluids: "1,000 mL lactated Ringer's", specimens: arthro ? 'Femoral head to pathology' : 'None', complications: 'None', disposition: 'PACU, then orthopedic unit' },
          { type: 'imaging', h: orEnd + 1.5, study: `X-ray ${sl} hip, portable post-operative`, modality: 'X-ray', indication: 'Post-operative position check',
            findings: arthro ? 'Cemented bipolar hemiarthroplasty in satisfactory position; the head is concentrically reduced. No periprosthetic fracture. Expected soft tissue gas.' : 'Cephalomedullary nail with lag screw and distal interlock in satisfactory position; fracture reduced in near anatomic alignment. No new fracture.',
            impression: arthro ? 'Satisfactory hemiarthroplasty, no dislocation.' : 'Satisfactory fixation of the intertrochanteric fracture.' }
        ],
        meds: [
          C.bolus("lactated Ringer's bolus", 500, { start: 0.6, by: 'ed', indication: 'Dehydration after prolonged lying / poor intake before the fall' }),
          C.lrMaintenance({ start: npoH, stop: orEnd + 14, rate: 75 }),
          morphine, oxy,
          Object.assign(C.ondansetron({ start: 0.8, given: [0.8, orEnd + 2, orEnd + 12] }), { info: 'Check QTc before repeated dosing in an older adult. Reassess nausea in 30 minutes. Preferred over promethazine (anticholinergic, delirium risk).' }),
          Object.assign(C.acetaminophenPO({ start: 1.0 }), { dose: lowDose ? '650 mg' : '1,000 mg', freq: lowDose ? 'q6h' : 'q8h', stat: true, sips: true, by: 'ed', info: 'Scheduled (not PRN) base of multimodal analgesia; opioid-sparing. Maximum 3 g per 24 hours from all sources.' }),
          cefazolin,
          { key: 'melatonin', name: 'melatonin tablet', dose: '3 mg', route: 'Oral', freq: 'qHS', sips: true, cls: 'Sleep aid (hormone)', info: 'Delirium-prevention sleep aid. Avoid benzodiazepines, diphenhydramine and zolpidem in older adults.', monitor: ['Pain'], indication: 'Sleep and delirium prevention', startH: 6, by: 'hospitalist' },
          { key: 'senna_docusate', name: 'senna-docusate (SENOKOT-S) tablet', dose: '2 tablets', route: 'Oral', freq: 'BID', sips: true, cls: 'Stimulant laxative / stool softener', info: 'Hold for loose stools. Goal: a bowel movement at least every other day; immobility and opioids cause constipation.', indication: 'Opioid-induced constipation prevention', startH: 3, by: 'surgeon' },
          { key: 'peg3350', name: 'polyethylene glycol (MIRALAX) powder', dose: '17 g', route: 'Oral', freq: 'daily', prn: true, prnInterval: 'Once daily', prnFor: 'no bowel movement in 24 hours', cls: 'Osmotic laxative', info: 'Mix in 4-8 oz of fluid. Hold for loose stools. Goal: bowel movement by post-op day 3.', indication: 'Opioid and immobility constipation prevention', startH: orEnd + 8, prnGiven: [], by: 'surgeon' },
          { key: 'ferrous_sulfate', name: 'ferrous sulfate tablet', dose: '325 mg', route: 'Oral', freq: 'daily', cls: 'Iron supplement', info: 'Give with food if upset stomach. Dark stools are expected. Can worsen constipation. Give 2 hours apart from calcium.', monitor: ['Hgb'], indication: 'Post-operative blood loss anemia', startH: pod2, by: 'surgeon' },
          { key: 'vitamin_d3', name: 'cholecalciferol (vitamin D3) tablet', dose: '1,000 units', route: 'Oral', freq: 'daily', cls: 'Vitamin', info: 'Low 25-OH vitamin D with fragility fracture; part of osteoporosis treatment.', indication: 'Vitamin D deficiency / fragility fracture', startH: pod1, by: 'surgeon' },
          { key: 'calcium_carbonate', name: 'calcium carbonate (TUMS) tablet', dose: '500 mg', route: 'Oral', freq: 'BID', cls: 'Calcium supplement', info: 'Give with meals. Separate from iron by 2 hours. May worsen constipation.', indication: 'Fragility fracture / osteoporosis', startH: pod1, by: 'surgeon' }
        ],
        orders: [
          C.diet('Regular diet', 0.5, npoH, 'Heart-healthy; encourage fluids and protein. Offer snacks; set up meals (patient flat in bed).'),
          C.diet('NPO', npoH, dietH, 'NPO after midnight for surgery; sips of water with essential medications allowed until 2 hours before surgery.'),
          C.diet('Regular diet', dietH, undefined, 'Advance as tolerated once awake and not nauseated. High-protein oral supplement twice daily. Set up meals; assist as needed.'),
          C.activity(`Bed rest, non-weight bearing ${sl} leg`, 0.5, orEnd, `Keep ${sl} leg in neutral rotation, pillow between knees, heels off the bed. Log roll with 2 staff. Bedpan or assisted bedside commode only.`),
          C.activity('Bed rest until sensation returns after spinal, then up with assistance', orEnd, orEnd + 4, 'Keep head of bed 30 degrees; check sensation and movement of both legs hourly until spinal anesthesia resolves.'),
          C.activity(`Weight bearing as tolerated ${sl} leg with walker, up with assistance`, orEnd + 4, undefined, 'Out of bed to chair for meals with 1-2 staff; progress with PT. Call light within reach; gait belt.'),
          { name: "Buck's skin traction (5 lb), comfort until surgery", category: 'Nursing', frequency: 'Continuous', startH: 3, stopH: orH - 0.5, instructions: `Apply foam boot with 5 lb weight to ${sl} leg for comfort; weights hang free. Check skin of heel, malleoli and fibular head every shift. Remove for surgery.`, nursing: ['Assess for peroneal nerve pressure (foot drop, numbness over top of foot).', 'Check that traction ropes are free and weights are not resting on the floor or bed.'] },
          { name: `Neurovascular checks ${sl} leg`, category: 'Nursing', frequency: 'Every 4 hours', startH: 3, instructions: `Check color, warmth, capillary refill, dorsalis pedis/posterior tibial pulses, sensation and ability to move toes. Notify surgeon for pallor, coolness, loss of pulse, numbness, or severe pain unrelieved by medication.`, nursing: ['Post-op: report increasing thigh swelling or tightness (hematoma / compartment syndrome).'] },
          { name: 'Anticoagulant and antiplatelet review (pre-operative)', category: 'Nursing', frequency: 'Once', startH: 3, completeH: 8, instructions: 'Confirm and document date and time of last dose of any anticoagulant (apixaban, rivaroxaban, warfarin) or antiplatelet (clopidogrel, aspirin). Hold anticoagulants. Notify surgeon and anesthesia (spinal/epidural timing). INR checked.', nursing: ['Aspirin 81 mg may be continued if ordered; do not give clopidogrel, apixaban or warfarin until the surgeon clears it.'] },
          { name: 'Type and screen', category: 'Laboratory', frequency: 'Once', startH: 0.6, completeH: 1.4, instructions: 'Blood bank specimen; armband required. Keep sample valid (repeat every 72 hours).' },
          { name: 'Transfusion threshold: Hgb below 8 g/dL or symptomatic', category: 'Nursing', frequency: 'Per lab result', startH: 3, instructions: 'Restrictive transfusion strategy: transfuse 1 unit PRBC for Hgb below 8 g/dL, or for chest pain, symptomatic tachycardia or hypotension. Recheck Hgb after each unit.', nursing: ['Notify provider for Hgb below 8, HR above 110, SBP below 90, new dyspnea, dizziness or pallor.'] },
          { name: 'Delirium prevention bundle', category: 'Precautions', frequency: 'Continuous', startH: 3, instructions: 'Reorient often; glasses, hearing aids and dentures within reach; day-night routine and lights off at night; treat pain; avoid benzodiazepines and anticholinergics; early mobilization; hydration; avoid restraints. Screen with CAM every shift.', nursing: ['New confusion: check pain, urinary retention, constipation, hypoxia, infection, glucose and recent medications before giving any sedative.'] },
          { name: 'Pressure injury prevention', category: 'Nursing', frequency: 'Every 2 hours', startH: 3, instructions: 'Braden each shift; reposition every 2 hours (30-degree tilt on the non-operative side or per surgeon); float heels with pillows/boots; pressure-redistribution mattress; keep skin dry; assess sacrum, heels and hips.', nursing: ['Older adults lying on a hard floor or ED stretcher are at high risk for sacral and heel injury.'] },
          C.incentive(3, undefined),
          { name: 'Pre-operative checklist, consent and site verification', category: 'Nursing', frequency: 'Once', startH: 8, completeH: orH - 0.3, instructions: `Verify consent (or health care proxy if lacking capacity), ID and allergy bands, ${sl} hip marked, NPO status, hearing aids/dentures plan, last void, antibiotic within 60 minutes before incision, skin traction off.` },
          { name: 'Sequential compression devices', category: 'Nursing', frequency: 'Continuous when in bed', startH: 3, instructions: 'Apply to both legs (or non-operative leg only if the operative leg is swollen) until fully ambulatory.' },
          { name: 'Case management consult: post-acute rehab planning', category: 'Consult / Therapy', frequency: 'Once', startH: 6, instructions: 'Evaluate for skilled nursing facility / inpatient rehab. Medicare 3-midnight qualifying stay; start insurance authorization early.' },
          { name: 'Physical therapy evaluation and treatment', category: 'Consult / Therapy', frequency: 'Daily from POD 1', startH: orEnd + 1, instructions: `Mobilize on post-op day 1: bed mobility, transfers, gait with walker. Weight bearing as tolerated ${sl} leg.${arthro ? ' Posterior hip precautions.' : ''}`, by: 'surgeon' },
          { name: 'Occupational therapy evaluation and treatment', category: 'Consult / Therapy', frequency: 'Daily from POD 1', startH: orEnd + 1, instructions: `ADL retraining and adaptive equipment${arthro ? ' for hip precautions (reacher, sock aid, raised toilet seat)' : ''}.`, by: 'surgeon' },
          { name: 'Surgical dressing and incision assessment', category: 'Nursing', frequency: 'Every shift', startH: orEnd, instructions: arthro ? 'Assess hip dressing for drainage (mark and time any strikethrough), warmth, swelling; keep dressing intact for 7 days unless saturated.' : 'Assess lateral thigh incisions for bleeding, swelling, drainage and skin glue integrity.', nursing: ['Expect a moderate amount of bruising along the thigh; report expanding bruise or tense swelling.'] },
          { name: 'Indwelling urinary catheter care and removal on post-op day 1', category: 'Nursing', frequency: 'Every shift', startH: orH, stopH: foleyOut, instructions: `Foley placed in OR. Remove by 06:00 on post-op day 1. After removal, document first void; bladder scan if no void in 6 hours.`, nursing: ['Older adults and opioid users are at risk of urinary retention (can cause delirium).'] },
          ...(arthro ? [
            { name: 'Posterior hip precautions', category: 'Precautions', frequency: 'Continuous', startH: orEnd, instructions: `No hip flexion past 90 degrees, no crossing the legs or adducting past midline, no internal rotation of the ${sl} leg. Abduction pillow in bed; raised toilet seat; post sign at bedside.`, nursing: ['Teach patient and family; reinforce before every transfer.', 'Report a shortened, externally rotated leg or sudden severe hip pain (dislocation).'] },
            { name: 'Pathology: femoral head specimen', category: 'Laboratory', frequency: 'Once', startH: orEnd, instructions: 'Specimen sent to surgical pathology.' }
          ] : [])
        ],
        devices: [
          C.pivSecond(2.6, 'Left antecubital', '18 gauge'),
          { deviceType: 'Tube', type: 'Foley catheter', location: 'Urethral', siteMarker: 'pelvis', placeH: orH + 0.4, removeH: foleyOut, status: 'Draining', assess: 'draining clear yellow urine, secured to thigh, no leaking', drainage: '' }
        ],
        assessments: [
          { fromH: 0, items: [['Musculoskeletal / Mobility', 'Mobility', `Non-weight bearing ${sl} leg; unable to stand`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `${side} leg shortened and externally rotated; tender over hip and groin; unable to lift leg; foot warm, pedal pulses palpable, capillary refill under 3 seconds, sensation and toe movement intact`], ['Pain', 'Pain Location', `${side} hip and groin, sharp, worse with any movement`], ['Skin', 'Skin', `Warm, dry; ecchymosis over ${sl} lateral hip; no open wounds or skin tears`], ['Skin', 'Braden Score', '17'], ['Safety', 'Delirium Screen (CAM)', 'Negative'], ['Respiratory', 'Incentive Spirometer', '1,000 mL']] },
          { fromH: 3, items: [['Pain', 'Pain Location', `${side} hip, dull ache after nerve block`], ['Musculoskeletal / Mobility', 'Mobility', `Bed rest, ${sl} leg in skin traction; repositions with assistance`], ['Skin', 'Skin', 'Heels and sacrum intact; blanchable redness over sacrum']] },
          { fromH: npoH, items: [['Safety', 'Delirium Screen (CAM)', 'Negative; slept in 2-hour segments']] },
          { fromH: orEnd, items: [['Skin', 'Surgical Incisions', arthro ? `${side} posterolateral hip incision with occlusive dressing, clean, dry, intact; small amount of old drainage` : `${side} lateral thigh incisions x2 (proximal and distal screw sites) with skin glue and dressings clean, dry, intact`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Spinal anesthesia wearing off: moves toes, sensation returning; foot warm, pulses palpable, capillary refill under 3 seconds${arthro ? '; abduction pillow in place' : ''}`], ['Musculoskeletal / Mobility', 'Mobility', 'Bed rest until spinal resolves; turned with 2 staff'], ['GU', 'Urinary Elimination', 'Foley catheter to gravity, clear yellow urine'], ['Respiratory', 'Breath Sounds', 'Clear, diminished at bases'], ['Respiratory', 'Incentive Spirometer', '1,000 mL'], ['Pain', 'Pain Location', `${side} hip incision, aching, 4-5/10 with movement`], ['Safety', 'Delirium Screen (CAM)', 'Negative'], ['Safety', 'Fall Precautions', 'High risk: bed alarm on, call light in reach, non-skid socks, never leave patient alone on commode'], ['GI', 'Nausea / Vomiting', 'Mild nausea after spinal; relieved with ondansetron']] },
          { fromH: pod1 - 2, items: [['GI', 'Nausea / Vomiting', 'None'], ['GI', 'Last BM / Flatus', 'No BM since admission; passing flatus'], ['Cardiac', 'Edema', `Trace dependent edema of ${sl} foot and ankle (expected after surgery)`], ['Skin', 'Braden Score', '15'], ['Respiratory', 'Incentive Spirometer', '1,250 mL'], ['Musculoskeletal / Mobility', 'Mobility', `Moderate assist of 1-2 for bed mobility; WBAT ${sl} leg`]] },
          { fromH: pod1 + 2, items: [['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Spinal resolved; full sensation and toe/ankle movement; foot warm, pulses palpable, capillary refill under 3 seconds; thigh swollen with expected bruising, soft, calf non-tender`]] },
          { fromH: foleyOut, items: [['GU', 'Urinary Elimination', 'Foley removed; voiding spontaneously (300 mL first void), no urgency or burning']] },
          { fromH: ptH, items: [['Musculoskeletal / Mobility', 'Mobility', `Stood and took 5-10 steps with rolling walker and moderate assist x1 with PT; WBAT ${sl} leg; up to chair for meals`], ['Safety', 'Delirium Screen (CAM)', 'Negative; brief evening disorientation redirected easily']] },
          { fromH: pod2, items: [['Musculoskeletal / Mobility', 'Mobility', 'Walking 50 feet with rolling walker and contact guard assist'], ['Skin', 'Skin', 'Sacrum and heels intact; mild blanchable erythema sacrum, offloaded'], ['Skin', 'Braden Score', '16'], ['GI', 'Last BM / Flatus', 'No BM for 3 days; Miralax given'], ['Respiratory', 'Incentive Spirometer', '1,500 mL'], ['Pain', 'Pain Location', `${side} hip incision, aching 3/10, tolerable with acetaminophen and low-dose oxycodone`], ['Cardiac', 'Edema', `Trace edema ${sl} foot; calf soft and non-tender`]] },
          { fromH: pod3, items: [['Musculoskeletal / Mobility', 'Mobility', 'Walking 100 feet with rolling walker and standby assist; transfers with supervision'], ['GI', 'Last BM / Flatus', 'Moderate BM this morning'], ['Pain', 'Pain Location', `${side} hip incision, 2-3/10`]] }
        ],
        io: [
          { fromH: 0, po: 240, urine: 300 },
          { fromH: 8, po: 300, urine: 280 },
          { fromH: orEnd, po: 0, urine: 220 },
          { fromH: dietH + 2, po: 220, urine: 260 },
          { fromH: pod1, po: 300, urine: 290 },
          { fromH: pod2, po: 420, urine: 320 }
        ],
        therapy: {
          fromH: ptH,
          assist: h => (h < ptH + 24 ? 'moderate assist of one' : h < ptH + 56 ? 'contact guard assist' : 'supervision / standby assist'),
          gait: h => (h < ptH + 24 ? '10 feet with rolling walker' : h < ptH + 56 ? '50 feet with rolling walker' : '100-150 feet with rolling walker'),
          rec: `Short-term rehab at a skilled nursing facility (or inpatient rehab) for gait and transfer training, WBAT ${sl} leg${arthro ? ', posterior hip precautions' : ''}; home health PT/OT only if 24-hour assistance at home`
        },
        discharge: { dispo: () => 'Skilled nursing facility / short-term rehab (most likely) or home with home health and 24-hour assistance', estimate: 'post-operative day 3-4 (hospital day 5-6) once pain is controlled on oral medication, Hgb stable and therapy cleared' },
        stages: hipStages(ctx, { arthro, side, sl, npoH, orH, orEnd, orTime, foleyOut, pod1, pod2, pod3, pod4, dietH }),
        stickies: [
          { title: 'Fall / delirium risk', body: 'High fall risk: bed alarm, assist x2 early on, never leave on commode. Screen for delirium every shift; avoid sedatives.' },
          { title: 'Anticoagulant / antiplatelet', body: 'Verify last dose of any home blood thinner before surgery. Enoxaparin plus SCDs for VTE prevention; hold doses per anesthesia timing after spinal.', fromH: 0 },
          ...(arthro ? [{ title: 'Hip precautions', body: 'Posterior approach: no flexion past 90 degrees, no crossing legs, no internal rotation. Abduction pillow in bed.', fromH: orEnd }] : [])
        ],
        objectives: ['Prioritize pre-operative care for an older adult with a hip fracture: pain control, neurovascular checks, NPO, VTE and bleeding-risk management.', 'Implement post-operative hip fracture care: weight bearing, hip precautions, early mobilization, incentive spirometry, Foley removal and pressure-injury prevention.', 'Recognize and prevent delirium, post-operative anemia, constipation, urinary retention and VTE in an older adult.', 'Coordinate PT/OT and case management for discharge to rehab.']
      };
      return spec;
    }
  };

  function hipStages(ctx, p) {
    const { arthro, side, sl, npoH, orH, orEnd, orTime, foleyOut, pod1, pod2, pod3, pod4, dietH } = p;
    const proc = arthro ? 'hemiarthroplasty' : 'intramedullary nail fixation';
    const st = [];
    st.push({
      fromH: 0, id: 'ed', label: `${side} hip fracture: pain control, pre-operative work-up`,
      problem: `${side} hip fracture after a fall; awaiting ${proc} within 24-48 hours.`,
      subj: `Pain 9/10 on arrival, now 3-4/10 after the nerve block and IV morphine. Leg is shortened and turned out. No head injury, chest pain or dizziness before the fall. Last ate the evening before.`,
      assess: `${arthro ? 'Displaced femoral neck' : 'Intertrochanteric'} fracture, hemodynamically stable. Medically optimized for surgery; ECG and chest x-ray without acute findings.`,
      plan: ['Fascia iliaca block done; scheduled acetaminophen, low-dose IV morphine for severe pain, oral oxycodone for moderate pain; avoid NSAIDs.', 'Skin traction for comfort; neurovascular checks every 4 hours; bed rest, non-weight bearing.', `NPO after midnight; ${proc} planned about ${orTime} tomorrow; type and screen, INR, ECG done.`, 'Hold anticoagulants; document last dose; SCDs and pre-operative heparin SQ for VTE prevention.', 'Gentle IV fluids; delirium prevention bundle; PT/OT after surgery.'],
      nursing: [`Pain 3-4/10 after nerve block; ${sl} foot warm with palpable pulses and intact sensation.`, 'Skin traction applied; heel and sacrum checked; repositioned with log roll.', 'Delirium screen negative; glasses and hearing aids within reach.', 'Pre-operative teaching started; consent in progress.'],
      teach: ['Reviewed why movement is limited, how to call for help, pain scale use, incentive spirometer, and the NPO plan before surgery.'],
      dispo: 'Anticipate 4-6 days, then skilled nursing facility or rehab.',
      objectives: ['Perform neurovascular checks and pain reassessment for a patient with a hip fracture.'],
      stickies: [{ title: 'Pre-op', body: `NPO after midnight (sips with essential meds). OR about ${orTime}. Verify consent, last dose of blood thinners, ${sl} hip marking.` }]
    });
    st.push({
      fromH: npoH, id: 'preop', label: 'Pre-operative: NPO, awaiting OR',
      problem: `${side} hip fracture; NPO, awaiting ${proc} this morning.`,
      subj: 'Pain 5/10 as the nerve block wore off, controlled with oxycodone and acetaminophen. Slept in short stretches. No nausea.',
      assess: 'Stable overnight; Hgb and creatinine acceptable; cleared for surgery.',
      plan: ['NPO; maintenance IV fluids; essential meds with sips.', `Cefazolin within 60 minutes before incision; surgery about ${orTime}; spinal anesthesia planned.`, 'Pre-operative checklist; remove traction; hold anticoagulant.'],
      nursing: ['NPO since midnight; IV fluid infusing at 75 mL/hr.', 'Neurovascular checks unchanged; pain 5/10.', 'Pre-op checklist in progress; consent verified.'],
      teach: ['What to expect in PACU and on return: spinal wears off, IV, Foley, incentive spirometer, and early sitting up.'],
      dispo: 'Surgery today.',
      stickies: [{ title: 'To OR', body: `OR about ${orTime}: NPO, cefazolin 30-60 min before incision, remove skin traction, verify marked site and consent.` }]
    });
    st.push({
      fromH: orEnd, id: 'postop0', label: 'Post-operative day 0',
      problem: `Status post ${side.toLowerCase()} hip ${proc} (POD 0).`,
      subj: 'Awake in recovery; legs heavy and tingling as the spinal wears off. Mild nausea. Pain 4-5/10 after sensation returned.',
      assess: `POD 0 ${proc}; hemodynamically stable after spinal hypotension; expected blood loss.`,
      plan: ['Cefazolin x 24 hours; scheduled acetaminophen with low-dose oxycodone, IV morphine only for severe pain.', 'Enoxaparin 12 hours after the spinal, SCDs, incentive spirometry.', `Foley out tomorrow morning; Hgb check this evening; transfuse for Hgb below 8 g/dL or symptoms.`, `${arthro ? 'Posterior hip precautions with abduction pillow.' : 'Weight bearing as tolerated.'} Sit up in bed today; PT tomorrow.`, 'Resume diet once awake; delirium prevention.'],
      nursing: ['Dressing clean, dry, intact; neurovascular checks every 4 hours.', 'Foley draining clear yellow urine; incentive spirometer 1,000 mL.', 'Nausea relieved with ondansetron; head of bed up for meals.', 'Alert, CAM negative; bed alarm on.'],
      teach: [arthro ? 'Posterior hip precautions: no bending past 90 degrees, no crossing legs, no turning the foot inward.' : 'Weight bearing as tolerated, using the walker, and calling before getting up.', 'Deep breathing and coughing with splinting; why moving matters.'],
      dispo: 'Expect 2-4 more days; skilled nursing facility likely.'
    });
    st.push({
      fromH: pod1, id: 'pod1', label: 'Post-operative day 1: first mobilization',
      problem: `POD 1 ${proc}; first PT session; Foley removed.`,
      subj: 'Pain 3-4/10 with movement, better at rest. Ate half of breakfast. Slept poorly. Wants the catheter out. No chest pain or shortness of breath.',
      assess: 'Post-operative anemia expected (Hgb about 3 g/dL below admission) without symptoms; low-grade temperature common on POD 1; no focal signs of infection, DVT or delirium.',
      plan: ['Foley removed this morning; bladder scan if no void in 6 hours.', 'PT and OT today: out of bed to chair, walker, WBAT.', 'Daily CBC/BMP; transfuse only for Hgb below 8 or symptoms; start iron tomorrow.', 'Bowel regimen: senna-docusate, Miralax PRN; goal BM by POD 3.', 'Continue enoxaparin and SCDs; incentive spirometry every hour while awake.', 'Case management: SNF referrals and authorization.'],
      nursing: ['Voided 300 mL after Foley removal; no retention.', 'Up to chair with PT using walker; moderate assist.', 'Heels floated; sacrum intact; Braden 15.', 'Low-grade temperature 99.6 F; lungs clear; IS 1,250 mL.', 'CAM negative; mild evening confusion if sleep disrupted.'],
      teach: ['Walker use, weight bearing, call before getting up, bowel regimen and fluids, and why the incentive spirometer prevents pneumonia.'],
      dispo: 'Anticipate transfer to a rehab facility around post-operative day 2-4.'
    });
    st.push({
      fromH: pod2, id: 'pod2', label: 'Post-operative day 2: working with therapy, awaiting SNF',
      problem: `POD 2 ${proc}; mobilizing; medically stable pending rehab placement.`,
      subj: 'Pain 2-3/10 on acetaminophen and occasional oxycodone. Walked 50 feet with the walker. No BM for 3 days; mild abdominal fullness.',
      assess: 'Recovering as expected. Hgb nadir without transfusion need; afebrile; incision clean. Constipation risk on opioids and iron.',
      plan: ['Continue acetaminophen scheduled; wean oxycodone; no NSAIDs.', 'Start ferrous sulfate and vitamin D / calcium; osteoporosis treatment per outpatient follow-up.', 'Enoxaparin to continue for 28-35 days after surgery (continued at rehab).', 'Miralax; goal BM today.', 'Complete SNF referral; confirm 3-midnight qualifying stay met.'],
      nursing: ['Walked 50 feet with contact guard; transferred to chair for meals.', 'Incision clean, dry, intact; calves soft, non-tender.', 'Eating 75% of meals; encouraged fluids and protein supplement.', 'CAM negative; oriented and cooperative.'],
      teach: ['Medication plan after discharge, enoxaparin self-injection teaching for caregiver if needed, fall prevention, and bone health.'],
      dispo: 'Expected discharge to SNF/rehab within 1-3 days.'
    });
    st.push({
      fromH: pod3, id: 'pod3', label: 'Post-operative day 3: ready for rehab',
      problem: `POD 3 ${proc}; medically ready; awaiting transfer to rehab.`,
      subj: 'Feels stronger. Pain 2/10. Had a bowel movement this morning. Walked 100 feet. Anxious about leaving the hospital.',
      assess: 'Medically stable for discharge to a skilled nursing facility; Hgb stable; afebrile.',
      plan: ['Discharge to SNF/rehab when bed and authorization are confirmed.', 'Discharge summary: WBAT, hip precautions if arthroplasty, enoxaparin duration, orthopedic follow-up in 2 weeks for staples/suture check.', 'Osteoporosis work-up and treatment through primary care (DXA, bisphosphonate).'],
      nursing: ['Ambulating with walker and standby assist.', 'Tolerating regular diet; voiding; BM today.', 'Report called to receiving facility; belongings and medication list prepared.'],
      teach: ['Teach-back on warning signs: fever, wound drainage, calf pain or swelling, chest pain or shortness of breath, new confusion, leg turning out or shortening.'],
      dispo: 'Discharge to SNF/rehab today or tomorrow.',
      stickies: [{ title: 'Transfer to rehab', body: 'Nurse-to-nurse report, medication list (last doses), enoxaparin plan, WBAT / hip precautions, skin check, incisional care.' }]
    });
    st.push({
      fromH: pod4, id: 'ready', label: 'Discharge to rehab',
      problem: `POD 4 ${proc}; discharge to rehab.`,
      subj: 'Pain controlled with acetaminophen; walking in the hall with walker. Ready to go to rehab.',
      assess: 'Recovered enough for post-acute rehab; no complications.',
      plan: ['Transfer to SNF/rehab today.', 'Continue enoxaparin, bowel regimen, vitamin D / calcium, iron; follow-up with orthopedics.'],
      nursing: ['Vital signs stable, incision clean, pain 1-2/10; IV removed.', 'Handoff completed; transport arranged.'],
      teach: ['Discharge teach-back with patient and family.'],
      dispo: 'Discharged to SNF/rehab.',
      stickies: [{ title: 'Discharge today', body: 'Remove IV; send med list, last dose times and orthopedic orders; confirm transport.' }]
    });
    return st;
  }
})();
