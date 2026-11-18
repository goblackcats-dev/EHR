#!/usr/bin/env python3
"""Draws Wesley Harcourt's 12-lead ECG (during the autonomic dysreflexia episode) and writes notes/ecg.json (chart 'cardiology' record).
The record points at the PNG with `imageFiles`; gen/assemble.js embeds it as a data URL.
Rebuild:   python3 casestudy/cases/sci_ad/gen/ecg/make_ecgs.py && node casestudy/cases/sci_ad/gen/assemble.js && node tools/make-prebuilt.js
Numbers match DESIGN.md section 10 (ECG) and gen/physiology.js (ECG lab line)."""
import json, os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', '..', 'tools'))
import ecg_image as E

PT = dict(name='HARCOURT, WESLEY', mrn='SIM-40603', dob='1992-10-19', age=34, sex='Male')
QT = round(0.41 * math.sqrt(60 / 50), 3)   # QTc 0.41 at rate 50 (RR 1.2 s) -> QT 0.449 s
ECGS = [
 dict(key='0923', acq='2027-03-08 09:23', avail='2027-03-08 10:15', place='4 West, room 4W-14', reader='T. Langston, MD (Cardiology)',
      p=dict(rate=50, pr=0.18, qrs=0.08, qtc=0.41, rhythm='sinus_brady', t_amp=1.0, seed=43),
      interp=['SINUS BRADYCARDIA', 'OTHERWISE NORMAL ECG'],
      summary='Sinus bradycardia 50, PR 180 ms, QRS 80 ms, QT/QTc 449/410 ms, normal axis. No ST or T-wave changes. Otherwise normal ECG.',
      body=f"**Measurements**\nVentricular rate 50 bpm. PR 180 ms. QRS 80 ms. QT/QTc {round(QT * 1000)}/410 ms (Bazett: RR 60/50 = 1.20 s; square root 1.095; {QT:.3f} / 1.095 = 0.410). Normal axis.\n\n**Interpretation**\nSinus bradycardia, rate 50. Normal PR and QRS. No ST elevation or depression. No T-wave changes. No ectopy. Otherwise normal ECG.\n\n**Context**\nRecorded at 0923 at the bedside during an episode of autonomic dysreflexia (chronic T4 spinal cord injury; BP very high, tubing kink being relieved). The slow rate fits a reflex (vagal) response to the high blood pressure. No signs of ischemia.\n\n**Over-read**\nT. Langston, MD (Cardiology), 1015. Tracing available in the chart at 0930.",
      imp='Sinus bradycardia, 50. Otherwise normal ECG. No ischemic changes.'),
]

def main():
    recs = []
    for e in ECGS:
        png = E.render_ecg(patient=PT, when=e['acq'], location=e['place'], interpretation=e['interp'], status='Confirmed', width_px=1600, noise=0.015, device='12-LEAD ECG', **e['p'])
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
