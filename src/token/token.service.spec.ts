import jwt from "jsonwebtoken";
import { DateTime } from "luxon";

import TokenService from "./token-service";
import Token from "./token-schema";
import redisClient from "../common/redis";
import { UserTokens } from "./token-dto";
import "../utils";

// Mock the dependencies
jest.mock("../common/redis");
jest.mock("jsonwebtoken");
jest.mock("./token-schema");
jest.mock("../utils");
jest.mock("../common/redis", () => ({
  set: jest.fn(),
  connect: jest.fn(),
  quit: jest.fn(),
}));

describe("TokenService", () => {
  let tokenService: TokenService;
  let mockToken: UserTokens;

  beforeEach(() => {
    mockToken = { user_id: "user1", reset_token: "token1" };
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
      await tokenService.deleteToken({ account_id: "user1" });
      expect(Token.findOneAndDelete).toHaveBeenCalledWith({
        account_id: "user1",
      });
    });
  });

  describe("createTokens", () => {
    it("should throw an error if no userId is provided", async () => {
      await expect(tokenService.createTokens("")).rejects.toThrow(
        "account id required",
      );
    });

    it("should create tokens and save them", async () => {
      const mockUserId = "user1";
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
      const result = await tokenService.createTokens(mockUserId);

      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        accessTokenExpires: mockAccessTokenExpires.toHTTP(),
        refreshTokenExpires: mockRefreshTokenExpires.toHTTP(),
      });

      expect(redisClient.set).toHaveBeenCalledWith(
        JSON.stringify(mockUserId),
        mockAccessToken,
        1000 * 5 * 60,
      );
      expect(Token.findById).toHaveBeenCalledWith({ _id: mockUserId });
      expect(Token.prototype.save).toHaveBeenCalled();
    });
  });
});
