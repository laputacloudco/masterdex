export type CardVariant = 'normal' | 'reverse-holo' | 'holo' | 'full-art' | 'secret-rare' | 'rainbow-rare' | 'gold' | 'promo' | 'collab' | 'tournament';

export type SortOrder = 'set-order' | 'chronological' | 'grouped-by-set' | 'evolution-chain';

export type MasterSetType = 'official-set' | 'pokemon-collection' | 'evolution-chain';

export interface VariantFilters {
  normal: boolean;
  holo: boolean;
  reverseHolo: boolean;
  fullArt: boolean;
  secretRare: boolean;
  rainbowRare: boolean;
  gold: boolean;
  promo: boolean;
  collab: boolean;
  tournament: boolean;
}

export interface PokemonCard {
  id: string;
  name: string;
  pokemonName: string;
  setName: string;
  setCode: string;
  setNumber: string;
  releaseDate: string;
  variant: CardVariant;
  artVariant?: string;
  rarity: string;
  isHolo: boolean;
  imageUrl?: string;
  largeImageUrl?: string;
  marketPrice?: number;
  tcgPlayerUrl?: string;
}

export interface PokemonSet {
  code: string;
  name: string;
  releaseDate: string;
  totalCards: number;
}

export interface PokemonSpecies {
  name: string;
  evolutionStage: number;
  evolvesFrom?: string;
  evolvesTo?: string[];
}

export interface SavedSetlist {
  id: string;
  name: string;
  type: MasterSetType;
  variantFilters: VariantFilters;
  selectedSets: string[];
  selectedPokemon: string[];
  sortOrder: SortOrder;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  card: PokemonCard;
  checked: boolean;
}
