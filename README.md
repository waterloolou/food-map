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
  A separate AI enrichment pipeline (see below) can supplement or replace
  it per city without touching the matching or filtering logic.

## AI menu-enrichment pipeline

`enrichment/` is a standalone Node CLI (own `package.json`, not part of
the browser bundle) that grows the restaurant database with **real**
restaurants and **real** menus, rather than hand-writing more mock data:

1. **Discover** real restaurants with a website in each supported city via
   the free OpenStreetMap Overpass API (`enrichment/src/discover/`).
2. **Scrape** each restaurant's own website — homepage, linked menu pages,
   and linked PDF menus (`enrichment/src/scrape/`). Every failure mode
   (bot-blocked, dead link, no menu found, robots.txt disallow) is handled
   as a skip, never a crash.
3. **Parse** the scraped text into structured `{ name, ingredients, price? }`
   menu items using Claude (`enrichment/src/parse/`), via forced tool-use
   so the output always matches the app's `MenuItem` shape. The AI's job
   is extraction only — deciding which dishes are "traditional" and
   applying the dislike filter both stay in the existing, tested
   `src/lib/matching.ts` / `src/lib/filtering.ts`.
4. **Write** the result to `src/data/restaurants.generated.json`. The app's
   `src/data/restaurantSource.ts` prefers this generated data for a city
   once it clears a minimum restaurant count, and otherwise falls back to
   the hand-written mock data for that city — so a low-yield city (few
   scrapable websites, bot-blocked sites, JS-only menus) never regresses
   below the working demo.

**Known coverage limits:** not every real restaurant has a website listed
in OpenStreetMap; scraping uses plain HTTP fetches (no headless browser),
so JS-rendered menus won't be picked up; some sites block scrapers or have
no discoverable menu text at all. Expect a meaningful fraction of
discovered restaurants to be skipped — this is expected and handled, not
a bug.

**Running it:**

```bash
# From the repo root
npm run enrich -- --cities Amsterdam --max-per-city 5 --dry-run   # discovery + scrape only, no LLM calls, no writes
npm run enrich -- --cities Amsterdam --max-per-city 5             # real run for one city
npm run enrich                                                     # all 4 cities, default cap
```

Requires `ANTHROPIC_API_KEY` in the environment for real (non-dry-run)
runs. A scheduled GitHub Actions workflow
(`.github/workflows/enrich-data.yml`) runs this weekly and commits
`restaurants.generated.json` back to `main` only when it actually changes
— that push then triggers the existing Pages deploy automatically. The
workflow needs an `ANTHROPIC_API_KEY` repository secret; it can also be
triggered manually via `workflow_dispatch` with `cities`/`max_per_city`
inputs.
