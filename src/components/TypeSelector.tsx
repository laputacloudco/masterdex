import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Drop, Fire, Leaf, Lightning as LightningIcon, HandFist, Eye, Moon, Shield, StarFour, Circle } from '@phosphor-icons/react';

const POKEMON_TYPES = [
  { name: 'Colorless', color: 'bg-gray-400', icon: Circle },
  { name: 'Darkness', color: 'bg-purple-900', icon: Moon },
  { name: 'Dragon', color: 'bg-amber-500', icon: StarFour },
  { name: 'Fairy', color: 'bg-pink-400', icon: StarFour },
  { name: 'Fighting', color: 'bg-amber-700', icon: HandFist },
  { name: 'Fire', color: 'bg-red-500', icon: Fire },
  { name: 'Grass', color: 'bg-green-500', icon: Leaf },
  { name: 'Lightning', color: 'bg-yellow-400', icon: LightningIcon },
  { name: 'Metal', color: 'bg-slate-400', icon: Shield },
  { name: 'Psychic', color: 'bg-purple-500', icon: Eye },
  { name: 'Water', color: 'bg-blue-500', icon: Drop },
] as const;

interface TypeSelectorProps {
  selectedTypes: string[];
  onSelectType: (type: string) => void;
  onRemoveType: (type: string) => void;
}

export function TypeSelector({ selectedTypes, onSelectType, onRemoveType }: TypeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fire weight="fill" className="text-primary" />
          Select Pokemon Types
        </CardTitle>
        <CardDescription>
          Choose one or more Pokemon types to collect all cards of that type
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {POKEMON_TYPES.map(({ name, color, icon: Icon }) => {
            const isSelected = selectedTypes.includes(name);
            return (
              <button
                key={name}
                onClick={() => isSelected ? onRemoveType(name) : onSelectType(name)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all min-h-[44px] ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                    : 'border-border bg-card hover:bg-accent/10 text-foreground'
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={14} weight="fill" className="text-white" />
                </div>
                {name}
              </button>
            );
          })}
        </div>

        {selectedTypes.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Selected Types ({selectedTypes.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedTypes.map(type => {
                const typeInfo = POKEMON_TYPES.find(t => t.name === type);
                const Icon = typeInfo?.icon || Circle;
                return (
                  <Badge key={type} variant="secondary" className="gap-2 min-h-[44px] flex items-center">
                    <div className={`w-4 h-4 rounded-full ${typeInfo?.color || 'bg-gray-400'} flex items-center justify-center`}>
                      <Icon size={10} weight="fill" className="text-white" />
                    </div>
                    {type}
                    <button
                      onClick={() => onRemoveType(type)}
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
