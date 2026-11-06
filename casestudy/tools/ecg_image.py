#!/usr/bin/env python3
"""Printed-ECG image generator for simulated patients (reusable for any case study).

Draws a realistic paper ECG (pink 1 mm / 5 mm grid, black trace, 25 mm/s, 10 mm/mV, calibration pulse,
header with patient and measurements, interpretation, footer 'SIMULATION: not a real patient').
Layouts: '12' (3 rows x 4 columns + lead II rhythm strip) and 'strip' (single lead rhythm strip).

Python use (for a case's post-step):
    import sys; sys.path.insert(0, 'casestudy/tools')
    import ecg_image as E
    png = E.render_ecg(rate=44, pr=0.30, qrs=0.13, qtc=0.48, rhythm='first_degree', patient=dict(name='KESSLER, RAYMOND', mrn='SIM-40318', dob='1952-04-22', age=74, sex='Male'), when='2026-11-17 04:30')
    open('ecg.png', 'wb').write(png)
    rec = E.ecg_record(png, datetime='2026-11-17 04:40', summary='...', impression='...')   # dict ready for notes

CLI:  python3 casestudy/tools/ecg_image.py --rate 44 --pr 0.30 --qrs 0.13 --out file.png     (see --help)

Needs numpy, matplotlib, Pillow.  All waveforms are synthetic (sums of Gaussians per wave, per lead).
"""
import argparse, base64, io, json, math, sys
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image

FS = 1000  # samples per second
LEADS12 = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6']
# 3 rows x 4 columns, standard order: col1 I II III, col2 aVR aVL aVF, col3 V1 V2 V3, col4 V4 V5 V6
GRID12 = [['I', 'aVR', 'V1', 'V4'], ['II', 'aVL', 'V2', 'V5'], ['III', 'aVF', 'V3', 'V6']]

# Per-lead wave amplitudes in mV: P, Q, R, S, T (normal axis, ~ +45 to +60 degrees)
PRESETS = {
    'normal': {
        'I': (0.10, -0.05, 0.70, -0.10, 0.25), 'II': (0.15, -0.05, 1.00, -0.15, 0.35), 'III': (0.07, -0.04, 0.40, -0.10, 0.12),
        'aVR': (-0.12, 0.0, 0.10, -0.75, -0.30), 'aVL': (0.04, -0.03, 0.35, -0.12, 0.10), 'aVF': (0.11, -0.04, 0.70, -0.12, 0.25),
        'V1': (0.08, 0.0, 0.18, -1.00, -0.08), 'V2': (0.10, 0.0, 0.40, -1.30, 0.50), 'V3': (0.10, -0.03, 0.70, -0.95, 0.45),
        'V4': (0.10, -0.05, 1.15, -0.45, 0.50), 'V5': (0.10, -0.10, 1.25, -0.20, 0.40), 'V6': (0.09, -0.10, 1.00, -0.10, 0.30)},
    'left': {  # left axis deviation
        'I': (0.11, -0.05, 0.95, -0.05, 0.30), 'II': (0.10, -0.03, 0.35, -0.45, 0.10), 'III': (0.03, 0.0, 0.05, -0.75, -0.12),
        'aVR': (-0.10, 0.0, 0.05, -0.65, -0.28), 'aVL': (0.06, -0.03, 0.80, -0.08, 0.20), 'aVF': (0.06, 0.0, 0.15, -0.55, -0.02)},
    'right': {  # right axis deviation
        'I': (0.05, 0.0, 0.10, -0.60, -0.10), 'II': (0.15, -0.03, 0.80, -0.10, 0.25), 'III': (0.12, -0.03, 0.95, -0.05, 0.25),
        'aVR': (-0.10, 0.0, 0.05, -0.50, -0.15), 'aVL': (-0.04, 0.0, 0.05, -0.70, -0.15), 'aVF': (0.13, -0.03, 0.90, -0.08, 0.25)},
}
for _k in ('left', 'right'):
    for _l in LEADS12:
        PRESETS[_k].setdefault(_l, PRESETS['normal'][_l])
