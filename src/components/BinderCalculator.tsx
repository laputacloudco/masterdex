import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen } from '@phosphor-icons/react';

interface BinderCalculatorProps {
  cardCount: number;
}

const CARDS_PER_PAGE_OPTIONS = [
  { value: '9', label: '9 cards/page (3×3)' },
  { value: '12', label: '12 cards/page (3×4)' },
  { value: '4', label: '4 cards/page (2×2)' },
];

const BINDER_SIZES = [
  { pockets: 180, label: '180-pocket' },
  { pockets: 360, label: '360-pocket' },
  { pockets: 480, label: '480-pocket' },
];

export function BinderCalculator({ cardCount }: BinderCalculatorProps) {
  const [cardsPerPage, setCardsPerPage] = useState(9);

  if (cardCount === 0) {
    return null;
  }

  const pagesNeeded = Math.ceil(cardCount / cardsPerPage);

  const recommendedBinder = BINDER_SIZES.find(
    (b) => Math.floor(b.pockets / cardsPerPage) >= pagesNeeded,
  );

  return (
    <Card className="border-accent/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <BookOpen weight="fill" className="text-accent" size={24} />
            Binder Calculator
            <Badge variant="outline" className="font-mono ml-1" aria-label={`Total cards: ${cardCount}`}>
              {cardCount}
            </Badge>
          </CardTitle>
          <Select
            value={String(cardsPerPage)}
            onValueChange={(v) => setCardsPerPage(Number(v))}
          >
            <SelectTrigger aria-label="Cards per page" className="h-8 w-auto gap-1 text-xs" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {CARDS_PER_PAGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-lg border bg-card p-3">
            <span className="text-xs text-muted-foreground">Pages needed</span>
            <span className="font-mono text-lg font-semibold">{pagesNeeded}</span>
          </div>
          <div className="flex flex-col gap-1 rounded-lg border bg-card p-3">
            <span className="text-xs text-muted-foreground">Cards per page</span>
            <span className="font-mono text-lg font-semibold">{cardsPerPage}</span>
          </div>
          <div className="col-span-2 flex flex-col gap-1 rounded-lg border bg-card p-3 sm:col-span-1">
            <span className="text-xs text-muted-foreground">Recommended binder</span>
            {recommendedBinder ? (
              <span className="font-mono text-lg font-semibold">{recommendedBinder.label}</span>
            ) : (
              <span className="text-sm font-semibold text-muted-foreground">
                {Math.ceil(pagesNeeded / Math.floor(480 / cardsPerPage))}× 480-pocket
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
