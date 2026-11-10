#!/usr/bin/env python3
"""Fact checker for the Lauren Mitchell packet and key: every number against patient.json and monitor.html (ADDISON rows), the I&O blocks,
the ECG numbers and the times, plus a leak scan (no later value or event on an earlier student page).
    python3 check_facts.py      Prints each mismatch and 'ALL CHECKS PASSED' (exit 0) when there are none."""
import json, os, re, sys, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
CASE = os.path.join(HERE, '..'); REPO = os.path.join(CASE, '..', '..', '..')
import content2 as C
from monvals import MON, ED_VITALS, UO
from docx import Document
from docx.oxml.ns import qn

pj = json.load(open(os.path.join(CASE, 'patient.json')))['canonical']
bad = []; n_checked = 0
def fail(msg): bad.append(msg); print('MISMATCH:', msg)
def num(s): m = re.match(r'\s*(-?\d+(?:\.\d+)?)', str(s)); return m.group(1) if m else None
labs = {}
for o in pj['observations']:
    if o['type'] == 'lab': labs.setdefault(o['label'], {})[o['collected']] = o
TIME = {'Mon 0406': '2026-12-07 04:06', 'Mon 0450': '2026-12-07 04:50', 'Mon 0900': '2026-12-07 09:00', 'Mon 1300': '2026-12-07 13:00', 'Mon 1700': '2026-12-07 17:00',
        'Mon 2100': '2026-12-07 21:00', 'Tue 0100': '2026-12-08 01:00', 'Tue 0500': '2026-12-08 05:00'}
RES = {1: '2026-12-07 07:00', 2: '2026-12-07 11:00', 3: '2026-12-07 15:00', 4: '2026-12-07 19:00', 5: '2026-12-07 23:00', 6: '2026-12-08 03:00', 7: '2026-12-08 07:00'}
allcp = list(C.CP.items()) + [(7, C.CLOSE)]

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
                if o.get('availableAt', o['collected']) > RES[n]: fail(f'CP{n}: {nm} {t} is not resulted yet at {RES[n]} (available {o["availableAt"]})')
for nm, tl in (('Sodium', C.TIMELINE_NA), ('Potassium', C.TIMELINE_K)):
    for t, v in tl:
        n_checked += 1
        if labs[nm][TIME[t]]['value'] != v: fail(f'timeline {nm} {t}: {v} vs chart {labs[nm][TIME[t]]["value"]}')
# sodium arithmetic stated in the materials
na0, na1300, na0500 = (int(labs['Sodium'][TIME[t]]['value']) for t in ('Mon 0406', 'Mon 1300', 'Tue 0500'))
if na1300 - na0 != 6 or na0500 - na0 != 8: fail(f'sodium change: +{na1300 - na0} by 1300 and +{na0500 - na0} by Tue 0500 (materials say +6 and +8)')
if int(labs['Sodium'][TIME['Mon 1700']]['value']) - na0 != 7: fail('sodium +7 in 13 h at 1700')
# POC glucose and the key fixed facts in the chart
poc = {o['collected'][11:16].replace(':', ''): o['value'] for o in labs['Glucose (point of care)'].values()}
if poc.get('0645') != '88' or MON[1]['glucose'] != '88 (0645)': fail('0700 glucose 88 at 0645')
if labs['Cortisol, random (drawn before hydrocortisone)'][TIME['Mon 0406']]['availableAt'] != '2026-12-07 13:10': fail('cortisol result time')
if labs['ACTH (drawn before hydrocortisone)'][TIME['Mon 0406']]['availableAt'] != '2026-12-07 14:40': fail('ACTH result time')
gi = labs['GI pathogen PCR panel (stool)']['2026-12-07 09:45']
if 'Norovirus' not in gi['value'] or gi['availableAt'] != '2026-12-07 18:20': fail('norovirus result / time')

