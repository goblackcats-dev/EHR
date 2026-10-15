/* Orthopedic / Trauma primary diagnoses (part 3): elective total hip arthroplasty, elective posterior lumbar fusion.
   Everything is in hours since admission (h = 0 is arrival). Uses NS.OG.atClock / NS.OG.clock from primary_ortho_gi.js. */
NS.PRIMARY = NS.PRIMARY || {};

// ================================================================================================
// TOTAL HIP ARTHROPLASTY (elective, hospital day 1 = day of surgery)
// ================================================================================================
(() => {
  const U = NS.util, C = NS.C, { atClock, clock } = NS.OG;
  // patients with these conditions are not low enough VTE risk for aspirin-only prophylaxis
  const VTE_RISK = ['afib', 'flutter', 'cad', 'hx_mi', 'pad', 'carotid_stenosis', 'aaa', 'hx_vte', 'thrombophilia', 'hx_stroke', 'hf', 'hfpef', 'obesity', 'sickle_cell', 'hemophilia', 'itp', 'polycythemia_vera', 'cirrhosis', 'hx_gib', 'pud', 'crohns', 'uc', 'breast_cancer', 'prostate_cancer', 'colon_cancer', 'lung_cancer', 'lymphoma_leukemia', 'multiple_myeloma', 'chronic_steroids', 'hx_tbi', 'rheumatoid_arthritis', 'lupus_sle'];

  NS.PRIMARY.tha = {
    key: 'tha', label: 'Total Hip Arthroplasty (Elective)', group: 'Surgical', cat: 'Orthopedic / Trauma', typicalLOS: [2, 3],
    desc: 'Elective total hip replacement for severe osteoarthritis (anterior or posterior approach by age parity; posterior = dislocation precautions). Day 1: day of surgery (pre-op, spinal + PENG/fascia iliaca block, TXA, OR, PACU, POD 0 same-day PT). Day 2: POD 1 PT, leg-length and neurovascular checks, Hgb drop, VTE prophylaxis. Day 3: POD 2 discharge home with home health or outpatient PT.',
    build(ctx) {
      const post = ctx.age % 2 === 1;                                              // posterior approach (odd age) vs direct anterior (even age)
      const side = Math.floor(ctx.age / 2) % 2 ? 'Left' : 'Right', sl = side.toLowerCase();
      const arrH = 3.5, orH = 6, dur = post ? 1.75 : 1.5, orEnd = orH + dur;     // pre-op holding 05:30, OR 08:00 at the default admit clock (02:00)
      const orTime = clock(ctx, orH), dietH = orEnd + 1.5, ptH = orEnd + 4.5, unitH = orEnd + 2;
      const pod1 = atClock(ctx, '05:00', orEnd + 6), pod2 = pod1 + 24, pod3 = pod1 + 48, pod4 = pod1 + 72;
      const lowDose = ctx.age >= 80 || ctx.weightKg < 55;
      const blockName = post ? 'Fascia iliaca compartment block' : 'PENG (pericapsular nerve group) block';
      const aspirinPpx = ctx.age < 70 && !(ctx.bmi >= 35) && ctx.renal === 'none' && ctx.hx.size <= 2 && !ctx.allergic('nsaid') && !ctx.allergic('aspirin') && !ctx.surg.has('valve_mech') && !VTE_RISK.some(k => ctx.has(k));
      const vteText = aspirinPpx ? 'aspirin 81 mg twice daily (low-risk regimen) for about 28 days' : 'enoxaparin 40 mg daily for 10-35 days';
      const hipPrec = post ? 'Posterior hip precautions: no hip flexion past 90 degrees, no crossing the legs or adducting past midline, no internal rotation; abduction wedge in bed' : 'Anterior approach: no formal flexion limits; avoid hyperextension and external rotation of the operative leg (do not step back or pivot on it) per surgeon';
      const morphine = Object.assign(C.opioidIV(ctx, { start: orEnd, stop: pod1 + 4, given: [orEnd + 0.4, orEnd + 1.3, orEnd + 9.5, pod1 - 1.5] }),
        { dose: '2 mg', info: 'HIGH-ALERT. Breakthrough severe pain only (not for pain that responds to oral medication). Assess pain, sedation (RASS), RR and SpO2 before and 15-30 minutes after. Hold for RR below 10 or oversedation. Typically stopped the morning after surgery.' });
      const oxy = Object.assign(C.opioidPO(ctx, { start: orEnd + 1.5, given: [orEnd + 4.2, orEnd + 9, orEnd + 14.5, pod1 + 5, pod1 + 11, pod1 + 17, pod1 + 23, pod2 + 7, pod2 + 14] }),
        { dose: lowDose ? '2.5 mg' : '5 mg', sips: true, by: 'surgeon', info: 'HIGH-ALERT. Give before PT when pain is 4 or higher. Assess pain and sedation before and 30-60 minutes after. Hold for RR below 10 or oversedation. Part of multimodal analgesia: use the lowest effective dose and wean to acetaminophen and celecoxib.' });
      const cefazolin = { key: 'cefazolin', name: 'cefazolin (ANCEF) IVPB', dose: ctx.weightKg >= 120 ? '3 g' : '2 g', route: 'IV', freq: 'q8h', stat: true, startH: orH - 0.5, stopH: orH + 20, volume: 100, cls: 'Cephalosporin antibiotic',
        info: 'Surgical prophylaxis: first dose within 60 minutes before incision, then every 8 hours for no more than 24 hours. Low cross-reactivity with penicillin; verify reaction history. Infuse over 30 minutes.', monitor: ['Temp', 'WBC', 'Cr'], indication: 'Surgical site infection prophylaxis (24 hours)', by: 'surgeon',
        avoid: ['cephalosporin', 'cefazolin'], alt: { key: 'vancomycin_ppx', name: 'vancomycin IVPB', dose: `${Math.round(ctx.weightKg * 15 / 250) * 250} mg`, freq: 'q12h', cls: 'Glycopeptide antibiotic', info: 'Used because of cephalosporin allergy. Start infusion 60-120 minutes before incision; infuse over at least 90 minutes. Watch for red man reaction.', monitor: ['Cr'], renal: { ckd3: { freq: 'q24h', note: 'Interval extended for reduced kidney function.' }, esrd: { freq: 'q24h', note: 'Interval extended for ESRD.' } } },
        renal: { ckd3: { freq: 'q12h', note: 'Interval extended for reduced kidney function.' }, esrd: { freq: 'q24h', note: 'Interval extended for ESRD.' } } };
      const celecoxib = { key: 'celecoxib', name: 'celecoxib (CELEBREX) capsule', dose: ctx.age >= 75 ? '100 mg' : '200 mg', route: 'Oral', freq: 'BID', stat: true, sips: true, startH: arrH + 0.3, cls: 'NSAID (COX-2 selective)', by: 'surgeon',
        info: 'Opioid-sparing multimodal analgesia; first dose before surgery with a sip of water. Give with food after surgery. Monitor creatinine, GI bleeding and blood pressure; additive bleeding risk with enoxaparin or aspirin. Contraindicated with sulfonamide or NSAID allergy.', hold: 'Hold and notify provider for rising creatinine, GI bleeding or heart failure symptoms.',
        monitor: ['Cr', 'Hgb', 'BP'], indication: 'Multimodal analgesia / reduce opioid use', avoid: ['nsaid', 'ibuprofen', 'sulfa', 'celecoxib'], renal: { ckd3: { avoid: true }, esrd: { avoid: true } } };
      const txa = (key, startH, which) => ({ key, name: 'tranexamic acid (CYKLOKAPRON) IVPB', dose: '1 g', route: 'IV', freq: 'once', stat: true, startH, volume: 100, cls: 'Antifibrinolytic', by: 'surgeon', when: !ctx.has('hx_vte') && !ctx.has('hx_mi') && !ctx.has('hx_stroke') && !ctx.has('thrombophilia'),
        info: `${which} Reduces blood loss and transfusion in arthroplasty. Infuse over 10-15 minutes (rapid infusion can cause hypotension). Contraindicated with active or prior thromboembolic disease; surgeon and anesthesia screen first. Dose reduced for kidney disease.`, monitor: ['BP', 'Hgb', 'Cr'], indication: 'Reduce surgical blood loss',
        renal: { ckd3: { dose: '500 mg', note: 'Dose reduced: tranexamic acid is cleared by the kidneys.' }, esrd: { avoid: true } } });
      const enox = { key: 'enoxaparin', name: 'enoxaparin (LOVENOX) injection', dose: '40 mg', route: 'Subcutaneous', freq: 'daily', anchorStart: true, cls: 'Anticoagulant (prophylaxis)', info: 'Monitor for bleeding, bruising, platelets and renal function. Never give if platelets below 50 or active bleeding. Use of aspirin is replaced with enoxaparin because of aspirin/NSAID allergy.', monitor: ['Hgb', 'Plt', 'Cr'], indication: 'VTE prophylaxis', by: 'surgeon', highAlert: true };
      const aspirin = { key: 'aspirin_vte', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'BID', sips: true, startH: orEnd + 10.5, cls: 'Antiplatelet (VTE prophylaxis)', by: 'surgeon',
        info: 'Low-risk VTE prophylaxis after hip arthroplasty (typically about 28 days). Give with food. Monitor for bleeding, GI upset and dark stools; additive bleeding risk with celecoxib. Contraindicated with aspirin/NSAID allergy.', hold: 'Hold and notify surgeon for active bleeding, black stools or platelets below 50.', monitor: ['Hgb', 'Plt'], indication: 'VTE prophylaxis after total hip arthroplasty (low-risk patient)',
        avoid: ['nsaid', 'aspirin'], alt: enox };
      const spec = {
        primaryTeam: 'surgeon', typicalLOS: [2, 3], fallRiskBoost: 1, medMonitoring: true, ...(aspirinPpx ? { noPpx: true } : {}),
        problem: { name: `Primary osteoarthritis of the ${sl} hip`, details: `Severe ${sl} hip osteoarthritis failing conservative treatment; elective ${sl} total hip arthroplasty (${post ? 'posterior' : 'direct anterior'} approach).` },
        chief: `Scheduled ${sl} total hip replacement for chronic hip and groin pain`,
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with years of progressive ${sl} hip and groin pain from osteoarthritis, worse with walking, stairs, putting on shoes and socks, and getting out of a car; now with night pain and a limp, limited to short distances with a cane. Conservative treatment has failed: weight management, activity modification, acetaminophen and NSAIDs, physical therapy and an intra-articular corticosteroid injection about 5 months ago. Radiographs show bone-on-bone ${sl} hip arthritis with joint space loss, osteophytes and subchondral cysts. Completed pre-admission testing (labs, ECG, MRSA screen), anesthesia and primary care clearance. Arrives the morning of surgery for elective ${sl} total hip arthroplasty. NPO since midnight; took only approved morning medications with a sip of water. No fever, cough, urinary symptoms, dental infection or skin breakdown near the hip.`,
        ros: 'Positive for chronic hip and groin pain, stiffness after rest, limp, and difficulty with stairs, shoes and socks. Negative for fever, chills, chest pain, dyspnea, calf pain or swelling, dysuria, new rash or skin lesions near the hip, nausea, or recent dental work or infection.',
        keyLabs: ['Hemoglobin', 'WBC', 'Platelets', 'Sodium', 'Potassium', 'Creatinine', 'Glucose', 'INR'],
        isolation: 'None', famHxExtra: 'Parent had hip replacement. No known family history of bleeding disorders, clotting disorders, or problems with anesthesia.',
        flags: { npo: [[0, dietH]], preop: [[0, orH]], surgeryWindow: [[0, orH + 48]], postop: [[orEnd, 9999]] },
        ppxStartH: orEnd + 12,
        vitals: [
          { h: 0, temp: 98.1, hr: 74, sbp: 138, dbp: 82, rr: 16, spo2: 97, pain: 5, o2: 'Room air' },
          { h: arrH, temp: 98.2, hr: 78, sbp: 142, dbp: 84, rr: 16, spo2: 97, pain: 5 },
          { h: orH - 0.5, temp: 98.2, hr: 76, sbp: 138, dbp: 80, rr: 16, spo2: 98, pain: 2 },
          { h: orEnd, temp: 97.6, hr: 70, sbp: 106, dbp: 60, rr: 14, spo2: 96, pain: 1, o2: '2 L nasal cannula' },
          { h: orEnd + 1.5, temp: 97.9, hr: 74, sbp: 116, dbp: 66, rr: 14, spo2: 96, pain: 2 },
          { h: unitH + 1, temp: 98.4, hr: 78, sbp: 122, dbp: 72, rr: 16, spo2: 95, pain: 3, o2: 'Room air' },
          { h: orEnd + 6, temp: 99.0, hr: 86, sbp: 126, dbp: 74, rr: 16, spo2: 95, pain: 5 },
          { h: orEnd + 12, temp: 99.2, hr: 86, sbp: 126, dbp: 76, rr: 16, spo2: 95, pain: 5 },
          { h: pod1, temp: 99.4, hr: 84, sbp: 124, dbp: 74, rr: 16, spo2: 95, pain: 5 },
          { h: pod1 + 8, temp: 99.6, hr: 88, sbp: 126, dbp: 74, rr: 16, spo2: 95, pain: 4 },
          { h: pod1 + 20, temp: 99.2, hr: 84, sbp: 128, dbp: 76, rr: 16, spo2: 96, pain: 4 },
          { h: pod2 + 6, temp: 98.8, hr: 80, sbp: 130, dbp: 76, rr: 16, spo2: 96, pain: 3 },
          { h: pod3 + 6, temp: 98.4, hr: 76, sbp: 130, dbp: 78, rr: 16, spo2: 97, pain: 3 },
          { h: pod4 + 6, temp: 98.2, hr: 74, sbp: 130, dbp: 78, rr: 16, spo2: 97, pain: 2 }
        ],
        labs: {
          Hemoglobin: { add: [[0, 0], [orEnd, -0.7], [pod1, -2.2], [pod2, -2.8], [pod3, -2.7], [pod4 + 24, -2.4]] },
          WBC: { add: [[0, 0], [orEnd + 4, 2.5], [pod1, 3.4], [pod2, 2.0], [pod3, 0.8], [pod4, 0]] },
          Platelets: { add: [[0, 0], [pod1, -35], [pod2, -50], [pod3, -35], [pod4 + 24, -10]] },
          Sodium: { add: [[0, 0], [pod1, -1], [pod3, 0]] },
          Potassium: { add: [[0, 0], [pod1, 0.1]] },
          Creatinine: { add: [[0, 0], [pod1, 0.1], [pod2, 0.08], [pod3, 0.03]] },
          BUN: { add: [[0, 0], [pod1, 3], [pod3, 1]] },
          Glucose: { add: [[0, 4], [orEnd + 4, 28], [pod1, 18], [pod2, 10], [pod3, 6]] },
          Calcium: { add: [[0, 0], [pod1, -0.4], [pod3, -0.3]] },
          INR: { add: [[0, 0]] }
        },
        labSchedule: [
          { h: arrH + 0.3, codes: ['PT', 'INR'] }
        ],
        quals: [
          { h: arrH + 0.3, category: 'Blood Bank', code: 'Type and screen', value: 'A positive; antibody screen negative', specimen: 'Blood' },
          { h: arrH + 0.3, category: 'Microbiology', code: 'MRSA nasal screen (PCR)', value: 'Negative', reference: 'Negative', specimen: 'Nares' },
          ...(ctx.female && ctx.age < 55 ? [{ h: arrH + 0.3, category: 'Other', code: 'Urine hCG (pregnancy test)', value: 'Negative', reference: 'Negative', specimen: 'Urine' }] : [])
        ],
        events: [
          { type: 'transfer', h: arrH, label: 'Arrived to the pre-operative holding area', text: 'Arrived from home for scheduled surgery; identification, consent, NPO status and surgical site verified.' },
          { type: 'consult', h: arrH + 0.7, service: 'Anesthesiology (pre-anesthesia evaluation)', author: 'surgeon', orderedBy: 'surgeon', reason: `Anesthesia plan for ${sl} total hip arthroplasty`, label: 'Pre-anesthesia evaluation',
            recommendation: `ASA class II-III; airway reassuring. Plan: spinal anesthesia with light sedation plus ${post ? 'fascia iliaca' : 'PENG'} nerve block for post-operative analgesia; tranexamic acid before incision and at closure (no history of clot or stroke). NPO status confirmed. Hold diuretics and ACE inhibitor/ARB the morning of surgery; continue beta blocker. Spinal and nerve block risks reviewed and consent obtained. Post-operative nausea prophylaxis ordered.` },
          { type: 'procedure', h: arrH + 1.3, duration: 0.3, name: blockName, label: `Ultrasound-guided ${blockName.toLowerCase()}, ${sl} hip`, by: 'surgeon', service: 'Anesthesiology', indication: 'Post-operative analgesia (opioid reduction)',
            findings: post
              ? `Ultrasound-guided fascia iliaca block with 30 mL of ropivacaine 0.2% (below maximum dose for weight) injected deep to the fascia iliaca; good spread seen. No paresthesia or vascular puncture. Expect numbness of the anterior and lateral thigh for 8-12 hours; quadriceps weakness is possible, so fall risk is high. Monitor for local anesthetic toxicity.`
              : `Ultrasound-guided PENG block with 20 mL of ropivacaine 0.5% (below maximum dose for weight) deposited between the psoas tendon and the superior pubic ramus; good spread seen. No paresthesia or vascular puncture. Motor-sparing: expect anterior hip and groin numbness for 8-14 hours while quadriceps strength is largely preserved; fall risk remains. Monitor for local anesthetic toxicity.` },
          { type: 'surgery', h: orH, duration: dur, name: `${side} total hip arthroplasty (${post ? 'posterior' : 'direct anterior'} approach)`, label: `${side} total hip arthroplasty`, anesthesia: `Spinal anesthesia with light sedation and ${post ? 'fascia iliaca' : 'PENG'} block`, orderH: 0.5,
            indication: `Severe ${sl} hip osteoarthritis`,
            findings: 'Eburnated femoral head with flattening, large osteophytes, and loss of articular cartilage. Good bone stock. Components stable; hip stable through range of motion without impingement; leg lengths equal on fluoroscopy / trial reduction.',
            procedure: post
              ? `Lateral decubitus position, posterior approach. Tranexamic acid given before incision. Short external rotators and posterior capsule released and tagged; femoral head dislocated and removed; acetabulum reamed and press-fit cup with highly cross-linked polyethylene liner placed; femoral canal broached and uncemented stem with ceramic head placed. Leg length and stability checked; capsule and external rotators repaired through bone. Wound irrigated and closed in layers over no drain. Occlusive dressing applied; abduction wedge placed between the legs.`
              : `Supine on the operating table (fluoroscopy), direct anterior approach through the interval between tensor fascia lata and sartorius. Tranexamic acid given before incision. Femoral neck cut, head removed, acetabulum reamed and press-fit cup with highly cross-linked polyethylene liner placed under fluoroscopy; femur elevated and broached, uncemented stem with ceramic head placed. Leg length and offset checked on fluoroscopy. Wound irrigated and closed in layers over no drain. Occlusive silver dressing applied.`,
            ebl: post ? '300 mL' : '250 mL', fluids: "1,000 mL lactated Ringer's", specimens: 'Femoral head to pathology', complications: 'None', disposition: 'PACU, then orthopedic unit' },
          { type: 'transfer', h: unitH, label: 'Transferred from PACU to the orthopedic unit', text: `Awake after surgery, stable; transferred from PACU to the orthopedic unit with a dressing over the ${sl} hip and a nerve block in place.` },
          { type: 'imaging', h: orEnd + 3, study: `X-ray AP pelvis and ${sl} hip, post-operative`, modality: 'X-ray', indication: 'Post-operative component position and leg-length check',
            findings: `Right-sided uncemented total hip arthroplasty components are in satisfactory alignment; head concentrically reduced with no dislocation or periprosthetic fracture. Leg lengths equal within 5 mm. Expected soft tissue gas and swelling.`.replace('Right-sided', `${side}-sided`),
            impression: 'Satisfactory total hip arthroplasty; no dislocation.' }
        ],
        meds: [
          C.lrMaintenance({ start: arrH + 0.3, stop: orEnd + 6, rate: 100 }),
          Object.assign(C.acetaminophenPO({ start: arrH + 0.3 }), { dose: lowDose ? '650 mg' : '1,000 mg', freq: lowDose ? 'q6h' : 'q8h', stat: true, sips: true, by: 'surgeon', info: 'Scheduled (not PRN) base of multimodal analgesia; first dose before surgery with a sip of water. Maximum 3 g per 24 hours from all sources.' }),
          celecoxib,
          cefazolin,
          txa('txa', orH - 0.2, 'Dose 1 of 2: give before skin incision.'),
          txa('txa_2', orEnd - 0.15, 'Dose 2 of 2: give at wound closure.'),
          morphine, oxy,
          Object.assign(C.ondansetron({ start: orEnd, given: [orEnd + 1, orEnd + 9] }), { info: 'Post-operative nausea after spinal/sedation. Check QTc before repeated dosing in an older adult. Reassess nausea in 30 minutes.' }),
          { key: 'peg3350', name: 'polyethylene glycol (MIRALAX) powder', dose: '17 g', route: 'Oral', freq: 'daily', prn: true, prnInterval: 'Once daily', prnFor: 'no bowel movement in 24 hours', cls: 'Osmotic laxative', info: 'Mix in 4-8 oz of fluid. Hold for loose stools. Goal: bowel movement by post-op day 2-3.', indication: 'Opioid and immobility constipation prevention', startH: orEnd + 8, prnGiven: [], by: 'surgeon' },
          ...(aspirinPpx ? [aspirin] : [])
        ],
        orders: [
          C.diet('NPO', 0, dietH, 'NPO after midnight for surgery; clear liquids until 2 hours before arrival were allowed per the pre-admission instructions. Sips of water with approved morning medications.'),
          C.diet('Regular diet', dietH, undefined, 'Advance as tolerated once awake and not nauseated. Heart-healthy; encourage protein and fluids. Sit upright to eat.'),
          C.activity('Up with assistance and fall precautions', 0, orH, 'Ambulatory before surgery; fall precautions after sedation or premedication.'),
          C.activity('Bed rest until spinal anesthesia wears off, then up with assistance', orEnd, ptH - 0.5, post ? `Head of bed up to 30-45 degrees (keep the hip at or below 90 degrees of flexion). Abduction wedge or pillow between the legs while in bed; turn onto the back or the non-operative side only with the wedge in place. Check sensation and movement of both legs every hour until the spinal resolves.` : `Head of bed up to 30 degrees until the spinal resolves; check sensation and movement of both legs every hour. No positioning restrictions for the anterior approach; avoid forcing the operative leg into extension or external rotation.`),
          C.activity(`Weight bearing as tolerated ${sl} leg with rolling walker, up with assistance`, ptH - 0.5, undefined, `Out of bed to chair for meals with 1 staff and gait belt; progress with PT. ${post ? 'Use a raised chair and raised toilet seat; avoid low seats.' : 'Raised chair and toilet seat are helpful but not required.'} Nerve block can cause numbness or quadriceps weakness: stand with assistance only.`),
          { name: 'Pre-operative medication reconciliation and hold instructions', category: 'Nursing', frequency: 'Once', startH: arrH, completeH: orH - 0.3, instructions: 'Verify last dose and time of anticoagulants (apixaban, warfarin, rivaroxaban), antiplatelets, NSAIDs, GLP-1 agonists, SGLT2 inhibitors, diabetic medications, and herbal supplements. Confirm morning-of-surgery medications taken with a sip of water. Report any held-medication discrepancy to the surgeon and anesthesia.' },
          { name: 'Pre-operative skin preparation (chlorhexidine)', category: 'Nursing', frequency: 'Once', startH: arrH, completeH: orH - 0.5, instructions: `Chlorhexidine cloths to the ${sl} hip and body per protocol; do not shave the surgical site (clip only if needed). Confirm no open skin lesions, rash or groin skin-fold infection near the hip.` },
          { name: 'Pre-operative checklist, consent and site verification', category: 'Nursing', frequency: 'Once', startH: arrH, completeH: orH - 0.3, instructions: `Verify consent, ID and allergy bands, ${sl} hip marked by the surgeon, NPO status, last void, dentures/jewelry removed, cefazolin and tranexamic acid ready for infusion before incision.` },
          { name: 'Type and screen', category: 'Laboratory', frequency: 'Once', startH: arrH - 0.5, completeH: arrH + 0.4, instructions: 'Blood bank specimen; armband required.' },
          { name: `Neurovascular checks ${sl} leg`, category: 'Nursing', frequency: 'Every hour x4, then every 4 hours', startH: orEnd, instructions: `Check color, warmth, capillary refill, dorsalis pedis/posterior tibial pulses, sensation and movement of toes and ankle (dorsiflexion = peroneal nerve, plantar flexion = tibial nerve; sciatic nerve injury risk is highest with the posterior approach). ${post ? '' : 'Anterior approach: also check quadriceps strength (femoral nerve) and expect numbness over the lateral thigh (lateral femoral cutaneous nerve). '}Compare with the other leg. Notify the surgeon for pallor, coolness, loss of pulse, new numbness, foot drop, or severe pain unrelieved by medication.`, nursing: ['Expect numbness of the anterior or lateral thigh from the nerve block for 8-14 hours.', 'Tense thigh swelling, severe pain with passive toe movement, or a cool pale foot may be hematoma, compartment syndrome or arterial injury: call immediately.'] },
          { name: 'Leg length, alignment and dislocation assessment', category: 'Nursing', frequency: 'Every 4 hours and with each transfer', startH: orEnd, instructions: `Compare the position of the ${sl} leg with the other: the operative leg may feel slightly longer (expected, usually under 10 mm). Notify the surgeon immediately for a shortened leg, a leg turned inward or outward, sudden severe hip or groin pain, a pop or clunk, a visible deformity, or inability to move or bear weight (possible dislocation).`, nursing: ['Dislocation is most likely in the first 6 weeks, especially with the posterior approach and low chairs, deep bending or crossing the legs.', 'Do not attempt to move or reduce the leg; keep the patient still and call the surgeon.'] },
          { name: post ? 'Posterior hip dislocation precautions' : 'Anterior approach hip activity precautions (per surgeon)', category: 'Precautions', frequency: 'Continuous', startH: orEnd, instructions: post ? `No hip flexion past 90 degrees (do not bend forward at the waist or sit in low chairs), no crossing the legs or knees, no adducting past midline, no internal rotation (toes pointing inward) of the ${sl} leg. Abduction wedge or pillow between the legs in bed and when turning; raised toilet seat; sleep on the back; dress the operative leg first with a reacher and sock aid. Typically 6-12 weeks per surgeon. Post a sign at the bedside.` : `Anterior approach: usually no flexion limits. Avoid hyperextension and external rotation of the ${sl} leg (do not step backward with it, bridge or pivot on it) for the first weeks per surgeon. Post any surgeon-specific precautions at the bedside.`, nursing: post ? ['Teach the patient and family; reinforce before every transfer and with each meal and toileting.', 'Low chairs, low toilet seats and bending to the floor are the most common causes of posterior dislocation.'] : ['Teach-back on avoiding extension and external rotation; confirm the surgeon\'s specific limits and weight-bearing status.'] },
          { name: 'Surgical dressing and incision assessment', category: 'Nursing', frequency: 'Every shift', startH: orEnd, instructions: `Assess the occlusive dressing over the ${post ? 'posterolateral' : 'anterior'} hip incision for strikethrough (mark and time any drainage), warmth, swelling and tightness; keep intact unless saturated or per surgeon. Expect bruising of the thigh and groin.`, nursing: ['Report drainage that soaks through the dressing, fever above 101 F, spreading redness, or foul odor.', 'Do not remove skin staples/closure strips; surgeon removes them at the 2-week visit.'] },
          { name: 'Cryotherapy (ice / cold therapy)', category: 'Nursing', frequency: '20 minutes on, 40 minutes off while awake', startH: orEnd + 2, instructions: `Apply cold therapy over the dressing; place a cloth barrier between ice and skin.${post ? ' Keep the abduction wedge in place while the leg is elevated.' : ''}`, nursing: ['Check skin under the ice pack; the nerve block reduces cold sensation, so frostbite risk is higher.'] },
          { name: 'Sequential compression devices', category: 'Nursing', frequency: 'Continuous when in bed', startH: arrH, instructions: 'Apply to both legs (or non-operative leg only if the operative leg dressing/swelling does not allow) until fully ambulatory. Remove for walking and skin checks every shift.' },
          { name: 'VTE prevention: early mobilization and chemoprophylaxis', category: 'Nursing', frequency: 'Every shift', startH: orEnd, instructions: `Ambulate at least 3 times a day starting POD 0; ankle pumps hourly while awake. ${aspirinPpx ? 'Aspirin 81 mg twice daily starts the evening of surgery (low-risk regimen).' : 'First enoxaparin dose 12 hours after surgery (timed after the spinal).'} Assess calves for pain, warmth, swelling or tenderness.`, nursing: [`Prophylaxis usually continues for 10-35 days after surgery (${vteText}).`, 'Report unilateral calf swelling/pain, sudden shortness of breath, chest pain or tachycardia immediately (DVT/PE).'] },
          C.incentive(unitH, undefined),
          { name: 'Urinary retention monitoring after spinal anesthesia', category: 'Nursing', frequency: 'Every shift', startH: orEnd, instructions: 'Patient should void within 6-8 hours after surgery. Bladder scan if no void in 6 hours, suprapubic fullness or discomfort. Straight catheter per protocol for volume above 400 mL. No indwelling catheter is placed routinely.', nursing: ['Opioids and spinal anesthesia increase retention risk, especially in men with an enlarged prostate.'] },
          { name: 'Fall prevention after nerve block and opioids', category: 'Precautions', frequency: 'Continuous', startH: orEnd, instructions: 'High fall risk: bed alarm, non-skid socks, gait belt, assist x1 for all transfers until block resolved and PT clears. Never leave on the commode alone. Keep call light and walker within reach.', nursing: ['A numb or weak leg can buckle: do not let the patient stand alone for the first 12-24 hours.'] },
          { name: 'Anemia watch: transfusion threshold Hgb below 7 g/dL or symptomatic', category: 'Nursing', frequency: 'Per lab result', startH: orEnd, instructions: 'Notify the surgeon for Hgb below 8 g/dL, symptomatic tachycardia, dizziness, pallor, or hypotension. Restrictive transfusion strategy (Hgb below 7 g/dL, or 8 g/dL with cardiac disease or symptoms). Daily CBC on POD 1.', nursing: ['Expect a Hgb drop of about 2-3 g/dL below baseline by post-op day 1-2 even with tranexamic acid.', 'Check orthostatic BP and HR before the first stand if Hgb is falling.'] },
          { name: 'Physical therapy evaluation and treatment', category: 'Consult / Therapy', frequency: 'Twice daily from POD 0', startH: ptH - 1, instructions: `Same-day mobilization: stand and walk with rolling walker, WBAT ${sl} leg; gait, transfers, hip strengthening, stair training before discharge. ${post ? 'Teach posterior hip precautions with every task.' : 'Teach avoidance of extension and external rotation.'}`, by: 'surgeon' },
          { name: 'Occupational therapy evaluation and treatment', category: 'Consult / Therapy', frequency: 'Daily from POD 1', startH: orEnd + 12, instructions: `ADL retraining, bathing and toileting with adaptive equipment (${post ? 'reacher, sock aid, long-handled shoe horn, raised toilet seat or 3-in-1 commode' : 'raised toilet seat, reacher'}); home safety review.`, by: 'surgeon' },
          { name: 'Case management consult: discharge planning', category: 'Consult / Therapy', frequency: 'Once', startH: arrH + 1, instructions: 'Confirm home setup (stairs, support person for first 48 hours), home health PT vs outpatient PT vs short-term skilled nursing facility, durable medical equipment (rolling walker, raised toilet seat/commode, reacher) and follow-up.' }
        ],
        devices: [
          { deviceType: 'IV', type: 'Peripheral IV', location: 'Right forearm', siteMarker: 'rightForearm', gauge: '20 gauge', placeH: arrH + 0.2, infusing: "Lactated Ringer's", status: 'Infusing', assess: 'site clean, dry, intact; flushes easily' }
        ],
        assessments: [
          { fromH: 0, items: [['Musculoskeletal / Mobility', 'Mobility', `Ambulates with a limp favoring the ${sl} leg using a cane for distances`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `${side} hip with decreased range of motion (flexion about 80 degrees, limited internal rotation), pain at the end range, no warmth or erythema; foot warm, pedal pulses palpable, capillary refill under 3 seconds, sensation and toe movement intact`], ['Pain', 'Pain Location', `${side} groin and hip, chronic aching, worse with weight bearing and stairs`], ['Skin', 'Skin', `Warm, dry; ${sl} hip and groin skin intact without rash, abrasions or lesions; surgical site marked`], ['Skin', 'Braden Score', '22'], ['Safety', 'Delirium Screen (CAM)', 'Negative'], ['Respiratory', 'Breath Sounds', 'Clear bilaterally'], ['Respiratory', 'Incentive Spirometer', '1,750 mL (pre-operative teaching)']] },
          { fromH: orEnd, items: [['Skin', 'Surgical Incisions', `${side} ${post ? 'posterolateral' : 'anterior'} hip incision covered by occlusive dressing, clean, dry, intact; no drain`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Spinal anesthesia wearing off: decreased sensation and movement of both legs, improving; toes warm, pulses palpable, capillary refill under 3 seconds; ${sl} leg length and rotation equal to the other leg${post ? '; abduction wedge in place between the legs' : ''}`], ['Musculoskeletal / Mobility', 'Mobility', post ? 'Bed rest until spinal resolves; posterior hip precautions in effect' : 'Bed rest until spinal resolves'], ['GU', 'Urinary Elimination', 'No indwelling catheter; has not voided since surgery'], ['Respiratory', 'Breath Sounds', 'Clear, diminished at bases'], ['Pain', 'Pain Location', `${side} hip incision, 2/10 at rest (block and spinal)`], ['Safety', 'Fall Precautions', 'High risk: bed alarm on, call light in reach, non-skid socks, assist for all transfers'], ['GI', 'Nausea / Vomiting', 'Mild nausea after spinal; relieved with ondansetron']] },
          { fromH: ptH, items: [['Musculoskeletal / Mobility', 'Mobility', `Stood and walked 20-30 feet with rolling walker and assist x1 with PT; WBAT ${sl} leg; tolerates sitting at the edge of the bed${post ? '; hip precautions reviewed' : ''}`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Spinal resolved; moves toes and ankle, can lift leg off bed; numbness over the ${post ? 'anterior and lateral thigh' : 'anterior hip and groin'} (nerve block); leg length equal, no rotation; foot warm, pulses palpable, capillary refill under 3 seconds; thigh swollen, calf soft and non-tender`], ['Pain', 'Pain Location', `${side} hip incision, aching, 4-5/10 with movement; improved after oxycodone`], ['GU', 'Urinary Elimination', 'Voided 300 mL; no retention'], ['Respiratory', 'Incentive Spirometer', '1,250 mL'], ['Skin', 'Braden Score', '20']] },
          { fromH: pod1 - 1, items: [['GI', 'Nausea / Vomiting', 'None'], ['GI', 'Last BM / Flatus', 'No BM since admission; passing flatus'], ['Cardiac', 'Edema', `${side} thigh and groin swollen with early ecchymosis (expected); calf soft, non-tender`], ['Respiratory', 'Incentive Spirometer', '1,500 mL'], ['Pain', 'Pain Location', `${side} hip incision, aching, 4/10 at rest; block has worn off`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Spinal and nerve block resolved; full sensation, moves toes and ankle, lifts leg off bed; leg length and rotation unchanged; thigh swollen with expected bruising; foot warm, pulses palpable, capillary refill under 3 seconds; calf soft, non-tender`]] },
          { fromH: pod1 + 2, items: [['Musculoskeletal / Mobility', 'Mobility', `Walked 60-100 feet with rolling walker and contact guard assist; ${post ? 'follows posterior hip precautions with cueing; ' : ''}out of bed to chair for meals`], ['Skin', 'Surgical Incisions', `${side} ${post ? 'posterolateral' : 'anterior'} hip incision with dressing clean, dry, intact; small amount of old drainage on dressing, ecchymosis tracking down the thigh`], ['Safety', 'Delirium Screen (CAM)', 'Negative']] },
          { fromH: pod2 - 2, items: [['Musculoskeletal / Mobility', 'Mobility', `Walking 150 feet with rolling walker and standby assist; practiced stairs with PT${post ? '; independent with hip precautions and adaptive equipment' : ''}`], ['Pain', 'Pain Location', `${side} hip, aching, 3/10 on acetaminophen, celecoxib and occasional oxycodone`], ['GI', 'Last BM / Flatus', 'No BM for 2 days; Miralax given'], ['Respiratory', 'Incentive Spirometer', '1,750 mL'], ['Cardiac', 'Edema', `${side} thigh swelling (1-2+) with ecchymosis; improving with ice and elevation; calf soft and non-tender`], ['Skin', 'Surgical Incisions', `${side} ${post ? 'posterolateral' : 'anterior'} hip incision closed, edges approximated, minimal serosanguineous drainage on dressing, no erythema or warmth beyond the expected; ecchymosis down the thigh`]] },
          { fromH: pod3 - 2, items: [['Musculoskeletal / Mobility', 'Mobility', 'Independent with rolling walker including stairs; transfers independently'], ['GI', 'Last BM / Flatus', 'Moderate BM this morning'], ['Pain', 'Pain Location', `${side} hip, 2-3/10`]] }
        ],
        io: [
          { fromH: 0, po: 60, urine: 250 },
          { fromH: orH, po: 0, urine: 0 },
          { fromH: orEnd, po: 120, urine: 100 },
          { fromH: orEnd + 6, po: 360, urine: 400 },
          { fromH: pod1, po: 420, urine: 380 },
          { fromH: pod2, po: 540, urine: 420 }
        ],
        therapy: {
          fromH: ptH,
          assist: h => (h < ptH + 14 ? 'assist of one with gait belt' : h < ptH + 38 ? 'contact guard assist' : 'supervision / standby assist'),
          gait: h => (h < ptH + 14 ? '20-30 feet with rolling walker' : h < ptH + 38 ? '60-100 feet with rolling walker' : '150 feet with rolling walker; stairs with rail and supervision'),
          rec: `Home with home health or outpatient PT if a responsible adult is available for the first days; short-term rehab at a skilled nursing facility if the patient lives alone, has multiple stairs, or cannot transfer safely. WBAT ${sl} leg, rolling walker${post ? ', posterior hip precautions (raised toilet seat/commode, reacher, sock aid) for 6-12 weeks' : ', avoid hyperextension and external rotation per surgeon'}.`
        },
        discharge: { dispo: () => ((ctx.social && /alone/i.test(ctx.social.living || '')) ? 'Home with home health PT and a family caregiver for the first days; skilled nursing facility if no safe home plan' : 'Home with home health or outpatient PT, rolling walker and a family caregiver (skilled nursing facility only if needed)'), estimate: 'post-operative day 1-2 (hospital day 2-3) once pain is controlled on oral medication, walking 100+ feet with a walker, stairs completed, voiding and Hgb stable' },
        stages: thaStages(ctx, { post, side, sl, hipPrec, vteText, aspirinPpx, orH, orEnd, orTime, unitH, ptH, pod1, pod2, pod3, pod4 }),
        stickies: [
          { title: 'Fall risk after block / opioids', body: 'Spinal and nerve block can cause leg numbness and weakness. Assist x1 with gait belt and walker for every transfer; bed alarm on.' },
          { title: post ? 'Posterior hip precautions' : 'Anterior hip: leg position', body: post ? 'No hip flexion past 90 degrees, no crossing legs, no internal rotation. Abduction wedge in bed, raised toilet seat, no low chairs. Report a shortened or rotated leg or sudden severe hip pain.' : 'Avoid hyperextension and external rotation of the operative leg per surgeon. Check leg length and rotation each assessment; report a shortened or rotated leg or sudden severe hip pain.', fromH: orEnd },
          { title: 'VTE prevention and anemia', body: `${aspirinPpx ? 'Aspirin 81 mg twice daily' : 'Enoxaparin first dose 12 hours after surgery'}; SCDs; ankle pumps; walk 3+ times daily. Hgb expected to fall 2-3 g/dL. Report calf pain/swelling, dyspnea or chest pain immediately.`, fromH: orEnd }
        ],
        objectives: ['Prepare a patient for elective total hip arthroplasty: pre-operative checklist, medication holds, NPO, antibiotic and tranexamic acid timing, consent and site verification.', `Implement post-operative THA care: neurovascular and leg-length checks, incision assessment, ${post ? 'posterior hip dislocation precautions' : 'anterior approach positioning'}, nerve block fall precautions and multimodal analgesia.`, 'Prevent and recognize complications: dislocation, DVT/PE, post-operative anemia, urinary retention, constipation, nerve injury and surgical-site infection.', 'Coordinate early mobilization with PT/OT, VTE prophylaxis teaching and discharge planning (home health vs SNF, walker, adaptive equipment).']
      };
      return spec;
    }
  };

  function thaStages(ctx, p) {
    const { post, side, sl, hipPrec, vteText, aspirinPpx, orH, orEnd, orTime, unitH, ptH, pod1, pod2, pod3, pod4 } = p;
    const ap = post ? 'posterior' : 'direct anterior', st = [];
    st.push({
      fromH: 0, id: 'preop', label: `Pre-operative: ${sl} total hip arthroplasty this morning`,
      problem: `Severe ${sl} hip osteoarthritis; scheduled ${sl} total hip arthroplasty (${ap} approach) today (about ${orTime}).`,
      subj: `Chronic ${sl} hip and groin pain about 5/10, worse with weight bearing. NPO since midnight; took approved morning medications with a sip of water. A little anxious about the surgery and pain afterward. No fever, cough, urinary symptoms or skin lesions near the hip.`,
      assess: 'Elective total hip arthroplasty candidate, medically optimized; vital signs stable; consent and site marking in progress.',
      plan: [`Spinal anesthesia with ${post ? 'fascia iliaca' : 'PENG'} block; cefazolin within 60 minutes before incision; tranexamic acid before incision and at closure.`, 'Scheduled acetaminophen and celecoxib started pre-operatively as part of multimodal analgesia.', 'Type and screen, MRSA screen and pre-operative labs reviewed; hold anticoagulants, GLP-1/SGLT2 medications as directed.', `IV fluids; SCDs; VTE prophylaxis (${vteText}); PT the day of surgery.`],
      nursing: ['Identification, allergy band, consent and surgical site (marked by surgeon) verified.', 'NPO status confirmed; last intake documented; morning medications reconciled.', 'IV started; chlorhexidine skin prep done; vital signs stable.', `Pre-operative teaching: incentive spirometer, ankle pumps, walker use, ${post ? 'posterior hip precautions, ' : ''}pain scale, expected sensations after the nerve block.`],
      teach: [post ? 'Reviewed what to expect in recovery (numb leg after spinal, ice, dressing), the posterior hip precautions, incentive spirometer, call before getting up, and early walking.' : 'Reviewed what to expect in recovery (numb leg after spinal, ice, dressing), incentive spirometer, calling before getting up, and early walking.'],
      dispo: 'Anticipate 1-2 nights, then home with home health or outpatient PT.',
      objectives: ['Complete the pre-operative nursing checklist and medication hold review for a total hip arthroplasty patient.'],
      stickies: [{ title: 'To OR', body: `OR about ${orTime}: NPO, cefazolin 30-60 minutes before incision, consent, ${sl} hip marked, block placed, remove jewelry/dentures.` }]
    });
    st.push({
      fromH: orEnd, id: 'postop0', label: 'Post-operative day 0: PACU and first day on the unit',
      problem: `Status post ${sl} total hip arthroplasty (${ap} approach), POD 0, spinal anesthesia and ${post ? 'fascia iliaca' : 'PENG'} block.`,
      subj: 'Awake in recovery; legs heavy and tingling as the spinal wears off. Hip pain 2-4/10 so far, expected to increase as the block wears off. Mild nausea. Hungry.',
      assess: `POD 0 ${sl} THA; hemodynamically stable after mild spinal-related low blood pressure; expected blood loss; neurovascularly intact; leg length and rotation equal to the other leg.`,
      plan: ['Cefazolin x 24 hours; scheduled acetaminophen and celecoxib, oral oxycodone PRN, IV morphine only for severe breakthrough pain.', `${aspirinPpx ? 'Aspirin 81 mg twice daily starting tonight' : 'Enoxaparin first dose 12 hours after surgery'}; SCDs; ankle pumps; walk with PT today.`, `${hipPrec}.`, 'Regular diet; stop IV fluids once drinking well; bladder scan if no void within 6 hours.', 'Bowel regimen with opioids; incentive spirometry hourly while awake; Hgb in the morning.'],
      nursing: ['Dressing clean, dry, intact; foot warm with palpable pulses and intact sensation as spinal resolves.', 'Leg length and rotation checked with each assessment; ice applied.', post ? 'Abduction wedge between the legs; no flexion past 90 degrees; raised chair and toilet seat.' : 'Avoid hyperextension and external rotation; assist with all transfers.', 'Voided after the spinal wore off; no catheter.', 'Up with PT and rolling walker with assist of one; fall precautions and bed alarm on.'],
      teach: ['Weight bearing as tolerated with the walker, calling before getting up, ankle pumps and incentive spirometer, and pain medication timing before PT.', post ? 'Posterior hip precautions: no bending past 90 degrees, no crossing legs, no turning the foot inward.' : 'Avoid stepping backward or twisting on the operative leg.'],
      dispo: 'Expect discharge home on POD 1-2.',
      objectives: ['Perform neurovascular, leg-length, incision and pain assessments and fall-prevention measures after a spinal and nerve block.']
    });
    st.push({
      fromH: pod1, id: 'pod1', label: 'Post-operative day 1: working with therapy',
      problem: `POD 1 ${sl} total hip arthroplasty; thigh swelling and bruising; therapy twice daily.`,
      subj: 'Hip aching 4-5/10 at rest and 6/10 with therapy after the block wore off overnight. Slept poorly. Passed gas but no bowel movement. Wants to go home today.',
      assess: 'Recovering as expected. Hgb about 2-3 g/dL below baseline without symptoms; temperature up to 99.6 F is common after surgery; incision clean; leg length and rotation unchanged; no signs of dislocation, DVT, infection, or retention.',
      plan: ['IV morphine stopped; oxycodone only for pain above 4 before therapy; continue acetaminophen and celecoxib.', `PT twice a day: walking, stairs practice, ${post ? 'posterior hip precautions' : 'transfer and gait training'}; ice and elevation.`, 'Daily CBC/BMP; transfuse only for Hgb below 7-8 or symptoms; orthostatic vitals before first stand.', `Continue VTE prophylaxis (${vteText}) and SCDs; bowel regimen (senna-docusate scheduled, Miralax PRN).`, 'Case management: home health vs outpatient PT, walker and raised toilet seat ordered.'],
      nursing: ['Incision clean and dry; calves soft, non-tender; foot warm with brisk capillary refill; leg length and rotation unchanged.', 'Voiding spontaneously; incentive spirometer 1,500 mL; lungs clear.', 'Walked 60-100 feet with PT; premedicated before therapy.', aspirinPpx ? 'Aspirin given with food; no bleeding or GI upset.' : 'Enoxaparin injection given; abdominal wall site rotated; no bleeding.'],
      teach: [post ? 'Posterior hip precautions with adaptive equipment, walker use and stairs, ice, bowel regimen and fluids, VTE prophylaxis teach-back, and signs of dislocation, infection or blood clot.' : 'Walker use and stairs, ice, bowel regimen and fluids, VTE prophylaxis teach-back, and signs of dislocation, infection or blood clot.'],
      dispo: 'Anticipate discharge home today or on POD 2 if pain, mobility and stairs allow.'
    });
    st.push({
      fromH: pod2, id: 'pod2', label: 'Post-operative day 2: discharge-ready',
      problem: `POD 2 ${sl} total hip arthroplasty; meeting therapy goals; preparing for discharge.`,
      subj: 'Pain 3/10 on acetaminophen and celecoxib with occasional oxycodone. Walked 150 feet and climbed stairs with PT. No bowel movement for 2 days; mild bloating.',
      assess: 'Meeting discharge goals: pain controlled on oral medication, ambulating with walker, voiding, afebrile, Hgb stable, incision clean, leg length unchanged. Constipation on opioids.',
      plan: ['Discharge home with home health or outpatient PT today if stairs and transfers are safe.', `VTE prophylaxis after discharge: ${vteText}, per surgeon.`, 'Wean oxycodone; continue acetaminophen and celecoxib; bowel regimen.', 'Follow-up with orthopedics in 2 weeks for incision check and staple removal.'],
      nursing: ['Incision clean, dry, intact; dressing changed per surgeon order; calves soft.', 'Eating 75% of meals; encouraged fluids and fiber.', 'Prescriptions and equipment reviewed; teach-back on warning signs.', 'IV still in place until discharge.'],
      teach: [`Discharge teaching with teach-back: medications and ${aspirinPpx ? 'aspirin' : 'enoxaparin injections'}, ice/elevation, exercises, walker, ${post ? 'posterior hip precautions for 6-12 weeks, ' : ''}fall prevention, fever above 101 F, wound drainage, calf pain or swelling, chest pain or shortness of breath, a shortened or rotated leg or sudden severe hip pain.`],
      dispo: 'Discharge home today.',
      stickies: [{ title: 'Discharge today', body: `Discharge teach-back, ${aspirinPpx ? 'aspirin' : 'enoxaparin'} teaching, prescriptions, walker${post ? ', raised toilet seat and hip kit' : ''} delivered, home health / outpatient PT referral, orthopedic follow-up in 2 weeks; remove IV.` }]
    });
    st.push({
      fromH: pod3, id: 'delayed', label: 'Medically ready; discharge delayed',
      problem: `POD 3 or later ${sl} total hip arthroplasty; stable, awaiting a safe discharge plan.`,
      subj: 'Pain 1-2/10. Walking with the walker. Frustrated by waiting; eager to be home.',
      assess: 'Recovered from surgery; remaining stay is driven by disposition (home health start, SNF bed, caregiver availability) or a functional issue, not acute illness. Watch for hospital-acquired complications and any delay-related cause (uncontrolled pain, dizziness or anemia, new confusion, infection).',
      plan: ['Case management finalizing home health or SNF acceptance.', 'Continue PT daily, VTE prophylaxis, bowel regimen; monitor for DVT, dislocation, infection, delirium and falls.'],
      nursing: ['Vital signs stable, incision clean, pain 1-2/10; mobilizing with walker.', 'Skin intact; out of bed for meals; hip precautions followed.'],
      teach: ['Discharge teaching completed; reinforce warning signs and medication plan.'],
      dispo: 'Discharge when home health / placement is confirmed.'
    });
    return st;
  }
})();
