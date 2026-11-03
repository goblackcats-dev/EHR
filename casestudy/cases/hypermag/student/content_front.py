"""Front matter (cover, rubric, roles, handoff) and closing content, plus the rubric used by both the student packet and the instructor key."""
from content_cp import K, MON

TITLE = 'The Case of the Silent Mineral'
SUB = 'A Rapid Response Detective Squad case file'

RUBRIC = [
    dict(cat='Teamwork and participation', pts=5, sees='Everyone writes, talks and rotates. Look for initials on every role strip, names on the cover, voices in the huddles, and the peer check.',
         full='**5 points.** All names on the cover. Roles rotated every checkpoint and initialed. Every teammate clearly contributed in the huddles. Every teammate finished the peer check.',
         good='**3 to 4 points.** Roles rotated most of the time (a few initials missing). Most teammates contributed. Peer check done by most.',
         start='**1 to 2 points.** One person did most of the work, or roles were not rotated. Peer check missing. (0 = nothing handed in.)',
         how='Roles rotated and initialed = 2.  Huddles show the whole team = 2.  Peer check done (individual) = 1.'),
    dict(cat='Clinical reasoning at each checkpoint', pts=6, sees='Answers are tied to Ray\'s chart: a real number, a trend or a reason. "Complete and thoughtful" is full credit; it does not have to match the key word for word.',
         full='**6 points.** All six checkpoints have thoughtful answers in the Detective, Interpreter and Bedside boxes, using real chart numbers and giving reasons.',
         good='**4 to 5 points.** Most checkpoints are thoughtful. One or two are thin (answers without numbers or reasons).',
         start='**1 to 3 points.** Many boxes are blank or one-word answers, or the chart facts are mostly missing.',
         how='1 point for each checkpoint (0700, 1100, 1500, 1900, 2300, 0300). Half a point is fine when a checkpoint is mostly done.'),
    dict(cat='Safety, priorities and SBAR communication', pts=5, sees='Top 3 priorities in a safe order (airway and breathing before paperwork), a specific question for the provider, and an SBAR that gives numbers and asks for something.',
         full='**5 points.** At each of the five calls (1100, 1500, 1900, 2300, 0300): safe priority order, a specific question, and a complete SBAR with numbers and a clear request.',
         good='**3 to 4 points.** Mostly safe priorities and SBARs. A part is missing sometimes (no numbers, no request).',
         start='**1 to 2 points.** Priorities are unsafe or very vague, or SBARs are mostly empty.',
         how='1 point for each checkpoint from 1100 to 0300. The 0700 huddle is a warm-up: it is practice, not scored here.'),
    dict(cat='Completeness and reflection', pts=4, sees='The pages are finished and the end-of-case pages show learning.',
         full='**4 points.** Every checkpoint page is finished (Mg-o-meter marked, vitals logged, prediction written). Case Closed timeline done. Teach-back to Eleanor done. Individual reflection done.',
         good='**2 to 3 points.** One or two of these four parts are partly done.',
         start='**0 to 1 point.** Most of the end pages or checkpoint pages are blank.',
         how='1 point each: pages finished = 1 (group), timeline = 1 (group), teach-back = 1 (group), individual reflection = 1 (individual).'),
]
BONUS = '**Bonus (+1):** answer all six "Predict the plot twist" boxes. There are no wrong answers: a thoughtful guess counts. (Your total cannot go above 20 unless your instructor says otherwise.)'

