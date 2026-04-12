import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MagnifyingGlass, X, PaintBrush } from '@phosphor-icons/react';
import { searchArtists } from '@/lib/pokemonTcgApi';

interface ArtistSelectorProps {
  selectedArtists: string[];
  onSelectArtist: (artist: string) => void;
  onRemoveArtist: (artist: string) => void;
}

export function ArtistSelector({ selectedArtists, onSelectArtist, onRemoveArtist }: ArtistSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const artists = await searchArtists(searchTerm);
        setSearchResults(artists.filter(a => !selectedArtists.includes(a)));
      } catch (error) {
        console.error('Artist search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 400);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedArtists]);

  const handleSelect = (artist: string) => {
    onSelectArtist(artist);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PaintBrush weight="fill" className="text-primary" />
          Select Artists
        </CardTitle>
        <CardDescription>
          Search for card artists to collect all their work
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="artist-search"
            placeholder="Search artists (e.g., Mitsuhiro Arita)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 min-h-[44px]"
          />
        </div>

        {searchTerm.length >= 3 && searchResults.length > 0 && (
          <div className="border rounded-lg p-2 max-h-64 overflow-y-auto space-y-1">
            {searchResults.map(artist => (
              <button
                key={artist}
                onClick={() => handleSelect(artist)}
                className="w-full text-left px-3 py-2 rounded hover:bg-muted/50 transition-colors font-medium min-h-[44px] flex items-center"
              >
                <PaintBrush size={16} className="mr-2 text-muted-foreground flex-shrink-0" />
                {artist}
              </button>
            ))}
          </div>
        )}

        {isSearching && searchTerm.length >= 3 && (
          <p className="text-sm text-muted-foreground">Searching artists...</p>
        )}

        {searchTerm.length >= 3 && !isSearching && searchResults.length === 0 && (
          <p className="text-sm text-muted-foreground">No artists found. Try a different search term.</p>
        )}

        {selectedArtists.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Selected Artists ({selectedArtists.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedArtists.map(artist => (
                <Badge key={artist} variant="secondary" className="gap-2 min-h-[44px] flex items-center">
                  <PaintBrush size={14} className="text-muted-foreground" />
                  {artist}
                  <button
                    onClick={() => onRemoveArtist(artist)}
                    className="hover:text-destructive transition-colors p-1"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
