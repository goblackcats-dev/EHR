/* Surgical-history catalog beyond the basic list in history.js.
   Most entries are history only (they show in the PSH of the notes). Entries with an apply() add a real, non-duplicated effect:
   a device, a home medication, a nursing order or a baseline finding. Effects never add medical-history modules (ctx.hx). */
(() => {
  const HX = NS.HX, U = NS.util;
  const { home, order, assess, sticky, comorb, addLabs, heldNote } = HX.helpers;
  const HINTS = NS.HX.SURGERY_HINTS = NS.HX.SURGERY_HINTS || {};

  // ---------- local helpers ----------
  const hasMed = (spec, k) => spec.meds.some(m => m.key === k);
  const homeOnce = (spec, m) => { if (!hasMed(spec, m.key)) home(spec, m); };
  const orderOnce = (spec, o) => { if (!spec.orders.some(x => x.name === o.name)) order(spec, o); };
  const comorbOnce = (spec, c) => { if (!spec.comorb.some(x => x.key === c.key)) comorb(spec, c); };
  const device = (spec, d) => { if (!spec.devices.some(x => x.type === d.type)) spec.devices.push(Object.assign({ placeH: -24 * 365, preexisting: true, status: 'Patent' }, d)); };
  // set a baseline lab value; how = 'min' keeps the lower, 'max' keeps the higher, otherwise only fills an empty value
  const baseLab = (spec, code, v, how) => {
    const cur = spec.labBase[code];
    if (cur === undefined) spec.labBase[code] = v;
    else if (how === 'min') spec.labBase[code] = Math.min(cur, v);
    else if (how === 'max') spec.labBase[code] = Math.max(cur, v);
  };
  const dropNSAIDs = (spec, why) => {
    const out = spec.meds.filter(m => /NSAID/i.test(m.cls || '') || /ketorolac|ibuprofen|naproxen|meloxicam|celecoxib/i.test(m.name));
    if (!out.length) return;
    spec.meds = spec.meds.filter(m => !out.includes(m));
    spec.applied.push(`NSAID (${out.map(m => m.name.split(' ')[0]).join(', ')}) omitted because of ${why}.`);
  };
  // laterality that is stable for a given patient and surgery (used where the key has no side)
  const sideOf = (ctx, key) => ((ctx.age + key.length) % 2 ? 'Left' : 'Right');
  const flip = { Left: 'Right', Right: 'Left' };
  // keep IVs out of a restricted arm: move existing ones to the other arm, and place one if none exists
  const moveIVs = (spec, avoid) => {
    const keep = flip[avoid], re = new RegExp('^' + avoid, 'i'), mk = new RegExp('^' + avoid.toLowerCase());
    spec.devices.forEach(d => {
      if (d.deviceType === 'IV' && re.test(d.location || '')) {
        d.location = d.location.replace(re, keep);
        if (d.siteMarker) d.siteMarker = d.siteMarker.replace(mk, keep.toLowerCase());
      }
    });
    if (!spec.devices.some(d => d.deviceType === 'IV')) spec.devices.unshift({ deviceType: 'IV', type: 'Peripheral IV', location: `${keep} forearm`, siteMarker: `${keep.toLowerCase()}Forearm`, gauge: '20 gauge', placeH: 0.4, infusing: 'Saline lock', status: 'Patent', assess: 'site clean, dry, intact; flushes easily' });
  };
  // extended-release / enteric-coated products are a problem after stomach surgery, with ileostomy or through a feeding tube
  const flagERMeds = (spec, why) => spec.meds.forEach(m => {
    if (/extended[- ]release|enteric|delayed[- ]release|\bER\b|\bSR\b|\bXL\b/i.test(m.name) && m.route === 'Oral') m.nursing = [...(m.nursing || []), `Extended-release / enteric-coated form: ask pharmacy for an immediate-release or liquid alternative (${why}); do not crush.`];
  });
  const yr = (ctx, key) => parseInt(ctx.surgYear(key), 10) || 0;
  const simYear = ctx => parseInt(String(ctx.input.simDate || '').slice(0, 4), 10) || new Date().getFullYear();
  const recent = (ctx, key, years = 1) => yr(ctx, key) && simYear(ctx) - yr(ctx, key) <= years;

  // register a surgery (apply optional); hint is the one-line effect shown in the picker
  const reg = (key, label, group, apply, hint) => { HX.addSurgery(key, label, group, apply || null); if (apply && hint) HINTS[key] = hint; };
  // attach an effect to a surgery that history.js already registered (the label is left alone)
  const attach = (key, apply, hint) => { if (HX.SX[key]) { HX.SX[key].apply = apply; HINTS[key] = hint; } };

  const ABD = 'Abdominal / Gastrointestinal', CV = 'Cardiovascular', THO = 'Thoracic / Pulmonary', ORT = 'Orthopedic', NEU = 'Neurosurgical',
    GYN = 'Gynecologic / Obstetric', URO = 'Urologic / Renal', END = 'Endocrine / Breast', ENT = 'Head / Neck / ENT', VAS = 'Vascular', OTH = 'Other';

  // ---------- shared effect: malabsorptive / restrictive stomach surgery ----------
  const stomachSurgery = (kind) => (ctx, spec) => {
    const rygb = kind === 'rygb';
    const key = rygb ? 'bariatric_rygb' : kind === 'sleeve' ? 'bariatric_sleeve' : 'gastrectomy';
    homeOnce(spec, { key: 'multivitamin', name: 'chewable multivitamin with minerals tablet', dose: '1 tablet', route: 'Oral', freq: 'daily', cls: 'Vitamin', info: 'Chewable or liquid form after stomach surgery. Give separate from calcium by 2 hours.', holdIf: ['npo'], indication: 'Post-gastric surgery nutrition' });
    homeOnce(spec, { key: 'vitamin_b12', name: 'cyanocobalamin (vitamin B12) tablet', dose: '1,000 mcg', route: 'Oral', freq: 'daily', cls: 'Vitamin B12', info: 'Lifelong replacement; absorption is reduced without intrinsic factor (acid) contact. May be sublingual.', monitor: [], holdIf: ['npo'], indication: 'B12 deficiency prevention after gastric surgery' });
    homeOnce(spec, { key: 'calcium_supp', name: 'calcium citrate with vitamin D3 (CITRACAL PETITES) tablet', dose: rygb ? '500 mg' : '500 mg', route: 'Oral', freq: rygb ? 'TID' : 'BID', cls: 'Calcium supplement', info: 'Use CITRATE (not carbonate): absorbed without stomach acid. Give in divided doses, 2 hours apart from iron and levothyroxine.', holdIf: ['npo'], indication: 'Calcium and bone protection after gastric surgery' });
    if (rygb || ctx.female) homeOnce(spec, { key: 'ferrous_sulfate', name: 'ferrous sulfate tablet', dose: '325 mg', route: 'Oral', freq: 'daily', cls: 'Iron supplement', info: 'Give with vitamin C, apart from calcium and levothyroxine. May darken stools and constipate.', holdIf: ['npo'], indication: 'Iron deficiency prevention after gastric surgery' });
    dropNSAIDs(spec, rygb || kind === 'gastrectomy' ? 'gastric surgery (marginal ulcer / bleeding risk)' : 'bariatric surgery');
    orderOnce(spec, { name: 'No NSAIDs (history of gastric surgery)', category: 'Precautions', frequency: 'Continuous', instructions: 'Avoid ibuprofen, ketorolac, naproxen and other NSAIDs (ulcer, bleeding and anastomotic risk). Use acetaminophen for pain.', startH: 3, nursing: ['Question any NSAID order and notify the provider.'] });
    orderOnce(spec, { name: 'Medication form precautions (gastric surgery)', category: 'Nursing', frequency: 'With every medication', instructions: 'Use liquid, chewable or crushed immediate-release forms when possible. Do NOT crush extended-release or enteric-coated drugs; ask pharmacy for an alternative. Pills larger than a dime may not pass well. Small sips, no straws or carbonated drinks.', startH: 3 });
    flagERMeds(spec, 'gastric surgery');
    addLabs(spec, 0.5, ['Vitamin B12', 'Ferritin']);
    baseLab(spec, 'Vitamin B12', rygb ? 310 : 360, 'min'); baseLab(spec, 'Ferritin', ctx.female ? 22 : 45, 'min');
    if (rygb) spec.labBase.Hemoglobin = Math.min(spec.labBase.Hemoglobin === undefined ? 99 : spec.labBase.Hemoglobin, ctx.female ? 11.8 : 13.0);
    assess(spec, [['GI', 'Abdomen', 'Soft, non-tender; healed laparoscopic port scars'], ['GI', 'Eating Pattern', rygb ? 'Small frequent meals; watches for dumping symptoms (flushing, cramping, diarrhea)' : 'Small portions, eats slowly; early satiety']]);
    comorbOnce(spec, { key: 'post_gastric_surgery', problem: kind === 'gastrectomy' ? 'Status post gastrectomy' : `Status post ${rygb ? 'Roux-en-Y gastric bypass' : 'sleeve gastrectomy'}`, details: 'Lifelong B12, calcium, iron and multivitamin; no NSAIDs.', pmh: kind === 'gastrectomy' ? 'Gastrectomy' : rygb ? 'Roux-en-Y gastric bypass' : 'Sleeve gastrectomy', plan: (c, S, h) => ['Continue vitamin B12, calcium citrate, multivitamin and iron when taking PO.', 'No NSAIDs; acetaminophen for pain. Use liquid, chewable or crushed immediate-release medications.'] });
  };

  // ---------- Abdominal / Gastrointestinal ----------
  reg('bariatric_rygb', 'Roux-en-Y gastric bypass', ABD, stomachSurgery('rygb'), 'Adds B12, calcium citrate, iron, multivitamin; no NSAIDs; medication-form precautions; lower B12/ferritin.');
  reg('bariatric_sleeve', 'Sleeve gastrectomy', ABD, stomachSurgery('sleeve'), 'Adds B12, calcium citrate, multivitamin; no NSAIDs; medication-form precautions.');
  reg('gastrectomy', 'Partial / total gastrectomy', ABD, stomachSurgery('gastrectomy'), 'Adds B12, calcium citrate, iron, multivitamin; no NSAIDs; small-meal and medication-form precautions.');

  reg('splenectomy', 'Splenectomy', ABD, (ctx, spec) => {
    baseLab(spec, 'Platelets', 430, 'max');
    orderOnce(spec, { name: 'Asplenia: treat fever as an emergency', category: 'Precautions', frequency: 'Continuous', instructions: 'Temperature 100.4 F (38 C) or higher, rigors or sudden malaise: notify provider immediately, draw blood cultures and start broad-spectrum IV antibiotics without delay (overwhelming post-splenectomy infection).', startH: 3, nursing: ['Do not wait for lab results before escalating.', 'Verify pneumococcal, meningococcal and Hib vaccination history.'] });
    sticky(spec, 'Asplenia', 'No spleen: lifelong risk of overwhelming sepsis (encapsulated organisms). Any fever is urgent. Mild chronic thrombocytosis and leukocytosis are expected.');
    comorbOnce(spec, { key: 'asplenia', problem: 'Asplenia (status post splenectomy)', details: 'High risk of overwhelming bacterial infection; needs vaccination and early antibiotics for fever.', pmh: 'Splenectomy', plan: (c, S, h) => ['Low threshold for blood cultures and early broad-spectrum antibiotics for any fever or hypotension.', 'Confirm pneumococcal, meningococcal and Hib vaccines are up to date before discharge.'] });
  }, 'Asplenia: fever is an emergency order, vaccine check, mild thrombocytosis.');

  reg('whipple', 'Whipple (pancreaticoduodenectomy)', ABD, (ctx, spec) => {
    homeOnce(spec, { key: 'pancrelipase', name: 'pancrelipase (CREON) capsule', dose: ctx.weightKg < 65 ? '24,000 units' : '36,000 units', route: 'Oral', freq: 'TID', at: ['0800', '1200', '1700'], cls: 'Pancreatic enzyme', info: 'Give with the FIRST BITE of each meal (half dose with snacks). Swallow whole, do not crush or chew; capsule may be opened onto applesauce.', holdIf: ['npo'], holdReason: 'NPO (give only with food)', indication: 'Exocrine pancreatic insufficiency after pancreaticoduodenectomy' });
    homeOnce(spec, { key: 'pantoprazole', name: 'pantoprazole (PROTONIX) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', cls: 'Proton pump inhibitor', info: 'Give 30-60 minutes before breakfast. Helps enzymes work and protects the anastomosis.', variants: { npo: { name: 'pantoprazole (PROTONIX) injection', route: 'IV' } }, indication: 'Post-Whipple acid suppression' });
    baseLab(spec, 'Glucose', 120, 'max');
    orderOnce(spec, { name: 'Small frequent meals with enzymes at every meal and snack', category: 'Nursing', frequency: 'Meals and snacks', instructions: 'Six small low-fat meals; pancreatic enzymes with the first bite. Watch for steatorrhea, weight loss and high glucose (pancreatogenic diabetes).', startH: 3 });
    assess(spec, [['GI', 'Abdomen', 'Soft; healed upper abdominal incision; no tenderness'], ['GI', 'Stool', 'Formed; no greasy or floating stools while on enzymes']]);
    comorbOnce(spec, { key: 'post_whipple', problem: 'Exocrine pancreatic insufficiency (status post Whipple)', details: 'Needs pancreatic enzymes with meals; glucose may run high.', pmh: 'Whipple procedure (pancreaticoduodenectomy)', plan: (c, S, h) => [S.flag('npo', h) ? 'Pancrelipase held while NPO (give only with food).' : 'Pancrelipase with meals and snacks; monitor glucose and weight.'] });
  }, 'Adds pancrelipase with meals, PPI, small-meal order, slightly higher glucose.');

  reg('colostomy', 'Colostomy (end or loop)', ABD, (ctx, spec) => {
    device(spec, { deviceType: 'Tube', type: 'Colostomy', location: 'Left lower quadrant', siteMarker: 'abdomenLLQ', status: 'Active', assess: 'stoma pink, moist and budded; peristomal skin intact; formed brown stool in pouch' });
    orderOnce(spec, { name: 'Stoma assessment and ostomy care', category: 'Nursing', frequency: 'Every shift and PRN', instructions: 'Assess stoma color (pink-red, moist), height, peristomal skin and output. Empty pouch when one-third full; change appliance every 5-7 days and for leaks. Dusky or black stoma: notify provider immediately.', startH: 3, nursing: ['No rectal tube, suppository or enema through the stoma or rectum unless ordered.'] });
    orderOnce(spec, { name: 'Ostomy supplies at bedside', category: 'Nursing', frequency: 'Continuous', instructions: 'Two-piece flange and drainable pouches in patient size, barrier ring, stoma powder, adhesive remover, measuring guide. Wound/ostomy nurse consult as needed.', startH: 3 });
    assess(spec, [['GI', 'Stoma', 'Left lower quadrant colostomy: pink, moist, budded; peristomal skin intact'], ['GI', 'Stoma Output', 'Formed to soft brown stool in pouch']]);
    comorbOnce(spec, { key: 'colostomy', problem: 'Colostomy', details: 'Established left lower quadrant colostomy.', pmh: 'Colostomy', plan: () => ['Stoma and pouch care each shift; consult ostomy nurse for leaks or skin breakdown.'] });
  }, 'Colostomy device entry, stoma assessment and ostomy supplies orders.');

  reg('ileostomy', 'Ileostomy', ABD, (ctx, spec) => {
    device(spec, { deviceType: 'Tube', type: 'Ileostomy', location: 'Right lower quadrant', siteMarker: 'abdomenRLQ', status: 'Active', assess: 'stoma pink, moist and budded; peristomal skin intact; green-brown loose output in pouch' });
    flagERMeds(spec, 'ileostomy absorption');
    baseLab(spec, 'Potassium', 4.0, 'min'); baseLab(spec, 'Magnesium', 1.8, 'min'); baseLab(spec, 'CO2', 23, 'min');
    orderOnce(spec, { name: 'Stoma assessment and ostomy care', category: 'Nursing', frequency: 'Every shift and PRN', instructions: 'Assess stoma color (pink-red, moist), peristomal skin and output. Empty pouch when one-third full; change appliance every 4-7 days and for leaks. Dusky or black stoma: notify provider immediately.', startH: 3 });
    orderOnce(spec, { name: 'Ileostomy output monitoring', category: 'Nursing', frequency: 'Every shift', instructions: 'Measure and record output. Notify provider for output above 1,200 mL/24 hours, thirst, dizziness, low urine output or muscle cramps (dehydration, low sodium, potassium and magnesium). Encourage fluids with electrolytes, not water alone. Avoid enteric-coated and extended-release medications (poor absorption).', startH: 3 });
    orderOnce(spec, { name: 'Ostomy supplies at bedside', category: 'Nursing', frequency: 'Continuous', instructions: 'Drainable pouches with clamp, flange, barrier ring, stoma powder, adhesive remover, measuring guide. Wound/ostomy nurse consult as needed.', startH: 3 });
    assess(spec, [['GI', 'Stoma', 'Right lower quadrant ileostomy: pink, moist, budded; peristomal skin intact'], ['GI', 'Stoma Output', 'Loose green-brown, about 800-1,000 mL per 24 hours']]);
    comorbOnce(spec, { key: 'ileostomy', problem: 'Ileostomy (dehydration risk)', details: 'Liquid to paste output; at risk for volume and electrolyte loss.', pmh: 'Ileostomy', plan: () => ['Monitor output and BMP/Mg; replace losses; avoid enteric-coated and extended-release medications.'] });
  }, 'Ileostomy device, output monitoring order, lower K/Mg/bicarbonate baseline, ER/EC drug caution.');

  reg('liver_resection', 'Liver resection (hepatectomy)', ABD);
  reg('hemorrhoidectomy', 'Hemorrhoidectomy', ABD);
  reg('nissen', 'Nissen fundoplication', ABD, (ctx, spec) => {
    orderOnce(spec, { name: 'Fundoplication precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Patient may be unable to belch or vomit. Treat nausea early (ondansetron) to avoid retching, which can disrupt the wrap. Contact the surgeon before any NG or OG tube is placed. Small, slow meals; sit upright to eat.', startH: 3 });
    assess(spec, [['GI', 'Swallowing', 'Occasional mild dysphagia with dry foods; no reflux symptoms']]);
  }, 'Fundoplication precautions: treat nausea early, surgeon before NG tube.');

  reg('peg_tube', 'PEG tube (gastrostomy) placement', ABD, (ctx, spec) => {
    flagERMeds(spec, 'given through a PEG tube');
    device(spec, { deviceType: 'Tube', type: 'PEG tube (20 Fr)', location: 'Left upper quadrant', siteMarker: 'abdomenLUQ', status: 'Capped', assess: 'external bumper snug and rotates freely; site clean and dry; no leakage or erythema' });
    orderOnce(spec, { name: 'PEG tube: medications and flushes', category: 'Nursing', frequency: 'Before, between and after each medication; q4h', instructions: 'Flush 30 mL water before, between and after each medication, and every 4 hours if not feeding. Give each drug separately as a liquid or fully dissolved immediate-release tablet. NEVER crush extended-release or enteric-coated drugs. Head of bed at least 30 degrees during and 1 hour after feeding.', startH: 3 });
    orderOnce(spec, { name: 'PEG site care', category: 'Nursing', frequency: 'Daily', instructions: 'Clean the site with soap and water, dry well, rotate the bumper 360 degrees, keep 1-2 mm of play. Report redness, purulent drainage, leakage or a tube that has come out (urgent: tract closes within hours).', startH: 3 });
    assess(spec, [['GI', 'Enteral Access', 'PEG tube LUQ: site clean, dry, intact; capped; flushes without resistance']]);
  }, 'PEG device entry; medications-via-tube and site care orders.');

  // ---------- Cardiovascular ----------
  reg('valve_mech', 'Mechanical heart valve replacement', CV, (ctx, spec) => {
    const apix = spec.meds.filter(m => m.key === 'apixaban');
    if (apix.length) { spec.meds = spec.meds.filter(m => m.key !== 'apixaban'); spec.applied.push('Apixaban omitted: direct oral anticoagulants are contraindicated with a mechanical heart valve (warfarin used instead).'); }
    homeOnce(spec, { key: 'warfarin', name: 'warfarin (COUMADIN) tablet', dose: ctx.age >= 75 ? '3 mg' : ctx.weightKg > 90 ? '7.5 mg' : '5 mg', route: 'Oral', freq: 'qHS', cls: 'Anticoagulant (vitamin K antagonist)', highAlert: true, info: 'Mechanical valve: INR goal 2.5-3.5. Check the INR before EVERY dose. Antibiotics, steroids and amiodarone raise the INR; vitamin K foods lower it.', monitor: ['INR', 'Hgb'], hold: 'Hold and call provider for INR above 3.5 or any bleeding. Never skip warfarin without a bridging plan from cardiology.', holdIf: ['npoStrict', 'surgeryWindow'], holdReason: 'procedure / bleeding-risk window (bridging needed per cardiology)', indication: 'Mechanical heart valve (INR goal 2.5-3.5)' });
    spec.labBase.INR = 2.9; spec.labBase.PT = 31;
    spec.therapeuticAnticoagulation = true; // hint for rules.js: prophylaxis-dose heparin/enoxaparin is redundant
    addLabs(spec, 0.5, ['PT', 'INR']);
    spec.labSchedule.push({ daily: true, codes: ['PT', 'INR'] });
    orderOnce(spec, { name: 'Mechanical valve: anticoagulation bridging plan', category: 'Nursing', frequency: 'Continuous', instructions: 'INR goal 2.5-3.5. If warfarin is held or INR falls below 2.0, cardiology/pharmacy orders a bridge (IV unfractionated heparin by protocol or enoxaparin 1 mg/kg every 12 hours). Prophylaxis-dose heparin or enoxaparin is NOT a bridge. Notify cardiology before any invasive procedure.', startH: 3, nursing: ['Daily INR; report INR above 3.5 or below 2.0.', 'Consistent vitamin K intake; review new antibiotics for INR interaction.'] });
    orderOnce(spec, { name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Soft toothbrush, electric razor, hold pressure 5 minutes after sticks, no IM injections. Report melena, hematuria, epistaxis or new headache.', startH: 3 });
    assess(spec, [['Cardiac', 'Heart Sounds', 'Crisp mechanical valve click; no new murmur']]);
    comorbOnce(spec, { key: 'mech_valve', problem: 'Mechanical heart valve on warfarin (INR goal 2.5-3.5)', details: 'Lifelong warfarin; needs bridging if interrupted; endocarditis prophylaxis before dental procedures.', pmh: 'Mechanical heart valve replacement on warfarin', plan: (c, S, h) => [S.flag('surgeryWindow', h) || S.flag('npoStrict', h) ? 'Warfarin held for procedure/NPO: bridging anticoagulation per cardiology; check INR daily.' : 'Continue warfarin per daily INR (goal 2.5-3.5).', 'No DOAC; bleeding precautions.'] });
  }, 'Mechanical valve: warfarin (INR goal 2.5-3.5) with bridging order, daily INR, replaces apixaban, bleeding precautions.');

  reg('valve_bio', 'Bioprosthetic / TAVR valve replacement', CV, (ctx, spec) => {
    homeOnce(spec, { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', info: 'Low-dose aspirin for bioprosthetic valve. Monitor for bleeding.', monitor: ['Hgb'], sips: true, indication: 'Bioprosthetic heart valve' });
    assess(spec, [['Cardiac', 'Heart Sounds', 'S1 S2 regular; soft systolic flow murmur (bioprosthetic valve), no click']]);
  }, 'Bioprosthetic valve: aspirin 81 mg and a soft flow murmur on exam.');

  reg('icd', 'Implantable defibrillator (ICD)', CV, (ctx, spec) => {
    device(spec, { deviceType: 'Tube', type: 'ICD (defibrillator)', location: 'Left upper chest', siteMarker: 'chestLeft', status: 'Active', assess: 'pocket healed, no erythema, swelling or tenderness; device mobile under skin' });
    orderOnce(spec, { name: 'ICD precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'If the patient receives a shock: check consciousness, pulse, BP and rhythm; obtain 12-lead ECG; notify provider. One shock and feels well: notify provider same day. Two or more shocks, or a shock with chest pain, syncope or dyspnea: rapid response. No MRI or magnet use without device clearance; electrocautery needs an EP plan.', startH: 3 });
    assess(spec, [['Cardiac', 'Device', 'ICD left chest; pocket healed, no shocks reported']]);
  }, 'ICD device entry, shock response order, MRI/magnet caution.');
  reg('afib_ablation', 'Cardiac ablation (AF / SVT)', CV);

  attach('pacemaker', (ctx, spec) => {
    device(spec, { deviceType: 'Tube', type: 'Permanent pacemaker (dual chamber)', location: 'Left upper chest', siteMarker: 'chestLeft', status: 'Active', assess: 'pocket healed, no erythema or swelling; programmed lower rate 60 bpm' });
    orderOnce(spec, { name: 'Pacemaker precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Programmed lower rate 60 bpm: notify provider for pulse below 60 or symptoms of failure to capture/sense (dizziness, syncope, fatigue). No MRI unless the system is MRI-conditional and cleared; electrocautery needs a device plan.', startH: 3 });
    assess(spec, [['Cardiac', 'Rhythm', 'Sinus rhythm with intermittent atrial-paced beats'], ['Cardiac', 'Device', 'Pacemaker left chest; pocket healed']]);
  }, 'Pacemaker device entry, paced rhythm, lower-rate and MRI precautions.');

  // ---------- Thoracic / Pulmonary ----------
  reg('lobectomy', 'Lobectomy / VATS lung resection', THO, (ctx, spec) => {
    const side = sideOf(ctx, 'lobectomy');
    spec.vitalAdjust.push({ spo2: -1 });
    orderOnce(spec, { name: 'Reduced lung reserve (lung resection)', category: 'Respiratory', frequency: 'Continuous', instructions: 'Reduced lung volume: watch SpO2 and work of breathing closely with any pulmonary illness or opioid; encourage deep breathing and incentive spirometry.', startH: 3 });
    assess(spec, [['Respiratory', 'Breath Sounds', `Diminished over the ${side.toLowerCase()} upper zone (post-lobectomy), otherwise clear`], ['Respiratory', 'Chest Wall', `Healed ${side.toLowerCase()} chest port scars; mild intermittent incisional ache`]]);
  }, 'Reduced lung reserve: lower SpO2 by 1, diminished breath sounds, chest wall scar finding.');
  reg('pleurodesis', 'Thoracotomy / pleurodesis (pneumothorax, effusion)', THO);
  reg('tracheostomy', 'Tracheostomy', THO, (ctx, spec) => {
    device(spec, { deviceType: 'Tube', type: 'Tracheostomy tube (cuffed, size 6)', location: 'Anterior neck', siteMarker: 'trach', status: 'Cuff deflated', assess: 'stoma clean and dry; inner cannula clean; ties secure (one finger); secretions thin white' });
    orderOnce(spec, { name: 'Tracheostomy care and suction', category: 'Respiratory', frequency: 'Every shift and PRN', instructions: 'Clean stoma and inner cannula, change ties and dressing when soiled, humidify oxygen. Suction PRN (sterile, 10-15 seconds, pre-oxygenate); notify provider for thick, bloody or foul secretions.', startH: 3 });
    orderOnce(spec, { name: 'Tracheostomy emergency equipment at bedside', category: 'Precautions', frequency: 'Continuous', instructions: 'Spare tracheostomy tube of the same size and one size smaller, obturator, 10 mL syringe, suction, bag-valve device and oxygen. If decannulated: call for help, oxygenate the stoma and mouth/nose, reinsert spare.', startH: 3 });
    assess(spec, [['Respiratory', 'Airway', 'Tracheostomy, patent; cuff deflated; stoma clean'], ['Neurologic', 'Communication', 'Speaks with finger occlusion / speaking valve; writing board at bedside']]);
  }, 'Tracheostomy device entry, care/suction and emergency equipment orders.');

  // ---------- Orthopedic ----------
  reg('hip_fracture', 'Hip fracture repair (hemiarthroplasty / nail / ORIF)', ORT, (ctx, spec) => {
    homeOnce(spec, { key: 'vitamin_d', name: 'cholecalciferol (vitamin D3) tablet', dose: '2,000 units', route: 'Oral', freq: 'daily', cls: 'Vitamin D', holdIf: ['npo'], indication: 'Bone health after fragility fracture' });
    homeOnce(spec, { key: 'calcium_supp', name: 'calcium citrate with vitamin D3 (CITRACAL PETITES) tablet', dose: '500 mg', route: 'Oral', freq: 'BID', cls: 'Calcium supplement', info: 'Give apart from levothyroxine and iron by 2 hours.', holdIf: ['npo'], indication: 'Bone health after fragility fracture' });
    spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
    if (recent(ctx, 'hip_fracture', 1)) orderOnce(spec, { name: 'Hip precautions (confirm with surgeon)', category: 'Precautions', frequency: 'Continuous', instructions: 'If posterior approach hemiarthroplasty: no hip flexion past 90 degrees, no adduction past midline, no internal rotation; pillow between legs when turning; raised toilet seat.', startH: 3 });
    assess(spec, [['Musculoskeletal / Mobility', 'Mobility', 'Walks with front-wheeled walker; slow, mildly antalgic gait'], ['Skin', 'Surgical Scar', 'Healed lateral hip incision']]);
  }, 'Vitamin D and calcium, higher fall risk, walker mobility baseline (hip precautions if recent).');
  reg('orif_ankle', 'ORIF - ankle / tibia / femur (hardware)', ORT);
  reg('orif_arm', 'ORIF - shoulder / humerus / forearm / wrist', ORT);
  reg('rotator_cuff', 'Rotator cuff repair', ORT);
  reg('acl_repair', 'ACL reconstruction', ORT);
  reg('knee_scope', 'Knee arthroscopy / meniscectomy', ORT);
  reg('carpal_tunnel', 'Carpal tunnel release', ORT);

  attach('tka', (ctx, spec) => {
    const side = sideOf(ctx, 'tka');
    assess(spec, [['Musculoskeletal / Mobility', 'Mobility', 'Independent; chronic stiffness of the replaced ' + side.toLowerCase() + ' knee, may use a cane'], ['Skin', 'Surgical Scar', `Healed ${side.toLowerCase()} anterior knee incision`]]);
  }, 'Baseline mobility: independent with stiff replaced knee, healed scar.');
  attach('tha', (ctx, spec) => {
    const side = sideOf(ctx, 'tha');
    if (recent(ctx, 'tha', 1)) orderOnce(spec, { name: 'Hip precautions (confirm with surgeon)', category: 'Precautions', frequency: 'Continuous', instructions: 'If posterior approach: no hip flexion past 90 degrees, no adduction past midline, no internal rotation; pillow between legs when turning; raised toilet seat.', startH: 3 });
    assess(spec, [['Musculoskeletal / Mobility', 'Mobility', 'Independent with a cane for distances; no pain at the replaced ' + side.toLowerCase() + ' hip'], ['Skin', 'Surgical Scar', `Healed ${side.toLowerCase()} lateral hip incision`]]);
  }, 'Baseline mobility with cane; hip precautions if done within a year.');
  attach('spine', (ctx, spec) => {
    homeOnce(spec, { key: 'gabapentin', name: 'gabapentin (NEURONTIN) capsule', dose: '300 mg', route: 'Oral', freq: 'BID', cls: 'Anticonvulsant / neuropathic pain', sips: true, info: 'Monitor sedation and dizziness. Dose is adjusted for kidney function. Do not stop abruptly.', monitor: ['RR'], renal: { ckd3: { dose: '300 mg', freq: 'daily', note: 'Dose reduced for reduced kidney function.' }, esrd: { dose: '100 mg', freq: 'daily', note: 'Give after dialysis on dialysis days; accumulates in ESRD.' } }, indication: 'Chronic back pain / radiculopathy' });
    assess(spec, [['Neurologic', 'Neuro Baseline', 'Chronic low back pain; strength 5/5 and sensation intact in both legs; healed midline scar'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent; stiff spine, avoids bending and twisting']]);
  }, 'Chronic back pain/neuro baseline; gabapentin (renally dosed).');

  // ---------- Neurosurgical ----------
  reg('craniotomy', 'Craniotomy (tumor, hematoma, aneurysm clipping)', NEU, (ctx, spec) => {
    homeOnce(spec, { key: 'levetiracetam', name: 'levetiracetam (KEPPRA) tablet', dose: '500 mg', route: 'Oral', freq: 'BID', cls: 'Anticonvulsant', sips: true, info: 'Seizure prevention after craniotomy. Do not stop abruptly. Watch for somnolence, irritability and mood change.', renal: { esrd: { dose: '500 mg', freq: 'daily', note: 'Give a supplemental dose after dialysis.' } }, indication: 'Seizure prophylaxis after craniotomy' });
    orderOnce(spec, { name: 'Seizure precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Bed low, suction and oxygen at bedside, padded rails per policy. During a seizure: protect the head, turn on side, time and describe it, do not restrain; call provider.', startH: 3 });
    assess(spec, [['Neurologic', 'Neuro Baseline', 'Healed craniotomy scar; no focal deficit; speech clear']]);
  }, 'Levetiracetam, seizure precautions, healed craniotomy neuro baseline.');
  reg('vp_shunt', 'Ventriculoperitoneal (VP) shunt', NEU, (ctx, spec) => {
    device(spec, { deviceType: 'Tube', type: 'VP shunt (programmable valve)', location: 'Right scalp to peritoneum', status: 'Functioning', assess: 'valve palpable behind right ear, non-tender; no redness or swelling along tract' });
    orderOnce(spec, { name: 'Shunt malfunction watch', category: 'Nursing', frequency: 'Every 4 hours with neuro checks', instructions: 'Report new headache, vomiting, lethargy, irritability, confusion, vision change, seizure, or redness/swelling along the shunt tract or abdominal pain. MRI can change a programmable valve setting: confirm the setting afterwards. Do not press on the valve.', startH: 3 });
    assess(spec, [['Neurologic', 'Shunt', 'Shunt valve non-tender; no signs of malfunction']]);
  }, 'VP shunt device entry; malfunction watch order; MRI/valve caution.');
  reg('laminectomy', 'Laminectomy / discectomy', NEU);
  reg('acdf', 'Cervical discectomy / fusion (ACDF)', NEU);

  // ---------- Gynecologic ----------
  const femaleOnly = label => (ctx, spec) => { if (ctx.male) spec.warnings.push({ level: 'error', text: `${label} selected for a male patient.` }); };
  reg('oophorectomy', 'Oophorectomy / salpingo-oophorectomy', GYN, (ctx, spec) => {
    femaleOnly('Oophorectomy')(ctx, spec);
    if (ctx.female && ctx.age < 55) assess(spec, [['Safety', 'Menopausal Symptoms', 'Surgical menopause: occasional hot flashes, no night sweats today']]);
  }, 'Flags a male patient; surgical-menopause symptom finding if under 55.');
  reg('myomectomy', 'Myomectomy / ovarian cystectomy', GYN, femaleOnly('Myomectomy'), 'Flags a male patient (no other chart effect).');
  reg('pelvic_sling', 'Prolapse repair / bladder sling', GYN, femaleOnly('Pelvic prolapse / bladder sling surgery'), 'Flags a male patient (no other chart effect).');

  // ---------- Urologic / Renal ----------
  const maleOnly = label => (ctx, spec) => { if (ctx.female) spec.warnings.push({ level: 'error', text: `${label} selected for a female patient.` }); };
  reg('prostatectomy', 'Prostatectomy (radical / simple)', URO, (ctx, spec) => {
    maleOnly('Prostatectomy')(ctx, spec);
    assess(spec, [['GU', 'Urinary Elimination', 'Voiding spontaneously; mild stress incontinence, uses 1-2 pads per day']]);
  }, 'Flags a female patient; baseline mild stress incontinence.');
  reg('turp', 'TURP / prostate laser surgery', URO, maleOnly('TURP'), 'Flags a female patient (no other chart effect).');
  reg('nephrectomy', 'Nephrectomy (partial / radical)', URO, (ctx, spec) => {
    baseLab(spec, 'Creatinine', ctx.female ? 1.2 : 1.4, 'max'); baseLab(spec, 'BUN', 20, 'max');
    dropNSAIDs(spec, 'a solitary kidney');
    orderOnce(spec, { name: 'Solitary kidney: avoid nephrotoxins', category: 'Nursing', frequency: 'Continuous', instructions: 'One functioning kidney (baseline creatinine about 1.2-1.4). Avoid NSAIDs, aminoglycosides and unnecessary IV contrast; pharmacy to renally dose; avoid prolonged hypotension; strict I&O and daily creatinine.', startH: 3, nursing: ['Notify provider for urine output below 0.5 mL/kg/hr or a rising creatinine.'] });
    assess(spec, [['GU', 'Flank Incision', 'Healed flank scar, non-tender']]);
    comorbOnce(spec, { key: 'solitary_kidney', problem: 'Solitary kidney (status post nephrectomy)', details: 'Baseline creatinine about 1.2-1.4; vulnerable to nephrotoxins and hypotension.', pmh: 'Nephrectomy (solitary kidney)', plan: () => ['Avoid NSAIDs and contrast where possible; renally dose medications; daily creatinine and strict I&O.'] });
  }, 'Solitary kidney: creatinine 1.2-1.4, NSAIDs removed, nephrotoxin-avoidance order.');
  reg('kidney_transplant', 'Kidney transplant', URO, (ctx, spec) => {
    if (ctx.has('esrd') || ctx.has('ckd5')) spec.warnings.push({ level: 'warning', text: 'Kidney transplant and ESRD/CKD 5 are both selected; the chart assumes a failing graft. Remove one if unintended.' });
    baseLab(spec, 'Creatinine', ctx.female ? 1.3 : 1.5, 'max'); baseLab(spec, 'Magnesium', 1.7, 'min'); baseLab(spec, 'Potassium', 4.4, 'max');
    spec.labBase['Tacrolimus level'] = 6.5;
    addLabs(spec, 0.5, ['Tacrolimus level', 'Magnesium']);
    dropNSAIDs(spec, 'a kidney transplant');
    homeOnce(spec, { key: 'tacrolimus', name: 'tacrolimus (PROGRAF) capsule', dose: '3 mg', route: 'Oral', freq: 'q12h', cls: 'Calcineurin inhibitor (immunosuppressant)', highAlert: true, sips: true, info: 'TIME-CRITICAL: same times every 12 hours. Draw the trough level BEFORE the morning dose. Grapefruit, azole antifungals and macrolides raise levels. Watch tremor, K, Mg, glucose and creatinine.', monitor: ['K', 'Mg', 'Cr', 'Glucose'], hold: 'Do not hold for NPO. Call transplant team/pharmacy before any missed or held dose.', indication: 'Kidney transplant immunosuppression (trough goal 5-8 ng/mL)' });
    homeOnce(spec, { key: 'mycophenolate', name: 'mycophenolate mofetil (CELLCEPT) tablet', dose: '1,000 mg', route: 'Oral', freq: 'BID', cls: 'Antimetabolite (immunosuppressant)', highAlert: true, sips: true, info: 'Do not crush or split; wear gloves if handling broken tablets (teratogenic). Causes GI upset and low white count.', monitor: ['WBC', 'Plt'], hold: 'Notify provider before giving if WBC below 3 or severe diarrhea. Do not stop without the transplant team.', indication: 'Kidney transplant immunosuppression' });
    homeOnce(spec, { key: 'prednisone', name: 'prednisone tablet', dose: '5 mg', route: 'Oral', freq: 'daily', cls: 'Corticosteroid', sips: true, info: 'Do not stop abruptly (adrenal suppression). Stress-dose steroids may be needed with sepsis or surgery. Raises glucose.', monitor: ['Glucose'], indication: 'Kidney transplant maintenance steroid' });
    orderOnce(spec, { name: 'Immunosuppression precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Strict hand hygiene; mask for visitors or staff with respiratory symptoms; no rectal temperatures, suppositories or enemas; no live vaccines. Temperature 100.4 F or higher: blood cultures and early provider evaluation; infections can be subtle on steroids.', startH: 3 });
    orderOnce(spec, { name: 'Transplant kidney protection', category: 'Nursing', frequency: 'Continuous', instructions: 'Avoid NSAIDs, aminoglycosides and unnecessary IV contrast; avoid hypotension and dehydration; pharmacy to review interactions with tacrolimus; strict I&O, daily weight and creatinine. Notify transplant team for urine output below 0.5 mL/kg/hr, graft tenderness or creatinine rise of 0.3 or more.', startH: 3 });
    assess(spec, [['GU', 'Transplant Graft', 'Graft palpable in the right lower quadrant, non-tender; no swelling']]);
    comorbOnce(spec, { key: 'kidney_transplant', problem: 'Kidney transplant on immunosuppression', details: 'Tacrolimus, mycophenolate and prednisone; baseline creatinine about 1.3-1.5.', pmh: 'Kidney transplant on tacrolimus, mycophenolate and prednisone', plan: () => ['Never miss immunosuppression doses (even when NPO: sips/IV conversion per pharmacy); tacrolimus trough each morning.', 'Avoid nephrotoxins; low threshold to culture for fever.'] });
  }, 'Tacrolimus, mycophenolate, prednisone; tacrolimus level, Mg/K/Cr baseline; infection precautions; NSAIDs removed.');
  reg('cystectomy_urostomy', 'Cystectomy with urostomy (ileal conduit)', URO, (ctx, spec) => {
    device(spec, { deviceType: 'Tube', type: 'Urostomy (ileal conduit)', location: 'Right lower quadrant', siteMarker: 'abdomenRLQ', status: 'Active', assess: 'stoma pink, moist and budded; peristomal skin intact; clear yellow urine with mucus in pouch' });
    baseLab(spec, 'CO2', 22, 'min'); baseLab(spec, 'Chloride', 106, 'max'); baseLab(spec, 'Creatinine', ctx.female ? 1.0 : 1.2, 'max');
    orderOnce(spec, { name: 'Urostomy care and output monitoring', category: 'Nursing', frequency: 'Every shift and PRN', instructions: 'Assess stoma (pink-red, moist), peristomal skin and urine (clear yellow with mucus is normal). Empty pouch when one-third full; connect to a drainage bag at night; change appliance every 4-7 days. Notify provider for output below 30 mL/hr, cloudy/foul urine, fever or flank pain. Do not place a urethral catheter.', startH: 3 });
    orderOnce(spec, { name: 'Ostomy supplies at bedside', category: 'Nursing', frequency: 'Continuous', instructions: 'Urostomy pouches with spout, flange, barrier ring, night drainage bag, adhesive remover, measuring guide. Wound/ostomy nurse consult as needed.', startH: 3 });
    assess(spec, [['GU', 'Urinary Elimination', 'Urostomy draining clear yellow urine with mucus; no voiding'], ['GU', 'Stoma', 'Right lower quadrant urostomy: pink, moist, budded; peristomal skin intact']]);
    comorbOnce(spec, { key: 'urostomy', problem: 'Urostomy (ileal conduit)', details: 'Mucus in urine is expected; risk of UTI/pyelonephritis and mild hyperchloremic acidosis.', pmh: 'Cystectomy with ileal conduit urostomy', plan: () => ['Stoma and pouch care each shift; monitor urine output, BMP and signs of UTI.'] });
  }, 'Urostomy device entry, stoma/output orders, mild hyperchloremic acidosis baseline.');
  reg('ureteroscopy', 'Ureteroscopy / lithotripsy / ureteral stent', URO);

  // ---------- Endocrine / Breast ----------
  reg('thyroidectomy_total', 'Total thyroidectomy', END, (ctx, spec) => {
    homeOnce(spec, { key: 'levothyroxine', name: 'levothyroxine (SYNTHROID) tablet', dose: ctx.weightKg < 75 ? '100 mcg' : '125 mcg', route: 'Oral', freq: 'daily', at: ['0600'], cls: 'Thyroid hormone', info: 'Lifelong replacement after thyroidectomy. Give on an empty stomach, 30-60 minutes before breakfast, separate from calcium and iron by 4 hours.', holdIf: ['npo'], holdReason: 'NPO (long half-life; a few days may be held)', indication: 'Post-thyroidectomy hypothyroidism' });
    addLabs(spec, 0.5, ['TSH', 'PTH']);
    spec.labBase.PTH = 32;
    baseLab(spec, 'Calcium', 9.0, 'min');
    orderOnce(spec, { name: 'Hypocalcemia watch (post-thyroidectomy)', category: 'Nursing', frequency: 'Every shift', instructions: 'Parathyroid function may be reduced. Ask about perioral numbness, finger tingling or muscle cramps; check Chvostek and Trousseau signs. Notify provider for symptoms or calcium below 8.0 mg/dL; review calcium and PTH results.', startH: 3, nursing: ['Severe hypocalcemia: laryngospasm, tetany, seizure, prolonged QT; keep IV calcium gluconate available per protocol.'] });
    assess(spec, [['Skin', 'Neck Incision', 'Healed low anterior neck collar scar; voice strong'], ['Neurologic', 'Hypocalcemia Check', 'No perioral numbness or tingling; Chvostek and Trousseau negative']]);
    if (!ctx.has('hypothyroid')) comorbOnce(spec, { key: 'post_thyroidectomy', problem: 'Postsurgical hypothyroidism / hypoparathyroidism risk', details: 'Lifelong levothyroxine after total thyroidectomy; calcium and PTH monitoring.', pmh: 'Total thyroidectomy', plan: () => ['Continue levothyroxine when taking PO (may hold a few days if NPO).', 'Monitor calcium; report tingling or cramps.'] });
  }, 'Levothyroxine 100-125 mcg, TSH and PTH labs, hypocalcemia watch.');
  reg('thyroid_lobectomy', 'Thyroid lobectomy (hemithyroidectomy)', END);
  reg('parathyroidectomy', 'Parathyroidectomy', END);
  reg('lumpectomy', 'Lumpectomy / breast biopsy', END);
  const mastectomy = side => (ctx, spec) => {
    const both = ctx.surg.has('mastectomy_left') && ctx.surg.has('mastectomy_right'), arm = side.toLowerCase();
    if (both) orderOnce(spec, { name: 'Arm precautions: bilateral mastectomy (lymphedema risk)', category: 'Precautions', frequency: 'Continuous', instructions: 'Both axillae at risk. Ask the surgeon which arm may be used (usually the side with sentinel node biopsy only); use hand or lower-extremity veins if needed. Avoid BP, tourniquets and injections in the restricted arm.', startH: 3 });
    else { orderOnce(spec, { name: `No BP, blood draws, IV access or injections in ${arm} arm (mastectomy)`, category: 'Precautions', frequency: 'Continuous', instructions: `Protect the ${arm} arm from lymphedema and infection: no BP cuff, venipuncture, IV or injections. Use the ${flip[side].toLowerCase()} arm. Report swelling, redness or heaviness.`, startH: 3 }); moveIVs(spec, side); }
    if (ctx.female && ctx.age >= 55) homeOnce(spec, { key: 'anastrozole', name: 'anastrozole (ARIMIDEX) tablet', dose: '1 mg', route: 'Oral', freq: 'daily', cls: 'Aromatase inhibitor', info: 'Adjuvant breast cancer therapy. Causes joint aches and bone loss; do not stop without oncology.', holdIf: ['npo'], indication: 'Adjuvant endocrine therapy after mastectomy' });
    else homeOnce(spec, { key: 'tamoxifen', name: 'tamoxifen tablet', dose: '20 mg', route: 'Oral', freq: 'daily', cls: 'Selective estrogen receptor modulator', info: 'Adjuvant endocrine therapy. Raises the risk of blood clots: watch for leg swelling and dyspnea, especially after immobility or surgery.', holdIf: ['npo'], indication: 'Adjuvant endocrine therapy after mastectomy' });
    assess(spec, [['Skin', 'Chest Wall', `Healed ${arm} mastectomy scar; flat chest wall, no erythema or seroma`], ['Musculoskeletal / Mobility', 'Arm Precautions', `${side} arm at risk for lymphedema: no BP, IV or venipuncture; no swelling today`]]);
    sticky(spec, 'Restricted arm', both ? 'Bilateral mastectomy: confirm the usable arm with the surgeon.' : `${side} arm: no BP, IV, venipuncture or injections.`);
  };
  reg('mastectomy_left', 'Mastectomy - left (with axillary node surgery)', END, mastectomy('Left'), 'No BP/IV/venipuncture left-arm order, IV moved to right arm, endocrine therapy.');
  reg('mastectomy_right', 'Mastectomy - right (with axillary node surgery)', END, mastectomy('Right'), 'No BP/IV/venipuncture right-arm order, IV moved to left arm, endocrine therapy.');

  // ---------- Head / Neck / ENT ----------
  reg('cataract', 'Cataract surgery (lens implant)', ENT);
  reg('sinus_surgery', 'Sinus surgery / septoplasty', ENT);
  reg('laryngectomy', 'Total laryngectomy (neck breather)', ENT, (ctx, spec) => {
    device(spec, { deviceType: 'Tube', type: 'Laryngectomy stoma (permanent)', location: 'Anterior neck', siteMarker: 'trach', status: 'Patent', assess: 'stoma patent and moist; crusting minimal; secretions thin white' });
    orderOnce(spec, { name: 'NECK BREATHER: airway through the stoma only', category: 'Precautions', frequency: 'Continuous', instructions: 'Permanent stoma: the patient cannot breathe through the nose or mouth. Give oxygen, suction and ventilation at the NECK (small mask or tube on the stoma); mouth-to-mouth or a face mask will not work. Humidify, keep stoma clear. Post a neck-breather sign over the bed.', startH: 3, nursing: ['Call for help immediately if stoma is blocked; remove crusts or plug.'] });
    assess(spec, [['Respiratory', 'Airway', 'Permanent laryngectomy stoma, patent; no upper airway breathing'], ['Neurologic', 'Communication', 'No natural voice; uses electrolarynx or writing board']]);
  }, 'Neck-breather order and stoma device; airway/communication findings.');

  // ---------- Vascular ----------
  const antiplateletStatin = (ctx, spec, why) => {
    homeOnce(spec, { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', info: 'Monitor for bleeding. Continue through surgery unless the surgeon directs otherwise.', monitor: ['Hgb'], sips: true, indication: why });
    homeOnce(spec, { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '40 mg', route: 'Oral', freq: 'qHS', cls: 'Statin', info: 'Report unexplained muscle pain or weakness.', monitor: ['LFT'], holdIf: ['npo'], indication: why });
  };
  reg('carotid_endarterectomy', 'Carotid endarterectomy / stent', VAS, (ctx, spec) => {
    antiplateletStatin(ctx, spec, 'Carotid artery disease');
    assess(spec, [['Skin', 'Neck Incision', `Healed ${sideOf(ctx, 'carotid_endarterectomy').toLowerCase()} neck incision`], ['Neurologic', 'Neuro Baseline', 'No focal deficit; speech clear; no facial droop']]);
  }, 'Aspirin and statin, healed neck incision, neuro baseline.');
  reg('aaa_repair', 'AAA repair (open or EVAR)', VAS, (ctx, spec) => {
    antiplateletStatin(ctx, spec, 'Aortic aneurysm repair / atherosclerosis');
    assess(spec, [['Cardiac', 'Peripheral Pulses', 'Femoral and pedal pulses palpable and symmetric'], ['GI', 'Abdomen', 'Soft, non-tender; healed abdominal or bilateral groin scars']]);
  }, 'Aspirin and statin, peripheral pulse baseline.');
  reg('fem_pop', 'Femoral-popliteal bypass / leg revascularization', VAS, (ctx, spec) => {
    const side = sideOf(ctx, 'fem_pop');
    antiplateletStatin(ctx, spec, 'Peripheral arterial disease with bypass graft');
    orderOnce(spec, { name: `Graft check: ${side.toLowerCase()} leg pulses and perfusion`, category: 'Nursing', frequency: 'Every shift', instructions: `Check ${side.toLowerCase()} foot pulses (Doppler if not palpable), color, temperature, capillary refill and sensation. Notify provider immediately for new pain, pallor, coolness, numbness or loss of Doppler signal (graft occlusion). Avoid tight garments; keep heels off-loaded.`, startH: 3 });
    assess(spec, [['Cardiac', 'Peripheral Pulses', `${side} foot pulses dopplerable only (graft functioning); other leg palpable`], ['Cardiac', 'Capillary Refill', 'Less than 3 seconds']]);
  }, 'Aspirin and statin, graft check order, Doppler pulse baseline.');
  reg('av_fistula', 'AV fistula / graft creation (dialysis access)', VAS, (ctx, spec) => {
    device(spec, { deviceType: 'Tube', type: 'AV fistula', location: 'Left upper arm', siteMarker: 'leftUpperArm', status: 'Patent', assess: 'thrill palpable, bruit audible, no redness or swelling' });
    orderOnce(spec, { name: 'No BP, blood draws or IV access in left arm (AV fistula)', category: 'Precautions', frequency: 'Continuous', instructions: 'Protect the fistula arm. Check thrill and bruit every shift.', startH: 3 });
    moveIVs(spec, 'Left');
    assess(spec, [['Cardiac', 'Fistula Thrill and Bruit', 'Left upper arm: thrill palpable, bruit audible'], ['Safety', 'Precautions', 'No BP / venipuncture / IV in left arm']]);
  }, 'Fistula device entry, left-arm protection order, IVs kept in the right arm.');
  const amputation = (key, level, high) => (ctx, spec) => {
    const side = sideOf(ctx, key), s = side.toLowerCase();
    if (high) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      homeOnce(spec, { key: 'gabapentin', name: 'gabapentin (NEURONTIN) capsule', dose: '100 mg', route: 'Oral', freq: 'TID', cls: 'Anticonvulsant / neuropathic pain', sips: true, info: 'Treats phantom limb pain. Monitor sedation and dizziness; dose is adjusted for kidney function.', monitor: ['RR'], renal: { ckd3: { dose: '100 mg', freq: 'BID', note: 'Dose reduced for reduced kidney function.' }, esrd: { dose: '100 mg', freq: 'daily', note: 'Give after dialysis on dialysis days.' } }, indication: 'Phantom limb pain' });
    }
    orderOnce(spec, { name: 'Residual limb care and positioning', category: 'Nursing', frequency: high ? 'Every shift' : 'Daily', instructions: high ? `Inspect the ${s} residual limb each shift for redness, drainage and skin breakdown; keep it extended, no pillow under the knee and do not let it hang off the bed (contracture); prone lying or leg extension several times a day.` : `Inspect both feet daily. Check the ${s} amputation site for redness, drainage and skin breakdown; protect the remaining foot from pressure and wear well-fitting footwear.`, startH: 3 });
    assess(spec, [['Musculoskeletal / Mobility', 'Residual Limb', `${side} ${level}: well healed, no redness, drainage or skin breakdown`], ['Musculoskeletal / Mobility', 'Mobility', high ? 'Transfers with walker and one assist; wheelchair for distance' : 'Walks with a modified shoe; steady']].concat(high ? [['Pain', 'Phantom Limb Pain', 'Intermittent phantom tingling, 2/10']] : []));
  };
  reg('amp_bka', 'Below-knee amputation', VAS, amputation('amp_bka', 'below-knee residual limb', true), 'Residual limb order/assessment, phantom pain gabapentin, higher fall risk.');
  reg('amp_aka', 'Above-knee amputation', VAS, amputation('amp_aka', 'above-knee residual limb', true), 'Residual limb order/assessment, phantom pain gabapentin, higher fall risk.');
  reg('amp_toe', 'Toe / transmetatarsal amputation', VAS, amputation('amp_toe', 'foot amputation site', false), 'Foot inspection order and amputation-site assessment.');
  reg('peripheral_angioplasty', 'Peripheral angioplasty / stent (leg arteries)', VAS);
  reg('ivc_filter', 'IVC filter placement', VAS);

  // ---------- Other ----------
  reg('central_port', 'Implanted venous port placement', OTH, (ctx, spec) => {
    device(spec, { deviceType: 'Tube', type: 'Implanted venous port (single lumen)', location: 'Right upper chest', siteMarker: 'chestRight', status: 'De-accessed', assess: 'pocket intact and non-tender, no erythema or swelling; not accessed' });
    orderOnce(spec, { name: 'Implanted port: access and flush', category: 'Nursing', frequency: 'With each use', instructions: 'Access only with a non-coring (Huber) needle, sterile technique and mask; confirm blood return. Flush 10 mL normal saline before and after use, heparin lock per policy; change needle every 7 days if left accessed. Fever, chills or site redness: blood cultures from the port and a peripheral site, notify provider.', startH: 3 });
    assess(spec, [['Skin', 'Port Site', 'Right chest port pocket intact, non-tender, no erythema; not accessed']]);
  }, 'Port device entry (de-accessed), access/flush and infection orders.');
  reg('hd_catheter', 'Tunneled dialysis catheter placement', OTH, (ctx, spec) => {
    device(spec, { deviceType: 'Tube', type: 'Tunneled dialysis catheter', location: 'Right upper chest', siteMarker: 'chestRight', status: 'Capped and clamped', assess: 'dressing clean, dry and intact; caps and clamps secure; exit site without redness' });
    orderOnce(spec, { name: 'Dialysis catheter: use by dialysis RN only', category: 'Precautions', frequency: 'Continuous', instructions: 'Do not draw blood or infuse through the dialysis catheter unless the nephrologist orders it. Keep the dressing dry and intact, both clamps closed and capped. Fever or chills: blood cultures and notify provider (line infection).', startH: 3 });
  }, 'Dialysis catheter device entry; restricted-use order.');
  reg('skin_graft', 'Skin graft / flap reconstruction', OTH, (ctx, spec) => {
    const side = sideOf(ctx, 'skin_graft').toLowerCase();
    orderOnce(spec, { name: `Protect graft site (${side} lower leg)`, category: 'Precautions', frequency: 'Continuous', instructions: 'Avoid shear, friction, adhesive tape, BP cuffs and tourniquets over the graft; moisturize and protect from sun and trauma. Report breakdown or drainage.', startH: 3 });
    assess(spec, [['Skin', 'Graft Site', `Healed split-thickness graft, ${side} lower leg: fragile, shiny, intact; donor site healed`]]);
  }, 'Graft-site protection order and skin finding.');
})();
