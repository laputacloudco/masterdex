import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useCheckedCards } from '@/hooks/useCheckedCards';
import type { CardCondition, PokemonCard } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  MagnifyingGlass,
  CheckCircle,
  CurrencyDollar,
  Storefront,
  Lightning,
  ArrowsDownUp,
  X,
} from '@phosphor-icons/react';
import { formatCardName, getVariantLabel, parseCardNumber } from '@/lib/cardUtils';
import { CardPreview } from './CardPreview';

type ShowSortOrder = 'set' | 'price-low' | 'price-high' | 'name';

const SORT_LABELS: Record<ShowSortOrder, string> = {
  set: 'By Set',
  'price-low': 'Price: Low → High',
  'price-high': 'Price: High → Low',
  name: 'By Name',
};

const CONDITION_LABELS: Record<CardCondition, string> = {
  'near-mint': 'NM',
  'lightly-played': 'LP',
  'moderately-played': 'MP',
};

function getPriceForCondition(card: PokemonCard, condition: CardCondition): number | undefined {
  if (!card.prices) return card.marketPrice;
  switch (condition) {
    case 'near-mint':
      return card.prices.market ?? card.prices.high ?? card.marketPrice;
    case 'lightly-played':
      return card.prices.mid ?? card.marketPrice;
    case 'moderately-played':
      return card.prices.low ?? card.marketPrice;
  }
}

interface ShowViewProps {
  cards: PokemonCard[];
  setName: string;
  storageKey?: string;
  onClose?: () => void;
}

