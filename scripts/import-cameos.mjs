#!/usr/bin/env node

/**
 * Import cameos from CSV to TypeScript
 *
 * Usage:
 *   node scripts/import-cameos.mjs [path-to-csv]
 *
 * If no path is given, defaults to data/cameos.csv.
 *
 * To update from the Google Spreadsheet:
 *   1. Open https://docs.google.com/spreadsheets/d/18nIkOgqQrHZTz0TrH_gL1e1nL1RcHiCmPF5finAjToY/edit?gid=2112540589#gid=2112540589
 *   2. File → Download → Comma Separated Values (.csv)
 *   3. Replace data/cameos.csv with the downloaded file
 *   4. Run: npm run import-cameos
 *
 * Expected CSV columns:
 *   cardId, cardName, setCode, setName, mainPokemon, cameoPokemon, notes
 *
 * The cameoPokemon column should be a comma-separated list of Pokemon names.
 * If the list is quoted (e.g. "Pikachu,Eevee"), the quotes will be stripped.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const csvPath = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(ROOT, "data/cameos.csv");

const outPath = resolve(ROOT, "src/lib/cameoData.ts");

// ---------------------------------------------------------------------------
// Minimal RFC-4180 CSV parser (no dependencies)
// ---------------------------------------------------------------------------

function parseCSV(text) {
  const rows = [];
  let i = 0;

  while (i < text.length) {
    const row = [];
    while (true) {
      let value = "";
      if (text[i] === '"') {
        // quoted field
        i++; // skip opening quote
        while (i < text.length) {
          if (text[i] === '"') {
            if (text[i + 1] === '"') {
              value += '"';
              i += 2;
            } else {
              i++; // skip closing quote
              break;
            }
          } else {
            value += text[i];
            i++;
          }
        }
      } else {
        // unquoted field
        while (i < text.length && text[i] !== "," && text[i] !== "\n" && text[i] !== "\r") {
          value += text[i];
          i++;
        }
      }
      row.push(value);

      if (i >= text.length || text[i] === "\n" || text[i] === "\r") {
        // end of row
        if (text[i] === "\r") i++;
        if (text[i] === "\n") i++;
        break;
      }
      if (text[i] === ",") {
        i++; // skip comma
      }
    }
    if (row.length > 1 || (row.length === 1 && row[0].trim() !== "")) {
      rows.push(row);
    }
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log(`Reading CSV from ${csvPath}`);
const raw = readFileSync(csvPath, "utf-8");
const rows = parseCSV(raw);

if (rows.length < 2) {
  console.error("CSV must have a header row and at least one data row");
  process.exit(1);
}

const header = rows[0].map((h) => h.trim().toLowerCase());
const requiredCols = ["cardid", "cardname", "setcode", "setname", "mainpokemon", "cameopokemon"];

const colIndex = {};
for (const col of requiredCols) {
  const idx = header.indexOf(col);
  if (idx === -1) {
    console.error(`Missing required column: ${col}`);
    console.error(`Found columns: ${header.join(", ")}`);
    process.exit(1);
  }
  colIndex[col] = idx;
}
const notesIdx = header.indexOf("notes");

const entries = [];
for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  const cardId = row[colIndex["cardid"]]?.trim();
  if (!cardId) continue; // skip empty rows

  const cameoPokemonRaw = row[colIndex["cameopokemon"]]?.trim() || "";
  const cameoPokemon = cameoPokemonRaw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const notes = notesIdx >= 0 ? row[notesIdx]?.trim() : "";

  entries.push({
    cardId,
    cardName: row[colIndex["cardname"]]?.trim() || "",
    setCode: row[colIndex["setcode"]]?.trim() || "",
    setName: row[colIndex["setname"]]?.trim() || "",
    mainPokemon: row[colIndex["mainpokemon"]]?.trim() || "",
    cameoPokemon,
    notes: notes || undefined,
  });
}

console.log(`Parsed ${entries.length} cameo entries from CSV`);

// ---------------------------------------------------------------------------
// Generate TypeScript source
// ---------------------------------------------------------------------------

function escapeStr(s) {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

const entryLines = entries.map((e) => {
  const cameos = e.cameoPokemon.map((p) => `'${escapeStr(p)}'`).join(", ");
  const notesLine = e.notes ? `\n    notes: '${escapeStr(e.notes)}',` : "";
  return `  {
    cardId: '${escapeStr(e.cardId)}',
    cardName: '${escapeStr(e.cardName)}',
    setCode: '${escapeStr(e.setCode)}',
    setName: '${escapeStr(e.setName)}',
    mainPokemon: '${escapeStr(e.mainPokemon)}',
    cameoPokemon: [${cameos}],${notesLine}
  }`;
});

const output = `/**
 * Auto-generated from data/cameos.csv — do not edit manually.
 * To update, run: npm run import-cameos
 *
 * Source spreadsheet:
 * https://docs.google.com/spreadsheets/d/18nIkOgqQrHZTz0TrH_gL1e1nL1RcHiCmPF5finAjToY/edit?gid=2112540589#gid=2112540589
 */

export interface CameoEntry {
  cardId: string;
  cardName: string;
  setCode: string;
  setName: string;
  mainPokemon: string;
  cameoPokemon: string[];
  notes?: string;
}

export const CAMEO_DATABASE: CameoEntry[] = [
${entryLines.join(",\n")},
];

export function getCameoCardsForPokemon(pokemonName: string): CameoEntry[] {
  const normalizedSearch = pokemonName.toLowerCase().trim();

  return CAMEO_DATABASE.filter(entry => {
    const mainMatch = entry.mainPokemon.toLowerCase() === normalizedSearch;
    const cameoMatch = entry.cameoPokemon.some(
      cameo => cameo.toLowerCase() === normalizedSearch
    );

    return mainMatch || cameoMatch;
  });
}

export function getAllCameoPokemon(): string[] {
  const allPokemon = new Set<string>();

  CAMEO_DATABASE.forEach(entry => {
    allPokemon.add(entry.mainPokemon);
    entry.cameoPokemon.forEach(cameo => allPokemon.add(cameo));
  });

  return Array.from(allPokemon).sort();
}

export function getCameoStatistics(): {
  totalEntries: number;
  uniquePokemon: number;
  uniqueSets: number;
  mostFeatured: Array<{ pokemon: string; count: number }>;
} {
  const pokemonCounts = new Map<string, number>();
  const uniqueSets = new Set<string>();

  CAMEO_DATABASE.forEach(entry => {
    uniqueSets.add(entry.setCode);

    entry.cameoPokemon.forEach(cameo => {
      pokemonCounts.set(cameo, (pokemonCounts.get(cameo) || 0) + 1);
    });
  });

  const mostFeatured = Array.from(pokemonCounts.entries())
    .map(([pokemon, count]) => ({ pokemon, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalEntries: CAMEO_DATABASE.length,
    uniquePokemon: getAllCameoPokemon().length,
    uniqueSets: uniqueSets.size,
    mostFeatured,
  };
}
`;

writeFileSync(outPath, output, "utf-8");
console.log(`Generated ${outPath}`);
