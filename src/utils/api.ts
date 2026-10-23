import type { User, ShoppingList } from "../types";

const BASE_URL = "http://localhost:3001";

// find a user by email (returns null if none exists)
export async function getUserByEmail(email: string): Promise<User | null> {
  const res = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Could not reach the server");
  const users: User[] = await res.json();
  return users[0] ?? null;
}

// save a new user to json-server
export async function createUser(user: Omit<User, "id">): Promise<User> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Could not create the user");
  return res.json();
}
// get all lists that belong to one user
export async function fetchLists(userId: number): Promise<ShoppingList[]> {
  const res = await fetch(`${BASE_URL}/lists?userId=${userId}`);
  if (!res.ok) throw new Error("Could not load lists");
  return res.json();
}

export async function saveNewList(list: Omit<ShoppingList, "id">): Promise<ShoppingList> {
  const res = await fetch(`${BASE_URL}/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(list),
  });
  if (!res.ok) throw new Error("Could not save the list");
  return res.json();
}

export async function saveList(list: ShoppingList): Promise<ShoppingList> {
  const res = await fetch(`${BASE_URL}/lists/${list.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(list),
  });
  if (!res.ok) throw new Error("Could not update the list");
  return res.json();
}

export async function removeList(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/lists/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Could not delete the list");
}export async function getUserById(id: number): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error("Could not load the user");
  return res.json();
}

// PATCH changes only the fields you send
export async function patchUser(id: number, changes: Partial<Omit<User, "id">>): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error("Could not update the user");
  return res.json();
}
// lists that other users have shared with this email
export async function fetchSharedLists(email: string): Promise<ShoppingList[]> {
  // json-server's _like uses a regex, so escape characters like . and +
  const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const res = await fetch(`${BASE_URL}/lists?sharedWith_like=${encodeURIComponent(escaped)}`);
  if (!res.ok) throw new Error("Could not load shared lists");
  const lists: ShoppingList[] = await res.json();
  return lists.filter((l) => l.sharedWith.includes(email)); // exact match only
}