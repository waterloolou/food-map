import { useEffect } from 'react';
import { Circle, CircleMarker, MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { LatLng, PlaceWithDistance } from '../../types';
import { KM_PER_MILE } from '../../lib/places';

function pinIcon(place: PlaceWithDistance, selected: boolean): L.DivIcon {
  const size = selected ? 34 : 26;
  const cls = ['pin', place.crossedOff ? 'pin-crossed' : '', selected ? 'pin-selected' : ''].join(' ');
  const label = place.crossedOff ? '×' : place.rating !== null ? place.rating.toFixed(1) : '';
  return L.divIcon({
    className: 'pin-wrap',
    html: `<span class="${cls}" style="width:${size}px;height:${size}px"><b>${label}</b></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

/** Keeps the whole search circle in view when the location or distance changes. */
function FitToRadius({ center, miles }: { center: LatLng; miles: number }) {
  const map = useMap();
  useEffect(() => {
    const fit = () => {
      map.invalidateSize();
      const bounds = L.latLng(center.lat, center.lng).toBounds(miles * KM_PER_MILE * 1000 * 2);
      map.fitBounds(bounds, { padding: [16, 16] });
    };
    fit();
    // The map can mount before its pane has its final size (and the pane
    // resizes with the window), so refit whenever the container changes size.
    const observer = new ResizeObserver(fit);
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map, center.lat, center.lng, miles]);
  return null;
}

function PanToSelected({ place }: { place: PlaceWithDistance | null }) {
  const map = useMap();
  useEffect(() => {
    if (place && !map.getBounds().pad(-0.1).contains([place.location.lat, place.location.lng])) {
      map.panTo([place.location.lat, place.location.lng]);
    }
  }, [map, place]);
  return null;
}

interface MapViewProps {
  origin: LatLng;
  maxMiles: number;
  places: PlaceWithDistance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MapView({ origin, maxMiles, places, selectedId, onSelect }: MapViewProps) {
  const selected = places.find((p) => p.id === selectedId) ?? null;
  return (
    <MapContainer center={[origin.lat, origin.lng]} zoom={13} className="map" zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToRadius center={origin} miles={maxMiles} />
      <PanToSelected place={selected} />
      <Circle
        center={[origin.lat, origin.lng]}
        radius={maxMiles * KM_PER_MILE * 1000}
        pathOptions={{ color: '#2b3a55', weight: 1.5, dashArray: '6 6', fillOpacity: 0.04 }}
        interactive={false}
      />
      <CircleMarker
        center={[origin.lat, origin.lng]}
        radius={7}
        pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#2f6fed', fillOpacity: 1 }}
      >
        <Tooltip>You are here</Tooltip>
      </CircleMarker>
      {places.map((p) => (
        <Marker
          key={p.id}
          position={[p.location.lat, p.location.lng]}
          icon={pinIcon(p, p.id === selectedId)}
          zIndexOffset={p.id === selectedId ? 1000 : p.crossedOff ? -100 : 0}
          eventHandlers={{ click: () => onSelect(p.id) }}
          title={p.name}
        />
      ))}
    </MapContainer>
  );
}
