import { CITIES } from './citiesConfig.js';
import { runCity } from './orchestrate/runCity.js';
import { mergeOutput } from './orchestrate/mergeOutput.js';
import type { Restaurant } from './types.js';

interface CliArgs {
  cities: string[] | null;
  maxPerCity: number;
  dryRun: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  let cities: string[] | null = null;
  let maxPerCity = 15;
  let dryRun = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--cities') {
      cities = (argv[++i] ?? '').split(',').map((c) => c.trim()).filter(Boolean);
    } else if (arg === '--max-per-city') {
      maxPerCity = Number(argv[++i]);
    } else if (arg === '--dry-run') {
      dryRun = true;
    }
  }

  return { cities, maxPerCity, dryRun };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const targetCities = args.cities
    ? CITIES.filter((c) => args.cities!.some((name) => name.toLowerCase() === c.city.toLowerCase()))
    : CITIES;

  if (targetCities.length === 0) {
    console.error(`No matching cities for --cities ${args.cities?.join(',')}. Available: ${CITIES.map((c) => c.city).join(', ')}`);
    process.exitCode = 1;
    return;
  }

  const allRestaurants: Restaurant[] = [];
  const processedCountryIds: string[] = [];

  for (const city of targetCities) {
    const result = await runCity(city, {
      maxPerCity: args.maxPerCity,
      dryRun: args.dryRun,
      log: (msg) => console.log(msg),
    });
    allRestaurants.push(...result.restaurants);
    processedCountryIds.push(city.countryId);
    console.log(
      `${city.city}: ${result.restaurants.length} restaurant(s) with a parsed menu out of ${result.processedCount} processed (${result.discoveredCount} discovered total)`,
    );
  }

  if (args.dryRun) {
    console.log('Dry run — no output written.');
    return;
  }

  const changed = await mergeOutput(processedCountryIds, allRestaurants);
  console.log(changed ? 'restaurants.generated.json updated.' : 'No changes — restaurants.generated.json unchanged.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
