interface DislikeFilterProps {
  availableIngredients: string[];
  disliked: string[];
  onToggle: (ingredient: string) => void;
}

export function DislikeFilter({ availableIngredients, disliked, onToggle }: DislikeFilterProps) {
  if (availableIngredients.length === 0) return null;

  return (
    <details className="dislike-filter" open>
      <summary>
        Foods I don't like {disliked.length > 0 && <span className="badge">{disliked.length}</span>}
      </summary>
      <div className="dislike-filter-list">
        {availableIngredients.map((ingredient) => (
          <label key={ingredient} className="dislike-filter-item">
            <input
              type="checkbox"
              checked={disliked.includes(ingredient)}
              onChange={() => onToggle(ingredient)}
            />
            {ingredient}
          </label>
        ))}
      </div>
    </details>
  );
}
