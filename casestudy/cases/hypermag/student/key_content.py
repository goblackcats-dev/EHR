"""Instructor-only content: run of show, skip lists, scoring examples, debrief. Not part of the student packet."""

GUIDE = 'INSTRUCTOR_GUIDE.md'

HANDOFF_SCRIPT = [
    'S: "Raymond Kessler, 74-year-old man, arriving at 5E-14 with critical hypermagnesemia (Mg 7.8; normal 1.7 to 2.2), AKI on CKD 4 (creatinine 4.9), a slow heart rate and low blood pressure. Full Code. Allergy: penicillin, a rash."',
    'B: "Four days of vomiting and poor intake, then hard to wake. At home: lisinopril, furosemide and ibuprofen. His wife says he takes stomach medicine and a magnesium pill. A bag of bottles was delivered at 0640 and has NOT been reviewed. Last stool Friday. Home meds are on hold. In the ED: ondansetron at 0510, calcium gluconate 1 g at 0555, a 500 mL saline bolus 0605 to 0635, and a Foley at 0610."',
    'A: "At 0700: temperature 97.6, heart rate 52 sinus bradycardia with first-degree AV block, BP 96/56, RR 14, SpO2 94% on room air, pain 2 out of 10. Drowsy but wakes to voice, slurred speech, reflexes 1+, weak grip, flushed, dry mouth, abdomen a little distended. NPO. Lines: 20 gauge left forearm and 18 gauge right antecubital. Foley 16 French, 130 mL out."',
    'R: "Second saline bolus 500 mL is due at 0715: listen to the lungs before and after. Then 100 mL/h. Furosemide 80 mg IV at 0915. Magnesium and BMP at 0900 then every 4 hours. Pacing pads available. Calcium gluconate as needed. Please review the bag of bottles with his wife. Hourly urine output."']

# (clock minute, length, what)
ROS = [
    ('0:00', '10 min', 'OPENING (EHR clock: Tue 0700, monitor at the 0700 row)',
     ['0:00-0:03  Hand out one packet per squad. Squads of 2-3 write names and starting jobs on the cover; point at the rubric (page 2) and say "complete and thoughtful = full credit".',
      '0:03-0:05  Show the roles page and the rotation chart. Tell them: "Do not turn a page past your checkpoint until I press 4h."',
      '0:05-0:10  Read the ED handoff (script in the Opening section below). Students fill the S-B-A-R listening grid and read back. Circulate: check the read-back (name, DOB, allergy).'],
     'None yet. Monitor shows the 0700 set (HR 52, BP 96/56, RR 14, SpO2 94%).', 'If behind: skip the "asked one clarifying question" line and the rhythm decoder explanation.'),
]
CP_ROS = {
    1: ('0:10', 'Clock Tue 0700. Read Situation (page 1). Monitor: 0700 row (INSTRUCTOR_GUIDE.md section 4, Checkpoint 1 (B)). Portray Ray per section 4 Checkpoint 1 (C); Eleanor answers only if asked about OTC products, laxatives, antacids or supplements, or asks "should I show you the bag?" at about 0:16.',
        'Circulate at 0:14 (is the Bedside Nurse really reading the monitor and charting in Flowsheets?) and 0:17 (has anyone asked about the bag? if not, release Eleanor\'s line). Listen at the huddle for ABC first.',
        'If behind: skip 1B2 (rhythm decoder), then 1A2(b) (the hunt). Do not skip vitals, the Mg-o-meter, priorities or the SBAR warm-up.'),
    2: ('0:25', 'Press 4h (clock Tue 1100). Read Situation. Monitor: 1100 row (section 4 Checkpoint 2 (B)): HR 44, BP 84/48, RR 10 shallow, SpO2 91% room air (94% on 3 L if they apply oxygen). Portray the mumbling patient with absent reflexes (Checkpoint 2 (C)).',
        'Circulate at 0:29: is a "call for help" decision being made before 0:33? If nobody says "rapid response", ask as the charge nurse: "What is his respiratory rate? What would the criteria say?" At the huddle, play the rapid response doctor: "Tell me what you need." (SBAR #1 in the guide).',
        'If behind: skip 2B3 (rhythm), then 2A3 ("what is missing"). Never skip the SBAR.'),
    3: ('0:40', 'Press 4h (clock Tue 1500). Read Situation. Monitor: 1500 row (section 4 Checkpoint 3 (B)): HR 46, BP 88/50, RR 9, SpO2 92% on 4 L, EtCO2 52, wide QRS. Crackles at the bases; dialysis RN at the bedside (Checkpoint 3 (C)). This section is 4 pages (the machine page is page 3).',
        'Circulate at 0:44 (are they using the ICU outreach note numbers?) and 0:50 (huddle: airway first?). Play ICU outreach for the SBAR (#3 in the guide).',
        'If behind: skip 3B4 and the diagram page (page 3 except the Mg-o-meter), then 3A3. Do not skip the dialysis readiness check or the SBAR.'),
    4: ('0:55', 'Press 4h (clock Tue 1900). Read Situation. Monitor: 1900 row (HR 66, BP 104/60, RR 16, SpO2 96% room air). When the Bedside Nurse checks glucose say "54"; after the first 15 g say 68, after the second 84 (Checkpoint 4 (B)). Patient: "shaky, sweating, my mouth and hands tingle".',
        'Circulate at 0:59: orange juice? swallow screen first? Listen for the juice choice at the huddle. Play the hospitalist for SBAR #4.',
        'If behind: skip 4B3, then 4A3. Do not skip the glucose steps.'),
    5: ('1:10', 'Press 4h (clock Tue 2300). Read Situation. Monitor: 2300 row (HR 62, BP 112/64, RR 16, SpO2 96%, POC 118). Portray confusion: "I have got to get to the shop. Get these things off me! Where is Eleanor?" (Checkpoint 5 (C)).',
        'Circulate at 1:14: is anyone reaching for the PRN sleep medicine or restraints? Prompt: "Read the drug class. What does it do at a magnesium of 5.6?" Play the night hospitalist: "Is the diphenhydramine order active? Do not give it." (SBAR #5).',
        'If behind: skip 5B3, then 5A3.'),
    6: ('1:25', 'Press 4h (clock Wed 0300). Read Situation. Monitor: 0300 row (HR 56, BP 104/60, RR 12, SpO2 95%, PR 0.24 s, POC 126). Ray: "My belly is so full. Can I take something? At home I take the pink milk." (Checkpoint 6 (C)).',
        'Circulate at 1:29: if the milk of magnesia step is not found, prompt "Read every ingredient of the protocol. Which step has magnesium?" Play the provider: "Good catch: do NOT give it. Discontinue the bowel protocol. Bisacodyl 10 mg suppository. Get a KUB. No Fleet or magnesium enemas." (SBAR #6).',
        'If behind: skip 6A3, then 6B3.'),
}
CLOSING_ROS = ('1:40', 'Press 4h one last time (clock Wed 0700). Read the Situation on the Case Closed page. Monitor: 0700 row (HR 68, BP 124/70, RR 16, SpO2 96%, POC 112; weight 90.0 kg). Ray: "I feel so much better. I want a cup of coffee. I did not know all those pills were a problem." Eleanor: "What do I do with all those bottles at home?"',
               '1:40-1:45 final check (vitals, labs, Mg-o-meter whole story). 1:45-1:55 debrief huddle (questions below). Teach-back and individual reflections: do them in the last 3 minutes, or send them home to finish and turn in with the paperclip next class.',
               'If behind: shorten the timeline (page 2) to the four big stops: 1100, 1500, 1900, 0300; assign teach-back for homework.')

