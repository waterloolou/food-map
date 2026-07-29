import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWebsite, buildAddress } from './overpassDiscovery.js';

test('normalizeWebsite adds https scheme when missing', () => {
  assert.equal(normalizeWebsite('example.com'), 'https://example.com/');
});

test('normalizeWebsite keeps an existing scheme', () => {
  assert.equal(normalizeWebsite('http://example.com/menu'), 'http://example.com/menu');
});

test('normalizeWebsite returns null for empty/undefined input', () => {
  assert.equal(normalizeWebsite(undefined), null);
  assert.equal(normalizeWebsite('   '), null);
});

test('normalizeWebsite returns null for unparseable input', () => {
  assert.equal(normalizeWebsite('not a url at all!!'), null);
});

test('buildAddress assembles street, postcode, and city', () => {
  const address = buildAddress({
    'addr:housenumber': '12',
    'addr:street': 'Prinsengracht',
    'addr:postcode': '1015 DV',
    'addr:city': 'Amsterdam',
  });
  assert.equal(address, 'Prinsengracht 12, 1015 DV, Amsterdam');
});

test('buildAddress omits missing parts', () => {
  assert.equal(buildAddress({ 'addr:city': 'Amsterdam' }), 'Amsterdam');
  assert.equal(buildAddress({}), '');
});
