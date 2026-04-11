import type { PokemonCard, SortOrder } from './types';
import { getEvolutionChain } from './pokemonData';

export function sortCards(cards: PokemonCard[], sortOrder: SortOrder, selectedPokemon?: string[]): PokemonCard[] {
  const sorted = [...cards];
  
  switch (sortOrder) {
    case 'set-order':
      return sorted.sort((a, b) => {
        if (a.setCode !== b.setCode) {
          return a.setCode.localeCompare(b.setCode);
        }
        const aNum = parseInt(a.setNumber.split('/')[0]);
        const bNum = parseInt(b.setNumber.split('/')[0]);
        return aNum - bNum;
      });
      
    case 'chronological':
      return sorted.sort((a, b) => {
        const dateCompare = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        if (dateCompare !== 0) return dateCompare;
        
        const aNum = parseInt(a.setNumber.split('/')[0]);
        const bNum = parseInt(b.setNumber.split('/')[0]);
        return aNum - bNum;
      });
      
    case 'grouped-by-set':
      return sorted.sort((a, b) => {
        const dateCompare = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        if (dateCompare !== 0) return dateCompare;
        
        if (a.setCode !== b.setCode) {
          return a.setCode.localeCompare(b.setCode);
        }
        
        if (a.pokemonName !== b.pokemonName) {
          return a.pokemonName.localeCompare(b.pokemonName);
        }
        
        const aNum = parseInt(a.setNumber.split('/')[0]);
        const bNum = parseInt(b.setNumber.split('/')[0]);
        return aNum - bNum;
      });
      
    case 'evolution-chain':
      return sortByEvolutionChain(sorted, selectedPokemon || []);
      
    default:
      return sorted;
  }
}

function sortByEvolutionChain(cards: PokemonCard[], selectedPokemon: string[]): PokemonCard[] {
  // Build unique chains from all selected Pokemon
  const seenRoots = new Set<string>();
  const uniqueChains: string[][] = [];
  
  selectedPokemon.forEach(pokemon => {
    const chain = getEvolutionChain(pokemon);
    const rootKey = chain[0]?.toLowerCase();
    if (rootKey && !seenRoots.has(rootKey)) {
      seenRoots.add(rootKey);
      uniqueChains.push(chain);
    }
  });
  
  // Build a flat ordering: chain1 members, chain2 members, ...
  const pokemonOrder = new Map<string, number>();
  let order = 0;
  uniqueChains.forEach(chain => {
    chain.forEach(name => {
      if (!pokemonOrder.has(name.toLowerCase())) {
        pokemonOrder.set(name.toLowerCase(), order++);
      }
    });
  });
  
  // Group cards by set, ordered by release date
  const groupedBySets = new Map<string, PokemonCard[]>();
  cards.forEach(card => {
    if (!groupedBySets.has(card.setCode)) {
      groupedBySets.set(card.setCode, []);
    }
    groupedBySets.get(card.setCode)!.push(card);
  });
  
  const setsByDate = Array.from(groupedBySets.entries()).sort((a, b) => {
    const dateA = a[1][0]?.releaseDate || '';
    const dateB = b[1][0]?.releaseDate || '';
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });
  
  const result: PokemonCard[] = [];
  
  setsByDate.forEach(([, setCards]) => {
    // Sort cards within each set by evolution chain order, then card number
    const sorted = [...setCards].sort((a, b) => {
      const orderA = pokemonOrder.get(a.pokemonName.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
      const orderB = pokemonOrder.get(b.pokemonName.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      
      const aNum = parseInt(a.setNumber.split('/')[0]);
      const bNum = parseInt(b.setNumber.split('/')[0]);
      return aNum - bNum;
    });
    
    result.push(...sorted);
  });
  
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
