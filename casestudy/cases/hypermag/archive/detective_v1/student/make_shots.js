/* Takes the few small EHR screenshots used on the "Where to click" strip of the packet.
   node make_shots.js     (needs the local server running from the repo root:  npx http-server -p 8123 -s -c-1 .)
   Every shot is taken at patient time Tue 0700 so nothing from a later checkpoint can show. */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const here = __dirname, out = path.join(here, 'shots');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1000, height: 900 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { try { localStorage.setItem('nursingsim.user', JSON.stringify({ first: 'Case', last: 'Study', role: 'Instructor' })); } catch (e) {} });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8123/index.html'); await p.waitForTimeout(300);
  await p.click('#toolsMenuBtn'); await p.click('#openImportBtn');
  await p.fill('#jsonInput', fs.readFileSync(path.join(here, '..', 'patient.json'), 'utf8')); await p.click('#validateImportBtn'); await p.click('#applyImportBtn'); await p.waitForTimeout(1000);
  await p.evaluate(() => { window.__marScrolledTo = null; simulationTime = '2026-11-17 07:00'; refreshSimulationView(); }); await p.waitForTimeout(500);
  const go = async s => { await p.click(`.nav-item[data-section="${s}"]`); await p.waitForTimeout(700); };
  const shot = async (name, clip) => { await p.screenshot({ path: path.join(out, name), clip }); console.log('wrote', name); };
  // crops are in CSS pixels (the page is 1000 px wide at 2x); each is a small piece that shows WHERE to click
  await go('flowsheets'); await shot('shot_flowsheets.png', { x: 202, y: 236, width: 590, height: 236 });
  await go('labResults'); await shot('shot_labs.png', { x: 202, y: 236, width: 590, height: 402 });
  await go('orders');     await shot('shot_orders.png', { x: 202, y: 236, width: 590, height: 262 });
  await go('mar');        await shot('shot_mar.png', { x: 202, y: 236, width: 590, height: 296 });
  await b.close();
})();
