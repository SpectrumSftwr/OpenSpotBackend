import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import UserService from 'src/user/user.service';
import { AuthService } from './auth.service';
import { NewUserDto, UserDto } from './dto';
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
   async login(@Body() {email, password} : {email:string,password: string}) : Promise<UserDto> {
     return await this.authService.authenticateUser({email, password})

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
