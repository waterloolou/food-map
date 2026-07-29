export interface LatLng {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface CityConfig {
  countryId: string;
  countryName: string;
  city: string;
  boundingBox: BoundingBox;
}

export interface DiscoveredPlace {
  externalId: string;
  name: string;
  address: string;
  location: LatLng;
  website: string;
  countryId: string;
}

export type ScrapeResult =
  | { status: 'ok'; text: string }
  | { status: 'blocked' }
  | { status: 'timeout' }
  | { status: 'empty' }
  | { status: 'dead-link' }
  | { status: 'robots-disallowed' };

export interface ParsedMenuItem {
  name: string;
  ingredients: string[];
  price?: number;
}

// Mirrors the app's src/types/index.ts MenuItem/Restaurant shapes exactly,
// since restaurants.generated.json is consumed there as-is.
export interface MenuItem {
  id: string;
  name: string;
  ingredients: string[];
  price?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  location: LatLng;
  address: string;
  countryId: string;
  menu: MenuItem[];
}

export interface CacheEntry {
  scrapedTextHash: string | null;
  scrapeStatus: ScrapeResult['status'] | 'no-website';
  parsedMenu: ParsedMenuItem[] | null;
  updatedAt: string;
}
