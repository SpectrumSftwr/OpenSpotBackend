import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
    return this.userpageService.getProfileBusinessFaqs(business_uid, true);
  }

  @Get('/allfaq/:business_uid')
  getAllFaqs(@Param('business_uid') business_uid: string) {
    return this.userpageService.getProfileBusinessFaqs(business_uid, false);
  }

  @Get('/gallery-preview/:business_uid')
  getBusinessGalleryPreview(@Param('business_uid') business_uid: string) {
    return this.userpageService.getProfileBusinessGalleryPreview(business_uid);
  }

  @Get('/gallery/:business_uid')
  getBusinessGallery(@Param('business_uid') business_uid: string) {
    return this.userpageService.getProfileBusinessGallery(business_uid);
  }

  @Get('reviews/:business_uid')
  getBusinessReviews(@Param('business_uid') business_uid: string) {
    return this.userpageService.getProfileBusinessReviews(business_uid);
  }

  @Get('/packages/:business_uid')
  getBusinessPackages(@Param('business_uid') business_uid: string) {
    return this.userpageService.getBusinessPackages(business_uid);
  }

  @Get('/package_details/:package_id')
  getEventDetails(@Param('package_id') package_id: string) {
    return this.userpageService.getPackageDetails(package_id);
  }

  @Get('/addons/:business_uid')
  getBusinessAddOns(@Param('business_uid') business_uid: string) {
    return this.userpageService.getBusinessAddOns(business_uid);
  }

  @Post('/addons')
  getAllAddOnsWithIds(@Body('addOnIds') addOnIds: number[]) {
    return this.userpageService.getAddOnsWithIds(addOnIds);
  }
}
