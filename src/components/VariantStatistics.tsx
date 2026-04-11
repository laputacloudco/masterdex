import { useState } from 'react';
import type { PokemonCard } from '@/lib/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sparkle, Star, Lightning, Trophy, Gift, Handshake, Medal, CaretDown } from '@phosphor-icons/react';

interface VariantStatisticsProps {
  cards: PokemonCard[];
}

export function VariantStatistics({ cards }: VariantStatisticsProps) {
  const [open, setOpen] = useState(false);

  const stats = {
    normal: cards.filter(c => c.variant === 'normal' && !c.isHolo).length,
    holo: cards.filter(c => (c.variant === 'normal' && c.isHolo) || c.variant === 'holo').length,
    reverseHolo: cards.filter(c => c.variant === 'reverse-holo').length,
    fullArt: cards.filter(c => c.variant === 'full-art').length,
    secretRare: cards.filter(c => c.variant === 'secret-rare').length,
    rainbowRare: cards.filter(c => c.variant === 'rainbow-rare').length,
    gold: cards.filter(c => c.variant === 'gold').length,
    promo: cards.filter(c => c.variant === 'promo').length,
    collab: cards.filter(c => c.variant === 'collab').length,
    tournament: cards.filter(c => c.variant === 'tournament').length,
  };

  const total = cards.length;

  const variantInfo = [
    { key: 'normal', label: 'Normal', count: stats.normal, color: 'bg-slate-500', icon: null },
    { key: 'holo', label: 'Holo', count: stats.holo, color: 'bg-blue-500', icon: Sparkle },
    { key: 'reverseHolo', label: 'Reverse Holo', count: stats.reverseHolo, color: 'bg-cyan-500', icon: Sparkle },
    { key: 'fullArt', label: 'Full Art', count: stats.fullArt, color: 'bg-purple-500', icon: Star },
    { key: 'secretRare', label: 'Secret Rare', count: stats.secretRare, color: 'bg-pink-500', icon: Star },
    { key: 'rainbowRare', label: 'Rainbow Rare', count: stats.rainbowRare, color: 'bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500', icon: Lightning },
    { key: 'gold', label: 'Gold', count: stats.gold, color: 'bg-yellow-500', icon: Lightning },
    { key: 'promo', label: 'Promo', count: stats.promo, color: 'bg-orange-500', icon: Gift },
    { key: 'collab', label: 'Collab', count: stats.collab, color: 'bg-green-500', icon: Handshake },
    { key: 'tournament', label: 'Tournament', count: stats.tournament, color: 'bg-amber-600', icon: Trophy },
  ];

  const visibleStats = variantInfo.filter(v => v.count > 0);

  if (total === 0) {
    return null;
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-accent/30">
        <CardHeader>
          <CollapsibleTrigger asChild>
            <button type="button" className="flex items-center justify-between w-full text-left gap-2 cursor-pointer">
              <CardTitle className="flex items-center gap-2">
                <Medal weight="fill" className="text-accent" size={24} />
                Variant Statistics
                <Badge variant="outline" className="font-mono ml-1" aria-label={`Total cards: ${total}`}>{total}</Badge>
              </CardTitle>
              <CaretDown
                size={18}
                className={`text-muted-foreground shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <div className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visibleStats.map((variant) => {
                const Icon = variant.icon;
                const percentage = ((variant.count / total) * 100).toFixed(1);

                return (
                  <div
                    key={variant.key}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${variant.color} text-white`}>
                        {Icon ? <Icon size={16} weight="bold" /> : <span className="text-xs font-bold">N</span>}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{variant.label}</div>
                        <div className="text-xs text-muted-foreground">{percentage}%</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-mono">
                      {variant.count}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
