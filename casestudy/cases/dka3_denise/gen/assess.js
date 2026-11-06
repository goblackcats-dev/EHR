/* DKA patient 3 (Denise Carter): baseline nursing assessment flowsheet rows (ED 0200 and step-down arrival 0700 ONLY).
   Assessments after 0700 are done by the students at the bedside (the instructor portrays the findings, see INSTRUCTOR_NOTES.md). */
const { at, slug } = require('./lib');
// [section, code, label, ED 0200 value, step-down 0700 value, abnormal]
const ROWS = [
  ['Neurologic', 'LEVEL_OF_CONSCIOUSNESS', 'Level of Consciousness', 'Drowsy but readily arousable; answers questions when engaged', 'Alert, tired', true],
  ['Neurologic', 'ORIENTATION', 'Orientation', 'Oriented when engaged', 'Oriented x4; follows commands', false],
  ['Respiratory', 'RESPIRATORY_PATTERN', 'Respiratory Pattern', 'Deep, regular respirations (Kussmaul), 30/min', 'Deep respirations, 22/min; no accessory muscle use', true],
  ['Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', 'Room air', 'Room air', false],
  ['Cardiac', 'RHYTHM', 'Rhythm', 'Sinus tachycardia on the monitor; 12-lead at 0215', 'Sinus tachycardia, T waves less prominent; no ectopy', true],
  ['Cardiac', 'CAPILLARY_REFILL', 'Capillary Refill', 'Delayed (more than 3 seconds)', 'Improved with fluids', true],
  ['GI', 'ABDOMEN', 'Abdomen', 'Diffuse mild discomfort; no guarding or focal tenderness', 'Mild diffuse abdominal soreness; no focal tenderness', true],
  ['GI', 'NAUSEA', 'Nausea / Vomiting', 'Repeated nonbloody vomiting for 2 days; vomited 250 mL at 0215', 'Nausea eased after ondansetron; wants water', true],
  ['GI', 'DIET', 'Diet / Intake', 'Could not keep fluids down; skips meals so her daughter can eat', 'NPO except ice chips and small water sips (every drop counted on the I&O)', true],
  ['GU', 'URINARY_ELIMINATION', 'Urinary Elimination', 'Polyuria for 2 days; clean-catch sample 0200', 'Voiding (500 mL total in the ED); measured with a hat, no catheter; urine output being counted hourly', true],
  ['Skin', 'SKIN_TURGOR', 'Skin Turgor / Mucous Membranes', 'Dry mucous membranes; delayed capillary refill', 'Dry mouth', true],
  ['Skin', 'IV_SITES', 'IV Sites', 'Two peripheral IVs placed: left forearm 18 g, right forearm 20 g', 'Left forearm 18 g (saline with potassium, insulin, piggybacks) and right forearm 20 g; both patent, no redness or swelling. No central line', false],
  ['Musculoskeletal / Mobility', 'WEIGHT', 'Weight', '60.0 kg measured (dosing weight); usual about 64 kg a month ago; BMI 22.0', '60.0 kg (ED weight is used for all weight-based doses)', true],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Mobility', 'Arrived with her sister; weak', 'Assisted bathroom activity; fall precautions (volume depleted, insulin drip)', true],
  ['Pain', 'PAIN_SCORE', 'Pain Score', 'Diffuse abdominal discomfort 4/10', 'Mild diffuse abdominal soreness 2/10', true],
  ['Safety', 'FALL_PRECAUTIONS', 'Fall Precautions', 'Stretcher low, rails up x2', 'At risk (weak, IV lines, frequent voiding): bed low, call light in reach, non-skid socks', false],
  ['Psychosocial', 'SUPPORT', 'Family / Support', 'Sister Angela drove her in and is caring for her 12-year-old daughter', 'Sister has the daughter and may take part in teaching with her consent. Denise wants to stay independent and is worried about missing work', true],
  ['Psychosocial', 'ACCESS', 'Insulin and Food Access', 'Stretching insulin for 3 months because she cannot afford refills; lost her job and insurance; test strips ran out 2 weeks ago', 'Cost-related insulin rationing (not "noncompliance"); skips meals so her daughter can eat. Social work, pharmacy and case management consults ordered', true]
];
const TIMES = [['Mon', '02:00', 3], ['Mon', '07:00', 4]];
function build() {
  const out = [];
  TIMES.forEach(([d, tm, col]) => {
    const t = at(d, tm);
    ROWS.forEach(r => { out.push({ id: `assessment_${slug(r[0])}_${slug(r[1])}_${t.replace(/[- :]/g, '_')}`, type: 'assessment', section: r[0], code: r[1], label: r[2], value: r[col], collected: t, source: col === 3 ? 'ED nursing assessment' : 'Nursing assessment (step-down arrival)', abnormal: !!r[5] }); });
  });
  return out;
}
module.exports = { build };
if (require.main === module) console.log('assessment rows', build().length);
