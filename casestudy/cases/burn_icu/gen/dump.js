/* Writes TIMELINE.md: a readable chart of the generated data so note writers stay consistent with it. */
const fs = require('fs'), path = require('path');
const { H, hOf } = require('./lib'); const P = require('./physiology'); const Tx = require('./treatments');
const vit = P.buildVitals(), labs = P.buildLabs(), io = P.buildIO();
const L = [];
L.push('# Generated chart data (read-only reference; regenerate with `node gen/dump.js`)\n');
L.push('## Hourly vitals, ventilator, sedation, fluids (time | HR | BP (MAP) | RR | SpO2 | Temp F | O2 | RASS | CPOT | PIP/Pplat | FiO2/PEEP | propofol | fentanyl | norepi | insulin | LR mL/h | UOP mL)\n');
const byT = {}; vit.forEach(o => { (byT[o.collected] = byT[o.collected] || {})[o.code] = o.value; });
Object.keys(byT).sort().forEach(t => {
  const v = byT[t], h = (Date.parse(t.replace(' ', 'T') + ':00Z') - Date.parse('2026-11-02T04:00:00Z')) / 3600000, s = P.state(h);
  const [sb, db] = (v.BP || '0/0').split('/').map(Number); const map = Math.round((sb + 2 * db) / 3);
  const iorow = io.find(e => e.collected === t);
  L.push(`${t.slice(5)} | HR ${v.HR} | BP ${v.BP} (${map}) | RR ${v.RR} | SpO2 ${v.SPO2} | ${v.TEMP} | ${v.O2DEV} | RASS ${s.rass} | pain ${v.PAIN} | ${s.extub ? '-' : `PIP ${Math.round(s.pip)}/Pplat ${Math.round(s.plat)} FiO2 ${s.fio2} PEEP ${s.peep} setRR ${s.rrSet}`} | prop ${s.propofol} | fent ${s.fentanyl} | NE ${s.norepi} | ins ${s.insulin} | LR ${s.lr}${s.alb ? ' +alb ' + s.alb : ''}${s.feeds ? ' feeds ' + s.feeds : ''} | ${iorow ? 'IO block ' + iorow.time + ': in ' + iorow.intake + ' out ' + iorow.output : ''}`);
});
L.push('\n## Labs (time | test | value flag)\n');
const lb = labs.slice().sort((a, b) => (a.availableAt || a.collected).localeCompare(b.availableAt || b.collected) || a.category.localeCompare(b.category));
let cur = '';
lb.forEach(l => { const t = (l.availableAt || l.collected); if (t !== cur) { cur = t; L.push(`\n**${t}**`); } L.push(`- ${l.label}: ${l.value} ${l.units} ${l.flag ? '[' + l.flag + ']' : ''}${l.status && l.status !== 'Final' ? ' (' + l.status + ')' : ''}`); });
L.push('\n## Medication administrations and infusion changes (time | order | event)\n');
const ordName = {}; Tx.orders.forEach(o => ordName[o.id] = o.name);
Tx.admins.slice().sort((a, b) => (a.administeredAt || '').localeCompare(b.administeredAt || '')).forEach(a => L.push(`${a.administeredAt || a.availableAt || ''} | ${ordName[a.orderId]} | ${a.label}${a.administeredBy ? ' (' + a.administeredBy + ')' : ''}`));
L.push('\n## Devices\n'); Tx.devices.forEach(d => L.push(`- ${d.type} ${d.location} (${d.gauge || ''}): placed ${d.placementDate}${d.removedAt ? ', removed ' + d.removedAt : ''}`));
L.push('\n## Orders (non-medication)\n'); Tx.orders.filter(o => o.category !== 'Medication').forEach(o => L.push(`- [${o.category}] ${o.name} (from ${o.start}${o.end ? ' to ' + o.end : ''}): ${o.instructions}`));
fs.writeFileSync(path.join(__dirname, '..', 'TIMELINE.md'), L.join('\n'));
console.log('wrote TIMELINE.md', L.length, 'lines');
