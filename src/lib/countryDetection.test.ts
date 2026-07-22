import { describe, expect, it } from 'vitest';
import { detectCountry } from './countryDetection';
import { COUNTRIES } from '../data/countries';

describe('detectCountry', () => {
  it('detects Amsterdam as Netherlands', () => {
    const country = detectCountry({ lat: 52.3676, lng: 4.9041 }, COUNTRIES);
    expect(country?.id).toBe('NL');
  });

  it('detects Brussels as Belgium', () => {
    const country = detectCountry({ lat: 50.8503, lng: 4.3517 }, COUNTRIES);
    expect(country?.id).toBe('BE');
  });

  it('detects Paris as France', () => {
    const country = detectCountry({ lat: 48.8566, lng: 2.3522 }, COUNTRIES);
    expect(country?.id).toBe('FR');
  });

  it('detects London as England', () => {
    const country = detectCountry({ lat: 51.5074, lng: -0.1278 }, COUNTRIES);
    expect(country?.id).toBe('GB');
  });

  it('returns null for a point outside all bounding boxes', () => {
    const country = detectCountry({ lat: 40.7128, lng: -74.006 }, COUNTRIES); // New York
    expect(country).toBeNull();
  });

  it('is inclusive of exact bounding box edges', () => {
    const nl = COUNTRIES.find((c) => c.id === 'NL')!;
    const country = detectCountry({ lat: nl.boundingBox.minLat, lng: nl.boundingBox.minLng }, COUNTRIES);
    expect(country?.id).toBe('NL');
  });
});
