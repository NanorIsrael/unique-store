import { NextFunction, Request } from "express";
import TokenService from "../auth/auth-token-service";
import BadRequestError from "./error-handlers/badrequest";

export function getAuthHeader(headers: {
  [key: string]: string | string[] | undefined;
}): string | null {
  const authHeader = headers["authorization"] as string;
  if (!authHeader) {
    return null;
  }
  return authHeader.split(" ")[1];
}
export function verifyUser(req: Request, next: NextFunction): void {
  const jwt = getAuthHeader(req.headers);
  const tokenService = new TokenService();
  if (!jwt) {
    throw new BadRequestError("access token not found.");
  }
  const userId = tokenService.verifyToken(jwt);

  req.body = { ...req.body, userId };
  next();
}
