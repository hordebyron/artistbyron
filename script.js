/* ArtistByron site — client-side only.
   No server, no wallet connection, no password.
   The status checker looks up a pasted XRPL wallet address in
   data/holders.json, which is a snapshot. Nothing is sent anywhere. */

let HOLDERS = null;

async function loadHolders() {
  if (HOLDERS) return HOLDERS;
  const res = await fetch('data/holders.json');
  HOLDERS = await res.json();
  return HOLDERS;
}

function shortAddr(a){ return a.slice(0,6) + '...' + a.slice(-4); }

function checkStatus(event) {
  if (event) event.preventDefault();
  const input = document.getElementById('wallet-input');
  const out = document.getElementById('status-result');
  if (!input || !out) return;
  const addr = input.value.trim();
  out.innerHTML = '<p>Checking…</p>';
  if (!/^r[0-9A-Za-z]{24,34}$/.test(addr)) {
    out.className = 'result miss';
    out.innerHTML = '<p><strong>That does not look like an XRPL wallet address.</strong></p>' +
      '<p>Paste an address that starts with <code>r</code>, like the one in your Xaman wallet. ' +
      'Do <strong>not</strong> paste a seed, password, or secret — this box never asks for those.</p>';
    return;
  }
  loadHolders().then(data => {
    const row = data.holders.find(h => h.wallet === addr);
    if (row && row.is_distribution) {
      out.className = 'result miss';
      out.innerHTML = '<p><strong>' + shortAddr(addr) + '</strong> is the xrp.cafe minting / distribution wallet, ' +
        'not a collector wallet. It holds unclaimed mints. It is excluded from the leaderboard.</p>';
      return;
    }
    if (!row) {
      out.className = 'result miss';
      out.innerHTML = '<p><strong>' + shortAddr(addr) + ' — not found in this snapshot.</strong></p>' +
        '<ul><li>Big Paws: no</li><li>Lost in Contemplation: no</li><li>Holds both: no</li></ul>' +
        '<p>Snapshot: ' + data.snapshot + '. If you minted after that, or you sold them, you will not be on this list. ' +
        'Ask Byron for a fresh check.</p>';
      return;
    }
    const whitelisted = row.both ? 'Yes — you hold both ingredients, so you are on the whitelist for the next free IMC drop.' : 'Not yet — you need both Big Paws <em>and</em> Lost in Contemplation to be whitelisted.';
    out.className = 'result good';
    out.innerHTML =
      '<p><strong>' + shortAddr(addr) + '</strong> &nbsp; Rank ' + (row.rank ? '#' + row.rank : '—') + ' (of 313 ranked wallets)</p>' +
      '<ul><li>Big Paws: <strong>' + row.big + '</strong></li>' +
      '<li>Lost in Contemplation: <strong>' + row.lost + '</strong></li>' +
      '<li>Holds both: <strong>' + (row.both ? 'yes' : 'no') + '</strong></li>' +
      '<li>Total of these two: <strong>' + row.total + '</strong></li></ul>' +
      '<p><strong>Whitelist:</strong> ' + whitelisted + '</p>' +
      '<p class="small">Snapshot: ' + data.snapshot + '. Current holders, not original minters — ' +
      'if you minted then sold, the new holder is the one listed.</p>';
  }).catch(() => {
    out.className = 'result miss';
    out.innerHTML = '<p>Could not load the holder data file. Try again, or check the <a href="holders.html">leaderboard page</a>.</p>';
  });
}

