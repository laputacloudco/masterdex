import type { PokemonCard, PokemonSet, CardVariant } from './types';

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
  
  if (name.includes('promo') || rarity.includes('promo')) return 'promo';
  if (name.includes('tournament') || rarity.includes('tournament')) return 'tournament';
  if (rarity.includes('reverse')) return 'reverse-holo';
  if (rarity.includes('holo') || rarity.includes('rainbow') || rarity.includes('secret')) return 'holo';
  
  return 'normal';
}

function isHoloCard(card: TCGCard): boolean {
  const rarity = card.rarity?.toLowerCase() || '';
  return rarity.includes('holo') || rarity.includes('rainbow') || rarity.includes('secret') || rarity.includes('ultra');
}

export function mapTCGCardToCard(tcgCard: TCGCard): PokemonCard {
  const pokemonName = tcgCard.name.split(' ')[0];
  
  return {
    id: tcgCard.id,
    name: tcgCard.name,
    pokemonName,
    setName: tcgCard.set.name,
    setCode: tcgCard.set.id,
    setNumber: `${tcgCard.number}/${tcgCard.set.printedTotal || tcgCard.set.total}`,
    releaseDate: tcgCard.set.releaseDate,
    variant: mapVariant(tcgCard),
    rarity: tcgCard.rarity || 'Common',
    isHolo: isHoloCard(tcgCard),
    imageUrl: tcgCard.images.small,
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

export async function fetchAllSets(): Promise<PokemonSet[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sets?orderBy=releaseDate`);
    if (!response.ok) throw new Error('Failed to fetch sets');
    
    const data = await response.json();
    return data.data.map(mapTCGSetToSet);
  } catch (error) {
    console.error('Error fetching sets:', error);
    throw error;
  }
}

export async function fetchCardsForSet(setId: string): Promise<PokemonCard[]> {
  try {
    let allCards: TCGCard[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response = await fetch(
        `${API_BASE_URL}/cards?q=set.id:${setId}&page=${page}&pageSize=250&orderBy=number`
      );
      
      if (!response.ok) throw new Error('Failed to fetch cards');
      
      const data = await response.json();
      allCards = allCards.concat(data.data);
      
      hasMore = data.page < data.totalPages;
      page++;
    }
    
    return allCards.map(mapTCGCardToCard);
  } catch (error) {
    console.error('Error fetching cards for set:', error);
    throw error;
  }
}

export async function fetchCardsForPokemon(pokemonName: string): Promise<PokemonCard[]> {
  try {
    let allCards: TCGCard[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response = await fetch(
        `${API_BASE_URL}/cards?q=name:"${pokemonName}*"&page=${page}&pageSize=250&orderBy=set.releaseDate`
      );
      
      if (!response.ok) throw new Error('Failed to fetch cards');
      
      const data = await response.json();
      allCards = allCards.concat(data.data);
      
      hasMore = data.page < data.totalPages;
      page++;
      
      if (page > 10) break;
    }
    
    return allCards
      .filter(card => {
        const cardPokemonName = card.name.split(' ')[0].toLowerCase();
        return cardPokemonName === pokemonName.toLowerCase();
      })
      .map(mapTCGCardToCard);
  } catch (error) {
    console.error('Error fetching cards for pokemon:', error);
    throw error;
  }
}

export async function searchPokemon(query: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cards?q=name:"${query}*"&pageSize=250`
    );
    
    if (!response.ok) throw new Error('Failed to search Pokemon');
    
    const data = await response.json();
    const pokemonNames = new Set<string>();
    
    data.data.forEach((card: TCGCard) => {
      const name = card.name.split(' ')[0];
      if (name && card.supertype === 'Pokémon') {
        pokemonNames.add(name);
      }
    });
    
    return Array.from(pokemonNames).sort();
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    return [];
  }
}
