#!/usr/bin/env node

/**
 * Import cameo data from data/cameos.csv into src/lib/cameoData.ts
 *
 * CSV format: Ndex, Cameo Pokémon, Card name, Set, #, Notes
 * - Ndex and Cameo Pokémon may be blank (inherited from previous row)
 * - Notes may contain "silhouette", "Jumbo", etc.
 *
 * Usage: node scripts/import-cameos.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const csvPath = resolve(__dirname, '../data/cameos.csv');
const outPath = resolve(__dirname, '../src/lib/cameoData.ts');

const csv = readFileSync(csvPath, 'utf-8');
const lines = csv.split('\n').slice(1); // skip header

const entries = [];
let currentDex = '';
let currentPokemon = '';

for (const line of lines) {
  if (!line.trim()) continue;

  // Parse CSV (handles commas inside fields, basic quoting)
  const cols = parseCSVLine(line);
  const [ndex, cameoPokemon, cardName, setName, number, notes] = cols;

  if (ndex?.trim()) currentDex = ndex.trim();
  if (cameoPokemon?.trim()) currentPokemon = cameoPokemon.trim();

  if (!cardName?.trim() || !setName?.trim()) continue;

  entries.push({
    dexNumber: currentDex ? parseInt(currentDex, 10) : null,
    cameoPokemon: currentPokemon,
    cardName: cardName.trim(),
    setName: setName.trim(),
    number: number?.trim() || '',
    notes: notes?.trim() || '',
  });
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// Group by cameo Pokemon
const grouped = new Map();
for (const entry of entries) {
  const key = entry.cameoPokemon.toLowerCase();
  if (!grouped.has(key)) {
    grouped.set(key, {
      dexNumber: entry.dexNumber,
      cameoPokemon: entry.cameoPokemon,
      appearances: [],
    });
  }
  grouped.get(key).appearances.push({
    cardName: entry.cardName,
    setName: entry.setName,
    number: entry.number,
    notes: entry.notes,
  });
}

// Generate TypeScript
const ts = `// Auto-generated from data/cameos.csv — do not edit manually
// Run: npm run import-cameos

export interface CameoAppearance {
  cardName: string;
  setName: string;
  number: string;
  notes: string;
}

export interface CameoEntry {
  cardId: string;
  cardName: string;
  setCode: string;
  setName: string;
  mainPokemon: string;
  cameoPokemon: string[];
  notes?: string;
}

export interface CameoRecord {
  dexNumber: number | null;
  cameoPokemon: string;
  appearances: CameoAppearance[];
}

export const CAMEO_DATABASE: CameoRecord[] = ${JSON.stringify(
  Array.from(grouped.values()),
  null,
  2
)};

/**
 * Get all cameo appearances for a given Pokemon name.
 */
export function getCameoCardsForPokemon(pokemonName: string): CameoEntry[] {
  const normalized = pokemonName.toLowerCase();
  const records = CAMEO_DATABASE.filter(
    (r) => r.cameoPokemon.toLowerCase() === normalized
  );

  return records.flatMap((r) =>
    r.appearances.map((a) => ({
      cardId: '', // Not available from spreadsheet — resolved at fetch time
      cardName: a.cardName,
      setCode: '',
      setName: a.setName,
      mainPokemon: a.cardName,
      cameoPokemon: [r.cameoPokemon],
      notes: a.notes || undefined,
    }))
  );
}

/**
 * Get all unique cameo Pokemon names in the database.
 */
export function getAllCameoPokemon(): string[] {
  return [...new Set(CAMEO_DATABASE.map((r) => r.cameoPokemon))].sort();
}

/**
 * Search cameo database by Pokemon name.
 */
export function searchCameos(query: string): CameoRecord[] {
  const q = query.toLowerCase();
  return CAMEO_DATABASE.filter(
    (r) =>
      r.cameoPokemon.toLowerCase().includes(q) ||
      r.appearances.some((a) => a.cardName.toLowerCase().includes(q))
  );
}

/**
 * Get statistics about the cameo database.
 */
export function getCameoStatistics() {
  const totalAppearances = CAMEO_DATABASE.reduce((sum, r) => sum + r.appearances.length, 0);
  const uniquePokemon = CAMEO_DATABASE.length;
  const uniqueSets = new Set(CAMEO_DATABASE.flatMap((r) => r.appearances.map((a) => a.setName))).size;
  return { totalAppearances, uniquePokemon, uniqueSets };
}
`;

writeFileSync(outPath, ts, 'utf-8');
console.log(
  `Imported ${entries.length} cameo appearances for ${grouped.size} Pokemon`
);
