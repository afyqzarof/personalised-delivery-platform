import { User } from './user.types';

// Async so a DB-backed implementation can replace the file-backed one
// without changing callers.
export interface UsersRepository {
  findById(id: string): Promise<User | undefined>;
}

export const USERS_REPOSITORY = Symbol('UsersRepository');
