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
    };
    try {
      const createdUserResponse = await request(
        options(baseUrl + "/users/register", "POST", {
          data: testUser,
        }),
      );
      registeredUser = createdUserResponse.data;
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
          { data: { email: registeredUser.email } },
          {
            authorization: `JWT ${accessToken}`,
          },
        ),
      );
      adminTester = createAdminResponse.data;
    } catch (error) {
      console.error("Error creating admin:", extractAxiosError(error));
      throw error;
    }
  });
  afterAll(async () => {
    try {
      if (adminTester?.user_id && accessToken) {
        await request(
          options(baseUrl + `/users/${adminTester.user_id}`, "DELETE", null, {
            authorization: `JWT ${accessToken}`,
          }),
        );
      }
    } catch (error) {
      console.error("Error during cleanup:", extractAxiosError(error));
    }
  });

  it("should register a user", async () => {
    expect(registeredUser).toHaveProperty("email");
    expect(registeredUser.email).toEqual(testUser.email);
  });

  it("should login a user", async () => {
    expect(accessToken).toBeDefined();
  });

  describe("Admin User Services", () => {
    it("should get user by id", async () => {
      try {
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
      } catch (error) {
        console.error("Error during cleanup:", extractAxiosError(error).data);
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
