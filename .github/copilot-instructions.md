# Copilot Instructions for Pokomplete

## Commands

```bash
npm run dev          # Start dev server
npm run build        # tsc -b --noCheck && vite build
npm run typecheck    # tsc -b (strict type checking)
npm run lint         # eslint
npm run import-cameos # Regenerate src/lib/cameoData.ts from data/cameos.csv
```

No test framework is configured.

## Architecture

```
API Layer                Cache Layer           App State              UI
─────────────────        ─────────────         ──────────             ──────────────
pokeApi.ts          ──►  apiCache.ts           useKV hook       ──►  SetBuilder
  species index          (IndexedDB + TTL)     (localStorage)        PokemonSelector
  evolution chains       in-memory fallback                          Checklist
                                                                     CameoBrowser
pokemonTcgApi.ts    ──►  requestScheduler.ts   App.tsx orchestrates
  cards by dex #         (max 2 concurrent,    fetch → filter →
  sets                    dedup, retry 429)    sort → render
```

**Data flows through `App.tsx`**: persistent config (useKV) drives a `useEffect` that fetches cards, applies variant filters, deduplicates, sorts, then passes the result array to child components. Children are presentational — they don't fetch data.

**Card lookup uses `nationalPokedexNumbers`**, not card name parsing. This correctly handles trainer-owned Pokemon ("Marnie's Grimmsnarl" → dex #861 = Grimmsnarl), multi-word names (Mr. Mime, Tapu Koko), and regional forms.

**Evolution chains come from PokeAPI** (not hardcoded). `pokeApi.ts` maintains a cached species index (~1025 entries) for autocomplete and resolves chains including branches (Eevee → 8 eeveelutions).

## Key Conventions

**`src/lib/cameoData.ts` is auto-generated** — do not edit manually. Source of truth is `data/cameos.csv`. Run `npm run import-cameos` after changing the CSV.

**`useKV` hook** (`src/hooks/useKV.ts`) replaces what was originally `@github/spark/hooks`. It's localStorage-backed with a `pokomplete:` key prefix, uses `useSyncExternalStore` for cross-component sync, and supports cross-tab sync via the `storage` event. Values are memoized by raw JSON string to prevent infinite re-render loops from new object references.

**Theming** uses CSS variables in `src/index.css` toggled by a `.dark` class (via `next-themes` ThemeProvider with `attribute="class"`). Do not use `@media (prefers-color-scheme)` for theme variables — the class-based toggle won't work.

**All external API calls** must go through `scheduledFetch()` from `requestScheduler.ts`, not raw `fetch()`. This ensures rate-limit handling, concurrency control, and request deduplication.

**API responses should be cached** via `cacheGet`/`cacheSet` from `apiCache.ts` with appropriate TTLs: `CACHE_TTL.POKE_API` (30 days), `CACHE_TTL.TCG_SETS` (1 day), `CACHE_TTL.TCG_CARDS` (1 hour).

**Share URLs are a public contract** (`src/lib/shareUrl.ts`). The query parameter format must remain forward-compatible. Rules: never rename existing params or values, unknown params/values must be ignored or fall back gracefully, omitting `variants` means all enabled (so new variant types auto-include for old URLs). See the doc comment in `shareUrl.ts` for the full contract. Bump the `v` param only for breaking changes.

**UI components** use Radix primitives from `src/components/ui/` (shadcn pattern), Phosphor icons (`@phosphor-icons/react`), and Tailwind utility classes. Domain types live in `src/lib/types.ts`.
