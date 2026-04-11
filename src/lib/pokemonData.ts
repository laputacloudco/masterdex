import type { PokemonCard, PokemonSet, PokemonSpecies } from './types';

export const POKEMON_SETS: PokemonSet[] = [
  { code: 'BS', name: 'Base Set', releaseDate: '1999-01-09', totalCards: 102 },
  { code: 'JU', name: 'Jungle', releaseDate: '1999-06-16', totalCards: 64 },
  { code: 'FO', name: 'Fossil', releaseDate: '1999-10-10', totalCards: 62 },
  { code: 'BS2', name: 'Base Set 2', releaseDate: '2000-02-24', totalCards: 130 },
  { code: 'TR', name: 'Team Rocket', releaseDate: '2000-04-24', totalCards: 83 },
  { code: 'GS', name: 'Gym Heroes', releaseDate: '2000-08-14', totalCards: 132 },
  { code: 'G2', name: 'Gym Challenge', releaseDate: '2000-10-16', totalCards: 132 },
  { code: 'N1', name: 'Neo Genesis', releaseDate: '2000-12-16', totalCards: 111 },
  { code: 'N2', name: 'Neo Discovery', releaseDate: '2001-06-01', totalCards: 75 },
  { code: 'N3', name: 'Neo Revelation', releaseDate: '2001-09-21', totalCards: 66 },
  { code: 'N4', name: 'Neo Destiny', releaseDate: '2002-02-28', totalCards: 113 },
  { code: 'LC', name: 'Legendary Collection', releaseDate: '2002-05-24', totalCards: 110 },
  { code: 'EX1', name: 'EX Ruby & Sapphire', releaseDate: '2003-06-18', totalCards: 109 },
  { code: 'EX2', name: 'EX Sandstorm', releaseDate: '2003-09-18', totalCards: 100 },
  { code: 'SWSH', name: 'Sword & Shield Base', releaseDate: '2020-02-07', totalCards: 216 },
  { code: 'SWSH2', name: 'Rebel Clash', releaseDate: '2020-05-01', totalCards: 209 },
  { code: 'SWSH3', name: 'Darkness Ablaze', releaseDate: '2020-08-14', totalCards: 201 },
  { code: 'SV1', name: 'Scarlet & Violet Base', releaseDate: '2023-03-31', totalCards: 258 },
  { code: 'SV2', name: 'Paldea Evolved', releaseDate: '2023-06-09', totalCards: 279 },
  { code: 'SV3', name: 'Obsidian Flames', releaseDate: '2023-08-11', totalCards: 230 },
];

export const POKEMON_SPECIES: Record<string, PokemonSpecies> = {
  pikachu: { name: 'Pikachu', evolutionStage: 1, evolvesFrom: 'Pichu', evolvesTo: ['Raichu'] },
  pichu: { name: 'Pichu', evolutionStage: 0, evolvesTo: ['Pikachu'] },
  raichu: { name: 'Raichu', evolutionStage: 2, evolvesFrom: 'Pikachu' },
  
  charizard: { name: 'Charizard', evolutionStage: 2, evolvesFrom: 'Charmeleon' },
  charmeleon: { name: 'Charmeleon', evolutionStage: 1, evolvesFrom: 'Charmander', evolvesTo: ['Charizard'] },
  charmander: { name: 'Charmander', evolutionStage: 0, evolvesTo: ['Charmeleon'] },
  
  blastoise: { name: 'Blastoise', evolutionStage: 2, evolvesFrom: 'Wartortle' },
  wartortle: { name: 'Wartortle', evolutionStage: 1, evolvesFrom: 'Squirtle', evolvesTo: ['Blastoise'] },
  squirtle: { name: 'Squirtle', evolutionStage: 0, evolvesTo: ['Wartortle'] },
  
  venusaur: { name: 'Venusaur', evolutionStage: 2, evolvesFrom: 'Ivysaur' },
  ivysaur: { name: 'Ivysaur', evolutionStage: 1, evolvesFrom: 'Bulbasaur', evolvesTo: ['Venusaur'] },
  bulbasaur: { name: 'Bulbasaur', evolutionStage: 0, evolvesTo: ['Ivysaur'] },
  
  ampharos: { name: 'Ampharos', evolutionStage: 2, evolvesFrom: 'Flaaffy' },
  flaaffy: { name: 'Flaaffy', evolutionStage: 1, evolvesFrom: 'Mareep', evolvesTo: ['Ampharos'] },
  mareep: { name: 'Mareep', evolutionStage: 0, evolvesTo: ['Flaaffy'] },
  
  mewtwo: { name: 'Mewtwo', evolutionStage: 0 },
  mew: { name: 'Mew', evolutionStage: 0 },
  lugia: { name: 'Lugia', evolutionStage: 0 },
  hooh: { name: 'Ho-Oh', evolutionStage: 0 },
  
  eevee: { name: 'Eevee', evolutionStage: 0, evolvesTo: ['Vaporeon', 'Jolteon', 'Flareon', 'Espeon', 'Umbreon'] },
  vaporeon: { name: 'Vaporeon', evolutionStage: 1, evolvesFrom: 'Eevee' },
  jolteon: { name: 'Jolteon', evolutionStage: 1, evolvesFrom: 'Eevee' },
  flareon: { name: 'Flareon', evolutionStage: 1, evolvesFrom: 'Eevee' },
  espeon: { name: 'Espeon', evolutionStage: 1, evolvesFrom: 'Eevee' },
  umbreon: { name: 'Umbreon', evolutionStage: 1, evolvesFrom: 'Eevee' },
};

