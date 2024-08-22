import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { AddressDto } from "./address.dto";

export class UserDto {
  
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  Address: AddressDto;
}
