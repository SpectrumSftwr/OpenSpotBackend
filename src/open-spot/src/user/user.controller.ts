import {  Controller } from "@nestjs/common";
import UserService from "./user.service";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('user')
export default class UserController {

  constructor(private userService: UserService, 
              private prisma: PrismaService){}
}
