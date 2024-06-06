/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";

@ValidatorConstraint({ async: false })
class IsMixtureOfLettersNumbersSymbolsConstraint
  implements ValidatorConstraintInterface
{
  validate(text: string, args: ValidationArguments) {
    const hasLetters = /[a-zA-Z]/.test(text);
    const hasNumbers = /\d/.test(text);
    const hasSymbols = /[^a-zA-Z\d]/.test(text);
    return hasLetters && hasNumbers && hasSymbols;
  }

  defaultMessage(args: ValidationArguments) {
    return "password must contain letters, numbers, and at least one symbol.";
  }
}

function IsMixtureOfLettersNumbersSymbols(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMixtureOfLettersNumbersSymbolsConstraint,
    });
  };
}
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
  @IsMixtureOfLettersNumbersSymbols()
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
  @IsMixtureOfLettersNumbersSymbols()
  readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
