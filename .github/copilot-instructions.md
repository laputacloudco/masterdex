# Copilot Instructions for Pokomplete

## Commands

```bash
npm run dev          # Start dev server
npm run build        # tsc -b --noCheck && vite build
npm run typecheck    # tsc -b (strict type checking)
npm run lint         # eslint
npm run import-cameos # Regenerate src/lib/cameoData.ts from data/cameos.csv
```

No test framework is configured. Verify changes with: typecheck + lint + build.

## Architecture

```
API Layer                Cache Layer             App State              UI Components
---------------------    -------------------     ----------------       ---------------------
pokeApi.ts               apiCache.ts             useKV hook             App.tsx (orchestrator)
  species index            (IndexedDB + TTL)     (localStorage,           SetBuilder
  evolution chains         in-memory fallback      pokomplete: prefix)    PokemonSelector
  name normalization                                                      SetSelector
                         requestScheduler.ts     App.tsx useEffect         Checklist (list+gallery)
pokemonTcgApi.ts           (max 2 concurrent,    fetches cards,            BinderView
  cards by dex number      JSON-level dedup,     filters, dedupes,         BinderCalculator
  sets                     retry on 429/5xx)     sorts, passes to UI       VariantStatistics
  variant expansion                                                        CameoBrowser
                                                                           SavedSetlists
cameoData.ts (generated)                                                   CardPreview
  345 cameo appearances                                                    Footer
  from data/cameos.csv                                                     ThemeToggle
```

## Data Flow

1. User configures master set type, Pokemon/sets, variant filters, sort order in SetBuilder
2. App.tsx useEffect triggers on any config change
3. fetchCardsForPokemon (by dex number) or fetchCardsForSet fetches from TCG API via scheduledFetchJson
4. mapTCGCardToCards expands cards with multiple TCGPlayer price types into separate entries
5. deduplicateCards removes duplicate card IDs
6. Variant filters applied (switch on card.variant)
7. uniqueArtOnly collapses variants by stripping price-type suffix from card ID
8. Sort applied (sync for most modes, async for evolution-chain and grouped-by-pokemon)
9. Result array passed to Checklist, BinderView, VariantStatistics as props

## Key Files

### Data Layer
- **src/lib/pokemonTcgApi.ts** -- TCG API integration. mapTCGCardToCards is the core mapping function. fetchAllPages handles pagination (totalCount/pageSize). CARD_CACHE_VERSION must be bumped when mapping output shape changes.
- **src/lib/pokeApi.ts** -- PokeAPI integration. Species index for autocomplete, evolution chains. formatDisplayName handles special Pokemon names (Mr. Mime, Ho-Oh, Nidoran, Tapu Koko, etc).
- **src/lib/apiCache.ts** -- IndexedDB cache with TTL. DB_VERSION bump wipes all caches. Falls back to in-memory Map.
- **src/lib/requestScheduler.ts** -- Concurrency (max 2), 429 retry with backoff, JSON-level request dedup via scheduledFetchJson. Use scheduledFetchJson for all API calls, not raw fetch.
- **src/lib/cameoData.ts** -- AUTO-GENERATED. Do not edit. Run npm run import-cameos to regenerate from data/cameos.csv.
- **src/lib/cardUtils.ts** -- Sorting (6 modes), card number parsing, variant labels. Evolution chain sorts are async.
- **src/lib/shareUrl.ts** -- Share URL encode/decode. PUBLIC CONTRACT -- see forward-compatibility rules in the doc comment.
- **src/lib/exportUtils.ts** -- PDF checklist, proxy placeholders (with grayscale images), CSV export, print.
- **src/lib/types.ts** -- All domain types: PokemonCard, PokemonSet, CardVariant, SortOrder, MasterSetType, VariantFilters, etc.

### State
- **src/hooks/useKV.ts** -- localStorage persistence hook. pokomplete: key prefix, useSyncExternalStore for cross-component sync, cross-tab sync via storage event. Values memoized by raw JSON string to prevent infinite re-render loops.

### Components
- **src/App.tsx** -- Orchestrator. Config state (useKV), card fetching (useEffect), share URL parsing, tab layout.
- **src/components/SetBuilder.tsx** -- Master set type selector, variant filters, unique art toggle, sort order, Pokemon/set selector.
- **src/components/PokemonSelector.tsx** -- Debounced search via PokeAPI species index, inline evolution chain chips.
- **src/components/Checklist.tsx** -- List view + gallery view toggle, checkboxes, condition pricing, sort, export menu.
- **src/components/BinderView.tsx** -- 9-pocket page grid, page navigation, checked/unchecked visual states.
- **src/components/CameoBrowser.tsx** -- Browse cameo database, search, stats.

## Critical Conventions

**All API calls must use scheduledFetchJson from requestScheduler.ts**, not raw fetch(). This ensures rate-limit handling, concurrency control, and request deduplication.

**Cache responses via cacheGet/cacheSet** with TTLs: CACHE_TTL.POKE_API (30 days), CACHE_TTL.TCG_SETS (1 day), CACHE_TTL.TCG_CARDS (1 hour).

**Bump CARD_CACHE_VERSION** in pokemonTcgApi.ts when changing the output shape of mapTCGCardToCards. This invalidates stale cached card data without requiring a DB version bump.

**Share URLs are a public contract** (src/lib/shareUrl.ts). Never rename existing params or values. Unknown params/values must be ignored or fall back gracefully. Omitting variants param means all enabled (forward-compatible for new variant types). Bump the v param only for breaking changes. See the doc comment for the full spec.

**src/lib/cameoData.ts is auto-generated** from data/cameos.csv. Never edit directly. Run npm run import-cameos after CSV changes.

**Theming** uses CSS variables in src/index.css toggled by .dark class (next-themes ThemeProvider with attribute=class). Do NOT use @media (prefers-color-scheme) for theme variables.

**useKV values must be memoized** -- the hook returns parsed JSON which creates new object refs each render. useMemo on rawValue prevents infinite re-render loops in useEffect dependencies.

**UI components** use Radix primitives from src/components/ui/ (shadcn), Phosphor icons (@phosphor-icons/react), and Tailwind. 44px minimum touch targets for mobile.

## PR Workflow

1. Branch from main
2. Make changes
3. Verify: npm run typecheck && npm run lint && npm run build
4. Commit with Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
5. Push branch, create PR targeting main
6. CI must pass (lint + typecheck + build)
7. 1 review required
8. Squash merge only (linear history)
