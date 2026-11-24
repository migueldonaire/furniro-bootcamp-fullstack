import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

// Users module: add here the controllers and services of your cards.
// Example: controllers: [UsersController], providers: [UsersService]
@Module({
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
