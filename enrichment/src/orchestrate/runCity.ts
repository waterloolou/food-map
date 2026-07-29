import { discoverRestaurants } from '../discover/overpassDiscovery.js';
import { scrapeWebsite } from '../scrape/scrapeWebsite.js';
import { parseMenuWithClaude } from '../parse/parseMenuWithClaude.js';
import { hashText, loadCacheEntry, saveCacheEntry } from './cache.js';
import { slugify } from './slug.js';
import type { CacheEntry, CityConfig, Restaurant } from '../types.js';

export interface RunCityOptions {
  maxPerCity: number;
  dryRun: boolean;
  log?: (message: string) => void;
}

export interface RunCityResult {
  restaurants: Restaurant[];
  discoveredCount: number;
  processedCount: number;
}

function buildRestaurantId(countryId: string, name: string, usedIds: Set<string>): string {
  const base = `gen-${countryId.toLowerCase()}-${slugify(name)}`;
  let id = base;
  let suffix = 2;
  while (usedIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  usedIds.add(id);
  return id;
}

export async function runCity(city: CityConfig, options: RunCityOptions): Promise<RunCityResult> {
  const log = options.log ?? (() => {});
  const places = await discoverRestaurants(city);
  log(`${city.city}: discovered ${places.length} restaurant(s) with a website`);

  const usedIds = new Set<string>();
  const restaurants: Restaurant[] = [];
  const toProcess = places.slice(0, options.maxPerCity);

  for (const place of toProcess) {
    const cached = await loadCacheEntry(city.countryId, place.externalId);

    const scrapeResult = await scrapeWebsite(place.website);
    if (scrapeResult.status !== 'ok') {
      log(`  skip ${place.name}: scrape ${scrapeResult.status}`);
      if (!options.dryRun) {
        await saveCacheEntry(city.countryId, place.externalId, {
          scrapedTextHash: null,
          scrapeStatus: scrapeResult.status,
          parsedMenu: null,
          updatedAt: new Date().toISOString(),
        });
      }
      continue;
    }

    const textHash = hashText(scrapeResult.text);
    let parsedMenu = cached?.scrapedTextHash === textHash ? cached.parsedMenu : null;

    if (parsedMenu === null && !options.dryRun) {
      parsedMenu = await parseMenuWithClaude(place.name, city.city, scrapeResult.text);
      const entry: CacheEntry = {
        scrapedTextHash: textHash,
        scrapeStatus: 'ok',
        parsedMenu,
        updatedAt: new Date().toISOString(),
      };
      await saveCacheEntry(city.countryId, place.externalId, entry);
    }

    if (options.dryRun) {
      log(`  ${place.name}: scraped ${scrapeResult.text.length} chars (dry-run, no LLM call)`);
      continue;
    }

    if (!parsedMenu || parsedMenu.length === 0) {
      log(`  skip ${place.name}: no menu items parsed`);
      continue;
    }

    const restaurantId = buildRestaurantId(city.countryId, place.name, usedIds);
    restaurants.push({
      id: restaurantId,
      name: place.name,
      location: place.location,
      address: place.address,
      countryId: place.countryId,
      menu: parsedMenu.map((item, index) => ({
        id: `${restaurantId}-${slugify(item.name) || `item-${index}`}`,
        name: item.name,
        ingredients: item.ingredients,
        ...(item.price !== undefined ? { price: item.price } : {}),
      })),
    });
    log(`  ok ${place.name}: ${parsedMenu.length} menu item(s)`);
  }

  return { restaurants, discoveredCount: places.length, processedCount: toProcess.length };
}
