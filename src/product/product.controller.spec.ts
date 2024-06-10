import request from "axios";
import { IProduct, ProductDoc } from "./product.schema";
import { AdminDoc } from "../user/admin/admin.schema";
import { IUser, UserDoc } from "../user/user.schema";
import mongoose from "mongoose";

describe("product controller", () => {
  const baseUrl: string = process.env.SERVER_URL as string;
  let newProduct: IProduct;
  let testProduct: ProductDoc;
  let createdProduct: any;
  let accessToken: string;
  let testUser: IUser;
  let adminTester: AdminDoc;

  beforeAll(async () => {
    testUser = {
      email: `testuser@gmil.com`,
      password: "tesA@123",
      name: "testUser",
    };
    try {
      await request(
        options(baseUrl + "/users/register", "POST", {
          data: testUser,
        }),
      );

      const loggedInUser = await request(
        options(baseUrl + "/users/login", "POST", null, {
          authorization: `Basic ${btoa(`${testUser.email}:${testUser.password}`)}`,
        }),
      );

      const results = loggedInUser.data;
      accessToken = results.accessToken;

      const createAdminResponse = await request(
        options(
          baseUrl + `/users/admin`,
          "POST",
          { data: { email: testUser.email } },
          {
            authorization: `JWT ${accessToken}`,
          },
        ),
      );
      adminTester = createAdminResponse.data;
    } catch (error) {
      console.error("Error in beforeAll:", extractAxiosError(error));
      throw error;
    }
  });

  beforeEach(async () => {
    newProduct = {
      name: "test product",
      stock: 5,
      price: 90.99,
    };
    try {
      createdProduct = await request(
        options(
          baseUrl + "/products",
          "POST",
          { data: newProduct },
          {
            authorization: `JWT ${accessToken}`,
          },
        ),
      );
      testProduct = createdProduct.data;
    } catch (error) {
      console.error("Error in beforeEach:", extractAxiosError(error));
      throw error;
    }
  });

  afterEach(async () => {
    try {
      if (testProduct && testProduct._id) {
        await request(
          options(baseUrl + `/products/${testProduct._id}`, "DELETE", null, {
            authorization: `JWT ${accessToken}`,
          }),
        );
      }
    } catch (error) {
      console.error("Error in afterEach:", extractAxiosError(error));
    }
  });

  afterAll(async () => {
    try {
      if (adminTester) {
        await request(
          options(baseUrl + `/users/${adminTester.user_id}`, "DELETE", null, {
            authorization: `JWT ${accessToken}`,
          }),
        );
        await request(
          options(baseUrl + `/users/admin/${adminTester._id}`, "DELETE", null, {
            authorization: `JWT ${accessToken}`,
          }),
        );
      }
    } catch (error) {
      console.error("Error in afterAll:", extractAxiosError(error));
    } finally {
      await mongoose.connection.close();
    }
  });

  it("should create and save new product", async () => {
    expect(createdProduct.status).toEqual(201);
    expect(testProduct).toHaveProperty("_id");
    expect(testProduct).toBeDefined();
  });

  it("should find a product by id", async () => {
    try {
      const response = await request(
        options(baseUrl + `/products/${testProduct._id}`, "GET", null, {
          authorization: `JWT ${accessToken}`,
        }),
      );
      const body = response.data;
      expect(response.status).toEqual(200);
      expect(body).toHaveProperty("_id");
      expect(body._id).toEqual(testProduct._id);
    } catch (error) {
      console.error("Error in afterEach:", extractAxiosError(error));
    }
  });

  it("should get all product", async () => {
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
