import express from "express";
import ProductLineController from "../product-line/product-line.controller";

const productLine = express();

productLine.get("/", ProductLineController.getProductLinePaginated);
productLine.get("/:id", ProductLineController.getProductLineById);

export default productLine;
