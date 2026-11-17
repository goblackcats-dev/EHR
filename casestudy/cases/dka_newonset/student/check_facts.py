#!/usr/bin/env python3
"""Fact checker for the Nora Whitcombe packet and key: every number against patient.json and monitor.html (NORA rows), the I&O blocks,
the ECG numbers, the order times and the protocol math, plus a leak scan (no later value or event on an earlier student page) and an
answer scan (no key text and no Quick Check answer or "why" text in the student packet).
    python3 check_facts.py      Prints each mismatch and 'ALL CHECKS PASSED' (exit 0) when there are none."""
import json, os, re, sys, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
CASE = os.path.join(HERE, '..'); REPO = os.path.join(CASE, '..', '..', '..')
import content2 as C
from monvals import MON, MID, UO
from docx import Document
from docx.oxml.ns import qn

pj = json.load(open(os.path.join(CASE, 'patient.json')))['canonical']
bad = []; n_checked = 0
def fail(msg): bad.append(msg); print('MISMATCH:', msg)
def num(s): m = re.match(r'\s*(-?\d+(?:\.\d+)?)', str(s)); return m.group(1) if m else None
labs = {}
for o in pj['observations']:
    if o['type'] == 'lab': labs.setdefault(o['label'], {})[o['collected']] = o
TIME = {'Mon 0150': '2027-02-08 01:50', 'Mon 0530': '2027-02-08 05:30', 'Mon 0930': '2027-02-08 09:30', 'Mon 1330': '2027-02-08 13:30', 'Mon 1730': '2027-02-08 17:30',
        'Mon 2200': '2027-02-08 22:00', 'Tue 0200': '2027-02-09 02:00', 'Tue 0530': '2027-02-09 05:30'}
RES = {1: '2027-02-08 07:00', 2: '2027-02-08 11:00', 3: '2027-02-08 15:00', 4: '2027-02-08 19:00', 5: '2027-02-08 23:00', 6: '2027-02-09 03:00', 7: '2027-02-09 07:00'}
allcp = list(C.CP.items()) + [(7, C.CLOSE)]
def lab(nm, t): return labs[nm][TIME[t]]['value']

# 1. lab tables (key) vs chart values, normal ranges, and availability by the checkpoint clock
for n, cp in allcp:
    for lb in cp['labs']:
        for nm, vals in lb['rows']:
            ref = list(labs[nm].values())[0].get('reference')
            if ref != C.NORMAL[nm]: fail(f'CP{n}: normal range for {nm} is "{C.NORMAL[nm]}", chart says "{ref}"')
            for t, v in zip(lb['times'], vals):
                if v == '': continue
                o = labs[nm].get(TIME[t])
                if not o: fail(f'CP{n}: {nm} has no draw at {t}'); continue
                n_checked += 1
                if num(o['value']) != num(v): fail(f'CP{n}: {nm} {t}: content says {v}, chart says {o["value"]}')
                if (o.get('availableAt') or o['collected']) > RES[n]: fail(f'CP{n}: {nm} {t} is not resulted yet at {RES[n]} (available {o.get("availableAt")})')
for nm, tl in (('Potassium', C.TIMELINE_K), ('Anion gap', C.TIMELINE_GAP), ('Beta-hydroxybutyrate (serum ketone)', C.TIMELINE_BHB)):
    for t, v in tl:
        n_checked += 1
        if lab(nm, t) != v: fail(f'timeline {nm} {t}: {v} vs chart {lab(nm, t)}')
# protocol math stated in the materials
for t in TIME:
    if t in ('Mon 0150',) or True:
        na, cl, co2, gap = (int(lab(k, t)) for k in ('Sodium', 'Chloride', 'CO2 (bicarbonate)', 'Anion gap'))
        n_checked += 1
        if na - cl - co2 != gap: fail(f'anion gap {t}: {na}-{cl}-{co2} != {gap}')
