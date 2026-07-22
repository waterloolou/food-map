import type { MatchedMenuItem, MenuItem, Restaurant, RestaurantWithMatches } from '../types';
import { isTraditionalDish } from './matching';
import { haversineDistanceKm } from './distance';
import type { Country, LatLng, TraditionalDish } from '../types';

export function containsDislikedIngredient(item: MenuItem, dislikedIngredients: string[]): boolean {
  if (dislikedIngredients.length === 0) return false;
  const disliked = dislikedIngredients.map((d) => d.toLowerCase());
  return item.ingredients.some((ingredient) => disliked.includes(ingredient.toLowerCase()));
}

export function annotateRestaurant(
  restaurant: Restaurant,
  traditionalDishes: TraditionalDish[],
  dislikedIngredients: string[],
  userLocation: LatLng | null,
): RestaurantWithMatches {
  const matchedMenu: MatchedMenuItem[] = restaurant.menu.map((item) => ({
    ...item,
    isTraditional: isTraditionalDish(item, traditionalDishes),
    hasDislikedIngredient: containsDislikedIngredient(item, dislikedIngredients),
  }));

  const traditionalCount = matchedMenu.filter((item) => item.isTraditional).length;
  const visibleTraditionalCount = matchedMenu.filter(
    (item) => item.isTraditional && !item.hasDislikedIngredient,
  ).length;

  return {
    ...restaurant,
    matchedMenu,
    traditionalCount,
    visibleTraditionalCount,
    distanceKm: userLocation ? haversineDistanceKm(userLocation, restaurant.location) : null,
  };
}

export function buildRestaurantsForCountry(
  restaurants: Restaurant[],
  country: Country,
  dislikedIngredients: string[],
  userLocation: LatLng | null,
): RestaurantWithMatches[] {
  return restaurants
    .filter((restaurant) => restaurant.countryId === country.id)
    .map((restaurant) =>
      annotateRestaurant(restaurant, country.traditionalDishes, dislikedIngredients, userLocation),
    );
}

export interface VisibilityOptions {
  searchText: string;
  hideNonTraditionalMatches: boolean;
}

function matchesSearchText(restaurant: RestaurantWithMatches, searchText: string): boolean {
  const query = searchText.trim().toLowerCase();
  if (!query) return true;
  if (restaurant.name.toLowerCase().includes(query)) return true;
  return restaurant.matchedMenu.some((item) => item.name.toLowerCase().includes(query));
}

export function getVisibleRestaurants(
  restaurants: RestaurantWithMatches[],
  { searchText, hideNonTraditionalMatches }: VisibilityOptions,
): RestaurantWithMatches[] {
  return restaurants.filter((restaurant) => {
    if (!matchesSearchText(restaurant, searchText)) return false;
    if (hideNonTraditionalMatches && restaurant.visibleTraditionalCount === 0) return false;
    return true;
  });
}
