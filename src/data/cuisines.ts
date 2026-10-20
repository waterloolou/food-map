// The food types people can filter by. `googleTypes` are Google Places
// "place types" (https://developers.google.com/maps/documentation/places/web-service/place-types)
// used both to search for that cuisine and to label results.

export interface Cuisine {
  id: string;
  label: string;
  googleTypes: string[];
}

export const CUISINES: Cuisine[] = [
  { id: 'bbq', label: 'BBQ', googleTypes: ['barbecue_restaurant'] },
  { id: 'chinese', label: 'Chinese', googleTypes: ['chinese_restaurant'] },
  { id: 'mexican', label: 'Mexican', googleTypes: ['mexican_restaurant'] },
  { id: 'italian', label: 'Italian', googleTypes: ['italian_restaurant'] },
  { id: 'pizza', label: 'Pizza', googleTypes: ['pizza_restaurant'] },
  { id: 'japanese', label: 'Japanese', googleTypes: ['japanese_restaurant', 'sushi_restaurant', 'ramen_restaurant'] },
  { id: 'thai', label: 'Thai', googleTypes: ['thai_restaurant'] },
  { id: 'indian', label: 'Indian', googleTypes: ['indian_restaurant'] },
  { id: 'vietnamese', label: 'Vietnamese', googleTypes: ['vietnamese_restaurant'] },
  { id: 'korean', label: 'Korean', googleTypes: ['korean_restaurant'] },
  { id: 'burgers', label: 'Burgers', googleTypes: ['hamburger_restaurant', 'american_restaurant'] },
  { id: 'seafood', label: 'Seafood', googleTypes: ['seafood_restaurant'] },
  { id: 'steak', label: 'Steakhouse', googleTypes: ['steak_house'] },
  { id: 'mediterranean', label: 'Mediterranean', googleTypes: ['mediterranean_restaurant', 'greek_restaurant', 'middle_eastern_restaurant'] },
  { id: 'french', label: 'French', googleTypes: ['french_restaurant'] },
  { id: 'breakfast', label: 'Breakfast', googleTypes: ['breakfast_restaurant', 'brunch_restaurant'] },
  { id: 'cafe', label: 'Café & bakery', googleTypes: ['cafe', 'coffee_shop', 'bakery'] },
  { id: 'vegetarian', label: 'Vegetarian', googleTypes: ['vegetarian_restaurant', 'vegan_restaurant'] },
];

export const CUISINE_BY_ID = new Map(CUISINES.map((c) => [c.id, c]));

const CUISINE_BY_GOOGLE_TYPE = new Map(
  CUISINES.flatMap((c) => c.googleTypes.map((t) => [t, c.id] as const)),
);

/** Cuisine ids for a list of Google place types (most specific first, no duplicates). */
export function cuisinesForGoogleTypes(types: string[]): string[] {
  const ids: string[] = [];
  for (const t of types) {
    const id = CUISINE_BY_GOOGLE_TYPE.get(t);
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids;
}
