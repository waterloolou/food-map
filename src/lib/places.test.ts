import { describe, expect, it } from 'vitest';
import type { Place } from '../types';
import {
  estimateDriveMinutes,
  isCrossedOff,
  matchesCuisines,
  milesForDriveMinutes,
  selectPlaces,
  type PlaceFilters,
} from './places';
import { cuisinesForGoogleTypes } from '../data/cuisines';

const origin = { lat: 47.6062, lng: -122.3321 }; // Seattle

function place(overrides: Partial<Place>): Place {
  return {
    id: overrides.name ?? 'x',
    name: 'Somewhere',
    location: origin,
    address: '1 Main St',
    cuisines: [],
    rating: null,
    ratingCount: null,
    priceLevel: null,
    openNow: null,
    mapsUrl: null,
    source: 'google',
    ...overrides,
  };
}

// ~1 mile north of origin is 1/69 of a degree of latitude
const milesNorth = (mi: number) => ({ lat: origin.lat + mi / 69.0, lng: origin.lng });

const base: PlaceFilters = { cuisines: [], maxMiles: 10, openNowOnly: false, searchText: '', hideCrossedOff: false, sort: 'closest' };

describe('crossing off low-rated places', () => {
  it('crosses off 2 stars and below, not 2.1 or unrated', () => {
    expect(isCrossedOff(1)).toBe(true);
    expect(isCrossedOff(2)).toBe(true);
    expect(isCrossedOff(2.1)).toBe(false);
    expect(isCrossedOff(4.5)).toBe(false);
    expect(isCrossedOff(null)).toBe(false);
  });

  it('keeps crossed-off places but sorts them last', () => {
    const list = selectPlaces(
      [place({ name: 'Bad', rating: 1.8, location: milesNorth(0.5) }), place({ name: 'Good', rating: 4.2, location: milesNorth(3) })],
      origin,
      base,
    );
    expect(list.map((p) => p.name)).toEqual(['Good', 'Bad']);
    expect(list[1].crossedOff).toBe(true);
  });

  it('can hide crossed-off places entirely', () => {
    const list = selectPlaces([place({ name: 'Bad', rating: 2 })], origin, { ...base, hideCrossedOff: true });
    expect(list).toHaveLength(0);
  });
});

describe('distance', () => {
  it('drops places beyond the chosen distance', () => {
    const list = selectPlaces(
      [place({ name: 'Near', location: milesNorth(2) }), place({ name: 'Far', location: milesNorth(12) })],
      origin,
      { ...base, maxMiles: 5 },
    );
    expect(list.map((p) => p.name)).toEqual(['Near']);
    expect(list[0].distanceMiles).toBeCloseTo(2, 1);
  });

  it('estimates drive time and converts back', () => {
    expect(estimateDriveMinutes(10)).toBe(26);
    expect(estimateDriveMinutes(0)).toBe(1);
    expect(estimateDriveMinutes(milesForDriveMinutes(20))).toBe(20);
  });
});

describe('cuisines', () => {
  it('matches any selected cuisine, and everything when none are selected', () => {
    const bbq = place({ cuisines: ['bbq'] });
    expect(matchesCuisines(bbq, [])).toBe(true);
    expect(matchesCuisines(bbq, ['chinese', 'bbq'])).toBe(true);
    expect(matchesCuisines(bbq, ['chinese'])).toBe(false);
  });

  it('maps Google place types to cuisines', () => {
    expect(cuisinesForGoogleTypes(['sushi_restaurant', 'restaurant', 'food'])).toEqual(['japanese']);
    expect(cuisinesForGoogleTypes(['hamburger_restaurant', 'american_restaurant'])).toEqual(['burgers']);
    expect(cuisinesForGoogleTypes(['restaurant'])).toEqual([]);
  });
});

describe('sorting and other filters', () => {
  it('sorts by rating when asked, unrated last', () => {
    const list = selectPlaces(
      [place({ name: 'A', rating: 3.9 }), place({ name: 'B', rating: null }), place({ name: 'C', rating: 4.7 })],
      origin,
      { ...base, sort: 'rating' },
    );
    expect(list.map((p) => p.name)).toEqual(['C', 'A', 'B']);
  });

  it('open-now hides only places known to be closed', () => {
    const list = selectPlaces(
      [place({ name: 'Open', openNow: true }), place({ name: 'Closed', openNow: false }), place({ name: 'Unknown', openNow: null })],
      origin,
      { ...base, openNowOnly: true },
    );
    expect(list.map((p) => p.name).sort()).toEqual(['Open', 'Unknown']);
  });

  it('searches names and addresses', () => {
    const list = selectPlaces([place({ name: 'Taco Time' }), place({ name: 'Pho Bac', address: '1314 S Jackson St' })], origin, {
      ...base,
      searchText: 'jackson',
    });
    expect(list.map((p) => p.name)).toEqual(['Pho Bac']);
  });
});
