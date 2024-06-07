import { Types } from "mongoose";
import dataSource from "../utils";
import orderService, { OrderService } from "./order.service";
import Product, { ProductDoc, IProduct } from "../product/product.schema";
import { ProductService } from "../product/product.service";
import ProductLine, {
  IProductLine,
  ProductLineDoc,
} from "../product-line/product.line.schema";
import Order, { OrderDoc } from "./order.schema";
import OrderDto from "./order.dto";

jest.mock("../product/product.schema");
jest.mock("../product-line/product.line.schema");
jest.mock("./order.schema");

describe("ProductService", () => {
  let mockProduct: Partial<ProductDoc>;
  let mockProductLine: IProductLine;
  let mockOrder: OrderDto;

  beforeEach(() => {
    jest.clearAllMocks();

    mockProduct = {
      _id: new Types.ObjectId("6660b04c5c57ecff6626ba55"),
      name: "test product",
      stock: 5,
      price: 90.99,
    };

    mockProductLine = {
      productId: new Types.ObjectId("6660b04c5c57ecff6626ba55"),
      quantity: 5,
    };

    mockOrder = {
      productLine: [mockProductLine],
      userId: "6660b04c5c57ecff6626ba55",
    };

    jest.mock("../product/product.schema", () => {
      return {
        Product: jest.fn().mockImplementation(() => ({
          save: jest.fn(),
        })),
        findById: jest.fn(),
        find: jest.fn(),
        countDocuments: jest.fn(),
      };
    });
  });

  it("should call dataSource.getDBConection on instantiation", () => {
    new OrderService();
    expect(dataSource.getDBConection).toHaveBeenCalled();
  });

  describe("createOrder", () => {
    it("should create and save an order", async () => {
      (Product as any).findById.mockResolvedValue(mockProduct);
      const mockSave = jest.fn().mockResolvedValue("new product");
      (Product.prototype.save as any) = mockSave;

      const productService = new ProductService();
      const result = await productService.createProduct(
        mockProduct as IProduct,
      );

      expect(mockSave).toHaveBeenCalled();
      expect(result).toBe("new product");

      const mockInsertMany = jest.fn().mockResolvedValue(["new productLine"]);
      (ProductLine.insertMany as any) = mockInsertMany;

      const mockOrderSave = jest.fn().mockResolvedValue("new order");
      (Order.prototype.save as any) = mockOrderSave;

      const orderService = new OrderService();
      const orderResult = await orderService.createOrder(mockOrder);
      expect(mockInsertMany).toHaveBeenCalled();
      expect(mockOrderSave).toHaveBeenCalled();
      expect(orderResult).toBe("new order");
    });
  });
});