export function ShowView({ cards, setName, storageKey, onClose }: ShowViewProps) {
  const { isChecked, toggle } = useCheckedCards(storageKey || setName);
  const [search, setSearch] = useState('');
  const [setFilter, setSetFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<ShowSortOrder>('set');
  const [condition, setCondition] = useState<CardCondition>('near-mint');
  const [previewCard, setPreviewCard] = useState<PokemonCard | null>(null);

  // Session stats (ephemeral — resets when leaving show mode)
  const [sessionFound, setSessionFound] = useState<{ count: number; value: number }>({ count: 0, value: 0 });

  // Track recently found cards for celebration animation
  const [recentlyFound, setRecentlyFound] = useState<Set<string>>(new Set());
  const inFlightRef = useRef<Set<string>>(new Set());
  const animationTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Cleanup timeouts on unmount
  useEffect(() => {
    const timeouts = animationTimeouts.current;
    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, []);

  // All missing cards
  const missingCards = useMemo(
    () => cards.filter(card => !isChecked(card.id)),
    [cards, isChecked],
  );

  // Available sets for filter chips
  const availableSets = useMemo(() => {
    const setMap = new Map<string, { code: string; name: string; count: number }>();
    for (const card of missingCards) {
      const existing = setMap.get(card.setCode);
      if (existing) {
        existing.count++;
      } else {
        setMap.set(card.setCode, { code: card.setCode, name: card.setName, count: 1 });
      }
    }
    return Array.from(setMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [missingCards]);

  // Auto-clear stale set filter when the selected set has no more missing cards
  useEffect(() => {
    if (setFilter && !availableSets.some(s => s.code === setFilter)) {
      setSetFilter(null);
    }
  }, [setFilter, availableSets]);

  // Filter + sort
  const displayCards = useMemo(() => {
    let filtered = missingCards;

    // Set filter
    if (setFilter) {
      filtered = filtered.filter(c => c.setCode === setFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.pokemonName.toLowerCase().includes(q) ||
        c.setCode.toLowerCase().includes(q) ||
        c.setName.toLowerCase().includes(q) ||
        c.setNumber.toLowerCase().includes(q) ||
        `${c.setCode}-${c.setNumber}`.toLowerCase().includes(q),
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortOrder) {
      case 'price-low':
        sorted.sort((a, b) => (getPriceForCondition(a, condition) ?? 0) - (getPriceForCondition(b, condition) ?? 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => (getPriceForCondition(b, condition) ?? 0) - (getPriceForCondition(a, condition) ?? 0));
        break;
      case 'name':
        sorted.sort((a, b) => a.pokemonName.localeCompare(b.pokemonName));
        break;
      case 'set':
      default:
        sorted.sort((a, b) => {
          const setCmp = a.setName.localeCompare(b.setName);
          if (setCmp !== 0) return setCmp;
          const aNum = parseCardNumber(a.setNumber);
          const bNum = parseCardNumber(b.setNumber);
          if (aNum.numeric !== bNum.numeric) return aNum.numeric - bNum.numeric;
          return aNum.raw.localeCompare(bNum.raw);
        });
        break;
    }

    return sorted;
  }, [missingCards, setFilter, search, sortOrder, condition]);

  // Missing value
  const missingTotalCost = useMemo(
    () => missingCards.reduce((sum, card) => sum + (getPriceForCondition(card, condition) ?? 0), 0),
    [missingCards, condition],
  );

  const handleGotIt = useCallback((card: PokemonCard) => {
    // Synchronous guard against double-tap (ref is immediate, not batched)
    if (inFlightRef.current.has(card.id)) return;
    inFlightRef.current.add(card.id);

    const price = getPriceForCondition(card, condition) ?? 0;

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Persist checked state immediately so tab switches can't drop it
    toggle(card.id);

    // Show celebration animation
    setRecentlyFound(prev => new Set(prev).add(card.id));

    // Remove celebration after animation completes
    const timeout = setTimeout(() => {
      setRecentlyFound(prev => {
        const next = new Set(prev);
        next.delete(card.id);
        return next;
      });
      inFlightRef.current.delete(card.id);
      animationTimeouts.current.delete(card.id);
    }, 600);
    animationTimeouts.current.set(card.id, timeout);

    // Update session stats
    setSessionFound(prev => ({
      count: prev.count + 1,
      value: prev.value + price,
    }));
  }, [condition, toggle]);

  const totalCards = cards.length;
  const missingCount = missingCards.length;
  const ownedCount = totalCards - missingCount;
  const progressPercent = totalCards > 0 ? Math.round((ownedCount / totalCards) * 100) : 0;

  return (
    <>
      <div className="max-w-2xl mx-auto">
        {/* Sticky header */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm pb-3 space-y-3">
          {/* Title + progress */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="shrink-0 -ml-2"
                  aria-label="Exit show mode"
                >
                  <X size={20} weight="bold" />
                </Button>
              )}
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Lightning weight="fill" className="text-yellow-500" size={22} />
                  Show Mode
                </h2>
                <p className="text-xs text-muted-foreground">{setName}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold tabular-nums">
                <span className="text-destructive">{missingCount}</span>
                <span className="text-muted-foreground text-base font-normal"> remaining</span>
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">
                {ownedCount}/{totalCards} ({progressPercent}%)
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Session stats */}
          {sessionFound.count > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/5 px-3 py-2">
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <CheckCircle weight="fill" size={18} />
                Found today: {sessionFound.count} card{sessionFound.count !== 1 ? 's' : ''}
              </div>
              {sessionFound.value > 0 && (
                <div className="text-sm font-mono font-medium text-green-600 dark:text-green-400">
                  ${sessionFound.value.toFixed(2)}
                </div>
              )}
            </div>
          )}

          {/* Cost + condition */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-sm">
              <CurrencyDollar size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">To complete:</span>
              <span className="font-semibold tabular-nums">${missingTotalCost.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Select value={condition} onValueChange={(v) => setCondition(v as CardCondition)}>
                <SelectTrigger className="h-8 w-16 text-xs px-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {(Object.keys(CONDITION_LABELS) as CardCondition[]).map(key => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {CONDITION_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as ShowSortOrder)}>
                <SelectTrigger className="h-8 w-auto text-xs gap-1 px-2">
                  <ArrowsDownUp size={14} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {(Object.keys(SORT_LABELS) as ShowSortOrder[]).map(key => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {SORT_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, set, or number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-9 h-10"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Set filter chips */}
          {availableSets.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
              <button
                onClick={() => setSetFilter(null)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  !setFilter
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All ({missingCards.length})
              </button>
              {availableSets.map(set => (
                <button
                  key={set.code}
                  onClick={() => setSetFilter(setFilter === set.code ? null : set.code)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    setFilter === set.code
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {set.code} ({set.count})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Card list */}
        {missingCount === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Collection Complete!</h3>
            <p className="text-muted-foreground">You have every card in this set. Amazing!</p>
            {sessionFound.count > 0 && (
              <div className="mt-6 rounded-lg border border-green-500/30 bg-green-500/5 p-4 inline-block">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Today's haul: {sessionFound.count} card{sessionFound.count !== 1 ? 's' : ''} (${sessionFound.value.toFixed(2)})
                </p>
              </div>
            )}
          </div>
        ) : displayCards.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MagnifyingGlass size={32} className="mx-auto mb-3 opacity-50" />
            <p>No cards match your search</p>
            <button onClick={() => { setSearch(''); setSetFilter(null); }} className="text-sm text-primary mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 pb-8">
            {displayCards.map(card => {
              const price = getPriceForCondition(card, condition);
              const isCelebrating = recentlyFound.has(card.id);

              return (
                <div
                  key={card.id}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
                    isCelebrating
                      ? 'bg-green-500/10 border-green-500/50 scale-[0.97] opacity-50'
                      : 'hover:bg-accent/5 hover:border-accent/30'
                  }`}
                >
                  {/* Card thumbnail — tap for preview */}
                  <CardPreview card={card}>
                    <button
                      type="button"
                      aria-label={`Preview ${card.name}`}
                      onClick={() => setPreviewCard(card)}
                      className="shrink-0"
                    >
                      {card.imageUrl ? (
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          className="w-12 h-[67px] object-cover rounded border cursor-pointer"
                        />
                      ) : (
                        <div className="w-12 h-[67px] bg-muted rounded border flex items-center justify-center text-[8px] text-muted-foreground cursor-pointer">
                          ?
                        </div>
                      )}
                    </button>
                  </CardPreview>

                  {/* Card info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{formatCardName(card)}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {card.setCode} #{card.setNumber}
                      </Badge>
                      {card.variant !== 'normal' && card.variant !== 'cameo' && (
                        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${card.isHolo ? 'holo-shimmer' : ''}`}>
                          {getVariantLabel(card.variant)}
                        </Badge>
                      )}
                      {card.isHolo && card.variant === 'normal' && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 holo-shimmer">
                          Holo
                        </Badge>
                      )}
                    </div>
                    {/* Price */}
                    {price != null && Number.isFinite(price) && (
                      <div className="mt-1">
                        {card.tcgPlayerUrl ? (
                          <a
                            href={card.tcgPlayerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                          >
                            <Storefront size={12} weight="fill" />
                            <span className="font-mono font-medium">${price.toFixed(2)}</span>
                          </a>
                        ) : (
                          <span className="text-xs font-mono text-muted-foreground">${price.toFixed(2)}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Got it button */}
                  <Button
                    onClick={() => handleGotIt(card)}
                    disabled={isCelebrating}
                    className={`shrink-0 min-h-[44px] min-w-[44px] px-3 gap-1.5 font-semibold transition-all ${
                      isCelebrating
                        ? 'bg-green-500 text-white hover:bg-green-500'
                        : ''
                    }`}
                    size="sm"
                  >
                    {isCelebrating ? (
                      <CheckCircle weight="fill" size={20} />
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        <span className="hidden sm:inline">Got it!</span>
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Large image preview dialog */}
      <Dialog open={previewCard !== null} onOpenChange={(open) => { if (!open) setPreviewCard(null); }}>
        <DialogContent className="max-w-sm p-2 sm:max-w-md">
          <DialogTitle className="sr-only">{previewCard ? formatCardName(previewCard) : 'Card Preview'}</DialogTitle>
          {previewCard && (
            <div className="flex flex-col items-center gap-2">
              {previewCard.largeImageUrl || previewCard.imageUrl ? (
                <img
                  src={previewCard.largeImageUrl || previewCard.imageUrl}
                  alt={previewCard.name}
                  className="w-full h-auto rounded"
                />
              ) : (
                <div className="w-full aspect-[2.5/3.5] bg-muted flex items-center justify-center text-muted-foreground rounded">
                  No image available
                </div>
              )}
              <p className="text-sm font-medium text-center">{formatCardName(previewCard)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
