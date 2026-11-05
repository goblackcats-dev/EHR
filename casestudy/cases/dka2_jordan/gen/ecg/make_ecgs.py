#!/usr/bin/env python3
"""Draws Jordan Ellis's two 12-lead ECGs and writes notes/ecg.json (chart 'cardiology' records).
The records point at the PNGs with `imageFiles`; gen/assemble.js embeds them as data URLs.
Rebuild everything:   python3 casestudy/cases/dka2_jordan/gen/ecg/make_ecgs.py && node casestudy/cases/dka2_jordan/gen/assemble.js && node tools/make-prebuilt.js
Numbers match gen/physiology.js (ECG lab lines), DESIGN.md and the provider notes. Each record appears when the result is available."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', '..', 'tools'))
import ecg_image as E

PT = dict(name='ELLIS, JORDAN', mrn='SIM-40502', dob='2002-03-22', age=24, sex='Male')
ECGS = [
 dict(key='0115', acq='2026-12-14 01:15', avail='2026-12-14 01:35', place='Emergency Department', reader='R. Castillo, MD',
      p=dict(rate=118, pr=0.148, qrs=0.088, qtc=0.448, rhythm='sinus_tach', peaked=True, t_amp=1.1, seed=41),
      interp=['SINUS TACHYCARDIA', 'TALL NARROW T WAVES V2-V4, CONSIDER HYPERKALEMIA', 'NO ST CHANGES', 'ABNORMAL ECG'],
      summary='Sinus tachycardia 118, PR 148 ms, QRS 88 ms, QT/QTc 320/448 ms. Tall, narrow T waves V2-V4 (potassium 5.4 at 0045).',
      body='**Measurements**\nVentricular rate 118 bpm. PR 148 ms. QRS 88 ms. QT/QTc 320/448 ms.\n\n**Interpretation**\nSinus tachycardia. Tall, narrow T waves in V2 to V4. P waves present, PR and QRS normal: no signs of severe hyperkalemia. No ST changes, no arrhythmia.\n\n**Context**\nDKA, potassium 5.4 at 0045 (resulted 0130). No potassium in the fluids until K is 5.0 or lower; recheck in 2 hours. Insulin will move potassium into the cells: the total body potassium is low.',
      imp='Sinus tachycardia 118 with tall T waves V2-V4, consistent with potassium 5.4. QTc 448 ms.'),
 dict(key='1935', acq='2026-12-14 19:35', avail='2026-12-14 19:45', place='Medical IMCU, room 6', reader='P. Raman, MD',
      p=dict(rate=92, pr=0.152, qrs=0.088, qtc=0.468, rhythm='sinus', t_amp=0.3, u_amp=0.16, seed=42),
      interp=['NORMAL SINUS RHYTHM', 'FLATTENED T WAVES, PROMINENT U WAVES V2-V3', 'CONSIDER HYPOKALEMIA', 'ABNORMAL ECG'],
      summary='Sinus rhythm 92, PR 152 ms, QRS 88 ms, QT/QTc 378/468 ms. Flattened T waves with prominent U waves V2-V3 (potassium 3.3 at 1830).',
      body='**Measurements**\nVentricular rate 92 bpm. PR 152 ms. QRS 88 ms. QT/QTc 378/468 ms (measured to the end of the T wave; the U wave makes the end of repolarization hard to see).\n\n**Interpretation**\nNormal sinus rhythm. Low, flat T waves with rounded U waves after them, best in V2 and V3. No ectopy. Compared with 0115: rate slower (118 to 92), the tall T waves are gone and a low-potassium pattern has appeared.\n\n**Context**\nPotassium 5.4 (0045), 4.6 (0300), 4.1 (0630), 3.8 (1030), 3.6 (1430), 3.3 (1830) on the insulin infusion; magnesium 1.7. Insulin infusion held at 1920; potassium chloride riders 10 mEq/h through the second IV; magnesium 2 g. STAT BMP 2130. Keep on the cardiac monitor.',
      imp='Normal sinus rhythm 92. Flattened T waves and U waves, consistent with potassium 3.3. No arrhythmia.'),
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
                     'imageFiles': [{'file': rel, 'caption': f"12-lead ECG acquired {e['acq']} (simulated)", 'alt': f"Simulated 12-lead ECG tracing from {e['acq']}: " + e['summary']}]})
        print(f"{rel}: {len(png) / 1024:.0f} KB")
    json.dump(recs, open(os.path.join(HERE, '..', '..', 'notes', 'ecg.json'), 'w'), indent=1)

if __name__ == '__main__':
    main()
