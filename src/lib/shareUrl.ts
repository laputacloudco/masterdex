import type { MasterSetType, SortOrder, VariantFilters } from './types';

/**
 * Share URL contract — v1
 *
 * Query parameters:
 *   v=1                          Schema version (assumed 1 if absent)
 *   type=official-set|pokemon-collection
 *   pokemon=Name1,Name2          Comma-separated Pokemon display names
 *   sets=set1,set2               Comma-separated TCG API set IDs
 *   variants=normal,holo,...     Comma-separated enabled variant filter keys
 *                                (omitted = all enabled)
 *   sort=chronological|set-order|grouped-by-set|grouped-by-pokemon|evolution-chain
 *                                (omitted = chronological)
 *
 * Forward-compatibility rules:
 *   - Unknown query params are ignored (future params won't break old clients)
 *   - Unknown variant keys in `variants` are ignored (new variants default off)
 *   - Unknown sort values fall back to 'chronological'
 *   - Unknown type values fall back to 'pokemon-collection'
 *   - Absent `variants` param means ALL variants enabled (including future ones)
 *   - Version bump (v=2+) only needed for breaking changes to existing params
 *   - Param names and value formats must never be renamed, only extended
 */

const SHARE_URL_VERSION = '1';

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

const VALID_TYPES: MasterSetType[] = ['official-set', 'pokemon-collection'];
const VALID_SORTS: SortOrder[] = ['set-order', 'chronological', 'grouped-by-set', 'grouped-by-pokemon', 'evolution-chain'];

export interface ShareableConfig {
  masterSetType: MasterSetType;
  selectedPokemon: string[];
  selectedSets: string[];
  variantFilters: VariantFilters;
  sortOrder: SortOrder;
}

export function buildShareUrl(config: ShareableConfig): string {
  const params = new URLSearchParams();

  params.set('v', SHARE_URL_VERSION);
  params.set('type', config.masterSetType);

  if (config.selectedPokemon.length > 0) {
    params.set('pokemon', config.selectedPokemon.join(','));
  }
  if (config.selectedSets.length > 0) {
    params.set('sets', config.selectedSets.join(','));
  }

  // Only encode variant filters if they differ from defaults (all enabled).
  // Omitting = all enabled, which is forward-compatible: new variant types
  // added in the future will default to enabled for old URLs without the param.
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

  // Require at least a type param to treat this as a share URL
  if (!params.has('type')) {
    return null;
  }

  // Version check — currently only v1 exists. Future versions can
  // add migration logic here. Unknown versions are best-effort parsed.
  // const version = params.get('v') || '1';

  // Type: fall back to pokemon-collection for unknown values
  const typeParam = params.get('type');
  const masterSetType: MasterSetType = VALID_TYPES.includes(typeParam as MasterSetType)
    ? (typeParam as MasterSetType)
    : 'pokemon-collection';

  const pokemonParam = params.get('pokemon');
  const selectedPokemon = pokemonParam
    ? pokemonParam.split(',').map(p => p.trim()).filter(Boolean)
    : [];

  const setsParam = params.get('sets');
  const selectedSets = setsParam
    ? setsParam.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  // Variant filters: if param is absent, ALL variants enabled (forward-compatible).
  // If present, only listed variants are enabled. Unknown keys are ignored.
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

  // Sort: fall back to chronological for unknown values
  const sortParam = params.get('sort');
  const sortOrder: SortOrder = VALID_SORTS.includes(sortParam as SortOrder)
    ? (sortParam as SortOrder)
    : 'chronological';

  return { masterSetType, selectedPokemon, selectedSets, variantFilters, sortOrder };
}
