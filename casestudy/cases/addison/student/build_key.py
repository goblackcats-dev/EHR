#!/usr/bin/env python3
"""Builds the INSTRUCTOR KEY (Word + Markdown) for the Lauren Mitchell team case study.   python3 build_key.py
Writes ../INSTRUCTOR_CASESTUDY_KEY.docx and ../INSTRUCTOR_CASESTUDY_KEY.md"""
import os, sys, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from dx import *
import content2 as C
from monvals import MON, ED_VITALS, UO

OUT = os.path.join(HERE, '..')
MD = []
def md(s=''): MD.append(s)
def plain(t): return re.sub(r'\*\*(.+?)\*\*', r'\1', t)
def filled(t): return re.sub(r'\[\[(.+?)\]\]', r'**[\1]**', t)   # situation blanks with the answers shown

# what the instructor says as the provider after the team's SBAR call (taken from the orders and notes that follow each call in the chart)
PROVIDER = {
 1: 'Thanks. The 1000 hydrocortisone is time-critical: give it within 30 minutes of 1000. Keep D5NS at 150, glucose every 2 hours, BMP every 4 hours (sodium no more than 8 up in 24 hours), bed rest and telemetry. Call me for SBP under 90, glucose under 70 or any rhythm change. I am asking endocrinology and pharmacy to see her, and please send the first liquid stool for C. diff and a GI panel.',
 2: 'Good: give the D50 and recheck in 15 minutes. I will order glucose every hour twice, then every 2 hours until three readings over 70. Keep the D5NS running. Ondansetron is fine; sips when the nausea settles. Make sure the 1600 hydrocortisone is on time. I will come by.',
 3: 'Thank you for catching that. Stop the D5NS and start D5 0.45% NaCl at 100 mL/h. Keep the sodium 134 or lower until 0400 tomorrow; call me for a sodium over 134, urine over 250 mL/h for 2 hours, or any new confusion, headache or trouble speaking or swallowing. Up with one assist only; repeat orthostatics at 1900. Give the 1600 hydrocortisone on time.',
 4: '(Night hospitalist) She is responding. Keep the fluid and the sodium limit as ordered, hydrocortisone at 2200 and 0400 on time. She can walk in the room and hall with assist. Contact precautions for norovirus. Regular diet, but no extra salt or broth until 0400.',
 5: 'No diphenhydramine and no benzodiazepines. I will order melatonin 3 mg as needed. The 152 is the steroid: no insulin; call me if she is over 180 twice. Keep the bed alarm on.',
 6: 'Take out the right IV and run the fluid through the left forearm 18 g; give the 0400 hydrocortisone through it. We will recheck the potassium at 0500 and replace it if it is 3.5 or lower. Commode at the bedside, bed alarm on, and please do the safety report.',
 7: '(Day team / endocrinology plan) Give the KCl now, fludrocortisone at 0800, oral hydrocortisone 20 mg at 1000, saline lock at 1000 if she is drinking, BMP at 1300. Teach both of them with a return demonstration before discharge; case management is arranging the kits.'}

# portrayal cues for the instructor (from INSTRUCTOR_GUIDE section 4 C)
PORTRAY = {
 1: 'Drowsy, wakes to voice, oriented to person and place. "I\'m so tired... my stomach hurts... I just want some pickles. Did I miss my pills?" If they sit her up: "the room is spinning". Daniel: "Nobody ever told us what to do. We don\'t have that shot."',
 2: 'Shaky, sweaty, anxious, foggy: "Something\'s wrong... I feel like I\'m going to pass out." Give glucose **58**; if rechecked 15 minutes after D50: **142**. You may lower HR to 100 on the monitor after treatment.',
 3: '"I feel so much better. Can I go to the bathroom by myself? I have to go all the time." Orthostatics aloud: lying 108/66 HR 92; standing at 1 minute **94/60, HR 114**, "I\'m dizzy, I need to sit down." Lay her back down.',
 4: 'Alert, oriented x4, joking: "When can I go home? Ethan has a game on Thursday." Standing **104/66, HR 96**, no dizziness.',
 5: '"I\'m wired. My mind won\'t stop. Who\'s going to take Ethan to school? Can I have something to knock me out?" Standing **112/70, HR 88**. Glucose **152**.',
 6: 'Embarrassed: "I didn\'t want to bother anyone. I just got dizzy for a second." No injury. Right forearm IV: puffy, pale, cool, about 3 cm of swelling, feels "tight"; the pump has not alarmed. Glucose **128**.',
 7: '"I feel like myself. I never want to go through that again. What do I do next time Ethan gets sick?" Daniel: "Show me the shot." Standing **116/74, HR 80**. Weight **59.8 kg**. Glucose **112**.'}

