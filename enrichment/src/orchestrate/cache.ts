import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { CacheEntry } from '../types.js';

const CACHE_ROOT = path.resolve(import.meta.dirname, '../../.cache');

export function hashText(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

function cacheFilePath(countryId: string, externalId: string): string {
  const safeExternalId = externalId.replace(/\//g, '-');
  return path.join(CACHE_ROOT, countryId, `${safeExternalId}.json`);
}

export async function loadCacheEntry(countryId: string, externalId: string): Promise<CacheEntry | null> {
  try {
    const raw = await readFile(cacheFilePath(countryId, externalId), 'utf-8');
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

export async function saveCacheEntry(countryId: string, externalId: string, entry: CacheEntry): Promise<void> {
  const filePath = cacheFilePath(countryId, externalId);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(entry, null, 2), 'utf-8');
}
