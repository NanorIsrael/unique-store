import express from "express";
import userController from "../user/user.controller";

const user = express();

user.post("/register", userController.findAndCreateUser);
user.post("/login", userController.userLogin);

export default user;
