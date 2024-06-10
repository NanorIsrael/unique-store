import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class CreateAdminUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  constructor(email: string) {
    this.email = email;
  }
}
