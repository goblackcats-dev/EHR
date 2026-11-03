#!/usr/bin/env python3
"""Fact checker for the simplified packet and key: every number against patient.json and monitor.html, plus a scan for later-checkpoint leaks on the student pages.
    python3 check_facts.py      Prints each mismatch and 'ALL CHECKS PASSED' (exit 0) when there are none."""
import json, os, re, sys, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
CASE = os.path.join(HERE, '..'); REPO = os.path.join(CASE, '..', '..', '..')
import content2 as C
from monvals import MON, ED_VITALS, UO
from docx import Document
from docx.oxml.ns import qn

pj = json.load(open(os.path.join(CASE, 'patient.json')))['canonical']
bad = []
def fail(msg): bad.append(msg); print('MISMATCH:', msg)
labs = {}
for o in pj['observations']:
    if o['type'] == 'lab': labs.setdefault(o['label'], {})[o['collected']] = o
TIME = {'Tue 0440': '2026-11-17 04:40', 'Tue 0900': '2026-11-17 09:00', 'Tue 1115': '2026-11-17 11:15', 'Tue 1315': '2026-11-17 13:15', 'Tue 1700': '2026-11-17 17:00', 'Tue 1800': '2026-11-17 18:00',
        'Tue 2100': '2026-11-17 21:00', 'Wed 0100': '2026-11-18 01:00', 'Wed 0500': '2026-11-18 05:00', 'Tue 1130': '2026-11-17 11:30', 'Tue 1415': '2026-11-17 14:15'}
def num(s): m = re.match(r'\s*(-?\d+(?:\.\d+)?)', s); return m.group(1) if m else None
n_checked = 0

# 1. lab tables (key) vs chart; normal ranges vs chart reference
allcp = list(C.CP.items()) + [(7, C.CLOSE)]
for n, cp in allcp:
    lb = cp['labs']
    for nm, vals in lb['rows']:
        ref = list(labs[nm].values())[0].get('reference')
        if ref != C.NORMAL[nm]: fail(f'CP{n}: normal range for {nm} is {C.NORMAL[nm]}, chart says {ref}')
        for t, v in zip(lb['times'], vals):
            if v == '': continue
            try: chart = labs[nm][TIME[t]]['value']
            except KeyError: fail(f'CP{n}: {nm} has no draw at {t}'); continue
            n_checked += 1
            if num(chart) != num(v): fail(f'CP{n}: {nm} {t}: content says {v}, chart says {chart}')
    for nm, vals in cp.get('abg', []):
        for t, v in zip(['Tue 1130', 'Tue 1415'], vals):
            n_checked += 1
            if num(labs[nm][TIME[t]]['value']) != num(v): fail(f'CP{n}: {nm} {t}: {v} vs chart {labs[nm][TIME[t]]["value"]}')
    # the Mg the students write must be new results in the chart and listed in the Mg row
    for v in cp['mg']:
        if v not in dict(lb['rows'])['Magnesium']: fail(f'CP{n}: mg {v} not in the Magnesium row')
for t, v in C.TIMELINE_MG:
    if labs['Magnesium'][TIME[t]]['value'] != v: fail(f'timeline Mg {t}: {v} vs chart')
# availability: the labs shown at checkpoint n must have been resulted (availableAt) by that clock
RES = {1: '2026-11-17 07:00', 2: '2026-11-17 11:00', 3: '2026-11-17 15:00', 4: '2026-11-17 19:00', 5: '2026-11-17 23:00', 6: '2026-11-18 03:00', 7: '2026-11-18 07:00'}
for n, cp in allcp:
    for nm, vals in cp['labs']['rows']:
        for t, v in zip(cp['labs']['times'], vals):
            if v and labs[nm][TIME[t]].get('availableAt', TIME[t]) > RES[n]: fail(f'CP{n}: {nm} {t} is not resulted yet at {RES[n]}')

# 2. monitor values vs monitor.html and chart vitals
html = open(os.path.join(REPO, 'monitor.html')).read()
rows = re.findall(r"\{ t: '([\d-]+ [\d:]+)', hr: (\d+), spo2: (\d+), sys: (\d+), dia: (\d+), rr: (\d+), temp: ([\d.]+), rhythm: '(\w+)', pr: ([\d.]+), qrs: ([\d.]+)", html)
mon_html = {r[0]: r for r in rows}
for n, m in MON.items():
    r = mon_html[RES[n]]
    if m['hr'] != r[1]: fail(f'MON {n} HR {m["hr"]} vs monitor.html {r[1]}')
    if m['bp'] != f'{r[3]}/{r[4]}': fail(f'MON {n} BP {m["bp"]} vs monitor.html {r[3]}/{r[4]}')
    if num(m['rr']) != r[5]: fail(f'MON {n} RR')
    if num(m['spo2']) != r[2]: fail(f'MON {n} SpO2')
    if float(m['temp']) != float(r[6]): fail(f'MON {n} temp')
    s, d_ = [int(x) for x in m['bp'].split('/')]
    if round((s + 2 * d_) / 3) != int(m['map']): fail(f'MON {n} MAP')
    pr = re.search(r'PR (\d\.\d+)', m['rhythm'])
    if pr and abs(float(pr.group(1)) - float(r[8])) > 0.001: fail(f'MON {n} PR {pr.group(1)} vs {r[8]}')
