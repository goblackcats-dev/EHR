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
      if (!hasMed(spec, 'opioid_po')) spec.meds.push(Object.assign(NS.C.opioidPO(ctx, { start: 3 }), { home: true, by: 'hospitalist', dose: er <= 15 ? '5 mg' : '10 mg', prnFor: 'breakthrough pain (4-10)' }));
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

/* ---------- Musculoskeletal / Rheumatologic, part 3 ---------- */
(() => {
  const HX = NS.HX;
  const { comorb, assess, addLabs, heldNote } = HX.helpers;
  const { homeOnce, orderOnce, stickyOnce, baseLab, pain, boost, nsaidSafe, noNsaids, acute, immuno, moveIVs, MSK } = HX._mo;

  HX.add('scleroderma', {
    label: 'Scleroderma (Systemic Sclerosis)', group: MSK, aliases: ['systemic sclerosis', 'raynaud', 'crest'], order: 65,
    desc: 'Raynaud calcium channel blocker, PPI for reflux, immunosuppressant for lung disease; cold/skin/IV precautions, aspiration risk, renal-crisis BP watch.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'nifedipine', name: 'nifedipine ER (PROCARDIA XL) tablet', dose: '30 mg', route: 'Oral', freq: 'daily', cls: 'Calcium channel blocker', info: 'Raynaud and BP. Swallow whole. Check BP before giving; may cause edema, headache, flushing.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if SBP below 100.', holdIf: ['hypotension', 'npo'], holdReason: 'low blood pressure or NPO', indication: 'Raynaud phenomenon' });
      homeOnce(spec, { key: 'pantoprazole', name: 'pantoprazole (PROTONIX) tablet', dose: '40 mg', route: 'Oral', freq: 'BID', cls: 'Proton pump inhibitor', info: 'Give 30-60 minutes before meals. Esophageal dysmotility with severe reflux.', variants: { npo: { name: 'pantoprazole (PROTONIX) injection', route: 'IV' } }, indication: 'Scleroderma esophageal dysmotility / GERD' });
      if (ctx.age % 2) homeOnce(spec, { key: 'mycophenolate', name: 'mycophenolate mofetil (CELLCEPT) tablet', dose: '1,000 mg', route: 'Oral', freq: 'BID', cls: 'Immunosuppressant', info: 'Interstitial lung disease therapy. Monitor CBC and infection.', monitor: ['WBC', 'Plt'], hold: 'Hold and notify provider for fever, WBC below 3.0 or platelets below 100.', holdIf: ['npo'], indication: 'Scleroderma-associated lung disease' });
      if (ctx.age % 2) { spec.vitalAdjust.push({ spo2: -2 }); immuno(spec, 'Immunosuppressed (mycophenolate)'); }
      spec.vitalAdjust.push({ sbp: 4 });
      orderOnce(spec, { name: 'Scleroderma skin, cold and IV access precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Keep room and hands/feet warm; no ice packs or cold fluids on skin. Tight, fragile skin and small veins: use the smallest catheter, avoid fingertip pulse-ox if Raynaud attack (use ear/forehead). Inspect fingertips for ulcers every shift. Use pressure-relieving padding on bony areas.', startH: 3 });
      orderOnce(spec, { name: 'Aspiration precautions (esophageal dysmotility)', category: 'Precautions', frequency: 'Continuous', instructions: 'HOB 30-45 degrees at all times and 1 hour after meals; small frequent meals; upright to take pills with plenty of water.', startH: 3 });
      stickyOnce(spec, 'Scleroderma renal crisis', 'Report new severe hypertension (SBP above 160 or 30 mmHg over baseline), headache, vision change or falling urine output immediately. High-dose steroids raise the risk; question prednisone orders of 15 mg or more daily.');
      assess(spec, [['Skin', 'Skin', 'Tight, shiny, thickened skin of fingers and hands (sclerodactyly); telangiectasias on face; two healed fingertip scars, no active digital ulcer'], ['Cardiac', 'Capillary Refill', 'Delayed in fingers (3-4 seconds), brisk elsewhere; toes warm'], ['GI', 'Nausea / Vomiting', 'None; reports reflux and early satiety'], ['Musculoskeletal / Mobility', 'Joint Assessment', 'Flexion contractures of fingers, limited mouth opening']]);
      comorb(spec, { key: 'scleroderma', problem: 'Systemic sclerosis (scleroderma)', details: 'Limited/diffuse systemic sclerosis with Raynaud phenomenon, esophageal dysmotility and skin thickening.', pmh: 'Systemic sclerosis (scleroderma) with Raynaud and GERD', plan: () => ['Continue Raynaud therapy and PPI; warm environment, aspiration precautions.', 'Monitor BP closely (scleroderma renal crisis); avoid high-dose steroids if possible.', 'Difficult IV access; protect fingertips and skin.'] });
    }
  });

  HX.add('pmr_gca', {
    label: 'Polymyalgia Rheumatica / Giant Cell Arteritis', group: MSK, aliases: ['pmr', 'gca', 'temporal arteritis', 'polymyalgia'], order: 62,
    desc: 'Daily prednisone taper (do not stop; stress dosing), bone protection, elevated ESR/CRP, steroid hyperglycemia; report any visual change.',
    apply(ctx, spec) {
      HX._mo.steroid(ctx, spec, [15, 20, 12.5, 30, 10][ctx.age % 5], 'Polymyalgia rheumatica / giant cell arteritis (prednisone taper)');
      homeOnce(spec, { key: 'calcium_supp', name: 'calcium carbonate (OS-CAL) tablet', dose: '500 mg elemental calcium', route: 'Oral', freq: 'BID', at: ['0900', '1700'], cls: 'Mineral supplement', info: 'Bone protection during steroid therapy. Give with meals.', holdIf: ['npo'], indication: 'Steroid bone protection' });
      homeOnce(spec, { key: 'vitamin_d3', name: 'cholecalciferol (vitamin D3) tablet', dose: '1,000 units', route: 'Oral', freq: 'daily', cls: 'Vitamin D', holdIf: ['npo'], indication: 'Steroid bone protection' });
      homeOnce(spec, { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', info: 'Added to reduce ischemic vision/stroke risk in giant cell arteritis. Monitor for bleeding with the steroid.', monitor: ['Hgb'], indication: 'Giant cell arteritis (stroke / vision protection)' });
      homeOnce(spec, { key: 'pantoprazole', name: 'pantoprazole (PROTONIX) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', cls: 'Proton pump inhibitor', info: 'GI protection with steroid plus aspirin. Give 30-60 minutes before breakfast.', variants: { npo: { name: 'pantoprazole (PROTONIX) injection', route: 'IV' } }, indication: 'GI protection (steroid + aspirin)' });
      baseLab(spec, 'ESR', 52, 'max'); baseLab(spec, 'CRP', 22, 'max'); baseLab(spec, 'Hemoglobin', ctx.female ? 11.3 : 12.3, 'min'); baseLab(spec, 'Platelets', 380, 'max');
      boost(spec, 1); pain(spec, 1);
      orderOnce(spec, { name: 'Report any visual change, jaw claudication or temporal headache', category: 'Nursing', frequency: 'Every shift', instructions: 'Giant cell arteritis can cause sudden permanent vision loss. Ask about blurred/double vision, jaw pain when chewing, scalp tenderness and new headache each shift; report immediately - emergency.', startH: 3 });
      assess(spec, [['Musculoskeletal / Mobility', 'Joint Assessment', 'Bilateral shoulder and hip girdle stiffness and tenderness; full passive range; difficulty rising from chair; no joint swelling'], ['Neurologic', 'Vision', 'Visual acuity at baseline, no diplopia; temporal arteries non-tender, pulses palpable'], ['Pain', 'Pain Location', 'Shoulders and hips, worst in morning'], ['Skin', 'Skin', 'Warm, dry, intact; thin skin with ecchymoses on forearms (steroid)']]);
      comorb(spec, { key: 'pmr_gca', problem: 'Polymyalgia rheumatica / giant cell arteritis', details: 'On a daily prednisone taper with calcium, vitamin D and GI protection; ESR/CRP elevated at baseline.', pmh: 'Polymyalgia rheumatica / giant cell arteritis (prednisone)', plan: () => ['Prednisone continued daily (IV methylprednisolone if NPO); never stop abruptly.', 'Report any visual symptoms immediately.', 'Monitor glucose, BP and mood; bone and GI protection continued.'] });
    }
  });

  HX.add('spinal_stenosis', {
    label: 'Lumbar Spinal Stenosis', group: MSK, aliases: ['stenosis', 'neurogenic claudication', 'lumbar stenosis'], order: 65,
    desc: 'Neurogenic claudication; gabapentin (renally dosed) and acetaminophen, higher fall risk, neuro and bowel/bladder warning signs.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'gabapentin', name: 'gabapentin (NEURONTIN) capsule', dose: ['300 mg', '100 mg', '300 mg'][ctx.age % 3], route: 'Oral', freq: 'TID', cls: 'Gabapentinoid', info: 'Sedation, dizziness, edema. Additive respiratory depression with opioids: monitor sedation and RR. Do not stop abruptly.', monitor: ['RR'], holdIf: ['npo'],
        renal: { ckd3: { dose: '200 mg', freq: 'BID', note: 'Gabapentin reduced for reduced kidney function.' }, esrd: { dose: '100 mg', freq: 'daily', note: 'Gabapentin 100 mg daily, given after dialysis on dialysis days.' } }, indication: 'Lumbar spinal stenosis (neurogenic pain)' });
      homeOnce(spec, { key: 'acetaminophen', name: 'acetaminophen (TYLENOL) tablet', dose: '650 mg', route: 'Oral', freq: 'TID', cls: 'Non-opioid analgesic', info: 'Maximum 3 g per 24 hours from all sources.', indication: 'Chronic back pain' });
      if (!nsaidSafe(ctx, spec)) noNsaids(ctx, spec, 'CKD, anticoagulant or cardiac/renal/bleeding condition');
      boost(spec, 1); pain(spec, 1);
      orderOnce(spec, { name: 'Neurovascular and bowel/bladder check (spinal)', category: 'Nursing', frequency: 'Every shift', instructions: 'Check lower extremity strength, sensation and pain. Report NEW leg weakness, saddle numbness, urinary retention or incontinence (cauda equina: emergency).', startH: 3 });
      assess(spec, [['Neurologic', 'Lower Extremity Strength', '5/5 bilateral; reports leg heaviness and cramping after walking 1-2 blocks, relieved by sitting or leaning forward'], ['Neurologic', 'Sensation', 'Intact to light touch; mild numbness bilateral calves'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent with cane or rolling walker, stooped forward flexed posture'], ['Pain', 'Pain Location', 'Low back radiating to both buttocks and thighs']]);
      comorb(spec, { key: 'spinal_stenosis', problem: 'Lumbar spinal stenosis', details: 'Neurogenic claudication; walking tolerance limited to a few blocks.', pmh: 'Lumbar spinal stenosis', plan: () => ['Gabapentin renally dosed; acetaminophen scheduled; no NSAIDs if CKD/anticoagulated.', 'Fall precautions; report new leg weakness or bowel/bladder change.'] });
    }
  });

  HX.add('chronic_back_neck_pain', {
    label: 'Chronic Neck / Back Pain', group: MSK, aliases: ['back pain', 'neck pain', 'degenerative disc disease', 'lumbago', 'cervical spondylosis'], order: 70,
    desc: 'Chronic degenerative spine pain managed with acetaminophen, topical lidocaine and a muscle relaxant; NSAIDs only if safe; positioning and heat.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'acetaminophen', name: 'acetaminophen (TYLENOL) tablet', dose: '1,000 mg', route: 'Oral', freq: 'TID', cls: 'Non-opioid analgesic', info: 'Maximum 3 g per 24 hours from all sources.', indication: 'Chronic back / neck pain' });
      homeOnce(spec, { key: 'lidocaine_patch', name: 'lidocaine 4% (LIDODERM) patch', dose: '1 patch to the painful area', route: 'Topical', freq: 'daily', at: ['0900'], cls: 'Topical anesthetic', info: 'Apply to intact skin 12 hours on, 12 hours off; up to 3 patches. Remove old patch first.', indication: 'Chronic back / neck pain' });
      homeOnce(spec, { key: 'methocarbamol', name: 'methocarbamol (ROBAXIN) tablet', dose: '500 mg', route: 'Oral', freq: 'q8h', prn: true, prnInterval: 'Every 8 hours', prnFor: 'muscle spasm', cls: 'Muscle relaxant', info: 'Sedating; use lowest dose in older adults (fall risk). Hold if drowsy.', hold: 'Hold if sedated or RR below 12.', indication: 'Chronic back / neck muscle spasm' });
      if (nsaidSafe(ctx, spec)) homeOnce(spec, { key: 'ibuprofen', name: 'ibuprofen (MOTRIN) tablet', dose: '400 mg', route: 'Oral', freq: 'q8h', prn: true, prnInterval: 'Every 8 hours', prnFor: 'back or neck pain', cls: 'NSAID', info: 'Give with food. Monitor creatinine, BP and for GI bleeding.', monitor: ['Cr', 'Hgb'], avoid: ['NSAID', 'ibuprofen'], indication: 'Chronic back / neck pain' });
      else noNsaids(ctx, spec, 'CKD, anticoagulant or cardiac/renal/bleeding condition');
      pain(spec, 1);
      orderOnce(spec, { name: 'Positioning, heat and mobility for spine pain', category: 'Nursing', frequency: 'Every shift and PRN', instructions: 'Log-roll for turns, pillow support under knees when supine, warm pack 20 minutes (check skin), encourage short walks every 2-3 hours.', startH: 3 });
      assess(spec, [['Pain', 'Pain Location', 'Chronic low back and neck, aching, 3-4/10 baseline; no radicular symptoms'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent; guarded transfers, stiff gait'], ['Neurologic', 'Sensation', 'Intact, no numbness or weakness']]);
      comorb(spec, { key: 'chronic_back_neck_pain', problem: 'Chronic neck / back pain', details: 'Degenerative spine disease with chronic non-radicular pain.', pmh: 'Chronic neck and back pain (degenerative disc disease)', plan: () => ['Scheduled acetaminophen, lidocaine patch, PRN muscle relaxant; heat and repositioning.', nsaidSafe(ctx, spec) ? 'PRN ibuprofen with food if renal function stable.' : 'No NSAIDs this admission.'] });
    }
  });

  HX.add('lymphedema', {
    label: 'Chronic Lymphedema', group: MSK, aliases: ['lymphoedema', 'swollen arm', 'swollen leg'], order: 65,
    desc: 'Chronic limb swelling: no BP/venipuncture/IV in the affected arm (women: arm after node surgery; men: leg), skin care, compression, elevation, cellulitis watch.',
    apply(ctx, spec) {
      const side = ctx.age % 2 ? 'Left' : 'Right', arm = ctx.female;
      if (arm) {
        moveIVs(spec, side);
        orderOnce(spec, { name: `No BP, venipuncture or IV in ${side.toLowerCase()} arm (lymphedema)`, category: 'Precautions', frequency: 'Continuous', instructions: `Protect the ${side.toLowerCase()} arm: no blood pressure cuff, blood draws, IVs or injections. Elevate on pillows above heart level; wear compression sleeve as ordered. Use the opposite arm.`, startH: 3 });
      } else {
        orderOnce(spec, { name: `Elevate ${side.toLowerCase()} leg and protect skin (lymphedema)`, category: 'Nursing', frequency: 'Every shift and PRN', instructions: `Elevate the ${side.toLowerCase()} leg above heart level when in bed; compression garment or wraps as ordered; measure calf circumference daily; avoid IVs and blood draws in the affected leg.`, startH: 3 });
      }
      orderOnce(spec, { name: 'Lymphedema skin care and infection watch', category: 'Nursing', frequency: 'Every shift', instructions: 'Inspect the affected limb for new redness, warmth, pain or fever (cellulitis can develop rapidly and needs prompt antibiotics). Keep skin clean and moisturized, treat cuts at once, no tight jewelry. Do not apply heat. Daily circumference measurements.', startH: 3, nursing: ['Any new warmth, redness or fever in a lymphedematous limb: notify the provider.'] });
      HX._mo.homeOnce(spec, { key: 'emollient_lymph', name: 'fragrance-free emollient (EUCERIN) lotion', dose: 'Thin layer to the affected limb', route: 'Topical', freq: 'BID', cls: 'Emollient', info: 'Apply downward toward the trunk, gently; keep skin supple to prevent cracks.', indication: 'Lymphedema skin care' });
      assess(spec, [['Cardiac', 'Edema', `Chronic non-pitting swelling of the ${side.toLowerCase()} ${arm ? 'arm' : 'leg'}, firm, no erythema, warmth or weeping`], ['Skin', 'Skin', `Warm, dry, intact; mild skin thickening of the ${side.toLowerCase()} ${arm ? 'arm' : 'leg'}`], ['Musculoskeletal / Mobility', 'Limb Circumference', `${side} ${arm ? 'forearm' : 'calf'} ${arm ? '4 cm' : '5 cm'} larger than the opposite side`]]);
      comorb(spec, { key: 'lymphedema', problem: 'Chronic lymphedema', details: `Secondary lymphedema of the ${side.toLowerCase()} ${arm ? 'arm (after axillary node treatment)' : 'leg'}; high cellulitis risk.`, pmh: `Chronic lymphedema, ${side.toLowerCase()} ${arm ? 'arm' : 'leg'}`, plan: () => [arm ? `No BP/IV/venipuncture in the ${side.toLowerCase()} arm.` : `Elevate the ${side.toLowerCase()} leg; avoid venipuncture there.`, 'Skin care, compression and elevation; watch for cellulitis.'] });
    }
  });
})();

/* ---------- Skin / Wounds ---------- */
(() => {
  const HX = NS.HX, U = NS.util;
  const { comorb, assess, addLabs, heldNote } = HX.helpers;
  const { homeOnce, orderOnce, stickyOnce, baseLab, pain, boost, onAnticoag, periodic, immuno, anyHx, SKIN } = HX._mo;
  // Braden Score row is overwritten with the patient's baseline; hospital-day text stays in the module (wound measurements are baseline)
  const WOUND_CARE = { name: 'Wound care nurse consult', category: 'Consult', frequency: 'Once, then weekly', instructions: 'Wound/ostomy nurse to measure, stage and recommend dressings and support surface.', startH: 3 };

  HX.add('pressure_injury', {
    label: 'Chronic Sacral Pressure Injury (Stage 2-3)', group: SKIN, aliases: ['pressure ulcer', 'bedsore', 'decubitus', 'sacral wound', 'pressure sore'], order: 65,
    desc: 'Present-on-admission stage 2/3 sacral pressure injury: Braden score low, q2h turning, support surface, silicone foam dressing, nutrition and wound care consults.',
    apply(ctx, spec) {
      const stage3 = ctx.age % 2 === 1, dims = stage3 ? '4.0 x 3.0 x 0.5 cm' : '2.5 x 2.0 x 0.1 cm';
      spec.vitalAdjust.push({ hr: 2 }); boost(spec, 1);
      baseLab(spec, 'Albumin', 3.0, 'min'); baseLab(spec, 'Hemoglobin', ctx.female ? 10.8 : 11.6, 'min');
      orderOnce(spec, { name: 'Turn and reposition every 2 hours', category: 'Nursing', frequency: 'Every 2 hours', instructions: '30-degree side-lying alternating with supine only if the sacrum is offloaded; keep HOB as low as the medical condition allows (shear). Float heels. Document skin on every turn.', startH: 3 });
      orderOnce(spec, { name: 'Pressure-redistribution mattress and heel offloading', category: 'Nursing', frequency: 'Continuous', instructions: 'Low-air-loss or alternating pressure surface; pillows or boots to float heels; no donut cushions; limit chair sitting to 1 hour at a time with a pressure-relieving cushion.', startH: 3 });
      orderOnce(spec, { name: `Sacral wound care: silicone foam dressing (${stage3 ? 'stage 3' : 'stage 2'})`, category: 'Nursing', frequency: 'Every 3 days and PRN soiled', instructions: `Cleanse with normal saline, pat dry, protect periwound with barrier film, apply bordered silicone foam dressing. ${stage3 ? 'Lightly pack dead space with calcium alginate if tunneling.' : ''} Measure weekly and document wound bed, drainage and odor. Assess for infection (increased pain, purulence, warmth, fever).`.trim(), startH: 3 });
      orderOnce(spec, WOUND_CARE);
      orderOnce(spec, { name: 'Dietitian consult: protein-calorie support for wound healing', category: 'Consult', frequency: 'Once', instructions: 'Protein 1.25-1.5 g/kg/day, adequate calories, vitamin C and zinc per RD; weekly weight.', startH: 3 });
      orderOnce(spec, { name: 'Skin assessment with Braden Score every shift', category: 'Nursing', frequency: 'Every shift', instructions: 'Full head-to-toe skin check, Braden Score each shift; moisture management (barrier cream, prompt incontinence care).', startH: 3 });
      homeOnce(spec, { key: 'multivitamin', name: 'multivitamin tablet', dose: '1 tablet', route: 'Oral', freq: 'daily', cls: 'Vitamin', holdIf: ['npo'], indication: 'Wound healing / nutrition', home: false });
      homeOnce(spec, { key: 'zinc_oxide', name: 'zinc oxide 20% barrier cream', dose: 'Thin layer to perineal/buttock skin', route: 'Topical', freq: 'BID', cls: 'Skin protectant', info: 'Apply after each incontinence episode; do not apply into the open wound.', indication: 'Moisture-associated skin protection' });
      assess(spec, [['Skin', 'Skin', `Sacrum: ${stage3 ? 'stage 3' : 'stage 2'} pressure injury ${dims}, ${stage3 ? '90% pink granulation tissue, scant serosanguineous drainage, no slough, no odor' : 'shallow pink open area, intact blister-free periwound'}; present on admission; heels intact`], ['Skin', 'Braden Score', stage3 ? '12' : '14'], ['Musculoskeletal / Mobility', 'Mobility', 'Limited; needs assist x2 to reposition']]);
      stickyOnce(spec, 'Pressure injury present on admission', `Sacral ${stage3 ? 'stage 3' : 'stage 2'} pressure injury ${dims} on admission. Document with photo per policy; Braden ${stage3 ? '12 (high risk)' : '14 (moderate risk)'}.`);
      comorb(spec, { key: 'pressure_injury', problem: `Chronic sacral pressure injury, ${stage3 ? 'stage 3' : 'stage 2'}`, details: `Present on admission, ${dims}; high pressure-injury risk.`, pmh: `Sacral pressure injury (${stage3 ? 'stage 3' : 'stage 2'})`, plan: () => ['Turn q2h with support surface; heel offloading; silicone foam dressing every 3 days.', 'Nutrition and wound care consults; monitor for infection or deterioration.'] });
    }
  });

  HX.add('venous_stasis_ulcer', {
    label: 'Venous Stasis Ulcers', group: SKIN, aliases: ['venous ulcer', 'leg ulcer', 'chronic venous insufficiency', 'cvi'], order: 65,
    desc: 'Chronic venous insufficiency with a medial malleolus ulcer: compression after arterial check, elevation, dressing orders, edema and stasis dermatitis.',
    apply(ctx, spec) {
      const side = ctx.age % 2 ? 'Left' : 'Right';
      boost(spec, 1); pain(spec, 1);
      baseLab(spec, 'Albumin', 3.3, 'min');
      orderOnce(spec, { name: `Leg wound care ${side.toLowerCase()} medial malleolus: foam dressing with compression`, category: 'Nursing', frequency: 'Every 3 days and PRN', instructions: 'Cleanse with normal saline, apply non-adherent absorbent foam dressing; multilayer compression wrap or Unna boot from toes to below the knee ONLY if pedal pulses present/ABI above 0.8. Hold compression and call provider if cool, pale or painful toes.', startH: 3, nursing: ['Contraindications to compression: arterial insufficiency, uncontrolled heart failure, suspected DVT, cellulitis.'] });
      orderOnce(spec, { name: 'Elevate legs above heart level', category: 'Nursing', frequency: 'Whenever in bed; 30 minutes 3-4 times daily', instructions: 'Pillows under calves (not knees); avoid prolonged dependent sitting; ankle pumps hourly while awake.', startH: 3 });
      orderOnce(spec, WOUND_CARE);
      homeOnce(spec, { key: 'triamcinolone_cream', name: 'triamcinolone 0.1% cream', dose: 'Thin layer to stasis dermatitis (not the open ulcer)', route: 'Topical', freq: 'BID', cls: 'Topical corticosteroid', info: 'Short course on intact dermatitis only; stop if skin thins.', indication: 'Venous stasis dermatitis' });
      assess(spec, [['Cardiac', 'Edema', `2+ pitting edema of both lower legs, ${side.toLowerCase()} worse; brown hemosiderin staining of the shins`], ['Skin', 'Skin', `${side} medial malleolus ulcer 3.0 x 2.0 x 0.2 cm, shallow, red granulating base with yellow fibrinous patches, moderate serous drainage, irregular border; stasis dermatitis on lower legs; no erythema or purulence`], ['Cardiac', 'Pulses', 'Dorsalis pedis and posterior tibial palpable bilaterally (venous, not arterial, disease)'], ['Pain', 'Pain Location', 'Aching in both legs, relieved by elevation']]);
      comorb(spec, { key: 'venous_ulcer', problem: 'Venous stasis ulcer', details: `Chronic venous insufficiency with ${side.toLowerCase()} medial malleolus ulcer.`, pmh: 'Chronic venous insufficiency with venous stasis ulcer', plan: () => ['Foam dressing every 3 days; compression only with adequate pedal pulses; elevate legs.', 'Watch for infection (cellulitis) and DVT; wound care follow-up.'] });
    }
  });

  HX.add('diabetic_foot_ulcer', {
    label: 'Diabetic Foot Ulcer', group: SKIN, aliases: ['foot ulcer', 'diabetic wound', 'neuropathic ulcer', 'wagner'], order: 70,
    desc: 'Plantar neuropathic ulcer: offloading boot/non-weight bearing, daily dressing orders, daily foot checks, glucose control; includes diabetes if not selected.',
    apply(ctx, spec) {
      const side = ctx.age % 2 ? 'Left' : 'Right';
      if (!anyHx(ctx, /^(dm|diabet)/i) && !spec.comorb.some(c => c.key === 'dm2')) HX.M.dm2.apply(ctx, spec);
      baseLab(spec, 'Glucose', 188, 'max'); baseLab(spec, 'ESR', 48, 'max'); baseLab(spec, 'CRP', 18, 'max'); baseLab(spec, 'WBC', 9.8, 'max'); baseLab(spec, 'Hemoglobin', ctx.female ? 11.2 : 12.0, 'min');
      boost(spec, 2);
      orderOnce(spec, { name: `Offloading: ${side.toLowerCase()} foot non-weight bearing / offloading boot`, category: 'Activity', frequency: 'Continuous', instructions: `Keep pressure off the ${side.toLowerCase()} plantar ulcer: offloading (post-op) shoe or removable walking boot for transfers; heel-weight or non-weight bearing per provider; wheelchair or walker with PT.`, startH: 3 });
      orderOnce(spec, { name: `Diabetic foot ulcer dressing, ${side.toLowerCase()} plantar 1st metatarsal`, category: 'Nursing', frequency: 'Daily and PRN', instructions: 'Gently debride loose tissue per wound nurse, cleanse with normal saline, apply hydrogel or alginate (if draining) with a non-adherent cover; avoid soaking the foot. Measure weekly; photograph per policy.', startH: 3 });
      orderOnce(spec, { name: 'Daily foot inspection and neurovascular check', category: 'Nursing', frequency: 'Every shift', instructions: 'Inspect both feet including between toes and heels; check pulses, color, temperature, monofilament sensation. Never walk barefoot; no heating pads on feet; report new redness, drainage, odor, fever or hot swollen foot.', startH: 3 });
      orderOnce(spec, { name: 'Skin assessment with Braden Score every shift', category: 'Nursing', frequency: 'Every shift', instructions: 'Heels and bony areas; float heels in bed.', startH: 3 });
      orderOnce(spec, WOUND_CARE);
      assess(spec, [['Skin', 'Skin', `${side} plantar 1st metatarsal head ulcer 2.0 x 1.5 x 0.5 cm (Wagner grade 2), pink-red base with callus rim, scant serous drainage, no purulence, no exposed bone, mild periwound erythema under 1 cm`], ['Skin', 'Braden Score', '18'], ['Cardiac', 'Pulses', 'Dorsalis pedis faint bilaterally, posterior tibial palpable; feet cool to touch'], ['Neurologic', 'Sensation', 'Decreased monofilament sensation both feet (peripheral neuropathy)'], ['Musculoskeletal / Mobility', 'Mobility', `Ambulates with walker in offloading boot on the ${side.toLowerCase()}`]]);
      comorb(spec, { key: 'dfu', problem: 'Diabetic foot ulcer', details: `${side} plantar neuropathic ulcer in a patient with diabetic neuropathy and borderline pedal perfusion.`, pmh: 'Diabetic foot ulcer with peripheral neuropathy', plan: () => ['Offloading, daily dressing and foot checks; glucose goal 140-180 mg/dL.', 'Escalate to provider for spreading erythema, purulence, fever or exposed bone (osteomyelitis work-up).'] });
    }
  });

  HX.add('psoriasis', {
    label: 'Psoriasis', group: SKIN, aliases: ['plaque psoriasis', 'psoriatic', 'scaly skin'], order: 70,
    desc: 'Plaque psoriasis: topical steroid/vitamin D analog and emollients, gentle skin handling (Koebner), infection and flare considerations.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'calcipotriene_betamethasone', name: 'calcipotriene-betamethasone (ENSTILAR) foam', dose: 'Thin layer to plaques', route: 'Topical', freq: 'daily', at: ['2100'], cls: 'Topical vitamin D analog / corticosteroid', info: 'Apply to plaques only; wash hands after; avoid face and folds. Limit total to 100 g/week.', indication: 'Plaque psoriasis' });
      homeOnce(spec, { key: 'petrolatum_emollient', name: 'petrolatum (VASELINE) emollient', dose: 'Apply liberally to dry skin', route: 'Topical', freq: 'BID', cls: 'Emollient', info: 'Apply after bathing while skin is damp.', indication: 'Psoriasis skin care' });
      if (ctx.age % 3 === 0) { const p = periodic(ctx, spec, { key: 'secukinumab', name: 'secukinumab (COSENTYX) pen injection', dose: '300 mg', route: 'Subcutaneous', cls: 'IL-17 inhibitor (biologic)', info: 'Given every 4 weeks. Do not give during active infection; TB screened before start.', hold: 'HOLD and notify provider for fever or active infection.', indication: 'Psoriasis (home biologic, EVERY 4 WEEKS)' }, 2, 'EVERY 4 WEEKS'); heldNote(spec, `Secukinumab 300 mg SC is given EVERY 4 WEEKS; next due ${p.when}. Hold during active infection.`); immuno(spec, 'Immunosuppressed (biologic)'); }
      orderOnce(spec, { name: 'Gentle skin care: avoid skin trauma and harsh adhesives', category: 'Nursing', frequency: 'Continuous', instructions: 'Skin injury can trigger new plaques (Koebner). Use paper tape or silicone dressings, no vigorous rubbing, lukewarm showers, fragrance-free soap, apply emollient after bathing.', startH: 3 });
      assess(spec, [['Skin', 'Skin', 'Well-demarcated erythematous plaques with silvery scale on elbows, knees and scalp (about 6% BSA); no pustules, no erythroderma, no open fissures']]);
      comorb(spec, { key: 'psoriasis', problem: 'Plaque psoriasis', details: 'Chronic plaque psoriasis, about 6% body surface area, on topical therapy.', pmh: 'Plaque psoriasis', plan: () => ['Continue topical therapy and emollients; avoid skin trauma.', 'Report widespread redness/pustules (flare) or infection.'] });
    }
  });

  HX.add('eczema', {
    label: 'Eczema (Atopic Dermatitis)', group: SKIN, aliases: ['atopic dermatitis', 'dermatitis', 'itchy skin'], order: 70,
    desc: 'Dry itchy skin: topical steroid, emollients, non-sedating antihistamine; skin barrier care, adhesive and chlorhexidine cautions, secondary infection watch.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'triamcinolone_oint', name: 'triamcinolone 0.1% ointment', dose: 'Thin layer to affected areas', route: 'Topical', freq: 'BID', cls: 'Topical corticosteroid', info: 'Not on the face or skin folds; use for flares only. Apply emollient 15 minutes after.', indication: 'Atopic dermatitis' });
      homeOnce(spec, { key: 'petrolatum_emollient', name: 'petrolatum (VASELINE) emollient', dose: 'Apply liberally to all dry skin', route: 'Topical', freq: 'TID', cls: 'Emollient', info: 'Apply after bathing while skin is damp.', indication: 'Atopic dermatitis skin barrier care' });
      homeOnce(spec, { key: 'cetirizine', name: 'cetirizine (ZYRTEC) tablet', dose: '10 mg', route: 'Oral', freq: 'daily', cls: 'Antihistamine (non-sedating)', info: 'Preferred over diphenhydramine in older adults (anticholinergic, falls, delirium).', holdIf: ['npo'], indication: 'Itch from atopic dermatitis' });
      orderOnce(spec, { name: 'Eczema skin barrier care', category: 'Nursing', frequency: 'Continuous', instructions: 'Short lukewarm baths, fragrance-free soap, pat dry, emollient within 3 minutes. Cotton linens and gown. Avoid adhesive tape and chlorhexidine on inflamed skin if it stings; trim nails. Report weeping, crusting or punched-out blisters (infection; herpes simplex).', startH: 3 });
      assess(spec, [['Skin', 'Skin', 'Dry, lichenified erythematous patches with excoriations in both antecubital and popliteal fossae; no weeping, crusting or vesicles'], ['Pain', 'Pain Location', 'Itching, not pain (pruritus 4/10)']]);
      comorb(spec, { key: 'eczema', problem: 'Atopic dermatitis', details: 'Chronic eczema on topical steroid and emollients.', pmh: 'Atopic dermatitis (eczema)', plan: () => ['Emollients TID; topical steroid for flares; non-sedating antihistamine for itch.', 'Monitor for secondary skin infection.'] });
    }
  });

  HX.add('hidradenitis', {
    label: 'Hidradenitis Suppurativa', group: SKIN, aliases: ['hs', 'acne inversa', 'axillary abscesses'], order: 70,
    desc: 'Recurrent painful nodules/draining tunnels in axillae and groin: doxycycline, topical clindamycin, absorbent dressings, pain, infection watch.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'doxycycline', name: 'doxycycline (VIBRA-TABS) tablet', dose: '100 mg', route: 'Oral', freq: 'BID', cls: 'Tetracycline antibiotic', info: 'Take with a full glass of water and stay upright 30 minutes; separate from calcium/iron by 2 hours; photosensitivity.', holdIf: ['npo'], indication: 'Hidradenitis suppurativa (long-term)' });
      homeOnce(spec, { key: 'clindamycin_topical', name: 'clindamycin 1% topical gel', dose: 'Thin layer to affected areas', route: 'Topical', freq: 'BID', cls: 'Topical antibiotic', info: 'Apply to clean dry skin of axillae and groin lesions.', indication: 'Hidradenitis suppurativa' });
      baseLab(spec, 'WBC', 10.4, 'max'); baseLab(spec, 'CRP', 14, 'max'); baseLab(spec, 'ESR', 30, 'max');
      pain(spec, 1);
      orderOnce(spec, { name: 'Hidradenitis wound care: absorbent non-adhesive dressings', category: 'Nursing', frequency: 'Daily and PRN', instructions: 'Cleanse draining lesions gently with saline or dilute antiseptic wash, cover with soft absorbent (foam) pads; avoid adhesive tape in axillae/groin, avoid friction and tight clothing, no shaving. Note drainage amount and odor; standard precautions with contact to drainage (wear gloves).', startH: 3 });
      assess(spec, [['Skin', 'Skin', 'Axillae and inguinal folds: Hurley stage II with painful nodules, two draining sinus tracts with scant malodorous purulent drainage, scarring; no spreading erythema'], ['Pain', 'Pain Location', 'Bilateral axillae and groin, worse with movement']]);
      comorb(spec, { key: 'hidradenitis', problem: 'Hidradenitis suppurativa', details: 'Chronic inflammatory disease with recurrent abscesses and draining sinus tracts in axillae/groin.', pmh: 'Hidradenitis suppurativa (Hurley stage II)', plan: () => ['Continue doxycycline and topical therapy; absorbent dressings daily.', 'Pain control; report fever or spreading cellulitis.'] });
    }
  });

  HX.add('npwt_wound', {
    label: 'Chronic Wound with Negative-Pressure Device (NPWT)', group: SKIN, aliases: ['wound vac', 'vac', 'negative pressure wound therapy', 'npwt', 'chronic wound'], order: 70,
    desc: 'Chronic sacral/gluteal wound with a wound VAC device entry: -125 mmHg, dressing change schedule, canister output, 2-hour off-time rule, bleeding and anticoagulant caution.',
    apply(ctx, spec) {
      if (!spec.devices.some(d => /negative/i.test(d.type))) spec.devices.push({ deviceType: 'Drain', type: 'Negative-pressure wound therapy (wound VAC)', location: 'Sacral / gluteal wound', siteMarker: 'pelvis', placeH: -24 * 12, preexisting: true, status: 'Active', drainage: '40 mL serosanguineous in canister over the last 12 hours', assess: 'black foam collapsed, seal airtight, continuous -125 mmHg, no leak or alarm; tubing patent; periwound skin intact' });
      baseLab(spec, 'Albumin', 3.1, 'min'); baseLab(spec, 'Hemoglobin', ctx.female ? 10.8 : 11.6, 'min');
      boost(spec, 1);
      orderOnce(spec, { name: 'Negative-pressure wound therapy -125 mmHg continuous', category: 'Nursing', frequency: 'Continuous', instructions: 'Maintain -125 mmHg continuous. Check seal, canister volume and tubing each shift; empty canister when full. Dressing change every 48-72 hours by trained RN/wound nurse; measure and document wound bed each change. If therapy is off for more than 2 hours: remove the foam and apply a moist saline gauze dressing, call provider/wound nurse.', startH: 3, nursing: ['Stop NPWT and call the provider for bright red blood in tubing/canister or sudden increase in bloody output.'] });
      orderOnce(spec, { name: 'Turn and reposition every 2 hours; keep tubing off the skin', category: 'Nursing', frequency: 'Every 2 hours', instructions: 'Avoid lying on the tubing and device; offload the wound area; check Braden each shift.', startH: 3 });
      orderOnce(spec, WOUND_CARE);
      orderOnce(spec, { name: 'Disconnect and remove NPWT before MRI', category: 'Nursing', frequency: 'PRN', instructions: 'The device and some dressings are not MRI safe; wound nurse to replace with a moist dressing and reapply afterwards.', startH: 3 });
      if (onAnticoag(spec)) stickyOnce(spec, 'NPWT with anticoagulant', 'Patient on an anticoagulant with a negative-pressure device: higher bleeding risk. Watch canister for blood, hold NPWT and call provider if bleeding.');
      assess(spec, [['Skin', 'Skin', 'Sacral/gluteal wound 6.0 x 4.0 x 1.5 cm under NPWT foam; red granulating base, no slough or exposed bone, serosanguineous drainage, periwound intact'], ['Skin', 'Braden Score', '14']]);
      comorb(spec, { key: 'npwt_wound', problem: 'Chronic wound on negative-pressure therapy', details: 'Chronic sacral/gluteal wound with wound VAC; dressing changes by wound care.', pmh: 'Chronic non-healing wound on negative-pressure wound therapy', plan: () => ['NPWT -125 mmHg continuous; dressing change every 48-72 hours.', 'Off-time over 2 hours means remove foam and use a moist dressing; report bleeding.'] });
    }
  });

  HX.add('edema_skin', {
    label: 'Chronic Peripheral Edema (skin care)', group: SKIN, aliases: ['leg swelling', 'swollen legs', 'dependent edema', 'weeping legs'], order: 70,
    desc: 'Chronic bilateral leg edema with fragile skin: elevation, emollients, compression as tolerated, skin breakdown prevention, weights.',
    apply(ctx, spec) {
      boost(spec, 1);
      homeOnce(spec, { key: 'emollient_lymph', name: 'fragrance-free emollient (EUCERIN) lotion', dose: 'Thin layer to both legs', route: 'Topical', freq: 'BID', cls: 'Emollient', info: 'Keep stretched edematous skin supple to prevent cracks and weeping.', indication: 'Chronic edema skin care' });
      orderOnce(spec, { name: 'Elevate legs and protect edematous skin', category: 'Nursing', frequency: 'Every shift', instructions: 'Elevate legs on pillows above heart level when in bed/chair; no tight socks; inspect legs and heels each shift for blisters, weeping, skin tears or redness; pad bony areas; avoid adhesive on legs. Compression stockings only if pulses present, no decompensated HF.', startH: 3 });
      orderOnce(spec, { name: 'Daily weight', category: 'Nursing', frequency: 'Daily', instructions: 'Same scale each morning before breakfast; report gain over 2 lb in a day or 5 lb in a week.', startH: 3 });
      orderOnce(spec, { name: 'Skin assessment with Braden Score every shift', category: 'Nursing', frequency: 'Every shift', instructions: 'Check heels, sacrum and edematous areas.', startH: 3 });
      assess(spec, [['Cardiac', 'Edema', '2+ bilateral pitting edema to mid-shin'], ['Skin', 'Skin', 'Lower legs taut, shiny and dry with flaking; no open or weeping areas; heels intact'], ['Skin', 'Braden Score', '18']]);
      comorb(spec, { key: 'edema_skin', problem: 'Chronic peripheral edema', details: 'Chronic bilateral dependent leg edema with fragile skin.', pmh: 'Chronic bilateral lower extremity edema', plan: () => ['Elevation and skin care every shift; daily weight.', 'Report weeping, blisters, redness or sudden one-sided swelling (DVT/cellulitis).'] });
    }
  });
})();

