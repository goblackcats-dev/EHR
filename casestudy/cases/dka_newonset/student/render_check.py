#!/usr/bin/env python3
"""Renders the packet PDF to PNG pages (for looking at) and checks page tags:  python3 render_check.py [pdf] [outdir]
Prints, for each expected logical page, the PDF page where its tag text was found and flags overflow (a logical page that spans two PDF pages)."""
import sys, os, json, subprocess, re, glob
HERE = os.path.dirname(os.path.abspath(__file__))
pdf = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'out', 'CASE_STUDY_PACKET.pdf')
outdir = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'out', 'pages')
tags = json.load(open(os.path.join(HERE, 'out', 'page_tags.json')))
os.makedirs(outdir, exist_ok=True)
for f in glob.glob(outdir + '/*.png'): os.remove(f)
n = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout).group(1))
texts = [subprocess.run(['pdftotext', '-f', str(k), '-l', str(k), '-layout', pdf, '-'], capture_output=True, text=True).stdout for k in range(1, n + 1)]
found = []
for t in tags:
    pg = [k + 1 for k, x in enumerate(texts) if re.sub(r'\s+', ' ', t) in re.sub(r'\s+', ' ', x)]
    found.append(pg[0] if pg else None)
bad = 0
prev = 0
for t, pg in zip(tags, found):
    flag = ''
    if pg is None: flag = '  <-- TAG NOT FOUND'; bad += 1
    elif pg != prev + 1 and prev: flag = f'  <-- {pg - prev - 1} extra page(s) before this one (overflow of the page above)'; bad += 1
    print(f'{pg!s:>4}  {t}{flag}')
    if pg: prev = pg
print('PDF pages:', n, ' expected:', len(tags), ' problems:', bad)
subprocess.run(['pdftoppm', '-r', '70', '-png', pdf, outdir + '/p'], check=True)
# overflow size: content height on the PDF pages that start no logical page, and free space at the bottom of every page
from PIL import Image
fs = sorted(glob.glob(outdir + '/p-*.png'))
starts = set(p for p in found if p)
for k, f in enumerate(fs, 1):
    im = Image.open(f).convert('L'); w, h = im.size; px = im.load()
    top = int(0.8 * 70); bot = int(10.4 * 70); last = top; first = None
    for y in range(top, bot):
        if any(px[x, y] < 200 for x in range(0, w, 3)):
            last = y
            if first is None: first = y
    if k not in starts:
        print(f'   overflow page {k}: content height about {(last - top) / 70:.1f} in')
    else:
        print(f'   page {k}: free at bottom about {(bot - last) / 70:.1f} in')
