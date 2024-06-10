import request from "axios";
import { IUser, UserDoc } from "./user.schema";
import AdminService from "./admin/admin.service";
import { exec } from "child_process";

describe("order controller ", () => {
  const baseUrl: string = process.env.SERVER_URL as string;
  let accessToken: string;
  let testUser: IUser;
  let registeredUser: Partial<UserDoc>;

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
    } catch (error) {
      console.log(extractAxiosError(error).data);
    }
  });

  afterEach(async () => {
    await request(
      options(baseUrl + `/users`, "DELETE", null, {
        authorization: `JWT ${accessToken}`,
      }),
    );
  });

  it("should register a user", async () => {
    expect(registeredUser).toHaveProperty("_id");
    expect(registeredUser.email).toEqual(testUser.email);
  });

  it("should login a user", async () => {
    expect(accessToken).toBeDefined();
  });

  describe.skip("Admin User Services", () => {
    it("should get user by id", async () => {
      try {
        const users = await request(options(baseUrl + `/users`));
        const user = users.data?.data[0];
        const res = await request(options(baseUrl + `/users/${user._id}`));
        const searchedUser = res.data;
        expect(searchedUser._id).toEqual(user._id);
      } catch (error) {
        extractAxiosError(error);
      }
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
