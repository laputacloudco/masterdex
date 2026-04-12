import type { MasterSetType, SortOrder, VariantFilters } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
  import { CircleNotch, Sparkle, Star, Lightning, Trophy, Gift, Handshake, UserCircle } from '@phosphor-icons/react';
import { PokemonSelector } from './PokemonSelector';
import { SetSelector } from './SetSelector';
import { TypeSelector } from './TypeSelector';
import { ArtistSelector } from './ArtistSelector';

interface SetBuilderProps {
  masterSetType: MasterSetType | undefined;
  setMasterSetType: (value: MasterSetType) => void;
  variantFilters: VariantFilters | undefined;
  setVariantFilters: (value: VariantFilters) => void;
  sortOrder: SortOrder | undefined;
  setSortOrder: (value: SortOrder) => void;
  selectedPokemon: string[] | undefined;
  setSelectedPokemon: (value: string[]) => void;
  selectedSets: string[] | undefined;
  setSelectedSets: (value: string[]) => void;
  selectedTypes?: string[] | undefined;
  setSelectedTypes?: (value: string[]) => void;
  selectedArtists?: string[] | undefined;
  setSelectedArtists?: (value: string[]) => void;
  includeEvolutionChain?: boolean | undefined;
  setIncludeEvolutionChain?: (value: boolean) => void;
  uniqueArtOnly?: boolean | undefined;
  setUniqueArtOnly?: (value: boolean) => void;
  isLoading: boolean;
  cardCount: number;
  missingVariantData?: boolean;
  onViewChecklist?: () => void;
}

const DEFAULT_VARIANT_FILTERS: VariantFilters = {
  normal: true,
  holo: true,
  reverseHolo: true,
  fullArt: true,
  secretRare: true,
  rainbowRare: true,
  gold: true,
  promo: true,
  collab: true,
  tournament: true,
  cameo: true,
};

