import BadRequestError from "../common/error-handlers/badrequest";
import ProductLine from "../product-line/product.line.schema";
import Product from "../product/product.schema";
import dataSource from "../utils";
import OrderDto from "./order.dto";
import Order from "./order.schema";

export class OrderService {
  constructor() {
    dataSource.getDBConection();
  }

  async createOrder(orderDto: OrderDto) {
    const productLine = orderDto.productLine;

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
        });
      }),
    );

    await ProductLine.insertMany(productLineDocs);

    const order = new Order({
      user_id: orderDto.userId,
      products: productLineDocs.map((line) => line._id),
    });

    return await order.save();
  }
}
export default new OrderService();
