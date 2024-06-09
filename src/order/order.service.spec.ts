import { Types } from "mongoose";
import dataSource from "../utils";
import { OrderService } from "./order.service";
import Product, { ProductDoc, IProduct } from "../product/product.schema";
import { ProductService } from "../product/product.service";
import ProductLine, { IProductLine } from "../product-line/product.line.schema";
import Order from "./order.schema";
import OrderDto, { UpdateOrderDto } from "./order.dto";

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

    describe("updateOrder", () => {
      const orderId: string = new Types.ObjectId().toString();
      const productId1: Types.ObjectId = new Types.ObjectId();
      const productId2: Types.ObjectId = new Types.ObjectId();
      const productLineId1: Types.ObjectId = new Types.ObjectId();
      const productLineId2: Types.ObjectId = new Types.ObjectId();
      const userId: string = new Types.ObjectId().toString();

      const mockOrder = {
        _id: orderId,
        products: [productLineId1, productLineId2],
        save: jest.fn(),
      };

      const mockProduct1 = { _id: productId1 };
      const mockProduct2 = { _id: productId2 };

      const mockProductLine1 = {
        _id: productLineId1,
        quantity: 1,
        save: jest.fn(),
      };
      const mockProductLine2 = {
        _id: productLineId2,
        quantity: 2,
        save: jest.fn(),
      };
      let orderDto: UpdateOrderDto;

      beforeEach(() => {
        jest.clearAllMocks();
        orderDto = {
          productLine: [
            { id: productLineId1, productId: productId1, quantity: 10 },
            { id: productLineId2, productId: productId2, quantity: 5 },
          ],
          userId: userId,
        };
      });

      it("should update the order successfully", async () => {
        (Order.findById as jest.Mock).mockResolvedValue(mockOrder);
        (Product.findById as jest.Mock)
          .mockResolvedValueOnce(mockProduct1)
          .mockResolvedValueOnce(mockProduct2);
        (ProductLine.findById as jest.Mock)
          .mockResolvedValueOnce(mockProductLine1)
          .mockResolvedValueOnce(mockProductLine2);
        (ProductLine.findByIdAndUpdate as jest.Mock)
          .mockResolvedValueOnce(mockProductLine1)
          .mockResolvedValueOnce(mockProductLine2);
        (ProductLine.insertMany as jest.Mock).mockResolvedValue([
          mockProductLine1,
          mockProductLine2,
        ]);
        (ProductLine.deleteMany as jest.Mock).mockResolvedValue([
          mockProductLine1,
          mockProductLine2,
        ]);

        const orderService = new OrderService();
        await orderService.updateOrder(orderId, orderDto);

        expect(Order.findById).toHaveBeenCalledWith(orderId);
        expect(Product.findById).toHaveBeenCalledWith(productId1);
        expect(Product.findById).toHaveBeenCalledWith(productId2);
        expect(ProductLine.findById).toHaveBeenCalledWith(productLineId1);
        expect(ProductLine.findById).toHaveBeenCalledWith(productLineId2);
      });

      it("should throw an error if the order is not found", async () => {
        (Order.findById as jest.Mock).mockResolvedValue(null);
        const orderDto = { productLine: [] };

        const orderService = new OrderService();

        await expect(
          orderService.updateOrder(
            orderId,
            orderDto as unknown as UpdateOrderDto,
          ),
        ).rejects.toThrow(`Order with id ${orderId} not found`);
      });

      it("should throw an error if a product is not found", async () => {
        // Arrange
        (Order.findById as jest.Mock).mockResolvedValue(mockOrder);
        (Product.findById as jest.Mock)
          .mockResolvedValueOnce(mockProduct1)
          .mockResolvedValueOnce(null);

        const orderDto = {
          productLine: [
            { id: productLineId1, productId: productId1, quantity: 10 },
            { productId: productId2, quantity: 5 },
          ],
        };

        const orderService = new OrderService();
        await expect(
          orderService.updateOrder(orderId, orderDto as UpdateOrderDto),
        ).rejects.toThrow(`Product with id ${productId2} not found`);
      });
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

    const orderService = new OrderService();
    const data = await orderService.getOrderProducts("mockOrder 1");

    expect(Order.findById).toHaveBeenCalledWith("mockOrder 1");
    expect(Product.findById).toHaveBeenCalledWith("1");
    expect(data).toEqual([{ _id: "1" }]);
  });

  it("should delete a specific order", async () => {
    Order.findByIdAndDelete = jest.fn().mockReturnValue({
      _id: "orderId2",
      products: ["1"],
      user: "test user",
    });
    ProductLine.findOneAndDelete = jest.fn().mockReturnValue({
      order_id: "orderId2",
    });

    const orderService = new OrderService();
    const data = await orderService.deleteOrder("orderId2");

    expect(ProductLine.findOneAndDelete).toHaveBeenCalledWith({
      order_id: "orderId2",
    });
    expect(Order.findByIdAndDelete).toHaveBeenCalledWith("orderId2");
    expect(data?._id).toEqual("orderId2");
  });
});
