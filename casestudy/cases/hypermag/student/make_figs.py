#!/usr/bin/env python3
"""Draws every picture in the student packet (no photos, no AI images): python3 make_figs.py
Output goes to figs/.  Everything is drawn with matplotlib so it prints sharply in color and in black and white."""
import os, math, json
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import (Circle, Ellipse, FancyBboxPatch, Polygon, Rectangle, Wedge, Arc, PathPatch, RegularPolygon, FancyArrowPatch)
from matplotlib.path import Path
from style import *

HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'figs'); os.makedirs(OUT, exist_ok=True)
DPI = 220


def save(fig, name, transparent=False):
    fig.savefig(os.path.join(OUT, name), dpi=DPI, transparent=transparent, facecolor='none' if transparent else 'white')
    plt.close(fig); print('wrote', name)


def blank(w, h, lim=None):
    fig = plt.figure(figsize=(w, h)); ax = fig.add_axes([0, 0, 1, 1]); ax.set_axis_off()
    ax.set_xlim(0, lim[0] if lim else w); ax.set_ylim(0, lim[1] if lim else h); ax.set_aspect('equal')
    return fig, ax


# ------------------------------------------------------------------ icons (square, transparent)
def icon_detective():
    fig, ax = blank(1, 1, (10, 10))
    ax.add_patch(Circle((4.2, 5.8), 3.0, fc='white', ec=INK, lw=4))
    ax.add_patch(Circle((4.2, 5.8), 2.2, fc=SKY, ec=INK, lw=1.5))
    ax.plot([6.4, 8.9], [3.6, 1.1], color=INK, lw=9, solid_capstyle='round')
    ax.text(4.2, 5.8, 'Mg', ha='center', va='center', fontsize=17, fontweight='bold', color=INK)
    save(fig, 'icon_detective.png', True)


def icon_lab():
    fig, ax = blank(1, 1, (10, 10))
    ax.add_patch(Polygon([(4, 9), (6, 9), (6, 6), (8.6, 1.6), (1.4, 1.6), (4, 6)], closed=True, fc='white', ec=INK, lw=4, joinstyle='round'))
    ax.add_patch(Polygon([(3.0, 4.2), (7.0, 4.2), (8.2, 2.1), (1.8, 2.1)], closed=True, fc=TEAL, ec=INK, lw=1.2, hatch='///'))
    for (x, y, r) in [(4.3, 3.2, .35), (5.6, 2.9, .25), (5.0, 4.9, .3)]:
        ax.add_patch(Circle((x, y), r, fc='white', ec=INK, lw=1.2))
    ax.plot([3.6, 6.4], [9.1, 9.1], color=INK, lw=5, solid_capstyle='round')
    save(fig, 'icon_lab.png', True)


def icon_nurse():
    fig, ax = blank(1, 1, (10, 10))
    # stethoscope
    ax.add_patch(Arc((5, 6.2), 5.6, 6.0, theta1=180, theta2=360, color=INK, lw=5))
    ax.plot([2.2, 2.2], [6.2, 8.8], color=INK, lw=5, solid_capstyle='round'); ax.plot([7.8, 7.8], [6.2, 8.8], color=INK, lw=5, solid_capstyle='round')
    ax.add_patch(Circle((2.2, 9.0), .55, fc=GRAY2, ec=INK, lw=2)); ax.add_patch(Circle((7.8, 9.0), .55, fc=GRAY2, ec=INK, lw=2))
    ax.plot([5, 5], [3.2, 2.2], color=INK, lw=5)
    ax.add_patch(Arc((6.8, 2.2), 3.6, 3.6, theta1=180, theta2=360, color=INK, lw=5))
    ax.add_patch(Circle((8.6, 2.2), 1.2, fc=SAND, ec=INK, lw=3.5))
    save(fig, 'icon_nurse.png', True)


def icon_team():
    fig, ax = blank(1, 1, (10, 10))
    for (x, y, s, fc) in [(2.4, 4, .8, GRAY2), (7.6, 4, .8, GRAY2), (5, 4.6, 1.0, SAND)]:
        ax.add_patch(Circle((x, y + 2.4 * s), 1.15 * s, fc=fc, ec=INK, lw=3))
        ax.add_patch(Wedge((x, y - 0.1 * s), 2.1 * s, 0, 180, fc=fc, ec=INK, lw=3))
    save(fig, 'icon_team.png', True)


def icon_key():
    fig, ax = blank(1, 1, (10, 10))
    ax.add_patch(Circle((3.2, 6.8), 2.1, fc=AMBER, ec=INK, lw=4)); ax.add_patch(Circle((3.2, 6.8), .8, fc='white', ec=INK, lw=3))
    ax.plot([4.8, 9], [5.4, 1.2], color=INK, lw=9, solid_capstyle='round')
    ax.plot([7.3, 8.5], [3.0, 4.1], color=INK, lw=6, solid_capstyle='round'); ax.plot([8.2, 9.2], [2.1, 3.0], color=INK, lw=6, solid_capstyle='round')
    save(fig, 'icon_key.png', True)


