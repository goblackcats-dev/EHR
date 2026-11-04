// Captures the small EHR screenshots for the Lauren Mitchell team case study packet. Each one is taken AT its checkpoint
// (never earlier data on an earlier page). Needs a server at the repo root:  npx http-server -p 8123 -s -c-1 .
//   node casestudy/cases/addison/student/capture_shots.js    -> student/figs/raw_*.png + raw_meta.json, then python3 crop_shots.py
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'figs');
const PJ = path.join(__dirname, '..', 'patient.json');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1400, height: 2600 }, deviceScaleFactor: 2 });   // tall: nothing scrolls, nothing hides under the header
  page.on('pageerror', e => console.log('PAGEERR', e.message));
  await page.addInitScript(() => localStorage.setItem('nursingsim.user', JSON.stringify({ first: 'I', last: 'T', role: 'Instructor' })));
  await page.goto('http://localhost:8123/index.html'); await page.waitForTimeout(1500);
  if (await page.$('#toolsMenuBtn')) await page.click('#toolsMenuBtn');
  await page.click('#openImportBtn');
  await page.fill('#jsonInput', fs.readFileSync(PJ, 'utf8'));
  await page.click('#validateImportBtn'); await page.waitForTimeout(500);
  await page.click('#applyImportBtn'); await page.waitForTimeout(1500);
  if (await page.$('#simPauseBtn')) await page.click('#simPauseBtn').catch(() => {});
  const meta = {};
  const clock = () => page.evaluate(() => document.body.innerText.match(/PATIENT TIME[\s\S]{0,40}?(\d\d:\d\d)/)?.[1]);
  const notoast = () => page.evaluate(() => document.querySelectorAll('.toast, [class*="toast"], [class*="Toast"]').forEach(e => e.remove()));
  const rect = sel => page.evaluate(s => { const e = typeof s === 'string' ? document.querySelector(s) : null; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }, sel);

  // ---- Mon 0700: MAR rows (home meds held, hydrocortisone 50 mg IV q6h due 1000)
  await page.click('.nav-item[data-section="mar"]'); await page.waitForTimeout(900);
  meta.mar_clock = await clock();
  meta.mar = await page.evaluate(() => {
    const r = el => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
    const rows = [...document.querySelectorAll('#marRows > *')];
    const hc = rows.find(tr => /hydrocortisone sodium succinate \(SOLU-CORTEF\) injection\s*•/.test(tr.innerText));
    const hcHome = rows.find(tr => tr.innerText.includes('hydrocortisone (CORTEF) tablet (home'));
    const fl = rows.find(tr => tr.innerText.includes('fludrocortisone (FLORINEF) tablet (home'));
    const head = document.getElementById('marRows').previousElementSibling;
    const cells = [...head.querySelectorAll('*')].filter(e => /^\d{4}/.test((e.innerText || '').trim()) && e.children.length <= 2).map(e => ({ t: e.innerText.trim().slice(0, 4), ...r(e) }));
    return { head: r(head), hcHome: r(hcHome), fludro: r(fl), hc: r(hc), cells };
  });
  await notoast();
  await page.screenshot({ path: `${OUT}/raw_mar.png` });

  // ---- Mon 0700: Chart Review > Cardiology (the ED ECG and its tracing link)
  await page.click('.nav-item[data-section="chartReview"]'); await page.waitForTimeout(400);
  await page.click('[data-chart-tab="cardiology"]'); await page.waitForTimeout(900);
  meta.ecg_clock = await clock();
  await notoast();
  await page.screenshot({ path: `${OUT}/raw_ecg.png` });

  // ---- Mon 1500: Lab Results > Endocrine: cortisol (clicked; detail card) and ACTH
  await page.click('#simFwd4Btn'); await page.waitForTimeout(1500);
  await page.click('#simFwd4Btn'); await page.waitForTimeout(1500);
  await page.click('.nav-item[data-section="labResults"]'); await page.waitForTimeout(900);
  await page.locator('#labCategoryFilters').getByText('Cortisol, random', { exact: false }).first().click(); await page.waitForTimeout(900);
  meta.labs_clock = await clock();
  meta.tree = await rect('#labCategoryFilters'); meta.detail = await rect('#labDetailBody');
  meta.endo = await page.evaluate(() => { const r = el => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
    const all = [...document.querySelectorAll('#labCategoryFilters *')].filter(e => e.children.length === 0);
    const f = t => all.find(e => e.textContent.trim().startsWith(t));
    return { endo: r(f('Endocrine')), ald: r(f('Aldosterone')), cardiac: r(f('Cardiac')) }; });
  await notoast();
  await page.screenshot({ path: `${OUT}/raw_cortisol.png` });

  // ---- Mon 1900: Lab Results > Sodium (history / trend in the detail card)
  await page.click('#simFwd4Btn'); await page.waitForTimeout(1500);
  await page.click('.nav-item[data-section="labResults"]'); await page.waitForTimeout(900);
  await page.locator('#labCategoryFilters').getByText('Sodium', { exact: true }).first().click(); await page.waitForTimeout(900);
  meta.na_clock = await clock();
  await page.evaluate(() => { let e = document.getElementById('labDetailBody'); for (let i = 0; i < 4 && e; i++, e = e.parentElement) { e.style.maxHeight = 'none'; e.style.height = 'auto'; e.style.overflow = 'visible'; } });
  await page.waitForTimeout(400);
  meta.na_text = await page.evaluate(() => document.getElementById('labDetailBody').innerText);
  await notoast();
  await page.locator('#labDetailBody').screenshot({ path: `${OUT}/raw_sodium.png` });
  fs.writeFileSync(`${OUT}/raw_meta.json`, JSON.stringify(meta, null, 1));
  console.log(JSON.stringify(meta).slice(0, 1500));
  await browser.close();
})();
