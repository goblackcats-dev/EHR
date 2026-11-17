#!/usr/bin/env python3
"""Draws Caleb Mercer's two 12-lead ECGs and writes notes/ecg.json (chart 'cardiology' records).
The records point at the PNGs with `imageFiles`; gen/assemble.js embeds them as data URLs.
Rebuild:   python3 casestudy/cases/dka_inclass/gen/ecg/make_ecgs.py && node casestudy/cases/dka_inclass/gen/assemble.js && node tools/make-prebuilt.js
Numbers match DESIGN.md section 6 (ECG 1 and ECG 2) and gen/physiology.js (ECG lab lines)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', '..', 'tools'))
import ecg_image as E

PT = dict(name='MERCER, CALEB', mrn='SIM-40601', dob='1998-07-22', age=28, sex='Male')
ECGS = [
 dict(key='0200', acq='2027-01-11 02:00', avail='2027-01-11 02:15', place='Emergency Department', reader='F. Lindahl, MD',
      p=dict(rate=122, pr=0.146, qrs=0.090, qt=0.300, rhythm='sinus_tach', peaked=True, t_amp=1.1, seed=61),
      interp=['SINUS TACHYCARDIA', 'PEAKED NARROW T WAVES V2-V4, CONSIDER HYPERKALEMIA', 'NO ST CHANGES', 'ABNORMAL ECG'],
      summary='Sinus tachycardia 122, PR 146 ms, QRS 90 ms, QT/QTc 300/428 ms. Peaked, narrow T waves V2-V4 (potassium 5.6 at 0145).',
      body='**Measurements**\nVentricular rate 122 bpm. PR 146 ms. QRS 90 ms. QT/QTc 300/428 ms (Bazett: RR 60/122 = 0.492 s; 0.300 / 0.701 = 0.428).\n\n**Interpretation**\nSinus tachycardia. Tall, narrow, peaked T waves in V2 to V4. P waves present; PR and QRS normal (no signs of severe hyperkalemia). No ST changes. No arrhythmia.\n\n**Context**\nDKA. Potassium 5.6 at 0145. Acidosis and no insulin move potassium out of the cells; total body potassium is low. Insulin will move it back in: watch the potassium closely once the insulin starts.',
      imp='Sinus tachycardia 122 with peaked T waves V2-V4, consistent with potassium 5.6. QTc 428 ms.'),
 dict(key='1505', acq='2027-01-11 15:05', avail='2027-01-11 15:15', place='Step-Down Unit, room SD-3', reader='H. Ashworth, MD',
      p=dict(rate=98, pr=0.150, qrs=0.088, qt=0.360, rhythm='sinus', t_amp=0.3, u_amp=0.12, pvc_beats=[4, 12], seed=62),
      interp=['NORMAL SINUS RHYTHM WITH 2 PREMATURE VENTRICULAR COMPLEXES', 'FLATTENED T WAVES, U WAVES V2-V3', 'CONSIDER HYPOKALEMIA', 'ABNORMAL ECG'],
      summary='Sinus rhythm 98, PR 150 ms, QRS 88 ms, QT/QTc 360/460 ms. Flattened T waves, U waves V2-V3, 2 PVCs (potassium 3.2 at 1400).',
      body='**Measurements**\nVentricular rate 98 bpm. PR 150 ms. QRS 88 ms. QT/QTc 360/460 ms (Bazett: RR 0.612 s; 0.360 / 0.782 = 0.460).\n\n**Interpretation**\nSinus rhythm. Low, flat T waves with U waves after them, best in V2 and V3. Two premature ventricular complexes on the strip. Compared with 0200: rate slower (122 to 98), the peaked T waves are gone and a low-potassium pattern has appeared.\n\n**Context**\nPotassium 5.6 (0145), 4.6 (0500), 3.9 (0930), 3.2 (1400) on the insulin infusion; magnesium 1.6. Insulin and D10W held at 1500; KCl riders one at a time; magnesium sulfate 2 g. Avoid ondansetron and other QT-prolonging drugs until K and QTc improve.',
      imp='Sinus rhythm 98 with flat T waves, U waves and 2 PVCs, consistent with potassium 3.2. QTc 460 ms.'),
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
