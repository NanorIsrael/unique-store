import express from "express";
import userController from "../user/user.controller";
import { verifyUser } from "../common/auth";

const user = express();

user.get("/", userController.getAllUsersByPagination);
user.get("/:id", verifyUser, userController.getUserByID);
user.delete("/", verifyUser, userController.deletUser);
user.post("/register", userController.findAndCreateUser);
user.post("/login", userController.userLogin);
user.post("/token", userController.resetToken);

export default user;
