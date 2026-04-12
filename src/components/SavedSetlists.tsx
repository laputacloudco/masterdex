import { useState } from 'react';
import { useKV } from '@/hooks/useKV';
import type { SavedSetlist, MasterSetType, SortOrder, VariantFilters } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FloppyDisk, Trash, FolderOpen, CaretRight } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface SavedSetlistsProps {
  currentConfig: {
    masterSetType: MasterSetType | undefined;
    variantFilters: VariantFilters | undefined;
    selectedSets: string[] | undefined;
    selectedPokemon: string[] | undefined;
    selectedTypes?: string[] | undefined;
    selectedArtists?: string[] | undefined;
    sortOrder: SortOrder | undefined;
    cardCount: number;
  };
  onLoad: (setlist: SavedSetlist) => void;
}

export function SavedSetlists({ currentConfig, onLoad }: SavedSetlistsProps) {
  const [savedSetlists, setSavedSetlists] = useKV<SavedSetlist[]>('saved-setlists', []);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [setlistName, setSetlistName] = useState('');

  const handleSave = () => {
    if (!setlistName.trim()) {
      toast.error('Please enter a name for your setlist');
      return;
    }

    if (!currentConfig.masterSetType) {
      toast.error('Please configure your setlist first');
      return;
    }

    const newSetlist: SavedSetlist = {
      id: `setlist-${Date.now()}`,
      name: setlistName.trim(),
      type: currentConfig.masterSetType,
      variantFilters: currentConfig.variantFilters || {
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
      },
      selectedSets: currentConfig.selectedSets || [],
      selectedPokemon: currentConfig.selectedPokemon || [],
      selectedTypes: currentConfig.selectedTypes || [],
      selectedArtists: currentConfig.selectedArtists || [],
      sortOrder: currentConfig.sortOrder || 'chronological',
      cardCount: currentConfig.cardCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSavedSetlists((current) => [...(current || []), newSetlist]);
    toast.success(`Setlist "${setlistName}" saved!`);
    setSetlistName('');
    setSaveDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setSavedSetlists((current) => (current || []).filter(s => s.id !== id));
    toast.success('Setlist deleted');
  };

  const handleLoad = (setlist: SavedSetlist) => {
    onLoad(setlist);
    toast.success(`Loaded "${setlist.name}"`);
  };

  const getTypeLabel = (type: MasterSetType) => {
    switch (type) {
      case 'official-set': return 'Official Set';
      case 'pokemon-collection': return 'Pokemon Collection';
      case 'type-collection': return 'Type Collection';
      case 'artist-collection': return 'Artist Collection';
    }
  };

  const canSave = currentConfig.cardCount > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen size={24} />
              Saved Setlists
            </CardTitle>
            <CardDescription>Save and load your master set configurations</CardDescription>
          </div>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!canSave} className="gap-2">
                <FloppyDisk />
                Save Current
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Setlist</DialogTitle>
                <DialogDescription>
                  Give your setlist a name to save it for later
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="setlist-name" className="text-sm font-medium">
                    Setlist Name
                  </label>
                  <Input
                    id="setlist-name"
                    placeholder="My Charizard Collection"
                    value={setlistName}
                    onChange={(e) => setSetlistName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  />
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Type: {getTypeLabel(currentConfig.masterSetType || 'pokemon-collection')}</div>
                  <div>Cards: {currentConfig.cardCount}</div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {!savedSetlists || savedSetlists.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No saved setlists yet</p>
            <p className="text-sm mt-2">Build a setlist and save it to get started</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {savedSetlists.map((setlist) => (
                <div
                  key={setlist.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/5 hover:border-accent/30 transition-all"
                >
                  <div className="flex-1">
                    <div className="font-medium">{setlist.name}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(setlist.type)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {setlist.cardCount} cards
                      </Badge>
                      {setlist.selectedPokemon.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {setlist.selectedPokemon.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLoad(setlist)}
                      className="gap-1"
                    >
                      <CaretRight />
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(setlist.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