# Hyperkalemia-like T emphasis per lead (multiplier applied when peaked=True): tall, narrow, symmetric, strongest V2-V4
PEAK_BOOST = {'I': 1.0, 'II': 1.3, 'III': 1.0, 'aVR': 1.0, 'aVL': 0.8, 'aVF': 1.2, 'V1': 1.6, 'V2': 1.7, 'V3': 1.7, 'V4': 1.6, 'V5': 1.4, 'V6': 1.2}

# U-wave size per lead (multiplier of u_amp): largest in the mid-precordial leads
U_LEAD = {'I': 0.4, 'II': 0.6, 'III': 0.3, 'aVR': -0.4, 'aVL': 0.2, 'aVF': 0.4, 'V1': 0.6, 'V2': 1.0, 'V3': 1.0, 'V4': 0.8, 'V5': 0.6, 'V6': 0.5}

RHYTHMS = {
    'sinus': 'Normal sinus rhythm', 'sinus_brady': 'Sinus bradycardia', 'sinus_tach': 'Sinus tachycardia',
    'first_degree': 'Sinus rhythm with first-degree AV block', 'wide': 'Sinus rhythm with wide QRS (hyperkalemia-like pattern)',
    'afib': 'Atrial fibrillation', 'vtach': 'Ventricular tachycardia', 'mobitz1': 'Second-degree AV block, Mobitz I (Wenckebach)',
    'complete': 'Complete (third-degree) AV block with ventricular escape', 'paced': 'Ventricular paced rhythm',
}


def _gauss(sig, t, c, a, s):
    lo = max(0, int((c - 5 * s) * FS)); hi = min(len(t), int((c + 5 * s) * FS) + 1)
    if hi > lo:
        sig[lo:hi] += a * np.exp(-0.5 * ((t[lo:hi] - c) / s) ** 2)


def _events(rhythm, rate, pr, dur, irregular, rng, no_p):
    """Returns (p_onsets, qrs_onsets). Times in seconds."""
    rr = 60.0 / rate
    p_on, q_on = [], []
    if rhythm in ('afib',):
        t = 0.15
        while t < dur + 1:
            q_on.append(t); t += max(0.3, rng.gamma(6.0, rr / 6.0) * (1.0 + 0.0)) if irregular is not False else rr
        return [], q_on
    if rhythm == 'vtach':
        t = 0.2
        while t < dur + 1: q_on.append(t); t += rr * (1 + rng.normal(0, 0.005))
        return [], q_on
    if rhythm == 'complete':
        t = 0.1; prate = 78.0
        while t < dur + 1: p_on.append(t); t += 60 / prate
        t = 0.45
        while t < dur + 1: q_on.append(t); t += rr * (1 + rng.normal(0, 0.01))
        return p_on, q_on
    if rhythm == 'mobitz1':
        t = 0.1; k = 0; prs = [pr, pr + 0.09, pr + 0.19, None]
        while t < dur + 1:
            p_on.append(t)
            if prs[k % 4] is not None: q_on.append(t + prs[k % 4])
            k += 1; t += rr
        return p_on, q_on
    t = 0.1
    sd = (0.02 if irregular is None else (0.08 if irregular else 0.0))
    while t < dur + 1:
        if not no_p: p_on.append(t)
        q_on.append(t + pr); t += rr * (1 + rng.normal(0, sd)) if sd else rr
    return p_on, q_on


