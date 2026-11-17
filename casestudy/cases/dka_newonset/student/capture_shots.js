// Captures the 2 small EHR screenshots for the Nora Whitcombe team case study packet, both AT Mon 0700 (front page 2).
// Needs a server at the repo root:  npx http-server -p 8126 -s -c-1 /home/user/EHR
//   node casestudy/cases/dka_newonset/student/capture_shots.js   -> student/figs/raw_*.png + raw_meta.json, then python3 crop_shots.py
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'figs');
const PJ = path.join(__dirname, '..', 'patient.json');
const PORT = process.env.PORT || 8126;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1400, height: 2600 }, deviceScaleFactor: 2 });
  page.on('pageerror', e => console.log('PAGEERR', e.message));
  await page.addInitScript(() => localStorage.setItem('nursingsim.user', JSON.stringify({ first: 'I', last: 'T', role: 'Instructor' })));
  await page.goto(`http://localhost:${PORT}/index.html`); await page.waitForTimeout(1500);
  if (await page.$('#toolsMenuBtn')) await page.click('#toolsMenuBtn');
  await page.click('#openImportBtn');
  await page.fill('#jsonInput', fs.readFileSync(PJ, 'utf8'));
  await page.click('#validateImportBtn'); await page.waitForTimeout(500);
  await page.click('#applyImportBtn'); await page.waitForTimeout(1500);
  if (await page.$('#simPauseBtn')) await page.click('#simPauseBtn').catch(() => {});
  const meta = {};
  const clock = () => page.evaluate(() => document.body.innerText.match(/PATIENT TIME[\s\S]{0,40}?(\d\d:\d\d)/)?.[1]);
  const notoast = () => page.evaluate(() => document.querySelectorAll('.toast, [class*="toast"], [class*="Toast"]').forEach(e => e.remove()));

  // ---- Mon 0700: MAR rows (insulin infusion running; 0.45% NaCl due 0700)
  await page.click('.nav-item[data-section="mar"]'); await page.waitForTimeout(900);
  meta.mar_clock = await clock();
  meta.mar = await page.evaluate(() => {
    const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
    const rows = [...document.querySelectorAll('#marRows > *')];
    const ins = rows.find(tr => /insulin regular/i.test(tr.innerText));
    const half = rows.find(tr => /sodium chloride 0\.45% 1,000/i.test(tr.innerText) && !/dextrose/i.test(tr.innerText));
    const head = document.getElementById('marRows').previousElementSibling;
    const cells = [...head.querySelectorAll('*')].filter(e => /^\d{4}/.test((e.innerText || '').trim()) && e.children.length <= 2).map(e => ({ t: e.innerText.trim().slice(0, 4), ...r(e) }));
    return { head: r(head), ins: r(ins), half: r(half), cells, names: rows.map(x => x.innerText.split('\n')[0]).slice(0, 40) };
  });
  await notoast();
  await page.screenshot({ path: `${OUT}/raw_mar.png` });

  // ---- Mon 0700: Chart Review > Cardiology (the ED ECG and its tracing link)
  await page.click('.nav-item[data-section="chartReview"]'); await page.waitForTimeout(400);
  await page.click('[data-chart-tab="cardiology"]'); await page.waitForTimeout(900);
  meta.ecg_clock = await clock();
  await notoast();
  await page.screenshot({ path: `${OUT}/raw_ecg.png` });
  fs.writeFileSync(`${OUT}/raw_meta.json`, JSON.stringify(meta, null, 1));
  console.log(JSON.stringify(meta).slice(0, 2500));
  await browser.close();
})();
