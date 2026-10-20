import { useState } from 'react';
import { CUISINES } from '../data/cuisines';
import { estimateDriveMinutes, type SortOrder } from '../lib/places';

export const DISTANCE_PRESETS = [2, 5, 10, 20];
export const MAX_DISTANCE_MILES = 30; // Google searches up to ~31 miles

interface CuisinePickerProps {
  selected: string[];
  onChange: (next: string[]) => void;
}

export function CuisinePicker({ selected, onChange }: CuisinePickerProps) {
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((c) => c !== id) : [...selected, id]);

  return (
    <div className="cuisine-row" role="group" aria-label="Type of food">
      <button type="button" className="chip" aria-pressed={selected.length === 0} onClick={() => onChange([])}>
        Any food
      </button>
      {CUISINES.map((c) => (
        <button key={c.id} type="button" className="chip" aria-pressed={selected.includes(c.id)} onClick={() => toggle(c.id)}>
          {c.label}
        </button>
      ))}
    </div>
  );
}

interface DistancePickerProps {
  miles: number;
  onChange: (miles: number) => void;
}

export function DistancePicker({ miles, onChange }: DistancePickerProps) {
  const isPreset = DISTANCE_PRESETS.includes(miles);
  const [custom, setCustom] = useState(isPreset ? '' : String(miles));

  function applyCustom(value: string) {
    setCustom(value);
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) onChange(Math.min(MAX_DISTANCE_MILES, Math.round(n * 10) / 10));
  }

  return (
    <div className="distance">
      <span className="filter-label" id="distance-label">
        How far will you drive?
      </span>
      <div className="segmented" role="group" aria-labelledby="distance-label">
        {DISTANCE_PRESETS.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={miles === d}
            onClick={() => {
              setCustom('');
              onChange(d);
            }}
          >
            {d} mi
          </button>
        ))}
        <label className={`custom-distance${!isPreset ? ' active' : ''}`}>
          <input
            type="number"
            inputMode="decimal"
            min={0.5}
            max={MAX_DISTANCE_MILES}
            step={0.5}
            placeholder="Other"
            value={custom}
            onChange={(e) => applyCustom(e.target.value)}
            aria-label="Custom distance in miles"
          />
          <span>mi</span>
        </label>
      </div>
      <span className="drive-estimate">about {estimateDriveMinutes(miles)} min drive</span>
    </div>
  );
}

interface ToggleRowProps {
  openNowOnly: boolean;
  onOpenNowOnly: (v: boolean) => void;
  hideCrossedOff: boolean;
  onHideCrossedOff: (v: boolean) => void;
  sort: SortOrder;
  onSort: (v: SortOrder) => void;
  showRatingControls: boolean;
}

export function ToggleRow(props: ToggleRowProps) {
  return (
    <div className="toggle-row">
      {props.showRatingControls && (
        <>
          <label className="switch">
            <input type="checkbox" checked={props.openNowOnly} onChange={(e) => props.onOpenNowOnly(e.target.checked)} />
            Open now
          </label>
          <label className="switch">
            <input type="checkbox" checked={props.hideCrossedOff} onChange={(e) => props.onHideCrossedOff(e.target.checked)} />
            Hide 2 stars and below
          </label>
        </>
      )}
      <label className="sort">
        Sort by
        <select value={props.sort} onChange={(e) => props.onSort(e.target.value as SortOrder)}>
          <option value="closest">Closest</option>
          {props.showRatingControls && <option value="rating">Best rated</option>}
        </select>
      </label>
    </div>
  );
}
