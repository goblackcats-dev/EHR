#!/usr/bin/env python3
"""Builds the STUDENT packet (Word) for the Lauren Mitchell team case study: ../CASE_STUDY_PACKET.docx (+ out/page_tags.json for the layout and spoiler checks).
Same format as the hypermag student2 packet. No answers here."""
import json, os, sys
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
        if h: run(p, '  ' + h, size=8, italic=True, color='444444')
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
    prev = ED_VITALS if n == 1 else MON[n - 1]
    cols = ['Time', 'Temp F', 'HR', 'BP lying (MAP)', 'Standing BP, HR', 'RR', 'SpO2', 'Pain', 'Rhythm on the monitor', 'Glucose']
    ws = [0.62, 0.48, 0.4, 0.78, 1.2, 0.36, 0.7, 0.42, 1.65, 0.69]; ws = [x * W / sum(ws) for x in ws]
    st = prev['stand'].split(' (')[0] if n > 1 else 'not safe'
    pv = [prev['clock'].split(' ')[1] + ' prev', prev['temp'], prev['hr'], f"{prev['bp']} ({prev['map']})", st, prev['rr'], prev['spo2'].replace('% room air', '% RA'),
          prev['pain'].split(' ')[0], prev['rhythm'].replace('Sinus tachycardia', 'Sinus tach').replace('Normal sinus rhythm', 'NSR'), prev['glucose'].replace(' at 1120 after D50', ' after D50')]
    now = [MON[n]['clock'].split(' ')[1] + ' NOW'] + [''] * 9
    t = grid(d, cols, ws, [pv, now], row_h=0.28, size=7.4, hsize=7.4, center=list(range(10)), fills={(0, j): 'F3F3F3' for j in range(10)})
    rowh(t.rows[2], 0.34)
    return t


def charge_bar(d, left, right):
    t = new_table(d, 2, 2, [3.2, 4.1], borders=None)
    for c in t.rows[0].cells: shade(c, INK)
    c = t.rows[0].cells[0]; c.text = ''; p = first_par(c); rich(p, left, size=14, bold=True, color='FFFFFF'); valign(c)
    c = t.rows[0].cells[1]; c.text = ''; p = first_par(c, align='right'); rich(p, right, size=9.5, bold=True, color='FFFFFF'); valign(c)
    rowh(t.rows[0], 0.36)
    t.rows[1].cells[0].merge(t.rows[1].cells[1])
    c = t.rows[1].cells[0]; shade(c, 'FFFFFF'); box_borders(c, MED)
    ctext(c, '**Charge nurse for this stop:** __________   **Partner reporting for their pair:** __________   ☐ everyone heard   ☐ SBAR done', size=8.3)
    rowh(t.rows[1], 0.28)
    spacer(d, 2)


def sit_box(d, lines, fill='FFF8E1'):
    t = new_table(d, 1, 1, [W], borders=MED)
    c = t.rows[0].cells[0]; shade(c, fill); c.text = ''
    first = True
    for i, ln in enumerate(lines):
        p = first_par(c) if first else c.add_paragraph(); first = False
        p.paragraph_format.space_after = Pt(2)
        if i == 0: run(p, 'SITUATION  ', bold=True, size=9, color=INK)
        rich(p, ln, size=9.0)
    spacer(d, 2)


def tracker_tick(d, n):
    t = new_table(d, 1, 2, [4.1, 3.2], borders=MED)
    for c in t.rows[0].cells: shade(c, 'FFFFFF')
    extra = '   Hormone map (p. 2) done ☐' if n == 1 else ''
    ctext(t.rows[0].cells[0], f'**RESPONSE TRACKER** (page 3): {STOP_HEAD[n - 1]} column filled ☐' + extra, size=8.2)
    ctext(t.rows[0].cells[1], 'Since the last stop she is:  ☐ better  ☐ same  ☐ worse', size=8.3)
    rowh(t.rows[0], 0.3)
    spacer(d, 3)


def sbar_box(d, lh=0.25, title='What we will tell the provider (SBAR)', hint='   The charge nurse makes the call.'):
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


PAIRS = {'M': ('MEDS & TREATMENTS', 'FFEFC2'), 'A': ('VITALS & ASSESSMENT', 'DCEBFA'), 'R': ('RESULTS & LABS', 'DDF0E1')}


def pair_box(d, kind, ask, n=3, img=None):
    lab, fl = PAIRS[kind]
    box(d, [(lab + ' pair reports.', ask, fl)], n, img=img)