def icon_stop():
    fig, ax = blank(1, 1, (10, 10))
    ax.add_patch(RegularPolygon((5, 5), 8, radius=4.6, orientation=math.pi / 8, fc=RED, ec=INK, lw=4))
    ax.text(5, 5, 'STOP', ha='center', va='center', color='white', fontsize=19, fontweight='bold')
    save(fig, 'icon_stop.png', True)


def icon_clock():
    fig, ax = blank(1, 1, (10, 10))
    ax.add_patch(Circle((5, 5), 4.3, fc='white', ec=INK, lw=4))
    for k in range(12):
        a = math.radians(k * 30); ax.plot([5 + 3.6 * math.sin(a), 5 + 4.0 * math.sin(a)], [5 + 3.6 * math.cos(a), 5 + 4.0 * math.cos(a)], color=INK, lw=2)
    ax.plot([5, 5], [5, 8.3], color=INK, lw=4, solid_capstyle='round'); ax.plot([5, 7.3], [5, 3.8], color=INK, lw=4, solid_capstyle='round')
    save(fig, 'icon_clock.png', True)


def icon_star():
    fig, ax = blank(1, 1, (10, 10))
    pts = []
    for k in range(10):
        r = 4.6 if k % 2 == 0 else 1.9; a = math.radians(90 + k * 36); pts.append((5 + r * math.cos(a), 5 + r * math.sin(a)))
    ax.add_patch(Polygon(pts, closed=True, fc=AMBER, ec=INK, lw=3, joinstyle='round'))
    save(fig, 'icon_star.png', True)


def logo():
    fig, ax = blank(2, 2, (20, 20))
    ax.add_patch(Circle((10, 10), 9.4, fc=INK, ec=INK))
    ax.add_patch(Circle((10, 10), 8.2, fc='none', ec='white', lw=2, ls=(0, (3, 2))))
    ax.add_patch(Circle((8.6, 11.2), 4.7, fc='white', ec=AMBER, lw=6))
    ax.plot([12.0, 15.8], [7.8, 4.0], color=AMBER, lw=11, solid_capstyle='round')
    ax.text(8.6, 11.2, 'Mg', ha='center', va='center', fontsize=40, fontweight='bold', color=INK)
    ax.text(10, 3.3, 'RAPID RESPONSE', ha='center', va='center', fontsize=7.6, fontweight='bold', color='white')
    ax.text(10, 16.9, 'DETECTIVE SQUAD', ha='center', va='center', fontsize=7.6, fontweight='bold', color='white')
    save(fig, 'logo.png', True)


# ------------------------------------------------------------------ timeline banner (day / night)
def banner(name, labels=('0700', '1100', '1500', '1900', '2300', '0300', '0700'), w=7.3, h=1.05):
    fig = plt.figure(figsize=(w, h)); ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 100); ax.set_ylim(0, 14.4); ax.set_axis_off()
    ax.add_patch(Rectangle((0.6, 2.2), 49.4, 9.3, fc=SAND, ec=INK, lw=1.6))
    ax.add_patch(Rectangle((50.0, 2.2), 49.4, 9.3, fc=INK, ec=INK, lw=1.6))
    xs = np.linspace(6.2, 93.8, 7)
    for i, (x, lab) in enumerate(zip(xs, labels)):
        night = x > 50
        ax.add_patch(Circle((x, 6.85), 3.9, fc='white', ec=INK if not night else 'white', lw=2))
        ax.text(x, 6.85, lab, ha='center', va='center', fontsize=10, fontweight='bold', color=INK)
        if i < 6:
            ax.add_patch(FancyArrowPatch((x + 4.3, 6.85), (xs[i + 1] - 4.3, 6.85), arrowstyle='-|>', mutation_scale=9, color='white' if xs[i + 1] > 50 else INK, lw=1.5))
    ax.text(25, 12.9, 'DAY SHIFT  (Tuesday)', ha='center', va='center', fontsize=8.5, fontweight='bold', color=INK)
    ax.text(75, 12.9, 'NIGHT SHIFT  (Tuesday night to Wednesday)', ha='center', va='center', fontsize=8.5, fontweight='bold', color=INK)
    ax.text(25, 0.95, 'each stop = 4 hours of patient time', ha='center', va='center', fontsize=7.5, color=INK, style='italic')
    ax.text(75, 0.95, '(the instructor presses the 4h button)', ha='center', va='center', fontsize=7.5, color=INK, style='italic')
    save(fig, name)


