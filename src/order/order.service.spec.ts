import { Types } from "mongoose";
import dataSource from "../utils";
import { OrderService } from "./order.service";
import Product, { ProductDoc, IProduct } from "../product/product.schema";
import { ProductService } from "../product/product.service";
import ProductLine, { IProductLine } from "../product-line/product.line.schema";
import Order from "./order.schema";
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
      product_id: new Types.ObjectId("6660b04c5c57ecff6626ba55"),
      quantity: 5,
      order_id: new Types.ObjectId("6660b04c5c57ecff6626ba55"),
    };

    mockOrder = {
      productLine: [
        {
          productId: mockProductLine.product_id,
          quantity: mockProductLine.quantity,
        },
      ],
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

      const mockOrderSave = jest.fn().mockResolvedValue({
        _id: "new order id",
        products: ["new productLine"],
        save: jest.fn(),
      });
      (Order.prototype.save as any) = mockOrderSave;

      (Order.create as any).mockResolvedValue(mockOrder);
      const orderService = new OrderService();
      const orderResult = await orderService.createOrder(mockOrder);
      expect(mockInsertMany).toHaveBeenCalled();
      expect(mockOrderSave).toHaveBeenCalled();
      expect(orderResult._id).toEqual("new order id");
    });
  });

  it("should get all orders", async () => {
    const mockOrders = [
      {
        id: "productId1",
        products: [{ productId: "1" }],
        user: "test user",
      },
      {
        id: "productId2",
        products: [{ productId: "1" }],
        user: "test user",
      },
    ];

    Order.countDocuments = jest.fn().mockResolvedValue(10);
    Order.find = jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockOrders),
    });

    // Mock Order.create to return the mock order object
    (Order.create as any).mockResolvedValue(mockOrder);

    const orderService = new OrderService();
    const data = await orderService.getAllOrdersByPagination(1, 2);

    expect(Order.find).toHaveBeenCalledWith({});
    expect(data).toEqual({
      page: 1,
      limit: 2,
      total: 10,
      pages: 5,
      data: mockOrders,
    });
  });

  it("should get products for a specific order", async () => {
    Order.findById = jest.fn().mockReturnValue({
      _id: "orderId2",
      products: ["1"],
      user: "test user",
    });
    ProductLine.findById = jest.fn().mockReturnValue({
      product_id: "1",
    });

    Product.findById = jest.fn().mockReturnValue({
      _id: "1",
    });

    // Mock Order.create to return the mock order object
    // (Order.create as any).mockResolvedValue(mockOrder);

    const orderService = new OrderService();
    const data = await orderService.getOrderProducts("mockOrder 1");

    expect(Order.findById).toHaveBeenCalledWith("mockOrder 1");
    expect(Product.findById).toHaveBeenCalledWith("1");
    expect(data).toEqual([{ _id: "1" }]);
  });
});
