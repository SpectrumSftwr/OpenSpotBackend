import { Module } from '@nestjs/common';
import UserController from './user.controller';
import UserService from './user.service';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [PrismaClient],
  controllers:[UserController],
  providers: [UserService]
})
export class UserModule {}
