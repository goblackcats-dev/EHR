#!/usr/bin/env python3
"""Builds the INSTRUCTOR KEY (Word + Markdown) from the same content files as the student packet.   python3 build_key.py
Writes ../INSTRUCTOR_CASESTUDY_KEY.docx and ../INSTRUCTOR_CASESTUDY_KEY.md"""
import os, sys, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from dx import *
from content_cp import CPS, MON, ED_VITALS, K
import content_front as F
import key_content as KC

OUT = os.path.join(HERE, '..')
MD = []


def plain(t): return re.sub(r'\*\*(.+?)\*\*', r'\1', t)
def md(line=''): MD.append(line)


def blocks_of(c):
    out = []
    for b in c['c_boxes']: out.append(('C', b))
    for b in c['a_blocks']: out.append(('A', b))
    for b in c['b_blocks']: out.append(('B', b))
    return [(r, b) for r, b in out if b.get('id')]


def key_entry(d, role, b):
    k = b['key']
    kk = k if isinstance(k, dict) and 'ans' in k and 'rows' not in k else None
    title = f"{b['id']}  {b['head']}" + ('  (stretch)' if b.get('stretch') else '')
    P(d, title, size=10.5, bold=True, color=INK, before=5, after=1, keep=True)
    md(f"#### {title}"); 
    P(d, plain(b['prompt']), size=8.8, italic=True, color='555555', after=2, keep=True); md(f"*Student prompt:* {plain(b['prompt'])}")
    if 'rows' in k:
        cols = b['cols']
        rows = k['rows']
        if len(cols) == len(rows[0]) + 1 and len(cols) > 3: cols = [x for x in cols if x != 'Normal']
        grid(d, cols if len(cols) == len(rows[0]) else ['Item', 'Expected', 'Chart source'][:len(rows[0])], [7.3 / len(rows[0])] * len(rows[0]) if len(rows[0]) != 4 or True else None, rows, row_h=0.2, size=8.5, hsize=8.2, keep=False)
        md('| ' + ' | '.join(cols if len(cols) == len(rows[0]) else ['Item', 'Expected', 'Chart source'][:len(rows[0])]) + ' |'); md('|' + '---|' * len(rows[0]))
        for r in rows: md('| ' + ' | '.join(str(x) for x in r) + ' |')
        ans, why, look, miss = k.get('ans', ''), k.get('why', ''), k.get('look', ''), k.get('miss', '')
    else:
        ans, why, look, miss = k['ans'], k['why'], k['look'], k['miss']
    for lab, txt in (('Model answer', ans), ('Why (tied to the chart)', why), ('Look for', look), ('Common misses', miss)):
        if txt:
            p = P(d, '', size=9, after=1.5, keep=False); run(p, lab + ': ', bold=True, size=9, color=INK); rich(p, txt, size=9)
            md(f"- **{lab}:** {plain(txt)}")
    md()


def huddle_entries(d, n, c):
    for lab, key, prompt_ in ((f'{n}T1  Top 3 priorities', c['pri_key'], c['pri_prompt']), (f'{n}T2  One question for the provider', c['q_key'], c['q_prompt']), (f'{n}T3  SBAR', c['sbar_key'], c['sbar_prompt'])):
        P(d, lab, size=10.5, bold=True, color='4B3F72', before=5, after=1, keep=True); md(f'#### {lab}')
        P(d, plain(prompt_), size=8.8, italic=True, color='555555', after=2, keep=True); md(f'*Student prompt:* {plain(prompt_)}')
        for lb, t in (('Model answer', key['ans']), ('Why', key['why']), ('Look for', key['look']), ('Common misses', key['miss'])):
            if t:
                p = P(d, '', size=9, after=1.5); run(p, lb + ': ', bold=True, size=9, color=INK); rich(p, t, size=9); md(f'- **{lb}:** {plain(t)}')
        md()
    P(d, f'{n}P  Predict the plot twist (bonus)', size=10.5, bold=True, color='4B3F72', before=5, after=1); md(f'#### {n}P  Predict the plot twist (bonus)')
    p = P(d, '', size=9, after=2); rich(p, 'No wrong answers. Give the bonus credit for any thoughtful guess with a reason. What actually happens next: see the next checkpoint. Clue card: **' + plain(c['clue'][0]) + '**: ' + plain(c['clue'][1]), size=9)
    md('No wrong answers. Give the bonus credit for any thoughtful guess with a reason. Clue card: **' + plain(c['clue'][0]) + '**: ' + plain(c['clue'][1])); md()