HORMONE_KEY = ['Low BP that responds poorly to fluid alone (EMS 74/40; 98/60 now), HR 104; glucose 49 (ED) and 58 at EMS; nausea, vomiting, belly pain, weakness, confusion (oriented x2); temperature 99.4; eosinophils 7.0%.',
               'Sodium 126 with **urine sodium 48** while dehydrated (salt wasting); potassium 6.0 with peaked T waves; CO2 18; dehydration (dry mouth, skin tents) and prerenal kidney injury (BUN 38, creatinine 1.6); salt craving ("pickles"); dizzy sitting up.',
               'Tan/bronze skin in December, dark palm creases and knuckles, dark patches inside the cheeks. (ACTH result comes at 1440: 1,240.)']


def H(d, text, size=12, before=6, color=INK, level=2):
    P(d, text, size=size, bold=True, color=color, before=before, after=2, keep=True)
    md(('#' * level) + ' ' + plain(text)); md()


def para(d, text, size=9.6, after=3):
    P(d, text, size=size, after=after); md(plain(text)); md()


def bl(d, items, size=9.6):
    bullets(d, items, size=size)
    for i in items: md('- ' + plain(i))
    md()


def table(d, header, ws, rows, size=8.8, row_h=0.26, hfill='E4E4E4', center=None, fills=None, bold_first=False):
    grid(d, header, ws, rows, row_h=row_h, size=size, hsize=8.4, hfill=hfill, center=center, fills=fills, bold_first=bold_first, keep=False)
    md('| ' + ' | '.join(header) + ' |'); md('|' + '---|' * len(header))
    for r in rows: md('| ' + ' | '.join(plain(str(x)).replace('\n', ' ').replace('|', '/') for x in r) + ' |')
    md()


