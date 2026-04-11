import type { PokemonCard, SortOrder } from './types';
import { getEvolutionChain } from './pokeApi';

/**
 * Parse a card number for sorting. Handles numeric, alphanumeric,
 * and promo-style numbers (e.g., "SWSH120", "TG15", "GG01").
 */
function parseCardNumber(setNumber: string): { numeric: number; raw: string } {
  const num = setNumber.split('/')[0].trim();
  const parsed = parseInt(num, 10);
  return { numeric: isNaN(parsed) ? Infinity : parsed, raw: num };
}

function compareCardNumbers(a: PokemonCard, b: PokemonCard): number {
  const aNum = parseCardNumber(a.setNumber);
  const bNum = parseCardNumber(b.setNumber);
  if (aNum.numeric !== bNum.numeric) return aNum.numeric - bNum.numeric;
  return aNum.raw.localeCompare(bNum.raw);
}

export function sortCards(cards: PokemonCard[], sortOrder: SortOrder): PokemonCard[] {
  const sorted = [...cards];
  
  switch (sortOrder) {
    case 'set-order':
      return sorted.sort((a, b) => {
        if (a.setCode !== b.setCode) return a.setCode.localeCompare(b.setCode);
        return compareCardNumbers(a, b);
      });
      
    case 'chronological':
      return sorted.sort((a, b) => {
        const dateCompare = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        if (dateCompare !== 0) return dateCompare;
        return compareCardNumbers(a, b);
      });
      
    case 'grouped-by-set':
      return sorted.sort((a, b) => {
        const dateCompare = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        if (dateCompare !== 0) return dateCompare;
        if (a.setCode !== b.setCode) return a.setCode.localeCompare(b.setCode);
        if (a.pokemonName !== b.pokemonName) return a.pokemonName.localeCompare(b.pokemonName);
        return compareCardNumbers(a, b);
      });
      
    case 'evolution-chain':
    case 'grouped-by-pokemon':
      // Both require async evo chain lookup — caller must use the async variants
      return sorted;
      
    default:
      return sorted;
  }
}

/**
 * Sort cards by evolution chain order (async — requires PokeAPI lookup).
 * Groups cards by set date, then orders within each set by evolution position.
 */
export async function sortByEvolutionChainAsync(
  cards: PokemonCard[],
  selectedPokemon: string[]
): Promise<PokemonCard[]> {
  if (selectedPokemon.length === 0) return cards;

  // Build a set of all chains for selected Pokemon
  const chainOrderMap = new Map<string, number>();
  for (const pokemon of selectedPokemon) {
    const chain = await getEvolutionChain(pokemon);
    chain.forEach((name, index) => {
      if (!chainOrderMap.has(name.toLowerCase())) {
        chainOrderMap.set(name.toLowerCase(), index);
      }
    });
  }

  // Group cards by set
  const groupedBySets = new Map<string, PokemonCard[]>();
  cards.forEach(card => {
    if (!groupedBySets.has(card.setCode)) {
      groupedBySets.set(card.setCode, []);
    }
    groupedBySets.get(card.setCode)!.push(card);
  });
  
  // Sort sets by release date
  const setsByDate = Array.from(groupedBySets.entries()).sort((a, b) => {
    const dateA = a[1][0]?.releaseDate || '';
    const dateB = b[1][0]?.releaseDate || '';
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  const result: PokemonCard[] = [];
  for (const [, setCards] of setsByDate) {
    // Sort within each set by evolution chain position, then card number
    const sorted = [...setCards].sort((a, b) => {
      const aOrder = chainOrderMap.get(a.pokemonName.toLowerCase()) ?? Infinity;
      const bOrder = chainOrderMap.get(b.pokemonName.toLowerCase()) ?? Infinity;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return compareCardNumbers(a, b);
    });
    result.push(...sorted);
  }

  return result;
}

/**
 * Sort cards grouped by Pokemon in evolution order.
 * All Mareep cards in set order, then all Flaaffy in set order, then all Ampharos.
 * Pokemon ordering follows evolution chain position.
 */
export async function sortGroupedByPokemonAsync(
  cards: PokemonCard[],
  selectedPokemon: string[]
): Promise<PokemonCard[]> {
  if (selectedPokemon.length === 0) return cards;

  // Build evolution chain order map
  const chainOrderMap = new Map<string, number>();
  for (const pokemon of selectedPokemon) {
    const chain = await getEvolutionChain(pokemon);
    chain.forEach((name, index) => {
      if (!chainOrderMap.has(name.toLowerCase())) {
        chainOrderMap.set(name.toLowerCase(), index);
      }
    });
  }

  // Group cards by Pokemon
  const groupedByPokemon = new Map<string, PokemonCard[]>();
  cards.forEach(card => {
    const key = card.pokemonName.toLowerCase();
    if (!groupedByPokemon.has(key)) {
      groupedByPokemon.set(key, []);
    }
    groupedByPokemon.get(key)!.push(card);
  });

  // Sort pokemon groups by evolution chain position
  const pokemonGroups = Array.from(groupedByPokemon.entries()).sort((a, b) => {
    const aOrder = chainOrderMap.get(a[0]) ?? Infinity;
    const bOrder = chainOrderMap.get(b[0]) ?? Infinity;
    return aOrder - bOrder;
  });

  // Within each pokemon group, sort by set release date then card number
  const result: PokemonCard[] = [];
  for (const [, pokemonCards] of pokemonGroups) {
    const sorted = [...pokemonCards].sort((a, b) => {
      const dateCompare = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      if (dateCompare !== 0) return dateCompare;
      return compareCardNumbers(a, b);
    });
    result.push(...sorted);
  }

  return result;
}

export function getVariantLabel(variant: PokemonCard['variant']): string {
  switch (variant) {
    case 'normal': return 'Normal';
    case 'reverse-holo': return 'Reverse Holo';
    case 'holo': return 'Holo';
    case 'promo': return 'Promo';
    case 'tournament': return 'Tournament Prize';
    case 'collab': return 'Collaboration';
    default: return variant;
  }
}

export function formatCardName(card: PokemonCard): string {
  const base = `${card.pokemonName} - ${card.setName} ${card.setNumber}`;
  if (card.variant !== 'normal') {
    return `${base} (${getVariantLabel(card.variant)})`;
  }
  return base;
}