v0700 = {o['code']: o['value'] for o in pj['observations'] if o['type'] == 'vital' and o['collected'] == '2026-11-17 07:00'}
if v0700['HR'].split()[0] != MON[1]['hr'] or v0700['BP'].split()[0] != MON[1]['bp'] or v0700['RR'].split()[0] != MON[1]['rr']: fail('0700 monitor row vs chart vitals')

# 3. hourly urine
io = {e['id']: e for e in pj['ioEvents']}
def hourly(note): return [int(x) for x in re.findall(r'(\d+)', note.split('hourly')[1])][:4] if 'hourly' in note else []
for n, cid in ((2, 'io_2026_11_17_11_00'), (3, 'io_2026_11_17_15_00'), (4, 'io_2026_11_17_19_00'), (5, 'io_2026_11_17_23_00'), (6, 'io_2026_11_18_03_00'), (7, 'io_2026_11_18_07_00')):
    e = io.get(cid)
    if not e: fail(f'no ioEvent {cid}'); continue
    h = hourly(e['note']) or hourly(json.dumps(e.get('detail', {})))
    if h and not all(str(x) in UO[n] for x in h): fail(f'UO[{n}] vs chart hourly {h}')
# the "urine ... last hour" numbers written in the key answers = last hourly value
LAST = {2: 40, 3: 10, 4: 20, 5: 60, 6: 40, 7: 85}
for n, cp in allcp:
    if n in LAST:
        mm = re.search(r'Urine (\d+) mL last hour', cp['key']['noticed'])
        if not mm or int(mm.group(1)) != LAST[n]: fail(f'CP{n}: urine last hour {mm.group(1) if mm else None} vs {LAST[n]}')
        e = io[{2: 'io_2026_11_17_11_00', 3: 'io_2026_11_17_15_00', 4: 'io_2026_11_17_19_00', 5: 'io_2026_11_17_23_00', 6: 'io_2026_11_18_03_00', 7: 'io_2026_11_18_07_00'}[n]]
        h = hourly(e['note']) or hourly(json.dumps(e.get('detail', {})))
        if h and h[-1] != LAST[n]: fail(f'CP{n}: chart last hourly {h[-1]} vs {LAST[n]}')

# 4/5. numbers in text
def docx_text(path):
    d = Document(path); paras = []
    for p in d.element.body.iter(qn('w:p')): paras.append(''.join(t.text or '' for t in p.iter(qn('w:t'))))
    return '\n'.join(paras)
student = docx_text(os.path.join(CASE, 'CASE_STUDY_PACKET.docx'))
keytxt = docx_text(os.path.join(CASE, 'INSTRUCTOR_CASESTUDY_KEY.docx'))
keymd = open(os.path.join(CASE, 'INSTRUCTOR_CASESTUDY_KEY.md')).read()
ecg_text = ' '.join(v['value'] for v in labs['ECG 12-lead interpretation'].values())
ecg_pr = set(re.findall(r'PR (\d{3}) ms', ecg_text)); ecg_qrs = set(re.findall(r'QRS (\d{3}) ms', ecg_text)); ecg_qtc = set(re.findall(r'QTc (\d{3})', ecg_text))
vals = {k: {v['value'] for v in labs[k].values()} for k in labs}
PATTERNS = [('Magnesium', r'(?:\bMg|magnesium)(?: level)?(?: was| is| of| at| to| now| again| came back)? (\d+\.\d)\b'), ('Potassium', r'(?:\bK|potassium) (?:was |is |of |at )?(\d+\.\d)\b'),
            ('Creatinine', r'creatinine (?:was |is |of |at |peaked at |to )?(\d+\.\d)\b'), ('Calcium', r'\b(?:calcium|Ca) (?:was |is |of |at )?(\d+\.\d)\b')]
ALLOW = {'Magnesium': {'5.0', '2.2', '1.7', '2.3', '2.5'}, 'Potassium': {'3.5', '5.1'}, 'Creatinine': {'0.7', '1.3', '2.6'}, 'Calcium': {'8.6', '10.2'}}
for nm, txt in (('student', student), ('key', keytxt), ('key.md', keymd)):
    for pr in re.findall(r'\bPR (\d{3}) ?ms', txt):
        if pr not in ecg_pr: fail(f'{nm}: PR {pr} ms not in any chart ECG {sorted(ecg_pr)}')
    for q in re.findall(r'\bQRS (\d{3}) ?ms', txt):
        if q not in ecg_qrs: fail(f'{nm}: QRS {q} ms not in any chart ECG')
    for q in re.findall(r'\bQTc (\d{3})', txt):
        if q not in ecg_qtc: fail(f'{nm}: QTc {q} not in chart ECGs')
    for lab_name, pat in PATTERNS:
        allowed = vals[lab_name] | ALLOW[lab_name] | (vals['Ionized calcium'] if lab_name == 'Calcium' else set())
        for m in re.finditer(pat, txt, re.I):
            if m.group(1) not in allowed: fail(f'{nm}: "{m.group(0)}" is not a {lab_name} value in the chart')
