/* Adrenal crisis patient: baseline nursing assessment flowsheet rows (ED 0410 and unit admission 0700 ONLY).
   Assessments after 0700 are done by the students at the bedside (the instructor portrays the findings, see INSTRUCTOR_GUIDE.md). */
const { at, slug } = require('./lib');
// [section, code, label, ED 0410 value, unit 0700 value, abnormal]
const ROWS = [
  ['Neurologic', 'LEVEL_OF_CONSCIOUSNESS', 'Level of Consciousness', 'Lethargic; opens eyes to voice, drifts off; GCS 13 (E3 V4 M6)', 'Drowsy but wakes to voice and stays awake while spoken to; GCS 14 (E4 V4 M6)', true],
  ['Neurologic', 'ORIENTATION', 'Orientation', 'Knows her name; thinks it is "Sunday night at home"', 'Oriented to person and place, not to the date or the events; slow to answer, repeats questions', true],
  ['Neurologic', 'MUSCLE_STRENGTH', 'Muscle Strength', 'Too weak to stand (EMS); moves all four limbs', 'Moves all four limbs against gravity; generalized weakness 4/5, tires quickly; grips equal', true],
  ['Neurologic', 'PUPILS', 'Pupils', 'Equal, round, reactive, 3 mm', 'Equal, round, reactive, 3 mm', false],
  ['Respiratory', 'BREATH_SOUNDS', 'Breath Sounds', 'Clear bilaterally', 'Clear bilaterally', false],
  ['Respiratory', 'RESPIRATORY_PATTERN', 'Respiratory Pattern', 'Regular, slightly fast, 22/min, unlabored', 'Regular, unlabored, 18/min', false],
  ['Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', 'Room air', 'Room air', false],
  ['Cardiac', 'RHYTHM', 'Rhythm', 'Sinus tachycardia 120s on the monitor; tall T waves', 'Sinus tachycardia 104; T waves still tall on the monitor lead; no ectopy', true],
  ['Cardiac', 'PULSES', 'Peripheral Pulses', 'Radial pulses weak (1+) and thready', 'Radial 2+ equal; pedal 1+ equal', true],
  ['Cardiac', 'CAPILLARY_REFILL', 'Capillary Refill', 'About 4 seconds; hands cool', '3 seconds; hands cool to touch', true],
  ['Cardiac', 'JVD', 'Neck Veins (JVD)', 'Flat while lying flat', 'Flat at 30 degrees', true],
  ['Cardiac', 'EDEMA', 'Edema', 'None', 'None', false],
  ['GI', 'ABDOMEN', 'Abdomen', 'Soft, diffusely tender, no guarding or rebound', 'Soft, mild diffuse tenderness, no guarding, no distension', true],
  ['GI', 'BOWEL_SOUNDS', 'Bowel Sounds', 'Hyperactive x4', 'Hyperactive x4', true],
  ['GI', 'NAUSEA', 'Nausea / Vomiting', 'Vomiting at home for 2 days; vomited 150 mL clear/bilious at 0440 in the ED', 'Nauseated; no vomiting since 0440; ondansetron given 0430', true],
  ['GI', 'LAST_BM', 'Bowel Movement / Stool', 'Watery diarrhea 6-8 times a day since Saturday (husband)', 'Liquid brown stool x1 in the ED at 0515 (200 mL), no blood; stool sample not yet collected', true],
  ['GI', 'DIET', 'Diet / Intake', 'Could not keep down food, fluids or her pills since Saturday afternoon; craving salt', 'NPO except ice chips and sips; craving salty food ("I want pickles")', true],
  ['GU', 'URINARY_ELIMINATION', 'Urinary Elimination', 'Voided small amounts at home (husband)', 'Voided 150 mL in the ED at 0450 (bedpan); no catheter; uses bedpan/commode with 1 assist', true],
  ['GU', 'URINE_APPEARANCE', 'Urine Appearance', 'Not seen', 'Dark yellow, clear', true],
  ['Skin', 'SKIN_TURGOR', 'Skin Turgor / Mucous Membranes', 'Skin tents over the sternum; very dry lips and tongue', 'Skin tents slowly (about 3 seconds); dry mucous membranes', true],
  ['Skin', 'SKIN_COLOR', 'Skin Color / Pigmentation', 'Tanned-looking skin in December; dark patches on the gums and inside the cheeks', 'Bronze/tan skin all over (says "I always look tan"); darker skin creases of the palms and knuckles; dark patches on the gums and inside the cheeks; old appendectomy scar darker than the skin', true],
  ['Skin', 'SKIN', 'Skin Integrity / Pressure Areas', 'Intact; bruise on both knees (fell to her knees in the bathroom Sunday)', 'Intact; 3 cm bruises on both knees; sacrum and heels intact', true],
  ['Skin', 'BRADEN', 'Braden Score', 'Not done', '18 (mild risk): weak, drowsy, moist from diarrhea', false],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Mobility', 'Could not stand (EMS carried her to the stretcher)', 'Bed rest; turns herself; NOT safe to stand (dizzy sitting up, BP 98/60 lying)', true],
  ['Pain', 'PAIN_SCORE', 'Pain Score', '6/10 crampy pain all over the belly, plus aching legs and back', '4/10 crampy belly pain; aching thighs', true],
  ['Safety', 'FALL_PRECAUTIONS', 'Fall Precautions', 'Stretcher low, rails up x2', 'High fall risk (confused, dizzy, diuresis, IV): bed alarm on, bed low, call light in reach, non-skid socks, commode at bedside', false],
  ['Safety', 'ISOLATION', 'Isolation Precautions', 'Gown and gloves for diarrhea', 'Contact (enteric) precautions sign on the door; soap-and-water hand hygiene (diarrhea, stool tests pending)', false],
  ['Safety', 'STEROID_HISTORY', 'Steroid Use / Medication Review', 'Husband: "She has Addison\'s. She takes hydrocortisone but she threw it up." No emergency injection at home', 'Home hydrocortisone 15 mg (0700) + 5 mg (1400) and fludrocortisone 0.1 mg daily: no dose kept down since Saturday morning. No emergency injection kit and no medical alert bracelet. Has not seen an endocrinologist for 18 months', true]
];
const TIMES = [['Mon', '04:10', 3], ['Mon', '07:00', 4]];
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
