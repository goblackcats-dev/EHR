#!/usr/bin/env python3
"""Draws Denise Carter's three 12-lead ECGs and writes notes/ecg.json (chart 'cardiology' records).
The records point at the PNGs with `imageFiles`; gen/assemble.js embeds them as data URLs.
Rebuild everything:   python3 casestudy/cases/dka3_denise/gen/ecg/make_ecgs.py && node casestudy/cases/dka3_denise/gen/assemble.js && node tools/make-prebuilt.js
Numbers match gen/physiology.js (ECG lab lines), DESIGN.md and the notes. QTc values are Fridericia (as in the design): QT = QTc x RR^(1/3).
Each record appears when the result is available."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', '..', 'tools'))
import ecg_image as E

PT = dict(name='CARTER, DENISE', mrn='SIM-40503', dob='1988-06-14', age=38, sex='Female')

def qt_frid(rate, qtc):
    rr = 60.0 / rate
    return qtc * rr ** (1.0 / 3.0)

ECGS = [
 dict(key='0205', acq='2026-11-09 02:05', avail='2026-11-09 02:15', place='Emergency Department', reader='A. Shah, MD', rate=122, pr=0.150, qrs=0.086, qtc=0.432,
      p=dict(rhythm='sinus_tach', peaked=True, t_amp=0.95, seed=51),
      interp=['SINUS TACHYCARDIA', 'MILDLY PROMINENT SYMMETRIC T WAVES', 'NO ISCHEMIC CHANGES', 'ABNORMAL ECG'],
      summary='Sinus tachycardia 122, PR 150 ms, QRS 86 ms, QTc 432 ms (Fridericia). Mildly prominent symmetric T waves, narrow QRS, no ischemic changes (potassium 5.3 at 0200).',
      body='**Measurements**\nVentricular rate 122 bpm. PR 150 ms. QRS 86 ms. QTc 432 ms (Fridericia).\n\n**Interpretation**\nSinus tachycardia. Mildly prominent, symmetric T waves with a narrow QRS. P waves present, PR and QRS normal: no sign of significant hyperkalemia. No ST or T-wave pattern of ischemia, no arrhythmia.\n\n**Context**\nDKA, potassium 5.3 at 0200 (resulted 0215). This mild elevation need not produce dramatic ECG changes. Insulin will move potassium into the cells and total body potassium is low: no potassium in the first two bags, recheck at 0445.',
      imp='Sinus tachycardia 122 with mildly prominent symmetric T waves, consistent with potassium 5.3. QTc 432 ms.'),
 dict(key='0805', acq='2026-11-09 08:05', avail='2026-11-09 08:15', place='Step-Down / Telemetry', reader='R. Okonkwo, MD', rate=96, pr=0.158, qrs=0.086, qtc=0.460,
      p=dict(rhythm='sinus', t_amp=0.3, u_amp=0.10, seed=52),
      interp=['NORMAL SINUS RHYTHM', 'FLATTENED T WAVES, SMALL U WAVES', 'CONSIDER HYPOKALEMIA', 'ABNORMAL ECG'],
      summary='Sinus rhythm 96, PR 158 ms, QRS 86 ms, QTc 460 ms (Fridericia). Flattened T waves with small distinct U waves, no ectopy (potassium 3.2, magnesium 1.6 at 0745).',
      body='**Measurements**\nVentricular rate 96 bpm. PR 158 ms. QRS 86 ms. QTc 460 ms (Fridericia; the U wave is identified separately and not included in the QT).\n\n**Interpretation**\nSinus rhythm. Flattened T waves with small, distinct U waves best seen in V2-V3. No ventricular ectopy. Compared with 0205: rate slower (122 to 96), the prominent T waves are gone and a low-potassium pattern has appeared.\n\n**Context**\nPotassium 5.3 (0200), 4.0 (0445), 3.6 (0645), 3.2 (0745, reported 0800) and magnesium 1.6 on the insulin infusion. Correct both deficits and keep her on telemetry. Never infer a normal potassium from the ECG alone.',
      imp='Sinus rhythm 96. Flattened T waves and small U waves, consistent with potassium 3.2 and magnesium 1.6. QTc 460 ms.'),
 dict(key='1855', acq='2026-11-09 18:55', avail='2026-11-09 19:00', place='Step-Down / Telemetry', reader='R. Okonkwo, MD', rate=88, pr=0.160, qrs=0.084, qtc=0.438,
      p=dict(rhythm='sinus', t_amp=1.0, seed=53),
      interp=['NORMAL SINUS RHYTHM', 'NORMAL ECG'],
      summary='Normal sinus rhythm 88, PR 160 ms, QRS 84 ms, QTc 438 ms (Fridericia). Normal T-wave contour, no U waves, no conduction abnormality (potassium 3.9, magnesium 1.9 at 1845).',
      body='**Measurements**\nVentricular rate 88 bpm. PR 160 ms. QRS 84 ms. QTc 438 ms (Fridericia).\n\n**Interpretation**\nNormal sinus rhythm. Normal T-wave contour with no distinct U waves. No conduction abnormality, no ectopy, no ST changes. Compared with 0805: the flat T waves and U waves have resolved and the QTc is shorter.\n\n**Context**\nPotassium 3.9 and magnesium 1.9 on the 1845 specimen (released 1900), after the potassium and magnesium replacement. No later 12-lead ECG is planned unless symptoms or electrolyte abnormalities return.',
      imp='Normal sinus rhythm 88. Normal T waves, no U waves. QTc 438 ms.'),
]

def main():
    recs = []
    for e in ECGS:
        png = E.render_ecg(patient=PT, when=e['acq'], location=e['place'], interpretation=e['interp'], status='Confirmed', width_px=1600, noise=0.015,
                           rate=e['rate'], pr=e['pr'], qrs=e['qrs'], qt=qt_frid(e['rate'], e['qtc']), qtc=e['qtc'], **e['p'])
        rel = f"ecg/ecg_{e['key']}.png"
        open(os.path.join(HERE, f"ecg_{e['key']}.png"), 'wb').write(png)
        recs.append({'id': f"note_ecg_{e['avail'].replace('-', '').replace(' ', '').replace(':', '')}", 'type': 'cardiology', 'title': '12-Lead ECG',
                     'author': e['reader'], 'datetime': e['avail'], 'category': 'Cardiology', 'summary': e['summary'], 'body': e['body'],
                     'study': f"ECG 12 lead, acquired {e['acq'][11:]}", 'impression': e['imp'],
                     'imageFiles': [{'file': rel, 'caption': f"12-lead ECG acquired {e['acq']} (simulated)", 'alt': f"Simulated 12-lead ECG tracing from {e['acq']}: " + e['summary']}]})
        print(f"{rel}: {len(png) / 1024:.0f} KB  QT {qt_frid(e['rate'], e['qtc']) * 1000:.0f} ms")
    json.dump(recs, open(os.path.join(HERE, '..', '..', 'notes', 'ecg.json'), 'w'), indent=1)

if __name__ == '__main__':
    main()
