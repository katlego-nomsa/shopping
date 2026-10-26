import type { ListItem, ShoppingList } from "../types";
import type { SortValue } from "./constants";

export function sortItems(items: ListItem[], sort: SortValue): ListItem[] {
  const copy = [...items]; // never change the original array

  if (sort === "name") {
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sort === "category") {
    return copy.sort(
      (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
    );
  }
  // "date": newest first
  return copy.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
}

// filter by name and category, then sort.
// While a filter is active, hide lists with no matching items.
export function prepareLists(
  lists: ShoppingList[],
  search: string,
  sort: SortValue,
  category: string
): ShoppingList[] {
  const term = search.trim().toLowerCase();
  const isFiltering = term !== "" || category !== "";

  return lists
    .map((list) => ({
      ...list,
      items: sortItems(
        list.items.filter(
          (item) =>
            item.name.toLowerCase().includes(term) &&
            (category === "" || item.category === category)
        ),
        sort
      ),
    }))
    .filter((list) => !isFiltering || list.items.length > 0);
}