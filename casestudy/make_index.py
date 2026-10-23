#!/usr/bin/env python3
"""Writes casestudy/index.json (the list the instructor "Case Studies" menu reads). Run after building or rebuilding any case study:
   python3 casestudy/make_index.py
Each case gets a stable random token (kept in the old index.json) so the student PDF link cannot be guessed."""
import json, glob, os, secrets
here = os.path.dirname(os.path.abspath(__file__))
old = {}
try:
    old = {c['id']: c.get('token') for c in json.load(open(os.path.join(here, 'index.json')))['cases']}
except Exception:
    pass
cases = []
for cj in sorted(glob.glob(os.path.join(here, 'cases', '*', 'content.json'))):
    d = os.path.basename(os.path.dirname(cj)); meta = json.load(open(cj))['meta']
    pj = json.load(open(os.path.join(here, 'cases', d, 'patient.json'))); p = pj.get('canonical', pj)
    code = meta['caseCode']; out = f'cases/{d}/out/'
    files = {k: out + f for k, f in {'studentPdf': f'{code}_STUDENT.pdf', 'studentDocx': f'{code}_STUDENT.docx', 'keyPdf': f'{code}_KEY.pdf', 'keyDocx': f'{code}_KEY.docx'}.items() if os.path.exists(os.path.join(here, out, f))}
    cases.append({'id': d, 'caseCode': code, 'title': meta['title'].replace('Clinical Care-Plan Case Study: ', ''), 'patient': p['patient']['name'], 'age': p['patient']['age'], 'sex': p['patient']['sex'],
                  'diagnosis': p['encounter']['diagnosis'], 'room': p['encounter'].get('room', ''), 'passPct': meta.get('passPct', 78),
                  'token': old.get(d) or secrets.token_hex(5), 'files': files})
json.dump({'cases': cases}, open(os.path.join(here, 'index.json'), 'w'), indent=1)
print(len(cases), 'case studies indexed')
