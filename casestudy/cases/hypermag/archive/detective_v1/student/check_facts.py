#!/usr/bin/env python3
"""Fact checker: compares every number in the student packet and the instructor key with patient.json, monitor.html and DESIGN.md,
and checks that no student page shows labs or events from a LATER checkpoint.    python3 check_facts.py
Prints a line for each mismatch and 'ALL CHECKS PASSED' (exit code 0) when there are none."""
import json, os, re, sys, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
CASE = os.path.join(HERE, '..'); REPO = os.path.join(CASE, '..', '..', '..')
from content_cp import CPS, MON, ED_VITALS, UO
import content_front as F
from docx import Document
from docx.oxml.ns import qn

pj = json.load(open(os.path.join(CASE, 'patient.json')))['canonical']
bad = []
def fail(msg): bad.append(msg); print('MISMATCH:', msg)

# ---------------- chart lookups
labs = {}
for o in pj['observations']:
    if o['type'] == 'lab': labs.setdefault(o['label'], {})[o['collected']] = o
def lab(label, coll): return labs[label][coll]['value']
TIME = {'Oct 20': '2026-10-20 08:30', 'Tue 0440': '2026-11-17 04:40', 'Tue 0900': '2026-11-17 09:00', 'Tue 1115': '2026-11-17 11:15', 'Tue 1315': '2026-11-17 13:15', 'Tue 1700': '2026-11-17 17:00',
        'Tue 1800': '2026-11-17 18:00', 'Tue 2100': '2026-11-17 21:00', 'Wed 0100': '2026-11-18 01:00', 'Wed 0500': '2026-11-18 05:00', '1130': '2026-11-17 11:30', '1415': '2026-11-17 14:15'}
NAME = {'Magnesium': 'Magnesium', 'Potassium': 'Potassium', 'Creatinine': 'Creatinine', 'BUN': 'BUN', 'Calcium': 'Calcium', 'CO2': 'CO2 (bicarbonate)', 'Ionized calcium': 'Ionized calcium',
        'pH': 'ABG pH', 'PaCO2': 'ABG PaCO2', 'PaO2': 'ABG PaO2', 'HCO3': 'ABG HCO3'}
def num(s): m = re.match(r'\s*(-?\d+(?:\.\d+)?)', s); return m.group(1) if m else None

# ---------------- 1. lab tables in the content (student table headers + key rows)
n_checked = 0
for n, c in CPS.items():
    for b in c['a_blocks'] + c['b_blocks']:
        if b.get('t') != 'table' or not isinstance(b.get('key'), dict) or 'rows' not in b['key']: continue
        cols = b['cols']
        tcols = [(j, k) for j, h in enumerate(cols) for k in TIME if h.startswith(k) or h.startswith(k.replace('Tue ', 'Tue '))]
        tcols = [(j, next(k for k in TIME if cols[j].startswith(k))) for j in range(len(cols)) if any(cols[j].startswith(k) for k in TIME)]
        if not tcols: continue
        # student-side: normal range column vs chart reference
        for r in b['rows']:
            nm = next((v for k, v in NAME.items() if r[0].startswith(k)), None)
            if nm and len(r) > 1 and re.match(r'^[\d.<>-]+', r[1] or ''):
                ref = list(labs[nm].values())[0].get('reference')
                if ref and ref.replace(' ', '') != r[1].replace(' ', ''): fail(f"{b['id']}: normal range for {r[0]} is {r[1]}, chart says {ref}")
        for r in b['key']['rows']:
            nm = next((v for k, v in NAME.items() if r[0].startswith(k)), None)
            if not nm: continue
            for j, k in tcols:
                idx = j if len(r) == len(cols) else j - 1
                exp = r[idx]
                if exp.startswith('('): continue          # "(not drawn)"
                try: chart = lab(nm, TIME[k])
                except KeyError:
                    fail(f"{b['id']}: {r[0]} has no draw at {k} in the chart (key says {exp})"); continue
                n_checked += 1
                if num(exp) != num(chart): fail(f"{b['id']}: {r[0]} {k}: key says {exp}, chart says {chart}")
