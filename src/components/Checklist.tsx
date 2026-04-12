import { useMemo, useState } from 'react';
import { useKV } from '@/hooks/useKV';
import type { CardCondition, PokemonCard } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Printer, CheckCircle, CurrencyDollar, FilePdf, CaretDown, Cards, UserCircle, ArrowsDownUp, List, GridFour } from '@phosphor-icons/react';
import { formatCardName, getVariantLabel } from '@/lib/cardUtils';
import { CardPreview } from './CardPreview';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { exportChecklistToPDF, exportPlaceholdersToPDF, exportChecklistToCSV, printChecklist } from '@/lib/exportUtils';
import { toast } from 'sonner';

type ViewMode = 'list' | 'gallery';

type ChecklistSortOrder = 'default' | 'price-high-low' | 'price-low-high' | 'name-a-z' | 'name-z-a';

const SORT_LABELS: Record<ChecklistSortOrder, string> = {
  'default': 'Default Order',
  'price-high-low': 'Price: High to Low',
  'price-low-high': 'Price: Low to High',
  'name-a-z': 'Name: A–Z',
  'name-z-a': 'Name: Z–A',
};

function sortChecklist(cards: PokemonCard[], order: ChecklistSortOrder, getPrice: (card: PokemonCard) => number): PokemonCard[] {
  if (order === 'default') return cards;
  const sorted = [...cards];
  switch (order) {
    case 'price-high-low':
      return sorted.sort((a, b) => getPrice(b) - getPrice(a));
    case 'price-low-high':
      return sorted.sort((a, b) => getPrice(a) - getPrice(b));
    case 'name-a-z':
      return sorted.sort((a, b) => a.pokemonName.localeCompare(b.pokemonName, undefined, { sensitivity: 'base' }));
    case 'name-z-a':
      return sorted.sort((a, b) => b.pokemonName.localeCompare(a.pokemonName, undefined, { sensitivity: 'base' }));
    default:
      return sorted;
  }
}

