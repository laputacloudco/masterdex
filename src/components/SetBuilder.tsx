import { useState } from 'react';
import type { MasterSetType, SortOrder } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkle } from '@phosphor-icons/react';
import { PokemonSelector } from './PokemonSelector';
import { SetSelector } from './SetSelector';

interface SetBuilderProps {
  onGenerate: (config: {
    type: MasterSetType;
    includeAllVariants: boolean;
    selectedSets: string[];
    selectedPokemon: string[];
    sortOrder: SortOrder;
  }) => void;
  isGenerating?: boolean;
}

export function SetBuilder({ onGenerate, isGenerating }: SetBuilderProps) {
  const [masterSetType, setMasterSetType] = useState<MasterSetType>('pokemon-collection');
  const [includeAllVariants, setIncludeAllVariants] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>('chronological');
  const [selectedPokemon, setSelectedPokemon] = useState<string[]>([]);
  const [selectedSets, setSelectedSets] = useState<string[]>([]);

  const handleGenerate = () => {
    onGenerate({
      type: masterSetType,
      includeAllVariants,
      selectedSets,
      selectedPokemon,
      sortOrder,
    });
  };

  const canGenerate = 
    (masterSetType === 'official-set' && selectedSets.length > 0) ||
    ((masterSetType === 'pokemon-collection' || masterSetType === 'evolution-chain') && selectedPokemon.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Master Set Type</CardTitle>
          <CardDescription>Choose what kind of collection you want to build</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={masterSetType} onValueChange={(v) => setMasterSetType(v as MasterSetType)}>
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
            checked={includeAllVariants}
            onCheckedChange={setIncludeAllVariants}
          />
        </CardContent>
      </Card>

      {masterSetType === 'official-set' ? (
        <SetSelector 
          selectedSets={selectedSets}
          onSelectSet={(setCode) => {
            if (!selectedSets.includes(setCode)) {
              setSelectedSets([...selectedSets, setCode]);
            }
          }}
          onRemoveSet={(setCode) => {
            setSelectedSets(selectedSets.filter(s => s !== setCode));
          }}
        />
      ) : (
        <PokemonSelector
          selectedPokemon={selectedPokemon}
          onSelectPokemon={(pokemon) => {
            if (Array.isArray(pokemon)) {
              setSelectedPokemon([...selectedPokemon, ...pokemon]);
            } else {
              if (!selectedPokemon.includes(pokemon)) {
                setSelectedPokemon([...selectedPokemon, pokemon]);
              }
            }
          }}
          onRemovePokemon={(pokemon) => {
            setSelectedPokemon(selectedPokemon.filter(p => p !== pokemon));
          }}
          showEvolutionChain={masterSetType === 'evolution-chain'}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sort Order</CardTitle>
          <CardDescription>How should cards be organized in your checklist</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {masterSetType === 'official-set' && (
                <SelectItem value="set-order">Set Order (Card Number)</SelectItem>
              )}
              <SelectItem value="chronological">Chronological (Release Date)</SelectItem>
              <SelectItem value="grouped-by-set">Grouped by Set</SelectItem>
              {masterSetType === 'evolution-chain' && (
                <SelectItem value="evolution-chain">Evolution Chain Order</SelectItem>
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Button 
        onClick={handleGenerate} 
        disabled={!canGenerate || isGenerating}
        size="lg"
        className="bg-accent text-accent-foreground hover:bg-accent/90"
      >
        <Sparkle className="mr-2" weight="fill" />
        {isGenerating ? 'Generating...' : 'Generate Master Set Checklist'}
      </Button>
    </div>
  );
}
