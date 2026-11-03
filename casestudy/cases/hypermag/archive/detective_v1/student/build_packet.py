#!/usr/bin/env python3
"""Builds the STUDENT packet (Word) for the Ray Kessler "Case of the Silent Mineral" group case study.
    python3 build_packet.py            ->  ../CASE_STUDY_PACKET.docx   (+ out/page_tags.json used by the layout and spoiler checks)
No answers are printed here. The answers live in the same content files and are printed by build_key.py."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from dx import *
from content_cp import CPS, MON, ED_VITALS
import content_front as F

OUT_DOCX = os.path.join(HERE, '..', 'CASE_STUDY_PACKET.docx')
TAGS = []

RHY_SHORT = {0: 'Sinus brady 46 (ECG 0430)', 1: 'Sinus brady, 1st-degree AVB (PR 0.26 s)', 2: 'Sinus brady, long PR (0.30 s)', 3: 'Sinus brady, PR 0.32 s, wide QRS, tall T',
             4: 'Sinus 66, PR 0.20 s', 5: 'Sinus 62, PR 0.22 s', 6: 'Sinus 56, PR 0.24 s'}


def tag(d, label, k, m):
    TAGS.append(f'{label} | page {k} of {m}')
    P(d, f'{label}  |  page {k} of {m}', size=7.5, color='777777', align='right', after=2)


def page_banner(d, left, right, sub=None, fill=INK):
    banner(d, left, right, fill=fill, size=15, sub=sub, h=0.42)


# ================================================================== COVER
def cover(d):
    page_top(d); tag(d, 'COVER', 1, 1)
    t = new_table(d, 1, 2, [1.75, W - 1.75], borders=None)
    for c in t.rows[0].cells: shade(c, INK)
    pic_in(t.rows[0].cells[0], 'logo.png', 1.4); valign(t.rows[0].cells[0])
    c = t.rows[0].cells[1]; c.text = ''
    p = first_par(c); rich(p, 'CASE FILE  •  RAPID RESPONSE DETECTIVE SQUAD', size=9.5, bold=True, color='F2B84B')
    p = c.add_paragraph(); p.paragraph_format.space_after = Pt(0); rich(p, 'THE CASE OF THE', size=21, bold=True, color='FFFFFF')
    p = c.add_paragraph(); p.paragraph_format.space_after = Pt(2); rich(p, 'SILENT MINERAL', size=30, bold=True, color='FFFFFF')
    p = c.add_paragraph(); p.paragraph_format.space_after = Pt(0); rich(p, 'Patient: Raymond "Ray" Kessler, 74  •  Room 5E-14, Telemetry Step-Down  •  Tuesday 0700 to Wednesday 0700', size=9.5, color='FFFFFF', italic=True)
    valign(c); rowh(t.rows[0], 1.5)
    spacer(d, 3)

    P(d, 'YOUR SQUAD', size=12, bold=True, color=INK, after=2, keep=True)
    P(d, 'Squad name (make it good):  ____________________________________________________________', size=11, after=4)
    grid(d, ['Name (print)', 'Starting job at 0700 (A, B or C)', 'Initials'], [4.0, 2.3, 1.0], 3, row_h=0.32, size=10, center=[1, 2])

    callout(d, 'MISSION BRIEFING', [
        '**1.  You are the nursing team for Ray Kessler** for 24 hours of patient time: the day shift and then the night shift.',
        '**2.  Three jobs, and you rotate them every checkpoint:** (A) Chart Detective, (B) Lab Interpreter, (C) Bedside Nurse. Everybody does every job. Details are on the role card page.',
        '**3.  At each checkpoint** the instructor sets the bedside monitor and reads the Situation. You work your role boxes, then hold a **Team Huddle**: top 3 priorities, one question for the provider, one SBAR call.',
        '**4.  Do not turn the page until the instructor advances the clock** (the 4h button). Later pages give away later events, and spoilers ruin a good mystery.',
        '**5.  Use the EHR on your own device.** Your patient and patient time are synced with the instructor. Small "Where to look" hints tell you where to click.'], fill='FFF8E1', icon='icon_key.png', size=9.6)

    pic(d, 'timeline_banner.png', 6.8, after=2)
    grid(d, ['Opening', 'Six checkpoints', 'Case Closed huddle', 'Total'], [1.7, 2.3, 2.0, 1.3],
         [['about 10 minutes\nroles, handoff, patient card', 'about 15 minutes each\n0700, 1100, 1500, 1900, 2300, 0300', 'about 15 minutes\nfinal check, teach-back, debrief', 'about 2 hours']],
         row_h=0.42, size=8.6, center=[0, 1, 2, 3], hfill='FFE9B8')

    P(d, '20 POINTS, MADE SIMPLE', size=11, bold=True, color=INK, after=2, before=2, keep=True)
    t = new_table(d, 1, 4, [W / 4] * 4, borders=MED)
    for c, (nm, pts, fl) in zip(t.rows[0].cells, [('Teamwork', '5', FILL['T']), ('Clinical reasoning', '6', FILL['B']), ('Safety, priorities, SBAR', '5', FILL['A']), ('Completeness and reflection', '4', FILL['C'])]):
        shade(c, fl); c.text = ''
        p = first_par(c, align='center'); rich(p, pts, size=17, bold=True, color=INK)
        p2 = c.add_paragraph(); p2.alignment = WD_ALIGN_PARAGRAPH.CENTER; rich(p2, nm, size=8.8, bold=True, color=INK)
    P(d, 'Complete and thoughtful = full credit. Partial credit is generous. The full rubric is on the next page.', size=8.6, italic=True, color=GRAY, before=1, after=2, align='center')

    callout(d, 'TURN-IN', 'Put the pages in order and fasten them with a **PAPERCLIP (no staples)**. One packet per squad. The reflection strips and the peer check at the end are individual: write your own name on yours.', fill='FFFFFF', icon=None, dashed=True, size=9.6)




# ================================================================== RUBRIC
def rubric(d):
    page_top(d); tag(d, 'RUBRIC', 1, 1)
    page_banner(d, 'HOW YOU EARN YOUR 20 POINTS', '4 categories  |  3 levels each', sub='This is your extra quiz grade. It rewards a great, careful, team-minded effort. There are no trick questions.')
    t = new_table(d, 5, 4, [1.55, 1.9, 1.9, 1.95], borders=THIN)
    heads = ['Category and points', 'FULL credit', 'GOOD (partial)', 'GETTING THERE (partial)']
    for j, h in enumerate(heads):
        c = t.rows[0].cells[j]; shade(c, 'D9D9D9'); ctext(c, h, size=9.5, bold=True, align='center'); box_borders(c, MED)
    fills = [FILL['T'], FILL['B'], FILL['A'], FILL['C']]
    for i, r in enumerate(F.RUBRIC, 1):
        row = t.rows[i]; nosplit(row)
        c0 = row.cells[0]; shade(c0, fills[i - 1]); c0.text = ''
        p = first_par(c0); rich(p, f'{r["cat"]}', size=10, bold=True, color=INK)
        p = c0.add_paragraph(); p.paragraph_format.space_before = Pt(2); rich(p, f'{r["pts"]} points', size=16, bold=True, color=INK)
        for j, key in ((1, 'full'), (2, 'good'), (3, 'start')):
            c = row.cells[j]; c.text = ''; rich(first_par(c), r[key], size=8.8)
        for c in row.cells: box_borders(c, THIN)
    spacer(d, 4)
    P(d, 'WHERE EACH POINT COMES FROM', size=11, bold=True, color=INK, after=2, keep=True)
    grid(d, ['Category', 'How the points are counted'], [2.2, 5.1], [[r['cat'] + f'  ({r["pts"]})', r['how']] for r in F.RUBRIC], row_h=0.3, size=8.4)
    P(d, 'ON EVERY CHECKPOINT PAGE', size=10.5, bold=True, color=INK, after=1, before=2, keep=True)
    bullets(d, ['A small **points tracker** at the bottom of each checkpoint shows what that page is worth. Each checkpoint is about **1 point of Clinical reasoning** and (from 1100 on) **1 point of Safety, priorities and SBAR**.',
                'Stretch boxes are marked with a star (\u2605). If time is short, skip the stars first; they are never needed for full credit.',
                'We look for reasons and chart numbers, not perfect wording. A thoughtful answer that differs from ours still earns credit.'], size=9)
    callout(d, 'BONUS', F.BONUS.replace('**Bonus (+1):** ', ''), fill='FFF8E1', icon='icon_star.png', size=9.4, title_size=10.5)


# ================================================================== PATIENT CARD
def patient_card(d):
    page_top(d); tag(d, 'PATIENT CARD', 1, 1)
    page_banner(d, 'PATIENT CARD: RAYMOND "RAY" KESSLER', 'Room 5E-14  |  Telemetry Step-Down')
    t = new_table(d, 1, 2, [2.55, W - 2.55], borders=None)
    pic_in(t.rows[0].cells[0], 'portrait.png', 2.4)
    c = t.rows[0].cells[1]; c.text = ''
    facts = [('Name', 'Raymond "Ray" Kessler, he/him'), ('Age / DOB', '74 years old  |  DOB 04/22/1952'), ('MRN', 'SIM-40318'), ('Height / weight', '175 cm  |  88.0 kg on arrival (dry weight about 90 kg)'),
             ('ALLERGY', '**Penicillin** (childhood rash)'), ('Code status', '**Full Code**   |   Fall risk: HIGH'), ('Family', 'Wife **Eleanor Kessler** (72, health care proxy, lives with him); daughter Diane Ruiz (15 minutes away)'),
             ('Life', 'Retired machinist. Former smoker (quit 2005). No alcohol.'), ('Care team', 'Hospitalist Dr. D. Okafor (0700-1900); night hospitalist Dr. J. Lindgren; nephrology Dr. P. Raman; ICU outreach Dr. H. Moreno; pharmacist L. Ferreira')]
    first = True
    for k, v in facts:
        p = first_par(c) if first else c.add_paragraph()
        first = False
        p.paragraph_format.space_after = Pt(2.2)
        run(p, k + ':  ', bold=True, size=9.2, color=INK); rich(p, v, size=9.2)
    spacer(d, 3)
    t = new_table(d, 1, 2, [3.0, W - 3.0], borders=None)
    c = t.rows[0].cells[0]; pic_in(c, 'mg_gauge.png', 2.95); valign(c, 'top')
    c = t.rows[0].cells[1]; c.text = ''
    p = first_par(c); rich(p, 'MG-O-METER GUIDE', size=11, bold=True, color=INK)
    for ln in ['Normal magnesium is **1.7 to 2.2 mg/dL**. In this lab, anything **over 5.0** is a critical value.', 'Magnesium leaves the body through the **kidneys**. When the kidneys are failing, magnesium piles up.',
               'High magnesium blocks the signals between **nerves and muscles** and slows the **heart**. The bands on the gauge show what you may see. They overlap a bit in real life: **trust your exam as much as the number.**']:
        pp = c.add_paragraph(); pp.paragraph_format.space_after = Pt(3); rich(pp, ln, size=9.2)
    p = c.add_paragraph(); p.paragraph_format.space_before = Pt(4); p.paragraph_format.space_after = Pt(2); rich(p, 'HISTORY (from the ED and the clinic)', size=11, bold=True, color=INK)
    for ln in ['**Kidneys:** CKD stage 4. Baseline creatinine 2.6, eGFR 25 (Oct 20). Not yet seen by nephrology.', '**Diabetes** type 2 for 15 years, with neuropathy (A1c 7.8%). **Heart:** HFpEF (EF 55%), high blood pressure, high cholesterol.',
               '**Other:** heartburn (GERD), chronic low back pain, constipation from his pain medicine.']:
        pp = c.add_paragraph(); pp.paragraph_format.space_after = Pt(2.5); rich(pp, '•  ' + ln, size=9)
    p = c.add_paragraph(); p.paragraph_format.space_before = Pt(4); p.paragraph_format.space_after = Pt(2); rich(p, 'HOME MEDICINES ON THE ED LIST', size=11, bold=True, color=INK)
    for ln in ['Lisinopril 20 mg daily  |  Metoprolol succinate 50 mg daily', 'Furosemide 20 mg daily  |  Aspirin 81 mg  |  Pantoprazole 40 mg', 'Insulin glargine 22 units at bedtime (last dose Monday 2100) + lispro 6 units with meals', 'Atorvastatin 40 mg at bedtime  |  Gabapentin 300 mg at bedtime', 'Oxycodone 5 mg every 12 hours as needed']:
        pp = c.add_paragraph(); pp.paragraph_format.space_after = Pt(1.5); rich(pp, '•  ' + ln, size=9)
    pp = c.add_paragraph(); pp.paragraph_format.space_before = Pt(3); rich(pp, '(Stores sell more than doctors prescribe. Is the ED list the whole story? Detectives, keep that in mind.)', size=8.6, italic=True, color=GRAY)
    callout(d, 'YOUR CASE FILE STARTS HERE', 'Ray is 74, he has failing kidneys, and something made him very sleepy and slow. Your squad has 24 hours of patient time to figure out what, stop it, and keep Ray safe. Good detectives write things down.', fill='FFF8E1', icon='icon_detective.png', size=9.4)


# ================================================================== ROLE CARDS
def roles_page(d):
    page_top(d); tag(d, 'ROLE CARDS', 1, 1)
    page_banner(d, 'WHO DOES WHAT: SQUAD ROLE CARDS', 'rotate every checkpoint')
    for L in 'ABC':
        r = F.ROLES[L]
        t = new_table(d, 1, 3, [0.7, 4.6, 2.0], borders=None)
        for c in t.rows[0].cells: shade(c, FILL[L]); box_borders(c, MED)
        border(t.rows[0].cells[0], right=NONE); border(t.rows[0].cells[1], left=NONE, right=NONE); border(t.rows[0].cells[2], left=THIN)
        nosplit(t.rows[0])
        c = t.rows[0].cells[0]; pic_in(c, ROLE_ICON[L], 0.55); valign(c)
        c = t.rows[0].cells[1]; c.text = ''
        p = first_par(c); rich(p, f'{L}   {r["name"]}', size=12, bold=True, color=INK)
        p = c.add_paragraph(); p.paragraph_format.space_after = Pt(1); rich(p, r['quote'], size=8.8, italic=True, color='444444')
        for j in r['jobs']:
            pp = c.add_paragraph(); pp.paragraph_format.space_after = Pt(0.5); pp.paragraph_format.left_indent = Inches(0.14); pp.paragraph_format.first_line_indent = Inches(-0.14); rich(pp, '• ' + j, size=8.8)
        c = t.rows[0].cells[2]; c.text = ''
        p = first_par(c); rich(p, 'WHERE TO CLICK', size=8, bold=True, color=INK)
        pp = c.add_paragraph(); rich(pp, r['tools'], size=8.8)
        valign(c, 'top')
        spacer(d, 3)

    P(d, 'ROTATION CHART (write your names, then follow the letters)', size=10.5, bold=True, color=INK, after=2, keep=True)
    rows = [['0700 (1)', 'A', 'B', 'C'], ['1100 (2)', 'B', 'C', 'A'], ['1500 (3)', 'C', 'A', 'B'], ['1900 (4)', 'A', 'B', 'C'], ['2300 (5)', 'B', 'C', 'A'], ['0300 (6)', 'C', 'A', 'B']]
    grid(d, ['Checkpoint', 'Student 1: ____________', 'Student 2: ____________', 'Student 3: ____________'], [1.3, 2.0, 2.0, 2.0], rows, row_h=0.2, size=9, center=[0, 1, 2, 3], bold_first=True, hsize=8.6)
    P(d, '**Squad of two?** One of you is the **Desk** (does A and B) and the other is the **Bedside Nurse** (C). Swap jobs at every checkpoint (Student 1 is the Desk at 0700, 1500 and 2300; Student 2 at 1100, 1900 and 0300). Skip the starred (★) stretch boxes if time is short.', size=8.8, after=3)

    P(d, 'WHERE TO CLICK IN THE EHR (tiny hints; click the tab named in each box)', size=10.5, bold=True, color=INK, after=2, before=2, keep=True)
    t = new_table(d, 1, 3, [2.43, 2.43, 2.44], borders=None)
    shots = [('shot_flowsheets.png', 'C: Flowsheets > Vital Signs > "Add Col". Type or pick your monitor values.'),
             ('shot_labs.png', 'B: Lab Results. Newest column is on the right. Red = abnormal.'),
             ('shot_orders.png', 'A: Orders (click one to read its details); MAR has a PRN filter and "due" colors.')]
    for k, (img, cap) in enumerate(shots):
        c = t.rows[0].cells[k]; c.text = ''
        pic_in(c, os.path.join(HERE, 'shots', img), 2.35)
        p = c.add_paragraph(); p.paragraph_format.space_after = Pt(2); rich(p, cap, size=7.8, italic=True, color='444444')
    # Lab Results shot is tall: keep the cell compact
    spacer(d, 2)


# ================================================================== HANDOFF
def handoff_page(d):
    page_top(d); tag(d, 'OPENING HANDOFF', 1, 1)
    page_banner(d, 'OPENING: HANDOFF FROM THE ED', 'Tuesday 0655', sub='The instructor reads the ED nurse\'s report aloud (K. Ortiz, RN). Listen, write, and then read it back. You are the day shift taking over Ray.')
    grid(d, ['S B A R listening notes (jot short phrases)', 'Write here'], [2.2, 5.1],
         [[f'**{h["letter"]}**  {h["head"]}\n{h["prompt"]}', ''] for h in F.HANDOFF_PROMPTS], row_h=0.62, size=9, hsize=8.8)
    P(d, 'ED FACT CARD (printed for you; the ED nurse will not repeat every number)', size=10, bold=True, color=INK, after=1, keep=True)
    t = new_table(d, 1, 1, [W], borders=MED)
    c = t.rows[0].cells[0]; shade(c, 'F7F7F7'); c.text = ''
    first = True
    for k in ('vitals', 'labs', 'ecg', 'meds'):
        p = first_par(c) if first else c.add_paragraph(); first = False
        p.paragraph_format.space_after = Pt(1.5); rich(p, F.ED_CARD[k], size=9)
    spacer(d, 3)
    checks(d, ['**Read-back done:** name, date of birth and allergy checked against the wristband', '**Asked one clarifying question** of the ED nurse (write it): ______________________________________'], size=9)
    P(d, 'RHYTHM DECODER (keep this page handy all shift: strips A, B and C show what magnesium does to the ECG)', size=10, bold=True, color=INK, after=1, before=2, keep=True)
    pic(d, 'ecg_decoder.png', 5.3)


# ================================================================== VITALS / EXAM / HUDDLE parts
def vitals_log(d, n, wide=False):
    prev = ED_VITALS if n == 1 else MON[n - 1]
    cols = ['Time', 'Temp (F)', 'HR', 'BP (MAP)', 'RR', 'SpO2 / oxygen'] + (['EtCO2'] if wide else []) + ['Pain', 'Rhythm (read the monitor)', 'POC glucose']
    ws = [0.62, 0.5, 0.42, 0.78, 0.5, 0.95] + ([0.5] if wide else []) + [0.7, 1.43 - (0.5 if wide else 0), 0.7]
    pv = [prev['clock'].replace('Tue ', '').replace('Wed ', ''), prev['temp'], prev['hr'], f"{prev['bp']} ({prev['map']})", prev['rr'], prev['spo2'].replace('room air', 'RA')] + ([prev['etco2'] or '-'] if wide else []) + [prev['pain'].split(' ')[0] if prev['pain'] else '-', prev['rhythm'], prev['glucose']]
    now = [MON[n]['clock'].replace('Tue ', '').replace('Wed ', '') + '\nNOW'] + [''] * (len(cols) - 1)
    ws = [w * (W / sum(ws)) for w in ws]
    rows = [[('last time\n' + pv[0])] + pv[1:], now, ['trend\n\u2191 \u2193 ='] + [''] * (len(cols) - 1)]
    tt = grid(d, cols, ws, rows, row_h=0.32, size=8.2, hsize=8, center=list(range(len(cols))), fills={(0, j): 'F0F0F0' for j in range(len(cols))})
    rowh(tt.rows[2], 0.4); rowh(tt.rows[3], 0.28)
    return tt


def exam_table(d, c):
    rows = [[lab, '', '☐'] for lab, _ in c['exam']]
    grid(d, ['What to check', 'What you find (write it)', 'Alarm?'], [2.55, 4.1, 0.65], rows, row_h=0.295, size=8.8, hsize=8.6, center=[2], pre_fill={0: 'F6F6F6'})


def render_block(d, b):
    t = b['t']; tagc = '★ ' if b.get('stretch') else ''
    if t == 'lines':
        prompt(d, b['id'], tagc + b['head'], b['prompt'], b.get('where')); lines(d, b['n'])
    elif t == 'table':
        prompt(d, b['id'], tagc + b['head'], b['prompt'], b.get('where'))
        rows = b['rows']; first_cols = [j for j in range(len(b['cols'])) if rows and rows[0][j] != '']
        grid(d, b['cols'], b['widths'], rows, row_h=b['rowh'] if b.get('rowh') else 0.27, size=8.8, hsize=8.4, pre_fill={j: 'F6F6F6' for j in first_cols})
    elif t == 'checks_table':
        prompt(d, b['id'], tagc + b['head'], b['prompt'], b.get('where'))
        grid(d, b['cols'], b['widths'], [[r, ''] for r in b['rows']], row_h=0.3, size=8.8, hsize=8.4, pre_fill={0: 'F6F6F6'})
    elif t == 'bag':
        t_ = new_table(d, 1, 2, [3.45, W - 3.45], borders=None)
        pic_in(t_.rows[0].cells[0], b['path'], 3.35); valign(t_.rows[0].cells[0], 'top')
        c = t_.rows[0].cells[1]; c.text = ''
        p = first_par(c); run(p, f"{b['id']}  ", bold=True, size=9.6, color=GRAY); run(p, b['head'] + '.  ', bold=True, size=9.8, color=INK); rich(p, b['prompt'], size=9.2)
        valign(c, 'top')
        g = grid(c, b['cols'], b['widths'], [[r[0], '', '', ''] for r in b['rows']], row_h=b['rowh'], size=8.8, hsize=8, pre_fill={0: 'F6F6F6'}, center=[0, 2])
        spacer(d, 2)
    elif t == 'img':
        pic(d, b['path'], b['width'])
    else:
        raise SystemExit('unknown block ' + t)


def mg_block(d, c):
    m = c['mg']
    banner(d, 'MG-O-METER: mark it, name the zone, say what it means', '', fill='3B3B3B', size=10, h=0.26)
    pic(d, m['img'], 5.6, after=0, keep=True)
    P(d, f"{m['id']}   {m['level_prompt']}", size=9.2, bold=True, color=INK, after=1, keep=True)
    P(d, '**What this level means for Ray** (use the bands and what you saw at the bedside):', size=9, after=1, keep=True)
    lines(d, m['means_n'], line_h=0.26)


def huddle_block(d, n, c, part='all'):
    if part in ('all', 'top'):
        banner(d, 'TEAM HUDDLE:  everybody talks, one person writes', 'about 4 minutes', fill='4B3F72', size=11, h=0.3)
        prompt(d, f'{n}T1', 'Top 3 priorities', c['pri_prompt'], None)
        grid(d, ['#', 'Priority (in order)', 'Why (a few words)'], [0.35, 4.3, 2.65], [['1', '', ''], ['2', '', ''], ['3', '', '']], row_h=0.28, size=9, hsize=8.2, center=[0], hfill='ECE6F7')
        t = new_table(d, 1, 2, [3.6, 3.7], borders=None)
        c0, c1 = t.rows[0].cells
        c0.text = ''; p = first_par(c0); run(p, f'{n}T2  ', bold=True, size=9.2, color=GRAY); run(p, 'Our ONE question.  ', bold=True, size=9.4, color=INK); rich(p, c['q_prompt'].replace('The ONE question ', ''), size=8.4)
        lines(c0, 2, w=3.4, line_h=0.27)
        c1.text = ''; p = first_par(c1); run(p, f'{n}P  ', bold=True, size=9.2, color=GRAY); run(p, 'Predict the plot twist (bonus).  ', bold=True, size=9.4, color=INK); rich(p, c['predict'].replace('**Predict the plot twist:** ', ''), size=8.4)
        lines(c1, 2, w=3.5, line_h=0.27)
    if part in ('all', 'sbar'):
        prompt(d, f'{n}T3', 'SBAR call', c['sbar_prompt'], None)
        grid(d, ['', 'Say it out loud, then write it (short phrases and numbers)'], [0.42, 6.88],
             [['**S**', ''], ['**B**', ''], ['**A**', ''], ['**R**', '']], row_h=0.32 if not c.get('four') else 0.7, size=13, hsize=8, center=[0], hfill='ECE6F7')


def clue_and_points(d, n, c, last=False):
    t = new_table(d, 1, 3, [3.7, 2.2, 1.4], borders=None)
    a, b, st = t.rows[0].cells
    for x in (a, b, st): box_borders(x, MED)
    shade(a, 'FFF8E1'); a.text = ''
    p = first_par(a); run(p, c['clue'][0], bold=True, size=10, color=INK)
    pp = a.add_paragraph(); pp.paragraph_format.space_after = Pt(0); rich(pp, c['clue'][1], size=8.8)
    b.text = ''
    p = first_par(b); rich(p, 'POINTS ON THIS PAGE', size=8.4, bold=True, color=INK)
    items = ['Clinical reasoning: ___ / 1 (of 6)', 'Safety, priorities, SBAR: ___ / 1 (of 5)' if c['safety_scored'] else 'Safety / SBAR: warm-up, not scored', 'Teamwork, Complete: whole packet']
    for it in items:
        pp = b.add_paragraph(); pp.paragraph_format.space_after = Pt(0.5); rich(pp, '\u2022 ' + it, size=8)
    st.text = ''; pic_in(st, 'icon_stop.png', 0.42)
    pp = st.add_paragraph(); pp.alignment = WD_ALIGN_PARAGRAPH.CENTER; pp.paragraph_format.space_after = Pt(0)
    rich(pp, 'Wait for the instructor\'s 4h button' if not last else 'Wait for the instructor\'s last 4h', size=8, bold=True, color=INK)
    rowh(t.rows[0], 0.72); nosplit(t.rows[0])


# ================================================================== CHECKPOINT SECTIONS
def checkpoint(d, n):
    c = CPS[n]; label = f'CHECKPOINT {n} OF 6  |  {c["day"].upper()} {c["time"]}'
    right = f'{c["day"]} {c["time"]}  |  {c["seg"]}'
    # ---------- page 1
    page_top(d); tag(d, label, 1, 4 if c.get('four') else 3)
    page_banner(d, c['title'], right, sub=c['tagline'])
    sit = c['situation']
    callout(d, 'SITUATION  (the instructor reads this aloud)', sit, fill='FFF8E1', icon='icon_clock.png', size=9.0, title_size=9.8)
    role_head(d, 'C', 'Read the monitor, chart it, examine Ray. Then give your team a 20-second report.')
    P(d, f'**Monitor vitals** (the instructor sets the bedside monitor to {c["time"]}; read your own set and chart it in the EHR).', size=9.2, after=2, keep=True)
    vitals_log(d, n, wide=c.get('wide_vitals', False))
    if c.get('glucose_log'):
        P(d, 'POC glucose log (check with the meter; the instructor gives you the number):', size=9.2, bold=True, after=1, keep=True)
        grid(d, ['Time', 'Glucose', 'What I did'], [0.9, 1.0, 5.4], 3, row_h=0.28, size=9, hsize=8.4)
    if c.get('cam'):
        P(d, '**CAM check for delirium** (positive when the first two AND one of the last two are present):', size=9.2, after=1, keep=True)
        checks(d, ['Acute change or ups and downs in thinking', 'Inattention (cannot keep focus)', 'Disorganized thinking', 'Altered level of consciousness'], size=9, cols=2)
        P(d, 'Our CAM result:  ☐ Positive   ☐ Negative', size=9.2, bold=True, after=3)
    exam_table(d, c)
    if n == 1:
        pic(d, 'reflex_scale.png', 5.2, after=1)
        P(d, 'Reflex scale: tap below the kneecap. 0 none, 1+ weak, 2+ normal, 3+ brisk, 4+ clonus.', size=8, italic=True, color=GRAY, align='center', after=2)
    for b in c['c_boxes']: render_block(d, b)
    four = bool(c.get('four'))
    m = 4 if four else 3
    # ---------- page 2
    page_top(d); tag(d, label, 2, m)
    role_head(d, 'A', 'Read the chart like a crime scene: orders, MAR, notes, sticky notes.')
    for b in c['a_blocks']: render_block(d, b)
    role_head(d, 'B', 'Turn the numbers into a story: compare to the diagnosis and the trend.')
    for b in c['b_blocks']:
        if not b.get('pg'): render_block(d, b)
    if four:
        page_top(d); tag(d, label, 3, m)
        role_head(d, 'B', 'Continued: how the machine works.')
        for b in c['b_blocks']:
            if b.get('pg') == 3: render_block(d, b)
        mg_block(d, c)
        page_top(d); tag(d, label, 4, m)
        huddle_block(d, n, c, part='all')
        clue_and_points(d, n, c)
        return
    # ---------- page 3
    page_top(d); tag(d, label, 3, m)
    mg_block(d, c)
    huddle_block(d, n, c)
    clue_and_points(d, n, c, last=(n == 6))


# ================================================================== CLOSING
def closing(d):
    n = 7; c = MON[7]
    page_top(d); tag(d, 'CASE CLOSED', 1, 3)
    page_banner(d, 'CASE CLOSED: THE FINAL CHECK', 'Wednesday 0700', sub='The clock has reached the end of the case. Check Ray one more time, then close the file.')
    callout(d, 'SITUATION  (the instructor reads this aloud)', [
        'It is **Wednesday 0700**. After the bisacodyl suppository Ray had a large stool at 0345 and slept. The 0500 magnesium is **5.3** (down from 6.4) and the creatinine is 3.3 (it peaked at 5.3). Urine has recovered to 85 mL/h. Weight is 90.0 kg (88.0 on arrival).',
        'Dr. Raman says no more dialysis for now. The dialysis catheter stays 24 hours just in case. The Foley can come out, and furosemide is due at 0800 for the extra fluid. Eleanor is back at the bedside.'], fill='FFF8E1', icon='icon_clock.png', size=9.4)
    role_head(d, 'C', 'Final check at the bedside (everyone looks, the Bedside Nurse writes).')
    vitals_log_final(d)
    grid(d, ['What to check', 'What you find', 'Better than 0300?'], [2.55, 3.4, 1.35],
         [['Level of consciousness and orientation', '', '☐ yes  ☐ no'], ['Breathing: rate for a FULL minute', '', '☐ yes  ☐ no'], ['Reflexes (0 to 4+) and grip', '', '☐ yes  ☐ no'], ['Lungs, neck veins, ankles', '', '☐ yes  ☐ no'],
          ['Abdomen and last stool', '', '☐ yes  ☐ no'], ['Urine last hour; weight (kg)', '', '☐ yes  ☐ no']], row_h=0.32, size=8.8, hsize=8.4, pre_fill={0: 'F6F6F6'})
    P(d, '**B  Lab Interpreter:** the last results, peak versus now.', size=9.4, after=1, keep=True)
    grid(d, ['Test', 'Normal', 'WORST value (circle when it happened)', 'Wed 0500 (final)'], [1.9, 1.2, 2.7, 1.5],
         [['Magnesium (mg/dL)', '1.7-2.2', '', ''], ['Potassium (mmol/L)', '3.5-5.1', '', ''], ['Creatinine (mg/dL)', '0.7-1.3', '', '']], row_h=0.28, size=8.8, hsize=8.4, pre_fill={0: 'F6F6F6', 1: 'F6F6F6'})
    banner(d, 'MG-O-METER, THE WHOLE STORY: plot all your Mg results and connect the dots', 'from your Mg tracker boxes', fill='3B3B3B', size=10.5, h=0.32)
    pic(d, 'mg_full.png', 5.3, after=1)
    P(d, 'Mark an arrow on the chart for each of these: **calcium gluconate** (first given), **dialysis**, and the **hidden magnesium** you caught.', size=9, after=2)

    # page 2: timeline
    page_top(d); tag(d, 'CASE CLOSED', 2, 3)
    page_banner(d, 'THE STAY IN SEVEN STOPS', 'timeline', sub='Fill in the Mg result for each stop (use the lab draw closest to the time), then the big problem and what your squad did about it.')
    pic(d, 'timeline_banner.png', W, after=3)
    rows = [[t['time'], '', '', ''] for t in F.TIMELINE]
    grid(d, ['Stop', 'Mg result', 'The BIG problem at that stop', 'What our squad did'], [0.85, 0.9, 2.8, 2.75], rows, row_h=0.62, size=9, hsize=8.6, center=[0, 1], pre_fill={0: 'F6F6F6'})
    P(d, '**Plot-twist scoreboard.** Look back at your six predictions. Which one came closest to the truth? What surprised you most?', size=9.4, after=1, keep=True)
    lines(d, 3)
    P(d, '**Our top clue:** which of the six "CLUE UNLOCKED" cards mattered most for keeping Ray safe, and why?', size=9.4, after=1, keep=True)
    lines(d, 2)

    # page 3: teach-back, reflection, peer check
    page_top(d); tag(d, 'CASE CLOSED', 3, 3)
    page_banner(d, 'TEACH-BACK, REFLECTION AND TEAM CHECK', 'finish together, then individually')
    callout(d, 'TEACH-BACK TO ELEANOR', [F.TEACHBACK_SCENE, 'Write **three tips in plain words** (like you would say them at the kitchen table: no medical jargon). Think: which products to avoid and how she will know, safe choices, and when to call.'], fill='ECE6F7', icon='icon_team.png', size=9.4)
    for k in (1, 2, 3):
        t = new_table(d, 1, 2, [0.5, W - 0.5], borders=MED)
        shade(t.rows[0].cells[0], 'ECE6F7'); ctext(t.rows[0].cells[0], f'Tip {k}', size=9, bold=True, align='center'); rowh(t.rows[0], 0.5); nosplit(t.rows[0])
        spacer(d, 2)
    P(d, '**How will you know Eleanor understood?** Write your teach-back question (a question that makes her show you, not just say "yes"):', size=9.4, after=1, keep=True)
    lines(d, 2)
    P(d, 'INDIVIDUAL REFLECTION (cut or fold along the dotted lines; write your own name)', size=10, bold=True, color=INK, after=2, before=3, keep=True)
    for k in range(3):
        t = new_table(d, 1, 1, [W], borders=DASH); nosplit(t.rows[0])
        cc = t.rows[0].cells[0]; cc.text = ''
        p = first_par(cc); run(p, 'Name: ________________________________    ', bold=True, size=9.4, color=INK); rich(p, '**I did well:** ______________________________________________', size=9)
        for ln in ['**One thing I will do differently on clinical:** ____________________________________________________________', '**One question I still have:** ________________________________________________________________________']:
            pp = cc.add_paragraph(); pp.paragraph_format.space_before = Pt(5); rich(pp, ln, size=9)
        rowh(t.rows[0], 0.9)
        spacer(d, 2)
    P(d, 'PEER TEAMWORK CHECK (everyone fills in their own; the instructor sees it, your teammates do not)', size=10, bold=True, color=INK, after=1, before=3, keep=True)
    grid(d, ['Teammate (not you)'] + F.PEER_CRITERIA + ['One kind, useful comment'], [1.5, 1.2, 1.0, 1.3, 2.3],
         [['', '☐ yes  ☐ sometimes', '☐ yes  ☐ sometimes', '☐ yes  ☐ sometimes', ''], ['', '☐ yes  ☐ sometimes', '☐ yes  ☐ sometimes', '☐ yes  ☐ sometimes', '']], row_h=0.42, size=7.8, hsize=7.6, center=[1, 2, 3])
    P(d, 'Rater name: ________________________________', size=9, after=0)


def vitals_log_final(d):
    prev = MON[6]; now = MON[7]
    cols = ['Time', 'Temp (F)', 'HR', 'BP (MAP)', 'RR', 'SpO2 / oxygen', 'Pain', 'Rhythm (read the monitor)', 'Glucose', 'Weight']
    ws = [0.62, 0.5, 0.42, 0.78, 0.5, 0.85, 0.6, 1.4, 0.7, 0.6]; ws = [w * (W / sum(ws)) for w in ws]
    rows = [['last time\n0300', prev['temp'], prev['hr'], f"{prev['bp']} ({prev['map']})", prev['rr'], prev['spo2'].replace('room air', 'RA'), prev['pain'].split(' ')[0], prev['rhythm'], prev['glucose'], '-'],
            ['0700\nNOW'] + [''] * 9]
    tt = grid(d, cols, ws, rows, row_h=0.38, size=8.2, hsize=8, center=list(range(len(cols))), fills={(0, j): 'F0F0F0' for j in range(len(cols))})
    rowh(tt.rows[2], 0.42)


# ================================================================== MAIN
def build():
    d = new_doc('Squad name: ____________________________________', 'The Case of the Silent Mineral  •  Page',
                'Turn in with a paperclip (no staples).  Write in dark pen.  Do not turn the page until the instructor advances the clock.')
    cover(d); rubric(d); patient_card(d); roles_page(d); handoff_page(d)
    for n in range(1, 7): checkpoint(d, n)
    closing(d)
    d.save(OUT_DOCX)
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    json.dump(TAGS, open(os.path.join(HERE, 'out', 'page_tags.json'), 'w'), indent=1)
    print('wrote', os.path.normpath(OUT_DOCX), 'logical pages:', len(TAGS))


if __name__ == '__main__':
    build()