export function generateMockCards(): PokemonCard[] {
  const cards: PokemonCard[] = [];
  let cardId = 1;
  
  const pokemonForSets = [
    'Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo', 'Mew',
    'Charmander', 'Charmeleon', 'Squirtle', 'Wartortle', 'Bulbasaur', 'Ivysaur',
    'Mareep', 'Flaaffy', 'Ampharos', 'Eevee', 'Vaporeon', 'Jolteon', 'Flareon'
  ];
  
  POKEMON_SETS.forEach((set, setIndex) => {
    const cardsInSet = Math.min(pokemonForSets.length, setIndex < 5 ? 12 : 15);
    
    for (let i = 0; i < cardsInSet; i++) {
      const pokemonName = pokemonForSets[i % pokemonForSets.length];
      const setNumber = `${i + 1}/${set.totalCards}`;
      const rarity = i % 5 === 0 ? 'Rare Holo' : i % 3 === 0 ? 'Rare' : 'Common';
      const isHolo = rarity === 'Rare Holo';
      
      cards.push({
        id: `${set.code}-${cardId}`,
        name: `${pokemonName} ${set.code}`,
        pokemonName,
        setName: set.name,
        setCode: set.code,
        setNumber,
        releaseDate: set.releaseDate,
        variant: 'normal',
        rarity,
        isHolo,
      });
      cardId++;
      
      if (isHolo) {
        cards.push({
          id: `${set.code}-${cardId}-RH`,
          name: `${pokemonName} ${set.code}`,
          pokemonName,
          setName: set.name,
          setCode: set.code,
          setNumber,
          releaseDate: set.releaseDate,
          variant: 'reverse-holo',
          rarity,
          isHolo: true,
        });
        cardId++;
      }
      
      if (i % 7 === 0 && setIndex > 10) {
        cards.push({
          id: `${set.code}-${cardId}-PROMO`,
          name: `${pokemonName} ${set.code}`,
          pokemonName,
          setName: set.name,
          setCode: set.code,
          setNumber: `${setNumber} PROMO`,
          releaseDate: set.releaseDate,
          variant: 'promo',
          artVariant: 'Promo Art',
          rarity: 'Promo',
          isHolo: true,
        });
        cardId++;
      }
    }
  });
  
  ['Pikachu', 'Charizard', 'Mewtwo'].forEach((pokemon) => {
    cards.push({
      id: `MCD-${pokemon}`,
      name: `${pokemon} McDonald's Promo`,
      pokemonName: pokemon,
      setName: "McDonald's Collection",
      setCode: 'MCD',
      setNumber: '25/25',
      releaseDate: '2021-02-09',
      variant: 'collab',
      artVariant: '25th Anniversary',
      rarity: 'Promo',
      isHolo: true,
    });
  });
  
  return cards;
}

export const MOCK_CARDS = generateMockCards();

export function getCardsForPokemon(pokemonNames: string[], includeAllVariants: boolean): PokemonCard[] {
  const normalizedNames = pokemonNames.map(n => n.toLowerCase());
  let filtered = MOCK_CARDS.filter(card => 
    normalizedNames.includes(card.pokemonName.toLowerCase())
  );
  
  if (!includeAllVariants) {
    const uniqueArtCards = new Map<string, PokemonCard>();
    filtered.forEach(card => {
      const key = `${card.pokemonName}-${card.setCode}-${card.setNumber.split(' ')[0]}`;
      if (!uniqueArtCards.has(key)) {
        uniqueArtCards.set(key, card);
      }
    });
    filtered = Array.from(uniqueArtCards.values());
  }
  
  return filtered;
}

export function getCardsForSet(setCode: string, includeAllVariants: boolean): PokemonCard[] {
  let filtered = MOCK_CARDS.filter(card => card.setCode === setCode);
  
  if (!includeAllVariants) {
    const uniqueArtCards = new Map<string, PokemonCard>();
    filtered.forEach(card => {
      const key = `${card.pokemonName}-${card.setCode}-${card.setNumber.split(' ')[0]}`;
      if (!uniqueArtCards.has(key)) {
        uniqueArtCards.set(key, card);
      }
    });
    filtered = Array.from(uniqueArtCards.values());
  }
  
  return filtered;
}

export function getEvolutionChain(pokemonName: string): string[] {
  const normalized = pokemonName.toLowerCase();
  const species = POKEMON_SPECIES[normalized];
  
  if (!species) return [pokemonName];
  
  // Walk up to the root of the chain
  let root = species;
  while (root.evolvesFrom) {
    const parent = POKEMON_SPECIES[root.evolvesFrom.toLowerCase()];
    if (parent) {
      root = parent;
    } else {
      break;
    }
  }
  
  // BFS from root to collect the full family (handles branching like Eevee)
  const chain: string[] = [];
  const visited = new Set<string>();
  const queue = [root];
  let queueIdx = 0;
  
  while (queueIdx < queue.length) {
    const current = queue[queueIdx++];
    const key = current.name.toLowerCase();
    if (visited.has(key)) continue;
    visited.add(key);
    chain.push(current.name);
    
    for (const evoName of current.evolvesTo || []) {
      const evo = POKEMON_SPECIES[evoName.toLowerCase()];
      if (evo && !visited.has(evo.name.toLowerCase())) {
        queue.push(evo);
      }
    }
  }
  
  return chain;
}
