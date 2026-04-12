import { useState, useEffect, useRef, useCallback } from 'react';
import { useKV } from './useKV';
import type { PokemonCard, MasterSetType, SortOrder, SavedSetlist, VariantFilters } from '@/lib/types';
import { fetchCardsForSet, fetchCardsForPokemon, fetchCardsForType, fetchCardsForArtist, deduplicateCards } from '@/lib/pokemonTcgApi';
import { sortCards, sortByEvolutionChainAsync, sortGroupedByPokemonAsync } from '@/lib/cardUtils';
import { buildShareUrl, parseShareUrl } from '@/lib/shareUrl';
import { toast } from 'sonner';

const STORAGE_PREFIX = 'pokomplete:';

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

/**
 * Compute the legacy dynamic checklist key from config values.
 * Used for migration from old per-config keys to per-setlist keys.
 */
function computeDynamicChecklistKey(
  masterSetType: MasterSetType,
  selectedPokemon: string[],
  selectedSets: string[],
  selectedTypes: string[],
  selectedArtists: string[],
): string {
  if (masterSetType === 'official-set' && selectedSets.length > 0)
    return `set:${[...selectedSets].sort().join(',')}`;
  if (masterSetType === 'type-collection' && selectedTypes.length > 0)
    return `type:${[...selectedTypes].sort().join(',')}`;
  if (masterSetType === 'artist-collection' && selectedArtists.length > 0)
    return `artist:${[...selectedArtists].sort().join(',')}`;
  if (selectedPokemon.length > 0)
    return `pokemon:${[...selectedPokemon].sort().join(',')}`;
  return 'empty';
}

/**
 * Read checked card IDs from localStorage for a given checklist key.
 */
function readCheckedCards(checklistKey: string): string[] | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}checklist-${checklistKey}`);
    if (raw === null) return null;
    return JSON.parse(raw) as string[];
  } catch {
    return null;
  }
}

/**
 * Write checked card IDs to localStorage for a given checklist key.
 */
function writeCheckedCards(checklistKey: string, ids: string[]): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}checklist-${checklistKey}`, JSON.stringify(ids));
  } catch (e) {
    console.warn('Failed to write checked cards', e);
  }
}

