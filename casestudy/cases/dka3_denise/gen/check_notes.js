/* Time-gating check for notes: prints every place where a note quotes an analyte value that resulted AFTER the note's time (or a point-of-care glucose value
   taken after it). Usage: node gen/check_notes.js   (a value that already existed earlier is not flagged; remaining hits are usually plan thresholds such as "K under 3.5": read each one). */
const fs = require('fs'), path = require('path');
const c = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'patient.json'), 'utf8')).canonical;
const KEYS = { 'Potassium': ['potassium', 'K'], 'Sodium': ['sodium', 'Na'], 'CO2 (bicarbonate)': ['bicarbonate', 'HCO3'], 'Anion gap': ['anion gap', 'gap'], 'Beta-hydroxybutyrate (serum ketone)': ['BHB', 'ketone'], 'Glucose (serum)': ['glucose'], 'Glucose (point of care)': ['glucose', 'POC'], 'Magnesium': ['magnesium', 'Mg'], 'Phosphorus': ['phosphate', 'phosphorus', 'phos'], 'Creatinine': ['creatinine'], 'BUN': ['BUN'], 'pH, blood gas': ['pH'], 'WBC': ['WBC', 'white count'], 'Hemoglobin A1c': ['HbA1c', 'A1c'], 'Chloride': ['chloride'] };
let hits = 0;
c.notes.forEach(n => {
  const text = n.body + ' ' + (n.summary || '');
  c.observations.filter(o => o.type === 'lab' && KEYS[o.label]).forEach(o => {
    const avail = o.availableAt || o.collected; if (avail <= n.datetime) return;
    const v = String(o.value).replace(/^0\./, '0.');
    if (c.observations.some(p => p.type === 'lab' && p.label === o.label && String(p.value) === String(o.value) && (p.availableAt || p.collected) <= n.datetime)) return;   // the same value already existed (a repeat result is not a leak)
    KEYS[o.label].forEach(k => {
      const re = new RegExp(`\\b${k}\\b[^.;\\n]{0,28}?(?<![\\d.])${v.replace('.', '\\.')}(?![\\d])`, 'i');
      if (re.test(text)) { console.log(`HIT ${n.id} quotes ${o.label} ${o.value} (${o.collected}, available ${avail})`); hits++; }
    });
  });
});
console.log(hits ? `${hits} possible hits (check each; thresholds and plans are false positives)` : 'no quoted result before it resulted');