def mon_table(d, n):
    m = MON[n]
    rows = [['Temp (F)', m['temp']], ['HR', m['hr']], ['BP (MAP)', f"{m['bp']} ({m['map']})"], ['RR', m['rr']], ['SpO2 / O2', m['spo2']] + ([]), ['EtCO2', m['etco2'] or 'not shown'], ['Pain', m['pain']], ['Rhythm', m['rhythm']], ['POC glucose', m['glucose']]]
    grid(d, ['Set the monitor to', 'Value'], [1.8, 5.5], rows, row_h=0.2, size=8.8, hsize=8.4, bold_first=True)
    md('| Set the monitor to | Value |'); md('|---|---|')
    for r in rows: md(f'| {r[0]} | {r[1]} |')
    md()


def build():
    d = new_doc('INSTRUCTOR KEY: The Case of the Silent Mineral', 'DO NOT GIVE TO STUDENTS  |  page', 'Instructor key. Every number matches patient.json and INSTRUCTOR_GUIDE.md (student/check_facts.py).', top=0.75)
    # ---------------- cover
    banner(d, 'INSTRUCTOR KEY AND RUN OF SHOW', 'not for students', fill='7A1F2B', size=17, sub='The Case of the Silent Mineral: Raymond "Ray" Kessler, hypermagnesemia with AKI on CKD 4 (2-hour group case study)')
    md('# INSTRUCTOR KEY: The Case of the Silent Mineral'); md('*Not for students. Patient: Raymond "Ray" Kessler, 74, room 5E-14, Tue 11/17/2026 0700 to Wed 11/18/2026 0700. Student packet: `CASE_STUDY_PACKET.docx/.pdf`. Source of truth for the chart: `DESIGN.md` and `patient.json`; monitor settings and patient portrayal: `INSTRUCTOR_GUIDE.md` section 4.*'); md()
    P(d, 'HOW TO USE THIS KEY', size=11, bold=True, color=INK, after=2); md('## How to use this key')
    items = ['Print one student packet per squad (2 to 3 students). Open the EHR with Ray (Pre-Built Patients > Case Study Patients > Raymond Kessler) on the instructor screen, clock **Tue 0700**. Students use their own devices with the same patient and synced time.',
             'Open `monitor.html` on the projector (it follows the clock). Each checkpoint you press **4h**, read the Situation, and the monitor changes to that checkpoint. The Bedside Nurse reads the vitals from the monitor and charts them.',
             'Squads rotate three jobs: A Chart Detective, B Lab Interpreter, C Bedside Nurse. Two-person squads: Desk (A+B) and Bedside (C), swapping each checkpoint; skip stretch boxes.',
             'The packet is 27 pages: cover, rubric, patient card, role cards, handoff, six checkpoint sections (3 pages each; the 1500 section is 4), and 3 Case Closed pages. Students must not read ahead.',
             'This key lists a model answer for every box: the answer, why (tied to the chart), what to look for, common misses. Full credit means complete and thoughtful, not word-for-word.']
    bullets(d, items, size=9.4)
    for it in items: md('- ' + plain(it))
    md()
    callout(d, 'THREE THINGS THAT GO WRONG', ['**1.** Squads that finish early read ahead: say "stay on your page until I press 4h".', '**2.** Nobody asks Eleanor about OTC products at 0700: release her line at about 0:16 (see 0700 row).', '**3.** A student gives a magnesium product or a sedative in the EHR: pause, debrief it right there (see INSTRUCTOR_GUIDE.md section 9), then reset the monitor.'], fill='FFF8E1', size=9.2)
    md('**Three things that go wrong:** (1) squads read ahead; (2) nobody asks Eleanor about OTC products at 0700 (release her line at about 0:16); (3) a student gives a magnesium product or sedative: pause and debrief it (guide section 9).'); md()

    # ---------------- run of show
    page_top(d); banner(d, 'RUN OF SHOW: ABOUT 2 HOURS, MINUTE BY MINUTE', 'press 4h at the end of each segment', fill=INK, size=14, h=0.4)
    md('## Run of show (about 2 hours)'); md()
    rows = []
    t0 = KC.ROS[0]
    rows.append([t0[0] + '\n' + t0[1], t0[2], '\n'.join(t0[3]) + '\n' + t0[4], '', t0[5]])
    for n in range(1, 7):
        st, what, circ, skip = KC.CP_ROS[n]
        cc = CPS[n]
        rows.append([st + '\n15 min', f"CHECKPOINT {n}: {cc['day']} {cc['time']}  ({cc['title'].split(': ')[1]})", f'{what}\n\n{circ}\n\nTimeline inside the 15 min: :00-:02 read Situation and set monitor; :02-:10 role boxes; :10-:14 team huddle; :14-:15 collect and press 4h.', '', skip])
    cl = KC.CLOSING_ROS
    rows.append([cl[0] + '\n15 min', 'CASE CLOSED: Wed 0700 (final check and debrief huddle)', cl[1] + '\n\n' + cl[2], '', cl[3] if False else 'If behind: shorten the timeline to four stops; teach-back as homework.'])
    grid(d, ['Start', 'Segment', 'What the instructor does (read, portray, circulate)', 'If running behind'], [0.55, 1.1, 4.6, 1.05], [[r[0], r[1], r[2], r[4]] for r in rows], row_h=0.2, size=7.8, hsize=7.8, keep=False)
    for r in rows:
        md(f"- **{r[0].replace(chr(10), ' ')} {r[1]}**: {plain(r[2]).replace(chr(10), ' ')}  *If behind:* {r[4]}")
    md(); md('Skip order if running behind (never skip vitals, the Mg-o-meter, priorities or SBAR): ' + '; '.join(f"{n}: {', '.join(v)}" for n, v in KC.SKIP.items())); md()
    P(d, 'Monitor pointer for every row: INSTRUCTOR_GUIDE.md section 4 lists the exact monitor table (B), bedside script (C), chart contents (D), expected actions (E) and prompts (F) for each checkpoint. Section 5 is the release schedule if you use 1h or Next event instead of 4h. Section 6 holds the model SBARs.', size=8.8, italic=True, color=GRAY, before=3)

    # ---------------- opening
    page_top(d); banner(d, 'OPENING: HANDOFF AND ROLES', 'Tue 0655-0700', fill=INK, size=14, h=0.4); md('## Opening: handoff and roles')
    P(d, 'Read aloud as the ED nurse (K. Ortiz, RN):', size=9.6, bold=True, after=2); md('Read aloud as the ED nurse (K. Ortiz, RN):')
    for ln in KC.HANDOFF_SCRIPT: P(d, ln, size=9.2, after=3, indent=0.15); md('> ' + ln)
    md()
    for h in F.HANDOFF_PROMPTS:
        key_entry(d, 'H', dict(id=h['id'], head=h['head'], prompt=h['prompt'], key=h['key']))
    P(d, 'Not scored by itself: the handoff listening notes feed the Teamwork and Clinical reasoning impressions. The rhythm decoder (strips A, B, C) and the reflex scale are reference tools for the Lab Interpreter and the Bedside Nurse.', size=8.8, italic=True, color=GRAY)
    md('*The handoff listening notes are not scored by themselves. The rhythm decoder and reflex scale are reference tools.*'); md()

    # ---------------- checkpoints
    for n in range(1, 7):
        c = CPS[n]
        page_top(d)
        banner(d, f"CHECKPOINT {n}: {c['title'].split(': ')[1].upper()}", f"{c['day']} {c['time']}  |  {'4' if c.get('four') else '3'} student pages", fill=INK, size=13.5, h=0.4)
        md(f"## Checkpoint {n}: {c['title'].split(': ')[1]} ({c['day']} {c['time']})"); md()
        P(d, 'Read-aloud Situation (also printed in the packet):', size=9.2, bold=True, after=1); md('**Read-aloud Situation:**')
        for ln in c['situation']: P(d, plain(ln), size=8.8, after=2, indent=0.12); md('> ' + plain(ln))
        md()
        mon_table(d, n)
        P(d, 'Expected exam findings (what the Bedside Nurse should find and chart; portray these):', size=9.2, bold=True, after=1, keep=True); md('**Expected bedside findings:**')
        grid(d, ['Check', 'Expected finding'], [2.3, 5.0], [[a, b] for a, b in c['exam']], row_h=0.2, size=8.4, hsize=8.2)
        for a, b in c['exam']: md(f'- {a}: {b}')
        md()
        P(d, f"Skip order if behind: {', '.join(KC.SKIP[n])}. Safety/SBAR point: {'yes (1)' if c['safety_scored'] else 'warm-up only (not scored)'}.", size=8.8, italic=True, color=GRAY, after=2); md(f"*Skip order if behind: {', '.join(KC.SKIP[n])}. Safety/SBAR point: {'yes (1)' if c['safety_scored'] else 'warm-up only (not scored)'}.*"); md()
        for role, b in blocks_of(c):
            if role == 'C' and False: pass
            key_entry(d, role, b)
        m = c['mg']
        key_entry(d, 'M', dict(id=m['id'], head='Mg-o-meter', prompt=m['level_prompt'], key=m['key']))
        huddle_entries(d, n, c)

    # ---------------- closing
    page_top(d); banner(d, 'CASE CLOSED: KEY', 'Wed 0700', fill=INK, size=14, h=0.4); md('## Case Closed: key'); md()
    P(d, 'Final check (Wed 0700)', size=10.5, bold=True, color=INK, after=1); md('### Final check (Wed 0700)')
    mon_table(d, 7)
    ex = [('Level of consciousness', 'Awake, alert, oriented x4, CAM negative, full sentences'), ('Breathing', 'RR 16'), ('Reflexes and grip', 'Reflexes 2+ (normal), grip strong'), ('Lungs, neck veins, ankles', 'Fine crackles at both bases, trace ankle edema, neck veins mildly up'),
          ('Abdomen and stool', 'Soft, bowel sounds active, passing gas; large stool at 0345'), ('Urine and weight', 'Last hour 85 mL (0300-0700 hourly 55, 65, 75, 85 = 280 mL); weight 90.0 kg (88.0 on arrival)')]
    grid(d, ['Check', 'Expected'], [2.3, 5.0], [list(x) for x in ex], row_h=0.2, size=8.4, hsize=8.2)
    for a, b in ex: md(f'- {a}: {b}')
    md()
    lab = [['Magnesium', '10.9 (Tue 1315)', '5.3'], ['Potassium', '5.8 (Tue 1315)', '4.3'], ['Creatinine', '5.3 (Tue 1315)', '3.3']]
    grid(d, ['Test', 'Worst', 'Wed 0500 (final)'], [2.3, 2.5, 2.5], lab, row_h=0.2, size=8.8, hsize=8.4)
    md('| Test | Worst | Wed 0500 |'); md('|---|---|---|')
    for r in lab: md('| ' + ' | '.join(r) + ' |')
    md()
    p = P(d, '', size=9, after=2); rich(p, '**Whole-story Mg-o-meter (all draws, mg/dL):** Oct 20 2.4; Tue 0440 7.8; 0900 8.7; 1115 9.5; 1315 10.9; 1700 7.2; 1800 4.6; 2100 5.6; Wed 0100 6.4; 0500 5.3. Arrows: calcium gluconate first given in the ED at 0555 (before the 0440 draw result), dialysis 1500-1800, hidden magnesium caught at 0300 (bowel protocol) and in the 0700 bag.', size=9)
    md('**Whole-story Mg-o-meter (mg/dL):** Oct 20 2.4; Tue 0440 7.8; 0900 8.7; 1115 9.5; 1315 10.9; 1700 7.2; 1800 4.6; 2100 5.6; Wed 0100 6.4; 0500 5.3.'); md()
    P(d, 'Timeline model (page 2 of the closing)', size=10.5, bold=True, color=INK, after=1, before=4, keep=True); md('### Timeline model')
    grid(d, ['Stop', 'Mg', 'Big problem', 'What a good squad did'], [0.8, 0.6, 2.9, 3.0], [[t['time'], t['mg'], t['big'], t['act']] for t in F.TIMELINE], row_h=0.2, size=8.2, hsize=8.2)
    md('| Stop | Mg | Big problem | What a good squad did |'); md('|---|---|---|---|')
    for t in F.TIMELINE: md(f"| {t['time']} | {t['mg']} | {t['big']} | {t['act']} |")
    md()
    k = F.TIMELINE_KEY
    for lb, t in (('Scoring', k['look']), ('Common misses', k['miss'])):
        p = P(d, '', size=9, after=1.5); run(p, lb + ': ', bold=True, size=9, color=INK); rich(p, t, size=9); md(f'- **{lb}:** {t}')
    key_entry(d, 'T', dict(id='CT', head='Teach-back to Eleanor', prompt=F.TEACHBACK_SCENE, key=F.TEACHBACK_KEY))
    P(d, 'Reflection strips and peer check: scored individually (1 point each, see score sheet). Any honest, specific reflection earns the point: "one thing I did well, one thing I will do differently, one question".', size=9, after=2); md('Reflection strips and peer check: scored individually (1 point each). Any honest, specific reflection earns the point.'); md()

    # ---------------- rubric scoring guide
    page_top(d); banner(d, 'RUBRIC SCORING GUIDE: 20 POINTS', 'generous partial credit', fill=INK, size=14, h=0.4); md('## Rubric scoring guide (20 points)'); md()
    grid(d, ['Category', 'Pts', 'FULL', 'GOOD (partial)', 'GETTING THERE'], [1.2, 0.4, 2.0, 1.85, 1.85],
         [[r['cat'], str(r['pts']), plain(r['full']), plain(r['good']), plain(r['start'])] for r in F.RUBRIC], row_h=0.2, size=8, hsize=8)
    md('| Category | Pts | Full | Good | Getting there |'); md('|---|---|---|---|---|')
    for r in F.RUBRIC: md(f"| {r['cat']} | {r['pts']} | {plain(r['full'])} | {plain(r['good'])} | {plain(r['start'])} |")
    md()
    P(d, 'Examples of full and partial credit', size=10.5, bold=True, color=INK, before=5, after=2); md('### Examples of full and partial credit')
    for cat, full, part in KC.SCORING_EXAMPLES:
        p = P(d, '', size=9, after=1); run(p, cat + '. ', bold=True, size=9, color=INK); rich(p, full, size=8.8)
        P(d, part, size=8.8, after=3, indent=0.2, color='333333'); md(f'- **{cat}.** {full} {part}')
    p = P(d, '', size=9, before=3, after=2); rich(p, '**Bonus:** +1 for all six "Predict the plot twist" boxes completed with a thoughtful guess (no wrong answers). Default cap: total 20 (decide if you want 21).', size=9); md('**Bonus:** +1 for all six predictions (default cap: 20).'); md()

    # ---------------- score sheet
    page_top(d); banner(d, 'GROUP SCORE SHEET', 'one per squad', fill=INK, size=14, h=0.4); md('## Group score sheet'); md()
    P(d, 'Squad name: ____________________________   Members: ______________________________________________   Date: ____________', size=9.6, after=4)
    rows = []
    for n in range(1, 7):
        c = CPS[n]
        rows.append([f"{c['day'][:3]} {c['time']}", '0   0.5   1', ('0   0.5   1' if c['safety_scored'] else 'warm-up'), '☐', '☐', ''])
    grid(d, ['Checkpoint', 'Clinical reasoning (1 each, 6)', 'Safety, priorities, SBAR (1 each, 5)', 'Roles initialed (all six = 2)', 'Huddle shows whole team (all six = 2)', 'Notes'],
         [0.9, 1.4, 1.5, 1.15, 1.25, 1.1], rows, row_h=0.32, size=8.6, hsize=7.8, center=[0, 1, 2, 3, 4])
    md('| Checkpoint | Clinical reasoning (1) | Safety/SBAR (1) | Roles initialed | Huddle whole team |'); md('|---|---|---|---|---|')
    for r in rows: md('| ' + ' | '.join(x for x in r[:5]) + ' |')
    md()
    grid(d, ['Group-scored item', 'Max', 'Squad score'], [4.8, 0.8, 1.7],
         [['Clinical reasoning (sum of six checkpoints)', '6', ''], ['Safety, priorities, SBAR (sum of 1100, 1500, 1900, 2300, 0300)', '5', ''], ['Teamwork: roles rotated and initialed at every checkpoint', '2', ''], ['Teamwork: huddles show the whole team', '2', ''],
          ['Completeness: all checkpoint pages finished (Mg-o-meter, vitals, prediction)', '1', ''], ['Completeness: Case Closed timeline', '1', ''], ['Completeness: teach-back to Eleanor', '1', ''], ['GROUP SUBTOTAL', '18', '']], row_h=0.28, size=9, hsize=8.4)
    P(d, '', after=2)
    P(d, 'Individual score line (copy the group subtotal, add the two individual points)', size=10.5, bold=True, color=INK, after=2, keep=True)
    grid(d, ['Student name', 'Group subtotal (18)', 'Peer check done (1)', 'Reflection done (1)', 'Bonus (+1)', 'TOTAL (20)'], [2.2, 1.1, 1.0, 1.0, 0.8, 1.2], 3, row_h=0.36, size=9, hsize=8.2, center=[1, 2, 3, 4, 5])
    md('Group-scored items: clinical reasoning 6, safety/SBAR 5, teamwork roles 2, teamwork huddles 2, completeness pages 1, timeline 1, teach-back 1 = 18. Individual: peer check 1, reflection 1. Total 20 (+1 bonus, default cap 20).'); md()
    P(d, 'Peer checks are for the instructor only. If one student\'s peer ratings are all "sometimes", talk to the squad before lowering that student\'s Teamwork.', size=8.8, italic=True, color=GRAY)

    # ---------------- debrief
    page_top(d); banner(d, 'DEBRIEF HUDDLE: 15 MINUTES', 'questions from INSTRUCTOR_GUIDE.md section 8', fill=INK, size=14, h=0.4); md('## Debrief huddle (15 minutes)'); md()
    for lb, t in KC.DEBRIEF:
        p = P(d, '', size=9.4, after=3); run(p, lb + ': ', bold=True, size=9.4, color=INK); rich(p, t, size=9.4); md(f'- **{lb}:** {t}')
    P(d, 'If you have more time, use the full PEARLS structure and the "what went well / improve" table in INSTRUCTOR_GUIDE.md section 8.', size=8.8, italic=True, color=GRAY, before=4); md(); md('*More time: use INSTRUCTOR_GUIDE.md section 8.*')
    d.save(os.path.join(OUT, 'INSTRUCTOR_CASESTUDY_KEY.docx'))
    open(os.path.join(OUT, 'INSTRUCTOR_CASESTUDY_KEY.md'), 'w').write('\n'.join(MD) + '\n')
    print('wrote key docx and md')


if __name__ == '__main__':
    build()
