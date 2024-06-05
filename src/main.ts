import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";

import indexRouter from "./routes/index";
import userRouter from "./routes/user";
import { errorHandler } from "./common/middlewares/errors";
import NotFoundError from "./common/error-handlers/not-found";

const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", userRouter);

app.get("*", () => {
  throw new NotFoundError();
});
app.post("*", () => {
  throw new NotFoundError();
});
app.put("*", () => {
  throw new NotFoundError();
});
app.delete("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Sever listening on port ${PORT}`);
});