def title_page(d):
    banner(d, 'INSTRUCTOR KEY: LAUREN MITCHELL TEAM CASE STUDY', 'about 2 hours', fill=INK, size=14, h=0.45)
    md('# Instructor Key: Lauren Mitchell Team Case Study (adrenal crisis)'); md()
    H(d, 'What this is', level=2)
    para(d, 'A 2-hour team case study. The whole class (designed for 7 students) works as ONE team and cares for Lauren Mitchell (46, adrenal crisis in known Addison disease after a stomach virus) across 24 hours of patient time, **Mon 0700 to Tue 0700**. The class advances **4 hours together** (0700, 1100, 1500, 1900, 2300, 0300, then a final check at 0700). The packet is 12 pages: cover, patient card with a hormone map and two EHR screenshots, the rubric with a **response tracker**, one page per checkpoint, two final pages (evaluation, then teaching and discharge) and an individual reflection.')
    para(d, '**Focus:** pathophysiology (cortisol and aldosterone missing: low sodium, high potassium, low volume, low glucose; high ACTH: dark skin), assessment, the standard treatment plan (stress-dose hydrocortisone on time, fluids, dextrose, fludrocortisone held then restarted), and **evaluation** of the response (the tracker every stop and the evaluation table at the end).')
    H(d, 'Roles and pairs (7 students, one team)', level=2)
    bl(d, ['**Charge nurse** (rotates; each student has exactly one stop): runs the section, keeps time, **gets the findings from each pair when the pair is finished**, decides the top 3 priorities (writes their name in that box), then develops and gives the SBAR. The questions are NOT printed for students: they learn to ask them. The "questions a strong charge nurse asks" in each section below are for you to prompt with only if a team is stuck.',
           '**Meds & Treatments pair:** MAR, orders, notes: what is running, due, held or should change, and why.',
           '**Vitals & Assessment pair:** read the bedside monitor and write the vitals row, orthostatic vitals, the bedside exam (mental status, skin, mouth, belly), intake and output. **Fills the response tracker column at every stop.**',
           'The **Vitals & Assessment** and **Meds & Treatments** pairs work together on "Actions to suggest" at every stop. Every student has their own packet, writes their name in the header and writes their pair\'s names in their pair box.',
           '**Results & Labs pair:** new labs, ECGs, trends and what they mean (sodium rate, potassium, glucose, cortisol/ACTH).',
           '**Pairs switch jobs at every checkpoint.** With 7 students: 1 charge nurse + 3 pairs. You (or the charge nurse) assign the jobs at the start of each stop; students write their names in their pair box. Each student is charge nurse once (7 stops).',
           'At each stop the old charge nurse takes the new charge nurse\'s place in that pair.'])
    H(d, 'Before class', level=2)
    bl(d, ['Print **one packet per student** (7), single-sided. Each student writes their name in the header; the last page is their individual reflection and peer check.',
           'Load the EHR: Pre-Built Patients > Case Study Patients > Lauren Mitchell (or Import with casestudy/cases/addison/patient.json). Check that the clock reads **Mon 07:00** (4W-22, SIM-40422).',
           'Open the bedside monitor (Monitor button) in the same browser; it loads Lauren\'s built-in scenario by MRN and follows the 4h button. The monitor BP is **lying**: you say the standing values aloud.',
           '**There are no vital signs or bedside glucoses in the chart after 0700.** You give the glucose and the standing values aloud (in each checkpoint section below). Ignore the instructor-only "Suggested vitals" bar on the Flowsheets page (it repeats the 0700 set).',
           'Optional moulage: bronzer on the face, neck and backs of the hands, darker palm creases; sweat spray at 1100.'])
    H(d, 'Rules that protect the pacing', level=2)
    bl(d, ['Students finish a page at the **end** of its time block. Nothing on a later page is printed on an earlier one (checked by check_facts.py). Do not let anyone turn the page until you advance the clock.',
           'Every number in this key matches the chart (patient.json), the instructor guide and the monitor. If the team and the key disagree, check the chart.',
           'Answers can differ from the model. Look for chart numbers and a reason, not exact wording.'])


