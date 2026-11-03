/* Shared helpers for the hypermagnesemia patient generators.  h = hours after Tue 2026-11-17 07:00 (the simulation start); negative = history. */
const BASE = Date.UTC(2026, 10, 17, 7, 0);
const DAYS = { Fri: 13, Sat: 14, Sun: 15, Mon: 16, Tue: 17, Wed: 18 };
const p2 = n => String(n).padStart(2, '0');
function stamp(ms) { const d = new Date(ms); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`; }
const H = h => stamp(BASE + Math.round(h * 60) * 60000);
function hOf(day, hhmm) { const [hh, mm] = hhmm.split(':').map(Number); return (Date.UTC(2026, 10, DAYS[day], hh, mm) - BASE) / 3600000; }
const at = (day, hhmm) => H(hOf(day, hhmm));
const hOfStamp = t => (Date.parse(t.replace(' ', 'T') + ':00Z') - BASE) / 3600000;
const hhmm = h => H(h).slice(11, 16).replace(':', '');
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
module.exports = { BASE, DAYS, p2, stamp, H, hOf, at, hOfStamp, hhmm, slug };
