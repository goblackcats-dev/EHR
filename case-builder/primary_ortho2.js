/* Orthopedic / Trauma primary diagnoses (part 2): elective total knee arthroplasty, closed ankle fracture (ORIF).
   Everything is in hours since admission (h = 0 is arrival). Uses NS.OG.atClock / NS.OG.clock from primary_ortho_gi.js. */
NS.PRIMARY = NS.PRIMARY || {};

// ================================================================================================
// TOTAL KNEE ARTHROPLASTY (elective, hospital day 1 = day of surgery)
// ================================================================================================
(() => {
  const U = NS.util, C = NS.C, { atClock, clock } = NS.OG;

  NS.PRIMARY.tka = {
    key: 'tka', label: 'Total Knee Arthroplasty (Elective)', group: 'Surgical', cat: 'Orthopedic / Trauma', typicalLOS: [2, 3],
    desc: 'Elective total knee replacement for severe osteoarthritis. Day 1: day of surgery (pre-op, spinal + adductor canal block, OR, PACU, POD 0 same-day PT). Day 2: POD 1 PT, pain/swelling, Hgb drop, DVT watch. Day 3-4: POD 2-3 discharge home with home health (or SNF).',
    build(ctx) {
      const side = ctx.age % 2 ? 'Right' : 'Left', sl = side.toLowerCase();
      const arrH = 3.5, orH = 6, dur = 1.75, orEnd = orH + dur;             // pre-op holding 05:30, OR 08:00 at the default admit clock (02:00)
      const orTime = clock(ctx, orH), dietH = orEnd + 1.5, ptH = orEnd + 4.5, unitH = orEnd + 2;
      const pod1 = atClock(ctx, '05:00', orEnd + 6), pod2 = pod1 + 24, pod3 = pod1 + 48, pod4 = pod1 + 72;
      const lowDose = ctx.age >= 80 || ctx.weightKg < 55;
      const morphine = Object.assign(C.opioidIV(ctx, { start: orEnd, stop: pod1 + 4, given: [orEnd + 0.4, orEnd + 1.3, orEnd + 9.5, pod1 - 1.5] }),
        { dose: '2 mg', info: 'HIGH-ALERT. Breakthrough severe pain only (not for pain that responds to oral medication). Assess pain, sedation (RASS), RR and SpO2 before and 15-30 minutes after. Hold for RR below 10 or oversedation. Typically stopped the morning after surgery.' });
      const oxy = Object.assign(C.opioidPO(ctx, { start: orEnd + 1.5, given: [orEnd + 4.2, orEnd + 9, orEnd + 14.5, pod1 + 5, pod1 + 11, pod1 + 17, pod1 + 23, pod2 + 7, pod2 + 14] }),
        { dose: lowDose ? '2.5 mg' : '5 mg', sips: true, by: 'surgeon', info: 'HIGH-ALERT. Give before PT when pain is 4 or higher. Assess pain and sedation before and 30-60 minutes after. Hold for RR below 10 or oversedation. Part of multimodal analgesia: use the lowest effective dose and wean to acetaminophen and celecoxib.' });
      const cefazolin = { key: 'cefazolin', name: 'cefazolin (ANCEF) IVPB', dose: ctx.weightKg >= 120 ? '3 g' : '2 g', route: 'IV', freq: 'q8h', stat: true, startH: orH - 0.5, stopH: orH + 20, volume: 100, cls: 'Cephalosporin antibiotic',
        info: 'Surgical prophylaxis: first dose within 60 minutes before incision (and before the tourniquet is inflated), then every 8 hours for no more than 24 hours. Low cross-reactivity with penicillin; verify reaction history. Infuse over 30 minutes.', monitor: ['Temp', 'WBC', 'Cr'], indication: 'Surgical site infection prophylaxis (24 hours)', by: 'surgeon',
        avoid: ['cephalosporin', 'cefazolin'], alt: { key: 'vancomycin_ppx', name: 'vancomycin IVPB', dose: `${Math.round(ctx.weightKg * 15 / 250) * 250} mg`, freq: 'q12h', cls: 'Glycopeptide antibiotic', info: 'Used because of cephalosporin allergy. Start infusion 60-120 minutes before incision; infuse over at least 90 minutes. Watch for red man reaction.', monitor: ['Cr'], renal: { ckd3: { freq: 'q24h', note: 'Interval extended for reduced kidney function.' }, esrd: { freq: 'q24h', note: 'Interval extended for ESRD.' } } },
        renal: { ckd3: { freq: 'q12h', note: 'Interval extended for reduced kidney function.' }, esrd: { freq: 'q24h', note: 'Interval extended for ESRD.' } } };
      const celecoxib = { key: 'celecoxib', name: 'celecoxib (CELEBREX) capsule', dose: ctx.age >= 75 ? '100 mg' : '200 mg', route: 'Oral', freq: 'BID', stat: true, sips: true, startH: arrH + 0.3, cls: 'NSAID (COX-2 selective)', by: 'surgeon',
        info: 'Opioid-sparing multimodal analgesia; first dose before surgery with a sip of water. Give with food after surgery. Monitor creatinine, GI bleeding and blood pressure; additive bleeding risk with enoxaparin. Contraindicated with sulfonamide or NSAID allergy.', hold: 'Hold and notify provider for rising creatinine, GI bleeding or heart failure symptoms.',
        monitor: ['Cr', 'Hgb', 'BP'], indication: 'Multimodal analgesia / reduce opioid use', avoid: ['nsaid', 'ibuprofen', 'sulfa', 'celecoxib'], renal: { ckd3: { avoid: true }, esrd: { avoid: true } } };
      const spec = {
        primaryTeam: 'surgeon', typicalLOS: [2, 3], fallRiskBoost: 1, medMonitoring: true,
        problem: { name: `Primary osteoarthritis of the ${sl} knee`, details: `Severe ${sl} knee osteoarthritis (bone-on-bone) failing conservative treatment; elective ${sl} total knee arthroplasty.` },
        chief: `Scheduled ${sl} total knee replacement for chronic knee pain`,
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with years of progressive ${sl} knee pain from osteoarthritis, worse with walking, stairs and rising from a chair, now with night pain and limited to short distances. Conservative treatment has failed: weight management, activity modification, acetaminophen and topical/oral NSAIDs, physical therapy and two corticosteroid injections (last about 4 months ago). Standing radiographs show bone-on-bone tricompartmental arthritis with ${side === 'Right' ? 'varus' : 'varus'} deformity. Completed pre-admission testing (labs, ECG, MRSA screen), anesthesia and primary care clearance. Arrives the morning of surgery for elective ${sl} total knee arthroplasty. NPO since midnight; took only approved morning medications with a sip of water. No fever, cough, urinary symptoms, or skin breakdown near the knee.`,
        ros: 'Positive for chronic knee pain, stiffness after rest, and difficulty with stairs. Negative for fever, chills, chest pain, dyspnea, calf pain or swelling, dysuria, new rash or skin lesions near the knee, nausea, or recent dental work or infection.',
        keyLabs: ['Hemoglobin', 'WBC', 'Platelets', 'Sodium', 'Potassium', 'Creatinine', 'Glucose', 'INR'],
        isolation: 'None', famHxExtra: 'Parent had knee replacement. No known family history of bleeding disorders, clotting disorders, or problems with anesthesia.',
        flags: { npo: [[0, dietH]], preop: [[0, orH]], surgeryWindow: [[0, orH + 48]], postop: [[orEnd, 9999]] },
        ppxStartH: orEnd + 12,
        vitals: [
          { h: 0, temp: 98.1, hr: 74, sbp: 138, dbp: 82, rr: 16, spo2: 97, pain: 5, o2: 'Room air' },
          { h: arrH, temp: 98.2, hr: 78, sbp: 142, dbp: 84, rr: 16, spo2: 97, pain: 5 },
          { h: orH - 0.5, temp: 98.2, hr: 76, sbp: 138, dbp: 80, rr: 16, spo2: 98, pain: 2 },
          { h: orEnd, temp: 97.6, hr: 68, sbp: 108, dbp: 62, rr: 14, spo2: 96, pain: 1, o2: '2 L nasal cannula' },
          { h: orEnd + 1.5, temp: 97.9, hr: 72, sbp: 118, dbp: 68, rr: 14, spo2: 96, pain: 2 },
          { h: unitH + 1, temp: 98.4, hr: 76, sbp: 124, dbp: 72, rr: 16, spo2: 95, pain: 3, o2: 'Room air' },
          { h: orEnd + 6, temp: 99.0, hr: 84, sbp: 128, dbp: 74, rr: 16, spo2: 95, pain: 5 },
          { h: orEnd + 12, temp: 99.2, hr: 84, sbp: 128, dbp: 76, rr: 16, spo2: 95, pain: 5 },
          { h: pod1, temp: 99.4, hr: 82, sbp: 126, dbp: 74, rr: 16, spo2: 95, pain: 5 },
          { h: pod1 + 8, temp: 99.6, hr: 86, sbp: 128, dbp: 74, rr: 16, spo2: 95, pain: 4 },
          { h: pod1 + 20, temp: 99.2, hr: 82, sbp: 128, dbp: 76, rr: 16, spo2: 96, pain: 4 },
          { h: pod2 + 6, temp: 98.8, hr: 78, sbp: 130, dbp: 76, rr: 16, spo2: 96, pain: 3 },
          { h: pod3 + 6, temp: 98.4, hr: 76, sbp: 130, dbp: 78, rr: 16, spo2: 97, pain: 3 },
          { h: pod4 + 6, temp: 98.2, hr: 74, sbp: 130, dbp: 78, rr: 16, spo2: 97, pain: 2 }
        ],
        labs: {
          Hemoglobin: { add: [[0, 0], [orEnd, -0.6], [pod1, -1.7], [pod2, -2.3], [pod3, -2.2], [pod4 + 24, -2.0]] },
          WBC: { add: [[0, 0], [orEnd + 4, 2.5], [pod1, 3.2], [pod2, 2.0], [pod3, 0.8], [pod4, 0]] },
          Platelets: { add: [[0, 0], [pod1, -35], [pod2, -50], [pod3, -35], [pod4 + 24, -10]] },
          Sodium: { add: [[0, 0], [pod1, -1], [pod3, 0]] },
          Potassium: { add: [[0, 0], [pod1, 0.1]] },
          Creatinine: { add: [[0, 0], [pod1, 0.1], [pod2, 0.08], [pod3, 0.03]] },
          BUN: { add: [[0, 0], [pod1, 3], [pod3, 1]] },
          Glucose: { add: [[0, 4], [orEnd + 4, 26], [pod1, 18], [pod2, 10], [pod3, 6]] },
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
          { type: 'consult', h: arrH + 0.7, service: 'Anesthesiology (pre-anesthesia evaluation)', author: 'surgeon', orderedBy: 'surgeon', reason: `Anesthesia plan for ${sl} total knee arthroplasty`, label: 'Pre-anesthesia evaluation',
            recommendation: 'ASA class II-III; airway reassuring. Plan: spinal anesthesia with light sedation plus adductor canal nerve block for post-operative analgesia. NPO status confirmed. Hold diuretics and ACE inhibitor/ARB the morning of surgery; continue beta blocker. Spinal and nerve block risks reviewed and consent obtained. Post-operative nausea prophylaxis ordered.' },
          { type: 'procedure', h: arrH + 1.3, duration: 0.3, name: 'Adductor canal nerve block', label: `Ultrasound-guided adductor canal block, ${sl} thigh`, by: 'surgeon', service: 'Anesthesiology', indication: 'Post-operative analgesia, motor-sparing (opioid reduction)',
            findings: `Ultrasound-guided adductor canal block with 20 mL of ropivacaine 0.5% (below maximum dose for weight) deposited around the saphenous nerve in the mid-thigh; good spread seen. No paresthesia or vascular puncture. Expect numbness over the medial knee and lower leg for 8-14 hours; quadriceps strength is mostly preserved but fall risk remains. Monitor for local anesthetic toxicity.` },
          { type: 'surgery', h: orH, duration: dur, name: `${side} total knee arthroplasty (cemented)`, label: `${side} total knee arthroplasty`, anesthesia: 'Spinal anesthesia with light sedation and adductor canal block', orderH: 0.5,
            indication: `Severe ${sl} knee osteoarthritis`,
            findings: 'Tricompartmental osteoarthritis with eburnated bone on the medial femoral condyle and tibial plateau, osteophytes, and loss of cartilage. Good bone stock. Ligaments balanced; stable through full range of motion.',
            procedure: 'Supine; thigh tourniquet inflated after cefazolin infusion. Medial parapatellar approach. Distal femoral, proximal tibial and patellar cuts made; trial components balanced; cemented femoral, tibial and patellar components with a polyethylene insert. Periarticular injection of local anesthetic. Wound irrigated and closed in layers over no drain. Occlusive silver-impregnated dressing with compression wrap applied; tourniquet time 70 minutes.',
            ebl: '100 mL', fluids: "1,000 mL lactated Ringer's", specimens: 'None (bone fragments discarded)', complications: 'None', disposition: 'PACU, then orthopedic unit' },
          { type: 'transfer', h: unitH, label: 'Transferred from PACU to the orthopedic unit', text: `Awake after surgery, stable; transferred from PACU to the orthopedic unit with a dressing over the ${sl} knee and a nerve block in place.` },
          { type: 'imaging', h: orEnd + 3, study: `X-ray ${sl} knee, AP and lateral, post-operative`, modality: 'X-ray', indication: 'Post-operative position check',
            findings: 'Cemented total knee arthroplasty components in satisfactory alignment. Patellar component well positioned. No periprosthetic fracture or malalignment. Expected soft tissue swelling and skin staples.',
            impression: 'Satisfactory total knee arthroplasty.' }
        ],
        meds: [
          C.lrMaintenance({ start: arrH + 0.3, stop: orEnd + 6, rate: 100 }),
          Object.assign(C.acetaminophenPO({ start: arrH + 0.3 }), { dose: lowDose ? '650 mg' : '1,000 mg', freq: lowDose ? 'q6h' : 'q8h', stat: true, sips: true, by: 'surgeon', info: 'Scheduled (not PRN) base of multimodal analgesia; first dose before surgery with a sip of water. Maximum 3 g per 24 hours from all sources.' }),
          celecoxib,
          cefazolin,
          morphine, oxy,
          Object.assign(C.ondansetron({ start: orEnd, given: [orEnd + 1, orEnd + 9] }), { info: 'Post-operative nausea after spinal/sedation. Check QTc before repeated dosing in an older adult. Reassess nausea in 30 minutes.' }),
          { key: 'peg3350', name: 'polyethylene glycol (MIRALAX) powder', dose: '17 g', route: 'Oral', freq: 'daily', prn: true, prnInterval: 'Once daily', prnFor: 'no bowel movement in 24 hours', cls: 'Osmotic laxative', info: 'Mix in 4-8 oz of fluid. Hold for loose stools. Goal: bowel movement by post-op day 2-3.', indication: 'Opioid and immobility constipation prevention', startH: orEnd + 8, prnGiven: [], by: 'surgeon' }
        ],
        orders: [
          C.diet('NPO', 0, dietH, 'NPO after midnight for surgery; clear liquids until 2 hours before arrival were allowed per the pre-admission instructions. Sips of water with approved morning medications.'),
          C.diet('Regular diet', dietH, undefined, 'Advance as tolerated once awake and not nauseated. Heart-healthy; encourage protein and fluids. Sit upright to eat.'),
          C.activity('Up with assistance and fall precautions', 0, orH, 'Ambulatory before surgery; fall precautions after sedation or premedication.'),
          C.activity('Bed rest until spinal anesthesia wears off, then up with assistance', orEnd, ptH - 0.5, `Keep head of bed up 30 degrees; check sensation and movement of both legs every hour until the spinal resolves. Do NOT place a pillow under the ${sl} knee (keep the knee straight); a pillow under the heel is allowed.`),
          C.activity(`Weight bearing as tolerated ${sl} leg with rolling walker, up with assistance`, ptH - 0.5, undefined, 'Out of bed to chair for meals with 1 staff and gait belt; progress with PT. Call light within reach. Nerve block can cause numbness and weakness: stand with assistance only.'),
          { name: 'Pre-operative medication reconciliation and hold instructions', category: 'Nursing', frequency: 'Once', startH: arrH, completeH: orH - 0.3, instructions: 'Verify last dose and time of anticoagulants (apixaban, warfarin, rivaroxaban), antiplatelets, NSAIDs, GLP-1 agonists, SGLT2 inhibitors, diabetic medications, and herbal supplements. Confirm morning-of-surgery medications taken with a sip of water. Report any held-medication discrepancy to the surgeon and anesthesia.' },
          { name: 'Pre-operative skin preparation (chlorhexidine)', category: 'Nursing', frequency: 'Once', startH: arrH, completeH: orH - 0.5, instructions: `Chlorhexidine cloths to the ${sl} leg and body per protocol; do not shave the surgical site (clip only if needed). Confirm no open skin lesions or rash near the knee.` },
          { name: 'Pre-operative checklist, consent and site verification', category: 'Nursing', frequency: 'Once', startH: arrH, completeH: orH - 0.3, instructions: `Verify consent, ID and allergy bands, ${sl} knee marked by the surgeon, NPO status, last void, dentures/jewelry removed, cefazolin ready for infusion within 60 minutes before incision.` },
          { name: 'Type and screen', category: 'Laboratory', frequency: 'Once', startH: arrH - 0.5, completeH: arrH + 0.4, instructions: 'Blood bank specimen; armband required.' },
          { name: `Neurovascular checks ${sl} leg`, category: 'Nursing', frequency: 'Every hour x4, then every 4 hours', startH: orEnd, instructions: 'Check color, warmth, capillary refill, dorsalis pedis/posterior tibial pulses, sensation and ability to move toes and ankle (dorsiflexion for peroneal nerve). Compare with the other leg. Notify the surgeon for pallor, coolness, loss of pulse, new numbness, foot drop, or severe pain unrelieved by medication.', nursing: ['Expect numbness over the medial knee and shin from the adductor canal block for 8-14 hours.', 'Tense swelling, severe pain with passive toe movement, or a cool pale foot may be compartment syndrome or arterial injury: call immediately.'] },
          { name: 'Surgical dressing and incision assessment', category: 'Nursing', frequency: 'Every shift', startH: orEnd, instructions: 'Assess the compression dressing for strikethrough (mark and time any drainage), warmth, swelling and tightness; keep intact unless saturated or per surgeon. Expect bruising and swelling of the knee, calf and ankle.', nursing: ['Report drainage that soaks through the dressing, fever above 101 F, spreading redness, or foul odor.', 'Do not remove skin staples; surgeon removes them at the 2-week visit.'] },
          { name: 'Cryotherapy (ice / cold therapy) and elevation', category: 'Nursing', frequency: '20 minutes on, 40 minutes off while awake', startH: orEnd + 2, instructions: 'Apply cold therapy over the dressing; place a cloth barrier between ice and skin. Elevate the leg on pillows under the calf/heel with the knee straight and heel off the bed.', nursing: ['Check skin under the ice pack; the nerve block reduces cold sensation, so frostbite risk is higher.'] },
          { name: 'Continuous passive motion (CPM) machine', category: 'Nursing', frequency: '2 hours, three times daily from POD 0-1', startH: orEnd + 6, instructions: `CPM machine on the ${sl} leg: begin at 0-40 degrees and increase about 10 degrees per day to 90 degrees as tolerated per surgeon; heel positioned in the heel cup, patient's call light and pain medication given before use.`, nursing: ['Stop and notify the surgeon for severe pain, numbness, or dressing saturation.', 'Document degrees of motion achieved; target 90 degrees flexion and full extension (0 degrees) by discharge.'] },
          { name: 'Sequential compression devices', category: 'Nursing', frequency: 'Continuous when in bed', startH: arrH, instructions: 'Apply to both legs (or non-operative leg only if the operative leg dressing/swelling does not allow) until fully ambulatory. Remove for walking and skin checks every shift.' },
          { name: 'VTE prevention: early mobilization and chemoprophylaxis', category: 'Nursing', frequency: 'Every shift', startH: orEnd, instructions: 'Ambulate at least 3 times a day starting POD 0; ankle pumps hourly while awake. First enoxaparin dose 12 hours after surgery (timed after the spinal). Assess calves for pain, warmth, swelling or tenderness.', nursing: ['Chemoprophylaxis usually continues for 10-14 days (35 days for some regimens) after surgery.', 'Report unilateral calf swelling/pain, sudden shortness of breath, chest pain or tachycardia immediately (DVT/PE).'] },
          C.incentive(unitH, undefined),
          { name: 'Urinary retention monitoring after spinal anesthesia', category: 'Nursing', frequency: 'Every shift', startH: orEnd, instructions: 'Patient should void within 6-8 hours after surgery. Bladder scan if no void in 6 hours, suprapubic fullness or discomfort. Straight catheter per protocol for volume above 400 mL. No indwelling catheter is placed routinely.', nursing: ['Opioids and spinal anesthesia increase retention risk, especially in men with an enlarged prostate.'] },
          { name: 'Fall prevention after nerve block and opioids', category: 'Precautions', frequency: 'Continuous', startH: orEnd, instructions: 'High fall risk: bed alarm, non-skid socks, gait belt, assist x1 for all transfers until block resolved and PT clears. Never leave on the commode alone. Keep call light and walker within reach.', nursing: ['A numb or weak leg can buckle: do not let the patient stand alone for the first 12-24 hours.'] },
          { name: 'Transfusion threshold: Hgb below 7 g/dL or symptomatic', category: 'Nursing', frequency: 'Per lab result', startH: orEnd, instructions: 'Notify the surgeon for Hgb below 8 g/dL, symptomatic tachycardia, dizziness, or hypotension. Restrictive transfusion strategy (Hgb below 7 g/dL, or 8 g/dL with cardiac disease or symptoms).', nursing: ['Expect a Hgb drop of about 2 g/dL below baseline by post-op day 1-2.'] },
          { name: 'Physical therapy evaluation and treatment', category: 'Consult / Therapy', frequency: 'Twice daily from POD 0', startH: ptH - 1, instructions: `Same-day mobilization: stand and walk with rolling walker, WBAT ${sl} leg; knee range of motion, quadriceps sets, straight leg raise, stair training before discharge.`, by: 'surgeon' },
          { name: 'Occupational therapy evaluation and treatment', category: 'Consult / Therapy', frequency: 'Daily from POD 1', startH: orEnd + 12, instructions: 'ADL retraining, bathing and toileting with adaptive equipment (raised toilet seat, reacher, sock aid); home safety review.', by: 'surgeon' },
          { name: 'Case management consult: discharge planning', category: 'Consult / Therapy', frequency: 'Once', startH: arrH + 1, instructions: 'Confirm home setup (stairs, support person for first 48 hours), home health PT vs short-term skilled nursing facility, durable medical equipment (rolling walker, raised toilet seat) and outpatient PT.' }
        ],
        devices: [
          { deviceType: 'IV', type: 'Peripheral IV', location: 'Right forearm', siteMarker: 'rightForearm', gauge: '20 gauge', placeH: arrH + 0.2, infusing: "Lactated Ringer's", status: 'Infusing', assess: 'site clean, dry, intact; flushes easily' }
        ],
        assessments: [
          { fromH: 0, items: [['Musculoskeletal / Mobility', 'Mobility', `Ambulates independently with a limp favoring the ${sl} leg; cane for distances`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `${side} knee enlarged with bony crepitus, decreased range of motion (about 5-100 degrees), no warmth or erythema; foot warm, pedal pulses palpable, capillary refill under 3 seconds, sensation and toe movement intact`], ['Pain', 'Pain Location', `${side} knee, chronic aching, worse with weight bearing and stairs`], ['Skin', 'Skin', `Warm, dry; ${sl} knee skin intact without rash, abrasions or lesions; surgical site marked`], ['Skin', 'Braden Score', '22'], ['Safety', 'Delirium Screen (CAM)', 'Negative'], ['Respiratory', 'Breath Sounds', 'Clear bilaterally'], ['Respiratory', 'Incentive Spirometer', '1,750 mL (pre-operative teaching)']] },
          { fromH: orEnd, items: [['Skin', 'Surgical Incisions', `${side} anterior knee incision covered by occlusive dressing and compression wrap, clean, dry, intact; no drain`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, 'Spinal anesthesia wearing off: decreased sensation and movement of both legs, improving; toes warm, pulses palpable, capillary refill under 3 seconds'], ['Musculoskeletal / Mobility', 'Mobility', 'Bed rest until spinal resolves'], ['GU', 'Urinary Elimination', 'No indwelling catheter; has not voided since surgery'], ['Respiratory', 'Breath Sounds', 'Clear, diminished at bases'], ['Pain', 'Pain Location', `${side} knee incision, 2/10 at rest (block and spinal)`], ['Safety', 'Fall Precautions', 'High risk: bed alarm on, call light in reach, non-skid socks, assist for all transfers'], ['GI', 'Nausea / Vomiting', 'Mild nausea after spinal; relieved with ondansetron']] },
          { fromH: ptH, items: [['Musculoskeletal / Mobility', 'Mobility', `Stood and walked 20-30 feet with rolling walker and assist x1 with PT; WBAT ${sl} leg; tolerates sitting at the edge of the bed`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Spinal resolved; moves toes and ankle, can lift leg off bed; numbness over medial knee and shin (nerve block); foot warm, pulses palpable, capillary refill under 3 seconds; knee swollen, calf soft and non-tender`], ['Pain', 'Pain Location', `${side} knee incision, aching, 4-5/10 with movement; improved after oxycodone`], ['GU', 'Urinary Elimination', 'Voided 300 mL; no retention'], ['Respiratory', 'Incentive Spirometer', '1,250 mL'], ['Skin', 'Braden Score', '20']] },
          { fromH: pod1 - 1, items: [['GI', 'Nausea / Vomiting', 'None'], ['GI', 'Last BM / Flatus', 'No BM since admission; passing flatus'], ['Cardiac', 'Edema', `${side} knee and lower leg swollen with ecchymosis (expected); calf soft, non-tender`], ['Respiratory', 'Incentive Spirometer', '1,500 mL'], ['Pain', 'Pain Location', `${side} knee incision, aching, 4/10 at rest; block has worn off`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Spinal and nerve block resolved; full sensation, moves toes and ankle, lifts leg off bed; knee swollen and warm with expected bruising; foot warm, pulses palpable, capillary refill under 3 seconds; calf soft, non-tender`]] },
          { fromH: pod1 + 2, items: [['Musculoskeletal / Mobility', 'Mobility', `Walked 60-100 feet with rolling walker and contact guard assist; ${sl} knee flexion about 70 degrees, extension 0-5 degrees; out of bed to chair for meals`], ['Skin', 'Surgical Incisions', `${side} anterior knee incision with dressing clean, dry, intact; small amount of old drainage on dressing, ecchymosis tracking down the shin`], ['Safety', 'Delirium Screen (CAM)', 'Negative']] },
          { fromH: pod2 - 2, items: [['Musculoskeletal / Mobility', 'Mobility', `Walking 150 feet with rolling walker and standby assist; practiced stairs with PT; ${sl} knee flexion about 90 degrees`], ['Pain', 'Pain Location', `${side} knee, aching, 3/10 on acetaminophen, celecoxib and occasional oxycodone`], ['GI', 'Last BM / Flatus', 'No BM for 2 days; Miralax given'], ['Respiratory', 'Incentive Spirometer', '1,750 mL'], ['Cardiac', 'Edema', `${side} knee and ankle swelling (2+) with ecchymosis; improving with elevation and ice; calf soft and non-tender`], ['Skin', 'Surgical Incisions', `${side} anterior knee incision closed with staples, edges approximated, minimal serosanguineous drainage on dressing, no erythema or warmth beyond the expected; ecchymosis down the calf`]] },
          { fromH: pod3 - 2, items: [['Musculoskeletal / Mobility', 'Mobility', 'Independent with rolling walker including stairs; knee flexion about 95 degrees'], ['GI', 'Last BM / Flatus', 'Moderate BM this morning'], ['Pain', 'Pain Location', `${side} knee, 2-3/10`]] }
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
          rec: `Home with home health PT (outpatient PT within a week) if a responsible adult is available for the first days; short-term rehab at a skilled nursing facility if the patient lives alone, has multiple stairs, or cannot safely transfer. WBAT ${sl} leg, rolling walker, knee ROM goals 0-90 degrees.`
        },
        discharge: { dispo: () => ((ctx.social && /alone/i.test(ctx.social.living || '')) ? 'Home with home health PT and a family caregiver for the first days; skilled nursing facility if no safe home plan' : 'Home with home health or outpatient PT, rolling walker and a family caregiver (skilled nursing facility only if needed)'), estimate: 'post-operative day 2 (hospital day 3) once pain is controlled on oral medication, walking 100+ feet with a walker, stairs completed, voiding and Hgb stable' },
        stages: tkaStages(ctx, { side, sl, orH, orEnd, orTime, unitH, ptH, pod1, pod2, pod3, pod4 }),
        stickies: [
          { title: 'Fall risk after block / opioids', body: 'Spinal and adductor canal block can cause leg numbness and weakness. Assist x1 with gait belt and walker for every transfer; bed alarm on.' },
          { title: 'Knee positioning', body: 'No pillow under the operative knee (flexion contracture risk); pillow under the heel. Ice and elevate; neurovascular checks every 4 hours; CPM per order.', fromH: orEnd },
          { title: 'VTE prevention', body: 'Enoxaparin first dose 12 hours after surgery; SCDs; ankle pumps; walk 3+ times daily. Report calf pain/swelling, dyspnea or chest pain immediately.', fromH: orEnd }
        ],
        objectives: ['Prepare a patient for elective total knee arthroplasty: pre-operative checklist, medication holds, NPO, antibiotic timing, consent and site verification.', 'Implement post-operative TKA care: neurovascular checks, incision and dressing assessment, ice/elevation, positioning, nerve block fall precautions and pain management with multimodal analgesia.', 'Prevent and recognize post-operative complications: DVT/PE, urinary retention, constipation, surgical-site infection, anemia and compartment syndrome.', 'Coordinate early mobilization with PT/OT, enoxaparin teaching and discharge planning (home health vs SNF, rolling walker).']
      };
      return spec;
    }
  };

  function tkaStages(ctx, p) {
    const { side, sl, orH, orEnd, orTime, unitH, ptH, pod1, pod2, pod3, pod4 } = p;
    const st = [];
    st.push({
      fromH: 0, id: 'preop', label: `Pre-operative: ${sl} total knee arthroplasty this morning`,
      problem: `Severe ${sl} knee osteoarthritis; scheduled ${sl} total knee arthroplasty today (about ${orTime}).`,
      subj: `Chronic ${sl} knee pain about 5/10, worse with weight bearing. NPO since midnight; took approved morning medications with a sip of water. A little anxious about the surgery and pain afterward. No fever, cough, urinary symptoms or skin lesions near the knee.`,
      assess: 'Elective total knee arthroplasty candidate, medically optimized; vital signs stable; consent and site marking in progress.',
      plan: ['Spinal anesthesia with adductor canal block; cefazolin within 60 minutes before incision (before the tourniquet).', 'Scheduled acetaminophen and celecoxib started pre-operatively as part of multimodal analgesia.', 'Type and screen, MRSA screen and pre-operative labs reviewed; hold anticoagulants, GLP-1/SGLT2 medications as directed.', 'IV fluids; SCDs; post-op enoxaparin 12 hours after surgery; PT the day of surgery.'],
      nursing: ['Identification, allergy band, consent and surgical site (marked by surgeon) verified.', 'NPO status confirmed; last intake documented; morning medications reconciled.', 'IV started; chlorhexidine skin prep done; vital signs stable.', 'Pre-operative teaching: incentive spirometer, ankle pumps, walker use, pain scale, expected sensations after the nerve block.'],
      teach: ['Reviewed what to expect in recovery (numb leg after spinal, ice, dressing), incentive spirometer, call before getting up, pain goals and early walking.'],
      dispo: 'Anticipate 2 nights, then home with home health PT.',
      objectives: ['Complete the pre-operative nursing checklist and medication hold review for a total knee arthroplasty patient.'],
      stickies: [{ title: 'To OR', body: `OR about ${orTime}: NPO, cefazolin 30-60 minutes before incision, consent, ${sl} knee marked, block placed, remove jewelry/dentures.` }]
    });
    st.push({
      fromH: orEnd, id: 'postop0', label: 'Post-operative day 0: PACU and first day on the unit',
      problem: `Status post ${sl} total knee arthroplasty (POD 0), spinal anesthesia and adductor canal block.`,
      subj: 'Awake in recovery; legs heavy and tingling as the spinal wears off. Knee pain 2-4/10 so far, expected to increase as the block wears off. Mild nausea. Hungry.',
      assess: `POD 0 ${sl} TKA; hemodynamically stable after mild spinal-related low blood pressure; expected blood loss; neurovascularly intact.`,
      plan: ['Cefazolin x 24 hours; scheduled acetaminophen and celecoxib, oral oxycodone PRN, IV morphine only for severe breakthrough pain.', 'Enoxaparin first dose 12 hours after surgery; SCDs; ankle pumps; walk with PT today.', 'Ice, elevation and CPM; no pillow under the knee; neurovascular checks every 4 hours.', 'Regular diet; stop IV fluids once drinking well; bladder scan if no void within 6 hours.', 'Bowel regimen with opioids; incentive spirometry hourly while awake.'],
      nursing: ['Dressing clean, dry, intact; foot warm with palpable pulses and intact sensation as spinal resolves.', 'Ice applied; leg elevated with knee straight and a pillow under the heel.', 'Voided after the spinal wore off; no catheter.', 'Up with PT and rolling walker with assist of one; fall precautions and bed alarm on.'],
      teach: ['Weight bearing as tolerated with the walker, calling before getting up, ankle pumps and incentive spirometer, and pain medication timing before PT.'],
      dispo: 'Expect 1-2 more nights; discharge home with home health on POD 2.',
      objectives: ['Perform neurovascular, incision and pain assessments and fall-prevention measures after a spinal and nerve block.']
    });
    st.push({
      fromH: pod1, id: 'pod1', label: 'Post-operative day 1: working with therapy',
      problem: `POD 1 ${sl} total knee arthroplasty; knee swelling and bruising; therapy twice daily.`,
      subj: 'Knee aching 4-5/10 at rest and 6/10 with therapy after the block wore off overnight. Slept poorly. Passed gas but no bowel movement. Wants to go home soon.',
      assess: 'Recovering as expected. Hgb about 2 g/dL below baseline without symptoms; temperature up to 99.6 F is common after surgery; incision clean; no signs of DVT, infection, or retention.',
      plan: ['IV morphine stopped; oxycodone only for pain above 4 before therapy; continue acetaminophen and celecoxib.', 'PT twice a day: walking, stairs practice, ROM goals 0-90 degrees; CPM per order; ice and elevation.', 'Daily CBC/BMP; transfuse only for Hgb below 7-8 or symptoms.', 'Continue enoxaparin and SCDs; bowel regimen (senna-docusate scheduled, Miralax PRN).', 'Case management: home health vs SNF, walker and raised toilet seat ordered.'],
      nursing: ['Incision clean and dry; calves soft, non-tender; foot warm with brisk capillary refill.', 'Voiding spontaneously; incentive spirometer 1,500 mL; lungs clear.', 'Walked 60-100 feet with PT; premedicated before therapy.', 'Enoxaparin injection given; abdominal wall site rotated; no bleeding.'],
      teach: ['Walker use and stairs, ice and elevation, bowel regimen and fluids, enoxaparin self-injection teach-back, and signs of infection or blood clot.'],
      dispo: 'Anticipate discharge home on POD 2 if pain, mobility and stairs allow.'
    });
    st.push({
      fromH: pod2, id: 'pod2', label: 'Post-operative day 2: discharge-ready',
      problem: `POD 2 ${sl} total knee arthroplasty; meeting therapy goals; preparing for discharge.`,
      subj: 'Pain 3/10 on acetaminophen and celecoxib with occasional oxycodone. Walked 150 feet and climbed stairs with PT. No bowel movement for 2 days; mild bloating.',
      assess: 'Meeting discharge goals: pain controlled on oral medication, ambulating with walker, voiding, afebrile, Hgb stable, incision clean. Constipation on opioids.',
      plan: ['Discharge home with home health PT today or tomorrow if stairs and transfers are safe.', 'Enoxaparin or aspirin for VTE prophylaxis after discharge for 10-35 days per surgeon.', 'Wean oxycodone; continue acetaminophen and celecoxib; bowel regimen.', 'Follow-up with orthopedics in 2 weeks for incision check and staple removal.'],
      nursing: ['Incision clean, dry, intact; dressing changed per surgeon order; calves soft.', 'Eating 75% of meals; encouraged fluids and fiber.', 'Prescriptions and equipment reviewed; teach-back on warning signs.', 'IV still in place until discharge.'],
      teach: ['Discharge teaching with teach-back: medications and enoxaparin injections, ice/elevation, exercises, walker, fall prevention, fever above 101 F, wound drainage, calf pain or swelling, chest pain or shortness of breath.'],
      dispo: 'Discharge home with home health PT today (or tomorrow).',
      stickies: [{ title: 'Discharge today', body: 'Discharge teach-back, enoxaparin teaching, prescriptions, walker delivered, home health PT referral, orthopedic follow-up in 2 weeks; remove IV.' }]
    });
    st.push({
      fromH: pod3, id: 'pod3', label: 'Post-operative day 3: discharge today',
      problem: `POD 3 ${sl} total knee arthroplasty; medically ready; awaiting transport or placement.`,
      subj: 'Pain 2-3/10. Had a bowel movement. Walking in the hall with the walker. Ready to go home.',
      assess: 'Medically stable for discharge: afebrile, Hgb stable, incision clean, no signs of DVT. Any remaining delay is functional or related to home support or placement.',
      plan: ['Discharge today with home health PT (or skilled nursing facility if no safe home plan).', 'Complete enoxaparin and equipment teaching; send discharge summary and last dose times.'],
      nursing: ['Ambulating with walker and standby assist; stairs with PT.', 'Voiding; BM today; tolerating a regular diet.', 'Report called if transferring to rehab; belongings and medication list prepared.'],
      teach: ['Teach-back on warning signs, medication schedule, ice/elevation, exercise program, and when to call the surgeon.'],
      dispo: 'Discharge today.',
      stickies: [{ title: 'Discharge day', body: 'Remove IV; verify prescriptions, walker, enoxaparin supplies and follow-up; escort to the car or transfer.' }]
    });
    st.push({
      fromH: pod4, id: 'delayed', label: 'Medically ready; discharge delayed',
      problem: `POD 4 or later ${sl} total knee arthroplasty; stable, awaiting a safe discharge plan.`,
      subj: 'Pain 1-2/10. Walking with the walker. Frustrated by waiting; eager to be home.',
      assess: 'Recovered from surgery; remaining stay is driven by disposition (home health start, SNF bed, caregiver availability), not acute illness. Watch for hospital-acquired complications.',
      plan: ['Case management finalizing home health or SNF acceptance.', 'Continue PT daily, enoxaparin, bowel regimen; monitor for DVT, infection, delirium and falls.'],
      nursing: ['Vital signs stable, incision clean, pain 1-2/10; mobilizing with walker.', 'Skin intact; out of bed for meals.'],
      teach: ['Discharge teaching completed; reinforce warning signs and medication plan.'],
      dispo: 'Discharge when home health / placement is confirmed.'
    });
    return st;
  }
})();