# 2. monitor values vs monitor.html ADDISON rows, the guide (standing values, glucose), and the 0700 chart vitals
html = open(os.path.join(REPO, 'monitor.html')).read()
block = html[html.index('const ADDISON'):]; block = block[:block.index('\n  ];')]
rows = re.findall(r"\{ t: '([\d-]+ [\d:]+)', hr: (\d+), spo2: (\d+), sys: (\d+), dia: (\d+), rr: (\d+), temp: ([\d.]+), rhythm: '(\w+)', pr: ([\d.]+), qrs: ([\d.]+), tAmp: ([\d.]+), o2: '([^']*)', note: '([^']*)'", block)
mon_html = {r[0]: r for r in rows}
if len(mon_html) != 7: fail(f'monitor.html ADDISON has {len(mon_html)} rows')
guide = open(os.path.join(CASE, 'INSTRUCTOR_GUIDE.md')).read()
for n, m in MON.items():
    r = mon_html.get(RES[n])
    if not r: fail(f'no monitor row at {RES[n]}'); continue
    n_checked += 1
    if m['hr'] != r[1]: fail(f'MON {n} HR {m["hr"]} vs monitor.html {r[1]}')
    if m['bp'] != f'{r[3]}/{r[4]}': fail(f'MON {n} BP {m["bp"]} vs monitor.html {r[3]}/{r[4]}')
    if num(m['rr']) != r[5]: fail(f'MON {n} RR')
    if num(m['spo2']) != r[2] or r[11] != 'Room air' or 'room air' not in m['spo2']: fail(f'MON {n} SpO2/O2')
    if float(m['temp']) != float(r[6]): fail(f'MON {n} temp')
    s, d_ = [int(x) for x in m['bp'].split('/')]
    if round((s + 2 * d_) / 3) != int(m['map']): fail(f'MON {n} MAP')
    want = 'tachy' if 'tachycardia' in m['rhythm'].lower() else 'sinus'
    if r[7] != want: fail(f'MON {n} rhythm {m["rhythm"]} vs {r[7]}')
    st = re.match(r'(\d+/\d+), HR (\d+)', m['stand'])
    if st:
        if f'Standing {st.group(1)}, HR {st.group(2)}' not in r[12]: fail(f'MON {n} standing {st.group(0)} not in the monitor note "{r[12]}"')
        if f'{st.group(1)}' not in guide: fail(f'MON {n} standing not in the guide')
    g = num(m['glucose'])
    if g and not re.search(rf'\b{g}\b', guide): fail(f'MON {n} glucose {g} not in the guide')
gl = re.search(r'Bedside glucose values.*?:\*\* 0900 \*\*72\*\*, 1100 \*\*58\*\* \(1120 after treatment \*\*142\*\*\), 1300 \*\*104\*\*, 1500 \*\*118\*\*, 1900 \*\*142\*\*, 2300 \*\*152\*\*, 0300 \*\*128\*\*, 0700 \*\*112\*\*', guide)
if not gl: fail('guide glucose line changed: re-check the glucoses in monvals.py')
v = {}
for o in pj['observations']:
    if o['type'] == 'vital': v.setdefault(o['collected'], {})[o['code']] = o['value']
v7, v620 = v['2026-12-07 07:00'], v['2026-12-07 06:20']
for vv, m, nm in ((v7, MON[1], '0700'), (v620, ED_VITALS, '0620')):
    if vv['HR'] != m['hr'] or vv['BP'] != m['bp'] or vv['RR'] != m['rr'] or num(vv['TEMP']) != m['temp'] or num(vv['SPO2']) != num(m['spo2']): fail(f'{nm} vitals vs chart')
if max(v) != '2026-12-07 07:00': fail('chart has vitals after 0700')

