import type { RestaurantWithMatches } from '../../types';

interface RestaurantListProps {
  restaurants: RestaurantWithMatches[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function RestaurantList({ restaurants, selectedId, onSelect }: RestaurantListProps) {
  if (restaurants.length === 0) {
    return <p className="empty-state">No restaurants match your filters.</p>;
  }

  return (
    <ul className="restaurant-list">
      {restaurants.map((restaurant) => (
        <li key={restaurant.id}>
          <button
            type="button"
            className={`restaurant-list-item${restaurant.id === selectedId ? ' selected' : ''}`}
            onClick={() => onSelect(restaurant.id)}
          >
            <span className="restaurant-list-name">{restaurant.name}</span>
            <span className="restaurant-list-meta">
              {restaurant.visibleTraditionalCount > 0
                ? `🍽️ ${restaurant.visibleTraditionalCount} traditional`
                : 'No traditional dishes'}
              {restaurant.distanceKm !== null && ` · ${restaurant.distanceKm.toFixed(1)} km`}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