// ================================================================================================
// CLOSED ANKLE FRACTURE (bimalleolar / trimalleolar) with delayed ORIF
// ================================================================================================
(() => {
  const U = NS.util, C = NS.C, { atClock, clock } = NS.OG;

  NS.PRIMARY.ankle_fracture = {
    key: 'ankle_fracture', label: 'Ankle Fracture (ORIF)', group: 'Surgical', cat: 'Orthopedic / Trauma', typicalLOS: [3, 5],
    desc: 'Closed bimalleolar or trimalleolar ankle fracture after a twisting fall. Day 1: ED reduction/splint, elevation, neurovascular and compartment checks. Day 2: waiting for swelling to subside. Day 3: ORIF with nerve block. Day 4-5: POD 1-2 non-weight-bearing PT teaching, discharge home (or rehab).',
    build(ctx) {
      const tri = ctx.age % 3 === 0;                                     // trimalleolar (posterior malleolus fragment) vs bimalleolar
      const side = ctx.age % 2 ? 'Right' : 'Left', sl = side.toLowerCase();
      const orH = atClock(ctx, '10:00', 40), dur = tri ? 2.25 : 1.75, orEnd = orH + dur;           // surgery on hospital day 3 once swelling has subsided
      const npoH = atClock(ctx, '00:00', orH - 14), dietH = orEnd + 1.5, unitH = orEnd + 1.75, orTime = clock(ctx, orH);
      const pod1 = atClock(ctx, '05:00', orEnd + 6), pod2 = pod1 + 24, pod3 = pod1 + 48;
      const ptPre = atClock(ctx, '09:00', 18), ptH = pod1 + 3;
      const lowDose = ctx.age >= 75 || ctx.weightKg < 55;
      const fx = tri ? 'trimalleolar' : 'bimalleolar', procName = `${side} ankle open reduction and internal fixation (ORIF)`;
      const morphine = Object.assign(C.opioidIV(ctx, { start: 0.3, stop: pod1 + 4, given: [0.3, 1.2, 6.5, 13, 20.5, 27, 34, 41, orEnd + 0.4, orEnd + 1.3, orEnd + 9, pod1 - 1.5] }),
        { dose: lowDose ? '2 mg' : '4 mg', by: 'ed', info: 'HIGH-ALERT. Severe pain only (7-10); give oral medication first for moderate pain. Assess pain, sedation (RASS), RR and SpO2 before and 15-30 minutes after. Hold for RR below 10 or oversedation. Pain that is out of proportion or rises despite opioids may be compartment syndrome: assess the leg and call the provider.' });
      const oxy = Object.assign(C.opioidPO(ctx, { start: 3, given: [4.5, 9, 15, 22, 28.5, 35, 40, 46, orEnd + 4, orEnd + 8.5, orEnd + 13, pod1 + 5, pod1 + 12, pod1 + 19, pod2 + 6, pod2 + 14] }),
        { dose: lowDose ? '2.5 mg' : '5 mg', sips: true, by: 'surgeon', info: 'HIGH-ALERT. Assess pain and sedation before and 30-60 minutes after. Hold for RR below 10 or oversedation. Give before PT when pain is 4 or higher. Use with a bowel regimen; wean to acetaminophen after the nerve block wears off.' });
      const cefazolin = { key: 'cefazolin', name: 'cefazolin (ANCEF) IVPB', dose: ctx.weightKg >= 120 ? '3 g' : '2 g', route: 'IV', freq: 'q8h', stat: true, startH: orH - 0.5, stopH: orH + 20, volume: 100, cls: 'Cephalosporin antibiotic',
        info: 'Surgical prophylaxis: first dose within 60 minutes before incision (before the tourniquet), then every 8 hours for no more than 24 hours. Low cross-reactivity with penicillin; verify reaction history. Infuse over 30 minutes.', monitor: ['Temp', 'WBC', 'Cr'], indication: 'Surgical site infection prophylaxis (24 hours)', by: 'surgeon',
        avoid: ['cephalosporin', 'cefazolin'], alt: { key: 'vancomycin_ppx', name: 'vancomycin IVPB', dose: `${Math.round(ctx.weightKg * 15 / 250) * 250} mg`, freq: 'q12h', cls: 'Glycopeptide antibiotic', info: 'Used because of cephalosporin allergy. Start infusion 60-120 minutes before incision; infuse over at least 90 minutes. Watch for red man reaction.', monitor: ['Cr'], renal: { ckd3: { freq: 'q24h', note: 'Interval extended for reduced kidney function.' }, esrd: { freq: 'q24h', note: 'Interval extended for ESRD.' } } },
        renal: { ckd3: { freq: 'q12h', note: 'Interval extended for reduced kidney function.' }, esrd: { freq: 'q24h', note: 'Interval extended for ESRD.' } } };
      const spec = {
        primaryTeam: 'surgeon', typicalLOS: [3, 5], fallRiskBoost: 1, medMonitoring: true,
        problem: { name: `${tri ? 'Trimalleolar' : 'Bimalleolar'} ankle fracture, ${sl}`, details: `Closed, displaced ${fx} fracture of the ${sl} ankle; splinted in the ED; ORIF once swelling subsides (hospital day 3).` },
        chief: `${side} ankle pain and deformity after a twisting fall`,
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} who slipped stepping off a wet curb, planting the ${sl} foot and twisting the ankle. Felt and heard a pop with immediate severe ${sl} ankle pain, swelling and deformity; unable to bear weight. No loss of consciousness, head strike, neck or back pain, chest pain or syncope before the fall. Denies numbness or tingling in the toes and no open wound. EMS applied a vacuum splint and gave fentanyl 50 mcg IV. Last ate about 4 hours before arrival.`,
        ros: 'Positive for ankle pain, swelling, bruising and inability to walk. Negative for head injury, neck or back pain, chest pain, dyspnea, abdominal pain, numbness or weakness of the foot, fever, or open wounds.',
        keyLabs: ['Hemoglobin', 'WBC', 'Platelets', 'Sodium', 'Potassium', 'Creatinine', 'INR', 'Glucose'],
        isolation: 'None', famHxExtra: 'No known family history of bleeding disorders, osteoporosis or problems with anesthesia.',
        flags: { npo: npoH <= ctx.windowEnd ? [[npoH, dietH]] : [], preop: [[0, orH]], surgeryWindow: [[0, orH + 48]], postop: [[orEnd, 9999]] },
        ppxStartH: 6,
        vitals: [
          { h: 0, temp: 98.4, hr: 98, sbp: 152, dbp: 90, rr: 20, spo2: 98, pain: 9, o2: 'Room air' },
          { h: 1.5, temp: 98.4, hr: 90, sbp: 146, dbp: 86, rr: 18, spo2: 98, pain: 7 },
          { h: 3, temp: 98.4, hr: 82, sbp: 138, dbp: 80, rr: 16, spo2: 98, pain: 4 },
          { h: 12, temp: 98.6, hr: 80, sbp: 136, dbp: 80, rr: 16, spo2: 98, pain: 5 },
          { h: 24, temp: 98.8, hr: 78, sbp: 134, dbp: 78, rr: 16, spo2: 98, pain: 5 },
          { h: 36, temp: 99.0, hr: 78, sbp: 134, dbp: 78, rr: 16, spo2: 98, pain: 4 },
          { h: orH - 1, temp: 98.4, hr: 74, sbp: 132, dbp: 78, rr: 16, spo2: 98, pain: 3 },
          { h: orEnd, temp: 97.8, hr: 72, sbp: 112, dbp: 66, rr: 14, spo2: 96, pain: 1, o2: '2 L nasal cannula' },
          { h: orEnd + 3, temp: 98.2, hr: 76, sbp: 122, dbp: 72, rr: 16, spo2: 96, pain: 2, o2: 'Room air' },
          { h: orEnd + 14, temp: 99.2, hr: 84, sbp: 130, dbp: 76, rr: 16, spo2: 96, pain: 7 },
          { h: pod1 + 4, temp: 99.4, hr: 84, sbp: 130, dbp: 78, rr: 16, spo2: 96, pain: 5 },
          { h: pod1 + 20, temp: 99.0, hr: 80, sbp: 128, dbp: 76, rr: 16, spo2: 97, pain: 4 },
          { h: pod2 + 6, temp: 98.6, hr: 76, sbp: 128, dbp: 76, rr: 16, spo2: 97, pain: 3 },
          { h: pod3 + 6, temp: 98.4, hr: 74, sbp: 126, dbp: 76, rr: 16, spo2: 98, pain: 2 }
        ],
        labs: {
          Hemoglobin: { add: [[0, -0.3], [30, -0.8], [orEnd, -1.0], [pod1, -1.6], [pod2, -1.8], [pod3, -1.6]] },
          WBC: { add: [[0, 2.8], [24, 1.4], [orEnd + 4, 3.0], [pod1, 2.4], [pod2, 1.0], [pod3, 0.2]] },
          Platelets: { add: [[0, 0], [pod1, -25], [pod2, -30], [pod3, -10]] },
          Sodium: { add: [[0, 0], [pod1, -1]] },
          Potassium: { add: [[0, 0.1], [pod1, 0]] },
          Creatinine: { add: [[0, 0.04], [pod1, 0.06], [pod3, 0]] },
          BUN: { add: [[0, 2], [pod1, 2], [pod3, 0]] },
          Glucose: { add: [[0, 28], [24, 8], [orEnd + 4, 24], [pod2, 10]] },
          Calcium: { add: [[0, 0], [pod1, -0.3]] },
          INR: { add: [[0, 0]] }
        },
        labSchedule: [
          { h: 0.5, codes: ['PT', 'INR', 'aPTT'] },
          { h: npoH + 2, codes: ['Hemoglobin', 'Hematocrit', 'Potassium', 'Creatinine'] }
        ],
        quals: [
          { h: npoH + 1, category: 'Blood Bank', code: 'Type and screen', value: 'A positive; antibody screen negative', specimen: 'Blood' },
          { h: 1.4, category: 'Urinalysis', code: 'Urinalysis - leukocyte esterase', value: 'Negative', reference: 'Negative', specimen: 'Urine' },
          { h: 1.4, category: 'Urinalysis', code: 'Urinalysis - nitrite', value: 'Negative', reference: 'Negative', specimen: 'Urine' },
          { h: npoH + 1, category: 'Microbiology', code: 'MRSA nasal screen (PCR)', value: 'Negative', reference: 'Negative', specimen: 'Nares' },
          ...(ctx.female && ctx.age < 55 ? [{ h: 1.4, category: 'Other', code: 'Urine hCG (pregnancy test)', value: 'Negative', reference: 'Negative', specimen: 'Urine' }] : [])
        ],
        events: [
          { type: 'imaging', h: 0.8, study: `X-ray ${sl} ankle, 3 views (AP, mortise, lateral)`, modality: 'X-ray', indication: `${side} ankle pain, swelling and deformity after a twisting injury`,
            findings: tri ? `Displaced oblique fracture of the distal fibula at the level of the syndesmosis (Weber B), transverse fracture of the medial malleolus, and a posterior malleolus fragment involving about 25% of the articular surface, with lateral and posterior subluxation of the talus and widened medial clear space. Diffuse soft tissue swelling.` : `Displaced oblique fracture of the distal fibula at the level of the syndesmosis (Weber B) and a transverse fracture of the medial malleolus with lateral subluxation of the talus and widened medial clear space. Posterior malleolus intact. Diffuse soft tissue swelling.`,
            impression: `Displaced ${fx} ankle fracture with talar subluxation.` },
          { type: 'procedure', h: 1.7, duration: 0.5, name: `Closed reduction and splinting, ${sl} ankle`, label: `ED closed reduction and sugar-tong/posterior splint, ${sl} ankle`, by: 'ed', service: 'Emergency Medicine', indication: 'Reduce talar subluxation and stabilize the fracture; relieve skin and neurovascular tension',
            findings: `Hematoma block with 10 mL of 1% lidocaine (below maximum dose). Gentle longitudinal traction and correction of the lateral displacement; talus reduced into the mortise. Well-padded sugar-tong and posterior plaster splint applied with the ankle at 90 degrees; toes left exposed. Before and after the procedure: foot warm, dorsalis pedis and posterior tibial pulses palpable, capillary refill under 3 seconds, sensation and toe movement intact. Pain improved from 9/10 to 4/10.` },
          { type: 'imaging', h: 2.6, study: `X-ray ${sl} ankle, 3 views, post-reduction in splint`, modality: 'X-ray', indication: 'Post-reduction alignment', findings: 'Talus reduced beneath the tibial plafond with a congruent mortise. Residual fibular displacement and medial malleolar gap. Splint in place. No new fracture.', impression: 'Improved alignment after reduction; fractures remain displaced and need operative fixation.' },
          { type: 'consult', h: 2.4, service: 'Orthopedic Surgery', author: 'surgeon', orderedBy: 'ed', reason: `${side} ${fx} ankle fracture`, label: 'Orthopedic surgery consulted; operative plan',
            recommendation: `Admit to Orthopedic Surgery. Unstable ${fx} fracture needs ORIF, but significant swelling makes early surgery risky for wound complications. Splint, strict elevation above heart level, ice, neurovascular and compartment checks every 2-4 hours. Surgery in 2-3 days once the skin wrinkles (swelling subsided). Non-weight-bearing ${sl} leg. Pre-op: type and screen, NPO after midnight, hold NSAIDs. Enoxaparin prophylaxis (heparin SQ held before surgery). PT for non-weight-bearing gait training with walker or crutches.` },
          { type: 'transfer', h: 6, label: 'Admitted to the orthopedic unit', text: 'Transferred from the ED to the orthopedic unit with the leg splinted and elevated.' },
          ...(tri ? [{ type: 'imaging', h: 20, study: `CT ${sl} ankle without contrast`, modality: 'CT', indication: 'Pre-operative planning for posterior malleolus involvement', findings: 'Posterior malleolus fragment involves about 25-30% of the tibial plafond with 3 mm articular step-off. Medial malleolar and distal fibular fractures as described. Small marginal impaction of the talar dome without loose bodies. Syndesmosis widening cannot be excluded.', impression: 'Trimalleolar fracture; posterior malleolus fixation recommended.' }] : []),
          { type: 'consult', h: orH - 14, service: 'Orthopedic Surgery', author: 'surgeon', orderedBy: 'surgeon', reason: 'Re-evaluation of soft tissue swelling before surgery', label: 'Orthopedic surgery: swelling subsiding, OR tomorrow',
            recommendation: `Swelling has improved; skin now wrinkles over the ${sl} ankle and no fracture blisters threaten the incision site. Proceed to ORIF tomorrow morning (about ${orTime}). NPO after midnight, cefazolin on call to the OR, popliteal sciatic and saphenous nerve block by anesthesia. Continue elevation, ice, non-weight-bearing and splint.` },
          { type: 'procedure', h: orH - 0.9, duration: 0.3, name: 'Popliteal sciatic and saphenous nerve block', label: `Ultrasound-guided popliteal sciatic and saphenous block, ${sl} leg`, by: 'surgeon', service: 'Anesthesiology', indication: 'Post-operative analgesia for ankle surgery (opioid reduction)',
            findings: `Ultrasound-guided popliteal sciatic block with 20 mL of ropivacaine 0.5% and saphenous nerve block with 5 mL; good spread seen. No paresthesia or vascular puncture. Expect numbness and weakness of the foot and ankle for 12-24 hours; pain may return suddenly (rebound pain) when the block wears off, so take oral analgesics before it fades.` },
          { type: 'surgery', h: orH, duration: dur, name: procName, label: procName, anesthesia: 'General anesthesia (laryngeal mask) with popliteal sciatic and saphenous nerve block', orderH: orH - 20,
            indication: `Unstable ${fx} ankle fracture`,
            findings: tri ? 'Displaced Weber B distal fibula fracture, medial malleolus fracture and a large posterior malleolus fragment; syndesmosis stable on intra-operative hook test after fixation. Articular reduction anatomic on fluoroscopy.' : 'Displaced Weber B distal fibula fracture and medial malleolus fracture; syndesmosis stable on intra-operative hook test after fixation. Mortise reduced and congruent on fluoroscopy.',
            procedure: tri ? `Supine with a thigh tourniquet inflated after cefazolin. Lateral fibular plate and screws; posterolateral approach with open reduction and screw fixation of the posterior malleolus fragment; medial malleolus fixed with two screws. Wound irrigated and closed in layers. Sterile dressing and a well-padded posterior splint with the ankle at 90 degrees.` : `Supine with a thigh tourniquet inflated after cefazolin. Lateral approach with fibular plate and screws; medial malleolus fixed with two cannulated screws. Wound irrigated and closed in layers. Sterile dressing and a well-padded posterior splint with the ankle at 90 degrees.`,
            ebl: '50 mL', fluids: "1,000 mL lactated Ringer's", specimens: 'None', complications: 'None', disposition: 'PACU, then orthopedic unit' },
          { type: 'transfer', h: unitH, label: 'Transferred from PACU to the orthopedic unit', text: `Awake and stable after ORIF; transferred from PACU with the ${sl} leg in a posterior splint, elevated, nerve block in place.` },
          { type: 'imaging', h: orEnd + 2.5, study: `X-ray ${sl} ankle, 3 views, post-operative in splint`, modality: 'X-ray', indication: 'Post-operative hardware and alignment check',
            findings: `Fibular plate and screws, medial malleolar screws${tri ? ' and posterior malleolar screws' : ''} in satisfactory position. Mortise congruent; talus centered. Splint and soft tissue swelling.`, impression: 'Satisfactory ORIF; no complications.' }
        ],
        meds: [
          C.lrMaintenance({ start: npoH, stop: orEnd + 8, rate: 75 }),
          morphine, oxy,
          Object.assign(C.ondansetron({ start: 0.8, given: [0.8, orEnd + 1.5, orEnd + 11] }), { info: 'Reassess nausea in 30 minutes. May cause constipation and prolong QT.' }),
          Object.assign(C.acetaminophenPO({ start: 1.0 }), { dose: lowDose ? '650 mg' : '1,000 mg', freq: lowDose ? 'q6h' : 'q8h', stat: true, sips: true, by: 'ed', info: 'Scheduled (not PRN) base of multimodal analgesia; opioid-sparing. Maximum 3 g per 24 hours from all sources.' }),
          cefazolin,
          { key: 'peg3350', name: 'polyethylene glycol (MIRALAX) powder', dose: '17 g', route: 'Oral', freq: 'daily', prn: true, prnInterval: 'Once daily', prnFor: 'no bowel movement in 24 hours', cls: 'Osmotic laxative', info: 'Mix in 4-8 oz of fluid. Hold for loose stools. Goal: bowel movement every 1-2 days while on opioids and less mobile.', indication: 'Opioid and immobility constipation prevention', startH: 24, prnGiven: [], by: 'surgeon' },
          { key: 'vitamin_d3', name: 'cholecalciferol (vitamin D3) tablet', dose: '1,000 units', route: 'Oral', freq: 'daily', cls: 'Vitamin', info: 'Supports fracture healing; check 25-OH vitamin D at follow-up for low-energy fractures.', indication: 'Fracture healing / bone health', startH: 24, by: 'surgeon', when: ctx.age >= 50 }
        ],
        orders: [
          C.diet('Regular diet', 0.5, npoH, 'Heart-healthy; encourage fluids, protein, calcium and vitamin D. Keep NPO status in mind: may go to surgery on short notice.'),
          C.diet('NPO', npoH, dietH, 'NPO after midnight for surgery; sips of water with essential medications until 2 hours before surgery.'),
          C.diet('Regular diet', dietH, undefined, 'Advance as tolerated once awake and not nauseated. High-protein, high-calcium meals; encourage fluids and fiber.'),
          C.activity(`Bed rest, strictly non-weight bearing ${sl} leg, leg elevated`, 0.5, ptPre, `${side} leg elevated on pillows above heart level (heel supported, nothing pressing on the calf or splint). Bedpan or bedside commode with assistance only.`),
          C.activity(`Non-weight bearing ${sl} leg; up with assistance and walker after PT teaching`, ptPre, orEnd, 'Hop-to transfers with walker only with PT or nursing assistance and gait belt; no weight on the splint. Call light within reach.'),
          C.activity(`Bed rest while nerve block is active, strictly non-weight bearing ${sl} leg`, orEnd, pod1, 'Elevate the leg above heart level. The block can hide pain and cause foot numbness and weakness: protect the heel and toes from pressure; no standing until the block has worn off and PT has seen the patient.'),
          C.activity(`Non-weight bearing ${sl} leg; up with assistance using walker or crutches`, pod1, undefined, 'Out of bed to chair for meals with gait belt and 1 staff; hop-to transfers only; no weight on the splint. Elevate the leg above heart level when seated or in bed.'),
          { name: `Neurovascular checks ${sl} foot and toes`, category: 'Nursing', frequency: 'Every hour x4, then every 2 hours until surgery; every 4 hours after surgery', startH: 0.5, instructions: `Check color, warmth, capillary refill, dorsalis pedis and posterior tibial pulses, sensation (especially between the first and second toes) and active toe movement; compare with the other foot. Toes must stay visible. Notify the surgeon STAT for pallor, cool foot, absent pulse, numbness, inability to move toes, or increasing pain.`, nursing: ['Sensation and capillary refill are earlier warning signs than loss of pulse.', 'After surgery the nerve block causes expected numbness and weakness for 12-24 hours: document the baseline and watch for changes outside that pattern.'] },
          { name: 'Compartment syndrome surveillance', category: 'Nursing', frequency: 'With every neurovascular check', startH: 0.5, instructions: 'Assess for the 6 Ps: pain out of proportion or increasing despite opioids, pain with passive toe stretching, pallor, paresthesia, pulselessness (late), paralysis (late), tense swollen calf or foot. Call the surgeon STAT; keep the leg at heart level (not higher), loosen or bivalve the splint/dressing per order, and avoid ice.', nursing: ['A rising opioid requirement is a warning sign.', 'The nerve block can mask compartment syndrome: report any pain that breaks through the block.', 'Compartment syndrome is a surgical emergency (fasciotomy within hours).'] },
          { name: 'Splint care and skin check', category: 'Nursing', frequency: 'Every shift', startH: 2.0, instructions: 'Keep the splint clean, dry and intact; do not get it wet, adjust it or insert objects underneath. Check skin at the splint edges and above for pressure, redness and blisters; pad the heel. Report foul odor, drainage, a splint that feels too tight or too loose, or a cold or blue foot.', nursing: ['Fracture blisters or tenting skin over the fracture delay surgery: document and report.', 'Use a pillow under the calf to float the heel and protect the Achilles area.'] },
          { name: 'Swelling and soft-tissue assessment (wrinkle sign)', category: 'Nursing', frequency: 'Every shift', startH: 12, completeH: orH - 8, instructions: 'Document degree of foot and toe swelling, bruising and fracture blisters. Surgeon decides when swelling is low enough for incisions (skin wrinkles when pinched in the exposed toes/foot or splint opened during dressing check).', nursing: ['Keep the leg elevated above heart level and apply ice around (not on) the splint 20 minutes on, 40 minutes off.'] },
          { name: 'Ice and elevation', category: 'Nursing', frequency: '20 minutes on, 40 minutes off while awake', startH: 2.0, instructions: 'Ice pack over the splint dressing (cloth barrier), never directly on skin. Elevate above heart level.', nursing: ['Skip ice and notify the surgeon if compartment syndrome or numbness is suspected.'] },
          { name: 'Sequential compression device, non-fractured leg', category: 'Nursing', frequency: 'Continuous when in bed', startH: 4, instructions: 'Apply SCD to the non-operative leg only; operative leg stays splinted and elevated. Encourage ankle pumps of the opposite ankle and early out-of-bed activity.' },
          { name: 'Fall prevention (non-weight bearing, opioids, nerve block)', category: 'Precautions', frequency: 'Continuous', startH: 2.0, instructions: 'High fall risk: non-weight-bearing on one leg, opioids, and later a nerve block. Bed alarm, gait belt, non-skid sock on the good foot, assist with every transfer, walker within reach, no unattended toileting.', nursing: ['Teach to use the walker or crutches on level ground first, and to never put weight on the splint when feeling steady.'] },
          { name: 'Type and screen', category: 'Laboratory', frequency: 'Once', startH: npoH, completeH: npoH + 1.2, instructions: 'Blood bank specimen; armband required.' },
          { name: 'Pre-operative checklist, consent and site verification', category: 'Nursing', frequency: 'Once', startH: orH - 6, completeH: orH - 0.3, instructions: `Verify consent, ID and allergy bands, ${sl} ankle marked by the surgeon, NPO status, last void, antibiotics within 60 minutes before incision, splint intact, jewelry removed.` },
          { name: 'Physical therapy evaluation and treatment (pre-operative teaching)', category: 'Consult / Therapy', frequency: 'Daily', startH: ptPre - 1, instructions: `Teach strict non-weight-bearing ${sl} leg with walker or crutches (hop-to gait), transfers, stairs and wheelchair use; check upper body strength and balance; recommend equipment (walker, knee scooter, wheelchair).`, by: 'surgeon' },
          { name: 'Occupational therapy evaluation and treatment', category: 'Consult / Therapy', frequency: 'Daily from POD 1', startH: orEnd + 2, instructions: 'ADL training while non-weight-bearing: bathing (cast protector, shower chair), dressing, toilet transfers, home safety.', by: 'surgeon' },
          { name: 'Case management consult: discharge planning', category: 'Consult / Therapy', frequency: 'Once', startH: 30, instructions: 'Assess home layout (stairs, bedroom/bathroom level), caregiver availability, DME (walker/crutches/knee scooter/wheelchair, shower chair), home health or outpatient PT; arrange short-term rehab if the patient cannot maintain non-weight-bearing safely.' },
          { name: 'Post-operative dressing and splint assessment', category: 'Nursing', frequency: 'Every shift', startH: orEnd, instructions: 'Assess the dressing under the splint for strikethrough (mark and time), the toes for color, warmth and swelling, and the skin around the splint for pressure. Do not remove the splint; keep it dry and elevated.', nursing: ['Expect numbness, then burning/throbbing pain when the block wears off: give oral analgesics before it fades.', 'Report fever above 101 F, foul odor or drainage that soaks through the splint.'] },
          C.incentive(unitH, undefined),
          { name: 'Transfusion threshold: Hgb below 8 g/dL or symptomatic', category: 'Nursing', frequency: 'Per lab result', startH: orH - 4, instructions: 'Notify the surgeon for Hgb below 8 g/dL, symptomatic tachycardia or hypotension.' }
        ],
        devices: [
          { deviceType: 'IV', type: 'Peripheral IV', location: 'Right forearm', siteMarker: 'rightForearm', gauge: '20 gauge', placeH: 0.4, infusing: 'Saline lock', status: 'Patent', assess: 'site clean, dry, intact; flushes easily' }
        ],
        assessments: [
          { fromH: 0, items: [['Musculoskeletal / Mobility', 'Mobility', `Non-weight bearing ${sl} leg; unable to stand or walk`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `${side} ankle deformed, swollen and bruised; tender over both malleoli; foot warm, dorsalis pedis and posterior tibial pulses palpable, capillary refill under 3 seconds, sensation and toe movement intact; calf soft`], ['Pain', 'Pain Location', `${side} ankle, sharp, throbbing, worse with any movement`], ['Skin', 'Skin', `Warm, dry; closed injury, no open wound; ecchymosis and swelling of the ${sl} ankle and foot, no blisters`], ['Skin', 'Braden Score', '20'], ['Safety', 'Delirium Screen (CAM)', 'Negative']] },
          { fromH: 3, items: [['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Sugar-tong/posterior splint intact; toes pink, warm, swollen; capillary refill under 3 seconds; sensation and toe movement intact; leg elevated on pillows`], ['Pain', 'Pain Location', `${side} ankle, throbbing, improved after reduction and splinting`], ['Musculoskeletal / Mobility', 'Mobility', 'Bed rest, leg elevated; non-weight bearing; assist of one for repositioning'], ['Skin', 'Skin', 'Splint edges without redness; heel padded; no fracture blisters']] },
          { fromH: 30, items: [['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Splint intact; toes warm, mildly swollen, cap refill under 3 seconds; sensation intact; swelling beginning to decrease; calf soft; no pain with passive toe stretch`], ['Cardiac', 'Edema', `${side} foot and toes 2+ non-pitting swelling, improving with elevation`], ['Pain', 'Pain Location', `${side} ankle, aching 4/10, throbbing when leg lowered`]] },
          { fromH: ptPre + 2, items: [['Musculoskeletal / Mobility', 'Mobility', `Hop-to transfer to chair with walker and contact guard from PT; NWB ${sl} leg maintained; 10 feet`], ['Safety', 'Fall Precautions', 'High risk: non-weight bearing, opioids; bed alarm on, call light in reach, gait belt for all transfers']] },
          { fromH: npoH, items: [['Safety', 'Delirium Screen (CAM)', 'Negative'], ['GI', 'Last BM / Flatus', 'Last BM yesterday; passing flatus'], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Splint intact; skin wrinkles on the dorsal foot (swelling subsided); toes warm and pink; cap refill under 3 seconds; sensation and toe movement intact`]] },
          { fromH: orEnd, items: [['Skin', 'Surgical Incisions', `${side} ankle incisions (lateral and medial) covered by dressing and posterior splint; dressing clean, dry, intact; no drain`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Nerve block active: foot numb and unable to move toes or ankle (expected); toes pink and warm, capillary refill under 3 seconds; splint intact and elevated`], ['Musculoskeletal / Mobility', 'Mobility', 'Bed rest until nerve block resolves; non-weight bearing'], ['Respiratory', 'Breath Sounds', 'Clear, diminished at bases'], ['Respiratory', 'Incentive Spirometer', '1,250 mL'], ['Pain', 'Pain Location', `${side} ankle, 1-2/10 with nerve block`], ['GI', 'Nausea / Vomiting', 'Mild nausea after anesthesia; relieved with ondansetron']] },
          { fromH: orEnd + 12, items: [['Pain', 'Pain Location', `${side} ankle, severe throbbing and burning 7/10 as block wore off; relieved by oxycodone and IV morphine, elevation and ice`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Block resolving: numbness decreasing and toes moving; toes pink and warm, cap refill under 3 seconds; sensation intact; splint intact and leg elevated; pain relieved by medication (no pain with passive toe stretch)`]] },
          { fromH: pod1 - 1, items: [['GI', 'Nausea / Vomiting', 'None'], ['Cardiac', 'Edema', `${side} toes and foot swollen above splint (expected); calf soft, non-tender`], ['Musculoskeletal / Mobility', `${side} Lower Extremity`, `Nerve block resolved: full sensation and active toe movement; toes pink and warm, capillary refill under 3 seconds; splint intact; no pain with passive toe stretch; calf soft and non-tender`], ['Skin', 'Surgical Incisions', 'Dressing clean, dry, intact under the splint; no strikethrough'], ['Respiratory', 'Incentive Spirometer', '1,500 mL']] },
          { fromH: ptH, items: [['Musculoskeletal / Mobility', 'Mobility', `Up with PT: hop-to gait 30 feet with walker and contact guard assist, strict NWB ${sl} leg; transfers to chair; practiced bed to commode`], ['Pain', 'Pain Location', `${side} ankle, aching 3-4/10, controlled with scheduled acetaminophen and PRN oxycodone`]] },
          { fromH: pod2 - 2, items: [['Musculoskeletal / Mobility', 'Mobility', `Hop-to gait 60 feet with walker, supervision, NWB ${sl} leg maintained; stairs practiced with PT`], ['Pain', 'Pain Location', `${side} ankle, 2-3/10`], ['GI', 'Last BM / Flatus', 'No BM for 3 days; Miralax given'], ['Respiratory', 'Incentive Spirometer', '1,750 mL']] },
          { fromH: pod3 - 2, items: [['Musculoskeletal / Mobility', 'Mobility', 'Independent with walker or crutches, NWB maintained; stairs with supervision'], ['GI', 'Last BM / Flatus', 'Moderate BM this morning'], ['Pain', 'Pain Location', `${side} ankle, 1-2/10`]] }
        ],
        io: [
          { fromH: 0, po: 240, urine: 300 },
          { fromH: 8, po: 480, urine: 420 },
          { fromH: npoH, po: 120, urine: 280 },
          { fromH: orH, po: 0, urine: 150 },
          { fromH: orEnd, po: 60, urine: 220 },
          { fromH: dietH + 2, po: 360, urine: 380 },
          { fromH: pod1, po: 480, urine: 400 },
          { fromH: pod2, po: 540, urine: 430 }
        ],
        therapy: {
          fromH: ptPre,
          assist: h => (h < orH ? 'contact guard assist' : h < pod2 ? 'contact guard assist' : 'supervision'),
          gait: h => (h < orH ? 'hop-to gait 10 feet with walker, non-weight bearing' : h < pod2 ? 'hop-to gait 30 feet with walker, non-weight bearing' : 'hop-to gait 60 feet with walker; stairs with supervision, non-weight bearing'),
          rec: `Home with home health or outpatient PT, rolling walker or crutches (and wheelchair/knee scooter), strict non-weight bearing ${sl} leg until follow-up (about 6 weeks); short-term rehab if unable to stay non-weight bearing, lives alone, or has multiple stairs`
        },
        discharge: { dispo: () => 'Home with home health or outpatient PT and equipment (non-weight-bearing); short-term rehab if unsafe at home', estimate: 'post-operative day 1-2 (hospital day 4-5) once pain is controlled on oral medication, neurovascularly intact, and safe non-weight-bearing mobility and stairs are demonstrated' },
        stages: ankleStages(ctx, { fx, side, sl, tri, orH, orEnd, orTime, npoH, unitH, ptPre, ptH, pod1, pod2, pod3 }),
        stickies: [
          { title: 'Neurovascular / compartment watch', body: 'Neurovascular checks every 2 hours. Pain out of proportion, pain with passive toe stretch, numbness, a cool pale foot or tense swelling: call the surgeon STAT. Keep the leg at heart level (not higher) if compartment syndrome is suspected.' },
          { title: 'Strict non-weight bearing', body: 'No weight on the operative leg. Walker/crutches with gait belt and assist; keep elevated above heart level; never lean on the splint.', fromH: 0 },
          { title: 'VTE prevention', body: 'Heparin SQ before surgery (held before incision); enoxaparin starts 12 hours after surgery. SCD on the non-operative leg; teach ankle pumps of the good ankle.', fromH: 6 },
          { title: 'Nerve block rebound pain', body: 'Popliteal block lasts 12-24 hours; severe pain may return suddenly. Give oral analgesics before it fades and report pain that is unrelieved.', fromH: orEnd }
        ],
        objectives: ['Perform neurovascular checks and compartment syndrome surveillance for a patient with a splinted ankle fracture; recognize the 6 Ps.', 'Implement splint care, elevation, ice and non-weight-bearing precautions and use multimodal analgesia safely (opioid, acetaminophen, nerve block).', 'Prepare a patient for ORIF: swelling assessment, NPO, antibiotic timing, consent and site verification; provide post-operative care for a posterior splint and nerve block.', 'Teach safe non-weight-bearing mobility with a walker or crutches and coordinate PT/OT, VTE prophylaxis and discharge planning.']
      };
      return spec;
    }
  };

  function ankleStages(ctx, p) {
    const { fx, side, sl, tri, orH, orEnd, orTime, npoH, unitH, ptPre, ptH, pod1, pod2, pod3 } = p;
    const st = [];
    st.push({
      fromH: 0, id: 'ed', label: `${side} ${fx} ankle fracture: splinted, pain control`,
      problem: `Closed displaced ${fx} fracture of the ${sl} ankle after a twisting fall; splinted; surgery planned once swelling subsides.`,
      subj: `Pain 9/10 on arrival, now 4/10 after reduction, splint and IV morphine. Swelling and bruising are increasing. Toes feel normal; no numbness or tingling. No head injury, chest pain or dizziness before the fall.`,
      assess: `${tri ? 'Trimalleolar' : 'Bimalleolar'} ankle fracture with talar subluxation, reduced and splinted; neurovascularly intact; closed injury; hemodynamically stable. ORIF delayed because of swelling.`,
      plan: ['Splint intact, strict elevation above heart level, ice around splint; non-weight bearing.', 'Neurovascular and compartment checks every hour x4, then every 2 hours; hold if the splint feels tight.', 'Scheduled acetaminophen; oral oxycodone for moderate pain, IV morphine for severe pain only.', 'Heparin SQ for VTE prevention; SCD on the other leg; type and screen before surgery.', 'Orthopedic plan: ORIF in 2-3 days when the skin wrinkles; PT teaching for walker use.'],
      nursing: [`Splint dry and intact; ${sl} toes pink and warm, capillary refill under 3 seconds; sensation and movement intact.`, 'Leg elevated on pillows above heart level; ice applied over splint.', 'Pain 4/10; no fracture blisters.', 'Fall precautions explained; bed alarm on.'],
      teach: ['Reviewed why elevation and non-weight bearing are needed, when to call (worsening pain, numbness, cold or blue toes), and the surgery plan.'],
      dispo: 'Anticipate 3-5 days: surgery on hospital day 3, then home with PT.',
      objectives: ['Assess neurovascular status and pain after ED splinting of an ankle fracture.'],
      stickies: [{ title: 'Waiting for surgery', body: 'Strict elevation, ice around splint, neurovascular and compartment checks. Expect ORIF when swelling subsides (about hospital day 3).' }]
    });
    st.push({
      fromH: 24, id: 'swelling', label: 'Awaiting surgery: swelling subsiding',
      problem: `${side} ${fx} ankle fracture, hospital day 2: elevated and splinted; waiting for swelling to resolve before ORIF.`,
      subj: 'Throbbing 4-5/10 when the leg is lowered, relieved by elevation and medication. Bored and anxious about surgery. No numbness or tingling in the toes. No fever.',
      assess: 'Swelling decreasing slowly; no fracture blisters or compartment syndrome; neurovascularly intact; afebrile.',
      plan: ['Continue elevation and ice; surgeon to reassess skin wrinkle sign this evening.', 'PT teaches non-weight-bearing transfers and walker use before surgery.', 'Enoxaparin or heparin prophylaxis; NPO after midnight if cleared for tomorrow morning.', 'Case management: begin discharge planning and equipment.'],
      nursing: ['Toes warm and pink; cap refill under 3 seconds; calf soft and non-tender.', 'Splint intact; skin at edges without redness; heel padded.', 'Pain controlled with scheduled acetaminophen and PRN oxycodone.', 'Hop-to transfer to chair with PT; NWB maintained.'],
      teach: ['Non-weight bearing with walker, why we elevate, signs of compartment syndrome and blood clots, and pre-operative NPO rules.'],
      dispo: 'ORIF planned for hospital day 3 if swelling allows.',
      objectives: ['Recognize and report early signs of compartment syndrome while waiting for swelling to resolve.']
    });
    st.push({
      fromH: npoH, id: 'preop', label: `Pre-operative: NPO, ORIF this morning`,
      problem: `${side} ${fx} ankle fracture; swelling subsided; NPO, awaiting ORIF today (about ${orTime}).`,
      subj: 'Pain 3/10 at rest. Slept fairly. Nervous about surgery and about getting around afterward. No nausea or fever.',
      assess: 'Soft tissue now suitable for incision (skin wrinkles); Hgb and creatinine acceptable; cleared for surgery.',
      plan: ['NPO; maintenance IV fluids; essential meds with sips.', `Popliteal and saphenous nerve block, general anesthesia; cefazolin 30-60 minutes before incision (about ${orTime}).`, 'Hold heparin 1 hour before incision; pre-operative checklist and consent.'],
      nursing: ['NPO since midnight; LR infusing at 75 mL/hr.', 'Splint intact; neurovascular checks unchanged; pain 3/10.', 'Pre-op checklist and consent verified; site marked.'],
      teach: ['What to expect in PACU: numb leg from the block, splint, elevation, walker teaching after surgery, and rebound pain when the block wears off.'],
      dispo: 'Surgery today.',
      stickies: [{ title: 'To OR', body: `OR about ${orTime}: NPO, cefazolin before incision, consent, ${sl} ankle marked, hold heparin SQ per order.` }]
    });
    st.push({
      fromH: orEnd, id: 'postop0', label: 'Post-operative day 0: PACU, nerve block active',
      problem: `Status post ${sl} ankle ORIF (POD 0), posterior splint, popliteal block.`,
      subj: 'Awake in recovery; foot feels numb and heavy. Mild nausea. Pain 1-2/10 now but was told to expect more when the block fades.',
      assess: `POD 0 ${sl} ankle ORIF; stable; expected block-related numbness; neurovascularly intact distal to the splint.`,
      plan: ['Cefazolin x 24 hours; scheduled acetaminophen; oral oxycodone before the block wears off; IV morphine only for severe breakthrough pain.', 'Enoxaparin 12 hours after surgery; SCD on the non-operative leg.', 'Elevate above heart level; ice around splint; neurovascular checks every 4 hours.', 'Regular diet when awake; NWB; PT tomorrow.'],
      nursing: ['Splint and dressing intact; toes pink and warm, capillary refill under 3 seconds; numbness expected from the block.', 'Leg elevated; heel floated.', 'Nausea relieved with ondansetron; diet advancing.', 'Bed alarm on; no weight on the leg.'],
      teach: ['Block wears off in 12-24 hours: take oral pain medication early; keep elevated; report numbness that does not improve, cold toes or severe pain.'],
      dispo: 'Expect 1-2 more days; home with PT likely.'
    });
    st.push({
      fromH: pod1, id: 'pod1', label: 'Post-operative day 1: first PT session',
      problem: `POD 1 ${sl} ankle ORIF; block resolved; first PT session; non-weight bearing.`,
      subj: 'Severe pain overnight when the block wore off (7/10), now 4/10 with oxycodone and acetaminophen. Slept poorly. Passed gas, no BM. Worried about managing at home.',
      assess: 'Recovering as expected. Hgb about 1.5 g/dL below admission without symptoms; temperature up to 99.4 F expected on POD 1; no signs of compartment syndrome, DVT or infection; splint intact.',
      plan: ['IV morphine stopped; continue acetaminophen scheduled and oxycodone PRN; elevation and ice.', 'PT: walker or crutches, transfers, stairs practice; OT: ADLs while NWB.', 'Daily CBC/BMP; enoxaparin continues; bowel regimen.', 'Case management: DME, home health, ortho follow-up in 2 weeks; discharge today or tomorrow.'],
      nursing: ['Neurovascular checks every 4 hours unchanged; toes warm, pink, moving; cap refill under 3 seconds.', 'Splint intact and dry; heel padded; leg elevated.', 'Up with PT with walker, NWB maintained; fall precautions.', 'Enoxaparin given; abdominal site rotated.'],
      teach: ['Non-weight-bearing technique, splint care and keeping it dry, elevation and ice, enoxaparin injection teach-back, and warning signs (fever, drainage, cold or blue toes, calf pain).'],
      dispo: 'Discharge home today or tomorrow if mobility and stairs are safe.'
    });
    st.push({
      fromH: pod2, id: 'pod2', label: 'Post-operative day 2: discharge-ready',
      problem: `POD 2 ${sl} ankle ORIF; meeting discharge goals.`,
      subj: 'Pain 2-3/10 on acetaminophen and occasional oxycodone. Walked 60 feet with walker and practiced stairs. No BM for 3 days.',
      assess: 'Safe NWB mobility demonstrated; pain controlled on oral medication; afebrile; neurovascularly intact; constipation on opioids.',
      plan: ['Discharge home with home health/outpatient PT, walker/crutches and splint instructions.', 'Enoxaparin or aspirin for VTE prophylaxis per surgeon while NWB; wean oxycodone; bowel regimen.', 'Follow-up with orthopedics in about 2 weeks for suture removal and conversion to cast/boot.'],
      nursing: ['Splint intact; toes pink and warm; cap refill under 3 seconds; pain 2-3/10.', 'Eating 75% of meals; encouraged fluids and fiber; Miralax given.', 'Discharge teaching and equipment checked.'],
      teach: ['Discharge teach-back: strict NWB, splint care, elevation, medications and enoxaparin, fall prevention, and when to call (fever above 101 F, drainage through splint, cold or blue toes, severe pain, calf swelling, chest pain, shortness of breath).'],
      dispo: 'Discharge home today.',
      stickies: [{ title: 'Discharge today', body: 'Discharge teach-back, prescriptions, walker/crutches delivered, home health PT referral, ortho follow-up; remove IV.' }]
    });
    st.push({
      fromH: pod3, id: 'ready', label: 'Medically ready; discharge delayed',
      problem: `POD 3 or later ${sl} ankle ORIF; stable, awaiting a safe discharge plan.`,
      subj: 'Pain 1-2/10. Walking with the walker and NWB. Frustrated by waiting.',
      assess: 'Recovered; any remaining stay is driven by disposition (equipment, home health or rehab placement, caregiver availability), not acute illness.',
      plan: ['Case management finalizing home health or rehab acceptance.', 'Continue PT, enoxaparin and bowel regimen; watch for DVT, falls, constipation and skin breakdown at the splint edges.'],
      nursing: ['Vital signs stable; splint intact; toes warm and pink.', 'Out of bed to chair with walker; NWB maintained.'],
      teach: ['Discharge teaching completed; reinforce NWB and warning signs.'],
      dispo: 'Discharge when equipment and services are confirmed.'
    });
    return st;
  }
})();
