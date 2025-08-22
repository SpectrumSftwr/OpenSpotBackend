import { ConflictException, Injectable, Logger } from "@nestjs/common";
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
  async findOne(email: string): Promise<User>  {
    // Do a search for the Username.
    try {
      const result = await this.prisma.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: "insensitive"
          }
        }
      });
      return result;
    } catch (err) {
      Logger.log("Unable to find a user with email provided");
      throw Error("Failed to find a user with the given email");
    }

  }

  /**
   * Creates a new User.
   */
  async createNewUser(userInfo: NewUserDto): Promise<User> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(userInfo.password, saltRounds);

    const results = await this.prisma.user.create({
        data: {
          email: userInfo.email.toLowerCase(),
          password: hash,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
        }
    })

    return results;
  }
}