# ------------------------------------------------------------------ portrait of Ray (flat illustration)
def portrait():
    fig, ax = blank(2.5, 3.0, (25, 30))
    ax.add_patch(Rectangle((0, 0), 25, 30, fc=SKY, ec='none'))
    ax.add_patch(Circle((12.5, 17), 11.5, fc='#EAF3FC', ec='none'))
    # gown / shoulders
    ax.add_patch(Wedge((12.5, 1.0), 10.8, 0, 180, fc='#CFE0F2', ec=INK, lw=2.2))
    for (x, y) in [(6.5, 5.5), (9.5, 7.4), (15.5, 7.4), (18.5, 5.5), (12.5, 3.3), (8, 2.2), (17, 2.2), (5, 3.0), (20, 3.0)]:
        ax.add_patch(Circle((x, y), .35, fc=INK, ec='none'))
    ax.plot([12.5, 12.5], [11.4, 4.0], color=INK, lw=1.2)
    # collar V
    ax.add_patch(Polygon([(9.3, 11.3), (12.5, 8.0), (15.7, 11.3)], closed=True, fc='#F1C9A8', ec=INK, lw=1.8))
    # neck
    ax.add_patch(Rectangle((10.3, 11.2), 4.4, 2.9, fc='#F1C9A8', ec=INK, lw=1.8)); ax.add_patch(Ellipse((12.5, 11.6), 4.4, 1.4, fc='#F1C9A8', ec='none'))
    ax.plot([10.3, 10.3], [11.3, 14.1], color=INK, lw=1.8); ax.plot([14.7, 14.7], [11.3, 14.1], color=INK, lw=1.8)
    # ears
    for x in (7.2, 17.8):
        ax.add_patch(Ellipse((x, 17.4), 1.6, 3.0, fc='#EDB993', ec=INK, lw=1.8))
    # head
    ax.add_patch(Ellipse((12.5, 18.2), 10.0, 12.2, fc='#F1C9A8', ec=INK, lw=2.2))
    # hair: gray horseshoe band (thick at the temples, thin on top: receding)
    cx, cy = 12.5, 18.2
    outer, inner = [], []
    for th in np.linspace(196, -16, 60):
        r = math.radians(th)
        outer.append((cx + 5.45 * math.cos(r), cy + 6.75 * math.sin(r)))
    for th in np.linspace(-16, 196, 60):
        r = math.radians(th)
        side = abs(math.cos(r))
        thick = 0.55 + 1.7 * (side ** 2)
        inner.append((cx + (5.45 - thick) * math.cos(r), cy + (6.75 - thick * 0.9) * math.sin(r)))
    ax.add_patch(Polygon(outer + inner, closed=True, fc='#C9CDD3', ec=INK, lw=1.5))
    # brows
    ax.plot([9.0, 11.2], [21.0, 21.3], color='#6B6F78', lw=2.6, solid_capstyle='round'); ax.plot([13.8, 16.0], [21.3, 21.0], color='#6B6F78', lw=2.6, solid_capstyle='round')
    # glasses
    for x in (10.1, 14.9):
        ax.add_patch(Circle((x, 19.4), 1.75, fc='white', ec=INK, lw=1.8, alpha=.55))
        ax.add_patch(Circle((x, 19.4), .52, fc=INK, ec='none'))
    ax.plot([11.85, 13.15], [19.6, 19.6], color=INK, lw=1.6); ax.plot([8.35, 7.4], [19.7, 19.8], color=INK, lw=1.4); ax.plot([16.65, 17.6], [19.7, 19.8], color=INK, lw=1.4)
    # nose, mustache, mouth (tired, gentle)
    ax.plot([12.5, 12.1, 12.9], [18.6, 16.6, 16.5], color='#A87A5A', lw=1.5)
    ax.add_patch(Polygon([(10.0, 15.9), (12.5, 16.5), (15.0, 15.9), (13.9, 15.2), (12.5, 15.6), (11.1, 15.2)], closed=True, fc='#B8BCC4', ec=INK, lw=1.2))
    ax.plot([11.2, 12.5, 13.8], [14.0, 13.75, 14.0], color=INK, lw=1.4)
    # wristband tag at the bottom of frame (ID badge)
    ax.add_patch(FancyBboxPatch((3.0, 0.5), 19, 2.4, boxstyle='round,pad=0.1,rounding_size=0.6', fc='white', ec=INK, lw=1.6))
    ax.text(12.5, 1.7, 'KESSLER, RAYMOND   74 y/o   DOB 04/22/1952', ha='center', va='center', fontsize=5.6, fontweight='bold', color=INK)
    ax.add_patch(Rectangle((0.2, 0.2), 24.6, 29.6, fc='none', ec=INK, lw=2.6))
    save(fig, 'portrait.png')


