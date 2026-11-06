#!/usr/bin/env python3
"""Draws Marcus Reyes's four 12-lead ECGs and writes notes/ecg.json (chart 'cardiology' records).
The records point at the PNGs with `imageFiles`; gen/assemble.js embeds them as data URLs.
Rebuild everything:   python3 casestudy/cases/dka4_marcus/gen/ecg/make_ecgs.py && node casestudy/cases/dka4_marcus/gen/assemble.js && node tools/make-prebuilt.js
Numbers match gen/physiology.js (ECG lab lines), DESIGN.md and the notes. QTc values are Fridericia (as in the design): QT = QTc x RR^(1/3).
Each record appears when the result is available.
Design choice (kept from the source table): at potassium 5.8 and 5.2 the T waves are NOT peaked; a normal-looking ECG does not exclude hyperkalemia.
At K 3.4 the T waves are mildly flattened with at most tiny U waves (the source says no prominent U waves)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', '..', 'tools'))
import ecg_image as E

PT = dict(name='REYES, MARCUS', mrn='SIM-40504', dob='1995-04-18', age=31, sex='Male')

def qt_frid(rate, qtc):
    rr = 60.0 / rate
    return qtc * rr ** (1.0 / 3.0)

ECGS = [
 dict(key='0210', acq='2026-11-05 02:10', avail='2026-11-05 02:20', place='Emergency Department', reader='W. Cole, MD', rate=116, pr=0.152, qrs=0.090, qtc=0.426,
      p=dict(rhythm='sinus_tach', t_amp=1.0, seed=61),
      interp=['SINUS TACHYCARDIA', 'NO PEAKED T WAVES, NO QRS WIDENING', 'NO ISCHEMIC CHANGES', 'ABNORMAL ECG'],
      summary='Sinus tachycardia 116, PR 152 ms, QRS 90 ms, QTc 426 ms (Fridericia). No tall narrow peaked T waves, no loss of P waves, no QRS widening (potassium 5.8 at 0200). A normal-looking tracing does not exclude hyperkalemia.',
      body='**Measurements**\nVentricular rate 116 bpm. PR 152 ms. QRS 90 ms. QTc 426 ms (Fridericia).\n\n**Interpretation**\nSinus tachycardia. No tall, narrow, peaked T waves, no loss of P waves and no conduction widening. No ST or T-wave pattern of ischemia, no arrhythmia.\n\n**Context**\nDKA with potassium 5.8 (released 0220). A normal-looking tracing does not exclude hyperkalemia, and insulin will move potassium into the cells while total body potassium is low. Continue cardiac monitoring; no potassium or bicarbonate now.',
      imp='Sinus tachycardia 116 without peaked T waves or QRS widening at potassium 5.8. QTc 426 ms.'),
 dict(key='1105', acq='2026-11-05 11:05', avail='2026-11-05 11:10', place='Step-Down / Telemetry', reader='C. Lombardi, MD', rate=92, pr=0.156, qrs=0.088, qtc=0.438,
      p=dict(rhythm='sinus', t_amp=0.35, u_amp=0.05, seed=62),
      interp=['NORMAL SINUS RHYTHM', 'MILD NONSPECIFIC T-WAVE FLATTENING', 'CONSIDER LOW POTASSIUM', 'ABNORMAL ECG'],
      summary='Sinus rhythm 92, PR 156 ms, QRS 88 ms, QTc 438 ms (Fridericia). Mild nonspecific T-wave flattening; no prominent U waves, no ectopy (potassium 3.4 at 1040).',
      body='**Measurements**\nVentricular rate 92 bpm. PR 156 ms. QRS 88 ms. QTc 438 ms (Fridericia; any U wave is identified separately and not included in the QT).\n\n**Interpretation**\nSinus rhythm. Mild nonspecific T-wave flattening with at most a tiny U wave; no prominent U waves and no ventricular ectopy. Compared with 0210: rate slower (116 to 92) and the T waves are lower.\n\n**Context**\nPotassium 4.2 (0640), 3.6 (0840), 3.4 (1040, released 1100) on the insulin infusion, with AKI on CKD. Replace cautiously, keep him on telemetry, and never infer a normal potassium from the ECG alone.',
      imp='Sinus rhythm 92. Mild nonspecific T-wave flattening at potassium 3.4. QTc 438 ms.'),
 dict(key='1855', acq='2026-11-05 18:55', avail='2026-11-05 19:00', place='Step-Down / Telemetry', reader='C. Lombardi, MD', rate=88, pr=0.158, qrs=0.088, qtc=0.424,
      p=dict(rhythm='sinus', t_amp=1.0, seed=63),
      interp=['NORMAL SINUS RHYTHM', 'NORMAL ECG'],
      summary='Normal sinus rhythm 88, PR 158 ms, QRS 88 ms, QTc 424 ms (Fridericia). Normal T-wave contour; no ischemic or conduction change (potassium 4.6 at 1840).',
      body='**Measurements**\nVentricular rate 88 bpm. PR 158 ms. QRS 88 ms. QTc 424 ms (Fridericia).\n\n**Interpretation**\nNormal sinus rhythm. Normal T-wave contour; no ischemic or conduction change, no ectopy. Compared with 1105: the T-wave flattening has resolved.\n\n**Context**\nPotassium 4.6 on the 1840 specimen (released 1900), after 20 mEq of potassium chloride. Continue telemetry.',
      imp='Normal sinus rhythm 88. Normal T-wave contour. QTc 424 ms.'),
 dict(key='1910', acq='2026-11-06 19:10', avail='2026-11-06 19:20', place='Step-Down / Telemetry', reader='C. Lombardi, MD', rate=80, pr=0.160, qrs=0.090, qtc=0.422,
      p=dict(rhythm='sinus', t_amp=1.0, seed=64),
      interp=['NORMAL SINUS RHYTHM', 'NO PEAKED T WAVES, NO QRS WIDENING', 'NORMAL ECG'],
      summary='Sinus rhythm 80, PR 160 ms, QRS 90 ms, QTc 422 ms (Fridericia). No peaked T waves or QRS widening despite mild hyperkalemia (potassium 5.2 at 1840); continue laboratory surveillance.',
      body='**Measurements**\nVentricular rate 80 bpm. PR 160 ms. QRS 90 ms. QTc 422 ms (Fridericia).\n\n**Interpretation**\nSinus rhythm. No peaked T waves, no PR prolongation and no QRS widening despite the mildly high potassium.\n\n**Context**\nPotassium 5.2 on the 1840 specimen (released 1900). This tracing is reassuring but does not replace laboratory surveillance: a repeat potassium is pending. Continue telemetry.',
      imp='Sinus rhythm 80 without peaked T waves or QRS widening at potassium 5.2. QTc 422 ms.'),
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
