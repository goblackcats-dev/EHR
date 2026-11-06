#!/usr/bin/env python3
"""Draws Priya Desai's four 12-lead ECGs and writes notes/ecg.json (chart 'cardiology' records).
Rebuild:   python3 casestudy/cases/dka7_priya/gen/ecg/make_ecgs.py && node casestudy/cases/dka7_priya/gen/assemble.js && node tools/make-prebuilt.js
Numbers match gen/physiology.js (ECG lines) and DESIGN.md. Potassium pattern: 0145 K 4.1 (pending when read): sinus tachycardia, normal T; 0710 K 3.2 / Mg 1.5: flat T (t_amp 0.25),
prominent U waves (u_amp 0.12), 0.5 mm ST depression (st_dep 0.05); 0935 K 3.6: T recovering (t_amp 0.55), small U (u_amp 0.05); 1915 K 4.1: normal."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', '..', 'tools'))
import ecg_image as E

PT = dict(name='DESAI, PRIYA', mrn='SIM-40507', dob='1997-05-14', age=29, sex='Female')

ECGS = [
 dict(key='0145', acq='2026-12-28 01:45', avail='2026-12-28 01:55', place='OB Triage / Emergency Department', reader='T. Eskridge, MD', rate=118, pr=0.142, qrs=0.082, qtc=0.432,
      allow=[], p=dict(rhythm='sinus_tach', t_amp=1.0, seed=71),
      interp=['SINUS TACHYCARDIA', 'NORMAL T WAVES, NO U WAVES', 'NO ST DEPRESSION', 'NORMAL INTERVALS FOR PREGNANCY'],
      summary='Sinus tachycardia 118 bpm, PR 142 ms, QRS 82 ms, QTc 432 ms (Bazett). Normal upright T waves, no U waves, no ST depression; rate-related tachycardia from dehydration and ketoacidosis.',
      body='**Measurements**\nVentricular rate 118 bpm. PR 142 ms. QRS 82 ms. QTc 432 ms (Bazett). Axis +40 degrees (mild leftward shift is normal at 28 weeks).\n\n**Interpretation**\nRegular sinus tachycardia, no ectopy. Normal upright T waves in all leads, no U waves, no ST depression or elevation.\n\n**Context**\nRecorded during ketoacidosis with 36 hours of vomiting at 28 weeks 2 days; potassium result pending. Tachycardia is expected from volume depletion and acidosis (and is partly physiologic in pregnancy).',
      imp='Sinus tachycardia 118 bpm. Normal T waves, no U waves. QTc 432 ms.'),
 dict(key='0710', acq='2026-12-28 07:10', avail='2026-12-28 07:20', place='High-Risk Antepartum Unit', reader='T. Eskridge, MD', rate=98, pr=0.164, qrs=0.088, qtc=0.478,
      allow=['0145'], p=dict(rhythm='sinus', t_amp=0.25, u_amp=0.12, st_dep=0.05, seed=72),
      interp=['SINUS RHYTHM', 'FLAT T WAVES WITH PROMINENT U WAVES', 'ST DEPRESSION V4-V6 (0.5 MM)', 'PROLONGED QTc (T-U FUSION)', 'CONSIDER LOW POTASSIUM AND MAGNESIUM'],
      summary='Sinus rhythm 98 bpm, PR 164 ms, QRS 88 ms, QTc 478 ms (Bazett; T-U fusion). Diffusely flattened T waves (I, II, aVL, V3-V6), 0.5 mm ST depression V4-V6 and prominent U waves (1.5 mm V2-V4). Hypokalemia pattern (potassium 3.2, magnesium 1.5); no ectopy.',
      body='**Measurements**\nVentricular rate 98 bpm. PR 164 ms. QRS 88 ms. QTc 478 ms (Bazett; the T and U waves are fused, so this is a QTc/QUc). Axis +35 degrees.\n\n**Interpretation**\nSinus rhythm, no premature beats. Diffusely **flattened T waves** (I, II, aVL, V3-V6), **prominent upright U waves** (1.5 mm in V2-V4, taller than the T wave) and **0.5 mm horizontal ST depression in V4-V6**. Compared with 0145: rate slower (118 to 98), new T flattening, U waves and ST depression.\n\n**Context**\nRecorded at 0710 after the critical potassium of 3.2 mEq/L with magnesium 1.5 mg/dL (insulin infusion running since 0215). The pattern fits insulin-driven hypokalemia with low magnesium. QT-prolonging drugs (ondansetron) should be avoided until potassium and magnesium are corrected. Repeat when the potassium has been replaced.',
      imp='Sinus rhythm 98 with flat T waves, prominent U waves and 0.5 mm ST depression V4-V6 at potassium 3.2. QTc 478 ms (T-U fusion).'),
 dict(key='0935', acq='2026-12-28 09:35', avail='2026-12-28 09:45', place='High-Risk Antepartum Unit', reader='T. Eskridge, MD', rate=90, pr=0.156, qrs=0.086, qtc=0.452,
      allow=['0710'], p=dict(rhythm='sinus', t_amp=0.55, u_amp=0.05, seed=73),
      interp=['SINUS RHYTHM', 'T WAVES RECOVERING, SMALL U WAVES', 'ST SEGMENTS ISOELECTRIC', 'IMPROVED COMPARED WITH 0710'],
      summary='Sinus rhythm 90 bpm, PR 156 ms, QRS 86 ms, QTc 452 ms (Bazett). T waves improving (low but upright in V3-V6), ST segments isoelectric, U waves smaller (0.5 mm). Potassium 3.6 after 20 mEq replacement.',
      body='**Measurements**\nVentricular rate 90 bpm. PR 156 ms. QRS 86 ms. QTc 452 ms (Bazett). Axis +35 degrees.\n\n**Interpretation**\nSinus rhythm. T waves have recovered to low upright waves in V3-V6, ST segments are isoelectric and the U waves are much smaller (0.5 mm). No ectopy. Compared with 0710: ST depression gone, QTc 478 to 452 ms.\n\n**Context**\nRecorded at the insulin restart (potassium 3.6 after two riders of 10 mEq and magnesium 2 g running). Continue potassium replacement to a goal of 4.0 or higher while the insulin runs.',
      imp='Sinus rhythm 90. T waves recovering, small U waves, no ST depression at potassium 3.6. QTc 452 ms.'),
 dict(key='1915', acq='2026-12-28 19:15', avail='2026-12-28 19:25', place='High-Risk Antepartum Unit', reader='T. Eskridge, MD', rate=84, pr=0.148, qrs=0.082, qtc=0.424,
      allow=['0935'], p=dict(rhythm='sinus', t_amp=1.0, seed=74),
      interp=['NORMAL SINUS RHYTHM', 'NORMAL T WAVES, NO U WAVES', 'NORMAL ECG'],
      summary='Normal sinus rhythm 84 bpm, PR 148 ms, QRS 82 ms, QTc 424 ms (Bazett). Normal upright T waves in all leads, no U waves, normal ST segments. Hypokalemic changes resolved (potassium 4.1).',
      body='**Measurements**\nVentricular rate 84 bpm. PR 148 ms. QRS 82 ms. QTc 424 ms (Bazett). Axis +35 degrees.\n\n**Interpretation**\nNormal sinus rhythm. Crisp normal upright T waves in all leads, no U waves, normal ST segments. Complete resolution of the hypokalemic repolarization changes seen at 0710 and 0935.\n\n**Context**\nRecorded after the 1850 panel (potassium 4.1, magnesium 2.0, DKA resolved). Telemetry can continue as ordered.',
      imp='Normal sinus rhythm 84. T waves normal, no U waves. QTc 424 ms.')
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
