import { NextFunction, Request, Response } from "express";
import CustomError from "../error-handlers/custom";
import { JsonWebTokenError } from "jsonwebtoken";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  done: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }
  if (err instanceof JsonWebTokenError) {
    return res.status(400).json({ errors: [{ message: err.message }] });
  }

  res.status(500).json({ errors: [{ message: "server error" }] });

  done();
};