ROLES = {
    'A': dict(name='CHART DETECTIVE', quote='"The chart is the crime scene. Every order and every medicine is a clue."',
              jobs=['Read the **MAR, Orders, notes and sticky notes** for the current time.', 'What is **active**, what is **due**, what is **held**?', 'What is **dangerous** for Ray? What is **missing**? What should be **stopped**?',
                    'Hunt for **hidden magnesium**: protocols and order sets can hide it in the last step.'],
              tools='Orders, MAR, Chart Review (notes), Patient Summary (sticky notes)'),
    'B': dict(name='LAB INTERPRETER', quote='"Numbers tell a story if you line them up."',
              jobs=['Compare **new results** to the diagnosis and to the **trend**: magnesium, potassium, calcium, creatinine, blood gas, ECG.', 'Say what is **better, worse or the same**, and **why**.',
                    'Plot the new magnesium on the **Mg-o-meter** and name its zone.'],
              tools='Lab Results (newest column on the right), ECG interpretation'),
    'C': dict(name='BEDSIDE NURSE', quote='"I am the eyes, ears and hands at the bedside."',
              jobs=['Read the **bedside monitor** the instructor sets and **chart the vitals** in the EHR.', 'Do and report the **assessment**: level of consciousness, breathing, **reflexes**, strength, urine output.',
                    'Give a **20-second report** to the team: the 3 findings that worry you most.'],
              tools='Flowsheets (Vital Signs, Adult Assessment, Intake/Output), the monitor'),
}

HANDOFF_PROMPTS = [
    dict(id='H1', letter='S', head='Situation', prompt='Who is this and what is wrong right now?', n=2,
         key=K('Raymond "Ray" Kessler, 74 M, room 5E-14, arriving from the ED with critical hypermagnesemia (Mg 7.8; normal 1.7-2.2), AKI on CKD 4 (creatinine 4.9), a slow heart rate and low blood pressure. Full Code. Allergy: penicillin (rash).', 'Straight from the 0655 ED handoff note.', 'Name, age, problem, a number and the allergy.', 'Leaving out the allergy or code status.')),
    dict(id='H2', letter='B', head='Background', prompt='How did he get here? What did the ED do, and when?', n=3,
         key=K('4 days of vomiting and poor intake, then hard to wake. Home lisinopril, furosemide and ibuprofen. Wife says he takes "stomach medicine" and a "magnesium pill"; a bag of bottles (delivered 0640) has NOT been reviewed. Last stool Friday. In the ED: ondansetron 0510, calcium gluconate 1 g 0555, NS 500 mL 0605-0635, Foley 0610.', 'ED handoff 0655 and ED provider note.', 'Cause, a medication clue, and the three ED treatments with times.', 'Missing the unreviewed bag.')),
    dict(id='H3', letter='A', head='Assessment (0700)', prompt='What did the ED nurse see at 0700?', n=3,
         key=K('T 97.6, HR 52 sinus bradycardia with first-degree AV block, BP 96/56, RR 14, SpO2 94% room air, pain 2/10. Drowsy but wakes to voice, slurred speech, reflexes 1+, weak grip, flushed, dry mucosa, abdomen mildly distended, NPO. Lines: 20 g left forearm and 18 g right antecubital; Foley 16 Fr (130 mL out).', 'ED handoff 0655.', 'Vitals, level of consciousness, reflexes.', 'Writing only the vital signs.')),
    dict(id='H4', letter='R', head='Recommendation: what is due next?', prompt='What is still to do? What worries you?', n=3,
         key=K('Second NS 500 mL bolus due 0715 (lung check before and after), then 100 mL/h; furosemide 80 mg IV at 0915; Mg and BMP at 0900 then q4h; pacing pads available; calcium gluconate PRN; review the bag of bottles with the wife; hourly urine output.', 'ED handoff 0655.', 'Two scheduled items and the unreviewed bag.', 'Missing the bag.')),
]

ED_CARD = dict(
    vitals='**ED vitals 0425:** T 97.2, HR 46, BP 82/46, RR 14, SpO2 95% room air, glucose 148.',
    labs='**ED labs (drawn 0440):** Mg **7.8**, K 5.4, creatinine 4.9 (baseline 2.6), BUN 84, eGFR 12, CO2 17, Ca 8.1, phosphorus 6.2.',
    ecg='**ED ECG 0430:** sinus bradycardia 46, **PR 248 ms**, **QRS 124 ms**, QTc 468.',
    meds='**ED treatments:** ondansetron 4 mg IV 0510; calcium gluconate 1 g IV 0555-0605; NS 500 mL 0605-0635; Foley 0610.')