/* ---------- Eye / Ear / Other ---------- */
(() => {
  const HX = NS.HX, U = NS.util;
  const { comorb, assess, addLabs, heldNote } = HX.helpers;
  const { homeOnce, orderOnce, stickyOnce, baseLab, pain, boost, periodic, anyHx, EYE } = HX._mo;
  const hasAny = (ctx, ...ks) => ks.some(k => ctx.has(k));

  HX.add('glaucoma', {
    label: 'Glaucoma', group: EYE, aliases: ['eye pressure', 'open angle glaucoma', 'narrow angle', 'eye drops', 'latanoprost', 'timolol'], order: 65,
    desc: 'Eye drops that must be given exactly on schedule; anticholinergics avoided; beta-blocker drops swapped for brimonidine in asthma/COPD/HF; peripheral vision loss raises fall risk.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'latanoprost', name: 'latanoprost (XALATAN) 0.005% ophthalmic solution', dose: '1 drop in both eyes', route: 'Ophthalmic', freq: 'qHS', at: ['2100'], cls: 'Prostaglandin analog', info: 'TIME-CRITICAL: give exactly at scheduled time; missed doses raise eye pressure. Wash hands, tilt head back, do not touch the dropper tip to the eye, press the inner corner of the eye for 1 minute. Wait 5 minutes between different eye drops.', indication: 'Glaucoma (home eye drop)' });
      if (hasAny(ctx, 'copd', 'asthma', 'hf', 'afib') || ['copd_exac', 'asthma_exac', 'chf'].includes(spec.primaryKey)) homeOnce(spec, { key: 'brimonidine', name: 'brimonidine (ALPHAGAN P) 0.1% ophthalmic solution', dose: '1 drop in both eyes', route: 'Ophthalmic', freq: 'TID', cls: 'Alpha-2 agonist (eye)', info: 'TIME-CRITICAL: give on schedule. Beta-blocker eye drops avoided here (bronchospasm / bradycardia). May cause drowsiness and dry mouth. Wait 5 minutes between eye drops.', indication: 'Glaucoma (beta-blocker drop avoided with lung / heart disease)' });
      else homeOnce(spec, { key: 'timolol_eye', name: 'timolol (TIMOPTIC) 0.5% ophthalmic solution', dose: '1 drop in both eyes', route: 'Ophthalmic', freq: 'BID', cls: 'Beta blocker (eye)', info: 'TIME-CRITICAL. Can be absorbed systemically: check HR before giving and report bradycardia or wheezing. Press the inner corner of the eye for 1 minute.', monitor: ['HR'], hold: 'Notify provider if HR below 55 or new wheeze.', indication: 'Glaucoma (home eye drop)' });
      // anticholinergics (angle-closure risk) are not ordered
      const bad = spec.meds.filter(m => /diphenhydramine|scopolamine|hyoscyamine|benztropine|promethazine/i.test(m.name));
      if (bad.length) { spec.meds = spec.meds.filter(m => !bad.includes(m)); spec.applied.push(`${bad.map(m => m.name.split(' ')[0]).join(', ')} omitted because of glaucoma (anticholinergic).`); }
      orderOnce(spec, { name: 'Glaucoma eye drops exactly on schedule', category: 'Nursing', frequency: 'As scheduled', instructions: 'Give ophthalmic drops within 30 minutes of the scheduled time and do not skip when NPO. Avoid anticholinergic drugs (diphenhydramine, scopolamine, hyoscyamine, promethazine); use ipratropium with a mouthpiece rather than a face mask if possible. Report sudden eye pain, halos, nausea/vomiting with headache or blurred vision (acute angle closure).', startH: 3, nursing: ['Eye drops are ordered at a specific time; late doses can cause pressure spikes.'] });
      boost(spec, 1);
      assess(spec, [['Neurologic', 'Vision', 'Reduced peripheral vision both eyes (tunnel vision); central acuity 20/40 with glasses; pupils equal, round, reactive'], ['Safety', 'Fall Precautions', 'Peripheral vision loss: orient to room, keep path clear, call light within sight']]);
      comorb(spec, { key: 'glaucoma', problem: 'Glaucoma', details: 'Open-angle glaucoma with peripheral visual field loss on daily eye drops.', pmh: 'Glaucoma (open angle)', plan: () => ['Eye drops continued exactly on schedule; no anticholinergics.', 'Report eye pain/halos/vomiting immediately; vision-related fall precautions.'] });
    }
  });

  HX.add('macular_degeneration', {
    label: 'Macular Degeneration / Vision Impairment', group: EYE, aliases: ['amd', 'low vision', 'blind', 'visual impairment', 'legally blind', 'vision loss'], order: 65,
    desc: 'Central vision loss: orientation to room, call light precautions, announce yourself, read menus and labels; high fall risk; AREDS2 vitamins.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'areds2', name: 'AREDS2 multivitamin/mineral softgel', dose: '1 softgel', route: 'Oral', freq: 'BID', cls: 'Vitamin / antioxidant', info: 'Give with food. Slows progression of dry macular degeneration.', holdIf: ['npo'], indication: 'Age-related macular degeneration' });
      boost(spec, 2);
      orderOnce(spec, { name: 'Low-vision / blindness orientation and call-light precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Announce yourself and explain everything before touching; orient to the room layout by touch and keep furniture and items in the same place; call light on the better-seeing side and show how to use it; read menus, labels and medication names aloud; use large-print and high-contrast materials; verify understanding before procedures; guide with your arm. Do not mistake vision loss for confusion.', startH: 3, nursing: ['Do not assume disorientation: confirm orientation by voice and touch.'] });
      orderOnce(spec, { name: 'Fall precautions (high risk)', category: 'Precautions', frequency: 'Continuous', instructions: 'Low bed, clutter-free path, night light, non-skid footwear, bed alarm, escort to bathroom. Keep glasses/low-vision aids within reach.', startH: 3 });
      stickyOnce(spec, 'Vision impairment', 'Central vision loss from macular degeneration: cannot read print, recognizes people poorly. Identify yourself, orient to room, read medication labels aloud.');
      assess(spec, [['Neurologic', 'Vision', 'Central vision loss both eyes (counts fingers at 3 feet); peripheral vision intact; cannot read standard print; wears glasses'], ['Neurologic', 'Orientation', 'Alert and oriented x4 (oriented by voice and touch; vision impaired)'], ['Safety', 'Fall Precautions', 'High risk (vision impairment): oriented to room, call light on right side, path clear, bed alarm on']]);
      comorb(spec, { key: 'amd', problem: 'Age-related macular degeneration', details: 'Bilateral central vision loss; receives intravitreal injections as an outpatient.', pmh: 'Age-related macular degeneration (low vision)', plan: () => ['Low-vision orientation and call-light precautions; read labels aloud.', 'Fall precautions; allow extra time and explain each step.'] });
    }
  });

  HX.add('hearing_loss', {
    label: 'Hearing Loss / Hearing Aids', group: EYE, aliases: ['deaf', 'hard of hearing', 'hearing aid', 'presbycusis', 'tinnitus'], order: 65,
    desc: 'Bilateral hearing aids: communication precautions, amplifier, battery/aid care and ototoxic-drug review; hearing loss can mimic confusion.',
    apply(ctx, spec) {
      boost(spec, 1);
      orderOnce(spec, { name: 'Communication precautions: hearing loss, hearing aids in', category: 'Precautions', frequency: 'Continuous', instructions: 'Hearing aids IN and on whenever awake (check batteries, label and store in a case, never in a tray or tissue); face the patient at eye level, get attention first, speak slowly in a low pitch without shouting, reduce background noise, use a pocket amplifier, write key information, teach-back for instructions. Do not label hearing loss as confusion.', startH: 3, nursing: ['Hearing aids are the most commonly lost items - document at admission and at every transfer.'] });
      orderOnce(spec, { name: 'Ototoxic medication review', category: 'Nursing', frequency: 'Daily', instructions: 'Question new gentamicin, vancomycin troughs, high-dose loop diuretics, aspirin/NSAIDs at high doses; report tinnitus or worsening hearing.', startH: 3 });
      assess(spec, [['Neurologic', 'Hearing', 'Moderate bilateral sensorineural hearing loss; wears bilateral behind-the-ear hearing aids, in place and functioning; communicates with raised volume and lip-reading'], ['Neurologic', 'Orientation', 'Alert and oriented x4 with hearing aids in'], ['Safety', 'Fall Precautions', 'Hearing aids in; hearing loss may delay response to alarms and call-outs']]);
      stickyOnce(spec, 'Hearing aids', 'Patient wears bilateral hearing aids. Make sure they are in before education, consent or neuro checks. Face the patient, speak slowly, use teach-back.');
      comorb(spec, { key: 'hearing_loss', problem: 'Bilateral hearing loss', details: 'Sensorineural hearing loss with bilateral hearing aids.', pmh: 'Bilateral hearing loss (hearing aids)', plan: () => ['Hearing aids in when awake; amplifier and written communication.', 'Review ototoxic medications; reassess orientation with aids in.'] });
    }
  });

  HX.add('neuropathic_pain', {
    label: 'Chronic Pain Syndrome / Neuropathic Pain', group: EYE, aliases: ['neuropathy', 'chronic pain', 'diabetic neuropathy pain', 'postherpetic neuralgia', 'nerve pain'], order: 65,
    desc: 'Chronic burning/tingling nerve pain: gabapentin or duloxetine (renally dosed), lidocaine patch; sedation and fall precautions, baseline pain score expectations.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'gabapentin', name: 'gabapentin (NEURONTIN) capsule', dose: ['300 mg', '600 mg', '300 mg'][ctx.age % 3], route: 'Oral', freq: 'TID', cls: 'Gabapentinoid', info: 'Sedation, dizziness, edema. Additive respiratory depression with opioids: monitor sedation and RR. Do not stop abruptly.', monitor: ['RR'], holdIf: ['npo'],
        renal: { ckd3: { dose: '200 mg', freq: 'BID', note: 'Gabapentin reduced for reduced kidney function.' }, esrd: { dose: '100 mg', freq: 'daily', note: 'Gabapentin 100 mg daily, given after dialysis on dialysis days.' } }, indication: 'Neuropathic pain' });
      homeOnce(spec, { key: 'lidocaine_patch', name: 'lidocaine 4% (LIDODERM) patch', dose: '1 patch to the painful area', route: 'Topical', freq: 'daily', at: ['0900'], cls: 'Topical anesthetic', info: 'Apply to intact skin 12 hours on, 12 hours off. Remove old patch first.', indication: 'Localized neuropathic pain' });
      if (ctx.age < 70 && ctx.age % 2) homeOnce(spec, { key: 'duloxetine', name: 'duloxetine (CYMBALTA) capsule', dose: '60 mg', route: 'Oral', freq: 'daily', cls: 'SNRI', info: 'Do not crush; do not stop abruptly. Serotonin syndrome risk with tramadol, linezolid, ondansetron.', monitor: ['BP'], renal: { ckd3: { dose: '30 mg', note: 'Duloxetine reduced for reduced kidney function.' }, esrd: { avoid: true } }, indication: 'Chronic neuropathic pain' });
      boost(spec, 1); pain(spec, 2);
      orderOnce(spec, { name: 'Chronic pain: assess neuropathic pain character and function', category: 'Nursing', frequency: 'Every shift', instructions: 'Ask about burning, tingling, shooting pain; use a functional goal (e.g. sleep, walking) alongside the 0-10 score. Baseline pain 4-5/10 may persist; treat NEW or different pain as new. Protect numb extremities from heat/cold and pressure.', startH: 3 });
      assess(spec, [['Neurologic', 'Sensation', 'Burning and tingling in both feet with decreased light touch and vibration to the ankles'], ['Pain', 'Pain Location', 'Both feet and lower legs, burning, 5/10 baseline'], ['Safety', 'Fall Precautions', 'Sensory loss and sedating pain medications: bed low, non-skid socks, assist with ambulation']]);
      comorb(spec, { key: 'neuropathic_pain', problem: 'Chronic neuropathic pain', details: 'Peripheral neuropathic pain on gabapentin and topical lidocaine; baseline pain 4-5/10.', pmh: 'Chronic pain syndrome / peripheral neuropathy', plan: () => ['Gabapentin continued (renally dosed); lidocaine patch.', 'Monitor sedation and RR if combined with opioids; fall precautions.'] });
    }
  });

  HX.add('allergic_rhinitis', {
    label: 'Allergic Rhinitis', group: EYE, aliases: ['hay fever', 'seasonal allergies', 'nasal allergies', 'sinus allergies'], order: 70,
    desc: 'Nasal steroid spray, non-sedating antihistamine and montelukast; avoid first-generation antihistamines in older adults.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'fluticasone_nasal', name: 'fluticasone (FLONASE) nasal spray', dose: '2 sprays each nostril', route: 'Intranasal', freq: 'daily', cls: 'Intranasal corticosteroid', info: 'Shake gently, aim away from the septum, do not sniff hard. Takes days for full effect.', indication: 'Allergic rhinitis' });
      homeOnce(spec, { key: 'loratadine', name: 'loratadine (CLARITIN) tablet', dose: '10 mg', route: 'Oral', freq: 'daily', cls: 'Antihistamine (non-sedating)', info: 'Non-sedating; preferred over diphenhydramine in older adults.', holdIf: ['npo'], indication: 'Allergic rhinitis' });
      if (ctx.age % 2) homeOnce(spec, { key: 'montelukast', name: 'montelukast (SINGULAIR) tablet', dose: '10 mg', route: 'Oral', freq: 'qHS', cls: 'Leukotriene receptor antagonist', info: 'Report mood or sleep changes, agitation or suicidal thoughts (boxed warning).', holdIf: ['npo'], indication: 'Allergic rhinitis' });
      assess(spec, [['Respiratory', 'Nasal Passages', 'Pale boggy turbinates with clear rhinorrhea; no sinus tenderness; no purulent drainage']]);
      comorb(spec, { key: 'allergic_rhinitis', problem: 'Allergic rhinitis', details: 'Seasonal and perennial allergic rhinitis on nasal steroid and antihistamine.', pmh: 'Allergic rhinitis', plan: () => ['Continue nasal steroid and non-sedating antihistamine; avoid diphenhydramine in older adults.'] });
    }
  });

  HX.add('anaphylaxis_hx', {
    label: 'History of Anaphylaxis (EpiPen)', group: EYE, aliases: ['epipen', 'epinephrine auto-injector', 'severe allergy', 'anaphylactic', 'bee sting allergy'], order: 70,
    desc: 'Prior anaphylaxis with a home EpiPen: epinephrine IM PRN order, allergy alert, observation after new drugs/contrast, beta-blocker and glucagon caution.',
    apply(ctx, spec) {
      homeOnce(spec, { key: 'epinephrine_im', name: 'epinephrine (EPIPEN) auto-injector', dose: '0.3 mg', route: 'IM', freq: 'q5min', prn: true, prnInterval: 'May repeat in 5-15 minutes', prnFor: 'anaphylaxis (hives plus airway, breathing or BP compromise)', cls: 'Alpha/beta agonist', highAlert: true,
        info: 'Anterolateral thigh IM, through clothing if needed; hold 3 seconds. Call a rapid response, lay patient flat with legs raised, give oxygen and IV fluids; monitor 4-6 hours (biphasic reaction). Patient\'s own EpiPen kept per pharmacy; use unit stock in emergencies.', monitor: ['BP', 'HR', 'RR', 'SPO2'], indication: 'History of anaphylaxis (home EpiPen)' });
      orderOnce(spec, { name: 'Anaphylaxis precautions: allergy band verified, epinephrine available', category: 'Precautions', frequency: 'Continuous', instructions: 'Verify allergy band and trigger on admission. Epinephrine 0.3 mg IM must be immediately available. Observe 30 minutes after the first dose of any new antibiotic, IV contrast or blood product; report hives, wheeze, throat tightness or hypotension at once. Patients on beta blockers may need glucagon.', startH: 3, nursing: ['Do not give a drug that is on the allergy list; ask about cross-reactivity (e.g. penicillin-cephalosporin).'] });
      stickyOnce(spec, 'Anaphylaxis history', 'Patient has had anaphylaxis and carries an EpiPen. Epinephrine IM is the first-line drug - give it early and call rapid response. Antihistamines and steroids do not treat airway or BP compromise.');
      assess(spec, [['Skin', 'Skin', 'Warm, dry, intact; no urticaria or angioedema'], ['Respiratory', 'Respiratory Effort', 'Unlabored, no stridor or wheeze']]);
      comorb(spec, { key: 'anaphylaxis_hx', problem: 'History of anaphylaxis', details: 'Prior anaphylactic reaction; carries an epinephrine auto-injector.', pmh: 'History of anaphylaxis (EpiPen)', plan: () => ['Epinephrine IM PRN order active; allergy band verified.', 'Observe after first doses of new drugs/contrast; rapid response for airway or BP changes.'] });
    }
  });

  HX.add('menopause_hrt', {
    label: 'Menopause / Hormone Therapy', group: EYE, aliases: ['hrt', 'estrogen', 'postmenopausal', 'hot flashes', 'estradiol'], order: 70,
    desc: 'Postmenopausal estradiol (with progesterone if the uterus is intact); held with VTE/stroke/MI risk or immobility, bone health, vasomotor symptoms.',
    apply(ctx, spec) {
      if (!ctx.female) { spec.warnings.push({ level: 'warning', text: 'Menopause / hormone therapy is selected for a male patient; no effect applied.' }); return; }
      const risky = ['pe', 'stroke', 'nstemi', 'stemi', 'hip_fracture'].includes(spec.primaryKey) || ctx.has('afib');
      const noUterus = ctx.surg.has('hysterectomy');
      if (risky) heldNote(spec, 'Home estradiol therapy held: thrombotic risk (VTE, stroke, MI, fracture/immobility). Provider to decide on resumption.');
      else {
        homeOnce(spec, { key: 'estradiol', name: 'estradiol (ESTRACE) tablet', dose: ['0.5 mg', '1 mg'][ctx.age % 2], route: 'Oral', freq: 'daily', cls: 'Estrogen', info: 'Increases risk of blood clots, stroke and breast cancer. Hold and notify provider if immobile, post-op, or new leg swelling/chest pain. Report vaginal bleeding.', hold: 'Hold and notify provider before surgery, prolonged bedrest or if VTE/stroke/MI suspected.', holdIf: ['surgeryWindow', 'npo'], indication: 'Menopause (vasomotor symptoms)' });
        if (!noUterus) homeOnce(spec, { key: 'progesterone', name: 'progesterone (PROMETRIUM) capsule', dose: '100 mg', route: 'Oral', freq: 'qHS', cls: 'Progestin', info: 'Protects the uterus when estrogen is taken. May cause drowsiness; give at bedtime.', holdIf: ['surgeryWindow', 'npo'], indication: 'Endometrial protection (intact uterus)' });
      }
      homeOnce(spec, { key: 'vitamin_d3', name: 'cholecalciferol (vitamin D3) tablet', dose: '1,000 units', route: 'Oral', freq: 'daily', cls: 'Vitamin D', holdIf: ['npo'], indication: 'Postmenopausal bone health' });
      assess(spec, [['Skin', 'Skin', 'Warm, dry, intact; intermittently flushed with reported night sweats']]);
      comorb(spec, { key: 'menopause_hrt', problem: 'Menopause on hormone therapy', details: 'Postmenopausal with vasomotor symptoms; on estrogen therapy' + (noUterus ? ' (no uterus).' : ' with progesterone.'), pmh: 'Menopause (hormone therapy)', plan: () => [risky ? 'Estrogen held this admission because of thrombotic risk; DVT prophylaxis; reassess resumption.' : 'Continue estradiol unless surgery/immobilization; hold and call for VTE signs.', 'Hot flashes are expected; do not mistake for fever without a temperature check.'] });
    }
  });

  HX.add('fall_history', {
    label: 'History of Falls', group: EYE, aliases: ['falls', 'recurrent falls', 'fall risk', 'fell'], order: 70,
    desc: 'Two or more falls in the past 6 months: high fall-risk score, bed alarm, hourly rounding, orthostatic vitals, PT/OT, medication review.',
    apply(ctx, spec) {
      boost(spec, 3);
      orderOnce(spec, { name: 'Fall precautions (high risk), bed alarm on', category: 'Precautions', frequency: 'Continuous', instructions: 'History of recurrent falls: low bed, bed/chair alarm on, hourly purposeful rounding (pain, position, toileting, possessions), scheduled toileting, non-skid footwear, call light and personal items within reach, yellow wristband/signage. Assist x1 with all transfers; do not leave alone in the bathroom.', startH: 3 });
      orderOnce(spec, { name: 'Orthostatic blood pressure', category: 'Nursing', frequency: 'Daily x3 days and PRN dizziness', instructions: 'Lying, sitting, standing at 1 and 3 minutes. Report a fall of SBP 20 or DBP 10, or symptoms.', startH: 3 });
      orderOnce(spec, { name: 'PT/OT evaluation: gait, balance and home safety', category: 'Consult', frequency: 'Once', instructions: 'Gait and balance testing, assistive device, home safety and discharge equipment.', startH: 3 });
      orderOnce(spec, { name: 'Pharmacy review of fall-risk medications', category: 'Consult', frequency: 'Once', instructions: 'Review sedatives, opioids, antihypertensives, anticholinergics and sleep aids.', startH: 3 });
      homeOnce(spec, { key: 'vitamin_d3', name: 'cholecalciferol (vitamin D3) tablet', dose: '1,000 units', route: 'Oral', freq: 'daily', cls: 'Vitamin D', holdIf: ['npo'], indication: 'Fall prevention / bone health' });
      stickyOnce(spec, 'Fall risk', 'Two falls in the last 6 months. High fall-risk score: bed alarm on, hourly rounding, assist with all transfers.');
      assess(spec, [['Musculoskeletal / Mobility', 'Mobility', 'Ambulates with rolling walker and standby assist; unsteady turning'], ['Safety', 'Fall Precautions', 'High risk (2 falls in 6 months): bed alarm on, bed low, hourly rounding, assist x1, non-skid socks']]);
      comorb(spec, { key: 'fall_history', problem: 'History of falls', details: 'Two falls in the past 6 months; gait instability.', pmh: 'Recurrent falls (2 in last 6 months)', plan: () => ['High fall-risk precautions; PT/OT and orthostatic vitals.', 'Review medications that increase fall risk.'] });
    }
  });

  HX.add('frailty', {
    label: 'Frailty', group: EYE, aliases: ['frail', 'failure to thrive', 'weak elderly', 'debility', 'deconditioned'], order: 70,
    desc: 'Frail older adult: high fall and delirium risk, fragile skin, low albumin, nutrition, PT/OT and goals-of-care considerations.',
    apply(ctx, spec) {
      boost(spec, 2);
      baseLab(spec, 'Albumin', 3.2, 'min'); baseLab(spec, 'Hemoglobin', ctx.female ? 11.0 : 11.8, 'min');
      spec.vitalAdjust.push({ sbp: -4 });
      orderOnce(spec, { name: 'Frailty precautions: falls, delirium and skin tears', category: 'Precautions', frequency: 'Continuous', instructions: 'High fall risk (bed alarm, assist x1-2, scheduled toileting); delirium prevention (glasses/hearing aids, orientation, sleep, avoid sedatives); fragile skin: paper tape or silicone dressings, pad bony areas, no friction when repositioning.', startH: 3 });
      orderOnce(spec, { name: 'Dietitian consult and nutrition support', category: 'Consult', frequency: 'Once', instructions: 'Weight loss and low albumin: high-protein supplements between meals, feeding assistance, weekly weights.', startH: 3 });
      orderOnce(spec, { name: 'PT/OT evaluation and early mobilization', category: 'Consult', frequency: 'Daily', instructions: 'Up to chair for meals, ambulate with assistance 3 times daily; evaluate for rehab placement.', startH: 3 });
      orderOnce(spec, { name: 'Goals of care and polypharmacy review', category: 'Consult', frequency: 'Once', instructions: 'Palliative/geriatrics input as needed; review code status and deprescribe where possible. Start low and go slow with new medications.', startH: 3 });
      assess(spec, [['Musculoskeletal / Mobility', 'Mobility', 'Frail: slow gait (under 0.6 m/s), weak grip, ambulates with rolling walker and assist x1'], ['Skin', 'Skin', 'Thin, dry, fragile skin with senile purpura; intact'], ['Skin', 'Braden Score', '16'], ['Safety', 'Fall Precautions', 'High risk (frailty): bed alarm on, bed low, hourly rounding, assist x1']]);
      comorb(spec, { key: 'frailty', problem: 'Frailty', details: 'Frail older adult with weight loss, weakness and reduced reserve; high risk of delirium and functional decline.', pmh: 'Frailty (weight loss, weakness)', plan: () => ['Early mobility, nutrition support, delirium and fall precautions.', 'Start low, go slow with medications; goals-of-care discussion.'] });
    }
  });

  HX.add('b12_deficiency', {
    label: 'Vitamin B12 Deficiency / Pernicious Anemia', group: EYE, aliases: ['pernicious anemia', 'b12', 'cobalamin', 'macrocytic anemia', 'cyanocobalamin'], order: 70,
    desc: 'Low B12 with macrocytic anemia and mild neuropathy: B12 replacement (daily oral or monthly IM), MCV elevated, fall and neuro considerations.',
    apply(ctx, spec) {
      baseLab(spec, 'Vitamin B12', 180, 'set'); baseLab(spec, 'MCV', 104, 'set'); baseLab(spec, 'Hemoglobin', ctx.female ? 10.6 : 11.2, 'min'); baseLab(spec, 'Hematocrit', ctx.female ? 32 : 34, 'min');
      addLabs(spec, 0.5, ['Vitamin B12', 'Folate', 'MCV']);
      if (ctx.age % 2) homeOnce(spec, { key: 'vitamin_b12', name: 'cyanocobalamin (vitamin B12) tablet', dose: '1,000 mcg', route: 'Oral', freq: 'daily', cls: 'Vitamin B12', info: 'Lifelong replacement. Report numbness, balance problems, sore tongue.', holdIf: ['npo'], indication: 'Vitamin B12 deficiency' });
      else { const p = periodic(ctx, spec, { key: 'vitamin_b12_im', name: 'cyanocobalamin (vitamin B12) injection', dose: '1,000 mcg', route: 'IM', cls: 'Vitamin B12', highAlert: false, info: 'Given monthly for pernicious anemia (no intrinsic factor, so oral intake is not reliably absorbed). Deep IM; rotate sites; check platelets/INR if anticoagulated.', indication: 'Pernicious anemia (home injection, EVERY MONTH)' }, 2, 'EVERY MONTH'); heldNote(spec, `Cyanocobalamin 1,000 mcg IM is given EVERY MONTH; next due ${p.when}.`); }
      boost(spec, 1);
      assess(spec, [['Skin', 'Skin', 'Pale with faint lemon-yellow tinge, warm, dry, intact'], ['Neurologic', 'Sensation', 'Decreased vibration and position sense in both feet; mild paresthesias'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent with slightly wide-based gait'], ['GI', 'Oral Mucosa', 'Smooth red tongue (glossitis), no ulcers']]);
      comorb(spec, { key: 'b12_deficiency', problem: 'Vitamin B12 deficiency / pernicious anemia', details: 'Macrocytic anemia (MCV about 104) with mild peripheral neuropathy on B12 replacement.', pmh: 'Vitamin B12 deficiency (pernicious anemia)', plan: () => ['Continue B12 replacement (daily oral or monthly IM); trend Hgb and MCV.', 'Fall precautions for neuropathy; transfuse only for symptomatic severe anemia.'] });
    }
  });
})();
