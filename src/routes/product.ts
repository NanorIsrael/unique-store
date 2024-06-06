import express from "express";
import ProductController from "../product/product-controller";

const product = express();

product.post("/", ProductController.createProduct);
product.get("/", ProductController.getProductPaginated);
product.get("/", ProductController.getAllProduct);
product.get("/:id", ProductController.getProductById);

export default product;
