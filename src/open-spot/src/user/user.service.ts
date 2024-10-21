import { ConflictException, Injectable } from "@nestjs/common";
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
         username: username.toLowerCase() 
      }
    });

    return result;
  }

  async createNewUser(userInfo: NewUserDto): Promise<User> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(userInfo.password, saltRounds);

    const results = await this.prisma.user.create({
        data: {
          email: userInfo.email.toLowerCase(),
          username: userInfo.username.toLowerCase(), 
          password: hash,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          paymentRecieved: userInfo.payed,
          stripeId: "",
          lastLoginAt: new Date()
        }
    }).then((response) => { 
      return response;
    }).catch(() =>  {
      throw new ConflictException("Could not create user.");
    })

    return results;
  }

  /**
   * For tracking purposes update the users login time when they signin.
   */
  async updateUserLoginTime(user: User, date: Date)  {
    await this.prisma.user
    .update({
      where: {
        id: user.id
      },
      data: {
        lastLoginAt: date
      }
    })
    .catch((err) => console.log(err) )
  }

  async usernameExists(username: string): Promise<{exists: boolean}> {
    // Count that there exists a user with the username that was passed in
    const count = await this.prisma.user.count({
      where: {
        username: username
      }
    });

    return {
      exists : count > 0,
    }
  }
}
