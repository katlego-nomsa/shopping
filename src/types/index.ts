export interface User {
  id: number;
  email: string;
  password: string; // stored as a hash, never plain text
  name: string;
  surname: string;
  cellNumber: string;
}

export interface ListItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  image?: string;
  dateAdded: string;
}

export interface ShoppingList {
  id: number;
  userId: number;
  name: string;
  items: ListItem[];
  sharedWith: string[];
}
// the values typed into the Add/Edit item popup
export interface ItemFormValues {
  listName: string;
  name: string;
  quantity: number;
  category: string;
  notes: string;
  image: string;
}
export type SessionUser = Omit<User, "password">;