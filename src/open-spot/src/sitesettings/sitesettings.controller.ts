import {  Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { SiteDto } from './dto/index';
import { SitesettingsService } from './sitesettings.service';
import { Request } from 'express';

@Controller('sitesettings')
export class SitesettingsController {

  constructor(private sitesettingsService: SitesettingsService){}

  /** 
   * Public: This method gets all settings required to build the user site.
   */
  @Get('/buildsite/:username')
  async buildSite(@Param('username') username: string) : Promise<SiteDto> {

    return {
      colors :  
      {
        background: "black", 
        foreground: "white",
        accent: "white",
        secondary: "white",
      },
      links: [
        {
          title: "Instagram",
          href: "https://instagram.com",
        },
        {
          title: "Youtube",
          href: "https://Youtube.com",
        }
      ]
    }
  }

  /** 
   * This method gets color settings.
   */
  @Get('/colors')
  @UseGuards(JwtAuthGuard)
  async getColors() {

  }

  /** 
   * This method saves new color settings.
   */
  @Post('/colors')
  @UseGuards(JwtAuthGuard)
  async setColors(@Req() request: Request): Promise<{success: boolean}> {
    console.log(`Setting colors for user: ${request.user}`)
    const success = await this.sitesettingsService.updateUserColors(request.body);

    return {
      success: success 
    }
  }
  /** 
   * This method gets Links.
   */
  @Get('/links')
  @UseGuards(JwtAuthGuard)
  async getLinks() {

  }

  /** 
   * This method saves Links.
   */
  @Post('/links')
  @UseGuards(JwtAuthGuard)
  async setLinks() {

  }
}
