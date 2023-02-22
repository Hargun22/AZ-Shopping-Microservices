const mongoose = require("mongoose");
const request = require("supertest");
const User = require("./models/User");
const { createServer } = require("./utils/server");
const app = createServer();

jest.mock("passport", () => {
  return {
    use: jest.fn(),
    authenticate: jest.fn().mockReturnValueOnce((req, res, next) => next()),
    initialize: jest.fn().mockReturnValueOnce((req, res, next) => next()),
  };
});

jest.mock("./utils/verification", () => {
  const { isLoggedIn } = jest.requireActual("./utils/verification");
  return {
    isLoggedIn: isLoggedIn,
    isAdmin: jest.fn().mockImplementation((req, res, next) => next()),
  };
});

const userId = new mongoose.Types.ObjectId().toString();

const mockUser = {
  _id: userId,
  username: "test",
  email: "test@gmail.com",
  admin: false,
  createdAt: "2023-01-30T13:31:07.674Z",
  updatedAt: "2023-01-30T13:31:07.674Z",
  __v: 0,
};

const mockNewUser = {
  username: "test",
  email: "test@gmail.com",
  password: "test",
  admin: false,
};

const mockGetUser = [
  {
    _doc: mockUser,
  },
];

const mockUpdateUserDetails = {
  username: "test2",
  email: "test2@gmail.com",
};

const mockUpdatedUser = {
  _id: userId,
  username: "test2",
  email: "test2@gmail.com",
  admin: false,
  createdAt: "2023-01-30T13:31:07.674Z",
  updatedAt: "2023-01-30T13:31:07.674Z",
  __v: 0,
};

describe("User", () => {
  describe("get user route", () => {
    describe("given an invalid user id", () => {
      it("should return a 404", async () => {
        // code
        const invalidUserId = "doesnotexist";

        User.find = jest.fn().mockReturnValue([]);

        const response = await request(app).get(`/${invalidUserId}`);
        expect(response.statusCode).toBe(404);
      });
    });
    describe("given a valid username", () => {
      it("should return the user", async () => {
        // code
        const validUserId = "test";

        User.find = jest.fn().mockReturnValueOnce(mockGetUser);

        const response = await request(app).get(`/${validUserId}`);

        expect(response.body).toEqual(mockUser);
        expect(response.statusCode).toBe(200);
      });
    });
  });
  describe("post user route", () => {
    describe("given a valid new user", () => {
      it("should save the new user", async () => {
        User.prototype.save = jest.fn().mockReturnValueOnce(mockUser);

        const response = await request(app).post("/").send(mockNewUser);

        expect(response.body).toEqual(mockUser);
        expect(response.statusCode).toBe(201);
      });
    });
  });
  describe("put user route", () => {
    describe("given a valid user id", () => {
      it("should update the user", async () => {
        User.findByIdAndUpdate = jest.fn().mockReturnValueOnce(mockUpdatedUser);

        const response = await request(app)
          .put(`/${userId}`)
          .send(mockUpdateUserDetails);

        expect(response.body).toEqual(mockUpdatedUser);
        expect(response.statusCode).toBe(200);
      });
    });
  });
  describe("delete user route", () => {
    describe("given a valid user id", () => {
      it("should update the user", async () => {
        User.findByIdAndDelete = jest.fn().mockReturnValueOnce(mockUser);

        const response = await request(app).delete(`/${userId}`);

        expect(response.body).toEqual(mockUser);
        expect(response.statusCode).toBe(200);
      });
    });
  });
});
