#!/usr/bin/env python3
"""Builds the simplified STUDENT packet (Word): ../CASE_STUDY_PACKET.docx  (+ out/page_tags.json for the layout and spoiler checks). No answers here."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from dx import *
import content2 as C
from monvals import MON, ED_VITALS

OUT_DOCX = os.path.join(HERE, '..', 'CASE_STUDY_PACKET.docx')
TAGS = []
LINE = 0.24     # writing line height (inches)
GREY = 'EDEDED'


def tag(d, label, k, m):
    TAGS.append(f'{label} | page {k} of {m}')
    P(d, f'{label}  |  page {k} of {m}', size=6.5, color='888888', align='right', after=0)


def banner2(d, left, right='', sub=None):
    banner(d, left, right, fill=INK, size=14, sub=sub, h=0.4)


def box(d, items, n, hint=None, fill=None, gap=0.15, line_h=LINE, numbered=False, w=W):
    """one or two labelled writing boxes side by side; items = list of (label, hint); n = number of ruled lines"""
    k = len(items)
    ws = [w] if k == 1 else [(w - gap) / 2, gap, (w - gap) / 2]
    t = new_table(d, n + 1, len(ws), ws, borders=None)
    cols = [0] if k == 1 else [0, 2]
    for ci, (label, h) in zip(cols, items):
        c = t.rows[0].cells[ci]; shade(c, GREY); box_borders(c, MED); c.text = ''
        p = first_par(c); rich(p, label, size=9.4, bold=True, color=INK)
        if h: run(p, '  ' + h, size=8, italic=True, color='555555')
        c.paragraphs[0].paragraph_format.keep_with_next = True
        for i in range(1, n + 1):
            cc = t.rows[i].cells[ci]
            border(cc, left=MED, right=MED, top=NONE, bottom=MED if i == n else HAIR)
            if fill: shade(cc, fill)
            if numbered and k == 1:
                cc.text = ''; pp = first_par(cc); run(pp, f'{i}.', size=9, color='777777', bold=True)
    for i, r in enumerate(t.rows):
        nosplit(r)
        if i == 0: rowh(r, 0.25, True)
        else: rowh(r, line_h, True)
        for c in r.cells: c.paragraphs[0].paragraph_format.keep_with_next = i < n
    spacer(d, 2)
    return t


def vitals_row(d, n):
    prev = ED_VITALS if n == 1 else MON[n - 1]
    cols = ['Time', 'Temp F', 'HR', 'BP (MAP)', 'RR', 'SpO2 / oxygen', 'Pain', 'Rhythm on the monitor', 'Glucose']
    ws = [0.6, 0.5, 0.4, 0.75, 0.45, 0.95, 0.65, 2.0, 0.6]; ws = [x * W / sum(ws) for x in ws]
    pv = [prev['clock'].replace('Tue ', '').replace('Wed ', '').replace('ED ', '') + ' prev', prev['temp'], prev['hr'], f"{prev['bp']} ({prev['map']})", prev['rr'].replace(', shallow', ''),
          prev['spo2'].replace('room air', 'RA').replace('nasal cannula', 'NC'), (prev['pain'] or '-').split(' ')[0], prev['rhythm'].replace('Sinus bradycardia', 'Sinus brady'), prev['glucose']]
    now = [MON[n]['clock'].replace('Tue ', '').replace('Wed ', '') + ' NOW'] + [''] * 8
    t = grid(d, cols, ws, [pv, now], row_h=0.28, size=7.6, hsize=7.6, center=list(range(9)), fills={(0, j): 'F3F3F3' for j in range(9)})
    rowh(t.rows[2], 0.32)
    # the previous-row rhythm text can be long: keep it small and left aligned
    return t


def charge_bar(d, left, right):
    t = new_table(d, 2, 2, [3.2, 4.1], borders=None)
    for c in t.rows[0].cells: shade(c, INK)
    c = t.rows[0].cells[0]; c.text = ''; p = first_par(c); rich(p, left, size=14, bold=True, color='FFFFFF'); valign(c)
    c = t.rows[0].cells[1]; c.text = ''; p = first_par(c, align='right'); rich(p, right, size=9.5, bold=True, color='FFFFFF'); valign(c)
    rowh(t.rows[0], 0.36)
    t.rows[1].cells[0].merge(t.rows[1].cells[1])
    c = t.rows[1].cells[0]; shade(c, 'FFFFFF'); box_borders(c, MED)
    ctext(c, '**CHARGE NURSE this round:** __________      **Nurse focus:** ☐ meds and treatments  ☐ results and monitor      ☐ huddle done  ☐ SBAR done', size=8.3)
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
        rich(p, ln, size=9.3)
    spacer(d, 2)


def mg_box(d, labelhint='Write the new level(s), then mark them on the team strip (page 2).'):
    t = new_table(d, 1, 3, [3.1, 2.1, 2.1], borders=MED)
    for c in t.rows[0].cells: shade(c, 'FFFFFF')
    ctext(t.rows[0].cells[0], '**MAGNESIUM** (mg/dL) new level(s): ______ and ______', size=8.6)
    ctext(t.rows[0].cells[1], 'Compared with last time:  ☐ up  ☐ down  ☐ same', size=8.3)
    ctext(t.rows[0].cells[2], 'Marked on the team strip  ☐', size=8.6)
    rowh(t.rows[0], 0.32)
    spacer(d, 4)


def sbar_box(d, lh=0.28):
    t = new_table(d, 5, 2, [0.95, W - 0.95], borders=None)
    for j in range(2):
        c = t.rows[0].cells[j]; shade(c, GREY); box_borders(c, MED)
    t.rows[0].cells[0].merge(t.rows[0].cells[1])
    c = t.rows[0].cells[0]; c.text = ''
    p = first_par(c); rich(p, 'What we will tell the provider (SBAR)', size=9.4, bold=True, color=INK); run(p, '   The charge nurse makes the call.', size=8, italic=True, color='555555')
    for i, (L, nm) in enumerate((('S', 'Situation'), ('B', 'Background'), ('A', 'Assessment'), ('R', 'Recommend')), 1):
        a, b = t.rows[i].cells
        for cc in (a, b):
            border(cc, top=NONE, bottom=MED if i == 4 else HAIR)
        border(a, left=MED, right=NONE); border(b, right=MED, left=NONE)
        shade(a, 'F6F6F6'); ctext(a, f'**{L}**  {nm}', size=8.6, color=INK)
    for i, r in enumerate(t.rows):
        nosplit(r); rowh(r, 0.26 if i == 0 else lh, True)
    spacer(d, 4)


def checkpoint_header(d, n, cp):
    page_top(d); tag(d, f'CHECKPOINT {n}', 1, 2 if n == 3 else 1)
    charge_bar(d, f'{cp["time"]}  |  {cp["day"]}', cp['title'])
    sit_box(d, cp['sit'])


def standard_boxes_top(d, n):
    vitals_row(d, n)
    box(d, [('Vitals and what I noticed', 'read the monitor, then look at Ray'), ('Current meds and treatments', 'what is running, due, or should stop?')], 4)
    box(d, [('New results and what they mean for his diagnosis', ''), ('What changed since the last checkpoint?', '')], 4)
    mg_box(d)


def standard_boxes_bottom(d, n, charge_lines=2):
    box(d, [('Our top 3 priorities', 'in order')], 3, numbered=True)
    sbar_box(d)
    box(d, [('What we will do next', ''), ('Prediction for the next 4 hours', 'what do we think will happen?')], 3)
    box(d, [('Charge nurse notes', 'who looked at what, what the team decided, time check')], charge_lines)
    pass


def stop(d):
    P(d, 'STOP. Do not turn the page until the instructor advances the clock.', size=9, bold=True, color=INK, align='center', before=1, after=0)


# ------------------------------------------------------------------ pages
def cover(d):
    page_top(d); tag(d, 'FRONT', 1, 3)
    banner(d, 'TEAM CASE STUDY: RAY KESSLER', '5 East, Room 14  |  Tue 0700 to Wed 0700', fill=INK, size=17, sub='You are the nursing team for one patient across 24 hours. The class moves through the time together, 4 hours at a time.', h=0.62)
    P(d, 'Write your team name in the header at the top of this page (it repeats on every page).', size=9, italic=True, color=GRAY, before=2, after=3)
    grid(d, ['Name (print)', 'Letter', 'Initials'], [4.4, 1.2, 1.7], [['', 'A', ''], ['', 'B', ''], ['', 'C', ''], ['', 'D (if 4)', '']], row_h=0.42, size=10, hsize=9, center=[1, 2])
    P(d, 'HOW THE TWO HOURS WORK', size=11, bold=True, color=INK, before=2, after=2, keep=True)
    bullets(d, ['The instructor moves the clock forward **4 hours at a time**: 0700, 1100, 1500, 1900, 2300, 0300, and a final check at 0700.',
                'At each checkpoint, the instructor reads the situation. Your team looks at Ray, reads the chart, fills in the boxes together, and the **charge nurse** makes one SBAR call.',
                'You finish each page at the **end** of its time block. **Do not turn the page** until the instructor advances the clock.',
                'Use the EHR on your own device (vitals, meds, results). Your patient and the time are synced with the instructor. Write in dark pen.'], size=9.6)
    P(d, 'ROLES', size=11, bold=True, color=INK, before=3, after=2, keep=True)
    t = new_table(d, 2, 2, [1.6, W - 1.6], borders=MED)
    rows = [('CHARGE NURSE\n(one person; changes every checkpoint)', 'Coordinates and organizes the team. Keeps time. Decides who looks at what. Leads a quick huddle. Decides the priorities with the team. **Makes the SBAR call and writes down the team plan.**'),
            ('NURSE\n(everyone else)', 'You are the eyes and the thinking. Look at Ray, the chart and the monitor, share what you find, and speak up. At each checkpoint the charge nurse and the team choose a focus. For example, one nurse looks at meds and treatments and one at results and the monitor. Then everyone writes.')]
    for i, (a, b) in enumerate(rows):
        shade(t.rows[i].cells[0], 'ECE6F7' if i == 0 else 'DDF0E1'); ctext(t.rows[i].cells[0], '**' + a.split('\n')[0] + '**\n' + a.split('\n')[1], size=9)
        ctext(t.rows[i].cells[1], b, size=9.2); rowh(t.rows[i], 0.85)
    spacer(d, 5)
    P(d, 'CHARGE NURSE ROTATION  (the charge nurse changes every checkpoint; circle the row for your team size)', size=10, bold=True, color=INK, before=2, after=2, keep=True)
    cols = ['Team size', '0700', '1100', '1500', '1900', '2300', '0300', 'Final 0700']
    rows = [[f'{k} people'] + list(C.ROT[k]) for k in (4, 3, 2)] + [['Initials']] + [[]]
    rows = [[f'{k} people'] + list(C.ROT[k]) for k in (4, 3, 2)] + [['Initials (write)'] + [''] * 7]
    grid(d, cols, [1.3] + [0.857] * 7, rows, row_h=0.34, size=10, hsize=8.6, center=list(range(8)), pre_fill={0: 'F4F4F4'})
    P(d, 'Letters match the names above. The charge nurse still helps with the thinking: the job is to organize, not to do all the work.', size=8.8, italic=True, color=GRAY, after=3)
    P(d, 'TURN-IN', size=10, bold=True, color=INK, before=2, after=1, keep=True)
    P(d, 'One packet per team, fastened with a **paperclip (no staples)**. The last page has an individual reflection and a peer check: write your own name on yours.', size=9.4, after=0)


def patient_page(d):
    page_top(d); tag(d, 'FRONT', 2, 3)
    banner2(d, 'PATIENT CARD: RAYMOND "RAY" KESSLER', 'Room 5E-14')
    t = new_table(d, 1, 2, [1.75, W - 1.75], borders=None)
    pic_in(t.rows[0].cells[0], 'portrait.png', 1.55); valign(t.rows[0].cells[0], 'top')
    c = t.rows[0].cells[1]; c.text = ''
    facts = [('Name', 'Raymond "Ray" Kessler, he/him, 74 years old, DOB 04/22/1952'), ('MRN', 'SIM-40318'), ('Height / weight', '175 cm  |  88.0 kg on arrival (usual weight about 90 kg)'),
             ('ALLERGY', '**Penicillin** (childhood rash)'), ('Code status', '**Full Code**   |   Fall risk: HIGH'), ('History', 'Kidney disease (stage 4), diabetes, weak heart (heart failure)'),
             ('Family', 'Wife **Eleanor Kessler** (72, health care proxy); daughter Diane Ruiz (15 minutes away)'),
             ('Care team', 'Hospitalist Dr. D. Okafor (0700-1900); night hospitalist Dr. J. Lindgren; nephrology Dr. P. Raman; ICU outreach Dr. H. Moreno; pharmacist L. Ferreira')]
    first = True
    for k, v in facts:
        p = first_par(c) if first else c.add_paragraph(); first = False
        p.paragraph_format.space_after = Pt(2.5)
        run(p, k + ':  ', bold=True, size=9.4, color=INK); rich(p, v, size=9.4)
    spacer(d, 4)
    P(d, 'MAGNESIUM IN ONE MINUTE', size=10.5, bold=True, color=INK, after=1, keep=True)
    bullets(d, ['Normal magnesium is **1.7 to 2.2 mg/dL**. In this lab, anything over **5.0** is a critical value.', 'Magnesium leaves the body through the **kidneys**. If the kidneys are failing, magnesium builds up.',
                'High magnesium slows the **nerves, muscles, breathing and heart**. The bands on the strip show what you might see. Trust your exam as much as the number.'], size=9.4)
    spacer(d, 3)
    banner(d, 'TEAM TREND STRIP: MAGNESIUM', 'one mark per result', fill='3B3B3B', size=10.5, h=0.3)
    pic(d, 'mg_strip.png', 7.3, after=2)
    P(d, 'At each checkpoint, write the new magnesium level on your page, then **mark an X** in that checkpoint\'s column at the right height. Two new results? Mark both. Connect the dots as you go. The charge nurse of the round makes sure it is done.', size=9.2, after=2)
    P(d, 'Use this space for a quick team note (for example, what makes the line go up or down):', size=8.8, italic=True, color=GRAY, after=1)
    box(d, [('Team notes on the trend', '')], 3)


def rubric_page(d):
    page_top(d); tag(d, 'FRONT', 3, 3)
    banner2(d, 'HOW YOU EARN YOUR 20 POINTS', '4 categories  |  3 levels each', sub='This is a team grade. A complete, careful, team-minded effort earns full credit. Nothing here is a trick.')
    t = new_table(d, 5, 4, [1.7, 1.9, 1.8, 1.9], borders=THIN)
    for j, h in enumerate(['Category and points', 'FULL credit', 'GOOD (partial)', 'GETTING THERE']):
        c = t.rows[0].cells[j]; shade(c, 'D9D9D9'); ctext(c, h, size=9.5, bold=True, align='center'); box_borders(c, MED)
    fills = ['ECE6F7', 'DCEBFA', 'FFEFC2', 'DDF0E1']
    for i, r in enumerate(C.RUBRIC, 1):
        row = t.rows[i]; nosplit(row); rowh(row, 1.05)
        c0 = row.cells[0]; shade(c0, fills[i - 1]); c0.text = ''
        p = first_par(c0); rich(p, r['cat'], size=10, bold=True, color=INK)
        p = c0.add_paragraph(); p.paragraph_format.space_before = Pt(2); rich(p, f'{r["pts"]} points', size=16, bold=True, color=INK)
        for j, key in ((1, 'full'), (2, 'good'), (3, 'start')):
            c = row.cells[j]; c.text = ''; rich(first_par(c), r[key], size=9)
        for c in row.cells: box_borders(c, THIN)
    spacer(d, 6)
    P(d, 'WHAT WE LOOK FOR ON EVERY CHECKPOINT PAGE', size=11, bold=True, color=INK, after=2, keep=True)
    bullets(d, ['A **charge nurse is named** and the team has decided who looks at what.', 'The boxes are filled in with **real numbers from the chart** (vitals, labs) and a short reason.',
                'Three **priorities in order** and a complete **SBAR** (Situation, Background, Assessment, Recommendation).', 'The **magnesium level** is written and marked on the team strip.',
                'A **prediction** for the next 4 hours. A good guess with a reason earns credit, even if it turns out wrong.'], size=10)
    spacer(d, 4)
    P(d, 'AT THE END', size=11, bold=True, color=INK, after=2, keep=True)
    bullets(d, ['Each person hands in a short **reflection** (3 boxes) and a quick **peer teamwork check** on the last page.', 'Answers that differ from the instructor\'s are fine if they are thoughtful and tied to Ray\'s chart.'], size=10)
    spacer(d, 6)
    grid(d, ['Category', 'Points possible', 'Points earned (instructor)'], [3.6, 1.7, 2.0], [['Teamwork and charge-nurse rotation', '5', ''], ['Clinical thinking at each checkpoint', '6', ''], ['Safety, priorities and SBAR', '5', ''], ['Completeness and reflection', '4', ''], ['TOTAL', '20', '']], row_h=0.34, size=10, hsize=9, center=[1, 2], bold_first=False)


def checkpoint(d, n):
    cp = C.CP[n]
    checkpoint_header(d, n, cp)
    vitals_row(d, n)
    box(d, [('Vitals and what I noticed', 'read the monitor, then look at Ray'), ('Current meds and treatments', 'running, due, or should stop?')], 4)
    box(d, [('New results and what they mean for his diagnosis', ''), ('What changed since the last checkpoint?', '')], 4)
    mg_box(d)
    if n == 3:
        box(d, [('Our top 3 priorities', 'in order')], 3, numbered=True)
        sbar_box(d)
        box(d, [('Charge nurse notes', 'who looked at what, what the team decided, time check')], 3)
        stop_page_note(d)
        page_top(d); tag(d, f'CHECKPOINT {n}', 2, 2)
        banner2(d, '1500  |  Tuesday', 'Checkpoint 3 of 6, page 2', sub='Dialysis is starting. Same team, same charge nurse.')
        box(d, [('Before dialysis starts: what must be ready and checked?', '')], 5)
        box(d, [('While dialysis runs: what do we watch, and how often?', '')], 5)
        box(d, [('When do we call for help? Our call numbers and who we call', '')], 4)
        box(d, [('What we will do next', ''), ('Prediction for the next 4 hours', 'what do we think will happen?')], 5)
        box(d, [('Anything else the charge nurse wants to record', '')], 3)
    else:
        standard_boxes_bottom(d, n)


def stop_page_note(d):
    P(d, 'Keep going on the next page (the same time block).', size=8.5, italic=True, color=GRAY, align='right', before=0, after=0)


def closing(d):
    cp = C.CLOSE
    page_top(d); tag(d, 'CASE CLOSED', 1, 2)
    charge_bar(d, f'{cp["time"]}  |  {cp["day"]}', 'Final check')
    sit_box(d, cp['sit'])
    vitals_row(d, 7)
    box(d, [('Vitals and what I noticed', ''), ('Current meds and treatments', 'running, due, or should stop?')], 3)
    box(d, [('New results and what they mean', ''), ('What changed since 0300 and since arrival?', '')], 3)
    mg_box(d)
    box(d, [('Our top 3 priorities for the day team', 'in order')], 3, numbered=True)
    sbar_box(d, 0.27)
    box(d, [('What we will teach Ray and Eleanor', 'three plain-language tips'), ('The story of Ray\'s stay in our words', 'look at the team strip')], 3)
    box(d, [('Charge nurse notes', '')], 2)
    P(d, 'Last step: turn to the next page for your individual reflection.', size=9, bold=True, color=INK, align='center', before=1, after=0)


def reflection(d):
    page_top(d); tag(d, 'CASE CLOSED', 2, 2)
    banner2(d, 'MY REFLECTION AND PEER CHECK', 'individual', sub='Hand this page in with your own name on it.')
    P(d, 'Name: _______________________________    Team: _______________________________    Times I was charge nurse: ____________', size=9.6, after=4)
    box(d, [('1. Something I learned about Ray\'s case', '')], 5)
    box(d, [('2. Something our team did well (and who helped)', '')], 5)
    box(d, [('3. One thing I would do differently as a charge nurse or as a nurse', '')], 5)
    P(d, 'PEER TEAMWORK CHECK', size=11, bold=True, color=INK, before=3, after=2, keep=True)
    P(d, 'Rate each teammate (not yourself). Mark one box for each.', size=9, italic=True, color=GRAY, after=2, keep=True)
    opts = '☐ yes   ☐ mostly   ☐ not yet'
    grid(d, ['Teammate'] + C.PEER_CRITERIA + ['One kind, useful comment'], [1.4, 1.45, 1.45, 1.45, 1.55],
         [['', opts, opts, opts, ''], ['', opts, opts, opts, ''], ['', opts, opts, opts, '']], row_h=0.5, size=7.6, hsize=8, center=[1, 2, 3])
    P(d, 'Hand in your reflection with the team packet. Thank you!', size=9, italic=True, color=GRAY, align='center', before=2, after=0)


def build():
    d = new_doc('Team name: ____________________________________', 'Ray Kessler Team Case Study  |  Page',
                'Turn in with a paperclip (no staples).  Write in dark pen.  Do not turn the page until the instructor advances the clock.', top=0.62, bottom=0.42)
    cover(d); patient_page(d); rubric_page(d)
    for n in range(1, 7): checkpoint(d, n)
    closing(d); reflection(d)
    d.save(OUT_DOCX)
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    json.dump(TAGS, open(os.path.join(HERE, 'out', 'page_tags.json'), 'w'), indent=1)
    print('wrote', os.path.normpath(OUT_DOCX), 'logical pages:', len(TAGS))


if __name__ == '__main__':
    build()
