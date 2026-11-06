/* Shared helpers for the DKA patient 6 generators (Samuel Okafor).  h = hours after Mon 2026-11-16 07:00 (simulation start); negative = history / ED.
   Same helpers as the other DKA patients (casestudy/cases/DKA_SERIES.md): BASE / MONTH / DAYS changed for this start date. */
const BASE = Date.UTC(2026, 10, 16, 7, 0);
const MONTH = 10;   // November (0-based)
const DAYS = { Mon: 16, Tue: 17, Wed: 18, Thu: 19 };   // Mon = Day 1 ... Thu = Day 4
const p2 = n => String(n).padStart(2, '0');
function stamp(ms) { const d = new Date(ms); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`; }
const H = h => stamp(BASE + Math.round(h * 60) * 60000);
function hOf(day, hhmm) { const [hh, mm] = hhmm.split(':').map(Number); return (Date.UTC(2026, MONTH, DAYS[day], hh, mm) - BASE) / 3600000; }
const at = (day, hhmm) => H(hOf(day, hhmm));
const hOfStamp = t => (Date.parse(t.replace(' ', 'T') + ':00Z') - BASE) / 3600000;
const hhmm = h => H(h).slice(11, 16).replace(':', '');
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const HOURS = 72;   // Mon 0700 -> Thu 0700
module.exports = { BASE, DAYS, p2, stamp, H, hOf, at, hOfStamp, hhmm, slug, HOURS };
