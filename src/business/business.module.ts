import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { UserStorageModule } from 'src/user-storage/user-storage.module';

@Module({
  exports: [BusinessService],
  providers: [BusinessService],
  controllers: [BusinessController],
  imports: [UserStorageModule]
})
export class BusinessModule {}
