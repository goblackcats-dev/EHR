/* Prints what the EHR's Intake/Output flowsheet shows (shift totals) at each shift change, so the answer key can match the screen. */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1366, height: 1300 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('nursingsim.user', JSON.stringify({ first: 'Case', last: 'Study', role: 'Instructor' })); } catch (e) {} });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8123/index.html'); await p.waitForTimeout(300);
  await p.click('#toolsMenuBtn'); await p.click('#openImportBtn');
  await p.fill('#jsonInput', fs.readFileSync(path.join(__dirname, 'patient.json'), 'utf8')); await p.click('#validateImportBtn'); await p.click('#applyImportBtn'); await p.waitForTimeout(800);
  for (const t of ['2026-11-02 19:00', '2026-11-03 07:00', '2026-11-03 19:00', '2026-11-04 07:00', '2026-11-04 19:00', '2026-11-05 07:00']) {
    await p.evaluate(x => { simulationTime = x; refreshSimulationView(); }, t); await p.waitForTimeout(300);
    await p.click('.nav-item[data-section="flowsheets"]'); await p.waitForTimeout(300);
    await p.locator('button', { hasText: /Intake \/ Output/ }).first().click(); await p.waitForTimeout(500);
    const rows = await p.$$eval('#flowsheetsSection tr', trs => trs.map(r => r.innerText.replace(/\s+/g, ' ').trim()).filter(x => /shift|24 hours|Whole stay/i.test(x)));
    console.log('== ' + t); rows.forEach(r => console.log('  ' + r));
  }
  await b.close();
})();
