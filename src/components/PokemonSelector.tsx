import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MagnifyingGlass, X, Lightning } from '@phosphor-icons/react';
import { POKEMON_SPECIES, getEvolutionChain } from '@/lib/pokemonData';

interface PokemonSelectorProps {
  selectedPokemon: string[];
  onSelectPokemon: (pokemon: string) => void;
  onRemovePokemon: (pokemon: string) => void;
  showEvolutionChain?: boolean;
}

export function PokemonSelector({ 
  selectedPokemon, 
  onSelectPokemon, 
  onRemovePokemon,
  showEvolutionChain 
}: PokemonSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const allPokemon = Object.values(POKEMON_SPECIES).map(s => s.name);
  const filteredPokemon = allPokemon.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !selectedPokemon.includes(name)
  );

  const handleSelect = (pokemon: string) => {
    if (showEvolutionChain) {
      const chain = getEvolutionChain(pokemon);
      chain.forEach(p => {
        if (!selectedPokemon.includes(p)) {
          onSelectPokemon(p);
        }
      });
    } else {
      onSelectPokemon(pokemon);
    }
    setSearchTerm('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightning weight="fill" className="text-primary" />
          {showEvolutionChain ? 'Select Evolution Chain' : 'Select Pokemon'}
        </CardTitle>
        <CardDescription>
          {showEvolutionChain 
            ? 'Add Pokemon to include their full evolution lines' 
            : 'Choose which Pokemon to include in your master set'
          }
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

        {searchTerm && filteredPokemon.length > 0 && (
          <div className="border rounded-lg p-2 max-h-48 overflow-y-auto space-y-1">
            {filteredPokemon.slice(0, 10).map(pokemon => (
              <button
                key={pokemon}
                onClick={() => handleSelect(pokemon)}
                className="w-full text-left px-3 py-2 rounded hover:bg-accent transition-colors"
              >
                {pokemon}
                {showEvolutionChain && (
                  <span className="text-xs text-muted-foreground ml-2">
                    + Evolution Chain
                  </span>
                )}
              </button>
            ))}
          </div>
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
