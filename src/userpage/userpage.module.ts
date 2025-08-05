import { Module } from '@nestjs/common';
import { UserpageController } from './userpage.controller';
import { UserpageService } from './userpage.service';
import { UserStorageService } from 'src/user-storage/user-storage.service';
import { UserStorageModule } from 'src/user-storage/user-storage.module';

@Module({
  controllers: [UserpageController],
  providers: [UserpageService],
  imports: [UserStorageModule]
})
export class UserpageModule {}
