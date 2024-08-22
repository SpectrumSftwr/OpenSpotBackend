import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import UserService from "./user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UserDto } from './dto'

@Controller('user')
export default class UserController {

  constructor(private userService: UserService, 
              private prisma: PrismaService){}

  /**
   * Will check if the username is already in use.
   */
  @Post() 
  createNewUser(@Body() dto: UserDto) {
    // Authentication.

    // Perform service action.
    return this.userService.createNewUser(dto)
  }

  @Get(':username')
  usernameAvailable(@Param('username') username: string) {
    // Authentication.
    
    // Perform service Action.
    console.log(username);
    return this.userService.usernameAvailable(username);
  }
}