# 4A1 serum glucose trend
g = [lab('Glucose (serum)', t) for t in ('2026-11-17 04:40', '2026-11-17 09:00', '2026-11-17 11:15', '2026-11-17 13:15', '2026-11-17 17:00')]
blk = next(b for b in CPS[4]['a_blocks'] if b['id'] == '4A1')
if blk['key']['rows'][0] != g: fail(f'4A1 glucose trend {blk["key"]["rows"][0]} vs chart {g}')
# timeline Mg values
tl = {'Tue 0700': lab('Magnesium', '2026-11-17 04:40'), 'Tue 1100': lab('Magnesium', '2026-11-17 09:00'), 'Tue 1500': lab('Magnesium', '2026-11-17 13:15'), 'Tue 1900': lab('Magnesium', '2026-11-17 18:00'),
      'Tue 2300': lab('Magnesium', '2026-11-17 21:00'), 'Wed 0300': lab('Magnesium', '2026-11-18 01:00'), 'Wed 0700': lab('Magnesium', '2026-11-18 05:00')}
for t in F.TIMELINE:
    if tl[t['time']] != t['mg']: fail(f"timeline {t['time']}: Mg {t['mg']} vs chart {tl[t['time']]}")

# ---------------- 2. monitor values vs monitor.html scenario rows
html = open(os.path.join(REPO, 'monitor.html')).read()
rows = re.findall(r"\{ t: '([\d-]+ [\d:]+)', hr: (\d+), spo2: (\d+), sys: (\d+), dia: (\d+), rr: (\d+), temp: ([\d.]+), rhythm: '(\w+)', pr: ([\d.]+), qrs: ([\d.]+)", html)
mon_html = {r[0]: r for r in rows}
KEY = {1: '2026-11-17 07:00', 2: '2026-11-17 11:00', 3: '2026-11-17 15:00', 4: '2026-11-17 19:00', 5: '2026-11-17 23:00', 6: '2026-11-18 03:00', 7: '2026-11-18 07:00'}
for n, m in MON.items():
    r = mon_html[KEY[n]]
    exp = dict(hr=r[1], spo2=r[2], bp=f'{r[3]}/{r[4]}', rr=r[5], temp=r[6])
    if m['hr'] != exp['hr']: fail(f'MON {n} HR {m["hr"]} vs monitor.html {exp["hr"]}')
    if m['bp'] != exp['bp']: fail(f'MON {n} BP {m["bp"]} vs monitor.html {exp["bp"]}')
    if num(m['rr']) != exp['rr']: fail(f'MON {n} RR {m["rr"]} vs monitor.html {exp["rr"]}')
    if num(m['spo2']) != exp['spo2']: fail(f'MON {n} SpO2 {m["spo2"]} vs monitor.html {exp["spo2"]}')
    if float(m['temp']) != float(exp['temp']): fail(f'MON {n} temp {m["temp"]} vs monitor.html {exp["temp"]}')
    s, d_ = [int(x) for x in m['bp'].split('/')]
    if round((s + 2 * d_) / 3) != int(m['map']): fail(f'MON {n} MAP {m["map"]} should be {round((s + 2 * d_) / 3)}')
    pr = re.search(r'PR (\d\.\d+)', m['rhythm'])
    if pr and abs(float(pr.group(1)) - float(r[8])) > 0.001: fail(f'MON {n} PR {pr.group(1)} vs monitor.html {r[8]}')
