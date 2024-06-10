import express from "express";
import ProductController from "../product/product.controller";
import { verifyAdminUser, verifyUser } from "../common/auth";

const product = express();

product.post("/", verifyAdminUser, ProductController.createProduct);
product.get("/", ProductController.getProductPaginated);
product.get("/", ProductController.getAllProduct);
product.get("/stock", ProductController.fetchLowStockProducts);
product.get("/:id", verifyUser, ProductController.getProductById);
product.delete("/:id", verifyUser, ProductController.deleteProductById);
product.put("/:id", verifyUser, ProductController.updateProductById);

export default product;
