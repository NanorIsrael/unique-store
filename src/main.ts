import dotenv from "dotenv";
dotenv.config();
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: any, res: any) => {
  res.send("Hello Unique store user.");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Sever listening on port ${PORT}`);
});
