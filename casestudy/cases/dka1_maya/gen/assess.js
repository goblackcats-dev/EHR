/* DKA patient 1 (Maya Thompson): baseline nursing assessment flowsheet rows (ED 0210 and PICU admission 0700 ONLY).
   Assessments after 0700 are done by the students at the bedside (the instructor portrays the findings, see INSTRUCTOR_NOTES.md). */
const { at, slug } = require('./lib');
// [section, code, label, ED 0210 value, PICU 0700 value, abnormal]
const ROWS = [
  ['Neurologic', 'LEVEL_OF_CONSCIOUSNESS', 'Level of Consciousness', 'Drowsy; opens eyes to voice, answers slowly; GCS 14 (E3 V5 M6)', 'Drowsy but wakes to voice and stays awake while spoken to; GCS 14 (E3 V5 M6)', true],
  ['Neurologic', 'ORIENTATION', 'Orientation', 'Oriented to person and place; not sure of the day', 'Oriented to person and place; says it is "Sunday"; follows commands', true],
  ['Neurologic', 'PUPILS', 'Pupils', 'Equal, round, reactive, 4 mm', 'Equal, round, reactive, 4 mm, brisk', false],
  ['Neurologic', 'HEADACHE', 'Headache', 'Denies headache', 'Denies headache ("just tired"); no vomiting since 0230', false],
  ['Neurologic', 'CEREBRAL_EDEMA_SCREEN', 'Cerebral Edema Warning Signs', 'Not assessed (triage)', 'None now: no headache, HR trending down slowly with fluids (134 to 118), BP 114/70, no new vomiting, GCS 14 unchanged since the ED. Baseline for hourly neuro checks', false],
  ['Neurologic', 'MUSCLE_STRENGTH', 'Muscle Strength', 'Weak; needed help to stand on the scale', 'Moves all four limbs against resistance; generalized weakness 4/5; grips equal', true],
  ['Respiratory', 'RESPIRATORY_PATTERN', 'Respiratory Pattern', 'Deep, fast, regular breathing (Kussmaul), 32/min; no retractions', 'Deep, regular (Kussmaul) breathing 26/min; no retractions or accessory muscle use', true],
  ['Respiratory', 'BREATH_ODOR', 'Breath Odor', 'Fruity (acetone) smell on the breath', 'Fruity (acetone) breath', true],
  ['Respiratory', 'BREATH_SOUNDS', 'Breath Sounds', 'Clear bilaterally', 'Clear bilaterally', false],
  ['Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', 'Room air', 'Room air', false],
  ['Cardiac', 'RHYTHM', 'Rhythm', 'Sinus tachycardia 130s on the monitor; tall T waves', 'Sinus tachycardia 118; T waves normal height on lead II; no ectopy', true],
  ['Cardiac', 'PULSES', 'Peripheral Pulses', 'Radial 2+ but fast; pedal 1+', 'Radial 2+ equal; pedal 2+ equal', true],
  ['Cardiac', 'CAPILLARY_REFILL', 'Capillary Refill', 'About 3-4 seconds; hands and feet cool', '2-3 seconds; hands cool, feet warm', true],
  ['GI', 'ABDOMEN', 'Abdomen', 'Soft, diffusely tender (worst in the upper belly), no guarding or rebound; bowel sounds hypoactive', 'Soft, mild diffuse tenderness, no guarding; bowel sounds present', true],
  ['GI', 'NAUSEA', 'Nausea / Vomiting', 'Vomited 6 times at home since Sunday morning; vomited 150 mL clear fluid at 0230 in the ED', 'Mild nausea; no vomiting since 0230; ondansetron 0235', true],
  ['GI', 'DIET', 'Diet / Intake', 'Very thirsty for weeks (2-3 large sports drinks plus water a day); could not keep fluids down since Sunday morning', 'NPO except ice chips (cerebral edema precautions; fluids by IV only); asks for water often', true],
  ['GU', 'URINARY_ELIMINATION', 'Urinary Elimination', 'Peeing "all the time" for about 5 weeks, up 3-4 times a night; wet the bed once last week', 'Voided 350 mL (0330) and 400 mL (0610) in the ED; no catheter; urinal hat in the bathroom/commode; voids with 1 assist', true],
  ['GU', 'URINE_APPEARANCE', 'Urine Appearance', 'Not seen', 'Pale yellow, clear (large volume)', true],
  ['Skin', 'SKIN_TURGOR', 'Skin Turgor / Mucous Membranes', 'Dry, cracked lips; dry tongue; no tears; skin tents slowly', 'Dry lips and mouth; skin tents slowly (about 2 seconds); eyes slightly sunken', true],
  ['Skin', 'SKIN', 'Skin Integrity', 'Intact; thin', 'Intact; bony prominences more visible (weight loss); no pressure injury', false],
  ['Skin', 'IV_SITES', 'IV Sites', 'Placing IVs (0220 left antecubital, 0225 right forearm)', 'Left antecubital 20 g: two-bag fluids + insulin infusion (insulin on its own pump, joins at the closest port); right forearm 20 g: saline lock for blood draws and IV push; both sites clean, dry, intact, no redness or swelling', false],
  ['Musculoskeletal / Mobility', 'WEIGHT', 'Weight', '48.6 kg (ED scale, standing with help); sports physical 08/10/2026: 54.2 kg (lost 5.6 kg, about 10%)', '48.6 kg (ED weight used for all dosing)', true],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Mobility', 'Needed help to walk from the car', 'Bed rest, head of bed 30 degrees; turns herself; up to the bathroom/commode with 1 assist only', true],
  ['Pain', 'PAIN_SCORE', 'Pain Score', '6/10 crampy upper belly pain', '4/10 belly ache; no headache', true],
  ['Safety', 'FALL_PRECAUTIONS', 'Fall Precautions', 'Stretcher low, rails up x2', 'Fall risk (drowsy, weak, big urine volumes, two IVs): bed low, call light in reach, non-skid socks, mother at the bedside', false],
  ['Safety', 'SEIZURE_BEDSIDE', 'Emergency Equipment at Bedside', 'Not applicable', 'Mannitol 20% (filter needle/in-line filter) and 3% saline available on the unit (PICU pharmacy cabinet); suction and bag-mask at the bedside; dextrose 10% for low glucose', false],
  ['Psychosocial', 'FAMILY', 'Family / Support', 'Mother (Danielle) drove her in; father (Kevin) is driving home from a work trip', 'Mother at the bedside, tearful and frightened ("I thought she was just drinking a lot because of volleyball"). Maya asks if she will "have to do shots forever". Younger brother (Eli, 11) with a neighbor', true],
  ['Psychosocial', 'DEVELOPMENT', 'Developmental / School', 'High school junior (11th grade), volleyball', '16 years old; junior at Westbrook High School; honor roll; club volleyball; learner\'s driving permit; finals start next week. Prefers to be called Maya', false]
];
const TIMES = [['Mon', '02:10', 3], ['Mon', '07:00', 4]];
function build() {
  const out = [];
  TIMES.forEach(([d, tm, col]) => {
    const t = at(d, tm);
    ROWS.forEach(r => { const val = r[col]; out.push({ id: `assessment_${slug(r[0])}_${slug(r[1])}_${t.replace(/[- :]/g, '_')}`, type: 'assessment', section: r[0], code: r[1], label: r[2], value: val, collected: t, source: col === 3 ? 'ED nursing assessment' : 'Nursing assessment (PICU admission)', abnormal: !!r[5] }); });
  });
  return out;
}
module.exports = { build };
if (require.main === module) console.log('assessment rows', build().length);