// Holders leaderboard: render top 20 + searchable full list (excluding distribution wallet).
async function renderHolders() {
  const topEl = document.getElementById('holders-top');
  const allEl = document.getElementById('holders-all');
  const searchEl = document.getElementById('holders-search');
  if (!topEl && !allEl) return;
  const data = await loadHolders();
  const ranked = data.holders.filter(h => !h.is_distribution)
    .sort((a,b) => b.total - a.total || a.wallet.localeCompare(b.wallet));

  function rowHtml(h, showRank) {
    return '<tr><td>' + (showRank ? '#' + h.rank : '') + '</td>' +
      '<td><code>' + h.short + '</code><br><span class="small">' + h.wallet + '</span></td>' +
      '<td class="num">' + h.big + '</td><td class="num">' + h.lost + '</td>' +
      '<td class="num">' + h.total + '</td><td>' + (h.both ? 'Yes' : 'No') + '</td></tr>';
  }
  if (topEl) {
    topEl.innerHTML = ranked.slice(0, 20).map(h => rowHtml(h, true)).join('');
    const note = document.getElementById('holders-top-note');
    if (note) note.textContent = 'Most wallets hold 1 + 1 = 2. Only two collectors hold more than that, so ranks 3 and below are tied at 2.';
  }
  function renderAll(filter) {
    if (!allEl) return;
    const f = (filter || '').trim().toLowerCase();
    const list = ranked.filter(h => !f || h.wallet.toLowerCase().includes(f) || h.short.toLowerCase().includes(f));
    allEl.innerHTML = list.slice(0, 200).map(h => rowHtml(h, true)).join('') ||
      '<tr><td colspan="6">No wallet matches that search in this snapshot.</td></tr>';
    const countEl = document.getElementById('holders-count');
    if (countEl) countEl.textContent = list.length + ' wallet(s) match — showing up to 200. Full data: data/holders.json';
  }
  renderAll('');
  if (searchEl) searchEl.addEventListener('input', () => renderAll(searchEl.value));
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('status-form');
  if (form) form.addEventListener('submit', checkStatus);
  renderHolders();
  initCarousel();
  initNickname();
});

/* --- Home carousel: auto-rotates every 5s, prev/next + dots, pauses on hover --- */
function initCarousel() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;
  const slides = Array.from(carousel.querySelectorAll('.slide'));
  const dots = Array.from(carousel.querySelectorAll('.dot'));
  if (!slides.length) return;
  // Hide any hero <img> that fails to load (no real photo yet) — placeholder shows instead.
  carousel.querySelectorAll('.hero-img').forEach(img => {
    img.addEventListener('error', () => img.classList.add('is-hidden'));
    if (img.complete && img.naturalWidth === 0) img.classList.add('is-hidden');
  });
  let current = 0, timer = null;
  function show(n) {
    current = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  }
  function start() { stop(); timer = setInterval(() => show(current + 1), 5000); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  const prev = document.getElementById('carousel-prev');
  const next = document.getElementById('carousel-next');
  if (prev) prev.addEventListener('click', () => { show(current - 1); start(); });
  if (next) next.addEventListener('click', () => { show(current + 1); start(); });
  dots.forEach(d => d.addEventListener('click', () => { show(Number(d.dataset.dot)); start(); }));
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);
  show(0); start();
}

/* --- Nickname box: NOT a login. Name saved in this browser only (localStorage).
       If the name is in data/names.json, look up its wallet in data/holders.json.
       Anyone can type any name — this does not prove ownership. --- */
