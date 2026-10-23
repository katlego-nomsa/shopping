export const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "category", label: "Category" },
  { value: "date", label: "Date added" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];