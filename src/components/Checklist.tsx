import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import type { PokemonCard } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Printer, CheckCircle } from '@phosphor-icons/react';
import { formatCardName, getVariantLabel } from '@/lib/cardUtils';

interface ChecklistProps {
  cards: PokemonCard[];
  setName: string;
}

export function Checklist({ cards, setName }: ChecklistProps) {
  const [checkedCards, setCheckedCards] = useKV<string[]>(`checklist-${setName}`, []);

  const isChecked = (cardId: string) => checkedCards?.includes(cardId) || false;

  const toggleCheck = (cardId: string) => {
    setCheckedCards((current) => {
      if (!current) return [cardId];
      return current.includes(cardId)
        ? current.filter(id => id !== cardId)
        : [...current, cardId];
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const checkedCount = checkedCards?.length || 0;
  const totalCount = cards.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">Master Set Checklist</CardTitle>
            <CardDescription className="mt-2">
              {setName} • {totalCount} cards
            </CardDescription>
          </div>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer />
            Print
          </Button>
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
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-2">
            {cards.map((card) => {
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
                    <img 
                      src={card.imageUrl} 
                      alt={card.name}
                      className="w-16 h-22 object-cover rounded border"
                    />
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
                      
                      {card.variant !== 'normal' && (
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
                    </div>
                  </div>

                  {checked && (
                    <CheckCircle weight="fill" className="text-accent flex-shrink-0" size={20} />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
