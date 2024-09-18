import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client'; 
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import UserService from 'src/user/user.service';
import { UserDto } from './dto';
@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService,
              private userService: UserService) {}  

  async authenticateUser({username, password}: 
                         {username: string, password: string}) : Promise<UserDto> {

      const user: User = await this.userService.findOne(username);
      console.log(user);

      const isMatch = await bcrypt.compare(password, user.password);      
      
      // Check that username and hashd passwords match
      if (username.toLowerCase() === user.username.toLowerCase() && isMatch){
        const {password, ...jwtUser} = user;

        return {
          jwtToken: this.jwtService.sign(jwtUser) 
        }
      }
  }

  authorizeUser(user: User) : UserDto{
      const {password, ...jwtUser} = user;
      return { 
        jwtToken : this.jwtService.sign(jwtUser) 
      }
  }
}
