/* NursingSim - patient communication and teaching practice (v28). No AI and no internet needed.
   The student teaches the simulated patient one topic that comes from the chart (a medication, the diagnosis, falls, pain).
   The conversation is scripted and branching: at each step the patient says something and the student chooses what to say.
   Steps: 1 acknowledge feelings, 2 explain why in plain language, 3 pick the teaching points, 4 answer a misunderstanding, 5 use teach-back,
   6 write the education note (scored by keywords). Feedback explains the best answer. Attempts are saved with the patient.
   Depends on app.js globals: currentCanonicalCase, simulationTime, getVisibleCanonicalCase, safe, escapeHtml, epicDate, persistCase, and on DrugGuide (druginfo.js). */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const uniq = a => Array.from(new Set(a));
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  let seed = 7; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  // ------------------------------------------------------------------ topics tied to diagnoses (teaching points are the "must teach" list)
  const TOPICS = [
    { id: 'hf', match: /heart failure|chf|cardiomyopathy|hfref|hfpef/i, title: 'Living with heart failure', plain: 'Your heart is not pumping as strongly as it should, so fluid backs up in your lungs and legs. Weighing yourself and watching salt help us catch fluid early.', jargon: 'You have decreased ejection fraction with volume overload, so we manage preload with diuretics and sodium restriction.', need: 'daily weights and a low-salt diet',
      points: [['Weigh yourself every morning after you urinate and before you eat, on the same scale', /weigh|scale/], ['Call if you gain 3 pounds in a day or 5 pounds in a week', /3 ?(lb|pound)|5 ?(lb|pound)|gain/], ['Limit salt (about 2 grams of sodium a day) and read food labels', /salt|sodium|label/], ['Report more swelling, shortness of breath, or needing more pillows to sleep', /swell|short|breath|pillow|edema/]],
      misc: ['"I feel fine, so I don\'t think I need to weigh myself or take the water pill every day."', 'Weight gain and swelling often show up before you feel short of breath. Daily weights and the water pill keep fluid from building up again.'] },
    { id: 'copd', match: /copd|asthma|emphysema|chronic bronchitis|respiratory failure/i, title: 'Breathing, inhalers and action plan', plain: 'Your airways are narrowed and swollen. Inhalers open them up or calm the swelling, and using them the right way gets the medicine to your lungs.', jargon: 'You have obstructive airflow limitation, so you need a LABA/LAMA and an ICS with a rescue SABA.', need: 'how and when to use inhalers',
      points: [['Use the rescue inhaler for sudden shortness of breath and the daily (controller) inhaler every day even when you feel well', /rescue|controller|daily|every day/], ['Use a spacer, breathe in slowly, hold your breath for about 10 seconds, and rinse your mouth after a steroid inhaler', /spacer|hold|rinse|slow/], ['Use pursed-lip breathing and rest between activities', /pursed|lip|pace|rest/], ['Call if you need the rescue inhaler more often, have more coughing or sputum, or the sputum changes color', /call|more often|sputum|color|worse/]],
      misc: ['"I only use the puffer when I feel bad, so I don\'t need the daily one."', 'The daily inhaler works like a shield and only works if you use it every day, even on good days. The rescue inhaler is for sudden symptoms.'] },
    { id: 'dm', match: /diabet|dka|hhs|hyperglyc|hypoglyc/i, title: 'Managing blood sugar and insulin', plain: 'Your body cannot use sugar well, so we check your blood sugar and use medicine or insulin to keep it in a safe range.', jargon: 'You have impaired insulin signaling and need basal-bolus titration to lower your HbA1c.', need: 'blood sugar checks and low-sugar treatment',
      points: [['Check your blood sugar as directed and write it down', /check|monitor|log|write|record/], ['Low sugar signs are shaky, sweaty, confused or hungry: treat with 15 grams of fast sugar (juice or glucose tabs) and recheck in 15 minutes', /15|juice|glucose|sugar|shaky|sweaty|low/], ['Do not skip insulin when you are sick or not eating; call your provider for sick-day instructions', /sick|skip|insulin|call/], ['Check your feet every day for sores or color changes and wear shoes', /feet|foot|shoe|sore/]],
      misc: ['"If I\'m not eating, I\'ll just skip my insulin so my sugar doesn\'t go low."', 'Your body still needs some insulin when you are sick, and skipping it can cause dangerously high sugar. Call your provider for sick-day instructions.'] },
    { id: 'postop', match: /post.?op|surg|ectomy|plasty|arthroplasty|repair|appendic|cholecyst|hernia|fusion|resection|fixation/i, title: 'Recovering after surgery', plain: 'After surgery, deep breathing, moving and caring for the incision help you heal and prevent problems like pneumonia and blood clots.', jargon: 'You need pulmonary toilet and early ambulation to prevent atelectasis and VTE.', need: 'incentive spirometer, walking and incision care',
      points: [['Use the incentive spirometer 10 times every hour while awake, and cough and deep breathe', /spirom|cough|deep|breath/], ['Hold a pillow against the incision when you cough or move (splinting)', /pillow|splint|hold/], ['Walk and get out of bed as ordered; moving prevents clots and pneumonia', /walk|ambul|move|clot|out of bed/], ['Call about fever, spreading redness, drainage or pain that is getting worse', /fever|redness|drain|pain|infect/]],
      misc: ['"It hurts to breathe deeply, so I\'d rather just stay still in bed."', 'I understand it hurts. Staying still raises the risk of pneumonia and clots. Take pain medicine before you walk or use the spirometer, and hold a pillow to your incision.'] },
    { id: 'hip', match: /hip fracture|femoral neck|hip arthroplasty|hemiarthroplasty|intertrochanteric|femur/i, title: 'Safe movement after a hip fracture', plain: 'Your hip needs protection while it heals. Following your movement rules and calling for help stops falls and keeps the repair in place.', jargon: 'You need to maintain weight-bearing status and posterior hip precautions to prevent dislocation.', need: 'weight-bearing rules and calling for help',
      points: [['Follow the weight-bearing and hip precaution orders and use your walker', /weight|precaution|walker/], ['Do not cross your legs or bend your hip past 90 degrees if hip precautions are ordered', /cross|90|bend/], ['Call for help before you get up; do not walk alone yet', /call|help|alone|light/], ['Do ankle pumps and use compression devices to help prevent blood clots', /ankle|pump|clot|compress/]],
      misc: ['"I can walk fine to the bathroom by myself, I don\'t want to bother the nurses."', 'It is not a bother, it is our job. A fall now could damage the repair. Please press the call light and we will walk with you.'] },
    { id: 'stroke', match: /stroke|cva|\btia\b|cerebrovascular|infarct.*brain|hemipar/i, title: 'Stroke warning signs and prevention', plain: 'A stroke happens when blood flow to part of the brain is blocked or bleeds. Knowing the warning signs and taking your medicines lowers the chance of another.', jargon: 'You had an ischemic cerebrovascular event so you need antiplatelet therapy and risk factor modification.', need: 'BE-FAST signs and daily medicines',
      points: [['Know the BE-FAST signs: Balance, Eyes, Face drooping, Arm weakness, Speech trouble, Time to call 911', /fast|face|arm|speech|911|droop/], ['Take your blood thinner or antiplatelet and blood pressure medicine every day', /take|daily|every day|medic|blood thin|aspirin|clopidogrel/], ['Follow swallowing precautions: sit upright and take small bites', /swallow|upright|bites|aspirat/], ['Control blood pressure, stop smoking and limit salt', /pressure|smok|salt|cholesterol/]],
      misc: ['"If I get another stroke symptom I\'ll just lie down and wait to see if it passes."', 'With a stroke every minute counts. If you see any BE-FAST sign, call 911 right away. Do not wait.'] },
    { id: 'afib', match: /atrial fib|a-?fib|flutter|dvt|deep vein|pulmonary embol|\bpe\b|thromboembol|anticoag/i, title: 'Blood thinners and clot prevention', plain: 'Blood thinners keep clots from forming, which lowers your risk of stroke or clots in the lungs and legs. They also make you bleed more easily, so we teach you what to watch for.', jargon: 'You are on a factor Xa inhibitor for CHA2DS2-VASc stroke prophylaxis.', need: 'taking the blood thinner and bleeding precautions',
      points: [['Take the blood thinner at the same times every day and never skip or stop it without talking to your provider', /same time|never|skip|stop|every day|exactly/], ['Use a soft toothbrush and an electric razor, and press on any bleeding for 10 minutes', /soft|electric|razor|pressure|10 min/], ['Report black or bloody stool, blood in urine, nosebleeds that will not stop, or a bad fall or head injury', /black|bloody|blood|nosebleed|fall|head/], ['Avoid aspirin, ibuprofen or naproxen unless your provider says it is okay, and tell every provider you take a blood thinner', /aspirin|ibuprofen|nsaid|naproxen|tell/]],
      misc: ['"I\'ll stop the blood thinner the day before my dental work so I don\'t bleed."', 'Please do not stop it on your own. Stopping can raise the chance of a stroke or clot. Tell the dentist and ask your provider what to do before the procedure.'] },
    { id: 'pna', match: /pneumon|bronchitis|influenza|covid|respiratory infection|empyema/i, title: 'Recovering from pneumonia', plain: 'Pneumonia is an infection in your lungs. Antibiotics fight the germ, and deep breathing, coughing, fluids and rest help you clear it.', jargon: 'You have consolidation with a bacterial pathogen requiring a full antimicrobial course.', need: 'finishing antibiotics, deep breathing and when to call',
      points: [['Take every dose of the antibiotic until it is finished, even when you feel better', /finish|every dose|all|complete/], ['Cough and deep breathe or use the incentive spirometer, sit up, and walk', /cough|breath|spirom|walk|sit/], ['Drink fluids and rest', /fluid|drink|rest/], ['Call for worse shortness of breath, high fever, chest pain or confusion; ask about pneumonia and flu vaccines', /call|worse|fever|chest|vaccin|confus/]],
      misc: ['"As soon as I feel better I\'m going to stop the antibiotic so I don\'t take too many."', 'Feeling better does not mean every germ is gone. Stopping early lets the infection come back stronger. Please finish all of it.'] },
    { id: 'ckd', match: /kidney|renal|ckd|\baki\b|dialysis|nephro/i, title: 'Protecting your kidneys', plain: 'Your kidneys filter your blood. Some medicines and foods are hard on them, so we teach you how to protect what they still do.', jargon: 'You have reduced eGFR so we restrict nephrotoxins, potassium and phosphorus.', need: 'avoiding NSAIDs and following the kidney diet',
      points: [['Avoid ibuprofen, naproxen and other NSAIDs; ask before taking any new medicine or supplement', /ibuprofen|nsaid|naproxen|avoid|ask|new medic/], ['Follow your fluid and diet limits (salt, potassium, phosphorus) as ordered', /fluid|salt|sodium|potassium|phosph|diet/], ['Weigh daily and check your blood pressure; report swelling or much less urine', /weigh|pressure|swell|urine/], ['Tell every provider and imaging staff that you have kidney disease', /tell|every provider|contrast|dye/]],
      misc: ['"I take ibuprofen for my knees, that\'s just over the counter so it\'s safe."', 'Ibuprofen can hurt kidneys even though it is sold without a prescription. Let\'s talk about safer choices for your knee pain, like acetaminophen if your provider agrees.'] },
    { id: 'acs', match: /myocardial|nstemi|stemi|\bacs\b|coronary|angina|chest pain|\bmi\b/i, title: 'Heart attack recovery and chest pain plan', plain: 'A blocked heart artery harmed part of your heart muscle. Medicines keep the artery open and protect the heart, and you need a plan if chest pain returns.', jargon: 'You had a type 1 MI so you need DAPT, a beta blocker, a statin and cardiac rehab.', need: 'what to do for chest pain and taking the heart medicines',
      points: [['Call 911 for chest pain, pressure or shortness of breath that does not go away; do not drive yourself', /911|call|drive/], ['Take aspirin and the clot-prevention medicine every day and never stop them without asking', /aspirin|clopidogrel|ticagrelor|every day|never stop|stop/], ['If you have nitroglycerin: sit down, place one under the tongue, call 911 if the pain is not better in 5 minutes', /nitro|sit|tongue|5 min|911/], ['Join cardiac rehab, eat heart-healthy, and stop smoking', /rehab|diet|heart.?healthy|smok/]],
      misc: ['"If the chest pain comes back I\'ll wait a few hours so I don\'t waste the ambulance\'s time."', 'It would never be a waste. Heart muscle is lost with every minute, so call 911 right away.'] },
    { id: 'inf', match: /sepsis|\buti\b|urinary tract|pyelo|cellulitis|abscess|infection|osteomyel|c\.? ?diff/i, title: 'Antibiotics and preventing infection', plain: 'Your body is fighting an infection. Antibiotics kill the germ, and hand washing and watching for warning signs help you get well and keep it from spreading.', jargon: 'You have a systemic inflammatory response to a bacterial source and need a full antimicrobial course.', need: 'finishing antibiotics and warning signs',
      points: [['Take all of the antibiotic exactly as prescribed, even when you feel better', /all|finish|exactly|complete/], ['Wash your hands often with soap and water', /hand|wash|soap/], ['Call for fever, chills, spreading redness, new pain or confusion', /fever|chill|redness|confus|call/], ['Drink plenty of fluids unless your provider limits them', /fluid|drink|water/]],
      misc: ['"I only need to take the antibiotic while it hurts."', 'The pain may fade before every germ is gone. Please take every dose so the infection does not come back.'] },
    { id: 'gi', match: /gi bleed|gastrointestinal bleed|pancreatit|ulcer|cirrhosis|hepat|obstruction|crohn|colitis|diverticul/i, title: 'Protecting your digestive system', plain: 'Your stomach and bowel need time and care to heal. Some foods, drinks and pain medicines make them worse.', jargon: 'You need PPI therapy and NSAID and alcohol avoidance for mucosal healing.', need: 'what to avoid and which symptoms to report',
      points: [['Avoid alcohol, and avoid aspirin or ibuprofen unless your provider says they are safe', /alcohol|aspirin|ibuprofen|nsaid|avoid/], ['Report black or bloody stools or vomit that looks like coffee grounds', /black|bloody|coffee|stool|vomit/], ['Eat small, low-fat meals as ordered', /small|low.?fat|meal|diet/], ['Take the stomach-protecting medicine as prescribed', /take|prescribed|ppi|pantoprazole|stomach/]],
      misc: ['"A beer now and then is fine, I never had a problem."', 'Alcohol can irritate your stomach and slow healing. The safest plan right now is to avoid it. Would it help to talk about ways to cut back?'] },
    { id: 'etoh', match: /alcohol|etoh|withdrawal|substance|opioid use/i, title: 'Alcohol withdrawal and getting support', plain: 'When someone who drinks heavily stops, the body can have shaking, sweating and seizures. We watch you closely and give medicine to keep you safe.', jargon: 'You are at risk for autonomic hyperactivity and seizure, so we are using a CIWA-driven benzodiazepine protocol.', need: 'withdrawal signs to report and support options',
      points: [['Tell the nurse right away if you have shaking, sweating, a racing heart, anxiety, or see or hear things that are not there', /tell|shak|sweat|anxi|halluc|see|hear/], ['Take thiamine and folate as ordered to protect your brain and nerves', /thiamine|folate|vitamin/], ['Never stop heavy drinking suddenly on your own; get medical help', /never|suddenly|medical help|alone/], ['Ask about counseling, support groups and medicines that help you stay sober', /counsel|support|group|aa|sober|help/]],
      misc: ['"I\'ve done this before. I can just quit on my own when I go home."', 'Many people have said that, and quitting alone can be dangerous. I would like to connect you with people who can help you do it safely.'] },
    { id: 'falls', always: true, title: 'Preventing falls in the hospital and at home', plain: 'Being sick, having new medicines and being in a strange room all raise the chance of a fall. A few habits keep you safe.', jargon: 'Your Morse score indicates high fall risk, so we use a bed alarm and universal precautions.', need: 'using the call light and safe footwear',
      points: [['Press the call light and wait for help before getting up', /call|light|wait|help/], ['Wear non-skid socks or shoes and keep the path clear', /sock|shoe|skid|clear|path|footwear/], ['Stand up slowly and sit on the edge of the bed first if you feel dizzy', /slow|dizz|edge|sit/], ['Use your glasses, walker or cane, and keep the bed low with the alarm on', /glass|walker|cane|alarm|low/]],
      misc: ['"I\'ve never fallen in my life. I\'m fine going to the bathroom by myself."', 'I\'m glad you\'ve been steady. Right now you have new medicines and you are weaker than usual, so we ask everyone to call us first. We will come quickly.'] },
    { id: 'pain', always: true, title: 'Pain control and safe use of pain medicine', plain: 'Treating pain early helps you move, breathe deeply and heal. We use more than one way to ease it, and we use pain medicine safely.', jargon: 'We will titrate multimodal analgesia to your numeric rating scale score.', need: 'rating pain and asking for medicine early',
      points: [['Tell us your pain from 0 to 10 and what makes it better or worse; ask for medicine before the pain is severe', /0 to 10|scale|rate|ask|early|before/], ['Use other comfort steps too: positioning, ice or heat, music, deep breathing', /position|ice|heat|music|breath|relax/], ['Opioids can cause sleepiness, constipation and slowed breathing; tell us if you feel very sleepy', /sleepy|drows|constip|breath|tell/], ['Do not take extra pain medicine on your own, including acetaminophen products', /extra|own|acetaminophen|tylenol|dose/]],
      misc: ['"I don\'t want to take pain medicine, I don\'t want to get addicted. I\'ll just tough it out."', 'It makes sense to be careful. Short-term use of pain medicine for real pain, monitored by us, is safe for most people. Untreated pain can slow healing and make breathing and walking harder.'] }
  ];

  // ------------------------------------------------------------------ medication topics (from the chart and the drug guide)
  const sentences = t => String(t || '').split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 12);
  const cleanName = n => String(n || '').replace(/\s*\(.*?\)/g, '').replace(/\s*(tablet|capsule|injection|solution|infusion|ivpb|nebulizer|suspension|patch|cream|ointment|\bER\b|\bXR\b)\b.*$/i, '').replace(/\s+/g, ' ').trim();
  const lc = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  function kwFrom(text) {
    const STOP = new Set('with without that this have from were been will after before your when then also into over under about than only some more most very daily take taking the and for are not'.split(' '));
    return norm(text).split(' ').filter(w => w.length >= 4 && !STOP.has(w)).map(w => w.slice(0, 5));
  }
  function medTopic(o, g) {
    const nm = cleanName(o.name), pts = [];
    sentences(g.teach).slice(0, 3).forEach(s => pts.push([s.replace(/\.$/, ''), null]));
    if (g.effects && g.effects.length) pts.push([`Report side effects such as ${g.effects.slice(0, 3).join(', ').toLowerCase()}`, null]);
    if (g.hold && g.hold.length && pts.length < 4) pts.push([`Tell the nurse or provider if ${lc(g.hold[0]).replace(/^hold (for|if|when)\s*/i, '').replace(/\.$/, '')}`, null]);
    if (pts.length < 3) pts.push(['Take it exactly as prescribed and ask before changing the dose', /exactly|prescrib|dose|ask/]);
    return { id: 'med_' + norm(nm).replace(/ /g, '_'), title: `Teaching about ${nm}${g.alert ? ' (high-alert)' : ''}`, med: true,
      plain: `${nm} is used for ${lc(g.use).replace(/\.$/, '')}${o.rationale ? '. Your provider ordered it for: ' + lc(o.rationale) : ''}.`,
      jargon: `${nm} is a ${g.cls || 'medication'}; it is ordered per protocol.`, need: `what ${nm} is for and how to take it safely`,
      points: pts.slice(0, 4), misc: [`"I'll probably stop the ${nm} as soon as I start feeling better."`, `A lot of people feel that way. Please talk with your provider or pharmacist before stopping, because stopping on your own may not be safe. What would help you remember to take it?`], alert: g.alert };
  }

  function topicsFor() {
    const cc = currentCanonicalCase; if (!cc) return [];
    const vis = getVisibleCanonicalCase(cc), enc = cc.encounter || {};
    const dxText = [enc.diagnosis, enc.chiefComplaint].concat((vis.problems || cc.problems || []).map(p => p.name)).concat((vis.orders || []).filter(o => /surgery|procedure/i.test(safe(o.category))).map(o => o.name)).join(' | ');
    const list = [];
    const primary = String(enc.diagnosis || '') + ' ' + String(enc.chiefComplaint || '');
    TOPICS.filter(t => !t.always && t.match.test(dxText)).sort((a, b) => (b.match.test(primary) ? 1 : 0) - (a.match.test(primary) ? 1 : 0)).forEach(t => list.push(t));
    const meds = (vis.orders || []).filter(o => safe(o.category) === 'Medication' && o.medication && /active|pending/i.test(safe(o.status)));
    const seen = new Set(); const mt = [];
    meds.sort((a, b) => (b.medication.highAlert ? 1 : 0) - (a.medication.highAlert ? 1 : 0)).forEach(o => {
      const g = window.DrugGuide && DrugGuide.lookup(o.name); if (!g || !g.teach || seen.has(g.key)) return; seen.add(g.key); mt.push(medTopic(o, g));
    });
    mt.slice(0, 6).forEach(t => list.push(t));
    TOPICS.filter(t => t.always).forEach(t => list.push(t));
    return list;
  }

  // ------------------------------------------------------------------ patient personas (what the patient says and how they react)
  const PERSONAS = {
    anxious: { label: 'Anxious', open: t => `I'm really nervous. The doctors keep talking about ${t.need}, and I don't want to do something wrong.`, feel: 'nervous', good: ['That helps a lot. I feel a bit calmer.', 'Okay, thank you for listening.'], ok: ['Okay... I guess so.'], bad: ['Oh... I guess I shouldn\'t be nervous then. (looks away)', 'I\'m still worried. Nobody has time for me.'] },
    skeptical: { label: 'Skeptical', open: t => `Honestly I don't see why I need all this. I've managed fine before. What's the big deal about ${t.need}?`, feel: 'unsure this is needed', good: ['Hmm, okay. At least you asked what I think.', 'That makes sense when you put it that way.'], ok: ['If you say so.'], bad: ['Whatever. I\'ve heard it all before.', 'You sound like everybody else. I\'m not convinced.'] },
    overwhelmed: { label: 'Overwhelmed', open: t => `There's just so much going on. Now I'm supposed to learn about ${t.need} too? I can't keep it all straight.`, feel: 'overwhelmed', good: ['Thank you. Going slowly helps.', 'Okay, I think I can handle that.'], ok: ['I\'ll try to follow.'], bad: ['I\'m lost. I\'ll just nod.', 'I\'m too tired for this.'] },
    literacy: { label: 'Low health literacy', open: t => `I'm not good with medical words. They told me something about ${t.need}, but I didn't really get it. I read slowly.`, feel: 'unsure about the medical words', good: ['Oh, I get it now. Thanks for using plain words.', 'That is clear. I can picture that.'], ok: ['Maybe... I think I understand.'], bad: ['I don\'t know those words. I\'ll just say yes.', 'That went over my head, sorry.'] }
  };

  // ------------------------------------------------------------------ scripted steps
  // each option: { t: nurse says, pts: 0-2, why: feedback }
  function stepsFor(t, persona) {
    const P = PERSONAS[persona];
    const steps = [];
    steps.push({ id: 'feel', title: '1. Build rapport and ask about feelings', patient: P.open(t), max: 2, opts: [
      { t: `It sounds like you are feeling ${P.feel}. Tell me what worries you most about this.`, pts: 2, why: 'Best: names the feeling (reflection) and uses an open-ended question so the patient leads.' },
      { t: `I'd like to go over ${t.need} with you. What have you been told so far?`, pts: 1, why: 'Good: assesses what the patient already knows, but it skips acknowledging the feeling first.' },
      { t: 'Don\'t worry, everything will be fine. You\'ll be okay.', pts: 0, why: 'False reassurance shuts down communication and is not something you can promise.' },
      { t: 'There\'s nothing to be nervous about. Why would you feel that way?', pts: 0, why: 'Dismisses the feeling, and "why" questions can sound judgmental.' },
      { t: 'I\'m pretty busy. Here\'s a handout, read it and I\'ll check back later.', pts: 0, why: 'A handout alone is not teaching. Sit down, make eye contact, and ask what the patient needs.' }
    ] });
    steps.push({ id: 'why', title: '2. Explain why this matters in plain language', patient: 'Okay... but why do I need to know this? What does it actually do?', max: 2, opts: [
      { t: t.plain, pts: 2, why: 'Best: plain, short and specific to this patient. Avoid medical words the patient has not heard.' },
      { t: 'Your provider ordered it, so it\'s important. Just do what the doctor says.', pts: 1, why: 'Partly: true, but it does not help the patient understand or take part in the plan.' },
      { t: t.jargon, pts: 0, why: 'Too much jargon. Patients cannot follow what they cannot understand, and many will just nod.' },
      { t: 'It\'s the hospital protocol. Everybody gets this.', pts: 0, why: 'This ignores the patient\'s own situation and does not teach anything.' }
    ] });
    // step 3 is a multi-select
    steps.push({ id: 'points', title: '3. Choose the key teaching points', patient: 'Okay. What are the most important things I need to remember?', multi: true, max: 3 });
    steps.push({ id: 'misc', title: '4. Respond to a misunderstanding', patient: t.misc[0].replace(/^"|"$/g, ''), max: 2, opts: [
      { t: `A lot of people feel that way. ${t.misc[1]}`, pts: 2, why: 'Best: respectful, corrects the misunderstanding, gives the reason, and keeps the patient involved.' },
      { t: 'Please do what we taught you.', pts: 1, why: 'Partly: correct instruction, but it gives no reason and does not respect the patient\'s thinking.' },
      { t: 'You have to or you will end up back in the hospital, or worse!', pts: 0, why: 'Scare tactics and commands usually backfire. Explain the reason and offer help instead.' },
      { t: 'That\'s your choice. I can\'t make you do anything.', pts: 0, why: 'Respecting choice is important, but you must still inform the patient of the risks and your concern.' }
    ] });
    steps.push({ id: 'back', title: '5. Check understanding (teach-back)', patient: 'Okay, I think that\'s everything... Can you make sure I have it right?', max: 2, opts: [
      { t: 'I want to be sure I explained it clearly. Can you tell me in your own words what you will do at home and when you would call for help?', pts: 2, why: 'Best: teach-back puts the responsibility on you, the teacher, and shows what the patient really understood.' },
      { t: 'Repeat after me what I just said, word for word.', pts: 1, why: 'Partly: repeating is not the same as understanding, and it can feel like a test.' },
      { t: 'Do you understand everything I said?', pts: 0, why: 'A yes/no question. Many patients say yes even when they are confused.' },
      { t: 'Great, you\'ve got it. I\'ll let you rest. Call if you need anything.', pts: 0, why: 'Ending without checking understanding means you do not know if teaching worked.' }
    ] });
    return steps;
  }

  // ------------------------------------------------------------------ scoring of the points step and the note
  const WRONG_POINTS = ['Stop the medicine as soon as you feel better', 'Double the next dose if you miss one', 'It is fine to share your medicine with a family member who has the same symptoms', 'Ignore new symptoms until your next appointment', 'Drink alcohol freely, it will not affect your recovery', 'You do not need to tell other providers about this', 'Skip your follow-up visit if you feel well', 'Take extra over-the-counter pain medicine whenever you like'];
  function pointChoices(t) {
    const right = t.points.map(p => p[0]);
    const others = [];
    TOPICS.filter(x => x.id !== t.id).forEach(x => x.points.forEach(p => { if (!right.includes(p[0])) others.push(p[0]); }));
    const wrong = shuffle(WRONG_POINTS).slice(0, 2).concat(shuffle(others).slice(0, 1));
    return shuffle(right.concat(wrong)).map(text => ({ text, right: right.includes(text) }));
  }
  function pointMatcher(p) {
    if (p[1]) return text => p[1].test(text);
    const kw = kwFrom(p[0]).slice(0, 6), need = Math.max(1, Math.min(2, Math.ceil(kw.length * 0.3)));
    return text => kw.filter(k => text.includes(k)).length >= need;
  }
  function scoreNote(t, text) {
    const n = norm(text), got = []; let pts = 0;
    const taught = t.points.filter(p => pointMatcher(p)(n)); pts += Math.min(2, taught.length);
    const elements = [['What you taught', /taught|educat|instruct|reviewed|discuss|explain|teach/], ['Patient response / understanding', /verbaliz|understand|demonstrat|stated|states|return|agreed|able to|teach.?back|repeat/]];
    const hit = elements.filter(e => e[1].test(n)); pts += hit.length;
    return { pts, max: 4, taught, missedPoints: t.points.filter(p => !taught.includes(p)), hit, missedEl: elements.filter(e => !hit.includes(e)) };
  }

  // ------------------------------------------------------------------ dialog and conversation
  let S = null; // { topic, persona, steps, i, log:[{step, chosen, pts, best}], bubbles }
  function ensureDialog() {
    let dlg = $('teachDialog'); if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.id = 'teachDialog'; dlg.className = 'quiz-dialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Patient teaching practice</h2><p>Practice talking with this patient. The patient answers by script (no internet or AI). Choose what to say at each step, then you get feedback on communication and the teaching content.</p></div><button id="tcClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body"><div id="tcBody"></div><div id="tcHistory"></div></div>`;
    document.body.appendChild(dlg);
    $('tcClose').addEventListener('click', () => dlg.close());
    return dlg;
  }

  function showSetup() {
    S = null;
    const cc = currentCanonicalCase, name = safe((cc.patient || {}).preferredName || (cc.patient || {}).name);
    const topics = topicsFor();
    $('tcBody').innerHTML = `<div class="tc-card"><b>Patient:</b> ${esc(safe(cc.patient.name))}, ${esc(safe(cc.patient.age))}-year-old ${esc(safe(cc.patient.sex).toLowerCase())}. <b>Admitted for:</b> ${esc(safe((cc.encounter || {}).diagnosis))}.</div>
      <h3 class="ho-sec">1. Choose what you will teach ${esc(name)}</h3>
      <div class="tc-topics">${topics.map((t, i) => `<label class="qz-choice"><input type="radio" name="tcTopic" value="${i}"${i === 0 ? ' checked' : ''}> <span><b>${esc(t.title)}</b><br><small class="fs-muted">${t.med ? 'Medication on this chart' : t.always ? 'Every patient' : 'Matches this diagnosis'}</small></span></label>`).join('')}</div>
      <h3 class="ho-sec">2. Patient attitude</h3>
      <select id="tcPersona"><option value="random">Surprise me</option>${Object.keys(PERSONAS).map(k => `<option value="${k}">${esc(PERSONAS[k].label)}</option>`).join('')}</select>
      <div class="ho-actions"><button id="tcStart" class="primary-button">Start conversation</button></div>`;
    $('tcStart').addEventListener('click', () => {
      const idx = parseInt(($('tcBody').querySelector('input[name="tcTopic"]:checked') || {}).value || 0, 10); let p = $('tcPersona').value;
      if (p === 'random') p = Object.keys(PERSONAS)[Math.floor(Math.random() * 4)];
      seed = (Date.now() & 0xffff) + 1; begin(topics[idx], p);
    });
  }

  function begin(topic, persona) {
    S = { topic, persona, steps: stepsFor(topic, persona), i: 0, bubbles: [], log: [], choices: pointChoices(topic) };
    // show 4 options per step, always including the best one, in random order
    S.steps.forEach(st => {
      if (!st.opts) return;
      const best = st.opts.filter(o => o.pts === 2), mid = st.opts.filter(o => o.pts === 1), bad = shuffle(st.opts.filter(o => o.pts === 0));
      st.opts = shuffle(best.concat(mid, bad).slice(0, 4));
    });
    renderStep();
  }

  const bubble = (who, text) => `<div class="tc-b ${who}"><span class="tc-who">${who === 'pt' ? esc(safe((currentCanonicalCase.patient || {}).preferredName || 'Patient')) : 'You (nurse)'}</span>${esc(text)}</div>`;
  function renderStep() {
    const st = S.steps[S.i], P = PERSONAS[S.persona];
    const hist = S.bubbles.join('');
    let inner = `<div class="tc-meta">Topic: <b>${esc(S.topic.title)}</b> · Patient attitude: <b>${esc(P.label)}</b> · Step ${S.i + 1} of ${S.steps.length + 1}</div><div class="tc-chat">${hist}${bubble('pt', st.patient)}</div><h3 class="ho-sec">${esc(st.title)}</h3>`;
    if (st.multi) {
      inner += `<p class="fs-muted">Select the teaching points you would cover. Careful: some choices are wrong or unsafe.</p>` + S.choices.map((c, j) => `<label class="qz-choice"><input type="checkbox" name="tcPts" value="${j}"> <span>${esc(c.text)}</span></label>`).join('') + `<div class="ho-actions"><button id="tcGo" class="primary-button">Teach these points</button></div>`;
    } else {
      inner += st.opts.map((o, j) => `<label class="qz-choice"><input type="radio" name="tcOpt" value="${j}"> <span>${esc(o.t)}</span></label>`).join('') + `<div class="ho-actions"><button id="tcGo" class="primary-button">Say this</button></div>`;
    }
    $('tcBody').innerHTML = inner; const chat = $('tcBody').querySelector('.tc-chat'); chat.scrollTop = chat.scrollHeight;
    $('tcGo').addEventListener('click', answerStep);
  }

  function answerStep() {
    const st = S.steps[S.i], P = PERSONAS[S.persona]; let pts = 0, said = '', reaction = '', why = '', best = '';
    if (st.multi) {
      const sel = Array.from($('tcBody').querySelectorAll('input[name="tcPts"]:checked')).map(e => S.choices[parseInt(e.value, 10)]);
      if (!sel.length) { alert('Select at least one teaching point.'); return; }
      const right = sel.filter(c => c.right).length, wrong = sel.length - right, total = S.topic.points.length;
      pts = Math.max(0, Math.round((right - wrong) / total * st.max * 10) / 10);
      said = 'Here is what I want you to remember: ' + sel.map(c => c.text).join('. ') + '.';
      reaction = pts >= st.max * 0.75 ? 'That is a clear list. I think I can remember that.' : pts > 0 ? 'Some of that makes sense, but some of it sounds confusing.' : 'Wait, that does not sound right. Now I\'m more confused.';
      why = `Right points you chose: ${right} of ${total}. ${wrong ? wrong + ' wrong or unsafe choice(s) cost points: ' + sel.filter(c => !c.right).map(c => '"' + c.text + '"').join('; ') + '. ' : ''}${right < total ? 'Missed: ' + S.choices.filter(c => c.right && !sel.includes(c)).map(c => c.text).join('; ') + '.' : 'You covered every key point.'}`;
      best = S.topic.points.map(p => p[0]).join('; ');
    } else {
      const ch = $('tcBody').querySelector('input[name="tcOpt"]:checked'); if (!ch) { alert('Choose what to say.'); return; }
      const o = st.opts[parseInt(ch.value, 10)]; pts = o.pts; said = o.t; why = o.why; best = (st.opts.find(x => x.pts === 2) || o).t;
      const pool = o.pts === 2 ? P.good : o.pts === 1 ? P.ok : P.bad; reaction = pool[Math.floor(rnd() * pool.length)];
    }
    S.bubbles.push(bubble('pt', st.patient), bubble('rn', said), bubble('pt', reaction));
    S.log.push({ step: st.title, said, pts, max: st.max, why, best });
    S.i += 1;
    if (S.i < S.steps.length) renderStep(); else renderNote();
  }
  function renderNote() {
    const t = S.topic;
    $('tcBody').innerHTML = `<div class="tc-meta">Topic: <b>${esc(t.title)}</b> · Step ${S.steps.length + 1} of ${S.steps.length + 1}</div><div class="tc-chat">${S.bubbles.join('')}</div>
      <h3 class="ho-sec">6. Document the teaching</h3><p class="fs-muted">Write the education note you would chart: what you taught, how the patient responded, and the teach-back result. (Scored by keywords, so be specific.)</p>
      <textarea id="tcNote" rows="5" placeholder="Example: Taught patient about ... Patient verbalized understanding and demonstrated teach-back ..."></textarea>
      <div class="ho-actions"><button id="tcFinish" class="primary-button">Finish and see feedback</button></div>`;
    $('tcFinish').addEventListener('click', finish);
  }

  function finish() {
    const t = S.topic, text = $('tcNote').value, sn = scoreNote(t, text);
    const earned = S.log.reduce((s, l) => s + l.pts, 0) + sn.pts, max = S.log.reduce((s, l) => s + l.max, 0) + sn.max, pct = Math.round(earned / max * 100);
    const rows = S.log.map(l => `<tr class="${l.pts >= l.max ? '' : 'crit'}"><td><b>${esc(l.step)}</b><div class="fs-muted">You said: ${esc(clip(l.said, 220))}</div><div class="fs-why">${esc(l.why)}</div>${l.pts < l.max && l.best && !/^Right points/.test(l.why) ? `<div class="fs-why">Best choice: ${esc(clip(l.best, 220))}</div>` : ''}</td><td class="ho-pts">${Math.round(l.pts * 10) / 10}/${l.max}</td></tr>`).join('');
    const noteRow = `<tr class="${sn.pts >= sn.max ? '' : 'crit'}"><td><b>6. Education note</b><div class="fs-muted">${text.trim() ? esc(clip(text, 260)) : '(nothing written)'}</div><div class="fs-why">Teaching points mentioned: ${sn.taught.length} of ${t.points.length} (up to 2 points count). ${sn.missedEl.length ? 'Also document: ' + sn.missedEl.map(e => e[0]).join(' and ') + '.' : 'You documented what you taught and the patient\'s response.'}</div></td><td class="ho-pts">${sn.pts}/${sn.max}</td></tr>`;
    $('tcBody').innerHTML = `<div class="ho-score"><div class="ho-pct ${pct >= 80 ? 'ok' : pct >= 60 ? 'part' : 'bad'}">${pct}%</div><div><b>${Math.round(earned * 10) / 10} of ${max} points</b><br><span class="fs-muted">${esc(t.title)} · ${esc(PERSONAS[S.persona].label)} patient</span></div></div>
      <table class="fs-table ho-table"><tbody>${rows}${noteRow}</tbody></table>
      <h3 class="ho-sec">Key teaching points for this topic</h3><ul>${t.points.map(p => `<li>${esc(p[0])}</li>`).join('')}</ul>
      <div class="ho-actions"><button id="tcAgain" class="primary-button">Practice another topic</button> <button id="tcRetry" class="secondary-button">Try this topic again</button></div>`;
    $('tcAgain').addEventListener('click', () => { showSetup(); renderHistory(); });
    $('tcRetry').addEventListener('click', () => { seed = (Date.now() & 0xffff) + 1; begin(t, S.persona); });
    const h = (currentCanonicalCase.teaching = currentCanonicalCase.teaching || { attempts: [] });
    h.attempts.push({ at: String(simulationTime), topic: t.title, persona: S.persona, pct, earned: Math.round(earned * 10) / 10, max });
    try { persistCase(); } catch (e) { /* best effort */ }
    renderHistory();
  }
  const clip = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  function renderHistory() {
    const h = currentCanonicalCase && currentCanonicalCase.teaching;
    $('tcHistory').innerHTML = h && h.attempts.length ? `<h3 class="ho-sec">Your teaching practice on this patient</h3><table class="fs-table"><tbody>${h.attempts.map((a, i) => `<tr><td>#${i + 1}</td><td>${esc(a.topic)}</td><td>${esc((PERSONAS[a.persona] || {}).label || '')}</td><td><b>${a.pct}%</b> (${a.earned}/${a.max})</td></tr>`).join('')}</tbody></table>` : '';
  }

  function open() {
    if (!currentCanonicalCase) { alert('Load a patient first.'); return; }
    const dlg = ensureDialog(); showSetup(); renderHistory(); if (!dlg.open) dlg.showModal();
  }

  const btn = document.createElement('button'); btn.id = 'openTeachBtn'; btn.className = 'top-link top-button'; btn.textContent = 'Teaching';
  const lib = $('openLibraryBtn'); if (lib && lib.parentNode) lib.parentNode.insertBefore(btn, lib);
  btn.addEventListener('click', open);

  window.Teaching = { topicsFor, stepsFor, scoreNote, open, TOPICS, PERSONAS };
})();