if pj['patient']['weightKg'] != 55 or round(0.1 * 55.0, 2) != 5.5 or 0.5 * 55.0 != 27.5 or round(0.5 * 55.0 / 2) != 14: fail('dosing math (5.5 units/h, 27.5 units/day, glargine 14)')
if round(133 + 1.6 * (int(lab('Glucose (serum)', 'Mon 0530')) - 100) / 100, 1) != 137.0 or lab('Sodium', 'Mon 0530') != '133': fail('corrected Na 137.0 at 0530')
if round(28.7 * 11.6 - 46.7) != 286 or lab('Hemoglobin A1c', 'Mon 0150') != '11.6': fail('A1c 11.6 / eAG 286')
if round(1.5 * float(lab('HCO3, venous (calculated)', 'Mon 0530')) + 8, 1) != 21.8 or lab('pCO2, venous', 'Mon 0530') != '22': fail("Winter's 21.8 / pCO2 22 at 0530")
for t, want in (('Mon 1330', ('7.32', '14', '1.3')), ('Mon 1730', ('7.34', '18', '0.5'))):
    if (lab('pH, venous', t), lab('CO2 (bicarbonate)', t), lab('Beta-hydroxybutyrate (serum ketone)', t)) != want: fail(f'resolution labs {t}')
if min(float(o['value']) for o in labs['Potassium'].values()) != 3.6: fail('lowest K is not 3.6 (the insulin-hold teaching needs it)')
if min(float(o['value']) for o in labs['pH, venous'].values()) != 7.14: fail('lowest pH is not 7.14')
# POC glucose in the chart (only up to 0700)
poc = {o['collected'][11:16].replace(':', ''): o['value'] for o in labs['Glucose (point of care)'].values()}
if poc.get('0700') != '274' or max(labs['Glucose (point of care)']) != '2027-02-08 07:00': fail('POC 274 at 0700 and nothing charted after 0700')
for k, v in (('C-peptide', '2027-02-09 06:00'), ('TSH', '2027-02-08 11:30'), ('Hemoglobin A1c', '2027-02-08 10:00')):
    if list(labs[k].values())[0]['availableAt'] != v: fail(f'{k} result time')
if 'negative' not in list(labs['Tissue transglutaminase IgA (tTG-IgA)'].values())[0]['value'] or 'Pending' not in list(labs['GAD65 antibody'].values())[0]['value']: fail('tTG negative / antibodies pending')

# 2. monitor values vs monitor.html NORA rows, the guide's aloud glucoses, and the 0700 chart vitals
html = open(os.path.join(REPO, 'monitor.html')).read()
block = html[html.index('const NORA'):]; block = block[:block.index('\n  ];')]
rows = re.findall(r"\{ t: '([\d-]+ [\d:]+)', hr: (\d+), spo2: (\d+), sys: (\d+), dia: (\d+), rr: (\d+), temp: ([\d.]+), rhythm: '(\w+)', pr: ([\d.]+), qrs: ([\d.]+), tAmp: ([\d.]+), uAmp: ([\d.]+), o2: '([^']*)', note: '([^']*)'", block)
mon_html = {r[0]: r for r in rows}
if len(mon_html) != 8: fail(f'monitor.html NORA has {len(mon_html)} rows (expected 7 stops + the 0335 mid row)')
guide = open(os.path.join(CASE, 'INSTRUCTOR_GUIDE.md')).read()
for n, m in MON.items():
    r = mon_html.get(RES[n])
    if not r: fail(f'no monitor row at {RES[n]}'); continue
    n_checked += 1
    if m['hr'] != r[1]: fail(f'MON {n} HR {m["hr"]} vs monitor.html {r[1]}')
    if m['bp'] != f'{r[3]}/{r[4]}': fail(f'MON {n} BP {m["bp"]} vs monitor.html {r[3]}/{r[4]}')
    if num(m['rr']) != r[5]: fail(f'MON {n} RR')
    if num(m['spo2']) != r[2] or r[12] != 'Room air' or 'room air' not in m['spo2']: fail(f'MON {n} SpO2/O2')
    if float(m['temp']) != float(r[6]): fail(f'MON {n} temp')
    s, d_ = [int(x) for x in m['bp'].split('/')]
    if round((s + 2 * d_) / 3) != int(m['map']): fail(f'MON {n} MAP')
    want = 'tachy' if 'tachycardia' in m['rhythm'].lower() else 'sinus'
    if r[7] != want: fail(f'MON {n} rhythm {m["rhythm"]} vs {r[7]}')
    pain = re.search(r'pain (\d+)', r[13])
    if pain and num(m['pain']) != pain.group(1): fail(f'MON {n} pain {m["pain"]} vs monitor note')
    for g in re.findall(r'\b(\d{2,3})\b', m['glucose'].split('(')[0]):
        if not re.search(rf'\b{g}\b', r[13]) and n != 6: fail(f'MON {n} glucose {g} not in the monitor note')
        if not re.search(rf'\*\*{g}\b|\b{g}\*\*|\b{g}\b', guide): fail(f'MON {n} glucose {g} not in the guide')
    for g in re.findall(r'\b(\d{4}) (\d{2,3})\b', m['aloud']):
        if f'{g[0]} {g[1]}' not in r[13] and f'{g[0]} **{g[1]}' not in guide and f'**{g[0]} {g[1]}' not in guide and f'{g[0]} {g[1]}' not in guide: fail(f'MON {n} aloud {g} not in the monitor note or the guide')
