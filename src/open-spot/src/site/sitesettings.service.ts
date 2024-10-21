import { Injectable } from '@nestjs/common';
import { SiteColorsDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SiteService {

  constructor(private prismaService: PrismaService){}

  async updateUserColors(colors: SiteColorsDto): Promise<boolean> {

    // Try and update the record
    const updatedColors = await this.prismaService.siteColors.upsert({
      where: {
        userId: 48 
      },
      update: {
        background: colors.background,
        foreground: colors.foreground,
        accent: colors.accent,
        secondary: colors.secondary,
      },
      create: {
        userId: 48,
        background: colors.background,
        foreground: colors.foreground,
        accent: colors.accent,
        secondary: colors.secondary,
      },
    })

    return true; 
  }
}

