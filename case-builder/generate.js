/* NursingSim Case Builder v2 - orchestrator: input -> canonical v2 case + report. */
NS.buildCase = function buildCase(input) {
  const U = NS.util, E = NS.engine, B = NS.build;
  const ctx = E.makeCtx(input);
  const profile = NS.PRIMARY[input.primary];
  if (!profile) throw new Error(`Unknown primary diagnosis: ${input.primary}`);

  // 1. Profile -> spec, then layer on history / social / allergies / safety rules
  let spec = E.normalizeSpec(profile.build(ctx));
  spec.profile = profile;
  addProlongedStage(ctx, spec);
  NS.rules.applyAll(ctx, spec);
  eventsToOrders(ctx, spec);

  // 2. Medications and orders
  const prepared = NS.medEdit.apply(ctx, spec, B.prepareMeds(ctx, spec), input.medEdits);
  const med = B.buildMedicationOrders(ctx, spec, prepared);
  med.orders.forEach((o, i) => { o._src = prepared[i]; });
  const rank = o => (o.status !== 'Active' ? 4 : o.mar.category === 'continuous' ? 1 : o.mar.category === 'prn' ? 3 : 0);
  const firstDue = id => { const a = med.admins.filter(x => x.orderId === id && x.state === 'due').sort((p, q) => p.time.localeCompare(q.time))[0]; return a ? a.time : '9999'; };
  med.orders.sort((a, b) => rank(a) - rank(b) || firstDue(a.id).localeCompare(firstDue(b.id)));
  const otherOrders = B.buildOtherOrders(ctx, spec);

  // 3. Observations (vitals -> labs -> assessments)
  const obs = [];
  E.buildVitalObservations(ctx, spec, obs);
  E.buildLabs(ctx, spec, obs);
  const S = makeState(ctx, spec, obs, prepared, otherOrders);
  B.buildAssessmentObservations(ctx, spec, S, obs);

  // 4. Devices and I&O
  const devices = B.buildDevices(ctx, spec);
  const ioEvents = B.buildIO(ctx, spec, med.orders);
  S.devicesAll = devices; S.io = ioEvents;
  med.orders.forEach(o => { delete o._src; });
  const orders = [...otherOrders, ...med.orders];
  S.orders = orders;

  // 5. Problems, encounter, sticky notes
  const stage = E.stageAt(spec, ctx.nowH);
  const problems = buildProblems(ctx, spec, stage);
  const diet = S.diet(ctx.nowH), activity = S.activity(ctx.nowH);
  const fallRisk = fallRiskLevel(ctx, spec, prepared);
  const encounter = {
    id: `encounter_${U.slug(input.mrn)}_${U.dateOnly(ctx.admit)}`, location: input.unit || 'Medical Unit', room: input.room || '',
    attending: E.TEAM[spec.primaryTeam || 'hospitalist'], admitDate: ctx.admit, diagnosis: spec.problem.name,
    chiefComplaint: spec.chief, codeStatus: input.codeStatus || 'Full Code', isolation: stage.isolation || spec.isolation || 'None',
    dietOrder: diet, ambulationOrder: activity, fallRisk, lastUpdated: ctx.start, hospitalDay: ctx.L
  };
  S.problems = problems; S.encounter = encounter; S.stage = stage;

  const patient = {
    id: `patient_${U.slug(input.mrn || input.name)}`, mrn: input.mrn, name: input.name, preferredName: (input.name || '').split(' ')[0],
    dob: dobFor(ctx), age: ctx.age, sex: ctx.sex, pronouns: ctx.sex === 'Female' ? 'she/her' : ctx.sex === 'Male' ? 'he/him' : 'they/them',
    heightCm: ctx.heightCm, weightKg: ctx.weightKg, bmi: ctx.bmi,
    allergies: ctx.allergies.length ? ctx.allergies : [{ substance: 'NKDA', reaction: '', severity: '' }]
  };
  S.patient = patient;

  // 6. Notes
  const notes = NS.notes.generate(ctx, spec, S);
  S.notes = notes;
  const stickyNotes = buildStickyNotes(ctx, spec, S, stage);

  // 7. Timeline report for the faculty preview
  const timeline = buildTimeline(ctx, spec, S, prepared, notes);

  const slotStartHour = parseInt(U.hhmm(ctx.start).slice(0, 2), 10);
  const marSlots = Array.from({ length: 8 }, (_, i) => String((slotStartHour + i) % 24).padStart(2, '0') + '00');

  const canonical = {
    schemaVersion: '2.0',
    caseMeta: {
      caseId: `case_${profile.key}_d${ctx.L}_${U.hashString(ctx.admit + input.mrn).toString(36)}`,
      title: `${profile.label} - Hospital Day ${ctx.L}`, studentLevel: input.studentLevel, complexity: input.complexity,
      learningObjectives: buildObjectives(ctx, spec, stage)
    },
    patient, encounter, problems,
    observations: dedupeById(obs).sort((a, b) => a.collected.localeCompare(b.collected)),
    orders, administrations: med.admins, devices, ioEvents, stickyNotes,
    notes: notes.sort((a, b) => b.datetime.localeCompare(a.datetime)),
    timeline: {
      marDate: U.longDate(ctx.start), marTimeSlots: marSlots, simulationStart: ctx.start, simulationEnd: U.addH(ctx.start, 8)
    },
    simulationTasks: buildSimTasks(ctx, spec, S),
    facultyBuilder: { builderVersion: 2, inputs: input }
  };

  const report = {
    hospitalDay: ctx.L, admit: ctx.admit, stage: stage.label || '', typicalLOS: spec.typicalLOS,
    applied: spec.applied, warnings: spec.warnings.concat(NS.rules.sanityChecks(ctx, spec, S, canonical)),
    timeline, counts: {
      problems: problems.length, orders: orders.length, medications: orders.filter(o => o.category === 'Medication').length,
      labs: obs.filter(o => o.type === 'lab').length, notes: notes.length, observations: obs.length
    }
  };
  return { canonical, report, spec, state: S, ctx };
};

