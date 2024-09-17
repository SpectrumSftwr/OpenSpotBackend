import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { NewUserDto } from "src/auth/dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt'

@Injectable()
export default class UserService{

  constructor(private prisma: PrismaService) {}

  /**
   * Finds a user with the given username and returns the User Object.
   */
  async findOne(username: string): Promise<User>  {
    // Do a search for the Username.
    const result = await this.prisma.user.findUnique({
      where: {
         username: username 
      }
    });

    return result;
  }

  async createNewUser(userInfo: NewUserDto): Promise<User> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(userInfo.password, saltRounds);

    const results = await this.prisma.user.create({
        data: {
          email: userInfo.email,
          username: userInfo.username, 
          password: hash,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          paymentRecieved: userInfo.payed,
          stripeId: "thiswasageneratedId",
          lastLoginAt: new Date()
        }
    })

    return results;
  }

}
