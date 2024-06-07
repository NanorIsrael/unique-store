import { Types } from "mongoose";
import dataSource from "../utils";
import Product, { IProduct, ProductDoc } from "./product.schema";
import { ProductService } from "./product-service";

jest.mock("./product-schema");

describe("ProductService", () => {
  let mockProduct: Partial<ProductDoc>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockProduct = {
      _id: new Types.ObjectId("6660b04c5c57ecff6626ba55"),
      name: "test product",
      stock: 5,
      price: 90.99,
    };
    jest.mock("./product-schema", () => {
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
    new ProductService();
    expect(dataSource.getDBConection).toHaveBeenCalled();
  });

  describe("createProduct", () => {
    it("should create and save a new product", async () => {
      const mockSave = jest.fn().mockResolvedValue("new product");
      (Product as any).mockImplementation(() => ({
        save: mockSave,
      }));

      const productService = new ProductService();
      const result = await productService.createProduct(
        mockProduct as IProduct,
      );

      expect(mockSave).toHaveBeenCalled();
      expect(result).toBe("new product");
    });
  });

  describe("findProductById", () => {
    it("should return a product if found", async () => {
      (Product as any).findById.mockResolvedValue(mockProduct);

      const productService = new ProductService();
      const result = await productService.findProductById(
        mockProduct._id as Types.ObjectId,
      );

      expect(Product.findById).toHaveBeenCalledWith({ _id: mockProduct._id });
      expect(result).toEqual(mockProduct);
    });

    it("should throw BadRequestError if product not found", async () => {
      (Product as any).findById.mockResolvedValue(null);

      const productService = new ProductService();

      await expect(
        productService.findProductById(mockProduct._id as Types.ObjectId),
      ).rejects.toThrow(`product with id: ${mockProduct._id} not found`);
      expect(Product.findById).toHaveBeenCalledWith({ _id: mockProduct._id });
    });
  });

  describe("getAllProduct", () => {
    it("should return all products", async () => {
      const mockProducts = [{ name: "product1" }, { name: "product2" }];
      (Product as any).find.mockResolvedValue(mockProducts);

      const productService = new ProductService();
      const result = await productService.getAllProduct();

      expect(Product.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockProducts);
    });
  });

  describe("updateProduct", () => {
    it("should update products", async () => {
      const mockProducts = { name: "product1" };

      (Product as any).findByIdAndUpdate.mockResolvedValue({
        name: "updated product name",
      });

      const productService = new ProductService();
      const result = await productService.updateProduct();

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        "8098",
        mockProducts,
      );
      expect(result.name).toEqual("updated product name");
    });
  });

  describe("deleteProduct", () => {
    it("should delete product", async () => {
      (Product as any).findByIdAndDelete.mockResolvedValue({
        name: "deleted product",
      });

      const productService = new ProductService();
      const result = await productService.deleteProduct("8098");

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith("8098");
      expect(result.name).toEqual("deleted product");
    });
  });

  describe("getProductByPagination", () => {
    it("should return paginated products", async () => {
      const mockProducts = [{ name: "product1" }, { name: "product2" }];
      (Product as any).countDocuments.mockResolvedValue(10);
      (Product as any).find.mockResolvedValue(mockProducts);

      const skip = jest.fn().mockReturnThis();
      const limit = jest.fn().mockResolvedValue(mockProducts);
      (Product.find as jest.Mock).mockReturnValue({
        skip,
        limit,
      });
      const productService = new ProductService();
      const result = await productService.getProductByPagination(1, 2);

      expect(Product.countDocuments).toHaveBeenCalled();
      expect(Product.find).toHaveBeenCalledWith();
      expect(Product.find().skip).toHaveBeenCalledWith(0);
      expect(Product.find().limit).toHaveBeenCalledWith(2);
      expect(result).toEqual({
        page: 1,
        limit: 2,
        total: 10,
        pages: 5,
        data: mockProducts,
      });
    });
  });
});
