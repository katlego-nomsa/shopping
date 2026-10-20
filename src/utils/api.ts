import type { User } from "../types";

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