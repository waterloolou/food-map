import { useCallback, useEffect, useState } from 'react';
import type { LatLng } from '../types';

export type GeolocationStatus = 'idle' | 'loading' | 'success' | 'error' | 'unsupported';

interface GeolocationState {
  location: LatLng | null;
  status: GeolocationStatus;
  errorMessage: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    status: 'idle',
    errorMessage: null,
  });

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({ location: null, status: 'unsupported', errorMessage: 'Geolocation is not supported by this browser.' });
      return;
    }

    setState((prev) => ({ ...prev, status: 'loading', errorMessage: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: { lat: position.coords.latitude, lng: position.coords.longitude },
          status: 'success',
          errorMessage: null,
        });
      },
      (error) => {
        setState({ location: null, status: 'error', errorMessage: error.message });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  useEffect(() => {
    request();
  }, [request]);

  return { ...state, refresh: request };
}