# ------------------------------------------------------------------ Mg-o-meter: vertical gauge (reference card) + trend charts
def mg_gauge():
    fig = plt.figure(figsize=(3.3, 5.4)); ax = fig.add_axes([0.13, 0.03, 0.20, 0.94])
    ax.set_xlim(0, 1); ax.set_ylim(0, 12.5)
    for (lo, hi, name, desc, fc, h) in ZONES:
        ax.add_patch(Rectangle((0, lo), 1, hi - lo, fc=fc, ec=INK, lw=1.4, hatch=h))
    ax.set_xticks([]); ax.set_yticks(range(0, 13, 1)); ax.tick_params(axis='y', labelsize=8.5)
    ax.set_ylabel('magnesium, mg/dL', fontsize=8.5, color=INK)
    for s in ax.spines.values(): s.set_color(INK); s.set_linewidth(1.6)
    labels = [(1.2, 'NORMAL 1.7-2.2', '(below 1.7 = low)'), (3.6, 'EARLY 2.3-5', 'nausea, flushing, headache,\noften few signs'),
              (6.0, 'FLUSHING 5-7', 'flushed, drowsy, low BP,\nweak reflexes'), (8.5, 'REFLEXES LOST 7-10', 'very sleepy, slow heart rate,\nlong PR, wide QRS'),
              (11.2, 'DANGER over 10', 'breathing slows, heart block\n(over 15: coma, arrest)')]
    for (y, t, d) in labels:
        ax.plot([1.0, 1.18], [y, y], color=INK, lw=1.2, clip_on=False)
        ax.text(1.24, y + 0.12, t, fontsize=8.6, fontweight='bold', color=INK, va='bottom', clip_on=False)
        ax.text(1.24, y - 0.08, d, fontsize=7.6, color=INK, va='top', clip_on=False, linespacing=1.05)
    save(fig, 'mg_gauge.png')


# Mg lab draws in order of the chart (collected times); values come from the patient file so the figures cannot disagree with it
def mg_slots():
    c = json.load(open(os.path.join(HERE, '..', 'patient.json')))['canonical']
    out = []
    for o in sorted([o for o in c['observations'] if o['type'] == 'lab' and o['label'] == 'Magnesium'], key=lambda o: o['collected']):
        out.append((o['collected'], float(o['value'])))
    return out


SLOT_LABEL = {'2026-10-20 08:30': 'Oct 20\nclinic', '2026-11-17 04:40': 'Tue\n0440', '2026-11-17 09:00': 'Tue\n0900', '2026-11-17 11:15': 'Tue\n1115', '2026-11-17 13:15': 'Tue\n1315',
              '2026-11-17 17:00': 'Tue\n1700', '2026-11-17 18:00': 'Tue\n1800', '2026-11-17 21:00': 'Tue\n2100', '2026-11-18 01:00': 'Wed\n0100', '2026-11-18 05:00': 'Wed\n0500'}


def mg_chart(name, upto, new_from, prefill=True, title=None, w=7.3, h=2.5):
    """Trend chart with the five zone bands. Slots are the lab draws up to index `upto` (inclusive). Slots before `new_from` show a printed dot
    (carried from the earlier page); slots from `new_from` on are blank columns for the team to mark with an X."""
    slots = mg_slots()[:upto + 1]
    fig = plt.figure(figsize=(w, h)); ax = fig.add_axes([0.065, 0.2, 0.58, 0.74])
    n = max(len(slots), 3)
    ax.set_xlim(-0.6, n - 0.4); ax.set_ylim(0, 12.5)
    for (lo, hi, nm, desc, fc, hat) in ZONES:
        ax.add_patch(Rectangle((-0.6, lo), n + 0.2, hi - lo, fc=fc, ec='none', hatch=hat, zorder=0))
        ax.plot([-0.6, n - 0.4], [lo, lo], color=INK, lw=0.9, zorder=1)
    ax.set_yticks(range(0, 13, 1)); ax.set_yticks([x + .5 for x in range(0, 12)], minor=True)
    ax.grid(axis='y', color=INK, alpha=.18, lw=.6, which='both'); ax.tick_params(axis='y', labelsize=8)
    ax.set_xticks(range(len(slots)))
    ax.set_xticklabels([SLOT_LABEL[s[0]] for s in slots], fontsize=7.6)
    ax.set_ylabel('Mg (mg/dL)', fontsize=8.5)
    for s in ax.spines.values(): s.set_color(INK); s.set_linewidth(1.5)
    xs, ys = [], []
    for i, (t, v) in enumerate(slots):
        if i < new_from and prefill:
            ax.plot(i, v, 'o', ms=8.5, mfc=INK, mec='white', mew=1.2, zorder=5)
            ax.text(i, v + 0.72, f'{v:g}', ha='center', fontsize=8.2, fontweight='bold', color=INK, zorder=6, bbox=dict(boxstyle='round,pad=0.12', fc='white', ec='none', alpha=.85))
            xs.append(i); ys.append(v)
        elif i >= new_from:
            if prefill:
                ax.add_patch(Rectangle((i - 0.38, 0.1), 0.76, 12.3, fc='none', ec=INK, lw=1.4, ls=(0, (4, 3)), zorder=4))
                ax.text(i, 12.05, 'NEW', ha='center', va='center', fontsize=8.2, fontweight='bold', color='white', bbox=dict(boxstyle='round,pad=0.2', fc=INK, ec=INK), zorder=7)
            else:
                ax.plot([i, i], [0, 12.5], color=INK, lw=0.8, ls=(0, (3, 3)), zorder=3)
    if len(xs) > 1: ax.plot(xs, ys, '-', color=INK, lw=1.2, alpha=.6, zorder=4)
    # right-side zone labels (axes coordinates, outside the plot)
    lab = [(1.2, 'NORMAL 1.7-2.2', '(below 1.7 = low)'), (3.6, 'EARLY 2.3-5', 'nausea, flushing,\nheadache (few signs)'),
           (6.0, 'FLUSHING 5-7', 'flushed, drowsy, low BP,\nweak reflexes'), (8.5, 'REFLEXES LOST 7-10', 'reflexes lost, very sleepy,\nslow HR, ECG changes'),
           (11.2, 'DANGER over 10', 'breathing slows, heart block\n(over 15: coma, arrest)')]
    for (y, t, d) in lab:
        ax.plot([n - 0.4, n - 0.4 + 0.12], [y, y], color=INK, lw=1.2, clip_on=False)
        ax.text(n - 0.4 + 0.16, y + 0.1, t, fontsize=8.4, fontweight='bold', color=INK, va='bottom', clip_on=False)
        ax.text(n - 0.4 + 0.16, y - 0.05, d, fontsize=7.0, color=INK, va='top', clip_on=False, linespacing=1.05)
    if title: fig.text(0.065, 0.975, title, fontsize=9, fontweight='bold', va='top', color=INK)
    fig.text(0.065, 0.01, 'Mark an X at each level, then write its zone below.' if not prefill else 'Mark an X at the new level, then write its zone below. Bands overlap a little in real life: trust your exam as much as the number.', fontsize=6.9, style='italic', color=INK, va='bottom')
    save(fig, name)


