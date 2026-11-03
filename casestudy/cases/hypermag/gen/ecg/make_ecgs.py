#!/usr/bin/env python3
"""Draws the hypermagnesemia patient's six 12-lead ECGs and writes notes/ecg.json (chart 'cardiology' records).
The records point at the PNGs with `imageFiles`; gen/assemble.js embeds them as data URLs.
Rebuild everything:   python3 casestudy/cases/hypermag/gen/ecg/make_ecgs.py && node casestudy/cases/hypermag/gen/assemble.js
Numbers match gen/physiology.js (ECG lab lines) and the provider notes. Each record appears when the result is available."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', '..', 'tools'))
import ecg_image as E

PT = dict(name='KESSLER, RAYMOND', mrn='SIM-40318', dob='1952-04-22', age=74, sex='Male')
# acquired, available (chart time), place, reader, params, interpretation lines, summary, body, impression
ECGS = [
 dict(key='0430', acq='2026-11-17 04:30', avail='2026-11-17 04:40', place='Emergency Department', reader='R. Alvarez, MD',
      p=dict(rate=46, pr=0.248, qrs=0.124, qtc=0.468, rhythm='first_degree', t_amp=1.0, seed=11),
      interp=['SINUS BRADYCARDIA', 'FIRST-DEGREE AV BLOCK', 'WIDE QRS (NONSPECIFIC INTRAVENTRICULAR DELAY)', 'ABNORMAL ECG'],
      summary='Sinus bradycardia 46, first-degree AV block (PR 248 ms), wide QRS 124 ms, QTc 468 ms. No peaked T waves.',
      body='**Measurements**\nVentricular rate 46 bpm. PR 248 ms. QRS 124 ms. QT/QTc 534/468 ms.\n\n**Interpretation**\nSinus bradycardia with first-degree AV block and a wide QRS. No peaked T waves. No dropped beats. Correlate clinically and with electrolytes.',
      imp='Sinus bradycardia 46, first-degree AV block, wide QRS. No peaked T waves.'),
 dict(key='1130', acq='2026-11-17 11:30', avail='2026-11-17 11:40', place='5 East, room 14', reader='D. Okafor, MD',
      p=dict(rate=40, pr=0.300, qrs=0.136, qtc=0.480, rhythm='first_degree', t_amp=1.25, p_amp=0.8, seed=12),
      interp=['SINUS BRADYCARDIA', 'MARKED FIRST-DEGREE AV BLOCK', 'WIDE QRS', 'ABNORMAL ECG - WORSE THAN 0430'],
      summary='Sinus bradycardia 40, first-degree AV block (PR 300 ms), QRS 136 ms (wide), QTc 480 ms. No dropped beats.',
      body='**Measurements**\nVentricular rate 40 bpm. PR 300 ms. QRS 136 ms. QT/QTc 588/480 ms.\n\n**Interpretation**\nSinus bradycardia with marked first-degree AV block (PR longer than at 0430) and a wider QRS. No dropped beats. Compared with the 0430 tracing the rate is slower and the PR and QRS are longer.',
      imp='Sinus bradycardia 40, PR 300 ms, QRS 136 ms. Worse than 0430. No dropped beats.'),
 dict(key='1330', acq='2026-11-17 13:30', avail='2026-11-17 13:35', place='5 East, room 14', reader='P. Raman, MD',
      p=dict(rate=38, pr=0.320, qrs=0.148, qtc=0.492, rhythm='wide', peaked=True, t_amp=1.3, p_amp=0.6, seed=13),
      interp=['SINUS BRADYCARDIA', 'MARKED FIRST-DEGREE AV BLOCK', 'VERY WIDE QRS', 'TALL PEAKED T WAVES', 'ABNORMAL ECG - WORSE THAN 1130'],
      summary='Sinus bradycardia 38, first-degree AV block (PR 320 ms), QRS 148 ms (very wide), QTc 492 ms, tall peaked T waves.',
      body='**Measurements**\nVentricular rate 38 bpm. PR 320 ms. QRS 148 ms. QT/QTc 618/492 ms.\n\n**Interpretation**\nSinus bradycardia with marked first-degree AV block and a very wide QRS. Tall, narrow, peaked T waves, most obvious in V2 to V4. P waves are small. Worse than 1130. Correlate with potassium and magnesium.',
      imp='Sinus bradycardia 38, PR 320 ms, QRS 148 ms, tall peaked T waves. Worse than 1130.'),
 dict(key='1830', acq='2026-11-17 18:30', avail='2026-11-17 18:35', place='5 East, room 14', reader='D. Okafor, MD',
      p=dict(rate=66, pr=0.204, qrs=0.108, qtc=0.486, rhythm='sinus', t_amp=0.9, seed=14),
      interp=['SINUS RHYTHM', 'BORDERLINE PROLONGED PR', 'PROLONGED QT', 'ABNORMAL ECG - MUCH IMPROVED'],
      summary='Sinus rhythm 66, PR 204 ms, QRS 108 ms, QTc 486 ms (prolonged).',
      body='**Measurements**\nVentricular rate 66 bpm. PR 204 ms. QRS 108 ms. QT/QTc 463/486 ms.\n\n**Interpretation**\nSinus rhythm. The PR is at the upper limit and the QRS is nearly normal. No peaked T waves. The QT interval is prolonged. Much improved from 1330. Correlate with calcium.',
      imp='Sinus rhythm 66, PR 204 ms, QRS 108 ms, QTc 486 ms (prolonged). Much improved.'),
 dict(key='0230', acq='2026-11-18 02:30', avail='2026-11-18 02:40', place='5 East, room 14', reader='J. Lindgren, MD',
      p=dict(rate=54, pr=0.236, qrs=0.114, qtc=0.478, rhythm='first_degree', t_amp=1.0, seed=15),
      interp=['SINUS BRADYCARDIA', 'FIRST-DEGREE AV BLOCK', 'BORDERLINE WIDE QRS', 'ABNORMAL ECG - PR LONGER THAN 1830'],
      summary='Sinus bradycardia 54, first-degree AV block (PR 236 ms), QRS 114 ms, QTc 478 ms.',
      body='**Measurements**\nVentricular rate 54 bpm. PR 236 ms. QRS 114 ms. QT/QTc 504/478 ms.\n\n**Interpretation**\nSinus bradycardia with first-degree AV block. The rate is slower and the PR longer than at 1830. No peaked T waves. Correlate with magnesium.',
      imp='Sinus bradycardia 54, PR 236 ms, QRS 114 ms. Slower and longer PR than 1830.'),
 dict(key='0600', acq='2026-11-18 06:00', avail='2026-11-18 06:10', place='5 East, room 14', reader='J. Lindgren, MD',
      p=dict(rate=66, pr=0.212, qrs=0.102, qtc=0.462, rhythm='sinus', t_amp=1.0, seed=16),
      interp=['SINUS RHYTHM', 'PR AT UPPER LIMIT OF NORMAL', 'OTHERWISE NORMAL ECG'],
      summary='Sinus rhythm 66, PR 212 ms, QRS 102 ms, QTc 462 ms. Improved.',
      body='**Measurements**\nVentricular rate 66 bpm. PR 212 ms. QRS 102 ms. QT/QTc 440/462 ms.\n\n**Interpretation**\nSinus rhythm. PR at the upper limit of normal; QRS and QT normal. Improved compared with 0230.',
      imp='Sinus rhythm 66, PR 212 ms, QRS 102 ms, QTc 462 ms. Improved.'),
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
