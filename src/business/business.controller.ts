import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import {Express, Request} from 'express'
import { UserStorageService } from 'src/user-storage/user-storage.service';
import { Business, User } from '@prisma/client';

@Controller('business')
export class BusinessController {

  constructor(
    private businessService: BusinessService,
    private userStorageService: UserStorageService,
  ){}

   @Get('/exists/:username') 
   async doesBusinessExist(@Param('username') username: string){
     const result = await this.businessService.isBusinessUUIDAvailable(username);
     if (!result) {
       throw new HttpException({
         statusCode: HttpStatus.CONFLICT,
         message: 'Business User ID Already in use',
         error: 'CONFLICT'
       }, HttpStatus.CONFLICT)
     }
   }

   @Post() 
   @UseGuards(JwtAuthGuard)
   @UseInterceptors(FileFieldsInterceptor([
     {name: 'profilePicture', maxCount: 1},
     {name: 'bannerPicture', maxCount: 1}
   ]))
   async createBusiness(
     @UploadedFiles() {profilePicture, bannerPicture}
       : {profilePicture? : Express.Multer.File[], bannerPicture?: Express.Multer.File[]},
     @Body() body: any,
     @Req() request: Request 
   ){
     const user : User = request.user as User;
     
     // Save New Busines To DB
     const business : Business = await this.businessService.createBusiness(body, user?.id);

     // Upload Images to S3 Bucket
     const profilePictureS3Key = await this.userStorageService.uploadImage(profilePicture[0], `assets/business/${business.id}`)
     const bannerPictureS3Key = await this.userStorageService.uploadImage(bannerPicture[0], `assets/business/${business.id}`)

     // Update Business With the Uploaded Image Keys. 
     const success = await this.businessService.updateBusiness(business.id, 'profile_picture_url', profilePictureS3Key) 
                      && await this.businessService.updateBusiness(business.id, 'business_banner_url', bannerPictureS3Key);
     
     return success;
   }
}
