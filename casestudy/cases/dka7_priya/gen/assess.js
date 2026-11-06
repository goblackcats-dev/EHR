/* DKA patient 7 (Priya Desai): baseline nursing assessment flowsheet rows (OB triage/ED 0130 and unit arrival 0700 ONLY).
   Assessments after 0700 are done by the students at the bedside (the instructor portrays the findings, see INSTRUCTOR_NOTES.md). */
const { at, slug } = require('./lib');
// [section, code, label, ED 0130 value, unit 0700 value, abnormal]
const ROWS = [
  ['Neurologic', 'LEVEL_OF_CONSCIOUSNESS', 'Level of Consciousness', 'Alert and oriented x4; anxious and nauseated; very tired', 'Alert and oriented x4; tired, mildly weak in the calves; worried about the baby', true],
  ['Respiratory', 'RESPIRATORY_PATTERN', 'Respiratory Pattern', 'Deep, regular (Kussmaul) respirations 26/min; lungs clear; fruity breath odor', 'Respirations 20/min, mildly deep; lungs clear bilaterally, no crackles; no accessory muscle use', true],
  ['Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', 'Room air (oxygen not applied: maternal SpO2 99%)', 'Room air', false],
  ['Cardiac', 'RHYTHM', 'Rhythm', 'Sinus tachycardia on the monitor; 12-lead ECG at 0145', 'Sinus rhythm on the monitor with flattened T waves and prominent U waves', true],
  ['Cardiac', 'CAPILLARY_REFILL', 'Capillary Refill', 'About 3 seconds; dry mucous membranes; skin warm', 'Under 3 seconds; peripheral pulses 2+; no JVD; no edema', true],
  ['GI', 'NAUSEA', 'Nausea / Vomiting', '36 hours of nausea; 8 episodes of non-bloody vomiting in 18 hours; 3 watery stools (resolved); vomited about 150 mL at 0140; epigastric soreness', 'Nausea much improved since the ondansetron; no vomiting since 0140; mild epigastric soreness', true],
  ['GI', 'DIET', 'Diet / Intake', 'Could not keep solid food down; sips of ginger ale and water only', 'Ice chips and sips with medicines only (see Orders); no solid food yet', true],
  ['GU', 'URINARY_ELIMINATION', 'Urinary Elimination', 'Polyuria; Foley with urometer placed at 0145: 120 mL dark amber urine', 'Foley with urometer; every hour measured (720 mL in the ED); urine amber to yellow', true],
  ['Skin', 'SKIN_TURGOR', 'Skin Turgor / Mucous Membranes', 'Dry mucous membranes; reduced skin turgor', 'Mucous membranes slightly dry; mild calf cramping; trace pedal edema only', true],
  ['Skin', 'IV_SITES', 'IV Sites', 'Two 18-gauge peripheral IVs placed in OB triage: left forearm and right antecubital; no central line', 'IV A left forearm 18 g (carrier fluid and insulin); IV B right antecubital 18 g (potassium riders, magnesium); both patent, no redness or swelling', false],
  ['Musculoskeletal / Mobility', 'WEIGHT', 'Weight', '70.0 kg measured (current pregnant weight; dosing weight); pre-pregnancy 62.0 kg; height 165 cm', '70.0 kg (bed scale, same as triage). Daily weight at 0700, same scale', true],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Mobility / Positioning', 'Wheelchair to triage; placed in 30-degree left lateral tilt (wedge under the right hip)', 'Bedrest in left lateral tilt with bathroom privileges and assistance; sequential compression devices on both legs', false],
  ['Pain', 'PAIN_SCORE', 'Pain Score', 'Epigastric soreness 3/10', 'Epigastric soreness 1/10', true],
  ['Safety', 'FALL_PRECAUTIONS', 'Safety', 'Stretcher low, rails up x2, wedge in place', 'Fall precautions (leg weakness, IV tubing); call light within reach; assist to the bathroom; penicillin allergy band (childhood rash)', false],
  ['Psychosocial', 'SUPPORT', 'Family / Support', 'Husband Rohan at the bedside continuously; elementary school teacher; first pregnancy', 'Husband Rohan at the bedside; anxious about the baby and asks whether she needs an emergency cesarean', true],
  ['Psychosocial', 'KNOWLEDGE', 'Insulin and Illness Knowledge', 'Saw her continuous glucose monitor at 175-235 mg/dL, did not think it was high enough for ketoacidosis, feared a low, cut glargine from 24 to 12 units and skipped mealtime lispro', 'Feels guilty about halving her basal insulin; asks whether the baby is harmed', true],
  ['Fetal / Obstetric', 'FHR_BASELINE', 'Fetal Heart Rate Baseline', '165 bpm (fetal tachycardia) at 0135', '155 bpm at 0700', true],
  ['Fetal / Obstetric', 'FHR_VARIABILITY', 'Fetal Heart Rate Variability', 'Minimal (under 5 bpm), no accelerations', 'Minimal-to-moderate (5-6 bpm), no accelerations', true],
  ['Fetal / Obstetric', 'FHR_DECELS', 'Fetal Heart Rate Decelerations', 'Recurrent late decelerations (nadir 140 bpm, about 40 seconds)', 'Intermittent late decelerations (nadir 138 bpm) with contractions', true],
  ['Fetal / Obstetric', 'TOCO', 'Uterine Activity (tocodynamometer)', 'Mild contractions every 3-4 minutes, palpate mild; abdomen soft between', 'Mild contractions every 4-5 minutes, 40 seconds; abdomen soft between; no bleeding or leaking of fluid', true],
  ['Fetal / Obstetric', 'FHR_CATEGORY', 'NICHD Fetal Heart Rate Category', 'Category II', 'Category II', true],
  ['Fetal / Obstetric', 'FETAL_MOVEMENT', 'Fetal Movement', 'Decreased over the last 4 hours (patient report)', 'Fetal movement present but less active than usual', true]
];
const TIMES = [['Mon', '01:30', 3], ['Mon', '07:00', 4]];
function build() {
  const out = [];
  TIMES.forEach(([d, tm, col]) => {
    const t = at(d, tm);
    ROWS.forEach(r => { out.push({ id: `assessment_${slug(r[0])}_${slug(r[1])}_${t.replace(/[- :]/g, '_')}`, type: 'assessment', section: r[0], code: r[1], label: r[2], value: r[col], collected: t, source: col === 3 ? 'OB triage / ED nursing assessment' : 'Nursing assessment (unit arrival)', abnormal: !!r[5] }); });
  });
  return out;
}
module.exports = { build };
if (require.main === module) console.log('assessment rows', build().length);
