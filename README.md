# artistbyron.ca — new site

**Status: draft, but live as a preview at https://hordebyron.github.io/artistbyron/**
Pushed to GitHub repo `hordebyron/artistbyron`, branch `main`, commit `7d57f91789dccf3f91298fbb1a1788d4553ca022` (first draft). GitHub Pages is enabled (Deploy from branch, main / root). The homepage redesign in this folder is **local only, NOT pushed yet** — Byron reviews it first.
Current artistbyron.ca is untouched. Do not change DNS until Byron says go.

## What is in here

| File | What it is |
|---|---|
| `index.html` | **Home — visual first.** Big "ART BYRON" hero, rotating carousel (3 slides), What's New blurb, "What should we call you?" nickname box, links to all sections. No leaderboard tables on the front page. |
| `holders.html` | XRPL holders leaderboard. Top 20 + searchable full list. Wallet paste-and-check box lives here. |
| `kofi.html` | Ko-fi leaderboard / snapshot. Tiers, Colour Me entries, Loot Crates. |
| `style.css` | Dark horror style, mobile-first, no frameworks. Includes carousel + dripping-title styles. |
| `script.js` | Carousel, nickname box, wallet status checker, leaderboard search/filter. Client-side only. |
| `data/holders.json` | The holder snapshot used by the site. 314 wallets. Generated from `~/workspace/horde/big-paws-lost-wallets.csv`. |
| `data/names.json` | **Nickname → wallet mapping** for the home-page nickname box. Starts with 2 EXAMPLE entries only — no real names invented. See below. |
| `images/` | Hero photos go here: `hero1.jpg`, `hero2.jpg`, `hero3.jpg`. See `images/README.md`. |

## Home page — how it works

- **Hero carousel:** 3 slides (Big Paws, Lost in Contemplation, Rumble Ready). Auto-rotates every 5 seconds, with ‹ › buttons and dots. Pauses on hover / focus. If a hero photo file is missing, that slide shows a big emoji placeholder — the site does not break.
- **What's New:** one short blurb in `index.html`, section `id="whats-new"`. Edit the 2–3 lines by hand in that file, and update the "Updated …" line. Current blurb: Mon 16 Nov 2026 free IMC drop; free Big Paws / Lost mint ended Fri 13 Nov 4pm CST, then 5.89 XRP.
- **Section links:** Home, XRPL Leaderboard, Ko-fi Leaderboard, Ko-fi Shop, X @ArtistByron, X @HORDEonXRPL, IMCollectibles, xrp.cafe/thehorde, Ordinals Feast of fLies. Leaderboards are linked, not shown, on the front page.

## Hero images — how Byron swaps them in

1. Save a real art photo as `images/hero1.jpg` (Big Paws), `images/hero2.jpg` (Lost in Contemplation), or `images/hero3.jpg` (Rumble Ready). JPG is fine.
2. Keep each file small for phones — under ~500 KB if possible, roughly 1200 × 800 px.
3. Put it in `images/`, push to GitHub. The carousel shows the photo instead of the placeholder. No code change needed.
4. To change what a slide says, edit its `<div class="slide-caption">` in `index.html`. To add a 4th slide, copy a whole `<article class="slide">…</article>` block, add a dot button, and the JS handles it.
5. Do not hotlink images from other sites. Only Byron's own art.

## "What should we call you?" — the nickname box (NOT a login)

**Yes, Byron's idea makes sense, and it is built in.** It works like this:
1. A visitor types a name / nickname on the home page. It is saved in **their own browser only** (`localStorage`, key `horde_name`). Nothing is sent to a server. There is a "Forget my name" button that clears it.
2. The site looks that name up (lower-case) in `data/names.json`. If it matches, it takes that entry's wallet and looks it up in `data/holders.json`.
3. If found, it shows a small card: "Hey [name], here's where you stand" — Big Paws count, Lost count, holds both yes/no, rank, whitelist status, plus the Ko-fi name on file if there is one.
4. If the name is **not** in `names.json`, it says: "We don't know that name yet — fill out the form to join." The form link is a placeholder (`#` + a note) — **Byron still needs to supply a real form link** (e.g. a Google Form) and put it in `index.html` where it says `id="name-signup-link"`.

