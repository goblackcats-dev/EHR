/* DKA patient 4 (Marcus Reyes): baseline nursing assessment flowsheet rows (ED 0200 and step-down arrival 0700 ONLY).
   Assessments after 0700 are done by the students at the bedside (the instructor portrays the findings, see INSTRUCTOR_NOTES.md). */
const { at, slug } = require('./lib');
// [section, code, label, ED 0200 value, step-down 0700 value, abnormal]
const ROWS = [
  ['Neurologic', 'LEVEL_OF_CONSCIOUSNESS', 'Level of Consciousness', 'Awake, tired', 'Alert', false],
  ['Neurologic', 'ORIENTATION', 'Orientation', 'Oriented x4', 'Oriented x4; follows commands', false],
  ['Respiratory', 'RESPIRATORY_PATTERN', 'Respiratory Pattern', 'Deep respirations (Kussmaul), 28/min; lungs clear', 'Respirations still somewhat deep, 22/min; no accessory muscle use; lungs clear', true],
  ['Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', 'Room air', 'Room air', false],
  ['Cardiac', 'RHYTHM', 'Rhythm', 'Sinus tachycardia on the monitor; 12-lead at 0210', 'Sinus rhythm; ordinary T waves; no ectopy', true],
  ['Cardiac', 'CAPILLARY_REFILL', 'Capillary Refill', 'Delayed; improving after the saline boluses', 'Brisk', true],
  ['GI', 'ABDOMEN', 'Abdomen', 'Diffuse mild discomfort; no guarding or focal tenderness', 'Mild diffuse soreness; no focal tenderness', true],
  ['GI', 'NAUSEA', 'Nausea / Vomiting', 'Three days of nausea and repeated nonbloody vomiting; vomited about 100 mL at 0220', 'Mild nausea, better since ondansetron; thirsty', true],
  ['GI', 'DIET', 'Diet / Intake', 'Little oral intake for 3 days; could not keep fluids down', 'NPO except medications and measured small water sips or ice chips (every drop counted on the I&O)', true],
  ['GU', 'URINARY_ELIMINATION', 'Urinary Elimination', 'Polyuria, then less urine the evening before arrival; specimen 0250', 'Voiding; measured with a urinal hat, no catheter; urine output counted hourly (250 mL in the ED)', true],
  ['Skin', 'SKIN_TURGOR', 'Skin Turgor / Mucous Membranes', 'Dry mouth; skin turgor reduced', 'Dry mouth; no edema', true],
  ['Skin', 'IV_SITES', 'IV Sites', 'Two peripheral IVs placed: right forearm 18 g, left forearm 20 g', 'Right forearm 18 g and left forearm 20 g, both patent, no redness or swelling. No central line. Insulin runs on its own dedicated pump channel', false],
  ['Musculoskeletal / Mobility', 'WEIGHT', 'Weight', '80.0 kg measured (dosing weight for every weight-based dose); usual well weight about 82.0 kg; height 178 cm', '80.5 kg standing (unit baseline). Daily standing weight at 0700, same scale and clothing', true],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Mobility', 'Walked in with his partner; tired', 'Assisted bathroom and chair activity until reassessed', true],
  ['Pain', 'PAIN_SCORE', 'Pain Score', 'Diffuse abdominal discomfort 4/10', 'Mild diffuse abdominal soreness 2/10', true],
  ['Safety', 'FALL_PRECAUTIONS', 'Fall Precautions', 'Stretcher low, rails up x2', 'At risk (tired, IV lines, insulin infusion): bed low, call light in reach, non-skid socks, assisted to the bathroom', false],
  ['Psychosocial', 'SUPPORT', 'Family / Support', 'Partner Elena Cruz brought him in; she is his designated contact (with his consent)', 'Elena is at the bedside and can help with glucose checks and transportation. He wants to understand what went wrong', true],
  ['Psychosocial', 'KNOWLEDGE', 'Insulin and Illness Knowledge', 'Stopped meal insulin when he stopped eating and skipped glargine on 11/03 and 11/04: "no food means no insulin"', 'Knows how to dose insulin when well; misunderstood sick-day care (no supply or cost problem; CGM sensor expired during the illness, backup meter at home)', true]
];
const TIMES = [['Thu', '02:00', 3], ['Thu', '07:00', 4]];
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
