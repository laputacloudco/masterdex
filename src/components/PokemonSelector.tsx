import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MagnifyingGlass, X, Lightning } from '@phosphor-icons/react';
import { searchPokemon } from '@/lib/pokemonTcgApi';
import { getEvolutionChain } from '@/lib/pokemonData';

interface PokemonSelectorProps {
  selectedPokemon: string[];
  onSelectPokemon: (pokemon: string | string[]) => void;
  onRemovePokemon: (pokemon: string) => void;
  includeEvolutionChain: boolean;
  setIncludeEvolutionChain: (value: boolean) => void;
}

export function PokemonSelector({ 
  selectedPokemon, 
  onSelectPokemon, 
  onRemovePokemon,
  includeEvolutionChain,
  setIncludeEvolutionChain
}: PokemonSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchPokemon(searchTerm);
        const filtered = results.filter(name => !selectedPokemon.includes(name));
        setSearchResults(filtered);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedPokemon]);

  const handleSelect = (pokemon: string) => {
    if (includeEvolutionChain) {
      const chain = getEvolutionChain(pokemon);
      const newPokemon = chain.filter(p => !selectedPokemon.includes(p));
      if (newPokemon.length > 0) {
        onSelectPokemon(newPokemon);
      }
    } else {
      onSelectPokemon(pokemon);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightning weight="fill" className="text-primary" />
          Select Pokemon
        </CardTitle>
        <CardDescription>
          Choose which Pokemon to include in your master set
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
          <Switch
            id="evolution-chain-toggle"
            checked={includeEvolutionChain}
            onCheckedChange={setIncludeEvolutionChain}
          />
          <div className="flex-1">
            <Label htmlFor="evolution-chain-toggle" className="cursor-pointer font-medium">
              Include Evolution Chains
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automatically add full evolution lines when selecting Pokemon
            </p>
          </div>
        </div>

        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="pokemon-search"
            placeholder="Search Pokemon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {searchTerm && searchResults.length > 0 && (
          <div className="border rounded-lg p-2 max-h-48 overflow-y-auto space-y-1">
            {searchResults.slice(0, 10).map(pokemon => (
              <button
                key={pokemon}
                onClick={() => handleSelect(pokemon)}
                className="w-full text-left px-3 py-2 rounded hover:bg-accent transition-colors"
              >
                <span className="font-medium">{pokemon}</span>
                {includeEvolutionChain && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    + Evolution Chain
                  </Badge>
                )}
              </button>
            ))}
          </div>
        )}

        {isSearching && searchTerm.length >= 2 && (
          <p className="text-sm text-muted-foreground">Searching...</p>
        )}

        {selectedPokemon.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Selected Pokemon ({selectedPokemon.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedPokemon.map(pokemon => (
                <Badge key={pokemon} variant="secondary" className="gap-2">
                  {pokemon}
                  <button
                    onClick={() => onRemovePokemon(pokemon)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
