import type { CityConfig, DiscoveredPlace } from '../types.js';

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

function buildQuery(box: CityConfig['boundingBox']): string {
  // Overpass bbox order is south,west,north,east (minLat,minLng,maxLat,maxLng).
  const bbox = `${box.minLat},${box.minLng},${box.maxLat},${box.maxLng}`;
  return `[out:json][timeout:25];
nwr["amenity"="restaurant"](${bbox});
out center tags;`;
}

export function normalizeWebsite(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    return url.toString();
  } catch {
    return null;
  }
}

export function buildAddress(tags: Record<string, string>): string {
  const parts = [
    [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' '),
    tags['addr:postcode'],
    tags['addr:city'],
  ].filter(Boolean);
  return parts.join(', ');
}

export async function discoverRestaurants(city: CityConfig): Promise<DiscoveredPlace[]> {
  const response = await fetch(OVERPASS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: buildQuery(city.boundingBox),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Overpass query failed for ${city.city}: HTTP ${response.status}`);
  }

  const data = (await response.json()) as OverpassResponse;
  const places: DiscoveredPlace[] = [];

  for (const el of data.elements) {
    const tags = el.tags ?? {};
    const name = tags.name?.trim();
    const website = normalizeWebsite(tags.website ?? tags['contact:website']);
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;

    if (!name || !website || lat === undefined || lon === undefined) continue;

    places.push({
      externalId: `${el.type}/${el.id}`,
      name,
      address: buildAddress(tags) || `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
      location: { lat, lng: lon },
      website,
      countryId: city.countryId,
    });
  }

  return places;
}