def synth_leads(rate=70, pr=0.16, qrs=0.09, qt=None, qtc=None, rhythm='sinus', t_amp=1.0, peaked=False, no_p=False,
                irregular=None, noise=0.02, axis='normal', pacer=False, st_elev=0.0, p_amp=1.0, dur=10.0, seed=7, u_amp=0.0, st_dep=0.0, t_inv=False, pvc_beats=None):
    """Returns dict lead -> numpy array (mV) sampled at FS for `dur` seconds. u_amp (mV, about 0.05-0.2) adds a U wave after each T
    (hypokalemia-like; strongest V2-V3); pair it with a low t_amp for flattened T waves.
    st_dep (mV, 0.10 = 1 mm): horizontal ST depression, full size in V4-V6, about a third in V3, I and aVL, with reciprocal elevation in aVR (lateral subendocardial ischemia).
    t_inv: T waves inverted in V5-V6 (use with st_dep). pvc_beats: list of beat numbers (0 = first) that are premature ventricular beats (wide, no P wave, 0.3 R-R early; the next beat keeps its place, so a full compensatory pause)."""
    rng = np.random.default_rng(seed)
    if rhythm == 'afib': no_p = True
    p_on, q_on = _events(rhythm, rate, pr, dur, irregular if rhythm != 'afib' else (True if irregular is None else irregular), rng, no_p)
    rr_mean = 60.0 / rate
    if qt is None:
        qt = (qtc if qtc else 0.42) * math.sqrt(rr_mean)
    if rhythm == 'complete': qt = (qtc if qtc else 0.44) * math.sqrt(rr_mean)
    n = int(dur * FS); t = np.arange(n) / FS
    pre = PRESETS.get(axis, PRESETS['normal'])
    width = max(qrs, 0.06) / 0.09
    amp_scale = (1.0 / width) ** 0.45
    wide_disc = rhythm in ('vtach', 'paced') or (rhythm == 'complete')
    out = {}
    for lead in LEADS12:
        P, Q, R, S, T = pre[lead]
        sig = np.zeros(n)
        tamp = T * t_amp * (PEAK_BOOST[lead] if peaked else 1.0)
        if t_inv and lead in ('V5', 'V6'): tamp = -abs(tamp) * 0.7
        tsig = 0.032 if peaked else 0.048
        # P waves
        if not no_p:
            for pi, p0 in enumerate(p_on):
                if pvc_beats and pi in pvc_beats: continue
                _gauss(sig, t, p0 + 0.055, P * p_amp, 0.021)
                if lead == 'V1': _gauss(sig, t, p0 + 0.085, -0.04 * p_amp, 0.014)
        pvc_set = set(pvc_beats or [])
        for qi, q0 in enumerate(q_on):
            d = qrs
            if qi in pvc_set:   # premature ventricular beat: wide, early, discordant T
                q0 = q0 - 0.30 * rr_mean; d = 0.14
                net = (R + S + Q) * 1.4 if abs(R + S + Q) > 0.15 else (1.1 if R >= abs(S) else -1.1) * max(abs(R), abs(S))
                _gauss(sig, t, q0 + 0.5 * d, net * 0.9, 0.17 * d)
                _gauss(sig, t, q0 + 0.78 * d, -net * 0.25, 0.12 * d)
                _gauss(sig, t, q0 + d + 0.13, -net * 0.30, 0.06)
                continue
            if wide_disc and rhythm in ('vtach', 'paced'):
                net = (R + S + Q) * (1.4 if rhythm == 'vtach' else 1.0)
                if rhythm == 'paced':   # LBBB-like paced morphology: V1 deep QS, lateral leads broad R
                    net = -abs(net) * 1.1 if lead in ('V1', 'V2', 'V3', 'aVR', 'III', 'aVF', 'II') else abs(R) * 0.9
                    if lead in ('II', 'III', 'aVF'): net = -0.55 * abs(R)
                _gauss(sig, t, q0 + 0.5 * d, net * 0.9, 0.17 * d)
                _gauss(sig, t, q0 + 0.78 * d, -net * 0.25, 0.12 * d)
                tc = q0 + qt - 0.12 if rhythm == 'paced' else q0 + d + 0.13
                _gauss(sig, t, tc, -net * 0.30, 0.055 if rhythm == 'vtach' else 0.06)
                if pacer and rhythm == 'paced': _gauss(sig, t, q0 - 0.012, 0.9, 0.0007)
                continue
            s = (0.11 if d <= 0.11 else 0.20) * d
            _gauss(sig, t, q0 + 0.15 * d, Q * amp_scale, s)
            _gauss(sig, t, q0 + 0.45 * d, R * amp_scale, s * (1.15 if d > 0.12 else 1.0))
            _gauss(sig, t, q0 + 0.75 * d, S * amp_scale * (1.0 if d <= 0.12 else 1.1), s * (1.3 if d > 0.12 else 1.0))
            if d > 0.115 and lead in ('V1', 'V2', 'aVR'):  # slurred terminal deflection of a wide QRS
                _gauss(sig, t, q0 + 0.92 * d, S * 0.35 * amp_scale, 0.05 * d + 0.012)
            if d > 0.115 and lead in ('I', 'V5', 'V6', 'aVL'):
                _gauss(sig, t, q0 + 0.95 * d, -0.10 * amp_scale, 0.05 * d)
            if st_elev:   # ST elevation (inferior + lateral/anterior pattern) as a broad plateau after the J point
                mask = {'II': 1, 'III': 1.3, 'aVF': 1.2, 'aVL': -0.6, 'V2': 0.5, 'V3': 0.7, 'V4': 0.8, 'V5': 0.7, 'V6': 0.5, 'I': 0.3}.get(lead, 0)
                _gauss(sig, t, q0 + d + 0.09, st_elev * mask, 0.07)
            if st_dep:   # horizontal ST depression plateau after the J point (lateral leads), reciprocal elevation in aVR
                m = {'V4': 1.0, 'V5': 1.0, 'V6': 1.0, 'V3': 0.3, 'I': 0.35, 'aVL': 0.35, 'aVR': -0.3}.get(lead, 0)
                _gauss(sig, t, q0 + d + 0.10, -st_dep * m, 0.075)
            tc = q0 + qt - 2.5 * tsig
            if peaked:  # pronounced narrow based T that starts right after the QRS
                tc = q0 + max(d + 0.07, qt - 2.4 * tsig - 0.02)
            _gauss(sig, t, tc, tamp, tsig)
            if u_amp:   # U wave: small, broad, about 0.16 s after the T peak; largest in V2-V3
                _gauss(sig, t, tc + 0.16, u_amp * U_LEAD.get(lead, 0.5), 0.035)
            if pacer:
                _gauss(sig, t, q0 - 0.012, 0.9, 0.0007)
        if rhythm == 'afib':   # fibrillatory baseline (best in V1 and II)
            f = 0.035 if lead in ('V1', 'II', 'III', 'aVF') else 0.015
            sig += f * np.sin(2 * np.pi * 6.1 * t + rng.uniform(0, 6)) * (1 + 0.5 * np.sin(2 * np.pi * 0.7 * t)) + 0.5 * f * np.sin(2 * np.pi * 8.3 * t + rng.uniform(0, 6))
        if noise > 0:
            wander = noise * 1.6 * np.sin(2 * np.pi * 0.23 * t + rng.uniform(0, 6)) + noise * 0.8 * np.sin(2 * np.pi * 0.11 * t + rng.uniform(0, 6))
            w = rng.normal(0, 1, n); k = np.ones(7) / 7
            sig += wander + noise * 0.5 * np.convolve(w, k, mode='same') * 2.0 + noise * 0.15 * np.sin(2 * np.pi * 60 * t)
        out[lead] = sig
    return out


