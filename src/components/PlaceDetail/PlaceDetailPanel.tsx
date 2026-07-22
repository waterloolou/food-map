import type { RestaurantWithMatches } from '../../types';

interface PlaceDetailPanelProps {
  restaurant: RestaurantWithMatches;
  onClose: () => void;
}

export function PlaceDetailPanel({ restaurant, onClose }: PlaceDetailPanelProps) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.location.lat},${restaurant.location.lng}`;

  return (
    <div className="place-detail-panel">
      <button type="button" className="close-button" onClick={onClose} aria-label="Close">
        ×
      </button>

      <h2>{restaurant.name}</h2>
      <p className="place-address">{restaurant.address}</p>
      {restaurant.distanceKm !== null && (
        <p className="place-distance">{restaurant.distanceKm.toFixed(1)} km away</p>
      )}

      <a className="directions-link" href={directionsUrl} target="_blank" rel="noreferrer">
        Get directions
      </a>

      <h3>Menu</h3>
      <ul className="menu-list">
        {restaurant.matchedMenu.map((item) => (
          <li
            key={item.id}
            className={`menu-item${item.hasDislikedIngredient ? ' disliked' : ''}${item.isTraditional ? ' traditional' : ''}`}
          >
            <span className="menu-item-name">
              {item.isTraditional && '🍽️ '}
              {item.name}
            </span>
            <span className="menu-item-ingredients">{item.ingredients.join(', ')}</span>
            {item.hasDislikedIngredient && <span className="menu-item-flag">contains disliked ingredient</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
