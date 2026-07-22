import { describe, expect, it } from 'vitest';
import { isTraditionalDish } from './matching';
import type { MenuItem, TraditionalDish } from '../types';

const dishes: TraditionalDish[] = [
  { name: 'stamppot' },
  { name: 'moules-frites', aliases: ['moules frites', 'mussels'] },
];

function menuItem(name: string): MenuItem {
  return { id: '1', name, ingredients: [] };
}

describe('isTraditionalDish', () => {
  it('matches an exact dish name', () => {
    expect(isTraditionalDish(menuItem('Stamppot'), dishes)).toBe(true);
  });

  it('matches a dish name as a substring of a longer menu item name', () => {
    expect(isTraditionalDish(menuItem('Stamppot met rookworst'), dishes)).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isTraditionalDish(menuItem('STAMPPOT'), dishes)).toBe(true);
  });

  it('matches via an alias', () => {
    expect(isTraditionalDish(menuItem('Mussels with fries'), dishes)).toBe(true);
  });

  it('returns false when nothing matches', () => {
    expect(isTraditionalDish(menuItem('Margherita pizza'), dishes)).toBe(false);
  });
});
