import { useEffect, useRef } from 'react';
import type { PlaceWithDistance } from '../types';
import { CUISINE_BY_ID } from '../data/cuisines';
import { CROSS_OFF_AT_OR_BELOW, formatMiles, priceLabel } from '../lib/places';

function directionsUrl(p: PlaceWithDistance): string {
  const dest = `${p.location.lat},${p.location.lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
}

function Rating({ place }: { place: PlaceWithDistance }) {
  if (place.rating === null) return <span className="rating none">{place.source === 'demo' ? 'No ratings in demo' : 'No rating yet'}</span>;
  return (
    <span className="rating" aria-label={`${place.rating.toFixed(1)} out of 5 stars`}>
      <span className="star" aria-hidden="true">★</span>
      {place.rating.toFixed(1)}
      {place.ratingCount !== null && <span className="count">({place.ratingCount.toLocaleString()})</span>}
    </span>
  );
}

interface PlaceCardProps {
  place: PlaceWithDistance;
  selected: boolean;
  onSelect: (id: string | null) => void;
}

function PlaceCard({ place, selected, onSelect }: PlaceCardProps) {
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selected]);

  const tags = place.cuisines.map((c) => CUISINE_BY_ID.get(c)?.label).filter(Boolean);
  const demo = place.demo;

  return (
    <li ref={ref} className={`place${place.crossedOff ? ' crossed' : ''}${selected ? ' selected' : ''}`}>
      <button type="button" className="place-main" aria-expanded={selected} onClick={() => onSelect(selected ? null : place.id)}>
        <span className="place-name">{place.name}</span>
        <span className="place-facts">
          <Rating place={place} />
          {place.priceLevel && <span className="price">{priceLabel(place.priceLevel)}</span>}
          <span className="distance-fact">
            {formatMiles(place.distanceMiles)}, about {place.driveMinutes} min
          </span>
          {place.openNow === true && <span className="open">Open</span>}
          {place.openNow === false && <span className="closed">Closed now</span>}
        </span>
        {tags.length > 0 && <span className="place-tags">{tags.join(', ')}</span>}
        {place.crossedOff && <span className="cross-note">Crossed off: rated {CROSS_OFF_AT_OR_BELOW} stars or less</span>}
        {demo && demo.visibleTraditionalCount > 0 && (
          <span className="traditional-note">
            {demo.visibleTraditionalCount} traditional dish{demo.visibleTraditionalCount === 1 ? '' : 'es'}
          </span>
        )}
      </button>

      {selected && (
        <div className="place-more">
          {place.address && <p className="address">{place.address}</p>}
          <div className="place-actions">
            <a className="button primary" href={directionsUrl(place)} target="_blank" rel="noreferrer">
              Directions
            </a>
            {place.mapsUrl && (
              <a className="button" href={place.mapsUrl} target="_blank" rel="noreferrer">
                Reviews and photos
              </a>
            )}
          </div>
          {demo && (
            <ul className="menu">
              {demo.matchedMenu.map((item) => (
                <li key={item.id} className={item.hasDislikedIngredient ? 'disliked' : undefined}>
                  <span className="dish">
                    {item.name}
                    {item.isTraditional && <span className="dish-badge">traditional</span>}
                  </span>
                  <span className="ingredients">{item.ingredients.join(', ')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}

interface PlaceListProps {
  places: PlaceWithDistance[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function PlaceList({ places, selectedId, onSelect }: PlaceListProps) {
  return (
    <ul className="place-list">
      {places.map((p) => (
        <PlaceCard key={p.id} place={p} selected={p.id === selectedId} onSelect={onSelect} />
      ))}
    </ul>
  );
}
