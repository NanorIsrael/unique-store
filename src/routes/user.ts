import express from "express";
import userController from "../user/user.controller";
import { verifyAdminUser, verifyUser } from "../common/auth";
import adminUserController from "../user/admin/admin.controller";

const user = express.Router();

user.get("/", verifyAdminUser, userController.getAllUsersByPagination);
user.get("/:id", verifyAdminUser, userController.getUserByID);
user.put("/:id", verifyUser, userController.updateUser);
user.delete("/:id", verifyAdminUser, userController.deleteUser);
user.post("/register", userController.findAndCreateUser);
user.post("/login", userController.userLogin);
user.post("/token", userController.resetToken);
user.post("/admin", verifyUser, adminUserController.findAndCreateAdminUser);
user.delete("/admin/:id", verifyAdminUser, adminUserController.deleteAdminUser);

export default user;