def team_boxes(d, close=False):
    box(d, [('What changed since the last stop?' if not close else 'What changed since 0300 and since arrival?', ''), ('What we will do next', '')], 2)
    box(d, [('Our top 3 priorities' + (' for the day team' if close else ''), 'the charge nurse decides, in order')], 3, numbered=True)
    sbar_box(d, title='What we will tell the provider (SBAR)' if not close else 'Handoff to the day team (SBAR)')


def checkpoint_header(d, n, cp, k=1, m=1, right=None):
    page_top(d); tag(d, f'CHECKPOINT {n}' if n <= 6 else 'CASE CLOSED', k, m)
    charge_bar(d, f'{cp["time"]}  |  {cp["day"]}', right or cp['title'])
    sit_box(d, cp['sit'])


def stop(d):
    P(d, 'STOP. Do not turn the page until the instructor advances the clock.', size=9, bold=True, color=INK, align='center', before=1, after=0)


# ------------------------------------------------------------------ pages
def cover(d):
    page_top(d); tag(d, 'FRONT', 1, 3)
    banner(d, 'TEAM CASE STUDY: LAUREN MITCHELL', '4 West, Room 4W-22  |  Mon 0700 to Tue 0700', fill=INK, size=17, sub='The whole class is ONE nursing team for one patient across 24 hours. We move through the time together, 4 hours at a time.', h=0.62)
    P(d, 'Write your team name in the header at the top of this page (it repeats on every page).', size=9, italic=True, color=GRAY, before=2, after=3)
    t = new_table(d, 4, 3, [2.4, 2.45, 2.45], borders=THIN)
    blocks = [('PAIR 1: MEDS & TREATMENTS', 'FFEFC2', 'A', 'B'), ('PAIR 2: VITALS & ASSESSMENT', 'DCEBFA', 'C', 'D'), ('PAIR 3: RESULTS & LABS', 'DDF0E1', 'E', 'F')]
    for j, (nm, fl, x, y) in enumerate(blocks):
        c = t.rows[0].cells[j]; shade(c, fl); ctext(c, nm, size=8.8, bold=True, align='center')
        for i, L in ((1, x), (2, y)):
            ctext(t.rows[i].cells[j], f'**{L}**  name: ______________________', size=9.4)
    rowh(t.rows[1], 0.34); rowh(t.rows[2], 0.34)
    c = t.rows[3].cells[0].merge(t.rows[3].cells[2]); ctext(c, '**G**  FLOAT NURSE (helps wherever the charge nurse sends them): name: ____________________________', size=9.4); rowh(t.rows[3], 0.34)
    spacer(d, 4)
    P(d, 'HOW THE TWO HOURS WORK', size=11, bold=True, color=INK, before=2, after=2, keep=True)
    bullets(d, ['The instructor moves the clock forward **4 hours at a time**: 0700, 1100, 1500, 1900, 2300, 0300, and a final check at 0700 Tuesday.',
                'At each checkpoint, the instructor sets the bedside monitor and reads the situation. The **charge nurse runs the page**: asks each pair the "Charge asks" question, the pair looks in the chart and at Lauren and reports. **Only the charge nurse writes** in the shared boxes while the pairs advise. The charge nurse makes one SBAR call.',
                'Every stop, the team also fills one column of the **response tracker** (page 3): is the treatment working? At the end you use it to **evaluate** the whole treatment.',
                'The packet is shared by the table; each student has their own reflection page (last page). Finish each page at the **end** of its time block. **Do not turn the page** until the instructor advances the clock.',
                'Use the EHR on your own device (vitals, MAR, results, notes). Your patient and the time are synced with the instructor. **The NOW vitals row:** read the bedside monitor (the instructor sets it), take your own set, do orthostatic vitals when ordered and safe, and ask the instructor for the bedside glucose. Write in dark pen.'], size=9.5)
    P(d, 'ROLES', size=11, bold=True, color=INK, before=3, after=2, keep=True)
    t = new_table(d, 2, 2, [1.6, W - 1.6], borders=MED)
    rows = [('CHARGE NURSE\n(one person; changes every stop)', 'Runs the section. Keeps time. **Asks each pair what they found and what to do**, then decides the priorities with the team. **Makes the SBAR call and writes the team plan.**'),
            ('NURSE PAIRS\n(the other students)', '**Meds & Treatments:** MAR, orders, notes: what is running, due, held or should change, and why. **Vitals & Assessment:** the bedside monitor, orthostatic vitals, the bedside exam (mental status, skin, mouth, belly), intake and output. **Results & Labs:** new labs, ECG, trends and what they mean. Speak up when the charge nurse asks. If one of your pair is charge, your partner reports for the pair.')]
    for i, (a, b) in enumerate(rows):
        shade(t.rows[i].cells[0], 'ECE6F7' if i == 0 else 'DDF0E1'); ctext(t.rows[i].cells[0], '**' + a.split('\n')[0] + '**\n' + a.split('\n')[1], size=9)
        ctext(t.rows[i].cells[1], b, size=9.2); rowh(t.rows[i], 0.9)
    spacer(d, 5)
    P(d, 'CHARGE NURSE ROTATION  (each student is charge nurse exactly once)', size=10, bold=True, color=INK, before=2, after=2, keep=True)
    cols = ['Stop', '0700', '1100', '1500', '1900', '2300', '0300', 'Final 0700']
    grid(d, cols, [1.3] + [0.857] * 7, [['Charge nurse (letter)'] + list('ACEBDFG'), ['Partner reports for the pair'] + ['B', 'D', 'F', 'A', 'C', 'E', '-'], ['Name'] + [''] * 7], row_h=0.34, size=9.4, hsize=8.6, center=list(range(8)), pre_fill={0: 'F4F4F4'})
    P(d, 'TURN-IN', size=10, bold=True, color=INK, before=2, after=1, keep=True)
    P(d, 'One shared packet for the team, fastened with a **paperclip (no staples)**. The last page has an individual reflection and a peer check: write your own name on yours.', size=9.4, after=0)


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
    banner(d, 'RESPONSE TRACKER: IS THE TREATMENT WORKING?', 'one column per stop', fill='3B3B3B', size=10.5, h=0.3)
    P(d, 'At every stop the charge nurse asks each pair for its numbers and writes them in that stop\'s column. Add an arrow (up, down, same) when it helps. In the last row circle **B**etter, **S**ame or **W**orse.', size=8.6, after=2)
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
            lines = 3 if 'tree' in shot[1] else 4
        pair_box(d, kind, cp['ask'][kind], lines, img=img)
    tracker_tick(d, n)
    team_boxes(d)
    box(d, [('Prediction for the next 4 hours', 'what do we think will happen?'), ('Charge nurse notes', 'ask each pair for one thing, then decide')], 2)


