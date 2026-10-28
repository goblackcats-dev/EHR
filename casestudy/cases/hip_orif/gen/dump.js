/* Writes TIMELINE.md: a readable chart for the note writers. */
const fs = require('fs'), path = require('path');
const P = require('./physiology'), Tx = require('./treatments'), A = require('./assess');
const vit = P.buildVitals(), labs = P.buildLabs(), io = P.buildIO();
const L = ['# Generated chart data (read-only reference; regenerate with `node gen/dump.js`)\n', '## Vital signs (time | T | HR | BP | RR | SpO2 | O2 | pain)\n'];
const by = {}; vit.forEach(o => { (by[o.collected] = by[o.collected] || {})[o.code] = o.value; });
Object.keys(by).sort().forEach(t => { const v = by[t]; L.push(`${t.slice(5)} | ${v.TEMP} | HR ${v.HR} | BP ${v.BP} | RR ${v.RR} | SpO2 ${v.SPO2} | ${v.O2DEV} | pain ${v.PAIN}`); });
L.push('\n## Labs (time available | test | value flag)\n');
let cur = ''; labs.slice().sort((a, b) => (a.availableAt || a.collected).localeCompare(b.availableAt || b.collected) || a.category.localeCompare(b.category)).forEach(l => { const t = l.availableAt || l.collected; if (t !== cur) { cur = t; L.push(`\n**${t}**`); } L.push(`- ${l.label}: ${l.value} ${l.units} ${l.flag ? '[' + l.flag + ']' : ''}${l.status && l.status !== 'Final' ? ' (' + l.status + ')' : ''}`); });
L.push('\n## Intake and output blocks (time | in | out | detail)\n'); io.forEach(e => L.push(`${e.collected} | ${e.time} | in ${e.intake} | out ${e.output} | ${e.note}`));
L.push('\n## Medication administrations (time | order | event)\n'); const nm = {}; Tx.orders.forEach(o => nm[o.id] = o.name);
Tx.admins.slice().sort((a, b) => (a.administeredAt || '').localeCompare(b.administeredAt || '')).forEach(a => L.push(`${a.administeredAt || a.availableAt || ''} | ${nm[a.orderId]} | ${a.label}${a.administeredBy ? ' (' + a.administeredBy + ')' : ''}${a.holdReason ? ' REASON: ' + a.holdReason : ''}`));
L.push('\n## Devices\n'); Tx.devices.forEach(d => L.push(`- ${d.type} ${d.location} (${d.gauge || ''}): placed ${d.placementDate}${d.removedAt ? ', removed ' + d.removedAt : ''}`));
L.push('\n## Orders (non-medication)\n'); Tx.orders.filter(o => o.category !== 'Medication').forEach(o => L.push(`- [${o.category}] ${o.name} (from ${o.start}${o.end ? ' to ' + o.end : ''}): ${o.instructions}`));
fs.writeFileSync(path.join(__dirname, '..', 'TIMELINE.md'), L.join('\n')); console.log('wrote TIMELINE.md', L.length, 'lines');
