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
        avoid: ['cephalosporin', 'cefazolin'], alt: { key: 'vancomycin_ppx', name: 'vancomycin IVPB', dose: `${Math.round(ctx.weightKg * 15 / 250) * 250} mg`, freq: 'q12h', cls: 'Glycopeptide antibiotic', info: 'Used because of cephalosporin allergy. Start infusion 60-120 minutes before incision; infuse over at least 90 minutes. Watch for red man reaction.', monitor: ['Cr'], renal: { ckd3: { freq: 'q24h', note: 'Interval extended for reduced kidney function.' }, esrd: { freq: 'q24h', note: 'Interval extended for ESRD.' } } },
        renal: { ckd3: { freq: 'q12h', note: 'Interval extended for reduced kidney function.' }, esrd: { freq: 'q24h', note: 'Interval extended for ESRD.' } } };
      const spec = {
        primaryTeam: 'surgeon', typicalLOS: [4, 6], fallRiskBoost: 2, noBowelRegimen: true,
        problem: { name: arthro ? 'Hip fracture (femoral neck)' : 'Hip fracture (intertrochanteric)', details: `${side} hip fracture after a ground-level fall; ${arthro ? 'hemiarthroplasty' : 'intramedullary nail fixation'} planned within 24-48 hours.` },
        chief: `${side} hip pain after a fall; unable to bear weight`,
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} who tripped on the way to the bathroom at night and fell onto the ${sl} side from standing height. Immediate severe ${sl} hip and groin pain with inability to stand or bear weight; the ${sl} leg was shortened and turned outward when EMS arrived. No loss of consciousness, head strike, chest pain, palpitations or preceding dizziness. Denies numbness or tingling in the foot. Received fentanyl 25 mcg IV from EMS.`,
        ros: 'Positive for hip/groin pain and inability to walk. Negative for head injury, neck pain, chest pain, dyspnea, abdominal pain, focal weakness, numbness, fever, or urinary symptoms.',
        keyLabs: ['Hemoglobin', 'WBC', 'Platelets', 'Sodium', 'Potassium', 'Creatinine', 'INR', 'Glucose'],
        isolation: 'None', famHxExtra: 'Mother had a hip fracture in her 80s. No known family history of bleeding disorders.',
        flags: { npo: npoH <= ctx.windowEnd ? [[npoH, dietH]] : [], preop: [[0, orH]], surgeryWindow: [[0, orH + 48]], postop: [[orEnd, 9999]] },
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
          { deviceType: 'IV', type: 'Peripheral IV', location: 'Right forearm', siteMarker: 'rightForearm', gauge: '20 gauge', placeH: 0.4, infusing: "Lactated Ringer's", status: 'Infusing', assess: 'site clean, dry, intact; flushes easily' },
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

// ================================================================================================
// UPPER GI BLEED
// ================================================================================================
(() => {
  const U = NS.util, C = NS.C, { atClock, clock } = NS.OG;
  const GI = 'K. Brandt, MD (Gastroenterology)';

  NS.PRIMARY.ugib = {
    key: 'ugib', label: 'Upper GI Bleed', group: 'Medical', cat: 'Gastrointestinal / Abdominal Surgery', typicalLOS: [2, 4],
    desc: 'Hematemesis and melena with orthostasis and Hgb drop. Day 1: 2 large-bore IVs, IV PPI, transfusion for Hgb <7, EGD with hemostasis. Day 2: serial H&H, diet advances. Day 3-4: oral PPI, H. pylori plan, discharge teaching. Cirrhosis in the history changes the cause to varices (octreotide, ceftriaxone, banding).',
    build(ctx) {
      const varices = [...ctx.hx].some(k => /cirrho|esld|liver/i.test(k));
      const nsaidUser = !varices && !ctx.allergic('nsaid');
      const cardiac = ctx.has('cad') || ctx.has('hf');
      const thr = cardiac ? 8 : 7;
      const egdH = atClock(ctx, '13:00', 6), egdEnd = egdH + 0.5, egdTime = clock(ctx, egdH);
      const d2 = atClock(ctx, '05:00', egdH + 6), d3 = d2 + 24, d4 = d3 + 24, d5 = d4 + 24;
      const dietClear = egdH + 3, dietReg = egdH + 9, dietLate = egdH + 33;
      const octStop = egdH + 60, ppiIvStop = egdH + 24, ppiBidStop = egdH + 48;
      const nsaid = ctx.age % 2 ? 'ibuprofen (MOTRIN) 600 mg PO three times daily' : 'naproxen (ALEVE) 440 mg PO twice daily';
      const lowLos = varices ? [3, 5] : [2, 4];
      const spec = {
        primaryTeam: 'hospitalist', typicalLOS: lowLos, noBowelRegimen: true, fallRiskBoost: 1,
        problem: { name: varices ? 'Upper GI bleed (esophageal varices)' : 'Upper GI bleed (peptic ulcer)', details: varices ? 'Variceal hemorrhage from portal hypertension; band ligation at EGD.' : `Bleeding duodenal ulcer${nsaidUser ? ' associated with NSAID use' : ''}; endoscopic hemostasis achieved.` },
        chief: 'Vomiting blood and black stools',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with ${varices ? 'known liver disease and ' : ''}one day of ${varices ? 'large-volume bright red hematemesis' : 'coffee-ground then bright red hematemesis (two episodes)'}, three black tarry foul-smelling stools, lightheadedness on standing, and one near-syncopal episode in the bathroom. ${nsaidUser ? `Takes OTC ${nsaid} for joint pain for several weeks; ` : ''}reports epigastric ${varices ? 'fullness' : 'burning for 2 weeks'}. No chest pain, dyspnea or abdominal distension. ${varices ? 'No prior variceal bleeding.' : 'No prior GI bleed or ulcer.'}`,
        ros: 'Positive for hematemesis, melena, lightheadedness, weakness and mild epigastric discomfort. Negative for chest pain, dyspnea, fever, hematochezia, weight loss, dysphagia, and confusion.',
        keyLabs: ['Hemoglobin', 'Hematocrit', 'Platelets', 'BUN', 'Creatinine', 'INR', 'Lactate', 'Potassium'],
        isolation: 'None',
        flags: { npo: [[0.5, dietClear]], surgeryWindow: [[0, 170]], bleeding: [[0, egdH + 60]] },
        ppxStartH: egdH + 48,
        vitals: [
          { h: 0, temp: 98.4, hr: 118, sbp: 98, dbp: 58, rr: 22, spo2: 97, pain: 3, o2: 'Room air' },
          { h: 1.5, temp: 98.4, hr: 110, sbp: 106, dbp: 62, rr: 20, spo2: 97, pain: 3 },
          { h: 4, temp: 98.6, hr: 112, sbp: 104, dbp: 60, rr: 20, spo2: 97, pain: 3 },
          { h: 6, temp: 98.6, hr: 120, sbp: 92, dbp: 54, rr: 22, spo2: 96, pain: 3 },
          { h: 8, temp: 98.8, hr: 114, sbp: 96, dbp: 56, rr: 20, spo2: 97, pain: 2 },
          { h: 11, temp: 98.8, hr: 102, sbp: 108, dbp: 64, rr: 18, spo2: 97, pain: 2 },
          { h: egdEnd + 1, temp: 99.0, hr: 98, sbp: 110, dbp: 66, rr: 18, spo2: 96, pain: 2 },
          { h: 18, temp: 98.8, hr: 92, sbp: 112, dbp: 68, rr: 16, spo2: 97, pain: 1 },
          { h: 30, temp: 98.6, hr: 86, sbp: 116, dbp: 70, rr: 16, spo2: 97, pain: 1 },
          { h: 54, temp: 98.4, hr: 80, sbp: 120, dbp: 72, rr: 16, spo2: 98, pain: 0 },
          { h: 100, temp: 98.4, hr: 76, sbp: 124, dbp: 76, rr: 16, spo2: 98, pain: 0 }
        ],
        labs: {
          Hemoglobin: { abs: [[0.5, 10.9], [6, 6.9], [9, 6.8], [12, 8.2], [18, 8.1], [24, 8.2], [30, 8.1], [36, 8.3], [48, 8.4], [72, 8.8], [96, 9.2], [144, 9.8], [200, 10.4]] },
          WBC: { add: [[0, 3.0], [24, 1.5], [60, 0]] },
          Platelets: { add: varices ? [[0, -120], [200, -120]] : [[0, 0]] },
          BUN: { add: [[0.5, 22], [10, 27], [24, 14], [48, 5], [72, 1]] },
          Creatinine: { add: [[0.5, 0.25], [24, 0.1], [60, 0]] },
          Potassium: { add: [[0, 0.1], [24, 0]] },
          Sodium: { add: varices ? [[0, -4]] : [[0, -1]] },
          Glucose: { add: [[0, 12], [30, 0]] },
          Lactate: { abs: [[0.5, 2.8], [4, 2.2], [8, 2.6], [13, 1.6], [26, 1.1]] },
          INR: { add: varices ? [[0, 0.5]] : [[0, 0.1], [24, 0]] },
          Albumin: { add: varices ? [[0, -1.1]] : [[0, -0.2]] },
          'Total bilirubin': { add: varices ? [[0, 1.4]] : [[0, 0]] },
          AST: { add: varices ? [[0, 40]] : [[0, 6]] },
          ALT: { add: varices ? [[0, 22]] : [[0, 4]] },
          'Troponin I': { abs: [[0, 0.01], [10, 0.01]] }
        },
        labSchedule: [
          { h: 0.5, codes: ['Lactate', 'PT', 'INR', 'aPTT', 'Albumin', 'Total bilirubin', 'AST', 'ALT', 'ALP', 'Magnesium'] },
          { h: 2, codes: ['Troponin I'] },
          ...[6, 12, 18, 24, 30, 36, 42, 48].map(h => ({ h, codes: ['Hemoglobin', 'Hematocrit'] })),
          { h: 12, codes: ['Lactate'] },
          { daily: true, fromH: 20, codes: ['BUN', 'Creatinine'] }
        ],
        quals: [
          { h: 1.0, category: 'Blood Bank', code: 'Type and crossmatch', value: 'O positive; antibody screen negative; 2 units PRBC crossmatched and available', specimen: 'Blood' },
          { h: 0.8, category: 'Other', code: 'Stool occult blood (rectal exam in ED)', value: 'Positive: black, tarry stool', reference: 'Negative', flag: 'Abnormal', specimen: 'Stool' },
          { h: 1.0, category: 'Urinalysis', code: 'Urinalysis - specific gravity', value: '1.030', reference: '1.005-1.030', specimen: 'Urine' },
          ...(varices ? [] : [
            { h: egdEnd + 2, category: 'Microbiology', code: 'Helicobacter pylori rapid urease test (gastric biopsy)', value: 'Positive', reference: 'Negative', flag: 'Abnormal', specimen: 'Gastric biopsy' },
            { h: egdEnd + 50, category: 'Pathology', code: 'Gastric biopsy histology', value: 'Chronic active gastritis with Helicobacter pylori organisms; no intestinal metaplasia or dysplasia', specimen: 'Gastric biopsy', status: 'Final' }
          ])
        ],
        events: [
          { type: 'cardiology', h: 1.6, study: '12-lead ECG', label: 'ECG for tachycardia and weakness', indication: 'Tachycardia, near-syncope; evaluate for demand ischemia',
            impression: ctx.has('afib') ? 'Atrial fibrillation with rapid ventricular response (rate 118). No acute ST-segment elevation. Nonspecific ST depression likely rate related.' : 'Sinus tachycardia, rate 114. No acute ST-segment elevation. Nonspecific ST-T flattening, rate related.' },
          { type: 'imaging', h: 2.2, study: 'Chest x-ray, portable', modality: 'X-ray', indication: 'Hematemesis; assess for aspiration before endoscopy', findings: 'Lungs are clear. No infiltrate, effusion or free air under the diaphragm. Heart size normal.', impression: 'No acute cardiopulmonary process; no evidence of aspiration.' },
          { type: 'consult', h: 2.6, service: 'Gastroenterology', author: GI, orderedBy: 'ed', reason: varices ? 'Hematemesis in a patient with cirrhosis; suspected variceal bleed' : 'Upper GI bleed with hemodynamic instability', label: 'GI consulted; urgent EGD after resuscitation',
            recommendation: varices ? `Start octreotide infusion and ceftriaxone, IV pantoprazole, restrictive transfusion (Hgb target 7-8). Urgent EGD with band ligation today (about ${egdTime}); airway protection if ongoing hematemesis. Continue ICU level monitoring.` : `High-dose IV pantoprazole (bolus then continuous). Transfuse for Hgb below ${thr}. EGD today (about ${egdTime}) once resuscitated, within 24 hours. Hold NSAIDs, aspirin and anticoagulants. Biopsy for H. pylori.` },
          { type: 'consult', h: 3.0, service: 'Hospital Medicine', author: 'hospitalist', orderedBy: 'ed', reason: 'Admission for upper GI bleed', label: 'Admitted to Hospital Medicine', recommendation: 'Admit with telemetry. Two large-bore IVs, type and crossmatch, serial H&H every 6 hours, strict I&O, NPO, IV PPI.' },
          { type: 'transfer', h: 4.0, label: varices ? 'Admitted to the intensive care unit' : 'Admitted to the medical unit (telemetry)', text: varices ? 'Transferred from the ED to the ICU for variceal bleeding.' : 'Transferred from the ED to the telemetry unit.' },
          ...(varices ? [{ type: 'imaging', h: 6.5, study: 'Ultrasound abdomen with Doppler', modality: 'Ultrasound', indication: 'Cirrhosis with variceal bleed; assess portal vein', findings: 'Nodular, echogenic liver consistent with cirrhosis. Splenomegaly (14.2 cm). Small volume ascites. Portal vein patent with hepatopetal flow. No focal liver lesion.', impression: 'Cirrhosis with portal hypertension; patent portal vein.' }] : []),
          { type: 'procedure', h: egdH, duration: 0.5, name: 'Esophagogastroduodenoscopy (EGD) with hemostasis', label: varices ? 'EGD with esophageal variceal band ligation' : 'EGD with endoscopic hemostasis of duodenal ulcer', by: GI, service: 'Gastroenterology',
            indication: varices ? 'Hematemesis in cirrhosis' : 'Hematemesis and melena with Hgb drop',
            findings: varices ? 'Moderate sedation/monitored anesthesia care with airway monitoring. Three columns of grade 3 esophageal varices with a red wale marker and a fibrin plug on one column. Six bands placed with good hemostasis. Mild portal hypertensive gastropathy; no gastric varices. No ulcer. Blood in the stomach suctioned.' : 'Monitored anesthesia care. Moderate amount of old blood and clot in the stomach, suctioned. 1.2 cm clean-edged duodenal bulb ulcer with a non-bleeding visible vessel (Forrest IIa). Injected with epinephrine 1:10,000 (8 mL) and two hemoclips placed with hemostasis. Gastric biopsies taken for rapid urease test and histology. No varices or masses.' }
        ],
        meds: [
          Object.assign(C.bolus('0.9% sodium chloride bolus', varices ? 500 : 1000, { start: 0.5, by: 'ed', indication: 'Hypovolemia from acute blood loss' }), { cls: 'Crystalloid IV fluid' }),
          C.nsMaintenance({ start: 2.5, stop: egdH + 6, rate: varices ? 75 : 100 }),
          { key: 'pantoprazole_bolus', name: 'pantoprazole (PROTONIX) injection', dose: '80 mg', route: 'IV', freq: 'once', startH: 0.7, by: 'ed', cls: 'Proton pump inhibitor', info: 'Loading dose before continuous infusion. Give over 2-15 minutes.', indication: 'Suspected bleeding ulcer / variceal bleed' },
          { key: 'pantoprazole_infusion', name: 'pantoprazole (PROTONIX) infusion', dose: '8 mg/hr', rate: '8 mg/hr (10 mL/hr)', mlPerHr: 10, concentration: '80 mg in 100 mL 0.9% sodium chloride', route: 'IV', freq: 'continuous', fluid: false, startH: 1.0, stopH: ppiIvStop, cls: 'Proton pump inhibitor', info: 'High-dose acid suppression to stabilize the clot; continue about 24 hours after endoscopic therapy, then twice daily. Dedicated line or compatible Y-site.', indication: 'Bleeding peptic ulcer / post-endoscopic hemostasis', by: 'hospitalist', monitor: ['Hgb', 'BP'] },
          { key: 'pantoprazole_iv', name: 'pantoprazole (PROTONIX) injection', dose: '40 mg', route: 'IV', freq: 'BID', startH: ppiIvStop, stopH: ppiBidStop, cls: 'Proton pump inhibitor', info: 'Twice daily PPI for 72 hours after endoscopic hemostasis; switch to oral when eating.', indication: 'Post-hemostasis acid suppression', by: 'hospitalist' },
          { key: 'pantoprazole', name: 'pantoprazole (PROTONIX) tablet', dose: '40 mg', route: 'Oral', freq: 'BID', startH: ppiBidStop, cls: 'Proton pump inhibitor', info: 'Give 30-60 minutes before breakfast and dinner. Continue twice daily for 8 weeks (duodenal ulcer) or until the outpatient GI visit.', indication: 'Peptic ulcer healing and prevention of rebleed', by: 'hospitalist' },
          { key: 'prbc', name: 'packed red blood cells (PRBC), 1 unit', dose: '1 unit (about 300 mL)', route: 'IV', freq: 'once', volume: 300, startH: 6.8, cls: 'Blood product', highAlert: true, by: 'hospitalist', info: 'Two-nurse verification at the bedside. Vitals before, at 15 minutes, hourly and after. Infuse over 2-3 hours through a filtered blood set with 0.9% sodium chloride only. Stop and notify provider for fever, chills, hives, dyspnea, back pain, or hypotension.', monitor: ['BP', 'HR', 'Temp', 'Hgb'], indication: `Hemoglobin 6.9 g/dL with ongoing bleeding (restrictive threshold: transfuse below ${thr} g/dL)`, nursing: ['Recheck H&H about 1 hour after the unit finishes.', 'Watch for volume overload if cardiac disease: crackles, dyspnea, SpO2 drop.'] },
          Object.assign(C.ondansetron({ start: 0.8, given: [0.8, 5, 10] }), { by: 'ed' }),
          { key: 'acetaminophen', name: 'acetaminophen (TYLENOL) tablet', dose: '650 mg', route: 'Oral', freq: 'q6h', prn: true, prnInterval: 'Every 6 hours', prnFor: 'pain or fever', sips: true, cls: 'Non-opioid analgesic', info: `Safe analgesic choice with a GI bleed. Maximum ${varices || ctx.has('liver') ? '2 g' : '3 g'} per 24 hours from all sources. No NSAIDs.`, monitor: ['Temp', 'Pain'], indication: 'Mild pain / fever', startH: 3, prnGiven: [], by: 'hospitalist' },
          ...(varices ? [
            { key: 'octreotide_bolus', name: 'octreotide (SANDOSTATIN) injection', dose: '50 mcg', route: 'IV', freq: 'once', startH: 1.2, by: 'ed', cls: 'Somatostatin analogue', info: 'Bolus before continuous infusion. Reduces portal pressure.', monitor: ['Glucose', 'HR'], indication: 'Suspected variceal hemorrhage' },
            { key: 'octreotide_infusion', name: 'octreotide (SANDOSTATIN) infusion', dose: '50 mcg/hr', rate: '50 mcg/hr (25 mL/hr)', mlPerHr: 25, concentration: '500 mcg in 250 mL 0.9% sodium chloride', route: 'IV', freq: 'continuous', startH: 1.4, stopH: octStop, cls: 'Somatostatin analogue', highAlert: true, info: 'Continue 2-5 days after banding. Do not stop abruptly without an order. Monitor glucose (hypo- or hyperglycemia), HR (bradycardia) and abdominal pain.', monitor: ['Glucose', 'HR', 'BP'], indication: 'Variceal hemorrhage', by: 'hospitalist' },
            { key: 'ceftriaxone', name: 'ceftriaxone (ROCEPHIN) IVPB', dose: '1 g', route: 'IV', freq: 'q24h', anchorStart: true, startH: 1.8, stopH: 1.8 + 24 * 7, volume: 50, cls: 'Cephalosporin antibiotic', info: 'Antibiotic prophylaxis for up to 7 days in cirrhosis with GI bleeding reduces infection, rebleeding and mortality. Verify allergy history. Infuse over 30 minutes.', monitor: ['Temp', 'WBC'], indication: 'Infection prophylaxis in cirrhosis with GI bleed', by: 'hospitalist' },
            { key: 'lactulose', name: 'lactulose solution', dose: '20 g (30 mL)', route: 'Oral', freq: 'BID', startH: dietClear, cls: 'Osmotic laxative', info: 'Prevents hepatic encephalopathy after a GI bleed (blood is a protein load). Titrate to 2-3 soft bowel movements daily; hold for more than 4 loose stools and notify provider.', monitor: ['Na', 'K'], hold: 'Hold for more than 4 loose stools in 24 hours.', indication: 'Hepatic encephalopathy prevention', by: 'hospitalist' },
            { key: 'carvedilol', name: 'carvedilol (COREG) tablet', dose: '3.125 mg', route: 'Oral', freq: 'BID', startH: octStop, cls: 'Non-selective beta blocker', info: 'Secondary prophylaxis of variceal bleeding after octreotide is stopped. Give with food. Check BP and HR first.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider for HR below 55 or SBP below 90.', indication: 'Prevent variceal rebleeding', by: 'hospitalist' }
          ] : [])
        ],
        orders: [
          C.diet('NPO', 0.5, dietClear, 'Nothing by mouth for active GI bleeding and endoscopy; sips with essential medications only if ordered.'),
          C.diet('Clear liquid diet', dietClear, dietReg, 'Start after the patient is awake and gag reflex returned; advance if no nausea or rebleeding.'),
          ...(varices ? [C.diet('Soft diet', dietReg, dietLate, 'Soft foods for 24-48 hours after band ligation (risk of banding ulcer and dysphagia). 2 g sodium.'), C.diet('Regular diet', dietLate, undefined, '2 g sodium diet; small frequent meals; no alcohol.')]
            : [C.diet('Regular diet', dietReg, undefined, 'Early feeding after endoscopic hemostasis; advance as tolerated. Avoid alcohol and caffeine.')]),
          C.activity('Bed rest, up with assistance only', 0.5, egdH + 6, 'Orthostatic precautions: dangle at bedside before standing; two-person assist for first stand; bedside commode.'),
          C.activity('Up with assistance', egdH + 6, undefined, 'Orthostatic precautions: sit then stand slowly; call for help; fall precautions while Hgb is low.'),
          { name: 'Vital signs', category: 'Nursing', frequency: 'Every 15 minutes x 4, hourly x 6 hours, then every 4 hours', startH: 0.5, instructions: 'Notify provider for SBP below 90, HR above 120, new hematemesis or bloody/maroon stool, confusion, or chest pain.' },
          { name: 'Orthostatic blood pressure and heart rate', category: 'Nursing', frequency: 'On admission, then once daily when stable', startH: 1, instructions: 'Supine, then sitting, then standing at 1 and 3 minutes. Positive if SBP drops 20 or more mmHg, DBP 10 or more, or HR rises 20 or more bpm. Do not stand an unstable patient.', nursing: ['Stop the test and return to bed for dizziness, pallor or near-syncope.'] },
          { name: 'Intake and output, strict (include stool and emesis)', category: 'Nursing', frequency: 'Every shift', startH: 0.5, instructions: 'Record IV, oral, urine (goal above 0.5 mL/kg/hr), emesis and stool (color, consistency, amount).', nursing: ['Chart stool: black/tarry, maroon, or brown; guaiac if unsure.'] },
          { name: 'Serial hemoglobin and hematocrit', category: 'Laboratory', frequency: 'Every 6 hours x 48 hours', startH: 0.5, stopH: 49, instructions: 'Draw H&H every 6 hours; notify provider for Hgb drop of 2 g/dL or more, or below the transfusion threshold.' },
          { name: 'Type and crossmatch 2 units PRBC', category: 'Laboratory', frequency: 'Once', startH: 0.7, completeH: 1.6, instructions: 'Keep 2 units crossmatched and available while bleeding.' },
          { name: `Transfusion threshold: Hgb below ${thr} g/dL`, category: 'Nursing', frequency: 'Per lab result', startH: 0.7, instructions: `Restrictive strategy: transfuse 1 unit PRBC at a time for Hgb below ${thr} g/dL${cardiac ? ' (below 8 g/dL because of cardiovascular disease)' : ' (below 8 g/dL if cardiovascular disease)'}; transfuse earlier for hemodynamic instability or massive ongoing bleeding. Recheck Hgb after each unit.${varices ? ' Avoid over-transfusion (target 7-8): raises portal pressure and rebleeding risk.' : ''}` },
          { name: 'Hold NSAIDs, aspirin and anticoagulants', category: 'Precautions', frequency: 'Continuous', startH: 0.5, instructions: 'No ibuprofen, naproxen, ketorolac, aspirin-containing products or anticoagulants/antiplatelets until the provider and GI clear them. Pharmacologic VTE prophylaxis deferred; SCDs only.', nursing: ['Ask about OTC NSAIDs, aspirin, and herbal products; document and educate.', 'If the patient has a stent or mechanical valve, tell the provider that aspirin/anticoagulant is on hold.'] },
          { name: 'Aspiration and bleeding precautions', category: 'Precautions', frequency: 'Continuous', startH: 0.5, stopH: egdH + 12, instructions: 'Head of bed 30-45 degrees; suction set up at bedside; emesis basin; keep NPO; call for any new hematemesis.', nursing: ['Large-volume hematemesis: call a rapid response, protect the airway, lateral position, large-bore IV fluids and blood.'] },
          { name: 'Cardiac monitoring (telemetry)', category: 'Nursing', frequency: 'Continuous', startH: 3, stopH: egdH + 30, instructions: 'Monitor for tachycardia, ST changes or arrhythmia with acute blood loss. Notify provider for HR above 120 or chest pain.' },
          { name: 'Sequential compression devices', category: 'Nursing', frequency: 'Continuous when in bed', startH: 3, instructions: 'Mechanical VTE prophylaxis while pharmacologic prophylaxis is held for GI bleeding.' },
          { name: 'EGD pre-procedure checklist and consent', category: 'Nursing', frequency: 'Once', startH: 3, completeH: egdH - 0.3, instructions: 'Verify consent, NPO status, IV access, last Hgb/INR, allergies, dentures removed, and a responsible adult for discharge. Report to endoscopy.' },
          { name: 'Endoscopy findings and rebleeding watch', category: 'Nursing', frequency: 'Every 4 hours', startH: egdEnd, stopH: egdH + 48, instructions: 'After sedation: airway, SpO2, abdominal pain or rigidity (perforation), new melena or hematemesis. Notify provider immediately for rebleeding.' },
          ...(varices ? [{ name: 'Hepatic encephalopathy and ascites assessment', category: 'Nursing', frequency: 'Every shift', startH: 4, instructions: 'Check orientation, sleep pattern, asterixis, abdominal girth and weight. Avoid sedatives. Notify provider for confusion, fever or abdominal pain.', nursing: ['Daily weight and abdominal girth; 2 g sodium diet.'] }] : []),
          ...(nsaidUser ? [{ name: 'NSAID avoidance teaching', category: 'Nursing', frequency: 'Once before discharge', startH: egdEnd + 20, instructions: 'Review OTC products containing ibuprofen, naproxen, aspirin; acetaminophen is the preferred analgesic.' }] : []),
          { name: 'Tobacco and alcohol counseling', category: 'Nursing', frequency: 'Before discharge', startH: egdEnd + 24, instructions: 'Smoking and alcohol delay ulcer healing and worsen liver disease; offer cessation resources.' }
        ],
        devices: [
          { deviceType: 'IV', type: 'Peripheral IV', location: 'Right antecubital', siteMarker: 'rightAC', gauge: '18 gauge', placeH: 0.3, infusing: '0.9% sodium chloride', status: 'Infusing', assess: 'large-bore; site clean, dry, intact; flushes easily' },
          C.pivSecond(0.5, 'Left antecubital', '18 gauge')
        ],
        assessments: [
          { fromH: 0, items: [['Neurologic', 'Level of Consciousness', 'Alert, anxious'], ['Cardiac', 'Rhythm', ctx.has('afib') ? 'Atrial fibrillation with rapid response' : 'Sinus tachycardia'], ['Cardiac', 'Capillary Refill', '3-4 seconds, cool extremities'], ['Cardiac', 'Orthostatic Vitals', 'Supine 98/58 HR 118; sitting 82/46 HR 136 with lightheadedness (positive)'], ['GI', 'Abdomen', varices ? 'Mildly distended with shifting dullness (ascites), soft, mild epigastric tenderness; no rigidity' : 'Soft, mild epigastric tenderness, no guarding, rebound or rigidity; non-distended'], ['GI', 'Bowel Sounds', 'Hyperactive'], ['GI', 'Nausea / Vomiting', 'Nauseated; hematemesis x2 before arrival'], ['GI', 'Stool', 'Melena: black, tarry, foul-smelling; guaiac positive on rectal exam'], ['Pain', 'Pain Location', 'Epigastric, burning, 3/10'], ['Skin', 'Skin', varices ? 'Pale, cool, diaphoretic; mild scleral icterus; spider angiomata on chest; dry mucous membranes' : 'Pale, cool and diaphoretic; dry mucous membranes; poor skin turgor'], ['Safety', 'Bleeding Precautions', 'Active: soft toothbrush, avoid IM injections, pressure to venipuncture sites'], ...(varices ? [['Neurologic', 'Asterixis', 'None']] : [])] },
          { fromH: 4, items: [['GI', 'Nausea / Vomiting', 'Nausea; no further hematemesis since ED'], ['GI', 'Stool', 'One melenic stool on unit (about 150 mL), black and tarry']] },
          { fromH: 7.5, items: [['Cardiac', 'Orthostatic Vitals', 'Not repeated: SBP 90s and HR 110s; bed rest while being transfused'], ['Skin', 'Skin', 'Pale; transfusion in progress without reaction']] },
          { fromH: egdEnd, items: [['GI', 'Abdomen', varices ? 'Soft, mildly distended (ascites), mild epigastric/chest discomfort after banding, no rigidity' : 'Soft, mild epigastric tenderness, non-distended, no rigidity or rebound'], ['GI', 'Nausea / Vomiting', 'None; mild sore throat from the endoscope'], ['GI', 'Stool', 'Small black stool after EGD; no bright red blood'], ['Cardiac', 'Capillary Refill', 'Less than 3 seconds'], ['Cardiac', 'Orthostatic Vitals', 'Supine 112/68 HR 94; standing 100/60 HR 108 (borderline, symptom-free)'], ['Skin', 'Skin', 'Pink, warm; mucous membranes moist'], ['Neurologic', 'Level of Consciousness', 'Alert, calm']] },
          { fromH: d2, items: [['GI', 'Stool', 'Dark brown to black stool x1, smaller, no frank blood'], ['GI', 'Bowel Sounds', 'Normoactive'], ['Cardiac', 'Orthostatic Vitals', 'Supine 118/70 HR 84; standing 112/66 HR 92: negative'], ['Pain', 'Pain Location', 'Mild epigastric soreness, 1/10'], ['Safety', 'Bleeding Precautions', 'Continue'], ['Cardiac', 'Rhythm', ctx.has('afib') ? 'Atrial fibrillation, rate controlled' : 'Normal sinus rhythm']] },
          { fromH: d3, items: [['GI', 'Stool', 'Brown, formed stool; no melena today'], ['GI', 'Abdomen', varices ? 'Soft, mild ascites, non-tender' : 'Soft, non-tender, non-distended'], ['Pain', 'Pain Location', 'None'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent; steady gait, no dizziness']] }
        ],
        io: [
          { fromH: 0, po: 0, urine: 280, other: 120, otherLabel: 'Emesis / melena (estimated)' },
          { fromH: 8, po: 0, urine: 360, other: 60, otherLabel: 'Melena (estimated)' },
          { fromH: dietClear, po: 180, urine: 330, other: 0 },
          { fromH: dietReg, po: 340, urine: 320 },
          { fromH: d2, po: 420, urine: 320 }
        ],
        therapy: { pt: false },
        discharge: { dispo: () => varices ? 'Home with GI/hepatology follow-up and repeat banding in 2-4 weeks' : 'Home with primary care and GI follow-up', estimate: varices ? 'hospital day 4-5 once octreotide is finished and Hgb stable' : 'hospital day 3-4 once Hgb is stable for 48 hours and eating' },
        stages: ugibStages(ctx, { varices, nsaidUser, thr, egdH, egdEnd, egdTime, d2, d3, d4, d5, octStop }),
        stickies: [
          { title: 'Do not give', body: 'No NSAIDs, aspirin products or anticoagulants until cleared. SCDs only for VTE prophylaxis.' },
          ...(varices ? [{ title: 'Variceal bleed', body: 'Octreotide infusion: do not stop abruptly. Ceftriaxone prophylaxis. Watch for encephalopathy; avoid sedatives; transfusion goal Hgb 7-8.' }] : [])
        ],
        objectives: ['Recognize hemodynamic instability from acute GI bleeding (orthostasis, tachycardia, falling Hgb, high BUN-to-creatinine ratio) and prioritize interventions.', `Apply a restrictive transfusion strategy (Hgb below ${thr}) and safely administer blood products.`, 'Care for a patient before and after EGD: NPO, sedation recovery, rebleeding watch, diet advancement.', 'Teach NSAID avoidance, PPI adherence, H. pylori treatment and bleeding warning signs.']
      };
      if (nsaidUser) NS.HX.helpers.heldNote(spec, `${nsaid} (OTC for joint pain) - STOPPED: NSAID-associated ulcer bleed; never resume`);
      return spec;
    }
  };

  function ugibStages(ctx, p) {
    const { varices, nsaidUser, thr, egdH, egdEnd, egdTime, d2, d3, d4, d5, octStop } = p;
    const st = [];
    st.push({
      fromH: 0, id: 'acute', label: 'Acute GI bleed: resuscitation, NPO, awaiting EGD',
      problem: varices ? 'Acute variceal hemorrhage in cirrhosis; hemodynamically unstable on arrival.' : 'Acute upper GI bleed (suspected peptic ulcer) with orthostasis and a falling hemoglobin.',
      subj: 'Weak and lightheaded when sitting up; nauseated. No further vomiting of blood since arrival; one black stool. Mild epigastric discomfort. Thirsty.',
      assess: `Acute blood loss anemia with tachycardia and borderline hypotension (arrival Hgb 10.9 g/dL will fall as fluids equilibrate; repeat H&H at 06:00-08:00); BUN/Cr ratio above 30 consistent with upper GI source. ${varices ? 'Cirrhosis with portal hypertension: variceal bleed until proven otherwise.' : 'Likely bleeding peptic ulcer' + (nsaidUser ? ' (NSAID use)' : '') + '.'}`,
      plan: ['Two large-bore IVs; 0.9% saline bolus then maintenance; type and crossmatch; strict I&O.', varices ? 'Octreotide bolus and infusion; ceftriaxone; IV pantoprazole.' : 'IV pantoprazole 80 mg bolus then 8 mg/hr infusion.', `Repeat H&H every 6 hours; transfuse 1 unit PRBC for Hgb below ${thr} (type and crossmatch ready).`, `NPO; EGD with hemostasis today (about ${egdTime}) after resuscitation.`, 'Hold NSAIDs, aspirin, anticoagulants; SCDs only; telemetry.'],
      nursing: ['Pale, cool, diaphoretic; HR 110-120, BP 90s/50s; orthostatic positive.', 'Two 18 g IVs infusing; urine output monitored.', 'Melena documented; bedside commode with assistance only.', 'Pre-EGD teaching and consent; NPO maintained.'],
      teach: ['Why NPO, why bed rest/call for help before standing, what the EGD involves, and to report vomiting blood or black stools immediately.'],
      dispo: varices ? 'ICU for 24-48 hours, then floor; anticipate 4-5 days.' : 'Anticipate 2-4 days if hemostasis is achieved.',
      objectives: ['Perform and interpret orthostatic vital signs and monitor transfusion safely.'],
      stickies: [{ title: 'Bleeding', body: `Transfuse for Hgb below ${thr}. EGD about ${egdTime}. Report SBP below 90, HR above 120, new hematemesis.` }]
    });
    st.push({
      fromH: egdEnd, id: 'post_egd', label: 'After EGD: hemostasis achieved, rebleeding watch',
      problem: varices ? 'Esophageal varices banded; high risk of early rebleeding.' : 'Duodenal ulcer with visible vessel treated with epinephrine and clips; high rebleeding risk for 72 hours.',
      subj: 'Throat sore after the scope; no abdominal pain. Feels less dizzy after the blood. No vomiting. Small dark stool.',
      assess: 'Hemostasis achieved; hemodynamics improved; Hgb stable at about 8 g/dL after 1 unit PRBC.',
      plan: ['Continue IV PPI infusion ' + (varices ? 'and octreotide' : 'for 24 hours after hemostasis') + '; H&H every 6 hours.', 'Clear liquids this afternoon, advance if no rebleeding.', 'Rebleeding watch: tachycardia, hypotension, melena or hematemesis; abdominal pain (perforation).', varices ? 'Lactulose; ceftriaxone for up to 7 days; avoid sedatives; step down to floor in 24 hours.' : 'H. pylori rapid urease positive; plan eradication therapy; histology pending.'],
      nursing: ['Awake and oriented after sedation; gag reflex present; swallow check before clears.', 'Vital signs every 15 minutes then hourly; BP 110/66, HR 98.', 'Small dark stool; no bright red blood; abdomen soft.', 'Orthostatic precautions continue.'],
      teach: ['After EGD: sore throat is normal; report abdominal pain, black or bloody stools, vomiting blood, or lightheadedness.'],
      dispo: 'Anticipate transition to oral PPI and discharge in 1-3 days if no rebleeding.'
    });
    st.push({
      fromH: d2, id: 'day2', label: 'Day after EGD: stable, diet advancing',
      problem: 'Upper GI bleed s/p endoscopic hemostasis; hemoglobin stable; no rebleeding in 24 hours.',
      subj: 'Feels much better; hungry. One small dark stool overnight, none since. No dizziness walking to the bathroom.',
      assess: 'Hgb stable at 8.1-8.4 for 18 hours; HR 80s, BP 116/70; orthostatics negative. Melena clearing (expected for several days).',
      plan: [varices ? 'Continue octreotide through about 72 hours; lactulose to 2-3 stools daily; ceftriaxone.' : 'Change from infusion to IV pantoprazole 40 mg twice daily, then oral twice daily tomorrow.', 'Advance to regular' + (varices ? '/soft 2 g sodium' : '') + ' diet; stop IV fluids.', 'H&H every 6 hours through 48 hours then daily; transfuse only for Hgb below ' + thr + '.', 'Pharmacologic VTE prophylaxis stays held; SCDs; ambulate with assistance.', nsaidUser ? 'Stop NSAIDs permanently; acetaminophen for pain.' : 'Review alcohol, smoking and other triggers.'],
      nursing: ['Stable overnight; no hematemesis; stool dark brown, one small.', 'Ambulating to bathroom with standby assist; orthostatics negative.', 'Eating most of meals without nausea.', 'IV sites clean; 18 g IV x2 maintained until H&H stable.'],
      teach: ['Black stools can last several days; report red blood, large black stools with dizziness, or vomiting. Avoid NSAIDs, aspirin, alcohol.'],
      dispo: varices ? 'Floor level of care; discharge in 2-3 days.' : 'Possible discharge tomorrow if Hgb remains stable.'
    });
    if (varices) {
      st.push({
        fromH: d3, id: 'day3', label: 'Variceal bleed: octreotide finishing, beta blocker started',
        problem: 'Banded esophageal varices; no rebleeding; transitioning to secondary prophylaxis.',
        subj: 'Eating soft foods; mild chest discomfort when swallowing; no vomiting. Brown stools.',
        assess: 'No rebleeding for 48 hours; Hgb stable around 8.4-8.8; mild ascites; alert, no asterixis.',
        plan: ['Octreotide off at 72 hours; start carvedilol for secondary prophylaxis (hold for SBP below 90).', 'Continue PPI (banding ulcers), lactulose; complete ceftriaxone course (up to 7 days).', 'Repeat banding in 2-4 weeks; hepatology follow-up; alcohol cessation if applicable.', 'Sodium restriction; daily weights.'],
        nursing: ['Octreotide infusion weaned per order; glucose stable; HR above 60.', 'Mild dysphagia with banding; soft diet tolerated.', 'Alert, oriented; no asterixis; abdominal girth unchanged.'],
        teach: ['Variceal bleeding warning signs; lactulose goal of 2-3 soft stools; avoid NSAIDs, alcohol, sedatives; sodium restriction.'],
        dispo: 'Discharge tomorrow if stable.'
      });
      st.push({
        fromH: d4, id: 'ready', label: 'Ready for discharge',
        problem: 'Variceal bleed s/p banding; stable; discharge planning.',
        subj: 'Feels well, eating regular low-sodium diet, brown stools, no dizziness.', assess: 'Hgb stable above 8.5 for 48 hours; no encephalopathy; meets discharge criteria.',
        plan: ['Discharge home with carvedilol, PPI, lactulose; GI/hepatology follow-up and repeat EGD in 2-4 weeks.'], nursing: ['Ambulating independently; vitals stable; teach-back with patient and family.'],
        teach: ['Medications, bleeding warning signs, low-sodium diet, alcohol avoidance, follow-up appointments.'], dispo: 'Discharge home today.',
        stickies: [{ title: 'Discharge today', body: 'Teach-back on bleeding warning signs and medications; remove IVs; arrange follow-up with GI.' }]
      });
    } else {
      st.push({
        fromH: d3, id: 'dc_prep', label: 'Oral PPI, H. pylori plan, discharge teaching',
        problem: 'Bleeding duodenal ulcer s/p hemostasis, H. pylori positive; hemoglobin stable; ready for discharge planning.',
        subj: 'No dizziness, no black stools today, eating regular diet, no abdominal pain.',
        assess: 'No rebleeding for 48-72 hours; Hgb stable at 8.4-8.8; tolerating oral PPI; meets discharge criteria.',
        plan: ['Pantoprazole 40 mg orally twice daily for 8 weeks.', 'H. pylori: bismuth quadruple therapy (pantoprazole, bismuth, tetracycline, metronidazole) for 14 days, penicillin-allergy safe; test of cure at least 4 weeks after finishing.', nsaidUser ? 'Permanent NSAID avoidance; acetaminophen only.' : 'Address alcohol/smoking.', 'Iron supplement if ferritin low; CBC in 1 week; GI follow-up in 6-8 weeks.', 'Aspirin or anticoagulant resumption plan per provider/GI (within 1-7 days after hemostasis if indicated).'],
        nursing: ['Ambulating independently; no orthostasis.', 'Tolerating regular diet; stool brown.', 'Discharge teaching started; medication list reviewed.'],
        teach: ['Teach-back: no NSAIDs or aspirin products unless prescribed, PPI twice daily, finishing the H. pylori antibiotics, and returning for vomiting blood, black or bloody stools, dizziness, fainting or severe abdominal pain.'],
        dispo: 'Discharge home today or tomorrow.',
        stickies: [{ title: 'Discharge', body: 'Teach-back on NSAID avoidance, PPI, H. pylori therapy and bleeding signs; CBC in 1 week; follow-up with GI.' }]
      });
    }
    return st;
  }
})();

