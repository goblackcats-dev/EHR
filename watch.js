/* NursingSim - Class session (v93): Live student view (v79) plus a SYNCED CLASS SIMULATION. With one class code the instructor sees every student's screen AND everyone shares the same patient and the same patient time (the instructor's clock and Monitor/time buttons drive all student screens).
   Live student view (v79).
   A student can choose to SHARE THEIR SCREEN with the instructor; the instructor opens "Live student view", gets a 6-character code, and sees a tile for every student
   who joins, updating live (rrweb records what is on the student's page; PeerJS carries it straight from the student's browser to the instructor's browser).
   Nothing is stored anywhere. The free PeerJS cloud server only introduces the two browsers. It needs internet on both devices and a network that allows direct
   (WebRTC) connections; some school Wi-Fi blocks this. The student always sees a banner while sharing and can stop at any time.
   Depends on vendor/peerjs.min.js and vendor/rrweb.umd.min.js (loaded only when someone uses the feature), signin.js (NSUser, optional). */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const PREFIX = 'nsim-';
  const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const peerConfig = () => {   // default: the free PeerJS cloud server; a different server can be set in localStorage 'nursingsim.peerHost' as {"host":"...","port":9000,"secure":false,"path":"/"}
    try { const o = JSON.parse(localStorage.getItem('nursingsim.peerHost') || 'null'); if (o && o.host) return o; } catch (e) { /* default */ }
    return { host: '0.peerjs.com', port: 443, secure: true, path: '/' };
  };
  // direct (WebRTC) connections: Google STUN servers plus a free public TURN relay as a fallback for school Wi-Fi that blocks direct paths.
  // (the relay only passes encrypted traffic). A different TURN server can be put in localStorage 'nursingsim.turn' as a JSON list of iceServers.
  // Cloudflare relay (free, 1,000 GB/month): a small Worker hands out short-lived relay logins so no secret is stored in this public site. Fetched once per page (and again after 12 hours).
  const ICE_WORKER = 'https://nursingsim-ice.goblackcats.workers.dev';
  const cf = { ice: null, at: 0, p: null };
  function loadCfIce() {
    if (cf.ice && Date.now() - cf.at < 12 * 3600000) return Promise.resolve(cf.ice);
    if (cf.p) return cf.p;
    cf.p = Promise.race([fetch(ICE_WORKER, { cache: 'no-store' }).then(r => r.ok ? r.json() : null), new Promise(r => setTimeout(() => r(null), 5000))])
      .then(j => { const a = j && j.iceServers; const list = Array.isArray(a) ? a : (a ? [a] : []); if (list.length) { cf.ice = list; cf.at = Date.now(); } return cf.ice; })
      .catch(() => cf.ice).finally(() => { cf.p = null; });
    return cf.p;
  }
  const iceServers = () => {
    // a relay put in the link by the instructor (students), or saved in the Class session window (instructor)
    try { const j = JSON.parse(sessionStorage.getItem('nursingsim.iceJoin') || 'null'); if (Array.isArray(j) && j.length) return j; } catch (e) { /* ignore */ }
    try { const o = JSON.parse(localStorage.getItem('nursingsim.turn') || 'null'); if (Array.isArray(o) && o.length) return o; } catch (e) { /* default */ }
    if (cf.ice && cf.ice.length) return [{ urls: 'stun:stun.l.google.com:19302' }].concat(cf.ice);
    // last resort: the built-in Metered relay (its free data is used up for now). The instructor's free Metered.ca TURN account so no one has to enter anything; the instructor chose to keep it in the public repo
    const U = 'na.relay.metered.ca', user = '96d01918e955c8819300eefb', cred = 'CEYGTzarJNhKoWZ+';
    return [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun.relay.metered.ca:80' },
      { urls: [`turn:${U}:80`, `turn:${U}:80?transport=tcp`, `turn:${U}:443`, `turns:${U}:443?transport=tcp`], username: user, credential: cred }];
  };
  const peerOpts = cfg => ({ host: cfg.host, port: cfg.port, secure: cfg.secure, path: cfg.path, debug: 0, config: { iceServers: iceServers(), iceCandidatePoolSize: 4 } });
  const me = () => (window.NSUser && NSUser.current()) || null;
  const label = () => { const u = me(); return u ? `${u.first} ${u.last}` : 'Student'; };
  const isInstructor = () => { const u = me(); return !window.NS_STUDENT && (!u || u.role === 'Instructor'); };

  // ------------------------------------------------------------------ load the libraries only when needed
  const loaded = {};
  function loadScript(src) { return loaded[src] || (loaded[src] = new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src)); document.head.appendChild(s); })); }
  function loadCss(href) { if (document.querySelector(`link[href="${href}"]`)) return; const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l); }
  const libs = () => Promise.all([loadScript('vendor/peerjs.min.js'), loadScript('vendor/rrweb.umd.min.js'), loadCfIce()]).then(() => loadCss('vendor/rrweb.min.css'));

  // ------------------------------------------------------------------ student side: share my screen
  let sh = { peer: null, conn: null, stop: null, buf: [], timer: null, ping: null, code: '', want: false, retry: null };
  function banner(text, withStop) {
    let b = $('lvBanner');
    if (!text) { if (b) b.remove(); return; }
    if (!b) { b = document.createElement('div'); b.id = 'lvBanner'; b.className = 'lv-banner'; document.body.appendChild(b); }
    b.innerHTML = `<span class="lv-dot"></span><span>${esc(text)}</span>${withStop ? '<button type="button" id="lvStop">Leave class</button>' : ''}`;
    const st = $('lvStop'); if (st) st.addEventListener('click', stopShare);
  }
  // DATA SAVER (v124): the free relay has a monthly data limit. A full picture of the page is about 600 KB, so (1) it is sent once (when the instructor's tile starts or asks again), not every 90 seconds,
  // and (2) every batch is gzip-compressed (about 10x smaller) when the browser can.
  const gz = async (str, mode) => { const cs = new (mode === 'c' ? CompressionStream : DecompressionStream)('gzip'); const w = cs.writable.getWriter(); w.write(mode === 'c' ? new TextEncoder().encode(str) : str); w.close(); const buf = await new Response(cs.readable).arrayBuffer(); return mode === 'c' ? new Uint8Array(buf) : new TextDecoder().decode(buf); };
  const canGz = typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';
  let flushing = false;
  async function flush() {
    if (flushing || !sh.conn || !sh.conn.open || !sh.buf.length) return; flushing = true;
    const batch = sh.buf.splice(0);
    try {
      const json = JSON.stringify(batch);
      if (canGz && json.length > 1500) sh.conn.send({ t: 'evz', z: await gz(json, 'c') }); else sh.conn.send({ t: 'ev', e: batch });
    } catch (e) { sh.buf.unshift(...batch); } finally { flushing = false; }
  }
  function startRecording() {
    if (sh.stop) return;
    sh.stop = window.rrweb.record({
      emit: e => { sh.buf.push(e); }, sampling: { mousemove: false, scroll: 150, input: 'last' }, recordCanvas: false, collectFonts: false, checkoutEveryNms: 0, inlineStylesheet: true
    });
    sh.timer = setInterval(flush, 400);
    sh.ping = setInterval(() => { if (sh.conn && sh.conn.open) { try { sh.conn.send({ t: 'ping', name: label(), role: (me() || {}).role || '', section: document.title }); } catch (e) { /* ignore */ } } }, 5000);
  }
  function stopRecording() { if (sh.stop) { try { sh.stop(); } catch (e) { /* ignore */ } sh.stop = null; } clearInterval(sh.timer); clearInterval(sh.ping); sh.buf = []; }
  function connectShare() {
    if (!sh.want) return;
    const cfg = peerConfig();
    sh.peer = new window.Peer(undefined, peerOpts(cfg));
    setMsg('Step 1 of 2: reaching the class connection service...');
    clearTimeout(sh.t1); sh.t1 = setTimeout(() => { if (sh.want && sh.peer && !sh.peer.open) { setMsg('Cannot reach the class connection service. The school network may be blocking it. Try the school Wi-Fi guest network, a phone hotspot, or ask your instructor. (Retrying...)', true); scheduleRetry(); } }, 12000);
    sh.peer.on('open', () => {
      clearTimeout(sh.t1); setMsg('Step 2 of 2: connecting to your instructor...');
      const conn = sh.peer.connect(PREFIX + sh.code, { reliable: true });
      sh.conn = conn;
      clearTimeout(sh.t2); sh.t2 = setTimeout(() => { if (sh.want && sh.conn === conn && !conn.open) { setMsg('Found the class, but your device could not connect directly to your instructor. The network may block direct connections (try a phone hotspot, or your instructor can add a relay server). Retrying...', true); scheduleRetry(); } }, 20000);
      conn.on('open', () => {
        clearTimeout(sh.t2);
        sessionStorage.setItem('nursingsim.liveCode', sh.code);
        conn.send({ t: 'hello', name: label(), role: (me() || {}).role || '', title: document.title, caseKey: (typeof currentCanonicalCase !== 'undefined' && currentCanonicalCase) ? caseKey(currentCanonicalCase) : '' }); enterSync(); if (window.NSChartSync) NSChartSync.start(p => { if (sh.conn && sh.conn.open) sh.conn.send({ t: 'chart', p }); }, false);
        startRecording(); banner('Your screen is shared with your instructor (class simulation)', true); setMsg('Connected. You are in the class simulation.'); setTimeout(() => { const j = $('lvJoin'); if (j && j.open) j.close(); }, 1200);
        try { window.rrweb.record.takeFullSnapshot(true); } catch (e) { /* the instructor asks again if needed */ }
      });
      conn.on('data', d => { if (d && d.t === 'case') loadClassCase(d); if (d && d.t === 'st') onState(d); if (d && d.t === 'chart' && window.NSChartSync) NSChartSync.receive(d.p); if (d && d.t === 'say') say(d.text); if (d && d.t === 'resync') { try { window.rrweb.record.takeFullSnapshot(true); } catch (e) { /* ignore */ } } if (d && d.t === 'bye') stopShare(); });
      conn.on('close', () => { if (sh.want) { banner('Reconnecting to your instructor...', true); stopRecording(); scheduleRetry(); } });
      conn.on('error', () => { if (sh.want) scheduleRetry(); });
    });
    sh.peer.on('error', err => {
      if (err && err.type === 'peer-unavailable') { setMsg('That code was not found. Check it with your instructor and try again.', true); fullStop(); }
      else if (sh.want) { setMsg('Could not reach the connection service (' + ((err && err.type) || 'error') + '). Check the Wi-Fi and try again.', true); scheduleRetry(); }
    });
  }
  function scheduleRetry() { clearTimeout(sh.retry); sh.retry = setTimeout(() => { try { sh.peer && sh.peer.destroy(); } catch (e) { /* ignore */ } sh.peer = null; sh.conn = null; connectShare(); }, 5000); }
  function fullStop() { sh.want = false; clearTimeout(sh.retry); clearTimeout(sh.t1); clearTimeout(sh.t2); stopRecording(); try { sh.conn && sh.conn.close(); } catch (e) { /* ignore */ } try { sh.peer && sh.peer.destroy(); } catch (e) { /* ignore */ } sh.peer = sh.conn = null; banner(''); }
  function stopShare() { leaveSync(); fullStop(); sessionStorage.removeItem('nursingsim.liveCode'); setMsg('Sharing stopped.'); }
  async function startShare(code) {
    code = String(code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 6) { setMsg('Enter the 6-character code from your instructor.', true); return; }
    setMsg('Connecting...'); fullStop(); sh.code = code; sh.want = true;
    try { await libs(); } catch (e) { setMsg('Could not load the sharing tools. Check the connection.', true); sh.want = false; return; }
    connectShare();
  }

  // ------------------------------------------------------------------ synced class simulation (student side)
  const caseKey = c => c ? ((c.caseMeta && c.caseMeta.caseId) || (c.patient && c.patient.id) || '') : '';
  const cs = { on: false, target: null, paused: false, sec: 0 };
  function badge(text) {
    const grp = document.querySelector('.simulation-clock-controls'); if (!grp) return;
    let b = $('csBadge'); if (!b) { b = document.createElement('span'); b.id = 'csBadge'; b.className = 'cs-badge'; grp.insertBefore(b, grp.firstChild); }
    b.textContent = text;
  }
  function enterSync() { cs.on = true; document.body.classList.add('class-synced'); try { if (typeof simSetPaused === 'function') simSetPaused(true); } catch (e) { /* ignore */ } badge('Class simulation: time is set by your instructor'); }
  function leaveSync() { if (window.NSChartSync) NSChartSync.stop(); if (window.NSQuick) NSQuick.setSession(null); if (!cs.on) return; cs.on = false; document.body.classList.remove('class-synced'); const b = $('csBadge'); if (b) b.remove(); try { if (typeof simSetPaused === 'function') simSetPaused(false); } catch (e) { /* ignore */ } }
  function say(text) { const t = document.createElement('div'); t.className = 'cs-say'; t.textContent = text; document.body.appendChild(t); setTimeout(() => t.remove(), 9000); t.addEventListener('click', () => t.remove()); }
  function loadClassCase(d) {
    try {
      const canonical = JSON.parse(d.json); if (typeof renderPatient !== 'function') return;
      renderPatient(canonical); if (window.NSChartSync) NSChartSync.baseline(); cs.target = d.time || null; applyTarget();
      say('Your instructor opened the patient: ' + ((canonical.patient && canonical.patient.name) || ''));
    } catch (e) { say('Could not load the class patient. Ask your instructor to send it again.'); }
  }
  function onState(d) {
    cs.target = d.time || cs.target; cs.paused = !!d.paused; cs.sec = d.sec || 0; if (window.NSQuick) NSQuick.setSession(!!d.quick);
    const b = $('csBadge'); if (b) b.textContent = cs.paused ? 'Class simulation: PAUSED by your instructor' : 'Class simulation: time is set by your instructor';
    applyTarget();
  }
  function applyTarget() {
    if (!cs.on || !cs.target || typeof simulationTime === 'undefined' || !simulationTime) return;
    try {
      const cur = parseSimDate(simulationTime), tgt = parseSimDate(cs.target);
      if (cur && tgt && cur.getTime() !== tgt.getTime()) {
        if (typeof simClockBusy === 'function' && simClockBusy()) return;      // do not redraw the page while the student is typing or has a window open
        if (tgt > cur) advanceSimulation(Math.round((tgt - cur) / 60000));
        else { simulationTime = cs.target; refreshSimulationView(); }
      }
      if (typeof simClock !== 'undefined') { simClock.seconds = cs.paused ? simClock.seconds : cs.sec; if (typeof renderSimulationClock === 'function') renderSimulationClock(); }
    } catch (e) { /* try again on the next update */ }
  }
  setInterval(() => { if (cs.on) applyTarget(); }, 1500);
  function setMsg(t, bad) { const m = $('lvJoinMsg'); if (m) { m.textContent = t; m.className = 'lv-msg' + (bad ? ' bad' : ''); } }
  function openJoin() {
    let dlg = $('lvJoin');
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.id = 'lvJoin'; dlg.className = 'lv-dialog lv-small';
      dlg.innerHTML = `<div class="dialog-header"><div><h2>Join the class simulation</h2><p>Your instructor gives you a 6-character code. When you join, you see the same patient and the same patient time as your instructor, and your instructor can see your screen. A banner stays visible, and you can leave at any time.</p></div><button class="icon-button" id="lvJoinX" aria-label="Close">×</button></div>
        <div class="dialog-body"><label class="input-label" for="lvCode">Class code</label><input id="lvCode" class="lv-code-in" maxlength="8" autocomplete="off" autocapitalize="characters" placeholder="ABC123" />
        <div id="lvJoinMsg" class="lv-msg"></div><div class="lv-actions"><button class="primary-button" id="lvJoinGo">Join class</button> <button class="secondary-button" id="lvJoinStop">Leave class</button></div></div>`;
      document.body.appendChild(dlg);
      dlg.querySelector('#lvJoinX').addEventListener('click', () => dlg.close());
      dlg.querySelector('#lvJoinGo').addEventListener('click', () => startShare($('lvCode').value));
      dlg.querySelector('#lvCode').addEventListener('keydown', e => { if (e.key === 'Enter') startShare($('lvCode').value); });
      dlg.querySelector('#lvJoinStop').addEventListener('click', stopShare);
    }
  const saved = sessionStorage.getItem('nursingsim.liveCode'); if (saved && !$('lvCode').value) $('lvCode').value = saved;
    dlg.showModal(); setTimeout(() => $('lvCode').focus(), 60);
  }

  // ------------------------------------------------------------------ instructor side: watch the class
  const host = { peer: null, code: '', students: new Map(), dlg: null };
  const newCode = () => Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
  function fit(st) {
    if (!st.dim || !st.view) return;
    const k = Math.min(1, st.view.clientWidth / st.dim.width);
    st.replayer.wrapper.style.transformOrigin = 'top left'; st.replayer.wrapper.style.transform = `scale(${k})`;
    st.view.style.height = Math.ceil(st.dim.height * k) + 'px';
  }
  function makeTile(conn, hello) {
    const tile = document.createElement('div'); tile.className = 'lv-tile';
    tile.innerHTML = `<div class="lv-head"><span class="lv-dot"></span><b></b><span class="lv-role"></span><button type="button" class="lv-big" title="Make bigger or smaller">Enlarge</button></div><div class="lv-view"></div>`;
    tile.querySelector('b').textContent = hello.name || 'Student'; tile.querySelector('.lv-role').textContent = hello.role || '';
    host.dlg.querySelector('#lvGrid').appendChild(tile);
    const view = tile.querySelector('.lv-view');
    const replayer = new window.rrweb.Replayer([], { root: view, liveMode: true, mouseTail: false, UNSAFE_replayCanvas: false });
    replayer.startLive();
    const st = { conn, tile, view, replayer, dim: null, last: Date.now() };
    replayer.on('resize', d => { st.dim = d; fit(st); });
    tile.querySelector('.lv-big').addEventListener('click', () => { tile.classList.toggle('lv-large'); setTimeout(() => fit(st), 50); });
    new ResizeObserver(() => fit(st)).observe(view);
    return st;
  }
  function onData(conn, d) {
    if (!d) return;
    let st = host.students.get(conn.peer);
    if (d.t === 'hello') {
      if (st) { st.tile.remove(); }
      if (host.students.size >= 60 && !st) { conn.close(); return; }
      st = makeTile(conn, d); host.students.set(conn.peer, st); conn.send({ t: 'resync' }); updateCount();
      if (sync.on) { stash(false); if (d.caseKey !== sync.key) sendCase(conn); if (window.NSChartSync) { try { conn.send({ t: 'chart', p: NSChartSync.full() }); } catch (e) { /* ignore */ } } tickSync(); }
      return;
    }
    if (!st) return;
    st.last = Date.now();
    if (d.t === 'chart') { if (sync.on && window.NSChartSync) { NSChartSync.receive(d.p); host.students.forEach(s => { if (s.conn !== conn && s.conn.open) { try { s.conn.send({ t: 'chart', p: d.p }); } catch (e) { /* ignore */ } } }); } return; }
    if (d.t === 'ev') { st.q = (st.q || Promise.resolve()).then(() => (d.e || []).forEach(e => { try { st.replayer.addEvent(e); } catch (err) { /* a damaged event is skipped */ } })); }
    if (d.t === 'evz') { st.q = (st.q || Promise.resolve()).then(() => gz(d.z, 'd')).then(txt => JSON.parse(txt).forEach(e => { try { st.replayer.addEvent(e); } catch (err) { /* a damaged event is skipped */ } })).catch(() => {}); }
    if (d.t === 'ping' && d.name) { st.tile.querySelector('b').textContent = d.name; }
  }

  // synced class simulation (instructor side): one connection per student carries the patient, the patient time and the screen
  const sync = { on: true, key: '', json: '', timer: null };
  function stash(force) { if (typeof currentCanonicalCase === 'undefined' || !currentCanonicalCase) return false; const k = caseKey(currentCanonicalCase); if (force || k !== sync.key) { sync.key = k; sync.json = JSON.stringify(currentCanonicalCase); return true; } return false; }
  function sendCase(conn) { if (!sync.on || !sync.json || !conn || !conn.open) return; try { conn.send({ t: 'case', key: sync.key, json: sync.json, time: typeof simulationTime === 'undefined' ? null : simulationTime }); } catch (e) { /* ignore */ } }
  function tickSync() {
    if (!sync.on) return;
    if (stash(false)) host.students.forEach(s => sendCase(s.conn));
    const msg = { t: 'st', quick: !!(window.NSQuick && NSQuick.local()), time: typeof simulationTime === 'undefined' ? null : simulationTime, paused: typeof simClock !== 'undefined' && !!simClock.paused, sec: typeof simClock !== 'undefined' ? simClock.seconds : 0 };
    host.students.forEach(s => { if (s.conn && s.conn.open) { try { s.conn.send(msg); } catch (e) { /* ignore */ } } });
  }
  // the relay the instructor saved (JSON list of iceServers, or a simple turn: line) goes into the student link so every student uses it
  const savedRelay = () => { try { const o = JSON.parse(localStorage.getItem('nursingsim.turn') || 'null'); return Array.isArray(o) && o.length ? o : null; } catch (e) { return null; } };
  const b64u = str => btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const joinLink = () => studentBase() + '#join=' + host.code + (savedRelay() ? '&ice=' + b64u(JSON.stringify(savedRelay())) : '');
  const studentBase = () => { try { return localStorage.getItem('nursingsim.studentSiteUrl') || 'https://goblackcats-dev.github.io/EHR/student-site/'; } catch (e) { return 'https://goblackcats-dev.github.io/EHR/student-site/'; } };
  function updateCount() {
    const live = [...host.students.values()].filter(s => Date.now() - s.last < 20000).length;
    const c = host.dlg && host.dlg.querySelector('#lvCount'); if (c) c.textContent = `${live} sharing now (${host.students.size} joined)`;
    host.students.forEach(s => s.tile.classList.toggle('lv-idle', Date.now() - s.last >= 20000));
  }
  // ---- a separate Monitor computer: its own 6-character code (not the student code); it receives the patient, the patient time and the instructor's monitor commands
  const mon = { peer: null, code: '', conns: new Set(), last: null, chan: null };
  const monUrl = () => new URL('monitor.html', location.href).href.replace(/#.*$/, '');
  const monLink = () => monUrl() + '#mon=' + mon.code;
  function monState() {
    const st = typeof simulationTime === 'undefined' ? '' : String(simulationTime || '');
    let mrn = ''; try { mrn = localStorage.getItem('nursingsim.mrn') || ''; } catch (e) { /* ignore */ }
    const m = Object.assign({}, mon.last || {}); if (st) m.simTime = st; if (mrn) m.mrn = mrn; return m;
  }
  function monSend(msg, one) { (one ? [one] : [...mon.conns]).forEach(c => { if (c.open) { try { c.send(msg); } catch (e) { /* ignore */ } } }); }
  function monCount() { const n = [...mon.conns].filter(c => c.open).length; const e = host.dlg && host.dlg.querySelector('#lvMonN'); if (e) e.textContent = n ? '(' + n + ' monitor connected)' : '(no monitor connected yet)'; }
  function startMonitorHost() {
    mon.code = newCode(); const cfg = peerConfig();
    mon.peer = new window.Peer(PREFIX + 'mon-' + mon.code, peerOpts(cfg));
    mon.peer.on('open', () => { const c = host.dlg.querySelector('#lvMonCode'); if (c) c.textContent = mon.code; const u = host.dlg.querySelector('#lvMonUrl'); if (u) u.textContent = monUrl(); monCount(); });
    mon.peer.on('connection', conn => {
      conn.on('open', () => { mon.conns.add(conn); monSend({ t: 'mon', m: monState() }, conn); monSend({ t: 'mon', m: { cmd: 'getState' } }, conn); monCount(); });
      conn.on('close', () => { mon.conns.delete(conn); monCount(); });
      conn.on('error', () => { mon.conns.delete(conn); monCount(); });
      conn.on('data', d => { if (d && d.t === 'ms' && mon.chan) { try { mon.chan.postMessage({ monitorState: d.s }); } catch (e) { /* ignore */ } } });
    });
    mon.peer.on('error', err => { if (err && err.type === 'unavailable-id') { try { mon.peer.destroy(); } catch (e) { /* ignore */ } startMonitorHost(); } });
    if ('BroadcastChannel' in window && !mon.chan) {   // everything the EHR tells a same-browser monitor (time, patient, instructor commands) is passed on to the remote monitor too
      mon.chan = new BroadcastChannel('nursingsim');
      mon.chan.onmessage = e => { const d = e.data || {}; if (d.monitorState || d.hello) return; if (d.simTime || d.mrn) mon.last = { simTime: d.simTime, mrn: d.mrn, name: d.name }; monSend({ t: 'mon', m: d }); };
    }
    clearInterval(mon.timer); mon.timer = setInterval(() => monSend({ t: 'mon', m: monState() }), 3000);
  }
  async function startHost() {
    await libs();
    host.code = newCode();
    const cfg = peerConfig();
    host.peer = new window.Peer(PREFIX + host.code, peerOpts(cfg));
    host.peer.on('open', () => { const c = host.dlg.querySelector('#lvCodeBig'); c.textContent = host.code; host.dlg.querySelector('#lvStatus').textContent = 'Ready. Send students the link below (or tell them the code: they choose Join class).'; });
    host.peer.on('connection', conn => { conn.on('data', d => onData(conn, d)); conn.on('close', () => { const st = host.students.get(conn.peer); if (st) { st.last = 0; updateCount(); } }); });
    host.peer.on('error', err => { if (err && err.type === 'unavailable-id') { host.peer.destroy(); startHost(); } else host.dlg.querySelector('#lvStatus').textContent = 'Could not reach the connection service (' + ((err && err.type) || 'error') + '). Check the internet connection.'; });
    startMonitorHost();
    host.timer = setInterval(updateCount, 5000); sync.timer = setInterval(tickSync, 1000); stash(true);
    if (window.NSChartSync) NSChartSync.start(p => { if (sync.on) host.students.forEach(s => { if (s.conn && s.conn.open) { try { s.conn.send({ t: 'chart', p }); } catch (e) { /* ignore */ } } }); }, true);
  }
  function endHost() { clearInterval(mon.timer); mon.conns.forEach(c => { try { c.close(); } catch (e) { /* ignore */ } }); mon.conns.clear(); try { mon.peer && mon.peer.destroy(); } catch (e) { /* ignore */ } clearInterval(host.timer); clearInterval(sync.timer); if (window.NSChartSync) NSChartSync.stop(); host.students.forEach(s => { try { s.conn.send({ t: 'bye' }); s.conn.close(); } catch (e) { /* ignore */ } }); host.students.clear(); try { host.peer && host.peer.destroy(); } catch (e) { /* ignore */ } host.peer = null; host.code = ''; if (host.dlg) { host.dlg.remove(); host.dlg = null; } }
  function openWatch() {
    if (host.dlg) { host.dlg.showModal(); host.students.forEach(fit); return; }
    const dlg = document.createElement('dialog'); dlg.id = 'lvWatch'; dlg.className = 'lv-dialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Class session</h2><p id="lvStatus">Starting...</p></div><div class="lv-head-r"><div class="lv-codebox">Class code<div id="lvCodeBig">------</div></div><button class="secondary-button" id="lvMin">Hide window</button> <button class="secondary-button" id="lvEnd">End session</button></div></div>
      <div class="dialog-body"><div class="lv-sync"><label><input type="checkbox" id="lvSyncOn" checked> <b>Run the class together</b>: students see this patient and this patient time (use the clock buttons, pause and the Monitor as usual; student clocks follow yours)</label><div><label><input type="checkbox" id="lvQuick"> <b>Quick give</b>: students tap a due dose to give it at once (they say they gave it; no scanning)</label></div><div class="lv-link">Link for students (send once): <input id="lvLink" readonly onclick="this.select()"> <button class="secondary-button" id="lvCopy">Copy link</button></div><div class="lv-sync" style="margin-top:8px"><b>Monitor computer</b> (a separate code: it shows only the Bedside Monitor): open <b id="lvMonUrl"></b> on that computer and type the code <b id="lvMonCode" style="font-size:18px;letter-spacing:3px;color:#0b5cad">------</b> <button class="secondary-button" id="lvMonCopy">Copy monitor link</button> <span id="lvMonN" style="font-size:12px"></span></div><details class="lv-relay"><summary><b>Students cannot connect? Add a relay server (advanced)</b></summary><p style="margin:6px 0;font-size:13px">School Wi-Fi sometimes blocks direct connections. A free relay fixes it: make a free account at <b>metered.ca</b> (TURN server), copy the three values it shows, and paste them here. They are added to the student link automatically.</p><input id="lvTurnUrl" placeholder="Server address, e.g. turn:global.relay.metered.ca:443" style="width:100%;padding:6px;margin:2px 0"><input id="lvTurnUser" placeholder="Username" style="width:49%;padding:6px"> <input id="lvTurnCred" placeholder="Password / credential" style="width:49%;padding:6px"><div class="lv-actions"><button class="secondary-button" id="lvTurnSave">Save relay</button> <button class="secondary-button" id="lvTurnClear">Remove relay</button> <span id="lvTurnMsg" style="font-size:13px"></span></div></details><div class="lv-actions"><button class="secondary-button" id="lvTest">Test the relay</button> <span id="lvTestMsg" style="font-size:12px"></span> <button class="secondary-button" id="lvResend">Send my patient to everyone again</button> <button class="secondary-button" id="lvSay">Message to class...</button></div></div><div id="lvCount" class="lv-count">0 sharing now</div><div id="lvGrid" class="lv-grid"></div><p class="lv-note">Students open the student site, choose <b>Join class</b> and type the code (or open the link above). The tiles update live. Click Enlarge on a tile to see it bigger. Hiding this window keeps the session running; reopen it from the Tools menu. If a student cannot connect, the school Wi-Fi may block direct connections.</p></div>`;
    document.body.appendChild(dlg); host.dlg = dlg;
    dlg.querySelector('#lvMin').addEventListener('click', () => dlg.close());
    dlg.querySelector('#lvEnd').addEventListener('click', () => { if (confirm('End the live session? Students will stop sharing.')) endHost(); });
    const q = id => dlg.querySelector('#' + id);
    q('lvSyncOn').addEventListener('change', e => { sync.on = e.target.checked; if (sync.on) { stash(true); host.students.forEach(s => sendCase(s.conn)); } });
    q('lvQuick').checked = !!(window.NSQuick && NSQuick.local()); q('lvQuick').addEventListener('change', e => { if (window.NSQuick) NSQuick.setLocal(e.target.checked); });
    { const cur = savedRelay(); if (cur && cur[0]) { const r = cur.find(x => x.username) || cur[0]; q('lvTurnUrl').value = [].concat(r.urls || [])[0] || ''; q('lvTurnUser').value = r.username || ''; q('lvTurnCred').value = r.credential || ''; } }
    q('lvTurnSave').addEventListener('click', () => { const u = q('lvTurnUrl').value.trim(), n = q('lvTurnUser').value.trim(), c = q('lvTurnCred').value.trim(); if (!/^turns?:/i.test(u) || !n || !c) { q('lvTurnMsg').textContent = 'Fill in all three (the address starts with turn:).'; return; } const base = u.replace(/\?.*$/, '').replace(/^turn(s?):/i, 'turn$1:'); const host0 = base.replace(/^turns?:/i, '').replace(/:\d+$/, ''); const urls = [base, `turn:${host0}:80`, `turn:${host0}:443?transport=tcp`, `turns:${host0}:443?transport=tcp`]; try { localStorage.setItem('nursingsim.turn', JSON.stringify([{ urls: 'stun:stun.l.google.com:19302' }, { urls: [...new Set(urls)], username: n, credential: c }])); } catch (e) { /* ignore */ } q('lvTurnMsg').textContent = 'Saved. Click End session, then open Class session again and copy the new link.'; });
    q('lvTurnClear').addEventListener('click', () => { try { localStorage.removeItem('nursingsim.turn'); } catch (e) { /* ignore */ } q('lvTurnUrl').value = q('lvTurnUser').value = q('lvTurnCred').value = ''; q('lvTurnMsg').textContent = 'Removed. End the session and reopen it.'; });
    q('lvTest').addEventListener('click', async () => {
      const m = q('lvTestMsg'); m.style.color = ''; m.textContent = 'Testing (up to 10 seconds)...';
      try {
        await loadCfIce();
        const pc = new RTCPeerConnection({ iceServers: iceServers(), iceTransportPolicy: 'relay' }); const got = [], errs = [];
        pc.onicecandidate = e => { if (e.candidate) got.push(e.candidate.candidate); }; pc.onicecandidateerror = e => errs.push(e.errorCode + ' ' + (e.errorText || ''));
        pc.createDataChannel('t'); await pc.setLocalDescription(await pc.createOffer());
        await new Promise(r => { const t0 = Date.now(); const iv = setInterval(() => { if (got.length || pc.iceGatheringState === 'complete' || Date.now() - t0 > 10000) { clearInterval(iv); r(); } }, 300); });
        pc.close();
        m.textContent = got.length ? 'Relay WORKS: the relay server answered.' : 'Relay did NOT answer' + (errs.length ? ' (' + errs[0] + ')' : '') + '. Check the username and password, or try another network.';
        m.style.color = got.length ? '#0a7a2f' : '#b00020';
      } catch (e) { m.textContent = 'Test could not run: ' + e.message; }
    });
    q('lvMonCopy').addEventListener('click', () => { try { navigator.clipboard.writeText(monLink()); } catch (e) { /* ignore */ } q('lvMonCopy').textContent = 'Copied'; setTimeout(() => q('lvMonCopy').textContent = 'Copy monitor link', 1500); });
    q('lvResend').addEventListener('click', () => { if (confirm('Send your open patient to every student again? Their own charting on this patient will be replaced.')) { stash(true); host.students.forEach(s => { sendCase(s.conn); try { s.conn.send({ t: 'chart', p: NSChartSync.full() }); } catch (e) { /* ignore */ } }); } });
    q('lvSay').addEventListener('click', () => { const t = prompt('Message to show on every student screen:'); if (t) host.students.forEach(s => { try { s.conn.send({ t: 'say', text: t }); } catch (e) { /* ignore */ } }); });
    q('lvCopy').addEventListener('click', () => { const t = q('lvLink').value; try { navigator.clipboard.writeText(t); } catch (e) { /* ignore */ } q('lvCopy').textContent = 'Copied'; setTimeout(() => q('lvCopy').textContent = 'Copy link', 1500); });
    dlg.showModal(); startHost().then(() => { const l = dlg.querySelector('#lvLink'); if (l) l.value = joinLink(); });
  }

  // ------------------------------------------------------------------ menu buttons
  function addButtons() {
    const bar = document.querySelector('.top-actions'); if (!bar || $('lvShareBtn')) return;
    const mk = (id, text, fn) => { const b = document.createElement('button'); b.type = 'button'; b.id = id; b.className = 'small-tool-button'; b.textContent = text; b.addEventListener('click', fn); bar.appendChild(b); };
    if (!window.NS_STUDENT) mk('lvWatchBtn', 'Class session', openWatch);
    else mk('lvShareBtn', 'Join class', openJoin);
  }
  window.NSLive = { openWatch, openJoin, startShare, stopShare, isInstructor };
  addButtons();
  { const ice = (location.hash || '').match(/[&#]ice=([A-Za-z0-9_-]+)/); if (ice && window.NS_STUDENT) { try { const j = JSON.parse(atob(ice[1].replace(/-/g, '+').replace(/_/g, '/'))); if (Array.isArray(j)) sessionStorage.setItem('nursingsim.iceJoin', JSON.stringify(j)); } catch (e) { /* ignore a damaged link */ } }
    const m = (location.hash || '').match(/join=([A-Za-z0-9]{6})/); if (m && window.NS_STUDENT) setTimeout(() => { openJoin(); const c = $('lvCode'); if (c) c.value = m[1].toUpperCase(); }, 1200); }
  // reconnect after a page reload while sharing
  const saved = sessionStorage.getItem('nursingsim.liveCode'); if (saved) setTimeout(() => startShare(saved), 800);
})();