# ------------------------------------------------------------------ ECG strips
def ecg_beat(t, pr=0.16, qrs=0.08, tamp=0.3, rr=0.85, st=0.1, amp=1.0, wide=False):
    """one beat as a sum of gaussians on a time axis t (seconds) starting at P onset"""
    y = np.zeros_like(t)
    p_c = 0.05; y += 0.18 * np.exp(-((t - p_c) / 0.022) ** 2)
    q_on = pr  # PR measured from P onset to QRS onset
    qc = q_on + qrs / 2
    sig = qrs / 5.0
    y += -0.12 * np.exp(-((t - (q_on + qrs * .15)) / (sig * .8)) ** 2)
    y += 1.0 * amp * np.exp(-((t - qc) / sig) ** 2)
    y += -0.2 * np.exp(-((t - (q_on + qrs * .88)) / (sig * .9)) ** 2)
    tc = q_on + qrs + st + 0.1
    y += tamp * np.exp(-((t - tc) / 0.05) ** 2)
    return y


def ecg_strip(ax, pr, qrs, tamp, rr, beats=4, label='', hr=None):
    fs = 500; total = rr * beats
    t = np.arange(0, total, 1 / fs); y = np.zeros_like(t)
    for b in range(beats):
        tb = t - b * rr
        m = (tb >= -0.05) & (tb < rr)
        y[m] += ecg_beat(tb[m], pr=pr, qrs=qrs, tamp=tamp, rr=rr)
    ax.plot(t, y, color=INK, lw=1.5)
    # 5 mm grid: big boxes 0.2 s
    ax.set_xticks(np.arange(0, total + 0.01, 0.2)); ax.set_yticks(np.arange(-0.5, 1.6, 0.25))
    ax.grid(True, color=RED, alpha=.28, lw=.5); ax.set_xticklabels([]); ax.set_yticklabels([]); ax.tick_params(length=0)
    ax.set_xlim(0, total); ax.set_ylim(-0.45, 1.5)
    for s in ax.spines.values(): s.set_color(INK); s.set_linewidth(1.2)
    # PR bracket on the 2nd beat
    b0 = rr
    ax.annotate('', xy=(b0 + 0.0, 1.18), xytext=(b0 + pr, 1.18), arrowprops=dict(arrowstyle='|-|', color=INK, lw=1.1, mutation_scale=3))
    ax.text(b0 + pr / 2, 1.26, f'PR {int(pr*1000)} ms', ha='center', va='bottom', fontsize=7.3, color=INK, fontweight='bold')
    ax.annotate('', xy=(b0 + pr, -0.36), xytext=(b0 + pr + qrs, -0.36), arrowprops=dict(arrowstyle='|-|', color=INK, lw=1.1, mutation_scale=3))
    ax.text(b0 + pr + qrs + 0.05, -0.36, f'QRS {int(qrs*1000)} ms', ha='left', va='center', fontsize=7.3, color=INK, fontweight='bold')


