import type { BoundingBox, Country, LatLng } from '../types';

export function isWithinBoundingBox(point: LatLng, box: BoundingBox): boolean {
  return (
    point.lat >= box.minLat &&
    point.lat <= box.maxLat &&
    point.lng >= box.minLng &&
    point.lng <= box.maxLng
  );
}

export function detectCountry(point: LatLng, countries: Country[]): Country | null {
  return countries.find((country) => isWithinBoundingBox(point, country.boundingBox)) ?? null;
}