mid = mon_html.get('2027-02-09 03:35')
if not mid or (mid[1], f'{mid[3]}/{mid[4]}', mid[5]) != (MID['hr'], MID['bp'], MID['rr']): fail('0335 mid row')
if '0300 58' not in guide.replace('**', '') or '0317 66' not in guide.replace('**', '') or '0333 94' not in guide.replace('**', ''): fail('the 0300 glucose sequence 58/66/94 is not in the guide')
v = {}
for o in pj['observations']:
    if o['type'] == 'vital': v.setdefault(o['collected'], {})[o['code']] = o['value']
v7 = v['2027-02-08 07:00']; m = MON[1]
if v7['HR'] != m['hr'] or v7['BP'] != m['bp'] or v7['RR'] != num(m['rr']) or num(v7['TEMP']) != m['temp'] or num(v7['SPO2']) != num(m['spo2']): fail('0700 vitals vs chart')
if max(v) != '2027-02-08 07:00': fail('chart has vitals after 0700')

# 3. intake and output blocks
io = {e['collected']: e for e in pj['ioEvents']}
for n, t in RES.items():
    e = io[t]; txt = UO[n].replace(',', '')
    n_checked += 1
    if f'in {e["intake"]}' not in txt: fail(f'UO[{n}] intake {e["intake"]}: {UO[n]}')
    if f'out {e["output"]}' not in txt: fail(f'UO[{n}] output {e["output"]}: {UO[n]}')
    for x in re.findall(r'(\d{4}) (\d+) mL', e['note']):
        if f'{x[0]} {x[1]}' not in txt and not (x[0] in ('0200', '0300', '0500', '0700', '1505', '1705', '1805', '0805', '2100') or 'mL/h' in x[1]): fail(f'UO[{n}] void {x[0]} {x[1]} missing')
    tr = (C.CP[n] if n <= 6 else C.CLOSE)['key']['track'].split(' | ')
    if len(tr) != len(C.TRACKER): fail(f'CP{n} tracker has {len(tr)} columns, TRACKER has {len(C.TRACKER)} rows')
    perh = e['detail']['urine'] / 4
    mm = re.search(r'about (\d+) mL/h', tr[8])
    if not mm or abs(int(mm.group(1)) - perh) > 3: fail(f'CP{n} tracker urine {tr[8]} vs chart {perh} mL/h')
if '56.2 kg' not in io['2027-02-09 07:00']['note']: fail('weight 56.2 kg')
if not all(e.get('periodEnd') for e in pj['ioEvents']): fail('ioEvents without periodEnd')

# 4. text of the three outputs
def docx_text(path):
    d = Document(path); return '\n'.join(''.join(t.text or '' for t in p.iter(qn('w:t'))) for p in d.element.body.iter(qn('w:p')))
student = docx_text(os.path.join(CASE, 'CASE_STUDY_PACKET.docx'))
keytxt = docx_text(os.path.join(CASE, 'INSTRUCTOR_CASESTUDY_KEY.docx'))
keymd = open(os.path.join(CASE, 'INSTRUCTOR_CASESTUDY_KEY.md')).read()
ecg_text = ' '.join(o['value'] for o in labs['ECG 12-lead interpretation'].values())
ecg = {k: set(re.findall(k + r' (\d{2,3}) ms', ecg_text)) for k in ('PR', 'QRS')}
ecg['QTc'] = set(re.findall(r'QT/QTc \d+/(\d+)', ecg_text))
vals = {k: {o['value'] for o in labs[k].values()} for k in labs}
PATTERNS = [('Potassium', r'\b(?:potassium|K)(?: was| is| of| at| to| now| fell to| falling)?:? (\d\.\d)\b'), ('Beta-hydroxybutyrate (serum ketone)', r'\bBHB(?: was| is| of| at| to| still| now)?:? (\d\.\d)\b'),
            ('Anion gap', r'\bgap(?: was| is| of| at| to| now)?:? (\d\d)\b'), ('pH, venous', r'\bpH(?: was| is| of| at| to| now)?:? (7\.\d\d)\b'),
            ('Creatinine', r'creatinine (?:was |is |of |at |to |back to )?(\d\.\d)\b'), ('CO2 (bicarbonate)', r'\bCO2(?: was| is| of| at| to| now)?:? (\d\d?)\b(?!-)'),
            ('Magnesium', r'\b(?:magnesium|Mg) (\d\.\d)\b'), ('Phosphorus', r'\b(?:phosphorus|phos) (\d\.\d)\b')]
