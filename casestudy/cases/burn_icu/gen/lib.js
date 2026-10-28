/* Shared helpers for the Burn ICU patient generators.
   Clock: h = hours after Mon 2026-11-02 04:00 (ICU arrival = simulation start). */
const BASE = Date.UTC(2026, 10, 2, 4, 0);
const DAYS = { Mon: 2, Tue: 3, Wed: 4, Thu: 5 };
const p2 = n => String(n).padStart(2, '0');
function stamp(ms) { const d = new Date(ms); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`; }
const H = h => stamp(BASE + Math.round(h * 60) * 60000);                    // hours after base -> 'YYYY-MM-DD HH:MM'
function hOf(day, hhmm) { const [hh, mm] = hhmm.split(':').map(Number); return (Date.UTC(2026, 10, DAYS[day], hh, mm) - BASE) / 3600000; }
const at = (day, hhmm) => H(hOf(day, hhmm));                                // ('Tue','15:50') -> stamp
const hhmm = h => H(h).slice(11, 16).replace(':', '');
function dayName(h) { const d = new Date(BASE + h * 3600000).getUTCDate(); return Object.keys(DAYS).find(k => DAYS[k] === d) || ''; }
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function interp(pts, h) {                                                   // piecewise-linear through [[h,v],...]
  if (h <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (h <= pts[i][0]) { const [h0, v0] = pts[i - 1], [h1, v1] = pts[i]; return h1 === h0 ? v1 : v0 + (v1 - v0) * (h - h0) / (h1 - h0); }
  return pts[pts.length - 1][1];
}
function step(pts, h) { let v = pts[0][1]; pts.forEach(([t, x]) => { if (h >= t) v = x; }); return v; }   // step function [[h,v],...]
module.exports = { BASE, DAYS, p2, stamp, H, hOf, at, hhmm, dayName, slug, rng, interp, step };
