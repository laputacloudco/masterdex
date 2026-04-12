import type { MasterSetType, SortOrder, VariantFilters } from './types';

const DEFAULT_VARIANT_FILTERS: VariantFilters = {
  normal: true,
  holo: true,
  reverseHolo: true,
  fullArt: true,
  secretRare: true,
  rainbowRare: true,
  gold: true,
  promo: true,
  collab: true,
  tournament: true,
  cameo: true,
};

const VARIANT_KEYS: (keyof VariantFilters)[] = [
  'normal', 'holo', 'reverseHolo', 'fullArt', 'secretRare',
  'rainbowRare', 'gold', 'promo', 'collab', 'tournament', 'cameo',
];

export interface ShareableConfig {
  masterSetType: MasterSetType;
  selectedPokemon: string[];
  selectedSets: string[];
  variantFilters: VariantFilters;
  sortOrder: SortOrder;
}

export function buildShareUrl(config: ShareableConfig): string {
  const params = new URLSearchParams();

  params.set('type', config.masterSetType);

  if (config.selectedPokemon.length > 0) {
    params.set('pokemon', config.selectedPokemon.join(','));
  }
  if (config.selectedSets.length > 0) {
    params.set('sets', config.selectedSets.join(','));
  }

  // Only encode variant filters if they differ from defaults (all enabled)
  const enabledVariants = VARIANT_KEYS.filter(k => config.variantFilters[k]);
  const allEnabled = enabledVariants.length === VARIANT_KEYS.length;
  if (!allEnabled) {
    params.set('variants', enabledVariants.join(','));
  }

  if (config.sortOrder !== 'chronological') {
    params.set('sort', config.sortOrder);
  }

  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

export function parseShareUrl(search: string): ShareableConfig | null {
  const params = new URLSearchParams(search);

  if (!params.has('type')) {
    return null;
  }

  const typeParam = params.get('type');
  if (typeParam !== 'official-set' && typeParam !== 'pokemon-collection') {
    return null;
  }
  const masterSetType: MasterSetType = typeParam;

  const pokemonParam = params.get('pokemon');
  const selectedPokemon = pokemonParam
    ? pokemonParam.split(',').map(p => p.trim()).filter(Boolean)
    : [];

  const setsParam = params.get('sets');
  const selectedSets = setsParam
    ? setsParam.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  let variantFilters: VariantFilters;
  const variantsParam = params.get('variants');
  if (variantsParam !== null) {
    const enabled = new Set(variantsParam.split(',').map(v => v.trim()));
    variantFilters = {} as VariantFilters;
    for (const key of VARIANT_KEYS) {
      variantFilters[key] = enabled.has(key);
    }
  } else {
    variantFilters = { ...DEFAULT_VARIANT_FILTERS };
  }

  const sortParam = params.get('sort');
  const validSorts: SortOrder[] = ['set-order', 'chronological', 'grouped-by-set', 'grouped-by-pokemon', 'evolution-chain'];
  const sortOrder: SortOrder = validSorts.includes(sortParam as SortOrder)
    ? (sortParam as SortOrder)
    : 'chronological';

  return { masterSetType, selectedPokemon, selectedSets, variantFilters, sortOrder };
}
