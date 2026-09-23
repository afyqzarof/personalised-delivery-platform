import { Module } from '@nestjs/common';
import { JsonUsersRepository } from './json-users.repository';
import { USERS_REPOSITORY } from './users.repository';

@Module({
  providers: [
    {
      // Factory: keeps the class's optional file-path arg out of Nest's DI.
      provide: USERS_REPOSITORY,
      useFactory: () => new JsonUsersRepository(),
    },
  ],
  exports: [USERS_REPOSITORY],
})
export class UsersModule {}
