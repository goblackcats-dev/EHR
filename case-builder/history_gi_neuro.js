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

  // @@APPEND@@
})();
