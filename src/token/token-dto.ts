import { IsNotEmpty, IsString } from "class-validator";

export interface UserTokens {
  reset_token: string;
  user_id: string;
}

class TokenDto {
  @IsString()
  @IsNotEmpty()
  readonly reset_token: string;

  @IsString()
  @IsNotEmpty()
  readonly user_id: string;

  constructor(reset_token: string, user_id: string) {
    this.user_id = user_id;
    this.reset_token = reset_token;
  }
}
export default TokenDto;
