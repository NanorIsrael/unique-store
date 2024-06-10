import request from "axios";
import { Types } from "mongoose";
import OrderDto from "./order.dto";
import { IProduct, ProductDoc } from "../product/product.schema";
import { UserDoc } from "../user/user.schema";
import { OrderDoc } from "./order.schema";

describe("order controller ", () => {
  const baseUrl: string = process.env.SERVER_URL as string;
  let newProduct: IProduct;
  let newOrder: Partial<OrderDto>;
  let accessToken: string;
  let registeredUser: UserDoc;
  let testProduct: ProductDoc;
  let testOrder: OrderDoc;
  let updatedOrder;

  beforeAll(async () => {
    const testUser = {
      email: `testuser2@gmil.com`,
      password: "tesA@123",
      name: "testUser2",
    };

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

    try {
      const response = await request(
        options(baseUrl + "/users/register", "POST", {
          data: testUser,
        }),
      );
      registeredUser = response.data;
      const res = await request(
        options(baseUrl + "/users/login", "POST", null, {
          authorization: `Basic ${btoa(`${testUser.email}:${testUser.password}`)}`,
        }),
      );
      const results = res.data;
      accessToken = results["accessToken"];

      const productResponse = await request(
        options(
          baseUrl + "/products",
          "POST",
          { data: newProduct },
          {
            authorization: `JWT ${accessToken}`,
          },
        ),
      );
      testProduct = productResponse.data;
      updatedOrder = {
        ...newOrder,
        productLine: [{ productId: testProduct._id, quantity: 10 }],
      };

      const savedOrder = await request(
        options(
          baseUrl + "/orders",
          "POST",
          { data: updatedOrder },
          { authorization: `JWT ${accessToken}` },
        ),
      );
      testOrder = savedOrder.data;
    } catch (error) {
      console.log(extractAxiosError(error));
    }
  });

  afterAll(async () => {
    try {
      await request(
        options(baseUrl + `/products/${testProduct._id}`, "DELETE", null, {
          authorization: `JWT ${accessToken}`,
        }),
      );

      await request(
        options(baseUrl + `/orders/${testProduct._id}`, "DELETE", null, {
          authorization: `JWT ${accessToken}`,
        }),
      );

      await request(
        options(baseUrl + `/users/${registeredUser._id}`, "DELETE", null, {
          authorization: `JWT ${accessToken}`,
        }),
      );
    } catch (error) {
      extractAxiosError(error);
    }
  });

  it("should create order", async () => {
    const response = await request(
      options(baseUrl + `/products/${testProduct._id}`, "GET", null, {
        authorization: `JWT ${accessToken}`,
      }),
    );
    const body = response.data;

    expect(response.status).toEqual(200);
    expect(body).toHaveProperty("_id");
    expect(body._id).toEqual(testProduct._id);

    expect(testOrder).toHaveProperty("_id");
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
    return {
      status: error.response.status,
      statusText: error.response.statusText,
      headers: error.response.headers,
      data: error.response.data,
    };
  } else if (error.request) {
    return {
      request: error.request,
    };
  } else {
    return {
      message: error.message,
    };
  }
}
