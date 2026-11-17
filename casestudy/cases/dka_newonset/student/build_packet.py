#!/usr/bin/env python3
"""Builds the STUDENT packet (Word) for the Lauren Mitchell team case study: ../CASE_STUDY_PACKET.docx (+ out/page_tags.json for the layout and spoiler checks).
Same format as the hypermag student2 packet. No answers here."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from dx import *
import content2 as C
from monvals import MON, ED_VITALS

OUT_DOCX = os.path.join(HERE, '..', 'CASE_STUDY_PACKET.docx')
TAGS = []
LINE = 0.225     # writing line height (inches)
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
        if i == 0: rowh(r, 0.25)          # header can wrap to 2 lines (pair prompts)
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
    cols = ['Time', 'Temp F', 'HR', 'BP lying (MAP)', 'Standing BP, HR', 'RR', 'SpO2', 'Pain', 'Rhythm on the monitor', 'Glucose']
    ws = [0.62, 0.48, 0.4, 0.78, 1.2, 0.36, 0.7, 0.42, 1.65, 0.69]; ws = [x * W / sum(ws) for x in ws]
    now = [MON[n]['clock'].split(' ')[1]] + [''] * 9
    t = grid(d, cols, ws, [now], row_h=0.38, size=7.4, hsize=7.4, center=list(range(10)))
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
        rich(p, blanks(ln), size=9.0)
    spacer(d, 2)


def tracker_tick(d, n):
    t = new_table(d, 1, 2, [4.1, 3.2], borders=MED)
    for c in t.rows[0].cells: shade(c, 'FFFFFF')
    extra = '   Hormone map (p. 2) ☐' if n == 1 else ''
    ctext(t.rows[0].cells[0], f'**RESPONSE TRACKER** (page 3): **Vitals & Assessment pair**, fill in the {STOP_HEAD[n - 1]} column ☐' + extra, size=8.2)
    ctext(t.rows[0].cells[1], ('Compared with the ED she is:' if n == 1 else 'Since the last stop she is:') + '  ☐ better  ☐ same  ☐ worse', size=8.3)
    rowh(t.rows[0], 0.3)
    spacer(d, 3)


def sbar_box(d, lh=0.25, title='SBAR to the provider', hint=''):
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
        nosplit(r); rowh(r, 0.26 if i == 0 else lh, True)
    spacer(d, 4)


PAIRS = {'M': ('MEDS AND ORDERS', 'FFEFC2'), 'A': ('VITALS & ASSESSMENT', 'DCEBFA'), 'R': ('RESULTS & LABS', 'DDF0E1')}


NAMES = 'Names: ____________________  ____________________'
ACT = 'Actions to suggest (Vitals + Meds pairs)'


def pair_box(d, kind, n=3, img=None, extra=''):
    lab, fl = PAIRS[kind]
    box(d, [(lab + extra, NAMES, fl)], n, img=img)


def team_boxes(d, first=False, close=False):
    if first:
        box(d, [(ACT, '')], 3)
    else:
        box(d, [('What changed since 0300 and since arrival?' if close else 'What changed since the last stop?', ''), (ACT, '')], 3)
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
    banner(d, 'TEAM CASE STUDY: LAUREN MITCHELL', '4 West, Room 4W-22  |  Mon 0700 to Tue 0700', fill=INK, size=17, sub='The whole class is ONE nursing team for one patient across 24 hours. We move through the time together, 4 hours at a time.', h=0.62)
    P(d, 'Write your name in the header at the top of this page (it repeats on every page). Everyone fills in their own packet.', size=9, italic=True, color=GRAY, before=2, after=3)
    pathophys(d)
    P(d, 'HOW THE TWO HOURS WORK', size=11, bold=True, color=INK, before=2, after=2, keep=True)
    bullets(d, ['The instructor moves the clock forward **4 hours at a time**: 0700, 1100, 1500, 1900, 2300, 0300, and a final check at 0700 Tuesday.',
                'At each checkpoint, the instructor sets the bedside monitor and reads the situation. Fill in the **blanks in the situation box** from the chart. Each pair does its job in the chart and at the bedside and writes its findings in its own box, **with your names**. You decide what to look for and what to ask.',
                'When a pair is finished, the **charge nurse gets the findings from that pair**. The **Vitals & Assessment** and **Meds and Orders** pairs work together on the **actions to suggest**. The charge nurse decides the **top 3 priorities**, then develops and gives the **SBAR** to the provider. Everyone writes them down.',
                'Every stop, the **Vitals & Assessment pair** fills one column of the **response tracker** (page 3): is the treatment working? At the end you use it to **evaluate** the whole treatment.',
                'Finish each page at the **end** of its time block. **Do not turn the page** until the instructor advances the clock. Use the EHR on your own device (vitals, MAR, results, notes); your patient and the time are synced with the instructor. **Vitals row:** read the bedside monitor, take your own set, do orthostatic vitals when ordered and safe, and ask the instructor for the bedside glucose. Write in dark pen.'], size=9.5)
    P(d, 'ROLES', size=11, bold=True, color=INK, before=3, after=2, keep=True)
    t = new_table(d, 2, 2, [1.6, W - 1.6], borders=MED)
    rows = [('CHARGE NURSE\n(one person; changes every stop)', 'Runs the section and keeps time. **Gets the findings from each pair when the pair is finished.** Decides the top 3 priorities with the team (writes their name in that box). **Develops and gives the SBAR.**'),
            ('NURSE PAIRS\n(switch jobs every stop)', 'The other students work in pairs. **At every checkpoint each pair is assigned a new job** and writes its names in that box. **Meds and Orders:** MAR, orders, notes: what is running, due, held or should change, and why. **Vitals & Assessment:** the bedside monitor, orthostatic vitals, the bedside exam (mental status, skin, mouth, belly), intake and output. **Results & Labs:** new labs, ECG, trends and what they mean. Report to the charge nurse when you are finished.')]
    for i, (a, b) in enumerate(rows):
        shade(t.rows[i].cells[0], 'ECE6F7' if i == 0 else 'DDF0E1'); ctext(t.rows[i].cells[0], '**' + a.split('\n')[0] + '**\n' + a.split('\n')[1], size=9)
        ctext(t.rows[i].cells[1], b, size=9.2); rowh(t.rows[i], 0.75)
    spacer(d, 5)
    P(d, 'CHARGE NURSE ROTATION  (each student is charge nurse exactly once)', size=10, bold=True, color=INK, before=2, after=2, keep=True)
    cols = ['Stop', '0700', '1100', '1500', '1900', '2300', '0300', 'Final 0700']
    grid(d, cols, [1.3] + [0.857] * 7, [['Charge nurse name'] + [''] * 7], row_h=0.4, size=9.4, hsize=8.6, center=list(range(8)), pre_fill={0: 'F4F4F4'})
    P(d, 'TURN-IN', size=10, bold=True, color=INK, before=2, after=1, keep=True)
    P(d, 'Each student turns in their own packet, fastened with a **paperclip (no staples)**. The last page is your individual reflection and peer check.', size=9.4, after=0)


def patient_page(d):
    page_top(d); tag(d, 'FRONT', 2, 3)
    banner2(d, 'PATIENT CARD: LAUREN MITCHELL', 'Room 4W-22')
    t = new_table(d, 1, 1, [W], borders=THIN)
    c = t.rows[0].cells[0]; c.text = ''
    facts = [('Name', 'Lauren Mitchell, she/her, 46 years old, DOB 05/14/1980   |   **MRN** SIM-40422   |   165 cm, **58.2 kg** on arrival (usual 61.0 kg)'),
             ('ALLERGY', '**Sulfamethoxazole-trimethoprim** (hives)   |   **Full Code**   |   Fall risk: HIGH   |   **Contact (enteric) precautions**: soap and water'),
             ('History', '**Addison disease** (autoimmune primary adrenal insufficiency) since 2021; Hashimoto hypothyroidism (2016); appendectomy at 19. Middle school science teacher.'),
             ('Home meds', '**Hydrocortisone** 15 mg at 0700 + 5 mg at 1400 (20 mg/day); **fludrocortisone** 0.1 mg daily; levothyroxine 88 mcg at 0600; vitamin D3 2,000 units daily.'),
             ('Family', 'Husband **Daniel Mitchell** (48, health care proxy); son **Ethan** (15, had a "stomach bug" on Friday).'),
             ('Care team', 'Day hospitalist Dr. R. Delacroix (0700-1900); night hospitalist Dr. K. Osei; endocrinology Dr. M. Harrington; pharmacist T. Nakagawa; dietitian E. Lindqvist.'),
             ('Normal values', 'Sodium 136-145   |   potassium 3.5-5.1   |   glucose 70-110   |   creatinine 0.5-1.1 (her usual 0.8)   |   cortisol (morning) 5-23   |   ACTH 7.2-63')]
    first = True
    for k, v in facts:
        p = first_par(c) if first else c.add_paragraph(); first = False
        p.paragraph_format.space_after = Pt(2.5)
        run(p, k + ':  ', bold=True, size=9.2, color=INK); rich(p, v, size=9.2)
    spacer(d, 5)
    banner(d, 'HORMONE MAP: WHY DOES SHE LOOK LIKE THIS?', 'fill it in at 0700', fill='3B3B3B', size=10.5, h=0.3)
    P(d, 'The adrenal glands make **cortisol** and **aldosterone**. In Addison disease both are missing. Write what you find in Lauren\'s chart and at the bedside (with numbers) for each hormone.', size=9, after=2)
    t = new_table(d, 4, 3, [1.45, 2.55, 3.3], borders=THIN)
    for j, h in enumerate(['Hormone', 'What it normally does', 'What Lauren shows (chart numbers and bedside findings)']):
        cc = t.rows[0].cells[j]; shade(cc, 'E4E4E4'); ctext(cc, h, size=8.6, bold=True); box_borders(cc, MED)
    for i, (h, does) in enumerate(C.HORMONES, 1):
        ctext(t.rows[i].cells[0], f'**{h}**', size=8.8); shade(t.rows[i].cells[0], 'F4F4F4')
        ctext(t.rows[i].cells[1], does, size=8.2, v='top')
        rowh(t.rows[i], 0.82); nosplit(t.rows[i])
    spacer(d, 6)
    banner(d, 'FINDING IT IN THE EHR (this is what the chart shows at 0700)', '', fill='3B3B3B', size=10.5, h=0.3)
    t = new_table(d, 2, 2, [4.62, 2.68], borders=None)
    pic_in(t.rows[0].cells[0], 'ehr_mar.png', 4.5); valign(t.rows[0].cells[0], 'top')
    ctext(t.rows[0].cells[1], '**MAR:** the home fludrocortisone (and the home hydrocortisone, not shown) are **held**: the row is hatched. The IV hydrocortisone row shows its schedule and the next due time. Click a medicine name for the full order.', size=8.4, v='center')
    pic_in(t.rows[1].cells[0], 'ehr_ecg.png', 4.1); valign(t.rows[1].cells[0], 'top')
    ctext(t.rows[1].cells[1], '**Chart Review > Cardiology:** the ED 12-lead ECG. Click **View tracing** to see the strip and look at the T waves. Later ECGs appear here too.', size=8.4, v='center')


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


def checkpoint(d, n):
    cp = C.CP[n]
    checkpoint_header(d, n, cp)
    vitals_row(d, n)
    shot = cp.get('shot')
    for kind in 'MAR':
        img = None
        lines = 3
        if shot and shot[0] == kind:
            w = 1.8 if 'tree' in shot[1] else 1.9
            img = (shot[1], w, shot[2])
            lines = 3
        pair_box(d, kind, lines, img=img)
    tracker_tick(d, n)
    team_boxes(d, first=(n == 1))
    box(d, [('Prediction for the next 4 hours', ''), ('Charge nurse notes', '')], 2)


def closing(d):
    cp = C.CLOSE
    checkpoint_header(d, 7, cp, 1, 3, right='Final check, page 1 of 2')
    vitals_row(d, 7)
    for kind in 'MAR':
        pair_box(d, kind, 2)
    tracker_tick(d, 7)
    P(d, 'EVALUATE: DID THE TREATMENT WORK?', size=10.5, bold=True, color=INK, before=2, after=1, keep=True)
    P(d, 'Use the response tracker (page 3) and the chart. Write the number at arrival (Mon 0700) and now, then decide: goal met?', size=8.6, italic=True, color=GRAY, after=2, keep=True)
    rows = [[f'**{e[0]}**', e[1], '', '', '☐ yes  ☐ no'] for e in C.EVAL]
    grid(d, ['Criterion', 'Goal', 'At arrival (Mon 0700)', 'Now (Tue 0700)', 'Goal met?'], [1.45, 2.0, 1.35, 1.35, 1.15], rows, row_h=0.3, size=7.8, hsize=8, center=[4], pre_fill={0: 'F4F4F4'})
    box(d, [('Our verdict on the treatment', '')], 2)


def closing2(d):
    page_top(d); tag(d, 'CASE CLOSED', 2, 3)
    banner2(d, '0700  |  Tuesday', 'Final check, page 2 of 2', sub='Going home safely. Same charge nurse.')
    team_boxes(d, close=True)
    pair_box(d, 'M', 3, extra=': the steroid plan at home')
    box(d, [('Sick-day rules we will teach', ''), ('The emergency injection', '')], 5)
    box(d, [('Medical ID, card and who needs to know', ''), ('Our teach-back question for Lauren and Daniel', '')], 3)
    box(d, [('Is she ready to go home? What must be true first?', '')], 4)
    box(d, [('Charge nurse notes', '')], 2)


def reflection(d):
    page_top(d); tag(d, 'CASE CLOSED', 3, 3)
    banner2(d, 'MY REFLECTION AND PEER CHECK', 'individual', sub='Hand this page in with your own name on it.')
    P(d, 'Name: _______________________________    Team: _______________________________    My charge stop: ________', size=9.6, after=4)
    box(d, [('1. Something I learned about adrenal crisis from Lauren\'s case (how the body, the treatment or the evaluation works)', '')], 5)
    box(d, [('2. Something our team did well (and who helped)', '')], 5)
    box(d, [('3. One thing I would do differently as a charge nurse or as a nurse', '')], 5)
    P(d, 'PEER TEAMWORK CHECK', size=11, bold=True, color=INK, before=3, after=2, keep=True)
    P(d, 'Rate up to three teammates (not yourself). Mark one box for each.', size=9, italic=True, color=GRAY, after=2, keep=True)
    opts = '☐ yes   ☐ mostly   ☐ not yet'
    grid(d, ['Teammate'] + C.PEER_CRITERIA + ['One kind, useful comment'], [1.4, 1.45, 1.45, 1.45, 1.55],
         [['', opts, opts, opts, ''], ['', opts, opts, opts, ''], ['', opts, opts, opts, '']], row_h=0.5, size=7.6, hsize=8, center=[1, 2, 3])
    P(d, 'Hand in your reflection with the team packet. Thank you!', size=9, italic=True, color=GRAY, align='center', before=2, after=0)


def build():
    d = new_doc('Student name: ____________________________________', 'Lauren Mitchell Team Case Study  |  Page',
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