ALLOW = {'Potassium': {'3.5', '3.3', '5.1', '4.0', '4.4', '4.5', '5.0', '3.9'}, 'Beta-hydroxybutyrate (serum ketone)': {'0.6', '3.0'}, 'Anion gap': {'12'},
         'pH, venous': {'7.30', '7.00'}, 'Creatinine': {'0.6', '1.1'}, 'CO2 (bicarbonate)': {'18', '22', '29'}, 'Magnesium': {'1.8', '2.4'}, 'Phosphorus': {'1.0', '2.5', '4.5'}}
for nm, txt in (('student', student), ('key', keytxt), ('key.md', keymd)):
    for k, pat in (('PR', r'\bPR (\d{3}) ?ms'), ('QRS', r'\bQRS (\d{2,3})\b'), ('QTc', r'\bQTc (\d{3})')):
        for x in re.findall(pat, txt):
            n_checked += 1
            if x not in ecg[k]: fail(f'{nm}: {k} {x} not in any chart ECG {sorted(ecg[k])}')
    for lab_name, pat in PATTERNS:
        for mm in re.finditer(pat, txt):
            n_checked += 1
            if txt[mm.end():mm.end() + 2].startswith('-') and txt[mm.end() + 1:mm.end() + 2].isdigit(): continue   # a normal range, e.g. 7.31-7.41
            if mm.group(1) not in vals[lab_name] | ALLOW[lab_name]: fail(f'{nm}: "{mm.group(0)}" is not a {lab_name} value in the chart')
    for x in re.findall(r'C-peptide (\d\.\d)', txt):
        if x not in vals['C-peptide'] | {'0.8'}: fail(f'{nm}: C-peptide {x}')
    for x in re.findall(r'A1c (\d+\.\d)', txt):
        if x != '11.6': fail(f'{nm}: A1c {x}')

# 5. identity and fixed facts on the patient card
p = pj['patient']
if (p['name'], p['age'], p['mrn'], p['dob'], p['heightCm'], p['weightKg']) != ('Nora Whitcombe', 22, 'SIM-40602', '2004-09-14', 165, 55): fail('patient identity differs')
if p['allergies'][0]['substance'] != 'Amoxicillin' or pj['encounter']['room'] != 'SD-6': fail('allergy or room differs')
for k in ('SIM-40602', '09/14/2004', 'SD-6', 'Amoxicillin', '55.0 kg', '61.0 kg', 'Julia Whitcombe', 'Kendall Rowan', 'Petrakis', 'Rasmussen', 'Navarro', 'Kassab', 'Lowell', 'Thornbury', 'Levonorgestrel IUD'):
    if k not in student: fail(f'student packet does not mention {k}')
blob = json.dumps(pj)
for k in ('Petrakis', 'Rasmussen', 'Navarro', 'Kassab', 'Lowell', 'Thornbury', 'Julia', 'Kendall', 'Rowan', 'SD-6', 'type 2', '61.0 kg'):
    if k not in blob: fail(f'{k} not in patient.json')
# orders and times quoted in the materials
def order(sub): return next(o for o in pj['orders'] if sub in o['id'])
checks = [('sodium_bicarbonate', 'orderedAt', '2027-02-08 05:40'), ('sodium_bicarbonate', 'end', '2027-02-08 07:15'), ('kcl_20_iv', 'orderedAt', '2027-02-08 14:20'),
          ('kcl_20_iv', 'end', '2027-02-08 15:10'), ('diet_npo_except_ice_chips', 'end', '2027-02-08 11:05'), ('sugar_free_clear', 'orderedAt', '2027-02-08 11:05'),
          ('mgso4', 'start', '2027-02-08 15:00'), ('glargine', 'orderedAt', '2027-02-08 18:40'), ('glargine', 'start', '2027-02-08 19:00'),
          ('insulin_regular_infusion', 'start', '2027-02-08 03:05'), ('insulin_regular_infusion', 'end', '2027-02-08 21:00'), ('nacl045_main', 'start', '2027-02-08 07:00'),
          ('kcl_po', 'start', '2027-02-08 20:00'), ('glucose_once_at_0400', 'orderedAt', '2027-02-09 03:20')]
