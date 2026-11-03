"""One clean, black-and-white-friendly Mg trend strip (empty: students plot their own results)."""
import os
from style import *
import matplotlib.patches as mp
HERE = os.path.dirname(os.path.abspath(__file__))
fig, ax = plt.subplots(figsize=(7.3, 3.1), dpi=200)
bands = [(0, 1.7, '#FFFFFF', '', ''), (1.7, 2.2, '#FFFFFF', '', 'NORMAL 1.7-2.2'), (2.2, 5, '#F5F5F5', '', 'EARLY 2.3-5'), (5, 7, '#E6E6E6', '', 'FLUSHING 5-7'), (7, 10, '#D3D3D3', '', 'REFLEXES LOST 7-10'), (10, 12, '#BFBFBF', '', 'DANGER over 10')]
for lo, hi, fc, h, lab in bands:
    ax.axhspan(lo, hi, facecolor=fc, hatch=h, edgecolor='#777777', linewidth=0)
    if lab: ax.text(7.0 + 0.1, (lo + hi) / 2 if hi - lo > 1 else 2.2, lab, va='center', ha='left', fontsize=7.2, color=INK, fontweight='bold', clip_on=False)
ax.axhline(1.7, color='#444', lw=0.8); ax.axhline(2.2, color='#444', lw=0.8)
for y in range(0, 13): ax.axhline(y, color='#999', lw=0.35)
for x in range(0, 8): ax.axvline(x, color='#555', lw=0.8 if x in (0, 7) else 0.5)
ax.set_xlim(0, 7); ax.set_ylim(0, 12)
labels = ['Tue 0700', 'Tue 1100', 'Tue 1500', 'Tue 1900', 'Tue 2300', 'Wed 0300', 'Wed 0700']
ax.set_xticks([i + 0.5 for i in range(7)]); ax.set_xticklabels(labels, fontsize=8, color=INK, fontweight='bold')
ax.set_yticks(range(0, 13, 2)); ax.set_yticklabels([str(i) for i in range(0, 13, 2)], fontsize=8)
ax.set_ylabel('Magnesium (mg/dL)', fontsize=8.5, color=INK)
ax.tick_params(length=0)
for s in ax.spines.values(): s.set_visible(False)
fig.subplots_adjust(left=0.08, right=0.80, top=0.97, bottom=0.12)
fig.savefig(os.path.join(HERE, 'figs', 'mg_strip.png'))
