import { useState, useMemo, useEffect } from 'react';
import { useCheckedCards } from '@/hooks/useCheckedCards';
import type { PokemonCard } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CaretLeft, CaretRight, CheckCircle } from '@phosphor-icons/react';
import { CardPreview } from './CardPreview';
import { formatCardName } from '@/lib/cardUtils';

interface BinderViewProps {
  cards: PokemonCard[];
  setName: string;
  storageKey?: string;
  cardsPerPage?: number;
}

const DESKTOP_COLS = 3;
const DESKTOP_ROWS = 3;
const MOBILE_COLS = 2;
const MOBILE_ROWS = 3;

/** Grid dimensions for each supported cards-per-page value. */
const PAGE_LAYOUT: Record<number, { cols: number; rows: number }> = {
  4:  { cols: 2, rows: 2 },
  9:  { cols: 3, rows: 3 },
  12: { cols: 3, rows: 4 },
  16: { cols: 4, rows: 4 },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 639px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

export function BinderView({ cards, setName, storageKey, cardsPerPage: cardsPerPageProp }: BinderViewProps) {
  const { isChecked } = useCheckedCards(storageKey || setName);
  const [currentPage, setCurrentPage] = useState(0);
  const isMobile = useIsMobile();

  // When a specific layout is requested via prop, use it; otherwise fall back to responsive defaults.
  const layout = cardsPerPageProp != null ? PAGE_LAYOUT[cardsPerPageProp] : undefined;
  const cols = layout?.cols ?? (isMobile ? MOBILE_COLS : DESKTOP_COLS);
  const rows = layout?.rows ?? (isMobile ? MOBILE_ROWS : DESKTOP_ROWS);
  const cardsPerPage = cols * rows;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(cards.length / cardsPerPage)),
    [cards.length, cardsPerPage]
  );

  // Clamp page if card count changes
  useEffect(() => {
    const safePage = Math.min(currentPage, totalPages - 1);
    if (safePage !== currentPage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, totalPages]);

  const effectivePage = Math.min(currentPage, totalPages - 1);

  const pageCards = useMemo(() => {
    const start = effectivePage * cardsPerPage;
    return cards.slice(start, start + cardsPerPage);
  }, [cards, effectivePage, cardsPerPage]);

  const goToPrevious = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Binder View</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              disabled={effectivePage === 0}
              aria-label="Previous page"
            >
              <CaretLeft weight="bold" />
            </Button>
            <span className="text-sm text-muted-foreground whitespace-nowrap min-w-[100px] text-center">
              Page {effectivePage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={effectivePage >= totalPages - 1}
              aria-label="Next page"
            >
              <CaretRight weight="bold" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div
          className={`grid gap-3 mx-auto ${cols >= 4 ? 'max-w-3xl' : 'max-w-2xl'}`}
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cardsPerPage }, (_, i) => {
            const card = pageCards[i];
            if (!card) {
              // Empty slot
              return (
                <div
                  key={`empty-${i}`}
                  className="aspect-[2.5/3.5] rounded-lg border-2 border-dashed border-muted bg-muted/20"
                />
              );
            }

            const checked = isChecked(card.id);

            return (
              <div
                key={card.id}
                className={`relative rounded-lg border-2 transition-all ${
                  checked
                    ? 'border-accent bg-accent/5'
                    : 'border-dashed border-muted-foreground/30 opacity-75'
                }`}
              >
                {/* Card image */}
                <div className="aspect-[2.5/3.5] overflow-hidden rounded-t-md">
                  {card.imageUrl ? (
                    <CardPreview card={card}>
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-full h-full object-cover cursor-pointer"
                        loading="lazy"
                      />
                    </CardPreview>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground text-center px-1">
                        No image
                      </span>
                    </div>
                  )}
                </div>

                {/* Checked indicator overlay */}
                {checked && (
                  <div className="absolute top-1.5 right-1.5">
                    <CheckCircle
                      weight="fill"
                      className="text-accent drop-shadow-md"
                      size={22}
                    />
                  </div>
                )}

                {/* Card info */}
                <div className="p-1.5 space-y-0.5">
                  <p className="text-xs font-medium leading-tight truncate" title={formatCardName(card)}>
                    {card.pokemonName}
                  </p>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                      {card.setCode}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground truncate">
                      #{card.setNumber}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={effectivePage === 0}
          >
            <CaretLeft weight="bold" className="mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {effectivePage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={effectivePage >= totalPages - 1}
          >
            Next
            <CaretRight weight="bold" className="ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
