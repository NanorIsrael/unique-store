import express, { Request, Response } from "express";

const index = express();

index.get("/", (req: Request, res: Response) => {
  res.send("Hello Unique store user.");
});

export default index;
