#!/usr/bin/env python3
"""Draws the adrenal crisis patient's two 12-lead ECGs and writes notes/ecg.json (chart 'cardiology' records).
The records point at the PNGs with `imageFiles`; gen/assemble.js embeds them as data URLs.
Rebuild everything:   python3 casestudy/cases/addison/gen/ecg/make_ecgs.py && node casestudy/cases/addison/gen/assemble.js && node tools/make-prebuilt.js
Numbers match gen/physiology.js (ECG lab lines), DESIGN.md and the provider notes. Each record appears when the result is available."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', '..', 'tools'))
import ecg_image as E

PT = dict(name='MITCHELL, LAUREN', mrn='SIM-40422', dob='1980-05-14', age=46, sex='Female')
ECGS = [
 dict(key='0425', acq='2026-12-07 04:25', avail='2026-12-07 04:35', place='Emergency Department', reader='A. Brennan, MD',
      p=dict(rate=118, pr=0.148, qrs=0.088, qtc=0.428, rhythm='sinus_tach', peaked=True, t_amp=1.25, seed=21),
      interp=['SINUS TACHYCARDIA', 'TALL PEAKED T WAVES V2-V4, CONSIDER HYPERKALEMIA', 'NO ST ELEVATION', 'ABNORMAL ECG'],
      summary='Sinus tachycardia 118, PR 148 ms, QRS 88 ms, QTc 428 ms. Tall, narrow, peaked T waves V2-V4 (correlate with potassium).',
      body='**Measurements**\nVentricular rate 118 bpm. PR 148 ms. QRS 88 ms. QT/QTc 305/428 ms.\n\n**Interpretation**\nSinus tachycardia. Tall, narrow, symmetric ("tented") T waves, most obvious in V2 to V4. PR and QRS are normal and P waves are present: no signs of severe hyperkalemia (no wide QRS, no loss of P waves). No ST elevation. Correlate with the potassium level (drawn 0406).',
      imp='Sinus tachycardia 118 with peaked T waves V2-V4, consistent with hyperkalemia. Normal PR and QRS.'),
 dict(key='1330', acq='2026-12-07 13:30', avail='2026-12-07 13:40', place='4 West, room 22', reader='R. Delacroix, MD',
      p=dict(rate=94, pr=0.152, qrs=0.086, qtc=0.432, rhythm='sinus', t_amp=0.9, seed=22),
      interp=['NORMAL SINUS RHYTHM', 'NORMAL T WAVES', 'NORMAL ECG', 'PEAKED T WAVES OF 0425 HAVE RESOLVED'],
      summary='Sinus rhythm 94, PR 152 ms, QRS 86 ms, QTc 432 ms. T waves normal; the peaked T waves of 0425 have resolved.',
      body='**Measurements**\nVentricular rate 94 bpm. PR 152 ms. QRS 86 ms. QT/QTc 345/432 ms.\n\n**Interpretation**\nNormal sinus rhythm. T waves now normal in height and shape in V2 to V4. Compared with 0425: heart rate slower (118 to 94) and the peaked T waves have resolved (potassium 6.0 to 4.9).',
      imp='Normal sinus rhythm 94. Peaked T waves resolved. Normal ECG.'),
]

def main():
    recs = []
    for e in ECGS:
        png = E.render_ecg(patient=PT, when=e['acq'], location=e['place'], interpretation=e['interp'], status='Confirmed', width_px=1600, **e['p'])
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
