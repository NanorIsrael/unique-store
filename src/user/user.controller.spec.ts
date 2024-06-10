import request from "axios";
import { IUser, UserDoc } from "./user.schema";
import { AdminDoc } from "./admin/admin.schema";

describe("user controller ", () => {
  const baseUrl: string = process.env.SERVER_URL as string;
  let accessToken: string;
  let testUser: IUser;
  let registeredUser: Partial<UserDoc>;
  let adminTester: AdminDoc;

  beforeAll(async () => {
    testUser = {
      email: `testuser@gmil.com`,
      password: "tesA@123",
      name: "testUser",
      created_at: new Date(),
    };
  });

  beforeEach(async () => {
    try {
      const result = await request(
        options(baseUrl + "/users/register", "POST", {
          data: testUser,
        }),
      );
      const data = result.data;
      registeredUser = { ...testUser, _id: data._id };

      const res = await request(
        options(baseUrl + "/users/login", "POST", null, {
          authorization: `Basic ${btoa(`${testUser.email}:${testUser.password}`)}`,
        }),
      );
      const results = res.data;
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
      extractAxiosError(error);
    }
  });

  afterEach(async () => {
    try {
      await request(
        options(baseUrl + `/users`, "DELETE", null, {
          authorization: `JWT ${accessToken}`,
        }),
      );
      await request(
        options(baseUrl + `/users/admin/${adminTester._id}`, "DELETE", null, {
          authorization: `JWT ${accessToken}`,
        }),
      );
    } catch (error) {
      extractAxiosError(error);
    }
  });

  it("should register a user", async () => {
    expect(registeredUser).toHaveProperty("_id");
    expect(registeredUser.email).toEqual(testUser.email);
  });

  it("should login a user", async () => {
    expect(accessToken).toBeDefined();
  });

  describe("Admin User Services", () => {
    it("should get user by id", async () => {
      const users = await request(
        options(baseUrl + `/users`, "GET", null, {
          authorization: `JWT ${accessToken}`,
        }),
      );
      const user = users.data?.data[0];
      const res = await request(
        options(baseUrl + `/users/${user._id}`, "GET", null, {
          authorization: `JWT ${accessToken}`,
        }),
      );
      const searchedUser = res.data;

      expect(searchedUser._id).toEqual(user._id);
    });
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