def ecg_fig():
    fig, axs = plt.subplots(3, 1, figsize=(7.3, 5.0))
    specs = [('A', 'Normal: PR about 160 ms, QRS under 120 ms, small rounded T', dict(pr=0.16, qrs=0.08, tamp=0.28, rr=0.85)),
             ('B', 'Long PR (first-degree AV block): PR over 200 ms; the signal is slowed between the atria and ventricles', dict(pr=0.26, qrs=0.09, tamp=0.30, rr=1.1)),
             ('C', 'Wide QRS (over 120 ms) with tall, peaked T waves; slow rate; the electrical signal is struggling to spread', dict(pr=0.30, qrs=0.15, tamp=0.95, rr=1.45))]
    for ax, (k, txt, kw) in zip(axs, specs):
        ecg_strip(ax, beats=4 if kw['rr'] < 1.2 else 3, **kw)
        ax.set_title(f'{k}.  {txt}', loc='left', fontsize=8.6, fontweight='bold', color=INK, pad=3)
    fig.text(0.995, 0.005, 'Teaching examples (not Ray\'s own strips). Each large red box = 0.2 second.', fontsize=6.8, style='italic', ha='right', va='bottom', color=INK)
    fig.tight_layout(rect=[0, 0.02, 1, 1], h_pad=1.0)
    save(fig, 'ecg_decoder.png')


# ------------------------------------------------------------------ reflex scale 0-4+
def reflex_scale():
    fig = plt.figure(figsize=(7.3, 1.95)); ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 73); ax.set_ylim(0, 19.5); ax.set_axis_off()
    items = [('0', 'No response', 0, 'absent'), ('1+', 'Weak, diminished', 14, ''), ('2+', 'Normal', 32, ''), ('3+', 'Brisk', 48, ''), ('4+', 'Clonus (beats)', 64, 'cl')]
    for k, (g, name, ang, tag) in enumerate(items):
        x0 = 1 + k * 14.4
        ax.add_patch(FancyBboxPatch((x0, 1.0), 13.2, 17.4, boxstyle='round,pad=0.0,rounding_size=1.0', fc='white' if g != '0' else '#E8E8E8', ec=INK, lw=1.6))
        ax.text(x0 + 6.6, 16.2, g, ha='center', va='center', fontsize=17, fontweight='bold', color=INK)
        # leg: knee at (x0+3.3, 10.5) thigh to left; lower leg hangs down and kicks forward (to the right) by `ang`
        kx, ky = x0 + 3.6, 11.0
        ax.plot([x0 + 1.0, kx], [11.4, ky], color=INK, lw=6, solid_capstyle='round')
        a = math.radians(ang)
        L = 6.0
        fx, fy = kx + L * math.sin(a), ky - L * math.cos(a)
        ax.plot([kx, fx], [ky, fy], color=INK, lw=5, solid_capstyle='round')
        ax.add_patch(Polygon([(fx - 0.2, fy), (fx + 2.6, fy - 0.2 if True else fy), (fx + 2.6, fy - 1.0), (fx - 0.4, fy - 1.0)], closed=True, fc=GRAY2, ec=INK, lw=1.2))
        if ang:
            ax.add_patch(Arc((kx, ky), 6.0, 6.0, theta1=270, theta2=270 + ang, color=GRAY3, lw=1.2, ls=(0, (2, 1))))
        if g == '4+':
            for dx in (1.6, 3.2):
                ax.add_patch(Arc((kx, ky), 6 + dx, 6 + dx, theta1=270 + 24, theta2=270 + 48, color=INK, lw=1.2))
            ax.text(x0 + 6.8, 6.0, '~ ~ ~', ha='center', va='center', fontsize=9, color=INK)
        ax.text(x0 + 6.6, 2.4, name, ha='center', va='center', fontsize=7.4, color=INK, fontweight='bold')
    save(fig, 'reflex_scale.png')


