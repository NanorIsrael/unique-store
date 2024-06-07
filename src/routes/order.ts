import express from "express";
import OrderController from "../order/order.controller";
import { verifyUser } from "../common/auth";

const order = express();

order.post("/", verifyUser, OrderController.createOrder);
order.get("/:id", verifyUser, OrderController.getOrderById);
order.get("/", verifyUser, OrderController.getOrderPaginated);

export default order;
