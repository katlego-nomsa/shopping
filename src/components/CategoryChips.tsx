import { CATEGORIES } from "../utils/constants";

interface CategoryChipsProps {
  selected: string; // "" means All
  onSelect: (category: string) => void;
}

function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  const options = ["", ...CATEGORIES]; // "" is the All chip

  return (
    <div className="chips" role="group" aria-label="Filter by category">
      {options.map((category) => (
        <button
          key={category || "all"}
          type="button"
          className={selected === category ? "chip chip-active" : "chip"}
          aria-pressed={selected === category}
          onClick={() => onSelect(category)}
        >
          {category || "All"}
        </button>
      ))}
    </div>
  );
}

export default CategoryChips;