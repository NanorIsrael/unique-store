import { DateTime } from "luxon";
import jwt, { JwtPayload } from "jsonwebtoken";

import dataSource from "../utils";
import TokenDto from "./token-dto";
import Token, { TokenDoc } from "./token-schema";
import redisClient from "../common/redis";
import BadRequestError from "../common/error-handlers/badrequest";
import logger from "../common/logging/logger";
import { Types } from "mongoose";

export enum token {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
}

interface IPayload {
  type: string;
  accountId: string;
}
class TokenService {
  constructor() {
    dataSource.getDBConection();
  }

  async findToken(kwags: {
    [key: string]: string;
  }): Promise<TokenDoc | null | undefined> {
    const searchParam: string = kwags["user_id"] || kwags["reset_token"];

    if (!searchParam) {
      throw new Error("Invalid token");
    }
    const result = await Token.findOne(kwags);
    return result;
  }

  async deleteToken(kwags: { [key: string]: Types.ObjectId }): Promise<void> {
    const searchParam: string | Types.ObjectId =
      kwags["user_id"] || kwags["reset_token"];

    if (!searchParam) {
      throw new Error("Invalid token");
    }

    await Token.findOneAndDelete(kwags);
  }

  async createTokens(userId: Types.ObjectId): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: string;
    refreshTokenExpires: string;
  }> {
    if (!userId) {
      throw new Error("account id required");
    }
    try {
      const TokenDoc = await Token.findOne({ user_id: userId });
      if (TokenDoc) {
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

      await redisClient.set(accessToken, JSON.stringify(userId), 1000 * 5 * 60);

      // // generate refresh token
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

  generateToken(userId: Types.ObjectId, expires: number, type: string) {
    const secret = process.env.JWT_SECRET as string;

    const payload = {
      accountId: userId,
      iat: DateTime.now().toSeconds(),
      exp: expires,
      type,
    };
    return jwt.sign(payload, secret);
  }

  async verifyToken(authToken: string): Promise<string | null | undefined> {
    const payload: JwtPayload | string = jwt.verify(
      authToken,
      process.env.JWT_SECRET as string,
    );

    if (payload.hasOwnProperty("type")) {
      const payloadData = payload as IPayload;

      if (payloadData.type === token.REFRESH_TOKEN) {
        const token = await Token.findOne({
          reset_token: authToken,
        }).exec();

        return token?.user_id;
      }

      if (payloadData.type === token.ACCESS_TOKEN) {
        const user_id = await redisClient.get(
          JSON.stringify(payloadData.accountId),
        );
        return user_id;
      }
    } else {
      logger.log("debug", payload);
      throw new BadRequestError(payload as string);
    }
    return null;
  }
}

export default TokenService;
