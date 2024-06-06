import express from "express";
import morgan from "morgan";

import indexRouter from "./routes/index";
import userRouter from "./routes/user";
import productRouter from "./routes/product";
import { errorHandler } from "./common/middlewares/errors";
import NotFoundError from "./common/error-handlers/notfound";

const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);

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
