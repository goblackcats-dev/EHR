/* Shared helpers for the in-class DKA patient generators (Caleb Mercer).  h = hours after Mon 2027-01-11 07:00 (simulation start); negative = history. */
const BASE = Date.UTC(2027, 0, 11, 7, 0);
const MONTH = 0;   // January (0-based)
const DAYS = { Wed0: 6, Fri: 8, Sat: 9, Sun: 10, Mon: 11, Tue: 12, Wed: 13 };
const p2 = n => String(n).padStart(2, '0');
function stamp(ms) { const d = new Date(ms); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`; }
const H = h => stamp(BASE + Math.round(h * 60) * 60000);
function hOf(day, hhmm) { const [hh, mm] = hhmm.split(':').map(Number); return (Date.UTC(2027, MONTH, DAYS[day], hh, mm) - BASE) / 3600000; }
const at = (day, hhmm) => H(hOf(day, hhmm));
const hOfStamp = t => (Date.parse(t.replace(' ', 'T') + ':00Z') - BASE) / 3600000;
const hhmm = h => H(h).slice(11, 16).replace(':', '');
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const HOURS = 36;   // Mon 0700 -> Tue 1900
// the ten checkpoints
const STOPS = [['Mon', '07:00'], ['Mon', '11:00'], ['Mon', '15:00'], ['Mon', '19:00'], ['Mon', '23:00'], ['Tue', '03:00'], ['Tue', '07:00'], ['Tue', '11:00'], ['Tue', '15:00'], ['Tue', '19:00']].map(([d, t]) => at(d, t));
module.exports = { BASE, DAYS, p2, stamp, H, hOf, at, hOfStamp, hhmm, slug, HOURS, STOPS };
