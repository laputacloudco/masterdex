import type { PokemonCard, PokemonSet, CardVariant } from './types';
import { getCameoCardsForPokemon, type CameoEntry } from './cameoData';
import { cacheGet, cacheSet, CACHE_TTL } from './apiCache';
import { scheduledFetchJson } from './requestScheduler';
import { getDexNumber, getSpecies, searchSpecies } from './pokeApi';

const API_BASE_URL = 'https://api.pokemontcg.io/v2';

// Bump when mapTCGCardToCards output shape changes to invalidate cached results
const CARD_CACHE_VERSION = 2;

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
 * Map a TCG API card's price type key to our CardVariant type.
 */
function priceTypeToVariant(priceType: string): CardVariant {
  switch (priceType) {
    case 'reverseHolofoil': return 'reverse-holo';
    case 'holofoil': return 'holo';
    case '1stEditionHolofoil': return 'holo';
    case '1stEditionNormal': return 'normal';
    case 'unlimitedHolofoil': return 'holo';
    case 'normal': return 'normal';
    default: return 'normal';
  }
}

function priceTypeLabel(priceType: string): string {
  switch (priceType) {
    case 'reverseHolofoil': return 'Reverse Holo';
    case 'holofoil': return 'Holo';
    case '1stEditionHolofoil': return '1st Edition Holo';
    case '1stEditionNormal': return '1st Edition';
    case 'unlimitedHolofoil': return 'Unlimited Holo';
    case 'normal': return 'Normal';
    default: return priceType;
  }
}

/**
 * Map a TCG API card to one or more PokemonCard entries.
 * Expands cards with multiple TCGPlayer price types (e.g., normal + reverseHolofoil)
 * into separate checklist entries so collectors can track each variant independently.
 */
export async function mapTCGCardToCards(tcgCard: TCGCard, pokemonDisplayName?: string): Promise<PokemonCard[]> {
  let resolvedName = pokemonDisplayName || tcgCard.name;
  if (!pokemonDisplayName && tcgCard.nationalPokedexNumbers?.length) {
    const species = await getSpecies(tcgCard.nationalPokedexNumbers[0]);
    if (species) resolvedName = species.displayName;
  }

  const tcgPriceTypes = tcgCard.tcgplayer?.prices
    ? Object.entries(tcgCard.tcgplayer.prices)
    : [];

  // If no price data or only one variant, return a single card
  if (tcgPriceTypes.length <= 1) {
    const priceData = tcgPriceTypes[0]?.[1];
    return [{
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
      marketPrice: priceData?.market ?? priceData?.mid,
      prices: priceData ? { low: priceData.low, mid: priceData.mid, market: priceData.market, high: priceData.high } : undefined,
      tcgPlayerUrl: tcgCard.tcgplayer?.url,
    }];
  }

  // Expand into one entry per price type variant.
  // Preserve the semantic variant from mapVariant() (promo, collab, etc.)
  // and layer on the physical variant (holo/reverse-holo) as artVariant.
  const baseVariant = mapVariant(tcgCard);

  return tcgPriceTypes.map(([priceType, priceData]) => {
    const physicalVariant = priceTypeToVariant(priceType);
    // Use the semantic variant (promo, collab, etc.) if it's more specific than normal/holo.
    // Only use the physical variant when the card is otherwise just normal/holo.
    const variant = (baseVariant !== 'normal' && baseVariant !== 'holo')
      ? baseVariant
      : physicalVariant;

    return {
      id: `${tcgCard.id}-${priceType}`,
      name: tcgCard.name,
      pokemonName: resolvedName,
      setName: tcgCard.set.name,
      setCode: tcgCard.set.id,
      setNumber: `${tcgCard.number}/${tcgCard.set.printedTotal || tcgCard.set.total}`,
      releaseDate: tcgCard.set.releaseDate,
      variant,
      artVariant: priceTypeLabel(priceType),
      rarity: tcgCard.rarity || 'Common',
      isHolo: priceType !== 'normal' && priceType !== '1stEditionNormal',
      imageUrl: tcgCard.images.small,
      largeImageUrl: tcgCard.images.large,
      marketPrice: priceData?.market ?? priceData?.mid,
      prices: { low: priceData?.low, mid: priceData?.mid, market: priceData?.market, high: priceData?.high },
      tcgPlayerUrl: tcgCard.tcgplayer?.url,
    };
  });
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
    const json = await scheduledFetchJson<{ data?: TCGCard[]; totalCount?: number; pageSize?: number }>(url);
    const cards = json.data || [];
    allCards = allCards.concat(cards);

    const totalCount = json.totalCount || 0;
    const pageSize = json.pageSize || 250;
    const totalPages = Math.ceil(totalCount / pageSize);
    if (page >= totalPages) break;
    page++;
  }

  return allCards;
}

export async function fetchAllSets(): Promise<PokemonSet[]> {
  const cacheKey = 'tcg:all-sets';
  const cached = await cacheGet<PokemonSet[]>(cacheKey);
  if (cached) return cached;

  const data = await scheduledFetchJson<{ data: TCGSet[] }>(`${API_BASE_URL}/sets?orderBy=releaseDate`);
  const sets = (data.data as TCGSet[]).map(mapTCGSetToSet);

  await cacheSet(cacheKey, sets, CACHE_TTL.TCG_SETS);
  return sets;
}

export async function fetchCardsForSet(setId: string): Promise<PokemonCard[]> {
  const cacheKey = `tcg:v${CARD_CACHE_VERSION}:set-cards:${setId}`;
  const cached = await cacheGet<PokemonCard[]>(cacheKey);
  if (cached) return cached;

  const tcgCards = await fetchAllPages(
    `${API_BASE_URL}/cards?q=set.id:${setId}&orderBy=number`
  );
  const cardArrays = await Promise.all(tcgCards.map(c => mapTCGCardToCards(c)));
  const cards = cardArrays.flat();

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

  const cacheKey = `tcg:v${CARD_CACHE_VERSION}:pokemon-cards:${dexNum}`;
  let cards: PokemonCard[];

  const cached = await cacheGet<PokemonCard[]>(cacheKey);
  if (cached) {
    cards = cached;
  } else {
    const tcgCards = await fetchAllPages(
      `${API_BASE_URL}/cards?q=nationalPokedexNumbers:${dexNum}&orderBy=set.releaseDate`
    );
    const cardArrays = await Promise.all(tcgCards.map(c => mapTCGCardToCards(c, displayName)));
    cards = cardArrays.flat();
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
      // Cameo entries from the spreadsheet lack cardId — search by name + set
      if (!entry.cardId) {
        const query = entry.setName
          ? `name:"${entry.cardName}" set.name:"${entry.setName}"`
          : `name:"${entry.cardName}"`;
        const url = `${API_BASE_URL}/cards?q=${encodeURIComponent(query)}&pageSize=1`;
        const data = await scheduledFetchJson<{ data?: TCGCard[] }>(url);
        if (data.data?.length) {
          const cards = await mapTCGCardToCards(data.data[0]);
          if (cards.length > 0) {
            cards[0].variant = 'cameo';
            cameoCards.push(cards[0]);
          }
        }
        continue;
      }

      const data = await scheduledFetchJson<{ data?: TCGCard }>(
        `${API_BASE_URL}/cards/${entry.cardId}`
      );
      if (!data.data?.set) continue;
      const cards = await mapTCGCardToCards(data.data);
      if (cards.length > 0) {
        cards[0].variant = 'cameo';
        cameoCards.push(cards[0]);
      }
    } catch (error) {
      console.warn(`Failed to fetch cameo card "${entry.cardName}":`, error);
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
