#!/usr/bin/env python3
"""Builds the STUDENT packet (Word) for the Nora Whitcombe team case study: ../CASE_STUDY_PACKET.docx (+ out/page_tags.json for the layout and spoiler checks).
Same format as the addison template, plus a QUICK CHECK box on every checkpoint page. No answers here."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from dx import *
import content2 as C
from monvals import MON

OUT_DOCX = os.path.join(HERE, '..', 'CASE_STUDY_PACKET.docx')
TAGS = []
LINE = 0.2     # writing line height (inches)
GREY = 'EDEDED'
STOPS = ['0700', '1100', '1500', '1900', '2300', '0300', '0700']
STOP_HEAD = ['Mon 0700', 'Mon 1100', 'Mon 1500', 'Mon 1900', 'Mon 2300', 'Tue 0300', 'Tue 0700']


def tag(d, label, k, m):
    TAGS.append(f'{label} | page {k} of {m}')
    P(d, f'{label}  |  page {k} of {m}', size=6.5, color='888888', align='right', after=0)


def banner2(d, left, right='', sub=None):
    banner(d, left, right, fill=INK, size=14, sub=sub, h=0.4)


def box(d, items, n, fill=None, gap=0.15, line_h=LINE, numbered=False, w=W, img=None):
    """one or two labelled writing boxes side by side; items = list of (label, hint[, header fill]); n = number of ruled lines.
    img = (file, width_in, caption): a small screenshot in a column to the right of a single box (rows merged)."""
    k = len(items)
    if img:
        iw = img[1] + 0.08
        ws = [w - iw - 0.1, 0.1, iw]; cols = [0]
    else:
        ws = [w] if k == 1 else [(w - gap) / 2, gap, (w - gap) / 2]
        cols = [0] if k == 1 else [0, 2]
    t = new_table(d, n + 1, len(ws), ws, borders=None)
    for ci, it in zip(cols, items):
        label, h = it[0], it[1]; hf = it[2] if len(it) > 2 else GREY
        c = t.rows[0].cells[ci]; shade(c, hf); box_borders(c, MED); c.text = ''
        p = first_par(c); rich(p, label, size=9.4, bold=True, color=INK)
        if h: run(p, '  ' + h, size=8.6, color='333333')
        c.paragraphs[0].paragraph_format.keep_with_next = True
        for i in range(1, n + 1):
            cc = t.rows[i].cells[ci]
            border(cc, left=MED, right=MED, top=NONE, bottom=MED if i == n else HAIR)
            if fill: shade(cc, fill)
            if numbered and k == 1:
                cc.text = ''; pp = first_par(cc); run(pp, f'{i}.', size=9, color='777777', bold=True)
    for i, r in enumerate(t.rows):
        nosplit(r)
        if i == 0: rowh(r, 0.22)          # header can wrap to 2 lines (pair prompts)
        else: rowh(r, line_h, True)
        for c in r.cells: c.paragraphs[0].paragraph_format.keep_with_next = i < n
    if img:
        m = t.cell(0, 2).merge(t.cell(n, 2)); m.text = ''
        p = first_par(m, align='center'); p.add_run().add_picture(os.path.join(FIG, img[0]), width=Inches(img[1]))
        p2 = m.add_paragraph(); p2.alignment = WD_ALIGN_PARAGRAPH.CENTER; p2.paragraph_format.space_after = Pt(0)
        run(p2, img[2], size=6.8, italic=True, color='444444'); valign(m, 'top')
    spacer(d, 1)
    return t


def vitals_row(d, n):
    """one blank row: the students write the vitals they take (no earlier values printed)"""
    cols = ['Time', 'Temp F', 'HR', 'BP (MAP)', 'RR and depth', 'SpO2', 'Pain', 'Rhythm / T waves', 'Glucose (ask)', 'Mental status']
    ws = [0.55, 0.48, 0.4, 0.78, 0.9, 0.5, 0.42, 1.25, 0.8, 1.1]; ws = [x * W / sum(ws) for x in ws]
    now = [MON[n]['clock'].split(' ')[1]] + [''] * 9
    t = grid(d, cols, ws, [now], row_h=0.3, size=7.4, hsize=7.4, center=list(range(10)))
    return t


def charge_bar(d, left, right):
    t = new_table(d, 2, 2, [3.2, 4.1], borders=None)
    for c in t.rows[0].cells: shade(c, INK)
    c = t.rows[0].cells[0]; c.text = ''; p = first_par(c); rich(p, left, size=14, bold=True, color='FFFFFF'); valign(c)
    c = t.rows[0].cells[1]; c.text = ''; p = first_par(c, align='right'); rich(p, right, size=9.5, bold=True, color='FFFFFF'); valign(c)
    rowh(t.rows[0], 0.36)
    t.rows[1].cells[0].merge(t.rows[1].cells[1])
    c = t.rows[1].cells[0]; shade(c, 'FFFFFF'); box_borders(c, MED)
    ctext(c, '**Charge nurse for this stop:** ______________________   ☐ every pair reported to the charge nurse   ☐ SBAR given', size=8.3)
    rowh(t.rows[1], 0.28)
    spacer(d, 2)


def blanks(t):
    """[[answer]] -> a writing blank about as long as the answer"""
    return re.sub(r'\[\[(.+?)\]\]', lambda m: '_' * max(8, min(34, int(len(m.group(1)) * 1.3))), t)


def sit_box(d, lines, fill='FFF8E1'):
    t = new_table(d, 1, 1, [W], borders=MED)
    c = t.rows[0].cells[0]; shade(c, fill); c.text = ''
    first = True
    for i, ln in enumerate(lines):
        p = first_par(c) if first else c.add_paragraph(); first = False
        p.paragraph_format.space_after = Pt(2)
        if i == 0: run(p, 'SITUATION  ', bold=True, size=9, color=INK)
        rich(p, blanks(ln), size=8.8)
    spacer(d, 2)


def tracker_tick(d, n):
    t = new_table(d, 1, 2, [4.55, 2.75], borders=MED)
    for c in t.rows[0].cells: shade(c, 'FFFFFF')
    extra = '  + DKA map (p. 2) ☐' if n == 1 else ''
    ctext(t.rows[0].cells[0], f'**RESPONSE TRACKER** (p. 3), **Vitals & Assessment pair**: {STOP_HEAD[n - 1]} column ☐' + extra, size=7.8)
    ctext(t.rows[0].cells[1], ('Compared with the ED she is:' if n == 1 else 'Since the last stop she is:') + '  ☐ better  ☐ same  ☐ worse', size=7.8)
    rowh(t.rows[0], 0.24)
    spacer(d, 2)


def sbar_box(d, lh=0.205, title='SBAR to the provider', hint=''):
    t = new_table(d, 5, 2, [0.95, W - 0.95], borders=None)
    for j in range(2):
        c = t.rows[0].cells[j]; shade(c, GREY); box_borders(c, MED)
    t.rows[0].cells[0].merge(t.rows[0].cells[1])
    c = t.rows[0].cells[0]; c.text = ''
    p = first_par(c); rich(p, title, size=9.4, bold=True, color=INK); run(p, hint, size=8, italic=True, color='555555')
    for i, (L, nm) in enumerate((('S', 'Situation'), ('B', 'Background'), ('A', 'Assessment'), ('R', 'Recommend')), 1):
        a, b = t.rows[i].cells
        for cc in (a, b):
            border(cc, top=NONE, bottom=MED if i == 4 else HAIR)
        border(a, left=MED, right=NONE); border(b, right=MED, left=NONE)
        shade(a, 'F6F6F6'); ctext(a, f'**{L}**  {nm}', size=8.6, color=INK)
    for i, r in enumerate(t.rows):
        nosplit(r); rowh(r, 0.23 if i == 0 else lh, True)
    spacer(d, 4)


PAIRS = {'M': ('MEDS AND ORDERS', 'FFEFC2'), 'A': ('VITALS & ASSESSMENT', 'DCEBFA'), 'R': ('RESULTS & LABS', 'DDF0E1')}


NAMES = 'Names: ____________________  ____________________'
ACT = 'Actions to suggest (Vitals + Meds pairs)'


def pair_box(d, kind, n=3, img=None, extra=''):
    lab, fl = PAIRS[kind]
    box(d, [(lab + extra, NAMES, fl)], n, img=img)


def team_boxes(d, first=False, close=False):
    if first:
        box(d, [(ACT, '')], 2)
    else:
        box(d, [('What changed since 0300 and since arrival?' if close else 'What changed since the last stop?', ''), (ACT, '')], 3 if close else 2)
    box(d, [('Top 3 priorities' + (' for the day team' if close else ''), 'Charge RN: ______________________')], 3, numbered=True)
    sbar_box(d, title='Handoff to the day team (SBAR)' if close else 'SBAR to the provider')


def checkpoint_header(d, n, cp, k=1, m=1, right=None):
    page_top(d); tag(d, f'CHECKPOINT {n}' if n <= 6 else 'CASE CLOSED', k, m)
    charge_bar(d, f'{cp["time"]}  |  {cp["day"]}', right or cp['title'])
    sit_box(d, cp['sit'])


def stop(d):
    P(d, 'STOP. Do not turn the page until the instructor advances the clock.', size=9, bold=True, color=INK, align='center', before=1, after=0)


# ------------------------------------------------------------------ pages
def pathophys(d):
    """quick ADN-level pathophysiology box at the start of the packet (text in content2.PATHO)"""
    t = new_table(d, 1, 1, [W], borders=MED)
    c = t.rows[0].cells[0]; shade(c, 'F4F1FA'); c.text = ''
    p = first_par(c); rich(p, C.PATHO_TITLE, size=10.5, bold=True, color=INK); p.paragraph_format.space_after = Pt(2)
    for head, body in C.PATHO:
        p = c.add_paragraph(); p.paragraph_format.space_after = Pt(1.5)
        run(p, head + ':  ', bold=True, size=8.8, color=INK); rich(p, body, size=8.8)
    spacer(d, 4)


def cover(d):
    page_top(d); tag(d, 'FRONT', 1, 3)
    banner(d, 'TEAM CASE STUDY: NORA WHITCOMBE', 'Step-Down SD-6  |  Mon 0700 to Tue 0700', fill=INK, size=17, sub='The whole class is ONE nursing team for one patient across 24 hours. We move through the time together, 4 hours at a time.', h=0.62)
    P(d, 'Write your name in the header at the top of this page (it repeats on every page). Everyone fills in their own packet.', size=9, italic=True, color=GRAY, before=2, after=3)
    pathophys(d)
    P(d, 'HOW THE TWO HOURS WORK (about 15 minutes per stop)', size=11, bold=True, color=INK, before=2, after=2, keep=True)
    bullets(d, ['The instructor moves the clock **4 hours at a time**: 0700, 1100, 1500, 1900, 2300, 0300, and a final check at 0700 Tuesday. At each stop the instructor sets the bedside monitor and reads the situation; fill in the **blanks in the situation box** from the chart.',
                'Each pair does its job in the chart and at the bedside and writes its findings in its own box, **with your names**. You decide what to look for and what to ask. When a pair is finished, the **charge nurse gets the findings from that pair**. The **Vitals & Assessment** and **Meds and Orders** pairs work out the **actions to suggest** together. The charge nurse decides the **top 3 priorities**, then develops and gives the **SBAR**.',
                '**QUICK CHECK:** answer the 2-3 questions on your own during the stop. **At the end of each stop the instructor reveals the answers** with a one-line why. **Correct yours in a different color** and tick the box. These questions are for learning: **you will not lose points for a wrong answer you corrected.**',
                'The **Vitals & Assessment pair** fills one column of the **response tracker** (page 3) at every stop. **Do not turn the page** until the instructor advances the clock. Vitals come from the bedside monitor; **ask the instructor for the bedside glucose**. Write in dark pen.'], size=9.3)
    P(d, 'ROLES', size=11, bold=True, color=INK, before=3, after=2, keep=True)
    t = new_table(d, 2, 2, [1.6, W - 1.6], borders=MED)
    rows = [('CHARGE NURSE\n(one person; changes every stop)', 'Runs the section and keeps time. **Gets the findings from each pair when the pair is finished.** Decides the top 3 priorities with the team (writes their name in that box). **Develops and gives the SBAR.**'),
            ('NURSE PAIRS\n(switch jobs every stop)', 'The other students work in pairs. **At every checkpoint each pair is assigned a new job** and writes its names in that box. **Meds and Orders:** MAR, drips and riders, orders and notes: what is running, due, held or should change, and why. **Vitals & Assessment:** the bedside monitor, breathing, mouth and skin, mental status, intake and output, IV sites. **Results & Labs:** new labs (gap, BHB, gas, potassium, glucose), ECG, trends and what they mean. Report to the charge nurse when you are finished.')]
    for i, (a, b) in enumerate(rows):
        shade(t.rows[i].cells[0], 'ECE6F7' if i == 0 else 'DDF0E1'); ctext(t.rows[i].cells[0], '**' + a.split('\n')[0] + '**\n' + a.split('\n')[1], size=9)
        ctext(t.rows[i].cells[1], b, size=9.0); rowh(t.rows[i], 0.7)
    spacer(d, 4)
    P(d, 'CHARGE NURSE ROTATION  (each student is charge nurse exactly once)', size=10, bold=True, color=INK, before=2, after=2, keep=True)
    cols = ['Stop', '0700', '1100', '1500', '1900', '2300', '0300', 'Final 0700']
    grid(d, cols, [1.3] + [0.857] * 7, [['Charge nurse name'] + [''] * 7], row_h=0.36, size=9.4, hsize=8.6, center=list(range(8)), pre_fill={0: 'F4F4F4'})
    P(d, 'TURN-IN', size=10, bold=True, color=INK, before=2, after=1, keep=True)
    P(d, 'Each student turns in their own packet, fastened with a **paperclip (no staples)**. The last page is your individual reflection and peer check.', size=9.2, after=0)


def patient_page(d):
    page_top(d); tag(d, 'FRONT', 2, 3)
    banner2(d, 'PATIENT CARD: NORA WHITCOMBE', 'Room SD-6')
    t = new_table(d, 1, 1, [W], borders=THIN)
    c = t.rows[0].cells[0]; c.text = ''
    facts = [('Name', 'Nora Whitcombe, she/her, 22 years old, DOB 09/14/2004   |   **MRN** SIM-40602   |   165 cm, **55.0 kg** (ED bed scale; dosing weight); usual 61.0 kg'),
             ('ALLERGY', '**Amoxicillin** (rash as a child)   |   **Full Code**   |   Fall risk: HIGH   |   Standard precautions   |   Telemetry'),
             ('History', '**No known diabetes.** About 6 weeks of thirst, urinating, hunger, weight loss, tiredness and blurry vision; vomiting and belly pain since Sunday. Third-year environmental science student; runs 3 times a week.'),
             ('Home meds', 'Levonorgestrel IUD; ibuprofen 400 mg PRN for headaches (held). No supplements.'),
             ('Family', 'Mother **Julia Whitcombe** (49, emergency contact, driving in from 3 hours away); roommate **Kendall Rowan** (21) brought her in. Maternal aunt has type 2 diabetes.'),
             ('Care team', 'Day hospitalist Dr. A. Petrakis; night hospitalist Dr. D. Rasmussen; endocrinology Dr. C. Navarro; pharmacist Y. Kassab; dietitian R. Lowell; diabetes educator E. Thornbury.'),
             ('Normal values', 'Sodium 136-145   |   potassium 3.5-5.1   |   CO2 22-29   |   anion gap 8-12   |   BHB under 0.6   |   venous pH 7.31-7.41   |   glucose 70-99 (fasting)'),
             ('Math', 'Anion gap = Na - Cl - CO2.   Corrected Na = Na + 1.6 x (glucose - 100) / 100.   Urine needed before giving potassium: at least 0.5 mL/kg/h.')]
    first = True
    for k, v in facts:
        p = first_par(c) if first else c.add_paragraph(); first = False
        p.paragraph_format.space_after = Pt(2)
        run(p, k + ':  ', bold=True, size=9.0, color=INK); rich(p, v, size=9.0)
    spacer(d, 5)
    banner(d, 'DKA MAP: WHY DOES SHE LOOK LIKE THIS?', 'fill it in at 0700', fill='3B3B3B', size=10.5, h=0.3)
    P(d, C.MAP_CHAIN, size=8.6, italic=True, after=2)
    P(d, 'Write what you find in Nora\'s chart and at the bedside (with numbers) for each row.', size=8.8, after=2)
    t = new_table(d, 5, 3, [1.45, 2.45, 3.4], borders=THIN)
    for j, h in enumerate(['Problem', 'What normally happens', 'What Nora shows (chart numbers and bedside findings)']):
        cc = t.rows[0].cells[j]; shade(cc, 'E4E4E4'); ctext(cc, h, size=8.6, bold=True); box_borders(cc, MED)
    for i, (h, does) in enumerate(C.MAP, 1):
        ctext(t.rows[i].cells[0], f'**{h}**', size=8.4); shade(t.rows[i].cells[0], 'F4F4F4')
        ctext(t.rows[i].cells[1], does, size=7.9, v='top')
        rowh(t.rows[i], 0.56); nosplit(t.rows[i])
    spacer(d, 5)
    banner(d, 'FINDING IT IN THE EHR (this is what the chart shows at 0700)', '', fill='3B3B3B', size=10.5, h=0.3)
    t = new_table(d, 2, 2, [3.3, 4.0], borders=None)
    pic_in(t.rows[0].cells[0], 'ehr_mar.png', 2.9); valign(t.rows[0].cells[0], 'top')
    ctext(t.rows[0].cells[1], '**MAR:** a drip that came from the ED shows **Running** in the 0700 column, with its rate. A blue **Due** box is yours to give, hold or question. Click a medicine name for the full order and its protocol text.', size=8.3, v='center')
    pic_in(t.rows[1].cells[0], 'ehr_ecg.png', 2.7); valign(t.rows[1].cells[0], 'top')
    ctext(t.rows[1].cells[1], '**Chart Review > Cardiology:** the ED 12-lead ECG. Click **View tracing** to see the strip and look at the T waves.', size=8.3, v='center')


def rubric_page(d):
    page_top(d); tag(d, 'FRONT', 3, 3)
    banner2(d, 'HOW YOU EARN YOUR 20 POINTS', 'team grade', sub='A complete, careful, team-minded effort earns full credit. Nothing here is a trick.')
    t = new_table(d, 5, 4, [1.55, 2.05, 1.85, 1.85], borders=THIN)
    for j, h in enumerate(['Category and points', 'FULL credit', 'GOOD (partial)', 'GETTING THERE']):
        c = t.rows[0].cells[j]; shade(c, 'D9D9D9'); ctext(c, h, size=9, bold=True, align='center'); box_borders(c, MED)
    fills = ['ECE6F7', 'DCEBFA', 'FFEFC2', 'DDF0E1']
    for i, r in enumerate(C.RUBRIC, 1):
        row = t.rows[i]; nosplit(row); rowh(row, 0.72)
        c0 = row.cells[0]; shade(c0, fills[i - 1]); c0.text = ''
        p = first_par(c0); rich(p, r['cat'], size=9, bold=True, color=INK)
        p = c0.add_paragraph(); rich(p, f'{r["pts"]} points', size=12, bold=True, color=INK)
        for j, key in ((1, 'full'), (2, 'good'), (3, 'start')):
            c = row.cells[j]; c.text = ''; rich(first_par(c), r[key], size=8.2)
        for c in row.cells: box_borders(c, THIN)
    spacer(d, 5)
    banner(d, 'RESPONSE TRACKER: IS THE TREATMENT WORKING?', 'Vitals & Assessment pair fills this in', fill='3B3B3B', size=10.5, h=0.3)
    P(d, '**Vitals & Assessment pair:** fill in this stop\'s column at every stop (ask the Results & Labs pair for the lab numbers). Add an arrow (up, down, same) when it helps. In the last row circle **B**etter, **S**ame or **W**orse.', size=8.6, after=2)
    cols = ['Measure', 'Goal'] + STOP_HEAD
    ws = [1.05, 1.5] + [(W - 2.55) / 7] * 7
    rows = [[f'**{m}**', g] + [''] * 7 for m, g in C.TRACKER]
    rows[-1] = ['**OVERALL**', 'Better, same or worse than the last stop?'] + ['B   S   W'] * 7
    t = grid(d, cols, ws, rows, row_h=0.37, size=7.6, hsize=8, center=list(range(2, 9)), pre_fill={0: 'F4F4F4', 1: 'F9F9F9'})
    for r in t.rows[1:]:
        for c in r.cells[1:2]:
            for p in c.paragraphs:
                for rr in p.runs: rr.font.size = Pt(7)


QC_FILL = 'F3EEFB'
QC_HEAD = 'E4DAF5'


def qc_box(d, qs):
    """QUICK CHECK box: 2-3 questions (multiple choice with 4 options, select-all, or one-line fill-in), each labelled with its
    clinical judgment step, with tick boxes. No answers are printed here (the key has them)."""
    rows = [('head', None)]
    for i, q in enumerate(qs, 1):
        rows.append(('q', (i, q)))
        if q['kind'] in ('mc', 'sata'):
            o = q['opts']; short = max(len(x) for x in o) <= 26 and len(o) == 4
            per = 4 if short else 2
            for k in range(0, len(o), per):
                rows.append(('o', ([(chr(65 + k + j), o[k + j]) for j in range(per) if k + j < len(o)] + [None] * (per - len(o[k:k + per])), per)))
        else:
            rows.append(('f', None))
    t = new_table(d, len(rows), 4, [W / 4] * 4, borders=None)
    for ri, (kind, data) in enumerate(rows):
        r = t.rows[ri]; nosplit(r)
        cells = r.cells
        if kind == 'head' or kind == 'q' or kind == 'f':
            m = cells[0].merge(cells[3])
            if kind == 'head':
                shade(m, QC_HEAD); m.text = ''
                p = first_par(m); rich(p, 'QUICK CHECK', size=9.4, bold=True, color=INK)
                run(p, '   (on your own; answers revealed at the end of this stop)          Corrected in a different color: ☐', size=8.3, color='333333')
                rowh(r, 0.24)
            elif kind == 'q':
                i, q = data; shade(m, QC_FILL); m.text = ''
                p = first_par(m); run(p, f'{i}. ', bold=True, size=8.6, color=INK); run(p, f'[{q["step"]}]  ', italic=True, size=8.0, color='5B3F8C')
                rich(p, q['q'] + ('  (Select all that apply.)' if q['kind'] == 'sata' and 'Select all' not in q['q'] else ''), size=8.6)
                rowh(r, 0.18)
            else:
                shade(m, QC_FILL); m.text = ''
                p = first_par(m); run(p, '      Answer: ' + '_' * 40 + '      ' + '_' * 40, size=8.6, color='333333')
                rowh(r, 0.26)
        else:
            opts, per = data[0], data[1]
            if per == 2:
                a = cells[0].merge(cells[1]); b = cells[2].merge(cells[3]); targets = [a, b]
            else:
                targets = list(cells)
            for tc, op in zip(targets, opts):
                shade(tc, QC_FILL); tc.text = ''
                if op:
                    p = first_par(tc); run(p, '☐ ' + op[0] + '  ', bold=True, size=8.4, color=INK); rich(p, op[1], size=8.2)
            rowh(r, 0.17)
        for c in r.cells:
            border(c, left=NONE, right=NONE, top=NONE, bottom=NONE)
        border(r.cells[0], left=MED); border(r.cells[-1], right=MED)
        if ri == 0:
            for c in r.cells: border(c, top=MED)
        if ri == len(rows) - 1:
            for c in r.cells: border(c, bottom=MED)
        for c in r.cells:
            pf = c.paragraphs[0].paragraph_format; pf.keep_with_next = ri < len(rows) - 1; pf.line_spacing = 1.0; pf.space_after = Pt(0); pf.space_before = Pt(0)
    spacer(d, 3)


def checkpoint(d, n):
    cp = C.CP[n]
    checkpoint_header(d, n, cp)
    vitals_row(d, n)
    shot = cp.get('shot')
    for kind in 'MAR':
        img = None
        if shot and shot[0] == kind:
            img = (shot[1], 1.8, shot[2])
        pair_box(d, kind, 2, img=img)
    qc_box(d, cp['qc'])
    tracker_tick(d, n)
    team_boxes(d, first=(n == 1))
    box(d, [('Prediction for the next 4 hours', ''), ('Charge nurse notes', '')], 2)


def closing(d):
    cp = C.CLOSE
    checkpoint_header(d, 7, cp, 1, 3, right='Final check, page 1 of 2')
    vitals_row(d, 7)
    for kind in 'MAR':
        pair_box(d, kind, 2)
    qc_box(d, cp['qc'])
    tracker_tick(d, 7)
    p = P(d, 'EVALUATE: DID THE TREATMENT WORK?', size=10.5, bold=True, color=INK, before=2, after=2, keep=True)
    run(p, '   Use the tracker (page 3) and the chart: arrival (Mon 0700) vs now, then goal met?', size=8.4, italic=True, color=GRAY)
    rows = [[f'**{e[0]}**', e[1], '', '', '☐ yes  ☐ no'] for e in C.EVAL]
    grid(d, ['Criterion', 'Goal', 'At arrival (Mon 0700)', 'Now (Tue 0700)', 'Goal met?'], [1.4, 2.05, 1.35, 1.35, 1.15], rows, row_h=0.23, size=7.6, hsize=7.8, center=[4], pre_fill={0: 'F4F4F4'})
    box(d, [('Our verdict on the treatment', '')], 2)


def closing2(d):
    page_top(d); tag(d, 'CASE CLOSED', 2, 3)
    banner2(d, '0700  |  Tuesday', 'Final check, page 2 of 2', sub='Going home safely. Same charge nurse.')
    team_boxes(d, close=True)
    pair_box(d, 'M', 3, extra=': her insulin plan at home')
    box(d, [('Survival skills: insulin pen and meter', ''), ('Sick-day rules we will teach', '')], 4)
    box(d, [('Low glucose: the rule of 15 (and glucagon)', ''), ('Medical ID and who needs to know', '')], 4)
    box(d, [('Our teach-back question for Nora and Julia', ''), ('Is she ready to go home? What is still missing?', '')], 3)
    box(d, [('Charge nurse notes', '')], 2)


def reflection(d):
    page_top(d); tag(d, 'CASE CLOSED', 3, 3)
    banner2(d, 'MY REFLECTION AND PEER CHECK', 'individual', sub='Hand this page in with your own name on it.')
    P(d, 'Name: _______________________________    My charge stop: ________', size=9.6, after=4)
    box(d, [('1. Something I learned about DKA and new type 1 diabetes from Nora\'s case (how the body, the treatment or the evaluation works)', '')], 5)
    box(d, [('2. A Quick Check I got wrong (or nearly did): what tempted me, and what I know now', '')], 4)
    box(d, [('3. Something our team did well (and who helped)', '')], 4)
    box(d, [('4. One thing I would do differently as a charge nurse or as a nurse', '')], 4)
    P(d, 'PEER TEAMWORK CHECK', size=11, bold=True, color=INK, before=3, after=2, keep=True)
    P(d, 'Rate up to three teammates (not yourself). Mark one box for each.', size=9, italic=True, color=GRAY, after=2, keep=True)
    opts = '☐ yes   ☐ mostly   ☐ not yet'
    grid(d, ['Teammate'] + C.PEER_CRITERIA + ['One kind, useful comment'], [1.4, 1.45, 1.45, 1.45, 1.55],
         [['', opts, opts, opts, ''], ['', opts, opts, opts, ''], ['', opts, opts, opts, '']], row_h=0.5, size=7.6, hsize=8, center=[1, 2, 3])
    P(d, 'Hand in your reflection with your packet. Thank you!', size=9, italic=True, color=GRAY, align='center', before=2, after=0)


def build():
    d = new_doc('Student name: ____________________________________', 'Nora Whitcombe Team Case Study  |  Page',
                'Turn in with a paperclip (no staples).  Write in dark pen.  Do not turn the page until the instructor advances the clock.', top=0.62, bottom=0.42)
    cover(d); patient_page(d); rubric_page(d)
    for n in range(1, 7): checkpoint(d, n)
    closing(d); closing2(d); reflection(d)
    d.save(OUT_DOCX)
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    json.dump(TAGS, open(os.path.join(HERE, 'out', 'page_tags.json'), 'w'), indent=1)
    print('wrote', os.path.normpath(OUT_DOCX), 'logical pages:', len(TAGS))


if __name__ == '__main__':
    build()
