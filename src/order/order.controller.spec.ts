import request from "axios";
import { Types } from "mongoose";
import OrderDto from "./order.dto";
import { IProduct } from "../product/product.schema";

describe("order controller ", () => {
  const baseUrl: string = process.env.SERVER_URL as string;
  let newProduct: IProduct;
  let newOrder: Partial<OrderDto>;
  let accessToken: string;

  beforeAll(async () => {
    const testUser = {
      email: `testuser2@gmil.com`,
      password: "tesA@123",
      name: "testUser2",
    };
    try {
      await request(
        options(baseUrl + "/users/register", "POST", {
          data: testUser,
        }),
      );

      const res = await request(
        options(baseUrl + "/users/login", "POST", null, {
          authorization: `Basic ${btoa(`${testUser.email}:${testUser.password}`)}`,
        }),
      );
      const results = res.data;
      accessToken = results["accessToken"];
    } catch (error) {
      console.log(extractAxiosError(error).data);
    }
  });

  beforeEach(() => {
    newProduct = {
      name: "test product",
      stock: 5,
      price: 90.99,
    };

    newOrder = {
      productLine: [
        {
          productId: new Types.ObjectId("6660b04c5c57ecff6626ba55"),
          quantity: 4,
        },
      ],
    };
  });

  afterAll(async () => {
    try {
      await request(
        options(baseUrl + `/users`, "DELETE", null, {
          authorization: `JWT ${accessToken}`,
        }),
      );
    } catch (error) {
      extractAxiosError(error);
    }
  });

  it("should create order", async () => {
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

    newOrder = {
      ...newOrder,
      productLine: [{ productId: savedProduct._id, quantity: 10 }],
    };

    const savedOrder = await request(
      options(
        baseUrl + "/orders",
        "POST",
        { data: newOrder },
        { authorization: `JWT ${accessToken}` },
      ),
    );
    const savedOrderResult = savedOrder.data;

    expect(savedOrderResult).toHaveProperty("_id");
  });

  it("should find an order by id", async () => {
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

    newOrder = {
      ...newOrder,
      productLine: [{ productId: savedProduct._id, quantity: 10 }],
    };

    const savedOrder = await request(
      options(
        baseUrl + "/orders",
        "POST",
        { data: newOrder },
        { authorization: `JWT ${accessToken}` },
      ),
    );
    const savedOrderResult = savedOrder.data;

    expect(savedOrderResult).toHaveProperty("_id");

    const searchedOrder = await request(
      options(baseUrl + `/orders/${savedOrderResult._id}`, "GET", null, {
        authorization: `JWT ${accessToken}`,
      }),
    );

    const searchedOrderDoc = searchedOrder.data;

    expect(searchedOrderDoc).toHaveProperty("_id");
    expect(searchedOrderDoc._id).toEqual(savedOrderResult._id);
  });

  it("should get all orders for a specific user", async () => {
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

    newOrder = {
      ...newOrder,
      productLine: [{ productId: savedProduct._id, quantity: 10 }],
    };

    const savedOrder = await request(
      options(
        baseUrl + "/orders",
        "POST",
        { data: newOrder },
        { authorization: `JWT ${accessToken}` },
      ),
    );
    const savedOrderResult = savedOrder.data;

    expect(savedOrderResult).toHaveProperty("_id");

    const searchedOrder = await request(
      options(
        baseUrl + `/orders/user/${savedOrderResult.user_id}`,
        "GET",
        null,
        {
          authorization: `JWT ${accessToken}`,
        },
      ),
    );

    const searchedOrderDoc = searchedOrder.data;

    expect(searchedOrderDoc).toBeInstanceOf(Object);
    expect(searchedOrderDoc.data.length).toBeGreaterThan(0);
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

function extractAxiosError(error: any) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      status: error.response.status,
      statusText: error.response.statusText,
      headers: error.response.headers,
      data: error.response.data,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      request: error.request,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message,
    };
  }
}
