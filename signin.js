/* NursingSim - sign-in (v68). First name, last name and role; everything charted is recorded under that name.
   Saved on this device only (localStorage). NSUser.current() -> {first,last,role,name,label} or null; NSUser.label() -> "Jane Doe, LPN student" (or "Student" if nobody is signed in). */
(() => {
  'use strict';
  const KEY = 'nursingsim.user', ROLES = ['RN student', 'LPN student', 'Instructor', 'Observer'];
  const read = () => { try { const u = JSON.parse(localStorage.getItem(KEY) || 'null'); return u && u.first && u.last ? u : null; } catch (e) { return null; } };
  const write = u => { try { if (u) localStorage.setItem(KEY, JSON.stringify(u)); else localStorage.removeItem(KEY); } catch (e) { /* ignore */ } };
  let user = read();
  const full = u => u ? Object.assign({}, u, { name: `${u.first} ${u.last}`, label: `${u.first} ${u.last}, ${u.role}` }) : null;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window.NSUser = { current: () => full(user), label: () => (user ? full(user).label : (window.NS_STUDENT ? 'Student' : 'Instructor')), signOut: () => { user = null; write(null); showChip(); prompt(); } };

  let overlay, chip;
  function showChip() {
    if (!chip) return;
    const u = full(user); chip.innerHTML = u ? `<span class="user-name">${esc(u.name)}</span><span class="user-role">${esc(u.role)}</span><button type="button" class="user-out" title="Sign out">Sign out</button>` : '';
    const out = chip.querySelector('.user-out'); if (out) out.addEventListener('click', () => { if (confirm('Sign out? Your charting stays saved on this device.')) window.NSUser.signOut(); });
  }
  function prompt() {
    if (user || overlay) return;
    overlay = document.createElement('div'); overlay.id = 'signInOverlay';
    overlay.innerHTML = `<form class="si-card" autocomplete="off"><div class="si-logo">NS</div><h1>Sign in</h1><p>Everything you chart will be recorded under your name.</p>
      <label>First name<input id="siFirst" required autocomplete="off" autocapitalize="words"></label>
      <label>Last name<input id="siLast" required autocomplete="off" autocapitalize="words"></label>
      <label>Role<select id="siRole">${ROLES.map(r => `<option${r === (window.NS_STUDENT ? 'LPN student' : 'Instructor') ? ' selected' : ''}>${r}</option>`).join('')}</select></label>
      <div class="si-err" id="siErr"></div><button type="submit" class="primary-button">Sign in</button></form>`;
    document.body.appendChild(overlay);
    const f = overlay.querySelector('form');
    f.addEventListener('submit', e => {
      e.preventDefault(); const first = overlay.querySelector('#siFirst').value.trim(), last = overlay.querySelector('#siLast').value.trim();
      if (!first || !last) { overlay.querySelector('#siErr').textContent = 'Enter your first and last name.'; return; }
      user = { first, last, role: overlay.querySelector('#siRole').value }; write(user); overlay.remove(); overlay = null; showChip();
      document.dispatchEvent(new CustomEvent('nursingsim-signin', { detail: full(user) }));
    });
    setTimeout(() => { const i = overlay && overlay.querySelector('#siFirst'); if (i) i.focus(); }, 50);
  }
  function init() {
    const actions = document.querySelector('.top-actions');
    if (actions) { chip = document.createElement('div'); chip.id = 'userChip'; actions.insertBefore(chip, actions.firstChild); }
    showChip(); prompt();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