# ------------------------------------------------------------------ evidence bag with labeled bottles
def bottle(ax, x, y, w, h, kind, title, sub, tag, tint):
    if kind == 'tall':
        ax.add_patch(FancyBboxPatch((x, y), w, h * .74, boxstyle='round,pad=0,rounding_size=0.8', fc=tint, ec=INK, lw=1.8))
        ax.add_patch(Polygon([(x + w * .22, y + h * .74), (x + w * .78, y + h * .74), (x + w * .66, y + h * .88), (x + w * .34, y + h * .88)], closed=True, fc=tint, ec=INK, lw=1.6))
        ax.add_patch(Rectangle((x + w * .3, y + h * .88), w * .4, h * .1, fc=INK, ec=INK))
    else:
        ax.add_patch(FancyBboxPatch((x, y), w, h * .70, boxstyle='round,pad=0,rounding_size=0.8', fc=tint, ec=INK, lw=1.8))
        ax.add_patch(Rectangle((x + w * .02, y + h * .70), w * .96, h * .17, fc=AMBER, ec=INK, lw=1.6))
        for k in range(1, 8):
            ax.plot([x + w * (.02 + .96 * k / 8)] * 2, [y + h * .71, y + h * .86], color=INK, lw=0.7, alpha=.6)
    ax.add_patch(Rectangle((x + w * .08, y + h * .10), w * .84, h * .46, fc='white', ec=INK, lw=1.2))
    ax.text(x + w / 2, y + h * .43, title, ha='center', va='center', fontsize=6.0, fontweight='bold', color=INK, linespacing=0.95)
    ax.text(x + w / 2, y + h * .22, sub, ha='center', va='center', fontsize=4.6, color=INK, linespacing=0.95)
    ax.add_patch(Circle((x + w * .5, y - 1.4), 1.05, fc=AMBER, ec=INK, lw=1.4)); ax.text(x + w * .5, y - 1.4, str(tag), ha='center', va='center', fontsize=9, fontweight='bold', color=INK)


def bag():
    fig, ax = blank(4.6, 3.55, (46, 35.5))
    ax.add_patch(Rectangle((0, 0), 46, 35.5, fc='#F6F1E7', ec='none'))
    ax.add_patch(Rectangle((0.3, 0.3), 45.4, 34.9, fc='none', ec=INK, lw=2.4))
    # bottle tops poking out of the paper bag
    for (x, c) in [(4.0, INK), (7.8, INK), (11.2, INK)]:
        ax.add_patch(Rectangle((x, 27.5), 2.2, 4.6, fc=c, ec=INK, lw=1.4))
    # paper bag: front, side gusset, folded top
    ax.add_patch(Polygon([(1.5, 3.0), (15.0, 3.0), (15.0, 28.0), (1.5, 28.0)], closed=True, fc='#CDA77B', ec=INK, lw=2))
    ax.add_patch(Polygon([(15.0, 3.0), (17.8, 5.2), (17.8, 30.0), (15.0, 28.0)], closed=True, fc='#B88E60', ec=INK, lw=2))
    ax.add_patch(Polygon([(1.5, 28.0), (15.0, 28.0), (17.8, 30.0), (4.3, 30.0)], closed=True, fc='#DDBB92', ec=INK, lw=1.6))
    ax.plot([1.5, 15.0], [24.5, 24.5], color=INK, lw=0.8, alpha=.5)
    ax.text(8.2, 15.0, 'FROM\nHOME', ha='center', va='center', fontsize=8.2, fontweight='bold', color=INK)
    ax.text(8.2, 8.6, "(Eleanor's bag)", ha='center', va='center', fontsize=5.4, color=INK, style='italic')
    specs = [('tall', 'MILK OF\nMAGNESIA', 'Magnesium\nhydroxide', '#E3EEF9'), ('tall', 'ANTACID\n(Maalox type)', 'Aluminum +\nmagnesium\nhydroxide', '#F3E3F3'),
             ('pill', 'MAGNESIUM\nOXIDE 400 mg', 'Mineral\nsupplement\ntablets', '#FFF2C9'),
             ('pill', 'IBUPROFEN\n200 mg', 'Pain\nreliever\n(NSAID)', '#F9E1D6'), ('pill', 'LISINOPRIL\n20 mg', 'Rx tablets\nKessler,\nRaymond', '#E4F2E8'), ('pill', 'FUROSEMIDE\n20 mg', 'Rx "water\npill"\nKessler,\nRaymond', '#E4F2E8')]
    xs = [19.5, 28.3, 37.1]
    for k, (kind, t, s_, tint) in enumerate(specs):
        row, col = divmod(k, 3)
        bottle(ax, xs[col], 20.0 if row == 0 else 4.5, 8.0, 11.0, kind, t, s_, k + 1, tint)
    save(fig, 'evidence_bag.png')


