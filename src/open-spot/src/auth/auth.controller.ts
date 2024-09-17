import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import UserService from 'src/user/user.service';
import { AuthService } from './auth.service';
import { NewUserDto, UserDto } from './dto';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
   constructor(private userService: UserService, 
               private authService: AuthService) {}

   /**
    *  Endpoint: Login.
    */
   @Post('login')
   @UseGuards(LocalGuard)
   async login(@Req() req: Request){
     return req.user;
   }

   /**
    *  Endpoint: Sign Up.
    */
   @Post('signup')
   async signup(@Body() body: NewUserDto) : Promise<UserDto> {
     // Create the user
     const user = await this.userService.createNewUser(body);

     // Creat the Authorization
     return this.authService.authorizeUser(user);
   }

   @Get('status') 
   @UseGuards(JwtAuthGuard)
   async getJwtStatus(@Req() req: Request){
      return req.user
   }
}