export function SetBuilder({
  masterSetType,
  setMasterSetType,
  variantFilters,
  setVariantFilters,
  sortOrder,
  setSortOrder,
  selectedPokemon,
  setSelectedPokemon,
  selectedSets,
  setSelectedSets,
  selectedTypes,
  setSelectedTypes,
  selectedArtists,
  setSelectedArtists,
  uniqueArtOnly,
  setUniqueArtOnly,
  isLoading,
  cardCount,
  missingVariantData,
  onViewChecklist,
}: SetBuilderProps) {
  const currentMasterSetType = masterSetType || 'pokemon-collection';
  const currentVariantFilters = variantFilters || DEFAULT_VARIANT_FILTERS;
  const currentSortOrder = sortOrder || 'chronological';
  const currentSelectedPokemon = selectedPokemon || [];
  const currentSelectedSets = selectedSets || [];
  const currentSelectedTypes = selectedTypes || [];
  const currentSelectedArtists = selectedArtists || [];

  const handleVariantToggle = (variant: keyof VariantFilters) => {
    setVariantFilters({
      ...currentVariantFilters,
      [variant]: !currentVariantFilters[variant],
    });
  };

  const applyCommonPreset = () => {
    setVariantFilters({
      normal: true,
      holo: true,
      reverseHolo: true,
      fullArt: false,
      secretRare: false,
      rainbowRare: false,
      gold: false,
      promo: false,
      collab: false,
      tournament: false,
      cameo: false,
    });
  };

  const applyRarePreset = () => {
    setVariantFilters({
      normal: false,
      holo: false,
      reverseHolo: false,
      fullArt: true,
      secretRare: true,
      rainbowRare: true,
      gold: true,
      promo: true,
      collab: true,
      tournament: true,
      cameo: false,
    });
  };

  const selectAll = () => {
    setVariantFilters({
      normal: true,
      holo: true,
      reverseHolo: true,
      fullArt: true,
      secretRare: true,
      rainbowRare: true,
      gold: true,
      promo: true,
      collab: true,
      tournament: true,
      cameo: true,
    });
  };

  const clearAll = () => {
    setVariantFilters({
      normal: false,
      holo: false,
      reverseHolo: false,
      fullArt: false,
      secretRare: false,
      rainbowRare: false,
      gold: false,
      promo: false,
      collab: false,
      tournament: false,
      cameo: false,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Master Set Type</CardTitle>
          <CardDescription>Choose what kind of collection you want to build</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={currentMasterSetType} onValueChange={(v) => setMasterSetType(v as MasterSetType)}>
            <div className="flex items-center space-x-2 min-h-[44px]">
              <RadioGroupItem value="official-set" id="official-set" />
              <Label htmlFor="official-set" className="cursor-pointer text-sm sm:text-base">
                Official Set — All cards from a specific set release
              </Label>
            </div>
            <div className="flex items-center space-x-2 min-h-[44px]">
              <RadioGroupItem value="pokemon-collection" id="pokemon-collection" />
              <Label htmlFor="pokemon-collection" className="cursor-pointer text-sm sm:text-base">
                Pokemon Collection — All cards featuring specific Pokemon
              </Label>
            </div>
            <div className="flex items-center space-x-2 min-h-[44px]">
              <RadioGroupItem value="type-collection" id="type-collection" />
              <Label htmlFor="type-collection" className="cursor-pointer text-sm sm:text-base">
                Type Collection — All cards of a specific Pokemon type
              </Label>
            </div>
            <div className="flex items-center space-x-2 min-h-[44px]">
              <RadioGroupItem value="artist-collection" id="artist-collection" />
              <Label htmlFor="artist-collection" className="cursor-pointer text-sm sm:text-base">
                Artist Collection — All cards by a specific artist
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Card Variants</CardTitle>
          <CardDescription>Select which card variants to include in your checklist</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
              <Switch
                id="unique-art-toggle"
                checked={!(uniqueArtOnly ?? false)}
                onCheckedChange={(checked) => setUniqueArtOnly?.(!checked)}
              />
              <div className="flex-1">
                <Label htmlFor="unique-art-toggle" className="cursor-pointer font-medium">
                  {uniqueArtOnly ? 'Unique Art Only' : 'All Variants'}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {uniqueArtOnly
                    ? 'One entry per card number — no reverse holo / holo duplicates'
                    : 'Separate entries for each printing variant (reverse holo, 1st edition, etc.)'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={applyCommonPreset}
                className="flex items-center gap-2 min-h-[44px]"
              >
                <span>Common Only</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={applyRarePreset}
                className="flex items-center gap-2 min-h-[44px]"
              >
                <Star size={16} weight="fill" />
                <span>Rare Only</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                className="flex items-center gap-2 min-h-[44px]"
              >
                <span>Select All</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="flex items-center gap-2 min-h-[44px]"
              >
                <span>Clear All</span>
              </Button>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">Standard Variants</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <Checkbox
                    id="variant-normal"
                    checked={currentVariantFilters.normal}
                    onCheckedChange={() => handleVariantToggle('normal')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="variant-normal" className="cursor-pointer font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-slate-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">N</span>
                      </div>
                      Normal Cards
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Standard non-holo cards
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <Checkbox
                    id="variant-holo"
                    checked={currentVariantFilters.holo}
                    onCheckedChange={() => handleVariantToggle('holo')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="variant-holo" className="cursor-pointer font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
                        <Sparkle size={12} weight="fill" className="text-white" />
                      </div>
                      Holo & Special Finishes
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Standard holographic variants
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <Checkbox
                    id="variant-reverse-holo"
                    checked={currentVariantFilters.reverseHolo}
                    onCheckedChange={() => handleVariantToggle('reverseHolo')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="variant-reverse-holo" className="cursor-pointer font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-cyan-500 flex items-center justify-center">
                        <Sparkle size={12} weight="fill" className="text-white" />
                      </div>
                      Reverse Holo
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cards with holographic backgrounds
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">Ultra Rare Variants</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <Checkbox
                    id="variant-full-art"
                    checked={currentVariantFilters.fullArt}
                    onCheckedChange={() => handleVariantToggle('fullArt')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="variant-full-art" className="cursor-pointer font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-purple-500 flex items-center justify-center">
                        <Star size={12} weight="fill" className="text-white" />
                      </div>
                      Full Art
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ultra rare full-art illustrations
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <Checkbox
                    id="variant-secret-rare"
                    checked={currentVariantFilters.secretRare}
                    onCheckedChange={() => handleVariantToggle('secretRare')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="variant-secret-rare" className="cursor-pointer font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-pink-500 flex items-center justify-center">
                        <Star size={12} weight="fill" className="text-white" />
                      </div>
                      Secret Rare
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Secret rare cards beyond set number
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <Checkbox
                    id="variant-rainbow-rare"
                    checked={currentVariantFilters.rainbowRare}
                    onCheckedChange={() => handleVariantToggle('rainbowRare')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="variant-rainbow-rare" className="cursor-pointer font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 flex items-center justify-center">
                        <Lightning size={12} weight="fill" className="text-white" />
                      </div>
                      Rainbow Rare
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Hyper rare rainbow holographic cards
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <Checkbox
                    id="variant-gold"
                    checked={currentVariantFilters.gold}
                    onCheckedChange={() => handleVariantToggle('gold')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="variant-gold" className="cursor-pointer font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-yellow-500 flex items-center justify-center">
                        <Lightning size={12} weight="fill" className="text-white" />
                      </div>
                      Gold Cards
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Gold & golden secret rares
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">Special Releases</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <Checkbox
                    id="variant-promo"
                    checked={currentVariantFilters.promo}
                    onCheckedChange={() => handleVariantToggle('promo')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="variant-promo" className="cursor-pointer font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
                        <Gift size={12} weight="fill" className="text-white" />
                      </div>
                      Promo Cards
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Official promo releases & giveaways
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <Checkbox
                    id="variant-collab"
                    checked={currentVariantFilters.collab}
                    onCheckedChange={() => handleVariantToggle('collab')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="variant-collab" className="cursor-pointer font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                        <Handshake size={12} weight="fill" className="text-white" />
                      </div>
                      Collaborations
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      McDonald's, GameStop & other collabs
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <Checkbox
                    id="variant-tournament"
                    checked={currentVariantFilters.tournament}
                    onCheckedChange={() => handleVariantToggle('tournament')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="variant-tournament" className="cursor-pointer font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-amber-600 flex items-center justify-center">
                        <Trophy size={12} weight="fill" className="text-white" />
                      </div>
                      Tournament Prizes
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Official tournament prize cards
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <Checkbox
                    id="variant-cameo"
                    checked={currentVariantFilters.cameo}
                    onCheckedChange={() => handleVariantToggle('cameo')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="variant-cameo" className="cursor-pointer font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-indigo-500 flex items-center justify-center">
                        <UserCircle size={12} weight="fill" className="text-white" />
                      </div>
                      Cameo Cards
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pokemon appearing in other Pokemon's cards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentMasterSetType === 'official-set' && (
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
      )}
      {currentMasterSetType === 'pokemon-collection' && (
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
        />
      )}
      {currentMasterSetType === 'type-collection' && setSelectedTypes && (
        <TypeSelector
          selectedTypes={currentSelectedTypes}
          onSelectType={(type) => {
            if (!currentSelectedTypes.includes(type)) {
              setSelectedTypes([...currentSelectedTypes, type]);
            }
          }}
          onRemoveType={(type) => {
            setSelectedTypes(currentSelectedTypes.filter(t => t !== type));
          }}
        />
      )}
      {currentMasterSetType === 'artist-collection' && setSelectedArtists && (
        <ArtistSelector
          selectedArtists={currentSelectedArtists}
          onSelectArtist={(artist) => {
            if (!currentSelectedArtists.includes(artist)) {
              setSelectedArtists([...currentSelectedArtists, artist]);
            }
          }}
          onRemoveArtist={(artist) => {
            setSelectedArtists(currentSelectedArtists.filter(a => a !== artist));
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sort Order</CardTitle>
          <CardDescription>How should cards be organized in your checklist</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={currentSortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
            <SelectTrigger className="min-h-[44px] w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentMasterSetType === 'official-set' && (
                <SelectItem value="set-order">Set Order (Card Number)</SelectItem>
              )}
              <SelectItem value="chronological">Chronological (Release Date)</SelectItem>
              <SelectItem value="grouped-by-set">Grouped by Set</SelectItem>
              {currentMasterSetType === 'pokemon-collection' && (
                <SelectItem value="grouped-by-pokemon">Grouped by Pokemon</SelectItem>
              )}
              {currentMasterSetType === 'pokemon-collection' && (
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
        <>
          <Card
            className="hidden sm:block bg-primary/10 border-primary/30 cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={onViewChecklist}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="text-sm sm:text-base px-4 py-2 w-full sm:w-auto text-center min-h-[44px] flex items-center justify-center">
                  {cardCount} cards loaded — view checklist →
                </Badge>
              </div>
              {missingVariantData && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  ⚠ Variant data (reverse holo, etc.) is not yet available for this set from TCGPlayer.
                  Only one entry per card number is shown. Variants will appear as pricing data becomes available.
                </p>
              )}
            </CardContent>
          </Card>
          {missingVariantData && (
            <p className="sm:hidden text-xs text-muted-foreground text-center">
              ⚠ Variant data (reverse holo, etc.) is not yet available for this set from TCGPlayer.
              Only one entry per card number is shown. Variants will appear as pricing data becomes available.
            </p>
          )}
        </>
      )}
    </div>
  );
}
