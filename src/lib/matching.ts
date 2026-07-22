import type { MenuItem, TraditionalDish } from '../types';

export function isTraditionalDish(menuItem: MenuItem, dishes: TraditionalDish[]): boolean {
  const name = menuItem.name.toLowerCase();
  return dishes.some((dish) => {
    const names = [dish.name, ...(dish.aliases ?? [])];
    return names.some((candidate) => name.includes(candidate.toLowerCase()));
  });
}
