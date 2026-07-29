import type { CityConfig } from './types.js';

// Kept in sync by hand with the bounding boxes in ../../src/data/countries.ts —
// this package has its own module resolution so it can't import across that
// boundary directly. If you change one, change the other.
export const CITIES: CityConfig[] = [
  {
    countryId: 'NL',
    countryName: 'Netherlands',
    city: 'Amsterdam',
    boundingBox: { minLat: 52.28, maxLat: 52.45, minLng: 4.75, maxLng: 5.05 },
  },
  {
    countryId: 'BE',
    countryName: 'Belgium',
    city: 'Brussels',
    boundingBox: { minLat: 50.75, maxLat: 50.95, minLng: 4.25, maxLng: 4.5 },
  },
  {
    countryId: 'FR',
    countryName: 'France',
    city: 'Paris',
    boundingBox: { minLat: 48.75, maxLat: 48.95, minLng: 2.2, maxLng: 2.5 },
  },
  {
    countryId: 'GB',
    countryName: 'England',
    city: 'London',
    boundingBox: { minLat: 51.4, maxLat: 51.6, minLng: -0.3, maxLng: 0.1 },
  },
];
