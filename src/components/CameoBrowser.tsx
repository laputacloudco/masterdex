import { useState, useMemo } from 'react';
import { CAMEO_DATABASE, getCameoStatistics, type CameoRecord } from '@/lib/cameoData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MagnifyingGlass, Info } from '@phosphor-icons/react';

export function CameoBrowser() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = getCameoStatistics();

  const filteredCameos = useMemo(() => {
    if (!searchQuery.trim()) return CAMEO_DATABASE;

    const query = searchQuery.toLowerCase();
    return CAMEO_DATABASE.filter((record) => {
      return (
        record.cameoPokemon.toLowerCase().includes(query) ||
        record.appearances.some(
          (a) =>
            a.cardName.toLowerCase().includes(query) ||
            a.setName.toLowerCase().includes(query)
        )
      );
    });
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cameo Card Database</CardTitle>
          <CardDescription>
            Pokemon that make cameo appearances in other cards' artwork
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="rounded-lg p-4 border bg-muted/30">
              <div className="text-2xl font-bold">{stats.totalAppearances}</div>
              <div className="text-sm text-muted-foreground">Appearances</div>
            </div>
            <div className="rounded-lg p-4 border bg-muted/30">
              <div className="text-2xl font-bold">{stats.uniquePokemon}</div>
              <div className="text-sm text-muted-foreground">Pokemon</div>
            </div>
            <div className="rounded-lg p-4 border bg-muted/30">
              <div className="text-2xl font-bold">{stats.uniqueSets}</div>
              <div className="text-sm text-muted-foreground">Sets</div>
            </div>
          </div>

          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search Pokemon, card, or set..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results ({filteredCameos.length} Pokemon)</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {filteredCameos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Info size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No cameo cards found matching your search.</p>
                </div>
              ) : (
                filteredCameos.map((record) => (
                  <CameoRecordCard key={record.cameoPokemon} record={record} />
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function CameoRecordCard({ record }: { record: CameoRecord }) {
  return (
    <div className="border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary" className="text-sm font-semibold">
          {record.cameoPokemon}
        </Badge>
        {record.dexNumber && (
          <span className="text-xs text-muted-foreground">#{record.dexNumber}</span>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {record.appearances.length} appearance{record.appearances.length !== 1 ? 's' : ''}
        </span>
      </div>
      <Separator className="mb-3" />
      <div className="space-y-1.5">
        {record.appearances.map((a, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="font-medium">{a.cardName}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{a.setName}</span>
            {a.number && <span className="text-muted-foreground">#{a.number}</span>}
            {a.notes && (
              <Badge variant="outline" className="text-xs ml-auto">{a.notes}</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
