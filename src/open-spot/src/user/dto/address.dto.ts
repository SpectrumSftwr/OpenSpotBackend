import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddressDto {
  
  @IsNotEmpty()
  @IsString()
  line1: string;

  @IsString()
  line2: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsNumber()
  zipcode: string;
}
