import { Module } from '@nestjs/common';
import { UserpageController } from './userpage.controller';
import { UserpageService } from './userpage.service';

@Module({
  controllers: [UserpageController],
  providers: [UserpageService]
})
export class UserpageModule {}
