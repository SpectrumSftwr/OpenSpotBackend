import { Controller, Get, Param } from '@nestjs/common';
import { UserpageService } from './userpage.service';
import UserService from 'src/user/user.service';

@Controller('userpage')
export class UserpageController {

  constructor(private userpageService: UserpageService){}

  /**
   * Get the User Profile Page Details 
   */
  @Get('/:business_uid')
  getProfileDetails(@Param('business_uid') business_uid: string) {
    // Fetch
    return this.userpageService.getProfileBusinessDetails(business_uid);
  }

  @Get('/faq/:business_uid')
  getFrequentlyAskedQuestions(@Param('business_uid') business_uid: string) {
    return this.userpageService.getProfileBusinessFaqs(business_uid);
  }

  @Get('/gallery/:business_uid')
  getBusinessGallery(@Param('business_uid') business_uid: string) {

  }
}
