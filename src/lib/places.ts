import type { LatLng, Place, PlaceWithDistance } from '../types';
import { haversineDistanceKm } from './distance';

export const KM_PER_MILE = 1.609344;

/** Places rated this many stars or fewer are crossed off. */
export const CROSS_OFF_AT_OR_BELOW = 2;

// Roads wind, so driving distance is usually ~30% longer than a straight
// line, and ~30 mph is a fair average with lights and traffic. This is an
// estimate for choosing where to eat, not a route.
const ROAD_FACTOR = 1.3;
const AVERAGE_MPH = 30;

export function estimateDriveMinutes(straightLineMiles: number): number {
  return Math.max(1, Math.round(((straightLineMiles * ROAD_FACTOR) / AVERAGE_MPH) * 60));
}

/** The straight-line radius that matches a given drive time (inverse of estimateDriveMinutes). */
export function milesForDriveMinutes(minutes: number): number {
  return (minutes / 60) * AVERAGE_MPH / ROAD_FACTOR;
}

export function isCrossedOff(rating: number | null): boolean {
  return rating !== null && rating <= CROSS_OFF_AT_OR_BELOW;
}

export function withDistance(place: Place, origin: LatLng): PlaceWithDistance {
  const distanceMiles = haversineDistanceKm(origin, place.location) / KM_PER_MILE;
  return {
    ...place,
    distanceMiles,
    driveMinutes: estimateDriveMinutes(distanceMiles),
    crossedOff: isCrossedOff(place.rating),
  };
}

export type SortOrder = 'closest' | 'rating';

export interface PlaceFilters {
  cuisines: string[]; // empty = every cuisine
  maxMiles: number;
  openNowOnly: boolean;
  searchText: string;
  hideCrossedOff: boolean;
  sort: SortOrder;
}

export function matchesCuisines(place: Place, cuisines: string[]): boolean {
  return cuisines.length === 0 || place.cuisines.some((c) => cuisines.includes(c));
}

function matchesSearch(place: PlaceWithDistance, searchText: string): boolean {
  const q = searchText.trim().toLowerCase();
  if (!q) return true;
  if (place.name.toLowerCase().includes(q) || place.address.toLowerCase().includes(q)) return true;
  return place.demo?.matchedMenu.some((item) => item.name.toLowerCase().includes(q)) ?? false;
}

/**
 * Filters and sorts places for display. Crossed-off places stay in the list
 * (struck through, at the bottom) unless hideCrossedOff is on, so people can
 * see what was ruled out and why.
 */
export function selectPlaces(places: Place[], origin: LatLng, filters: PlaceFilters): PlaceWithDistance[] {
  const result = places
    .map((p) => withDistance(p, origin))
    .filter(
      (p) =>
        p.distanceMiles <= filters.maxMiles &&
        matchesCuisines(p, filters.cuisines) &&
        (!filters.openNowOnly || p.openNow !== false) &&
        (!filters.hideCrossedOff || !p.crossedOff) &&
        matchesSearch(p, filters.searchText),
    );

  return result.sort((a, b) => {
    if (a.crossedOff !== b.crossedOff) return a.crossedOff ? 1 : -1;
    if (filters.sort === 'rating') {
      const ra = a.rating ?? -1;
      const rb = b.rating ?? -1;
      if (rb !== ra) return rb - ra;
    }
    return a.distanceMiles - b.distanceMiles;
  });
}

export function formatMiles(miles: number): string {
  if (miles < 0.1) return 'under 0.1 mi';
  return `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`;
}

export function priceLabel(level: number | null): string {
  return level ? '$'.repeat(level) : '';
}
