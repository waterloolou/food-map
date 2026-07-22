# food-map

A map that shows you where to find traditional local cuisine wherever you
are. It detects your location, figures out which country/city you're in,
and highlights restaurants whose menus include traditional dishes from that
place — while letting you filter out dishes containing ingredients you
don't like.

## What it does

- **Location-aware:** uses your browser's geolocation to detect which
  supported city you're in.
- **Traditional-dish matching:** each supported country has a list of
  traditional dishes; restaurant menus are matched against that list so you
  can see at a glance which places actually serve the local classics (not
  just restaurants tagged with a cuisine).
- **Dislike filter:** pick ingredients you don't want (stored locally in
  your browser, no account needed) and matching dishes are hidden/greyed
  out — restaurants left with nothing to recommend drop off the map.
- **Map browsing:** interactive pins, search, a place detail view with
  distance and matched dishes, and a "Get directions" link out to Google
  Maps.

This MVP ships with seed data for four cities: **Amsterdam, Brussels,
Paris, and London**. It runs entirely in the browser — no backend, no API
keys.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL in a browser. If your browser can't get a real
GPS fix (e.g. running in a sandbox, or you're just not in one of the
supported cities), use the **"Simulate location"** control in the
bottom-left corner to jump to Amsterdam, Brussels, Paris, or London, or
type in a manual latitude/longitude.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run test` — run the unit tests (country detection, dish matching,
  ingredient filtering)
- `npm run lint` — lint the codebase

## Project structure

- `src/types` — shared TypeScript types
- `src/data` — seed data: country bounding boxes + traditional dishes,
  mock restaurants and menus
- `src/lib` — pure logic: country detection, traditional-dish matching,
  ingredient/search filtering, distance calculation
- `src/hooks` — `useGeolocation`, `useLocalStorage`
- `src/components` — map view, sidebar (search/filter/list), place detail
  panel, unsupported-region banner, location simulator

## Notes

- Country detection uses simple bounding boxes scoped to the four seeded
  cities, not real country borders — see `src/data/countries.ts`.
- Restaurant data is hand-written mock data in `src/data/restaurants.ts`.
  A real places API could replace it later without touching the matching
  or filtering logic.
