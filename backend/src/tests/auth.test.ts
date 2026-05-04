import request from "supertest";
import app from "../app";
import prisma from "../db/prisma";

const testUserEmail = "testuser@example.com";

beforeEach(async () => {
  await prisma.user.deleteMany({
    where: {
      email: testUserEmail,
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: testUserEmail,
    },
  });

  await prisma.$disconnect();
});

describe("Auth routes", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: testUserEmail,
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.user.email).toBe(testUserEmail);
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  it("should login an existing user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: testUserEmail,
      password: "123456",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: testUserEmail,
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(testUserEmail);
  });

  it("should reject login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: testUserEmail,
      password: "123456",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: testUserEmail,
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Invalid email or password");
  });
  it("should return current user with valid token", async () => {
  await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: testUserEmail,
    password: "123456",
  });

  const loginResponse = await request(app).post("/api/auth/login").send({
    email: testUserEmail,
    password: "123456",
  });

  const token = loginResponse.body.token;

  const response = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.status).toBe("success");
  expect(response.body.user.email).toBe(testUserEmail);
});

it("should reject /me without token", async () => {
  const response = await request(app).get("/api/auth/me");

  expect(response.status).toBe(401);
  expect(response.body.status).toBe("error");
  expect(response.body.message).toBe("You are not logged in");
});

it("should block non-admin user from admin route", async () => {
  await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: testUserEmail,
    password: "123456",
  });

  const loginResponse = await request(app).post("/api/auth/login").send({
    email: testUserEmail,
    password: "123456",
  });

  const token = loginResponse.body.token;

  const response = await request(app)
    .get("/api/auth/admin-test")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(403);
  expect(response.body.status).toBe("error");
  expect(response.body.message).toBe("You do not have permission to perform this action");
});
});