import { useState, useEffect, useRef, useCallback } from 'react';
import { useKV } from './useKV';
import type { PokemonCard, MasterSetType, SortOrder, SavedSetlist, VariantFilters } from '@/lib/types';
import { fetchCardsForSet, fetchCardsForPokemon, fetchCardsForType, fetchCardsForArtist, deduplicateCards } from '@/lib/pokemonTcgApi';
import { sortCards, sortByEvolutionChainAsync, sortGroupedByPokemonAsync } from '@/lib/cardUtils';
import { buildShareUrl, parseShareUrl } from '@/lib/shareUrl';
import { toast } from 'sonner';

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

export function useCollectionState() {
  const [masterSetType, setMasterSetType] = useKV<MasterSetType>('config-type', 'pokemon-collection');
  const [variantFilters, setVariantFilters] = useKV<VariantFilters>('config-variants', DEFAULT_VARIANT_FILTERS);
  const [sortOrder, setSortOrder] = useKV<SortOrder>('config-sort', 'chronological');
  const [selectedPokemon, setSelectedPokemon] = useKV<string[]>('config-pokemon', []);
  const [selectedSets, setSelectedSets] = useKV<string[]>('config-sets', []);
  const [selectedTypes, setSelectedTypes] = useKV<string[]>('config-types', []);
  const [selectedArtists, setSelectedArtists] = useKV<string[]>('config-artists', []);
  const [uniqueArtOnly, setUniqueArtOnly] = useKV<boolean>('config-unique-art', false);

  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const urlApplied = useRef(false);

  // On mount, parse URL query params and apply shared config
  useEffect(() => {
    if (urlApplied.current) return;
    urlApplied.current = true;

    const config = parseShareUrl(window.location.search);
    if (config) {
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
            const baseId = card.id.replace(/-(?:normal|reverseHolofoil|holofoil|1stEditionHolofoil|1stEditionNormal|unlimitedHolofoil)$/, '');
            if (!seen.has(baseId)) {
              seen.set(baseId, card);
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

  // Load a saved setlist
  const loadSetlist = useCallback((setlist: SavedSetlist) => {
    setMasterSetType(setlist.type);
    setVariantFilters(setlist.variantFilters);
    setSortOrder(setlist.sortOrder);
    setSelectedPokemon(setlist.selectedPokemon);
    setSelectedSets(setlist.selectedSets);
    setSelectedTypes(setlist.selectedTypes || []);
    setSelectedArtists(setlist.selectedArtists || []);
  }, [setMasterSetType, setVariantFilters, setSortOrder, setSelectedPokemon, setSelectedSets, setSelectedTypes, setSelectedArtists]);

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

  const checklistKey =
    masterSetType === 'official-set' && selectedSets
      ? `set:${[...selectedSets].sort().join(',')}`
      : masterSetType === 'type-collection' && selectedTypes
      ? `type:${[...selectedTypes].sort().join(',')}`
      : masterSetType === 'artist-collection' && selectedArtists
      ? `artist:${[...selectedArtists].sort().join(',')}`
      : selectedPokemon
      ? `pokemon:${[...selectedPokemon].sort().join(',')}`
      : 'empty';

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

    // Derived
    checklistName,
    checklistKey,
    canViewChecklist,
    missingVariantData,

    // Actions
    handleShare,
    loadSetlist,
  } as const;
}
