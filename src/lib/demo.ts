// Demo mode: the built-in restaurants in Amsterdam, Brussels, Paris and
// London, used when no Google API key is set. They have menus (for the
// traditional-dish and "foods I don't like" features) but no ratings.

import type { Country, LatLng, Place } from '../types';
import { RESTAURANTS } from '../data/restaurants';
import { buildRestaurantsForCountry } from './filtering';

export function demoPlaces(country: Country, dislikedIngredients: string[], origin: LatLng | null): Place[] {
  return buildRestaurantsForCountry(RESTAURANTS, country, dislikedIngredients, origin).map((r) => ({
    id: r.id,
    name: r.name,
    location: r.location,
    address: r.address,
    cuisines: r.cuisines,
    rating: null,
    ratingCount: null,
    priceLevel: null,
    openNow: null,
    mapsUrl: null,
    source: 'demo',
    demo: r,
  }));
}
