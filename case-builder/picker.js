/* Grouped, searchable multi-select ("drop down with check boxes") used for medical and surgical history.
   NS.Picker.create({
     root,                      // element to fill
     title,                     // button text, e.g. 'Choose medical history'
     groups: () => [{ name, items: [{ key, label, desc, aliases }] }],
     isOn: key => bool, toggle: key => void,
     years: bool,               // show a year box on each ticked row (surgical history)
     getYear: key => '', setYear: (key, year) => void,
     custom: { list: () => [{text|name, year}], add: (text, year) => void, remove: index => void, noun: 'condition' },
     onChange: () => void
   }) -> { refresh() }                                                          */
NS.Picker = (() => {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9+ ]+/g, ' ').replace(/\s+/g, ' ').trim();

  function create(cfg) {
    const root = cfg.root, noun = (cfg.custom && cfg.custom.noun) || 'item';
    root.classList.add('picker');
    root.innerHTML = `<div class="pk-selected"></div>
      <button type="button" class="pk-toggle" aria-expanded="false"><span class="pk-toggle-text"></span><span class="pk-caret">▾</span></button>
      <div class="pk-panel hidden">
        <input type="search" class="pk-search" placeholder="Search, or type your own ${esc(noun)} and press Enter..." autocomplete="off" autocapitalize="off" />
        <div class="pk-custom hidden"></div>
        <div class="pk-list"></div>
      </div>`;
    const sel = root.querySelector('.pk-selected'), toggleBtn = root.querySelector('.pk-toggle'), panel = root.querySelector('.pk-panel'),
      search = root.querySelector('.pk-search'), customBox = root.querySelector('.pk-custom'), list = root.querySelector('.pk-list');
    let groups = [], rows = new Map(), open = false;

    function build() {
      groups = cfg.groups(); rows = new Map(); list.innerHTML = '';
      groups.forEach((g, gi) => {
        const wrap = document.createElement('div'); wrap.className = 'pk-group'; wrap.dataset.g = gi;
        wrap.innerHTML = `<button type="button" class="pk-ghead"><span class="pk-gname">${esc(g.name)}</span><span class="pk-gcount"></span><span class="pk-gcaret">▾</span></button><div class="pk-gbody"></div>`;
        const body = wrap.querySelector('.pk-gbody');
        g.items.forEach(it => {
          const row = document.createElement('label'); row.className = 'pk-row';
          row.innerHTML = `<input type="checkbox" /><span class="pk-label">${esc(it.label)}${it.desc ? `<small>${esc(it.desc)}</small>` : ''}</span>${cfg.years ? '<input type="number" class="pk-year" inputmode="numeric" placeholder="Year" min="1930" max="2100" />' : ''}`;
          const cb = row.querySelector('input[type=checkbox]');
          cb.addEventListener('change', () => { cfg.toggle(it.key); refresh(); cfg.onChange(); });
          const yr = row.querySelector('.pk-year');
          if (yr) {
            yr.addEventListener('click', e => e.stopPropagation());
            yr.addEventListener('input', () => { cfg.setYear(it.key, yr.value.trim()); renderSelected(); cfg.onChange(); });
          }
          body.appendChild(row);
          rows.set(it.key, { row, cb, yr, hay: norm([it.label, it.desc, (it.aliases || []).join(' '), g.name].join(' ')), label: norm(it.label), group: wrap });
        });
        wrap.querySelector('.pk-ghead').addEventListener('click', () => wrap.classList.toggle('collapsed'));
        list.appendChild(wrap);
        wrap.classList.add('collapsed');
      });
    }

    function renderSelected() {
      const chips = [];
      groups.forEach(g => g.items.forEach(it => {
        if (!cfg.isOn(it.key)) return;
        const y = cfg.years ? cfg.getYear(it.key) : '';
        chips.push(`<span class="pk-chip" title="${esc(it.desc || '')}">${esc(it.label)}${y ? ` (${esc(y)})` : ''}<button type="button" data-rm="${esc(it.key)}" aria-label="Remove ${esc(it.label)}">×</button></span>`);
      }));
      if (cfg.custom) cfg.custom.list().forEach((c, i) => chips.push(`<span class="pk-chip custom" title="Typed by you">${esc(c.text || c.name)}${c.year ? ` (${esc(c.year)})` : ''}<button type="button" data-rmc="${i}" aria-label="Remove">×</button></span>`));
      sel.innerHTML = chips.length ? chips.join('') : `<span class="pk-none">None selected</span>`;
      const n = chips.length;
      root.querySelector('.pk-toggle-text').textContent = `${cfg.title}${n ? ` (${n} selected)` : ''}`;
    }

    function applyFilter() {
      const q = norm(search.value), terms = q.split(' ').filter(Boolean);
      let any = false;
      rows.forEach(r => { const hit = !terms.length || terms.every(t => r.hay.includes(t)); r.row.classList.toggle('hidden', !hit); });
      groups.forEach((g, gi) => {
        const wrap = list.children[gi], visible = [...wrap.querySelectorAll('.pk-row')].some(r => !r.classList.contains('hidden'));
        wrap.classList.toggle('hidden', !visible); if (visible) any = true;
        if (terms.length) wrap.classList.remove('collapsed');
      });
      // offer to add exactly what was typed
      const typed = search.value.trim(), exact = [...rows.values()].some(r => r.label === q);
      if (typed && cfg.custom && !exact) {
        customBox.classList.remove('hidden');
        customBox.innerHTML = `<div class="pk-add"><span>${any ? 'Not in the list?' : 'No match.'} Add <b>${esc(typed)}</b> as a custom ${esc(noun)}</span>${cfg.years ? '<input type="number" class="pk-year pk-addyear" inputmode="numeric" placeholder="Year" min="1930" max="2100" />' : ''}<button type="button" class="primary-button small pk-addbtn">Add</button></div>`;
      } else customBox.classList.add('hidden');
    }

    function refresh() {
      rows.forEach((r, key) => {
        const on = cfg.isOn(key); r.cb.checked = on; r.row.classList.toggle('on', on);
        if (r.yr) { r.yr.classList.toggle('hidden', !on); if (on && document.activeElement !== r.yr) r.yr.value = cfg.getYear(key) || ''; }
      });
      groups.forEach((g, gi) => {
        const c = g.items.filter(it => cfg.isOn(it.key)).length, wrap = list.children[gi];
        if (wrap) wrap.querySelector('.pk-gcount').textContent = c ? `${c} selected` : `${g.items.length}`;
        if (wrap) wrap.classList.toggle('has-on', c > 0);
      });
      renderSelected();
    }

    function addTyped() {
      const typed = search.value.trim(); if (!typed || !cfg.custom) return;
      const yr = customBox.querySelector('.pk-addyear');
      cfg.custom.add(typed, yr ? yr.value.trim() : ''); search.value = ''; applyFilter(); refresh(); cfg.onChange();
    }

    toggleBtn.addEventListener('click', () => { open = !open; panel.classList.toggle('hidden', !open); toggleBtn.setAttribute('aria-expanded', String(open)); root.classList.toggle('open', open); if (open) setTimeout(() => search.focus(), 30); });
    search.addEventListener('input', applyFilter);
    search.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return; e.preventDefault();
      const visible = [...rows.entries()].filter(([, r]) => !r.row.classList.contains('hidden'));
      const exact = visible.find(([, r]) => r.label === norm(search.value));
      if (exact) { cfg.toggle(exact[0]); search.value = ''; applyFilter(); refresh(); cfg.onChange(); }
      else if (visible.length === 1 && norm(search.value).length > 1) { cfg.toggle(visible[0][0]); search.value = ''; applyFilter(); refresh(); cfg.onChange(); }
      else addTyped();
    });
    customBox.addEventListener('click', e => { if (e.target.closest('.pk-addbtn')) addTyped(); });
    sel.addEventListener('click', e => {
      const rm = e.target.closest('[data-rm]'), rc = e.target.closest('[data-rmc]');
      if (rm) { cfg.toggle(rm.dataset.rm); refresh(); cfg.onChange(); }
      else if (rc) { cfg.custom.remove(parseInt(rc.dataset.rmc, 10)); refresh(); cfg.onChange(); }
    });

    build(); refresh(); applyFilter();
    return { refresh, rebuild() { build(); refresh(); applyFilter(); } };
  }
  return { create };
})();
