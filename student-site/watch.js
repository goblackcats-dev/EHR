/* NursingSim - Live student view (v79).
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
  const me = () => (window.NSUser && NSUser.current()) || null;
  const label = () => { const u = me(); return u ? `${u.first} ${u.last}` : 'Student'; };
  const isInstructor = () => { const u = me(); return !window.NS_STUDENT && (!u || u.role === 'Instructor'); };

  // ------------------------------------------------------------------ load the libraries only when needed
  const loaded = {};
  function loadScript(src) { return loaded[src] || (loaded[src] = new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src)); document.head.appendChild(s); })); }
  function loadCss(href) { if (document.querySelector(`link[href="${href}"]`)) return; const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l); }
  const libs = () => Promise.all([loadScript('vendor/peerjs.min.js'), loadScript('vendor/rrweb.umd.min.js')]).then(() => loadCss('vendor/rrweb.min.css'));

  // ------------------------------------------------------------------ student side: share my screen
  let sh = { peer: null, conn: null, stop: null, buf: [], timer: null, ping: null, code: '', want: false, retry: null };
  function banner(text, withStop) {
    let b = $('lvBanner');
    if (!text) { if (b) b.remove(); return; }
    if (!b) { b = document.createElement('div'); b.id = 'lvBanner'; b.className = 'lv-banner'; document.body.appendChild(b); }
    b.innerHTML = `<span class="lv-dot"></span><span>${esc(text)}</span>${withStop ? '<button type="button" id="lvStop">Stop sharing</button>' : ''}`;
    const st = $('lvStop'); if (st) st.addEventListener('click', stopShare);
  }
  function flush() { if (!sh.conn || !sh.conn.open || !sh.buf.length) return; const batch = sh.buf.splice(0); try { sh.conn.send({ t: 'ev', e: batch }); } catch (e) { /* retried on the next flush */ } }
  function startRecording() {
    if (sh.stop) return;
    sh.stop = window.rrweb.record({
      emit: e => { sh.buf.push(e); }, sampling: { mousemove: false, scroll: 150, input: 'last' }, recordCanvas: false, collectFonts: false, checkoutEveryNms: 90000, inlineStylesheet: true
    });
    sh.timer = setInterval(flush, 400);
    sh.ping = setInterval(() => { if (sh.conn && sh.conn.open) { try { sh.conn.send({ t: 'ping', name: label(), role: (me() || {}).role || '', section: document.title }); } catch (e) { /* ignore */ } } }, 5000);
  }
  function stopRecording() { if (sh.stop) { try { sh.stop(); } catch (e) { /* ignore */ } sh.stop = null; } clearInterval(sh.timer); clearInterval(sh.ping); sh.buf = []; }
  function connectShare() {
    if (!sh.want) return;
    const cfg = peerConfig();
    sh.peer = new window.Peer(undefined, { host: cfg.host, port: cfg.port, secure: cfg.secure, path: cfg.path, debug: 0 });
    sh.peer.on('open', () => {
      const conn = sh.peer.connect(PREFIX + sh.code, { reliable: true });
      sh.conn = conn;
      conn.on('open', () => {
        sessionStorage.setItem('nursingsim.liveCode', sh.code);
        conn.send({ t: 'hello', name: label(), role: (me() || {}).role || '', title: document.title });
        startRecording(); banner('Your screen is being shared with your instructor', true); setMsg('Connected. Your instructor can see your screen.');
        try { window.rrweb.record.takeFullSnapshot(true); } catch (e) { /* the instructor asks again if needed */ }
      });
      conn.on('data', d => { if (d && d.t === 'resync') { try { window.rrweb.record.takeFullSnapshot(true); } catch (e) { /* ignore */ } } if (d && d.t === 'bye') stopShare(); });
      conn.on('close', () => { if (sh.want) { banner('Reconnecting to your instructor...', true); stopRecording(); scheduleRetry(); } });
      conn.on('error', () => { if (sh.want) scheduleRetry(); });
    });
    sh.peer.on('error', err => {
      if (err && err.type === 'peer-unavailable') { setMsg('That code was not found. Check it with your instructor and try again.', true); fullStop(); }
      else if (sh.want) { setMsg('Could not reach the connection service (' + ((err && err.type) || 'error') + '). Check the Wi-Fi and try again.', true); scheduleRetry(); }
    });
  }
  function scheduleRetry() { clearTimeout(sh.retry); sh.retry = setTimeout(() => { try { sh.peer && sh.peer.destroy(); } catch (e) { /* ignore */ } sh.peer = null; sh.conn = null; connectShare(); }, 5000); }
  function fullStop() { sh.want = false; clearTimeout(sh.retry); stopRecording(); try { sh.conn && sh.conn.close(); } catch (e) { /* ignore */ } try { sh.peer && sh.peer.destroy(); } catch (e) { /* ignore */ } sh.peer = sh.conn = null; banner(''); }
  function stopShare() { fullStop(); sessionStorage.removeItem('nursingsim.liveCode'); setMsg('Sharing stopped.'); }
  async function startShare(code) {
    code = String(code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 6) { setMsg('Enter the 6-character code from your instructor.', true); return; }
    setMsg('Connecting...'); fullStop(); sh.code = code; sh.want = true;
    try { await libs(); } catch (e) { setMsg('Could not load the sharing tools. Check the connection.', true); sh.want = false; return; }
    connectShare();
  }
  function setMsg(t, bad) { const m = $('lvJoinMsg'); if (m) { m.textContent = t; m.className = 'lv-msg' + (bad ? ' bad' : ''); } }
  function openJoin() {
    let dlg = $('lvJoin');
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.id = 'lvJoin'; dlg.className = 'lv-dialog lv-small';
      dlg.innerHTML = `<div class="dialog-header"><div><h2>Share my screen with my instructor</h2><p>Your instructor will give you a 6-character code. While you share, your instructor can see what is on your screen. A banner stays visible, and you can stop at any time.</p></div><button class="icon-button" id="lvJoinX" aria-label="Close">×</button></div>
        <div class="dialog-body"><label class="input-label" for="lvCode">Class code</label><input id="lvCode" class="lv-code-in" maxlength="8" autocomplete="off" autocapitalize="characters" placeholder="ABC123" />
        <div id="lvJoinMsg" class="lv-msg"></div><div class="lv-actions"><button class="primary-button" id="lvJoinGo">Share my screen</button> <button class="secondary-button" id="lvJoinStop">Stop sharing</button></div></div>`;
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
      st = makeTile(conn, d); host.students.set(conn.peer, st); conn.send({ t: 'resync' }); updateCount(); return;
    }
    if (!st) return;
    st.last = Date.now();
    if (d.t === 'ev') (d.e || []).forEach(e => { try { st.replayer.addEvent(e); } catch (err) { /* a damaged event is skipped */ } });
    if (d.t === 'ping' && d.name) { st.tile.querySelector('b').textContent = d.name; }
  }
  function updateCount() {
    const live = [...host.students.values()].filter(s => Date.now() - s.last < 20000).length;
    const c = host.dlg && host.dlg.querySelector('#lvCount'); if (c) c.textContent = `${live} sharing now (${host.students.size} joined)`;
    host.students.forEach(s => s.tile.classList.toggle('lv-idle', Date.now() - s.last >= 20000));
  }
  async function startHost() {
    await libs();
    host.code = newCode();
    const cfg = peerConfig();
    host.peer = new window.Peer(PREFIX + host.code, { host: cfg.host, port: cfg.port, secure: cfg.secure, path: cfg.path, debug: 0 });
    host.peer.on('open', () => { const c = host.dlg.querySelector('#lvCodeBig'); c.textContent = host.code; host.dlg.querySelector('#lvStatus').textContent = 'Ready. Tell your students this code (they choose Tools > Share my screen).'; });
    host.peer.on('connection', conn => { conn.on('data', d => onData(conn, d)); conn.on('close', () => { const st = host.students.get(conn.peer); if (st) { st.last = 0; updateCount(); } }); });
    host.peer.on('error', err => { if (err && err.type === 'unavailable-id') { host.peer.destroy(); startHost(); } else host.dlg.querySelector('#lvStatus').textContent = 'Could not reach the connection service (' + ((err && err.type) || 'error') + '). Check the internet connection.'; });
    host.timer = setInterval(updateCount, 5000);
  }
  function endHost() { clearInterval(host.timer); host.students.forEach(s => { try { s.conn.send({ t: 'bye' }); s.conn.close(); } catch (e) { /* ignore */ } }); host.students.clear(); try { host.peer && host.peer.destroy(); } catch (e) { /* ignore */ } host.peer = null; host.code = ''; if (host.dlg) { host.dlg.remove(); host.dlg = null; } }
  function openWatch() {
    if (host.dlg) { host.dlg.showModal(); host.students.forEach(fit); return; }
    const dlg = document.createElement('dialog'); dlg.id = 'lvWatch'; dlg.className = 'lv-dialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Live student view</h2><p id="lvStatus">Starting...</p></div><div class="lv-head-r"><div class="lv-codebox">Class code<div id="lvCodeBig">------</div></div><button class="secondary-button" id="lvMin">Hide window</button> <button class="secondary-button" id="lvEnd">End session</button></div></div>
      <div class="dialog-body"><div id="lvCount" class="lv-count">0 sharing now</div><div id="lvGrid" class="lv-grid"></div><p class="lv-note">Students join by choosing <b>Tools &gt; Share my screen</b> and typing the code. The tiles update live. Click Enlarge on a tile to see it bigger. Hiding this window keeps the session running; reopen it from the Tools menu. If a student cannot connect, the school Wi-Fi may block direct connections.</p></div>`;
    document.body.appendChild(dlg); host.dlg = dlg;
    dlg.querySelector('#lvMin').addEventListener('click', () => dlg.close());
    dlg.querySelector('#lvEnd').addEventListener('click', () => { if (confirm('End the live session? Students will stop sharing.')) endHost(); });
    dlg.showModal(); startHost();
  }

  // ------------------------------------------------------------------ menu buttons
  function addButtons() {
    const bar = document.querySelector('.top-actions'); if (!bar || $('lvShareBtn')) return;
    const mk = (id, text, fn) => { const b = document.createElement('button'); b.type = 'button'; b.id = id; b.className = 'small-tool-button'; b.textContent = text; b.addEventListener('click', fn); bar.appendChild(b); };
    if (!window.NS_STUDENT) mk('lvWatchBtn', 'Live student view', openWatch);
    mk('lvShareBtn', 'Share my screen', openJoin);
  }
  window.NSLive = { openWatch, openJoin, startShare, stopShare, isInstructor };
  addButtons();
  // reconnect after a page reload while sharing
  const saved = sessionStorage.getItem('nursingsim.liveCode'); if (saved) setTimeout(() => startShare(saved), 800);
})();