for sub, f, want in checks:
    n_checked += 1
    if order(sub).get(f) != want: fail(f'order {sub} {f} = {order(sub).get(f)}, materials say {want}')
if not order('sodium_bicarbonate').get('stoppedEarly') or not order('kcl_20_iv').get('stoppedEarly') or not order('diet_npo_except_ice_chips').get('stoppedEarly'): fail('planted orders / NPO should be stoppedEarly')
gtxt = json.dumps(order('glargine')) + json.dumps(order('lispro_meal'))
if '14 units' not in gtxt or '4 units' not in gtxt: fail('glargine 14 units / lispro 4 units not in the orders')
if '5.5 units/h' not in json.dumps(order('insulin_regular_infusion')): fail('insulin 5.5 units/h')
if '20 mEq' not in json.dumps(order('kcl_20_iv')) or '100 mL' not in json.dumps(order('kcl_20_iv')): fail('KCl 20 mEq in 100 mL')

# 6. the student packet must not carry the key's answers, and no Quick Check answer or "why" text
for n, cp in allcp:
    for s in cp['key']['pri'][:1] + [cp['key']['S'], cp['key']['R'], cp['key']['nxt'], cp['key']['meds'][:60], cp['key']['results'][:60], cp['big']]:
        if s[:45] in student: fail(f'CP{n}: key text found in the student packet: {s[:45]}')
    for i, q in enumerate(cp['qc'], 1):
        n_checked += 1
        if q['kind'] in ('mc', 'sata') and (len(q['opts']) < 4 or not q['ok'] or any(ch not in 'ABCDE'[:len(q['opts'])] for ch in q['ok'])): fail(f'CP{n} QC{i}: bad options/answer')
        if q['q'] not in student: fail(f'CP{n} QC{i}: question not printed in the student packet')
        for field in ('ans', 'why', 'wrong'):
            t = q[field]
            for piece in [t] + [t[k:k + 40] for k in range(0, max(1, len(t) - 40), 20)]:
                if len(piece) >= 25 and piece in student: fail(f'CP{n} QC{i}: {field} text in the student packet: "{piece}"'); break
    if not 2 <= len(cp['qc']) <= 3: fail(f'CP{n}: {len(cp["qc"])} Quick Check questions (2-3 expected)')
for w in ('Answer:  ', 'Correct answer', 'Why:', 'Tempting wrong', 'Big idea'):
    if w in student: fail(f'student packet contains "{w}"')
if student.count('QUICK CHECK') < 7 or student.count('Corrected in a different color') < 7: fail('a checkpoint page is missing its QUICK CHECK box')

# 7. leak scan on the student PDF: a value or event may not appear before the stop where it first becomes known
tags = json.load(open(os.path.join(HERE, 'out', 'page_tags.json')))
pdf = os.path.join(HERE, 'out', 'CASE_STUDY_PACKET.pdf')
npg = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout).group(1))
ptxt = [re.sub(r'\s+', ' ', subprocess.run(['pdftotext', '-f', str(k), '-l', str(k), '-layout', pdf, '-'], capture_output=True, text=True).stdout) for k in range(1, npg + 1)]
sect = []; cur = 0
for t in ptxt:
    for tg in tags:
        if re.sub(r'\s+', ' ', tg) in t:
            mm = re.match(r'CHECKPOINT (\d)', tg); cur = int(mm.group(1)) if mm else (7 if tg.startswith('CASE CLOSED') else 1)   # front pages are read at 0700
    sect.append(cur)
if len(ptxt) != len(tags): fail(f'{len(ptxt)} PDF pages vs {len(tags)} logical pages')
def first_stop(avail):
    return next(n for n, t in sorted(RES.items()) if avail <= t) if avail <= RES[7] else 8
