import { Module } from '@nestjs/common';
import { SiteController } from './sitesettings.controller';
import { SiteService } from './sitesettings.service';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [PrismaClient],
  controllers: [SiteController],
  providers: [SiteService]
})
export class SiteModule {}
