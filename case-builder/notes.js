/* Note generators: every note is written from the timeline state, so it always agrees with the chart. */
NS.notes = (() => {
  const U = NS.util, E = NS.engine;

  function generate(ctx, spec, S) {
    const T = E.TEAM, notes = [];
    const tm = h => U.hhmm(ctx.ts(h));
    const when = h => U.epic(ctx.ts(h));
    const pt = ctx.name;
    const primaryTeam = spec.primaryTeam || 'hospitalist';
    const surgical = primaryTeam === 'surgeon';
    const physicianName = T[primaryTeam];
    const hospitalistCo = surgical && spec.comorb.length > 0;
    const add = n => {
      if (n.h === undefined || n.h > ctx.windowEnd) return;
      const datetime = ctx.ts(n.h);
      const note = { id: `note_${U.slug(n.title)}_${U.slug(datetime)}`, type: n.type, title: n.title, author: n.author, datetime, category: n.category || 'Progress Note', summary: n.summary || '', body: n.body };
      if (n.study) note.study = n.study;
      if (n.impression) note.impression = n.impression;
      if (n.dayTag) note.dayTag = n.dayTag;
      notes.push(note);
    };

    // ---------------------------------------------------------------- shared text blocks
    const sx = ctx.sex.toLowerCase();
    const demo = `${ctx.age}-year-old ${sx}`;
    const pmhLine = () => {
      const items = spec.comorb.map(c => c.pmh || c.problem);
      return items.length ? items.join('; ') : 'No significant past medical history.';
    };
    const SURG_NAMES = Object.fromEntries(NS.HX.SURGERIES);
    const pshLine = () => {
      const items = [...ctx.surg].map(k => `${SURG_NAMES[k] || k}${ctx.surgYear(k) ? ' (' + ctx.surgYear(k) + ')' : ''}`);
      (ctx.input.surgCustom || []).forEach(s => { const nm = String((s && s.name) || '').trim(); if (nm) items.push(`${nm}${s.year ? ' (' + s.year + ')' : ''}`); });
      const extra = (ctx.input.surgText || '').trim();
      if (extra) items.push(extra);
      return items.length ? items.join('; ') : 'No prior surgeries.';
    };
    const allergyLine = () => ctx.allergies.length ? ctx.allergies.map(a => `${a.substance} (${a.reaction || 'reaction not documented'})`).join('; ') : 'No known drug allergies.';
    const socialLine = () => {
      const s = ctx.social || {};
      const bits = [];
      if (s.living) bits.push(s.living.toLowerCase().replace(/^lives/, 'lives'));
      if (s.function) bits.push(s.function === 'Independent' ? 'independent with ADLs and ambulation at baseline' : `uses ${s.function.toLowerCase()} at baseline`);
      bits.push(`tobacco: ${(s.tobacco || 'never').toLowerCase()}`);
      bits.push(`alcohol: ${(s.alcohol || 'none').toLowerCase()}`);
      bits.push(`other substances: ${(s.drugs || 'none').toLowerCase()}`);
      if (s.other) bits.push(s.other);
      return U.cap(bits.join('; ')) + '.';
    };
    const famHx = () => `Mother with hypertension${ctx.has('dm2') ? ' and type 2 diabetes' : ''}; father with coronary artery disease. ${spec.famHxExtra || 'No known family history of bowel disease or cancer.'}`;
    const homeMedLines = () => {
      const home = spec.meds.filter(m => m.home && m.when !== false && !m.nonHome).map(m => `- ${m.name.replace(/ (tablet|capsule|injection)$/i, '')} ${m.dose} ${m.route}${m.freq && m.freq !== 'once' ? ' ' + (E.FREQ[m.freq]?.text || m.freq) : ''}`);
      (spec.heldHome || []).forEach(t => home.push(`- (${t})`));
      return home.length ? home : ['- None'];
    };
    const vitalsLine = set => set ? `T ${set.temp.toFixed(1)} F, HR ${set.hr}, BP ${set.sbp}/${set.dbp}, RR ${set.rr}, SpO2 ${set.spo2}% on ${set.o2.replace(/^Room air/, 'room air')}, pain ${set.pain}/10` : 'Not recorded';
    const rg = (a, b) => (a === b ? `${a}` : `${a}-${b}`);
    const rangeLine = r => r ? `Tmax ${r.temp[1].toFixed(1)} F; HR ${rg(r.hr[0], r.hr[1])}; BP ${rg(r.sbp[0], r.sbp[1])}/${rg(r.dbp[0], r.dbp[1])}; RR ${rg(r.rr[0], r.rr[1])}; SpO2 ${rg(r.spo2[0], r.spo2[1])}%; pain ${rg(r.pain[0], r.pain[1])}/10` : 'Vitals not available';
    const A = (h, s, l) => S.assessLine(s, l, h);
    const examLines = h => {
      const lines = [];
      lines.push(`- General: ${A(h, 'Neurologic', 'Level of Consciousness').toLowerCase().startsWith('alert') ? 'Awake and alert' : A(h, 'Neurologic', 'Level of Consciousness')}${S.vitalSet(h).pain >= 6 ? ', uncomfortable-appearing' : ', in no acute distress'}.`);
      lines.push(`- Cardiovascular: ${A(h, 'Cardiac', 'Rhythm')}; ${A(h, 'Cardiac', 'Heart Sounds')}. Edema: ${A(h, 'Cardiac', 'Edema')}.`);
      lines.push(`- Respiratory: ${A(h, 'Respiratory', 'Breath Sounds')}; ${A(h, 'Respiratory', 'Respiratory Effort').toLowerCase()}.`);
      lines.push(`- Abdomen: ${A(h, 'GI', 'Abdomen')}. Bowel sounds: ${A(h, 'GI', 'Bowel Sounds').toLowerCase()}.`);
      lines.push(`- Neurologic: ${A(h, 'Neurologic', 'Orientation')}.`);
      lines.push(`- Skin: ${A(h, 'Skin', 'Skin')}.`);
      return lines;
    };
    const labCodes = spec.keyLabs || ['WBC', 'Hemoglobin', 'Platelets', 'Sodium', 'Potassium', 'Creatinine', 'Glucose'];
    const labLine = (h, codes = labCodes) => codes.map(c => { const l = S.lab(c, h); if (!l) return null; const t = S.trend(c, h); return `${c} ${l.value}${l.flag ? ' (' + (/high/i.test(l.flag) ? 'H' : 'L') + ')' : ''}${t ? ' (' + t + ' ' + S.labPrev(c, h).value + ')' : ''}`; }).filter(Boolean).join('; ');
    const medsNow = h => {
      const sch = S.activeMeds(h).filter(m => !m.prn).map(m => `${m.name.replace(/ \(.*?\)/, '').replace(/ (tablet|capsule|injection|IVPB)$/i, '')} ${m.dose} ${m.route}`);
      const prn = S.activeMeds(h).filter(m => m.prn).map(m => m.name.replace(/ \(.*?\)/, '').replace(/ (tablet|capsule|injection|nebulizer solution)$/i, ''));
      return { sch, prn };
    };
    const dayNum = h => Math.floor(h / 24) + 1 - (U.parse(ctx.admit) % 86400000 / 3600000 > 0 ? 0 : 0);
    const hospDay = h => Math.floor((U.parse(U.dateOnly(ctx.ts(h)) + ' 00:00') - U.parse(U.dateOnly(ctx.admit) + ' 00:00')) / 86400000) + 1;
    const podTag = h => { const p = S.postopDay(h); return p === null ? '' : ` | POD ${p}`; };

    // ---------------------------------------------------------------- ED note
    const edH = 2.3;
    {
      const stage0 = E.stageAt(spec, 0);
      const edMeds = S.prepared.filter(m => m.startH < 3 && !m.home).map(m => {
        const doses = m.prn ? (m.prnGiven || []).filter(x => x < 3) : (m.startH < 3 ? [m.startH] : []);
        return doses.length ? { h: doses[0], text: `- ${tm(doses[0])} ${m.name.replace(/ (tablet|injection|IVPB)$/i, '')} ${m.dose} ${m.route}` } : null;
      }).filter(Boolean).sort((a, b) => a.h - b.h).map(x => x.text);
      const imaging = spec.events.filter(e => e.type === 'imaging' && e.h < 3).map(e => `- ${e.study}: ${e.impression}`);
      const edLabs = labLine(0.5, ['WBC', 'Hemoglobin', 'Sodium', 'Potassium', 'Creatinine', 'Glucose', 'Lactate', 'CRP', 'BNP', 'Troponin I', 'Lipase'].filter(c => S.lab(c, 3)));
      add({
        h: edH, type: 'erVisitSummary', title: 'ED Provider Note', author: T.ed, category: 'ED Note',
        summary: `${demo} presenting with ${spec.chief.toLowerCase()}; admitted to ${surgical ? 'General Surgery' : 'Hospital Medicine'}.`,
        body: [
          `**Chief complaint**`, `- ${spec.chief}`, '',
          '**HPI**', spec.hpi, '',
          '**Past medical / surgical history**', `- Medical: ${pmhLine()}`, `- Surgical: ${pshLine()}`, '',
          '**Allergies**', `- ${allergyLine()}`, '',
          '**Social history**', `- ${socialLine()}`, '',
          '**Triage vitals**', `- ${vitalsLine(S.vitalSet(0.1))}`, '',
          '**Exam**', ...examLines(0.5), '',
          '**ED results**', `- Labs: ${edLabs || 'pending'}`, ...(imaging.length ? imaging : []), '',
          '**ED course**', ...(edMeds.length ? edMeds : ['- Supportive care.']), '',
          '**Assessment / disposition**', `- ${spec.problem.name}. ${stage0.assess || ''}`, `- Admit to ${surgical ? 'General Surgery (Dr. ' + T.surgeon.split(',')[0] + ')' : 'Hospital Medicine (Dr. ' + T.hospitalist.split(',')[0] + ')'}; condition guarded but stable.`
        ].join('\n')
      });
    }

    // ---------------------------------------------------------------- H&P (surgery H&P or hospitalist H&P)
    {
      const h = surgical ? 2.7 : 3.5;
      const st = E.stageAt(spec, h);
      const problems = [{ name: spec.problem.name, plan: st.plan || [], assess: st.assess }];
      const body = [
        '**Chief complaint**', `- ${spec.chief}`, '',
        '**History of present illness**', spec.hpi, '',
        '**Past medical history**', `- ${pmhLine()}`, '',
        '**Past surgical history**', `- ${pshLine()}`, '',
        '**Home medications**', ...homeMedLines(), '',
        '**Allergies**', `- ${allergyLine()}`, '',
        '**Family history**', `- ${famHx()}`, '',
        '**Social history**', `- ${socialLine()}`, '',
        '**Review of systems**', `- ${spec.ros || 'Pertinent positives and negatives as in the HPI; all other systems reviewed and negative.'}`, '',
        '**Vitals**', `- ${vitalsLine(S.vitalSet(h))} | Wt ${ctx.weightKg} kg, BMI ${ctx.bmi}`, '',
        '**Physical exam**', ...examLines(Math.min(h, 3)), '',
        '**Data**', `- Labs: ${labLine(h, spec.hpLabs || labCodes)}`, ...spec.events.filter(e => (e.type === 'imaging' || e.type === 'cardiology') && e.h <= h).map(e => `- ${e.study}: ${e.impression}`), '',
        '**Assessment and plan**',
        `${demo} with ${pmhLine().toLowerCase() === 'no significant past medical history.' ? 'no significant history' : 'a history of ' + spec.comorb.map(c => c.problem.toLowerCase()).join(', ')} admitted with ${spec.problem.name.toLowerCase()}.`, '',
        `**${spec.problem.name}**`, ...(st.assess ? [`- ${st.assess}`] : []), ...(st.plan || []).map(p => `- ${p}`), ''
      ];
      spec.comorb.forEach(c => { body.push(`**${c.problem}**`); c.plan(ctx, S, h).forEach(p => body.push(`- ${p}`)); body.push(''); });
      body.push('**Prophylaxis / code status**', '- DVT prophylaxis per orders; fall precautions.', `- Code status: ${ctx.input.codeStatus || 'Full Code'}.`);
      add({
        h, type: 'hp', title: surgical ? 'General Surgery H&P / Consult' : 'Hospitalist History and Physical', author: physicianName, category: 'H&P',
        summary: `Admission H&P for ${spec.problem.name.toLowerCase()}.`, body: body.join('\n')
      });
    }

    // ---------------------------------------------------------------- Imaging / cardiology / consults / procedures / operation
    spec.events.forEach(e => {
      const reported = e.h + 0.6;
      if (e.type === 'imaging') {
        add({
          h: reported, type: 'imaging', title: e.study, author: T.radiology, category: 'Radiology Report', study: e.study, impression: e.impression, summary: e.impression,
          body: [`**Indication**`, `- ${e.indication || 'Clinical evaluation'}`, '', '**Technique**', `- ${e.study}${e.contrast ? (e.premed ? '; contrast given after allergy premedication' : '') : ''}.`, '', '**Findings**', e.findings || '', '', '**Impression**', `- ${e.impression}`].join('\n')
        });
      } else if (e.type === 'cardiology') {
        add({
          h: reported, type: 'cardiology', title: e.study, author: T.cardiology, category: 'Cardiology', study: e.study, impression: e.impression, summary: e.impression,
          body: [`**Indication**`, `- ${e.indication || 'Evaluation'}`, '', '**Findings**', e.findings || e.impression, '', '**Impression**', `- ${e.impression}`].join('\n')
        });
      } else if (e.type === 'surgery') {
        const end = e.h + e.duration;
        add({
          h: end + 0.4, type: 'progressNotes', title: 'Brief Operative Note', author: T.surgeon, category: 'Operative Note',
          summary: `${e.name}: ${e.complications === 'None' ? 'no complications' : e.complications}; to ${e.disposition}.`,
          body: ['**Pre-operative diagnosis**', `- ${e.indication}`, '', '**Post-operative diagnosis**', `- ${e.indication}${/perforat/i.test(e.findings) ? ' (perforated)' : ''}`, '', '**Procedure**', `- ${e.name}`, '', '**Surgeon / anesthesia**', `- ${T.surgeon}; ${e.anesthesia}`, '', '**Findings**', `- ${e.findings}`, '', '**Description**', e.procedure || '', '', '**EBL / fluids**', `- EBL ${e.ebl}; IV fluids ${e.fluids}`, '', '**Specimens**', `- ${e.specimens}`, '', '**Complications**', `- ${e.complications}`, '', '**Disposition**', `- ${e.disposition}; stable.`].join('\n')
        });
        // PACU nursing note
        const pv = S.vitalSet(end + 0.5);
        add({
          h: end + 1.2, type: 'progressNotes', title: 'PACU Nursing Note', author: T.rnDay, category: 'Nursing Note',
          summary: 'Recovered from anesthesia; criteria met for transfer to the unit.',
          body: ['**PACU course**', `- Arrived in PACU at ${tm(end + 0.1)} after ${e.name.toLowerCase()} under ${e.anesthesia.toLowerCase()} anesthesia.`, `- Vitals on arrival: ${vitalsLine(S.vitalSet(end + 0.1))}.`, '- Airway patent, extubated, awakens to voice; Aldrete score 9 at discharge from PACU.', '- Pain treated with IV opioid; nausea treated with ondansetron.', `- Transferred to the surgical unit at ${tm(end + 1.2)}; report given to unit RN. Vitals at transfer: ${vitalsLine(pv)}.`].join('\n')
        });
      } else if (e.type === 'consult' && e.service !== 'General Surgery') {
        add({
          h: e.h, type: 'progressNotes', title: `${e.service} Consult`, author: T[e.author] || e.author || T.hospitalist, category: 'Consult',
          summary: e.label || `${e.service} consult.`, body: ['**Reason for consult**', `- ${e.reason}`, '', '**Recommendations**', `- ${e.recommendation || 'See orders.'}`].join('\n')
        });
      } else if (e.type === 'procedure') {
        if (e.dialysis) {
          const start = e.h, end = e.h + e.duration;
          add({
            h: end + 0.2, type: 'progressNotes', title: 'Hemodialysis Treatment Note', author: 'Dialysis RN (Inpatient Dialysis Unit)', category: 'Procedure Note',
            summary: `Hemodialysis completed; ${e.ufRemoved} mL removed.`,
            body: ['**Treatment**', `- Hemodialysis ${tm(start)}-${tm(end)} (${e.duration} hours) via left upper arm AV fistula; two 15-gauge needles, good flows.`, `- Pre: BP ${S.vitalSet(start - 0.2).sbp}/${S.vitalSet(start - 0.2).dbp}, HR ${S.vitalSet(start - 0.2).hr}; weight above dry weight.`, `- Ultrafiltration goal and removed: ${e.ufRemoved} mL. Heparin per protocol.`, '- Tolerated well without cramping or hypotension; needles removed, hemostasis achieved in 10 minutes, fistula thrill present.', '', '**Post-treatment**', '- Post-dialysis weight recorded. Give renal vitamin and hold antihypertensives if SBP below 100.'].join('\n')
          });
        } else {
          add({
            h: e.h + e.duration + 0.3, type: 'progressNotes', title: e.name, author: T[e.by] || e.by, category: 'Procedure Note', summary: e.label || e.name,
            body: ['**Procedure**', `- ${e.name}`, '', '**Indication**', `- ${e.indication || spec.problem.name}`, '', '**Findings / technique**', e.findings || '', '', '**Complications**', '- None apparent. Patient tolerated the procedure; post-procedure vitals stable.'].join('\n')
          });
        }
      }
    });

    // ---------------------------------------------------------------- Daily physician progress notes
    const nDays = ctx.L;
    for (let d = 2; d <= nDays + 0; d++) {
      const dayStartH = (U.parse(U.dateOnly(ctx.admit) + ' 00:00') + (d - 1) * 86400000 - U.parse(ctx.admit)) / 3600000;
      const h = dayStartH + 8.5;                      // 08:30 rounds
      if (h < 12) continue;
      const hh = Math.min(h, ctx.windowEnd);
      const st = E.stageAt(spec, h - 0.5);
      const prevH = h - 24;
      const range = S.vitalRange(h - 24, h - 0.4);
      const io = S.ioTotals(h - 24, h - 0.4);
      const newEvents = spec.events.filter(e => (e.type === 'imaging' || e.type === 'procedure' || e.type === 'surgery') && e.h > prevH && e.h <= h - 0.4);
      const eventLine = e => e.type === 'imaging' ? `- ${e.study}: ${e.impression}` : e.type === 'surgery' ? `- ${e.name} performed ${U.epic(ctx.ts(e.h))}: ${e.findings}` : `- ${e.name} (${U.epic(ctx.ts(e.h))}): ${e.findings ? e.findings.split('.')[0] + '.' : 'completed'}`;
      const m = medsNow(h - 0.5);
      const body = [
        `**Hospital Day ${hospDay(h)}${podTag(h - 0.5)}**`, '',
        '**Interval events / subjective**', st.subj || 'No acute events overnight.', ...newEvents.map(eventLine), '',
        '**Objective**', `- Vitals (24 h): ${rangeLine(range)}`, `- Current: ${vitalsLine(S.vitalSet(h - 0.5))}`, ...(io.n ? [`- I&O (24 h): in ${io.intake} mL / out ${io.output} mL`] : []), `- Diet: ${S.diet(h - 0.5)}; Activity: ${S.activity(h - 0.5)}`, '',
        '**Exam**', ...examLines(h - 0.5), '',
        '**Labs**', `- ${labLine(h - 0.5)}`, '',
        '**Medications**', `- Scheduled: ${m.sch.slice(0, 10).join('; ') || 'none'}`, `- PRN: ${m.prn.join('; ') || 'none'}`, '',
        '**Assessment and plan**', `${demo}, hospital day ${hospDay(h)}${podTag(h - 0.5)}.`, '',
        `**${spec.problem.name}**`, ...(st.assess ? [`- ${st.assess}`] : []), ...(st.plan || []).map(p => `- ${p}`), ''
      ];
      spec.extraProblems.filter(p => (p.fromH === undefined || h >= p.fromH) && !(p.toH !== undefined && h >= p.toH)).forEach(p => { body.push(`**${p.name}**`, `- ${p.details}`, ''); });
      spec.comorb.forEach(c => { body.push(`**${c.problem}**`); c.plan(ctx, S, h - 0.5).forEach(p => body.push(`- ${p}`)); body.push(''); });
      body.push('**Disposition**', `- ${st.dispo || 'Continue inpatient care.'}`, `- Code status: ${ctx.input.codeStatus || 'Full Code'}.`);
      add({ h: hh === h ? h : h, type: 'progressNotes', title: surgical ? 'Surgery Progress Note' : 'Hospitalist Progress Note', author: physicianName, category: 'Progress Note', summary: `Hospital day ${hospDay(h)}${podTag(h - 0.5)}: ${st.label}.`, body: body.join('\n') });
    }

    // Hospitalist co-management for a surgical patient with chronic conditions
    if (hospitalistCo) {
      const h = 4.5;
      const body = ['**Reason for consult**', `- Medical co-management of chronic conditions during admission for ${spec.problem.name.toLowerCase()}.`, '', '**Assessment and plan**'];
      spec.comorb.forEach(c => { body.push(`**${c.problem}**`); c.plan(ctx, S, h).forEach(p => body.push(`- ${p}`)); body.push(''); });
      body.push('**Peri-operative risk**', `- ${ctx.age >= 65 || spec.comorb.length >= 2 ? 'Intermediate' : 'Low'} cardiopulmonary risk; proceed with surgery as planned. Optimize glucose, continue beta blocker, hold anticoagulant and nephrotoxins.`);
      add({ h, type: 'progressNotes', title: 'Hospitalist Medical Co-management Consult', author: T.hospitalist, category: 'Consult', summary: 'Medical co-management of chronic conditions peri-operatively.', body: body.join('\n') });
      for (let d = 2; d <= nDays; d++) {
        const dayStartH = (U.parse(U.dateOnly(ctx.admit) + ' 00:00') + (d - 1) * 86400000 - U.parse(ctx.admit)) / 3600000, hc = dayStartH + 10.5;
        if (hc < 12 || d < nDays - 2) continue;
        const b = ['**Interval**', '- No acute medical events; surgical team managing the primary problem.', '', '**Assessment and plan**'];
        spec.comorb.forEach(c => { b.push(`**${c.problem}**`); c.plan(ctx, S, hc - 0.5).forEach(p => b.push(`- ${p}`)); b.push(''); });
        add({ h: hc, type: 'progressNotes', title: 'Hospitalist Co-management Progress Note', author: T.hospitalist, category: 'Progress Note', summary: `Medical co-management, hospital day ${hospDay(hc)}.`, body: b.join('\n') });
      }
    }

    // ---------------------------------------------------------------- Nursing notes
    const nursingNote = (h, isNight) => {
      const st = E.stageAt(spec, h);
      const range = S.vitalRange(h - 12, h);
      const io = S.ioTotals(h - 12, h);
      const prnGiven = S.prepared.filter(m => m.prn).flatMap(m => (m.prnGiven || []).filter(x => x > h - 12 && x <= h && x >= m.startH).map(x => `${tm(x)} ${m.name.replace(/ \(.*?\)/, '').replace(/ (tablet|injection|nebulizer solution)$/i, '')} ${m.dose} ${m.route}`));
      const g = (s, l) => A(h, s, l);
      const lines = [
        `**Shift summary (${isNight ? 'night' : 'day'} shift, hospital day ${hospDay(h)}${podTag(h)})**`,
        `- Neuro: ${g('Neurologic', 'Orientation')}. Pain: ${S.vitalSet(h).pain}/10${g('Pain', 'Pain Location') && g('Pain', 'Pain Location') !== 'None' ? ' (' + g('Pain', 'Pain Location').toLowerCase() + ')' : ''}.`,
        `- Cardiac: ${g('Cardiac', 'Rhythm')}; edema: ${g('Cardiac', 'Edema').toLowerCase()}. Vitals this shift: ${rangeLine(range)}.`,
        `- Respiratory: ${g('Respiratory', 'Breath Sounds')}; ${S.vitalSet(h).o2.replace(/^Room air/, 'room air')}, SpO2 ${S.vitalSet(h).spo2}%.`,
        `- GI: ${g('GI', 'Abdomen')}; diet ${S.diet(h)}; nausea/vomiting: ${g('GI', 'Nausea / Vomiting').toLowerCase()}.`,
        `- GU: ${g('GU', 'Urinary Elimination')}.${io.n ? ` I&O this shift: in ${io.intake} mL, out ${io.output} mL.` : ''}`,
        `- Skin / lines: ${g('Skin', 'Skin')}. ${S.devicesAll.map(d => `${d.type} (${d.location}): ${d.status.toLowerCase()}`).join('; ')}.`,
        `- Mobility / safety: ${S.activity(h)}; ${g('Safety', 'Fall Precautions')}.`, '',
        '**Events and interventions**', ...(st.nursing || []).map(x => `- ${x}`), ...(prnGiven.length ? [`- PRN medications this shift: ${prnGiven.join('; ')}.`] : []), '',
        '**Education**', ...(st.teach || []).map(x => `- ${x}`), '',
        '**Plan / handoff**', `- Activity: ${S.activity(h).toLowerCase()}. ${st.dispo || 'Continue current plan.'}`, '- Call light within reach; bed alarm per fall risk.'
      ];
      add({ h, type: 'progressNotes', title: 'Nursing Progress Note', author: isNight ? T.rnNight : T.rnDay, category: 'Nursing Note', summary: `${isNight ? 'Night' : 'Day'} shift summary: ${st.label}.`, body: lines.join('\n') });
    };
    {
      const admitBody = [
        '**Admission assessment**', `- Arrived to the unit at ${tm(3.0)} from the ED. ID band and allergy band verified (${allergyLine()}).`, `- Vitals on arrival: ${vitalsLine(S.vitalSet(3.2))}.`, ...examLines(3.5).map(l => l.replace('- ', '- ')),
        `- Pain ${S.vitalSet(3.2).pain}/10; ${A(3.5, 'Pain', 'Pain Location').toLowerCase()}.`, `- Skin: ${A(3.5, 'Skin', 'Skin')}. Braden ${A(3.5, 'Skin', 'Braden Score')}.`, `- Fall risk: ${S.encounter.fallRisk}; fall precautions in place.`, `- Lines: ${S.devicesAll.filter(d => ctx.hOf(d.placementDate) <= 3.6).map(d => `${d.type} ${d.location}`).join('; ') || 'none'}.`, '', '**Education**', '- Oriented to room, call light, plan of care, and fall precautions.', '', '**Plan**', ...(E.stageAt(spec, 3.6).nursing || []).map(x => `- ${x}`)
      ];
      add({ h: 3.6, type: 'progressNotes', title: 'Nursing Admission Note', author: T.rnDay, category: 'Nursing Note', summary: 'Admission database and baseline assessment completed.', body: admitBody.join('\n') });
      // shift notes: day shift ends 18:45, night shift ends 06:45
      const times = [];
      const admitMs = U.parse(ctx.admit), base = new Date(admitMs); base.setUTCHours(0, 0, 0, 0);
      for (let d = 0; d <= Math.ceil(ctx.nowH / 24) + 1; d++) {
        [[6.75, true], [18.75, false]].forEach(([hr, night]) => {
          const h = (base.getTime() + d * 86400000 + hr * 3600000 - admitMs) / 3600000;
          if (h > 6 && h <= ctx.nowH + 0.5) times.push([h, night]);
        });
      }
      times.filter(([h]) => h >= ctx.nowH - 48 || U.parse(ctx.ts(h)) % 86400000 > 12 * 3600000).filter(([h]) => h >= ctx.nowH - 120).forEach(([h, night]) => nursingNote(h, night));
    }

    // ---------------------------------------------------------------- Respiratory therapy
    if (spec.rt || ['pneumonia', 'copd_exac', 'chf'].includes(ctx.input.primary)) {
      const rtDay = h => {
        const st = E.stageAt(spec, h), v = S.vitalSet(h);
        const nebs = S.prepared.filter(m => m.route === 'Nebulized' && !m.prn && m.startH <= h);
        const lastNebs = nebs.length ? `${nebs[0].name.replace(/ \(.*?\)/, '')} ${nebs[0].dose} ${(E.FREQ[nebs[0].freq] || {}).text || ''}` : 'none ordered';
        add({
          h, type: 'therapyNotes', title: 'Respiratory Therapy Note', author: T.rt, category: 'Respiratory Therapy',
          summary: `RT assessment: ${v.o2}, SpO2 ${v.spo2}%.`,
          body: ['**Assessment**', `- O2 therapy: ${v.o2}; SpO2 ${v.spo2}%; RR ${v.rr}.`, `- Breath sounds: ${A(h, 'Respiratory', 'Breath Sounds')}. Work of breathing: ${A(h, 'Respiratory', 'Respiratory Effort').toLowerCase()}.`, `- Cough: ${A(h, 'Respiratory', 'Cough') || 'non-productive'}.`, A(h, 'Respiratory', 'Incentive Spirometer') ? `- Incentive spirometer: ${A(h, 'Respiratory', 'Incentive Spirometer')}.` : null, '', '**Treatments**', `- Scheduled nebulizer: ${lastNebs}; tolerated, no adverse effects.`, '', '**Plan**', `- ${ctx.has('copd') || spec.primaryKey === 'copd_exac' ? 'Titrate O2 to SpO2 88-92%; continue nebulizers; reinforce inhaler technique and pursed-lip breathing.' : 'Wean O2 as tolerated to keep SpO2 92% or higher; encourage incentive spirometry and deep breathing.'}`].filter(l => l !== undefined && l !== null).join('\n')
        });
      };
      rtDay(4.2);
      const admitMs = U.parse(ctx.admit), base = new Date(admitMs); base.setUTCHours(0, 0, 0, 0);
      for (let d = 1; d <= Math.ceil(ctx.nowH / 24) + 1; d++) {
        const h = (base.getTime() + d * 86400000 + 8.2 * 3600000 - admitMs) / 3600000;
        if (h <= ctx.windowEnd && h >= ctx.nowH - 72) rtDay(h);
      }
    }

    // ---------------------------------------------------------------- PT / OT / SLP / RD / CM
    const fn = (ctx.social || {}).function || 'Independent';
    const living = (ctx.social || {}).living || 'Lives with spouse/partner';
    const needsTherapy = spec.therapy ? spec.therapy.pt !== false : (ctx.age >= 65 || fn !== 'Independent' || ctx.has('dementia') || spec.primaryKey === 'stroke' || surgical);
    const therapyStart = spec.therapy && spec.therapy.fromH !== undefined ? spec.therapy.fromH : (surgical ? 29 : 30);
    if (needsTherapy) {
      const assistFor = h => (spec.therapy && spec.therapy.assist ? spec.therapy.assist(h) : (h < therapyStart + 12 ? 'minimal assist' : 'supervision / standby assist'));
      const gait = h => (spec.therapy && spec.therapy.gait ? spec.therapy.gait(h) : (h < therapyStart + 24 ? '75 feet with rolling walker' : '150 feet without device'));
      const rec = spec.therapy && spec.therapy.rec ? spec.therapy.rec : (ctx.has('dementia') || fn === 'Walker' || fn === 'Wheelchair' || ctx.age >= 80 ? 'Home with home health PT and 24-hour supervision, or short-term rehab if goals not met' : 'Home with outpatient follow-up; no equipment needs');
      add({
        h: therapyStart, type: 'therapyNotes', title: 'Physical Therapy Initial Evaluation', author: T.pt, category: 'Physical Therapy',
        summary: `PT evaluation: ${assistFor(therapyStart)}; ${gait(therapyStart)}.`,
        body: ['**Prior level of function**', `- ${living}; ${fn === 'Independent' ? 'independent with mobility and ADLs, no device' : 'uses ' + fn.toLowerCase() + ' for mobility'}.`, '', '**Current status**', `- Bed mobility and transfers: ${assistFor(therapyStart)}.`, `- Gait: ${gait(therapyStart)}; steady with no loss of balance.`, `- Vitals with activity: ${vitalsLine(S.vitalSet(therapyStart))}; tolerated well.`, `- Pain: ${S.vitalSet(therapyStart).pain}/10 with movement.`, '', '**Assessment**', `- Decreased mobility and endurance related to acute illness${surgical ? ' and recent surgery' : ''}; good rehab potential.`, '', '**Plan / recommendation**', `- PT daily while inpatient; progress gait and stairs.`, `- Discharge recommendation: ${rec}.`].join('\n')
      });
      add({
        h: therapyStart + 1.5, type: 'therapyNotes', title: 'Occupational Therapy Initial Evaluation', author: T.ot, category: 'Occupational Therapy',
        summary: 'OT evaluation: ADL and cognitive screen.',
        body: ['**Prior level of function**', `- ${living}; ${fn === 'Independent' ? 'independent with ADLs and IADLs' : 'needs assistance with some ADLs, uses ' + fn.toLowerCase()}.`, '', '**Current status**', `- Grooming and upper-body dressing: set-up / supervision. Lower-body dressing and toileting: ${therapyStart < 40 ? 'minimal assist' : 'supervision'}.`, `- Cognition: ${A(therapyStart, 'Neurologic', 'Orientation')}.`, '', '**Plan**', '- OT 3-5x/week; energy conservation and ADL retraining; reassess equipment needs.'].join('\n')
      });
      for (let d = 1; d <= 6; d++) {
        const h = therapyStart + 24 * d + 1;
        if (h <= ctx.windowEnd && h >= ctx.nowH - 56) add({ h, type: 'therapyNotes', title: 'Physical Therapy Treatment Note', author: T.pt, category: 'Physical Therapy', summary: `PT treatment: ${gait(h)}.`, body: ['**Session**', `- Therapeutic exercise, gait and transfer training; ${assistFor(h)} for transfers.`, `- Gait ${gait(h)}; vitals stable with activity (${vitalsLine(S.vitalSet(h - 0.3))}).`, '', '**Progress / plan**', '- Progressing toward discharge goals; continue daily PT.'].join('\n') });
      }
    }
    if (spec.slp) {
      const h = spec.slp.h;
      add({
        h, type: 'therapyNotes', title: 'Speech-Language Pathology Bedside Swallow Evaluation', author: T.slp, category: 'Speech-Language Pathology',
        summary: spec.slp.summary, body: spec.slp.body(ctx, S).join('\n')
      });
    }
    // Registered dietitian
    const rdNeeded = ctx.renal !== 'none' || ctx.has('dm2') || ctx.has('hf') || ctx.L >= 3 || spec.primaryKey === 'stroke';
    if (rdNeeded && ctx.nowH + 8 >= 32) {
      const h = 33;
      const kcal = `${Math.round(ctx.weightKg * 25 / 50) * 50}-${Math.round(ctx.weightKg * 30 / 50) * 50}`;
      const prot = ctx.renal === 'esrd' ? `${Math.round(ctx.weightKg * 1.2)}-${Math.round(ctx.weightKg * 1.3)}` : `${Math.round(ctx.weightKg * 1.0)}-${Math.round(ctx.weightKg * 1.2)}`;
      add({
        h, type: 'therapyNotes', title: 'Registered Dietitian Nutrition Assessment', author: T.rd, category: 'Nutrition',
        summary: `Nutrition assessment: ${S.diet(h)}.`,
        body: ['**Assessment**', `- Ht ${ctx.heightCm} cm, Wt ${ctx.weightKg} kg, BMI ${ctx.bmi}.`, `- Current diet: ${S.diet(h)}. Intake: ${S.flag('npo', h) ? 'NPO' : 'fair, about 50-75% of meals'}.`, `- Pertinent labs: ${labLine(h, ['Sodium', 'Potassium', 'Glucose', 'Creatinine', 'Albumin', 'Phosphorus'].filter(c => S.lab(c, h)))}.`, '', '**Estimated needs**', `- Energy ${kcal} kcal/day; protein ${prot} g/day; fluid ${spec.fluidRestrict || 'per medical team'}.`, '', '**Recommendations**', `- Continue ${S.diet(h)}; encourage protein at each meal; oral supplement if intake stays below 50%.`, `- ${ctx.has('dm2') ? 'Consistent carbohydrate teaching; ' : ''}${ctx.renal !== 'none' ? 'Renal diet teaching (sodium, potassium, phosphorus); ' : ''}${ctx.has('hf') ? '2 g sodium teaching; ' : ''}follow up in 3-4 days.`].join('\n')
      });
    }
    // Case management
    if (ctx.nowH + 8 >= 32 && ctx.L >= 2) {
      const insurance = ctx.age >= 65 ? 'Medicare with supplemental plan' : 'Commercial insurance';
      const barriers = [];
      if (/alone/i.test(living)) barriers.push('lives alone with limited help at home');
      if (fn !== 'Independent') barriers.push(`uses ${fn.toLowerCase()} at baseline`);
      if (ctx.has('dementia')) barriers.push('cognitive impairment; needs 24-hour supervision');
      if (/Current/i.test((ctx.social || {}).tobacco || '')) barriers.push('current tobacco use (cessation resources offered)');
      if (/Heavy/i.test((ctx.social || {}).alcohol || '')) barriers.push('heavy alcohol use (outpatient treatment resources offered)');
      const prolonged = ctx.L > spec.typicalLOS[1];
      const dispo = spec.discharge && spec.discharge.dispo ? spec.discharge.dispo(ctx)
        : /Skilled/i.test(living) ? 'Return to the skilled nursing facility with therapy'
        : /Assisted/i.test(living) ? 'Return to assisted living with therapy'
        : ctx.has('dementia') ? 'Short-term rehab/skilled nursing facility, or home only with a 24-hour caregiver (family meeting needed)'
        : (fn === 'Walker' || fn === 'Wheelchair' || (/alone/i.test(living) && ctx.age >= 75)) ? 'Home with home health (RN/PT/OT) or short-term rehab'
        : 'Home with self-care';
      add({
        h: 34, type: 'caseManagement', title: 'Case Management Initial Assessment', author: T.cm, category: 'Case Management',
        summary: `Anticipated discharge: ${dispo}.`,
        body: ['**Social situation**', `- ${living}. Insurance: ${insurance}. Transportation: family/self.`, `- Prior function: ${fn === 'Independent' ? 'independent' : fn.toLowerCase()}.`, '', '**Barriers**', ...(barriers.length ? barriers.map(b => `- ${b}`) : ['- None identified.']), '', '**Anticipated discharge plan**', `- ${dispo}.`, `- Estimated discharge: ${prolonged ? 'delayed; reassess daily' : spec.discharge && spec.discharge.estimate ? spec.discharge.estimate : 'within the next 1-3 days'}.`, '', '**Plan**', '- Follow daily for medical readiness, therapy recommendations and equipment/home health needs.'].join('\n')
      });
      if (prolonged && ctx.nowH >= 8 * 24) add({ h: 24 * Math.floor(ctx.nowH / 24) + 4, type: 'caseManagement', title: 'Case Management Follow-up', author: T.cm, category: 'Case Management', summary: 'Discharge barrier follow-up.', body: ['**Update**', `- Patient remains in hospital day ${ctx.L}; ${spec.discharge && spec.discharge.barrier ? spec.discharge.barrier : 'discharge delayed pending placement/home services'}.`, '- Following daily; family updated.'].join('\n') });
    }
    return notes;
  }

  return { generate };
})();
