/* NursingSim Case Builder v2 - shared utilities.
   Everything is attached to one global object, NS, so the plain <script> files can share code. */
window.NS = window.NS || {};

NS.util = (() => {
  const pad = n => String(n).padStart(2, '0');

  // "2026-09-02 07:00" <-> milliseconds. Dates are handled as UTC so daylight-saving changes never shift a case.
  function parse(text) {
    const m = String(text || '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
    if (!m) return NaN;
    return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  }
  function fmt(ms) {
    const d = new Date(ms);
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  }
  const addH = (text, hours) => fmt(parse(text) + Math.round(hours * 3600000));
  const hhmm = text => String(text).slice(11, 13) + String(text).slice(14, 16);
  const dateOnly = text => String(text).slice(0, 10);
  const mdy = text => `${String(text).slice(5, 7)}/${String(text).slice(8, 10)}/${String(text).slice(2, 4)}`;
  const epic = text => `${mdy(text)} ${hhmm(text)}`;
  const weekday = text => new Date(parse(text)).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
  const longDate = text => new Date(parse(text)).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

  // Small seeded random generator so the same inputs always build the same patient.
  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const round = (v, d = 0) => { const f = 10 ** d; return Math.round(v * f) / f; };
  const slug = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const clone = value => JSON.parse(JSON.stringify(value));
  const uniq = arr => Array.from(new Set(arr));

  // Linear interpolation across [[hour, value], ...] keyframes (held flat before the first and after the last).
  function interp(frames, h) {
    if (!frames || !frames.length) return undefined;
    if (h <= frames[0][0]) return frames[0][1];
    const last = frames[frames.length - 1];
    if (h >= last[0]) return last[1];
    for (let i = 0; i < frames.length - 1; i++) {
      const [h0, v0] = frames[i], [h1, v1] = frames[i + 1];
      if (h >= h0 && h <= h1) return h1 === h0 ? v1 : v0 + (v1 - v0) * ((h - h0) / (h1 - h0));
    }
    return last[1];
  }

  // Latest step keyframe whose "fromH" is at or before h.
  function stepAt(frames, h, key = 'fromH') {
    let current = null;
    (frames || []).forEach(frame => { if (frame[key] <= h + 1e-9) current = frame; });
    return current;
  }

  const inWindow = (windows, h) => (windows || []).some(([a, b]) => h >= a && h < b);

  const list = (items, conj = 'and') => {
    const a = (items || []).filter(Boolean);
    if (a.length <= 1) return a.join('');
    if (a.length === 2) return `${a[0]} ${conj} ${a[1]}`;
    return `${a.slice(0, -1).join(', ')}, ${conj} ${a[a.length - 1]}`;
  };
  const cap = s => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);
  const ordinal = n => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };

  return { pad, parse, fmt, addH, hhmm, dateOnly, mdy, epic, weekday, longDate, hashString, mulberry32, clamp, round, slug, clone, uniq, interp, stepAt, inWindow, list, cap, ordinal };
})();
