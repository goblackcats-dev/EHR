"""Bedside monitor values for Lauren Mitchell at each checkpoint (monitor.html ADDISON rows + the instructor guide: standing values and the bedside glucose
the instructor gives aloud). Checked by check_facts.py against monitor.html. MAP = (SBP + 2 x DBP) / 3, rounded."""
MON = {
 1: dict(clock='Mon 0700', temp='99.4', hr='104', bp='98/60', map='73', rr='18', spo2='98% room air', pain='4/10 crampy belly',
         rhythm='Sinus tachycardia, tall peaked T waves', glucose='88 (0645)', stand='not safe to stand (dizzy sitting up)'),
 2: dict(clock='Mon 1100', temp='99.0', hr='112', bp='94/58', map='70', rr='20', spo2='98% room air', pain='3/10 belly',
         rhythm='Sinus tachycardia (T waves a little less tall)', glucose='58 (142 at 1120 after D50)', stand='not done (lying SBP under 100)'),
 3: dict(clock='Mon 1500', temp='98.8', hr='92', bp='108/66', map='80', rr='16', spo2='99% room air', pain='2/10',
         rhythm='Normal sinus rhythm, normal T waves', glucose='118', stand='94/60, HR 114, dizzy (POSITIVE)'),
 4: dict(clock='Mon 1900', temp='98.6', hr='86', bp='112/70', map='84', rr='16', spo2='99% room air', pain='1/10',
         rhythm='Normal sinus rhythm', glucose='142', stand='104/66, HR 96, no dizziness (negative)'),
 5: dict(clock='Mon 2300', temp='98.4', hr='80', bp='116/72', map='87', rr='16', spo2='98% room air', pain='0/10',
         rhythm='Normal sinus rhythm', glucose='152', stand='112/70, HR 88, no symptoms (negative)'),
 6: dict(clock='Tue 0300', temp='98.2', hr='76', bp='118/74', map='89', rr='14', spo2='98% room air', pain='0/10',
         rhythm='Normal sinus rhythm (T waves a little smaller)', glucose='128', stand='not repeated (just back to bed after the near-fall)'),
 7: dict(clock='Tue 0700', temp='98.2', hr='74', bp='120/76', map='91', rr='14', spo2='99% room air', pain='0/10',
         rhythm='Normal sinus rhythm', glucose='112', stand='116/74, HR 80 (negative)'),
}
# the "previous" row on the 0700 page: last ED set in the chart (0620) and the 0645 bedside glucose
ED_VITALS = dict(clock='ED 0620', temp='99.4', hr='104', bp='96/58', map='71', rr='18', spo2='98% room air', pain='4/10', rhythm='Sinus tachycardia', glucose='88 (0645)', stand='-')
# urine (hat) and I&O for each block, from patient.json ioEvents (checked)
UO = {
 1: 'ED 0335-0700: in 2,700 IV / out 500 (urine 150 at 0450, emesis 150, stool 200). First void on the unit is at 0800 (120 mL).',
 2: '0700-1100: in 660 (IV 600, PO 60) / out 630: voids 0800 120, 0930 140, 1050 120 (380 mL, about 95 mL/h) + liquid stool 250 at 0945.',
 3: '1100-1500: in 770 (IV 650 incl. D50 50, PO 120) / out 1,050: voids 1150 250, 1300 300, 1400 280, 1450 220 = about 260 mL/h of pale urine.',
 4: '1500-1900: in 905 (IV 425, PO 480) / out 1,100: voids 1600 300, 1730 320, 1850 280 (900 mL) + loose stool 200 at 1640.',
 5: '1900-2300: in 1,120 (IV 400, PO 720) / out 700: voids 2000 250, 2130 250, 2250 200.',
 6: '2300-0300: in 640 (IV 400, PO 240) / out 600: voids 0030 250, 0245 200 (450 mL) + soft loose stool 150 at 0240.',
 7: '0300-0700: in 760 (IV 400, PO 360) / out 500: voids 0430 250, 0640 250. Weight 0600: 59.8 kg (58.2 on arrival).',
}