// ---------------------------------------------------------------------------------------------
function dobFor(ctx) {
  // Birthday is chosen so the patient is exactly `age` on the simulation date.
  const U = NS.util, simY = parseInt(ctx.start.slice(0, 4), 10), simM = parseInt(ctx.start.slice(5, 7), 10), simD = parseInt(ctx.start.slice(8, 10), 10);
  const m = Math.floor(ctx.rng() * 12) + 1, d = Math.floor(ctx.rng() * 28) + 1;
  const hadBirthday = m < simM || (m === simM && d <= simD);
  return `${simY - ctx.age - (hadBirthday ? 0 : 1)}-${U.pad(m)}-${U.pad(d)}`;
}

function eventsToOrders(ctx, spec) {
  spec.events.forEach(ev => {
    if (ev.type === 'imaging' || ev.type === 'cardiology') {
      spec.orders.push({ name: ev.study, category: ev.type === 'imaging' ? 'Imaging' : 'Cardiac Testing', frequency: 'Once', startH: Math.max(0, ev.h - (ev.orderLead ?? 0.75)),
        completeH: ev.h, pending: true, instructions: ev.instructions || `Perform ${ev.study}.`, rationale: ev.indication || '', by: ev.by || (ev.h < 3 ? 'ed' : spec.primaryTeam || 'hospitalist') });
    }
    if (ev.type === 'surgery') {
      spec.orders.push({ name: ev.name, category: 'Surgery / Procedure', frequency: 'Once', startH: ev.orderH ?? Math.max(0.5, ev.h - 5), completeH: ev.h + (ev.duration || 1), pending: true,
        instructions: ev.instructions || `${ev.name}. Consent, NPO status and pre-op checklist before transport.`, rationale: ev.indication || '', by: ev.by || 'surgeon',
        nursing: ev.nursing || ['Confirm consent is signed and in chart.', 'Confirm NPO status and last intake time.', 'Complete pre-op checklist; verify allergy band and site marking.'] });
    }
    if (ev.type === 'consult') {
      spec.orders.push({ name: `Consult: ${ev.service}`, category: 'Consult / Therapy', frequency: 'Once', startH: Math.max(0.5, ev.h - 0.75), completeH: ev.h + 0.5, pending: true, instructions: ev.reason || `Evaluate and recommend.`, by: ev.orderedBy || (ev.h < 3 ? 'ed' : spec.primaryTeam || 'hospitalist') });
    }
  });
}

