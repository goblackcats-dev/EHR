/* NursingSim - secure student links (v45). Shared by the instructor page (encrypt) and the student site (decrypt).
   The patient is locked with AES-256-GCM. The lock file is stored on the student site; the key travels ONLY in the part of the link after "#",
   which browsers never send to any server. Without the full link, the stored file is unreadable noise. Needs HTTPS (or localhost). */
window.NSSecure = (() => {
  'use strict';
  const b64u = buf => { let s = ''; new Uint8Array(buf).forEach(c => { s += String.fromCharCode(c); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64u = str => { const s = atob(String(str).replace(/-/g, '+').replace(/_/g, '/')); const a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; };
  const subtle = () => { if (!window.crypto || !crypto.subtle) throw new Error('This page must be opened over https:// to use secure links.'); return crypto.subtle; };

  function newId(name) {
    const slug = String(name || 'patient').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'patient';
    const r = new Uint8Array(8); crypto.getRandomValues(r);
    return slug + '-' + b64u(r).replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 10);
  }
  async function encrypt(obj) {
    const raw = crypto.getRandomValues(new Uint8Array(32)), iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await subtle().importKey('raw', raw, 'AES-GCM', false, ['encrypt']);
    const ct = await subtle().encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(obj)));
    return { key: b64u(raw), file: { v: 1, alg: 'AES-256-GCM', iv: b64u(iv), ct: b64u(ct) } };
  }
  async function decrypt(file, keyText) {
    if (!file || file.v !== 1 || !file.iv || !file.ct) throw new Error('bad-file');
    const key = await subtle().importKey('raw', unb64u(keyText), 'AES-GCM', false, ['decrypt']);
    const pt = await subtle().decrypt({ name: 'AES-GCM', iv: unb64u(file.iv) }, key, unb64u(file.ct));
    return JSON.parse(new TextDecoder().decode(pt));
  }
  const validId = id => /^[a-z0-9-]{3,60}$/.test(String(id || ''));
  return { newId, encrypt, decrypt, validId };
})();
