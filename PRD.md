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
- Multi-Pokemon comparison (side-by-side card histories)
- Evolution chain visualization tree
- Printable binder pages (9-pocket format with card images)
- Cameo contribution workflow

### Phase 3: Growth
- Artist master sets (every card by Mitsuhiro Arita)
- Type-themed collections (every Dragon-type card)
- Japanese set support
- Shareable collection profiles (public URLs)
- Price history charts
- Community leaderboard (opt-in)

## Architecture

See .github/copilot-instructions.md for technical architecture, conventions, and build commands.

## Data Sources

- Card data: Pokemon TCG API (https://pokemontcg.io/) - live, cached via IndexedDB + service worker
- Species/evolution: PokeAPI (https://pokeapi.co/) - cached 30 days
- Cameo data: data/cameos.csv - community-sourced, imported via npm run import-cameos
- Pricing: TCGPlayer via Pokemon TCG API price fields
