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
});
