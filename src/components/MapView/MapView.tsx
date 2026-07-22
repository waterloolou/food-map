import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import type { LatLng, RestaurantWithMatches } from '../../types';
import { RestaurantMarker } from './RestaurantMarker';

interface RecenterProps {
  center: LatLng;
}

function Recenter({ center }: RecenterProps) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng]);
  return null;
}

interface MapViewProps {
  center: LatLng;
  userLocation: LatLng | null;
  restaurants: RestaurantWithMatches[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MapView({ center, userLocation, restaurants, selectedId, onSelect }: MapViewProps) {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={14} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} />
      {userLocation && (
        <CircleMarker
          center={[userLocation.lat, userLocation.lng]}
          radius={8}
          pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.9 }}
        />
      )}
      {restaurants.map((restaurant) => (
        <RestaurantMarker
          key={restaurant.id}
          restaurant={restaurant}
          isSelected={restaurant.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </MapContainer>
  );
}