def run_of_show(d):
    page_top(d)
    H(d, 'Run of show (about 2 hours)', size=14, before=0, level=2)
    para(d, 'Each checkpoint follows the same 13-14 minute rhythm. The final 0700 gets 17 minutes because it has two pages.', after=1)
    table(d, ['Clock', 'Minutes', 'What the instructor does'], [0.9, 1.0, 5.4], [
        ['Start', '0:00-0:05', 'Welcome. Everyone sits together as one team; pick the 0700 charge nurse and assign the three pair jobs (they switch every stop). Read the quick pathophysiology on the cover together. Walk through the patient card and hormone map (page 2), the rubric and the response tracker (page 3). Student A is charge nurse at 0700.'],
        ['0700', '0:05-0:19', 'Do NOT press 4h (the 0700 set is in the chart). Read the situation. The charge nurse gets each pair\'s findings; the team also fills the hormone map (page 2) and the 0700 tracker column; SBAR call to you (warm-up, not scored).'],
        ['1100', '0:19-0:33', 'Press **4h** (Mon 1100). New charge nurse; pairs switch jobs. Give the glucose **58** when they check. Watch for juice vs D50 and for checking the 1000 hydrocortisone.'],
        ['1500', '0:33-0:47', 'Press **4h** (Mon 1500). New charge nurse; pairs switch jobs. Give the standing values when they do orthostatics. Watch for the sodium calculation (+6 in 9 h) and the call.'],
        ['1900', '0:47-1:01', 'Press **4h** (Mon 1900). New charge nurse; pairs switch jobs. The fluid change happened at 1530. Watch for evaluation with numbers ("is it working?").'],
        ['2300', '1:01-1:14', 'Press **4h** (Mon 2300). New charge nurse; pairs switch jobs. Watch for sedative requests and insulin for 152.'],
        ['0300', '1:14-1:27', 'Press **4h** (Tue 0300). New charge nurse; pairs switch jobs. Describe the infiltrated right forearm IV when they look. Watch for the plan for the 0400 IV dose.'],
        ['Final 0700', '1:27-1:44', 'Press **4h** (Tue 0700). New charge nurse; pairs switch jobs. Page 1: pairs, tracker, evaluation table and verdict. Page 2: handoff, steroid plan, sick-day rules, the injection (return demonstration with a training vial if you have one), ID, teach-back, readiness.'],
        ['Reflection', '1:44-1:50', 'Each student completes their own reflection and peer check (page 12). Collect the 7 packets.'],
        ['Debrief', '1:50-2:00', 'Use the debrief questions at the end of this key. Put the tracker on the board.']], size=8.5, row_h=0.24)
    H(d, 'The same 14 minutes, one checkpoint', size=11, level=3)
    table(d, ['Minute', 'What happens'], [1.0, 6.3], [
        ['+0', 'Press 4h (except at the first 0700). Check the monitor moved to the new row. Read the situation aloud. Remind them the charge nurse changed.'],
        ['+1 to +3', 'Everyone fills the situation blanks from the chart. Pairs decide what to look for (no questions are printed; prompt with the questions below only if a pair is stuck). Give glucose and standing values aloud when they ask or check.'],
        ['+3 to +10', 'Pairs work the chart, the monitor and "Lauren", write in their box with their names, and report to the charge nurse when finished. Vitals & Assessment + Meds & Treatments agree on actions to suggest; Vitals & Assessment fills the tracker column. Ask a charge nurse "what is your team deciding?"'],
        ['+10 to +13', 'The charge nurse decides the top 3 priorities, then gives you the SBAR. Answer as the provider with the suggested reply. Keep it short.'],
        ['+13 to +14', 'Check that the tracker column and the prediction are written. Then advance.']], size=8.5, row_h=0.22)
    H(d, 'Monitor and bedside values at a glance', size=11, level=3)
    rows = []
    for n in range(1, 8):
        m = MON[n]
        rows.append([m['clock'], m['temp'], m['hr'], f"{m['bp']} ({m['map']})", m['stand'], m['rr'], m['spo2'].replace(' room air', ' RA'), m['pain'].split(' ')[0], m['rhythm'], m['glucose']])
    table(d, ['Stop', 'T', 'HR', 'BP lying (MAP)', 'Standing (say aloud)', 'RR', 'SpO2', 'Pain', 'Rhythm', 'Glucose (say aloud)'], [0.62, 0.38, 0.35, 0.75, 1.5, 0.3, 0.55, 0.38, 1.47, 1.0], rows, size=7.0, row_h=0.2)


def vit_text(m):
    return f"HR {m['hr']}, BP {m['bp']} lying (MAP {m['map']}), RR {m['rr']}, SpO2 {m['spo2']}, temp {m['temp']}, pain {m['pain']}; rhythm: {m['rhythm']}. **Standing (aloud):** {m['stand']}. **Bedside glucose (aloud):** {m['glucose']}"


def lab_tables(d, labs):
    for lb in labs:
        cols = ['Test', 'Normal'] + lb['times']
        rows = [[C.SHORT.get(nm, nm), C.NORMAL[nm]] + v for nm, v in lb['rows']]
        nt = len(lb['times'])
        table(d, cols, [2.0, 1.9] + [(7.3 - 3.9) / nt] * nt, rows, size=8.4, row_h=0.21, center=list(range(2, len(cols))))


