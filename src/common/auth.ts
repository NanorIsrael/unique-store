import { NextFunction, Request, Response } from "express";
import TokenService from "../auth/auth-token-service";
import BadRequestError from "./error-handlers/badrequest";
import NotAuthorisedError from "./error-handlers/unauthorised";
import AdminService from "../user/admin/admin.service";

export function getAuthHeader(headers: {
  [key: string]: string | string[] | undefined;
}): string | null {
  const authHeader = headers["authorization"] as string;
  if (!authHeader) {
    return null;
  }
  return authHeader.split(" ")[1];
}

export async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const jwt = getAuthHeader(req.headers);
    if (!jwt) {
      throw new BadRequestError("access token not found.");
    }
    const tokenService = new TokenService();
    const userId = await tokenService.verifyToken(jwt);
    if (!userId) {
      throw new NotAuthorisedError();
    }

    req.body = { ...req.body, userId };
  } catch (error) {
    next(error);
  }
  next();
}

export async function verifyAdminUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const jwt = getAuthHeader(req.headers);
    if (!jwt) {
      throw new BadRequestError("access token not found.");
    }
    const tokenService = new TokenService();
    const userId = await tokenService.verifyToken(jwt);
    const adminService = new AdminService();
    if (!userId) {
      throw new NotAuthorisedError();
    }
    const admin = await adminService.findAdminByUserId(userId);
    if (!admin) {
      throw new NotAuthorisedError();
    }

    req.body = { ...req.body, userId };
  } catch (error) {
    next(error);
  }
  next();
}