# 3. intake and output blocks
io = {e['collected']: e for e in pj['ioEvents']}
IOB = {1: '2026-12-07 07:00', 2: '2026-12-07 11:00', 3: '2026-12-07 15:00', 4: '2026-12-07 19:00', 5: '2026-12-07 23:00', 6: '2026-12-08 03:00', 7: '2026-12-08 07:00'}
for n, t in IOB.items():
    e = io[t]; txt = UO[n].replace(',', '')
    n_checked += 1
    if f'in {e["intake"]}' not in txt.replace('in 2700 IV', 'in 2700'): fail(f'UO[{n}] intake {e["intake"]}: {UO[n]}')
    if f'out {e["output"]}' not in txt: fail(f'UO[{n}] output {e["output"]}: {UO[n]}')
    for x in re.findall(r'(\d{4}) (\d+)', e['note'].split('Voids')[-1]) if 'Voids' in e['note'] else []:
        if f'{x[0]} {x[1]}' not in UO[n]: fail(f'UO[{n}] void {x[0]} {x[1]} missing')
    if n > 1:
        tr = (C.CP[n] if n <= 6 else C.CLOSE)['key']['track'].split(' | ')[7]
        perh = e['detail']['urine'] / 4
        mm = re.search(r'about (\d+) mL/h', tr)
        if not mm or abs(int(mm.group(1)) - perh) > 3: fail(f'CP{n} tracker urine {tr} vs chart {perh} mL/h')
if io['2026-12-08 07:00']['note'].find('59.8 kg') < 0: fail('weight 59.8 kg')
# blocks are filed at their END time; periodEnd makes Flowsheets > I&O count a block ending 0700/1900 in the shift it closes
if not all(e.get('periodEnd') for e in pj['ioEvents']): fail('ioEvents without periodEnd: the I&O shift totals would move the 0700/1900 blocks into the next shift')

# 4. ECG numbers quoted anywhere must be in a chart ECG
def docx_text(path):
    d = Document(path); return '\n'.join(''.join(t.text or '' for t in p.iter(qn('w:t'))) for p in d.element.body.iter(qn('w:p')))
student = docx_text(os.path.join(CASE, 'CASE_STUDY_PACKET.docx'))
keytxt = docx_text(os.path.join(CASE, 'INSTRUCTOR_CASESTUDY_KEY.docx'))
keymd = open(os.path.join(CASE, 'INSTRUCTOR_CASESTUDY_KEY.md')).read()
ecg_text = ' '.join(o['value'] for o in labs['ECG 12-lead interpretation'].values())
ecg = {k: set(re.findall(k + r' (\d{2,3}) ms', ecg_text)) for k in ('PR', 'QRS', 'QTc')}
vals = {k: {o['value'] for o in labs[k].values()} for k in labs}
PATTERNS = [('Sodium', r'\b(?:sodium|Na)(?: was| is| of| at| to| now| \(latest\))?:? (1\d\d)\b'), ('Potassium', r'\b(?:potassium|K)(?: was| is| of| at| to| now)? (\d\.\d)\b'),
            ('Creatinine', r'creatinine (?:was |is |of |at |to |back to )?(\d\.\d)\b'), ('Glucose (serum)', r'\bserum glucose (?:was |is |of |at )?(\d+)\b'),
            ('Eosinophils', r'eosinophils (\d+\.\d)%')]
ALLOW = {'Sodium': {'136', '145', '134', '120'}, 'Potassium': {'3.5', '5.1', '6.0'}, 'Creatinine': {'0.5', '1.1'}, 'Glucose (serum)': set(), 'Eosinophils': set()}
for nm, txt in (('student', student), ('key', keytxt), ('key.md', keymd)):
    for k, pat in (('PR', r'\bPR (\d{3}) ?ms'), ('QRS', r'\bQRS (\d{2,3}) ?ms'), ('QTc', r'\bQTc (\d{3})')):
        for x in re.findall(pat, txt):
            n_checked += 1
            if x not in ecg[k]: fail(f'{nm}: {k} {x} not in any chart ECG {sorted(ecg[k])}')
    for lab_name, pat in PATTERNS:
        for m in re.finditer(pat, txt, re.I):
            n_checked += 1
            if m.group(1) not in vals[lab_name] | ALLOW[lab_name]: fail(f'{nm}: "{m.group(0)}" is not a {lab_name} value in the chart')
    for x in re.findall(r'cortisol (\d+\.\d)', txt, re.I):
        if x not in vals['Cortisol, random (drawn before hydrocortisone)'] | {'1.8'}: fail(f'{nm}: cortisol {x}')
    for x in re.findall(r'ACTH (\d,?\d{3})', txt):
        if x.replace(',', '') != '1240': fail(f'{nm}: ACTH {x}')

