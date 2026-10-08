/* Quick drug guide (v27): a short reference for every medication, opened from a blue link on the MAR.
   The data lives in druginfo_1.js, druginfo_2.js and druginfo_3.js, each entry registered with
     DrugGuide.add('generic name', { aliases: ['other names or brand words that appear in order names'], brand: 'BRAND', cls: 'drug class',
        use: 'what it is for', dose: 'usual adult dose and route (the order is what counts)', give: ['how to give it'], watch: ['what to assess before and after'],
        hold: ['when to hold it and call the provider'], effects: ['common or serious adverse effects'], teach: 'key patient teaching', alert: false /* high-alert drug */, lasa: 'look-alike / sound-alike warning' });
   lookup(orderName) finds the best entry; when there is none, a basic guide is built from the order itself. */
window.DrugGuide = (() => {
  const db = {};
  const norm = s => String(s || '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9%\-\/ ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const add = (key, def) => { db[key] = Object.assign({ key, aliases: [], brand: '', cls: '', use: '', dose: '', give: [], watch: [], hold: [], effects: [], teach: '', alert: false, lasa: '' }, def); return db[key]; };
  const index = () => { const out = []; Object.values(db).forEach(d => [d.key].concat(d.aliases || []).forEach(a => { const n = norm(a); if (n) out.push([n, d]); })); return out.sort((x, y) => y[0].length - x[0].length); };
  let idx = null;
  function lookup(name) {
    if (!idx) idx = index();
    const full = ' ' + norm(name) + ' ', brands = (String(name).match(/\(([^)]+)\)/g) || []).map(b => ' ' + norm(b) + ' ');
    for (const [a, d] of idx) { const pat = ' ' + a + ' '; if (full.includes(pat) || brands.some(b => b.includes(pat))) return d; }
    for (const [a, d] of idx) { if (a.length >= 5 && full.includes(a)) return d; }
    return null;
  }
  const reset = () => { idx = null; };
  return { db, add, lookup, reset, norm };
})();
