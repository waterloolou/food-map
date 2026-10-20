import { useState } from 'react';
import type { Country } from '../types';

interface LocationPickerProps {
  live: boolean;
  label: string;
  demoCities: Country[];
  onUseGps: () => void;
  onSearch: (query: string) => Promise<string | null>; // resolves an error message, or null on success
  onPickDemoCity: (country: Country) => void;
}

export function LocationPicker({ live, label, demoCities, onUseGps, onSearch, onPickDemoCity }: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setBusy(true);
    setError(null);
    const err = await onSearch(query.trim());
    setBusy(false);
    if (err) setError(err);
    else {
      setOpen(false);
      setQuery('');
    }
  }

  return (
    <div className="location">
      <button type="button" className="location-button" aria-expanded={open} onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
        </svg>
        <span className="location-label">{label}</span>
        <span className="location-change">Change</span>
      </button>

      {open && (
        <div className="location-panel">
          <button
            type="button"
            className="button"
            onClick={() => {
              onUseGps();
              setOpen(false);
            }}
          >
            Use my current location
          </button>

          {live ? (
            <form onSubmit={submit} className="location-form">
              <label htmlFor="location-query">Or search a city, ZIP code or address</label>
              <div className="location-form-row">
                <input id="location-query" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Seattle, WA" autoFocus />
                <button type="submit" className="button primary" disabled={busy}>
                  {busy ? 'Finding…' : 'Go'}
                </button>
              </div>
              {error && <p className="form-error">{error}</p>}
            </form>
          ) : (
            <div className="demo-cities">
              <p>Demo mode has restaurants in four cities:</p>
              <div className="demo-city-buttons">
                {demoCities.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="button"
                    onClick={() => {
                      onPickDemoCity(c);
                      setOpen(false);
                    }}
                  >
                    {c.city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
