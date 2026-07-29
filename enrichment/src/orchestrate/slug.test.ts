import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from './slug.js';

test('lowercases and hyphenates', () => {
  assert.equal(slugify('Café de Ooievaar'), 'cafe-de-ooievaar');
});

test('strips punctuation', () => {
  assert.equal(slugify('Le Petit Bistro!!'), 'le-petit-bistro');
});

test('trims leading/trailing hyphens', () => {
  assert.equal(slugify('  --Gerookte Paling--  '), 'gerookte-paling');
});

test('caps length at 60 characters', () => {
  const long = 'a'.repeat(100);
  assert.equal(slugify(long).length, 60);
});
