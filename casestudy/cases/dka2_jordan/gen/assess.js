/* DKA patient 2 (Jordan Ellis): baseline nursing assessment flowsheet rows (ED 0035 and IMCU admission 0700 ONLY).
   Assessments after 0700 are done by the students at the bedside (the instructor portrays the findings, see INSTRUCTOR_NOTES.md). */
const { at, slug } = require('./lib');
// [section, code, label, ED 0035 value, IMCU 0700 value, abnormal]
const ROWS = [
  ['Neurologic', 'LEVEL_OF_CONSCIOUSNESS', 'Level of Consciousness', 'Sleepy but wakes to voice and answers; GCS 15 (E4 V5 M6) once awake', 'Awake, a little slow to answer; GCS 15', true],
  ['Neurologic', 'ORIENTATION', 'Orientation', 'Oriented x4', 'Oriented x4; follows commands; asks "when can I have my pump back?"', false],
  ['Neurologic', 'PUPILS', 'Pupils', 'Equal, round, reactive, 4 mm', 'Equal, round, reactive, 4 mm', false],
  ['Neurologic', 'TREMOR', 'Tremor / Withdrawal Signs', 'No tremor, no sweating, not agitated; last drink about 0200 Sunday (about 22 hours ago)', 'No tremor (arms out, fingers spread), no sweats, no hallucinations; CIWA-Ar 1 (mild nausea). Last drink Sun about 0200', false],
  ['Respiratory', 'RESPIRATORY_PATTERN', 'Respiratory Pattern', 'Deep, fast, regular breathing (Kussmaul), 28/min', 'Deep, regular breathing 24/min, less labored than in the ED; no accessory muscle use', true],
  ['Respiratory', 'BREATH_ODOR', 'Breath Odor', 'Fruity (acetone) smell; no smell of alcohol', 'Fruity (acetone) breath', true],
  ['Respiratory', 'BREATH_SOUNDS', 'Breath Sounds', 'Clear bilaterally', 'Clear bilaterally', false],
  ['Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', 'Room air', 'Room air', false],
  ['Cardiac', 'RHYTHM', 'Rhythm', 'Sinus tachycardia 120s; T waves a little tall', 'Sinus tachycardia 108; no ectopy', true],
  ['Cardiac', 'PULSES', 'Peripheral Pulses', 'Radial 2+ fast; pedal 2+', 'Radial and pedal 2+ equal', false],
  ['Cardiac', 'CAPILLARY_REFILL', 'Capillary Refill', '3 seconds; hands cool', 'Under 3 seconds; hands warm', true],
  ['GI', 'ABDOMEN', 'Abdomen', 'Soft, diffuse mild tenderness (worst in the upper belly), no guarding or rebound; hypoactive bowel sounds', 'Soft, mild upper belly tenderness, no guarding; bowel sounds present', true],
  ['GI', 'NAUSEA', 'Nausea / Vomiting', 'Vomited "8-10 times" since Sunday late morning; vomited 200 mL clear fluid at 0130 in the ED', 'Mild nausea; no vomiting since 0130 (ondansetron 0100)', true],
  ['GI', 'DIET', 'Diet / Intake', 'Little food since Saturday evening; drinking a lot on Saturday night (beer and shots); could not keep water down Sunday', 'NPO except ice chips and sips of water. Says he is "starving" and asks for food and a soda', true],
  ['GU', 'URINARY_ELIMINATION', 'Urinary Elimination', 'Peeing a lot since Sunday', 'Voided 450 (0115), 500 (0330), 400 mL (0545) in the ED; urinal at the bedside; up to the bathroom with standby assist', true],
  ['GU', 'URINE_APPEARANCE', 'Urine Appearance', 'Not seen', 'Pale yellow, clear', false],
  ['Skin', 'SKIN_TURGOR', 'Skin Turgor / Mucous Membranes', 'Dry mouth and lips; skin tents slowly', 'Mouth dry; skin turgor better', true],
  ['Skin', 'PUMP_SITE', 'Insulin Pump Infusion Site', 'Infusion set on the left lower abdomen half pulled off: adhesive lifted and wet, cannula bent, smell of insulin (a "band-aid" smell) on the dressing; tubing twisted. Pump suspended and removed 0110 (in a labeled bag with his belongings)', 'Old pump site left lower abdomen: small red dot, no swelling, warmth or drainage. Pump in the belongings bag (suspended). Insulin by IV infusion only', true],
  ['Skin', 'CGM_SITE', 'Continuous Glucose Monitor', 'Own CGM sensor on the back of the right upper arm (day 6 of 10); phone battery dead', 'CGM sensor back of right upper arm, intact. Phone charging: CGM reads 270s and matches the fingerstick within about 10%. Fingersticks are used for all decisions', false],
  ['Skin', 'IV_SITES', 'IV Sites', 'Placing IVs (0045 left forearm 18 g, 0050 right antecubital 20 g)', 'Left forearm 18 g: lactated Ringer\'s with KCl and the insulin infusion (own pump, closest port); right antecubital 20 g: saline lock for IV push and potassium riders. Both clean, dry, intact', false],
  ['Musculoskeletal / Mobility', 'WEIGHT', 'Weight', '72.0 kg (ED bed scale); usual 74.5 kg (clinic 10/06/2026)', '72.0 kg (ED weight used for all dosing)', true],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Mobility', 'Walked in with his roommate\'s help, unsteady', 'Up to the bathroom with standby assist (weak, two IV lines); independent at baseline', true],
  ['Pain', 'PAIN_SCORE', 'Pain Score', '5/10 crampy upper belly pain; headache 3/10', '3/10 belly ache; mild headache 2/10', true],
  ['Safety', 'FALL_PRECAUTIONS', 'Fall Precautions', 'Stretcher low, rails up x2', 'Moderate fall risk (weak, IV lines, frequent voiding): bed low, call light in reach, non-skid socks, urinal at the bedside', false],
  ['Safety', 'SUBSTANCE_SCREEN', 'Alcohol / Substance Screen', 'Drank about 10-12 drinks Saturday evening into early Sunday; denies drugs; no daily drinking; no past withdrawal or seizures', 'CIWA-Ar 1. Binge drinking about 2-3 times a month; no morning drinking; no past withdrawal. Ethanol level under 10 (none detected), urine drug screen negative', true],
  ['Psychosocial', 'SUPPORT', 'Family / Support', 'Roommate (Theo Grant) drove him in', 'Roommate Theo went home to sleep, will bring his phone charger and pump supplies. Parents (Karen and Mark Ellis) live 3 hours away; mother updated by phone with his permission. Embarrassed: "I\'ve had diabetes for 13 years, I know better"', true],
  ['Psychosocial', 'WORK', 'Work / Daily Life', 'Line cook', '24 years old; line cook at a downtown restaurant (afternoon and evening shifts, eats a staff meal); lives with a roommate; insured on his parents\' plan. Prefers to be called Jordan', false]
];
const TIMES = [['Mon', '00:35', 3], ['Mon', '07:00', 4]];
function build() {
  const out = [];
  TIMES.forEach(([d, tm, col]) => {
    const t = at(d, tm);
    ROWS.forEach(r => { out.push({ id: `assessment_${slug(r[0])}_${slug(r[1])}_${t.replace(/[- :]/g, '_')}`, type: 'assessment', section: r[0], code: r[1], label: r[2], value: r[col], collected: t, source: col === 3 ? 'ED nursing assessment' : 'Nursing assessment (IMCU admission)', abnormal: !!r[5] }); });
  });
  return out;
}
module.exports = { build };
if (require.main === module) console.log('assessment rows', build().length);
