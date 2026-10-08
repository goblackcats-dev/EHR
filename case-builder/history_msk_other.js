/* Medical-history modules: Musculoskeletal / Rheumatologic, Skin / Wounds, Eye / Ear / Other.
   Registered with NS.HX.add (see history.js). Weekly / every-14-day drugs (methotrexate, alendronate, adalimumab) are not
   representable by the engine FREQ table, so they are added as a one-time, future-dated home order whose frequency text states
   the real interval, with a high-alert caution and a home-medication note (see periodic()). */
(() => {
  const HX = NS.HX, U = NS.util;
  const { home, order, comorb, assess, addLabs, sticky, heldNote } = HX.helpers;
  const MSK = 'Musculoskeletal / Rheumatologic', SKIN = 'Skin / Wounds', EYE = 'Eye / Ear / Other';

  // ---------- local helpers ----------
  const hasMed = (spec, k) => spec.meds.some(m => m.key === k);
  const homeOnce = (spec, m) => { if (!hasMed(spec, m.key)) home(spec, m); };
  const orderOnce = (spec, o) => { if (!spec.orders.some(x => x.name === o.name && x.category === o.category)) order(spec, o); };
  const stickyOnce = (spec, t, b) => { if (!spec.stickies.some(s => s.title === t)) sticky(spec, t, b); };
  const baseLab = (spec, code, v, how) => {
    const cur = spec.labBase[code];
    if (cur === undefined || how === 'set') spec.labBase[code] = v;
    else if (how === 'min') spec.labBase[code] = Math.min(cur, v);
    else if (how === 'max') spec.labBase[code] = Math.max(cur, v);
  };
  const pain = (spec, n) => spec.vitalAdjust.push({ pain: n });
  const boost = (spec, n) => { spec.fallRiskBoost = (spec.fallRiskBoost || 0) + n; };
  const anyHx = (ctx, re) => [...ctx.hx].some(k => re.test(k));
  const onAnticoag = spec => spec.meds.some(m => /anticoagulant|antiplatelet/i.test(m.cls || '') && !/prophylaxis/i.test(m.cls || ''));
  const NSAID_BAD_DX = ['ugib', 'aki', 'nstemi', 'stemi', 'chf', 'pe', 'afib_rvr', 'stroke', 'hyponatremia'];
  const nsaidSafe = (ctx, spec) => ctx.renal === 'none' && !onAnticoag(spec) && !NSAID_BAD_DX.includes(spec.primaryKey) && !ctx.has('hf') && !ctx.has('cad') && !ctx.has('ckd4');
  // remove NSAIDs that another profile added when CKD or an anticoagulant makes them unsafe, and add the avoidance order
  const noNsaids = (ctx, spec, why) => {
    const out = spec.meds.filter(m => /NSAID/i.test(m.cls || '') || /ketorolac|ibuprofen|naproxen|meloxicam|celecoxib|diclofenac (tablet|gel)/i.test(m.name));
    if (out.length) { spec.meds = spec.meds.filter(m => !out.includes(m)); spec.applied.push(`NSAID (${out.map(m => m.name.split(' ')[0]).join(', ')}) omitted because of ${why}.`); }
    orderOnce(spec, { name: 'Avoid NSAIDs (ibuprofen, ketorolac, naproxen)', category: 'Nursing', frequency: 'Continuous', instructions: `No NSAIDs: ${why}. Use acetaminophen, topical lidocaine, heat or ice instead. Question any NSAID order and notify the provider.`, startH: 3, nursing: ['NSAIDs raise bleeding risk with anticoagulants and can cause acute kidney injury in CKD.'] });
  };
  const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // time (h) of the first 09:00 on weekday `dow` after the simulation window, so the chart shows the drug as an active home order that is not due now
  const nextDoseH = (ctx, dow) => {
    const admitMs = U.parse(ctx.admit), mid = U.parse(U.dateOnly(ctx.admit) + ' 00:00');
    for (let d = 0; d < 60; d++) { const ms = mid + d * 86400000 + 9 * 3600000, h = (ms - admitMs) / 3600000; if (h > ctx.windowEnd + 0.5 && new Date(ms).getUTCDay() === dow) return h; }
    return ctx.windowEnd + 24;
  };
  // Weekly / q14-day home drug: a one-time future-dated order with the real interval in the frequency text.
  const periodic = (ctx, spec, m, dow, every) => {
    const h = nextDoseH(ctx, dow), when = U.mdy(ctx.ts(h));
    homeOnce(spec, Object.assign({ freq: 'once', startH: h, freqText: `${every} (${DOW[dow]}s) - next dose ${when}`, highAlert: true }, m));
    return { h, when, day: DOW[dow] };
  };
  const ACUTE_HOLD = ['sepsis', 'pneumonia', 'cellulitis', 'aki', 'ugib', 'appendicitis', 'sbo', 'cholecystitis', 'diverticulitis', 'pancreatitis', 'hip_fracture'];
  const acute = spec => ACUTE_HOLD.includes(spec.primaryKey);
  const steroid = (ctx, spec, mg, why) => {
    homeOnce(spec, {
      key: 'prednisone', name: 'prednisone tablet', dose: `${mg} mg`, route: 'Oral', freq: 'daily', at: ['0800'], cls: 'Corticosteroid',
      info: 'Give with food in the morning. Do NOT stop abruptly (adrenal suppression). If NPO or not absorbing, notify the provider for an IV steroid equivalent. Raises glucose and BP, masks fever and infection.',
      monitor: ['Glucose', 'BP'], hold: 'Do not hold without a provider order; call the provider if the patient is NPO or vomiting.',
      sips: true, variants: { npo: { name: 'methylprednisolone (SOLU-MEDROL) injection', dose: `${Math.max(2, Math.round(mg * 0.8))} mg`, route: 'IV' } }, indication: why
    });
    baseLab(spec, 'Glucose', mg >= 10 ? 128 : 112, 'max');
    baseLab(spec, 'WBC', mg >= 10 ? 11.2 : 9.4, 'max');
    orderOnce(spec, { name: 'Chronic steroid precautions', category: 'Nursing', frequency: 'Continuous', instructions: 'Long-term corticosteroid user: never skip doses; provider to consider stress-dose steroids (hydrocortisone) for hypotension, sepsis or surgery. Check glucose with meals while hyperglycemic; watch for infection (fever may be blunted), GI upset and mood change.', startH: 3, nursing: ['Hypotension unresponsive to fluids in a steroid-dependent patient may be adrenal insufficiency: notify the provider.'] });
  };
  const immuno = (spec, why) => orderOnce(spec, { name: 'Immunosuppression / infection precautions', category: 'Precautions', frequency: 'Continuous', instructions: `${why}: strict hand hygiene, no sick visitors, no live vaccines, monitor closely for infection. Fever and WBC response may be blunted: report temperature 100.4 F or higher, new cough, dysuria, wound drainage or confusion.`, startH: 3, nursing: ['Infection can progress quickly in immunosuppressed patients; escalate early.'] });
  const moveIVs = (spec, avoid) => {
    const keep = avoid === 'Left' ? 'Right' : 'Left', re = new RegExp('^' + avoid, 'i'), mk = new RegExp('^' + avoid.toLowerCase());
    spec.devices.forEach(d => { if (d.deviceType === 'IV' && re.test(d.location || '')) { d.location = d.location.replace(re, keep); if (d.siteMarker) d.siteMarker = d.siteMarker.replace(mk, keep.toLowerCase()); } });
  };

  HX._mo = { hasMed, homeOnce, orderOnce, stickyOnce, baseLab, pain, boost, anyHx, onAnticoag, nsaidSafe, noNsaids, periodic, acute, steroid, immuno, moveIVs, DOW, MSK, SKIN, EYE };

  // ============================== MUSCULOSKELETAL / RHEUMATOLOGIC ==============================
  HX.add('rheumatoid_arthritis', {
    label: 'Rheumatoid Arthritis', group: MSK, aliases: ['ra', 'rheumatoid', 'methotrexate', 'dmard'], order: 60,
    desc: 'Weekly methotrexate (dose-day safety) with folic acid, hydroxychloroquine and low-dose prednisone; infection risk, mild anemia, raised ESR/CRP.',
    apply(ctx, spec) {
      const mtx = [10, 12.5, 15, 17.5, 20][ctx.age % 5], p = periodic(ctx, spec, {
        key: 'methotrexate', name: 'methotrexate (TREXALL) tablet', dose: `${mtx} mg`, route: 'Oral', cls: 'DMARD / antimetabolite (immunosuppressant)',
        info: 'WEEKLY drug: ONE dose on ONE day each week. Daily dosing has caused fatal toxicity (bone marrow, mucositis, liver). Verify the dose day and last dose with pharmacy and the patient before giving. Check CBC, creatinine and ALT.',
        monitor: ['WBC', 'Plt', 'Cr', 'LFT'], hold: 'HOLD and notify provider for fever or infection, WBC below 3.0, platelets below 100, rising creatinine, mouth sores, new cough or dyspnea. Never give daily.',
        renal: { ckd3: { avoid: true }, esrd: { avoid: true } }, indication: 'Rheumatoid arthritis (home medication, ONCE WEEKLY)'
      }, [0, 1, 5, 6, 3][ctx.age % 5], 'ONCE WEEKLY');
      heldNote(spec, `Methotrexate ${mtx} mg is taken ONCE WEEKLY (${p.day}); the chart shows the next dose (${p.when}) and it is NOT a daily drug. Hold during acute infection, AKI or cytopenias until the provider reviews.`);
      homeOnce(spec, { key: 'folic_acid', name: 'folic acid tablet', dose: '1 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B9', info: 'Reduces methotrexate side effects (mouth sores, nausea, cytopenias).', holdIf: ['npo'], indication: 'Rheumatoid arthritis (methotrexate support)' });
      homeOnce(spec, { key: 'hydroxychloroquine', name: 'hydroxychloroquine (PLAQUENIL) tablet', dose: '200 mg', route: 'Oral', freq: 'BID', cls: 'Antimalarial DMARD', info: 'Give with food. Can prolong the QT interval: review ECG/QTc and other QT drugs (ondansetron, azithromycin, fluoroquinolones). Annual eye exam at home.', monitor: ['HR'], holdIf: ['npo'], indication: 'Rheumatoid arthritis' });
      steroid(ctx, spec, [5, 5, 7.5, 5, 10][ctx.age % 5], 'Rheumatoid arthritis (chronic low-dose steroid)');
      immuno(spec, 'Immunosuppressed (methotrexate + prednisone)');
      baseLab(spec, 'ESR', 38, 'max'); baseLab(spec, 'CRP', 14, 'max'); baseLab(spec, 'Hemoglobin', ctx.female ? 11.4 : 12.4, 'min');
      pain(spec, 1);
      if (!nsaidSafe(ctx, spec)) noNsaids(ctx, spec, 'CKD, anticoagulant or a cardiac/renal/bleeding condition');
      assess(spec, [['Musculoskeletal / Mobility', 'Joint Assessment', 'Symmetric swelling and tenderness of MCP/PIP joints and wrists, ulnar deviation, morning stiffness about 45 minutes; no hot effusion'], ['Pain', 'Pain Location', 'Bilateral hands and wrists (chronic joint pain)'], ['Skin', 'Skin', 'Warm, dry, intact; thin skin with forearm bruising (steroid)']]);
      comorb(spec, { key: 'ra', problem: 'Rheumatoid arthritis', details: `Seropositive RA on methotrexate ${mtx} mg once weekly, folic acid, hydroxychloroquine and low-dose prednisone.`, pmh: 'Rheumatoid arthritis (on methotrexate weekly, hydroxychloroquine, prednisone)',
        plan: () => [acute(spec) ? 'Methotrexate (WEEKLY) held during acute illness; resume only when the provider confirms infection/AKI resolved.' : 'Methotrexate is a WEEKLY drug: verify dose day with pharmacy before any dose; not due today.', 'Continue folic acid, hydroxychloroquine and prednisone (do not stop steroid abruptly; stress-dose if septic/hypotensive).', 'Immunosuppression precautions; monitor CBC and creatinine.', 'Avoid NSAIDs if CKD or anticoagulated.'] });
    }
  });

  HX.add('lupus_sle', {
    label: 'Systemic Lupus Erythematosus', group: MSK, aliases: ['lupus', 'sle', 'hydroxychloroquine'], order: 60,
    desc: 'Hydroxychloroquine, prednisone and an immunosuppressant; mild cytopenias, possible renal involvement, photosensitivity and infection-vs-flare caution.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'hydroxychloroquine', name: 'hydroxychloroquine (PLAQUENIL) tablet', dose: '200 mg', route: 'Oral', freq: 'BID', cls: 'Antimalarial', info: 'Give with food. Core lupus drug: avoid stopping. QT-prolonging: review QTc with ondansetron/azithromycin/fluoroquinolones.', monitor: ['HR'], holdIf: ['npo'], indication: 'Systemic lupus erythematosus' });
      steroid(ctx, spec, [5, 7.5, 10, 5][ctx.age % 4], 'Systemic lupus erythematosus (chronic steroid)');
      if (ctx.age % 2) homeOnce(spec, { key: 'mycophenolate', name: 'mycophenolate mofetil (CELLCEPT) tablet', dose: '1,000 mg', route: 'Oral', freq: 'BID', cls: 'Immunosuppressant', info: 'Teratogenic. Monitor CBC (leukopenia) and for infection. Do not crush. Hold and call for ANC drop, severe diarrhea or fever.', monitor: ['WBC', 'Plt'], hold: 'Hold and notify provider for fever, WBC below 3.0 or platelets below 100.', holdIf: ['npo'], indication: 'Lupus (immunosuppressant)' });
      else homeOnce(spec, { key: 'azathioprine', name: 'azathioprine (IMURAN) tablet', dose: '100 mg', route: 'Oral', freq: 'daily', cls: 'Immunosuppressant', info: 'Give with food. Monitor CBC and LFTs. Dose interacts with allopurinol (toxicity).', monitor: ['WBC', 'Plt', 'LFT'], hold: 'Hold and notify provider for fever, WBC below 3.0 or platelets below 100.', holdIf: ['npo'], indication: 'Lupus (immunosuppressant)' });
      immuno(spec, 'Immunosuppressed (lupus therapy)');
      baseLab(spec, 'WBC', 4.4, 'min'); baseLab(spec, 'Platelets', 150, 'min'); baseLab(spec, 'Hemoglobin', ctx.female ? 11.2 : 12.2, 'min'); baseLab(spec, 'ESR', 42, 'max'); baseLab(spec, 'Albumin', 3.5, 'min');
      baseLab(spec, 'Creatinine', ctx.female ? 1.0 : 1.2, 'max');
      orderOnce(spec, { name: 'Monitor renal function and urine protein (lupus nephritis)', category: 'Nursing', frequency: 'Daily', instructions: 'Trend creatinine, urine output and BP. Report new foamy/dark urine, edema, BP above 150/90 or rising creatinine. Avoid nephrotoxins (NSAIDs, contrast when possible).', startH: 3 });
      orderOnce(spec, { name: 'Photosensitivity precautions', category: 'Nursing', frequency: 'Continuous', instructions: 'Keep skin covered and window shades down; sunlight and some drugs (sulfa antibiotics) can trigger flares. Check allergy list: sulfa drugs may flare lupus.', startH: 3 });
      if (!nsaidSafe(ctx, spec)) noNsaids(ctx, spec, 'renal disease, anticoagulant or a cardiac/renal condition');
      assess(spec, [['Skin', 'Skin', 'Warm, dry, intact; faint malar erythema, no active oral ulcers or discoid lesions'], ['Musculoskeletal / Mobility', 'Joint Assessment', 'Mild bilateral hand and wrist arthralgia without effusion'], ['Pain', 'Pain Location', 'Mild joint aching, hands and knees']]);
      comorb(spec, { key: 'sle', problem: 'Systemic lupus erythematosus', details: 'SLE on hydroxychloroquine, prednisone and an immunosuppressant; mild baseline cytopenias; renal function monitored.', pmh: 'Systemic lupus erythematosus (hydroxychloroquine, prednisone, immunosuppressant)',
        plan: () => ['Continue hydroxychloroquine and prednisone without interruption; stress-dose steroids if hypotensive/septic.', 'Fever may be infection OR flare: culture first, notify provider; immunosuppression precautions.', 'Trend CBC, creatinine and urine output (possible lupus nephritis); avoid NSAIDs/sulfa.'] });
    }
  });

  HX.add('osteoarthritis', {
    label: 'Osteoarthritis', group: MSK, aliases: ['oa', 'djd', 'degenerative joint disease', 'knee arthritis'], order: 70,
    desc: 'Acetaminophen and topical therapy; oral NSAIDs omitted with CKD, anticoagulants or cardiac disease; chronic knee/hip pain and mobility limits.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'acetaminophen', name: 'acetaminophen (TYLENOL) tablet', dose: ['650 mg', '1,000 mg', '650 mg'][ctx.age % 3], route: 'Oral', freq: 'TID', cls: 'Non-opioid analgesic', info: 'Maximum 3 g per 24 hours from all sources. Check for other acetaminophen-containing products.', indication: 'Osteoarthritis pain (home medication)' });
      if (nsaidSafe(ctx, spec)) homeOnce(spec, { key: 'diclofenac_gel', name: 'diclofenac 1% (VOLTAREN) gel', dose: '4 g to each affected knee', route: 'Topical', freq: 'QID', cls: 'Topical NSAID', info: 'Measure with the dosing card; wash hands after. Do not combine with oral NSAIDs. Low systemic absorption.', avoid: ['NSAID', 'ibuprofen'], indication: 'Knee osteoarthritis' });
      else { homeOnce(spec, { key: 'lidocaine_patch', name: 'lidocaine 4% (LIDODERM) patch', dose: '1 patch to the painful knee/hip', route: 'Topical', freq: 'daily', at: ['0900'], cls: 'Topical anesthetic', info: 'Apply to intact skin for 12 hours on, 12 hours off. Remove old patch first.', indication: 'Osteoarthritis pain (NSAID-free)' }); noNsaids(ctx, spec, 'CKD, anticoagulant or cardiac/renal/bleeding condition'); }
      pain(spec, 1);
      orderOnce(spec, { name: 'Joint protection and mobility support', category: 'Activity', frequency: 'Continuous', instructions: 'Assist with first steps after rest; allow extra time; warm packs to stiff joints as needed. PT evaluation for gait and assistive device.', startH: 3 });
      assess(spec, [['Musculoskeletal / Mobility', 'Joint Assessment', 'Bony enlargement and crepitus of both knees, no warmth or effusion; stiffness after rest less than 30 minutes'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent with mildly antalgic gait; uses cane'], ['Pain', 'Pain Location', 'Bilateral knees, worse with weight bearing']]);
      comorb(spec, { key: 'oa', problem: 'Osteoarthritis', details: 'Chronic knee/hip osteoarthritis managed with acetaminophen and topical therapy.', pmh: 'Osteoarthritis (knees)',
        plan: () => [nsaidSafe(ctx, spec) ? 'Acetaminophen scheduled with topical diclofenac; avoid oral NSAIDs while inpatient.' : 'Acetaminophen scheduled plus lidocaine patch; NO NSAIDs (CKD/anticoagulant/cardiac-bleeding risk).', 'PT for mobility and assistive device; early ambulation.'] });
    }
  });

  HX.add('osteoporosis', {
    label: 'Osteoporosis', group: MSK, aliases: ['bone loss', 'osteopenia', 'alendronate', 'fosamax', 'fragility fracture'], order: 60,
    desc: 'Weekly alendronate (upright 30 min), calcium and vitamin D; fracture and fall precautions, gentle handling.',
    apply(ctx, spec) {
      const p = periodic(ctx, spec, { key: 'alendronate', name: 'alendronate (FOSAMAX) tablet', dose: '70 mg', route: 'Oral', cls: 'Bisphosphonate',
        info: 'WEEKLY drug. Give first thing in the morning with a full glass (6-8 oz) of plain water, 30 minutes before food, drink or other meds. Patient must stay UPRIGHT (sitting or standing) for at least 30 minutes after. Do not give if unable to sit upright or swallow.',
        hold: 'Hold and notify provider if the patient cannot sit upright 30 minutes, has dysphagia/esophageal disease, or is hypocalcemic.', holdIf: ['npo'], renal: { ckd3: { avoid: true }, esrd: { avoid: true } }, indication: 'Osteoporosis (home medication, ONCE WEEKLY)' }, [0, 1, 3, 6, 2][ctx.age % 5], 'ONCE WEEKLY');
      heldNote(spec, `Alendronate 70 mg is taken ONCE WEEKLY (${p.day}); next dose ${p.when}. Often held while on bedrest, NPO or unable to sit upright 30 minutes.`);
      homeOnce(spec, { key: 'calcium_supp', name: 'calcium carbonate (OS-CAL) tablet', dose: '500 mg elemental calcium', route: 'Oral', freq: 'BID', at: ['0900', '1700'], cls: 'Mineral supplement', info: 'Give with meals. Separate from levothyroxine and quinolones by 4 hours. May cause constipation.', holdIf: ['npo'], indication: 'Osteoporosis' });
      homeOnce(spec, { key: 'vitamin_d3', name: 'cholecalciferol (vitamin D3) tablet', dose: ['1,000 units', '2,000 units'][ctx.age % 2], route: 'Oral', freq: 'daily', cls: 'Vitamin D', holdIf: ['npo'], indication: 'Osteoporosis' });
      boost(spec, 2);
      baseLab(spec, '25-OH Vitamin D', 28, 'min'); baseLab(spec, 'Calcium', 9.1, 'set');
      addLabs(spec, 0.5, ['25-OH Vitamin D']);
      orderOnce(spec, { name: 'Fall precautions (high risk) and fracture precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Osteoporosis: low bed, call light in reach, non-skid footwear, bed/chair alarm as needed, assist with every transfer. Handle gently: log-roll, no pulling on limbs, support joints during repositioning.', startH: 3, nursing: ['Report new back pain, deformity or pain after minor movement (possible vertebral or hip fracture).'] });
      assess(spec, [['Musculoskeletal / Mobility', 'Posture', 'Mild thoracic kyphosis; no spinal tenderness; history of height loss'], ['Safety', 'Fall Precautions', 'High risk (osteoporosis): bed low, call light in reach, non-skid socks, assist x1']]);
      comorb(spec, { key: 'osteoporosis', problem: 'Osteoporosis', details: 'Bone density in the osteoporotic range; on weekly alendronate with calcium and vitamin D.', pmh: 'Osteoporosis (alendronate, calcium, vitamin D)',
        plan: () => ['Weekly alendronate not due today; upright 30 minutes with a full glass of water when given; held if NPO/bedrest.', 'Calcium and vitamin D continued; fall and fracture precautions.'] });
    }
  });

  HX.add('gout', {
    label: 'Gout', group: MSK, aliases: ['hyperuricemia', 'allopurinol', 'colchicine', 'podagra'], order: 70,
    desc: 'Allopurinol and low-dose colchicine (renally dosed), raised uric acid, NSAID avoidance with CKD/anticoagulants, flare precautions.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'allopurinol', name: 'allopurinol (ZYLOPRIM) tablet', dose: ['100 mg', '200 mg', '300 mg'][ctx.age % 3], route: 'Oral', freq: 'daily', cls: 'Xanthine oxidase inhibitor', info: 'Continue through a flare; do not start/stop in the acute phase without the provider. Report rash (stop and call: hypersensitivity). Dose-reduced in kidney disease.', monitor: ['Cr'], holdIf: ['npo'],
        renal: { ckd3: { dose: '100 mg', note: 'Allopurinol limited to 100 mg for reduced kidney function.' }, esrd: { dose: '100 mg', note: 'Allopurinol 100 mg given after dialysis on dialysis days.' } }, indication: 'Gout (urate lowering)' });
      homeOnce(spec, { key: 'colchicine', name: 'colchicine (COLCRYS) tablet', dose: '0.6 mg', route: 'Oral', freq: 'daily', cls: 'Anti-inflammatory (gout prophylaxis)', info: 'Report diarrhea, muscle pain/weakness or numbness. Toxic with clarithromycin, diltiazem, verapamil and in kidney disease.', monitor: ['WBC', 'Cr'], holdIf: ['npo'],
        renal: { ckd3: { dose: '0.3 mg', note: 'Colchicine halved for reduced kidney function.' }, esrd: { avoid: true } }, hold: 'Hold and call for severe diarrhea or muscle weakness.', indication: 'Gout flare prophylaxis' });
      baseLab(spec, 'Uric acid', 8.6, 'max'); addLabs(spec, 0.5, ['Uric acid']);
      if (!nsaidSafe(ctx, spec)) noNsaids(ctx, spec, 'CKD, anticoagulant or cardiac/renal condition');
      orderOnce(spec, { name: 'Gout flare precautions', category: 'Nursing', frequency: 'Continuous', instructions: 'Assess joints (great toe, ankle, knee) each shift for hot, red, swollen joint. Bed cradle to keep linen off the toe, elevate, ice. Avoid dehydration; encourage fluids unless restricted. Notify provider of a new hot joint (also consider septic arthritis if fever).', startH: 3 });
      assess(spec, [['Musculoskeletal / Mobility', 'Joint Assessment', 'First MTP joints without erythema or warmth today; small tophus left olecranon; no acute flare'], ['Pain', 'Pain Location', 'None at rest (history of great toe flares)']]);
      comorb(spec, { key: 'gout', problem: 'Gout', details: 'Chronic gout on allopurinol with colchicine prophylaxis; uric acid elevated at baseline.', pmh: 'Gout (allopurinol, colchicine)',
        plan: () => ['Continue allopurinol; colchicine renally dosed (held if esrd).', 'If flare: low-dose colchicine or short prednisone, NOT NSAIDs when CKD/anticoagulated.', 'Hydrate; avoid diuretic-induced hyperuricemia.'] });
    }
  });
})();