function makeState(ctx, spec, obs, prepared, otherOrders) {
  const U = NS.util, E = NS.engine;
  const S = { ctx, spec, obs, prepared };
  const sets = {};
  obs.filter(o => o.type === 'vital').forEach(o => {
    const s = sets[o.collected] || (sets[o.collected] = { collected: o.collected, h: ctx.hOf(o.collected) });
    if (o.code === 'TEMP') s.temp = parseFloat(o.value);
    if (o.code === 'HR') s.hr = parseInt(o.value, 10);
    if (o.code === 'BP') { const [a, b] = o.value.split('/'); s.sbp = +a; s.dbp = +b; }
    if (o.code === 'RR') s.rr = parseInt(o.value, 10);
    if (o.code === 'SPO2') s.spo2 = parseInt(o.value, 10);
    if (o.code === 'PAIN') s.pain = parseInt(o.value, 10);
  });
  const vitalSets = Object.values(sets).sort((a, b) => a.h - b.h);
  vitalSets.forEach(s => { s.o2 = E.vitalsAt(ctx, spec, s.h, false).o2; });
  S.vitalSets = vitalSets;
  S.vitalSet = h => { let cur = vitalSets[0]; vitalSets.forEach(s => { if (s.h <= h + 1e-6) cur = s; }); return cur; };
  S.vitalRange = (h0, h1) => {
    const set = vitalSets.filter(s => s.h >= h0 && s.h <= h1);
    if (!set.length) return null;
    const r = k => [Math.min(...set.map(s => s[k])), Math.max(...set.map(s => s[k]))];
    return { temp: r('temp'), hr: r('hr'), sbp: r('sbp'), dbp: r('dbp'), rr: r('rr'), spo2: r('spo2'), pain: r('pain'), n: set.length };
  };
  const labs = () => obs.filter(o => o.type === 'lab');
  S.lab = (code, h = ctx.nowH) => {
    const list = labs().filter(o => o.code === code && ctx.hOf(o.collected) <= h + 1e-6).sort((a, b) => a.collected.localeCompare(b.collected));
    return list[list.length - 1] || null;
  };
  S.labPrev = (code, h = ctx.nowH) => {
    const list = labs().filter(o => o.code === code && ctx.hOf(o.collected) <= h + 1e-6).sort((a, b) => a.collected.localeCompare(b.collected));
    return list[list.length - 2] || null;
  };
  S.labNum = (code, h) => { const l = S.lab(code, h); return l ? parseFloat(l.value) : null; };
  S.labText = (code, h) => { const l = S.lab(code, h); return l ? `${l.value}${l.units ? ' ' + l.units : ''}${l.flag ? ' (' + (/crit/i.test(l.flag) ? 'critical ' : '') + (/high/i.test(l.flag) ? 'H' : /low/i.test(l.flag) ? 'L' : l.flag) + ')' : ''}` : 'not yet resulted'; };
  S.trend = (code, h) => {
    const a = S.lab(code, h), b = S.labPrev(code, h);
    if (!a || !b) return '';
    const x = parseFloat(a.value), y = parseFloat(b.value);
    if (isNaN(x) || isNaN(y)) return '';
    const d = x - y, tol = Math.abs(y) * 0.04;
    return d > tol ? 'up from' : d < -tol ? 'down from' : 'stable from';
  };
  const stepOrder = (cat, dflt) => h => {
    const hit = spec.orders.filter(o => o.category === cat && o.when !== false && o.startH <= h + 1e-6 && (o.stopH === undefined || o.stopH > h)).sort((a, b) => b.startH - a.startH)[0];
    return hit ? hit.name : dflt;
  };
  S.diet = stepOrder('Diet', 'Regular diet');
  S.activity = stepOrder('Activity', 'Up as tolerated');
  S.flag = (name, h = ctx.nowH) => E.flagAt(spec, name, h);
  S.stageAt = h => E.stageAt(spec, h);
  S.activeMeds = (h = ctx.nowH) => prepared.filter(m => m.startH <= h + 1e-6 && (m.stopH === undefined || m.stopH > h) && !((m.freq === 'once' || m.freq === 'stat') && m.startH < h - 0.5));
  S.medList = (h = ctx.nowH, opts = {}) => S.activeMeds(h).filter(m => opts.prn === undefined ? true : !!m.prn === opts.prn);
  S.stoppedMeds = (h = ctx.nowH) => prepared.filter(m => m.stopH !== undefined && m.stopH <= h && m.startH < m.stopH);
  S.hasMed = (word, h = ctx.nowH) => S.activeMeds(h).some(m => new RegExp(word, 'i').test(m.name));
  S.assess = (h = ctx.nowH) => {
    const v = S.vitalSet(h);
    return NS.build.assessmentAt(ctx, spec, h, { 'Respiratory|Oxygen Device': v ? v.o2 : 'Room air', 'GI|Diet': S.diet(h), 'Musculoskeletal / Mobility|Ambulation': S.activity(h) });
  };
  S.assessLine = (section, label, h = ctx.nowH) => { const a = S.assess(h).get(`${section}|${label}`); return a ? a[2] : ''; };
  S.deviceActive = (word, h = ctx.nowH) => spec.devices.some(d => d.when !== false && new RegExp(word, 'i').test(d.type) && d.placeH <= h && (d.removeH === undefined || d.removeH > h));
  S.ioTotals = (h0, h1) => {
    const list = (S.io || []).filter(b => { const e = ctx.hOf(`${b.date} ${b.time.slice(5, 7)}:00`); return e > h0 && e <= h1 + 0.3; });
    return { intake: list.reduce((s, b) => s + b.intake, 0), output: list.reduce((s, b) => s + b.output, 0), n: list.length };
  };
  S.postopDay = h => {
    const s = S.surgery(h);
    if (!s) return null;
    const d1 = U.parse(U.dateOnly(ctx.ts(h)) + ' 00:00'), d0 = U.parse(U.dateOnly(ctx.ts(s.h)) + ' 00:00');
    return Math.round((d1 - d0) / 86400000);
  };
  S.surgery = h => spec.events.filter(e => e.type === 'surgery' && e.h + (e.duration || 1) <= h).slice(-1)[0] || null;
  return S;
}