# 5. identity and fixed facts on the patient card
p = pj['patient']
if (p['name'], p['age'], p['mrn'], p['dob'], p['heightCm'], p['weightKg']) != ('Lauren Mitchell', 46, 'SIM-40422', '1980-05-14', 165, 58.2): fail('patient identity differs')
for k in ('SIM-40422', '05/14/1980', '4W-22', 'Sulfamethoxazole-trimethoprim', '58.2 kg', 'Daniel Mitchell', 'Ethan', 'Delacroix', 'Osei', 'Harrington', 'Nakagawa',
          'Hydrocortisone** 15 mg at 0700 + 5 mg at 1400', 'fludrocortisone** 0.1 mg', 'levothyroxine 88 mcg'):
    kk = k.replace('**', '')
    if kk not in student: fail(f'student packet does not mention {kk}')
blob = json.dumps(pj)
for k in ('Delacroix', 'Osei', 'Harrington', 'Nakagawa', 'Daniel', 'Ethan', '4W-22', 'Lindqvist'):
    if k not in blob: fail(f'{k} not in patient.json')
# orders/times quoted in the key
ords = {o['id']: o for o in pj['orders']}
def order(sub): return next(o for o in pj['orders'] if sub in o['id'])
if 'Every 6 hours (1000, 1600, 2200, 0400)' not in order('hydrocortisone_iv_q6')['frequency']: fail('hydrocortisone schedule')
if order('d5_half_ns')['orderedAt'] != '2026-12-07 15:30' or order('d5ns_150')['end'] != '2026-12-07 15:30': fail('1530 fluid change')
if order('melatonin')['orderedAt'] != '2026-12-07 23:15': fail('melatonin 2315')
if order('kcl_po')['orderedAt'] != '2026-12-08 06:10': fail('KCl 0610')
if '20/20/10 mg (1000, 1500, 2000)' not in order('hydrocortisone_po_stress')['instructions']: fail('oral taper')
if order('fludrocortisone_resume')['start'] != '2026-12-08 08:00' and 'Tuesday' not in order('fludrocortisone_resume')['frequency']: fail('fludrocortisone restart 0800')

# 6. the student packet must not carry the key's answers
for n, cp in allcp:
    for s in cp['key']['pri'][:1] + [cp['key']['S'], cp['key']['R'], cp['key']['nxt']]:
        if s[:45] in student: fail(f'CP{n}: key text found in the student packet: {s[:45]}')

# 7. leak scan on the student PDF: a value or event may not appear before the stop where it first becomes known
tags = json.load(open(os.path.join(HERE, 'out', 'page_tags.json')))
pdf = os.path.join(HERE, 'out', 'CASE_STUDY_PACKET.pdf')
npg = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout).group(1))
ptxt = [re.sub(r'\s+', ' ', subprocess.run(['pdftotext', '-f', str(k), '-l', str(k), '-layout', pdf, '-'], capture_output=True, text=True).stdout) for k in range(1, npg + 1)]
sect = []; cur = 0
for t in ptxt:
    for tg in tags:
        if re.sub(r'\s+', ' ', tg) in t:
            m = re.match(r'CHECKPOINT (\d)', tg); cur = int(m.group(1)) if m else (7 if tg.startswith('CASE CLOSED') else 1)   # front pages are read at 0700
    sect.append(cur)
if len(ptxt) != len(tags): fail(f'{len(ptxt)} PDF pages vs {len(tags)} logical pages')
def first_stop(avail):
    return next(n for n, t in sorted(RES.items()) if avail <= t) if avail <= RES[7] else 8
# lab values (by label) with the stop where each is first available; a value that was already known earlier is fine
LEAK = {'Sodium': r'(?:sodium|Na)\b', 'Potassium': r'(?:potassium|\bK)\b', 'Creatinine': r'creatinine', 'Glucose (serum)': r'glucose',
        'Cortisol, random (drawn before hydrocortisone)': r'cortisol', 'ACTH (drawn before hydrocortisone)': r'ACTH', 'Hemoglobin': r'hemoglobin', 'Eosinophils': r'eosinophil'}
