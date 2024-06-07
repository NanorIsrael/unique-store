import express from "express";
import userController from "../user/user.controller";

const user = express();

user.get("/", userController.getAllUsersByPagination);
user.post("/register", userController.findAndCreateUser);
user.post("/login", userController.userLogin);
user.post("/token", userController.resetToken);

export default user;
