import type { RestaurantWithMatches } from '../../types';
import { SearchBar } from './SearchBar';
import { DislikeFilter } from './DislikeFilter';
import { RestaurantList } from './RestaurantList';

interface SidebarProps {
  countryName: string;
  cityName: string;
  searchText: string;
  onSearchChange: (value: string) => void;
  availableIngredients: string[];
  dislikedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  onlyTraditional: boolean;
  onToggleOnlyTraditional: () => void;
  restaurants: RestaurantWithMatches[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function Sidebar({
  countryName,
  cityName,
  searchText,
  onSearchChange,
  availableIngredients,
  dislikedIngredients,
  onToggleIngredient,
  onlyTraditional,
  onToggleOnlyTraditional,
  restaurants,
  selectedId,
  onSelect,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Traditional Eats</h1>
        <p className="sidebar-subtitle">
          {cityName}, {countryName}
        </p>
      </div>

      <SearchBar value={searchText} onChange={onSearchChange} />

      <label className="only-traditional-toggle">
        <input type="checkbox" checked={onlyTraditional} onChange={onToggleOnlyTraditional} />
        Only show traditional dishes
      </label>

      <DislikeFilter
        availableIngredients={availableIngredients}
        disliked={dislikedIngredients}
        onToggle={onToggleIngredient}
      />

      <RestaurantList restaurants={restaurants} selectedId={selectedId} onSelect={onSelect} />
    </aside>
  );
}