def answers(d, n, cp, label):
    page_top(d)
    H(d, f'{cp["time"]} {cp["day"]}: {label}', size=14, before=0, level=2)
    k = cp['key']
    para(d, '**Monitor (the NOW row):** ' + vit_text(MON[n]), size=8.8)
    para(d, '**Urine and I&O for the Vitals pair:** ' + UO[n], size=8.6)
    para(d, '**Portray:** ' + PORTRAY[n], size=8.6)
    para(d, '**Situation (blanks with answers in brackets):** ' + ' '.join(filled(x) for x in cp['sit']), size=8.6)
    para(d, '**Questions a strong charge nurse asks (not printed for students; prompt only if stuck):** ' + ' '.join(f'**{k}:** ' + v.replace('Charge asks: ', '') for k, v in (('Meds & Treatments', cp['ask']['M']), ('Vitals & Assessment', cp['ask']['A']), ('Results & Labs', cp['ask']['R']))), size=8.4)
    H(d, 'New results (chart values)', size=10.5, before=2, level=3)
    lab_tables(d, cp['labs'])
    rows = [['MEDS & TREATMENTS pair', k['meds']], ['VITALS & ASSESSMENT pair', k['noticed']], ['RESULTS & LABS pair: new results and significance', k['results']],
            ['Response tracker column (Vitals & Assessment pair)', k['track'].replace(' | ', ';  ')]]
    if n != 1: rows.append(['What changed since the last stop', k['changed']])
    rows += [['Actions to suggest (Vitals & Assessment + Meds & Treatments)', k['nxt']],
            ['TEAM (charge): top 3 priorities', '1) ' + k['pri'][0] + '  2) ' + k['pri'][1] + '  3) ' + k['pri'][2]],
            ['TEAM (charge): SBAR' + (' (warm-up, not scored)' if n == 1 else ''), f'**S:** {k["S"]}  **B:** {k["B"]}  **A:** {k["A"]}  **R:** {k["R"]}']]
    if 'pred' in k: rows.append(['Prediction (no wrong answers)', k['pred']])
    rows.append(['Charge nurse notes', 'Look for: each pair was asked its question, the charge nurse decided, a time check. Credit any honest notes.'])
    table(d, ['Box', 'Model answer and rationale'], [1.7, 5.6], rows, size=8.5, row_h=0.26, bold_first=True)
    if n == 1:
        H(d, 'Hormone map (page 2): model answers for "What Lauren shows"', size=10.5, before=2, level=3)
        table(d, ['Hormone', 'What Lauren shows'], [1.7, 5.6], [[h, s] for (h, _), s in zip(C.HORMONES, HORMONE_KEY)], size=8.5, row_h=0.26, bold_first=True)
    para(d, '**Instructor as the provider (suggested reply):** ' + PROVIDER[n], size=9)


def final_pages(d):
    cp = dict(C.CLOSE)
    answers(d, 7, cp, 'Final check (page 1 of 2)')
    k = cp['key']
    H(d, 'Evaluation table (final page 1): model', size=10.5, before=4, level=3)
    table(d, ['Criterion', 'Goal', 'At arrival (Mon 0700)', 'Now (Tue 0700)', 'Met?'], [1.4, 1.9, 1.4, 1.75, 0.85], [list(e) for e in C.EVAL], size=8.2, row_h=0.24, bold_first=True)
    para(d, '**Verdict (model):** The treatment is effective: BP normal with negative orthostatics, HR 74 with normal T waves, oriented x4, glucose stable without dextrose since 1105 Monday, eating, creatinine back to 0.8, and the sodium corrected to 134 without passing the limit. One loose end: potassium 3.5 and falling (KCl now, BMP 1300).', size=9)
    page_top(d)
    H(d, 'Final page 2: teaching and discharge (model answers)', size=14, before=0, level=2)
    table(d, ['Box', 'Model answer'], [1.7, 5.6], [
        ['Handoff to the day team (SBAR), priorities, what changed, actions to suggest', 'Use the SBAR, priorities, "what changed" and actions on the previous page.'],
        ['Meds pair: the steroid plan at home', k['meds'].split(' **KCl')[0]],
        ['Sick-day rules, the emergency injection, medical ID', k['teach']],
        ['Teach-back question', 'For example: "Tell me what you will do if Ethan\'s stomach bug comes back and you vomit your morning dose twice." (Model: take the dose again once if vomited within 30 minutes; if she vomits again: Daniel gives 100 mg IM in the outer thigh and calls 911.) Ask Daniel too: "Show me how you would give the shot."'],
        ['Is she ready to go home?', k['ready']],
        ['The story of the stay (for the debrief)', k['story']]], size=8.5, row_h=0.28, bold_first=True)
    H(d, 'Response tracker: the whole model (page 3)', size=11, level=3)
    heads = ['Measure'] + ['Mon 0700', 'Mon 1100', 'Mon 1500', 'Mon 1900', 'Mon 2300', 'Tue 0300', 'Tue 0700']
    cols = [C.CP[i]['key']['track'].split(' | ') for i in range(1, 7)] + [C.CLOSE['key']['track'].split(' | ')]
    rows = [[C.TRACKER[r][0]] + [c[r] for c in cols] for r in range(len(C.TRACKER))]
    table(d, heads, [1.0] + [6.3 / 7] * 7, rows, size=7.0, row_h=0.24, bold_first=True)


