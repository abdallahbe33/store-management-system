import request from "supertest";
import app from "../app";

describe("Health route", () => {
  it("should return API health status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.message).toBe("Store Management API is running");
  });
});