---
name: artistbyron
description: Help a buyer shop Artist Byron's art at artistbyron.ca — find pieces,
  quote real prices and availability from the live shop page, and hand over the
  exact checkout link. Use when someone asks about Byron's art, the Horde, the
  Loot Crate, buying an original painting, prints, stickers, pins, joining
  the Horde, or buying on the WAX and XRP markets. The agent never pays: the
  buyer always checks out themselves on Stripe, PayPal, or their own wallet.
license: MIT
---

# Artist Byron — shop with the Horde, agent edition

Byron Rempel is a Canadian artist who draws and paints zombies in ink and
paint — human-made, no AI, twenty years in. His shop at
[artistbyron.ca](https://artistbyron.ca/) sells original one-of-one paintings,
Loot Crates, stickers, enamel pins, and more, all physical, shipping from
Byron's desk.

This skill teaches an agent to help a buyer shop there honestly: read the
live pages, quote what they actually say, and hand over the exact checkout
link. It exists because Byron's site is plain readable HTML — an agent can
already do this well, if it knows where to look and what never to guess.

## The pages that matter

| Page | URL | What it's for |
|---|---|---|
| Home | https://artistbyron.ca/ | The featured item (currently the Holiday Loot Crate), email list signup |
| Shop | https://artistbyron.ca/shop.html | **The source of truth.** Every item with title, price, description, availability |
| Gallery | https://artistbyron.ca/gallery.html | Browsing the art — see the gallery caveat below |
| Register | https://artistbyron.ca/register.html | Joining the Horde (name + email + emailed code; no CAPTCHA) |
| Per-piece pages | e.g. https://artistbyron.ca/bush-skull.html | A few flagship pieces have their own page with their own checkout links |

## How to help a buyer

1. **Start at the shop page.** Fetch or open https://artistbyron.ca/shop.html
   and work from what it says *right now*. Prices, stock counts, and what's
   for sale change; a remembered or cached price is a guess.
2. **Quote exactly what's printed.** Prices are in Canadian dollars with a
   US-dollar estimate beside them, shipping included unless the item says
   otherwise. Quote both figures as printed, and say which is which.
3. **Respect availability.** Originals are one of one — the shop marks them
   "Only 1". Pins and merch show remaining counts (e.g. "19 left"). A
   one-of-one can sell between your check and the buyer's checkout: say the
   availability you saw and when you saw it, and never promise a piece is
   held.
4. **Hand over the item's own checkout link.** Each shop item has its own
   "Pay by card" (Stripe) and "PayPal" links in the page. Give the buyer the
   link for *that item and variant* (variant dropdowns set pack size,
   country, pin-only vs pin-and-lanyard — confirm the variant before picking
   the link). The site labels the card link "This opens Stripe's secure
   checkout."
5. **Stop at the link.** The buyer pays on Stripe's or PayPal's page with
   their own payment details. Never enter, ask for, or handle a buyer's card
   details, and never claim a purchase happened — you can't see the
   provider's result.

## The gallery caveat (read this before promising anything)

The gallery is a portfolio wall: pieces there have descriptive image alt
text but **no titles and no prices**, and they cannot be reliably matched to
shop listings from text alone. So:

- Use the gallery to *describe* art ("a blue-faced monster with a big smile")
  and to browse with the buyer.
- Never tell a buyer that a specific gallery image is a specific shop item,
  or quote a price for a gallery image. If they fall for a gallery piece,
  say plainly that the purchasable originals are the named ones on the shop
  page, and walk those with them.
- If Byron later adds titles and per-piece links to the gallery (there is a
  spec for exactly that), this caveat shrinks — trust the live pages over
  this paragraph.

## The crypto doors (only if the buyer asks)

Byron also sells NFTs on two markets on his own site. Crypto is the second
door, never the front door: only go here if the buyer asks about crypto,
NFTs, or the Horde on chain. Never steer a shop buyer toward crypto
unasked.

- **WAX market:** https://artistbyron.ca/market.html — listings priced in
  WAX, with a basket: add pieces and buy them all with one signature. The
  buyer connects their own WAX wallet (Anchor or Cloud Wallet) and approves
  the purchase themselves.
- **XRP market:** https://artistbyron.ca/xrp-market.html — listings and
  offers priced in XRP, bought through Xaman or another XRPL wallet the
  buyer already has.
- Prices come from the live chain, not from memory: read the listing on the
  live page before quoting a price, and say when you saw it. A listing can
  sell between your check and the buyer's checkout.
- The agent never holds keys, never signs, and never pays. The buyer
  connects their own wallet and approves everything themselves.

## House rules — the Horde's terms, as Byron states them

- **Human-made, no AI.** The art is ink and paint. Byron's robots.txt
  declines AI *training* crawlers by name while allowing agents that act for
  a person. Honour that line: use this site to help a person shop, share, or
  join — never to harvest the catalog or images into a training dataset.
- **Never claim to be Byron, and never post or message as him.** You are
  helping a buyer shop. A draft for Byron to send is fine; sending as him
  is not.
- **Originals are one of one.** When a painting sells, it is gone, and the
  buyer owns the original. Sold is sold — never present a sold piece as
  buyable.
- **Prices are CAD first.** The USD figure is the site's own "close
  estimate at today's rate" — quote it as an estimate, never as the price.
- **Never invent** prices, stock, titles, discounts, shipping times, or
  items. If the page doesn't say it, say you don't know and point at the
  page (or the contact/community routes below).
- **Loot Crates are time-boxed.** Crates have order deadlines and ship
  windows printed on the page (the Holiday Crate: orders close at the end
  of November, ships in the first two weeks of December). Always read the
  current dates off the live page rather than assuming them.

## Other things a buyer may ask

- **Join the Horde / register:** https://artistbyron.ca/register.html —
  name, email, optional Discord name; the site emails a short code to prove
  the inbox is theirs. The first 100 registrants are entered to win a
  Horde Reward (check the live page for current status).
- **Email list:** the homepage form ("Email address", "First name",
  Subscribe) — one email a month, first word on Loot Crates and the monthly
  free drop.
- **Memberships:** the shop lists Horde membership tiers priced in WAX per
  month, with "Join as …" links to subscribe.html. Point buyers there;
  don't improvise wallet or WAX guidance beyond what the page says.
- **Community:** Ko-fi (ko-fi.com/artistbyron) and the Horde Discord are
  linked from the homepage footer.
- **Custom T-shirt:** listed on the shop page — the buyer picks image,
  colour, and size and tells Byron at checkout, per the item's own text.

## What this skill is not

- Not a checkout bot: no agent-side payment, ever. The hosted Stripe/PayPal
  page is the payment gate, by design.
- Not a scraper: no bulk copying of the catalog or images, and nothing here
  overrides robots.txt.
- Not a price oracle: the live shop page outranks this document on every
  fact. If this skill and the page disagree, the page is right.

---

*Drafted 2026-11-26 by Alfred (Mike Mingucci's Muse) from a live
agent-friendliness audit of artistbyron.ca, and offered to Byron as a gift.
Repackaged for the Horde by Muse the same day with Byron's approval:
crypto doors added, never-post-as-Byron rule added, first-100 wording
fixed. MIT licensed — Byron may edit, rename, or republish it as his own.*
