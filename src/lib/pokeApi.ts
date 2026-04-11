import { cacheGet, cacheSet, CACHE_TTL } from './apiCache';
import { scheduledFetch } from './requestScheduler';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

export interface PokeSpecies {
  id: number;        // national dex number
  name: string;      // API slug (e.g. "mr-mime")
  displayName: string; // English name (e.g. "Mr. Mime")
}

interface PokeApiSpeciesListItem {
  name: string;
  url: string;
}

interface PokeApiSpeciesDetail {
  id: number;
  name: string;
  names: { name: string; language: { name: string } }[];
  evolution_chain: { url: string };
}

interface PokeApiChainLink {
  species: { name: string; url: string };
  evolves_to: PokeApiChainLink[];
}

// Full species index: slug → PokeSpecies
let speciesIndex: Map<string, PokeSpecies> | null = null;
// Display name → slug lookup (case-insensitive)
let displayNameIndex: Map<string, string> | null = null;

function extractDexNumber(url: string): number {
  return parseInt(url.replace(/\/$/, '').split('/').pop()!, 10);
}

/**
 * Load the full species list (~1025 entries) from PokeAPI.
 * Cached for 30 days. Used for autocomplete and slug lookups.
 */
export async function loadSpeciesIndex(): Promise<Map<string, PokeSpecies>> {
  if (speciesIndex) return speciesIndex;

  const cacheKey = 'pokeapi:species-index';
  const cached = await cacheGet<PokeSpecies[]>(cacheKey);
  if (cached) {
    speciesIndex = new Map(cached.map(s => [s.name, s]));
    displayNameIndex = new Map(cached.map(s => [s.displayName.toLowerCase(), s.name]));
    return speciesIndex;
  }

  const response = await scheduledFetch(`${POKEAPI_BASE}/pokemon-species?limit=2000`);
  const data = await response.json();
  const list: PokeApiSpeciesListItem[] = data.results;

  // Build index from the list (we get slug + dex number from the URL)
  const species: PokeSpecies[] = list.map(item => ({
    id: extractDexNumber(item.url),
    name: item.name,
    displayName: formatDisplayName(item.name),
  }));

  await cacheSet(cacheKey, species, CACHE_TTL.POKE_API);

  speciesIndex = new Map(species.map(s => [s.name, s]));
  displayNameIndex = new Map(species.map(s => [s.displayName.toLowerCase(), s.name]));
  return speciesIndex;
}

/**
 * Convert API slug to display name.
 * Handles: mr-mime → Mr. Mime, ho-oh → Ho-Oh, farfetchd → Farfetch'd, etc.
 */
