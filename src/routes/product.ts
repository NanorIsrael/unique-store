import express from "express";
import ProductController from "../product/product.controller";
import { verifyAdminUser, verifyUser } from "../common/auth";

const product = express();

product.post("/", verifyAdminUser, ProductController.createProduct);
product.get("/", ProductController.getProductPaginated);
product.get("/", ProductController.getAllProduct);
product.get("/stock", verifyAdminUser, ProductController.fetchLowStockProducts);
product.get("/:id", ProductController.getProductById);
product.delete("/:id", verifyAdminUser, ProductController.deleteProductById);
product.put("/:id", verifyUser, ProductController.updateProductById);

export default product;