function buildProblems(ctx, spec, stage) {
  const U = NS.util;
  const list = [{ id: `problem_${U.slug(spec.problem.name)}`, name: spec.problem.name, status: 'Active', details: stage.problem || spec.problem.details }];
  spec.extraProblems.forEach(p => {
    if (p.fromH !== undefined && ctx.nowH < p.fromH) return;
    const resolved = p.toH !== undefined && ctx.nowH >= p.toH;
    list.push({ id: `problem_${U.slug(p.name)}`, name: p.name, status: resolved ? 'Resolved' : (p.status || 'Active'), details: p.details || '' });
  });
  spec.comorb.forEach(c => list.push({ id: `problem_${U.slug(c.problem)}`, name: c.problem, status: 'Chronic', details: c.details || '' }));
  return list;
}

function fallRiskLevel(ctx, spec, prepared) {
  let score = 0;
  if (ctx.age >= 65) score += 1;
  if (ctx.age >= 80) score += 1;
  if (ctx.has('dementia')) score += 2;
  const fn = (ctx.social || {}).function;
  if (fn && fn !== 'Independent') score += 1;
  if (prepared.some(m => /^(opioid|benzodiazepine)/i.test(m.cls || '') && m.startH <= ctx.nowH && (m.stopH === undefined || m.stopH > ctx.nowH))) score += 1;
  if (spec.fallRiskBoost) score += spec.fallRiskBoost;
  return score >= 3 ? 'High' : score >= 1 ? 'Moderate' : 'Low';
}

function buildStickyNotes(ctx, spec, S, stage) {
  const U = NS.util, notes = [];
  (stage.stickies || []).forEach(s => notes.push(s));
  spec.stickies.forEach(s => { if (!s.fromH || ctx.nowH >= s.fromH) notes.push({ title: s.title, body: s.body }); });
  // What is about to happen this shift
  const upcoming = [];
  spec.events.filter(e => e.h > ctx.nowH && e.h <= ctx.windowEnd && ['surgery', 'procedure', 'consult', 'imaging', 'cardiology'].includes(e.type)).forEach(e => upcoming.push(`${U.hhmm(ctx.ts(e.h))} ${e.name || e.study || e.service}`));
  if (upcoming.length) notes.push({ title: 'Coming up this shift', body: upcoming.join('; ') + '.' });
  if (ctx.allergic('latex')) notes.push({ title: 'Latex allergy', body: 'Use latex-free supplies for all care.' });
  return notes.slice(0, 6);
}

