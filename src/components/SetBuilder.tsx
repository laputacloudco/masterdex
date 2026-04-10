import type { MasterSetType, SortOrder } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CircleNotch } from '@phosphor-icons/react';
import { PokemonSelector } from './PokemonSelector';
import { SetSelector } from './SetSelector';

interface SetBuilderProps {
  masterSetType: MasterSetType | undefined;
  setMasterSetType: (value: MasterSetType) => void;
  includeAllVariants: boolean | undefined;
  setIncludeAllVariants: (value: boolean) => void;
  sortOrder: SortOrder | undefined;
  setSortOrder: (value: SortOrder) => void;
  selectedPokemon: string[] | undefined;
  setSelectedPokemon: (value: string[]) => void;
  selectedSets: string[] | undefined;
  setSelectedSets: (value: string[]) => void;
  isLoading: boolean;
  cardCount: number;
}

export function SetBuilder({
  masterSetType,
  setMasterSetType,
  includeAllVariants,
  setIncludeAllVariants,
  sortOrder,
  setSortOrder,
  selectedPokemon,
  setSelectedPokemon,
  selectedSets,
  setSelectedSets,
  isLoading,
  cardCount,
}: SetBuilderProps) {
  const currentMasterSetType = masterSetType || 'pokemon-collection';
  const currentIncludeAllVariants = includeAllVariants ?? true;
  const currentSortOrder = sortOrder || 'chronological';
  const currentSelectedPokemon = selectedPokemon || [];
  const currentSelectedSets = selectedSets || [];

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Master Set Type</CardTitle>
          <CardDescription>Choose what kind of collection you want to build</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={currentMasterSetType} onValueChange={(v) => setMasterSetType(v as MasterSetType)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="official-set" id="official-set" />
              <Label htmlFor="official-set" className="cursor-pointer">
                Official Set - All cards from a specific set release
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pokemon-collection" id="pokemon-collection" />
              <Label htmlFor="pokemon-collection" className="cursor-pointer">
                Pokemon Collection - All cards featuring specific Pokemon
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="evolution-chain" id="evolution-chain" />
              <Label htmlFor="evolution-chain" className="cursor-pointer">
                Evolution Chain - Complete evolution lines across all sets
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Card Variants</CardTitle>
          <CardDescription>Include all variants or only unique artwork</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="variants-toggle" className="text-base">
              Include All Variants
            </Label>
            <p className="text-sm text-muted-foreground">
              Holos, reverse holos, promos, and special releases
            </p>
          </div>
          <Switch
            id="variants-toggle"
            checked={currentIncludeAllVariants}
            onCheckedChange={setIncludeAllVariants}
          />
        </CardContent>
      </Card>

      {currentMasterSetType === 'official-set' ? (
        <SetSelector 
          selectedSets={currentSelectedSets}
          onSelectSet={(setCode) => {
            if (!currentSelectedSets.includes(setCode)) {
              setSelectedSets([...currentSelectedSets, setCode]);
            }
          }}
          onRemoveSet={(setCode) => {
            setSelectedSets(currentSelectedSets.filter(s => s !== setCode));
          }}
        />
      ) : (
        <PokemonSelector
          selectedPokemon={currentSelectedPokemon}
          onSelectPokemon={(pokemon) => {
            if (Array.isArray(pokemon)) {
              setSelectedPokemon([...currentSelectedPokemon, ...pokemon]);
            } else {
              if (!currentSelectedPokemon.includes(pokemon)) {
                setSelectedPokemon([...currentSelectedPokemon, pokemon]);
              }
            }
          }}
          onRemovePokemon={(pokemon) => {
            setSelectedPokemon(currentSelectedPokemon.filter(p => p !== pokemon));
          }}
          showEvolutionChain={currentMasterSetType === 'evolution-chain'}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sort Order</CardTitle>
          <CardDescription>How should cards be organized in your checklist</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={currentSortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentMasterSetType === 'official-set' && (
                <SelectItem value="set-order">Set Order (Card Number)</SelectItem>
              )}
              <SelectItem value="chronological">Chronological (Release Date)</SelectItem>
              <SelectItem value="grouped-by-set">Grouped by Set</SelectItem>
              {currentMasterSetType === 'evolution-chain' && (
                <SelectItem value="evolution-chain">Evolution Chain Order</SelectItem>
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="bg-accent/10 border-accent/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3 text-accent-foreground">
              <CircleNotch className="animate-spin" size={24} />
              <span className="text-sm font-medium">Loading cards...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && cardCount > 0 && (
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-base px-4 py-2">
                {cardCount} cards loaded
              </Badge>
              <span className="text-sm text-muted-foreground">
                Switch to Checklist tab to view
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
