#!/usr/bin/env python3
"""Draws Nora Whitcombe's 12-lead ECG and writes notes/ecg.json (chart 'cardiology' record).
The record points at the PNG with `imageFiles`; gen/assemble.js embeds it as a data URL.
Rebuild:   python3 casestudy/cases/dka_newonset/gen/ecg/make_ecgs.py && node casestudy/cases/dka_newonset/gen/assemble.js && node tools/make-prebuilt.js
Numbers match DESIGN.md section 6 (ECG 1) and gen/physiology.js (ECG lab line). No second ECG (K never under 3.5 or over 5.5 after arrival)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', '..', 'tools'))
import ecg_image as E

PT = dict(name='WHITCOMBE, NORA', mrn='SIM-40602', dob='2004-09-14', age=22, sex='Female')
ECGS = [
 dict(key='0205', acq='2027-02-08 02:05', avail='2027-02-08 02:15', place='Emergency Department', reader='K. Aldana, MD',
      p=dict(rate=124, pr=0.138, qrs=0.084, qt=0.296, rhythm='sinus_tach', peaked=True, t_amp=1.4, seed=71),
      interp=['SINUS TACHYCARDIA', 'PEAKED NARROW SYMMETRIC T WAVES V2-V4, CONSIDER HYPERKALEMIA', 'NO OTHER CHANGES', 'ABNORMAL ECG'],
      summary='Sinus tachycardia 124, PR 138 ms, QRS 84 ms, QT/QTc 296/426 ms. Peaked, narrow, symmetric T waves V2-V4; hyperkalemia suspected (BMP pending).',
      body='**Measurements**\nVentricular rate 124 bpm. PR 138 ms. QRS 84 ms. QT/QTc 296/426 ms (Bazett: RR 60/124 = 0.484 s; square root 0.696; 0.296 / 0.696 = 0.426).\n\n**Interpretation**\nSinus tachycardia. Tall, narrow, symmetric, peaked T waves in V2 to V4. P waves present; PR and QRS normal (no signs of severe hyperkalemia). No ST changes. No arrhythmia.\n\n**Context**\nSuspected DKA in a 22-year-old with no known diabetes; POC glucose 548. Peaked T waves suggest a high potassium: acidosis and no insulin move potassium out of the cells. BMP pending. Potassium must be known before insulin starts.',
      imp='Sinus tachycardia 124 with peaked T waves V2-V4, suggesting hyperkalemia. QTc 426 ms. BMP pending.'),
]

def main():
    recs = []
    for e in ECGS:
        png = E.render_ecg(patient=PT, when=e['acq'], location=e['place'], interpretation=e['interp'], status='Confirmed', width_px=1600, noise=0.015, **e['p'])
        rel = f"ecg/ecg_{e['key']}.png"
        open(os.path.join(HERE, f"ecg_{e['key']}.png"), 'wb').write(png)
        recs.append({'id': f"note_ecg_{e['avail'].replace('-', '').replace(' ', '').replace(':', '')}", 'type': 'cardiology', 'title': '12-Lead ECG',
                     'author': e['reader'], 'datetime': e['avail'], 'category': 'Cardiology', 'summary': e['summary'], 'body': e['body'],
                     'study': f"ECG 12 lead, acquired {e['acq'][11:]}", 'impression': e['imp'],
                     'imageFiles': [{'file': rel, 'caption': f"12-lead ECG acquired {e['acq']}", 'alt': f"12-lead ECG tracing from {e['acq']}: " + e['summary']}]})
        print(f"{rel}: {len(png) / 1024:.0f} KB")
    json.dump(recs, open(os.path.join(HERE, '..', '..', 'notes', 'ecg.json'), 'w'), indent=1)

if __name__ == '__main__':
    main()