function buildObjectives(ctx, spec, stage) {
  const o = [...(stage.objectives || []), ...(spec.objectives || [])];
  o.push('Connect assessment findings, labs and orders to prioritize nursing care.');
  o.push('Safely administer medications using the MAR and linked monitoring data.');
  return NS.util.uniq(o).slice(0, 6);
}

function buildSimTasks() { return []; }

function buildTimeline(ctx, spec, S, prepared, notes) {
  const U = NS.util, items = [];
  const day = h => Math.floor(h / 24) + 1;
  const add = (h, type, text) => { if (h <= ctx.windowEnd) items.push({ h, ts: ctx.ts(h), day: day(h), type, text, future: h > ctx.nowH }); };
  add(0, 'admit', `Arrives (${spec.chief})`);
  spec.events.forEach(e => add(e.h, e.type, e.label || e.name || e.study || e.service || e.text));
  prepared.filter(m => !m.prn && m.freq !== 'once' && m.startH >= 0.5 && !m.home).forEach(m => add(m.startH, 'med', `Start ${m.name} ${m.dose} ${m.route}`));
  prepared.filter(m => m.stopH !== undefined && !m.prn && !m.home).forEach(m => add(m.stopH, 'med', `Stop ${m.name}`));
  spec.orders.filter(o => ['Diet', 'Activity'].includes(o.category) && o.when !== false && o.startH > 0.5).forEach(o => add(o.startH, 'order', `${o.category}: ${o.name}`));
  spec.devices.filter(d => d.when !== false && !d.preexisting).forEach(d => { add(d.placeH, 'device', `Placed ${d.type}${d.location ? ' (' + d.location + ')' : ''}`); if (d.removeH !== undefined) add(d.removeH, 'device', `Removed ${d.type}`); });
  notes.forEach(n => { const h = ctx.hOf(n.datetime); add(h, 'note', `${n.title}`); });
  items.sort((a, b) => a.h - b.h);
  return items;
}

// When the hospital day is longer than typical, write a believable "medically ready but still here" stage.
function addProlongedStage(ctx, spec) {
  const typicalMax = spec.typicalLOS ? spec.typicalLOS[1] : 99;
  if (spec.noAutoProlonged || ctx.L <= typicalMax) return;
  const s = ctx.social || {}, fn = s.function || 'Independent', living = s.living || '';
  let barrier = 'safe discharge plan and home services';
  if (ctx.has('dementia') || /Skilled|Assisted/i.test(living)) barrier = 'return arrangements with the facility and 24-hour supervision';
  else if (fn === 'Walker' || fn === 'Wheelchair') barrier = 'a rehab bed / home health authorization for a patient who now needs more help than at baseline';
  else if (/alone/i.test(living)) barrier = 'home health services and a caregiver plan for a patient who lives alone';
  const from = typicalMax * 24 - 6;
  const last = spec.stages[spec.stages.length - 1] || {};
  if (last.fromH >= from) return;
  spec.stages.push({
    fromH: from, id: 'prolonged', label: 'Medically improved; discharge delayed',
    problem: `${spec.problem.name}: clinically improved; discharge delayed by ${barrier}.`,
    subj: `Feels better but weak and deconditioned. Remains in hospital while ${barrier} are arranged. No new fever, pain or respiratory symptoms.`,
    assess: 'Medically stable for discharge; the remaining stay is driven by functional status and discharge planning, not acute illness.',
    plan: ['Continue current treatment and complete any remaining antibiotic course.', 'Daily PT/OT; encourage out-of-bed to chair for meals and ambulation.', 'Case management arranging discharge services; family meeting scheduled.', 'Watch for hospital-acquired complications: delirium, pressure injury, CAUTI, C. difficile, falls, DVT.'],
    nursing: ['Patient medically stable; ambulating with assistance and eating well.', 'Encouraged mobility and out-of-bed meals; skin intact, turned as needed.', 'Discharge teaching started with patient and family; awaiting disposition.'],
    teach: ['Discharge medications and warning signs; fall prevention; when to call the provider.'],
    dispo: `Discharge delayed pending ${barrier}.`
  });
  spec.discharge = Object.assign({ barrier }, spec.discharge || {});
}

function dedupeById(list) {
  const seen = new Set();
  return list.filter(x => { if (seen.has(x.id)) return false; seen.add(x.id); return true; });
}
