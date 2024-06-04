import dotenv from "dotenv";
dotenv.config();
import express from "express";

import indexRouter from "./routes/index";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Sever listening on port ${PORT}`);
});
