import type { PokemonCard, PokemonSet, CardVariant } from './types';
import { getCameoCardsForPokemon, type CameoEntry } from './cameoData';
import { cacheGet, cacheSet, CACHE_TTL } from './apiCache';
import { scheduledFetch } from './requestScheduler';
import { getDexNumber, getSpecies, searchSpecies } from './pokeApi';

const API_BASE_URL = 'https://api.pokemontcg.io/v2';

export interface TCGCard {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  set: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    releaseDate: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number: string;
  artist?: string;
  rarity?: string;
  nationalPokedexNumbers?: number[];
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    prices?: Record<string, { low?: number; mid?: number; high?: number; market?: number }>;
  };
}

export interface TCGSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
  images: {
    symbol: string;
    logo: string;
  };
}

function mapVariant(card: TCGCard): CardVariant {
  const name = card.name.toLowerCase();
  const rarity = card.rarity?.toLowerCase() || '';
  const subtypes = card.subtypes?.map(s => s.toLowerCase()) || [];
  
  if (name.includes('mcdonald') || name.includes('gamestop') || subtypes.includes('special')) {
    return 'collab';
  }
  if (name.includes('promo') || rarity.includes('promo') || card.set.series.toLowerCase().includes('promo')) {
    return 'promo';
  }
  if (name.includes('tournament') || rarity.includes('tournament')) {
    return 'tournament';
  }
  if (rarity.includes('rainbow') || rarity.includes('hyper rare')) {
    return 'rainbow-rare';
  }
  if (rarity.includes('secret') || parseInt(card.number) > (card.set.printedTotal || card.set.total)) {
    return 'secret-rare';
  }
  if (rarity.includes('ultra rare') || rarity.includes('full art') || rarity.includes('illustration rare') || rarity.includes('special art')) {
    return 'full-art';
  }
  if (rarity.includes('gold') || rarity.includes('golden')) {
    return 'gold';
  }
  if (rarity.includes('reverse')) {
    return 'reverse-holo';
  }
  if (rarity.includes('holo')) {
    return 'holo';
  }
  
  return 'normal';
}

function isHoloCard(card: TCGCard): boolean {
  const rarity = card.rarity?.toLowerCase() || '';
  return rarity.includes('holo') || rarity.includes('rainbow') || rarity.includes('secret') || rarity.includes('ultra');
}

/**
 * Map a TCG API card to our app's PokemonCard type.
 * Uses nationalPokedexNumbers to determine the Pokemon name via PokeAPI
 * instead of unreliable name.split(' ')[0] parsing.
 */
export async function mapTCGCardToCard(tcgCard: TCGCard, pokemonDisplayName?: string): Promise<PokemonCard> {
  // Determine Pokemon name from dex number or fallback
  let resolvedName = pokemonDisplayName || tcgCard.name;
  if (!pokemonDisplayName && tcgCard.nationalPokedexNumbers?.length) {
    const species = await getSpecies(tcgCard.nationalPokedexNumbers[0]);
    if (species) resolvedName = species.displayName;
  }

  let marketPrice: number | undefined;
  if (tcgCard.tcgplayer?.prices) {
    const priceTypes = Object.values(tcgCard.tcgplayer.prices);
    if (priceTypes.length > 0) {
      marketPrice = priceTypes[0].market || priceTypes[0].mid;
    }
  }
  
  return {
    id: tcgCard.id,
    name: tcgCard.name,
    pokemonName: resolvedName,
    setName: tcgCard.set.name,
    setCode: tcgCard.set.id,
    setNumber: `${tcgCard.number}/${tcgCard.set.printedTotal || tcgCard.set.total}`,
    releaseDate: tcgCard.set.releaseDate,
    variant: mapVariant(tcgCard),
    rarity: tcgCard.rarity || 'Common',
    isHolo: isHoloCard(tcgCard),
    imageUrl: tcgCard.images.small,
    largeImageUrl: tcgCard.images.large,
    marketPrice,
    tcgPlayerUrl: tcgCard.tcgplayer?.url,
  };
}

export function mapTCGSetToSet(tcgSet: TCGSet): PokemonSet {
  return {
    code: tcgSet.id,
    name: tcgSet.name,
    releaseDate: tcgSet.releaseDate,
    totalCards: tcgSet.total,
  };
}

/**
 * Paginate through all pages of a TCG API query.
 */
