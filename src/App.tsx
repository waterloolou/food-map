import { useMemo, useState } from 'react';
import './App.css';
import { COUNTRIES } from './data/countries';
import { useGeolocation } from './hooks/useGeolocation';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useLivePlaces } from './hooks/useLivePlaces';
import { detectCountry } from './lib/countryDetection';
import { demoPlaces } from './lib/demo';
import { activeKey, findLocation } from './lib/google';
import { selectPlaces, type PlaceFilters } from './lib/places';
import { CuisinePicker, DistancePicker, ToggleRow } from './components/Filters';
import { PlaceList } from './components/PlaceList';
import { MapView } from './components/MapView/MapView';
import { LocationPicker } from './components/LocationPicker';
import { SettingsDialog } from './components/SettingsDialog';
import type { LatLng } from './types';

const DEFAULT_FILTERS: PlaceFilters = {
  cuisines: [],
  maxMiles: 5,
  openNowOnly: false,
  searchText: '',
  hideCrossedOff: false,
  sort: 'closest',
};

interface ChosenLocation {
  location: LatLng;
  label: string;
}

function App() {
  const live = Boolean(activeKey());
  const geo = useGeolocation();
  const [chosen, setChosen] = useState<ChosenLocation | null>(null);
  const [savedFilters, setSavedFilters] = useLocalStorage<Omit<PlaceFilters, 'searchText'>>('food-map-filters', DEFAULT_FILTERS);
  const [searchText, setSearchText] = useState('');
  const filters: PlaceFilters = { ...DEFAULT_FILTERS, ...savedFilters, searchText };
  const setFilter = <K extends keyof PlaceFilters>(key: K, value: PlaceFilters[K]) =>
    setSavedFilters((prev) => ({ ...DEFAULT_FILTERS, ...prev, [key]: value }));

  const [disliked, setDisliked] = useLocalStorage<string[]>('food-map-disliked-ingredients', []);
  const [onlyTraditional, setOnlyTraditional] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const origin = chosen?.location ?? geo.location;
  const originLabel = chosen?.label ?? (geo.location ? 'Your location' : geo.status === 'loading' ? 'Finding you…' : 'Choose a location');
  const demoCountry = !live && origin ? detectCountry(origin, COUNTRIES) : null;

  const livePlaces = useLivePlaces(live, origin, filters.maxMiles, filters.cuisines);

  const allPlaces = useMemo(() => {
    if (live) return livePlaces.places;
    if (!demoCountry) return [];
    const list = demoPlaces(demoCountry, disliked, origin);
    return onlyTraditional ? list.filter((p) => (p.demo?.visibleTraditionalCount ?? 0) > 0) : list;
  }, [live, livePlaces.places, demoCountry, disliked, origin, onlyTraditional]);

  const shown = useMemo(
    () => (origin ? selectPlaces(allPlaces, origin, filters) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allPlaces, origin, JSON.stringify(filters)],
  );
  const crossedCount = shown.filter((p) => p.crossedOff).length;

  const demoIngredients = useMemo(() => {
    if (live || !demoCountry) return [];
    const set = new Set<string>();
    demoPlaces(demoCountry, [], null).forEach((p) => p.demo?.menu.forEach((m) => m.ingredients.forEach((i) => set.add(i))));
    return [...set].sort();
  }, [live, demoCountry]);

  async function searchLocation(query: string): Promise<string | null> {
    try {
      const found = await findLocation(query);
      if (!found) return `Couldn't find "${query}". Try a city name or ZIP code.`;
      setChosen(found);
      setSelectedId(null);
      return null;
    } catch (err) {
      return (err as Error).message;
    }
  }

  const mapCenter = origin ?? (live ? { lat: 47.6062, lng: -122.3321 } : COUNTRIES[0].center);

  let listMessage: React.ReactNode = null;
  if (!origin) {
    listMessage =
      geo.status === 'loading' ? (
        <p>Finding your location… If your browser asks, allow location access, or use Change above to pick a place.</p>
      ) : (
        <p>Use Change above to {live ? 'search for a city or address' : 'pick a demo city'}.</p>
      );
  } else if (!live && !demoCountry) {
    listMessage = <p>Demo mode only has restaurants in Amsterdam, Brussels, Paris and London. Use Change above to jump to one, or add a Google key for real places near you.</p>;
  } else if (live && livePlaces.status === 'error') {
    listMessage = (
      <div className="error-box">
        <p>{livePlaces.error}</p>
        <button type="button" className="button" onClick={() => setSettingsOpen(true)}>
          Open settings
        </button>
      </div>
    );
  } else if (live && livePlaces.status === 'loading' && allPlaces.length === 0) {
    listMessage = <p>Finding restaurants…</p>;
  } else if (shown.length === 0) {
    listMessage = <p>Nothing matches within {filters.maxMiles} mi. Try a longer drive or more food types.</p>;
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="brand">Food Map</h1>
        <LocationPicker
          live={live}
          label={originLabel}
          demoCities={COUNTRIES}
          onUseGps={() => {
            setChosen(null);
            geo.refresh();
          }}
          onSearch={searchLocation}
          onPickDemoCity={(c) => {
            setChosen({ location: c.center, label: `${c.city} (demo)` });
            setSelectedId(null);
          }}
        />
        <input
          className="search"
          type="search"
          placeholder={live ? 'Search by name or street' : 'Search restaurants or dishes'}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          aria-label="Search restaurants"
        />
        <button type="button" className="icon-button" onClick={() => setSettingsOpen(true)} aria-label="Settings">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              fill="currentColor"
              d="M19.4 13a7.6 7.6 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3h-4l-.3 2.9a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.6 7.6 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1L11 21h4l.3-2.9a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5ZM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"
            />
          </svg>
        </button>
      </header>

      {!live && (
        <div className="demo-banner">
          <span>Demo mode: sample restaurants in four European cities, without ratings.</span>
          <button type="button" className="link-button" onClick={() => setSettingsOpen(true)}>
            Add a Google key for real places near you
          </button>
        </div>
      )}

      <section className="filters" aria-label="Filters">
        <CuisinePicker selected={filters.cuisines} onChange={(c) => setFilter('cuisines', c)} />
        <div className="filter-row">
          <DistancePicker miles={filters.maxMiles} onChange={(m) => setFilter('maxMiles', m)} />
          <ToggleRow
            showRatingControls={live}
            openNowOnly={filters.openNowOnly}
            onOpenNowOnly={(v) => setFilter('openNowOnly', v)}
            hideCrossedOff={filters.hideCrossedOff}
            onHideCrossedOff={(v) => setFilter('hideCrossedOff', v)}
            sort={filters.sort}
            onSort={(v) => setFilter('sort', v)}
          />
        </div>
        {!live && demoCountry && (
          <details className="demo-extras">
            <summary>Menu filters{disliked.length > 0 ? ` (${disliked.length} disliked)` : ''}</summary>
            <label className="switch">
              <input type="checkbox" checked={onlyTraditional} onChange={(e) => setOnlyTraditional(e.target.checked)} />
              Only places with traditional local dishes
            </label>
            <p className="filter-label">Foods I don't like</p>
            <div className="ingredient-chips">
              {demoIngredients.map((i) => (
                <button
                  key={i}
                  type="button"
                  className="chip small"
                  aria-pressed={disliked.includes(i)}
                  onClick={() => setDisliked((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))}
                >
                  {i}
                </button>
              ))}
            </div>
          </details>
        )}
      </section>

      <main className="results">
        <div className="list-pane">
          {origin && shown.length > 0 && (
            <p className="summary" aria-live="polite">
              <strong>{shown.length}</strong> {shown.length === 1 ? 'place' : 'places'} within {filters.maxMiles} mi
              {crossedCount > 0 && <span className="summary-crossed">, {crossedCount} crossed off for low ratings</span>}
              {live && livePlaces.status === 'loading' && <span className="summary-loading"> Updating…</span>}
            </p>
          )}
          {listMessage && <div className="list-message">{listMessage}</div>}
          <PlaceList places={shown} selectedId={selectedId} onSelect={setSelectedId} />
          {live && <p className="attribution">Restaurant data from Google</p>}
        </div>
        <div className="map-pane">
          <MapView origin={mapCenter} maxMiles={filters.maxMiles} places={shown} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </main>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default App;
