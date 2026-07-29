import { RESTAURANTS } from './restaurants';
import { COUNTRIES } from './countries';
import generatedRestaurants from './restaurants.generated.json';
import type { Restaurant } from '../types';

// Once a city's AI-enriched real restaurants (from the enrichment/ pipeline)
// clear this count, prefer them over the hand-written mock data for that
// city. Below the threshold, keep showing the mock restaurants so a
// low-yield city (few scrapable websites, etc.) never regresses to a
// half-empty real dataset. Real and mock restaurants are never mixed
// within a single city.
const MIN_RESTAURANTS_PER_CITY = 3;

export function getEffectiveRestaurants(): Restaurant[] {
  const generated = generatedRestaurants as Restaurant[];

  return COUNTRIES.flatMap((country) => {
    const generatedForCountry = generated.filter(
      (restaurant) => restaurant.countryId === country.id && restaurant.menu.length > 0,
    );
    if (generatedForCountry.length >= MIN_RESTAURANTS_PER_CITY) {
      return generatedForCountry;
    }
    return RESTAURANTS.filter((restaurant) => restaurant.countryId === country.id);
  });
}
