# Pokomplete Product Plan

## Positioning

**The Pokemon-first collection planner.** While competitors optimize for set-based tracking (complete your Base Set), Pokomplete answers the collector s real question: What cards exist of my favorite Pokemon? Including trainer-owned variants, cameos, promos, and collabs. Our variant filter system lets you define what counts as YOUR master set.

## Competitive Landscape

| Tool | Model | Strengths | Weaknesses |
|------|-------|-----------|------------|
| Cardrake | Freemium | Best visual binder layouts, set guides | Set-focused only, premium for save/sync |
| MasterSet.gg | ~5 USD/mo | Gamification, live pricing, custom master sets | Subscription for export/analytics |
| TCG MasterSet | Freemium (200 cards) | Multi-TCG, digital binder, rarity breakdown | Card cap on free tier |
| PkmnBindr | Free | Drag-drop binder pages, printable PDFs | No master set planning |
| Takara | Freemium | AI card scanning, offline | Mobile-focused |
| 9Pocket | Paid iOS | Scanning, value tracking | iOS only |

## Our Differentiators

1. Pokemon-centric master sets - every Ampharos card ever printed across all sets
2. Evolution chain awareness - inline chain selection, chain-ordered sorting, grouped-by-pokemon mode
3. Cameo database - 345 documented appearances from community spreadsheet
4. Fine-grained variant control - 11 toggleable variant categories (you define your master set)
5. 5 sort modes including grouped-by-pokemon (unique)
6. 100% free, open source, no account - zero friction, offline-capable

## Roadmap

### Phase 1: Foundation (table-stakes parity)
- Visual binder grid preview (9-pocket layout) - #13
- Card image gallery / thumbnail grid view - #14
- CSV export - #15
- Shareable URL for setlist configuration - #16
- Mobile responsive polish - #17
- Binder page count calculator - #18

### Phase 2: Differentiation
- What do I still need buy list with TCGPlayer links + cost estimate
- Printable binder pages (integrated with binder view and binder calculator, supports configurable pocket layouts)
- Type-themed collections (every Dragon-type card)

### Phase 3: Growth
- Artist master sets (every card by Mitsuhiro Arita)
- Multi-Pokemon comparison (side-by-side card histories)

### Phase 4: Scale
- Evolution chain visualization tree
- Cameo contribution workflow
- Shareable collection profiles (public URLs)
- Price history charts

### Phase 5: Expansion
- Japanese set support
- Community leaderboard (opt-in)

## Monetization

### Model: Freemium (generous free tier + Pro for power features)

The core planning experience stays free and open source — that's the growth engine. Premium features target power users who get enough value to pay.

**Free (always):**
- Pokemon/set search, variant filters, sort modes, evolution chains
- Checklist with progress tracking
- Cameo database browsing
- Basic text checklist PDF export
- Saved setlists (localStorage)
- Offline support

**Pro (~$3-5/month or ~$30/year):**
- **Proxy placeholder sheets** — printable 9-pocket pages with grayscale card images positioned for binder sleeves. Free tier gets text-only placeholders.
- **Visual binder preview** — interactive 9-pocket grid view showing your collection as it would appear in a physical binder.
- **"What do I still need" buy list** — filtered list of uncollected cards with TCGPlayer links and total cost estimate by condition.
- **CSV/data export** — export full checklist with prices, ownership, metadata.
- **Collection value analytics** — total value, value by variant type, value breakdown by set, remaining spend estimate.
- **Multiple saved collections** — free tier allows 3 saved setlists, Pro unlimited.
- **Priority cameo submissions** — contributed cameos reviewed and merged faster.

### Revenue alternatives to explore
- **Affiliate links** — TCGPlayer affiliate program pays ~5% on purchases made through referral links. Every card in the checklist already links to TCGPlayer. This is passive and doesn't gate features.
- **Sponsored content** — partner with binder/sleeve manufacturers (Vault X, Ultra Pro) to recommend products alongside the binder page calculator. "You need a 360-pocket binder — here's our pick."
- **One-time purchases** — sell individual printable binder page sets per expansion ($1-2 per set, similar to PokeBinder's model).
- **Donations/tips** — Ko-fi or GitHub Sponsors for users who want to support development without a subscription.

### Implementation notes
- Payment: Stripe Checkout or Lemon Squeezy (no backend needed — verify subscription via JWT token stored client-side after checkout)
- Gating: check subscription status before allowing Pro exports/views. Core search/checklist never gated.
- Open source compatibility: Pro features can live in the same repo but gate on a license key. The code is open but the service has value-add.

## Architecture

See .github/copilot-instructions.md for technical architecture, conventions, and build commands.

## Data Sources

- Card data: Pokemon TCG API (https://pokemontcg.io/) - live, cached via IndexedDB + service worker
- Species/evolution: PokeAPI (https://pokeapi.co/) - cached 30 days
- Cameo data: data/cameos.csv - community-sourced, imported via npm run import-cameos
- Pricing: TCGPlayer via Pokemon TCG API price fields