SKIP = {1: ['1B2', '1A2(b)'], 2: ['2B3', '2A3'], 3: ['3B4 + diagram', '3A3'], 4: ['4B3', '4A3'], 5: ['5B3', '5A3'], 6: ['6A3', '6B3']}

SCORING_EXAMPLES = [
    ('Teamwork and participation (5)', 'FULL (5): three names on the cover, initials A/B/C change at every checkpoint, the huddle boxes show three different handwritings or "who said it" notes, three peer checks.',
     'PARTIAL (3): roles rotated at four of six checkpoints, one student mostly writing. Peer checks done. (2): everyone\'s name on the cover but the same initials on every strip.'),
    ('Clinical reasoning (6)', 'FULL (1 point at a checkpoint): "Mg went 7.8 to 8.7 even with 1 L of saline and furosemide because his kidneys only made 30-55 mL/h (creatinine 4.9 to 4.8, FENa 0.6%)."',
     'HALF (0.5): "His magnesium is going up because of kidney problems" (right idea, no numbers). ZERO: blank or "I do not know" in most boxes of that checkpoint.'),
    ('Safety, priorities and SBAR (5)', 'FULL (1 point at a checkpoint): priorities start with airway/breathing or safety, a specific question ("Do you want calcium gluconate 1 g now?"), SBAR with RR 10, HR 44, BP 84/48 and "I need you at the bedside now".',
     'HALF (0.5): priorities fine but SBAR missing the Recommendation, or SBAR with no numbers. ZERO: priorities start with paperwork and no SBAR.'),
    ('Completeness and reflection (4)', 'FULL (4): all checkpoint pages finished (Mg-o-meter marked each time), timeline filled in with all seven Mg values, three plain-language tips, reflection written.',
     'PARTIAL (2 to 3): Mg-o-meter marked only some times, or timeline half done, or reflection one line. (0 to 1): last three pages blank.'),
]

DEBRIEF = [
    ('Opening (2 min)', 'Reactions: "One word for how that felt?" Every student answers. Ground rules: "We talk about what we did, not who we are."'),
    ('Q1 (guide 8.2 #1)', 'Why was Ray at such high risk for magnesium toxicity? (Failing kidneys are the only exit; three magnesium products for weeks; dehydration; kidney-hurting medicines; opioid constipation.)'),
    ('Q4 (#4)', 'Which bedside finding told you the magnesium was getting worse before the breathing failed? (Reflexes 1+ to 0; more sleepiness; low BP; slower HR; longer PR.)'),
    ('Q5 (#5)', 'Why does calcium gluconate work, and why is it not enough? (Opposes magnesium at nerve/muscle and heart for 30-60 minutes; does not lower the level; dialysis removes it.)'),
    ('Q12 (#12)', 'What is rebound and what did you do about it? (4.6, 5.6, 6.4; stored magnesium and gut magnesium; repeat levels, watch RR/reflexes, clear the bowel without magnesium.)'),
    ('Q14 (#14)', 'What was the hidden hazard at 0300? (The bowel protocol ended in milk of magnesia; question any order or protocol with magnesium in a kidney patient.)'),
    ('Q15 (#15)', 'What will you teach Ray and Eleanor and how will you know they understood? (No magnesium or NSAIDs, label reading, safe alternatives, sick-day rule, bring all bottles, warning signs; teach-back.)'),
    ('Close (1 min)', 'Each squad says its top clue (the box on closing page 2). Take-aways: ask about OTC products; reflexes and RR before SpO2; calcium protects, dialysis removes; read every order for magnesium; call early with SBAR.'),
]
