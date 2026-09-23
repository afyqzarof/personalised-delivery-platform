import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { User } from './user.types';
import { UsersRepository } from './users.repository';

@Injectable()
export class JsonUsersRepository implements UsersRepository {
  private readonly usersById: Map<string, User>;

  constructor(dataFilePath: string = join(process.cwd(), 'data.json')) {
    const raw = readFileSync(dataFilePath, 'utf-8');
    const users = JSON.parse(raw) as User[];
    this.usersById = new Map(users.map((user) => [user.id, user]));
  }

  async findById(id: string): Promise<User | undefined> {
    return this.usersById.get(id);
  }
}
