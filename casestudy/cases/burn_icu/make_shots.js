/* Takes the EHR screenshots used in the case study packet.  node make_shots.js   (needs the local server: npx http-server -p 8123 from the repo root) */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const here = __dirname, out = path.join(here, 'figs');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1366, height: 1300 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('nursingsim.user', JSON.stringify({ first: 'Case', last: 'Study', role: 'Instructor' })); } catch (e) {} });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8123/index.html'); await p.waitForTimeout(300);
  await p.click('#toolsMenuBtn'); await p.click('#openImportBtn');
  await p.fill('#jsonInput', fs.readFileSync(path.join(here, 'patient.json'), 'utf8')); await p.click('#validateImportBtn'); await p.click('#applyImportBtn'); await p.waitForTimeout(800);
  const at = async t => { await p.evaluate(x => { window.__marScrolledTo = null; simulationTime = x; refreshSimulationView(); }, t); await p.waitForTimeout(400); };
  const go = async s => { await p.click(`.nav-item[data-section="${s}"]`); await p.waitForTimeout(500); };
  const shot = async (name, loc, maxH) => { await p.evaluate(() => window.scrollTo(0, 0)); const bx = await loc.boundingBox(); await p.screenshot({ path: path.join(out, name), clip: { x: bx.x, y: Math.max(bx.y, 0), width: Math.min(bx.width, 1180), height: Math.min(bx.height, maxH || 1100) } }); console.log('wrote', name); };
  const clipRows = async (name, rowText, scrollCols) => {
    if (scrollCols !== undefined) await p.evaluate(n => { const s = document.querySelector('.mar-scroll'); if (s) s.scrollLeft = Math.max(0, n * 96); }, scrollCols);
    await p.waitForTimeout(150);   // MAR header + the one row that contains rowText
    const sc = await p.locator('.mar-scroll').boundingBox();
    const h = await p.locator('.mar-timeline-header-wrap').boundingBox();
    const row = p.locator('.mar-row', { hasText: rowText }).first(); await row.scrollIntoViewIfNeeded(); await p.waitForTimeout(150);
    const rb = await row.boundingBox(), h2 = await p.locator('.mar-timeline-header-wrap').boundingBox();
    await p.screenshot({ path: path.join(out, name), clip: { x: sc.x, y: Math.max(0, h2.y), width: Math.min(sc.width, 1180), height: Math.min((rb.y + rb.height) - h2.y, 420) } }); console.log('wrote', name);
  };
  // A: the lactated Ringer's order detail (where the titration instructions are)
  await at('2026-11-02 07:00'); await go('orders');
  await p.locator('#ordersTableBody tr', { hasText: 'burn resuscitation' }).first().click(); await p.waitForTimeout(400);
  await shot('shot_s1_lr_order.png', p.locator('.orders-detail-panel'), 420);
  // B: MAR rate changes of the lactated Ringer's
  await at('2026-11-02 14:30'); await go('mar'); await p.evaluate(() => { const s = document.querySelector('.mar-scroll'); if (s) s.scrollLeft = 0; }); await p.waitForTimeout(200);
  await clipRows('shot_s1_mar_lr.png', 'lactated Ringer');
  // C: avatar and device list
  await at('2026-11-02 07:00'); await go('summary'); await shot('shot_s1_avatar.png', p.locator('.combined-avatar-layout'), 900);
  // D: intake/output flowsheet
  await at('2026-11-02 19:00'); await go('flowsheets');
  await p.locator('button', { hasText: /Intake \/ Output/ }).first().click(); await p.waitForTimeout(500);

  // I&O totals at each shift change (where the shift totals are)
  const ioTotals = async (name, t) => {
    await at(t); await go('flowsheets'); await p.locator('button', { hasText: /Intake \/ Output/ }).first().click(); await p.waitForTimeout(500);
    const tbl = p.locator('#flowsheetsSection table', { hasText: /Whole stay/ }).last(); const trs = p.locator('#flowsheetsSection tr', { hasText: /Whole stay/ }).first(); await trs.scrollIntoViewIfNeeded();
    const top = p.locator('#flowsheetsSection tr', { hasText: /^Totals/ }).first(); await top.scrollIntoViewIfNeeded(); await p.waitForTimeout(150);
    const tb = await trs.boundingBox(), tp = await top.boundingBox(), bx = await p.locator('#flowsheetsSection').boundingBox();
    await p.screenshot({ path: path.join(out, name), clip: { x: bx.x + 170, y: tp.y - 34, width: Math.min(bx.width - 170, 1000), height: tb.y + tb.height - tp.y + 40 } }); console.log('wrote', name);
  };
  await ioTotals('shot_io_totals_s1.png', '2026-11-02 19:00'); await ioTotals('shot_io_totals_s2.png', '2026-11-03 07:00'); await ioTotals('shot_io_totals_s3.png', '2026-11-03 19:00');
  await ioTotals('shot_io_totals_s4.png', '2026-11-04 07:00'); await ioTotals('shot_io_totals_s5.png', '2026-11-04 19:00'); await ioTotals('shot_io_totals_s6.png', '2026-11-05 07:00');
  // E: microbiology results
  await at('2026-11-04 16:30'); await go('labResults');
  const mb = p.locator('text=Microbiology').first(); if (await mb.count()) { await mb.click(); await p.waitForTimeout(500); }
  await p.evaluate(() => { const t = document.getElementById('resultsGridTable'); let e = t; while (e && e !== document.body) { if (e.scrollWidth > e.clientWidth + 5 && /auto|scroll/.test(getComputedStyle(e).overflowX)) { e.scrollLeft = e.scrollWidth; break; } e = e.parentElement; } });
  await p.waitForTimeout(300);
  await shot('shot_s5_micro.png', p.locator('#labResultsSection'), 760);
  await b.close();
})();