function formatDisplayName(slug: string): string {
  const specialNames: Record<string, string> = {
    'mr-mime': 'Mr. Mime',
    'mr-rime': 'Mr. Rime',
    'mime-jr': 'Mime Jr.',
    'nidoran-f': 'Nidoran♀',
    'nidoran-m': 'Nidoran♂',
    'farfetchd': "Farfetch'd",
    'sirfetchd': "Sirfetch'd",
    'ho-oh': 'Ho-Oh',
    'porygon-z': 'Porygon-Z',
    'type-null': 'Type: Null',
    'tapu-koko': 'Tapu Koko',
    'tapu-lele': 'Tapu Lele',
    'tapu-bulu': 'Tapu Bulu',
    'tapu-fini': 'Tapu Fini',
    'jangmo-o': 'Jangmo-o',
    'hakamo-o': 'Hakamo-o',
    'kommo-o': 'Kommo-o',
    'flabebe': 'Flabébé',
    'great-tusk': 'Great Tusk',
    'scream-tail': 'Scream Tail',
    'brute-bonnet': 'Brute Bonnet',
    'flutter-mane': 'Flutter Mane',
    'slither-wing': 'Slither Wing',
    'sandy-shocks': 'Sandy Shocks',
    'iron-treads': 'Iron Treads',
    'iron-bundle': 'Iron Bundle',
    'iron-hands': 'Iron Hands',
    'iron-jugulis': 'Iron Jugulis',
    'iron-moth': 'Iron Moth',
    'iron-thorns': 'Iron Thorns',
    'iron-valiant': 'Iron Valiant',
    'iron-leaves': 'Iron Leaves',
    'iron-boulder': 'Iron Boulder',
    'iron-crown': 'Iron Crown',
    'roaring-moon': 'Roaring Moon',
    'walking-wake': 'Walking Wake',
    'raging-bolt': 'Raging Bolt',
    'gouging-fire': 'Gouging Fire',
    'chi-yu': 'Chi-Yu',
    'chien-pao': 'Chien-Pao',
    'ting-lu': 'Ting-Lu',
    'wo-chien': 'Wo-Chien',
    'omo-kashi-no-kami': 'Ogerpon',
  };

  if (specialNames[slug]) return specialNames[slug];

  // Default: capitalize each word, preserve hyphens that are part of the name
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Search species by name prefix. Returns matching display names.
 */
export async function searchSpecies(query: string): Promise<PokeSpecies[]> {
  const index = await loadSpeciesIndex();
  const q = query.toLowerCase();
  const results: PokeSpecies[] = [];

  for (const species of index.values()) {
    if (
      species.displayName.toLowerCase().startsWith(q) ||
      species.name.startsWith(q)
    ) {
      results.push(species);
    }
  }

  return results.sort((a, b) => a.id - b.id);
}

/**
 * Get species by display name, slug, or dex number.
 */
export async function getSpecies(nameOrId: string | number): Promise<PokeSpecies | undefined> {
  const index = await loadSpeciesIndex();

  if (typeof nameOrId === 'number') {
    for (const s of index.values()) {
      if (s.id === nameOrId) return s;
    }
    return undefined;
  }

  const slug = nameOrId.toLowerCase();
  // Try direct slug match
  if (index.has(slug)) return index.get(slug);

  // Try display name lookup
  const resolvedSlug = displayNameIndex?.get(slug);
  if (resolvedSlug) return index.get(resolvedSlug);

  // Try fuzzy: strip special chars and match
  for (const species of index.values()) {
    if (species.displayName.toLowerCase() === slug) return species;
  }

  return undefined;
}

/**
 * Get the full evolution chain for a Pokemon, including all branches.
 * Returns arrays of species in evolution order. Branches (like Eevee)
 * return all evolutions at each stage.
 */
export async function getEvolutionChain(pokemonName: string): Promise<string[]> {
  const species = await getSpecies(pokemonName);
  if (!species) return [pokemonName];

  const cacheKey = `pokeapi:evo-chain:${species.name}`;
  const cached = await cacheGet<string[]>(cacheKey);
  if (cached) return cached;

  try {
    // Fetch species detail to get evolution chain URL
    const speciesResponse = await scheduledFetch(
      `${POKEAPI_BASE}/pokemon-species/${species.id}/`
    );
    const speciesData: PokeApiSpeciesDetail = await speciesResponse.json();
    const chainUrl = speciesData.evolution_chain.url;

    // Fetch the evolution chain
    const chainResponse = await scheduledFetch(chainUrl);
    const chainData = await chainResponse.json();

    // Walk the chain and collect all species in order
    const chain = flattenChain(chainData.chain);
    const displayNames = await Promise.all(
      chain.map(async (slug) => {
        const s = await getSpecies(slug);
        return s?.displayName || slug;
      })
    );

    await cacheSet(cacheKey, displayNames, CACHE_TTL.POKE_API);
    return displayNames;
  } catch (error) {
    console.error('Failed to fetch evolution chain:', error);
    return [species.displayName];
  }
}

/**
 * Flatten an evolution chain tree into a list.
 * For branched evolutions (Eevee), includes all branches.
 */
function flattenChain(link: PokeApiChainLink): string[] {
  const result: string[] = [link.species.name];
  for (const evo of link.evolves_to) {
    result.push(...flattenChain(evo));
  }
  return result;
}

/**
 * Get the dex number for a Pokemon by display name.
 */
export async function getDexNumber(pokemonName: string): Promise<number | undefined> {
  const species = await getSpecies(pokemonName);
  return species?.id;
}
