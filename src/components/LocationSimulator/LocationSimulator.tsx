import { useState } from 'react';
import type { Country } from '../../types';

interface LocationSimulatorProps {
  countries: Country[];
  onSelectCountry: (country: Country) => void;
  onUseRealLocation: () => void;
  onManualSubmit: (lat: number, lng: number) => void;
}

export function LocationSimulator({
  countries,
  onSelectCountry,
  onUseRealLocation,
  onManualSubmit,
}: LocationSimulatorProps) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  function handleManualSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) {
      onManualSubmit(parsedLat, parsedLng);
    }
  }

  return (
    <details className="location-simulator">
      <summary>Simulate location</summary>
      <div className="location-simulator-body">
        <p className="location-simulator-hint">
          No real GPS here? Jump to a supported city, or use your device's real location.
        </p>
        <div className="location-simulator-cities">
          {countries.map((country) => (
            <button key={country.id} type="button" onClick={() => onSelectCountry(country)}>
              {country.city}
            </button>
          ))}
        </div>
        <button type="button" className="use-real-location" onClick={onUseRealLocation}>
          Use my real location
        </button>
        <form className="manual-location-form" onSubmit={handleManualSubmit}>
          <input
            type="text"
            placeholder="lat"
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            aria-label="Latitude"
          />
          <input
            type="text"
            placeholder="lng"
            value={lng}
            onChange={(event) => setLng(event.target.value)}
            aria-label="Longitude"
          />
          <button type="submit">Go</button>
        </form>
      </div>
    </details>
  );
}
