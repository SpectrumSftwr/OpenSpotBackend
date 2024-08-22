import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto";

@Injectable()
export default class UserService{

  createNewUser(userDto: UserDto) {
    console.log("we made it to the service");
  }

  usernameAvailable(username: string) {
    return {
      username: username,
      available: true
    }

  }
}
