#!/usr/bin/env python3
"""Sizes writing boxes (and table rows) so every student page is well used:  python3 autofit.py
Builds the student packet, measures the free space on each page, and adds lines to the last box (or taller rows to the last table) on pages with free space.
Saves layout.json (read by author.py). Run again after the content changes (delete layout.json first to start fresh)."""
import json, os, re, subprocess, glob, sys
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
SLACK = 0.5; LINE = 0.3
def build():
    subprocess.run(['python3', 'author.py', 'content.json'], check=True, stdout=subprocess.DEVNULL)
    subprocess.run(['python3', '../../build_casestudy.py', 'content.json', 'patient.json', 'out/'], check=True, stdout=subprocess.DEVNULL)
    subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', 'out', 'out/CS-BURN-ICU-1_STUDENT.docx'], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
def pages():
    pdf = 'out/CS-BURN-ICU-1_STUDENT.pdf'
    n = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout).group(1))
    d = '/tmp/autofit_pages'; os.makedirs(d, exist_ok=True)
    for f in glob.glob(d + '/*.png'): os.remove(f)
    subprocess.run(['pdftoppm', '-r', '40', '-png', pdf, d + '/p'], check=True)
    out = []
    for k in range(1, n + 1):
        im = Image.open(sorted(glob.glob(d + '/p-*.png'))[k - 1]).convert('L'); w, h = im.size; px = im.load(); footer = int(h - 0.75 * 40); last = 0
        for y in range(footer):
            if any(px[x, y] < 200 for x in range(0, w, 2)): last = y
        txt = subprocess.run(['pdftotext', '-f', str(k), '-l', str(k), '-layout', pdf, '-'], capture_output=True, text=True).stdout
        ids = re.findall(r'^\s*(\d+\.\d+b?)\s+\S.*\(\d+(?:\.\d+)? pts?\)', txt, re.M)
        out.append({'page': k, 'free': (footer - last) / 40, 'ids': ids})
    return out
def items():
    c = json.load(open('content.json')); return {i['id']: i for p in c['parts'] for i in p['items']}
lay = json.load(open('layout.json')) if os.path.exists('layout.json') else {}
for it in range(8):
    build(); pg = pages(); its = items(); changed = False
    print('iteration', it, [(p['page'], round(p['free'], 1)) for p in pg])
    for p in pg:
        if p['free'] < SLACK + 0.35 or not p['ids']: continue
        extra = p['free'] - SLACK
        for iid in reversed(p['ids']):
            o = its[iid]
            if o['type'] == 'box' and not o.get('noFlex'):
                add = int(extra / LINE)
                if add > 0: lay[iid] = {'lines': o.get('lines', 4) + add}; changed = True
                break
            if o['type'] == 'table':
                add = extra / max(o.get('rows', 1), 1)
                if add > 0.04: lay[iid] = {'rowH': round(o.get('rowH', 0.6) + add * 0.9, 2)}; changed = True
                break
    json.dump(lay, open('layout.json', 'w'), indent=1)
    if not changed: break
    # overflow guard: if the page count grew, back off the changes of this iteration by one line
build(); pg = pages(); print('final', len(pg), 'pages', [(p['page'], round(p['free'], 1)) for p in pg])
