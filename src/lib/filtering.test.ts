import { describe, expect, it } from 'vitest';
import { containsDislikedIngredient, annotateRestaurant, getVisibleRestaurants } from './filtering';
import type { MenuItem, Restaurant, TraditionalDish } from '../types';

const dishes: TraditionalDish[] = [{ name: 'stamppot' }, { name: 'kroket' }];

const restaurant: Restaurant = {
  id: 'r1',
  name: 'Café de Ooievaar',
  location: { lat: 52.37, lng: 4.9 },
  address: 'Somewhere 1',
  countryId: 'NL',
  menu: [
    { id: 'm1', name: 'Stamppot met worst', ingredients: ['potato', 'kale', 'sausage'] },
    { id: 'm2', name: 'Kroket', ingredients: ['beef', 'breadcrumbs'] },
    { id: 'm3', name: 'Tomato soup', ingredients: ['tomato', 'cream'] },
  ],
};

describe('containsDislikedIngredient', () => {
  it('is case-insensitive and matches any ingredient', () => {
    const item: MenuItem = { id: '1', name: 'x', ingredients: ['Beef', 'Sauce'] };
    expect(containsDislikedIngredient(item, ['beef'])).toBe(true);
  });

  it('returns false when there is no overlap', () => {
    const item: MenuItem = { id: '1', name: 'x', ingredients: ['tofu'] };
    expect(containsDislikedIngredient(item, ['beef'])).toBe(false);
  });

  it('returns false when the disliked list is empty', () => {
    const item: MenuItem = { id: '1', name: 'x', ingredients: ['beef'] };
    expect(containsDislikedIngredient(item, [])).toBe(false);
  });
});

describe('annotateRestaurant', () => {
  it('flags traditional dishes and computes distance', () => {
    const result = annotateRestaurant(restaurant, dishes, [], { lat: 52.37, lng: 4.9 });
    expect(result.traditionalCount).toBe(2);
    expect(result.visibleTraditionalCount).toBe(2);
    expect(result.distanceKm).not.toBeNull();
  });

  it('reduces visibleTraditionalCount when a traditional dish contains a disliked ingredient', () => {
    const result = annotateRestaurant(restaurant, dishes, ['beef'], null);
    expect(result.traditionalCount).toBe(2);
    expect(result.visibleTraditionalCount).toBe(1); // kroket hidden, stamppot remains
    expect(result.distanceKm).toBeNull();
  });
});

describe('getVisibleRestaurants', () => {
  it('filters by search text against restaurant and dish names', () => {
    const annotated = [annotateRestaurant(restaurant, dishes, [], null)];
    const visible = getVisibleRestaurants(annotated, {
      searchText: 'kroket',
      hideNonTraditionalMatches: false,
    });
    expect(visible).toHaveLength(1);

    const notFound = getVisibleRestaurants(annotated, {
      searchText: 'sushi',
      hideNonTraditionalMatches: false,
    });
    expect(notFound).toHaveLength(0);
  });

  it('hides restaurants with zero visible traditional dishes when the option is set', () => {
    const allDisliked = annotateRestaurant(restaurant, dishes, ['potato', 'beef'], null);
    const visible = getVisibleRestaurants([allDisliked], {
      searchText: '',
      hideNonTraditionalMatches: true,
    });
    expect(visible).toHaveLength(0);
  });
});
