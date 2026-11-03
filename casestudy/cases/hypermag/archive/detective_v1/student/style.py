"""Shared colors and drawing helpers for the Ray Kessler case study packet figures.
Palette is chosen so every figure still reads in black and white: dark ink outlines, light fills, patterns and text labels (never color alone)."""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager

INK = '#1B2A41'      # dark navy: outlines and text
TEAL = '#1F7A8C'
AMBER = '#F2B84B'
RED = '#B23A48'
GREEN = '#3C8D5A'
PAPER = '#FFFDF7'
SKY = '#DCEBFA'
SAND = '#FFE9B8'
MINT = '#DDF0E1'
LAV = '#E9E4F5'
GRAY1 = '#F2F2F2'
GRAY2 = '#D9D9D9'
GRAY3 = '#9A9A9A'

for f in ('Carlito',):
    if any(f in x.name for x in font_manager.fontManager.ttflist):
        plt.rcParams['font.family'] = [f, 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False
plt.rcParams['hatch.linewidth'] = 0.6

# Mg zones (mg/dL): (low, high, label, short, fill, hatch)
ZONES = [
    (1.7, 2.2, 'NORMAL', '1.7-2.2', '#FFFFFF', ''),
    (2.2, 5.0, 'EARLY', '2.3-5: nausea, flushing, headache (often few signs)', '#EFEFEF', '...'),
    (5.0, 7.0, 'FLUSHING', '5-7: flushed, drowsy, low BP, weak reflexes', '#DADADA', '///'),
    (7.0, 10.0, 'REFLEXES LOST', '7-10: reflexes lost, very sleepy, slow HR, ECG changes', '#BDBDBD', 'xxx'),
    (10.0, 12.5, 'DANGER', 'Over 10: breathing slows, heart block (over 15: coma, arrest)', '#8C8C8C', '+++'),
]
