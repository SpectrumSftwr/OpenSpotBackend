import {  Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OfferingsDto, SiteColorsDto, SiteDto, SiteLinksDto, UserPublicDetailsDto } from './dto/index';
import { SiteService } from './sitesettings.service';
import { Request } from 'express';

@Controller('site')
export class SiteController {

  constructor(private sitesettingsService: SiteService){}

  /** 
   * Public: This method gets all settings required to build the user site.
   */
  @Get('/:username')
  async buildSite(@Param('username') username: string) : Promise<SiteDto> {

    let colors: SiteColorsDto;                  // The users site colors
    let links: SiteLinksDto[];                  // The users links
    let personalDetails: UserPublicDetailsDto;  // The Users Personal Public Details
    let offerings: OfferingsDto[];              // The users offerings
    
    // Get User Colors
    colors = {
      background: "black", 
      foreground: "white",
      accent: "white",
      secondary: "white",
    }

    // Get User Links
    links = [
      {
        title: "Instagram",
        href: "https://instagram.com",
      },
      {
        title: "Youtube",
        href: "https://Youtube.com",
      }
    ]
    
    // Get User Offerings
    offerings = [];
   
    // Get User Personal Details
    personalDetails = {
      profilePicture: "SomeUrl",
      description: "Description Goes Here"
    }

    return {
      colors : colors,
      links: links,
      personalDetails: personalDetails,
      offerings : offerings 
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
