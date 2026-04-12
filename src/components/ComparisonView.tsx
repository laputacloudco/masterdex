import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MagnifyingGlass, X, Plus, Scales, ImageBroken } from '@phosphor-icons/react';
import { searchPokemon, fetchCardsForPokemon, deduplicateCards } from '@/lib/pokemonTcgApi';
import type { PokemonCard } from '@/lib/types';
import { getVariantLabel } from '@/lib/cardUtils';
import { CardPreview } from './CardPreview';

const MAX_COLUMNS = 4;

interface ComparisonColumn {
  pokemonName: string;
  cards: PokemonCard[];
  isLoading: boolean;
}

function formatPrice(price: number | undefined): string {
  if (price == null) return '—';
  return `$${price.toFixed(2)}`;
}

function ColumnStats({ cards }: { cards: PokemonCard[] }) {
  const stats = useMemo(() => {
    const priced = cards.filter((c) => c.marketPrice != null);
    const prices = priced.map((c) => c.marketPrice!);
    const totalValue = prices.reduce((s, p) => s + p, 0);
    const earliest = cards.length
      ? cards.reduce((a, b) => (a.releaseDate < b.releaseDate ? a : b))
      : null;
    return {
      totalCards: cards.length,
      totalValue,
      pricedCount: priced.length,
      minPrice: prices.length ? Math.min(...prices) : undefined,
      maxPrice: prices.length ? Math.max(...prices) : undefined,
      earliestSet: earliest?.setName,
    };
  }, [cards]);

  return (
    <div className="space-y-1 text-xs text-muted-foreground">
      <div className="flex justify-between">
        <span>Total cards</span>
        <span className="font-medium text-foreground">{stats.totalCards}</span>
      </div>
      <div className="flex justify-between">
        <span>Market value</span>
        <span className="font-medium text-foreground">
          {formatPrice(stats.totalValue)}
        </span>
      </div>
      {stats.minPrice != null && stats.maxPrice != null && (
        <div className="flex justify-between">
          <span>Price range</span>
          <span className="font-medium text-foreground">
            {formatPrice(stats.minPrice)} – {formatPrice(stats.maxPrice)}
          </span>
        </div>
      )}
      {stats.earliestSet && (
        <div className="flex justify-between">
          <span>Earliest set</span>
          <span className="font-medium text-foreground truncate ml-2 text-right">
            {stats.earliestSet}
          </span>
        </div>
      )}
    </div>
  );
}

function CardTile({ card }: { card: PokemonCard }) {
  return (
    <CardPreview card={card}>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-10 h-14 rounded object-cover shrink-0"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-14 rounded bg-muted flex items-center justify-center shrink-0">
            <ImageBroken size={16} className="text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-1 flex-wrap">
            <Badge variant="outline" className="text-[10px] px-1 py-0 leading-tight">
              {card.setCode}
            </Badge>
            <span className="text-xs text-muted-foreground">{card.setNumber}</span>
          </div>
          {card.variant !== 'normal' && (
            <Badge variant="secondary" className="text-[10px] px-1 py-0 leading-tight">
              {getVariantLabel(card.variant)}
            </Badge>
          )}
          <p className="text-xs font-medium tabular-nums">
            {formatPrice(card.marketPrice)}
          </p>
        </div>
      </div>
    </CardPreview>
  );
}

export function ComparisonView() {
  const [columns, setColumns] = useState<ComparisonColumn[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const selectedNames = useMemo(
    () => columns.map((c) => c.pokemonName),
    [columns],
  );

  // Debounced search
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const id = setTimeout(async () => {
      try {
        const names = await searchPokemon(searchTerm);
        setSearchResults(
          names.filter((n) => !selectedNames.includes(n)).slice(0, 10),
        );
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [searchTerm, selectedNames]);

  const addPokemon = useCallback(
    async (name: string) => {
      if (columns.length >= MAX_COLUMNS) return;
      if (selectedNames.includes(name)) return;

      setSearchTerm('');
      setSearchResults([]);
      setShowSearch(false);

      setColumns((prev) => [
        ...prev,
        { pokemonName: name, cards: [], isLoading: true },
      ]);

      try {
        const raw = await fetchCardsForPokemon(name, false);
        const deduped = deduplicateCards(raw);
        const sorted = [...deduped].sort(
          (a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.setNumber.localeCompare(b.setNumber),
        );

        setColumns((prev) =>
          prev.map((col) =>
            col.pokemonName === name
              ? { ...col, cards: sorted, isLoading: false }
              : col,
          ),
        );
      } catch (err) {
        console.error(`Failed to fetch cards for ${name}:`, err);
        setColumns((prev) =>
          prev.map((col) =>
            col.pokemonName === name ? { ...col, isLoading: false } : col,
          ),
        );
      }
    },
    [columns.length, selectedNames],
  );

  const removePokemon = useCallback((name: string) => {
    setColumns((prev) => prev.filter((col) => col.pokemonName !== name));
  }, []);

  // Empty state
  if (columns.length === 0 && !showSearch) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <Scales size={48} className="text-muted-foreground" />
          <div className="text-center space-y-1">
            <p className="text-lg font-medium">Compare Pokemon Cards</p>
            <p className="text-sm text-muted-foreground">
              Add up to {MAX_COLUMNS} Pokemon to compare their card histories side by side.
            </p>
          </div>
          <Button onClick={() => setShowSearch(true)}>
            <Plus className="mr-2" size={16} />
            Add Pokemon
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Scales weight="fill" className="text-primary" />
          Compare Pokemon
        </h2>
        {columns.length < MAX_COLUMNS && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearch(true)}
          >
            <Plus className="mr-1" size={14} />
            Add Pokemon
          </Button>
        )}
      </div>

      {/* Search */}
      {(showSearch || searchTerm) && columns.length < MAX_COLUMNS && (
        <Card>
          <CardContent className="pt-4 space-y-2">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search Pokemon to add..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchTerm('');
                    setSearchResults([]);
                    setShowSearch(false);
                  }
                }}
                className="pl-10 min-h-[44px]"
              />
            </div>

            {isSearching && searchTerm.length >= 2 && (
              <p className="text-sm text-muted-foreground">Searching...</p>
            )}

            {searchResults.length > 0 && (
              <div className="border rounded-lg p-2 max-h-64 overflow-y-auto space-y-1">
                {searchResults.map((name) => (
                  <button
                    key={name}
                    onClick={() => addPokemon(name)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-muted/50 transition-colors font-medium min-h-[44px]"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Columns */}
      {columns.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => (
            <Card key={col.pokemonName} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-1">
                  <CardTitle className="text-base leading-tight">
                    {col.pokemonName}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => removePokemon(col.pokemonName)}
                  >
                    <X size={14} />
                  </Button>
                </div>
                {!col.isLoading && (
                  <Badge variant="secondary" className="w-fit">
                    {col.cards.length} card{col.cards.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-3 pt-0">
                {col.isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs text-muted-foreground">Loading cards...</p>
                  </div>
                ) : (
                  <>
                    <ColumnStats cards={col.cards} />
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-1 pr-3">
                        {col.cards.map((card) => (
                          <CardTile key={card.id} card={card} />
                        ))}
                        {col.cards.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No cards found.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
