/* Hypermagnesemia patient: baseline nursing assessment flowsheet rows (ED 0430 and unit admission 0700 ONLY).
   Assessments after 0700 are done by the students at the bedside (the instructor portrays the findings, see INSTRUCTOR_GUIDE.md). */
const { at, slug } = require('./lib');
const ROWS = [
  ['Neurologic', 'LEVEL_OF_CONSCIOUSNESS', 'Level of Consciousness', 'Drowsy, hard to keep awake; opens eyes to voice (EMS: found hard to arouse at home)', 'Drowsy but wakes to voice; falls asleep when not spoken to (RASS -1)', true],
  ['Neurologic', 'ORIENTATION', 'Orientation', 'Knows his name; slow to answer other questions', 'Oriented to person and place, not to the date; slow, slurred speech', true],
  ['Neurologic', 'DEEP_TENDON_REFLEXES', 'Deep Tendon Reflexes', 'Not tested in triage', 'Patellar 1+ and biceps 1+ bilaterally (diminished; normal is 2+)', true],
  ['Neurologic', 'MUSCLE_STRENGTH', 'Muscle Strength', 'Generalized weakness reported by the wife', 'Lifts all four limbs against gravity; weak grip both hands (4-/5), tires quickly', true],
  ['Respiratory', 'BREATH_SOUNDS', 'Breath Sounds', 'Clear, diminished at the bases', 'Clear, diminished at both bases', false],
  ['Respiratory', 'RESPIRATORY_PATTERN', 'Respiratory Pattern', 'Regular, unlabored, 14/min', 'Regular, unlabored, 14/min, normal depth', false],
  ['Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', 'Room air', 'Room air', false],
  ['Cardiac', 'RHYTHM', 'Rhythm', 'Sinus bradycardia with first-degree AV block on the monitor', 'Sinus bradycardia 52 with first-degree AV block (PR 0.26 s); wide QRS; no ectopy', true],
  ['Cardiac', 'JVD', 'Neck Veins (JVD)', 'Flat', 'Flat while lying at 30 degrees', false],
  ['Cardiac', 'EDEMA', 'Edema', 'None', 'No pedal edema', false],
  ['Cardiac', 'CAPILLARY_REFILL', 'Capillary Refill', 'About 3 seconds', '3 seconds, hands warm', false],
  ['GI', 'ABDOMEN', 'Abdomen', 'Soft, mild generalized fullness', 'Soft, mildly distended, non-tender', false],
  ['GI', 'BOWEL_SOUNDS', 'Bowel Sounds', 'Hypoactive', 'Hypoactive x4', true],
  ['GI', 'NAUSEA', 'Nausea / Vomiting', 'Vomited once at 0510 (100 mL, clear); nausea', 'Nauseated, no vomiting since 0510; ondansetron given in the ED 0510', true],
  ['GI', 'LAST_BM', 'Bowel Movement', 'Last bowel movement Fri 11/13 per the wife', 'Last bowel movement Fri 11/13 (4 days), hard stool; uses oxycodone at home', true],
  ['GI', 'DIET', 'Diet / Intake', 'Little to eat or drink for 4 days', 'NPO until the swallow screen; ice chips only', true],
  ['GU', 'URINARY_ELIMINATION', 'Urinary Elimination', 'Voided small amounts at home (wife); no catheter yet', 'Foley 16 Fr placed in the ED at 0610 for hourly output; 130 mL out so far, dark amber', true],
  ['GU', 'URINE_APPEARANCE', 'Urine Appearance', 'Not seen', 'Dark amber, clear, no sediment', true],
  ['Skin', 'SKIN_TURGOR', 'Skin Turgor / Mucous Membranes', 'Skin tents slowly; dry mucous membranes', 'Skin tents over the sternum for 3 seconds; dry mucous membranes; face and chest flushed and warm', true],
  ['Skin', 'SKIN', 'Skin / Pressure Areas', 'Intact', 'Sacrum and heels intact, no redness', false],
  ['Skin', 'BRADEN', 'Braden Score', 'Not done', '17 (mild risk): drowsy, weak', false],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Mobility', 'Bed rest in the ED (too weak to stand)', 'Bed rest, 2 assist to turn, too weak to stand safely', true],
  ['Pain', 'PAIN_SCORE', 'Pain Score', '2/10 low back (chronic)', '2/10 low back, aching', false],
  ['Safety', 'FALL_PRECAUTIONS', 'Fall Precautions', 'Bed low, side rails up x2, call light in reach', 'High fall risk: bed alarm on, bed low, call light in reach, non-skid socks', false],
  ['Safety', 'ASPIRATION', 'Aspiration Precautions', 'NPO', 'NPO; HOB 30 degrees; suction at bedside; bedside swallow screen not yet done', false],
  ['Safety', 'HOME_MEDICATIONS', 'Home Medication / OTC Review', 'Wife says "he takes his regular pills and some stomach medicine"; bottles at home not yet reviewed', 'Wife brought a bag of bottles from home that has NOT yet been reviewed (see handoff); ED list shows lisinopril, metoprolol, furosemide, insulin, gabapentin, oxycodone, aspirin, atorvastatin, pantoprazole', true]
];
const TIMES = [['Tue', '04:30', 3], ['Tue', '07:00', 4]];
function build() {
  const out = [];
  TIMES.forEach(([d, tm, col]) => {
    const t = at(d, tm);
    ROWS.forEach(r => { const val = r[col]; out.push({ id: `assessment_${slug(r[0])}_${slug(r[1])}_${t.replace(/[- :]/g, '_')}`, type: 'assessment', section: r[0], code: r[1], label: r[2], value: val, collected: t, source: col === 3 ? 'ED nursing assessment' : 'Nursing assessment', abnormal: !!r[5] }); });
  });
  return out;
}
module.exports = { build };
if (require.main === module) console.log('assessment rows', build().length);