const CONDITION_LABELS: Record<CardCondition, string> = {
  'near-mint': 'Near Mint',
  'lightly-played': 'Lightly Played',
  'moderately-played': 'Moderately Played',
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

interface ChecklistProps {
  cards: PokemonCard[];
  setName: string;
  storageKey?: string;
}

export function Checklist({ cards, setName, storageKey }: ChecklistProps) {
  const [checkedCards, setCheckedCards] = useKV<string[]>(`checklist-${storageKey || setName}`, []);
  const [checklistSort, setChecklistSort] = useState<ChecklistSortOrder>('default');
  const [condition, setCondition] = useState<CardCondition>('near-mint');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [previewCard, setPreviewCard] = useState<PokemonCard | null>(null);

  const sortedCards = useMemo(
    () => sortChecklist(cards, checklistSort, (card) => getPriceForCondition(card, condition) ?? 0),
    [cards, checklistSort, condition]
  );

  const isChecked = (cardId: string) => checkedCards?.includes(cardId) || false;

  const toggleCheck = (cardId: string) => {
    setCheckedCards((current) => {
      if (!current) return [cardId];
      return current.includes(cardId)
        ? current.filter(id => id !== cardId)
        : [...current, cardId];
    });
  };

  const handleExportPDF = async () => {
    try {
      await exportChecklistToPDF(cards, setName);
      toast.success('Checklist exported to PDF!');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  const handleExportProxies = async () => {
    try {
      await exportPlaceholdersToPDF(cards, setName);
      toast.success('Placeholders exported to PDF!');
    } catch (error) {
      console.error('Failed to export placeholders:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to export placeholders');
    }
  };

  const handleExportMissingProxies = async () => {
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
  };

  const handlePrint = () => {
    printChecklist();
  };

  const handleExportCSV = () => {
    exportChecklistToCSV(cards, checkedCards || [], setName);
    toast.success('Checklist exported to CSV!');
  };

  const checkedCount = checkedCards?.length || 0;
  const totalCount = cards.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const totalValue = useMemo(() => {
    return cards.reduce((sum, card) => sum + (getPriceForCondition(card, condition) || 0), 0);
  }, [cards, condition]);

  const checkedValue = useMemo(() => {
    return cards
      .filter(card => isChecked(card.id))
      .reduce((sum, card) => sum + (getPriceForCondition(card, condition) || 0), 0);
  }, [cards, checkedCards, condition]);

  const remainingValue = totalValue - checkedValue;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl">Master Set Checklist</CardTitle>
              <CardDescription className="mt-2">
                {setName} • {totalCount} cards
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={condition} onValueChange={(v) => setCondition(v as CardCondition)}>
                <SelectTrigger aria-label="Card condition" className="h-9 gap-1" size="default">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {(Object.keys(CONDITION_LABELS) as CardCondition[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {CONDITION_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ArrowsDownUp />
                    {checklistSort === 'default' ? 'Sort' : SORT_LABELS[checklistSort]}
                    <CaretDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  {(Object.keys(SORT_LABELS) as ChecklistSortOrder[]).map((key) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => setChecklistSort(key)}
                      className={checklistSort === key ? 'font-semibold bg-accent/10' : ''}
                    >
                      {SORT_LABELS[key]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Printer />
                  Export
                  <CaretDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="mr-2" />
                  Print Checklist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FilePdf className="mr-2" />
                  Export Checklist PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FilePdf className="mr-2" />
                  Export Checklist CSV
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
                variant="ghost"
                size="icon"
                aria-label={viewMode === 'list' ? 'Switch to gallery view' : 'Switch to list view'}
                onClick={() => setViewMode(viewMode === 'list' ? 'gallery' : 'list')}
                className="h-9 w-9"
              >
                {viewMode === 'list' ? <GridFour size={20} /> : <List size={20} />}
              </Button>
            </div>
          </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {checkedCount} / {totalCount} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          {totalValue > 0 && (
            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <div className="flex items-center gap-1 text-muted-foreground">
                <CurrencyDollar size={16} />
                <span>Market Value</span>
              </div>
              <div className="flex gap-4 font-medium">
                <span className="text-accent">
                  ${checkedValue.toFixed(2)}
                </span>
                <span className="text-muted-foreground">/</span>
                <span>
                  ${totalValue.toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          {remainingValue > 0 && (
            <div className="text-xs text-muted-foreground text-right">
              ${remainingValue.toFixed(2)} remaining
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {viewMode === 'list' ? (
            <div className="space-y-2">
              {sortedCards.map((card) => {
                const checked = isChecked(card.id);
                return (
                  <div
                    key={card.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      checked 
                        ? 'bg-muted/50 border-accent/50' 
                        : 'hover:bg-accent/5 hover:border-accent/30'
                    }`}
                  >
                    <Checkbox
                      id={card.id}
                      checked={checked}
                      onCheckedChange={() => toggleCheck(card.id)}
                      className="mt-0.5"
                    />
                    
                    {card.imageUrl && (
                      <CardPreview card={card}>
                        <img 
                          src={card.imageUrl} 
                          alt={card.name}
                          className="w-16 h-22 object-cover rounded border cursor-pointer"
                        />
                      </CardPreview>
                    )}
                    
                    <div className="flex-1">
                      <label
                        htmlFor={card.id}
                        className={`text-sm font-medium cursor-pointer block ${
                          checked ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {formatCardName(card)}
                      </label>
                      
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {card.setCode}
                        </Badge>
                        
                        {card.variant === 'cameo' && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-accent/15 text-accent border-accent/30"
                          >
                            <UserCircle size={12} weight="fill" className="mr-1" />
                            Cameo
                          </Badge>
                        )}
                        
                        {card.variant !== 'normal' && card.variant !== 'cameo' && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${card.isHolo ? 'holo-shimmer' : ''}`}
                          >
                            {getVariantLabel(card.variant)}
                          </Badge>
                        )}
                        
                        {card.isHolo && card.variant === 'normal' && (
                          <Badge variant="secondary" className="text-xs holo-shimmer">
                            Holo
                          </Badge>
                        )}
                        
                        <span className="text-xs text-muted-foreground">
                          {card.rarity}
                        </span>
                        
                        {(() => {
                          const displayPrice = getPriceForCondition(card, condition);
                          if (displayPrice == null || !Number.isFinite(displayPrice)) return null;
                          return card.tcgPlayerUrl ? (
                            <a
                              href={card.tcgPlayerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Badge variant="outline" className="text-xs font-mono hover:bg-accent/10 cursor-pointer">
                                ${displayPrice.toFixed(2)}
                                <span className="ml-1 text-muted-foreground font-sans">TCGPlayer</span>
                              </Badge>
                            </a>
                          ) : (
                            <Badge variant="outline" className="text-xs font-mono">
                              ${displayPrice.toFixed(2)}
                            </Badge>
                          );
                        })()}
                      </div>
                    </div>

                    {checked && (
                      <CheckCircle weight="fill" className="text-accent flex-shrink-0" size={20} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {sortedCards.map((card) => {
                const checked = isChecked(card.id);
                return (
                  <div
                    key={card.id}
                    className={`group relative rounded-lg border overflow-hidden transition-all cursor-pointer ${
                      checked
                        ? 'border-accent/50 ring-1 ring-accent/30'
                        : 'opacity-75 hover:opacity-100 hover:border-accent/30'
                    }`}
                  >
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        loading="lazy"
                        className="w-full h-auto object-cover"
                        onClick={() => setPreviewCard(card)}
                      />
                    ) : (
                      <div
                        className="w-full aspect-[2.5/3.5] bg-muted flex items-center justify-center text-xs text-muted-foreground"
                        onClick={() => setPreviewCard(card)}
                      >
                        No image
                      </div>
                    )}

                    {/* Hover overlay with card info */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 pointer-events-none">
                      <p className="text-white text-xs font-medium truncate">{formatCardName(card)}</p>
                      <p className="text-white/70 text-[10px] truncate">
                        {card.setCode} {card.variant !== 'normal' ? `\u2022 ${getVariantLabel(card.variant)}` : ''}
                      </p>
                    </div>

                    {/* Checkbox overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCheck(card.id);
                      }}
                      className="absolute top-1.5 left-1.5 z-10 rounded-full bg-background/80 backdrop-blur-sm p-0.5 transition-transform hover:scale-110"
                      aria-label={checked ? 'Mark as uncollected' : 'Mark as collected'}
                    >
                      {checked ? (
                        <CheckCircle weight="fill" className="text-accent" size={22} />
                      ) : (
                        <div className="w-[22px] h-[22px] rounded-full border-2 border-muted-foreground/50" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>

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
            <p className="text-xs text-muted-foreground text-center">
              {previewCard.setCode} \u2022 {previewCard.variant !== 'normal' ? getVariantLabel(previewCard.variant) : previewCard.rarity}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>

    <div id="checklist-print-content" style={{ display: 'none' }}>
      <h1>{setName}</h1>
      <h2>Master Set Checklist</h2>
      <div className="progress">
        Progress: {checkedCount} / {totalCount} ({progressPercent}%)
      </div>
      {cards.map((card) => {
        const checked = isChecked(card.id);
        return (
          <div key={card.id} className="card-item">
            <div className={`checkbox ${checked ? 'checked' : ''}`}></div>
            <div>
              <div className="card-name">{formatCardName(card)}</div>
              <div className="card-details">
                {card.setCode} • {card.variant !== 'normal' && `${getVariantLabel(card.variant)} • `}
                {card.isHolo && card.variant === 'normal' && 'Holo • '}
                {card.rarity}
              </div>
            </div>
            {(() => {
              const printPrice = getPriceForCondition(card, condition);
              if (printPrice == null || !Number.isFinite(printPrice)) return null;
              return <span className="card-price">${printPrice.toFixed(2)}</span>;
            })()}
          </div>
        );
      })}
    </div>
    </>
  );
}
