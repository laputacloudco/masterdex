import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Cards, CircleNotch } from '@phosphor-icons/react';
import { fetchAllSets } from '@/lib/pokemonTcgApi';
import type { PokemonSet } from '@/lib/types';

interface SetSelectorProps {
  selectedSets: string[];
  onSelectSet: (setCode: string) => void;
  onRemoveSet: (setCode: string) => void;
}

export function SetSelector({ selectedSets, onSelectSet, onRemoveSet }: SetSelectorProps) {
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSets = async () => {
      try {
        const allSets = await fetchAllSets();
        setSets(allSets);
      } catch (error) {
        console.error('Failed to load sets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSets();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cards weight="fill" className="text-secondary" />
          Select Official Set
        </CardTitle>
        <CardDescription>
          Choose one or more official Pokemon TCG sets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-64 rounded-lg border p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <CircleNotch className="animate-spin text-muted-foreground" size={32} />
            </div>
          ) : (
            <div className="space-y-1">
              {sets.map(set => {
                const isSelected = selectedSets.includes(set.code);
                return (
                  <button
                    key={set.code}
                    onClick={() => !isSelected && onSelectSet(set.code)}
                    disabled={isSelected}
                    className={`w-full text-left px-3 py-2 rounded transition-colors min-h-[44px] ${
                      isSelected 
                        ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{set.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(set.releaseDate).getFullYear()} • {set.totalCards} cards
                        </p>
                      </div>
                      {isSelected && (
                        <Badge variant="secondary">Selected</Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {selectedSets.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Selected Sets ({selectedSets.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedSets.map(setCode => {
                const set = sets.find(s => s.code === setCode);
                return (
                  <Badge key={setCode} variant="secondary" className="gap-2 min-h-[44px] flex items-center">
                    {set?.name || setCode}
                    <button
                      onClick={() => onRemoveSet(setCode)}
                      className="hover:text-destructive transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
