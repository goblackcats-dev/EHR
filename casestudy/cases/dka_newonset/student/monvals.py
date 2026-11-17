"""Bedside monitor values for Nora Whitcombe at each checkpoint (monitor.html NORA rows) plus the bedside glucoses the instructor says aloud
(DESIGN.md section 7 / INSTRUCTOR_GUIDE.md part C). Checked by check_facts.py against monitor.html. MAP = (SBP + 2 x DBP) / 3, rounded."""
MON = {
 1: dict(clock='Mon 0700', temp='98.6', hr='106', bp='110/66', map='81', rr='24, deep', spo2='99% room air', pain='4/10 crampy belly',
         rhythm='Sinus tachycardia, T waves slightly tall', glucose='274 (0700, also charted)', aloud='0700 274 (charted). Next check 0800. Last void at 0610: 400 mL.'),
 2: dict(clock='Mon 1100', temp='98.4', hr='96', bp='112/68', map='83', rr='20, still a little deep', spo2='99% room air', pain='2/10 belly',
         rhythm='Sinus rhythm', glucose='186 (0800 222, 0900 204, 1000 192)', aloud='0800 222, 0900 204, 1000 192, 1100 186.'),
 3: dict(clock='Mon 1500', temp='98.6', hr='90', bp='114/70', map='85', rr='18', spo2='99% room air', pain='1/10 calf cramps',
         rhythm='Sinus rhythm, T waves a little lower, no U waves', glucose='166 (1200 180, 1300 174, 1400 170)', aloud='1200 180, 1300 174, 1400 170, 1500 166.'),
 4: dict(clock='Mon 1900', temp='98.4', hr='94', bp='118/74', map='89', rr='18 (crying)', spo2='99% room air', pain='0/10',
         rhythm='Sinus rhythm, T waves near normal', glucose='168 (1600 162, 1700 168, 1800 170)', aloud='1600 162 (her own check), 1700 168, 1800 170, 1900 168 (before dinner).'),
 5: dict(clock='Mon 2300', temp='98.2', hr='92', bp='114/72', map='86', rr='18', spo2='98% room air', pain='0/10',
         rhythm='Sinus rhythm, normal T waves', glucose='148 at 2200 (2000 178, 2100 166)', aloud='2000 178, 2100 166 (drip off), 2200 148 (bedtime). Ate about 70% of dinner; fast hallway laps 2215-2255; snack declined at 2255.'),
 6: dict(clock='Tue 0300', temp='97.9', hr='108', bp='126/76', map='93', rr='18', spo2='98% room air', pain='2/10 headache',
         rhythm='Sinus tachycardia', glucose='58 (then 66 at 0317, 94 at 0333)', aloud='0300 58. After 4 glucose tablets (0302): 0317 66. After 4 oz juice (0318): 0333 94. Mid monitor row 0335: HR 90, BP 118/72, RR 16.'),
 7: dict(clock='Tue 0700', temp='98.2', hr='78', bp='114/70', map='85', rr='14', spo2='99% room air', pain='0/10',
         rhythm='Sinus rhythm', glucose='122 fasting (0400 118)', aloud='0400 118, 0700 122 (fasting). Weight 0600: 56.2 kg.'),
}
# the 0335 mid row (after two rounds of 15 g) for the 0300 stop
MID = dict(clock='Tue 0335', hr='90', bp='118/72', rr='16')
# urine and I&O for each 4-hour block, from patient.json ioEvents (checked)
UO = {
 1: 'ED 0300-0700: in 1,522 (0.9% NaCl 1,500 + insulin 22) / out 900: voids 0420 500, 0610 400. Whole ED stay 0140-0700: in 2,522 / out 1,500 (emesis 150 at 0215).',
 2: '0700-1100: in 941 (IV fluid 709, IV med 172, ice chips 60) / out 900: voids 0800 350, 0945 300, 1050 250 (about 225 mL/h).',
 3: '1100-1500: in 1,312 (oral 540, IV fluid 600, IV med 172) / out 850: voids 1150 300, 1330 300, 1450 250 (about 213 mL/h).',
 4: '1500-1900: in 1,544 (oral 480, IV fluid 600, IV med 464 = insulin 22 + riders 392 + MgSO4 50) / out 700: voids 1600 250, 1730 250, 1850 200.',
 5: '1900-2300: in 679 (oral 360, IV fluid 300, IV med 19) / out 550: voids 2030 300, 2240 250.',
 6: '2300-0300: in 120 (water at 0100) / out 300: void 0130 300 (75 mL/h).',
 7: '0300-0700: in 480 (juice 120, milk 120, water 240) / out 600: voids 0420 300, 0640 300. Daily weight 0600: 56.2 kg (55.0 on arrival).',
}
