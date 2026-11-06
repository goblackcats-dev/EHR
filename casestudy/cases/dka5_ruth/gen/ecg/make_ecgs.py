#!/usr/bin/env python3
"""Draws Ruth Nakamura's four 12-lead ECGs and writes notes/ecg.json (chart 'cardiology' records).
The records point at the PNGs with `imageFiles`; gen/assemble.js embeds them as data URLs.
Rebuild everything:   python3 casestudy/cases/dka5_ruth/gen/ecg/make_ecgs.py && node casestudy/cases/dka5_ruth/gen/assemble.js && node tools/make-prebuilt.js
Numbers match the design's ECG table (rate, PR, QRS, QTc), gen/physiology.js (ECG lab lines), DESIGN.md and the notes. QTc values are Fridericia: QT = QTc x RR^(1/3).
Each record appears when the result is available.
Potassium match: K 4.8 (0115) normal T; K 3.3 (0705) flattened T (t_amp 0.2) with small U waves (u_amp 0.10); K 4.0 after replacement (1115) normal; K 4.0 on Day 2 (1900) normal."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', '..', 'tools'))
import ecg_image as E

PT = dict(name='NAKAMURA, RUTH', mrn='SIM-40505', dob='1959-04-18', age=67, sex='Female')

def qt_frid(rate, qtc):
    rr = 60.0 / rate
    return qtc * rr ** (1.0 / 3.0)

ECGS = [
 dict(key='0115', acq='2026-11-05 01:15', avail='2026-11-05 01:30', place='Emergency Department', reader='T. Quillen, MD', rate=118, pr=0.156, qrs=0.086, qtc=0.445,
      allow=['0320'], p=dict(rhythm='sinus_tach', t_amp=1.0, seed=71),
      interp=['SINUS TACHYCARDIA', 'NORMAL T-WAVE CONTOUR, NO PEAKING', 'NO ISCHEMIC ST CHANGES', 'ABNORMAL ECG'],
      summary='Sinus tachycardia 118, PR 156 ms, QRS 86 ms, QTc 445 ms (Fridericia). Normal T-wave contour without peaking, no ischemic ST pattern (potassium 4.8 on the first specimen). A normal serum potassium does not exclude a large whole-body deficit.',
      body='**Measurements**\nVentricular rate 118 bpm. PR 156 ms. QRS 86 ms. QTc 445 ms (Fridericia).\n\n**Interpretation**\nSinus tachycardia. Normal T-wave contour without pathological peaking, no QRS widening, no ischemic ST pattern, no arrhythmia.\n\n**Context**\nDKA with sepsis; potassium 4.8 on the first specimen (released 0130). Insulin will move potassium into the cells while the total body potassium is low, so the level is expected to fall: recheck at 0320 and keep her on telemetry.',
      imp='Sinus tachycardia 118 with normal T waves at potassium 4.8. QTc 445 ms.'),
 dict(key='0705', acq='2026-11-05 07:05', avail='2026-11-05 07:15', place='Intensive Care Unit', reader='I. Bergstrom, MD', rate=104, pr=0.164, qrs=0.088, qtc=0.462,
      p=dict(rhythm='sinus_tach', t_amp=0.2, u_amp=0.10, seed=72),
      interp=['SINUS TACHYCARDIA', 'DIFFUSE T-WAVE FLATTENING WITH SMALL U WAVES', 'CONSIDER LOW POTASSIUM', 'ABNORMAL ECG'],
      summary='Sinus tachycardia 104, PR 164 ms, QRS 88 ms, QTc 462 ms (Fridericia, U wave excluded). Mild diffuse T-wave flattening with small U waves; no QRS widening or ventricular ectopy (potassium 3.3).',
      body='**Measurements**\nVentricular rate 104 bpm. PR 164 ms. QRS 88 ms. QTc 462 ms (Fridericia; the U wave is identified separately and is not included in the QT).\n\n**Interpretation**\nSinus tachycardia. Mild diffuse T-wave flattening with small U waves best seen in V2-V4. No QRS widening, no ventricular ectopy. Compared with 0115: rate slower (118 to 104) and the T waves are lower with new U waves.\n\n**Context**\nPotassium 3.3 on the 0650 specimen (released 0700), magnesium 1.6, on an insulin infusion. Do not mistake a U wave for the end of the T wave when measuring the QT. Correct both deficits, hold the insulin until the potassium is safe, and keep her on telemetry.',
      imp='Sinus tachycardia 104. Flattened T waves with small U waves at potassium 3.3. QTc 462 ms.'),
 dict(key='1115', acq='2026-11-05 11:15', avail='2026-11-05 11:25', place='Intensive Care Unit', reader='I. Bergstrom, MD', rate=96, pr=0.160, qrs=0.086, qtc=0.446,
      allow=['1450'], p=dict(rhythm='sinus', t_amp=1.0, seed=73),
      interp=['NORMAL SINUS RHYTHM', 'NORMAL T-WAVE CONTOUR, NO U WAVES', 'NORMAL ECG'],
      summary='Sinus rhythm 96, PR 160 ms, QRS 86 ms, QTc 446 ms (Fridericia). T waves have recovered, no distinct U waves, no ectopy (potassium 4.0 at 1100, after 40 mEq of unit potassium).',
      body='**Measurements**\nVentricular rate 96 bpm. PR 160 ms. QRS 86 ms. QTc 446 ms (Fridericia).\n\n**Interpretation**\nSinus rhythm. Normal T-wave contour, no distinct U waves, no conduction abnormality, no ectopy. Compared with 0705: rate slower (104 to 96), the flat T waves and U waves have resolved.\n\n**Context**\nPotassium 4.0 on the 1100 specimen (released 1110), after 40 mEq of potassium chloride over 4 hours. Magnesium 1.6 is being replaced. Continue telemetry; the potassium will be rechecked with the 1450 panel.',
      imp='Normal sinus rhythm 96. T waves recovered, no U waves at potassium 4.0. QTc 446 ms.'),
 dict(key='1900', acq='2026-11-06 19:00', avail='2026-11-06 19:10', place='Intensive Care Unit', reader='I. Bergstrom, MD', rate=80, pr=0.166, qrs=0.086, qtc=0.438,
      p=dict(rhythm='sinus', t_amp=1.0, seed=74),
      interp=['NORMAL SINUS RHYTHM', 'NORMAL T-WAVE AMPLITUDE, NO U WAVES', 'NORMAL ECG'],
      summary='Sinus rhythm 80, PR 166 ms, QRS 86 ms, QTc 438 ms (Fridericia). Normal T-wave amplitude, U waves no longer apparent, narrow QRS (potassium 4.0 on the 1850 specimen).',
      body='**Measurements**\nVentricular rate 80 bpm. PR 166 ms. QRS 86 ms. QTc 438 ms (Fridericia).\n\n**Interpretation**\nSinus rhythm. Normal T-wave amplitude and contour; the U waves seen on Day 1 are gone; narrow QRS; no ectopy. Compared with the Day 1 0705 tracing: rate 104 to 80 and the low-potassium pattern has resolved.\n\n**Context**\nPotassium 4.0 on the latest panel (released 1900) with no potassium given since Day 1 and normal intake. Telemetry can continue while she remains in the ICU.',
      imp='Normal sinus rhythm 80. Normal T waves, no U waves at potassium 4.0. QTc 438 ms.')
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
                     'allowTimes': e.get('allow', []), 'study': f"ECG 12 lead, acquired {e['acq'][11:]}", 'impression': e['imp'],
                     'imageFiles': [{'file': rel, 'caption': f"12-lead ECG acquired {e['acq']}", 'alt': f"12-lead ECG tracing from {e['acq']}: " + e['summary']}]})
        print(f"{rel}: {len(png) / 1024:.0f} KB  QT {qt_frid(e['rate'], e['qtc']) * 1000:.0f} ms")
    json.dump(recs, open(os.path.join(HERE, '..', '..', 'notes', 'ecg.json'), 'w'), indent=1)

if __name__ == '__main__':
    main()
