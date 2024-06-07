import express from "express";
import ProductController from "../product/product.controller";
import { verifyUser } from "../common/auth";

const product = express();

product.post("/", ProductController.createProduct);
product.get("/", ProductController.getProductPaginated);
product.get("/", ProductController.getAllProduct);
product.get("/:id", ProductController.getProductById);
product.delete("/:id", verifyUser, ProductController.deleteProductById);
product.put("/:id", verifyUser, ProductController.updateProductById);

export default product;