def closing(d):
    cp = C.CLOSE
    checkpoint_header(d, 7, cp, 1, 3, right='Final check, page 1 of 2')
    vitals_row(d, 7)
    for kind in 'MAR':
        pair_box(d, kind, cp['ask'][kind], 2)
    tracker_tick(d, 7)
    P(d, 'EVALUATE: DID THE TREATMENT WORK?', size=10.5, bold=True, color=INK, before=2, after=1, keep=True)
    P(d, 'Use the response tracker (page 3) and the chart. Write the number at arrival (Mon 0700) and now, then decide: goal met?', size=8.6, italic=True, color=GRAY, after=2, keep=True)
    rows = [[f'**{e[0]}**', e[1], '', '', '☐ yes  ☐ no'] for e in C.EVAL]
    grid(d, ['Criterion', 'Goal', 'At arrival (Mon 0700)', 'Now (Tue 0700)', 'Goal met?'], [1.45, 2.0, 1.35, 1.35, 1.15], rows, row_h=0.3, size=7.8, hsize=8, center=[4], pre_fill={0: 'F4F4F4'})
    box(d, [('Our verdict on the treatment, in one or two sentences', 'is it effective? which numbers prove it?')], 2)


def closing2(d):
    page_top(d); tag(d, 'CASE CLOSED', 2, 3)
    banner2(d, '0700  |  Tuesday', 'Final check, page 2 of 2', sub='Going home safely. Same charge nurse. The charge nurse asks each pair for one more thing.')
    team_boxes(d, close=True)
    box(d, [('Meds pair: the steroid plan at home', 'today\'s doses and times, the next days, and why fludrocortisone is back', PAIRS['M'][1])], 3)
    box(d, [('Sick-day rules we will teach', 'when to double, when to triple, when to inject'), ('The emergency injection', 'what is in the kit, where, how, then what? who practices it?')], 5)
    box(d, [('Medical ID, card and who needs to know', ''), ('Our teach-back question for Lauren and Daniel', '')], 3)
    box(d, [('Is she ready to go home? What must be true first?', 'the Vitals and Results pairs advise')], 4)
    box(d, [('Charge nurse notes (then turn to the individual reflection page)', '')], 2)


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
    d = new_doc('Team name: ____________________________________', 'Lauren Mitchell Team Case Study  |  Page',
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
