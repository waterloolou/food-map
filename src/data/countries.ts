import type { Country } from '../types';

// Bounding boxes are deliberately city-scoped (not real country borders) —
// seed data only covers these four cities, so detection is scoped to match.
export const COUNTRIES: Country[] = [
  {
    id: 'NL',
    name: 'Netherlands',
    city: 'Amsterdam',
    center: { lat: 52.3676, lng: 4.9041 },
    boundingBox: { minLat: 52.28, maxLat: 52.45, minLng: 4.75, maxLng: 5.05 },
    traditionalDishes: [
      { name: 'stamppot' },
      { name: 'bitterballen' },
      { name: 'kroket', aliases: ['kroketten'] },
      { name: 'poffertjes' },
      { name: 'haring', aliases: ['herring'] },
      { name: 'erwtensoep', aliases: ['pea soup'] },
      { name: 'paling', aliases: ['gerookte paling', 'smoked eel'] },
    ],
  },
  {
    id: 'BE',
    name: 'Belgium',
    city: 'Brussels',
    center: { lat: 50.8503, lng: 4.3517 },
    boundingBox: { minLat: 50.75, maxLat: 50.95, minLng: 4.25, maxLng: 4.5 },
    traditionalDishes: [
      { name: 'moules-frites', aliases: ['moules frites', 'mussels and fries', 'mussels'] },
      { name: 'waterzooi' },
      { name: 'frites', aliases: ['belgian fries'] },
      { name: 'carbonade flamande', aliases: ['stoofvlees', 'flemish beef stew'] },
      { name: 'speculoos' },
    ],
  },
  {
    id: 'FR',
    name: 'France',
    city: 'Paris',
    center: { lat: 48.8566, lng: 2.3522 },
    boundingBox: { minLat: 48.75, maxLat: 48.95, minLng: 2.2, maxLng: 2.5 },
    traditionalDishes: [
      { name: 'steak-frites', aliases: ['steak frites'] },
      { name: 'croissant' },
      { name: 'coq au vin' },
      { name: 'onion soup', aliases: ['soupe à l\'oignon', 'french onion soup'] },
      { name: 'crème brûlée', aliases: ['creme brulee'] },
      { name: 'escargot', aliases: ['escargots'] },
    ],
  },
  {
    id: 'GB',
    name: 'England',
    city: 'London',
    center: { lat: 51.5074, lng: -0.1278 },
    boundingBox: { minLat: 51.4, maxLat: 51.6, minLng: -0.3, maxLng: 0.1 },
    traditionalDishes: [
      { name: 'fish and chips' },
      { name: 'sunday roast' },
      { name: 'shepherd\'s pie', aliases: ['shepherds pie'] },
      { name: 'bangers and mash' },
      { name: 'full english breakfast', aliases: ['full english'] },
    ],
  },
];
