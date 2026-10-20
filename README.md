# Food Map

Find somewhere good to eat near you: pick the kind of food, say how far you'll drive, and Food Map shows the restaurants on a map. Places rated **2 stars or less are crossed off** automatically.

## ▶ [Open Food Map](https://waterloolou.github.io/food-map/)

## What it does
- **Type of food:** BBQ, Chinese, Mexican, Italian, Pizza, Japanese, Thai, Indian and more. Pick several at once, or "Any food".
- **How far you'll drive:** 2, 5, 10 or 20 miles, or type your own (up to 30). It shows a rough drive time and draws the area on the map.
- **Crossed off:** restaurants rated 2 stars or less get a red line through them and sink to the bottom. Tick "Hide 2 stars and below" to remove them.
- **Open now** and **Best rated / Closest** sorting.
- **Anywhere:** uses your location, or search a city, ZIP code or address.
- **Directions** and a link to the place's Google reviews and photos.

## Live data vs. demo mode
Restaurants, ratings and opening hours come from **Google Places**, which needs a Google Maps Platform API key. Without a key, Food Map runs in **demo mode**: sample restaurants in Amsterdam, Brussels, Paris and London, with no ratings. Demo mode keeps the original features: traditional local dishes and a "foods I don't like" filter that hides dishes containing those ingredients.

### Setting up a key
1. In [Google Cloud Console](https://console.cloud.google.com/), create a project, turn on billing, and enable **Maps JavaScript API** and **Places API (New)**.
2. Create an API key. Under *Application restrictions*, choose **Websites** and add `https://waterloolou.github.io/*` (and `http://localhost:5173/*` for local work). Under *API restrictions*, allow only those two APIs.
3. Either:
   - **For everyone:** add it as a repository secret named `GOOGLE_MAPS_API_KEY` (Settings → Secrets and variables → Actions) and re-run the deploy workflow; or
   - **Just for you:** open the site, click the gear, paste the key. It's saved in your browser only.

A browser key is visible to anyone who opens the page; the website restriction in step 2 is what stops others from using it. Google gives a free monthly allowance; check current [Maps Platform pricing](https://mapsplatform.google.com/pricing/).

## Run it locally
```bash
npm install
npm run dev     # http://localhost:5173/food-map/
npm test        # filtering, distance, cross-off and cuisine tests
```
Put `VITE_GOOGLE_MAPS_API_KEY=your-key` in a `.env.local` file to use live data locally.

Built with React, TypeScript, Vite and Leaflet (map tiles © OpenStreetMap contributors).
