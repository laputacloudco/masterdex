export type CardVariant = 'normal' | 'reverse-holo' | 'holo' | 'full-art' | 'secret-rare' | 'rainbow-rare' | 'gold' | 'promo' | 'collab' | 'tournament' | 'cameo';

export type SortOrder = 'set-order' | 'chronological' | 'grouped-by-set' | 'grouped-by-pokemon' | 'evolution-chain';

export type MasterSetType = 'official-set' | 'pokemon-collection' | 'type-collection' | 'artist-collection';

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
  cameo: boolean;
}

export type CardCondition = 'near-mint' | 'lightly-played' | 'moderately-played';

export interface PokemonCard {
  id: string;
  tcgId?: string;
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
  prices?: {
    low?: number;
    mid?: number;
    market?: number;
    high?: number;
  };
  tcgPlayerUrl?: string;
  artist?: string;
  supertype?: string;
  subtypes?: string[];
  nationalDexNumber?: number;
  types?: string[];
}

export interface PokemonSet {
  code: string;
  name: string;
  releaseDate: string;
  totalCards: number;
  series?: string;
  symbolUrl?: string;
  logoUrl?: string;
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
  selectedTypes?: string[];
  selectedArtists?: string[];
  sortOrder: SortOrder;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
  checkedCardIds?: string[];
}

export interface ChecklistItem {
  card: PokemonCard;
  checked: boolean;
}
