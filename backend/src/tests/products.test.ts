import request from "supertest";
import app from "../app";
import prisma from "../db/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminEmail = "product-admin@example.com";

const createAdminToken = async () => {
  const passwordHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Product Admin",
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const token = jwt.sign(
    {
      userId: admin.id,
      role: admin.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  return token;
};

beforeEach(async () => {
  await prisma.stockMovement.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplier.deleteMany();

  await prisma.user.deleteMany({
    where: {
      email: adminEmail,
    },
  });
});

afterAll(async () => {
  await prisma.stockMovement.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplier.deleteMany();

  await prisma.user.deleteMany({
    where: {
      email: adminEmail,
    },
  });

  await prisma.$disconnect();
});

describe("Product routes", () => {
  it("should return products with pagination", async () => {
    const token = await createAdminToken();

    const category = await prisma.category.create({
      data: {
        name: "Test Electronics",
      },
    });

    const supplier = await prisma.supplier.create({
      data: {
        name: "Test Supplier",
        email: "test-supplier@example.com",
      },
    });

    await prisma.product.create({
      data: {
        name: "Test Mouse",
        sku: "TEST-MOUSE-001",
        description: "Test wireless mouse",
        price: 79.99,
        quantity: 20,
        minStock: 5,
        categoryId: category.id,
        supplierId: supplier.id,
      },
    });

    const response = await request(app)
      .get("/api/products?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.results).toBe(1);
    expect(response.body.pagination.page).toBe(1);
    expect(response.body.pagination.limit).toBe(5);
    expect(response.body.pagination.totalItems).toBe(1);
    expect(response.body.pagination.totalPages).toBe(1);
    expect(response.body.products[0].name).toBe("Test Mouse");
  });
});