# ---- closing: the "stay" timeline. Mg values come from patient.json and are re-checked by check_facts.py
TIMELINE = [
    dict(time='Tue 0700', mg='7.8', big='Arrival: drowsy, slow heart rate, reflexes 1+; the bag of bottles', act='Checked ABCs, reflexes and rhythm; asked about OTC products; stopped all magnesium sources; safe fluids'),
    dict(time='Tue 1100', mg='8.7', big='Reflexes gone, RR 10, HR 44, BP 84/48', act='Called the rapid response; calcium gluconate on the monitor; oxygen but watched RR; SBAR'),
    dict(time='Tue 1500', mg='10.9', big='Peak Mg, breathing depression, wide QRS, emergency dialysis decided', act='Dialysis checklist (consent, catheter rules, x-ray); ICU thresholds; calcium 2 g; BP/HR q15'),
    dict(time='Tue 1900', mg='4.6', big='After dialysis: Mg 4.6 but glucose 54 and low calcium', act='Rule of 15 with swallow screen (apple juice); called for D10W; post-dialysis checks'),
    dict(time='Tue 2300', mg='5.6', big='Mg climbing again (rebound) and new delirium', act='Non-drug measures, protected lines, did not give diphenhydramine, asked for melatonin'),
    dict(time='Wed 0300', mg='6.4', big='Rebound, constipation, Ray asks for "the pink milk"', act='Did NOT give milk of magnesia; got the protocol stopped; bisacodyl, KUB; watched breathing and reflexes'),
    dict(time='Wed 0700', mg='5.3', big='Recovery: alert, reflexes 2+, urine 85 mL/h, a large stool at 0345', act='Teaching with teach-back; Foley removal plan; handoff'),
]
TIMELINE_KEY = K('Fill in the blanks of the table with the Mg values and a short event/action for each stop (see the pre-filled model in the key).', 'Mg values: 7.8, 8.7, 10.9, 4.6, 5.6, 6.4, 5.3 (plus 9.5 at 1115 and 7.2 at 1700 as in-between draws).',
                 'Full credit = all seven rows have a Mg value and a specific event and action in the squad\'s own words.', 'Copying only times; leaving out why the level changed.')

TEACHBACK_SCENE = 'Eleanor says: **"What do I do with all those bottles at home? He gets so constipated from his back medicine, and the heartburn medicine always helped."**'
TEACHBACK_KEY = K('Three plain-language tips, for example: (1) "Do not give Ray milk of magnesia, Maalox or Mylanta-type antacids, magnesium pills or Epsom salts. Look for the word MAGNESIUM on the label. His kidneys cannot get rid of it, and it made him very sleepy and slowed his heart." (2) "For constipation, heartburn, cramps or pain, call his kidney doctor or the pharmacist FIRST. Ask about MiraLAX or senna for constipation and Tylenol (acetaminophen) instead of ibuprofen." (3) "Bring every bottle, even the store-bought ones, to every visit, and say \'Ray has kidney disease.\' If he is vomiting or not drinking, call before giving his blood-pressure pill or water pill. Call us or 911 if he is very sleepy, breathing slowly, weak, fainting or making very little urine."',
                  'Based on INSTRUCTOR_GUIDE.md section 8.5 and the 0700 teaching points (no magnesium, no NSAIDs, label reading, safe alternatives, sick-day rule, bring all bottles, warning signs).',
                  'Accept any three correct tips in plain language (no jargon like "hypermagnesemia"), with at least one named safe alternative. A great teach-back question: "Show me which bottle on the shelf you would not buy."',
                  'Jargon; "avoid antacids" with no alternatives; no mention of reading labels; forgetting that Ray also took ibuprofen.')

PEER_CRITERIA = ['Did their share of the work', 'Listened to teammates', 'Spoke up with a good clue or question']
