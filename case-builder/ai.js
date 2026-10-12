/* Optional: rewrite the generated notes in a more natural clinical voice with Claude.
   Uses the official Anthropic TypeScript SDK loaded as a browser module. The user's own API key stays in this browser. */

const SDK_URLS = ['https://esm.sh/@anthropic-ai/sdk', 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk/+esm'];
let Anthropic = null;

async function loadSdk() {
  if (Anthropic) return Anthropic;
  let lastError = null;
  for (const url of SDK_URLS) {
    try {
      const mod = await import(url);
      Anthropic = mod.default || mod.Anthropic;
      if (Anthropic) return Anthropic;
    } catch (e) { lastError = e; }
  }
  throw new Error(`Could not load the Anthropic library (${lastError ? lastError.message : 'unknown'}). Check the internet connection.`);
}

const SYSTEM = `You are helping nursing faculty build a realistic FICTIONAL patient chart for a classroom simulation. You will receive a draft chart note that was generated from structured data, plus a short case summary.

Rewrite the draft so it reads like a real note written by the named author: natural clinical voice, normal clinical abbreviations, sensible flow and reasoning.

Hard rules:
1. Keep every number, date, time, lab value, vital sign, dose, drug name, route and exam finding from the draft exactly as written. Do not add new numeric values, new medications, new diagnoses or new test results.
2. You may add qualitative detail (a brief patient quote, narrative sentences, reasoning) only when it is consistent with the case summary and the draft.
3. Keep the same section headings and formatting: **Bold** headings on their own line, "- " bullet lists, blank lines between sections. No other markdown.
4. If faculty direction is provided, honor it without contradicting the facts.
5. Output only the rewritten note text, with no preamble or explanation.`;

// A short, consistent description of the case that goes with every note.
function digest(result) {
  const c = result.canonical, S = result.state, ctx = result.ctx, h = ctx.nowH;
  const U = NS.util;
  const meds = S.activeMeds(h).filter(m => !m.prn).slice(0, 14).map(m => `${m.name.replace(/ \(.*?\)/, '')} ${m.dose} ${m.route}`);
  const labs = ['WBC', 'Hemoglobin', 'Sodium', 'Potassium', 'Creatinine', 'Glucose', 'Lactate'].map(k => { const l = S.lab(k, h); return l ? `${k} ${l.value}` : null; }).filter(Boolean);
  const v = S.vitalSet(h);
  return [
    `Patient: ${c.patient.name}, ${c.patient.age}-year-old ${c.patient.sex}. Allergies: ${c.patient.allergies.map(a => a.substance).join(', ')}.`,
    `Primary diagnosis: ${c.encounter.diagnosis}. Hospital day ${ctx.L}. Current stage: ${result.report.stage}.`,
    `Medical history: ${result.spec.comorb.map(x => x.problem).join('; ') || 'none'}.`,
    `Current diet: ${c.encounter.dietOrder}. Activity: ${c.encounter.ambulationOrder}. Code status: ${c.encounter.codeStatus}.`,
    v ? `Most recent vitals: T ${v.temp}, HR ${v.hr}, BP ${v.sbp}/${v.dbp}, RR ${v.rr}, SpO2 ${v.spo2}% on ${v.o2}, pain ${v.pain}/10.` : '',
    `Recent labs: ${labs.join(', ')}.`,
    `Current scheduled medications: ${meds.join('; ')}.`,
    ctx.input.facultyNotes ? `Faculty direction: ${ctx.input.facultyNotes}` : ''
  ].filter(Boolean).join('\n');
}

const numbersIn = text => (String(text).match(/\d+(?:[.,]\d+)?/g) || []).map(n => n.replace(',', ''));
function keepsFacts(original, rewritten) {
  const want = numbersIn(original), have = new Set(numbersIn(rewritten));
  if (!want.length) return true;
  const missing = want.filter(n => !have.has(n));
  return missing.length / want.length <= 0.08;
}

function explain(err) {
  const status = err && err.status;
  if (status === 401) return 'The API key was rejected. Check that it is correct and active.';
  if (status === 403) return 'This API key is not allowed to use that model.';
  if (status === 404) return 'That model was not found for this account.';
  if (status === 429) return 'Rate limit reached. Wait a minute and try again, or choose a smaller scope.';
  if (status === 402 || /credit|billing/i.test(err && err.message || '')) return 'Your Anthropic account may be out of credit.';
  return (err && err.message) || 'Unknown error';
}

async function rewriteOne(client, model, note, caseDigest, signal) {
  const user = `<case_summary>\n${caseDigest}\n</case_summary>\n\n<note_header>\nTitle: ${note.title}\nAuthor: ${note.author}\nDate/time: ${note.datetime}\nCategory: ${note.category}\n</note_header>\n\n<draft_note>\n${note.body}\n</draft_note>`;
  const base = { model, max_tokens: 8000, system: SYSTEM, output_config: { effort: 'low' }, messages: [{ role: 'user', content: user }] };
  let response;
  try {
    // Server-side refusal fallbacks are opt-in and recommended for this model family; fall back to a plain request if the account or model rejects them.
    response = await client.beta.messages.create(Object.assign({ betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }, base), { signal });
  } catch (err) {
    if (err && err.status === 400 && /fallback|beta/i.test(err.message || '')) response = await client.messages.create(base, { signal });
    else throw err;
  }
  if (response.stop_reason === 'refusal') throw new Error('Claude declined to rewrite this note.');
  if (response.stop_reason === 'max_tokens') throw new Error('The rewrite was cut off; kept the original.');
  const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();
  if (!text) throw new Error('Empty response.');
  if (!keepsFacts(note.body, text)) throw new Error('The rewrite changed numbers or times, so the original was kept.');
  return text;
}

async function enhanceNotes({ apiKey, model, notes, caseDigest, signal, onNote }) {
  let Ctor;
  try { Ctor = await loadSdk(); } catch (e) { notes.forEach(n => onNote(n, false, e.message)); return; }
  const client = new Ctor({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 2 });
  const queue = notes.slice();
  const worker = async () => {
    while (queue.length && !(signal && signal.aborted)) {
      const note = queue.shift();
      try {
        const text = await rewriteOne(client, model, note, caseDigest, signal);
        note.body = text; note.enhanced = true;
        onNote(note, true, '');
      } catch (err) {
        if (signal && signal.aborted) { onNote(note, false, 'stopped'); return; }
        onNote(note, false, explain(err));
        if (err && (err.status === 401 || err.status === 403)) { queue.length = 0; }   // no point trying the rest
      }
    }
  };
  await Promise.all([worker(), worker(), worker()]);
}

window.NSAI = { enhanceNotes, digest, keepsFacts, _setSdk: ctor => { Anthropic = ctor; } };