def rubric_guide(d):
    page_top(d)
    H(d, 'Scoring guide (20 points, three levels)', size=14, before=0, level=2)
    para(d, 'Give ONE group score from the shared packet (group score sheet, next page) plus an individual check (/4) for each of the 7 students. Be generous: complete and thoughtful earns full credit.')
    rows = [[r['cat'] + f'  ({r["pts"]})', plain(r['full']), plain(r['good']), plain(r['start'])] for r in C.RUBRIC]
    table(d, ['Category', 'Full credit', 'Good', 'Getting there'], [1.6, 2.1, 1.8, 1.8], rows, size=8.2, row_h=0.6, bold_first=True)
    H(d, 'How the points add up', size=11, level=3)
    table(d, ['Category', 'Where the points come from'], [2.3, 5.0], [[r['cat'] + f' ({r["pts"]})', r['how']] for r in C.RUBRIC], size=8.4, row_h=0.3)
    H(d, 'Examples', size=11, level=3)
    table(d, ['Category', 'Example of full credit', 'Example of partial credit'], [1.6, 3.0, 2.7], [
        ['Clinical thinking (1500)', 'Results box: "Na 126 to 132 = +6 in 9 h; limit 8/24 h; too fast. Cortisol 1.8 + ACTH 1,240 = primary AI (gland), explains tan skin and fludrocortisone." Vitals box: "standing 94/60 HR 114, dizzy = positive."', '"Sodium better. Cortisol low." (no numbers, no rate, no meaning): give half.'],
        ['Safety and SBAR (1100)', 'Priorities: D50 now and recheck in 15 min; check the 1000 hydrocortisone; fall precautions. SBAR with all 4 parts and a clear request (glucose checks, ondansetron, come and see her).', 'Juice for a nauseated, foggy patient, or an SBAR with no recommendation: 0 for that stop.'],
        ['Safety and SBAR (2300)', '"No diphenhydramine or benzodiazepines; melatonin and non-drug sleep measures; 152 is a steroid effect, no insulin; bed alarm."', 'Asks for a sleeping pill without naming the fall risk.'],
        ['Completeness', 'Tracker filled at all 7 stops, the evaluation table done with arrival and now numbers and a verdict.', 'Tracker missing 3 stops: lose the tracker point.']], size=8.2, row_h=0.4, bold_first=True)
    H(d, 'Reflection and peer check', size=11, level=3)
    bl(d, ['Reflection (3 boxes): 2 points on the individual sheet for honest answers with a reason (1 if thin). It also feeds the group "reflections handed in" point.',
           'Peer check: 1 point for handing it in. Use it to spot a team where one person did most of the work; read comments privately.',
           'If the team did not rotate the charge nurse, cap Teamwork at 3 and ask why in the debrief.'])


