import { DateTime } from "luxon";
import jwt from "jsonwebtoken";

import dataSource from "../utils";
import TokenDto from "./token-dto";
import Token, { TokenDoc } from "./token-schema";
import redisClient from "../common/redis";

enum token {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
}

class TokenService {
  constructor() {}

  async findToken(kwags: {
    [key: string]: string;
  }): Promise<TokenDoc | null | undefined> {
    const searchParam: string = kwags["user_id"] || kwags["reset_token"];

    if (!searchParam) {
      throw new Error("Invalid token");
    }
    await dataSource.getDBConection();
    const result = await Token.findOne(kwags);
    return result;
  }

  async deleteToken(kwags: { [key: string]: string }): Promise<void> {
    const searchParam: string = kwags["account_id"] || kwags["reset_token"];

    if (!searchParam) {
      throw new Error("Invalid token");
    }

    await Token.findOneAndDelete(kwags);
  }

  async createTokens(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: string;
    refreshTokenExpires: string;
  }> {
    if (!userId) {
      throw new Error("account id required");
    }
    try {
      const TokenDoc = await Token.findById({ _id: userId });
      if (TokenDoc) {
        await redisClient.del(JSON.stringify(userId));
        await this.deleteToken({ user_id: userId });
      }
      // generate access token
      const accessExpiresIn = DateTime.now().plus({
        minutes: Number(
          process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES as string,
        ),
      });

      const accessToken = this.generateToken(
        userId,
        accessExpiresIn.toSeconds(),
        token.ACCESS_TOKEN,
      );

      await redisClient.set(JSON.stringify(userId), accessToken, 1000 * 5 * 60);

      // generate refresh token
      const refreshExpiresIn = DateTime.now().plus({
        days: Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_DAYS as string),
      });

      const refreshToken = this.generateToken(
        userId,
        refreshExpiresIn.toSeconds(),
        token.REFRESH_TOKEN,
      );

      const tokenDto = new TokenDto(refreshToken, userId);
      const newToken = new Token(tokenDto);
      newToken.save();
      return {
        accessToken,
        refreshToken,
        accessTokenExpires: accessExpiresIn.toHTTP(),
        refreshTokenExpires: refreshExpiresIn.toHTTP(),
      };
    } catch (error) {
      console.log(error);
      throw new Error("token creation failed");
    }
  }

  generateToken(userId: string, expires: number, type: string) {
    const secret = process.env.JWT_SECRET as string;

    const payload = {
      accountId: userId,
      iat: DateTime.now().toSeconds(),
      exp: expires,
      type,
    };
    return jwt.sign(payload, secret);
  }
}

export default TokenService;

// async function verifyToken(token, type) {
//   try {
//       const payload = jwt.verify(token, process.env.JWT_SECRET);

//       if(payload.type === type) {

//           const tokenData =[payload.accountId, type];

//           const tokenQuery = 'SELECT at.account_id, CASE WHEN (SELECT id FROM blacklisted_account_tokens WHERE token_id=at.id) ISNULL THEN false ELSE true END "isBlacklisted" FROM account_tokens at  WHERE account_id=$1';
//           const tokenRow = await db.oneOrNone(tokenQuery, tokenData);

//           if(tokenRow && !tokenRow['isBlacklisted']) {
//               return tokenRow;
//           } else {
//               return new Error('Invalid token.');
//           }

//       } else {
//           return  new Error('Invalid token type.');
//       }

//   } catch(error) {
//       return error;
//   }
// }
