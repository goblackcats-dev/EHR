#!/usr/bin/env python3
"""Crops the raw Playwright captures (capture_shots.js) into the 2 small EHR screenshots used on front page 2 (figs/ehr_*.png).
Uses the element boxes saved in figs/raw_meta.json (CSS px; the captures are at 2x). Both are captured at Mon 0700."""
import json, os
from PIL import Image, ImageDraw
F = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'figs')
M = json.load(open(os.path.join(F, 'raw_meta.json')))
S = 2
def crop(name, x0, y0, x1, y1): return Image.open(os.path.join(F, name)).crop((int(x0 * S), int(y0 * S), int(x1 * S), int(y1 * S)))
def stack(parts):
    W = max(p.width for p in parts); H = sum(p.height for p in parts)
    out = Image.new('RGB', (W, H), 'white'); o = 0
    for p in parts: out.paste(p, (0, o)); o += p.height
    return out
def frame(im, w=3):
    d = ImageDraw.Draw(im); d.rectangle((0, 0, im.width - 1, im.height - 1), outline='#555555', width=w); return im

# 1. MAR at 0700: the insulin infusion (Running 5.5 units/h) and the 0.45% NaCl (0700 Due), columns 0700-0900
m = M['mar']; c = {k['t']: k for k in m['cells']}
x0, x1 = m['head']['x'], c['0900']['x'] + c['0900']['w'] + 2
parts = [crop('raw_mar.png', x0, m['head']['y'], x1, m['head']['y'] + m['head']['h'])]
for k in ('ins', 'half'):
    parts.append(crop('raw_mar.png', x0, m[k]['y'], x1, m[k]['y'] + m[k]['h']))
frame(stack(parts)).save(os.path.join(F, 'ehr_mar.png'))
# 2. Chart Review > Cardiology at 0700: the ED ECG record and its "View tracing" link
frame(crop('raw_ecg.png', 203, 282, 760, 495)).save(os.path.join(F, 'ehr_ecg.png'))
for f in ('ehr_mar', 'ehr_ecg'):
    print(f, Image.open(os.path.join(F, f + '.png')).size)
