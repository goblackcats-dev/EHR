/* Hip fracture patient: nursing assessment flowsheet rows. */
const { H, hOf, at, hOfStamp, slug } = require('./lib');
const T = (d, t) => hOfStamp(at(d, t));
// phases: normal until Tue 1500; subtle cues 1500-2000; infection with confusion 2000-0500; clearing after 0500
const phase = h => (h < T('Tue', '15:00') ? 'A' : h < T('Tue', '20:30') ? 'B' : h < T('Wed', '05:00') ? 'C' : 'D');
const foleyOut = T('Tue', '22:00');
const ROWS = [
  ['Neurologic', 'LEVEL_OF_CONSCIOUSNESS', 'Level of Consciousness', (h, p) => [p === 'C' ? 'Drowsy but arouses to voice, restless' : p === 'B' ? 'Alert, a little more tired than this morning' : 'Alert', p === 'C']],
  ['Neurologic', 'ORIENTATION', 'Orientation', (h, p) => [p === 'C' ? 'Oriented to self only; thinks she is at home and asks for her late husband' : p === 'B' ? 'Oriented x4; at 1800 dinner asked where her husband was, reoriented easily' : 'Oriented to person, place, time and situation', p !== 'A' && p !== 'D']],
  ['Neurologic', 'CAM', 'CAM (confusion screen)', (h, p) => [p === 'C' ? 'POSITIVE: acute change, inattention, disorganized thinking' : p === 'B' ? 'Negative at 1500; borderline at 1800 (brief confusion), recheck in 2 hours' : 'Negative', p === 'C']],
  ['Respiratory', 'BREATH_SOUNDS', 'Breath Sounds', (h, p) => ['Clear, diminished at both bases', false]],
  ['Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', (h, p) => [h < T('Tue', '14:00') ? 'Nasal cannula 2 L/min' : 'Room air', false]],
  ['Respiratory', 'INCENTIVE_SPIROMETRY', 'Incentive Spirometry', (h, p) => [h < T('Tue', '14:00') ? '1,000 mL x10 with coaching' : p === 'C' ? '750 mL, needs reminders' : '1,250 mL x10', p === 'C']],
  ['Cardiac', 'RHYTHM', 'Rhythm', (h, p) => [h < T('Wed', '07:00') ? (p === 'C' ? 'Sinus rhythm, rate 98-106' : 'Sinus rhythm on telemetry') : 'Sinus rhythm (telemetry off)', false]],
  ['Cardiac', 'EDEMA', 'Edema', (h, p) => ['Trace edema both ankles; right thigh swollen as expected after surgery', false]],
  ['Cardiac', 'CAPILLARY_REFILL', 'Capillary Refill', (h, p) => ['Under 3 seconds, both feet', false]],
  ['GI', 'ABDOMEN', 'Abdomen', (h, p) => ['Soft, non-distended', false]],
  ['GI', 'BOWEL_SOUNDS', 'Bowel Sounds', (h, p) => ['Active x4', false]],
  ['GI', 'DIET', 'Diet / Intake', (h, p) => [p === 'C' ? 'Ate 30% of dinner, sipping fluids with encouragement' : p === 'D' ? 'Ate 75% of breakfast and drank her protein supplement' : 'Ate 70-80% of meals, drinks fluids well', p === 'C']],
  ['GI', 'LAST_BM', 'Bowel Movement', (h, p) => [h < T('Wed', '07:00') ? 'Last bowel movement Monday 1400, formed' : 'Soft brown stool x1 Wednesday 0630', false]],
  ['GU', 'URINARY_ELIMINATION', 'Urinary Elimination', (h, p) => [h < foleyOut ? 'Foley catheter (16 Fr, placed Saturday 2330), secured to the left thigh, bag below the bladder' : 'Foley removed Tue 2200; voiding spontaneously after the first void at 0215', false]],
  ['GU', 'URINE_APPEARANCE', 'Urine Appearance', (h, p) => [h >= foleyOut ? (h < T('Wed', '07:00') ? 'Dark yellow, slightly cloudy' : 'Yellow, clear') : p === 'A' ? 'Clear yellow' : p === 'B' ? 'Slightly cloudy at the 1500 care; yellow' : 'Cloudy, dark yellow', h >= T('Tue', '15:00') && h < T('Wed', '07:00')]],
  ['GU', 'URINE_ODOR', 'Urine Odor', (h, p) => [h >= T('Tue', '15:00') && h < T('Wed', '07:00') ? 'Stronger than usual odor' : 'No unusual odor', h >= T('Tue', '15:00') && h < T('Wed', '07:00')]],
  ['GU', 'SUPRAPUBIC', 'Suprapubic Area', (h, p) => [p === 'C' ? 'Mild tenderness to palpation, no CVA tenderness' : 'Soft, no tenderness', p === 'C']],
  ['GU', 'BLADDER_SCAN', 'Bladder Scan', (h, p) => (h >= T('Wed', '02:00') && h < T('Wed', '04:00') ? ['80 mL after the first void (0215)', false] : h >= T('Wed', '10:30') && h < T('Wed', '12:00') ? ['60 mL after a void', false] : null)],
  ['Skin', 'INCISION', 'Incision, right lateral thigh', (h, p) => ['Aquacel dressing dry and intact, no drainage, mild bruising at the edges, 3 staples at the nail entry site visible through the dressing', false]],
  ['Skin', 'SKIN', 'Skin / Pressure Areas', (h, p) => ['Sacrum and both heels intact, no redness; turned and repositioned every 2 hours', false]],
  ['Skin', 'BRADEN', 'Braden Score', (h, p) => [h < T('Wed', '07:00') ? '15 (low risk)' : '16 (low risk)', false]],
  ['Musculoskeletal / Mobility', 'RIGHT_LEG_NEUROVASCULAR', 'Right Leg Neurovascular', (h, p) => ['Right foot warm and pink; dorsalis pedis and posterior tibial pulses palpable; capillary refill under 3 seconds; sensation intact; wiggles all toes; thigh swollen but soft', false]],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Mobility', (h, p) => [h < T('Tue', '09:00') ? 'Bed rest, turned every 2 hours with 1 assist' : h < T('Wed', '09:00') ? 'Up to chair with 1 assist and walker; stood for 10 feet with PT at 0900' : 'Walked 40 feet with a walker and stand-by assist (PT 0900)', false]],
  ['Pain', 'PAIN_SCORE', 'Pain Score', (h, p) => [h < T('Tue', '09:00') ? '4/10 at rest' : p === 'D' ? '3/10 at rest, 4/10 with walking' : '4/10 at rest, 6/10 with movement', false]],
  ['Pain', 'PAIN_LOCATION', 'Pain Location', (h, p) => ['Right hip and thigh, aching', false]],
  ['Safety', 'FALL_PRECAUTIONS', 'Fall Precautions', (h, p) => ['Bed low, bed alarm on, call light in reach, non-skid socks, glasses on, left hearing aid in' + (p === 'C' ? '; toileting every 2 hours' : ''), false]],
  ['Safety', 'CAUTI_BUNDLE', 'Catheter Care', (h, p) => [h < foleyOut ? 'Foley secured, bag below the bladder, perineal care done; need reviewed (strict output, POD 2)' : 'No catheter; bladder scan and toileting schedule in place', false]],
  ['Safety', 'DIABETES_CARE', 'Glucose Management', (h, p) => ['Point-of-care glucose before meals and at bedtime; lispro correction scale', false]]
];
const TIMES = [['Mon', '19:00'], ['Mon', '23:00'], ['Tue', '03:00'], ['Tue', '07:00'], ['Tue', '11:00'], ['Tue', '15:00'], ['Tue', '19:00'], ['Tue', '21:30'], ['Tue', '23:00'], ['Wed', '03:00'], ['Wed', '07:00'], ['Wed', '11:00'], ['Wed', '14:00']];
function build() {
  const out = [];
  TIMES.forEach(([d, tm]) => {
    const t = at(d, tm), h = hOfStamp(t), p = phase(h);
    ROWS.forEach(([sect, code, label, fn]) => { const r = fn(h, p); if (!r) return; out.push({ id: `assessment_${slug(sect)}_${slug(code)}_${t.replace(/[- :]/g, '_')}`, type: 'assessment', section: sect, code, label, value: r[0], collected: t, source: 'Nursing assessment', abnormal: !!r[1] }); });
  });
  return out;
}
module.exports = { build };
if (require.main === module) console.log('assessment rows', build().length);
