import { useState } from 'react';
import type { PokemonCard, MasterSetType, SortOrder } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SetBuilder } from '@/components/SetBuilder';
import { Checklist } from '@/components/Checklist';
import { getCardsForPokemon, getCardsForSet } from '@/lib/pokemonData';
import { sortCards } from '@/lib/cardUtils';
import { toast } from 'sonner';

function App() {
  const [generatedCards, setGeneratedCards] = useState<PokemonCard[] | null>(null);
  const [checklistName, setChecklistName] = useState<string>('');

  const handleGenerate = (config: {
    type: MasterSetType;
    includeAllVariants: boolean;
    selectedSets: string[];
    selectedPokemon: string[];
    sortOrder: SortOrder;
  }) => {
    let cards: PokemonCard[] = [];

    if (config.type === 'official-set') {
      config.selectedSets.forEach(setCode => {
        const setCards = getCardsForSet(setCode, config.includeAllVariants);
        cards.push(...setCards);
      });
      setChecklistName(
        config.selectedSets.length === 1 
          ? config.selectedSets[0]
          : `${config.selectedSets.length} Sets`
      );
    } else {
      cards = getCardsForPokemon(config.selectedPokemon, config.includeAllVariants);
      setChecklistName(
        config.selectedPokemon.length === 1
          ? config.selectedPokemon[0]
          : `${config.selectedPokemon.length} Pokemon`
      );
    }

    const sorted = sortCards(cards, config.sortOrder, config.selectedPokemon);
    
    setGeneratedCards(sorted);
    toast.success(`Generated checklist with ${sorted.length} cards!`);
  };

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

        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="builder">Build Set</TabsTrigger>
            <TabsTrigger value="checklist" disabled={!generatedCards}>
              Checklist {generatedCards && `(${generatedCards.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="mt-8">
            <div className="max-w-3xl mx-auto">
              <SetBuilder onGenerate={handleGenerate} />
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="mt-8">
            {generatedCards && (
              <div className="max-w-4xl mx-auto">
                <Checklist cards={generatedCards} setName={checklistName} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;