import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGlobalDisallowRules } from './robotsCheck.js';

test('parses Disallow rules under a wildcard User-agent block', () => {
  const robots = `User-agent: *\nDisallow: /admin\nDisallow: /cart\n`;
  assert.deepEqual(parseGlobalDisallowRules(robots), ['/admin', '/cart']);
});

test('ignores rules under an unrelated named User-agent block', () => {
  const robots = `User-agent: Googlebot-Image\nDisallow: /photos\n`;
  assert.deepEqual(parseGlobalDisallowRules(robots), []);
});

test('stops applying rules once a new unrelated block starts', () => {
  const robots = `User-agent: *\nDisallow: /admin\nUser-agent: Bingbot\nDisallow: /only-bing\n`;
  assert.deepEqual(parseGlobalDisallowRules(robots), ['/admin']);
});

test('returns an empty list for a robots.txt with no matching block', () => {
  assert.deepEqual(parseGlobalDisallowRules(''), []);
});
