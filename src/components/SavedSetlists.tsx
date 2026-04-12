import { useState } from 'react';
import type { SavedSetlist, MasterSetType, SortOrder, VariantFilters } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FloppyDisk, Trash, CaretRight, Plus, PencilSimple } from '@phosphor-icons/react';
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
  savedSetlists: SavedSetlist[];
  activeSetlistId: string | null;
  onLoad: (setlist: SavedSetlist) => void;
  onSave: (name: string) => SavedSetlist | null;
  onUpdate: (id: string, name?: string) => void;
  onDelete: (id: string) => void;
  onDeactivate: () => void;
}

export function SavedSetlists({
  currentConfig,
  savedSetlists,
  activeSetlistId,
  onLoad,
  onSave,
  onUpdate,
  onDelete,
  onDeactivate,
}: SavedSetlistsProps) {
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

    const saved = onSave(setlistName.trim());
    if (saved) {
      toast.success(`Setlist "${setlistName}" saved!`);
      setSetlistName('');
      setSaveDialogOpen(false);
    } else {
      toast.error('Failed to save setlist');
    }
  };

  const handleDelete = (id: string, name: string) => {
    onDelete(id);
    toast.success(`Deleted "${name}"`);
  };

  const handleLoad = (setlist: SavedSetlist) => {
    onLoad(setlist);
    toast.success(`Loaded "${setlist.name}"`);
  };

  const handleUpdateConfig = () => {
    if (!activeSetlistId) return;
    const active = savedSetlists.find(s => s.id === activeSetlistId);
    if (!active) return;
    onUpdate(activeSetlistId);
    toast.success(`Updated "${active.name}"`);
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
              <FloppyDisk size={24} />
              Saved Setlists
            </CardTitle>
            <CardDescription>Save and load your master set configurations with progress</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {activeSetlistId && (
              <>
                <Button variant="outline" onClick={handleUpdateConfig} className="gap-2">
                  <PencilSimple />
                  Save
                </Button>
                <Button variant="outline" onClick={onDeactivate} className="gap-2">
                  <Plus />
                  New
                </Button>
              </>
            )}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={!canSave} className="gap-2">
                  <FloppyDisk />
                  Save As
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Setlist</DialogTitle>
                  <DialogDescription>
                    Give your setlist a name to save it for later.
                    Your checked-card progress will be preserved.
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
        </div>
      </CardHeader>

      <CardContent>
        {savedSetlists.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No saved setlists yet</p>
            <p className="text-sm mt-2">Build a setlist and save it to get started</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {savedSetlists.map((setlist) => {
                const isActive = setlist.id === activeSetlistId;
                return (
                  <div
                    key={setlist.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isActive
                        ? 'border-primary/50 bg-primary/5'
                        : 'hover:bg-accent/5 hover:border-accent/30'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {setlist.name}
                        {isActive && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
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
                      {!isActive && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleLoad(setlist)}
                          className="gap-1"
                        >
                          <CaretRight />
                          Load
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(setlist.id, setlist.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
