import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Cards } from '@phosphor-icons/react';
import { POKEMON_SETS } from '@/lib/pokemonData';

interface SetSelectorProps {
  selectedSets: string[];
  onSelectSet: (setCode: string) => void;
  onRemoveSet: (setCode: string) => void;
}

export function SetSelector({ selectedSets, onSelectSet, onRemoveSet }: SetSelectorProps) {
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
          <div className="space-y-1">
            {POKEMON_SETS.map(set => {
              const isSelected = selectedSets.includes(set.code);
              return (
                <button
                  key={set.code}
                  onClick={() => !isSelected && onSelectSet(set.code)}
                  disabled={isSelected}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
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
        </ScrollArea>

        {selectedSets.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Selected Sets ({selectedSets.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedSets.map(setCode => {
                const set = POKEMON_SETS.find(s => s.code === setCode);
                return (
                  <Badge key={setCode} variant="secondary" className="gap-2">
                    {set?.name || setCode}
                    <button
                      onClick={() => onRemoveSet(setCode)}
                      className="hover:text-destructive transition-colors"
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
