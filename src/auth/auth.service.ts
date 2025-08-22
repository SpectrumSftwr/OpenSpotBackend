import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client'; 
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import UserService from 'src/user/user.service';
import { UserDto } from './dto';
import { BusinessService } from 'src/business/business.service';
@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService,
              private userService: UserService,
              private businessService: BusinessService,
             ) {}  

  async authenticateUser({email, password}: 
                         {email: string, password: string}) : Promise<UserDto> {
      const user: User = await this.userService.findOne(email);

      if (!user) {
        return null;
      }

      const isMatch = await bcrypt.compare(password, user.password);      
      
      // Check that username and hashd passwords match
      if (email.toLowerCase() === user.email.toLowerCase() && isMatch){
        const {
          password, 
          ...jwtUser
        } = user;

        const hasBusiness = await this.businessService.doesUserHaveBusiness(user.id);

        return {
          hasBusiness: hasBusiness,
          jwtToken: this.jwtService.sign(jwtUser) 
        }
      }
  }

   authorizeUser(user: User) : UserDto{
      const {password, ...jwtUser} = user;
      return { 
        hasBusiness: undefined,
        jwtToken : this.jwtService.sign(jwtUser) 
      }
  }
}
