import request from "axios";
import { IProduct } from "./product.schema";

describe.skip("product controller ", () => {
  const baseUrl: string = process.env.SERVER_URL as string;
  let newProduct: IProduct;

  beforeEach(() => {
    newProduct = {
      name: "test product",
      stock: 5,
      price: 90.99,
    };
  });

  it("should find a product by id", async () => {
    const res = await request(
      options(baseUrl + "/products", "POST", { data: newProduct }),
    );
    const savedProduct = res.data;
    const response = await request(
      options(baseUrl + `/products/${savedProduct._id}`),
    );
    const body = response.data;

    expect(response.status).toEqual(200);
    expect(body).toHaveProperty("_id");
    expect(body._id).toEqual(savedProduct._id);
  });

  it("should create and save new product", async () => {
    const response = await request(
      options(baseUrl + "/products", "POST", { data: newProduct }),
    );
    const body = response.data;

    expect(response.status).toEqual(201);
    expect(body).toHaveProperty("_id");
    expect(body).toBeDefined();
  });

  it("should get all product", async () => {
    await request(options(baseUrl + "/products", "POST", { data: newProduct }));

    const response = await request(options(baseUrl + "/products"));
    const body = response.data;

    expect(response.status).toEqual(200);
    expect(body.data.length).toBeGreaterThan(0);
  });
});

const options = (
  url: string,
  method: string = "GET",
  body: any = null,
  headers: { [key: string]: string } = {},
) => ({
  url,
  method,
  headers: {
    "Content-Type": "application/json",
    ...headers,
  },
  ...body,
});
