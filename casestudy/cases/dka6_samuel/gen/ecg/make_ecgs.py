#!/usr/bin/env python3
"""Draws Samuel Okafor's four 12-lead ECGs and writes notes/ecg.json (chart 'cardiology' records).
The records point at the PNGs with `imageFiles`; gen/assemble.js embeds them as data URLs.
Rebuild everything:   python3 casestudy/cases/dka6_samuel/gen/ecg/make_ecgs.py && node casestudy/cases/dka6_samuel/gen/assemble.js && node tools/make-prebuilt.js
Numbers match the design's ECG table (rate, PR, QRS, QTc Bazett), gen/physiology.js (ECG lab lines), DESIGN.md and the notes. QT = QTc x sqrt(RR) (Bazett, the design's method).
Each record appears when the result is available.
Pattern match: 0140 K 5.2 (ordered before the result): lateral ST depression 1.5 mm V4-V6 with T inversion V5-V6 (st_dep 0.15 mV, t_inv); 0715 K 3.3: flat T (t_amp 0.2) with prominent U waves (u_amp 0.14),
ST depression 1.0 mm, and unifocal ventricular premature beats (pvc_beats: two in a row = a couplet, then one more); 1405 K 4.1: ST depression 1.5 mm, no U waves, no PVCs; Day 2 1300 after the stent: normal."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', '..', 'tools'))
import ecg_image as E

PT = dict(name='OKAFOR, SAMUEL', mrn='SIM-40506', dob='1981-08-14', age=45, sex='Male')

ECGS = [
 dict(key='0140', acq='2026-11-16 01:40', avail='2026-11-16 01:50', place='Emergency Department', reader='G. Marsh, MD', rate=114, pr=0.148, qrs=0.088, qtc=0.432,
      allow=[], p=dict(rhythm='sinus_tach', st_dep=0.15, t_inv=True, seed=61),
      interp=['SINUS TACHYCARDIA', 'HORIZONTAL ST DEPRESSION V4-V6 (1.5 MM)', 'T-WAVE INVERSION V5-V6', 'LATERAL SUBENDOCARDIAL ISCHEMIA', 'ABNORMAL ECG'],
      summary='Sinus tachycardia 114, PR 148 ms, QRS 88 ms, QTc 432 ms (Bazett), axis +35. Horizontal ST depression 1.5 mm in V4-V6 (0.5 mm in I and aVL, 0.5 mm downsloping in V3) with T-wave inversion V5-V6; no ST elevation (0.5 mm reciprocal change in aVR). Lateral subendocardial ischemia pattern.',
      body='**Measurements**\nVentricular rate 114 bpm. PR 148 ms. QRS 88 ms. QTc 432 ms (Bazett). Axis +35 degrees.\n\n**Interpretation**\nSinus tachycardia, regular, no ectopy. Inferior leads: isoelectric ST, normal T waves, no pathological Q waves. V1-V3: normal R-wave progression, isoelectric ST in V1-V2 and a subtle 0.5 mm downsloping ST depression in V3. **V4-V6, I and aVL: 1.5 mm horizontal ST depression in V4, V5 and V6 (0.5 mm in I and aVL) with symmetric T-wave inversion in V5-V6**: acute subendocardial lateral-wall ischemia in the first obtuse marginal territory. No ST elevation in any lead (0.5 mm benign reciprocal change in aVR).\n\n**Context**\nEpigastric ache with sweating and fatigue for 36 hours, deep breathing, glucose HIGH on the meter; labs and the first troponin are pending. This is an NSTE-ACS pattern: aspirin given, serial troponin and cardiology to follow.',
      imp='Sinus tachycardia 114 with 1.5 mm ST depression V4-V6 and T inversion V5-V6: NSTE-ACS pattern. QTc 432 ms.'),
 dict(key='0715', acq='2026-11-16 07:15', avail='2026-11-16 07:25', place='Cardiac Step-Down Unit', reader='W. Haldane, MD', rate=96, pr=0.164, qrs=0.092, qtc=0.492,
      allow=[], p=dict(rhythm='sinus', t_amp=0.2, u_amp=0.14, st_dep=0.10, pvc_beats=[3, 4, 11], seed=62),
      interp=['SINUS RHYTHM', 'FREQUENT UNIFOCAL VENTRICULAR PREMATURE BEATS', 'FLAT T WAVES WITH PROMINENT U WAVES', 'ST DEPRESSION V4-V6 (1.0 MM)', 'CONSIDER LOW POTASSIUM'],
      summary='Sinus rhythm 96 with frequent unifocal ventricular premature beats (left ventricular origin, right bundle branch block pattern, QRS 136 ms; about 7 per minute with couplets and trigeminal runs) near the end of the T-U wave. PR 164 ms, QRS 92 ms, QTc 492 ms (T-U fusion). Diffuse T-wave flattening with prominent U waves; persistent 1.0 mm ST depression V4-V6. Hypokalemia pattern (potassium 3.3) on top of lateral ischemia.',
      body='**Measurements**\nVentricular rate 96 bpm. PR 164 ms. QRS 92 ms (136 ms on the premature beats). QTc 492 ms (Bazett; the T and U waves are fused, so this is a QTc/QUc). Axis +30 degrees.\n\n**Interpretation**\nSinus rhythm with **frequent unifocal ventricular premature beats** (left ventricular origin, right bundle branch block morphology; about 7 per minute, with couplets and trigeminal runs) that fall near the end of the T-U wave: R-on-T risk. Inferior leads: diffuse T-wave flattening with U waves visible after the T in lead II. V1-V3: markedly flattened T waves with **prominent upright U waves (over 1.5 mm in V2-V3, taller than the T wave)**. V4-V6, I and aVL: persistent 1.0 mm horizontal ST depression, flattened T waves, U waves in V4-V5. Compared with 0140: rate slower (114 to 96), ST depression smaller (1.5 to 1.0 mm), new U waves and ventricular ectopy.\n\n**Context**\nPotassium 3.3 on the 0655 specimen (released 0710) on an insulin infusion in an acute NSTEMI. Ventricular ectopy on an ischemic myocardium with hypokalemia can degenerate into polymorphic ventricular tachycardia: hold the insulin, replace potassium (peripheral limit 10 mEq/h), keep K at 4.0 or higher and magnesium normal, and keep him on telemetry.',
      imp='Sinus rhythm 96, frequent unifocal PVCs, flat T with prominent U waves, ST depression 1.0 mm V4-V6 at potassium 3.3. QTc 492 ms (T-U fusion).'),
 dict(key='1405', acq='2026-11-16 14:05', avail='2026-11-16 14:15', place='Cardiac Step-Down Unit', reader='A. Vogt, MD', rate=94, pr=0.156, qrs=0.090, qtc=0.438,
      allow=[], p=dict(rhythm='sinus', st_dep=0.15, t_inv=True, seed=63),
      interp=['SINUS RHYTHM', 'HORIZONTAL ST DEPRESSION V4-V6 (1.5 MM)', 'T-WAVE INVERSION V5-V6', 'RECURRENT LATERAL ISCHEMIA', 'ABNORMAL ECG'],
      summary='Sinus rhythm 94, PR 156 ms, QRS 90 ms, QTc 438 ms (Bazett). Horizontal ST depression 1.5 mm in V4-V6 (deeper than 1.0 mm at 0715), T-wave inversion V5-V6; no ventricular ectopy and no U waves (potassium 4.1 at 1115). Recurrent lateral ischemia with chest pressure.',
      body='**Measurements**\nVentricular rate 94 bpm. PR 156 ms. QRS 90 ms. QTc 438 ms (Bazett).\n\n**Interpretation**\nSinus rhythm. **1.5 mm horizontal ST depression in V4-V6 with T-wave inversion in V5-V6**, deeper than the 1.0 mm on the 0715 tracing. No premature beats, no U waves, narrow QRS. No ST elevation.\n\n**Context**\nRecorded at 1405 during new 5/10 retrosternal and epigastric pressure, 15 minutes before the sublingual nitroglycerin was given. Potassium 4.1 at 1115, so the ectopy and U waves have gone. Recurrent angina from the culprit lateral lesion: continue heparin and aspirin, repeat troponin with the next panel, and review after the nitrate.',
      imp='Sinus rhythm 94 with 1.5 mm ST depression V4-V6 and T inversion V5-V6 during chest pressure: recurrent lateral ischemia. No ectopy. QTc 438 ms.'),
 dict(key='1300', acq='2026-11-17 13:00', avail='2026-11-17 13:10', place='Cardiac Step-Down Unit', reader='W. Haldane, MD', rate=68, pr=0.160, qrs=0.086, qtc=0.418,
      allow=['1405'], p=dict(rhythm='sinus', t_amp=1.0, seed=64),
      interp=['NORMAL SINUS RHYTHM', 'ST DEPRESSION V4-V6 RESOLVED', 'NO U WAVES, NO ECTOPY', 'NORMAL ECG'],
      summary='Sinus rhythm 68, PR 160 ms, QRS 86 ms, QTc 418 ms (Bazett), axis +32. Complete resolution of the lateral ST depression in V4-V6; upright T in V4-V5, trace flattening in V6; U waves gone; no premature beats. Compatible with reperfusion of the first obtuse marginal after stenting.',
      body='**Measurements**\nVentricular rate 68 bpm. PR 160 ms. QRS 86 ms. QTc 418 ms (Bazett). Axis +32 degrees.\n\n**Interpretation**\nNormal sinus rhythm, completely regular, no premature atrial or ventricular beats. Inferior leads: isoelectric ST, normal T. V1-V3: isoelectric ST, normal T-wave amplitude, **U waves gone**. **V4-V6, I and aVL: complete resolution of the horizontal ST depression** (isoelectric), upright T in V4-V5 with only trace flattening in V6. Compared with 1405 yesterday and 0140: resolved.\n\n**Context**\nPost drug-eluting stent to the first obtuse marginal (right radial, completed about 1215). Potassium 4.3 at 0700. Telemetry can continue.',
      imp='Normal sinus rhythm 68. Lateral ST depression resolved, no U waves, no ectopy. QTc 418 ms.')
]

def main():
    recs = []
    for e in ECGS:
        png = E.render_ecg(patient=PT, when=e['acq'], location=e['place'], interpretation=e['interp'], status='Confirmed', width_px=1600, noise=0.015,
                           rate=e['rate'], pr=e['pr'], qrs=e['qrs'], qtc=e['qtc'], **e['p'])
        rel = f"ecg/ecg_{e['key']}.png"
        open(os.path.join(HERE, f"ecg_{e['key']}.png"), 'wb').write(png)
        recs.append({'id': f"note_ecg_{e['avail'].replace('-', '').replace(' ', '').replace(':', '')}", 'type': 'cardiology', 'title': '12-Lead ECG',
                     'author': e['reader'], 'datetime': e['avail'], 'category': 'Cardiology', 'summary': e['summary'], 'body': e['body'],
                     'allowTimes': e.get('allow', []), 'study': f"ECG 12 lead, acquired {e['acq'][11:]}", 'impression': e['imp'],
                     'imageFiles': [{'file': rel, 'caption': f"12-lead ECG acquired {e['acq']}", 'alt': f"12-lead ECG tracing from {e['acq']}: " + e['summary']}]})
        print(f"{rel}: {len(png) / 1024:.0f} KB")
    json.dump(recs, open(os.path.join(HERE, '..', '..', 'notes', 'ecg.json'), 'w'), indent=1)

if __name__ == '__main__':
    main()
