import express from "express";
import userController from "../user/user.controller";
import { verifyAdminUser, verifyUser } from "../common/auth";

const user = express();

user.get("/", verifyAdminUser, userController.getAllUsersByPagination);
user.get("/:id", verifyAdminUser, userController.getUserByID);
user.put("/:id", verifyUser, userController.updateUser);
user.delete("/", verifyUser, userController.deleteUser);
user.post("/register", userController.findAndCreateUser);
user.post("/login", userController.userLogin);
user.post("/token", userController.resetToken);

export default user;
