#!/usr/bin/env python3
"""Builds the INSTRUCTOR KEY (Word + Markdown) for the simplified team case study.   python3 build_key.py
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

PROVIDER = {
 1: 'Thank you. Stop all the magnesium products and add them to the allergy/avoid list. I will ask nephrology to see him today. Do the lung check before and after the bolus and call me for crackles or SpO2 under 92%.',
 2: 'I am coming now. Give calcium gluconate 1 g over 10 minutes on the monitor, put him on oxygen with capnography, stop the maintenance saline and get a STAT magnesium and ECG. I will call nephrology and ICU outreach.',
 3: 'ICU outreach will come to the bedside. Call them for RR under 8, PaCO2 over 60 or pH under 7.15, SpO2 under 90% on 6 L, or any drop in alertness. Keep the airway cart in the room. Repeat the ABG in an hour.',
 4: 'Order D10W with hourly glucose and hold the correction insulin. Give the 15 g by mouth if he passes the swallow screen. Call me if he is under 70 after two rounds.',
 5: 'Do not give diphenhydramine; I will stop it and order melatonin and delirium precautions with a sitter. Recheck the magnesium at 0100 (sooner if he gets sleepy), and keep the bowel plan magnesium-free.',
 6: 'Do not give the milk of magnesia; I will stop the protocol. Order bisacodyl and a KUB. Recheck magnesium at 0500. Call me and nephrology for RR under 10, HR under 45, SBP under 90, reflexes lost or less alert, or if the magnesium goes over 7.',
 7: 'Good work. Take out the Foley, furosemide at 0800, keep the dialysis catheter another 24 hours, recheck labs this morning and plan teaching and kidney follow-up.'}


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
    banner(d, 'INSTRUCTOR KEY: RAY KESSLER TEAM CASE STUDY', 'about 2 hours', fill=INK, size=14, h=0.45)
    md('# Instructor Key: Ray Kessler Team Case Study'); md()
    H(d, 'What this is', level=2)
    para(d, 'A simple 2-hour team case study. Each team of 3 to 4 (2 also works) cares for Ray Kessler (74, hypermagnesemia with kidney failure) across 24 hours of patient time. The class advances **4 hours together** (0700, 1100, 1500, 1900, 2300, 0300, then a final check at 0700). Each team fills in **one plain page per checkpoint**. The packet is 12 pages. This key has a run of show, a short model answer for every box, a scoring guide (20 points), a group score sheet and debrief questions.')
    H(d, 'Roles (kept deliberately loose)', level=2)
    bl(d, ['**Charge nurse** (rotates every checkpoint, see the rotation table on the cover): coordinates and organizes the team, keeps time, decides who looks at what, leads the huddle, sets the priorities with the team, makes the SBAR call and records the team plan.',
           '**Nurse** (everyone else): looks, reads, thinks and speaks up. The charge nurse and team choose a focus each round (for example, one nurse on meds and treatments, one on results and the monitor). Do not assign tasks for them. If a team asks "what should I do?", say "ask your charge nurse".'])
    H(d, 'Before class', level=2)
    bl(d, ['Print the 12-page packet single-sided (one per team). Have the key open and the EHR synced to patient time Tue 0700 (5E-14, SIM-40318).',
           'Have the monitor ready to set to the values in the **Monitor to set** row of each checkpoint. Students read it and chart it in the NOW row.',
           'Show the team strip on page 2. It is empty on purpose: students mark each magnesium result themselves.'])
    H(d, 'Rules that protect the pacing', level=2)
    bl(d, ['Students finish a page at the **end** of its time block. Nothing on a later page is printed on an earlier one. Do not let anyone turn the page until you advance the clock.',
           'Every number in this key matches the patient chart (patient.json) and the monitor. If the team and key disagree, check the chart.',
           'Acceptable answers can differ from the model. Look for chart numbers and a reason, not exact wording.'])


def run_of_show(d):
    page_top(d)
    H(d, 'Run of show (about 2 hours)', size=14, before=0, level=2)
    para(d, 'Each checkpoint follows the same 14-minute rhythm (the 1500 gets 17 because it has a second page).')
    table(d, ['Clock', 'Minutes', 'What the instructor does'], [0.9, 1.1, 5.3], [
        ['Start', '0:00-0:05', 'Welcome. Teams of 3 to 4 sit together and fill in the names. Walk through the cover: roles, rotation table, rubric (page 3) and the Mg strip (page 2). Ask who will be charge nurse at 0700 (letter A).'],
        ['0700', '0:05-0:19', 'Advance the clock and set the monitor. Read the situation aloud. Let the charge nurse huddle (1-3 min). Teams write (3-10). One charge nurse makes the SBAR call to you (10-13); you answer as the provider. Move to the next clock.'],
        ['1100', '0:19-0:33', 'Same rhythm. New charge nurse (B). Watch for teams that skip the call for help.'],
        ['1500', '0:33-0:50', 'Same rhythm, 17 minutes: the second page covers what must be ready for dialysis, what to watch, and the call numbers. Charge nurse C.'],
        ['1900', '0:50-1:04', 'Same rhythm. Charge nurse D (or A for a team of 3). Watch for the low glucose.'],
        ['2300', '1:04-1:18', 'Same rhythm. Charge nurse A (or B). Watch for who thinks of the sleep-aid order.'],
        ['0300', '1:18-1:32', 'Same rhythm. Charge nurse B (or C). Watch for who refuses the "pink milk".'],
        ['Final 0700', '1:32-1:44', 'Advance, set the monitor, read the situation. Teams complete the final page (priorities for the day team, a handoff SBAR, teaching tips, the story of the stay).'],
        ['Reflection', '1:44-1:50', 'Each student completes the reflection and the peer check. Collect the packets (paperclipped).'],
        ['Debrief', '1:50-2:00', 'Use the debrief questions at the end of this key. Show the finished strips.']], size=8.8, row_h=0.3)
    H(d, 'The same 14 minutes, one checkpoint', size=11, level=3)
    table(d, ['Minute', 'What happens'], [1.0, 6.3], [
        ['+0', 'Advance the clock (the 4h button). Set the monitor. Read the situation aloud. Remind them that the charge nurse changed.'],
        ['+1 to +3', 'Charge nurse huddle: who looks at what, and how much time we have. (Do not tell them.)'],
        ['+3 to +10', 'Teams look at the chart and the monitor and write. Walk around. Ask a charge nurse "what is your team deciding?"'],
        ['+10 to +13', 'Charge nurse makes the SBAR call to you. Answer as the provider with the suggested reply in this key. Keep it short.'],
        ['+13 to +14', 'Check that the magnesium level is on the strip and the prediction is written. Then advance the clock.']], size=8.8, row_h=0.28)


def vit_text(m):
    return f"HR {m['hr']}, BP {m['bp']} (MAP {m['map']}), RR {m['rr']}, SpO2 {m['spo2']}" + (f", EtCO2 {m['etco2']}" if m['etco2'] else '') + f", temp {m['temp']}, pain {m['pain']}, glucose {m['glucose']}; rhythm: {m['rhythm']}"


def lab_table(d, labs, abg=None):
    cols = ['Test', 'Normal'] + labs['times']
    rows = [[nm, C.NORMAL[nm]] + v for nm, v in labs['rows']]
    table(d, cols, [1.7, 1.0] + [(7.3 - 2.7) / len(labs['times'])] * len(labs['times']), rows, size=8.6, row_h=0.22, center=list(range(1, len(cols))))
    if abg:
        table(d, ['ABG', 'Normal', 'Tue 1130', 'Tue 1415'], [1.7, 1.0, 2.3, 2.3], [[nm.replace('ABG ', ''), C.NORMAL[nm]] + v for nm, v in abg], size=8.6, row_h=0.22, center=[1, 2, 3])


def answers(d, n, cp, mon, label):
    page_top(d)
    H(d, f'{cp["time"]} {cp["day"]}: {label}', size=14, before=0, level=2)
    k = cp['key']
    para(d, '**Monitor to set (NOW):** ' + vit_text(mon), size=9)
    if n in UO: para(d, '**Urine for the vitals box:** ' + UO[n], size=8.6)
    mg = ' and '.join(cp['mg'])
    H(d, 'New results (chart values)', size=10.5, before=2, level=3)
    lab_table(d, cp['labs'], cp.get('abg'))
    rows = [['Vitals and what I noticed', k['noticed']], ['Current meds and treatments', k['meds']], ['New results and what they mean', k['results']], ['What changed since the last checkpoint', k['changed']],
            ['Magnesium level and strip', f'Write {mg} mg/dL; mark on the strip in the {cp["zone"]}.'],
            ['Top 3 priorities'] + ['1) ' + k['pri'][0] + '  2) ' + k['pri'][1] + '  3) ' + k['pri'][2]],
            ['SBAR', f'**S:** {k["S"]}  **B:** {k["B"]}  **A:** {k["A"]}  **R:** {k["R"]}'],
            ['What we will do next', k['nxt']]]
    if 'pred' in k: rows.append(['Prediction (no wrong answers)', k['pred']])
    if 'teach' in k: rows.append(['What we will teach Ray and Eleanor', k['teach']])
    if 'story' in k: rows.append(['The story of the stay', k['story']])
    rows.append(['Charge nurse notes', 'Look for: a named charge nurse, who looked at what, the team decision and a time check. Credit any honest notes.'])
    table(d, ['Box', 'Model answer'], [1.7, 5.6], rows, size=8.7, row_h=0.28, bold_first=True)
    para(d, '**Instructor as the provider (suggested reply):** ' + PROVIDER[n], size=9)
    if n == 3:
        ex = cp['extra']
        H(d, 'Page 2 of 1500: dialysis boxes', size=10.5, before=2, level=3)
        table(d, ['Box', 'Model answer'], [1.7, 5.6], [['Before dialysis starts', ex['before']], ['While dialysis runs', ex['during']], ['When do we call for help?', ex['calls']]], size=8.7, row_h=0.28, bold_first=True)


def rubric_guide(d):
    page_top(d)
    H(d, 'Scoring guide (20 points, three levels)', size=14, before=0, level=2)
    para(d, 'Grade the team packet with the group score sheet on the next page. Be generous: complete and thoughtful earns full credit. Individual reflections and peer checks feed two of the rows.')
    rows = [[r['cat'] + f'  ({r["pts"]})', plain(r['full']), plain(r['good']), plain(r['start'])] for r in C.RUBRIC]
    table(d, ['Category', 'Full credit', 'Good', 'Getting there'], [1.6, 2.1, 1.8, 1.8], rows, size=8.4, row_h=0.8, bold_first=True)
    H(d, 'How the points add up', size=11, level=3)
    table(d, ['Category', 'Where the points come from'], [2.3, 5.0], [[r['cat'] + f' ({r["pts"]})', r['how']] for r in C.RUBRIC], size=8.6, row_h=0.4)
    H(d, 'Reflection and peer check', size=11, level=3)
    bl(d, ['Reflection (3 boxes): full credit for any honest answer with a reason. A blank or one-word box is a partial credit. Use it for the "Individual reflections handed in" point.',
           'Peer check: use it to spot a team where one person did most of the work. Read the comments privately; do not share names.',
           'If a team did not rotate the charge nurse, cap Teamwork at 3 and ask why in the debrief.'])


def score_sheet(d):
    page_top(d)
    H(d, 'GROUP SCORE SHEET', size=14, before=0, level=2)
    P(d, 'Team name: ______________________________   Members: ______________________________________________   Date: ____________', size=9.4, after=4)
    md('Team name: ____________  Members: ____________  Date: ________'); md()
    H(d, 'Checkpoint check (tick what you see)', size=11, level=3)
    cols = ['Page', 'Charge nurse named', 'Boxes done with numbers', '3 priorities', 'SBAR complete', 'Mg on strip', 'Prediction']
    rows = [[x] + ['☐'] * 6 for x in ('0700', '1100', '1500', '1900', '2300', '0300', 'Final 0700')]
    table(d, cols, [0.9, 1.2, 1.3, 1.0, 1.0, 0.9, 1.0], rows, size=10, row_h=0.3, center=list(range(7)))
    H(d, 'Rubric', size=11, level=3)
    cols = ['Category', 'Full', 'Good', 'Getting there', 'Points', 'Notes']
    rows = [['Teamwork and charge-nurse rotation (5)', '☐ 5', '☐ 3-4', '☐ 1-2', '/ 5', ''], ['Clinical thinking at each checkpoint (6)', '☐ 6', '☐ 4-5', '☐ 1-3', '/ 6', ''],
            ['Safety, priorities and SBAR (5)', '☐ 5', '☐ 3-4', '☐ 1-2', '/ 5', ''], ['Completeness and reflection (4)', '☐ 4', '☐ 2-3', '☐ 1', '/ 4', ''], ['TOTAL', '', '', '', '/ 20', '']]
    table(d, cols, [2.3, 0.6, 0.7, 0.9, 0.7, 2.1], rows, size=8.8, row_h=0.42, center=[1, 2, 3, 4])
    H(d, 'Individual check', size=11, level=3)
    table(d, ['Name', 'Was charge nurse', 'Reflection handed in', 'Peer check handed in', 'Comment'], [1.9, 1.2, 1.3, 1.3, 1.6], [['', '☐', '☐', '☐', ''] for _ in range(4)], size=9, row_h=0.34, center=[1, 2, 3])
    P(d, 'Comments for the team:', size=9.4, bold=True, after=1, before=3)
    lines(d, 3)


def debrief(d):
    page_top(d)
    H(d, 'Debrief questions (about 10 minutes; pick 8 to 10)', size=14, before=0, level=2)
    rows = []
    for i, (topic, q) in enumerate(C.DEBRIEF, 1):
        rows.append([str(i), topic, q])
    table(d, ['#', 'Topic', 'Question'], [0.35, 1.0, 5.95], rows, size=9, row_h=0.45, center=[0])
    H(d, 'Ideas for good answers', size=11, level=3)
    bl(d, ['Charge nurse: said who looks at what out loud; watched the clock; made sure the Mg was marked; kept the SBAR short.',
           'Trend: 7.8, 8.7, 9.5, 10.9 at the peak, dialysis to 4.6, then 5.6, 6.4 and 5.3. Rebound happens because stored magnesium shifts back and the kidneys cannot clear it.',
           'Oxygen: SpO2 can look fine while breathing is slow and shallow; watch RR, EtCO2 and reflexes.',
           'Orders that could hurt: the bowel protocol ends in milk of magnesia; diphenhydramine for sleep; correction insulin after dialysis; "pink milk".',
           'Teaching: read labels for magnesium; call before laxatives or antacids; no ibuprofen; bring all bottles; sick-day rule for the water pill and blood pressure pill.'])


def build():
    d = new_doc('INSTRUCTOR KEY (not for students)', 'Ray Kessler Team Case Study  |  Page', 'Instructor copy. Every number matches the chart (patient.json).', top=0.62, bottom=0.45)
    title_page(d); run_of_show(d)
    ed = ED_VITALS
    labels = {1: 'Checkpoint 1 of 6', 2: 'Checkpoint 2 of 6', 3: 'Checkpoint 3 of 6', 4: 'Checkpoint 4 of 6', 5: 'Checkpoint 5 of 6', 6: 'Checkpoint 6 of 6'}
    for n in range(1, 7): answers(d, n, C.CP[n], MON[n], labels[n])
    answers(d, 7, dict(C.CLOSE, day='Wednesday'), MON[7], 'Case closed: final check')
    rubric_guide(d); score_sheet(d); debrief(d)
    d.save(os.path.join(OUT, 'INSTRUCTOR_CASESTUDY_KEY.docx'))
    open(os.path.join(OUT, 'INSTRUCTOR_CASESTUDY_KEY.md'), 'w').write('\n'.join(MD) + '\n')
    print('key written')


if __name__ == '__main__':
    build()