/* ---------- Musculoskeletal / Rheumatologic, part 2 ---------- */
(() => {
  const HX = NS.HX, U = NS.util;
  const { home, order, comorb, assess, addLabs, sticky, heldNote } = HX.helpers;
  const { hasMed, homeOnce, orderOnce, stickyOnce, baseLab, pain, boost, nsaidSafe, noNsaids, periodic, acute, steroid, immuno, moveIVs, MSK } = HX._mo;
  const scaleDose = (d, f) => String(d).replace(/(\d+(?:\.\d+)?)(\s*mg)/, (m, n, u) => `${Math.round(n * f * 100) / 100}${u}`);

  HX.add('fibromyalgia', {
    label: 'Fibromyalgia', group: MSK, aliases: ['fibro', 'chronic widespread pain'], order: 60,
    desc: 'Duloxetine and pregabalin (renally dosed), chronic widespread pain, sleep disturbance, added sedation and fall considerations.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'duloxetine', name: 'duloxetine (CYMBALTA) capsule', dose: ['30 mg', '60 mg', '60 mg'][ctx.age % 3], route: 'Oral', freq: 'daily', cls: 'SNRI', info: 'Do not crush; do not stop abruptly (discontinuation syndrome). Serotonin syndrome risk with tramadol, linezolid, ondansetron. Monitor BP and bleeding risk with anticoagulants.', monitor: ['BP'], renal: { esrd: { avoid: true } }, indication: 'Fibromyalgia' });
      homeOnce(spec, { key: 'pregabalin', name: 'pregabalin (LYRICA) capsule', dose: '75 mg', route: 'Oral', freq: 'BID', cls: 'Gabapentinoid', info: 'Sedation, dizziness, edema. Additive respiratory depression with opioids: monitor sedation and RR. Fall precautions.', monitor: ['RR'], holdIf: ['npo'], renal: { ckd3: { dose: '50 mg', freq: 'BID', note: 'Pregabalin reduced for reduced kidney function.' }, esrd: { dose: '25 mg', freq: 'daily', note: 'Pregabalin 25 mg daily, supplemental dose after dialysis.' } }, indication: 'Fibromyalgia' });
      if (ctx.age < 65) homeOnce(spec, { key: 'cyclobenzaprine', name: 'cyclobenzaprine (FLEXERIL) tablet', dose: '5 mg', route: 'Oral', freq: 'qHS', cls: 'Muscle relaxant', info: 'Sedating and anticholinergic. Avoid in older adults; hold if drowsy.', hold: 'Hold if sedated or RR below 12.', holdIf: ['npo'], indication: 'Fibromyalgia (sleep / muscle pain)' });
      boost(spec, 1); pain(spec, 2);
      orderOnce(spec, { name: 'Sleep promotion and graded activity', category: 'Nursing', frequency: 'Continuous', instructions: 'Cluster care at night, keep room quiet and dark, warm packs for muscle pain, encourage short walks. Pain is real and widespread: assess and treat, do not dismiss.', startH: 3 });
      assess(spec, [['Pain', 'Pain Location', 'Diffuse aching of shoulders, neck, back and hips (chronic, 4/10 baseline)'], ['Musculoskeletal / Mobility', 'Joint Assessment', 'Multiple tender points; no joint swelling or warmth'], ['Neurologic', 'Level of Consciousness', 'Alert; reports unrefreshing sleep']]);
      comorb(spec, { key: 'fibromyalgia', problem: 'Fibromyalgia', details: 'Chronic widespread pain on duloxetine and pregabalin; baseline pain about 4/10.', pmh: 'Fibromyalgia (duloxetine, pregabalin)', plan: () => ['Continue duloxetine and pregabalin (renally dosed); do not stop abruptly.', 'Baseline pain 3-5/10 is expected; treat new or different pain as new.', 'Sedation and fall precautions with added opioids.'] });
    }
  });

  HX.add('psoriatic_arthritis', {
    label: 'Psoriatic Arthritis', group: MSK, aliases: ['psa', 'psoriatic', 'adalimumab', 'humira', 'biologic'], order: 60,
    desc: 'Weekly methotrexate or q14-day adalimumab (dose-day safety), immunosuppression precautions, plaques and joint findings.',
    apply(ctx, spec) {
      if (ctx.age % 2 === 0) {
        const mtx = [12.5, 15, 20][ctx.age % 3], p = periodic(ctx, spec, { key: 'methotrexate', name: 'methotrexate (TREXALL) tablet', dose: `${mtx} mg`, route: 'Oral', cls: 'DMARD / antimetabolite (immunosuppressant)',
          info: 'WEEKLY drug: ONE dose on ONE day each week. Daily dosing has caused fatal toxicity. Verify the dose day and last dose with pharmacy and the patient. Check CBC, creatinine, ALT.', monitor: ['WBC', 'Plt', 'Cr', 'LFT'],
          hold: 'HOLD and notify provider for fever or infection, WBC below 3.0, platelets below 100, rising creatinine, mouth sores. Never give daily.', renal: { ckd3: { avoid: true }, esrd: { avoid: true } }, indication: 'Psoriatic arthritis (home medication, ONCE WEEKLY)' }, [1, 2, 4, 5][ctx.age % 4], 'ONCE WEEKLY');
        heldNote(spec, `Methotrexate ${mtx} mg is taken ONCE WEEKLY (${p.day}); next dose ${p.when}. Hold during acute infection, AKI or cytopenias until reviewed.`);
        homeOnce(spec, { key: 'folic_acid', name: 'folic acid tablet', dose: '1 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B9', holdIf: ['npo'], indication: 'Psoriatic arthritis (methotrexate support)' });
      } else {
        const p = periodic(ctx, spec, { key: 'adalimumab', name: 'adalimumab (HUMIRA) pen injection', dose: '40 mg', route: 'Subcutaneous', cls: 'TNF inhibitor (biologic)',
          info: 'Every 14 days. Refrigerate; let reach room temperature. Rotate sites (abdomen/thigh). TB and hepatitis B screened before start. Do not give during active infection.', monitor: ['WBC', 'Temp'], hold: 'HOLD and notify provider for fever, active infection, sepsis or planned surgery within 1-2 weeks.', indication: 'Psoriatic arthritis (home biologic, EVERY 14 DAYS)' }, 3, 'EVERY 14 DAYS');
        heldNote(spec, `Adalimumab 40 mg SC is given EVERY 14 DAYS (last doses on ${p.day}s); next due ${p.when}. Hold during active infection.`);
      }
      immuno(spec, 'Immunosuppressed (DMARD / biologic)');
      baseLab(spec, 'ESR', 30, 'max'); baseLab(spec, 'CRP', 12, 'max');
      pain(spec, 1);
      if (!nsaidSafe(ctx, spec)) HX._mo.noNsaids(ctx, spec, 'CKD, anticoagulant or cardiac/renal/bleeding condition');
      assess(spec, [['Musculoskeletal / Mobility', 'Joint Assessment', 'Asymmetric swelling of right 2nd DIP and left knee, dactylitis of one toe, no hot effusion'], ['Skin', 'Skin', 'Silvery scaling plaques on elbows and scalp; nail pitting; no pustules'], ['Pain', 'Pain Location', 'Hands and left knee, morning stiffness']]);
      comorb(spec, { key: 'psa', problem: 'Psoriatic arthritis', details: 'Psoriatic arthritis with skin plaques on a DMARD or biologic (weekly / every-14-day dosing).', pmh: 'Psoriatic arthritis', plan: () => [acute(spec) ? 'Immunosuppressant (weekly methotrexate / q14-day adalimumab) held during acute illness; resume per provider.' : 'Weekly / q14-day drug is not due today; verify dose day before giving.', 'Immunosuppression precautions; monitor CBC and creatinine.'] });
    }
  });

  HX.add('ankylosing_spondylitis', {
    label: 'Ankylosing Spondylitis', group: MSK, aliases: ['spondylitis', 'axial spondyloarthritis', 'as'], order: 70,
    desc: 'Axial inflammatory back pain/stiffness; NSAID (omitted when CKD, anticoagulants, GI bleed or cardiac disease), q14-day or weekly biologic option; spinal and fall precautions.',
    apply(ctx, spec) {
      if (nsaidSafe(ctx, spec)) homeOnce(spec, { key: 'naproxen', name: 'naproxen (NAPROSYN) tablet', dose: '500 mg', route: 'Oral', freq: 'BID', cls: 'NSAID', info: 'Give with food. Monitor for GI bleeding, creatinine, BP and edema.', monitor: ['Cr', 'Hgb'], avoid: ['NSAID', 'ibuprofen'], holdIf: ['npo'], indication: 'Ankylosing spondylitis (home NSAID)' });
      else { noNsaids(ctx, spec, 'CKD, anticoagulant, GI bleed or cardiac/renal risk'); heldNote(spec, 'Home NSAID (naproxen) not continued: CKD, anticoagulant, bleeding or cardiac risk.'); }
      if (ctx.age % 2) { const p = periodic(ctx, spec, { key: 'etanercept', name: 'etanercept (ENBREL) injection', dose: '50 mg', route: 'Subcutaneous', cls: 'TNF inhibitor (biologic)', info: 'ONCE WEEKLY. Rotate sites. Do not give during active infection. TB and hepatitis B screened before start.', hold: 'HOLD and notify provider for fever, active infection or planned surgery.', monitor: ['WBC', 'Temp'], indication: 'Ankylosing spondylitis (home biologic, ONCE WEEKLY)' }, 4, 'ONCE WEEKLY'); heldNote(spec, `Etanercept 50 mg SC is ONCE WEEKLY (${p.day}); next dose ${p.when}. Hold during active infection.`); immuno(spec, 'Immunosuppressed (TNF inhibitor)'); }
      baseLab(spec, 'CRP', 16, 'max'); baseLab(spec, 'ESR', 34, 'max'); baseLab(spec, 'Hemoglobin', ctx.female ? 11.8 : 12.8, 'min');
      boost(spec, 1); pain(spec, 1);
      orderOnce(spec, { name: 'Spinal alignment and log-roll precautions', category: 'Activity', frequency: 'Continuous', instructions: 'Rigid, fused spine: maintain neutral alignment, use extra pillows to support natural kyphosis, log-roll, avoid forced neck flexion/extension. Minor trauma can cause spinal fracture: report new back/neck pain. Encourage deep breathing (reduced chest expansion).', startH: 3 });
      assess(spec, [['Musculoskeletal / Mobility', 'Mobility', 'Independent with stooped posture and limited spinal flexion; ambulates slowly'], ['Pain', 'Pain Location', 'Lower back and buttocks, morning stiffness over 1 hour, improves with movement'], ['Respiratory', 'Respiratory Effort', 'Reduced chest expansion, unlabored']]);
      comorb(spec, { key: 'ankylosing_spondylitis', problem: 'Ankylosing spondylitis', details: 'Axial spondyloarthritis with chronic inflammatory back pain and reduced spinal mobility.', pmh: 'Ankylosing spondylitis', plan: () => [nsaidSafe(ctx, spec) ? 'NSAID continued with food; stop and call for GI bleeding or rising creatinine.' : 'NO NSAIDs this admission; acetaminophen, heat and gentle mobilization.', 'Neutral spinal alignment; log-roll; fall precautions.'] });
    }
  });

  HX.add('chronic_pain_opioid', {
    label: 'Chronic Low Back Pain on Long-Term Opioids', group: MSK, aliases: ['opioid tolerance', 'chronic opioid therapy', 'oxycodone', 'chronic pain', 'back pain opioid', 'long-term opioid'], order: 75,
    desc: 'Home long-acting opioid continued (never skipped), opioid tolerance so PRN needs are higher, bowel regimen, naloxone available, sedation/RR monitoring.',
    apply(ctx, spec) {
      const er = [10, 15, 20, 30, 40][ctx.age % 5];
      homeOnce(spec, { key: 'oxycodone_er', name: 'oxycodone ER (OXYCONTIN) tablet', dose: `${er} mg`, route: 'Oral', freq: 'q12h', cls: 'Opioid analgesic (extended-release)', highAlert: true, sips: true,
        info: 'HIGH-ALERT. Swallow whole: never crush, chew or cut (fatal overdose). Continue the home dose on time to prevent withdrawal; do not use for breakthrough pain. Assess sedation (POSS) and RR before giving.', monitor: ['Pain', 'RR', 'SPO2'],
        hold: 'Hold and call provider for sedation (POSS 3-4) or RR below 10 - do not just skip; the provider will adjust.', avoid: ['codeine'], alt: { key: 'oxycodone_er', name: 'morphine ER (MS CONTIN) tablet', dose: `${er * 2} mg`, cls: 'Opioid analgesic (extended-release)' }, indication: 'Chronic low back pain (home long-acting opioid, continued)' });
      if (!hasMed(spec, 'opioid_po')) spec.meds.push(Object.assign(NS.C.opioidPO(ctx, { start: 3 }), { home: true, by: 'hospitalist', dose: `${Math.round(er / 4)} mg`.replace(/^(\d)\s/, '5 '), prnFor: 'breakthrough pain (4-10)' }));
      // opioid tolerance: PRN opioids that the diagnosis profile ordered are scaled up (about 2x)
      spec.meds.forEach(m => {
        if (!m.prn || !/opioid/i.test(m.cls || '') || m.__tol || m.key === 'oxycodone_er') return;
        m.__tol = true; const f = /injection/.test(m.name) ? 1.5 : 2;
        m.dose = scaleDose(m.dose, f); if (m.adminDose) m.adminDose = scaleDose(m.adminDose, f);
        if (m.alt) m.alt = Object.assign({}, m.alt, { dose: scaleDose(m.alt.dose, f) });
        m.info = (m.info || '') + ' Opioid-tolerant: higher PRN dose ordered; still assess sedation first.';
      });
      homeOnce(spec, { key: 'senna_docusate', name: 'senna-docusate (SENOKOT-S) tablet', dose: '2 tablets', route: 'Oral', freq: 'BID', cls: 'Stimulant laxative / stool softener', info: 'Opioid-induced constipation: hold for loose stools. Document last BM.', indication: 'Opioid-induced constipation prevention' });
      homeOnce(spec, { key: 'polyethylene_glycol', name: 'polyethylene glycol (MIRALAX) powder', dose: '17 g in 8 oz fluid', route: 'Oral', freq: 'daily', cls: 'Osmotic laxative', info: 'Hold for loose stools. Needs adequate fluid.', holdIf: ['npo'], indication: 'Opioid-induced constipation' });
      homeOnce(spec, { key: 'naloxone', name: 'naloxone (NARCAN) injection', dose: '0.04 mg (dilute 0.4 mg in 9 mL saline)', route: 'IV', freq: 'q2min', prn: true, prnInterval: 'Every 2 minutes', prnFor: 'RR below 8 or unarousable (opioid overdose)', cls: 'Opioid antagonist', highAlert: true, info: 'Titrate to respiratory effort, not full reversal (full reversal precipitates severe pain and withdrawal in opioid-tolerant patients). Call rapid response; effect shorter than opioid so monitor at least 2 hours.', monitor: ['RR', 'SPO2'], indication: 'Opioid reversal' });
      pain(spec, 1);
      orderOnce(spec, { name: 'Sedation (POSS) and respiratory rate monitoring', category: 'Nursing', frequency: 'Every 4 hours and 30-60 minutes after PRN opioid', instructions: 'Opioid-tolerant, but still assess POSS and RR before every opioid dose. Continuous pulse oximetry when combined with gabapentinoids, benzodiazepines or sleep apnea. Hold and notify for POSS 3-4 or RR below 10.', startH: 3, nursing: ['Never hold the long-acting home opioid without calling the provider (withdrawal and uncontrolled pain).'] });
      orderOnce(spec, { name: 'Bowel regimen and last BM assessment', category: 'Nursing', frequency: 'Every shift', instructions: 'Document last BM; notify provider if no BM in 48 hours or abdominal distension.', startH: 3 });
      orderOnce(spec, { name: 'Opioid withdrawal watch / multimodal pain plan', category: 'Nursing', frequency: 'Every shift', instructions: 'Watch for yawning, sweating, restlessness, piloerection, diarrhea (withdrawal). Use acetaminophen, heat, lidocaine patch and positioning with opioids. No mixed agonist-antagonists (nalbuphine, butorphanol): they precipitate withdrawal.', startH: 3 });
      stickyOnce(spec, 'Opioid-tolerant patient', `Home oxycodone ER ${er} mg every 12 hours is continued. Expect PRN opioid doses to be higher than for an opioid-naive patient; undertreated pain is a safety and satisfaction issue, but sedation/RR assessment before every dose still applies. Naloxone available.`);
      assess(spec, [['Pain', 'Pain Location', 'Chronic low back pain radiating to the left buttock (baseline 4-5/10 on home regimen)'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent with stiff, guarded gait'], ['GI', 'Bowel Sounds', 'Active; last BM within 2 days on bowel regimen']]);
      comorb(spec, { key: 'chronic_pain_opioid', problem: 'Chronic low back pain on long-term opioid therapy', details: `Home oxycodone ER ${er} mg every 12 hours with breakthrough opioid; opioid tolerant; bowel regimen at home.`, pmh: `Chronic low back pain on long-term opioid therapy (oxycodone ER ${er} mg q12h)`,
        plan: () => ['Home long-acting opioid continued on schedule (never skip); PRN opioid doses higher due to tolerance.', 'Scheduled bowel regimen; naloxone available; POSS/RR before every opioid dose.', 'Multimodal analgesia (acetaminophen, lidocaine patch, heat); avoid mixed agonist-antagonists.'] });
    }
  });
})();