# ------------------------------------------------------------------ kidney / dialysis diagram (numbered blanks)
def dialysis():
    fig, ax = blank(7.3, 3.5, (73, 35))
    ax.add_patch(Rectangle((0, 0), 73, 35, fc='white', ec='none'))
    # Ray
    ax.add_patch(FancyBboxPatch((1.5, 8), 12, 21, boxstyle='round,pad=0,rounding_size=2', fc=SKY, ec=INK, lw=1.8))
    ax.text(7.5, 26.4, 'RAY', ha='center', fontsize=9, fontweight='bold', color=INK)
    for (x, y) in [(5.0, 15), (10.0, 15)]:
        ax.add_patch(Ellipse((x, y), 2.8, 4.4, fc=GRAY2, ec=INK, lw=1.4, hatch='///'))
    ax.text(7.5, 10.6, 'failing kidneys\ncannot clear Mg', ha='center', va='center', fontsize=5.6, color=INK)
    # blood out (top lane) -> pump -> dialyzer top lane
    ax.plot([13.5, 25.6], [26.5, 26.5], color=RED, lw=3)
    ax.add_patch(Circle((28, 26.5), 2.4, fc='white', ec=INK, lw=2)); ax.text(28, 26.5, '1', ha='center', va='center', fontsize=11, fontweight='bold')
    ax.annotate('', xy=(36, 26.5), xytext=(30.4, 26.5), arrowprops=dict(arrowstyle='-|>', color=RED, lw=3))
    ax.text(20, 29.0, 'blood leaves Ray', ha='center', va='center', fontsize=6.4, color=RED, fontweight='bold')
    # dialyzer
    ax.add_patch(FancyBboxPatch((36, 14), 22, 18, boxstyle='round,pad=0,rounding_size=2.5', fc='#FAFAFA', ec=INK, lw=2))
    ax.plot([36, 58], [23, 23], color=INK, lw=1.4, ls=(0, (3, 2)))
    ax.text(47, 28.6, 'blood side', ha='center', va='center', fontsize=6.8, color=RED, fontweight='bold')
    ax.text(47, 16.0, 'dialysate side', ha='center', va='center', fontsize=6.8, color=INK, fontweight='bold')
    for x in (41, 47, 53):
        ax.annotate('', xy=(x, 21.0), xytext=(x, 25.6), arrowprops=dict(arrowstyle='-|>', color=INK, lw=1.4))
    ax.text(47, 18.9, 'Mg, K, urea cross the filter', ha='center', va='center', fontsize=5.6, color=INK)
    ax.add_patch(Circle((58, 23), 2.3, fc='white', ec=INK, lw=2)); ax.text(58, 23, '2', ha='center', va='center', fontsize=11, fontweight='bold')
    # blood returns over the top
    ax.plot([58, 60.5, 60.5, 7.5, 7.5], [27.5, 27.5, 33.6, 33.6, 29.0], color=INK, lw=3, solid_joinstyle='round')
    ax.annotate('', xy=(7.5, 29.2), xytext=(7.5, 32.0), arrowprops=dict(arrowstyle='-|>', color=INK, lw=3))
    ax.add_patch(Circle((34.5, 33.6), 1.5, fc='white', ec=INK, lw=2)); ax.text(34.5, 33.6, '4', ha='center', va='center', fontsize=9.5, fontweight='bold')
    ax.text(47, 33.7, 'cleaned blood returns to Ray', ha='center', va='center', fontsize=6.2, color=INK, bbox=dict(fc='white', ec='none', pad=1))
    # fresh bath in (right), used bath out (bottom)
    ax.add_patch(FancyBboxPatch((61.5, 7), 10, 9.5, boxstyle='round,pad=0,rounding_size=1.4', fc='#E9F5EA', ec=INK, lw=1.8))
    ax.text(66.5, 12.5, 'fresh bath\n(LOW Mg)', ha='center', va='center', fontsize=6.4, fontweight='bold')
    ax.add_patch(Circle((66.5, 4.0), 2.0, fc='white', ec=INK, lw=2)); ax.text(66.5, 4.0, '3', ha='center', va='center', fontsize=10, fontweight='bold')
    ax.annotate('', xy=(58, 18.5), xytext=(64.0, 16.6), arrowprops=dict(arrowstyle='-|>', color=INK, lw=1.8))
    ax.add_patch(FancyBboxPatch((36, 2), 22, 6.8, boxstyle='round,pad=0,rounding_size=1.4', fc='#F0E3E3', ec=INK, lw=1.8, hatch='...'))
    ax.text(47, 5.4, 'used bath goes to the drain', ha='center', va='center', fontsize=6.4, fontweight='bold', bbox=dict(fc='white', ec='none', pad=1))
    ax.annotate('', xy=(44, 8.8), xytext=(44, 14.0), arrowprops=dict(arrowstyle='-|>', color=INK, lw=1.8))
    save(fig, 'dialysis_diagram.png')


if __name__ == '__main__':
    for f in (icon_detective, icon_lab, icon_nurse, icon_team, icon_key, icon_stop, icon_clock, icon_star, logo, portrait, mg_gauge, ecg_fig, reflex_scale, bag, dialysis):
        f()
    banner('timeline_banner.png')
    # Mg-o-meter trend charts, one per checkpoint (slots: 0 clinic, 1 ED 0440, 2 0900, 3 1115, 4 1315, 5 1700, 6 1800, 7 2100, 8 0100, 9 0500)
    mg_chart('mg_cp1.png', 1, 1)
    mg_chart('mg_cp2.png', 2, 2)
    mg_chart('mg_cp3.png', 4, 3)
    mg_chart('mg_cp4.png', 6, 5)
    mg_chart('mg_cp5.png', 7, 7)
    mg_chart('mg_cp6.png', 8, 8)
    mg_chart('mg_full.png', 9, 0, prefill=False, h=3.0)
