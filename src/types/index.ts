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
