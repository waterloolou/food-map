import type { Restaurant } from '../types';

export const RESTAURANTS: Restaurant[] = [
  // --- Amsterdam, Netherlands ---
  {
    id: 'nl-1',
    name: 'Café de Ooievaar',
    location: { lat: 52.3702, lng: 4.8952 },
    address: 'Prinsengracht 12, Amsterdam',
    countryId: 'NL',
    menu: [
      { id: 'nl-1-1', name: 'Stamppot met rookworst', ingredients: ['potato', 'kale', 'smoked sausage'], price: 14 },
      { id: 'nl-1-2', name: 'Bitterballen', ingredients: ['beef ragout', 'breadcrumbs', 'veal stock'], price: 7 },
      { id: 'nl-1-3', name: 'Kroket sandwich', ingredients: ['beef ragout', 'breadcrumbs', 'bread', 'mustard'], price: 6 },
      { id: 'nl-1-4', name: 'Tomato soup', ingredients: ['tomato', 'cream', 'basil'], price: 6 },
    ],
  },
  {
    id: 'nl-2',
    name: 'Pancake Corner',
    location: { lat: 52.3646, lng: 4.8886 },
    address: 'Leidsestraat 45, Amsterdam',
    countryId: 'NL',
    menu: [
      { id: 'nl-2-1', name: 'Poffertjes', ingredients: ['buttermilk', 'flour', 'butter', 'powdered sugar'], price: 8 },
      { id: 'nl-2-2', name: 'Apple pie', ingredients: ['apple', 'cinnamon', 'pastry'], price: 5 },
      { id: 'nl-2-3', name: 'Coffee', ingredients: ['coffee beans', 'milk'], price: 3 },
    ],
  },
  {
    id: 'nl-3',
    name: 'Sushi Botel',
    location: { lat: 52.3789, lng: 4.9127 },
    address: 'Oosterdokskade 3, Amsterdam',
    countryId: 'NL',
    menu: [
      { id: 'nl-3-1', name: 'Salmon nigiri', ingredients: ['salmon', 'rice', 'nori'], price: 9 },
      { id: 'nl-3-2', name: 'Vegetable tempura', ingredients: ['mixed vegetables', 'batter'], price: 8 },
      { id: 'nl-3-3', name: 'Miso soup', ingredients: ['miso', 'tofu', 'seaweed'], price: 4 },
    ],
  },
  {
    id: 'nl-4',
    name: 'Haring Huis',
    location: { lat: 52.3667, lng: 4.8945 },
    address: 'Spui 8, Amsterdam',
    countryId: 'NL',
    menu: [
      { id: 'nl-4-1', name: 'Haring met ui', ingredients: ['herring', 'onion', 'pickle'], price: 5 },
      { id: 'nl-4-2', name: 'Kibbeling', ingredients: ['cod', 'batter', 'mayonnaise'], price: 7 },
    ],
  },

  // --- Brussels, Belgium ---
  {
    id: 'be-1',
    name: 'Chez Marcel',
    location: { lat: 50.8467, lng: 4.3525 },
    address: 'Rue des Bouchers 20, Brussels',
    countryId: 'BE',
    menu: [
      { id: 'be-1-1', name: 'Moules-frites', ingredients: ['mussels', 'white wine', 'celery', 'potato'], price: 22 },
      { id: 'be-1-2', name: 'Waterzooi', ingredients: ['chicken', 'cream', 'leek', 'carrot'], price: 19 },
      { id: 'be-1-3', name: 'Frites', ingredients: ['potato', 'oil', 'salt'], price: 5 },
    ],
  },
  {
    id: 'be-2',
    name: 'Belgian Waffle Bar',
    location: { lat: 50.8503, lng: 4.3488 },
    address: 'Grand Place 4, Brussels',
    countryId: 'BE',
    menu: [
      { id: 'be-2-1', name: 'Liège waffle', ingredients: ['flour', 'pearl sugar', 'butter'], price: 6 },
      { id: 'be-2-2', name: 'Brussels waffle', ingredients: ['flour', 'eggs', 'milk', 'powdered sugar'], price: 6 },
      { id: 'be-2-3', name: 'Hot chocolate', ingredients: ['chocolate', 'milk'], price: 4 },
    ],
  },
  {
    id: 'be-3',
    name: 'Trattoria Roma',
    location: { lat: 50.8425, lng: 4.3601 },
    address: 'Rue Antoine Dansaert 60, Brussels',
    countryId: 'BE',
    menu: [
      { id: 'be-3-1', name: 'Margherita pizza', ingredients: ['tomato', 'mozzarella', 'basil'], price: 13 },
      { id: 'be-3-2', name: 'Spaghetti carbonara', ingredients: ['egg', 'pancetta', 'parmesan'], price: 15 },
      { id: 'be-3-3', name: 'Tiramisu', ingredients: ['mascarpone', 'coffee', 'cocoa'], price: 7 },
    ],
  },
  {
    id: 'be-4',
    name: 'Friterie du Coin',
    location: { lat: 50.8558, lng: 4.3468 },
    address: 'Place Sainte-Catherine 9, Brussels',
    countryId: 'BE',
    menu: [
      { id: 'be-4-1', name: 'Frites', ingredients: ['potato', 'oil'], price: 4 },
      { id: 'be-4-2', name: 'Carbonade flamande', ingredients: ['beef', 'beer', 'onion'], price: 17 },
      { id: 'be-4-3', name: 'Speculoos', ingredients: ['flour', 'brown sugar', 'cinnamon'], price: 3 },
    ],
  },

  // --- Paris, France ---
  {
    id: 'fr-1',
    name: 'Le Petit Bistro',
    location: { lat: 48.8546, lng: 2.3477 },
    address: 'Rue de Seine 15, Paris',
    countryId: 'FR',
    menu: [
      { id: 'fr-1-1', name: 'Steak-frites', ingredients: ['beef', 'potato', 'butter'], price: 24 },
      { id: 'fr-1-2', name: 'Coq au vin', ingredients: ['chicken', 'red wine', 'mushroom', 'bacon'], price: 22 },
      { id: 'fr-1-3', name: 'Onion soup', ingredients: ['onion', 'beef stock', 'gruyère cheese', 'bread'], price: 10 },
    ],
  },
  {
    id: 'fr-2',
    name: 'Boulangerie Saint-Michel',
    location: { lat: 48.8534, lng: 2.3441 },
    address: 'Boulevard Saint-Michel 22, Paris',
    countryId: 'FR',
    menu: [
      { id: 'fr-2-1', name: 'Croissant', ingredients: ['butter', 'flour', 'yeast'], price: 2 },
      { id: 'fr-2-2', name: 'Pain au chocolat', ingredients: ['butter', 'flour', 'chocolate'], price: 3 },
      { id: 'fr-2-3', name: 'Baguette', ingredients: ['flour', 'water', 'salt'], price: 1.5 },
    ],
  },
  {
    id: 'fr-3',
    name: "Escargot d'Or",
    location: { lat: 48.8601, lng: 2.3376 },
    address: 'Rue de Rivoli 88, Paris',
    countryId: 'FR',
    menu: [
      { id: 'fr-3-1', name: 'Escargot', ingredients: ['snails', 'garlic', 'butter', 'parsley'], price: 16 },
      { id: 'fr-3-2', name: 'Crème brûlée', ingredients: ['cream', 'egg yolk', 'vanilla', 'sugar'], price: 8 },
      { id: 'fr-3-3', name: "French onion soup", ingredients: ['onion', 'beef stock', 'cheese'], price: 10 },
    ],
  },
  {
    id: 'fr-4',
    name: 'Ramen Kyoto',
    location: { lat: 48.8496, lng: 2.3487 },
    address: 'Rue Monsieur le Prince 5, Paris',
    countryId: 'FR',
    menu: [
      { id: 'fr-4-1', name: 'Tonkotsu ramen', ingredients: ['pork broth', 'noodles', 'egg', 'pork belly'], price: 14 },
      { id: 'fr-4-2', name: 'Gyoza', ingredients: ['pork', 'cabbage', 'garlic'], price: 7 },
    ],
  },

  // --- London, England ---
  {
    id: 'gb-1',
    name: 'The Rose & Crown',
    location: { lat: 51.5136, lng: -0.0983 },
    address: '14 Charterhouse St, London',
    countryId: 'GB',
    menu: [
      { id: 'gb-1-1', name: 'Fish and chips', ingredients: ['cod', 'potato', 'batter', 'peas'], price: 15 },
      { id: 'gb-1-2', name: 'Sunday roast', ingredients: ['beef', 'potato', 'yorkshire pudding', 'gravy'], price: 18 },
      { id: 'gb-1-3', name: 'Bangers and mash', ingredients: ['sausage', 'potato', 'onion gravy'], price: 13 },
    ],
  },
  {
    id: 'gb-2',
    name: "Shepherd's Table",
    location: { lat: 51.5045, lng: -0.0865 },
    address: '3 Tower Bridge Rd, London',
    countryId: 'GB',
    menu: [
      { id: 'gb-2-1', name: "Shepherd's pie", ingredients: ['lamb', 'potato', 'carrot', 'peas'], price: 14 },
      { id: 'gb-2-2', name: 'Full English breakfast', ingredients: ['egg', 'bacon', 'sausage', 'beans', 'toast'], price: 12 },
      { id: 'gb-2-3', name: 'Sticky toffee pudding', ingredients: ['dates', 'sugar', 'cream'], price: 7 },
    ],
  },
  {
    id: 'gb-3',
    name: 'Spice Route',
    location: { lat: 51.5155, lng: -0.0922 },
    address: '61 Brick Ln, London',
    countryId: 'GB',
    menu: [
      { id: 'gb-3-1', name: 'Chicken tikka masala', ingredients: ['chicken', 'tomato', 'cream', 'spices'], price: 13 },
      { id: 'gb-3-2', name: 'Vegetable samosa', ingredients: ['potato', 'peas', 'pastry'], price: 5 },
      { id: 'gb-3-3', name: 'Garlic naan', ingredients: ['flour', 'garlic', 'butter'], price: 4 },
    ],
  },
  {
    id: 'gb-4',
    name: "Chip Shop Charlie's",
    location: { lat: 51.5099, lng: -0.1180 },
    address: '9 Villiers St, London',
    countryId: 'GB',
    menu: [
      { id: 'gb-4-1', name: 'Fish and chips', ingredients: ['haddock', 'potato', 'batter'], price: 12 },
      { id: 'gb-4-2', name: 'Mushy peas', ingredients: ['peas', 'mint'], price: 3 },
      { id: 'gb-4-3', name: 'Battered sausage', ingredients: ['sausage', 'batter'], price: 4 },
    ],
  },
];
