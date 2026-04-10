import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import type { CameoEntry } from '@/lib/cameoData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Upload, Lightbulb } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface CameoContributorProps {
  onContribute: (entry: CameoEntry) => void;
}

export function CameoContributor({ onContribute }: CameoContributorProps) {
  const [cardId, setCardId] = useState('');
  const [cardName, setCardName] = useState('');
  const [setCode, setSetCode] = useState('');
  const [setName, setSetName] = useState('');
  const [mainPokemon, setMainPokemon] = useState('');
  const [cameoInput, setCameoInput] = useState('');
  const [cameoPokemon, setCameoPokemon] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCameoPokemon = () => {
    const trimmed = cameoInput.trim();
    if (trimmed && !cameoPokemon.includes(trimmed)) {
      setCameoPokemon([...cameoPokemon, trimmed]);
      setCameoInput('');
    }
  };

  const removeCameoPokemon = (pokemon: string) => {
    setCameoPokemon(cameoPokemon.filter(p => p !== pokemon));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardId || !cardName || !setCode || !setName || !mainPokemon || cameoPokemon.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const newEntry: CameoEntry = {
        cardId,
        cardName,
        setCode,
        setName,
        mainPokemon,
        cameoPokemon,
        notes: notes.trim() || undefined,
      };

      onContribute(newEntry);

      setCardId('');
      setCardName('');
      setSetCode('');
      setSetName('');
      setMainPokemon('');
      setCameoPokemon([]);
      setNotes('');
      
      toast.success('Cameo card submitted successfully!');
    } catch (error) {
      console.error('Error submitting cameo:', error);
      toast.error('Failed to submit cameo card');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCameoPokemon();
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload size={24} weight="fill" className="text-primary" />
          Contribute a Cameo Card
        </CardTitle>
        <CardDescription>
          Help grow the database by adding cameo cards you've discovered
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-id">
                Card ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="card-id"
                placeholder="e.g., base1-16"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-name">
                Card Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="card-name"
                placeholder="e.g., Pikachu"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="set-code">
                Set Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="set-code"
                placeholder="e.g., base1"
                value={setCode}
                onChange={(e) => setSetCode(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="set-name">
                Set Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="set-name"
                placeholder="e.g., Base Set"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="main-pokemon">
              Main Pokemon / Subject <span className="text-destructive">*</span>
            </Label>
            <Input
              id="main-pokemon"
              placeholder="e.g., Pikachu (or trainer name for Supporter cards)"
              value={mainPokemon}
              onChange={(e) => setMainPokemon(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cameo-pokemon">
              Cameo Pokemon <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="cameo-pokemon"
                placeholder="Enter Pokemon name and press Enter"
                value={cameoInput}
                onChange={(e) => setCameoInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addCameoPokemon}
                disabled={!cameoInput.trim()}
              >
                <Plus />
              </Button>
            </div>
            {cameoPokemon.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {cameoPokemon.map((pokemon) => (
                  <Badge key={pokemon} variant="secondary" className="gap-1 pr-1">
                    {pokemon}
                    <button
                      type="button"
                      onClick={() => removeCameoPokemon(pokemon)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="e.g., Visible in background artwork, part of evolution line shown"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-accent/10 rounded-lg p-4 text-sm space-y-2">
            <div className="flex items-start gap-2">
              <Lightbulb size={20} weight="fill" className="text-accent flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Tips for Contributing:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Look for Pokemon visible in card artwork beyond the main subject</li>
                  <li>Trainer/Supporter cards often show their signature Pokemon teams</li>
                  <li>Evolution lines may show pre-evolutions or evolutions together</li>
                  <li>Tournament prize cards and special editions can have unique cameos</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || cameoPokemon.length === 0}
          >
            <Upload className="mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Cameo Card'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