export function useCollectionState() {
  const [masterSetType, setMasterSetType] = useKV<MasterSetType>('config-type', 'pokemon-collection');
  const [variantFilters, setVariantFilters] = useKV<VariantFilters>('config-variants', DEFAULT_VARIANT_FILTERS);
  const [sortOrder, setSortOrder] = useKV<SortOrder>('config-sort', 'chronological');
  const [selectedPokemon, setSelectedPokemon] = useKV<string[]>('config-pokemon', []);
  const [selectedSets, setSelectedSets] = useKV<string[]>('config-sets', []);
  const [selectedTypes, setSelectedTypes] = useKV<string[]>('config-types', []);
  const [selectedArtists, setSelectedArtists] = useKV<string[]>('config-artists', []);
  const [uniqueArtOnly, setUniqueArtOnly] = useKV<boolean>('config-unique-art', false);

  // Saved setlists (lifted from SavedSetlists.tsx for centralized management)
  const [savedSetlists, setSavedSetlists] = useKV<SavedSetlist[]>('saved-setlists', []);

  // Active setlist tracking — persists across page reloads
  const [activeSetlistId, setActiveSetlistId] = useKV<string | null>('active-setlist-id', null);

  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const urlApplied = useRef(false);

  // Validate activeSetlistId whenever persisted setlists change: clear if the setlist was deleted
  useEffect(() => {
    if (activeSetlistId && savedSetlists) {
      const exists = savedSetlists.some(s => s.id === activeSetlistId);
      if (!exists) {
        setActiveSetlistId(null);
      }
    }
  }, [activeSetlistId, savedSetlists, setActiveSetlistId]);

  // On mount, parse URL query params and apply shared config
  useEffect(() => {
    if (urlApplied.current) return;
    urlApplied.current = true;

    const config = parseShareUrl(window.location.search);
    if (config) {
      // Loading a share URL deactivates any active setlist
      setActiveSetlistId(null);
      setMasterSetType(config.masterSetType);
      setVariantFilters(config.variantFilters);
      setSortOrder(config.sortOrder);
      setSelectedPokemon(config.selectedPokemon);
      setSelectedSets(config.selectedSets);
      if (config.selectedTypes) setSelectedTypes(config.selectedTypes);
      if (config.selectedArtists) setSelectedArtists(config.selectedArtists);
      if (config.uniqueArtOnly !== undefined) setUniqueArtOnly(config.uniqueArtOnly);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Share current config
  const handleShare = useCallback(() => {
    const currentType = masterSetType || 'pokemon-collection';
    const currentPokemon = selectedPokemon || [];
    const currentSets = selectedSets || [];
    const currentTypes = selectedTypes || [];
    const currentArtists = selectedArtists || [];
    const currentVariants = variantFilters || DEFAULT_VARIANT_FILTERS;
    const currentSort = sortOrder || 'chronological';

    const hasSelection =
      (currentType === 'official-set' && currentSets.length > 0) ||
      (currentType === 'pokemon-collection' && currentPokemon.length > 0) ||
      (currentType === 'type-collection' && currentTypes.length > 0) ||
      (currentType === 'artist-collection' && currentArtists.length > 0);

    if (!hasSelection) {
      toast.error('Add some Pokemon, sets, types, or artists before sharing.');
      return;
    }

    const url = buildShareUrl({
      masterSetType: currentType,
      selectedPokemon: currentPokemon,
      selectedSets: currentSets,
      selectedTypes: currentTypes,
      selectedArtists: currentArtists,
      variantFilters: currentVariants,
      sortOrder: currentSort,
      uniqueArtOnly: uniqueArtOnly ?? false,
    });

    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link.');
    });
  }, [masterSetType, selectedPokemon, selectedSets, selectedTypes, selectedArtists, variantFilters, sortOrder, uniqueArtOnly]);

  // Fetch and process cards when config changes
  useEffect(() => {
    const fetchCards = async () => {
      const hasSelection =
        (masterSetType === 'official-set' && selectedSets && selectedSets.length > 0) ||
        (masterSetType === 'pokemon-collection' && selectedPokemon && selectedPokemon.length > 0) ||
        (masterSetType === 'type-collection' && selectedTypes && selectedTypes.length > 0) ||
        (masterSetType === 'artist-collection' && selectedArtists && selectedArtists.length > 0);

      if (!hasSelection) {
        setCards([]);
        return;
      }

      setIsLoading(true);

      try {
        let fetchedCards: PokemonCard[] = [];
        const currentVariantFilters = variantFilters || DEFAULT_VARIANT_FILTERS;

        if (masterSetType === 'official-set' && selectedSets) {
          const promises = selectedSets.map(setCode => fetchCardsForSet(setCode));
          const results = await Promise.all(promises);
          fetchedCards = results.flat();
        } else if (masterSetType === 'pokemon-collection' && selectedPokemon) {
          const includeCameos = currentVariantFilters.cameo;
          const promises = selectedPokemon.map(pokemon => fetchCardsForPokemon(pokemon, includeCameos));
          const results = await Promise.all(promises);
          fetchedCards = results.flat();
        } else if (masterSetType === 'type-collection' && selectedTypes) {
          const promises = selectedTypes.map(type => fetchCardsForType(type));
          const results = await Promise.all(promises);
          fetchedCards = results.flat();
        } else if (masterSetType === 'artist-collection' && selectedArtists) {
          const promises = selectedArtists.map(artist => fetchCardsForArtist(artist));
          const results = await Promise.all(promises);
          fetchedCards = results.flat();
        }

        const filteredCards = deduplicateCards(fetchedCards).filter(card => {
          if (card.variant === 'normal' && card.isHolo) {
            return currentVariantFilters.holo;
          }

          switch (card.variant) {
            case 'normal':
              return currentVariantFilters.normal;
            case 'holo':
              return currentVariantFilters.holo;
            case 'reverse-holo':
              return currentVariantFilters.reverseHolo;
            case 'full-art':
              return currentVariantFilters.fullArt;
            case 'secret-rare':
              return currentVariantFilters.secretRare;
            case 'rainbow-rare':
              return currentVariantFilters.rainbowRare;
            case 'gold':
              return currentVariantFilters.gold;
            case 'promo':
              return currentVariantFilters.promo;
            case 'collab':
              return currentVariantFilters.collab;
            case 'tournament':
              return currentVariantFilters.tournament;
            case 'cameo':
              return currentVariantFilters.cameo;
            default:
              return true;
          }
        });

        let cardsToSort = filteredCards;
        if (uniqueArtOnly) {
          const seen = new Map<string, PokemonCard>();
          for (const card of filteredCards) {
            const dedupeKey = card.tcgId ?? card.id;
            if (!seen.has(dedupeKey)) {
              seen.set(dedupeKey, card);
            }
          }
          cardsToSort = Array.from(seen.values());
        }

        let sorted: PokemonCard[];
        const currentSort = sortOrder || 'chronological';
        if (currentSort === 'evolution-chain') {
          sorted = await sortByEvolutionChainAsync(cardsToSort, selectedPokemon || []);
        } else if (currentSort === 'grouped-by-pokemon') {
          sorted = await sortGroupedByPokemonAsync(cardsToSort, selectedPokemon || []);
        } else {
          sorted = sortCards(cardsToSort, currentSort);
        }
        setCards(sorted);
      } catch (error) {
        console.error('Error fetching cards:', error);
        toast.error('Failed to load cards. Please try again.');
        setCards([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [masterSetType, variantFilters, sortOrder, selectedPokemon, selectedSets, selectedTypes, selectedArtists, uniqueArtOnly]);

  // Load a saved setlist — sets it as the active setlist
  const loadSetlist = useCallback((setlist: SavedSetlist) => {
    setActiveSetlistId(setlist.id);
    setMasterSetType(setlist.type);
    setVariantFilters(setlist.variantFilters);
    setSortOrder(setlist.sortOrder);
    setSelectedPokemon(setlist.selectedPokemon);
    setSelectedSets(setlist.selectedSets);
    setSelectedTypes(setlist.selectedTypes || []);
    setSelectedArtists(setlist.selectedArtists || []);
    setUniqueArtOnly(setlist.uniqueArtOnly ?? false);

    // Migrate legacy progress only when the new per-setlist key is truly missing.
    // An empty array is a valid "all checks cleared" state and must not trigger migration.
    const setlistKey = `setlist:${setlist.id}`;
    const rawSetlistProgress =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(`${STORAGE_PREFIX}${setlistKey}`)
        : null;
    if (rawSetlistProgress === null) {
      const dynamicKey = computeDynamicChecklistKey(
        setlist.type,
        setlist.selectedPokemon,
        setlist.selectedSets,
        setlist.selectedTypes || [],
        setlist.selectedArtists || [],
      );
      const legacy = readCheckedCards(dynamicKey);
      if (legacy && legacy.length > 0) {
        writeCheckedCards(setlistKey, legacy);
      }
    }
  }, [setActiveSetlistId, setMasterSetType, setVariantFilters, setSortOrder, setSelectedPokemon, setSelectedSets, setSelectedTypes, setSelectedArtists, setUniqueArtOnly]);

  // Deactivate the current setlist (start fresh)
  const deactivateSetlist = useCallback(() => {
    setActiveSetlistId(null);
  }, [setActiveSetlistId]);

  // Save a new setlist from the current config
  const saveSetlist = useCallback((name: string): SavedSetlist | null => {
    if (!masterSetType) return null;

    const newSetlist: SavedSetlist = {
      id: `setlist-${Date.now()}`,
      name,
      type: masterSetType,
      variantFilters: variantFilters || DEFAULT_VARIANT_FILTERS,
      selectedSets: selectedSets || [],
      selectedPokemon: selectedPokemon || [],
      selectedTypes: selectedTypes || [],
      selectedArtists: selectedArtists || [],
      sortOrder: sortOrder || 'chronological',
      uniqueArtOnly: uniqueArtOnly ?? false,
      cardCount: cards.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSavedSetlists((current) => [...(current || []), newSetlist]);

    // Activate the new setlist and migrate any existing progress
    setActiveSetlistId(newSetlist.id);
    const dynamicKey = computeDynamicChecklistKey(
      newSetlist.type,
      newSetlist.selectedPokemon,
      newSetlist.selectedSets,
      newSetlist.selectedTypes || [],
      newSetlist.selectedArtists || [],
    );
    const legacy = readCheckedCards(dynamicKey);
    if (legacy && legacy.length > 0) {
      writeCheckedCards(`setlist:${newSetlist.id}`, legacy);
    }

    return newSetlist;
  }, [masterSetType, variantFilters, selectedSets, selectedPokemon, selectedTypes, selectedArtists, sortOrder, uniqueArtOnly, cards.length, setSavedSetlists, setActiveSetlistId]);

  // Update an existing saved setlist's config (explicit save)
  const updateSetlist = useCallback((id: string, name?: string) => {
    setSavedSetlists((current) => (current || []).map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        name: name ?? s.name,
        type: masterSetType || s.type,
        variantFilters: variantFilters || s.variantFilters,
        selectedSets: selectedSets || s.selectedSets,
        selectedPokemon: selectedPokemon || s.selectedPokemon,
        selectedTypes: selectedTypes || s.selectedTypes,
        selectedArtists: selectedArtists || s.selectedArtists,
        sortOrder: sortOrder || s.sortOrder,
        uniqueArtOnly: uniqueArtOnly ?? s.uniqueArtOnly,
        cardCount: cards.length,
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [masterSetType, variantFilters, selectedSets, selectedPokemon, selectedTypes, selectedArtists, sortOrder, uniqueArtOnly, cards.length, setSavedSetlists]);

  // Delete a saved setlist
  const deleteSetlist = useCallback((id: string) => {
    setSavedSetlists((current) => (current || []).filter(s => s.id !== id));
    // If deleting the active setlist, deactivate
    if (activeSetlistId === id) {
      setActiveSetlistId(null);
    }
    // Clean up the progress key
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}checklist-setlist:${id}`);
    } catch {
      // ignore
    }
  }, [setSavedSetlists, activeSetlistId, setActiveSetlistId]);

  // Derived values
  const checklistName =
    masterSetType === 'official-set' && selectedSets
      ? (selectedSets.length === 1 ? selectedSets[0] : `${selectedSets.length} Sets`)
      : masterSetType === 'type-collection' && selectedTypes
      ? (selectedTypes.length === 1 ? selectedTypes[0] : `${selectedTypes.length} Types`)
      : masterSetType === 'artist-collection' && selectedArtists
      ? (selectedArtists.length === 1 ? selectedArtists[0] : `${selectedArtists.length} Artists`)
      : selectedPokemon
      ? (selectedPokemon.length === 1 ? selectedPokemon[0] : `${selectedPokemon.length} Pokemon`)
      : 'Checklist';

  // Stable key when a setlist is active; dynamic key otherwise
  const checklistKey = activeSetlistId
    ? `setlist:${activeSetlistId}`
    : computeDynamicChecklistKey(
        masterSetType || 'pokemon-collection',
        selectedPokemon || [],
        selectedSets || [],
        selectedTypes || [],
        selectedArtists || [],
      );

  const canViewChecklist = cards.length > 0;

  const cardsWithoutVariantData = cards.filter(c => !c.prices && !c.artVariant);
  const missingVariantData = canViewChecklist && !(uniqueArtOnly ?? false) &&
    cardsWithoutVariantData.length > cards.length * 0.5;

  return {
    // Config state
    masterSetType,
    setMasterSetType,
    variantFilters,
    setVariantFilters,
    sortOrder,
    setSortOrder,
    selectedPokemon,
    setSelectedPokemon,
    selectedSets,
    setSelectedSets,
    selectedTypes,
    setSelectedTypes,
    selectedArtists,
    setSelectedArtists,
    uniqueArtOnly,
    setUniqueArtOnly,

    // Card data
    cards,
    isLoading,

    // Saved setlists
    savedSetlists: savedSetlists || [],
    activeSetlistId,

    // Derived
    checklistName,
    checklistKey,
    canViewChecklist,
    missingVariantData,

    // Actions
    handleShare,
    loadSetlist,
    deactivateSetlist,
    saveSetlist,
    updateSetlist,
    deleteSetlist,
  } as const;
}