**What it is NOT:**
- It is NOT a login. It does not prove the visitor owns that wallet — anyone can type any name.
- No password, no seed, no wallet connection, no Xaman, no X / Ko-fi login, no database, no server. GitHub Pages is static hosting only.
- The page says all of this plainly, in the box itself.

**How Byron adds a real person:**
1. The person fills out the form (once Byron adds the link) and tells Byron their nickname + XRPL wallet (+ Ko-fi name, if any).
2. Byron (or a minion) adds one entry to `data/names.json`, under `"names"`, lower-case key:
   ```json
   "cryptozeug": {"wallet": "r...", "kofi_name": "Cryptozeug", "note": "Colour Me 1st"}
   ```
3. Save, push to GitHub. That person can then type their name on the home page and see their standing.
4. **Never** put a seed, password, or secret in `names.json` — wallets only, and only with that person's permission.

**Starting data:** `data/names.json` has 2 EXAMPLE entries only, clearly marked "EXAMPLE ONLY — not a real person", using the rank #1 wallet (3+3) and rank #2 wallet (2+2) from the snapshot so Byron can test the box by typing `example-horde-fan` or `example-second-fan`. Delete them (or replace them) when real people sign up. No real names were invented.

## The data (do not invent new numbers)

### XRPL leaderboard — snapshot 12 Nov 2026, 22:30–22:40 CST
- Big Paws (My Zombie Cats, https://xrp.cafe/edition/myzombiecats/13451): 317 / 589 minted, 288 unique wallets
- Lost in Contemplation (Byrons Ink, https://xrp.cafe/edition/byronsink/13452): 310 / 589 minted, 293 unique wallets
- Wallets holding BOTH: 267 raw, **266 real** — see below
- Big Paws only: 21, Lost only: 26, total holding at least one: 314
- **Current holders, not original minters.** Verified against the XRPL ledger, 0 mismatches. If someone minted then sold, the new holder is listed.
- Free mint ended Fri 13 Nov 2026, 4pm CST, when both turned to 5.89 XRP — so these counts are already out of date. Re-run the wallet check and regenerate `data/holders.json` before going live, and after the Monday IMC drop.

**Distribution wallet, excluded from ranking:**
`rKqqb5QZXVAL3VqXJL6obfRGeHou1DtyBV` — 27 Big Paws + 15 Lost. Almost certainly xrp.cafe's minting / distribution wallet (unclaimed mints). It is in `data/holders.json` flagged `is_distribution: true`, with `rank: null`, and the site filters it out of the leaderboard. The status box tells you if you paste it.

**Ranking:** by total of these two editions only. #1: `rEd2PoxRUTnGNhNFoZQzdaeiZWeys9R8NU` (3+3=6). #2: `rBFc5zLYkem8yTykWtkdMmNHVNi7GG7Bgg` (2+2=4). #3 is a tie: all 266 real both-holders have 1+1=2. That is honest — do not pretend there is a long ranked race when most people are tied.

**Wallets are shown shortened** (`rXXX...XXXX`) in the table, with the full address in the same row and in `data/holders.json`.

### Ko-fi leaderboard — snapshot 12 Nov 2026, 19:48–19:50 CST
- 111 supporters, 604 coffees received, "Art Supplies" goal 1%
- Tiers (CAD/month): $5 Wanderer, $12 Seeker, $25 Serious, $125 Assimilated — details on `kofi.html`
- Colour Me contest (posted 5 Nov 2026): 6 entries — Cryptozeug (1st), Michael Lemane (2nd), tjbussx (3rd), Rollgruen (4th), PVM and tonysandiego (newest, not yet numbered by Byron)
- **Ko-fi has no public API for a live leaderboard.** This page says that plainly. Update the numbers by hand in `kofi.html` after checking ko-fi.com/artistbyron. No supporter names were invented — Ko-fi does not publish a public supporter list.

## "Login to view status" — what this draft does and does NOT do

**What it does:**
- A "Check my status" box on `holders.html`. A visitor pastes their XRPL wallet address (starts with `r...`).
- JavaScript looks it up in `data/holders.json` (loaded in their browser) and shows: Big Paws count, Lost count, holds both yes/no, rank, and whether they are whitelisted for the next free IMC drop (hold both = yes).
- On the home page, the nickname box does the same lookup by name (via `data/names.json` → wallet → `data/holders.json`).
- Nothing is sent to a server. No account, no password, no seed, no wallet connection. The boxes warn never to paste a seed or password.

**What it does NOT do:**
- It is NOT a login. It does not prove the visitor owns that wallet — anyone can paste anyone's public address or type anyone's nickname.
- No Xaman wallet connect, no X login, no Ko-fi login, no database, no server.
- GitHub Pages is static hosting only: HTML/CSS/JS files, no backend, no database, no built-in login. A real login would need a server / a service like Xaman (wallet connect) or an IMCollectibles / X integration, and that is a later step, not in this draft.

## Drop and collection images — host locally (18 Nov 2026)

**Rule, Byron approved 18 Nov 2026, for all drops now and in the future:** never link
`resizer.atomichub.io` image URLs directly from a site page. That server returns 200
from the VM but is slow and flaky on phones, and Byron's screenshot of wax.html on
18 Nov showed every drop card image broken. Download the image first and host it
on the site itself, in `art/drops/`, then point the page at the local file.

- New drop: download its image from the resizer URL, save as
  `art/drops/<drop-name>.webp`, use `art/drops/<drop-name>.webp` in the drop page
  and in the wax.html card. Same for collection images
  (`art/drops/collection-<name>.webp`).
- The normal GitHub push only takes text files, it rejects binary images, so
  image files go up through the GitHub website in a browser (drag the
  `art/drops/` folder in), like the 58 TV PNGs on 14 Nov. Push the HTML that
  points at them only after the images are live on GitHub, or the cards 404.
- Exception: monster.html line ~428 builds a resizer URL at run time for whatever
  NFT a visitor holds, that one cannot be pre-hosted, it stays as it is. Only
  the fixed practice-food images there are local.

Current local files in `art/drops/`: a-thing.webp, pot-of-gm.webp,
horde-dude-worries.webp, hordes-clown-1.webp, practice-old-pumpkin.webp,
collection-art-of-byron.webp, collection-my-zickle-army.webp,
collection-my-zombie-cats.webp, collection-horde-on-wax.webp.

## How to push to GitHub Pages

The first draft is already pushed (see Status above). To push an update, e.g. this homepage redesign after Byron reviews it:
```
cd ~/workspace/artistbyron-site
# (with the GitHub connector / push-files tool — do not paste a token in chat)
# push index.html, style.css, script.js, data/names.json, images/README.md (+ hero photos when added)
```
Then check https://hordebyron.github.io/artistbyron/ — Pages rebuilds from `main` in a minute or two.

Only when Byron says go, point artistbyron.ca at it:
- In the repo, add a file named `CNAME` containing exactly `artistbyron.ca` (no `https://`, no trailing slash).
- At the domain registrar (wherever artistbyron.ca is registered), set DNS: 4 A records to GitHub Pages IPs (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and a CNAME for `www` → `<username>.github.io` — confirm the current IPs in GitHub's docs at the time, they can change.
- Wait for DNS to propagate (minutes to a few hours), then check https://artistbyron.ca and turn on "Enforce HTTPS" in Pages settings.
- **Do not change DNS until the GitHub Pages URL works and Byron has looked at it.** The current artistbyron.ca is untouched until then.

## How to update the data later

- **XRPL holders:** re-run the wallet check (same method as `~/workspace/horde/big-paws-lost-wallets.md`), regenerate `data/holders.json` with the same fields (`wallet, short, big, lost, both, total, is_distribution, rank, rank_label`), update the snapshot date in `holders.html` and `index.html`, and re-push.
- **Ko-fi:** edit the numbers in `kofi.html` by hand, with the new snapshot date.
- **What's New:** edit the blurb in `index.html` (`id="whats-new"`) by hand.
- **Names:** add entries to `data/names.json` as described above.
- **Art photos:** drop real photos into `images/` as described above.

## Cost
$0 — GitHub Pages hosting is free for a public repo, and this site uses no paid services, no frameworks, no analytics, no tracking.
