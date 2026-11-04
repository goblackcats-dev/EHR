#!/usr/bin/env python3
"""Crops the raw Playwright captures (capture_shots.js) into the small, legible EHR screenshots used in the packet (figs/ehr_*.png).
Uses the element boxes saved in figs/raw_meta.json (CSS px; the captures are at 2x)."""
import json, os
from PIL import Image, ImageDraw
F = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'figs')
M = json.load(open(os.path.join(F, 'raw_meta.json')))
S = 2
def crop(name, x0, y0, x1, y1): return Image.open(os.path.join(F, name)).crop((int(x0 * S), int(y0 * S), int(x1 * S), int(y1 * S)))
def stack(parts, gap=0, fill='white', horiz=False):
    W = sum(p.width for p in parts) + gap * (len(parts) - 1) if horiz else max(p.width for p in parts)
    H = max(p.height for p in parts) if horiz else sum(p.height for p in parts) + gap * (len(parts) - 1)
    out = Image.new('RGB', (W, H), fill); o = 0
    for p in parts:
        out.paste(p, (o, 0) if horiz else (0, o)); o += (p.width if horiz else p.height) + gap
    return out
def frame(im, w=3):
    d = ImageDraw.Draw(im); d.rectangle((0, 0, im.width - 1, im.height - 1), outline='#555555', width=w); return im

# 1. MAR at 0700: home fludrocortisone held (hatched), IV hydrocortisone 50 mg q6h with 1000 Due
m = M['mar']; c = {k['t']: k for k in m['cells']}
x0, x1 = m['head']['x'], c['1000']['x'] + c['1000']['w'] + 2
parts = [crop('raw_mar.png', x0, m['head']['y'], x1, m['head']['y'] + m['head']['h']),
         crop('raw_mar.png', x0, m['fludro']['y'], x1, m['fludro']['y'] + m['fludro']['h']),
         Image.new('RGB', (int((x1 - x0) * S), 10), '#BBBBBB'),
         crop('raw_mar.png', x0, m['hc']['y'], x1, m['hc']['y'] + m['hc']['h'])]
frame(stack(parts)).save(os.path.join(F, 'ehr_mar.png'))

# 2. Chart Review > Cardiology at 0700: the ED ECG record and its "View tracing" link
frame(stack([crop('raw_ecg.png', 203, 262, 760, 300), Image.new('RGB', (int(557 * S), 8), '#BBBBBB'), crop('raw_ecg.png', 203, 386, 760, 513)])).save(os.path.join(F, 'ehr_ecg.png'))

# 3. Lab Results at 1500: the Endocrine group (cortisol, ACTH) and the cortisol detail card
e = M['endo']; t = M['tree']; d = M['detail']
a = crop('raw_cortisol.png', t['x'], e['endo']['y'] - 8, t['x'] + t['w'], e['cardiac']['y'] - 4)
b = crop('raw_cortisol.png', d['x'], d['y'] - 70, d['x'] + d['w'], d['y'] + d['h'])
frame(stack([a, b], gap=14, horiz=True)).save(os.path.join(F, 'ehr_cortisol.png'))

# 3b. the same, tree only (Endocrine heading through the ACTH line): used beside the Results pair box at 1500
frame(crop('raw_cortisol.png', t['x'] + 4, e['endo']['y'] - 8, t['x'] + t['w'] - 4, e['endo']['y'] + 135)).save(os.path.join(F, 'ehr_cortisol_tree.png'))

# 4. Lab Results at 1900: Sodium detail card with its history / trend
im = Image.open(os.path.join(F, 'raw_sodium.png')).convert('RGB')   # keep the HISTORY / TREND column headings and rows (through the 1700 result)
frame(stack([im.crop((0, 450, im.width, 516)), im.crop((0, 588, im.width, 878))])).save(os.path.join(F, 'ehr_sodium.png'))   # headings + the Monday rows
for f in ('ehr_mar', 'ehr_ecg', 'ehr_cortisol', 'ehr_cortisol_tree', 'ehr_sodium'):
    im = Image.open(os.path.join(F, f + '.png')); print(f, im.size)
