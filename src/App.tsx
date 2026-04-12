import { useState, useEffect, useRef, useCallback } from 'react';
import { useKV } from '@/hooks/useKV';
import type { PokemonCard, MasterSetType, SortOrder, SavedSetlist, VariantFilters } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SetBuilder } from '@/components/SetBuilder';
import { Checklist } from '@/components/Checklist';
import { SavedSetlists } from '@/components/SavedSetlists';
import { VariantStatistics } from '@/components/VariantStatistics';
import { BinderCalculator } from '@/components/BinderCalculator';
import { BinderView } from '@/components/BinderView';
import { CameoBrowser } from '@/components/CameoBrowser';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Footer } from '@/components/Footer';
import { fetchCardsForSet, fetchCardsForPokemon, deduplicateCards } from '@/lib/pokemonTcgApi';
import { sortCards, sortByEvolutionChainAsync, sortGroupedByPokemonAsync } from '@/lib/cardUtils';
import { buildShareUrl, parseShareUrl } from '@/lib/shareUrl';
import { toast } from 'sonner';
import { ShareNetwork } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

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

function App() {
  const [masterSetType, setMasterSetType] = useKV<MasterSetType>('config-type', 'pokemon-collection');
  const [variantFilters, setVariantFilters] = useKV<VariantFilters>('config-variants', DEFAULT_VARIANT_FILTERS);
  const [sortOrder, setSortOrder] = useKV<SortOrder>('config-sort', 'chronological');
  const [selectedPokemon, setSelectedPokemon] = useKV<string[]>('config-pokemon', []);
  const [selectedSets, setSelectedSets] = useKV<string[]>('config-sets', []);
  const [uniqueArtOnly, setUniqueArtOnly] = useKV<boolean>('config-unique-art', false);
  
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');
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
      if (config.uniqueArtOnly !== undefined) setUniqueArtOnly(config.uniqueArtOnly);
      // Clean URL without triggering navigation
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShare = useCallback(() => {
    const currentType = masterSetType || 'pokemon-collection';
    const currentPokemon = selectedPokemon || [];
    const currentSets = selectedSets || [];
    const currentVariants = variantFilters || DEFAULT_VARIANT_FILTERS;
    const currentSort = sortOrder || 'chronological';

    const hasSelection =
      (currentType === 'official-set' && currentSets.length > 0) ||
      (currentType === 'pokemon-collection' && currentPokemon.length > 0);

    if (!hasSelection) {
      toast.error('Add some Pokemon or sets before sharing.');
      return;
    }

    const url = buildShareUrl({
      masterSetType: currentType,
      selectedPokemon: currentPokemon,
      selectedSets: currentSets,
      variantFilters: currentVariants,
      sortOrder: currentSort,
      uniqueArtOnly: uniqueArtOnly ?? false,
    });

    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link.');
    });
  }, [masterSetType, selectedPokemon, selectedSets, variantFilters, sortOrder, uniqueArtOnly]);

  useEffect(() => {
    const fetchCards = async () => {
      const hasSelection = 
        (masterSetType === 'official-set' && selectedSets && selectedSets.length > 0) ||
        (masterSetType === 'pokemon-collection' && selectedPokemon && selectedPokemon.length > 0);

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
        } else if (selectedPokemon) {
          const includeCameos = currentVariantFilters.cameo;
          const promises = selectedPokemon.map(pokemon => fetchCardsForPokemon(pokemon, includeCameos));
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

        // When "unique art only" is enabled, collapse cards with the same
        // base card ID (setCode + number) into one entry per unique artwork.
        // This gives "one of each card number" without variant duplication.
        let cardsToSort = filteredCards;
        if (uniqueArtOnly) {
          const seen = new Map<string, PokemonCard>();
          for (const card of filteredCards) {
            // Key by the base card ID (strip variant suffix like "-reverseHolofoil")
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
  }, [masterSetType, variantFilters, sortOrder, selectedPokemon, selectedSets, uniqueArtOnly]);

  const handleLoadSetlist = (setlist: SavedSetlist) => {
    setMasterSetType(setlist.type);
    setVariantFilters(setlist.variantFilters);
    setSortOrder(setlist.sortOrder);
    setSelectedPokemon(setlist.selectedPokemon);
    setSelectedSets(setlist.selectedSets);
    setActiveTab('builder');
  };

  const checklistName = 
    masterSetType === 'official-set' && selectedSets
      ? (selectedSets.length === 1 ? selectedSets[0] : `${selectedSets.length} Sets`)
      : selectedPokemon
      ? (selectedPokemon.length === 1 ? selectedPokemon[0] : `${selectedPokemon.length} Pokemon`)
      : 'Checklist';

  // Deterministic key for checklist storage based on actual selection, not just count.
  // This prevents "3 Pokemon" from sharing checked state across different selections.
  const checklistKey =
    masterSetType === 'official-set' && selectedSets
      ? `set:${[...selectedSets].sort().join(',')}`
      : selectedPokemon
      ? `pokemon:${[...selectedPokemon].sort().join(',')}`
      : 'empty';

  const canViewChecklist = cards.length > 0;

  // Detect when variant expansion data is unavailable (no TCGPlayer pricing)
  const cardsWithoutVariantData = cards.filter(c => !c.prices && !c.artVariant);
  const missingVariantData = canViewChecklist && !(uniqueArtOnly ?? false) &&
    cardsWithoutVariantData.length > cards.length * 0.5;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--gradient-start),transparent_50%),radial-gradient(ellipse_at_bottom_right,var(--gradient-end),transparent_50%)]" />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <header className="mb-6 sm:mb-10 relative">
          <div className="absolute right-0 top-0 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              title="Share setlist configuration"
            >
              <ShareNetwork size={20} />
            </Button>
            <ThemeToggle />
          </div>
          <div className="text-center pt-2 pr-10 sm:pr-0">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent tracking-tight">
              Pokomplete
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              Build comprehensive checklists for your Pokémon card collection
            </p>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-2 h-auto">
            <TabsTrigger value="builder" className="min-h-[44px] text-xs sm:text-sm px-1 sm:px-3">Build Set</TabsTrigger>
            <TabsTrigger value="checklist" disabled={!canViewChecklist} className="min-h-[44px] text-xs sm:text-sm px-1 sm:px-3">
              Checklist {canViewChecklist && `(${cards.length})`}
            </TabsTrigger>
            <TabsTrigger value="binder" disabled={!canViewChecklist} className="min-h-[44px] text-xs sm:text-sm px-1 sm:px-3">Binder</TabsTrigger>
            <TabsTrigger value="cameos" className="min-h-[44px] text-xs sm:text-sm px-1 sm:px-3">Cameos</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="mt-4 sm:mt-8">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <SavedSetlists
                  currentConfig={{
                    masterSetType,
                    variantFilters,
                    selectedSets,
                    selectedPokemon,
                    sortOrder,
                    cardCount: cards.length,
                  }}
                  onLoad={handleLoadSetlist}
                />
                
                <SetBuilder
                  masterSetType={masterSetType}
                  setMasterSetType={setMasterSetType}
                  variantFilters={variantFilters}
                  setVariantFilters={setVariantFilters}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  selectedPokemon={selectedPokemon}
                  setSelectedPokemon={setSelectedPokemon}
                  selectedSets={selectedSets}
                  setSelectedSets={setSelectedSets}
                  uniqueArtOnly={uniqueArtOnly}
                  setUniqueArtOnly={setUniqueArtOnly}
                  isLoading={isLoading}
                  cardCount={cards.length}
                  missingVariantData={missingVariantData}
                  onViewChecklist={() => setActiveTab('checklist')}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="mt-4 sm:mt-8">
            {canViewChecklist && (
              <div className="max-w-4xl mx-auto space-y-6">
                <Checklist cards={cards} setName={checklistName} storageKey={checklistKey} />
                <VariantStatistics cards={cards} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="binder" className="mt-4 sm:mt-8">
            {canViewChecklist && (
              <div className="max-w-4xl mx-auto space-y-6">
                <BinderCalculator cardCount={cards.length} />
                <BinderView cards={cards} setName={checklistName} storageKey={checklistKey} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="cameos" className="mt-4 sm:mt-8">
            <div className="max-w-5xl mx-auto">
              <CameoBrowser />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}

export default App;