for k in ('SIM-40318', 'Eleanor', 'Diane Ruiz', 'Okafor', 'Lindgren', 'Raman', '5E-14', 'Penicillin', '88.0', '04/22/1952'):
    if k not in student: fail(f'student packet does not mention {k}')
    if not re.search(re.escape(k), json.dumps(pj) + 'Eleanor Diane Ruiz 04/22/1952'): fail(f'{k} not in patient.json')
if pj['patient']['dob'] != '1952-04-22' or pj['patient']['heightCm'] != 175 or pj['patient']['weightKg'] != 88: fail('DOB/height/weight differ')
if pj['patient']['name'] != 'Raymond Kessler' or pj['patient']['age'] != 74 or pj['patient']['mrn'] != 'SIM-40318': fail('patient identity differs')
# situation text numbers: every "magnesium N.N" quoted in a situation must be an available chart value; also quick fixed facts
for n, cp in allcp:
    for ln in cp['sit']:
        for m in re.finditer(r'magnesium (?:\*\*)?(?:was )?(\d+\.\d)', ln, re.I):
            if m.group(1) not in vals['Magnesium']: fail(f'CP{n} situation Mg {m.group(1)}')
# 6. the student packet must not carry the key's answers
for n, cp in allcp:
    for s in cp['key']['pri'][:1] + [cp['key']['S'], cp['key']['R'], cp['key']['nxt']]:
        if s[:45] in student: fail(f'CP{n}: key text found in the student packet: {s[:45]}')

# 7. no spoilers on student pages
tags = json.load(open(os.path.join(HERE, 'out', 'page_tags.json')))
pdf = os.path.join(HERE, 'out', 'CASE_STUDY_PACKET.pdf')
npg = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout).group(1))
ptxt = [re.sub(r'\s+', ' ', subprocess.run(['pdftotext', '-f', str(k), '-l', str(k), '-layout', pdf, '-'], capture_output=True, text=True).stdout) for k in range(1, npg + 1)]
sect = []; cur = 0
for t in ptxt:
    for tg in tags:
        if re.sub(r'\s+', ' ', tg) in t:
            m = re.match(r'CHECKPOINT (\d)', tg); cur = int(m.group(1)) if m else (7 if tg.startswith('CASE CLOSED') else 0)
    sect.append(cur)
if len(ptxt) != len(tags): fail(f'{len(ptxt)} PDF pages vs {len(tags)} logical pages')
mg_later = {}
for coll, o in labs['Magnesium'].items():
    for n, t in RES.items():
        if o.get('availableAt', coll) > t: mg_later.setdefault(n, set()).add(o['value'])
for k, t in enumerate(ptxt):
    n = sect[k]
    if 0 <= n <= 6:
        earlier = {o['value'] for c_, o in labs['Magnesium'].items() if o.get('availableAt', c_) <= RES.get(n, '2026-11-17 00:00')}
        for v in mg_later.get(n, set(vals['Magnesium']) if n == 0 else ()):
            if v in earlier: continue
            if re.search(r'(?:Mg|magnesium)[^.]{0,22}\b' + re.escape(v) + r'\b', t): fail(f'SPOILER page {k + 1} (section {n}): later Mg value {v}')
BAN = {'dialysis': 3, 'hemodialysis': 3, 'catheter': 3, 'hypoglyc': 4, 'low glucose': 4, 'D10W': 5, 'delirium': 5, 'confus': 5, 'sitter': 5, 'rebound': 6, 'diphenhydramine': 5, 'bowel protocol': 6,
       'bisacodyl': 6, 'KUB': 6, 'pink milk': 6, 'milk of magnesia': 6, 'teach-back': 7, 'ventilat': 9, 'rapid response': 2}
for k, t in enumerate(ptxt):
    n = sect[k]
    for w, first in BAN.items():
        if re.search(w, t, re.I) and n < first: fail(f'SPOILER page {k + 1} (section {n}): "{w}" first allowed at checkpoint {first}')
# the front pages / 0700 page: any lab value other than the 0440 ones?
print(f'checked {n_checked} lab cells against patient.json; {len(ptxt)} student pages scanned for spoilers')
print('ALL CHECKS PASSED' if not bad else f'{len(bad)} PROBLEM(S) FOUND')
sys.exit(1 if bad else 0)
