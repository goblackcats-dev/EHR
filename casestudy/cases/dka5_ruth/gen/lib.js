/* Shared helpers for the DKA patient 5 generators (Ruth Nakamura).  h = hours after Thu 2026-11-05 07:00 (simulation start); negative = history / ED.
   Same helpers as the other DKA patients (casestudy/cases/DKA_SERIES.md): BASE / MONTH / DAYS changed for this start date. */
const BASE = Date.UTC(2026, 10, 5, 7, 0);
const MONTH = 10;   // November (0-based)
const DAYS = { Thu: 5, Fri: 6, Sat: 7, Sun: 8 };   // Thu = Day 1 ... Sun = Day 4
const p2 = n => String(n).padStart(2, '0');
function stamp(ms) { const d = new Date(ms); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`; }
const H = h => stamp(BASE + Math.round(h * 60) * 60000);
function hOf(day, hhmm) { const [hh, mm] = hhmm.split(':').map(Number); return (Date.UTC(2026, MONTH, DAYS[day], hh, mm) - BASE) / 3600000; }
const at = (day, hhmm) => H(hOf(day, hhmm));
const hOfStamp = t => (Date.parse(t.replace(' ', 'T') + ':00Z') - BASE) / 3600000;
const hhmm = h => H(h).slice(11, 16).replace(':', '');
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const HOURS = 72;   // Thu 0700 -> Sun 0700
module.exports = { BASE, DAYS, p2, stamp, H, hOf, at, hOfStamp, hhmm, slug, HOURS };