let NAMES = null;
async function loadNames() {
  if (NAMES) return NAMES;
  const res = await fetch('data/names.json');
  NAMES = await res.json();
  return NAMES;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
async function showNameStanding(name) {
  const out = document.getElementById('name-result');
  if (!out) return;
  const key = (name || '').trim().toLowerCase();
  if (!key) { out.className = 'result'; out.innerHTML = '<p>Type a name above first.</p>'; return; }
  out.innerHTML = '<p>Checking…</p>';
  try {
    const names = await loadNames();
    const entry = (names.names || {})[key];
    if (!entry) {
      out.className = 'result miss';
      out.innerHTML = '<p><strong>Hey ' + esc(name.trim()) + ' — we don\'t know that name yet.</strong></p>' +
        '<p>That just means no one has told us which wallet goes with that name. ' +
        '<a href="#" id="name-signup-link-2">Fill out the form to join</a>, and Byron will add you — then type your name here again.</p>' +
        '<p class="small">This is not a login, and typing a name does not prove you own a wallet.</p>';
      return;
    }
    const data = await loadHolders();
    const row = data.holders.find(h => h.wallet === entry.wallet);
    const isExample = /EXAMPLE ONLY/i.test(entry.note || '');
    const head = '<p><strong>Hey ' + esc(name.trim()) + ', here\'s where you stand.</strong>' +
      (isExample ? ' <span class="small">(Example entry — not a real person.)</span>' : '') + '</p>';
    if (!row) {
      out.className = 'result miss';
      out.innerHTML = head + '<p>Your wallet <code>' + shortAddr(entry.wallet) + '</code> is on file, but it is not in this holder snapshot (' + data.snapshot + '). ' +
        'You may have minted after that, or sold the pieces.</p>' +
        (entry.note ? '<p class="small">' + esc(entry.note) + '</p>' : '');
      return;
    }
    if (row.is_distribution) {
      out.className = 'result miss';
      out.innerHTML = head + '<p>That wallet is the xrp.cafe distribution wallet, not a collector wallet. It is excluded from the leaderboard.</p>';
      return;
    }
    const whitelisted = row.both ? 'Yes — you hold both ingredients, so you are on the whitelist for the next free IMC drop.' : 'Not yet — you need both Big Paws <em>and</em> Lost in Contemplation to be whitelisted.';
    out.className = 'result good';
    out.innerHTML = head +
      '<p>Wallet <code>' + shortAddr(row.wallet) + '</code> &nbsp; Rank ' + (row.rank ? '#' + row.rank : '—') + '</p>' +
      '<ul><li>Big Paws: <strong>' + row.big + '</strong></li>' +
      '<li>Lost in Contemplation: <strong>' + row.lost + '</strong></li>' +
      '<li>Holds both: <strong>' + (row.both ? 'yes' : 'no') + '</strong></li>' +
      '<li>Total of these two: <strong>' + row.total + '</strong></li></ul>' +
      '<p><strong>Whitelist:</strong> ' + whitelisted + '</p>' +
      (entry.kofi_name ? '<p class="small">Ko-fi name on file: ' + esc(entry.kofi_name) + '</p>' : '') +
      (entry.note ? '<p class="small">' + esc(entry.note) + '</p>' : '') +
      '<p class="small">Snapshot: ' + data.snapshot + '. Current holders, not original minters. ' +
      'Full list: <a href="holders.html">XRPL Leaderboard</a>.</p>';
  } catch (e) {
    out.className = 'result miss';
    out.innerHTML = '<p>Could not load the name / holder data. Try again, or check the <a href="holders.html">leaderboard page</a>.</p>';
  }
}
function initNickname() {
  const form = document.getElementById('name-form');
  if (!form) return;
  const input = document.getElementById('name-input');
  const forget = document.getElementById('name-forget');
  const saved = localStorage.getItem('horde_name') || '';
  if (saved && input) { input.value = saved; showNameStanding(saved); }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    localStorage.setItem('horde_name', name);
    showNameStanding(name);
  });
  if (forget) forget.addEventListener('click', () => {
    localStorage.removeItem('horde_name');
    if (input) input.value = '';
    const out = document.getElementById('name-result');
    if (out) { out.className = 'result'; out.innerHTML = '<p class="small">Name forgotten on this device. Type a name above any time.</p>'; }
  });
  // The "fill out the form" link is a placeholder until Byron gives a real form URL.
  document.addEventListener('click', event => {
    const t = event.target.closest('#name-signup-link, #name-signup-link-2');
    if (!t) return;
    event.preventDefault();
    alert('Form link coming — Byron will add the sign-up form here. For now, tell Byron your name + wallet directly.');
  });
}
