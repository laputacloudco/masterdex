import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MagnifyingGlass, X, Lightning, ArrowRight } from '@phosphor-icons/react';
import { searchPokemon } from '@/lib/pokemonTcgApi';
import { getEvolutionChain } from '@/lib/pokeApi';

interface PokemonSelectorProps {
  selectedPokemon: string[];
  onSelectPokemon: (pokemon: string | string[]) => void;
  onRemovePokemon: (pokemon: string) => void;
}

interface SearchResult {
  name: string;
  chain: string[];
}

export function PokemonSelector({ 
  selectedPokemon, 
  onSelectPokemon, 
  onRemovePokemon,
}: PokemonSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const names = await searchPokemon(searchTerm);
        const filtered = names.filter(name => !selectedPokemon.includes(name));
        // Fetch evolution chains for each result
        const results = await Promise.all(
          filtered.slice(0, 10).map(async (name) => {
            const chain = await getEvolutionChain(name);
            return { name, chain };
          })
        );
        setSearchResults(results);
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

  const handleSelectSingle = (pokemon: string) => {
    onSelectPokemon(pokemon);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSelectChain = (chain: string[]) => {
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
          Add individual Pokemon or entire evolution chains
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
            className="pl-10 min-h-[44px]"
          />
        </div>

        {searchTerm && searchResults.length > 0 && (
          <div className="border rounded-lg p-2 max-h-64 overflow-y-auto space-y-1">
            {searchResults.map(({ name, chain }) => (
              <div key={name} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 px-3 py-2 rounded hover:bg-muted/50 transition-colors">
                <button
                  onClick={() => handleSelectSingle(name)}
                  className="font-medium hover:text-primary transition-colors min-h-[44px] text-left"
                >
                  {name}
                </button>
                {chain.length > 1 && (
                  <button
                    onClick={() => handleSelectChain(chain)}
                    className="sm:ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border rounded-full px-2.5 py-1 hover:border-primary/50 min-h-[44px]"
                  >
                    <ArrowRight size={12} weight="bold" />
                    <span className="break-all">{chain.join(' → ')}</span>
                  </button>
                )}
              </div>
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
                <Badge key={pokemon} variant="secondary" className="gap-2 min-h-[44px] flex items-center">
                  {pokemon}
                  <button
                    onClick={() => onRemovePokemon(pokemon)}
                    className="hover:text-destructive transition-colors p-1"
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