def score_sheet(d):
    page_top(d)
    H(d, 'GROUP SCORE SHEET', size=14, before=0, level=2)
    P(d, 'Team name: ______________________________   Date: ____________   (one group score, then 7 individual checks)', size=9.4, after=4)
    md('Team name: ____________  Date: ________'); md()
    H(d, 'Checkpoint check (tick what you see)', size=11, level=3)
    cols = ['Page', 'Charge nurse named', 'Pair boxes with numbers', '3 priorities', 'SBAR complete', 'Tracker column', 'Prediction']
    rows = [[x] + ['☐'] * 6 for x in ('0700 (SBAR warm-up)', '1100', '1500', '1900', '2300', '0300')] + [['Final 0700', '☐', '☐', '☐', '☐', '☐', 'Evaluation ☐']]
    table(d, cols, [1.3, 1.1, 1.2, 0.9, 0.9, 0.9, 1.0], rows, size=9.4, row_h=0.26, center=list(range(1, 7)))
    H(d, 'Rubric', size=11, level=3)
    cols = ['Category', 'Full', 'Good', 'Getting there', 'Points', 'Notes']
    rows = [['Teamwork and charge-nurse rotation (5)', '☐ 5', '☐ 3-4', '☐ 1-2', '/ 5', ''], ['Clinical thinking at each checkpoint (6)', '☐ 6', '☐ 4-5', '☐ 1-3', '/ 6', ''],
            ['Safety, priorities and SBAR (5)', '☐ 5', '☐ 3-4', '☐ 1-2', '/ 5', ''], ['Completeness and reflection (4)', '☐ 4', '☐ 2-3', '☐ 1', '/ 4', ''], ['GROUP TOTAL', '', '', '', '/ 20', '']]
    table(d, cols, [2.3, 0.6, 0.7, 0.9, 0.7, 2.1], rows, size=8.8, row_h=0.4, center=[1, 2, 3, 4])
    H(d, 'Individual check (7 students)', size=11, level=3)
    table(d, ['Student', 'Charge turn (1)', 'Reflection (2)', 'Peer check (1)', 'Individual /4'], [2.1, 1.2, 1.3, 1.2, 1.5],
          [['________________________', '☐', '☐ 2  ☐ 1', '☐', ''] for _ in range(7)], size=9, row_h=0.3, center=[1, 2, 3])
    P(d, 'Comments for the team:', size=9.4, bold=True, after=1, before=3)
    lines(d, 2)


def debrief(d):
    page_top(d)
    H(d, 'Debrief questions (about 10 minutes; pick 8 to 10)', size=14, before=0, level=2)
    para(d, 'From the instructor guide, section 8. Put the trends on the board first: Na ' + ', '.join(v for _, v in C.TIMELINE_NA) + '; K ' + ', '.join(v for _, v in C.TIMELINE_K) + '; SBP 98, 94, 108, 112, 116, 118, 120; glucose 88, 58 (142), 118, 142, 152, 128, 112.', size=9)
    rows = [[str(i), topic, q] for i, (topic, q) in enumerate(C.DEBRIEF, 1)]
    table(d, ['#', 'Topic', 'Question'], [0.35, 1.0, 5.95], rows, size=9, row_h=0.4, center=[0])
    H(d, 'Ideas for good answers', size=11, level=3)
    bl(d, C.DEBRIEF_IDEAS, size=9.2)
    H(d, 'Take-aways to close with', size=11, level=3)
    bl(d, ['Known adrenal insufficiency + vomiting = emergency; steroid first, tests never delay it.', 'Hydrocortisone is time-critical: on time, never held for "good" numbers.',
           'High-dose hydrocortisone covers aldosterone too; fludrocortisone comes back at 50 mg/day.', 'Evaluate with data: BP and orthostatics, HR and T waves, glucose, mental status, urine, sodium and potassium.',
           'A rising sodium can be dangerous: count the change from the first value and the hours; watch the urine.', 'Falls happen when patients feel better. Teach to prevent the next crisis.'], size=9.2)


def build():
    d = new_doc('INSTRUCTOR KEY (not for students)', 'Lauren Mitchell Team Case Study  |  Page', 'Instructor copy. Every number matches the chart (patient.json), the instructor guide and the monitor.', top=0.62, bottom=0.45)
    title_page(d); run_of_show(d)
    for n in range(1, 7): answers(d, n, C.CP[n], C.CP[n]['title'])
    final_pages(d)
    rubric_guide(d); score_sheet(d); debrief(d)
    d.save(os.path.join(OUT, 'INSTRUCTOR_CASESTUDY_KEY.docx'))
    open(os.path.join(OUT, 'INSTRUCTOR_CASESTUDY_KEY.md'), 'w').write('\n'.join(MD) + '\n')
    print('key written')


if __name__ == '__main__':
    build()
