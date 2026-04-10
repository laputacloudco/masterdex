import { useState, useMemo } from 'react';
import { useKV } from '@/hooks/useKV';
import { CAMEO_DATABASE, getCameoStatistics, type CameoEntry } from '@/lib/cameoData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MagnifyingGlass, UserCircle, Cards, Info, Plus, Minus } from '@phosphor-icons/react';
import { CameoContributor } from './CameoContributor';

export function CameoBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showContributor, setShowContributor] = useState(false);
  const [userContributions, setUserContributions] = useKV<CameoEntry[]>('user-cameo-contributions', []);

  const allCameos = useMemo(() => {
    return [...CAMEO_DATABASE, ...(userContributions || [])];
  }, [userContributions]);

  const stats = getCameoStatistics();

  const filteredCameos = useMemo(() => {
    if (!searchQuery.trim()) return allCameos;

    const query = searchQuery.toLowerCase();
    return allCameos.filter((entry) => {
      return (
        entry.mainPokemon.toLowerCase().includes(query) ||
        entry.cameoPokemon.some((pokemon) => pokemon.toLowerCase().includes(query)) ||
        entry.cardName.toLowerCase().includes(query) ||
        entry.setName.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, allCameos]);

  const handleContribute = (entry: CameoEntry) => {
    setUserContributions((current) => {
      return [...(current || []), entry];
    });
    setShowContributor(false);
  };

  const userContributionCount = userContributions?.length || 0;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCircle size={28} weight="fill" className="text-indigo-600" />
                Cameo Card Database
              </CardTitle>
              <CardDescription className="mt-2">
                Browse Pokemon cards where other Pokemon make cameo appearances in the artwork
              </CardDescription>
            </div>
            <Button
              variant={showContributor ? "secondary" : "default"}
              onClick={() => setShowContributor(!showContributor)}
              className="gap-2"
            >
              {showContributor ? <Minus /> : <Plus />}
              {showContributor ? 'Hide Form' : 'Add Cameo'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalEntries}</div>
              <div className="text-sm text-muted-foreground">Official Database</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <div className="text-2xl font-bold text-purple-600">{stats.uniquePokemon}</div>
              <div className="text-sm text-muted-foreground">Unique Pokemon</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <div className="text-2xl font-bold text-pink-600">{stats.uniqueSets}</div>
              <div className="text-sm text-muted-foreground">Different Sets</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <div className="text-2xl font-bold text-violet-600">
                {userContributionCount}
              </div>
              <div className="text-sm text-muted-foreground">Your Contributions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showContributor && (
        <CameoContributor onContribute={handleContribute} />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cards size={24} weight="fill" />
            Search Cameo Cards
          </CardTitle>
          <CardDescription>
            Search by Pokemon name, card name, or set to find cameo appearances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <MagnifyingGlass
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={20}
            />
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
          <CardTitle>
            Cameo Entries ({filteredCameos.length})
            {userContributionCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {userContributionCount} user-contributed
              </Badge>
            )}
          </CardTitle>
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
                filteredCameos.map((entry, index) => {
                  const isUserContributed = userContributions?.some(
                    (contrib) => contrib.cardId === entry.cardId && contrib.cardName === entry.cardName
                  );
                  return (
                    <CameoCard 
                      key={`${entry.cardId}-${index}`} 
                      entry={entry} 
                      isUserContributed={isUserContributed}
                    />
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="bg-accent/10">
        <CardHeader>
          <CardTitle className="text-lg">About Cameo Cards</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>What are cameo cards?</strong> Cameo cards are Pokemon TCG cards where Pokemon
            other than the main card subject appear in the artwork. This includes background
            appearances, evolution chains shown together, trainer supporter cards featuring their
            teams, and more.
          </p>
          <p>
            <strong>Community Sourced:</strong> This database is compiled from community sources
            and collector knowledge. When you enable the "Cameo Cards" filter in your checklist,
            these cards will be included for the Pokemon that appear as cameos.
          </p>
          <p>
            <strong>Example:</strong> If you're collecting all Pikachu cards and enable cameos,
            you'll also get trainer cards where Pikachu appears in the background, or cards of
            other Pokemon where Pikachu is visible in the artwork.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function CameoCard({ entry, isUserContributed }: { entry: CameoEntry; isUserContributed?: boolean }) {
  return (
    <div className={`border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors ${
      isUserContributed ? 'border-primary/40 bg-primary/5' : ''
    }`}>
      <div className="flex flex-col md:flex-row md:items-start gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-lg">{entry.cardName}</h4>
                {isUserContributed && (
                  <Badge variant="default" className="text-xs">
                    Your Contribution
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {entry.setName} • {entry.cardId}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Main:</span>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                <UserCircle size={14} weight="fill" className="mr-1" />
                {entry.mainPokemon}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Cameos:</span>
              {entry.cameoPokemon.map((pokemon) => (
                <Badge key={pokemon} variant="outline" className="text-xs">
                  {pokemon}
                </Badge>
              ))}
            </div>
          </div>

          {entry.notes && (
            <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
              <Info size={16} className="inline mr-2 text-muted-foreground" />
              {entry.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
