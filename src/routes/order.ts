import express from "express";
import OrderController from "../order/order.controller";
import { verifyUser } from "../common/auth";

const order = express();

order.post("/", verifyUser, OrderController.createOrder);
order.get("/:id", verifyUser, OrderController.getOrderById);
order.get("/", verifyUser, OrderController.getOrderPaginated);
order.put("/:id", verifyUser, OrderController.updateOrder);
order.delete("/:id", verifyUser, OrderController.deleteOrder);

order.get("/user/:id", verifyUser, OrderController.getUserOrderPaginated);
order.get("/:id/products", verifyUser, OrderController.getOrderProducts);

export default order;
