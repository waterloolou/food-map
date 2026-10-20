import { useEffect, useState } from 'react';
import type { LatLng, Place } from '../types';
import { searchNearbyRestaurants } from '../lib/google';

export type LiveStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Fetches Google restaurants around `origin` whenever the search area or the
 * chosen cuisines change (debounced, so dragging the distance slider doesn't
 * fire a request per step). Disabled when `enabled` is false (demo mode).
 */
export function useLivePlaces(enabled: boolean, origin: LatLng | null, maxMiles: number, cuisines: string[]) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [status, setStatus] = useState<LiveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const cuisineKey = [...cuisines].sort().join(',');
  const lat = origin?.lat;
  const lng = origin?.lng;

  useEffect(() => {
    if (!enabled || lat === undefined || lng === undefined) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      setStatus('loading');
      setError(null);
      searchNearbyRestaurants({ lat, lng }, maxMiles, cuisineKey ? cuisineKey.split(',') : [])
        .then((result) => {
          if (cancelled) return;
          setPlaces(result);
          setStatus('ready');
        })
        .catch((err: Error) => {
          if (cancelled) return;
          setError(err.message);
          setStatus('error');
        });
    }, 450);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [enabled, lat, lng, maxMiles, cuisineKey]);

  return { places, status, error };
}