LEAK = {'Sodium': r'(?:sodium|\bNa)\b', 'Potassium': r'(?:potassium|\bK)\b', 'Creatinine': r'creatinine', 'Glucose (serum)': r'glucose', 'Anion gap': r'gap',
        'Beta-hydroxybutyrate (serum ketone)': r'BHB', 'pH, venous': r'\bpH', 'CO2 (bicarbonate)': r'CO2', 'Magnesium': r'(?:magnesium|\bMg)\b', 'Phosphorus': r'(?:phosphorus|phos)',
        'Hemoglobin A1c': r'A1c', 'TSH': r'TSH', 'C-peptide': r'C-peptide', 'WBC': r'WBC', 'Hemoglobin': r'(?:hemoglobin|Hgb)\b'}
for nm, lab_pat in LEAK.items():
    seen = {}
    for o in labs[nm].values():
        s = first_stop(o.get('availableAt') or o['collected'])
        seen[o['value']] = min(seen.get(o['value'], 9), s)
    for val, s in seen.items():
        for k, t in enumerate(ptxt):
            if sect[k] < s and re.search(lab_pat + r'[^.]{0,30}?(?<![-/\d.])(?<!- )\b' + re.escape(val) + r'\b(?![-/]\d|\.\d| or (?:less|more))', t, re.I):
                n_checked += 1; fail(f'LEAK page {k + 1} (stop {sect[k]}): {nm} {val} first known at stop {s}')
# bedside glucoses the instructor gives aloud must not appear before their stop
GLU = {2: ['222', '204', '192', '186'], 3: ['180', '174', '170', '166'], 4: ['162', '168'], 5: ['178', '148'], 6: ['58', '66', '94'], 7: ['118', '122']}
for s, gs in GLU.items():
    for g in gs:
        for k, t in enumerate(ptxt):
            if 'FRONT | page 3 of 3' in t and re.search(rf'\b{g}\b', ' '.join(goal for _, goal in C.TRACKER)): continue   # a tracker goal (e.g. 70-180), not a value
            if sect[k] < s and re.search(r'(?:glucose|sugar)[^.]{0,40}(?<![-/\d])(?<!- )\b' + g + r'\b(?![-/]\d)', t, re.I): fail(f'LEAK page {k + 1}: glucose {g} (stop {s})')
for n, m in MON.items():   # monitor values are never printed for students (they read the monitor)
    for k, t in enumerate(ptxt):
        if f"{m['bp']}" in t and n > 1: fail(f'LEAK page {k + 1}: BP {m["bp"]} of stop {n} printed for students')
BAN = {'Mg 1\\.7|magnesium sulfate|MgSO4': 3, '20 mEq': 3, 'cramp': 3, 'peripheral IVs only': 3, 'resolv': 4, 'glargine': 4, 'lispro': 4, 'basal': 4, 'overlap': 4,
       'transition': 4, 'crying|tearful': 4, 'diagnosis talk': 4, 'hallway': 5, 'snack': 5, 'life expectancy': 5, 'groggy': 6, 'rule of 15|15-15': 6,
       'glucose tablet': 6, 'hypoglyc': 6, 'glucagon': 6, 'prim(e|ing)': 7, 'sick.day': 7, 'teach-back': 7, '56\\.2': 7, 'medical ID': 7, 'bracelet': 7,
       'antibod': 7, 'celiac': 7, 'pen needle': 7}
for k, t in enumerate(ptxt):
    for w, first in BAN.items():
        if sect[k] < first and re.search(w, t, re.I): fail(f'LEAK page {k + 1} (stop {sect[k]}): "{w}" first allowed at stop {first}')
# screenshots: each is placed on a page no earlier than the stop at which it was captured
meta = json.load(open(os.path.join(HERE, 'figs', 'raw_meta.json')))
SHOT_STOP = {'ehr_mar.png': meta['mar_clock'], 'ehr_ecg.png': meta['ecg_clock']}
CLOCK2STOP = {'07:00': 1, '11:00': 2, '15:00': 3, '19:00': 4, '23:00': 5, '03:00': 6}
placed = {'ehr_mar.png': 1, 'ehr_ecg.png': 1}
for n, cp in C.CP.items():
    if cp.get('shot'): placed[cp['shot'][1]] = n
for f, n in placed.items():
    cap = CLOCK2STOP[SHOT_STOP[f]]
    if cap > n: fail(f'screenshot {f} captured at {SHOT_STOP[f]} but printed at stop {n}')
print(f'checked {n_checked} values against patient.json / monitor.html; {len(ptxt)} student pages scanned for leaks; screenshots placed: {placed}')
print('ALL CHECKS PASSED' if not bad else f'{len(bad)} PROBLEM(S) FOUND')
sys.exit(1 if bad else 0)