def _measure_lines(m):
    na = '---'
    return [f"Vent. rate  {m['rate']} BPM",
            f"PR interval  {na if m.get('no_pr') else str(round(m['pr'] * 1000)) + ' ms'}",
            f"QRS duration  {round(m['qrs'] * 1000)} ms",
            f"QT/QTc  {round(m['qt'] * 1000)}/{round(m['qtc'] * 1000)} ms",
            f"P-R-T axes  {m.get('axes', '50  35  40')}"]


def render_ecg(rate=70, pr=0.16, qrs=0.09, qt=None, qtc=None, rhythm='sinus', t_amp=1.0, peaked=False, no_p=False,
               irregular=None, noise=0.02, axis='normal', pacer=False, st_elev=0.0, p_amp=1.0, layout='12',
               lead='II', patient=None, when='', location='', interpretation=None, status='Unconfirmed',
               device='SIMULATED ECG', width_px=1600, seed=7, axes_text=None, title=None, colors=64, dur=10.0, u_amp=0.0, st_dep=0.0, t_inv=False, pvc_beats=None):
    """Returns PNG bytes. patient = dict(name, mrn, dob, age, sex). interpretation = list of lines (default from rhythm)."""
    patient = patient or {}
    rr_mean = 60.0 / rate
    if qt is None and qtc is None: qtc = 0.42
    if qt is None: qt = qtc * math.sqrt(rr_mean)
    if qtc is None: qtc = qt / math.sqrt(rr_mean)
    no_p_eff = no_p or rhythm in ('afib', 'vtach')
    sigs = synth_leads(rate, pr, qrs, qt, qtc, rhythm, t_amp, peaked, no_p, irregular, noise, axis, pacer, st_elev, p_amp, dur, seed, u_amp, st_dep, t_inv, pvc_beats)
    if interpretation is None:
        interpretation = [RHYTHMS.get(rhythm, rhythm).upper()] + (['WIDE QRS'] if qrs >= 0.12 and rhythm not in ('vtach', 'paced') else []) + (['ABNORMAL ECG'] if (rate < 50 or rate > 100 or pr > 0.2 or qrs >= 0.12 or rhythm not in ('sinus',)) else ['NORMAL ECG'])
    meas = dict(rate=round(rate), pr=pr, qrs=qrs, qt=qt, qtc=qtc, no_pr=no_p_eff or rhythm in ('complete',), axes=axes_text or ('---' if rhythm in ('afib', 'vtach') else '50  35  40'))

    PW = 280.0                              # page width in mm
    is12 = layout == '12'
    HDR = 38.0; ROW = 30.0; FOOT = 9.0
    PH = HDR + (4 * ROW if is12 else 1.8 * ROW) + FOOT
    x0, xspan = 14.0, 250.0                 # trace area (mm): 10 s at 25 mm/s
    fig_w = 11.0
    dpi = width_px / fig_w
    fig = plt.figure(figsize=(fig_w, fig_w * PH / PW), dpi=dpi)
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, PW); ax.set_ylim(0, PH); ax.axis('off')
    fig.patch.set_facecolor('#fff7f5')
    # grid
    minor, major = '#f6cfd0', '#e9a3a8'
    for x in np.arange(0, PW + 0.01, 1.0):
        ax.plot([x, x], [0, PH], color=(major if round(x) % 5 == 0 else minor), lw=0.55 if round(x) % 5 == 0 else 0.35, solid_capstyle='butt', zorder=1)
    for y in np.arange(0, PH + 0.01, 1.0):
        ax.plot([0, PW], [y, y], color=(major if round(y) % 5 == 0 else minor), lw=0.55 if round(y) % 5 == 0 else 0.35, solid_capstyle='butt', zorder=1)
    ink = '#111111'
    # header text on a light backing so it stays legible
    ytop = PH - 4.0
    ax.add_patch(plt.Rectangle((0, PH - HDR + 2), PW, HDR - 2, color='#fff7f5', zorder=2, lw=0))
    name = patient.get('name', 'UNKNOWN, PATIENT'); sex = patient.get('sex', '')
    l1 = f"{name}    MRN {patient.get('mrn', '')}    DOB {patient.get('dob', '')}"
    if patient.get('age') not in (None, ''): l1 += f"  ({patient['age']} y)"
    if sex: l1 += f"   {sex}"
    ax.text(5, ytop, l1, fontsize=9.6, fontweight='bold', color=ink, va='top', zorder=5, family='DejaVu Sans')
    l2 = f"Acquired {when}" + (f"    {location}" if location else '') + (f"    {title}" if title else '')
    ax.text(5, ytop - 5.0, l2, fontsize=8.0, color=ink, va='top', zorder=5)
    for i, ln in enumerate(_measure_lines(meas)):
        ax.text(5, ytop - 11.0 - i * 4.0, ln, fontsize=7.4, color=ink, va='top', zorder=5, family='DejaVu Sans Mono')
    for i, ln in enumerate(interpretation[:5]):
        ax.text(78, ytop - 11.0 - i * 4.3, ln, fontsize=8.2, fontweight='bold', color=ink, va='top', zorder=5)
    ax.text(PW - 5, ytop, status.upper() if status else '', fontsize=9, fontweight='bold', color='#b00020', va='top', ha='right', zorder=5)
    ax.text(PW - 5, ytop - 5.0, device, fontsize=7, color=ink, va='top', ha='right', zorder=5)
    ax.text(PW - 5, ytop - 9.0, 'Referred by: ----   Reader: ----', fontsize=6.6, color=ink, va='top', ha='right', zorder=5)
    # footer
    ax.text(5, 3.0, '25 mm/s    10 mm/mV    0.5-40 Hz', fontsize=6.8, color=ink, va='bottom', zorder=5)
    ax.text(PW - 5, 3.0, 'SIMULATION: not a real patient', fontsize=7.4, fontweight='bold', color='#444444', va='bottom', ha='right', zorder=5)

    def strip(sig, lead_name, ybase, xs, xe_sec, t0_sec, calib):
        a = int(t0_sec * FS); b = int(xe_sec * FS)
        seg = np.clip(sig[a:b] * 10.0, -15, 15)                      # mm
        xx = xs + (np.arange(len(seg)) / FS) * 25.0
        ax.plot(xx, ybase + seg, color=ink, lw=0.8, zorder=4, solid_joinstyle='round')
        ax.text(xs + 1.0, ybase + 9.0, lead_name, fontsize=8.5, fontweight='bold', color=ink, zorder=5, va='bottom')
        if calib:
            ax.plot([x0 - 9, x0 - 8, x0 - 8, x0 - 4, x0 - 4, x0 - 3], [ybase, ybase, ybase + 10, ybase + 10, ybase, ybase], color=ink, lw=0.8, zorder=4)

    top = PH - HDR
    if is12:
        colsec = dur / 4.0
        for r in range(3):
            yb = top - ROW * (r + 0.5) - 1
            for c in range(4):
                nm = GRID12[r][c]
                strip(sigs[nm], nm, yb, x0 + c * colsec * 25.0, (c + 1) * colsec, c * colsec, calib=(c == 0))
                if c > 0: ax.plot([x0 + c * colsec * 25.0] * 2, [yb - 3, yb + 3], color=ink, lw=0.7, zorder=4)
        yb = top - ROW * 3.5 - 1
        strip(sigs['II'], 'II', yb, x0, dur, 0.0, calib=True)
    else:
        yb = top - ROW * 1.1
        strip(sigs[lead], lead, yb, x0, dur, 0.0, calib=True)
        yb2 = top - ROW * 2.1
        # second line: same lead continued is not needed; keep a single strip and a rule underneath
        ax.plot([x0, x0 + dur * 25], [yb2 + 12, yb2 + 12], color=ink, lw=0.0)
    buf = io.BytesIO(); fig.savefig(buf, format='png', dpi=dpi, facecolor=fig.get_facecolor()); plt.close(fig)
    im = Image.open(io.BytesIO(buf.getvalue())).convert('RGB')
    if im.width != width_px:
        im = im.resize((width_px, round(im.height * width_px / im.width)), Image.LANCZOS)
    im = im.quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    out = io.BytesIO(); im.save(out, format='PNG', optimize=True)
    return out.getvalue()


