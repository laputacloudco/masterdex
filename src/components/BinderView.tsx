import { useState, useMemo, useEffect, useCallback } from 'react';
import { useCheckedCards } from '@/hooks/useCheckedCards';
import type { PokemonCard } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { CaretDown, CaretLeft, CaretRight, Cards, CheckCircle, Printer } from '@phosphor-icons/react';
import { CardPreview } from './CardPreview';
import { formatCardName } from '@/lib/cardUtils';
import { exportPlaceholdersToPDF } from '@/lib/exportUtils';
import { toast } from 'sonner';

interface BinderViewProps {
  cards: PokemonCard[];
  setName: string;
  storageKey?: string;
  cardsPerPage?: number;
}

function getGridLayout(cardsPerPage: number): { cols: number; rows: number } {
  switch (cardsPerPage) {
    case 4: return { cols: 2, rows: 2 };
    case 12: return { cols: 3, rows: 4 };
    case 9:
    default: return { cols: 3, rows: 3 };
  }
}

function getMobileLayout(cardsPerPage: number): { cols: number; rows: number } {
  switch (cardsPerPage) {
    case 4: return { cols: 2, rows: 2 };
    case 12: return { cols: 2, rows: 6 };
    case 9:
    default: return { cols: 2, rows: 5 };
  }
}

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

function buildPrintHTML(cards: PokemonCard[], setName: string, cardsPerPage: number): string {
  const { cols, rows } = getGridLayout(cardsPerPage);
  const totalPages = Math.max(1, Math.ceil(cards.length / cardsPerPage));

  let pagesHTML = '';
  for (let p = 0; p < totalPages; p++) {
    const start = p * cardsPerPage;
    const pageCards = cards.slice(start, start + cardsPerPage);

    let cellsHTML = '';
    for (let i = 0; i < cardsPerPage; i++) {
      const card = pageCards[i];
      if (card) {
        const label = `${card.pokemonName} · ${card.setCode} #${card.setNumber}`;
        cellsHTML += card.imageUrl
          ? `<div class="cell">
              <img src="${card.imageUrl}" alt="${card.name}" />
              <div class="label">${label}</div>
            </div>`
          : `<div class="cell empty-card">
              <div class="placeholder">${label}</div>
            </div>`;
      } else {
        cellsHTML += '<div class="cell empty-slot"></div>';
      }
    }

    pagesHTML += `
      <div class="page">
        <div class="page-header">Binder Page ${p + 1} of ${totalPages} — ${setName}</div>
        <div class="grid" style="grid-template-columns: repeat(${cols}, 1fr); grid-template-rows: repeat(${rows}, 1fr);">
          ${cellsHTML}
        </div>
      </div>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Print Binder — ${setName}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #000; }
  @page { size: portrait; margin: 0.4in; }
  .page { page-break-after: always; width: 100%; height: 100vh; display: flex; flex-direction: column; padding: 0; }
  .page:last-child { page-break-after: avoid; }
  .page-header { text-align: center; font-size: 10pt; color: #666; padding: 4px 0 8px; flex-shrink: 0; }
  .grid { flex: 1; display: grid; gap: 6px; }
  .cell { border: 1px solid #ccc; border-radius: 4px; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 0; }
  .cell img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .cell .label { font-size: 7pt; color: #555; text-align: center; padding: 1px 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; flex-shrink: 0; }
  .empty-slot { border: 1px dashed #ddd; background: #fafafa; }
  .empty-card { border: 1px solid #ccc; background: #f5f5f5; }
  .placeholder { font-size: 8pt; color: #999; text-align: center; padding: 8px; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { height: 100vh; }
  }
</style>
</head>
<body>${pagesHTML}</body>
</html>`;
}

export function BinderView({ cards, setName, storageKey, cardsPerPage: cardsPerPageProp = 9 }: BinderViewProps) {
  const { isChecked } = useCheckedCards(storageKey || setName);
  const [currentPage, setCurrentPage] = useState(0);
  const isMobile = useIsMobile();

  const { cols } = isMobile ? getMobileLayout(cardsPerPageProp) : getGridLayout(cardsPerPageProp);
  const cardsPerPage = isMobile ? getMobileLayout(cardsPerPageProp).cols * getMobileLayout(cardsPerPageProp).rows : cardsPerPageProp;

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

  const handlePrint = useCallback(() => {
    const html = buildPrintHTML(cards, setName, cardsPerPageProp);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    // Wait for images to load before triggering print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }, [cards, setName, cardsPerPageProp]);

  const handleExportProxies = useCallback(async () => {
    try {
      await exportPlaceholdersToPDF(cards, setName);
      toast.success('Placeholders exported to PDF!');
    } catch (error) {
      console.error('Failed to export placeholders:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to export placeholders');
    }
  }, [cards, setName]);

  const handleExportMissingProxies = useCallback(async () => {
    const missingCards = cards.filter(card => !isChecked(card.id));
    if (missingCards.length === 0) {
      toast.info('No missing cards — your collection is complete!');
      return;
    }
    try {
      await exportPlaceholdersToPDF(missingCards, `${setName}_missing`);
      toast.success(`Exported ${missingCards.length} missing card proxies to PDF!`);
    } catch (error) {
      console.error('Failed to export placeholders:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to export placeholders');
    }
  }, [cards, setName, isChecked]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Binder View</CardTitle>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cards.length === 0}
                  className="gap-1"
                >
                  <Printer weight="bold" size={16} />
                  Print / Export
                  <CaretDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="mr-2" />
                  Print Binder Pages
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportProxies}>
                  <Cards className="mr-2" />
                  Export All Proxies PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportMissingProxies}>
                  <Cards className="mr-2" />
                  Export Missing Cards Proxies
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
