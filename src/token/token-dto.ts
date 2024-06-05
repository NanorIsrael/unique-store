import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export interface UserTokens {
  reset_token: string;
  user_id: Types.ObjectId;
}

class TokenDto {
  @IsString()
  @IsNotEmpty()
  readonly reset_token: string;

  @IsString()
  @IsNotEmpty()
  readonly user_id: Types.ObjectId;

  constructor(reset_token: string, user_id: Types.ObjectId) {
    this.user_id = user_id;
    this.reset_token = reset_token;
  }
}
export default TokenDto;
