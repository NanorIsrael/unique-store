import jwt from "jsonwebtoken";
import { DateTime } from "luxon";

import TokenService from "./auth-token-service";
import Token from "./auth-token-schema";
import redisClient from "../common/redis";
import { UserTokens } from "./auth-token-dto";
import { Types } from "mongoose";

// Mock the dependencies
jest.mock("jsonwebtoken");
jest.mock("./auth-token-schema");
jest.mock("../common/redis", () => ({
  set: jest.fn(),
  connect: jest.fn(),
  quit: jest.fn(),
}));

describe("AuthTokenService", () => {
  let tokenService: TokenService;
  let mockToken: UserTokens;

  beforeEach(() => {
    mockToken = {
      user_id: new Types.ObjectId("6660b04c5c57ecff6626ba55"),
      reset_token: "token1",
    };
    tokenService = new TokenService();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe("findToken", () => {
    it("should throw an error if no search parameter is provided", async () => {
      await expect(tokenService.findToken({})).rejects.toThrow("Invalid token");
    });

    it("should return a token if found", async () => {
      (Token.findOne as jest.Mock).mockResolvedValue(mockToken);

      const result = await tokenService.findToken({ user_id: "user1" });
      expect(result).toEqual(mockToken);
      expect(Token.findOne).toHaveBeenCalledWith({ user_id: "user1" });
    });
  });

  describe("deleteToken", () => {
    it("should throw an error if no search parameter is provided", async () => {
      await expect(tokenService.deleteToken({})).rejects.toThrow(
        "Invalid token",
      );
    });

    it("should delete a token if found", async () => {
      await tokenService.deleteToken({ user_id: mockToken.user_id });
      expect(Token.findOneAndDelete).toHaveBeenCalledWith({
        user_id: new Types.ObjectId("6660b04c5c57ecff6626ba55"),
      });
    });
  });

  describe("createTokens", () => {
    it("should throw an error if no userId is provided", async () => {
      await expect(
        tokenService.createTokens(null as unknown as Types.ObjectId),
      ).rejects.toThrow("account id required");
    });

    it("should create tokens and save them", async () => {
      const mockUserId = mockToken.user_id;
      (Token.findById as jest.Mock).mockResolvedValue(null);
      const mockAccessToken = "access_token";
      const mockRefreshToken = "refresh_token";
      const mockAccessTokenExpires = DateTime.now().plus({ minutes: 5 });
      const mockRefreshTokenExpires = DateTime.now().plus({ days: 1 });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (jwt.sign as jest.Mock).mockImplementation((payload, secret) => {
        return payload.type === "access_token"
          ? mockAccessToken
          : mockRefreshToken;
      });

      (redisClient.set as jest.Mock).mockResolvedValue({
        mockUserId: mockAccessToken,
      });
      const result = await tokenService.createTokens(
        new Types.ObjectId(mockToken.user_id),
      );

      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        accessTokenExpires: mockAccessTokenExpires.toHTTP(),
        refreshTokenExpires: mockRefreshTokenExpires.toHTTP(),
      });

      expect(redisClient.set).toHaveBeenCalledWith(
        mockAccessToken,
        JSON.stringify(mockUserId),
        1000 * 5 * 60,
      );
      expect(Token.findOne).toHaveBeenCalledWith({ user_id: mockUserId });
      expect(Token.prototype.save).toHaveBeenCalled();
    });
  });
});