def data_url(png_bytes):
    return 'data:image/png;base64,' + base64.b64encode(png_bytes).decode('ascii')


def ecg_record(png_bytes, datetime, id=None, title='12-Lead ECG', author='Cardiology', summary='', body='', study='ECG 12 lead',
               impression='', caption=None, alt=None, category='Cardiology'):
    """Chart-review record (type 'cardiology') with the tracing embedded as a data URL."""
    rec = {'type': 'cardiology', 'title': title, 'author': author, 'datetime': datetime, 'category': category,
           'summary': summary, 'body': body, 'study': study, 'impression': impression,
           'images': [{'src': data_url(png_bytes), 'caption': caption or f'{title}, {datetime}', 'alt': alt or f'{title} tracing (simulated)'}]}
    if id: rec['id'] = id
    return rec


def main(argv=None):
    ap = argparse.ArgumentParser(description='Draw a simulated printed ECG as a compressed PNG.')
    ap.add_argument('--rate', type=float, default=70, help='ventricular rate, bpm')
    ap.add_argument('--pr', type=float, default=0.16, help='PR interval, seconds')
    ap.add_argument('--qrs', type=float, default=0.09, help='QRS duration, seconds')
    ap.add_argument('--qt', type=float, default=None, help='QT, seconds')
    ap.add_argument('--qtc', type=float, default=None, help='QTc (Bazett), seconds (default 0.42)')
    ap.add_argument('--rhythm', default='sinus', choices=sorted(RHYTHMS), help='rhythm preset')
    ap.add_argument('--t-amp', type=float, default=1.0, help='T-wave amplitude multiplier')
    ap.add_argument('--peaked', action='store_true', help='tall, narrow, peaked T waves (hyperkalemia-like)')
    ap.add_argument('--no-p', action='store_true', help='no P waves')
    ap.add_argument('--irregular', action='store_true', help='irregular R-R intervals')
    ap.add_argument('--regular', action='store_true', help='perfectly regular R-R intervals')
    ap.add_argument('--noise', type=float, default=0.02, help='baseline wander / muscle noise (0 = clean)')
    ap.add_argument('--axis', default='normal', choices=['normal', 'left', 'right'])
    ap.add_argument('--pacer', action='store_true', help='draw pacemaker spikes')
    ap.add_argument('--u-amp', type=float, default=0.0, help='U-wave amplitude, mV (hypokalemia-like, e.g. 0.12 with --t-amp 0.3)')
    ap.add_argument('--st-elev', type=float, default=0.0, help='ST elevation, mV')
    ap.add_argument('--layout', default='12', choices=['12', 'strip'])
    ap.add_argument('--lead', default='II', help='lead for strip layout')
    ap.add_argument('--name', default='DOE, JANE'); ap.add_argument('--mrn', default='SIM-00000'); ap.add_argument('--dob', default='')
    ap.add_argument('--age', default=''); ap.add_argument('--sex', default='')
    ap.add_argument('--when', default='', help='acquired date/time text'); ap.add_argument('--location', default='')
    ap.add_argument('--title', default=None, help='extra header text, e.g. "Telemetry strip"')
    ap.add_argument('--interp', action='append', help='interpretation line (repeat)')
    ap.add_argument('--status', default='Unconfirmed', help='Unconfirmed or Confirmed')
    ap.add_argument('--seed', type=int, default=7); ap.add_argument('--width', type=int, default=1600)
    ap.add_argument('--out', required=True); ap.add_argument('--json', help='also write a chart record JSON here')
    a = ap.parse_args(argv)
    irr = True if a.irregular else (False if a.regular else None)
    png = render_ecg(rate=a.rate, pr=a.pr, qrs=a.qrs, qt=a.qt, qtc=a.qtc, rhythm=a.rhythm, t_amp=a.t_amp, peaked=a.peaked, no_p=a.no_p,
                     irregular=irr, noise=a.noise, axis=a.axis, pacer=a.pacer, st_elev=a.st_elev, layout=a.layout, lead=a.lead,
                     patient=dict(name=a.name, mrn=a.mrn, dob=a.dob, age=a.age, sex=a.sex), when=a.when, location=a.location,
                     interpretation=a.interp, status=a.status, seed=a.seed, width_px=a.width, title=a.title, u_amp=a.u_amp)
    open(a.out, 'wb').write(png)
    print(f'{a.out}: {len(png) / 1024:.0f} KB')
    if a.json:
        json.dump(ecg_record(png, datetime=a.when), open(a.json, 'w'))


if __name__ == '__main__':
    main()
