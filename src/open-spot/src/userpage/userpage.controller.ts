import { Controller, Get, Param } from '@nestjs/common';
import { UserpageService } from './userpage.service';
import UserService from 'src/user/user.service';

@Controller('userpage')
export class UserpageController {

  constructor(private userpageService: UserpageService,
             private userService: UserService){}

  /**
   * Get the User Profile Page Details 
   */
  @Get('/:business_uid')
  getProfileDetails(@Param('business_uid') business_uid: string) {
    // Fetch
    this.userpageService.getProfileBusinessDetails(business_uid);

  }

}
