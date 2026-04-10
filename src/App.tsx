import { useState, useEffect } from 'react';
import { useKV } from '@/hooks/useKV';
import type { PokemonCard, MasterSetType, SortOrder, SavedSetlist, VariantFilters } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SetBuilder } from '@/components/SetBuilder';
import { Checklist } from '@/components/Checklist';
import { SavedSetlists } from '@/components/SavedSetlists';
import { VariantStatistics } from '@/components/VariantStatistics';
import { CameoBrowser } from '@/components/CameoBrowser';
import { fetchCardsForSet, fetchCardsForPokemon } from '@/lib/pokemonTcgApi';
import { sortCards } from '@/lib/cardUtils';
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

function App() {
  const [masterSetType, setMasterSetType] = useKV<MasterSetType>('config-type', 'pokemon-collection');
  const [variantFilters, setVariantFilters] = useKV<VariantFilters>('config-variants', DEFAULT_VARIANT_FILTERS);
  const [sortOrder, setSortOrder] = useKV<SortOrder>('config-sort', 'chronological');
  const [selectedPokemon, setSelectedPokemon] = useKV<string[]>('config-pokemon', []);
  const [selectedSets, setSelectedSets] = useKV<string[]>('config-sets', []);
  const [includeEvolutionChain, setIncludeEvolutionChain] = useKV<boolean>('config-evolution-chain', false);
  
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');

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
        
        const filteredCards = fetchedCards.filter(card => {
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

        const sorted = sortCards(filteredCards, sortOrder || 'chronological', selectedPokemon || []);
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
  }, [masterSetType, variantFilters, sortOrder, selectedPokemon, selectedSets]);

  const handleLoadSetlist = (setlist: SavedSetlist) => {
    setMasterSetType(setlist.type);
    setVariantFilters(setlist.variantFilters);
    setSortOrder(setlist.sortOrder);
    setSelectedPokemon(setlist.selectedPokemon);
    setSelectedSets(setlist.selectedSets);
    setIncludeEvolutionChain(setlist.includeEvolutionChain || false);
    setActiveTab('builder');
  };

  const checklistName = 
    masterSetType === 'official-set' && selectedSets
      ? (selectedSets.length === 1 ? selectedSets[0] : `${selectedSets.length} Sets`)
      : selectedPokemon
      ? (selectedPokemon.length === 1 ? selectedPokemon[0] : `${selectedPokemon.length} Pokemon`)
      : 'Checklist';

  const canViewChecklist = cards.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Pokomplete
          </h1>
          <p className="text-lg text-muted-foreground">
            Build comprehensive checklists for your Pokemon card collection
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="builder">Build Set</TabsTrigger>
            <TabsTrigger value="checklist" disabled={!canViewChecklist}>
              Checklist {canViewChecklist && `(${cards.length})`}
            </TabsTrigger>
            <TabsTrigger value="cameos">Cameo Database</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="mt-8">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <SavedSetlists
                  currentConfig={{
                    masterSetType,
                    variantFilters,
                    selectedSets,
                    selectedPokemon,
                    sortOrder,
                    includeEvolutionChain,
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
                  includeEvolutionChain={includeEvolutionChain}
                  setIncludeEvolutionChain={setIncludeEvolutionChain}
                  isLoading={isLoading}
                  cardCount={cards.length}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="mt-8">
            {canViewChecklist && (
              <div className="max-w-4xl mx-auto space-y-6">
                <VariantStatistics cards={cards} />
                <Checklist cards={cards} setName={checklistName} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="cameos" className="mt-8">
            <div className="max-w-5xl mx-auto">
              <CameoBrowser />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;