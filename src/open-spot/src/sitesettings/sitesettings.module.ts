import { Module } from '@nestjs/common';
import { SitesettingsController } from './sitesettings.controller';
import { SitesettingsService } from './sitesettings.service';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [PrismaClient],
  controllers: [SitesettingsController],
  providers: [SitesettingsService]
})
export class SitesettingsModule {}
