/* Orthopedic / Trauma primary diagnoses, part 4: femoral shaft fracture (IM nail), septic arthritis of a native joint.
   Everything is in hours since admission (h = 0 is arrival). */
NS.PRIMARY = NS.PRIMARY || {};
NS.OG = NS.OG || {};
if (!NS.OG.atClock) {
  NS.OG.atClock = (ctx, hhmm, afterH) => { const U = NS.util; let h = ctx.hOf(`${U.dateOnly(ctx.admit)} ${hhmm}`); while (h <= afterH + 1e-6) h += 24; return Math.round(h * 100) / 100; };
  NS.OG.clock = (ctx, h) => NS.util.hhmm(ctx.ts(h));
}

// ================================================================================================
// FEMORAL SHAFT FRACTURE (closed, intramedullary nail on hospital day 2)
// ================================================================================================
(() => {
  const U = NS.util, C = NS.C, { atClock, clock } = NS.OG;
  const S = a => a.slice().sort((x, y) => x[0] - y[0]);

  NS.PRIMARY.femur_fracture = {
    key: 'femur_fracture', label: 'Femur Fracture (IM Nail)', group: 'Surgical', cat: 'Orthopedic / Trauma', typicalLOS: [4, 6],
    desc: 'Closed femoral shaft fracture after a motor-vehicle collision or fall from a height. Day 1: trauma evaluation, traction splint then skeletal traction, IV opioids, blood-loss, fat embolism and compartment watch. Day 2: intramedullary nailing, Foley, PCA. Day 3-4: POD 1-2 WBAT with PT, enoxaparin, Hgb nadir. Day 5-6: discharge home with walker or rehab.',
    build(ctx) {
      const side = ctx.age % 4 < 2 ? 'Right' : 'Left', sl = side.toLowerCase();
      const mvc = ctx.age % 2 === 1 && ctx.age < 75;                                   // motor-vehicle collision vs fall from a height
      const retro = ctx.bmi >= 35;                                                    // retrograde nail in obesity, antegrade otherwise
      const nailName = retro ? 'retrograde' : 'antegrade';
      const npoH = atClock(ctx, '00:00', 6), orH = atClock(ctx, '07:30', npoH), dur = 2.5, orEnd = orH + dur;
      const dietH = orEnd + 3, unitH = orEnd + 2, orTime = clock(ctx, orH);
      const pod1 = atClock(ctx, '05:00', orEnd + 6), pod2 = pod1 + 24, pod3 = pod1 + 48, pod4 = pod1 + 72;
      const foleyOut = atClock(ctx, '06:00', orEnd + 6), ptH = atClock(ctx, '09:00', orEnd + 6), pcaStop = pod1 + 3;
      const tractLb = Math.max(10, Math.min(25, Math.round(ctx.weightKg * 2.2 * 0.1 / 5) * 5));
      const lowDose = ctx.age >= 65 || ctx.weightKg < 55;
      const thr = ctx.age >= 65 || ctx.has('cad') || ctx.has('hf') ? 8 : 7;
      const hm = Object.assign(C.hydromorphone(), { dose: lowDose ? '0.25 mg' : '0.5 mg', prnInterval: 'Every 3 hours' });
      const morphine = Object.assign(C.opioidIV(ctx, { start: 0.3, stop: orEnd, given: [0.3, 3.4, 7, 10.5, 14, 17.5, 21, 24.5, 27] }),
        { dose: lowDose ? '2 mg' : '4 mg', by: 'ed', alt: hm, renal: { ckd3: { avoid: true, sub: hm }, esrd: { avoid: true, sub: hm } }, info: 'HIGH-ALERT. Severe pain (7-10) only; give oral medication first for moderate pain. Assess pain, sedation (RASS), RR and SpO2 before and 15-30 minutes after. Hold for RR below 10 or oversedation. Pain out of proportion that rises despite opioids, or a rising opioid need, may be compartment syndrome: assess the thigh and leg and call the surgeon.' });
      const pcaDose = lowDose ? '0.1 mg' : '0.2 mg';
      const pca = { key: 'hydromorphone_pca', name: 'hydromorphone (DILAUDID) PCA', dose: `${pcaDose} demand dose, 8-minute lockout, no basal rate`, route: 'IV', freq: 'continuous', fluid: false, startH: orEnd + 0.5, stopH: pcaStop, cls: 'Opioid analgesic', highAlert: true, by: 'surgeon', avoid: ['codeine'], monitor: ['Pain', 'RR', 'SPO2'],
        hold: 'Hold and call the provider for RR below 10, SpO2 below 90%, RASS -2 or lower, or a new motor or sensory change.', indication: 'Post-operative pain after femoral nailing (convert to oral on POD 1)',
        info: 'HIGH-ALERT. Only the patient presses the button (no PCA by proxy by family or staff). Two-nurse verification of drug, concentration, demand dose, lockout and 4-hour limit at start, at every syringe change and every shift. Continuous pulse oximetry; assess sedation, RR and pain hourly x4, then every 2-4 hours. Use with scheduled acetaminophen; no other sedatives. Review total dose delivered vs attempts: many attempts with poor relief suggest an undertreated or new problem (compartment syndrome).',
        nursing: ['Stop the PCA and call for RASS -2 or lower, RR below 10 or SpO2 below 90%; naloxone available.'], alt: { key: 'morphine_pca', name: 'morphine PCA', dose: `${lowDose ? '0.5 mg' : '1 mg'} demand dose, 8-minute lockout, no basal rate`, info: 'Used because of the hydromorphone order set being replaced for this patient. Same PCA safety rules apply.' },
        renal: { ckd3: { dose: '0.1 mg demand dose, 10-minute lockout, no basal rate', note: 'Lower demand dose for reduced kidney function.' }, esrd: { dose: '0.1 mg demand dose, 10-minute lockout, no basal rate', note: 'Lower demand dose for ESRD; hydromorphone is preferred over morphine.' } } };
      delete pca.alt; delete pca.avoid;
      const oxy = Object.assign(C.opioidPO(ctx, { start: 4, given: [8, 14, 19.5, 25, orEnd + 20, orEnd + 25, pod1 + 4, pod1 + 9, pod1 + 14, pod1 + 20, pod2 + 4, pod2 + 9, pod2 + 15, pod2 + 21, pod3 + 5, pod3 + 11] }),
        { dose: lowDose ? '5 mg' : '10 mg', prnFor: 'moderate to severe pain (4-10)', sips: true, by: 'surgeon', info: 'HIGH-ALERT. Assess pain and sedation before and 30-60 minutes after. Hold for RR below 10 or oversedation. Give 30-45 minutes before PT when pain is 4 or higher. Use with a bowel regimen; wean as pain allows (discharge supply is short).' });
      const cefazolin = { key: 'cefazolin', name: 'cefazolin (ANCEF) IVPB', dose: ctx.weightKg >= 120 ? '3 g' : '2 g', route: 'IV', freq: 'q8h', stat: true, startH: orH - 0.5, stopH: orH + 20, volume: 100, cls: 'Cephalosporin antibiotic',
        info: 'Surgical prophylaxis for a CLOSED fracture: first dose within 60 minutes before incision, then every 8 hours for no more than 24 hours. Low cross-reactivity with penicillin; verify the reaction history. Infuse over 30 minutes.', monitor: ['Temp', 'WBC', 'Cr'], indication: 'Surgical site infection prophylaxis (24 hours)', by: 'surgeon',
        avoid: ['cephalosporin', 'cefazolin'], alt: { key: 'vancomycin_ppx', name: 'vancomycin IVPB', dose: `${Math.round(ctx.weightKg * 15 / 250) * 250} mg`, freq: 'q12h', cls: 'Glycopeptide antibiotic', info: 'Used because of cephalosporin allergy. Start infusion 60-120 minutes before incision; infuse over at least 90 minutes. Watch for red man reaction.', monitor: ['Cr'], renal: { ckd3: { freq: 'q24h', note: 'Interval extended for reduced kidney function.' }, esrd: { freq: 'q24h', note: 'Interval extended for ESRD.' } } },
        renal: { ckd3: { freq: 'q12h', note: 'Interval extended for reduced kidney function.' }, esrd: { freq: 'q24h', note: 'Interval extended for ESRD.' } } };
      const spec = {
        primaryTeam: 'surgeon', typicalLOS: [4, 6], fallRiskBoost: 2, medMonitoring: true,
        problem: { name: `Femoral shaft fracture, ${sl}`, details: `Closed, displaced mid-shaft ${sl} femur fracture after ${mvc ? 'a motor-vehicle collision' : 'a fall from a height'}; skeletal traction, then ${nailName} intramedullary nailing on hospital day 2.` },
        chief: `${side} thigh pain and deformity after ${mvc ? 'a car crash' : 'a fall from a ladder'}`,
        hpi: mvc ? `${ctx.age}-year-old ${ctx.sex.toLowerCase()}, restrained driver, struck on the front and ${sl} side at about 45 mph with airbag deployment. The ${sl} knee hit the dashboard. Immediate severe ${sl} thigh pain with deformity and swelling; unable to move the leg. No loss of consciousness, no neck or back pain, chest pain, or abdominal pain, and no numbness in the foot. EMS applied a cervical collar and a traction splint, placed two IVs, and gave fentanyl 100 mcg IV and 500 mL of normal saline. Trauma team activated on arrival.`
          : `${ctx.age}-year-old ${ctx.sex.toLowerCase()} who fell about ${ctx.age >= 65 ? '8' : '12'} feet from a ladder while cleaning gutters and landed on the ${sl} leg and side. Immediate severe ${sl} thigh pain with deformity and swelling; unable to stand or move the leg. No loss of consciousness, head strike, neck or back pain, chest pain, or abdominal pain, and no numbness in the foot. EMS applied a cervical collar and a traction splint, placed two IVs, and gave fentanyl 100 mcg IV and 500 mL of normal saline. Trauma team activated on arrival.`,
        ros: 'Positive for severe thigh pain, swelling and deformity, and inability to bear weight. Negative for head injury, neck or back pain, chest pain, dyspnea, abdominal pain, hematuria, weakness or numbness of the foot, and open wounds.',
        keyLabs: ['Hemoglobin', 'Hematocrit', 'WBC', 'Platelets', 'Potassium', 'Creatinine', 'Creatine kinase', 'Glucose'], hpLabs: ['Hemoglobin', 'Lactate', 'Creatinine', 'Creatine kinase', 'Platelets', 'INR'],
        isolation: 'None', famHxExtra: 'No known family history of bleeding disorders, clotting disorders or problems with anesthesia.',
        flags: { npo: npoH <= ctx.windowEnd ? [[0, 4], [npoH, dietH]] : [[0, 4]], preop: [[0, orH]], surgeryWindow: [[0, orH + 48]], postop: [[orEnd, 9999]] },
        ppxStartH: 6,
        vitals: S([
          { h: 0, temp: 98.2, hr: 114, sbp: 118, dbp: 74, rr: 22, spo2: 97, pain: 9, o2: 'Room air' },
          { h: 1.5, temp: 98.2, hr: 106, sbp: 122, dbp: 74, rr: 20, spo2: 97, pain: 7 },
          { h: 3, temp: 98.4, hr: 98, sbp: 126, dbp: 76, rr: 18, spo2: 97, pain: 4 },
          { h: 8, temp: 98.8, hr: 94, sbp: 126, dbp: 74, rr: 18, spo2: 97, pain: 5 },
          { h: 14, temp: 99.2, hr: 92, sbp: 128, dbp: 76, rr: 16, spo2: 97, pain: 5 },
          { h: 22, temp: 99.4, hr: 90, sbp: 126, dbp: 76, rr: 16, spo2: 97, pain: 5 },
          { h: orH - 1, temp: 99.0, hr: 88, sbp: 128, dbp: 78, rr: 16, spo2: 97, pain: 4 },
          { h: orEnd, temp: 97.6, hr: 94, sbp: 110, dbp: 64, rr: 14, spo2: 96, pain: 3, o2: '2 L nasal cannula' },
          { h: orEnd + 3, temp: 98.2, hr: 96, sbp: 116, dbp: 68, rr: 16, spo2: 96, pain: 4 },
          { h: orEnd + 9, temp: 99.6, hr: 98, sbp: 116, dbp: 68, rr: 16, spo2: 95, pain: 5, o2: 'Room air' },
          { h: pod1 + 4, temp: 100.0, hr: 94, sbp: 118, dbp: 70, rr: 16, spo2: 96, pain: 5 },
          { h: pod1 + 20, temp: 99.4, hr: 88, sbp: 122, dbp: 72, rr: 16, spo2: 96, pain: 4 },
          { h: pod2 + 6, temp: 98.8, hr: 84, sbp: 122, dbp: 74, rr: 16, spo2: 97, pain: 3 },
          { h: pod3 + 6, temp: 98.4, hr: 80, sbp: 124, dbp: 74, rr: 16, spo2: 97, pain: 3 },
          { h: pod4 + 6, temp: 98.2, hr: 76, sbp: 124, dbp: 76, rr: 16, spo2: 98, pain: 2 }
        ]),
        labs: {
          Hemoglobin: { add: S([[0, -0.8], [6, -1.9], [14, -2.7], [orH - 1, -3.0], [orEnd, -3.7], [orEnd + 6, -4.1], [pod1, -4.4], [pod2, -4.3], [pod3, -4.0], [pod4 + 24, -3.7]]) },
          WBC: { add: S([[0, 5.2], [24, 3.4], [orEnd + 6, 4.6], [pod1, 3.4], [pod2, 1.6], [pod3, 0.6], [pod4, 0]]) },
          Platelets: { add: S([[0, -15], [14, -45], [pod1, -75], [pod2, -50], [pod3, 0], [pod4 + 24, 60]]) },
          Sodium: { add: [[0, -2], [24, -1], [pod2, -1]] }, Chloride: { add: [[0, 1], [24, 1]] }, CO2: { add: [[0, -3], [6, -1], [24, 0]] },
          Potassium: { add: S([[0, 0.2], [14, 0.1], [pod1, 0.1]]) },
          Creatinine: { add: S([[0, 0.14], [14, 0.1], [pod1, 0.12], [pod2, 0.08], [pod3, 0.03]]) }, BUN: { add: S([[0, 4], [24, 4], [pod1, 5], [pod3, 1]]) },
          Glucose: { add: S([[0, 36], [14, 18], [orEnd + 4, 30], [pod2, 12]]) },
          Calcium: { add: [[0, -0.2], [pod1, -0.6], [pod3, -0.4]] }, Albumin: { add: [[0, -0.3], [pod1, -0.9]] }, Magnesium: { abs: [[0, 1.8], [pod1, 1.7], [pod3, 1.9]] },
          Lactate: { abs: [[0, 3.4], [4, 1.8], [24, 1.2]] },
          'Creatine kinase': { abs: S([[0.3, 420], [24, 1850], [orEnd + 6, 2600], [pod1, 2200], [pod2, 900], [pod3, 380]]) },
          INR: { add: [[0, 0.1], [14, 0.05]] }
        },
        labSchedule: [
          { h: 0.4, codes: ['Lactate', 'Creatine kinase', 'PT', 'INR', 'aPTT', 'Calcium', 'Magnesium', 'Phosphorus', 'Albumin'] },
          { h: 4, codes: ['Lactate', 'Hemoglobin', 'Hematocrit'] },
          { h: 10, codes: ['Hemoglobin', 'Hematocrit'] },
          { h: 16, codes: ['Hemoglobin', 'Hematocrit', 'Creatine kinase'] },
          { h: orH - 3, codes: ['Hemoglobin', 'Hematocrit', 'Potassium', 'Creatinine', 'Platelets'] },
          { h: orEnd + 6, codes: ['Hemoglobin', 'Hematocrit', 'Creatine kinase'] },
          { h: pod1 + 14, codes: ['Hemoglobin', 'Hematocrit'] },
          { h: pod2 + 14, codes: ['Hemoglobin', 'Hematocrit'] }
        ],
        quals: [
          { h: 0.5, category: 'Blood Bank', code: 'Type and crossmatch', value: 'A positive; antibody screen negative; 2 units PRBC crossmatched and available', specimen: 'Blood' },
          { h: 1.4, category: 'Urinalysis', code: 'Urinalysis - leukocyte esterase', value: 'Negative', reference: 'Negative', specimen: 'Urine' },
          { h: 1.4, category: 'Urinalysis', code: 'Urinalysis - nitrite', value: 'Negative', reference: 'Negative', specimen: 'Urine' },
          ...(ctx.female && ctx.age < 55 ? [{ h: 0.6, category: 'Other', code: 'Urine hCG (pregnancy test)', value: 'Negative', reference: 'Negative', specimen: 'Urine' }] : [])
        ],
        events: [
          { type: 'imaging', h: 0.3, study: 'Portable chest x-ray and AP pelvis (trauma series)', modality: 'X-ray', indication: 'Trauma activation: screen for thoracic and pelvic injury',
            findings: 'Lungs clear without pneumothorax, hemothorax or rib fracture; mediastinum not widened. Pelvic ring and acetabula intact; hips located. No free air.', impression: 'No acute cardiopulmonary or pelvic injury.' },
          { type: 'imaging', h: 0.4, study: 'FAST exam (focused assessment with sonography for trauma)', modality: 'Ultrasound', indication: 'Blunt trauma: free fluid screen', findings: 'No free fluid in Morison pouch, splenorenal recess or pelvis. No pericardial effusion. Lung sliding present bilaterally.', impression: 'Negative FAST.' },
          { type: 'imaging', h: 0.6, study: `X-ray ${sl} femur, AP and lateral, with hip and knee views`, modality: 'X-ray', indication: `${side} thigh pain and deformity after ${mvc ? 'a motor-vehicle collision' : 'a fall from a height'}`,
            findings: `Closed, transverse-to-short-oblique, displaced fracture of the mid-shaft of the ${sl} femur with 1 cm of overriding and about 15 degrees of apex-lateral angulation. Moderate butterfly fragment. Large soft-tissue swelling of the thigh. Femoral neck, hip joint and knee joint without fracture or dislocation. No gas in the soft tissues.`, impression: `Displaced ${sl} femoral shaft fracture (AO/OTA 32-B). Ipsilateral hip and knee negative.` },
          { type: 'procedure', h: 0.8, duration: 0.3, name: `Application of femoral traction splint, ${sl} leg`, label: `ED traction splint, ${sl} femur`, by: 'ed', service: 'Emergency Medicine', indication: 'Reduce thigh volume, bleeding and pain; stabilize femoral shaft fracture',
            findings: `Neurovascular exam before and after: foot warm, dorsalis pedis and posterior tibial pulses palpable, capillary refill under 3 seconds, sensation and toe movement intact. Ankle hitch applied and in-line traction about 10% of body weight with the splint secured; pain 9/10 to 4/10 after fentanyl 50 mcg IV. Splint padded at the groin and ischium; no skin breakdown.` },
          { type: 'imaging', h: 1.7, study: 'CT head and cervical spine without contrast', modality: 'CT', indication: `${mvc ? 'High-speed collision' : 'Fall from a height'}: exclude intracranial or cervical spine injury`, findings: 'No intracranial hemorrhage, mass effect or skull fracture. Cervical spine alignment normal; no acute fracture or prevertebral swelling.', impression: 'Negative CT head and cervical spine. Cervical collar may be cleared clinically.' },
          { type: 'imaging', h: 2.0, study: 'CT chest, abdomen and pelvis with IV contrast (trauma)', modality: 'CT', contrast: true, indication: `${mvc ? 'High-energy mechanism' : 'Fall from a height'} with a femoral shaft fracture: exclude occult torso injury`,
            findings: `No solid-organ injury, free fluid, pneumothorax, pulmonary contusion, aortic injury or spine fracture. Pelvic ring intact. Large intramuscular hematoma of the ${sl} thigh seen at the upper field of view.`, impression: 'No torso injury. Isolated femoral shaft fracture with thigh hematoma.' },
          { type: 'cardiology', h: 2.4, study: '12-lead ECG', label: 'Trauma ECG', indication: 'High-energy mechanism; pre-operative evaluation',
            impression: ctx.has('afib') ? 'Atrial fibrillation with controlled ventricular response (rate 90). No acute ST-T wave changes. QTc 432 ms.' : 'Sinus tachycardia, rate 102, otherwise normal axis and intervals. No acute ST-T wave changes. QTc 428 ms.' },
          { type: 'consult', h: 2.6, service: 'Orthopedic Surgery', author: 'surgeon', orderedBy: 'ed', reason: `${side} femoral shaft fracture`, label: 'Orthopedic surgery consulted; operative plan',
            recommendation: `Admit to the orthopedic trauma service. Closed displaced femoral shaft fracture: skeletal traction pin now for length, alignment and pain; ${nailName} intramedullary nailing tomorrow morning (about ${orTime}, within 24-36 hours) once resuscitated (lactate cleared, Hgb stable). Neurovascular and thigh compartment checks every 1-2 hours; Hgb every 6-8 hours; type and crossmatch 2 units, transfuse for Hgb below ${thr} or hemodynamic instability. NPO after midnight. Chemical VTE prophylaxis to start once Hgb is stable and held before incision; SCD on the uninjured leg. Weight bearing as tolerated after nailing per surgeon. Tertiary trauma survey within 24 hours.` },
          { type: 'procedure', h: 3.4, duration: 0.5, name: `Distal femoral skeletal traction pin placement, ${sl} leg`, label: `Bedside distal femoral traction pin, ${sl} leg`, by: 'surgeon', service: 'Orthopedic Surgery', indication: 'Maintain femoral length and alignment before intramedullary nailing',
            findings: `Time-out done. Sterile prep and 1% lidocaine to skin and periosteum (below maximum dose) with IV morphine for sedation. Steinmann pin placed from medial to lateral through the distal femur (protecting the neurovascular bundle); ends capped. ${tractLb} lb of weight applied through a traction bow with the thigh supported on a Thomas splint and Pearson attachment; knee at 20-30 degrees of flexion. Foot warm, pulses palpable, sensation intact after. Pin site dressed with chlorhexidine gauze. Pain 3/10.` },
          { type: 'imaging', h: 4.2, study: `X-ray ${sl} femur in skeletal traction`, modality: 'X-ray', indication: 'Alignment check in traction', findings: 'Distal femoral traction pin in satisfactory position. Femoral length improved; residual 5 mm of shortening and mild angulation; fracture otherwise unchanged. No new fracture.', impression: 'Improved length and alignment in traction.' },
          { type: 'transfer', h: 5.0, label: 'Admitted to the orthopedic trauma unit', text: 'Transferred from the ED to the orthopedic trauma unit in skeletal traction.' },
          { type: 'surgery', h: orH, duration: dur, name: `${side} femoral intramedullary nailing (${nailName})`, label: `${side} femur ${nailName} IM nail`, anesthesia: 'General endotracheal anesthesia', orderH: orH - 20,
            indication: 'Displaced closed femoral shaft fracture',
            findings: `Closed transverse shaft fracture with a butterfly fragment, reduced on the fracture table under fluoroscopy; nail length and rotation confirmed against the contralateral leg. Thigh hematoma evacuated through the reaming incision. No vascular injury.`,
            procedure: retro ? `Supine on a radiolucent table with a bump under the knee. Skeletal traction pin removed. Infrapatellar incision; entry point at the intercondylar notch under fluoroscopy; guidewire passed across the reduced fracture, canal reamed and a retrograde nail placed; proximal and distal locking screws through stab incisions. Wounds irrigated and closed with absorbable suture and skin glue.` : `Supine on the fracture table with the pin used for traction. Closed reduction under fluoroscopy. Incision proximal to the greater trochanter; entry point and guidewire passed across the fracture, canal reamed and an antegrade nail placed; proximal and distal interlocking screws through stab incisions. Traction pin removed, sites dressed. Wounds irrigated and closed with absorbable suture and skin glue.`,
            ebl: '400 mL', fluids: "2,000 mL lactated Ringer's", specimens: 'None', complications: 'None', disposition: 'PACU, then orthopedic unit' },
          { type: 'imaging', h: orEnd + 1.5, study: `X-ray ${sl} femur, AP and lateral, post-operative`, modality: 'X-ray', indication: 'Post-operative hardware and alignment check',
            findings: `${retro ? 'Retrograde' : 'Antegrade'} intramedullary nail with proximal and distal interlocking screws in satisfactory position. Fracture reduced in near-anatomic alignment with restored length and rotation. Expected soft-tissue gas. Hip and knee located.`, impression: 'Satisfactory fixation of the femoral shaft fracture.' }
        ],
        meds: [
          C.bolus("lactated Ringer's bolus", 1000, { start: 0.3, by: 'ed', indication: 'Blood loss into the thigh (class II hemorrhage: HR 114, lactate 3.4); reassess after bolus' }),
          Object.assign(C.lrMaintenance({ start: 1.5, stop: orEnd + 14, rate: 100 }), { by: 'ed', info: 'Replaces ongoing thigh-hematoma losses and NPO periods. Assess lungs, edema and I&O; watch for fluid overload in older adults and with heart or kidney disease. Check IV site each shift.' }),
          morphine, pca, oxy,
          Object.assign(C.ondansetron({ start: 0.8, given: [0.8, orEnd + 1.5, orEnd + 11] }), { info: 'Reassess nausea in 30 minutes. May prolong QT and cause constipation.' }),
          Object.assign(C.acetaminophenPO({ start: 1.2 }), { dose: ctx.weightKg < 55 ? '650 mg' : '1,000 mg', freq: ctx.weightKg < 55 ? 'q6h' : 'q8h', stat: true, sips: true, by: 'ed', info: 'Scheduled (not PRN) base of multimodal analgesia; opioid-sparing. Maximum 3 g per 24 hours from all sources. NSAIDs are avoided for now (bleeding and fracture healing).' }),
          { key: 'methocarbamol', name: 'methocarbamol (ROBAXIN) tablet', dose: '500 mg', route: 'Oral', freq: 'q6h', prn: true, prnInterval: 'Every 6 hours', prnFor: 'thigh muscle spasm', cls: 'Skeletal muscle relaxant', sips: true, info: 'Causes drowsiness and dizziness; additive with opioids. Hold for sedation. Assess spasm location: a tense, painful thigh is not simple spasm.', monitor: ['Pain'], indication: 'Muscle spasm around the fracture', startH: 6, prnGiven: [], by: 'surgeon', when: ctx.age < 65 },
          cefazolin,
          { key: 'peg3350', name: 'polyethylene glycol (MIRALAX) powder', dose: '17 g', route: 'Oral', freq: 'daily', prn: true, prnInterval: 'Once daily', prnFor: 'no bowel movement in 24 hours', cls: 'Osmotic laxative', info: 'Mix in 4-8 oz of fluid. Hold for loose stools. Goal: bowel movement by post-op day 3 (opioids, bed rest, traction).', indication: 'Opioid and immobility constipation prevention', startH: 12, prnGiven: [], by: 'surgeon' },
          { key: 'ferrous_sulfate', name: 'ferrous sulfate tablet', dose: '325 mg', route: 'Oral', freq: 'daily', cls: 'Iron supplement', info: 'Give with food if upset stomach. Dark stools are expected. Can worsen constipation.', monitor: ['Hgb'], indication: 'Acute blood loss anemia after fracture and surgery', startH: pod1 + 4, by: 'surgeon' }
        ],
        orders: [
          C.diet('NPO', 0.3, 4, 'NPO until the trauma work-up is complete and the surgical plan is set; IV fluids. Sips with essential medications.'),
          C.diet('Regular diet', 4, npoH, 'High-protein, high-calcium; encourage fluids. Keep in mind that surgery may be moved earlier on short notice. Set up meals (patient flat in traction).'),
          C.diet('NPO', npoH, dietH, 'NPO after midnight for surgery; sips of water with essential medications until 2 hours before surgery.'),
          C.diet('Regular diet', dietH, undefined, 'Advance as tolerated once awake and not nauseated. High protein; encourage fluids and fiber.'),
          C.activity(`Bed rest in skeletal traction, ${sl} leg`, 0.3, orH, `Strict bed rest, flat or reverse Trendelenburg; ${sl} leg in traction with weights hanging free. Log roll with 2-3 staff, support the leg during repositioning. Bedpan only (fracture pan); never lift or release the traction weights.`),
          C.activity('Bed rest until recovered from anesthesia, then up with assistance', orH, orEnd + 4, 'Head of bed 30 degrees; neurovascular and thigh checks per order; assess sedation before activity.'),
          C.activity(`Weight bearing as tolerated ${sl} leg with walker or crutches, up with assistance`, orEnd + 4, undefined, 'Per surgeon: WBAT after intramedullary nailing. Dangle and stand with 1-2 staff and gait belt after PT teaching; progress with PT. Call light within reach.'),
          { name: 'Cervical spine precautions until cleared', category: 'Precautions', frequency: 'Continuous', startH: 0.3, stopH: 5, instructions: 'Cervical collar and log roll until the CT is read, the patient is awake and sober, and the trauma team clears the spine clinically.' },
          { name: 'Vital signs and hemorrhage watch', category: 'Nursing', frequency: 'Every 15 minutes x4, hourly x4, then every 4 hours', startH: 0.3, instructions: 'Heart rate, BP, RR, SpO2, temperature and pain. A femoral shaft fracture can lose 1,000-1,500 mL into the thigh (rising HR, falling BP, narrowing pulse pressure, pallor, thirst, restlessness; BP falls late). Measure and record thigh circumference every 4 hours at a marked level.', nursing: ['Notify the provider for HR above 120, SBP below 100, thigh circumference increase of 2 cm or more, or Hgb drop of 1 g/dL or more between checks.'] },
          { name: `Femoral traction splint, ${sl} leg (until skeletal traction)`, category: 'Nursing', frequency: 'Continuous', startH: 0.8, stopH: 3.6, instructions: 'Maintain in-line traction; check ankle hitch, padding at the groin and ischium, and distal pulses every 30 minutes. Do not release the splint without the provider.', nursing: ['Pressure at the ischium/groin and the heel can cause skin breakdown: check skin every 2 hours.'] },
          { name: `Skeletal traction care, ${sl} leg (${tractLb} lb)`, category: 'Nursing', frequency: 'Continuous; checks every 2 hours', startH: 3.6, stopH: orH - 0.3, instructions: `Distal femoral pin with ${tractLb} lb of weight on a bow. Weights hang free (not on the floor or bed); ropes in the pulley grooves and knotted ends clear; keep the patient aligned with the foot not pressing on the footboard. Never remove or lift weights without an order. Check that the bow and pin ends are capped and secure.`, nursing: ['Pull to the foot of the bed or weights on the floor: reposition and notify the surgeon.', 'Keep the heel off the bed; check the peroneal nerve at the fibular head (foot drop).'] },
          { name: 'Pin site care and assessment', category: 'Nursing', frequency: 'Every shift', startH: 5, stopH: orH, instructions: 'Per policy: clean each pin site with chlorhexidine or normal saline and sterile applicators, using a separate applicator for each site; apply dry sterile dressing. Assess for redness, drainage, warmth, odor, loosening and skin tenting.', nursing: ['Report purulent drainage, increasing redness, fever, or pin loosening to the surgeon.'] },
          { name: `Neurovascular checks ${sl} leg`, category: 'Nursing', frequency: 'Every hour x4, then every 2 hours until surgery; every 2 hours x24 hours after surgery, then every 4 hours', startH: 0.3, instructions: 'Color, warmth, capillary refill, dorsalis pedis and posterior tibial pulses, sensation (peroneal: first web space; tibial: sole) and active ankle and toe movement, compared with the other foot. Notify the surgeon STAT for pallor, coolness, loss of pulse, numbness or new weakness.', nursing: ['Sensation and capillary refill change before pulses are lost.'] },
          { name: 'Compartment syndrome surveillance (thigh and lower leg)', category: 'Nursing', frequency: 'With every neurovascular check', startH: 0.3, instructions: 'Assess for the 6 Ps: pain out of proportion or increasing despite opioids, pain with passive stretch of the toes or knee, pallor, paresthesia, pulselessness (late), paralysis (late), and a tense, firm, swollen thigh or calf. Call the surgeon STAT; keep the leg at heart level (no ice, no elevation), and loosen dressings or wraps.', nursing: ['A rising opioid or PCA demand is an early warning sign.', 'Compartment syndrome is a surgical emergency (fasciotomy within hours). It can occur after nailing as well.'] },
          { name: 'Fat embolism syndrome surveillance', category: 'Nursing', frequency: 'Every 4 hours with vital signs', startH: 3, stopH: pod3, instructions: 'Highest risk 12-72 hours after a long-bone fracture and during nailing. Assess for new hypoxia (SpO2 below 92% or rising oxygen need), tachypnea, tachycardia, fever, new confusion or restlessness, and petechiae (chest, axillae, neck, conjunctivae, oral mucosa). Notify the provider immediately; apply oxygen; the diagnosis is clinical (petechiae + respiratory + neurologic change).', nursing: ['Continuous pulse oximetry is required while on a PCA or IV opioid.', 'Petechial rash after the first day is a classic late sign: look in the axillae and under the eyelids.'] },
          { name: 'Tertiary trauma survey', category: 'Nursing', frequency: 'Once within 24 hours', startH: 3, completeH: 22, instructions: 'Head-to-toe repeat exam with the surgeon once awake, pain controlled and sober, to find missed injuries (hand, wrist, knee ligaments, ribs, foot). Review all imaging reports.', by: 'surgeon' },
          { name: 'Transfusion threshold: Hgb below ' + thr + ' g/dL or unstable', category: 'Nursing', frequency: 'Per lab result', startH: 0.5, instructions: `Restrictive strategy: transfuse 1 unit PRBC for Hgb below ${thr} g/dL, or for symptomatic anemia (chest pain, dyspnea, syncope) or hemodynamic instability regardless of Hgb. Recheck Hgb after each unit. 2 units are crossmatched.`, nursing: [`Notify the provider for Hgb below ${thr + 1}, HR above 110, SBP below 90, new dyspnea, dizziness or pallor.`] },
          { name: 'Type and crossmatch (2 units PRBC)', category: 'Laboratory', frequency: 'Once; repeat every 72 hours', startH: 0.3, completeH: 0.6, instructions: 'Blood bank specimen; armband required.' },
          { name: 'Pre-operative checklist, consent and site verification', category: 'Nursing', frequency: 'Once', startH: orH - 8, completeH: orH - 0.3, instructions: `Verify consent (patient or health care proxy), ID and allergy bands, ${sl} thigh marked, NPO status, last void, crossmatched blood available, cefazolin within 60 minutes before incision, heparin SQ held, jewelry removed.` },
          { name: 'Sequential compression device, uninjured leg', category: 'Nursing', frequency: 'Continuous when in bed', startH: 4, instructions: 'High VTE risk (long-bone fracture, immobility, trauma). SCD on the uninjured leg until the injured leg can safely wear one after nailing; ankle pumps of the uninjured ankle.', nursing: ['Chemical prophylaxis is held until Hgb is stable, and held before incision per orders; ask before giving each dose if bleeding is suspected.'] },
          C.incentive(3, undefined),
          { name: 'Pressure injury prevention', category: 'Nursing', frequency: 'Every 2 hours', startH: 3, instructions: 'Braden each shift; reposition by log roll every 2 hours; float heels; check the sacrum, ischium and heel in traction; pressure-redistribution mattress.', nursing: ['Traction and immobility put the sacrum and heels at high risk.'] },
          { name: 'Fall prevention (after traction, opioids, new mobility)', category: 'Precautions', frequency: 'Continuous', startH: 3, instructions: 'Bed alarm, gait belt for every transfer, walker within reach, non-skid sock on the uninjured foot, assist x2 for the first walks, no unattended toileting.', nursing: ['Dizziness on first standing may be anemia or orthostasis: dangle first.'] },
          { name: 'PCA safety monitoring', category: 'Nursing', frequency: 'Hourly x4, then every 2-4 hours', startH: orEnd + 0.5, stopH: pcaStop, instructions: 'Sedation (RASS), RR, SpO2 and pain, plus continuous pulse oximetry (capnography where available). Document total dose, demands and deliveries each shift. Naloxone available. Patient and visitors are taught that only the patient presses the button.', nursing: ['Stop the pump and call for RASS -2 or lower, RR below 10 or SpO2 below 90%.'] },
          { name: 'Surgical dressing and incision assessment', category: 'Nursing', frequency: 'Every shift', startH: orEnd, instructions: retro ? 'Assess the knee incision and lateral stab incisions: dressing strikethrough (mark and time), swelling, warmth, drainage, glue integrity. Expect bruising down the thigh.' : 'Assess the proximal hip incision and lateral thigh stab incisions: dressing strikethrough (mark and time), swelling, warmth, drainage, glue integrity. Expect bruising down the thigh.', nursing: ['Report an expanding thigh, tense swelling, or bleeding through the dressing.'] },
          { name: 'Indwelling urinary catheter care and removal on post-op day 1', category: 'Nursing', frequency: 'Every shift', startH: orH, stopH: foleyOut, instructions: 'Foley placed in the OR for strict I&O. Remove by 06:00 on post-op day 1. After removal, document the first void; bladder scan if no void in 6 hours.', nursing: ['Urinary retention is common after anesthesia, opioids and bedpan use.', 'Dark tea-colored urine may suggest myoglobinuria (crush/rhabdomyolysis): notify the provider.'] },
          { name: 'Physical therapy evaluation and treatment', category: 'Consult / Therapy', frequency: 'Daily from POD 1', startH: orEnd + 1, instructions: `Mobilize on post-op day 1: bed mobility, transfers, gait with walker or crutches, weight bearing as tolerated ${sl} leg; knee and hip range of motion; stairs before discharge.`, by: 'surgeon' },
          { name: 'Occupational therapy evaluation and treatment', category: 'Consult / Therapy', frequency: 'Daily from POD 1', startH: orEnd + 1, instructions: 'ADL training with adaptive equipment (reacher, sock aid, shower chair).', by: 'surgeon' },
          { name: 'Case management consult: discharge planning', category: 'Consult / Therapy', frequency: 'Once', startH: 6, instructions: 'Assess home layout (stairs, bedroom/bathroom level), caregiver availability, DME (walker/crutches, shower chair, raised toilet seat), home health or outpatient PT; arrange short-term inpatient rehab if the patient lives alone or cannot manage safely. Work/disability paperwork and trauma social work as needed.' }
        ],
        devices: [
          { deviceType: 'IV', type: 'Peripheral IV', location: 'Right antecubital', siteMarker: 'rightAC', gauge: '18 gauge', placeH: 0.1, infusing: "Lactated Ringer's", status: 'Infusing', assess: 'site clean, dry, intact; flushes easily' },
          Object.assign(C.pivSecond(0.2, 'Left forearm', '18 gauge'), { siteMarker: 'leftForearm' }),
          { deviceType: 'Tube', type: 'Foley catheter', location: 'Urethral', siteMarker: 'pelvis', placeH: orH + 0.4, removeH: foleyOut, status: 'Draining', assess: 'draining clear yellow urine, secured to thigh, no leaking', drainage: '' }
        ],
        assessments: [
          { fromH: 0, items: [['Musculoskeletal / Mobility', 'Mobility', `Bed rest; ${sl} leg immobilized in traction splint; unable to move the leg`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `${side} thigh deformed, swollen and tense but compressible, shortened and externally rotated; tender mid-thigh; foot warm, dorsalis pedis and posterior tibial pulses palpable, capillary refill under 3 seconds, sensation in first web space and sole intact, can move toes`], ['Pain', 'Pain Location', `${side} mid-thigh, sharp and deep, 9/10 on arrival, worse with any movement`], ['Skin', 'Skin', `Pale, cool, diaphoretic on arrival; abrasions over the ${sl} knee${mvc ? ' and seat-belt contusion across the chest without abdominal tenderness' : ''}; no open wounds; ecchymosis forming over the thigh`], ['Skin', 'Braden Score', '18'], ['Respiratory', 'Breath Sounds', 'Clear bilaterally; no chest wall tenderness'], ['Cardiac', 'Rhythm', ctx.has('afib') ? 'Atrial fibrillation' : 'Sinus tachycardia'], ['Neurologic', 'Level of Consciousness', 'Alert and oriented x4; GCS 15; cervical collar in place'], ['Safety', 'Fall Precautions', 'High risk: injured leg, opioids; bed alarm, call light in reach']] },
          { fromH: 4.2, items: [['Musculoskeletal / Mobility', 'Mobility', `Bed rest in skeletal traction (${tractLb} lb); repositions with log roll and 2-3 staff`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Distal femoral pin in place, pin sites dry with chlorhexidine gauze, no drainage; weights hanging free; thigh swollen and firm but soft over the compartments; foot warm, pulses palpable, capillary refill under 3 seconds, sensation and toe movement intact; no pain with passive toe stretch`], ['Pain', 'Pain Location', `${side} thigh, deep ache 4/10 after traction pin, worse with muscle spasm`], ['Skin', 'Skin', 'Color improved; heels and sacrum intact; no pressure from the traction splint'], ['Neurologic', 'Level of Consciousness', 'Alert and oriented; collar cleared by the trauma team'], ['Respiratory', 'Incentive Spirometer', '1,500 mL'], ['Pain', 'Pain Reassessment', 'Pain 4/10 30 minutes after morphine; no sedation'] ] },
          { fromH: 10, items: [['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Thigh circumference 4 cm above baseline measurement, firm but soft; foot warm with 2+ pulses, capillary refill under 3 seconds; sensation intact; no pain with passive toe stretch`], ['Pain', 'Pain Location', `${side} thigh aching 5/10 with spasms, relieved by oxycodone and methocarbamol`], ['Skin', 'Skin', 'No petechiae on the chest, axillae or conjunctivae; skin pink and warm']] },
          { fromH: npoH, items: [['Safety', 'Delirium Screen (CAM)', 'Negative'], ['GI', 'Last BM / Flatus', 'Last BM before the injury; passing flatus'], ['Neurologic', 'Level of Consciousness', 'Alert and oriented; no confusion or restlessness'], ['Skin', 'Skin', 'No petechiae; pin sites dry, clean; heels floated']] },
          { fromH: orEnd, items: [['Skin', 'Surgical Incisions', retro ? `${side} infrapatellar knee incision and lateral thigh stab incisions with skin glue and dressings clean, dry, intact; no drain` : `${side} proximal hip incision and lateral thigh stab incisions with skin glue and dressings clean, dry, intact; no drain`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Thigh swollen with expected bruising, firm but soft; foot warm, pulses palpable, capillary refill under 3 seconds; sensation and toe movement intact; no pain with passive toe stretch`], ['Musculoskeletal / Mobility', 'Mobility', 'Bed rest after anesthesia; turned with 2 staff; leg supported on pillows'], ['GU', 'Urinary Elimination', 'Foley catheter to gravity, clear yellow urine 60 mL/hr'], ['Respiratory', 'Breath Sounds', 'Clear, diminished at bases'], ['Respiratory', 'Incentive Spirometer', '1,000 mL'], ['Pain', 'Pain Location', `${side} thigh incisions, aching 4/10; using PCA with good effect (hydromorphone PCA: sedation scale RASS 0)`], ['GI', 'Nausea / Vomiting', 'Mild nausea after general anesthesia; relieved with ondansetron'], ['Neurologic', 'Level of Consciousness', 'Alert, oriented, mild drowsiness from anesthesia']] },
          { fromH: pod1 - 2, items: [['GI', 'Nausea / Vomiting', 'None'], ['GI', 'Last BM / Flatus', 'No BM since the injury; passing flatus'], ['Cardiac', 'Edema', `${side} thigh and knee swollen with bruising; trace foot edema; calf soft and non-tender`], ['Skin', 'Braden Score', '16'], ['Respiratory', 'Incentive Spirometer', '1,250 mL'], ['Skin', 'Skin', 'No petechiae on chest, axillae or conjunctivae; temperature 100.0 F is expected on POD 1; lungs clear'], ['Neurologic', 'Level of Consciousness', 'Alert and oriented x4; no new confusion']] },
          { fromH: foleyOut, items: [['GU', 'Urinary Elimination', 'Foley removed; voiding spontaneously (350 mL first void), urine clear yellow, no urgency or burning']] },
          { fromH: ptH, items: [['Musculoskeletal / Mobility', 'Mobility', `Stood at the bedside and walked 10 feet with rolling walker and assist x1 with PT; WBAT ${sl} leg; up to chair for meals`], ['Pain', 'Pain Location', `${side} thigh 4/10 with movement after oxycodone; PCA stopped`]] },
          { fromH: pod2, items: [['Musculoskeletal / Mobility', 'Mobility', 'Walking 50 feet with rolling walker and contact guard assist'], ['Skin', 'Skin', 'Sacrum and heels intact; incisions clean, dry, intact; bruising extends to the knee, softer and yellowing'], ['Skin', 'Braden Score', '17'], ['GI', 'Last BM / Flatus', 'No BM for 3 days; Miralax given'], ['Respiratory', 'Incentive Spirometer', '1,500 mL'], ['Pain', 'Pain Location', `${side} thigh, aching 3/10, controlled with acetaminophen and PRN oxycodone`], ['Cardiac', 'Edema', `${side} thigh and knee swollen; calf soft and non-tender; no unilateral calf pain`]] },
          { fromH: pod3, items: [['Musculoskeletal / Mobility', 'Mobility', 'Walking 150 feet with rolling walker and standby assist; 4 stairs with supervision; transfers independent'], ['GI', 'Last BM / Flatus', 'Moderate BM this morning'], ['Pain', 'Pain Location', `${side} thigh, 2-3/10`]] }
        ],
        io: [
          { fromH: 0, po: 0, urine: 200 },
          { fromH: 8, po: 360, urine: 340 },
          { fromH: npoH, po: 120, urine: 300 },
          { fromH: orH, po: 0, urine: 200 },
          { fromH: orEnd, po: 60, urine: 260 },
          { fromH: dietH + 2, po: 240, urine: 330 },
          { fromH: pod1, po: 420, urine: 340 },
          { fromH: pod2, po: 600, urine: 380 }
        ],
        therapy: {
          fromH: ptH,
          assist: h => (h < ptH + 24 ? 'moderate assist of one' : h < ptH + 56 ? 'contact guard assist' : 'supervision / standby assist'),
          gait: h => (h < ptH + 24 ? '10 feet with rolling walker' : h < ptH + 56 ? '50 feet with rolling walker' : '150 feet with rolling walker; stairs with supervision'),
          rec: `Home with home health or outpatient PT, rolling walker or crutches, WBAT ${sl} leg if 24-hour help is available; short-term inpatient rehab if lives alone, multiple stairs, or unable to meet therapy goals`
        },
        discharge: { dispo: () => 'Home with home health or outpatient PT and a walker (or crutches); short-term inpatient rehab if unsafe at home', estimate: 'post-operative day 3-4 (hospital day 5-6) once pain is controlled on oral medication, Hgb is stable, and therapy has cleared transfers, gait and stairs' },
        stages: femurStages(ctx, { side, sl, mvc, retro, nailName, thr, tractLb, npoH, orH, orEnd, orTime, foleyOut, ptH, pod1, pod2, pod3, pod4, dietH }),
        stickies: [
          { title: 'Neurovascular / compartment watch', body: 'Neurovascular checks every 1-2 hours. Pain out of proportion or rising despite opioids, pain with passive toe stretch, numbness, a cool pale foot or a tense thigh/calf: call the surgeon STAT. Keep the leg at heart level (no ice, no elevation).' },
          { title: 'Fat embolism / blood loss', body: `Watch for new hypoxia, confusion and petechiae in the first 72 hours. Femur fractures can lose 1-1.5 L: trend HR, BP, thigh circumference and Hgb; transfuse below ${thr} g/dL or if unstable.`, fromH: 0 },
          { title: 'Skeletal traction', body: `${tractLb} lb on the distal femoral pin: weights free-hanging, never lift or release them; pin care each shift; heel floated.`, fromH: 3.6 },
          { title: 'VTE prevention (very high risk)', body: 'Heparin SQ before surgery (held before incision); enoxaparin starts about 12 hours after surgery and often continues 2-4 weeks after discharge. SCD on the uninjured leg; ankle pumps.', fromH: 6 },
          { title: 'PCA safety', body: 'Only the patient presses the button. Continuous pulse oximetry; sedation and RR checks per order; naloxone available.', fromH: orEnd + 0.5 }
        ],
        objectives: ['Perform neurovascular checks and compartment syndrome and fat embolism surveillance for a patient with a femoral shaft fracture; recognize hemorrhage in the thigh.', 'Provide care for a patient in skeletal traction (weights, pin-site care, alignment, skin) and prioritize pain control with IV opioids, PCA and multimodal analgesia safely.', 'Prepare a trauma patient for intramedullary nailing: blood loss monitoring and transfusion threshold, NPO, consent, antibiotic timing; provide post-operative care (Foley removal, incisions, VTE prophylaxis).', 'Teach weight bearing as tolerated mobility with a walker, enoxaparin and warning signs, and coordinate PT/OT and discharge planning.']
      };
      return spec;
    }
  };

  function femurStages(ctx, p) {
    const { side, sl, mvc, retro, nailName, thr, tractLb, npoH, orH, orEnd, orTime, foleyOut, ptH, pod1, pod2, pod3, pod4 } = p;
    const st = [];
    st.push({
      fromH: 0, id: 'ed', label: `${side} femoral shaft fracture: trauma evaluation, traction splint, resuscitation`,
      problem: `Closed displaced ${sl} femoral shaft fracture after ${mvc ? 'a motor-vehicle collision' : 'a fall from a height'}; class II hemorrhage from thigh hematoma; trauma work-up in progress.`,
      subj: `Severe ${sl} thigh pain 9/10 on arrival, 4/10 after the traction splint and IV morphine. Thirsty and anxious. No head, neck, chest or abdominal pain. Toes feel normal; no numbness.`,
      assess: `Isolated ${sl} femoral shaft fracture; HR 114 and lactate 3.4 from thigh blood loss, responding to 1 L LR; FAST, chest and pelvis x-rays, CT head/neck/chest/abdomen/pelvis without other injury; neurovascularly intact.`,
      plan: ['Traction splint now, then distal femoral skeletal traction pin; neurovascular and compartment checks hourly x4.', 'LR bolus 1 L then maintenance; type and crossmatch 2 units; Hgb and lactate repeated; transfuse if unstable.', 'IV morphine PRN, scheduled acetaminophen, methocarbamol for spasm; no NSAIDs.', 'Orthopedic trauma consult: intramedullary nailing tomorrow morning; NPO after midnight.', 'Tertiary survey within 24 hours; cervical collar cleared by the trauma team.'],
      nursing: [`Traction splint on; ${sl} foot warm, pulses palpable, capillary refill under 3 seconds, sensation intact.`, 'Two large-bore IVs; HR falling after the bolus; thigh circumference marked.', 'Pain reassessed 30 minutes after each opioid; no sedation.', 'Fall and bleeding precautions; patient and family oriented to the plan.'],
      teach: ['Why the leg is held in traction, why bed rest is needed, the NPO plan, and to report numbness, cold toes, or pain that suddenly worsens.'],
      dispo: 'Anticipate 4-6 days: nailing on hospital day 2, then home or rehab.',
      objectives: ['Assess neurovascular status, blood loss and pain for a patient with a traction splint.'],
      stickies: [{ title: 'Trauma arrival', body: 'Hemorrhage watch: HR, BP, thigh circumference, Hgb. Neurovascular and compartment checks hourly x4. Bedpan and log roll only.' }]
    });
    st.push({
      fromH: 5, id: 'traction', label: `Skeletal traction on the orthopedic trauma unit, awaiting nailing`,
      problem: `${side} femoral shaft fracture in skeletal traction (${tractLb} lb); hospital day 1; blood loss monitored; intramedullary nailing tomorrow morning.`,
      subj: 'Thigh aching 4-5/10 with spasms. Bored and sore from lying flat. Thirsty. No chest pain, shortness of breath, or numbness of the foot.',
      assess: 'Hemodynamically stable after the bolus; lactate cleared; Hgb falling as expected from thigh hematoma; no signs of fat embolism or compartment syndrome; low-grade temperature from hematoma.',
      plan: ['Skeletal traction: weights free-hanging; pin care every shift; Hgb every 6-8 hours with transfusion only if below ' + thr + ' or unstable.', 'Neurovascular and compartment checks every 2 hours; fat embolism surveillance (SpO2, mental status, petechiae).', 'Scheduled acetaminophen, oxycodone for moderate pain, IV morphine for severe pain; bowel regimen.', 'Heparin SQ prophylaxis once Hgb stable; SCD on the uninjured leg; incentive spirometry.', 'Diet until midnight; NPO after midnight for surgery; case management started.'],
      nursing: ['Traction aligned, weights hanging free; pin sites dry with chlorhexidine gauze.', `${side} foot warm, pulses palpable, sensation and toe movement intact; thigh firm but soft.`, 'Heels floated; sacrum intact; repositioned by log roll every 2 hours.', 'Lungs clear, SpO2 97% on room air; no petechiae.'],
      teach: ['Why we monitor your blood count, the signs of a clot or fat in the lungs, deep breathing with the spirometer, and what to expect on surgery morning.'],
      dispo: 'Surgery tomorrow morning; expect 3-5 more days.',
      stickies: [{ title: 'Traction rules', body: 'Never lift or release weights. Keep ropes in pulleys, weights off the floor and bed, heel floated. Pin care each shift.' }]
    });
    st.push({
      fromH: npoH, id: 'preop', label: 'Pre-operative: NPO, awaiting intramedullary nailing',
      problem: `${side} femoral shaft fracture in traction; NPO, awaiting ${nailName} intramedullary nailing this morning (about ${orTime}).`,
      subj: 'Pain 4-5/10 overnight, controlled. Nervous about surgery. Slept in short stretches. No shortness of breath or confusion.',
      assess: `Stable overnight; Hgb down about 3 g/dL from admission without need for transfusion (threshold ${thr}); CK rising; no fat embolism or compartment syndrome; cleared for surgery.`,
      plan: ['NPO; maintenance IV fluids; essential meds with sips.', `General anesthesia for ${nailName} IM nail about ${orTime}; cefazolin 30-60 minutes before incision; heparin SQ held; crossmatched blood available.`, 'Pre-operative checklist, consent, site marking; keep traction until the OR.'],
      nursing: ['NPO since midnight; LR infusing at 100 mL/hr.', 'Neurovascular checks unchanged; no petechiae; SpO2 97% on room air.', 'Pre-op checklist and consent verified; thigh marked.'],
      teach: ['What to expect: general anesthesia, an incision with drains none, Foley, PCA for pain, and getting up with PT the day after surgery.'],
      dispo: 'Surgery today.',
      stickies: [{ title: 'To OR', body: `OR about ${orTime}: NPO, cefazolin 30-60 min before incision, hold heparin SQ, verify consent, marked ${sl} thigh and crossmatch.` }]
    });
    st.push({
      fromH: orEnd, id: 'postop0', label: 'Post-operative day 0: PACU, PCA, Foley',
      problem: `Status post ${sl} femoral ${nailName} intramedullary nail (POD 0).`,
      subj: 'Awake in recovery; thigh sore 4/10 and nauseated. Pressing the PCA button with good relief. Wants to know when he or she can walk.',
      assess: 'POD 0; stable after general anesthesia; EBL 400 mL; Hgb expected to fall further; monitor for fat embolism (nailing reams the canal) and compartment syndrome.',
      plan: ['Cefazolin x 24 hours; hydromorphone PCA with scheduled acetaminophen; oral oxycodone when awake and tolerating diet.', 'Enoxaparin about 12 hours after surgery; SCDs; incentive spirometry hourly.', 'Hgb this evening and in the morning; transfuse for Hgb below ' + thr + ' or symptoms.', 'Neurovascular and compartment checks every 2 hours; Foley out tomorrow at 06:00.', 'Weight bearing as tolerated per surgeon; PT tomorrow.'],
      nursing: ['Dressings clean, dry, intact; foot warm with palpable pulses; sensation and toe movement intact.', 'Foley draining 60 mL/hr; PCA running, RASS 0, RR 14, continuous SpO2 96%.', 'Nausea relieved with ondansetron; diet advanced when awake.', 'Bed alarm on; call light in reach.'],
      teach: ['Use the PCA button only yourself; deep breathing; ankle pumps; call before getting up; signs to report (calf pain, chest pain, shortness of breath, confusion).'],
      dispo: 'Expect 2-3 more days; home with PT or rehab.'
    });
    st.push({
      fromH: pod1, id: 'pod1', label: 'Post-operative day 1: PCA to oral, first mobilization',
      problem: `POD 1 ${sl} femoral intramedullary nail; Hgb nadir expected; first PT session.`,
      subj: 'Pain 4-5/10 with movement; PCA stopped this morning. Slept poorly. Nauseated once. Wants the catheter out. No chest pain or shortness of breath.',
      assess: 'Post-operative blood loss anemia (Hgb about 4 g/dL below admission) without symptoms, no transfusion needed; low-grade temperature on POD 1 (atelectasis, hematoma); no signs of infection, DVT, fat embolism or compartment syndrome.',
      plan: ['Foley removed; bladder scan if no void in 6 hours.', 'PCA discontinued; oral oxycodone with scheduled acetaminophen; wean as tolerated.', 'PT and OT today: out of bed to chair, walker, WBAT.', 'Daily CBC; start ferrous sulfate; continue enoxaparin and SCDs; bowel regimen.', 'Case management: home vs rehab; DME.'],
      nursing: ['Voided 350 mL after Foley removal; no retention.', 'Dangled then stood with PT and walker; no dizziness.', 'Temperature 100.0 F, lungs clear, IS 1,250 mL; no petechiae.', 'Dressings dry; thigh swollen but soft; calf soft.'],
      teach: ['Walker use and weight bearing, incentive spirometer, ankle pumps, enoxaparin injection teach-back, and bowel regimen.'],
      dispo: 'Anticipate discharge on post-operative day 3-4.'
    });
    st.push({
      fromH: pod2, id: 'pod2', label: 'Post-operative day 2: working with therapy',
      problem: `POD 2 ${sl} femoral intramedullary nail; mobilizing; pain controlled on oral medication.`,
      subj: 'Pain 3/10 on acetaminophen and occasional oxycodone. Walked 50 feet. No BM for 3 days; mild bloating.',
      assess: 'Recovering as expected. Hgb stable at its nadir; afebrile; incisions clean; constipation risk from opioids and iron.',
      plan: ['Continue acetaminophen; wean oxycodone; no NSAIDs unless the surgeon approves.', 'Enoxaparin continues at discharge (2-4 weeks); iron once daily.', 'Miralax; goal BM today.', 'PT: stairs and gait; OT: ADLs. Finalize home health or rehab.'],
      nursing: ['Walked 50 feet with contact guard; transferred to chair for meals.', 'Incisions clean, dry, intact; calves soft and non-tender.', 'Eating 75% of meals; encouraged fluids and fiber.', 'Oriented, cooperative.'],
      teach: ['Enoxaparin self-injection with a return demonstration, medication plan after discharge, pain control, fall prevention.'],
      dispo: 'Expected discharge in 1-2 days.'
    });
    st.push({
      fromH: pod3, id: 'pod3', label: 'Post-operative day 3: ready for discharge',
      problem: `POD 3 ${sl} femoral intramedullary nail; meeting discharge goals.`,
      subj: 'Pain 2-3/10. Had a bowel movement this morning. Walked 150 feet and climbed 4 stairs.',
      assess: 'Medically stable for discharge; Hgb stable; afebrile; therapy goals met.',
      plan: ['Discharge home with home health/outpatient PT, walker, WBAT; or inpatient rehab if unsafe at home.', 'Discharge summary: enoxaparin duration, oxycodone supply and bowel regimen, orthopedic follow-up in 2 weeks for wound check and x-ray.', 'Return precautions reviewed.'],
      nursing: ['Ambulating with walker and standby assist; voiding; BM today.', 'Teach-back on enoxaparin and warning signs completed.', 'Prescriptions and equipment ready.'],
      teach: ['Teach-back on warning signs: fever, wound drainage, calf pain or swelling, chest pain or shortness of breath, new thigh swelling, numbness, or a leg turning cold.'],
      dispo: 'Discharge today or tomorrow.',
      stickies: [{ title: 'Discharge planning', body: 'Confirm walker delivered, enoxaparin teach-back done, follow-up booked, transport arranged.' }]
    });
    st.push({
      fromH: pod4, id: 'ready', label: 'Medically ready; discharge delayed',
      problem: `POD 4 or later ${sl} femoral intramedullary nail; stable, awaiting a safe discharge plan.`,
      subj: 'Pain 1-2/10. Walking in the hall with the walker. Frustrated by waiting.',
      assess: 'Recovered; any remaining stay is driven by disposition (equipment, home health or rehab placement, caregiver availability), not by acute illness.',
      plan: ['Case management finalizing home health or rehab acceptance.', 'Continue PT, enoxaparin and bowel regimen; watch for DVT, falls, constipation, skin breakdown and incision problems.'],
      nursing: ['Vital signs stable; incisions clean; calves soft.', 'Out of bed to chair and walks with walker; WBAT maintained.'],
      teach: ['Reinforce warning signs and enoxaparin teaching.'],
      dispo: 'Discharge when services and equipment are confirmed.'
    });
    return st;
  }
})();
