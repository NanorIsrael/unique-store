import express from "express";
import userController from "../user/user.controller";

const user = express();

user.post("/register", userController.findAndCreateUser);

export default user;
