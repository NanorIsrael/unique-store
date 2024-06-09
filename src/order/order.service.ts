import { Types } from "mongoose";
import BadRequestError from "../common/error-handlers/badrequest";
import ProductLine from "../product-line/product.line.schema";
import Product from "../product/product.schema";
import dataSource from "../utils";
import OrderDto, { UpdateOrderDto } from "./order.dto";
import Order from "./order.schema";

export class OrderService {
  constructor() {
    dataSource.getDBConection();
  }

  async createOrder(orderDto: OrderDto) {
    const productLine = orderDto.productLine;

    const order = new Order({
      user_id: orderDto.userId,
      products: [],
    });
    const savedOrder = await order.save();

    const productLineDocs = await Promise.all(
      productLine.map(async (line) => {
        const product = await Product.findById(line.productId);

        if (!product) {
          throw new BadRequestError(
            `Product with id ${line.productId} not found`,
          );
        }
        return new ProductLine({
          product_id: line.productId,
          quantity: line.quantity,
          order_id: savedOrder._id,
        });
      }),
    );

    const savedProductLines = await ProductLine.insertMany(productLineDocs);

    savedOrder.products = savedProductLines.map((line) => line._id);

    await savedOrder.save();
    return savedOrder;
  }

  async updateOrder(orderId: string, orderDto: UpdateOrderDto) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new BadRequestError(`Order with id ${orderId} not found`);
    }

    const productLine = orderDto.productLine;
    const existingProductLineIds = order.products;
    const updatedProductLineDocs = await Promise.all(
      productLine.map(async (line) => {
        const product = await Product.findById(line.productId);

        if (!product) {
          throw new BadRequestError(
            `Product with id ${line.productId} not found`,
          );
        }
        let productLineDoc;
        if (line.id && existingProductLineIds.includes(line.id)) {
          productLineDoc = await ProductLine.findById(line.id);
          if (!productLineDoc) {
            throw new BadRequestError(
              `ProductLine with id: ${line.id} not found`,
            );
          }
          productLineDoc.quantity = line.quantity;
        } else {
          productLineDoc = new ProductLine({
            product_id: line.productId,
            quantity: line.quantity,
            order_id: order._id,
          });
        }
        return productLineDoc;
      }),
    );

    const updatedProductLineIds = updatedProductLineDocs.map((line) =>
      line._id.toString(),
    );
    const productLinesToRemove = existingProductLineIds.filter(
      (id) => !updatedProductLineIds.includes(id.toString()),
    );

    const savedProductLines = await Promise.all(
      updatedProductLineDocs.map(async (lineDoc) => {
        return await ProductLine.findByIdAndUpdate(lineDoc._id, lineDoc, {
          upsert: true,
          new: true,
        });
      }),
    );
    await ProductLine.deleteMany({ _id: { $in: productLinesToRemove } });
    order.products = savedProductLines.map((line) => line._id);

    const savedOrder = await order.save();
    return savedOrder;
  }

  async getAllOrdersByPagination(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments();
    const pages = Math.ceil(total / limit);
    const data = await Order.find({}).skip(skip).limit(limit);
    return { page, limit, total, pages, data };
  }

  async findOrderById(id: Types.ObjectId | string) {
    return await Order.findById({ _id: id });
  }

  async getAllOrdersPagination(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments();
    const pages = Math.ceil(total / limit);
    const data = await Order.find().skip(skip).limit(limit);
    return { page, limit, total, pages, data };
  }

  async getAllOrdersByUserPagination(
    page: number,
    limit: number,
    userId: Types.ObjectId | string,
  ) {
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments();
    const pages = Math.ceil(total / limit);
    const data = await Order.find({ user_id: userId }).skip(skip).limit(limit);
    return { page, limit, total, pages, data };
  }

  async getOrderProducts(orderId: Types.ObjectId | string) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new BadRequestError(`order with id: ${orderId} does not exist.`);
    }
    const products = order.products.map(async (id) => {
      const productLine = await ProductLine.findById(id);
      return await Product.findById(productLine?.product_id);
    });

    const results = await Promise.all(products);
    return results;
  }

  async deleteOrder(orderId: Types.ObjectId | string) {
    await ProductLine.findOneAndDelete({ order_id: orderId });
    return await Order.findByIdAndDelete(orderId);
  }
}
export default new OrderService();
