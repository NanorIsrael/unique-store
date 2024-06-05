import { NextFunction, Request, Response } from "express";
import CustomError from "../error-handlers/custom";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  done: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }

  res.status(500).json({ errors: [{ message: "server error" }] });

  done();
};