// ================================================================================================
// ACUTE PANCREATITIS
// ================================================================================================
(() => {
  const U = NS.util, C = NS.C, { atClock, clock } = NS.OG;

  NS.PRIMARY.pancreatitis = {
    key: 'pancreatitis', label: 'Acute Pancreatitis', group: 'Medical', cat: 'Gastrointestinal / Abdominal Surgery', typicalLOS: [3, 6],
    desc: 'Gallstone or alcohol pancreatitis. Day 1: epigastric pain to the back, lipase >3x, ultrasound, moderate lactated Ringer\'s, IV opioid, antiemetic, CIWA if alcohol. Day 2: reassess BUN/Hct, clear liquids. Day 3-6: low-fat diet, oral analgesia, discharge. Day 7+: recurrence with refeeding and peripancreatic fluid.',
    build(ctx) {
      const comp = ctx.L >= 7;                                        // moderately severe course with refeeding pain and peripancreatic fluid
      const drinks = /Heavy|Moderate/i.test((ctx.social || {}).alcohol || '') || [...ctx.hx].some(k => /alcohol/i.test(k));
      const heavy = /Heavy/i.test((ctx.social || {}).alcohol || '');
      const gall = !drinks;
      const clearH = 14, lowFatH = comp ? 104 : 36, recH = 58, ctH = 70;
      const d2 = atClock(ctx, '05:00', 20), d3 = d2 + 24, d4 = d3 + 24, d5 = d4 + 24, d6 = d5 + 24;
      const npo2 = comp ? [[0.5, clearH], [recH, 92]] : [[0.5, clearH]];
      const contrastCT = ctx.renal === 'none';
      const spec = {
        primaryTeam: 'hospitalist', typicalLOS: [3, 6], noAutoProlonged: false,
        problem: { name: 'Acute pancreatitis', details: `${gall ? 'Gallstone' : 'Alcohol-associated'} acute pancreatitis${comp ? ' with peripancreatic fluid collection (moderately severe)' : ' (mild, interstitial edematous)'}.` },
        chief: 'Severe epigastric pain radiating to the back with vomiting',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with 10 hours of constant, boring epigastric pain radiating straight through to the back, worse lying flat and partly relieved leaning forward, with nausea and repeated non-bloody emesis. Onset ${gall ? 'about 2 hours after a large, fatty dinner; prior episodes of brief right upper quadrant pain after meals' : 'the morning after heavy drinking over several days; last drink about 16 hours before arrival'}. No fever at home, hematemesis, chest pain, or diarrhea. ${gall ? 'No jaundice or dark urine.' : 'No prior pancreatitis.'}`,
        ros: 'Positive for epigastric pain radiating to the back, nausea, vomiting, anorexia and abdominal bloating. Negative for fever, chest pain, dyspnea, hematemesis, melena, jaundice and dysuria.',
        keyLabs: ['WBC', 'Hematocrit', 'BUN', 'Creatinine', 'Calcium', 'Glucose', 'Lipase', 'CRP'], isolation: 'None',
        flags: { npo: npo2 },
        vitals: comp ? [
          { h: 0, temp: 99.8, hr: 108, sbp: 142, dbp: 86, rr: 22, spo2: 96, pain: 9, o2: 'Room air' },
          { h: 3, temp: 99.6, hr: 102, sbp: 138, dbp: 82, rr: 20, spo2: 96, pain: 5 },
          { h: 24, temp: 100.4, hr: 98, sbp: 134, dbp: 80, rr: 18, spo2: 95, pain: 4 },
          { h: 40, temp: 99.4, hr: 90, sbp: 130, dbp: 78, rr: 18, spo2: 96, pain: 3 },
          { h: recH, temp: 100.6, hr: 104, sbp: 136, dbp: 82, rr: 20, spo2: 95, pain: 7 },
          { h: ctH, temp: 101.2, hr: 108, sbp: 132, dbp: 78, rr: 20, spo2: 94, pain: 6, o2: '2 L nasal cannula' },
          { h: 88, temp: 100.0, hr: 94, sbp: 130, dbp: 78, rr: 18, spo2: 95, pain: 4, o2: 'Room air' },
          { h: 112, temp: 99.2, hr: 86, sbp: 128, dbp: 76, rr: 16, spo2: 96, pain: 3 },
          { h: 150, temp: 98.4, hr: 78, sbp: 124, dbp: 76, rr: 16, spo2: 97, pain: 2 }
        ] : [
          { h: 0, temp: 99.6, hr: 106, sbp: 144, dbp: 88, rr: 22, spo2: 96, pain: 9, o2: 'Room air' },
          { h: 3, temp: 99.4, hr: 100, sbp: 138, dbp: 82, rr: 20, spo2: 96, pain: 5 },
          { h: 14, temp: 99.6, hr: 96, sbp: 134, dbp: 80, rr: 18, spo2: 96, pain: 4 },
          { h: 24, temp: 100.2, hr: 94, sbp: 132, dbp: 78, rr: 18, spo2: 95, pain: 4 },
          { h: 38, temp: 99.2, hr: 86, sbp: 128, dbp: 76, rr: 16, spo2: 96, pain: 3 },
          { h: 60, temp: 98.6, hr: 78, sbp: 126, dbp: 76, rr: 16, spo2: 97, pain: 2 },
          { h: 96, temp: 98.4, hr: 74, sbp: 124, dbp: 74, rr: 16, spo2: 97, pain: 1 }
        ],
        labs: {
          Lipase: { abs: comp ? [[0, 1450], [24, 900], [48, 600], [58, 880], [72, 700], [96, 420], [130, 160]] : [[0, 1450], [24, 820], [48, 380], [72, 190], [96, 110], [132, 70]] },
          Amylase: { abs: [[0, 520], [24, 260], [48, 120], [96, 80]] },
          WBC: { add: comp ? [[0, 7.2], [24, 5], [48, 3], [58, 6], [72, 8.5], [96, 5], [130, 2], [170, 0.5]] : [[0, 7.2], [24, 4.6], [48, 2.2], [72, 0.8], [96, 0]] },
          Hemoglobin: { add: [[0, 1.0], [24, -0.8], [48, -1.2], [96, -1.0], [160, -0.6]] },
          BUN: { add: comp ? [[0, 9], [24, 5], [48, 1], [70, 6], [96, 2], [130, 0]] : [[0, 9], [24, 5], [48, 1], [72, 0]] },
          Creatinine: { add: [[0, 0.15], [24, 0.05], [48, 0]] },
          Sodium: { add: [[0, -3], [24, -1], [48, 0]] },
          Potassium: { add: [[0, -0.2], [24, -0.3], [48, -0.1], [72, 0]] },
          Chloride: { add: [[0, -4], [24, -2], [48, 0]] },
          CO2: { add: [[0, 2], [24, 1], [48, 0]] },
          Glucose: { add: [[0, 40], [24, 25], [48, 10], [72, 0]] },
          Calcium: { add: [[0, -0.2], [24, -0.6], [48, -0.9], [96, -0.5], [144, -0.2]] },
          Albumin: { add: [[0, -0.3], [48, -0.7], [120, -0.4]] },
          Magnesium: { abs: drinks ? [[0, 1.5], [12, 1.8], [48, 1.8]] : [[0, 1.9], [48, 1.9]] },
          Phosphorus: { abs: drinks ? [[0, 2.6], [24, 2.3], [48, 2.7]] : [[0, 3.2], [48, 3.3]] },
          Lactate: { abs: [[0.4, 1.9], [6, 1.2]] },
          Triglycerides: { abs: [[0.5, drinks ? 260 : 150]] },
          CRP: { abs: comp ? [[0, 38], [24, 130], [48, 205], [72, 260], [100, 180], [140, 60]] : [[0, 38], [24, 120], [48, 210], [72, 150], [96, 70], [130, 30]] },
          AST: { add: gall ? [[0, 190], [24, 130], [48, 60], [96, 10]] : [[0, 78], [48, 40], [96, 20]] },
          ALT: { add: gall ? [[0, 260], [24, 180], [48, 90], [96, 25]] : [[0, 30], [48, 14], [96, 6]] },
          ALP: { add: gall ? [[0, 120], [48, 80], [96, 30]] : [[0, 15]] },
          'Total bilirubin': { add: gall ? [[0, 1.8], [24, 1.3], [48, 0.6], [96, 0.1]] : [[0, 0.4]] },
          GGT: { add: drinks ? [[0, 160]] : [[0, 10]] }
        },
        labSchedule: [
          { h: 0.5, codes: ['Lipase', 'Amylase', 'Lactate', 'Triglycerides', 'AST', 'ALT', 'ALP', 'Total bilirubin', 'Albumin', 'Magnesium', 'Phosphorus', 'CRP', ...(drinks ? ['GGT'] : [])] },
          { h: 24, codes: ['Lipase', 'CRP', 'Phosphorus', 'AST', 'ALT', 'ALP', 'Total bilirubin'] },
          { h: 48, codes: ['CRP', 'Phosphorus', 'Albumin', ...(gall ? ['AST', 'ALT', 'Total bilirubin'] : [])] },
          { h: 72, codes: comp ? ['Lipase', 'CRP', 'Phosphorus'] : ['Lipase', 'CRP'] },
          ...(comp ? [{ h: 62, codes: ['Lactate', 'CRP'] }, { h: 100, codes: ['CRP', 'Lipase'] }] : [])
        ],
        quals: [
          { h: 0.8, category: 'Urinalysis', code: 'Urinalysis - ketones', value: 'Small', reference: 'Negative', flag: 'Abnormal', specimen: 'Urine' },
          { h: 0.8, category: 'Urinalysis', code: 'Urinalysis - specific gravity', value: '1.030', reference: '1.005-1.030', specimen: 'Urine' },
          ...(drinks ? [{ h: 0.9, category: 'Toxicology', code: 'Ethanol level', value: 'Undetectable (<10 mg/dL)', reference: '<10', specimen: 'Blood' }] : []),
          ...(ctx.female && ctx.age >= 12 && ctx.age <= 55 ? [{ h: 0.8, category: 'Other', code: 'Urine hCG (pregnancy test)', value: 'Negative', reference: 'Negative', specimen: 'Urine' }] : []),
          ...(comp ? [{ h: 62, category: 'Microbiology', code: 'Blood cultures x2', value: 'No growth at 5 days (final)', specimen: 'Blood', status: 'Final' }] : [])
        ],
        events: [
          { type: 'imaging', h: 1.5, study: 'Ultrasound abdomen, right upper quadrant', modality: 'Ultrasound', indication: 'Epigastric pain, elevated lipase; evaluate for gallstones and biliary dilatation',
            findings: gall ? 'Multiple gallstones, largest 8 mm, with sludge; no gallbladder wall thickening or pericholecystic fluid. Common bile duct 6 mm, not dilated. Pancreas is partly obscured by bowel gas and appears edematous. Liver is normal in echotexture.' : 'No gallstones or sludge. Common bile duct 4 mm. Liver is diffusely echogenic, consistent with steatosis. Pancreas is partly obscured by bowel gas.',
            impression: gall ? 'Cholelithiasis without cholecystitis or biliary dilatation; findings compatible with gallstone pancreatitis.' : 'Hepatic steatosis; no gallstones or ductal dilatation (supports alcohol as the cause).' },
          { type: 'consult', h: 3.4, service: 'Hospital Medicine', author: 'hospitalist', orderedBy: 'ed', reason: 'Admission for acute pancreatitis', label: 'Admitted to Hospital Medicine', recommendation: 'Admit to medical unit. Moderate IV lactated Ringer\'s with frequent reassessment, IV analgesia, antiemetic, early oral feeding as tolerated; no prophylactic antibiotics.' + (drinks ? ' CIWA-Ar, thiamine, folate, magnesium repletion.' : ' Surgery consult for cholecystectomy timing; trend LFTs and bilirubin.') },
          { type: 'transfer', h: 4.5, label: 'Admitted to the medical unit', text: 'Transferred from the ED to the medical unit.' },
          ...(gall ? [{ type: 'consult', h: 30, service: 'General Surgery', author: 'surgeon', reason: 'Gallstone pancreatitis: cholecystectomy timing', label: 'Surgery consulted; cholecystectomy planned', recommendation: 'No cholangitis and bilirubin normalizing, so ERCP is not indicated. Plan laparoscopic cholecystectomy during this admission once pain is resolved and lipase is down (usually hospital day 4-5), or within 2 weeks as an outpatient if the OR is not available. Low-fat diet.' }] : []),
          ...(comp ? [
            { type: 'imaging', h: ctH, study: contrastCT ? 'CT abdomen and pelvis with IV contrast' : 'CT abdomen and pelvis without contrast', modality: 'CT', contrast: contrastCT, indication: 'Recurrent pain and fever after refeeding; evaluate for pancreatic necrosis or collection',
              findings: `Diffusely enlarged, edematous pancreas with peripancreatic fat stranding and two ill-defined peripancreatic fluid collections (largest 4.2 cm) without walls or gas. ${contrastCT ? 'The pancreas enhances homogeneously: no necrosis.' : 'Evaluation for necrosis is limited without IV contrast.'} Small bilateral pleural effusions. Gallbladder ${gall ? 'contains stones' : 'normal'}. No free air.`,
              impression: `Acute interstitial edematous pancreatitis with acute peripancreatic fluid collections${contrastCT ? '; no necrosis' : ''}.` }
          ] : [])
        ],
        meds: [
          C.bolus("lactated Ringer's bolus", 1000, { start: 0.5, by: 'ed', indication: 'Initial resuscitation in acute pancreatitis (moderate, goal-directed)' }),
          Object.assign(C.lrMaintenance({ start: 2, stop: 26, rate: 150 }), { indication: 'Early moderate fluid therapy (about 1.5 mL/kg/hr); reassess volume status every 6-8 hours', nursing: ['Reassess every 6-8 hours: HR, BP, urine output (goal at least 0.5 mL/kg/hr), BUN, hematocrit, lung sounds. Reduce rate when euvolemic; stop if crackles, dyspnea or edema.'] }),
          Object.assign(C.lrMaintenance({ start: 26, stop: comp ? 56 : 50, rate: 100 }), { key: 'lr_maintenance_2', indication: 'Maintenance hydration while oral intake is limited' }),
          ...(comp ? [Object.assign(C.lrMaintenance({ start: recH, stop: 100, rate: 100 }), { key: 'lr_maintenance_3', indication: 'Hydration during NPO after pain recurrence' })] : []),
          C.opioidIV(ctx, { start: 0.8, stop: comp ? 100 : 56, given: comp ? [0.8, 3.5, 7, 11, 15, 19.5, 24, 29, 35, 42, 50, 59, 62, 66, 71, 76, 82, 90] : [0.8, 3.5, 7, 11, 15, 19.5, 24, 29, 35, 42, 50] }),
          Object.assign(C.opioidPO(ctx, { start: comp ? 100 : 40, given: comp ? [104, 110, 118, 126] : [46, 55, 68, 80] }), { by: 'hospitalist' }),
          C.ondansetron({ start: 0.8, given: comp ? [0.8, 3, 9, 20, 59, 70] : [0.8, 3, 9, 20] }),
          Object.assign(C.acetaminophenIV({ start: 3, stop: comp ? 104 : 40 }), { freq: 'q8h', dose: drinks ? '650 mg' : '1,000 mg', info: `Scheduled non-opioid base for pain. Maximum ${drinks ? '2 g' : '3 g'} per 24 hours from all sources${drinks ? ' (alcohol use, risk of liver injury)' : ''}. Give over 15 minutes.`, by: 'hospitalist' }),
          Object.assign(C.acetaminophenPO({ start: comp ? 104 : 40 }), { freq: 'q8h', info: `Maximum ${drinks ? '2 g' : '3 g'} per 24 hours from all sources.`, by: 'hospitalist' }),
          ...(drinks ? [
            { key: 'magnesium_sulfate', name: 'magnesium sulfate IVPB', dose: '2 g in 50 mL', route: 'IV', freq: 'once', startH: 6, volume: 50, cls: 'Electrolyte replacement', info: 'Infuse over 2 hours. Monitor for hypotension, flushing, and loss of reflexes. Recheck magnesium in the morning.', monitor: ['Mg', 'Cr'], indication: 'Hypomagnesemia (alcohol use, vomiting)', by: 'hospitalist', renal: { ckd3: { dose: '1 g in 50 mL', note: 'Reduced replacement for CKD' }, esrd: { avoid: true } } },
            ...(heavy ? [] : [
              { key: 'lorazepam_ciwa', name: 'lorazepam (ATIVAN) tablet', dose: '1-2 mg per CIWA score', route: 'Oral', freq: 'q4h', prn: true, prnInterval: 'Every 4 hours', prnFor: 'CIWA-Ar 10 or greater', sips: true, cls: 'Benzodiazepine', info: 'Hold for sedation (RASS -2 or lower) or RR below 12. Reassess CIWA 1 hour after dose.', monitor: ['RR', 'SPO2', 'BP'], stopH: 96, indication: 'Alcohol withdrawal prevention', highAlert: true, startH: 3, by: 'hospitalist', prnGiven: [] }
            ])
          ] : [])
        ],
        orders: [
          C.diet('NPO', 0.5, clearH, 'Nothing by mouth initially for severe nausea and vomiting; ice chips and sips with medications only. Start oral feeding as soon as nausea and pain improve.'),
          C.diet('Clear liquid diet', clearH, comp ? recH : lowFatH, 'Early oral feeding within 24 hours as tolerated, even if lipase is still elevated. Advance if no vomiting and pain stays below 4/10.'),
          ...(comp ? [C.diet('NPO', recH, 92, 'NPO for recurrent pain and vomiting after refeeding; IV fluids; reassess in 24-48 hours.'), C.diet('Clear liquid diet', 92, 104, 'Restart slowly; small volumes.')] : []),
          C.diet('Low-fat diet', lowFatH, undefined, 'Low-fat, small frequent meals (30 g fat per day or less). No alcohol. Report pain or vomiting with meals.'),
          C.activity('Bed rest with bathroom privileges, position of comfort', 0.5, comp ? 40 : 30, 'Positioning: head of bed elevated, knees flexed or leaning forward may ease pain. Assist to bathroom.'),
          C.activity('Up as tolerated with assistance', comp ? 40 : 30, undefined, 'Encourage walking in hall as pain allows; reduces atelectasis and clot risk.'),
          { name: 'Vital signs', category: 'Nursing', frequency: 'Every 4 hours', startH: 2.5, instructions: 'Notify provider for HR above 110, SBP below 90, RR above 24, SpO2 below 92%, temperature above 100.4 F, urine output below 0.5 mL/kg/hr, or new confusion. These are SIRS and early organ-failure signs.' },
          { name: 'Intake and output, strict', category: 'Nursing', frequency: 'Every shift', startH: 2.5, instructions: 'Record all IV, oral, urine (goal at least 0.5 mL/kg/hr) and emesis. Use a urinal/hat for accurate output.', nursing: ['Notify provider for urine output below 30 mL/hr x 2 hours.'] },
          { name: 'Fluid status reassessment', category: 'Nursing', frequency: 'Every 6-8 hours for 48 hours', startH: 3, stopH: 54, instructions: 'Check HR, BP, urine output, lung sounds, edema, mucous membranes. Compare BUN and hematocrit with admission; rising values mean more fluid may be needed.', nursing: ['Stop the infusion and call for crackles, dyspnea or SpO2 drop (fluid overload).'] },
          { name: 'Pain and sedation reassessment', category: 'Nursing', frequency: '30 minutes after IV opioid and every 4 hours', startH: 1, instructions: 'Pain score, sedation (RASS) and RR before and after opioid; request escalation to PCA if pain stays above 6/10.', nursing: ['Splinting from pain causes shallow breathing and basilar atelectasis; coach deep breaths.'] },
          { name: 'Serial abdominal exams', category: 'Nursing', frequency: 'Every shift', startH: 3, instructions: 'Assess tenderness, distension, guarding, rigidity, bowel sounds. Notify provider for rigid abdomen, rebound, Cullen or Grey Turner sign, or sudden worsening pain.' },
          { name: 'Daily weight', category: 'Nursing', frequency: 'Daily', startH: 6, instructions: 'Same scale each morning; trend with large-volume fluids.' },
          { name: 'Triglyceride and calcium review', category: 'Laboratory', frequency: 'Once on admission', startH: 0.6, completeH: 1.6, instructions: 'Triglycerides above 1,000 mg/dL can cause pancreatitis; check calcium (hypocalcemia is a severity marker) and correct for albumin.' },
          ...(drinks && !heavy ? [{ name: 'CIWA-Ar alcohol withdrawal assessment', category: 'Nursing', frequency: 'Every 4 hours (every 1 hour after PRN dose)', startH: 3, stopH: 96, instructions: 'Score CIWA-Ar; give lorazepam per protocol for score of 10 or greater. Notify provider for score above 20, seizure, or hallucinations.', nursing: ['Seizure and fall precautions; keep room quiet and well lit.'] }] : []),
          ...(drinks ? [{ name: 'Alcohol use disorder brief intervention and counseling', category: 'Nursing', frequency: 'Before discharge', startH: 48, instructions: 'Screen (AUDIT-C), brief intervention, referral to outpatient program; complete abstinence prevents recurrence.' }] : []),
          C.incentive(3, undefined),
          { name: 'Sequential compression devices', category: 'Nursing', frequency: 'Continuous when in bed', startH: 3, instructions: 'Apply to both legs until fully ambulatory; pharmacologic VTE prophylaxis also ordered.' }
        ],
        devices: [
          { deviceType: 'IV', type: 'Peripheral IV', location: 'Right forearm', siteMarker: 'rightForearm', gauge: '20 gauge', placeH: 0.4, infusing: "Lactated Ringer's", status: 'Infusing', assess: 'site clean, dry, intact; flushes easily' },
          C.pivSecond(3.0, 'Left antecubital', '18 gauge')
        ],
        assessments: [
          { fromH: 0, items: [['GI', 'Abdomen', 'Epigastric tenderness with voluntary guarding, mildly distended; no rebound or rigidity; no Cullen or Grey Turner sign'], ['GI', 'Bowel Sounds', 'Hypoactive'], ['GI', 'Nausea / Vomiting', 'Nauseated with repeated non-bloody emesis x5'], ['GI', 'Last BM / Flatus', 'Last bowel movement yesterday, normal'], ['Pain', 'Pain Location', 'Epigastric, constant, boring, radiating to the back; relieved leaning forward'], ['Skin', 'Skin', gall ? 'Warm, dry; dry mucous membranes; mild scleral icterus' : 'Warm, dry; dry mucous membranes; decreased turgor'], ['Respiratory', 'Breath Sounds', 'Diminished at the bases'], ['Respiratory', 'Respiratory Effort', 'Shallow, guarded from pain'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulates slowly, bent forward'], ['Respiratory', 'Incentive Spirometer', '1,250 mL']] },
          { fromH: 4, items: [['Pain', 'Pain Location', 'Epigastric and mid-back, dull after IV analgesia'], ['GI', 'Nausea / Vomiting', 'Mild nausea; no emesis since ondansetron']] },
          { fromH: d2, items: [['GI', 'Abdomen', 'Mildly distended, epigastric tenderness without guarding or rebound'], ['GI', 'Bowel Sounds', 'Hypoactive to normoactive'], ['GI', 'Nausea / Vomiting', 'Mild nausea only; tolerating clear liquids'], ['Skin', 'Skin', 'Warm, dry; mucous membranes moist'], ['Respiratory', 'Respiratory Effort', 'Unlabored, mildly shallow with deep breaths'], ['Respiratory', 'Breath Sounds', 'Clear, diminished at bases'], ['Pain', 'Pain Location', 'Epigastric, aching, 4/10']] },
          ...(comp ? [
            { fromH: recH, items: [['GI', 'Abdomen', 'Distended, firm, epigastric tenderness; no rigidity'], ['GI', 'Nausea / Vomiting', 'Nausea with 2 emeses after solid food'], ['Pain', 'Pain Location', 'Epigastric and back pain, 7/10, returned after eating'], ['Skin', 'Skin', 'Warm, flushed during fever'], ['Respiratory', 'Breath Sounds', 'Diminished at both bases']] },
            { fromH: 92, items: [['GI', 'Abdomen', 'Less distended, soft, mild epigastric tenderness'], ['GI', 'Nausea / Vomiting', 'None'], ['Pain', 'Pain Location', 'Epigastric, 3-4/10'], ['Skin', 'Skin', 'Warm, dry; afebrile'], ['Respiratory', 'Respiratory Effort', 'Unlabored, even'], ['Respiratory', 'Breath Sounds', 'Clear, diminished at bases']] },
            { fromH: 112, items: [['GI', 'Bowel Sounds', 'Active'], ['GI', 'Last BM / Flatus', 'Bowel movement today'], ['Pain', 'Pain Location', 'Mild epigastric soreness'], ['Musculoskeletal / Mobility', 'Mobility', 'Walking in the hall with standby assist']] }
          ] : [
            { fromH: d3, items: [['GI', 'Abdomen', 'Soft, non-distended, mild epigastric tenderness'], ['GI', 'Bowel Sounds', 'Active'], ['GI', 'Nausea / Vomiting', 'None'], ['GI', 'Last BM / Flatus', 'Bowel movement yesterday'], ['Pain', 'Pain Location', 'Mild epigastric soreness, 2/10'], ['Musculoskeletal / Mobility', 'Mobility', 'Walking in the hall independently']] },
            { fromH: d4, items: [['GI', 'Abdomen', 'Soft, non-tender, non-distended'], ['Pain', 'Pain Location', 'None / minimal']] }
          ])
        ],
        io: comp ? [
          { fromH: 0, po: 0, urine: 300, other: 240, otherLabel: 'Emesis' }, { fromH: 8, po: 0, urine: 360, other: 60, otherLabel: 'Emesis' },
          { fromH: clearH, po: 140, urine: 380 }, { fromH: 30, po: 220, urine: 360 }, { fromH: recH, po: 0, urine: 320, other: 160, otherLabel: 'Emesis' }, { fromH: 72, po: 0, urine: 340, other: 40, otherLabel: 'Emesis' },
          { fromH: 92, po: 120, urine: 340 }, { fromH: 104, po: 300, urine: 330 }, { fromH: 120, po: 420, urine: 330 }
        ] : [
          { fromH: 0, po: 0, urine: 300, other: 240, otherLabel: 'Emesis' }, { fromH: 8, po: 0, urine: 360, other: 60, otherLabel: 'Emesis' },
          { fromH: clearH, po: 140, urine: 380 }, { fromH: 30, po: 220, urine: 360 }, { fromH: lowFatH, po: 340, urine: 330 }, { fromH: d3, po: 420, urine: 320 }
        ],
        therapy: { pt: false },
        discharge: { dispo: () => 'Home with outpatient follow-up', estimate: comp ? 'delayed after refeeding recurrence' : 'hospital day 4-5 once tolerating a low-fat diet with oral analgesia' },
        stages: panStages(ctx, { gall, drinks, comp, clearH, lowFatH, recH, ctH, d2, d3, d4, d5 }),
        stickies: [
          { title: 'Fluid caution', body: 'Moderate LR with reassessment every 6-8 hours; stop for crackles or dyspnea. Urine output goal at least 0.5 mL/kg/hr.' },
          { title: 'Pain and SIRS', body: 'Reassess pain 30 minutes after IV opioid. Report HR above 110, RR above 24, temp above 100.4 F or new confusion.' }
        ],
        objectives: ['Manage pain, nausea and fluids for acute pancreatitis: moderate fluid resuscitation with frequent reassessment, opioid safety, early oral feeding.', 'Recognize worsening disease (SIRS, organ failure, necrosis, hypocalcemia, rising BUN/Hct) and escalate.', drinks ? 'Screen for and manage alcohol withdrawal (CIWA-Ar), thiamine/folate, magnesium and counsel on abstinence.' : 'Plan gallstone follow-up: cholecystectomy timing, ERCP only for cholangitis or persistent obstruction, low-fat diet teaching.', 'Teach diet progression, trigger avoidance and when to return.']
      };
      return spec;
    }
  };

  function panStages(ctx, p) {
    const { gall, drinks, comp, clearH, lowFatH, recH, ctH, d2, d3, d4, d5 } = p;
    const cause = gall ? 'gallstone' : 'alcohol-associated';
    const st = [];
    st.push({
      fromH: 0, id: 'acute', label: 'Acute pancreatitis: pain control and fluids',
      problem: `Acute ${cause} pancreatitis (lipase more than 20 times the upper limit) with dehydration.`,
      subj: 'Constant epigastric pain to the back, 9/10 on arrival and 4-5/10 after IV opioid. Nausea with repeated vomiting. Thirsty. Has not eaten since the evening before.',
      assess: `Acute pancreatitis meeting 2 of 3 criteria (pain, lipase over 3x normal). SIRS positive (HR 106, RR 22, WBC 14) with hemoconcentration (hematocrit above 44) and BUN 23: needs aggressive monitoring. ${gall ? 'ALT 260 above normal supports a gallstone cause; bilirubin mildly up.' : 'Triglycerides and calcium checked; alcohol is the likely cause.'}`,
      plan: ["Lactated Ringer's 1,000 mL bolus, then 150 mL/hr; reassess every 6-8 hours (HR, BP, urine output, BUN, hematocrit).", 'IV morphine or hydromorphone for pain with sedation checks; scheduled acetaminophen; ondansetron.', 'NPO initially, begin clear liquids within 24 hours as nausea and pain allow.', 'No prophylactic antibiotics.', drinks ? 'CIWA-Ar every 4 hours, thiamine and folate, magnesium repletion, seizure/fall precautions.' : 'Trend AST/ALT/bilirubin for biliary obstruction; surgery to see about cholecystectomy.', 'VTE prophylaxis; incentive spirometry.'],
      nursing: ['Pain reassessed 30 minutes after each opioid dose; sedation score recorded.', 'Strict I&O with emesis measured; urine concentrated.', 'Head of bed up, position of comfort; shallow breathing coached with incentive spirometer.', 'IV fluids infusing on a pump; lungs clear.'],
      teach: ['Explained NPO, why fluids are important, pain scale use, call for help before getting up, and why no alcohol or fatty food.'],
      dispo: 'Anticipate 3-6 days if mild.',
      objectives: ['Perform focused abdominal and respiratory assessments in acute pancreatitis.'],
      stickies: [{ title: 'Fluids', body: 'LR 150 mL/hr; reassess every 6-8 hours; goal urine output at least 0.5 mL/kg/hr; stop for crackles or dyspnea.' }]
    });
    st.push({
      fromH: clearH, id: 'clears', label: 'Early oral feeding: clear liquids',
      problem: 'Acute pancreatitis improving; starting oral intake.',
      subj: 'Pain 3-4/10, nausea much better. Tolerating sips and clear liquids. Still has back discomfort.',
      assess: 'Pain and nausea improving; vital signs stable; early feeding appropriate even with elevated lipase.',
      plan: ['Clear liquids; advance to low-fat diet as tolerated.', 'Continue fluids with reassessment; decrease rate as intake increases.', 'Switch to oral analgesia when eating.'],
      nursing: ['Clear liquids without vomiting; abdomen soft with mild epigastric tenderness.', 'Passing flatus; urinating adequately.'],
      teach: ['Small, frequent amounts; stop and call if pain or nausea returns.'],
      dispo: 'Continue inpatient care for oral intake and pain control.'
    });
    if (!comp) {
      st.push({
        fromH: d2, id: 'day2', label: 'Hospital day 2: reassessing fluids and severity',
        problem: 'Mild acute pancreatitis; no organ failure; fluids being tapered.',
        subj: 'Pain 4/10, mostly back and epigastrium. Drinking clears, mild nausea. Low-grade temperature overnight.',
        assess: 'BUN and hematocrit falling with fluids (favorable); CRP rising to the usual 48-hour peak; calcium low-normal; no SIRS beyond day 1; mild disease.',
        plan: ['Reduce LR to 100 mL/hr; stop when eating well.', 'Advance to low-fat solids this afternoon if tolerated.', 'Low-grade fever from inflammation is common; no antibiotics unless infection is proven.', gall ? 'Surgery recommends cholecystectomy this admission (day 4-5) or within 2 weeks.' : 'Thiamine, folate; continue CIWA through 96 hours.'],
        nursing: ['Afebrile to low-grade; breath sounds diminished at bases; incentive spirometer 1,250 mL.', 'Tolerating clears; I&O balanced.', drinks ? 'CIWA-Ar scores low; no tremor or hallucinations.' : 'Pain 4/10 managed with scheduled acetaminophen and PRN opioid.'],
        teach: ['Why moving and deep breathing matter; low-fat diet progression; avoiding alcohol.'],
        dispo: 'Anticipate discharge in 1-3 days.'
      });
      st.push({
        fromH: d3, id: 'diet', label: 'Tolerating low-fat diet, oral analgesia',
        problem: 'Mild acute pancreatitis resolving; tolerating a low-fat diet.',
        subj: 'Pain 1-2/10 with acetaminophen and occasional oxycodone. Eating without nausea. Walked in the hall.',
        assess: 'Clinically resolving: pain controlled on oral medication, tolerating diet; lipase down-trending.',
        plan: ['Stop IV fluids and IV opioids; oral analgesia only.', gall ? 'Cholecystectomy: arrange same-admission surgery or schedule within 2 weeks.' : 'Alcohol cessation counseling and referral; thiamine/folate on discharge.', 'Discharge when pain controlled on oral medication for 24 hours and diet tolerated.'],
        nursing: ['Eating 75% of low-fat meals; no vomiting.', 'Ambulating independently; bowel movement.', 'Discharge teaching started.'],
        teach: ['Low-fat diet, hydration, no alcohol, avoiding opioids when possible, and returning for severe pain, vomiting, fever, jaundice or dark urine.'],
        dispo: 'Discharge home tomorrow.'
      });
      st.push({
        fromH: d4, id: 'ready', label: 'Discharge readiness',
        problem: 'Acute pancreatitis resolved clinically; ready for discharge.',
        subj: 'Pain-free or minimal; eating regular low-fat meals; bowel movements normal.', assess: 'Meets discharge criteria.',
        plan: ['Discharge home with acetaminophen, short opioid course only if needed, bowel regimen.', gall ? 'Surgical follow-up for cholecystectomy within 2 weeks; recurrence risk is high if gallbladder stays in.' : 'Outpatient alcohol treatment; PCP in 1 week.'],
        nursing: ['Ambulating, tolerating diet, pain 0-2/10; IV removed.', 'Teach-back completed.'],
        teach: ['Teach-back: low-fat diet, no alcohol, medications, return precautions.'], dispo: 'Discharge home.',
        stickies: [{ title: 'Discharge', body: 'Teach-back on diet and alcohol avoidance; arrange follow-up; remove IV.' }]
      });
    } else {
      st.push({
        fromH: 40, id: 'diet_try', label: 'Tolerating clears; trial of solids',
        problem: 'Acute pancreatitis improving; trial of low-fat solids.',
        subj: 'Pain 3/10; hungry. Tried a low-fat solid meal.', assess: 'Improving; oral intake being advanced.',
        plan: ['Low-fat solids as tolerated; reduce IV fluids.'], nursing: ['Tolerating clears; abdomen soft.'], teach: ['Small frequent meals; report pain after eating.'], dispo: 'Possible discharge tomorrow.'
      });
      st.push({
        fromH: recH, id: 'recurrence', label: 'Pain and fever after refeeding',
        problem: 'Pancreatitis worsened after solid food: recurrent pain, vomiting and low-grade fever; evaluating for collection or necrosis.',
        subj: 'Severe epigastric and back pain returned with vomiting after lunch. Temperature 100.6 F. Chills.',
        assess: 'Failed diet advancement with fever and rising WBC/CRP; concern for peripancreatic fluid collection or necrosis; moderately severe course.',
        plan: ['Return to NPO with IV fluids; IV opioid and antiemetic.', 'Blood cultures; CT abdomen/pelvis ' + (ctx.renal === 'none' ? 'with IV contrast' : 'without contrast (kidney disease)') + '; repeat labs including CRP.', 'No antibiotics unless infected necrosis or cholangitis is suspected.', 'Dietitian consult; consider nasojejunal feeding if oral intake fails again.'],
        nursing: ['Febrile with chills; abdomen distended and firm; pain 7/10.', 'NPO restarted; IV fluids; strict I&O; oxygen 2 L for SpO2 94%.', 'Notified provider of fever, tachycardia and increased pain; CT scheduled.'],
        teach: ['Explained why diet was stopped, the CT scan, and that setbacks can occur.'],
        dispo: 'Prolonged stay anticipated.'
      });
      st.push({
        fromH: ctH + 4, id: 'collections', label: 'Peripancreatic fluid collections: supportive care',
        problem: 'Acute peripancreatic fluid collections without necrosis; managing conservatively.',
        subj: 'Pain 5/10 with IV analgesia, nausea improving, still NPO.', assess: 'CT showed acute peripancreatic fluid collections without necrosis; likely to resolve with supportive care.',
        plan: ['Continue NPO/clears and IV fluids; analgesia.', 'Restart diet slowly when pain below 4/10; oral nutrition goals with dietitian.', 'Repeat imaging only if fever or pain persist after 7-10 days.'],
        nursing: ['Febrile curve trending down; abdomen less distended; lungs clear after oxygen weaned.', 'Antiemetic effective.'], teach: ['Why collections occur and that most resolve on their own.'], dispo: 'Estimated additional 4-6 days.'
      });
      st.push({
        fromH: 104, id: 'diet2', label: 'Diet restarted; transition to oral analgesia',
        problem: 'Resolving pancreatitis with fluid collections; low-fat diet restarted.',
        subj: 'Pain 2-3/10, eating small low-fat meals without nausea. Afebrile 36 hours.', assess: 'Improving; WBC and CRP falling.',
        plan: ['Low-fat diet; stop IV fluids and IV opioid.', 'Discharge when eating, afebrile and pain controlled on oral medication; outpatient imaging in 4-6 weeks.'],
        nursing: ['Eating 50-75% of meals; ambulating with standby assist.', 'Afebrile; IV fluids stopped.'], teach: ['Low-fat diet, avoid alcohol, signs of infection (fever, worsening pain).'], dispo: 'Discharge in 1-2 days.'
      });
    }
    return st;
  }
})();

// ================================================================================================
// ACUTE DIVERTICULITIS
// ================================================================================================
(() => {
  const U = NS.util, C = NS.C, { atClock, clock } = NS.OG;

  NS.PRIMARY.diverticulitis = {
    key: 'diverticulitis', label: 'Acute Diverticulitis', group: 'Medical', cat: 'Gastrointestinal / Abdominal Surgery', typicalLOS: [2, 4],
    desc: 'LLQ pain, fever, leukocytosis; CT sigmoid diverticulitis. Day 1: NPO/clears, IV ceftriaxone + metronidazole. Day 2-4: diet advances, oral step-down, colonoscopy in 6-8 weeks, discharge. Day 5+: failed medical therapy with pelvic abscess, surgery/IR consults, percutaneous drain.',
    build(ctx) {
      const comp = ctx.L >= 5;                                         // complicated course: pelvic abscess drained by IR
      const contrast = ctx.renal === 'none';
      const ctH = 3.0, ct2H = 62, worseH = 54, irH = atClock(ctx, '09:00', 70), irEnd = irH + 1;
      const d2 = atClock(ctx, '05:00', 20), d3 = d2 + 24, d4 = d3 + 24;
      const clearH = 14;
      const lowResH = comp ? 110 : 38, regH = comp ? 134 : 62, nposH = comp ? [[0.5, clearH], [worseH, 98]] : [[0.5, clearH]];
      const abxStop = comp ? 126 : 38;
      const stepH = abxStop;
      const penAllergy = ctx.allergic('penicillin');
      const spec = {
        primaryTeam: 'hospitalist', typicalLOS: [2, 4], noAutoProlonged: comp, noBowelRegimen: true,
        problem: { name: 'Acute diverticulitis', details: comp ? 'Sigmoid diverticulitis complicated by a 5 cm pelvic abscess; percutaneous drain placed by IR.' : 'Acute uncomplicated sigmoid diverticulitis.' },
        chief: 'Left lower quadrant abdominal pain with fever',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with known diverticulosis (seen on colonoscopy 4 years ago) and 3 days of progressive constant left lower quadrant pain, subjective fever and chills, nausea without vomiting, and constipation for 3 days with decreased appetite. No hematochezia, melena, pneumaturia, fecaluria or dysuria. ${ctx.age >= 50 ? 'One prior mild episode treated with oral antibiotics.' : 'First episode.'} Takes a low-fiber diet; no recent NSAID or steroid use.`,
        ros: 'Positive for LLQ pain, fever, chills, nausea, anorexia and constipation. Negative for vomiting, hematochezia, melena, dysuria, pneumaturia, vaginal discharge, chest pain and dyspnea.',
        keyLabs: ['WBC', 'CRP', 'Hemoglobin', 'Creatinine', 'Sodium', 'Potassium', 'Glucose', 'Lactate'], isolation: 'None',
        flags: { npo: nposH },
        vitals: comp ? [
          { h: 0, temp: 100.9, hr: 98, sbp: 138, dbp: 82, rr: 18, spo2: 98, pain: 7, o2: 'Room air' },
          { h: 3, temp: 100.4, hr: 94, sbp: 134, dbp: 80, rr: 18, spo2: 98, pain: 5 },
          { h: 14, temp: 99.8, hr: 88, sbp: 132, dbp: 78, rr: 16, spo2: 98, pain: 4 },
          { h: 30, temp: 99.2, hr: 84, sbp: 130, dbp: 78, rr: 16, spo2: 98, pain: 3 },
          { h: 46, temp: 99.4, hr: 88, sbp: 130, dbp: 78, rr: 16, spo2: 98, pain: 4 },
          { h: worseH + 2, temp: 100.4, hr: 94, sbp: 128, dbp: 76, rr: 18, spo2: 97, pain: 6 },
          { h: ct2H, temp: 101.6, hr: 108, sbp: 124, dbp: 72, rr: 20, spo2: 96, pain: 7 },
          { h: 74, temp: 101.2, hr: 104, sbp: 124, dbp: 74, rr: 20, spo2: 96, pain: 7 },
          { h: irH + 3, temp: 100.2, hr: 94, sbp: 126, dbp: 76, rr: 18, spo2: 97, pain: 4 },
          { h: irH + 14, temp: 99.2, hr: 88, sbp: 124, dbp: 74, rr: 16, spo2: 97, pain: 3 },
          { h: 110, temp: 98.8, hr: 80, sbp: 122, dbp: 74, rr: 16, spo2: 98, pain: 2 },
          { h: 140, temp: 98.4, hr: 76, sbp: 120, dbp: 72, rr: 16, spo2: 98, pain: 1 }
        ] : [
          { h: 0, temp: 100.9, hr: 98, sbp: 138, dbp: 82, rr: 18, spo2: 98, pain: 7, o2: 'Room air' },
          { h: 3, temp: 100.4, hr: 94, sbp: 134, dbp: 80, rr: 18, spo2: 98, pain: 5 },
          { h: 14, temp: 99.8, hr: 88, sbp: 132, dbp: 78, rr: 16, spo2: 98, pain: 4 },
          { h: 28, temp: 99.2, hr: 82, sbp: 130, dbp: 78, rr: 16, spo2: 98, pain: 3 },
          { h: 40, temp: 98.6, hr: 76, sbp: 126, dbp: 76, rr: 16, spo2: 98, pain: 2 },
          { h: 80, temp: 98.2, hr: 72, sbp: 122, dbp: 74, rr: 16, spo2: 98, pain: 1 }
        ],
        labs: {
          WBC: { abs: comp ? [[0, 15.2], [24, 12.8], [46, 12.4], [worseH, 15.2], [66, 18.6], [80, 17.8], [96, 14.2], [116, 11.0], [140, 8.8], [170, 7.6]] : [[0, 15.2], [24, 12.4], [48, 9.1], [80, 7.6]] },
          CRP: { abs: comp ? [[0, 110], [24, 170], [46, 150], [66, 262], [86, 215], [110, 110], [140, 48]] : [[0, 96], [24, 140], [48, 64], [80, 22]] },
          Lactate: { abs: [[0.4, 1.4], [5, 1.0]] },
          Procalcitonin: { abs: [[0.5, comp ? 0.6 : 0.3], [ct2H, 1.4], [110, 0.4]] },
          Sodium: { add: [[0, -2], [24, -1], [48, 0]] },
          Potassium: { add: [[0, -0.2], [24, -0.1]] },
          Creatinine: { add: [[0, 0.1], [24, 0.05], [48, 0]] },
          BUN: { add: [[0, 5], [24, 2], [48, 0]] },
          Glucose: { add: [[0, 24], [30, 10], [60, 0]] },
          Hemoglobin: { add: [[0, 0.4], [24, -0.4], [60, -0.7], [140, -0.5]] },
          Platelets: { add: comp ? [[0, 20], [60, 70], [140, 40]] : [[0, 20], [48, 30]] },
          Albumin: { add: [[0, -0.2], [60, -0.5]] }
        },
        labSchedule: [
          { h: 0.5, codes: ['Lactate', 'CRP', 'Lipase', 'AST', 'ALT', 'ALP', 'Total bilirubin', 'Albumin'] },
          { daily: true, fromH: 20, codes: ['CRP'] },
          ...(comp ? [{ h: ct2H - 1, codes: ['Lactate', 'Procalcitonin', 'CRP'] }, { h: 120, codes: ['Procalcitonin'] }] : [])
        ],
        quals: [
          { h: 0.8, category: 'Urinalysis', code: 'Urinalysis - leukocyte esterase', value: 'Negative', reference: 'Negative', specimen: 'Urine' },
          { h: 0.8, category: 'Urinalysis', code: 'Urinalysis - nitrite', value: 'Negative', reference: 'Negative', specimen: 'Urine' },
          { h: 0.8, category: 'Urinalysis', code: 'Urinalysis - WBC', value: '0-2', units: '/HPF', reference: '0-5', specimen: 'Urine' },
          ...(ctx.female && ctx.age >= 12 && ctx.age <= 55 ? [{ h: 0.8, category: 'Other', code: 'Urine hCG (pregnancy test)', value: 'Negative', reference: 'Negative', specimen: 'Urine' }] : []),
          ...(comp ? [
            { h: ct2H - 0.5, category: 'Microbiology', code: 'Blood cultures x2', value: 'No growth at 5 days (final)', specimen: 'Blood', status: 'Final' },
            { h: irEnd + 1, category: 'Microbiology', code: 'Abscess culture (IR drain)', value: 'Pending', specimen: 'Abscess fluid', status: 'Preliminary' },
            { h: irEnd + 40, category: 'Microbiology', code: 'Abscess culture (IR drain) - final', value: 'Escherichia coli and Bacteroides fragilis; susceptible to ceftriaxone and metronidazole', specimen: 'Abscess fluid', status: 'Final' }
          ] : [])
        ],
        events: [
          { type: 'imaging', h: ctH, study: contrast ? 'CT abdomen and pelvis with IV contrast' : 'CT abdomen and pelvis without contrast', modality: 'CT', contrast, indication: 'LLQ pain, fever, leukocytosis; evaluate for diverticulitis and complications',
            findings: `Multiple sigmoid diverticula with a 12 cm segment of sigmoid wall thickening (9 mm) and pericolic fat stranding centered on an inflamed diverticulum. No extraluminal gas, abscess, or free fluid. No bowel obstruction. ${contrast ? 'Bowel wall enhances normally.' : 'Evaluation for abscess is limited without IV contrast.'} Appendix normal. Remainder of the abdomen and pelvis unremarkable.`,
            impression: 'Acute uncomplicated sigmoid diverticulitis without abscess, perforation or obstruction.' },
          { type: 'consult', h: 3.4, service: 'Hospital Medicine', author: 'hospitalist', orderedBy: 'ed', reason: 'Admission for acute diverticulitis', label: 'Admitted to Hospital Medicine', recommendation: 'Admit to medical unit. Bowel rest then clear liquids, IV fluids, IV ceftriaxone plus metronidazole, analgesia, serial abdominal exams. Surgery if peritonitis, abscess or failure to improve in 48-72 hours.' },
          { type: 'transfer', h: 4.5, label: 'Admitted to the medical unit', text: 'Transferred from the ED to the medical unit.' },
          ...(comp ? [
            { type: 'imaging', h: ct2H, study: contrast ? 'CT abdomen and pelvis with IV contrast' : 'CT abdomen and pelvis without contrast', modality: 'CT', contrast, indication: 'Recurrent fever, rising WBC and worsening LLQ pain on day 3 of antibiotics',
              findings: 'There is a 5.2 x 4.1 cm rim-enhancing fluid and gas collection in the pelvis adjacent to the sigmoid colon, consistent with an abscess. Persistent sigmoid wall thickening and pericolic stranding. Small amount of free pelvic fluid. No free intraperitoneal air. Proximal bowel is mildly dilated without obstruction.', impression: '5.2 cm pelvic abscess complicating sigmoid diverticulitis (Hinchey II).' },
            { type: 'consult', h: 64, service: 'General Surgery', author: 'surgeon', reason: 'Diverticular abscess', label: 'Surgery consulted; drain first, elective colectomy later', recommendation: 'No peritonitis or free air, so non-operative management with percutaneous drainage. NPO, continue antibiotics. Re-examine daily; urgent laparotomy/Hartmann procedure if peritonitis or sepsis develops. Elective sigmoid colectomy to be discussed after recovery.' },
            { type: 'consult', h: 65, service: 'Interventional Radiology', author: 'radiology', reason: 'Percutaneous drainage of pelvic abscess', label: 'IR consulted for abscess drainage', recommendation: 'CT-guided drain placement tomorrow morning. NPO after midnight; hold the prophylactic anticoagulant dose the morning of the procedure; INR and platelets acceptable. Consent obtained.' },
            { type: 'procedure', h: irH, duration: 1, name: 'CT-guided percutaneous drainage of pelvic abscess', label: 'IR pelvic abscess drain placed', service: 'Interventional Radiology', by: 'radiology', indication: 'Pelvic abscess from diverticulitis',
              findings: '10 Fr pigtail catheter placed into the pelvic abscess via a transgluteal approach under CT guidance with moderate sedation; 80 mL of thick tan-brown purulent fluid aspirated and sent for culture. Catheter secured and connected to a bulb. Residual collection minimal.' }
          ] : [])
        ],
        meds: [
          C.bolus("lactated Ringer's bolus", 1000, { start: 0.5, by: 'ed', indication: 'Dehydration and fever' }),
          C.lrMaintenance({ start: 2, stop: comp ? 28 : 36, rate: 125 }),
          ...(comp ? [C.lrMaintenance({ start: worseH, stop: 104, rate: 125 })] : []),
          Object.assign(C.opioidIV(ctx, { start: 0.8, stop: comp ? 108 : 40, given: comp ? [0.8, 3.5, 8, 13, 19, 27, 36, 47, 56, 61, 66, 71, 77, 82, 88, 95] : [0.8, 3.5, 8, 13, 19, 27, 35] }), { dose: '2 mg', info: 'HIGH-ALERT. Assess pain, sedation (RASS), RR and SpO2 before and 15-30 minutes after. Hold for RR below 10 or oversedation. Opioids slow the colon; avoid long courses.' }),
          Object.assign(C.opioidPO(ctx, { start: comp ? 104 : 38, given: comp ? [108, 118, 130] : [42, 56, 70] }), { dose: '5 mg', by: 'hospitalist', info: 'HIGH-ALERT. Assess pain and sedation before and 30-60 minutes after. Hold for RR below 10 or oversedation. Short course only; constipation can worsen diverticulitis.' }),
          Object.assign(C.ondansetron({ start: 0.8, given: comp ? [0.8, 5, 12, 58, 70, 90] : [0.8, 5, 12, 22] }), { by: 'ed' }),
          Object.assign(C.acetaminophenPO({ start: 3 }), { sips: true, stat: true, by: 'hospitalist', info: 'Scheduled non-opioid base for pain and fever. Maximum 3 g per 24 hours from all sources. No NSAIDs (ibuprofen, ketorolac): linked to perforation and complications of diverticulitis.' }),
          { key: 'ceftriaxone', name: 'ceftriaxone (ROCEPHIN) IVPB', dose: '2 g', route: 'IV', freq: 'q24h', anchorStart: true, startH: 2.8, stopH: abxStop, volume: 50, cls: 'Cephalosporin antibiotic', info: `Verify allergy history${penAllergy ? ' (penicillin allergy: cephalosporin cross-reactivity is low; observe for rash or hives)' : ''}. Infuse over 30 minutes. Monitor temperature, WBC and diarrhea (C. difficile).`, monitor: ['Temp', 'WBC', 'Cr'], indication: 'Acute diverticulitis (gram-negative coverage)', by: 'hospitalist' },
          { key: 'metronidazole_iv', name: 'metronidazole (FLAGYL) IVPB', dose: '500 mg', route: 'IV', freq: 'q8h', startH: 3.2, stopH: abxStop, volume: 100, cls: 'Antibiotic (anaerobic coverage)', info: 'Anaerobic coverage with ceftriaxone. Metallic taste and nausea are common; no alcohol during and 72 hours after treatment.', monitor: ['Temp', 'WBC'], indication: 'Anaerobic coverage', by: 'hospitalist' },
          { key: 'amox_clav', name: 'amoxicillin-clavulanate (AUGMENTIN) tablet', dose: '875/125 mg', route: 'Oral', freq: 'BID', startH: stepH, cls: 'Penicillin / beta-lactamase inhibitor', info: 'Give with food. Oral step-down once afebrile and tolerating diet; complete 7-10 days total (4 days after source control if drained). Report diarrhea or rash.', monitor: ['Temp', 'WBC'], indication: 'Oral step-down antibiotic (covers anaerobes)', avoid: ['penicillin'],
            alt: { key: 'cipro', name: 'ciprofloxacin (CIPRO) tablet', dose: '500 mg', freq: 'BID', cls: 'Fluoroquinolone antibiotic', info: 'Used because of penicillin allergy; combine with metronidazole. Separate from calcium/iron/antacids by 2 hours. Report tendon pain, palpitations, confusion or severe diarrhea.', renal: { ckd3: { dose: '250 mg', freq: 'BID', note: 'Reduced ciprofloxacin dose for kidney disease.' }, esrd: { dose: '250 mg', freq: 'q24h', note: 'Ciprofloxacin once daily for ESRD (give after dialysis).' } } }, by: 'hospitalist',
            renal: { ckd3: { dose: '500/125 mg', freq: 'BID', note: 'Reduced amoxicillin-clavulanate dose for kidney disease.' }, esrd: { dose: '500/125 mg', freq: 'q24h', note: 'Once daily for ESRD (give after dialysis).' } } },
          { key: 'metronidazole_po', name: 'metronidazole (FLAGYL) tablet', dose: '500 mg', route: 'Oral', freq: 'TID', startH: stepH, cls: 'Antibiotic (anaerobic coverage)', info: 'Oral anaerobic coverage with ciprofloxacin. No alcohol during and for 72 hours after treatment; metallic taste is common.', monitor: ['Temp'], indication: 'Anaerobic coverage (penicillin-allergic patient)', when: penAllergy, by: 'hospitalist' }
        ],
        orders: [
          C.diet('NPO', 0.5, clearH, 'Bowel rest for severe pain, CT and IV therapy. Sips with medications only.'),
          C.diet('Clear liquid diet', clearH, comp ? worseH : lowResH, 'Advance when pain is below 4/10 and no nausea.'),
          ...(comp ? [C.diet('NPO', worseH, 98, 'NPO for worsening pain, CT and IR drainage.'), C.diet('Clear liquid diet', 98, lowResH, 'Resume after drain placement as tolerated.')] : []),
          C.diet('Low residue diet', lowResH, regH, 'Low-fiber foods for 2-3 days while the colon heals; small meals.'),
          C.diet('Regular diet', regH, undefined, 'Advance as tolerated. Gradually increase fiber after full recovery, as outpatient.'),
          C.activity('Up as tolerated with assistance', 0.5, undefined, 'Walking promotes bowel function; avoid straining.'),
          { name: 'Vital signs', category: 'Nursing', frequency: 'Every 4 hours', startH: 2.5, instructions: 'Notify provider for temperature above 101.5 F, HR above 110, SBP below 90, or sudden severe/rigid abdomen.' },
          { name: 'Serial abdominal exams', category: 'Nursing', frequency: 'Every shift', startH: 3, instructions: 'Assess LLQ tenderness, distension, guarding, rebound, rigidity and bowel sounds. Notify provider for peritoneal signs (rigid board-like abdomen, rebound), vomiting, or increasing pain: perforation or abscess.' },
          { name: 'Intake and output, stool and flatus tracking', category: 'Nursing', frequency: 'Every shift', startH: 2.5, instructions: 'Record IV, oral, urine, emesis, stool (color, blood) and flatus.' },
          { name: 'No enemas, suppositories, laxatives or rectal temperatures', category: 'Precautions', frequency: 'Continuous', startH: 3, instructions: 'Avoid rectal manipulation and stimulant laxatives during acute diverticulitis (risk of perforation).' },
          ...(contrast ? [{ name: 'Post-contrast hydration and creatinine check', category: 'Nursing', frequency: 'Daily x 3 days', startH: ctH, stopH: ctH + 72, instructions: 'Encourage fluids after IV contrast; review daily creatinine; hold metformin and avoid NSAIDs.' }] : [{ name: 'Kidney disease: contrast avoidance', category: 'Nursing', frequency: 'Continuous', startH: 3, instructions: 'Non-contrast CT used because of reduced kidney function; avoid nephrotoxins; renal dosing of antibiotics.' }]),
          { name: 'Sequential compression devices', category: 'Nursing', frequency: 'Continuous when in bed', startH: 3, instructions: 'Apply to both legs while in bed in addition to pharmacologic VTE prophylaxis.' },
          { name: 'Referral: outpatient colonoscopy in 6-8 weeks', category: 'Consult / Therapy', frequency: 'Once before discharge', startH: d3 - 6, instructions: 'After resolution of the episode, colonoscopy to exclude colon cancer (especially after complicated diverticulitis or if none in the last year).' },
          { name: 'Diverticulitis discharge teaching', category: 'Nursing', frequency: 'Before discharge', startH: d3, instructions: 'Complete antibiotics, diet progression to high fiber, hydration, avoid NSAIDs, report fever, severe pain, vomiting, bleeding, or no stool or gas.' },
          ...(comp ? [
            { name: 'Pre-procedure checklist: IR drainage', category: 'Nursing', frequency: 'Once', startH: ct2H + 1, completeH: irH - 0.4, instructions: 'Consent, NPO after midnight, INR/platelets, hold the morning anticoagulant dose per IR, antibiotics on schedule, allergy band.' },
            { name: 'Drain care and output measurement', category: 'Nursing', frequency: 'Every shift', startH: irEnd, instructions: 'Flush with 10 mL sterile saline once or twice daily if ordered; empty bulb and record color, consistency and volume; assess site for leaking, redness; keep bulb compressed and secured.', nursing: ['Notify provider for output stopping suddenly with fever, bloody or feculent output, or a dislodged drain.'] },
            { name: 'Surgical re-evaluation if not improving', category: 'Nursing', frequency: 'Daily', startH: ct2H + 2, stopH: irH + 48, instructions: 'Report fever persisting more than 48 hours after drainage, worsening WBC, or peritoneal signs to surgery.' }
          ] : [])
        ],
        devices: [
          { deviceType: 'IV', type: 'Peripheral IV', location: 'Right forearm', siteMarker: 'rightForearm', gauge: '20 gauge', placeH: 0.4, infusing: "Lactated Ringer's", status: 'Infusing', assess: 'site clean, dry, intact; flushes easily' },
          ...(comp ? [{ deviceType: 'Drain', type: 'Pelvic abscess drain (10 Fr pigtail)', location: 'Left buttock (transgluteal) to pelvis', siteMarker: 'abdomenLLQ', placeH: irEnd, status: 'Active', drainage: ctx.nowH < irH + 36 ? '60 mL thick tan purulent over last 12 hours' : ctx.nowH < irH + 96 ? '30 mL tan-serous over last 12 hours' : '10 mL serous over last 12 hours', assess: 'dressing clean, dry, intact; bulb compressed; no leakage or redness' }] : [])
        ],
        assessments: [
          { fromH: 0, items: [['GI', 'Abdomen', 'LLQ tenderness with voluntary guarding; mild distension; no rebound, rigidity or palpable mass'], ['GI', 'Bowel Sounds', 'Hypoactive'], ['GI', 'Nausea / Vomiting', 'Nauseated; no emesis'], ['GI', 'Last BM / Flatus', 'Constipated for 3 days; passing small amounts of flatus'], ['Pain', 'Pain Location', 'LLQ, constant, sharp, worse with movement and coughing'], ['Skin', 'Skin', 'Warm, flushed; dry mucous membranes'], ['GU', 'Urinary Elimination', 'Voiding spontaneously; no dysuria, pneumaturia or fecaluria'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulates slowly, guarding left side']] },
          { fromH: clearH, items: [['GI', 'Abdomen', 'LLQ mildly tender; no rebound or rigidity'], ['GI', 'Nausea / Vomiting', 'Nausea resolved'], ['Pain', 'Pain Location', 'LLQ, dull, 3-4/10'], ['Skin', 'Skin', 'Warm, dry; mucous membranes moist']] },
          { fromH: d2, items: [['GI', 'Abdomen', 'Soft, mild LLQ tenderness, no guarding'], ['GI', 'Bowel Sounds', 'Active'], ['GI', 'Last BM / Flatus', 'Passing flatus; no BM yet'], ['Pain', 'Pain Location', 'LLQ, mild, 2-3/10']] },
          ...(comp ? [
            { fromH: worseH, items: [['GI', 'Abdomen', 'Distended, firm, marked LLQ and suprapubic tenderness with guarding; no rigidity'], ['GI', 'Bowel Sounds', 'Hypoactive'], ['GI', 'Nausea / Vomiting', 'Nausea with 2 emeses'], ['GI', 'Last BM / Flatus', 'No flatus for 12 hours'], ['Pain', 'Pain Location', 'LLQ and pelvis, constant, 6-7/10'], ['Skin', 'Skin', 'Flushed and diaphoretic with fever']] },
            { fromH: irEnd, items: [['GI', 'Abdomen', 'Soft, mildly distended, LLQ tenderness improving; no rigidity'], ['Skin', 'Drain Site', 'Left buttock drain site dressing clean, dry, intact; tan purulent drainage in bulb'], ['Skin', 'Skin', 'Warm and dry; febrile episodes resolved'], ['Pain', 'Pain Location', 'Pelvic and drain site, 3-4/10'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulating with standby assist; drain secured']] },
            { fromH: irH + 28, items: [['GI', 'Bowel Sounds', 'Active'], ['GI', 'Nausea / Vomiting', 'None'], ['GI', 'Last BM / Flatus', 'Passing flatus; small BM'], ['Skin', 'Drain Site', 'Drain site clean; thin tan-serous drainage']] },
            { fromH: 120, items: [['GI', 'Last BM / Flatus', 'Bowel movement today'], ['Skin', 'Drain Site', 'Drain site clean; serous drainage, decreasing'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent with ambulation']] }
          ] : [
            { fromH: d3, items: [['GI', 'Abdomen', 'Soft, non-distended, minimal LLQ tenderness'], ['GI', 'Last BM / Flatus', 'Bowel movement yesterday evening, soft'], ['Pain', 'Pain Location', 'None / mild LLQ soreness'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent']] }
          ])
        ],
        io: comp ? [
          { fromH: 0, po: 0, urine: 300 }, { fromH: clearH, po: 140, urine: 330 }, { fromH: worseH, po: 0, urine: 280, other: 120, otherLabel: 'Emesis' }, { fromH: ct2H, po: 0, urine: 300 },
          { fromH: irEnd, po: 0, urine: 310, other: 80, otherLabel: 'Drain output' }, { fromH: 98, po: 140, urine: 320, other: 50, otherLabel: 'Drain output' }, { fromH: lowResH, po: 300, urine: 330, other: 30, otherLabel: 'Drain output' }, { fromH: regH, po: 400, urine: 330, other: 15, otherLabel: 'Drain output' }
        ] : [
          { fromH: 0, po: 0, urine: 300 }, { fromH: clearH, po: 140, urine: 330 }, { fromH: lowResH, po: 300, urine: 330 }, { fromH: regH, po: 400, urine: 320 }
        ],
        therapy: { pt: false },
        discharge: { dispo: () => comp ? 'Home with home health nursing for drain care' : 'Home with primary care follow-up', estimate: comp ? 'after drain teaching and oral antibiotics are established' : 'hospital day 2-4 once tolerating a low-residue diet and oral antibiotics' },
        stages: divStages(ctx, { comp, contrast, clearH, lowResH, regH, worseH, ct2H, irH, irEnd, d2, d3, d4, stepH }),
        stickies: [
          { title: 'Peritonitis watch', body: 'Report rigid or board-like abdomen, rebound, vomiting, temperature above 101.5 F, HR above 110 or sudden severe pain. No NSAIDs, enemas or laxatives.' }
        ],
        objectives: ['Assess and monitor a patient with diverticulitis for peritonitis, perforation and abscess; know when to escalate to surgery.', 'Administer IV antibiotics with allergy checks and plan an oral step-down.', 'Advance diet safely: bowel rest, clear liquids, low residue, regular; teach fiber and colonoscopy follow-up.', ...(comp ? ['Care for a patient with a percutaneous pelvic abscess drain: output measurement, site care and teaching.'] : [])]
      };
      return spec;
    }
  };

  function divStages(ctx, p) {
    const { comp, contrast, clearH, lowResH, regH, worseH, ct2H, irH, irEnd, d2, d3, d4, stepH } = p;
    const st = [];
    st.push({
      fromH: 0, id: 'acute', label: 'Acute diverticulitis: IV antibiotics, bowel rest',
      problem: 'Acute uncomplicated sigmoid diverticulitis on CT; fever and leukocytosis.',
      subj: 'LLQ pain 7/10 on arrival, now 4-5/10 after IV analgesia. Nauseated, no vomiting. Chills earlier. No rectal bleeding. Last bowel movement 3 days ago.',
      assess: 'CT-confirmed uncomplicated sigmoid diverticulitis with temperature 100.9 F, WBC 15.2 and CRP 96. No peritonitis, abscess or obstruction.',
      plan: [contrast ? 'CT with IV contrast done; hydrate and watch creatinine.' : 'Non-contrast CT because of reduced kidney function.', 'Ceftriaxone 2 g IV daily plus metronidazole 500 mg IV every 8 hours.', 'IV fluids; NPO then clear liquids once pain is below 4/10; acetaminophen scheduled, low-dose IV opioid only for severe pain; ondansetron.', 'Serial abdominal exams; no NSAIDs, laxatives or enemas.', 'Surgery if peritonitis, abscess or no improvement in 48-72 hours; colonoscopy in 6-8 weeks.'],
      nursing: ['LLQ tender with voluntary guarding; no rigidity or rebound.', 'IV antibiotics infusing without reaction; allergy status verified.', 'Pain reassessed 30 minutes after opioid; temperature trending down.', 'NPO for now; strict I&O.'],
      teach: ['Explained the diagnosis, bowel rest and diet plan, why NSAIDs and laxatives are avoided, and symptoms that need urgent attention.'],
      dispo: comp ? 'Anticipate 2-4 days if improving; reassess at 48-72 hours.' : 'Anticipate discharge home in 2-4 days.',
      objectives: ['Perform a focused abdominal assessment and recognize peritoneal signs.'],
      stickies: [{ title: 'Diverticulitis', body: 'Serial abdominal exams. Report rigid abdomen, rebound, vomiting or fever above 101.5 F.' }]
    });
    st.push({
      fromH: clearH, id: 'clears', label: 'Pain improving: clear liquids',
      problem: 'Diverticulitis improving on IV antibiotics; starting clear liquids.',
      subj: 'Pain 3-4/10, nausea resolved, tolerating clear liquids. Passing flatus.',
      assess: 'Improving clinically; afebrile trend; continuing IV antibiotics.',
      plan: ['Clear liquids; advance as tolerated.', 'Continue ceftriaxone and metronidazole; reassess WBC and CRP.', 'Hold opioids when pain allows; walk in the hall.'],
      nursing: ['Clear liquids tolerated without nausea; abdomen mildly tender.', 'Ambulating in hall.'], teach: ['Small sips, report pain or nausea when diet advances.'], dispo: 'Continue inpatient care.'
    });
    if (!comp) {
      st.push({
        fromH: d2, id: 'day2', label: 'Improving: oral step-down planning',
        problem: 'Acute uncomplicated diverticulitis responding to IV antibiotics.',
        subj: 'Pain 2-3/10, hungry, no nausea. Temperature normal for 12 hours. Passing flatus.',
        assess: 'Responding well: afebrile, WBC 12.4 to 9.1, CRP down-trending from the day-2 peak; tolerating clears.',
        plan: ['Advance to low-residue diet this afternoon.', 'Switch to oral antibiotics once tolerating a low-residue diet and afebrile (amoxicillin-clavulanate; ciprofloxacin plus metronidazole if penicillin-allergic) to complete 7-10 days.', 'Stop IV fluids and IV opioid; acetaminophen only.', 'Colonoscopy referral in 6-8 weeks.'],
        nursing: ['Afebrile; abdomen soft with mild LLQ tenderness.', 'Eating clear liquids and starting low-residue foods; no nausea.', 'Walking independently.'],
        teach: ['Antibiotic purpose and duration, low-residue now and high-fiber later, hydration, avoid NSAIDs.'], dispo: 'Discharge home tomorrow if tolerating diet and oral antibiotics.'
      });
      st.push({
        fromH: d3, id: 'ready', label: 'Oral antibiotics, discharge teaching',
        problem: 'Uncomplicated diverticulitis resolving; on oral antibiotics; ready for discharge.',
        subj: 'Mild LLQ soreness 1/10, eating low-residue meals, bowel movement. Ready to go home.', assess: 'Clinically resolved: afebrile for 48 hours, pain controlled with acetaminophen, tolerating diet and oral medication.',
        plan: ['Discharge home to complete oral antibiotics (total 7-10 days).', 'Colonoscopy in 6-8 weeks; high-fiber diet after recovery; PCP in 1 week.', 'Return precautions reviewed.'],
        nursing: ['Ambulating independently; tolerating low-residue diet; BM today.', 'Teach-back on antibiotics and warning signs.', 'IV removed.'],
        teach: ['Teach-back: finish all antibiotics, diet progression, hydration, no NSAIDs, call for fever, worsening pain, vomiting, bloody stool.'], dispo: 'Discharge home today.',
        stickies: [{ title: 'Discharge', body: 'Teach-back on antibiotics, diet, colonoscopy in 6-8 weeks and return precautions; remove IV.' }]
      });
    } else {
      st.push({
        fromH: d2, id: 'day2', label: 'Initial improvement on IV antibiotics',
        problem: 'Acute diverticulitis, initially improving on IV antibiotics.',
        subj: 'Pain 3/10, tolerating clears. Mild fever overnight.', assess: 'Early response but CRP still high and low-grade temperature; reassess at 48-72 hours.',
        plan: ['Continue IV ceftriaxone and metronidazole; clear liquids.', 'Repeat labs; low threshold for repeat CT if fever or pain returns.'], nursing: ['Tolerating clears; abdomen soft; walking.'], teach: ['Report fever, increasing pain or vomiting right away.'], dispo: 'Reassess tomorrow.'
      });
      st.push({
        fromH: worseH, id: 'worse', label: 'Worsening pain, fever and leukocytosis',
        problem: 'Diverticulitis failing medical therapy: fever, rising WBC and distension; evaluating for abscess.',
        subj: 'Pain returned and worsened to 6-7/10, bloating, nausea with two emeses, chills.',
        assess: 'Failure to improve at 48-72 hours with fever to 101.6 F, WBC 18, CRP 262; concern for abscess.',
        plan: ['NPO; IV fluids; antiemetic.', contrast ? 'CT abdomen/pelvis with IV contrast today.' : 'CT abdomen/pelvis without contrast today.', 'Blood cultures x2; lactate and procalcitonin.', 'Continue ceftriaxone and metronidazole; surgery to see.'],
        nursing: ['Febrile with chills; abdomen distended, firm, guarded; vomited twice.', 'NPO with IV fluids; antiemetic given with relief.', 'Notified provider of fever and increasing pain; CT arranged.'],
        teach: ['Explained why diet was stopped and why repeat imaging is needed.'], dispo: 'Prolonged stay anticipated.'
      });
      st.push({
        fromH: ct2H, id: 'abscess', label: 'Pelvic abscess identified; IR drainage planned',
        problem: '5.2 cm pelvic abscess complicating sigmoid diverticulitis; IR drainage planned.',
        subj: 'Steady lower abdominal pain, nausea improved with NPO. Agrees to drain placement.',
        assess: 'Hinchey II diverticular abscess requiring percutaneous drainage; no free perforation.',
        plan: ['IR CT-guided drain tomorrow morning; NPO after midnight; consent obtained.', 'Continue IV antibiotics; hold the morning anticoagulant dose per IR.', 'Surgery following: elective sigmoid colectomy discussion after recovery; urgent surgery if peritonitis.'],
        nursing: ['Consent verified; NPO maintained; febrile 101.6 F, acetaminophen given.', 'Abdomen firm and tender; no rebound; watching for rigid abdomen.'], teach: ['Explained what a percutaneous drain is, expected drainage, and how it will be cared for.'], dispo: 'Drain care teaching needed before discharge.'
      });
      st.push({
        fromH: irEnd, id: 'drained', label: 'After abscess drainage',
        problem: 'Diverticular abscess status post IR drain; clinically improving.',
        subj: 'Pain much better after drainage (3-4/10). Fever settled. Passing flatus; hungry.', assess: 'Source control achieved; fever and WBC trending down; drain output purulent then serous.',
        plan: ['Continue IV antibiotics for about 4 days after source control, then oral step-down.', 'Advance to clear liquids then low residue then regular as tolerated.', 'Drain output monitoring; culture sensitivities pending; flush per IR.', 'Resume VTE prophylaxis; ambulate.'],
        nursing: ['Drain site dressing clean, dry, intact; bulb emptied and output recorded.', 'Afebrile 12 hours; ambulating with standby assist.'], teach: ['Drain care: emptying the bulb, recording output, site care, and when to call.'], dispo: 'Home with home health for drain care is likely; case management consulted.'
      });
      st.push({
        fromH: 130, id: 'dc_prep', label: 'Preparing for discharge with drain',
        problem: 'Diverticular abscess with drain, on oral antibiotics; preparing for discharge.',
        subj: 'Eating regular diet, bowel movements normal, minimal pain. Wants to go home.', assess: 'Clinically recovered; drain output low; oral antibiotics tolerated.',
        plan: ['Discharge home with drain and home health; IR follow-up in 1 week with drain study; surgery clinic for colectomy planning.', 'Colonoscopy in 6-8 weeks after the abscess resolves.'],
        nursing: ['Patient and family performed drain emptying with return demonstration.', 'Afebrile; tolerating oral antibiotics and diet.'],
        teach: ['Drain care teach-back; antibiotic schedule; when to call (fever, increased pain, cloudy or bloody output, drain falls out).'], dispo: 'Home with home health for drain care.',
        stickies: [{ title: 'Discharge planning', body: 'Home health arranged for drain care; teach-back completed; IR and surgery follow-up in 1-2 weeks.' }]
      });
    }
    return st;
  }
})();
