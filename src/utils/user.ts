import type { User, SessionUser } from "../types";

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    surname: user.surname,
    cellNumber: user.cellNumber,
  };
}