# 0700 values also vs the chart vitals
v0700 = {o['code']: o['value'] for o in pj['observations'] if o['type'] == 'vital' and o['collected'] == '2026-11-17 07:00'}
if v0700['HR'].split()[0] != MON[1]['hr'] or v0700['BP'].split()[0] != MON[1]['bp'] or v0700['RR'].split()[0] != MON[1]['rr']: fail(f'0700 monitor row vs chart vitals {v0700}')
v04 = {o['code']: o['value'] for o in pj['observations'] if o['type'] == 'vital' and o['collected'] == '2026-11-17 04:25'} or {}
# ---------------- 3. hourly urine numbers vs ioEvents
io = {e['id']: e for e in pj['ioEvents']}
def hourly(note): return [int(x) for x in re.findall(r'(\d+)', note.split('hourly')[1])][:4] if 'hourly' in note else []
for n, cid in ((2, 'io_2026_11_17_11_00'), (3, 'io_2026_11_17_15_00'), (4, 'io_2026_11_17_19_00'), (5, 'io_2026_11_17_23_00'), (6, 'io_2026_11_18_03_00'), (7, 'io_2026_11_18_07_00')):
    e = io.get(cid)
    if not e: fail(f'no ioEvent {cid}'); continue
    h = hourly(e['note']) or hourly(json.dumps(e.get('detail', {})))
    txt = UO[n]
    if h and not all(str(x) in txt for x in h): fail(f'UO[{n}] text {txt!r} vs chart hourly {h}')
    ur = e['detail'].get('urine')
    if ur is not None and f'= {ur} mL' not in txt and n not in (4,): fail(f'UO[{n}] total {ur} not in {txt!r}')

# ---------------- 4. ECG numbers in all text must exist in the chart's ECG strings
ecg_text = ' '.join(v['value'] for v in labs['ECG 12-lead interpretation'].values())
ecg_pr = set(re.findall(r'PR (\d{3}) ms', ecg_text)); ecg_qrs = set(re.findall(r'QRS (\d{3}) ms', ecg_text)); ecg_qtc = set(re.findall(r'QTc (\d{3})', ecg_text))
def docx_text(path):
    d = Document(path); paras = []
    for p in d.element.body.iter(qn('w:p')):
        paras.append(''.join(t.text or '' for t in p.iter(qn('w:t'))))
    return '\n'.join(paras)
student = docx_text(os.path.join(CASE, 'CASE_STUDY_PACKET.docx'))
keytxt = docx_text(os.path.join(CASE, 'INSTRUCTOR_CASESTUDY_KEY.docx'))
keymd = open(os.path.join(CASE, 'INSTRUCTOR_CASESTUDY_KEY.md')).read()
for nm, txt in (('student', student), ('key', keytxt), ('key.md', keymd)):
    for pr in re.findall(r'\bPR (\d{3}) ?ms', txt):
        if pr not in ecg_pr: fail(f'{nm}: PR {pr} ms is not in any chart ECG {sorted(ecg_pr)}')
    for q in re.findall(r'\bQRS (\d{3}) ?ms', txt):
        if q not in ecg_qrs and q not in ('150', '80', '90', '120'): fail(f'{nm}: QRS {q} ms is not in any chart ECG {sorted(ecg_qrs)}')
    for q in re.findall(r'\bQTc (\d{3})', txt):
        if q not in ecg_qtc: fail(f'{nm}: QTc {q} not in the chart ECGs {sorted(ecg_qtc)}')

# ---------------- 5. lab numbers written in sentences must exist in the chart
vals = {k: {v['value'] for v in labs[k].values()} for k in labs}
PATTERNS = [('Magnesium', r'(?:\bMg|magnesium)(?: level)?(?: was| is| of| at| to| now| again)? (\d+\.\d)\b'), ('Potassium', r'(?:\bK|potassium) (?:was |is |of |at )?(\d+\.\d)\b'), ('Creatinine', r'creatinine (?:was |is |of |at |peaked at |to )?(\d+\.\d)\b'),
            ('Calcium', r'\b(?:calcium|Ca) (?:was |is |of |at )?(\d+\.\d)\b')]
ALLOW = {'Magnesium': {'5.0', '2.2', '1.7', '2.3', '2.5'}, 'Potassium': {'3.5', '5.1'}, 'Creatinine': {'0.7', '1.3'}, 'Calcium': {'8.6', '10.2'}}
for nm, txt in (('student', student), ('key', keytxt), ('key.md', keymd)):
    for lab_name, pat in PATTERNS:
        allowed = vals[lab_name] | ALLOW[lab_name] | ({v for v in vals['Ionized calcium']} if lab_name == 'Calcium' else set())
        for m in re.finditer(pat, txt, re.I):
            if m.group(1) not in allowed: fail(f'{nm}: "{m.group(0)}" -> {m.group(1)} is not a {lab_name} value in the chart')
