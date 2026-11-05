#!/usr/bin/env python3
"""Draws Maya Thompson's two 12-lead ECGs and writes notes/ecg.json (chart 'cardiology' records).
The records point at the PNGs with `imageFiles`; gen/assemble.js embeds them as data URLs.
Rebuild everything:   python3 casestudy/cases/dka1_maya/gen/ecg/make_ecgs.py && node casestudy/cases/dka1_maya/gen/assemble.js && node tools/make-prebuilt.js
Numbers match gen/physiology.js (ECG lab lines), DESIGN.md and the provider notes. Each record appears when the result is available."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', '..', 'tools'))
import ecg_image as E

PT = dict(name='THOMPSON, MAYA', mrn='SIM-40501', dob='2010-08-19', age=16, sex='Female')
ECGS = [
 dict(key='0300', acq='2026-12-07 03:00', avail='2026-12-07 03:10', place='Pediatric Emergency Department', reader='N. Adeyemi, MD',
      p=dict(rate=128, pr=0.136, qrs=0.082, qtc=0.452, rhythm='sinus_tach', peaked=True, t_amp=1.15, seed=31),
      interp=['SINUS TACHYCARDIA', 'TALL PEAKED T WAVES V2-V4, CONSIDER HYPERKALEMIA', 'NO ST CHANGES', 'ABNORMAL ECG'],
      summary='Sinus tachycardia 128, PR 136 ms, QRS 82 ms, QTc 452 ms. Tall, narrow, peaked T waves V2-V4 (potassium 5.6 at 0220).',
      body='**Measurements**\nVentricular rate 128 bpm. PR 136 ms. QRS 82 ms. QT/QTc 310/452 ms.\n\n**Interpretation**\nSinus tachycardia. Tall, narrow, peaked T waves in V2 to V4. P waves present, PR and QRS normal: no signs of severe hyperkalemia. QTc borderline long (common in DKA; recheck after treatment). No ST changes.\n\n**Context**\nSevere DKA, potassium 5.6 at 0220 (resulted 0300). Insulin will move potassium into the cells quickly: the body is actually low on potassium. Add potassium to the fluids once K is under 5.5 and she is voiding.',
      imp='Sinus tachycardia 128 with peaked T waves V2-V4, consistent with potassium 5.6. QTc 452 ms.'),
 dict(key='1730', acq='2026-12-07 17:30', avail='2026-12-07 17:45', place='PICU, room 4', reader='E. Whitford, MD',
      p=dict(rate=98, pr=0.140, qrs=0.082, qtc=0.460, rhythm='sinus', t_amp=0.3, u_amp=0.16, seed=32),
      interp=['NORMAL SINUS RHYTHM', 'FLATTENED T WAVES, PROMINENT U WAVES V2-V3', 'CONSIDER HYPOKALEMIA', 'ABNORMAL ECG'],
      summary='Sinus rhythm 98, PR 140 ms, QRS 82 ms, QT/QTc 360/460 ms. Flattened T waves with prominent U waves V2-V3 (potassium 3.3 at 1630).',
      body='**Measurements**\nVentricular rate 98 bpm. PR 140 ms. QRS 82 ms. QT/QTc 360/460 ms (measured to the end of the T wave; the U wave makes the end of repolarization hard to see).\n\n**Interpretation**\nNormal sinus rhythm. T waves now low and flat, with small rounded U waves after them, best in V2 and V3. No ectopy. Compared with 0300: heart rate slower (128 to 98), the peaked T waves are gone and a low-potassium pattern has appeared.\n\n**Context**\nPotassium 5.6 (0220), 4.7 (0430), 3.9 (0830), 3.5 (1140), 3.3 (1630) on the insulin infusion. KCl 10 mEq riders x4 back to back from 1730 (peripheral IV: 10 mEq per hour maximum). Recheck BMP 2030; keep on the cardiac monitor.',
      imp='Normal sinus rhythm 98. Flattened T waves and U waves, consistent with potassium 3.3. No arrhythmia.'),
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
