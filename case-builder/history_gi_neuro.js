/* Medical-history modules: Gastrointestinal / Hepatic and Neurologic.
   Registered with NS.HX.add; loaded after history.js. Educational defaults, not rules about every real patient. */
(() => {
  const { home, comorb, assess, addLabs, sticky, heldNote } = NS.HX.helpers;
  // an order with the same name is only added once, so overlapping histories do not repeat it
  const order = (spec, o) => { if (!spec.orders.some(x => x.name === o.name)) NS.HX.helpers.order(spec, o); };
  const add = NS.HX.add;
  const GI = 'Gastrointestinal / Hepatic', NEU = 'Neurologic';
  // deterministic variety without consuming the case random stream
  const pick = (ctx, salt, arr) => arr[(Math.abs(ctx.age) * 7 + salt) % arr.length];
  const primary = ctx => (ctx.input && ctx.input.primary) || '';
  const ppi = (ind, dose) => ({ key: 'pantoprazole', name: 'pantoprazole (PROTONIX) tablet', dose: dose || '40 mg', route: 'Oral', freq: 'daily', cls: 'Proton pump inhibitor', info: 'Give 30-60 minutes before breakfast. Swallow whole.', variants: { npo: { name: 'pantoprazole (PROTONIX) injection', route: 'IV' } }, indication: ind });
  const NSAID_RE = /ketorolac|ibuprofen|naproxen|meloxicam|celecoxib|diclofenac/i;
  // Remove NSAIDs the diagnosis profile may have ordered (multimodal analgesia) when they are unsafe for this history.
  const omitNsaids = (spec, why) => spec.meds.forEach(m => {
    if (m.when !== false && (/^NSAID/i.test(m.cls || '') || NSAID_RE.test(m.name || ''))) { m.when = false; spec.applied.push(`${m.name} omitted: ${why}.`); }
  });
  // Append a sentence to existing (non-NPO) diet orders without renaming them.
  const dietNote = (spec, text) => spec.orders.forEach(o => {
    if (o.category === 'Diet' && !/npo|nothing by mouth|clear liquid|ice chips/i.test(o.name || '') && !(o.instructions || '').includes(text)) o.instructions = (o.instructions ? o.instructions + ' ' : '') + text;
  });
  // Halve the first number in a dose string such as '4 mg' or '0.5 mg'.
  const halve = d => String(d).replace(/(\d+(?:\.\d+)?)/, (m, n) => { const v = parseFloat(n) / 2; return String(Number.isInteger(v) ? v : Math.round(v * 100) / 100); });
  const reduceOpioids = (spec, why) => {
    const cut = m => { if (m && m.dose && !m.reduced) { m.dose = halve(m.dose); m.reduced = true; m.nursing = [...(m.nursing || []), why]; } };
    spec.meds.forEach(m => {
      if (m.when === false || !/^opioid/i.test(m.cls || '')) return;
      cut(m); if (m.alt) cut(m.alt);
      if (m.renal) Object.values(m.renal).forEach(r => r && r.sub && cut(r.sub));
    });
  };
  const capAcetaminophen = (spec, gram, why) => spec.meds.forEach(m => {
    if (m.when === false || !/acetaminophen/i.test(m.name || '') || m.capped) return;
    m.capped = true; m.dose = '650 mg'; m.freq = 'q8h'; if (m.prn) m.prnInterval = 'Every 8 hours';
    m.info = `Maximum ${gram} g per 24 hours from all sources (${why}). ` + String(m.info || '').replace(/Maximum 3 g per (24 hours|day)[^.]*\.?/i, '').trim();
  });

  // ============================ GASTROINTESTINAL / HEPATIC ============================

  add('pud', {
    label: 'Peptic Ulcer Disease', group: GI, aliases: ['ulcer', 'stomach ulcer', 'duodenal ulcer', 'h pylori'], order: 40,
    desc: 'Adds a PPI (IV while NPO), NSAID avoidance (NSAIDs removed from orders), mild anemia tendency.',
    apply(ctx, spec) {
      home(spec, ppi('Peptic ulcer disease', pick(ctx, 1, ['40 mg', '40 mg', '20 mg'])));
      omitNsaids(spec, 'peptic ulcer disease (GI bleeding risk)');
      holdAspirinInBleed(spec);
      order(spec, { name: 'Avoid NSAIDs and aspirin-containing products unless prescribed', category: 'Nursing', frequency: 'Continuous', instructions: 'Question any NSAID order (ibuprofen, ketorolac, naproxen). Use acetaminophen for pain. Report melena, hematemesis or epigastric pain.', startH: 3 });
      assess(spec, [['GI', 'Baseline GI Findings', 'Mild epigastric discomfort at times, relieved by food; no melena reported']]);
      comorb(spec, { key: 'pud', problem: 'Peptic ulcer disease', details: 'Remote duodenal ulcer (H. pylori treated); on a proton pump inhibitor.', pmh: 'Peptic ulcer disease (H. pylori treated)', plan: (c, S, h) => [`Continue pantoprazole${S.flag('npo', h) ? ' IV while NPO' : ''}; avoid NSAIDs.`, 'Monitor stool color and hemoglobin; report black or bloody stool.'] });
    }
  });

  add('crohns', {
    label: "Crohn's Disease", group: GI, aliases: ['crohn', 'inflammatory bowel disease', 'ibd', 'regional enteritis'], order: 45,
    desc: 'Adds an immunomodulator, mild anemia/low albumin, raised CRP, stool tracking, infection and NSAID cautions.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { CRP: 14, Albumin: 3.5, Hemoglobin: ctx.female ? 11.4 : 12.4 });
      spec.vitalAdjust.push({ hr: 2 });
      home(spec, { key: 'azathioprine', name: 'azathioprine (IMURAN) tablet', dose: pick(ctx, 2, ['100 mg', '150 mg', '50 mg']), route: 'Oral', freq: 'daily', cls: 'Immunosuppressant', info: 'Give with food. Immunosuppressed: report fever, sore throat or infection signs. Monitor WBC and liver tests. Wear gloves if crushing.', monitor: ['WBC', 'LFT'], hold: 'Notify provider before giving if WBC is below 3.0 or the patient is septic.', holdIf: ['npo'], holdReason: 'NPO (may be held a few days)', indication: "Crohn's disease maintenance", highAlert: false });
      heldNote(spec, "Adalimumab 40 mg subcutaneous every 2 weeks is given as an outpatient and is not due this admission; hold biologics during active infection.");
      omitNsaids(spec, "Crohn's disease (NSAIDs can trigger flares)");
      order(spec, { name: 'Stool frequency and blood: record every shift', category: 'Nursing', frequency: 'Every shift', instructions: 'Count and describe stools. Report more than 6 stools/day, blood, severe abdominal pain or distension. Avoid NSAIDs and limit opioids/anticholinergics (toxic megacolon risk with a flare).', startH: 3 });
      assess(spec, [['GI', 'Baseline GI Findings', 'Mild right lower quadrant tenderness at baseline; 2-3 loose stools daily'], ['Skin', 'Perianal Skin', 'Intact, no fistula drainage']]);
      comorb(spec, { key: 'crohns', problem: "Crohn's disease", details: 'Ileocolonic Crohn disease on azathioprine; adalimumab as outpatient.', pmh: "Crohn's disease (ileocolonic)", plan: (c, S, h) => ['Continue immunomodulator when eating; immunosuppressed so low threshold to evaluate fever.', S.flag('npo', h) ? 'Azathioprine held while NPO; no steroids unless a flare is confirmed.' : 'Avoid NSAIDs; track stools; GI follow-up for flare signs.'] });
    }
  });

  add('uc', {
    label: 'Ulcerative Colitis', group: GI, aliases: ['colitis', 'ibd', 'inflammatory bowel disease'], order: 45,
    desc: 'Adds mesalamine (+ rectal suppository) and folic acid, mild anemia, stool tracking, NSAID and antidiarrheal cautions.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { CRP: 12, Hemoglobin: ctx.female ? 11.6 : 12.6 });
      home(spec, { key: 'mesalamine', name: 'mesalamine DR (LIALDA) tablet', dose: pick(ctx, 3, ['2.4 g', '4.8 g', '2.4 g']), route: 'Oral', freq: 'daily', cls: 'Aminosalicylate (anti-inflammatory)', info: 'Give with food; swallow whole. Monitor creatinine (rare interstitial nephritis).', monitor: ['Cr'], holdIf: ['npo'], renal: { esrd: { avoid: true }, ckd3: { dose: '2.4 g', note: 'Lowest effective dose; monitor creatinine.' } }, indication: 'Ulcerative colitis maintenance' });
      home(spec, { key: 'folic_acid', name: 'folic acid tablet', dose: '1 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin', info: 'Supplement with colitis / sulfasalazine-type therapy.', holdIf: ['npo'], indication: 'Folate supplementation' });
      if (ctx.age % 2 === 0) home(spec, { key: 'mesalamine_supp', name: 'mesalamine (CANASA) suppository', dose: '1,000 mg', route: 'Rectal', freq: 'qHS', cls: 'Aminosalicylate (anti-inflammatory)', info: 'Insert at bedtime and retain. Wear gloves; offer privacy.', indication: 'Distal colitis' });
      omitNsaids(spec, 'ulcerative colitis (NSAIDs can trigger flares)');
      order(spec, { name: 'Stool frequency and blood: record every shift', category: 'Nursing', frequency: 'Every shift', instructions: 'Count stools; note blood, urgency and nocturnal stools. Avoid NSAIDs. Avoid loperamide and opioids in a suspected flare (toxic megacolon); notify provider for fever, tachycardia or distension.', startH: 3 });
      assess(spec, [['GI', 'Baseline GI Findings', 'Mild lower abdominal tenderness at baseline; 1-2 soft stools daily, occasional urgency']]);
      comorb(spec, { key: 'uc', problem: 'Ulcerative colitis', details: 'Left-sided ulcerative colitis in remission on mesalamine.', pmh: 'Ulcerative colitis (on mesalamine)', plan: (c, S, h) => [S.flag('npo', h) ? 'Mesalamine held while NPO.' : 'Continue mesalamine and folic acid.', 'Track stools; avoid NSAIDs; escalate for bloody diarrhea, fever or tachycardia.'] });
    }
  });

  add('ibs', {
    label: 'Irritable Bowel Syndrome', group: GI, aliases: ['irritable bowel', 'spastic colon'], order: 50,
    desc: 'Adds symptom-directed therapy (IBS-C linaclotide, or IBS-D loperamide/antispasmodic) and diet triggers.',
    apply(ctx, spec) {
      const kind = ctx.age >= 75 ? 'D' : pick(ctx, 4, ['C', 'D', 'D', 'C']);
      if (kind === 'C') home(spec, { key: 'linaclotide', name: 'linaclotide (LINZESS) capsule', dose: '145 mcg', route: 'Oral', freq: 'daily', at: ['0630'], cls: 'Guanylate cyclase-C agonist', info: 'Give 30 minutes before the first meal on an empty stomach; swallow whole. May cause diarrhea; hold for loose stools.', holdIf: ['npo'], holdReason: 'NPO (give before meals)', indication: 'IBS with constipation' });
      else {
        home(spec, { key: 'loperamide', name: 'loperamide (IMODIUM) capsule', dose: '2 mg', route: 'Oral', freq: 'q6h', prn: true, prnInterval: 'Every 6 hours', prnFor: 'loose stools (max 8 mg/day)', cls: 'Antidiarrheal', info: 'Do not give if fever, bloody stool or suspected infectious diarrhea (C. difficile). Maximum 8 mg/day in hospital.', indication: 'IBS with diarrhea', prnGiven: [] });
        if (ctx.age < 70 && !ctx.has('dementia')) home(spec, { key: 'dicyclomine', name: 'dicyclomine (BENTYL) tablet', dose: '20 mg', route: 'Oral', freq: 'QID', prn: true, prnInterval: 'Every 6 hours', prnFor: 'abdominal cramping', cls: 'Antispasmodic (anticholinergic)', info: 'Anticholinergic: may cause dry mouth, urinary retention, confusion. Avoid in older adults and with ileus/obstruction.', indication: 'IBS cramping', prnGiven: [] });
      }
      assess(spec, [['GI', 'Baseline GI Findings', 'Intermittent lower abdominal cramping with altered bowel habit at baseline; abdomen soft, no guarding']]);
      comorb(spec, { key: 'ibs', problem: `Irritable bowel syndrome (${kind === 'C' ? 'constipation' : 'diarrhea'}-predominant)`, details: 'Chronic functional bowel disorder; no alarm features.', pmh: `Irritable bowel syndrome (${kind === 'C' ? 'IBS-C' : 'IBS-D'})`, plan: () => ['Symptom-directed therapy PRN; new fever, blood in stool, or weight loss is NOT explained by IBS and needs evaluation.'] });
    }
  });

  add('cirrhosis', {
    label: 'Cirrhosis / Chronic Liver Disease', group: GI, aliases: ['liver disease', 'esld', 'portal hypertension', 'ascites', 'hepatic encephalopathy', 'liver failure'], order: 35,
    desc: 'Adds lactulose, rifaximin, diuretics, non-selective beta blocker, low albumin/platelets, INR 1.4, encephalopathy watch, 2 g sodium, no NSAIDs/sedatives, acetaminophen max 2 g, reduced opioid doses.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { Albumin: 3.0, Platelets: 96, INR: 1.4, PT: 15.8, 'Total bilirubin': 1.9, AST: 62, ALT: 41, ALP: 138, Sodium: 134, Hemoglobin: ctx.female ? 10.8 : 11.6, Hematocrit: ctx.female ? 33 : 35, Glucose: 104 });
      spec.vitalAdjust.push({ sbp: -8, dbp: -6, hr: 4 });
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      const aki = primary(ctx) === 'aki';
      home(spec, { key: 'lactulose', name: 'lactulose solution', dose: '20 g (30 mL)', route: 'Oral', freq: pick(ctx, 5, ['BID', 'TID']), cls: 'Osmotic laxative (ammonia reducer)', sips: true, info: 'Titrate to 2-3 soft stools per day. Do NOT hold for NPO (may give with sips or per tube). Hold and notify provider if more than 4 loose stools in a day (dehydration, low potassium) or if none and mental status changes.', monitor: ['K', 'Na'], hold: 'Notify provider if more than 4 loose stools/day or fewer than 2 with confusion.', indication: 'Hepatic encephalopathy prevention' });
      home(spec, { key: 'rifaximin', name: 'rifaximin (XIFAXAN) tablet', dose: '550 mg', route: 'Oral', freq: 'BID', cls: 'Antibiotic (gut-selective)', sips: true, info: 'Reduces recurrence of hepatic encephalopathy. Give with lactulose. Report diarrhea (rule out C. difficile).', indication: 'Hepatic encephalopathy prevention' });
      if (!aki) {
        const bb = pick(ctx, 6, ['nadolol', 'propranolol']);
        home(spec, bb === 'nadolol'
          ? { key: 'nadolol', name: 'nadolol (CORGARD) tablet', dose: '20 mg', route: 'Oral', freq: 'daily', cls: 'Non-selective beta blocker', sips: true, info: 'Variceal bleeding prophylaxis. Check BP and HR first. Hold if SBP below 90, HR below 55, or acute bleeding / sepsis / AKI.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if SBP below 90 or HR below 55.', holdIf: ['hypotension', 'bleeding'], holdReason: 'low blood pressure or acute bleeding', renal: { ckd3: { dose: '20 mg', freq: 'q24h', note: 'Renally cleared; monitor HR and BP closely.' }, esrd: { avoid: true } }, indication: 'Esophageal varices (primary prophylaxis)' }
          : { key: 'propranolol', name: 'propranolol (INDERAL) tablet', dose: '20 mg', route: 'Oral', freq: 'BID', cls: 'Non-selective beta blocker', sips: true, info: 'Variceal bleeding prophylaxis. Check BP and HR first. Hold if SBP below 90, HR below 55, or acute bleeding / sepsis / AKI.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if SBP below 90 or HR below 55.', holdIf: ['hypotension', 'bleeding'], holdReason: 'low blood pressure or acute bleeding', indication: 'Esophageal varices (primary prophylaxis)' });
        home(spec, { key: 'spironolactone', name: 'spironolactone (ALDACTONE) tablet', dose: '100 mg', route: 'Oral', freq: 'daily', cls: 'Potassium-sparing diuretic', info: 'Ascites: ratio 100 mg spironolactone to 40 mg furosemide. Monitor potassium, sodium and creatinine; hold for K above 5.5, Na below 125 or rising creatinine.', monitor: ['K', 'Na', 'Cr'], hold: 'Hold and notify provider for K above 5.5, Na below 125, or SBP below 90.', holdIf: ['npo', 'hypotension', 'bleeding'], holdReason: 'NPO, low BP or acute bleeding', renal: { ckd3: { dose: '50 mg', note: 'Reduced dose; hyperkalemia risk in CKD.' }, esrd: { avoid: true } }, indication: 'Cirrhotic ascites' });
        if (primary(ctx) !== 'chf') home(spec, { key: 'furosemide_po', name: 'furosemide (LASIX) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', cls: 'Loop diuretic', info: 'Monitor weight, BP, sodium, potassium and creatinine. Paired with spironolactone for ascites.', monitor: ['BP', 'K', 'Cr'], holdIf: ['npo', 'hypotension', 'bleeding'], holdReason: 'NPO, low BP or acute bleeding', renal: { esrd: { avoid: true } }, indication: 'Cirrhotic ascites' });
      } else heldNote(spec, 'Spironolactone, furosemide and the non-selective beta blocker are held during AKI (rule out hepatorenal syndrome; avoid nephrotoxins).');
      omitNsaids(spec, 'cirrhosis (kidney injury and variceal bleeding risk)');
      holdAspirinInBleed(spec);
      reduceOpioids(spec, 'Cirrhosis: reduced opioid dose (impaired clearance; can precipitate encephalopathy).');
      capAcetaminophen(spec, 2, 'cirrhosis');
      addLabs(spec, 0.5, ['INR', 'PT', 'Albumin', 'Total bilirubin', 'AST', 'ALT', 'Platelets']);
      order(spec, { name: 'Cirrhosis medication safety', category: 'Nursing', frequency: 'Continuous', instructions: 'No NSAIDs. Avoid benzodiazepines, sedatives and anticholinergics (precipitate encephalopathy). Acetaminophen maximum 2 g/day. Opioids at reduced doses only. Pharmacy to review all new drugs.', startH: 3, nursing: ['Question any sedative, NSAID or acetaminophen order above 2 g/day and notify the provider.'] });
      order(spec, { name: 'Hepatic encephalopathy watch with asterixis check', category: 'Nursing', frequency: 'Every shift', instructions: 'Assess orientation, day-night reversal, speech and asterixis (flapping tremor). Count stools; goal 2-3 soft stools/day. Notify provider for new confusion, drowsiness, or fewer than 2 stools.', startH: 3 });
      order(spec, { name: '2 g sodium restriction; protein 1.2-1.5 g/kg; late-evening snack', category: 'Nursing', frequency: 'Daily', instructions: 'No added salt; avoid processed foods. Do not restrict protein. Dietitian consult. No raw shellfish.', startH: 3 });
      order(spec, { name: 'Daily weight and abdominal girth', category: 'Nursing', frequency: 'Daily', instructions: 'Same scale, before breakfast; measure girth at the umbilicus. Report weight gain above 2 lb/day.', startH: 3 });
      order(spec, { name: 'Bleeding precautions (low platelets, elevated INR)', category: 'Precautions', frequency: 'Continuous', instructions: 'Soft toothbrush, electric razor, avoid IM injections and rectal temperatures; hold pressure longer after venipuncture. Watch stools and emesis for blood.', startH: 3 });
      dietNote(spec, '2 g sodium restriction; no protein restriction.');
      assess(spec, [['GI', 'Abdomen', 'Mildly distended with small-volume ascites (fluid wave), soft, non-tender'], ['Neurologic', 'Asterixis', 'Absent; no flapping tremor (no encephalopathy)'], ['Skin', 'Skin', 'Mild scleral icterus; spider angiomata on chest; bruises on forearms'], ['Cardiac', 'Edema', 'Trace to 1+ pitting edema of both ankles']]);
      sticky(spec, 'Cirrhosis cautions', 'Avoid NSAIDs and sedatives; acetaminophen max 2 g/day. New confusion = check for infection, GI bleeding, constipation, electrolyte shifts or missed lactulose before blaming the diagnosis.');
      comorb(spec, { key: 'cirrhosis', problem: 'Cirrhosis with portal hypertension', details: 'Compensated-to-mild decompensated cirrhosis with ascites; albumin about 3.0, platelets about 96, INR about 1.4.', pmh: 'Cirrhosis with ascites and esophageal varices (Child-Pugh B)', plan: (c, S, h) => ['Continue lactulose (titrate to 2-3 soft stools) and rifaximin, including while NPO.', aki ? 'Diuretics and beta blocker held for AKI; evaluate for hepatorenal syndrome.' : S.flag('bleeding', h) || S.flag('hypotension', h) ? 'Diuretics and beta blocker held for bleeding / low BP; restart when hemodynamically stable.' : S.flag('npo', h) ? 'Diuretics held while NPO; beta blocker with sips per parameters.' : 'Continue diuretics and beta blocker with hold parameters.', '2 g sodium diet; avoid NSAIDs/sedatives; acetaminophen max 2 g; reduced-dose opioids.'] });
    }
  });
  // Home aspirin stays on unless there is an active GI bleed (flag set by the GI bleed profile).
  const holdAspirinInBleed = spec => spec.meds.forEach(m => {
    if (m.home && /aspirin/i.test(m.key || '') && !/aspirin_/.test(m.key || '') && !(m.holdIf || []).includes('bleeding')) { m.holdIf = [...(m.holdIf || []), 'bleeding']; m.holdReason = 'active GI bleeding'; }
  });

  add('hepc', {
    label: 'Hepatitis C (chronic)', group: GI, aliases: ['hcv', 'hep c', 'hepatitis'], order: 45,
    desc: 'Mildly raised AST/ALT; direct-acting antiviral if on treatment; standard precautions; acetaminophen limit.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { AST: 54, ALT: 62, Platelets: 188, Albumin: 3.9 });
      const treating = ctx.age % 2 === 1;
      if (treating) home(spec, { key: 'sofosbuvir_velpatasvir', name: 'sofosbuvir-velpatasvir (EPCLUSA) tablet', dose: '400/100 mg', route: 'Oral', freq: 'daily', cls: 'Hepatitis C direct-acting antiviral', sips: true, info: 'One tablet daily for 12 weeks; do not skip doses. Acid suppression (PPI, antacids) lowers absorption: pharmacy to review. Report fatigue, nausea.', monitor: ['LFT'], indication: 'Chronic hepatitis C (week 6 of 12 of treatment)' });
      capAcetaminophen(spec, 2, 'chronic liver disease');
      order(spec, { name: 'Standard precautions (blood-borne pathogen)', category: 'Precautions', frequency: 'Continuous', instructions: 'Standard precautions are sufficient; no isolation. Needlestick safety: use safety devices and report any exposure immediately.', startH: 3 });
      assess(spec, [['Skin', 'Skin', 'Warm, dry, intact; no jaundice or stigmata of chronic liver disease']]);
      comorb(spec, { key: 'hepc', problem: 'Chronic hepatitis C', details: treating ? 'Genotype 1 hepatitis C on sofosbuvir-velpatasvir, no cirrhosis.' : 'Untreated chronic hepatitis C without cirrhosis; outpatient treatment referral pending.', pmh: 'Chronic hepatitis C', plan: () => [treating ? 'Continue the antiviral daily; avoid missed doses.' : 'No inpatient treatment needed; arrange outpatient hepatology.', 'Acetaminophen maximum 2 g/day; avoid alcohol; standard precautions.'] });
    }
  });

  add('hepb', {
    label: 'Hepatitis B (chronic)', group: GI, aliases: ['hbv', 'hep b'], order: 45,
    desc: 'Mildly raised ALT, nucleoside antiviral (do not interrupt), standard precautions, reactivation caution with immunosuppression.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { AST: 42, ALT: 58 });
      if (ctx.renal === 'none' && ctx.age % 2 === 1) home(spec, { key: 'entecavir', name: 'entecavir (BARACLUDE) tablet', dose: '0.5 mg', route: 'Oral', freq: 'daily', at: ['0600'], cls: 'Hepatitis B antiviral', sips: true, info: 'Give on an EMPTY stomach (2 hours after or before a meal). Do not stop abruptly: risk of severe hepatitis flare. Dose adjusted for kidney function.', monitor: ['LFT', 'Cr'], indication: 'Chronic hepatitis B' });
      else home(spec, { key: 'tenofovir_alafenamide', name: 'tenofovir alafenamide (VEMLIDY) tablet', dose: '25 mg', route: 'Oral', freq: 'daily', cls: 'Hepatitis B antiviral', sips: true, info: 'Give with food. Do not stop abruptly: risk of severe hepatitis flare. On dialysis days give after dialysis. Monitor creatinine and phosphorus.', monitor: ['LFT', 'Cr'], indication: 'Chronic hepatitis B' });
      capAcetaminophen(spec, 2, 'chronic liver disease');
      order(spec, { name: 'Standard precautions (blood-borne pathogen)', category: 'Precautions', frequency: 'Continuous', instructions: 'Standard precautions are sufficient; no isolation. Needlestick safety: use safety devices and report any exposure immediately.', startH: 3 });
      comorb(spec, { key: 'hepb', problem: 'Chronic hepatitis B', details: 'Inactive carrier on long-term antiviral suppression; no cirrhosis.', pmh: 'Chronic hepatitis B', plan: (c, S, h) => ['Continue the antiviral (sips allowed if NPO); never stop without hepatology input.', 'Hepatitis B can reactivate with steroids or immunosuppressants: confirm the plan with the provider.'] });
    }
  });

  add('nafld', {
    label: 'Fatty Liver (NAFLD / NASH)', group: GI, aliases: ['nash', 'masld', 'fatty liver', 'steatosis'], order: 50,
    desc: 'Mildly raised ALT/AST and glucose, no cirrhosis; acetaminophen limit, lifestyle counseling.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { AST: 46, ALT: 68 });
      if (spec.labBase.Glucose === undefined) spec.labBase.Glucose = 108;
      capAcetaminophen(spec, 2, 'fatty liver disease');
      assess(spec, [['GI', 'Baseline GI Findings', 'Mild hepatomegaly, non-tender; no ascites']]);
      comorb(spec, { key: 'nafld', problem: 'Nonalcoholic fatty liver disease (NASH)', details: 'Steatohepatitis with mildly raised transaminases; no cirrhosis.', pmh: 'Nonalcoholic fatty liver disease', plan: () => ['No specific inpatient treatment; statins are safe to continue; acetaminophen up to 2 g/day.', 'Counsel on weight loss, glycemic control and alcohol avoidance.'] });
    }
  });

  add('diverticulosis', {
    label: 'Diverticulosis / Diverticular Disease', group: GI, aliases: ['diverticulitis', 'diverticular'], order: 50,
    desc: 'Adds daily fiber supplement, constipation avoidance and NSAID caution (diverticular bleeding risk).',
    apply(ctx, spec) {
      home(spec, { key: 'psyllium', name: 'psyllium (METAMUCIL) powder', dose: '1 tablespoon in 8 oz water', route: 'Oral', freq: 'daily', cls: 'Bulk-forming fiber', info: 'Mix with a full glass of water and drink right away. Hold if NPO or if an obstruction / ileus is suspected.', holdIf: ['npo'], indication: 'Diverticular disease (stool bulk)' });
      order(spec, { name: 'Bowel movement record; avoid constipation and straining', category: 'Nursing', frequency: 'Every shift', instructions: 'Record stools. Report no BM in 48 hours, left lower quadrant pain, fever, or rectal bleeding. Use caution with NSAIDs (diverticular bleeding).', startH: 3 });
      assess(spec, [['GI', 'Baseline GI Findings', 'No left lower quadrant tenderness at baseline; last colonoscopy showed sigmoid diverticula']]);
      comorb(spec, { key: 'diverticulosis', problem: 'Diverticulosis', details: 'Sigmoid diverticulosis on colonoscopy; prior uncomplicated diverticulitis.', pmh: 'Diverticulosis (sigmoid)', plan: (c, S, h) => [S.flag('npo', h) ? 'Fiber supplement held while NPO.' : 'Continue fiber; high-fiber diet when eating.', 'Avoid NSAIDs and constipation; report LLQ pain, fever or rectal bleeding.'] });
    }
  });

  add('hx_gib', {
    label: 'Prior GI Bleed', group: GI, aliases: ['gi bleed history', 'melena', 'gastrointestinal hemorrhage', 'hematochezia'], order: 40,
    desc: 'Adds PPI (IV while NPO), iron, mild baseline anemia, NSAID avoidance; home aspirin is held only during an active bleed.',
    apply(ctx, spec) {
      spec.labBase.Hemoglobin = Math.min(spec.labBase.Hemoglobin || 99, ctx.female ? 11.2 : 12.0);
      spec.labBase.Hematocrit = Math.min(spec.labBase.Hematocrit || 99, ctx.female ? 34 : 36);
      home(spec, ppi('Prior upper GI bleed (ulcer); GI protection'));
      home(spec, { key: 'ferrous_sulfate', name: 'ferrous sulfate tablet', dose: '325 mg', route: 'Oral', freq: 'daily', cls: 'Iron supplement', info: 'May cause dark stools (can mimic melena: check for tarry, sticky, foul stool and guaiac) and constipation.', holdIf: ['npo'], indication: 'Iron deficiency after GI blood loss' });
      holdAspirinInBleed(spec);
      omitNsaids(spec, 'history of GI bleeding');
      order(spec, { name: 'Avoid NSAIDs and aspirin-containing products unless prescribed', category: 'Nursing', frequency: 'Continuous', instructions: 'Question any NSAID order. Report black or bloody stools, vomiting blood, dizziness.', startH: 3 });
      order(spec, { name: 'Stool color and hemoglobin trend watch', category: 'Nursing', frequency: 'Every shift', instructions: 'Document stool color. Iron causes dark but formed stool; melena is tarry and foul-smelling. Report Hgb drop of 1 g/dL or more.', startH: 3 });
      comorb(spec, { key: 'hx_gib', problem: 'History of gastrointestinal bleeding', details: 'Prior bleeding gastric ulcer 3 years ago, resolved; on a PPI and iron.', pmh: 'Prior GI bleed (gastric ulcer)', plan: (c, S, h) => [`Continue pantoprazole${S.flag('npo', h) ? ' IV while NPO' : ''}; avoid NSAIDs.`, 'Trend hemoglobin and stool color; aspirin (if on it) only with a clear indication.'] });
    }
  });

  add('gastroparesis', {
    label: 'Gastroparesis', group: GI, aliases: ['delayed gastric emptying', 'slow stomach'], order: 50,
    desc: 'Adds a prokinetic (not with Parkinson disease), small frequent low-fat meals, aspiration caution, opioid/anticholinergic caution.',
    apply(ctx, spec) {
      if (ctx.has('parkinsons')) home(spec, { key: 'erythromycin', name: 'erythromycin tablet', dose: '250 mg', route: 'Oral', freq: 'TID', cls: 'Prokinetic macrolide', info: 'Used as a prokinetic because metoclopramide worsens Parkinson disease. Give 30 minutes before meals. QT prolongation: check ECG with other QT drugs.', holdIf: ['npo'], indication: 'Gastroparesis (metoclopramide avoided: Parkinson disease)' });
      else home(spec, { key: 'metoclopramide', name: 'metoclopramide (REGLAN) tablet', dose: pick(ctx, 7, ['5 mg', '10 mg']), route: 'Oral', freq: 'ACHS', cls: 'Prokinetic / antiemetic', info: 'Give 30 minutes before meals and at bedtime. Watch for restlessness, tremor, dystonia, and drowsiness (extrapyramidal effects). Boxed warning: tardive dyskinesia; limit duration. Do not use with bowel obstruction.', variants: { npo: { name: 'metoclopramide (REGLAN) injection', route: 'IV' } }, renal: { ckd3: { dose: '5 mg', note: 'Reduce dose by 50% for reduced kidney function.' }, esrd: { dose: '5 mg', freq: 'BID', note: 'Dose reduced for ESRD.' } }, monitor: ['HR'], indication: 'Gastroparesis' });
      order(spec, { name: 'Gastroparesis diet: small frequent low-fat, low-fiber meals', category: 'Nursing', frequency: 'With meals', instructions: 'Six small meals, low fat and low fiber, liquids/soft foods tolerate best; upright 1-2 hours after eating. Avoid opioids and anticholinergics when possible (slow gastric emptying). Report vomiting of undigested food, early satiety, distension.', startH: 3 });
      assess(spec, [['GI', 'Baseline GI Findings', 'Early satiety and intermittent nausea at baseline; epigastric fullness, succussion splash absent, no pain']]);
      comorb(spec, { key: 'gastroparesis', problem: 'Gastroparesis', details: ctx.has('dm2') ? 'Diabetic gastroparesis with delayed gastric emptying.' : 'Idiopathic gastroparesis with delayed gastric emptying.', pmh: 'Gastroparesis', plan: (c, S, h) => [S.flag('npo', h) ? 'Prokinetic given IV while NPO.' : 'Continue prokinetic before meals.', 'Aspiration precautions; minimize opioids and anticholinergics; glucose may be labile.'] });
    }
  });

  add('celiac', {
    label: 'Celiac Disease', group: GI, aliases: ['gluten', 'sprue', 'gluten free'], order: 50,
    desc: 'Adds gluten-free diet requirement, mild anemia/low vitamin D, medication excipient review.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { Hemoglobin: Math.min(spec.labBase.Hemoglobin || 99, ctx.female ? 11.8 : 12.8), Albumin: Math.min(spec.labBase.Albumin || 9, 3.7), Calcium: 8.8 });
      home(spec, { key: 'cholecalciferol', name: 'cholecalciferol (vitamin D3) tablet', dose: '2,000 units', route: 'Oral', freq: 'daily', cls: 'Vitamin', info: 'Malabsorption-related deficiency.', holdIf: ['npo'], indication: 'Vitamin D deficiency (celiac disease)' });
      order(spec, { name: 'Strict gluten-free diet (dietitian to verify trays)', category: 'Nursing', frequency: 'With all meals and snacks', instructions: 'No wheat, barley, rye or cross-contaminated foods; check supplements and oral nutrition drinks. Pharmacy to confirm gluten-free medication products.', startH: 3, nursing: ['Verify every tray and snack is gluten-free before serving.'] });
      dietNote(spec, 'Gluten-free.');
      comorb(spec, { key: 'celiac', problem: 'Celiac disease', details: 'Biopsy-proven celiac disease on a gluten-free diet; mild nutritional deficiencies.', pmh: 'Celiac disease (gluten-free diet)', plan: () => ['Strict gluten-free diet through the stay; dietitian to review.', 'Check medication and supplement excipients for gluten.'] });
    }
  });

  add('chronic_pancreatitis', {
    label: 'Chronic Pancreatitis', group: GI, aliases: ['pancreatic insufficiency', 'pancreatitis'], order: 50,
    desc: 'Adds pancrelipase with meals, low-fat diet, steatorrhea and glucose monitoring, no alcohol.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { Albumin: Math.min(spec.labBase.Albumin || 9, 3.6), Glucose: Math.max(spec.labBase.Glucose || 0, 118) });
      home(spec, { key: 'pancrelipase', name: 'pancrelipase (CREON) capsule', dose: pick(ctx, 8, ['72,000 units (3 capsules)', '48,000 units (2 capsules)']), route: 'Oral', freq: 'TID', at: ['0800', '1200', '1700'], cls: 'Pancreatic enzyme', info: 'Give WITH the first bites of a meal; half the dose with snacks. Swallow whole or open and sprinkle on applesauce; never crush or chew. Do not give if NPO or not eating.', holdIf: ['npo'], holdReason: 'NPO (give only with meals)', indication: 'Exocrine pancreatic insufficiency' });
      order(spec, { name: 'Low-fat meals with enzymes; no alcohol; monitor stools and glucose', category: 'Nursing', frequency: 'With meals', instructions: 'Dietitian to review. Record greasy, floating stools (steatorrhea) and weight. Pancreatic diabetes: glucose checks and watch for hypoglycemia. Treat chronic pain without under-dosing.', startH: 3 });
      assess(spec, [['GI', 'Baseline GI Findings', 'Chronic mild epigastric tenderness, no guarding; loose greasy stools at baseline']]);
      comorb(spec, { key: 'chronic_pancreatitis', problem: 'Chronic pancreatitis', details: 'Chronic calcific pancreatitis with exocrine insufficiency on pancrelipase.', pmh: 'Chronic pancreatitis with exocrine insufficiency', plan: (c, S, h) => [S.flag('npo', h) ? 'Pancrelipase held while NPO (give with meals only).' : 'Give pancrelipase with each meal and snack.', 'Lipase may be normal in chronic disease; assess pain, stools and glucose.'] });
    }
  });

  add('barretts', {
    label: "Hiatal Hernia / Barrett's Esophagus", group: GI, aliases: ['hiatal hernia', 'barrett', 'barretts esophagus'], order: 41,
    desc: 'Adds twice-daily PPI (IV while NPO), head-of-bed elevation, aspiration precautions, meal-timing teaching.',
    apply(ctx, spec) {
      const m = ppi("Barrett's esophagus / hiatal hernia", '40 mg'); m.freq = 'BID'; m.at = ['0730', '1630'];
      home(spec, m);
      order(spec, { name: 'Head of bed elevated 30 degrees or more; aspiration precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'HOB at least 30 degrees at all times and upright 90 degrees for meals; no lying flat within 2 hours of eating. Small meals. Report regurgitation, chest burning or dysphagia.', startH: 3 });
      assess(spec, [['GI', 'Baseline GI Findings', 'Occasional regurgitation and chest burning when supine; swallows without difficulty']]);
      comorb(spec, { key: 'barretts', problem: "Hiatal hernia with Barrett's esophagus", details: "Moderate hiatal hernia; short-segment Barrett's esophagus without dysplasia (surveillance EGD every 3-5 years).", pmh: "Hiatal hernia; Barrett's esophagus", plan: (c, S, h) => [`Continue pantoprazole BID${S.flag('npo', h) ? ' (IV while NPO)' : ''}; HOB 30 degrees or more.`, 'Aspiration risk after sedation or with an NG tube; avoid placing an NG tube blindly without checking indication.'] });
    }
  });

  add('constipation', {
    label: 'Chronic Constipation', group: GI, aliases: ['constipated', 'slow transit', 'bowel regimen'], order: 50,
    desc: 'Adds a daily bowel regimen (PEG, senna-docusate, bisacodyl PRN), bowel record, stronger opioid constipation prevention.',
    apply(ctx, spec) {
      home(spec, { key: 'polyethylene_glycol', name: 'polyethylene glycol (MIRALAX) powder', dose: '17 g in 8 oz fluid', route: 'Oral', freq: 'daily', cls: 'Osmotic laxative', info: 'Hold for loose stools. Dissolve in 4-8 oz of liquid. Goal: soft BM every 1-2 days.', hold: 'Hold for loose stools; notify provider if no BM in 3 days.', holdIf: ['npo'], indication: 'Chronic constipation' });
      home(spec, { key: 'senna_docusate', name: 'senna-docusate (SENOKOT-S) tablet', dose: '2 tablets', route: 'Oral', freq: 'BID', cls: 'Stimulant laxative / stool softener', info: 'Hold for loose stools. Goal: a bowel movement at least every other day.', holdIf: ['npo'], holdReason: 'NPO', indication: 'Chronic constipation' });
      home(spec, { key: 'bisacodyl_supp', name: 'bisacodyl (DULCOLAX) suppository', dose: '10 mg', route: 'Rectal', freq: 'daily', prn: true, prnInterval: 'Once daily', prnFor: 'no bowel movement in 48 hours', cls: 'Stimulant laxative', info: 'Do not use with suspected obstruction, ileus or rectal bleeding. Give 15-60 minutes before the expected BM.', indication: 'Constipation rescue', prnGiven: [] });
      order(spec, { name: 'Bowel movement record; notify provider if no BM in 48-72 hours', category: 'Nursing', frequency: 'Every shift', instructions: 'Record date, amount and consistency (Bristol scale). Encourage fluids, fiber and walking as tolerated; use the toilet at the same time each day. Rule out impaction before giving more laxatives.', startH: 3 });
      assess(spec, [['GI', 'Bowel Habit', 'Baseline: BM every 2-3 days, hard stools with straining; no impaction']]);
      comorb(spec, { key: 'constipation', problem: 'Chronic constipation', details: 'Functional constipation managed with daily osmotic and stimulant laxatives.', pmh: 'Chronic constipation', plan: () => ['Continue daily regimen (hold for loose stools); opioids and immobility make it worse: add or increase laxatives early.', 'Check for fecal impaction if no BM in 3 days or overflow diarrhea.'] });
    }
  });

  add('esoph_stricture', {
    label: 'Esophageal Stricture / Dysphagia', group: GI, aliases: ['dysphagia', 'swallowing difficulty', 'esophageal narrowing', 'achalasia'], order: 50,
    desc: 'Adds a PPI (IV while NPO), mechanical-soft diet, upright and aspiration precautions, pill-swallowing cautions.',
    apply(ctx, spec) {
      const m = ppi('Peptic esophageal stricture', '40 mg'); m.freq = 'BID'; m.at = ['0730', '1630'];
      home(spec, m);
      spec.orders.forEach(o => { if (o.category === 'Diet' && /^(regular|general)\b/i.test(o.name || '')) { o.name = 'Soft diet (mechanical soft, small bites)'; o.instructions = ((o.instructions || '') + ' Moist, soft foods cut into small pieces; avoid dry bread, steak and raw vegetables.').trim(); } });
      order(spec, { name: 'Dysphagia precautions: upright 90 degrees for meals, small bites, slow pace', category: 'Precautions', frequency: 'With all oral intake', instructions: 'Stay upright 30-60 minutes after eating. Give pills one at a time with puree or liquid, or in liquid form when available. Stop and notify provider for food sticking, drooling, coughing with meals or inability to swallow saliva (possible impaction). Request SLP evaluation for new changes.', startH: 3 });
      assess(spec, [['GI', 'Swallowing', 'Intermittent difficulty with dry solid food after prior dilation; swallows liquids and soft foods without cough']]);
      comorb(spec, { key: 'esoph_stricture', problem: 'Esophageal stricture with dysphagia', details: 'Peptic stricture treated with serial dilation; soft-diet tolerant.', pmh: 'Esophageal stricture (s/p dilation)', plan: (c, S, h) => [`PPI BID${S.flag('npo', h) ? ' IV while NPO' : ''}; mechanical-soft diet with aspiration precautions.`, 'Large tablets may lodge: use crushable or liquid forms where safe (check each drug).'] });
    }
  });

  // Strict NPO (e.g. before a stroke swallow screen) stops oral time-critical drugs: ask for an alternate route.
  const strictNpoNote = (spec, drugs) => {
    if (spec.flags && spec.flags.npoStrict && spec.flags.npoStrict.length) order(spec, { name: `Strict NPO: request alternate route for ${drugs}`, category: 'Nursing', frequency: 'Before each due dose', instructions: `Nothing by mouth including medications. ${drugs} is time-critical: notify the provider NOW for an order for an alternate route (NG tube after placement is confirmed, IV, or other) instead of skipping doses.`, startH: 3 });
  };

  // ============================ NEUROLOGIC ============================

  // Drop drugs the profile may have ordered that are unsafe for this history.
  const omitDrugs = (spec, re, why) => spec.meds.forEach(m => {
    if (m.when !== false && !m.home && re.test(m.name || '')) { m.when = false; spec.applied.push(`${m.name} omitted: ${why}.`); }
  });

  add('epilepsy', {
    label: 'Epilepsy / Seizure Disorder', group: NEU, aliases: ['seizure', 'seizures', 'seizure disorder', 'convulsions'], order: 48,
    desc: 'Adds an antiepileptic (never missed: IV equivalent when NPO), seizure precautions, fall risk, lowered-seizure-threshold drug cautions.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      const drug = pick(ctx, 9, ['levetiracetam', 'levetiracetam', 'lacosamide', 'lamotrigine']);
      const swallowTime = 'TIME-CRITICAL: never omit or delay a dose; if NPO give the IV equivalent and call the provider.';
      if (primary(ctx) !== 'seizure') {
        if (drug === 'levetiracetam') {
          const mg = pick(ctx, 10, ['500 mg', '750 mg', '1,000 mg']);
          const iv = { name: 'levetiracetam (KEPPRA) IVPB', route: 'IV', volume: 100 };
          home(spec, { key: 'levetiracetam', name: 'levetiracetam (KEPPRA) tablet', dose: mg, route: 'Oral', freq: 'BID', cls: 'Anticonvulsant', sips: true, info: `${swallowTime} Watch for sleepiness, irritability, mood change. Dose adjusted for kidney function.`, variants: { npo: iv, npoStrict: iv }, renal: { ckd3: { dose: '500 mg', note: 'Dose reduced for reduced kidney function.' }, esrd: { dose: '500 mg', freq: 'q24h', note: 'ESRD: 500-1,000 mg daily plus a supplemental dose after dialysis.' } }, indication: 'Epilepsy (home antiepileptic)' });
        } else if (drug === 'lacosamide') {
          const iv = { name: 'lacosamide (VIMPAT) IVPB', route: 'IV', volume: 100 };
          home(spec, { key: 'lacosamide', name: 'lacosamide (VIMPAT) tablet', dose: '100 mg', route: 'Oral', freq: 'BID', cls: 'Anticonvulsant', sips: true, info: `${swallowTime} Can prolong the PR interval: check HR and ECG if bradycardic or on other AV-node drugs. Dizziness common.`, monitor: ['HR'], variants: { npo: iv, npoStrict: iv }, renal: { esrd: { dose: '75 mg', note: 'Maximum 75% of dose in severe renal impairment; supplement after dialysis.' } }, indication: 'Epilepsy (home antiepileptic)' });
        } else {
          home(spec, { key: 'lamotrigine', name: 'lamotrigine (LAMICTAL) tablet', dose: '100 mg', route: 'Oral', freq: 'BID', cls: 'Anticonvulsant', sips: true, info: 'TIME-CRITICAL: never omit. NO IV form exists: if the patient cannot swallow, call the provider immediately for a bridging antiepileptic. Report any new rash (Stevens-Johnson risk). Missed doses for 5 or more days require retitration.', indication: 'Epilepsy (home antiepileptic)' });
        }
      }
      order(spec, { name: 'Seizure precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Bed low, padded rails per policy, suction and oxygen at bedside, call light in reach. During a seizure: time it, protect the head, turn on side, nothing in the mouth, do not restrain; call for help and notify provider if over 5 minutes or recurrent.', startH: 3 });
      order(spec, { name: 'Antiepileptic medications: time-critical, no missed doses', category: 'Nursing', frequency: 'Every dose', instructions: 'Give antiepileptics on time even if NPO (IV equivalent). Verify the home regimen with pharmacy. Avoid tramadol, bupropion and meperidine (lower seizure threshold). Document missed or late doses and notify the provider.', startH: 3 });
      if (drug === 'lamotrigine') strictNpoNote(spec, 'lamotrigine');
      omitDrugs(spec, /tramadol|bupropion|meperidine|imipenem/i, 'lowers seizure threshold');
      assess(spec, [['Neurologic', 'Neuro Baseline', 'No focal deficit; speech clear; no seizure activity this admission']]);
      sticky(spec, 'Antiepileptic timing', 'Epilepsy: antiepileptic doses are time-critical. Do not hold for NPO; give IV equivalent and notify provider. Seizure precautions in place.');
      comorb(spec, { key: 'epilepsy', problem: 'Epilepsy', details: 'Seizure disorder controlled on an antiepileptic; last seizure over a year ago.', pmh: 'Epilepsy (controlled)', plan: (c, S, h) => [primary(c) === 'seizure' ? 'Antiepileptic regimen managed by the neurology plan for breakthrough seizure.' : S.flag('npo', h) ? 'Continue antiepileptic by IV route while NPO; do not miss doses.' : 'Continue home antiepileptic on time.', 'Seizure precautions; avoid seizure-threshold-lowering drugs; sleep and electrolytes (Na, Mg, glucose) matter.'] });
    }
  });

  add('hx_stroke', {
    label: 'Prior Stroke / TIA', group: NEU, aliases: ['cva', 'stroke history', 'tia', 'transient ischemic attack', 'cerebrovascular accident'], order: 46,
    desc: 'Adds antiplatelet (held for surgery/bleeding) and high-intensity statin, mild residual deficit, swallowing and fall cautions.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      spec.vitalAdjust.push({ sbp: 6, dbp: 2 });
      const clop = ctx.age % 2 === 0 && !ctx.has('cad') && !['stroke', 'nstemi'].includes(primary(ctx));
      if (!ctx.has('afib')) home(spec, clop
        ? { key: 'clopidogrel', name: 'clopidogrel (PLAVIX) tablet', dose: '75 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', info: 'Monitor for bleeding and bruising. Hold before surgery per surgeon (usually 5-7 days). Do not stop without provider approval.', monitor: ['Hgb', 'Plt'], holdIf: ['surgeryWindow', 'bleeding'], holdReason: 'bleeding-risk window (surgery or active bleeding)', indication: 'Secondary stroke prevention' }
        : { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', info: 'Monitor for bleeding. Give with food if GI upset.', monitor: ['Hgb'], holdIf: ['surgeryWindow', 'bleeding'], holdReason: 'bleeding-risk window (surgery or active bleeding)', indication: 'Secondary stroke prevention' });
      home(spec, { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: pick(ctx, 11, ['40 mg', '80 mg']), route: 'Oral', freq: 'qHS', cls: 'Statin', info: 'High-intensity statin after stroke. Report unexplained muscle pain or weakness.', monitor: ['LFT'], holdIf: ['npo'], indication: 'Secondary stroke prevention' });
      const side = ctx.age % 2 === 0 ? 'right' : 'left';
      order(spec, { name: 'Aspiration precautions; swallow screen before oral intake after any new neurologic change', category: 'Precautions', frequency: 'With oral intake', instructions: 'Upright for meals, small bites, check mouth for pocketing. Repeat the bedside swallow screen with any new weakness, facial droop or speech change and call a stroke alert.', startH: 3 });
      assess(spec, [['Neurologic', 'Neuro Baseline', `Mild residual ${side} hand weakness (4/5) and slight ${side}-sided facial asymmetry from prior stroke; speech clear`], ['Musculoskeletal / Mobility', 'Mobility', 'Independent; mild gait unsteadiness, uses cane for distances']]);
      comorb(spec, { key: 'hx_stroke', problem: 'History of ischemic stroke', details: `Remote ischemic stroke with mild residual ${side} hand weakness; on antiplatelet and high-intensity statin.`, pmh: 'Ischemic stroke (mild residual deficit)', plan: (c, S, h) => [S.flag('surgeryWindow', h) || S.flag('bleeding', h) ? 'Antiplatelet held for the bleeding-risk window; resume when the provider clears it.' : 'Continue antiplatelet and statin.', 'Baseline residual deficit documented: new or worse weakness, speech or vision change is a stroke alert.'] });
    }
  });

  add('parkinsons', {
    label: "Parkinson's Disease", group: NEU, aliases: ['parkinson', 'parkinsons', 'pd', 'tremor', 'carbidopa'], order: 47,
    desc: 'Adds carbidopa-levodopa given at exact home times (never held for NPO), a dopamine agonist, dysphagia and fall risk, orthostasis; removes haloperidol, metoclopramide and prochlorperazine.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 2;
      spec.vitalAdjust.push({ sbp: -4 });
      const tab = pick(ctx, 12, ['25/100 mg, 1 tablet', '25/100 mg, 1.5 tablets', '25/100 mg, 2 tablets']);
      home(spec, { key: 'carbidopa_levodopa', name: 'carbidopa-levodopa (SINEMET) tablet', dose: tab, route: 'Oral', freq: 'QID', at: ['0600', '1000', '1400', '1800'], cls: 'Dopamine precursor', sips: true, info: 'TIME-CRITICAL: give within 30 minutes of the scheduled time, even if NPO (sips of water; crush if needed, or per NG tube). Late doses cause rigidity and swallowing failure. Protein meals can reduce absorption. Watch for orthostatic hypotension, nausea, dyskinesia and hallucinations.', monitor: ['BP'], hold: 'Do not hold for NPO. Notify provider if unable to swallow or if a dose will be more than 30 minutes late.', indication: "Parkinson's disease (time-critical)" });
      home(spec, { key: 'pramipexole', name: 'pramipexole (MIRAPEX) tablet', dose: '0.5 mg', route: 'Oral', freq: 'TID', at: ['0800', '1400', '2000'], cls: 'Dopamine agonist', sips: true, info: 'Do not stop abruptly. Causes drowsiness, orthostatic hypotension, hallucinations, impulse control problems. Dose reduced for reduced kidney function.', monitor: ['BP'], renal: { ckd3: { dose: '0.25 mg', note: 'Dose reduced for reduced kidney function.' }, esrd: { avoid: true } }, indication: "Parkinson's disease" });
      strictNpoNote(spec, 'carbidopa-levodopa');
      omitDrugs(spec, /haloperidol|metoclopramide|prochlorperazine|promethazine|droperidol|chlorpromazine/i, "dopamine antagonist worsens Parkinson's disease");
      order(spec, { name: "Time-critical Parkinson's medication: give at home schedule times", category: 'Nursing', frequency: 'Every dose', instructions: 'Carbidopa-levodopa must be given within 30 minutes of the scheduled time and never held for NPO status. AVOID haloperidol, metoclopramide, prochlorperazine, promethazine (use ondansetron for nausea; quetiapine or pimavanserin if an antipsychotic is unavoidable).', startH: 3 });
      order(spec, { name: 'Dysphagia and aspiration precautions; orthostatic BP checks', category: 'Precautions', frequency: 'Every shift and with meals', instructions: 'Upright for meals, small bites, chin tuck, soft moist foods; SLP evaluation if coughing with meals. Check lying/standing BP daily; assist for all transfers.', startH: 3 });
      assess(spec, [['Neurologic', 'Movement', 'Resting tremor of the right hand, mild cogwheel rigidity, bradykinesia'], ['Neurologic', 'Speech', 'Soft (hypophonic) speech, understandable'], ['Musculoskeletal / Mobility', 'Mobility', 'Shuffling gait with reduced arm swing; walks with a walker, stand-by assist']]);
      sticky(spec, "Parkinson's alert", 'Levodopa is time-critical (within 30 min). Never give haloperidol, metoclopramide or prochlorperazine. Dopamine antagonists can cause severe rigidity.');
      comorb(spec, { key: 'parkinsons', problem: "Parkinson's disease", details: 'Idiopathic Parkinson disease with mild dysphagia; levodopa four times daily.', pmh: "Parkinson's disease", plan: (c, S, h) => [S.flag('npo', h) ? 'NPO but levodopa still given on time with sips (call provider about NG route if strictly NPO).' : 'Levodopa at exact home times; protein spacing.', 'Avoid dopamine-blocking antiemetics and antipsychotics; fall and aspiration precautions; PT/OT/SLP.'] });
    }
  });

  add('ms', {
    label: 'Multiple Sclerosis', group: NEU, aliases: ['multiple sclerosis', 'demyelinating'], order: 50,
    desc: 'Adds baclofen and vitamin D, bladder management, mild gait ataxia, heat/fever sensitivity (pseudo-relapse), fall risk.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 2;
      home(spec, { key: 'baclofen', name: 'baclofen (LIORESAL) tablet', dose: pick(ctx, 13, ['10 mg', '5 mg', '10 mg']), route: 'Oral', freq: 'TID', cls: 'Muscle relaxant (antispastic)', sips: true, info: 'Do NOT stop abruptly (withdrawal: seizures, hallucinations, high fever). May cause drowsiness and weakness. Dose reduced for reduced kidney function.', renal: { ckd3: { dose: '5 mg', note: 'Reduced dose: baclofen accumulates in kidney disease.' }, esrd: { avoid: true } }, indication: 'Multiple sclerosis spasticity' });
      home(spec, { key: 'cholecalciferol', name: 'cholecalciferol (vitamin D3) tablet', dose: '2,000 units', route: 'Oral', freq: 'daily', cls: 'Vitamin', info: 'Bone health.', holdIf: ['npo'], indication: 'Multiple sclerosis (vitamin D)' });
      heldNote(spec, 'Disease-modifying therapy (e.g., ocrelizumab infusion every 6 months) is given as an outpatient and is not due this admission; immunosuppressed, so hold if infected.');
      order(spec, { name: 'Bladder scan if no void in 6 hours; avoid overheating', category: 'Nursing', frequency: 'PRN', instructions: 'Neurogenic bladder: scan for retention (notify provider if over 300 mL). Fever or heat worsens symptoms (Uhthoff phenomenon): treat fever early, cool room.', startH: 3 });
      assess(spec, [['Neurologic', 'Neuro Baseline', 'Mild gait ataxia; left leg strength 4/5 with mild spasticity; vision and speech intact'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulates with a cane, steady with stand-by assist']]);
      comorb(spec, { key: 'ms', problem: 'Multiple sclerosis', details: 'Relapsing-remitting MS, stable, on outpatient disease-modifying therapy; spastic left leg.', pmh: 'Multiple sclerosis (relapsing-remitting)', plan: () => ['Continue baclofen (do not stop abruptly); infection or fever can cause a pseudo-relapse.', 'Steroids only for a confirmed relapse per neurology; monitor bladder and falls.'] });
    }
  });

  add('migraine', {
    label: 'Migraine', group: NEU, aliases: ['migraines', 'headache', 'chronic headache'], order: 50,
    desc: 'Adds migraine prevention (topiramate, or amitriptyline in younger adults), triptan if no vascular disease, dark quiet room order.',
    apply(ctx, spec) {
      const ami = ctx.age < 60 && !ctx.has('dementia') && !['epilepsy'].some(k => ctx.has(k)) && ctx.age % 2 === 0;
      if (ami) home(spec, { key: 'amitriptyline', name: 'amitriptyline (ELAVIL) tablet', dose: '25 mg', route: 'Oral', freq: 'qHS', cls: 'Tricyclic antidepressant', info: 'Anticholinergic and sedating: dry mouth, constipation, urinary retention, QT prolongation. Avoid with MAOIs; caution with tramadol or ondansetron.', holdIf: ['npo'], indication: 'Migraine prevention' });
      else home(spec, { key: 'topiramate', name: 'topiramate (TOPAMAX) tablet', dose: '50 mg', route: 'Oral', freq: 'BID', cls: 'Anticonvulsant (migraine prevention)', info: 'May cause tingling, word-finding trouble and metabolic acidosis (check bicarbonate); kidney stones. Dose reduced for reduced kidney function.', monitor: ['K'], holdIf: ['npo'], renal: { ckd3: { dose: '25 mg', note: 'Dose halved for reduced kidney function.' }, esrd: { dose: '25 mg', freq: 'daily', note: 'Give after dialysis on dialysis days.' } }, indication: 'Migraine prevention' });
      if (!['cad', 'hx_stroke', 'htn'].some(k => ctx.has(k))) home(spec, { key: 'sumatriptan', name: 'sumatriptan (IMITREX) tablet', dose: '50 mg', route: 'Oral', freq: 'q12h', prn: true, prnInterval: 'May repeat once after 2 hours (max 200 mg/day)', prnFor: 'migraine headache', cls: 'Triptan (5-HT1 agonist)', info: 'Contraindicated with coronary disease, prior stroke or uncontrolled hypertension. Can cause chest tightness; do not combine with other triptans. Check BP first.', monitor: ['BP'], indication: 'Acute migraine', prnGiven: [] });
      order(spec, { name: 'Migraine comfort: dark, quiet room; trigger avoidance', category: 'Nursing', frequency: 'PRN', instructions: 'Dim lights, reduce noise, cool cloth. Assess any NEW or worst headache, fever with stiff neck, or focal deficit as an emergency, not as migraine.', startH: 3 });
      assess(spec, [['Neurologic', 'Headache Baseline', 'Denies current headache; migraine about 2 per month with photophobia and nausea']]);
      comorb(spec, { key: 'migraine', problem: 'Migraine', details: 'Episodic migraine without aura on prophylaxis.', pmh: 'Migraine headaches', plan: (c, S, h) => [S.flag('npo', h) ? 'Preventive held while NPO.' : 'Continue migraine preventive.', 'Triptans avoided with vascular disease; new severe headache needs work-up.'] });
    }
  });

  add('neuropathy', {
    label: 'Peripheral Neuropathy', group: NEU, aliases: ['neuropathy', 'diabetic neuropathy', 'nerve pain', 'numb feet'], order: 50,
    desc: 'Adds gabapentin (renally dosed) or duloxetine, reduced foot sensation, fall risk, foot and skin protection.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      if (ctx.age % 2 === 1 || ctx.renal !== 'none') home(spec, { key: 'gabapentin', name: 'gabapentin (NEURONTIN) capsule', dose: pick(ctx, 14, ['300 mg', '300 mg', '600 mg']), route: 'Oral', freq: 'TID', cls: 'Anticonvulsant / neuropathic pain', sips: true, info: 'Monitor sedation and dizziness, especially with opioids. Do not stop abruptly. Dose is adjusted for kidney function.', monitor: ['RR'], renal: { ckd3: { dose: '300 mg', freq: 'daily', note: 'Dose reduced for reduced kidney function.' }, esrd: { dose: '100 mg', freq: 'daily', note: 'Give after dialysis on dialysis days; accumulates in ESRD.' } }, indication: 'Painful peripheral neuropathy' });
      else home(spec, { key: 'duloxetine', name: 'duloxetine (CYMBALTA) capsule', dose: '60 mg', route: 'Oral', freq: 'daily', cls: 'SNRI antidepressant / neuropathic pain', sips: true, info: 'Swallow whole. Do not stop abruptly. May raise BP and bleeding risk; avoid in severe liver disease.', monitor: ['BP'], renal: { esrd: { avoid: true } }, indication: 'Painful peripheral neuropathy' });
      order(spec, { name: 'Foot and skin inspection; protect numb feet', category: 'Nursing', frequency: 'Every shift', instructions: 'Check both feet for pressure areas, blisters, wounds. Test water temperature with the elbow; no heating pads on feet; shoes or non-skid socks for all walking.', startH: 3 });
      assess(spec, [['Neurologic', 'Sensation', 'Decreased light touch and pinprick in both feet (stocking distribution); burning pain 3/10 at baseline'], ['Skin', 'Foot Skin', 'Dry, intact; no ulcers or calluses']]);
      comorb(spec, { key: 'neuropathy', problem: 'Peripheral neuropathy', details: ctx.has('dm2') ? 'Diabetic peripheral neuropathy of both feet.' : 'Chronic painful peripheral neuropathy of both feet.', pmh: 'Peripheral neuropathy', plan: () => ['Continue neuropathic agent (renally dose); sedation risk if combined with opioids.', 'Foot checks every shift; falls precautions.'] });
    }
  });

  add('myasthenia', {
    label: 'Myasthenia Gravis', group: NEU, aliases: ['myasthenia', 'mg', 'pyridostigmine'], order: 47,
    desc: 'Adds time-critical pyridostigmine and prednisone, crisis/respiratory watch; swaps macrolides/fluoroquinolones, removes aminoglycosides and IV magnesium.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      spec.rt = true;
      if (spec.labBase.Glucose === undefined) spec.labBase.Glucose = 112;
      home(spec, { key: 'pyridostigmine', name: 'pyridostigmine (MESTINON) tablet', dose: pick(ctx, 15, ['60 mg', '60 mg', '90 mg']), route: 'Oral', freq: 'QID', at: ['0630', '1030', '1430', '1830'], cls: 'Cholinesterase inhibitor', sips: true, info: 'TIME-CRITICAL: give on time, ideally 30-45 minutes before meals. Late doses cause weakness and swallowing/breathing trouble. Too much causes cholinergic crisis (cramps, diarrhea, drooling, bradycardia, small pupils). Check HR first.', monitor: ['HR', 'RR'], hold: 'Hold and notify provider if HR below 50 or excessive secretions and cramping.', indication: 'Myasthenia gravis (time-critical)' });
      home(spec, { key: 'prednisone', name: 'prednisone tablet', dose: pick(ctx, 16, ['10 mg', '20 mg']), route: 'Oral', freq: 'daily', cls: 'Corticosteroid', sips: true, info: 'Give with food in the morning. Do not stop abruptly (adrenal suppression: needs stress-dose coverage with major illness). Monitor glucose, BP, mood.', monitor: ['Glucose'], indication: 'Myasthenia gravis (immunosuppression)' });
      // antibiotics that can worsen weakness: swap macrolides/fluoroquinolones for doxycycline; remove aminoglycosides
      spec.meds.forEach(m => {
        if (m.when === false || m.home) return;
        if (/azithromycin|clarithromycin|erythromycin|levofloxacin|ciprofloxacin|moxifloxacin/i.test(m.name || '')) {
          const iv = m.route === 'IV';
          spec.applied.push(`${m.name} replaced with doxycycline (myasthenia gravis: macrolides/fluoroquinolones can cause crisis).`);
          Object.assign(m, { key: 'doxycycline' + (iv ? '_iv' : ''), name: iv ? 'doxycycline (DOXY 100) IVPB' : 'doxycycline (VIBRA-TABS) tablet', dose: '100 mg', freq: iv ? 'q12h' : 'BID', cls: 'Tetracycline antibiotic', volume: iv ? 250 : undefined, info: 'Chosen because macrolides and fluoroquinolones can worsen myasthenia. Give with a full glass of water, upright 30 minutes; separate from calcium, iron, antacids.', monitor: ['Temp', 'WBC'], indication: (m.indication || 'Infection') + ' (myasthenia-safe choice)' });
          delete m.avoid; delete m.alt; delete m.renal; delete m.anchorStart;
        }
      });
      strictNpoNote(spec, 'pyridostigmine');
      omitDrugs(spec, /gentamicin|tobramycin|amikacin|neomycin|magnesium sulfate|succinylcholine|rocuronium|vecuronium/i, 'can worsen myasthenic weakness');
      order(spec, { name: 'Myasthenic crisis watch: respiratory and swallowing checks', category: 'Nursing', frequency: 'Every 4 hours', instructions: 'Assess RR, SpO2, speech, swallowing, ptosis and neck/arm strength. Report shortness of breath, weak cough, voice change or choking; bedside NIF/FVC per RT. Keep suction and bag-valve mask at bedside.', startH: 3 });
      order(spec, { name: 'Medications to avoid in myasthenia gravis', category: 'Precautions', frequency: 'Continuous', instructions: 'Avoid fluoroquinolones, macrolides, aminoglycosides, IV magnesium, beta blockers and neuromuscular blockers unless approved by neurology. Question any such order and notify the provider.', startH: 3 });
      assess(spec, [['Neurologic', 'Muscle Strength', 'Mild fatigable ptosis of the left eyelid; proximal arm strength 4+/5, worse late in the day'], ['Respiratory', 'Cough Strength', 'Strong, effective cough; speaks full sentences']]);
      sticky(spec, 'Myasthenia gravis', 'Pyridostigmine is time-critical. Avoid macrolides, fluoroquinolones, aminoglycosides, IV magnesium. Watch breathing and swallowing every 4 hours.');
      comorb(spec, { key: 'myasthenia', problem: 'Myasthenia gravis', details: 'Generalized myasthenia gravis, stable on pyridostigmine and low-dose prednisone.', pmh: 'Myasthenia gravis', plan: (c, S, h) => ['Pyridostigmine on time (sips if NPO; call provider for IV route if strictly NPO); continue prednisone.', S.flag('npo', h) ? 'NPO: call neurology about IV neostigmine / methylprednisolone equivalents.' : 'Respiratory and swallow checks; avoid drugs that worsen weakness.'] });
    }
  });

  add('hx_tbi', {
    label: 'Prior Traumatic Brain Injury', group: NEU, aliases: ['tbi', 'head injury', 'concussion', 'brain injury', 'post-concussive'], order: 50,
    desc: 'Adds mild cognitive baseline, sleep aid, sedative sparing, delirium and fall precautions.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      home(spec, { key: 'melatonin', name: 'melatonin tablet', dose: '3 mg', route: 'Oral', freq: 'qHS', cls: 'Sleep aid', info: 'Give 1-2 hours before desired sleep. Preferred over benzodiazepines or diphenhydramine.', holdIf: ['npo'], indication: 'Post-concussive sleep disturbance' });
      order(spec, { name: 'Cognitive and delirium precautions; limit sedatives', category: 'Precautions', frequency: 'Continuous', instructions: 'Brain-injured patients are sensitive to sedatives and anticholinergics. Keep lights/noise low, one instruction at a time, written reminders. Report new confusion, headache, vomiting or seizure.', startH: 3 });
      assess(spec, [['Neurologic', 'Neuro Baseline', 'Oriented x4; mild short-term memory deficit and slowed processing at baseline (prior TBI); no focal weakness']]);
      comorb(spec, { key: 'hx_tbi', problem: 'History of traumatic brain injury', details: 'Moderate TBI 8 years ago with mild residual memory and attention deficits; no post-traumatic epilepsy.', pmh: 'Traumatic brain injury (remote, mild residual cognitive deficit)', plan: () => ['Document baseline cognition; avoid benzodiazepines and anticholinergics.', 'Higher delirium and seizure risk; use written cues and family input.'] });
    }
  });

  add('rls', {
    label: 'Restless Legs Syndrome', group: NEU, aliases: ['restless legs', 'willis-ekbom', 'rls'], order: 50,
    desc: 'Adds ropinirole and iron, avoids dopamine-blocking antiemetics and sedating antihistamines (worsen symptoms).',
    apply(ctx, spec) {
      home(spec, { key: 'ropinirole', name: 'ropinirole (REQUIP) tablet', dose: pick(ctx, 17, ['0.5 mg', '1 mg', '0.25 mg']), route: 'Oral', freq: 'qHS', at: ['2000'], cls: 'Dopamine agonist', info: 'Give 1-3 hours before bedtime. May cause drowsiness, nausea, orthostatic hypotension; augmentation of symptoms with high doses.', monitor: ['BP'], holdIf: ['npo'], indication: 'Restless legs syndrome' });
      home(spec, { key: 'ferrous_sulfate', name: 'ferrous sulfate tablet', dose: '325 mg', route: 'Oral', freq: 'daily', cls: 'Iron supplement', info: 'Low iron stores worsen restless legs. Give apart from antacids; may cause dark stools and constipation.', holdIf: ['npo'], indication: 'Iron deficiency / restless legs' });
      omitDrugs(spec, /metoclopramide|prochlorperazine|promethazine|haloperidol|diphenhydramine/i, 'worsens restless legs (dopamine blocker or sedating antihistamine)');
      order(spec, { name: 'Restless legs: avoid dopamine blockers and sedating antihistamines', category: 'Nursing', frequency: 'Continuous', instructions: 'Question metoclopramide, prochlorperazine, promethazine, haloperidol and diphenhydramine. Offer evening walking, leg massage, warm compress; limit caffeine.', startH: 3 });
      assess(spec, [['Neurologic', 'Sensation', 'Creeping discomfort in both legs in the evening, relieved by movement; strength and reflexes normal']]);
      comorb(spec, { key: 'rls', problem: 'Restless legs syndrome', details: 'Evening restlessness of both legs, on a dopamine agonist and iron.', pmh: 'Restless legs syndrome', plan: () => ['Continue ropinirole in the evening; avoid dopamine antagonists and sedating antihistamines.', 'Expect poor sleep if untreated; check iron studies.'] });
    }
  });

  add('cerebral_palsy', {
    label: 'Cerebral Palsy', group: NEU, aliases: ['cp', 'spastic diplegia', 'spasticity'], order: 50,
    desc: 'Adds baclofen and a bowel regimen, spastic baseline, wheelchair transfers, contracture/skin and aspiration care.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 2;
      home(spec, { key: 'baclofen', name: 'baclofen (LIORESAL) tablet', dose: pick(ctx, 18, ['10 mg', '5 mg', '20 mg']), route: 'Oral', freq: 'TID', cls: 'Muscle relaxant (antispastic)', sips: true, info: 'Do NOT stop abruptly (withdrawal: seizures, hallucinations, fever). May cause drowsiness and weakness. Dose reduced for reduced kidney function.', renal: { ckd3: { dose: '5 mg', note: 'Reduced dose: baclofen accumulates in kidney disease.' }, esrd: { avoid: true } }, indication: 'Cerebral palsy spasticity' });
      home(spec, { key: 'polyethylene_glycol', name: 'polyethylene glycol (MIRALAX) powder', dose: '17 g in 8 oz fluid', route: 'Oral', freq: 'daily', cls: 'Osmotic laxative', info: 'Hold for loose stools. Goal: soft BM every 1-2 days.', holdIf: ['npo'], indication: 'Constipation (cerebral palsy)' });
      order(spec, { name: 'Positioning, contracture and skin care; assist transfers', category: 'Nursing', frequency: 'Every 2 hours', instructions: 'Reposition every 2 hours; pillows for neutral alignment; gentle range of motion. Use a lift or 2-person transfer with the wheelchair. Check heels, sacrum and hips for pressure. Ask the patient or caregiver how they communicate and transfer at home.', startH: 3 });
      order(spec, { name: 'Aspiration precautions: upright for meals, supervised eating', category: 'Precautions', frequency: 'With oral intake', instructions: 'Upright 90 degrees, small bites, observe for coughing; SLP evaluation if swallowing has changed.', startH: 3 });
      assess(spec, [['Neurologic', 'Neuro Baseline', 'Spastic diplegia: increased tone and mild contractures of both legs, upper extremities 4/5; speech slow but clear; cognition at baseline'], ['Musculoskeletal / Mobility', 'Mobility', 'Uses a manual wheelchair; transfers with 1-2 assist'], ['Skin', 'Braden Score', '17']]);
      comorb(spec, { key: 'cerebral_palsy', problem: 'Cerebral palsy', details: 'Spastic diplegic cerebral palsy; wheelchair user, lives with family support.', pmh: 'Cerebral palsy (spastic diplegia)', plan: () => ['Continue baclofen (do not stop abruptly) and bowel regimen.', 'Skin, positioning and aspiration care; involve caregiver for communication and transfers.'] });
    }
  });

  add('als', {
    label: 'ALS (Amyotrophic Lateral Sclerosis)', group: NEU, aliases: ['amyotrophic lateral sclerosis', 'motor neuron disease', 'lou gehrig'], order: 47,
    desc: 'Adds riluzole, glycopyrrolate, nocturnal BiPAP, bulbar/respiratory weakness, dysphagia diet, sedative and opioid caution, goals-of-care prompt.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 2;
      spec.osa = true; spec.rt = true;
      spec.vitalAdjust.push({ spo2: -1, rr: 1 });
      addLabs(spec, 0.5, ['ALT']);
      home(spec, { key: 'riluzole', name: 'riluzole (RILUTEK) tablet', dose: '50 mg', route: 'Oral', freq: 'BID', cls: 'Glutamate inhibitor', sips: true, info: 'Give on an empty stomach (1 hour before or 2 hours after a meal). Monitor liver tests and for fever with neutropenia. May cause nausea, fatigue.', monitor: ['LFT', 'WBC'], indication: 'Amyotrophic lateral sclerosis' });
      home(spec, { key: 'glycopyrrolate', name: 'glycopyrrolate (ROBINUL) tablet', dose: '1 mg', route: 'Oral', freq: 'TID', cls: 'Anticholinergic (secretion control)', info: 'For drooling. Causes dry mouth, constipation, urinary retention; thickens secretions: watch for mucus plugging.', holdIf: ['npo'], indication: 'Sialorrhea (ALS)' });
      order(spec, { name: 'BiPAP at night and with naps (home settings)', category: 'Respiratory', frequency: 'Nightly and PRN', instructions: 'Apply home BiPAP when sleeping and when dyspneic lying flat. RT to assist. Do not give sedatives or opioids without a respiratory plan.', startH: 3 });
      order(spec, { name: 'Dysphagia, secretion and communication plan', category: 'Precautions', frequency: 'Every shift', instructions: 'Upright for meals; soft moist or pureed foods; suction at bedside; cough assist per RT. Provide communication board; allow extra time. Weak cough = aspiration risk. Monitor weight.', startH: 3 });
      order(spec, { name: 'Confirm advance directive, code status and goals of care', category: 'Nursing', frequency: 'Once', instructions: 'ALS is progressive: verify code status, BiPAP/ventilation and feeding-tube wishes and notify the provider if undocumented.', startH: 6 });
      spec.orders.forEach(o => { if (o.category === 'Diet' && /^(regular|general)\b/i.test(o.name || '')) { o.name = 'Soft diet (mechanical soft, moist)'; o.instructions = ((o.instructions || '') + ' Dysphagia precautions; high calorie.').trim(); } });
      assess(spec, [['Neurologic', 'Neuro Baseline', 'Bulbar and limb weakness: slightly slurred speech, tongue fasciculations, hand grip 3/5, legs 4/5; sensation intact; cognition intact'], ['Respiratory', 'Respiratory Effort', 'Unlabored at rest; speaks in shortened phrases; weak cough'], ['Musculoskeletal / Mobility', 'Mobility', 'Walker or wheelchair; needs help with transfers']]);
      sticky(spec, 'ALS respiratory risk', 'Respiratory muscles are weak: avoid sedatives/opioids without a plan, check RR and SpO2 often, and call RT early for hypercapnia (morning headache, drowsiness). Confirm code status.');
      comorb(spec, { key: 'als', problem: 'Amyotrophic lateral sclerosis', details: 'Bulbar-onset ALS with mild respiratory muscle weakness; uses nocturnal BiPAP.', pmh: 'Amyotrophic lateral sclerosis (nocturnal BiPAP)', plan: () => ['Continue riluzole and secretion control; BiPAP at night.', 'Minimize sedatives/opioids; aspiration precautions; goals-of-care discussion if not documented.'] });
    }
  });

  add('essential_tremor', {
    label: 'Essential Tremor', group: NEU, aliases: ['tremor', 'hand tremor', 'benign tremor'], order: 50,
    desc: 'Adds propranolol (primidone if asthma/COPD), postural hand tremor, feeding assistance; tremor may mimic withdrawal or hyperthyroidism.',
    apply(ctx, spec) {
      const bbOk = !ctx.has('asthma') && !ctx.has('copd') && !ctx.has('myasthenia');
      if (bbOk) home(spec, { key: 'propranolol', name: 'propranolol (INDERAL) tablet', dose: pick(ctx, 19, ['40 mg', '20 mg', '40 mg']), route: 'Oral', freq: 'BID', cls: 'Non-selective beta blocker', sips: true, info: 'Check BP and apical HR first. Can mask hypoglycemia symptoms. Do not stop abruptly.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if HR below 55 or SBP below 100.', holdIf: ['hypotension'], holdReason: 'low blood pressure', indication: 'Essential tremor' });
      else home(spec, { key: 'primidone', name: 'primidone (MYSOLINE) tablet', dose: '50 mg', route: 'Oral', freq: 'qHS', cls: 'Anticonvulsant (tremor)', info: 'Sedation and dizziness at first. Used instead of a beta blocker because of lung disease or myasthenia.', holdIf: ['npo'], indication: 'Essential tremor' });
      order(spec, { name: 'Tremor: assist with meals; adaptive cups and utensils', category: 'Nursing', frequency: 'With meals', instructions: 'Weighted utensils and lidded cups reduce spills; allow extra time. Document baseline tremor so a new or resting tremor can be recognized (withdrawal, thyroid, drug effect).', startH: 3 });
      assess(spec, [['Neurologic', 'Movement', 'Bilateral postural and action hand tremor, no rest tremor, no rigidity; handwriting wavy']]);
      comorb(spec, { key: 'essential_tremor', problem: 'Essential tremor', details: 'Benign familial postural tremor of both hands, controlled with medication.', pmh: 'Essential tremor', plan: () => ['Continue tremor medication; baseline tremor documented.', 'Report a new resting tremor, rigidity or worsening tremor.'] });
    }
  });

  add('vertigo', {
    label: 'Chronic Vertigo / Vestibular Disorder', group: NEU, aliases: ['dizziness', 'bppv', 'menieres', 'vestibular', 'dizzy'], order: 50,
    desc: 'Adds PRN meclizine (caution in older adults), positional vertigo baseline, strong fall precautions.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 2;
      home(spec, { key: 'meclizine', name: 'meclizine (ANTIVERT) tablet', dose: ctx.age >= 70 ? '12.5 mg' : '25 mg', route: 'Oral', freq: 'q8h', prn: true, prnInterval: 'Every 8 hours', prnFor: 'vertigo or dizziness', cls: 'Antihistamine (vestibular suppressant)', info: 'Anticholinergic and sedating: confusion, urinary retention, falls in older adults. Use sparingly; avoid with dementia. Give only after checking that vertigo is the usual type.', indication: 'Chronic vertigo', prnGiven: [] });
      order(spec, { name: 'Vertigo fall precautions: assist for all standing and walking', category: 'Precautions', frequency: 'Continuous', instructions: 'Change positions slowly; sit at the edge of the bed 1-2 minutes before standing; assist for every transfer; avoid sudden head turns. New vertigo with weakness, speech change, double vision or severe headache is a STROKE alert.', startH: 3 });
      assess(spec, [['Neurologic', 'Vestibular', 'Positional vertigo with head turning; no spontaneous nystagmus at rest; gait mildly unsteady, Romberg negative']]);
      comorb(spec, { key: 'vertigo', problem: 'Chronic vertigo', details: 'Recurrent benign positional vertigo (BPPV) / vestibular dysfunction; central causes excluded.', pmh: 'Chronic vertigo (vestibular)', plan: () => ['Meclizine only as needed (anticholinergic: caution in older adults).', 'Assist with all mobility; a different or sudden-onset dizziness needs neuro assessment.'] });
    }
  });

  add('sci', {
    label: 'Spinal Cord Injury / Paraplegia', group: NEU, aliases: ['paraplegia', 'quadriplegia', 'tetraplegia', 'spinal cord injury', 'paralysis', 'wheelchair'], order: 50,
    desc: 'Adds baclofen, bowel program, intermittent catheterization, pressure-injury prevention, low baseline BP, autonomic dysreflexia precautions.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 2;
      spec.vitalAdjust.push({ sbp: -16, dbp: -10, hr: -4 });
      home(spec, { key: 'baclofen', name: 'baclofen (LIORESAL) tablet', dose: pick(ctx, 20, ['10 mg', '20 mg', '10 mg']), route: 'Oral', freq: 'TID', cls: 'Muscle relaxant (antispastic)', sips: true, info: 'Do NOT stop abruptly (withdrawal: seizures, hallucinations, fever). Dose reduced for reduced kidney function.', renal: { ckd3: { dose: '5 mg', note: 'Reduced dose: baclofen accumulates in kidney disease.' }, esrd: { avoid: true } }, indication: 'Spasticity after spinal cord injury' });
      home(spec, { key: 'senna_docusate', name: 'senna-docusate (SENOKOT-S) tablet', dose: '2 tablets', route: 'Oral', freq: 'BID', cls: 'Stimulant laxative / stool softener', info: 'Neurogenic bowel program. Hold for loose stools.', holdIf: ['npo'], holdReason: 'NPO', indication: 'Neurogenic bowel' });
      home(spec, { key: 'bisacodyl_supp_daily', name: 'bisacodyl (DULCOLAX) suppository', dose: '10 mg', route: 'Rectal', freq: 'daily', at: ['1700'], cls: 'Stimulant laxative', info: 'Scheduled bowel program: give 30 minutes after a meal, then digital stimulation / evacuation per program. Use lidocaine jelly for disimpaction if injury is T6 or above (autonomic dysreflexia).', holdIf: ['npo'], holdReason: 'NPO', indication: 'Neurogenic bowel program' });
      order(spec, { name: 'Autonomic dysreflexia precautions (injury at T6 or above)', category: 'Precautions', frequency: 'Continuous', instructions: 'If SBP is 20-40 mmHg above baseline with pounding headache, flushing/sweating above the injury, or bradycardia: sit patient upright, loosen clothing/binder, check BP every 2-5 minutes, check bladder (catheter kinks, flush/drain) and bowel (disimpact with lidocaine jelly) and skin; call provider if not resolved promptly (nifedipine or nitroglycerin paste per order).', startH: 3 });
      order(spec, { name: 'Pressure injury prevention: turn every 2 hours, skin check every shift', category: 'Nursing', frequency: 'Every 2 hours', instructions: 'Reposition at least every 2 hours (30-degree side-lying); pressure-redistribution mattress and wheelchair cushion; off-load heels; inspect sacrum, ischia, heels, trochanters. No sensation below the injury: check water temperature and skin for burns or pressure.', startH: 3 });
      order(spec, { name: 'Neurogenic bladder: intermittent catheterization every 6 hours', category: 'Nursing', frequency: 'Every 6 hours', instructions: 'Sterile technique per policy; keep volumes below 500 mL; record volume and urine clarity. Report cloudy/foul urine, fever, new incontinence or a sudden rise in BP (dysreflexia).', startH: 3 });
      order(spec, { name: 'Transfer with sliding board or lift; temperature and DVT watch', category: 'Nursing', frequency: 'PRN', instructions: 'Two staff or a lift for transfers. Impaired temperature regulation: avoid overheating/chilling. Check calves; immobility raises DVT risk. Sensation is absent: abdominal and leg pathology may present without pain.', startH: 3 });
      assess(spec, [['Neurologic', 'Neuro Baseline', 'T4 complete paraplegia: no voluntary movement or sensation below the nipple line; upper extremities 5/5; reflex spasticity of legs'], ['Musculoskeletal / Mobility', 'Mobility', 'Wheelchair user; transfers with sliding board and 1-2 assist'], ['GU', 'Urinary Elimination', 'Neurogenic bladder: intermittent self-catheterization every 6 hours'], ['GI', 'Bowel Habit', 'Neurogenic bowel: suppository program daily, no spontaneous continence'], ['Skin', 'Braden Score', '13'], ['Skin', 'Skin', 'Warm, dry, intact; sacrum and heels without redness']]);
      sticky(spec, 'Spinal cord injury', 'Pressure injury risk (turn every 2 h), neurogenic bowel/bladder, and autonomic dysreflexia (sudden high BP with headache): sit up, remove triggers, check bladder/bowel. Pain may be absent with abdominal illness.');
      comorb(spec, { key: 'sci', problem: 'Spinal cord injury with paraplegia', details: 'Chronic T4 paraplegia with neurogenic bowel and bladder; wheelchair user.', pmh: 'Spinal cord injury (T4 paraplegia)', plan: () => ['Continue baclofen, bowel program and catheterization schedule.', 'Turn every 2 hours, skin checks, dysreflexia precautions, DVT prevention.'] });
    }
  });

  // @@APPEND@@
})();