async function fetchAllPages(baseUrl: string): Promise<TCGCard[]> {
  let allCards: TCGCard[] = [];
  let page = 1;

  while (true) {
    const url = `${baseUrl}&page=${page}&pageSize=250`;
    const response = await scheduledFetch(url);
    const data = await response.json();
    allCards = allCards.concat(data.data || []);

    if (!data.totalPages || page >= data.totalPages) break;
    page++;
  }

  return allCards;
}

export async function fetchAllSets(): Promise<PokemonSet[]> {
  const cacheKey = 'tcg:all-sets';
  const cached = await cacheGet<PokemonSet[]>(cacheKey);
  if (cached) return cached;

  const response = await scheduledFetch(`${API_BASE_URL}/sets?orderBy=releaseDate`);
  const data = await response.json();
  const sets = (data.data as TCGSet[]).map(mapTCGSetToSet);

  await cacheSet(cacheKey, sets, CACHE_TTL.TCG_SETS);
  return sets;
}

export async function fetchCardsForSet(setId: string): Promise<PokemonCard[]> {
  const cacheKey = `tcg:set-cards:${setId}`;
  const cached = await cacheGet<PokemonCard[]>(cacheKey);
  if (cached) return cached;

  const tcgCards = await fetchAllPages(
    `${API_BASE_URL}/cards?q=set.id:${setId}&orderBy=number`
  );
  const cards = await Promise.all(tcgCards.map(c => mapTCGCardToCard(c)));

  await cacheSet(cacheKey, cards, CACHE_TTL.TCG_CARDS);
  return cards;
}

/**
 * Fetch all cards for a Pokemon by national dex number.
 * This catches ALL variants regardless of name format:
 * "Pikachu", "Pikachu V", "Detective Pikachu", "Marnie's Pikachu", etc.
 */
export async function fetchCardsForPokemon(pokemonName: string, includeCameos: boolean = false): Promise<PokemonCard[]> {
  const dexNum = await getDexNumber(pokemonName);
  if (!dexNum) {
    console.warn(`No dex number found for "${pokemonName}"`);
    return [];
  }

  const species = await getSpecies(dexNum);
  const displayName = species?.displayName || pokemonName;

  const cacheKey = `tcg:pokemon-cards:${dexNum}`;
  let cards: PokemonCard[];

  const cached = await cacheGet<PokemonCard[]>(cacheKey);
  if (cached) {
    cards = cached;
  } else {
    const tcgCards = await fetchAllPages(
      `${API_BASE_URL}/cards?q=nationalPokedexNumbers:${dexNum}&orderBy=set.releaseDate`
    );
    cards = await Promise.all(tcgCards.map(c => mapTCGCardToCard(c, displayName)));
    await cacheSet(cacheKey, cards, CACHE_TTL.TCG_CARDS);
  }

  if (includeCameos) {
    const cameoEntries = getCameoCardsForPokemon(pokemonName);
    const cameoCards = await fetchCameoCards(cameoEntries);
    return [...cards, ...cameoCards];
  }

  return cards;
}

async function fetchCameoCards(cameoEntries: CameoEntry[]): Promise<PokemonCard[]> {
  const cameoCards: PokemonCard[] = [];
  
  for (const entry of cameoEntries) {
    try {
      const response = await scheduledFetch(`${API_BASE_URL}/cards/${entry.cardId}`);
      const data = await response.json();
      const card = await mapTCGCardToCard(data.data);
      card.variant = 'cameo';
      cameoCards.push(card);
    } catch (error) {
      console.warn(`Failed to fetch cameo card ${entry.cardId}:`, error);
    }
  }
  
  return cameoCards;
}

/**
 * Search Pokemon names using the PokeAPI species index.
 * Returns display names of matching species.
 */
export async function searchPokemon(query: string): Promise<string[]> {
  if (!query || query.length < 2) return [];

  const species = await searchSpecies(query);
  return species.map(s => s.displayName);
}

/**
 * Deduplicate cards by ID after merging results from multiple sources.
 */
export function deduplicateCards(cards: PokemonCard[]): PokemonCard[] {
  const seen = new Map<string, PokemonCard>();
  for (const card of cards) {
    if (!seen.has(card.id)) {
      seen.set(card.id, card);
    }
  }
  return Array.from(seen.values());
}