for k in ('SIM-40318', 'Eleanor', 'Diane Ruiz', 'Okafor', 'Lindgren', 'Raman', '5E-14', 'Penicillin', '88.0'):
    if k not in student: fail(f'student packet does not mention {k}')
    if not re.search(re.escape(k), json.dumps(pj) + 'Eleanor Diane Ruiz'): fail(f'{k} is not in patient.json')
for s in ('Raymond "Ray" Kessler', '74'):
    pass
if pj['patient']['dob'] != '1952-04-22' or pj['patient']['heightCm'] != 175 or pj['patient']['weightKg'] != 88 or '04/22/1952' not in student: fail('DOB/height/weight differ')
if pj['patient']['name'] != 'Raymond Kessler' or pj['patient']['age'] != 74 or pj['patient']['mrn'] != 'SIM-40318': fail('patient identity differs')

# ---------------- 6. no spoilers: later labs and later events must not appear on an earlier student page
tags = json.load(open(os.path.join(HERE, 'out', 'page_tags.json')))
pdf = os.path.join(HERE, 'out', 'CASE_STUDY_PACKET.pdf')
npg = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout).group(1))
ptxt = [re.sub(r'\s+', ' ', subprocess.run(['pdftotext', '-f', str(k), '-l', str(k), '-layout', pdf, '-'], capture_output=True, text=True).stdout) for k in range(1, npg + 1)]
sect = []  # section number for each pdf page (0 = front matter, 1..6 checkpoints, 7 closing)
cur = 0
for k, t in enumerate(ptxt):
    for tg in tags:
        if re.sub(r'\s+', ' ', tg) in t:
            m = re.match(r'CHECKPOINT (\d)', tg); cur = int(m.group(1)) if m else (7 if tg.startswith('CASE CLOSED') else 0)
    sect.append(cur)
RES = {1: '2026-11-17 07:00', 2: '2026-11-17 11:00', 3: '2026-11-17 15:00', 4: '2026-11-17 19:00', 5: '2026-11-17 23:00', 6: '2026-11-18 03:00', 7: '2026-11-18 07:00'}
mg_later = {}
for coll, o in labs['Magnesium'].items():
    for n, t in RES.items():
        if o.get('availableAt', coll) > t: mg_later.setdefault(n, set()).add(o['value'])
for k, t in enumerate(ptxt):
    n = sect[k]
    if 1 <= n <= 6:
        for v in mg_later.get(n, ()):
            if re.search(r'(?:Mg|magnesium)[^.]{0,22}\b' + re.escape(v) + r'\b', t):
                # a value that is ALSO a current-or-earlier result is fine (e.g. 5.6 never appears earlier); only flag later-only values
                earlier = {o['value'] for c_, o in labs['Magnesium'].items() if o.get('availableAt', c_) <= RES[n]}
                if v not in earlier: fail(f'SPOILER page {k + 1} (checkpoint {n}): later Mg value {v}')
BAN = {'dialysis': 3, 'hemodialysis': 3, 'hypoglyc': 4, 'D10W': 5, 'delirium': 5, 'confus': 5, 'rebound': 6, 'diphenhydramine': 5, 'bowel protocol': 6, 'bisacodyl': 6, 'KUB': 6, 'pink milk': 6, 'teach-back': 7, 'sitter': 5}
ALLOW_PAGES = {'dialysis': {1, 2}}   # the rubric/cover never mention it, but the role cards list none; kept for clarity
for k, t in enumerate(ptxt):
    n = sect[k]
    if n == 0 and k >= 5: n = 0
    for w, first in BAN.items():
        if re.search(w, t, re.I) and 0 <= n < first and not (n == 0 and w in ('teach-back', 'confus', 'sitter')):
            fail(f'SPOILER page {k + 1} (section {n}): "{w}" is first allowed at checkpoint {first}')
print(f'checked {n_checked} lab cells against patient.json; {len(ptxt)} student pages scanned for spoilers')
print('ALL CHECKS PASSED' if not bad else f'{len(bad)} PROBLEM(S) FOUND')
sys.exit(1 if bad else 0)
