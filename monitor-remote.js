/* NursingSim - Remote monitor (v123). Lets a separate computer show the Bedside Monitor for a class session.
   Open monitor.html on that computer, type the instructor's 6-character MONITOR code (or open the link with #mon=CODE).
   It receives the patient, the patient time and the instructor's monitor commands (O2, rhythm, BP...) over the same free PeerJS connection the class session uses,
   and hands them to monitor.html through the same BroadcastChannel the EHR uses in one browser. Depends on vendor/peerjs.min.js. */
(() => {
  'use strict';
  const PREFIX = 'nsim-mon-', ALPHA = /[^A-Z0-9]/g;
  const chan = 'BroadcastChannel' in window ? new BroadcastChannel('nursingsim') : null;
  let peer = null, conn = null, want = '', retry = null;
  const css = document.createElement('style'); css.textContent = '#rmBox{position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);background:#0c1220;color:#e8eefc;border:1px solid #3a4a6a;border-radius:10px;padding:18px 22px;z-index:99999;font:15px system-ui,sans-serif;text-align:center;max-width:90vw}#rmBox input{font:26px monospace;letter-spacing:6px;width:9ch;text-align:center;text-transform:uppercase;margin:8px 0;background:#fff;color:#000;border:0;border-radius:6px}#rmBox button{font:15px system-ui;padding:6px 16px;margin:4px}#rmDot{position:fixed;right:8px;bottom:6px;z-index:99998;font:11px system-ui;color:#8fa;opacity:.7}';
  document.head.appendChild(css);
  const box = document.createElement('div'); box.id = 'rmBox'; box.innerHTML = '<div><b>Connect this screen to the class session</b></div><div style="font-size:13px;opacity:.8">Type the 6-character Monitor code from the instructor.</div><input id="rmCode" maxlength="6" autocomplete="off"><div><button id="rmGo">Connect</button> <button id="rmSkip">Not now</button></div><div id="rmMsg" style="font-size:13px;min-height:18px"></div>';
  document.body.appendChild(box);
  const dot = document.createElement('div'); dot.id = 'rmDot'; document.body.appendChild(dot);
  const $ = id => document.getElementById(id), msg = t => { $('rmMsg').textContent = t; };
  const loadPeer = () => window.Peer ? Promise.resolve() : new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'vendor/peerjs.min.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  const iceServers = () => {
    try { const o = JSON.parse(localStorage.getItem('nursingsim.turn') || 'null'); if (Array.isArray(o) && o.length) return o; } catch (e) { /* default */ }
    const U = 'na.relay.metered.ca';
    return [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun.relay.metered.ca:80' }, { urls: [`turn:${U}:80`, `turn:${U}:80?transport=tcp`, `turn:${U}:443`, `turns:${U}:443?transport=tcp`], username: '96d01918e955c8819300eefb', credential: 'CEYGTzarJNhKoWZ+' }];
  };
  const cfg = () => { try { const o = JSON.parse(localStorage.getItem('nursingsim.peerHost') || 'null'); if (o && o.host) return o; } catch (e) { /* default */ } return { host: '0.peerjs.com', port: 443, secure: true, path: '/' }; };
  function stop() { want = ''; clearTimeout(retry); try { conn && conn.close(); } catch (e) { /* ignore */ } try { peer && peer.destroy(); } catch (e) { /* ignore */ } peer = conn = null; dot.textContent = ''; }
  function later() { clearTimeout(retry); retry = setTimeout(() => { try { peer && peer.destroy(); } catch (e) { /* ignore */ } peer = conn = null; if (want) go(); }, 4000); }
  async function go() {
    const c = cfg();
    try { await loadPeer(); } catch (e) { msg('Could not load the connection tool. Check the internet.'); return; }
    peer = new window.Peer(undefined, { host: c.host, port: c.port, secure: c.secure, path: c.path, debug: 0, config: { iceServers: iceServers(), iceCandidatePoolSize: 4 } });
    dot.textContent = 'Connecting to the class...';
    const t1 = setTimeout(() => { if (want && peer && !peer.open) { msg('Cannot reach the connection service (school network?). Retrying...'); later(); } }, 12000);
    peer.on('open', () => {
      clearTimeout(t1); conn = peer.connect(PREFIX + want, { reliable: true });
      const t2 = setTimeout(() => { if (want && conn && !conn.open) { msg('Found the class but could not connect directly. Retrying...'); later(); } }, 15000);
      conn.on('open', () => { clearTimeout(t2); box.style.display = 'none'; dot.textContent = 'Connected to the class session (monitor ' + want + ')'; try { sessionStorage.setItem('nsmon.remote', want); } catch (e) { /* ignore */ } });
      conn.on('data', d => { if (d && d.t === 'mon' && d.m && chan) { try { chan.postMessage(d.m); } catch (e) { /* ignore */ } } });
      conn.on('close', () => { if (want) { dot.textContent = 'Reconnecting...'; later(); } });
    });
    peer.on('error', err => {
      if (err && err.type === 'peer-unavailable') { box.style.display = ''; msg('That monitor code was not found. Check it with the instructor.'); stop(); }
      else if (want) later();
    });
  }
  function start(code) {
    code = String(code || '').toUpperCase().replace(ALPHA, ''); if (code.length !== 6) { msg('Enter the 6-character monitor code.'); return; }
    stop(); want = code; msg('Connecting...'); go();
  }
  if (chan) chan.onmessage = null;   // (monitor.html owns its own channel object; this one only sends)
  // what the monitor shows (numbers, rhythm) goes back to the instructor's screen so the instructor's monitor panel stays accurate
  if (chan) { const back = new BroadcastChannel('nursingsim'); back.onmessage = e => { const d = e.data || {}; if (d.monitorState && conn && conn.open) { try { conn.send({ t: 'ms', s: d.monitorState }); } catch (err) { /* ignore */ } } }; }
  $('rmGo').onclick = () => start($('rmCode').value); $('rmCode').addEventListener('keydown', e => { if (e.key === 'Enter') start($('rmCode').value); });
  $('rmSkip').onclick = () => { box.style.display = 'none'; };
  const m = (location.hash || '').match(/mon=([A-Za-z0-9]{6})/); let saved = ''; try { saved = sessionStorage.getItem('nsmon.remote') || ''; } catch (e) { /* ignore */ }
  const first = m ? m[1] : saved; if (first) { $('rmCode').value = first.toUpperCase(); start(first); }
})();
