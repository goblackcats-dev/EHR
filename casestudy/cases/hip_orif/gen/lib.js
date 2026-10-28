/* Shared helpers for the hip fracture patient generators.  h = hours after Tue 2026-11-10 07:00 (the simulation start); negative = history. */
const BASE = Date.UTC(2026, 10, 10, 7, 0);
const DAYS = { Sat: 7, Sun: 8, Mon: 9, Tue: 10, Wed: 11, Thu: 12 };
const p2 = n => String(n).padStart(2, '0');
function stamp(ms) { const d = new Date(ms); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`; }
const H = h => stamp(BASE + Math.round(h * 60) * 60000);
function hOf(day, hhmm) { const [hh, mm] = hhmm.split(':').map(Number); return (Date.UTC(2026, 10, DAYS[day], hh, mm) - BASE) / 3600000; }
const at = (day, hhmm) => H(hOf(day, hhmm));
const hOfStamp = t => (Date.parse(t.replace(' ', 'T') + ':00Z') - BASE) / 3600000;
const hhmm = h => H(h).slice(11, 16).replace(':', '');
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
module.exports = { BASE, DAYS, p2, stamp, H, hOf, at, hOfStamp, hhmm, slug };
