import { SORT_OPTIONS, type SortValue } from "../utils/constants";

interface SearchSortBarProps {
  search: string;
  sort: SortValue;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortValue) => void;
}

function SearchSortBar({ search, sort, onSearchChange, onSortChange }: SearchSortBarProps) {
  return (
    <div className="search-bar">
      <div>
        <label htmlFor="search">Search items</label>
        <input
          id="search"
          type="search"
          placeholder="Search by name"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={sort} onChange={(e) => onSortChange(e.target.value as SortValue)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SearchSortBar;