# Pokomplete Product Plan

## Positioning

**The Pokemon-first collection planner.** Competitors optimize for set-based tracking. Pokomplete answers: What cards exist of my favorite Pokemon? Including trainer-owned variants, cameos, promos, and collabs. The variant filter system lets collectors define their own master set.

**Key insight:** The number one collector frustration is no universal definition of master set. Every app decides for you. Pokomplete says: build YOUR master set.

## What Has Shipped

### Core Features
- Two master set modes: Official Set (by TCG expansion) and Pokemon Collection (by species across all sets)
- Card lookup by national dex number via PokeAPI -- catches all name variants (Marnie s Grimmsnarl, Detective Pikachu, Alolan forms)
- Evolution chain support -- inline chain chips in search results, chain-ordered sorting, grouped-by-pokemon mode
- Variant expansion from TCGPlayer price types -- normal, reverse holo, 1st edition, unlimited holo as separate checklist entries
- Unique Art Only / All Variants toggle -- one entry per card number vs separate entries per printing
- 11 toggleable variant filter categories (normal, holo, reverse holo, full art, secret rare, rainbow rare, gold, promo, collab, tournament, cameo)
- 6 sort modes: set order, chronological, grouped by set, grouped by Pokemon, evolution chain order
- Checklist with per-card checkbox tracking, condition-based pricing (NM/LP/MP), sort options, progress bar, value tracking
- Card image gallery -- grid view with lazy loading, click-to-enlarge dialog, checkbox overlay
- Binder view -- 9-pocket (3x3) page layout with page navigation, 2x3 on mobile
- Binder page calculator -- page count and recommended binder size
- CSV export with ownership status, prices, TCGPlayer links
- PDF export -- checklist PDF plus proxy placeholder sheets with grayscale card images
- Missing cards only proxy export
- Shareable URLs -- encode builder config in query params, versioned (v=1), forward-compatible
- Saved setlists -- persist builder configs in localStorage
- Cameo database -- 345 appearances for 91 Pokemon, imported from community spreadsheet
- Dark mode -- system preference plus manual toggle via next-themes
- Offline support -- service worker (vite-plugin-pwa), IndexedDB caching, runtime caching for APIs/images/fonts
- Footer with GitHub link, data source attribution, commit hash, build date

### Infrastructure
- Repo: github.com/laputacloudco/pokomplete (public, MPL-2.0)
- Domain: pokomplete.com (Cloudflare DNS, GitHub Pages)
- CI: lint plus typecheck plus build on PRs
- Deploy: GitHub Pages on push to main
- Branch protection: 1 required review, CI required, linear history, squash-merge only
- PWA manifest with icons

### Known Limitations
- Variant data depends on TCGPlayer -- new/unreleased sets without pricing show one entry per card number (notice displayed to user)
- Cameo database is manual -- imported from CSV, not auto-updated
- No user accounts -- all data in localStorage (device-specific)

## Competitive Landscape

| Tool | Model | Strengths | Weaknesses |
|------|-------|-----------|------------|
| Cardrake | Freemium | Best visual binder layouts, set guides | Set-focused only, premium for save/sync |
| MasterSet.gg | ~5 USD/mo | Gamification, live pricing | Subscription for export/analytics |
| TCG MasterSet | Freemium (200 cards) | Multi-TCG, rarity breakdown | Card cap on free tier |
| PkmnBindr | Free | Drag-drop binder pages, printable PDFs | No master set planning |
| Takara | Freemium | AI card scanning, offline | Mobile-focused |
| 9Pocket | Paid iOS | Scanning, value tracking | iOS only |

## Roadmap

### Phase 1: Foundation -- COMPLETE
All shipped. See What Has Shipped above.

### Phase 2: Differentiation (current)
- Complete my collection buy list -- given checked cards, show uncollected with TCGPlayer links plus total cost by condition
- Multi-Pokemon comparison -- side-by-side card history for two Pokemon
- Evolution chain visualization -- visual tree with card counts per stage per set
- Printable binder pages -- print 9-pocket placeholder pages with card images in positions
- Cameo contribution workflow -- form to submit discoveries, export for community review

### Phase 3: Growth
- Artist master sets -- every card by Mitsuhiro Arita (uses TCG API artist field)
- Type-themed collections -- every Dragon-type card (uses supertype/subtype)
- Japanese set support
- Shareable collection profiles -- public URLs
- Price history charts
- Community leaderboard (opt-in)

## Monetization

### Freemium model
Core planning stays free and open source. Pro targets power users.

**Free (always):** Search, filters, sort modes, evolution chains, checklist, cameo browsing, basic text checklist PDF, saved setlists, offline support.

**Pro (~3-5 USD/month or ~30 USD/year):** Proxy placeholder sheets with card images, buy list with cost estimates, CSV/data export, collection value analytics, multiple saved collections (free: 3, Pro: unlimited).

**Passive revenue:** TCGPlayer affiliate links (~5% on referrals), sponsored binder/sleeve recommendations, one-time printable binder page sets (1-2 USD/set), Ko-fi / GitHub Sponsors.

**Implementation:** Stripe Checkout or Lemon Squeezy, JWT token client-side, no backend needed for gating.

## Data Sources

- **Card data**: Pokemon TCG API (pokemontcg.io) -- live queries, cached in IndexedDB (1hr cards, 1day sets) plus service worker
- **Species/evolution**: PokeAPI (pokeapi.co) -- cached 30 days
- **Cameo data**: data/cameos.csv -- community spreadsheet, imported via npm run import-cameos
- **Pricing/variants**: TCGPlayer via Pokemon TCG API price fields (variant expansion depends on this data)
- **Card images**: images.pokemontcg.io -- cached 30 days via service worker

## Architecture

See .github/copilot-instructions.md for technical details, conventions, and commands.
