import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import type { PokemonCard, MasterSetType, SortOrder, SavedSetlist } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SetBuilder } from '@/components/SetBuilder';
import { Checklist } from '@/components/Checklist';
import { SavedSetlists } from '@/components/SavedSetlists';
import { fetchCardsForSet, fetchCardsForPokemon } from '@/lib/pokemonTcgApi';
import { sortCards } from '@/lib/cardUtils';
import { toast } from 'sonner';

function App() {
  const [masterSetType, setMasterSetType] = useKV<MasterSetType>('config-type', 'pokemon-collection');
  const [includeAllVariants, setIncludeAllVariants] = useKV<boolean>('config-variants', true);
  const [sortOrder, setSortOrder] = useKV<SortOrder>('config-sort', 'chronological');
  const [selectedPokemon, setSelectedPokemon] = useKV<string[]>('config-pokemon', []);
  const [selectedSets, setSelectedSets] = useKV<string[]>('config-sets', []);
  
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');

  useEffect(() => {
    const fetchCards = async () => {
      const hasSelection = 
        (masterSetType === 'official-set' && selectedSets && selectedSets.length > 0) ||
        ((masterSetType === 'pokemon-collection' || masterSetType === 'evolution-chain') && 
         selectedPokemon && selectedPokemon.length > 0);

      if (!hasSelection) {
        setCards([]);
        return;
      }

      setIsLoading(true);
      
      try {
        let fetchedCards: PokemonCard[] = [];

        if (masterSetType === 'official-set' && selectedSets) {
          const promises = selectedSets.map(setCode => fetchCardsForSet(setCode));
          const results = await Promise.all(promises);
          fetchedCards = results.flat();
        } else if (selectedPokemon) {
          const promises = selectedPokemon.map(pokemon => fetchCardsForPokemon(pokemon));
          const results = await Promise.all(promises);
          fetchedCards = results.flat();
        }

        if (!includeAllVariants) {
          const uniqueArtCards = new Map<string, PokemonCard>();
          fetchedCards.forEach(card => {
            const key = `${card.pokemonName}-${card.setCode}-${card.setNumber.split(' ')[0]}`;
            if (!uniqueArtCards.has(key) || card.variant === 'normal') {
              uniqueArtCards.set(key, card);
            }
          });
          fetchedCards = Array.from(uniqueArtCards.values());
        }

        const sorted = sortCards(fetchedCards, sortOrder || 'chronological', selectedPokemon || []);
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
  }, [masterSetType, includeAllVariants, sortOrder, selectedPokemon, selectedSets]);

  const handleLoadSetlist = (setlist: SavedSetlist) => {
    setMasterSetType(setlist.type);
    setIncludeAllVariants(setlist.includeAllVariants);
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

  const canViewChecklist = cards.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Pokemon Master Set Planner
          </h1>
          <p className="text-lg text-muted-foreground">
            Build comprehensive checklists for your Pokemon card collection
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="builder">Build Set</TabsTrigger>
            <TabsTrigger value="checklist" disabled={!canViewChecklist}>
              Checklist {canViewChecklist && `(${cards.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="mt-8">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <SavedSetlists
                  currentConfig={{
                    masterSetType,
                    includeAllVariants,
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
                  includeAllVariants={includeAllVariants}
                  setIncludeAllVariants={setIncludeAllVariants}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  selectedPokemon={selectedPokemon}
                  setSelectedPokemon={setSelectedPokemon}
                  selectedSets={selectedSets}
                  setSelectedSets={setSelectedSets}
                  isLoading={isLoading}
                  cardCount={cards.length}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="mt-8">
            {canViewChecklist && (
              <div className="max-w-4xl mx-auto">
                <Checklist cards={cards} setName={checklistName} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;