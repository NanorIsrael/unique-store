import express from "express";
import OrderController from "../order/order.controller";
import { verifyUser } from "../common/auth";

const order = express();

order.post("/", verifyUser, OrderController.createOrder);

export default order;
