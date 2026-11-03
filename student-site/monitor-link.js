// Instructor only: a "Monitor" button in the simulation bar. It opens the Bedside Monitor page (monitor.html) and a small control window
// to change oxygen, heart rhythm, heart rate, SpO2, blood pressure, breathing rate and temperature on that monitor while the students watch it.
(function () {
  const group = document.querySelector('.simulation-clock-controls'); if (!group || !('BroadcastChannel' in window)) return;
  const chan = new BroadcastChannel('nursingsim');
  let state = null, dlg = null;
  chan.addEventListener('message', e => { const d = e.data || {}; if (d.monitorState) { state = d.monitorState; if (dlg && dlg.open) fill(false); } });
  const btn = document.createElement('button'); btn.className = 'clock-button'; btn.id = 'monitorBtn'; btn.textContent = 'Monitor'; btn.title = 'Open the bedside monitor and change oxygen, rhythm, heart rate and more (instructor)';
  group.appendChild(btn);
  const RH = [['sinus', 'Normal sinus rhythm'], ['brady', 'Sinus bradycardia'], ['tachy', 'Sinus tachycardia'], ['avb1', 'Sinus rhythm, 1st degree AV block'], ['widebrady', 'Sinus brady, wide QRS'], ['afib', 'Atrial fibrillation'], ['vtach', 'Ventricular tachycardia'], ['vfib', 'Ventricular fibrillation'], ['asystole', 'Asystole']];
  const O2 = ['Room air', '2 L nasal cannula', '4 L nasal cannula', '6 L nasal cannula', 'Simple mask 8 L', 'Non-rebreather 15 L', 'High-flow nasal cannula', 'BiPAP', 'Ventilator'];
  function build() {
    dlg = document.createElement('dialog'); dlg.id = 'monitorDialog'; dlg.className = 'action-dialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Bedside monitor (instructor)</h2><p>Changes appear on the monitor page right away. Blood pressure changes when the cuff cycles.</p></div><button class="icon-button" id="mlClose" aria-label="Close">×</button></div>
    <div class="dialog-body" style="display:grid;gap:10px">
      <div><button class="primary-button" id="mlOpen">Open the monitor in a new window</button> <span style="color:#666;font-size:13px">(drag it to the projector or HDMI screen, press F for full screen)</span></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <label>Oxygen<br><select id="mlO2">${O2.map(o => `<option>${o}</option>`).join('')}</select></label>
        <label>Heart rhythm<br><select id="mlRhy">${RH.map(r => `<option value="${r[0]}">${r[1]}</option>`).join('')}</select></label>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <label>Heart rate<br><input id="mlHR" type="number" style="width:80px"></label><label>SpO2 %<br><input id="mlSP" type="number" style="width:80px"></label>
        <label>BP<br><input id="mlSys" type="number" style="width:70px"> / <input id="mlDia" type="number" style="width:70px"></label>
        <label>Resp rate<br><input id="mlRR" type="number" style="width:80px"></label><label>Temp °F<br><input id="mlTP" type="number" step="0.1" style="width:80px"></label>
      </div>
      <div id="mlMsg" style="color:#666;font-size:13px"></div>
      <div class="dialog-actions"><button class="primary-button" id="mlSend">Send to monitor</button> <button class="secondary-button" id="mlBP">Measure BP now</button> <button class="secondary-button" id="mlReset">Back to the scenario values</button></div>
    </div>`;
    document.body.appendChild(dlg);
    const $ = id => dlg.querySelector('#' + id), n = id => { const v = $(id).value; return v === '' ? null : Number(v); };
    $('mlClose').onclick = () => dlg.close();
    $('mlOpen').onclick = () => { window.open('monitor.html', 'nursingsim-monitor', 'width=1280,height=720'); setTimeout(() => chan.postMessage({ cmd: 'getState' }), 1500); };
    $('mlSend').onclick = () => { const values = { o2: $('mlO2').value, rhythm: $('mlRhy').value, hr: n('mlHR'), spo2: n('mlSP'), sys: n('mlSys'), dia: n('mlDia'), rr: n('mlRR'), temp: n('mlTP') }; Object.keys(values).forEach(k => { if (values[k] == null) delete values[k]; }); chan.postMessage({ cmd: 'set', values }); $('mlMsg').textContent = 'Sent.'; };
    $('mlBP').onclick = () => { chan.postMessage({ cmd: 'bp' }); $('mlMsg').textContent = 'Cuff cycling.'; };
    $('mlReset').onclick = () => { chan.postMessage({ cmd: 'reset' }); $('mlMsg').textContent = 'Back to the scenario values.'; };
    return dlg;
  }
  function fill(force) {
    if (!state) { dlg.querySelector('#mlMsg').textContent = 'The monitor page is not open yet (or has not answered). Open it with the button above.'; return; }
    const $ = id => dlg.querySelector('#' + id); dlg.querySelector('#mlMsg').textContent = 'Connected to the monitor.';
    if (!force && dlg.contains(document.activeElement) && /INPUT|SELECT/.test(document.activeElement.tagName)) return;
    if (state.o2 && ![...$('mlO2').options].some(o => o.value === state.o2)) $('mlO2').add(new Option(state.o2)); $('mlO2').value = state.o2 || 'Room air';
    $('mlRhy').value = state.rhythm || 'sinus'; $('mlHR').value = state.hr; $('mlSP').value = state.spo2; $('mlSys').value = state.sys; $('mlDia').value = state.dia; $('mlRR').value = state.rr; $('mlTP').value = state.temp;
  }
  btn.addEventListener('click', () => { const d = dlg || build(); chan.postMessage({ cmd: 'getState' }); setTimeout(() => fill(true), 300); d.showModal(); });
})();
