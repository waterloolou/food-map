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

export interface TraditionalDish {
  name: string;
  aliases?: string[];
}

export interface Country {
  id: string;
  name: string;
  city: string;
  center: LatLng;
  boundingBox: BoundingBox;
  traditionalDishes: TraditionalDish[];
}

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
  cuisines: string[];
  menu: MenuItem[];
}

export interface MatchedMenuItem extends MenuItem {
  isTraditional: boolean;
  hasDislikedIngredient: boolean;
}

export interface RestaurantWithMatches extends Restaurant {
  matchedMenu: MatchedMenuItem[];
  traditionalCount: number;
  visibleTraditionalCount: number;
  distanceKm: number | null;
}

/** Where a place's data came from: Google Places (live) or the built-in demo cities. */
export type PlaceSource = 'google' | 'demo';

/** One restaurant, from either source, in the shape the UI works with. */
export interface Place {
  id: string;
  name: string;
  location: LatLng;
  address: string;
  cuisines: string[]; // ids from data/cuisines.ts
  rating: number | null; // 1-5 stars, null when there is no rating
  ratingCount: number | null;
  priceLevel: number | null; // 1 ($) to 4 ($$$$)
  openNow: boolean | null;
  mapsUrl: string | null;
  source: PlaceSource;
  /** Demo places only: the menu, matched against traditional dishes and dislikes. */
  demo?: RestaurantWithMatches;
}

export interface PlaceWithDistance extends Place {
  distanceMiles: number;
  driveMinutes: number;
  crossedOff: boolean;
}
