import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  constructor(email: string, name: string, password: string) {
    this.email = email;
    this.name = name;
    this.password = password;
  }
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
