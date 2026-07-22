import { useMemo, useState } from 'react';
import './App.css';
import { COUNTRIES } from './data/countries';
import { RESTAURANTS } from './data/restaurants';
import { useGeolocation } from './hooks/useGeolocation';
import { useLocalStorage } from './hooks/useLocalStorage';
import { detectCountry } from './lib/countryDetection';
import { buildRestaurantsForCountry, getVisibleRestaurants } from './lib/filtering';
import { MapView } from './components/MapView/MapView';
import { Sidebar } from './components/Sidebar/Sidebar';
import { PlaceDetailPanel } from './components/PlaceDetail/PlaceDetailPanel';
import { UnsupportedRegionBanner } from './components/StatusBanner/UnsupportedRegionBanner';
import { LocationSimulator } from './components/LocationSimulator/LocationSimulator';
import type { LatLng } from './types';

function App() {
  const geo = useGeolocation();
  const [overrideLocation, setOverrideLocation] = useState<LatLng | null>(null);
  const [dislikedIngredients, setDislikedIngredients] = useLocalStorage<string[]>(
    'food-map-disliked-ingredients',
    [],
  );
  const [searchText, setSearchText] = useState('');
  const [onlyTraditional, setOnlyTraditional] = useState(true);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const effectiveLocation = overrideLocation ?? geo.location;
  const detectedCountry = effectiveLocation ? detectCountry(effectiveLocation, COUNTRIES) : null;

  const restaurantsForCountry = useMemo(
    () =>
      detectedCountry
        ? buildRestaurantsForCountry(RESTAURANTS, detectedCountry, dislikedIngredients, effectiveLocation)
        : [],
    [detectedCountry, dislikedIngredients, effectiveLocation],
  );

  const visibleRestaurants = useMemo(
    () => getVisibleRestaurants(restaurantsForCountry, { searchText, hideNonTraditionalMatches: onlyTraditional }),
    [restaurantsForCountry, searchText, onlyTraditional],
  );

  const availableIngredients = useMemo(() => {
    const set = new Set<string>();
    restaurantsForCountry.forEach((restaurant) =>
      restaurant.menu.forEach((item) => item.ingredients.forEach((ingredient) => set.add(ingredient))),
    );
    return Array.from(set).sort();
  }, [restaurantsForCountry]);

  const selectedRestaurant = restaurantsForCountry.find((r) => r.id === selectedRestaurantId) ?? null;
  const mapCenter = effectiveLocation ?? detectedCountry?.center ?? COUNTRIES[0].center;

  function toggleIngredient(ingredient: string) {
    setDislikedIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((i) => i !== ingredient) : [...prev, ingredient],
    );
  }

  const isLocating = geo.status === 'loading' && !overrideLocation;
  const hasNoLocation = !effectiveLocation && !isLocating;

  return (
    <div className="app-shell">
      {isLocating && (
        <div className="status-overlay">
          <p>Finding your location…</p>
        </div>
      )}

      {hasNoLocation && (
        <div className="status-overlay">
          <p>
            {geo.status === 'error' || geo.status === 'unsupported'
              ? geo.errorMessage ?? "Couldn't get your location."
              : 'Waiting for your location…'}
          </p>
          <p className="status-overlay-hint">Use "Simulate location" below to try the app.</p>
        </div>
      )}

      {effectiveLocation && !detectedCountry && <UnsupportedRegionBanner countries={COUNTRIES} />}

      {effectiveLocation && detectedCountry && (
        <div className="main-layout">
          <Sidebar
            countryName={detectedCountry.name}
            cityName={detectedCountry.city}
            searchText={searchText}
            onSearchChange={setSearchText}
            availableIngredients={availableIngredients}
            dislikedIngredients={dislikedIngredients}
            onToggleIngredient={toggleIngredient}
            onlyTraditional={onlyTraditional}
            onToggleOnlyTraditional={() => setOnlyTraditional((prev) => !prev)}
            restaurants={visibleRestaurants}
            selectedId={selectedRestaurantId}
            onSelect={setSelectedRestaurantId}
          />
          <div className="map-area">
            <MapView
              center={mapCenter}
              userLocation={effectiveLocation}
              restaurants={visibleRestaurants}
              selectedId={selectedRestaurantId}
              onSelect={setSelectedRestaurantId}
            />
            {selectedRestaurant && (
              <PlaceDetailPanel restaurant={selectedRestaurant} onClose={() => setSelectedRestaurantId(null)} />
            )}
          </div>
        </div>
      )}

      <div className="location-simulator-dock">
        <LocationSimulator
          countries={COUNTRIES}
          onSelectCountry={(country) => setOverrideLocation(country.center)}
          onUseRealLocation={() => {
            setOverrideLocation(null);
            geo.refresh();
          }}
          onManualSubmit={(lat, lng) => setOverrideLocation({ lat, lng })}
        />
      </div>
    </div>
  );
}

export default App;
