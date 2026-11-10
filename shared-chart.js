/* NursingSim - shared chart for a class session (v96).
   While a Class session is running (see watch.js), what one person charts reaches everyone: medication given/held, vitals and other flowsheet entries,
   I&O, notes, devices, order acknowledgements. Each browser watches its own "student layer" of the chart (the entries marked studentEntered/studentModified),
   sends only what changed, and the instructor's browser passes it on to every other student. Nothing is stored outside the browsers. */
(() => {
  'use strict';
  const COLS = {
    administrations: a => a.studentEntered || a.studentModified,
    observations: o => o.studentEntered,
    simulationTasks: t => t.studentEntered || /^clarify_/.test(String(t.id || '')),
    devices: d => d.studentEntered || d.removedByStudent,
    ioEvents: i => i.studentEntered,
    flowsheetComments: f => f.studentEntered,
    notes: n => n.studentEntered
  };
  let send = null, timer = null, known = {}, ackKnown = '{}', stopKnown = '{}', queue = [];
  const cc = () => (typeof currentCanonicalCase !== 'undefined' ? currentCanonicalCase : null);
  const stops = () => { const c = cc(); return (c && c.orderStop) || {}; };   // orders a nurse discontinued: id -> {at, by, reason}
  const acks = () => { const c = cc(); return (c && c.orderAck) || {}; };
  function layer() {
    const c = cc(), out = {}; if (!c) return out;
    Object.keys(COLS).forEach(k => (c[k] || []).forEach(it => { if (it && it.id && COLS[k](it)) out[k + ':' + it.id] = JSON.stringify(it); }));
    return out;
  }
  function diff() {
    const cur = layer(), d = { set: [], del: [], acks: null, stops: null };
    Object.keys(cur).forEach(k => { if (known[k] !== cur[k]) d.set.push([k, cur[k]]); });
    Object.keys(known).forEach(k => { if (!(k in cur)) d.del.push(k); });
    const a = JSON.stringify(acks()); if (a !== ackKnown) d.acks = JSON.parse(a);
    const sp = JSON.stringify(stops()); if (sp !== stopKnown) d.stops = JSON.parse(sp);
    known = cur; ackKnown = a; stopKnown = sp; return d;
  }
  const busy = () => { try { return typeof simClockBusy === 'function' && simClockBusy(); } catch (e) { return false; } };
  function revertAdmin(a) {
    if (a.originalState !== undefined) a.state = a.originalState; if (a.originalLabel !== undefined) a.label = a.originalLabel;
    ['originalState', 'originalLabel', 'studentModified', 'administeredAt', 'administeredTime', 'administeredBy', 'comment', 'site', 'givenDose', 'givenVolume'].forEach(f => { delete a[f]; });
  }
  function flush() {
    if (!queue.length || busy()) return; const c = cc(); if (!c) return; let changed = false;
    queue.splice(0).forEach(p => {
      (p.set || []).forEach(([k, json]) => {
        const i = k.indexOf(':'), col = k.slice(0, i), id = k.slice(i + 1); let it; try { it = JSON.parse(json); } catch (e) { return; }
        if (!Array.isArray(c[col])) c[col] = []; const j = c[col].findIndex(x => x && x.id === id);
        if (j >= 0) c[col][j] = it; else c[col].push(it); known[k] = json; changed = true;
      });
      (p.del || []).forEach(k => {
        const i = k.indexOf(':'), col = k.slice(0, i), id = k.slice(i + 1), arr = c[col]; if (!Array.isArray(arr)) return;
        const j = arr.findIndex(x => x && x.id === id); if (j < 0) { delete known[k]; return; }
        if (col === 'administrations' && !arr[j].studentEntered) revertAdmin(arr[j]); else arr.splice(j, 1);
        delete known[k]; changed = true;
      });
      if (p.stops) {
        if (!c.orderStop) c.orderStop = {};
        Object.keys(p.stops).forEach(id => { if (!c.orderStop[id]) { c.orderStop[id] = p.stops[id]; changed = true; } });
        stopKnown = JSON.stringify(c.orderStop);
      }
      if (p.acks) {
        if (!c.orderAck) c.orderAck = {};
        Object.keys(p.acks).forEach(id => { if (!c.orderAck[id]) { c.orderAck[id] = p.acks[id]; changed = true; } try { simulationUnacknowledged.orders.delete(id); completedBrainTaskIds.add('neworder_' + id); } catch (e) { /* ignore */ } });
        ackKnown = JSON.stringify(c.orderAck);
      }
    });
    if (changed) { try { persistCase(); } catch (e) { /* best effort */ } try { refreshSimulationView(); } catch (e) { /* ignore */ } try { updateNavigationBadges(); } catch (e) { /* ignore */ } }
  }
  function tick() { if (!send) return; flush(); const d = diff(); if (d.set.length || d.del.length || d.acks || d.stops) { try { send(d); } catch (e) { /* the connection retries */ } } }
  window.NSChartSync = {
    // send(payload) delivers a change to the others. baseline=true: what is charted now counts as already shared (instructor).
    start(sendFn, baseline) { this.stop(); send = sendFn; known = baseline ? layer() : {}; ackKnown = baseline ? JSON.stringify(acks()) : '{}'; stopKnown = baseline ? JSON.stringify(stops()) : '{}'; timer = setInterval(tick, 900); },
    stop() { clearInterval(timer); timer = null; send = null; queue = []; },
    baseline() { known = layer(); ackKnown = JSON.stringify(acks()); stopKnown = JSON.stringify(stops()); },
    receive(p) { if (p) { queue.push(p); flush(); } },
    flush,
    full() { const set = Object.entries(layer()), a = acks(), sp = stops(); return { set, del: [], acks: Object.keys(a).length ? JSON.parse(JSON.stringify(a)) : null, stops: Object.keys(sp).length ? JSON.parse(JSON.stringify(sp)) : null }; }
  };
})();
