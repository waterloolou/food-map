import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { RestaurantWithMatches } from '../../types';

function buildIcon(traditionalCount: number, isSelected: boolean): L.DivIcon {
  const color = traditionalCount > 0 ? '#c1440e' : '#6b7280';
  const size = isSelected ? 30 : 22;
  return L.divIcon({
    className: 'restaurant-pin',
    html: `<span style="
      display:block;
      width:${size}px;
      height:${size}px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      background:${color};
      border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,0.4);
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

interface RestaurantMarkerProps {
  restaurant: RestaurantWithMatches;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function RestaurantMarker({ restaurant, isSelected, onSelect }: RestaurantMarkerProps) {
  return (
    <Marker
      position={[restaurant.location.lat, restaurant.location.lng]}
      icon={buildIcon(restaurant.visibleTraditionalCount, isSelected)}
      eventHandlers={{ click: () => onSelect(restaurant.id) }}
    >
      <Popup>
        <strong>{restaurant.name}</strong>
        <br />
        {restaurant.visibleTraditionalCount > 0
          ? `${restaurant.visibleTraditionalCount} traditional dish${restaurant.visibleTraditionalCount === 1 ? '' : 'es'}`
          : 'No traditional dishes matched'}
      </Popup>
    </Marker>
  );
}
