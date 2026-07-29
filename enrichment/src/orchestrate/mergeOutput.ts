import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Restaurant } from '../types.js';

const OUTPUT_PATH = path.resolve(import.meta.dirname, '../../../src/data/restaurants.generated.json');

async function readExisting(): Promise<Restaurant[]> {
  try {
    const raw = await readFile(OUTPUT_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Merges new restaurants into the existing generated file, replacing only
// the entries for the countryIds actually processed this run — so e.g. a
// `--cities Amsterdam` run never wipes previously generated Brussels data.
export async function mergeOutput(processedCountryIds: string[], newRestaurants: Restaurant[]): Promise<boolean> {
  const existing = await readExisting();
  const untouched = existing.filter((r) => !processedCountryIds.includes(r.countryId));
  const merged = [...untouched, ...newRestaurants].sort((a, b) => a.id.localeCompare(b.id));

  const nextJson = `${JSON.stringify(merged, null, 2)}\n`;
  const previousJson = `${JSON.stringify(existing.sort((a, b) => a.id.localeCompare(b.id)), null, 2)}\n`;
  const changed = nextJson !== previousJson;

  if (changed) {
    await writeFile(OUTPUT_PATH, nextJson, 'utf-8');
  }
  return changed;
}
