import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MagnifyingGlass, X, Lightning } from '@phosphor-icons/react';
import { searchPokemon } from '@/lib/pokemonTcgApi';
import { getEvolutionChain } from '@/lib/pokemonData';

interface PokemonSelectorProps {
  selectedPokemon: string[];
  onSelectPokemon: (pokemon: string | string[]) => void;
  onRemovePokemon: (pokemon: string) => void;
}

export function PokemonSelector({ 
  selectedPokemon, 
  onSelectPokemon, 
  onRemovePokemon,
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
    onSelectPokemon(pokemon);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSelectWithEvolutions = (pokemon: string) => {
    const chain = getEvolutionChain(pokemon);
    const newPokemon = chain.filter(p => !selectedPokemon.includes(p));
    if (newPokemon.length > 0) {
      onSelectPokemon(newPokemon);
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
            {searchResults.slice(0, 10).map(pokemon => {
              const chain = getEvolutionChain(pokemon);
              const hasEvolutions = chain.length > 1;
              return (
                <div key={pokemon} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent transition-colors">
                  <button
                    onClick={() => handleSelect(pokemon)}
                    className="flex-1 text-left"
                  >
                    <span className="font-medium">{pokemon}</span>
                  </button>
                  {hasEvolutions && (
                    <button
                      onClick={() => handleSelectWithEvolutions(pokemon)}
                    >
                      <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
                        + evolutions
                      </Badge>
                    </button>
                  )}
                </div>
              );
            })}
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