for nm, lab_pat in LEAK.items():
    seen = {}
    for o in labs[nm].values():
        s = first_stop(o.get('availableAt', o['collected']))
        seen[o['value']] = min(seen.get(o['value'], 9), s)
    for val, s in seen.items():
        vv = val.replace('1240', '1,?240')
        for k, t in enumerate(ptxt):
            if sect[k] < s and re.search(lab_pat + r'[^.]{0,30}?\b' + vv + r'\b(?![-/]\d)', t, re.I):
                n_checked += 1; fail(f'LEAK page {k + 1} (stop {sect[k]}): {nm} {val} first known at stop {s}')
# bedside glucoses the instructor gives must not appear before their stop (58 is also the EMS value at 0340, already in the chart at 0700)
GLU = {2: ['142'], 3: ['118'], 5: ['152'], 6: ['128'], 7: ['112']}
if poc.get('0340') != '58': GLU[2].append('58')
for s, gs in GLU.items():
    for g in gs:
        for k, t in enumerate(ptxt):
            if sect[k] < s and re.search(r'glucose[^.]{0,25}\b' + g + r'\b(?![-/]\d)', t, re.I): fail(f'LEAK page {k + 1}: glucose {g} (stop {s})')
for n, m in MON.items():   # this stop's NOW values must not be printed on this stop's page (only in the next page's "prev" row)
    for k, t in enumerate(ptxt):
        if sect[k] == n and n > 1 and f"{m['bp']} ({m['map']})" in t: fail(f'LEAK page {k + 1}: NOW BP {m["bp"]} printed on its own stop')
        if sect[k] < n and f"{m['bp']} ({m['map']})" in t and n > 1: fail(f'LEAK page {k + 1}: BP {m["bp"]} of stop {n}')
BAN = {'hypoglyc': 2, 'D50 25': 2, 'positive \\(': 3, 'water diuresis': 3, '0\\.45': 4, 'half-normal': 4, 'norovirus': 4, 'melatonin': 6,
       'insomnia': 5, 'wired': 5, 'near-fall': 6, 'infiltrat': 6, 'taper': 7, 'Act-O-Vial': 7, 'KCl': 7, 'return demonstration': 7, 'teach-back': 7, '59\\.8': 7, 'restart': 7}
for k, t in enumerate(ptxt):
    for w, first in BAN.items():
        if sect[k] < first and re.search(w, t, re.I): fail(f'LEAK page {k + 1} (stop {sect[k]}): "{w}" first allowed at stop {first}')
# screenshots: each is placed on a page no earlier than the stop at which it was captured
meta = json.load(open(os.path.join(HERE, 'figs', 'raw_meta.json')))
SHOT_STOP = {'ehr_mar.png': meta['mar_clock'], 'ehr_ecg.png': meta['ecg_clock'], 'ehr_cortisol_tree.png': meta['labs_clock'], 'ehr_sodium.png': meta['na_clock']}
CLOCK2STOP = {'07:00': 1, '11:00': 2, '15:00': 3, '19:00': 4, '23:00': 5, '03:00': 6}
placed = {'ehr_mar.png': 1, 'ehr_ecg.png': 1}
for n, cp in C.CP.items():
    if cp.get('shot'): placed[cp['shot'][1]] = n
for f, n in placed.items():
    cap = CLOCK2STOP[SHOT_STOP[f]]
    if cap > n: fail(f'screenshot {f} captured at {SHOT_STOP[f]} but printed at stop {n}')
    if cap != n and f not in ('ehr_mar.png', 'ehr_ecg.png'): fail(f'screenshot {f} captured at {SHOT_STOP[f]}, printed at stop {n}')
print(f'checked {n_checked} values against patient.json / monitor.html; {len(ptxt)} student pages scanned for leaks; screenshots placed: {placed}')
print('ALL CHECKS PASSED' if not bad else f'{len(bad)} PROBLEM(S) FOUND')
sys.exit(1 if bad else 0)
