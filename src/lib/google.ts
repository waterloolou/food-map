// Live restaurant data from Google Places, through the Maps JavaScript API's
// Places library (the browser-friendly way to call Places from a static site).
//
// Needs a Google Maps Platform API key with "Maps JavaScript API" and
// "Places API (New)" enabled. The key comes from the site build
// (VITE_GOOGLE_MAPS_API_KEY, set from a GitHub secret) or from the key a
// visitor pastes into Settings, which is kept in their browser only.
// Restrict the key to your site's address in Google Cloud: a browser key is
// visible to anyone who opens the page, and the restriction is what stops
// other sites from using it.

import type { LatLng, Place } from '../types';
import { CUISINE_BY_ID, cuisinesForGoogleTypes } from '../data/cuisines';
import { KM_PER_MILE } from './places';

const STORAGE_KEY = 'food-map-google-key';
const MAX_RADIUS_METERS = 50_000; // Places API limit (~31 miles)

export const BUILT_IN_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

export function getSavedKey(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveKey(key: string): void {
  try {
    if (key) window.localStorage.setItem(STORAGE_KEY, key);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable: the key only lasts until the page is closed.
  }
}

/** The key in use: one saved in this browser wins over the site's built-in key. */
export function activeKey(): string {
  return getSavedKey() || BUILT_IN_KEY;
}

// --- loading the Maps JavaScript API -------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
type Google = any;
declare global {
  interface Window {
    google?: Google;
    gm_authFailure?: () => void;
    __foodMapGoogleReady?: () => void;
  }
}

let loading: Promise<Google> | null = null;
let authFailed = false;

export class GoogleSetupError extends Error {}

function loadGoogle(key: string): Promise<Google> {
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    window.gm_authFailure = () => {
      authFailed = true;
      reject(new GoogleSetupError('Google rejected the API key. Check that it is correct, that billing is on, and that this site is allowed to use it.'));
    };
    window.__foodMapGoogleReady = () => resolve(window.google);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&callback=__foodMapGoogleReady`;
    script.async = true;
    script.onerror = () => reject(new GoogleSetupError("Couldn't load Google Maps. Check your internet connection."));
    document.head.appendChild(script);
  });
  return loading;
}

async function placesLibrary(key: string) {
  const google = await loadGoogle(key);
  if (authFailed) throw new GoogleSetupError('Google rejected the API key.');
  return google.maps.importLibrary('places');
}

function explain(err: unknown): Error {
  if (err instanceof GoogleSetupError) return err;
  const msg = String((err as Error)?.message ?? err);
  if (/not (been )?(used|enabled)|PERMISSION_DENIED|disabled/i.test(msg)) {
    return new GoogleSetupError('Turn on "Places API (New)" for your key in Google Cloud, then reload.');
  }
  if (/REQUEST_DENIED|API key|referer|referrer/i.test(msg)) {
    return new GoogleSetupError('Google refused the request for this key. Check the key\'s website restrictions in Google Cloud.');
  }
  return new Error(`Google Places error: ${msg}`);
}

// --- converting results -------------------------------------------------

const PRICE_LEVELS: Record<string, number> = { INEXPENSIVE: 1, MODERATE: 2, EXPENSIVE: 3, VERY_EXPENSIVE: 4 };

async function toPlace(p: Google, searchedCuisine: string | null): Promise<Place> {
  const types: string[] = [p.primaryType, ...(p.types ?? [])].filter(Boolean);
  const cuisines = cuisinesForGoogleTypes(types);
  if (searchedCuisine && !cuisines.includes(searchedCuisine)) cuisines.unshift(searchedCuisine);
  let openNow: boolean | null = null;
  try {
    const open = await p.isOpen?.();
    openNow = typeof open === 'boolean' ? open : null;
  } catch {
    openNow = null;
  }
  return {
    id: `g-${p.id}`,
    name: p.displayName ?? 'Unnamed place',
    location: { lat: p.location.lat(), lng: p.location.lng() },
    address: p.formattedAddress ?? '',
    cuisines,
    rating: typeof p.rating === 'number' ? p.rating : null,
    ratingCount: typeof p.userRatingCount === 'number' ? p.userRatingCount : null,
    priceLevel: PRICE_LEVELS[String(p.priceLevel)] ?? null,
    openNow,
    mapsUrl: p.googleMapsURI ?? null,
    source: 'google',
  };
}

const FIELDS = [
  'id',
  'displayName',
  'location',
  'formattedAddress',
  'rating',
  'userRatingCount',
  'priceLevel',
  'primaryType',
  'types',
  'googleMapsURI',
  'regularOpeningHours',
  'utcOffsetMinutes',
  'businessStatus',
];

// --- searching --------------------------------------------------------------

const cache = new Map<string, Place[]>();

/**
 * Restaurants near `origin` within `maxMiles`. One Google request per
 * selected cuisine (each returns up to 20 places), or two broad requests
 * (most popular + closest) when no cuisine is selected.
 */
export async function searchNearbyRestaurants(origin: LatLng, maxMiles: number, cuisineIds: string[]): Promise<Place[]> {
  const key = activeKey();
  if (!key) return [];
  let lib: Google;
  try {
    lib = await placesLibrary(key);
  } catch (err) {
    throw explain(err);
  }
  const { Place: GPlace, SearchNearbyRankPreference } = lib;
  const radius = Math.min(MAX_RADIUS_METERS, Math.round(maxMiles * KM_PER_MILE * 1000));
  const center = { lat: origin.lat, lng: origin.lng };

  const queries: { cuisine: string | null; types: string[]; rank: unknown }[] = cuisineIds.length
    ? cuisineIds.map((id) => ({ cuisine: id, types: CUISINE_BY_ID.get(id)?.googleTypes ?? ['restaurant'], rank: SearchNearbyRankPreference.POPULARITY }))
    : [
        { cuisine: null, types: ['restaurant'], rank: SearchNearbyRankPreference.POPULARITY },
        { cuisine: null, types: ['restaurant'], rank: SearchNearbyRankPreference.DISTANCE },
      ];

  const results = await Promise.all(
    queries.map(async (q) => {
      const cacheKey = [q.types.join(','), String(q.rank), center.lat.toFixed(3), center.lng.toFixed(3), radius].join('|');
      const hit = cache.get(cacheKey);
      if (hit) return hit;
      try {
        const { places } = await GPlace.searchNearby({
          fields: FIELDS,
          locationRestriction: { center, radius },
          includedTypes: q.types,
          maxResultCount: 20,
          rankPreference: q.rank,
        });
        const open = (places as Google[]).filter((p) => !p.businessStatus || p.businessStatus === 'OPERATIONAL');
        const converted = await Promise.all(open.map((p) => toPlace(p, q.cuisine)));
        cache.set(cacheKey, converted);
        return converted;
      } catch (err) {
        throw explain(err);
      }
    }),
  );

  // The same place can come back from several cuisine searches: merge their tags.
  // Keyed by place id, and also by name + position in case one place ever comes back under two ids.
  const byId = new Map<string, Place>();
  const idForSpot = new Map<string, string>();
  for (const p of results.flat()) {
    const spot = `${p.name.toLowerCase()}|${p.location.lat.toFixed(4)}|${p.location.lng.toFixed(4)}`;
    const knownId = idForSpot.get(spot) ?? p.id;
    idForSpot.set(spot, knownId);
    const seen = byId.get(knownId);
    if (seen) seen.cuisines = [...new Set([...seen.cuisines, ...p.cuisines])];
    else byId.set(knownId, { ...p, cuisines: [...p.cuisines] });
  }
  return [...byId.values()];
}

/** Looks up a typed place ("Seattle", "98101", an address) to search around. */
export async function findLocation(query: string): Promise<{ location: LatLng; label: string } | null> {
  const key = activeKey();
  if (!key) return null;
  try {
    const { Place: GPlace } = await placesLibrary(key);
    const { places } = await GPlace.searchByText({ textQuery: query, fields: ['location', 'displayName', 'formattedAddress'], maxResultCount: 1 });
    const p = places?.[0];
    if (!p) return null;
    return { location: { lat: p.location.lat(), lng: p.location.lng() }, label: p.formattedAddress || p.displayName || query };
  } catch (err) {
    throw explain(err);
  }
}
