/* NursingSim saved-patient library.
   Shared by the EHR and the Case Builder (same web address, so they see the same saved patients).
   Patients are kept in the browser's IndexedDB, which holds far more than ordinary storage. */
window.NSLib = (() => {
  const DB = 'nursingsim', STORE = 'cases', FORMAT = 'nursingsim-case';
  let dbPromise = null;

  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) { reject(new Error('This browser cannot save patients (private browsing or storage blocked).')); return; }
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE, { keyPath: 'id' }); };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('Could not open the saved-patient storage.'));
    });
    dbPromise.catch(() => { dbPromise = null; });
    return dbPromise;
  }
  const wrap = req => new Promise((resolve, reject) => { req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });
  async function store(mode) { const db = await open(); return db.transaction(STORE, mode).objectStore(STORE); }

  const newId = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID() : `case_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

  function describe(canonical) {
    const p = (canonical && canonical.patient) || {}, e = (canonical && canonical.encounter) || {}, t = (canonical && canonical.timeline) || {};
    return { patientName: p.name || 'Unnamed patient', age: p.age, sex: p.sex, diagnosis: e.diagnosis || '', hospitalDay: e.hospitalDay || null, simulationStart: t.simulationStart || '', title: (canonical && canonical.caseMeta && canonical.caseMeta.title) || '' };
  }

  // record = { name, canonical, simulationTime?, source: 'builder' | 'ehr', id? }
  async function save(record) {
    const now = new Date().toISOString();
    const id = record.id || newId();
    let existing = null;
    if (record.id) { try { existing = await get(record.id); } catch (e) { /* new record */ } }
    const row = {
      id, name: (record.name || '').trim() || `${describe(record.canonical).patientName}: ${describe(record.canonical).diagnosis}`,
      createdAt: existing ? existing.createdAt : now, updatedAt: now, source: record.source || 'builder',
      simulationTime: record.simulationTime || (record.canonical && record.canonical.timeline && record.canonical.timeline.simulationStart) || '',
      meta: describe(record.canonical), canonical: JSON.parse(JSON.stringify(record.canonical))
    };
    const s = await store('readwrite');
    await wrap(s.put(row));
    return row;
  }
  async function get(id) { const s = await store('readonly'); return wrap(s.get(id)); }
  async function list() {
    const s = await store('readonly');
    const rows = await wrap(s.getAll());
    return rows.map(r => ({ id: r.id, name: r.name, source: r.source, createdAt: r.createdAt, updatedAt: r.updatedAt, meta: r.meta, simulationTime: r.simulationTime })).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  async function remove(id) { const s = await store('readwrite'); await wrap(s.delete(id)); }
  async function rename(id, name) { const row = await get(id); if (!row) return null; row.name = name.trim() || row.name; row.updatedAt = new Date().toISOString(); const s = await store('readwrite'); await wrap(s.put(row)); return row; }
  async function duplicate(id) {
    const row = await get(id); if (!row) return null;
    return save({ name: `${row.name} (copy)`, canonical: row.canonical, simulationTime: row.simulationTime, source: row.source });
  }

  // ---- files ----
  function toFile(row) { return { format: FORMAT, version: 1, name: row.name, source: row.source, savedAt: row.updatedAt, simulationTime: row.simulationTime, canonical: row.canonical }; }
  function download(row) {
    const blob = new Blob([JSON.stringify(toFile(row), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${(row.name || 'patient').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'patient'}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);       // Safari needs the link to stay valid briefly
  }
  // Accepts a file saved from this library OR a plain canonical case file.
  async function importFile(file) {
    const text = await file.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { throw new Error('That file is not valid JSON.'); }
    if (parsed && parsed.format === FORMAT && parsed.canonical) return save({ name: parsed.name, canonical: parsed.canonical, simulationTime: parsed.simulationTime, source: parsed.source || 'builder' });
    if (parsed && parsed.schemaVersion && parsed.patient) return save({ name: '', canonical: parsed, source: 'builder' });
    throw new Error('That file does not look like a NursingSim patient.');
  }

  // ---- student copy: no faculty answer key, no earlier attempts, no med-pass log ----
  const STUDENT_FORMAT = 'nursingsim-student';
  function toStudentFile(row) {
    const c = JSON.parse(JSON.stringify(row.canonical));
    delete c.facultyBuilder;
    ['handoff', 'sbar', 'priority', 'teaching', 'quiz', 'educationLog', 'labsSeen', 'carePlan', 'orderAck', 'messageState'].forEach(k => { delete c[k]; });
    if (c.medPass) c.medPass.log = [];
    return { format: STUDENT_FORMAT, version: 1, name: row.name, simulationTime: (c.timeline && c.timeline.simulationStart) || row.simulationTime || '', canonical: c };
  }
  function downloadStudent(row) {
    const blob = new Blob([JSON.stringify(toStudentFile(row))], { type: 'application/json' });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = `${(row.name || 'patient').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 50) || 'patient'}_STUDENT.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  return { save, get, list, remove, rename, duplicate, download, importFile, toFile, FORMAT, STUDENT_FORMAT, toStudentFile, downloadStudent };
})();
