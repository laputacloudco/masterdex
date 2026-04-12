import { useState } from 'react';
import type { SavedSetlist } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SetBuilder } from '@/components/SetBuilder';
import { Checklist } from '@/components/Checklist';
import { SavedSetlists } from '@/components/SavedSetlists';
import { VariantStatistics } from '@/components/VariantStatistics';
import { BinderCalculator } from '@/components/BinderCalculator';
import { BinderView } from '@/components/BinderView';
import { CameoBrowser } from '@/components/CameoBrowser';
import { ComparisonView } from '@/components/ComparisonView';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Footer } from '@/components/Footer';
import { ShareNetwork, ClipboardText } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useCollectionState } from '@/hooks/useCollectionState';

function App() {
  const {
    masterSetType, setMasterSetType,
    variantFilters, setVariantFilters,
    sortOrder, setSortOrder,
    selectedPokemon, setSelectedPokemon,
    selectedSets, setSelectedSets,
    selectedTypes, setSelectedTypes,
    selectedArtists, setSelectedArtists,
    uniqueArtOnly, setUniqueArtOnly,
    cards, isLoading,
    checklistName, checklistKey, canViewChecklist, missingVariantData,
    handleShare, loadSetlist,
  } = useCollectionState();

  const [activeTab, setActiveTab] = useState('builder');
  const [binderCardsPerPage, setBinderCardsPerPage] = useState(9);

  const handleLoadSetlist = (setlist: SavedSetlist) => {
    loadSetlist(setlist);
    setActiveTab('builder');
  };

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
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 mb-2 h-auto">
            <TabsTrigger value="builder" className="min-h-[44px] text-xs sm:text-sm px-1 sm:px-3">Build Set</TabsTrigger>
            <TabsTrigger value="checklist" disabled={!canViewChecklist} className="min-h-[44px] text-xs sm:text-sm px-1 sm:px-3">
              Checklist {canViewChecklist && `(${cards.length})`}
            </TabsTrigger>
            <TabsTrigger value="binder" disabled={!canViewChecklist} className="min-h-[44px] text-xs sm:text-sm px-1 sm:px-3">Binder</TabsTrigger>
            <TabsTrigger value="compare" className="min-h-[44px] text-xs sm:text-sm px-1 sm:px-3">Compare</TabsTrigger>
            <TabsTrigger value="cameos" className="min-h-[44px] text-xs sm:text-sm px-1 sm:px-3">Cameos</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="mt-4 sm:mt-8">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6 pb-24 sm:pb-0">
                <SavedSetlists
                  currentConfig={{
                    masterSetType,
                    variantFilters,
                    selectedSets,
                    selectedPokemon,
                    selectedTypes,
                    selectedArtists,
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
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                  selectedArtists={selectedArtists}
                  setSelectedArtists={setSelectedArtists}
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
                <BinderCalculator cardCount={cards.length} cardsPerPage={binderCardsPerPage} onCardsPerPageChange={setBinderCardsPerPage} />
                <BinderView cards={cards} setName={checklistName} storageKey={checklistKey} cardsPerPage={binderCardsPerPage} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="cameos" className="mt-4 sm:mt-8">
            <div className="max-w-5xl mx-auto">
              <CameoBrowser />
            </div>
          </TabsContent>

          <TabsContent value="compare" className="mt-4 sm:mt-8">
            <div className="max-w-7xl mx-auto">
              <ComparisonView />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Floating checklist button — mobile only, shown when cards are loaded on the builder tab */}
      {canViewChecklist && activeTab === 'builder' && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 sm:hidden px-4 pointer-events-none">
          <Button
            onClick={() => setActiveTab('checklist')}
            className="shadow-xl rounded-full px-6 h-12 text-sm font-semibold gap-2 pointer-events-auto"
          >
            <ClipboardText size={18} weight="bold" />
            {cards.length} cards — View Checklist →
          </Button>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;