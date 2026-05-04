import request from "supertest";
import app from "../app";
import prisma from "../db/prisma";
import { Role, OrderStatus, StockMovementType } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminEmail = "order-admin@example.com";

const createAdminToken = async () => {
  const passwordHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Order Admin",
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

describe("Order routes", () => {
  it("should approve an order, reduce stock, and create stock movement", async () => {
    const token = await createAdminToken();

    const category = await prisma.category.create({
      data: {
        name: "Order Test Category",
      },
    });

    const supplier = await prisma.supplier.create({
      data: {
        name: "Order Test Supplier",
        email: "order-supplier@example.com",
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Order Test Mouse",
        sku: "ORDER-MOUSE-001",
        description: "Mouse for order testing",
        price: 100,
        quantity: 20,
        minStock: 5,
        categoryId: category.id,
        supplierId: supplier.id,
      },
    });

    const createOrderResponse = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        customerName: "Test Customer",
        items: [
          {
            productId: product.id,
            quantity: 2,
          },
        ],
      });

    expect(createOrderResponse.status).toBe(201);
    expect(createOrderResponse.body.order.status).toBe(OrderStatus.PENDING);
    expect(Number(createOrderResponse.body.order.totalPrice)).toBe(200);

    const orderId = createOrderResponse.body.order.id;

    const approveResponse = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: OrderStatus.APPROVED,
      });

    expect(approveResponse.status).toBe(200);
    expect(approveResponse.body.order.status).toBe(OrderStatus.APPROVED);

    const updatedProduct = await prisma.product.findUnique({
      where: {
        id: product.id,
      },
    });

    expect(updatedProduct?.quantity).toBe(18);

    const stockMovement = await prisma.stockMovement.findFirst({
      where: {
        productId: product.id,
        type: StockMovementType.OUT,
        quantity: 2,
      },
    });

    expect(stockMovement).toBeDefined();
    expect(stockMovement?.note).toBe(`Order approved: ${orderId}`);
  });
});