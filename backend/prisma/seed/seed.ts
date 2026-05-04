import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const main = async () => {
  console.log("Seeding database...");

  await prisma.stockMovement.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      name: "Manager User",
      email: "manager@example.com",
      passwordHash,
      role: Role.MANAGER,
    },
  });

  await prisma.user.create({
    data: {
      name: "Worker User",
      email: "worker@example.com",
      passwordHash,
      role: Role.WORKER,
    },
  });

  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
    },
  });

  const accessories = await prisma.category.create({
    data: {
      name: "Accessories",
    },
  });

  const supplier = await prisma.supplier.create({
    data: {
      name: "Main Electronics Supplier",
      email: "supplier@example.com",
      phone: "0501234567",
      address: "Tel Aviv",
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Wireless Mouse",
        sku: "MOUSE-001",
        description: "Bluetooth wireless mouse",
        price: 79.99,
        quantity: 30,
        minStock: 5,
        categoryId: electronics.id,
        supplierId: supplier.id,
      },
      {
        name: "Mechanical Keyboard",
        sku: "KEYBOARD-001",
        description: "RGB mechanical keyboard",
        price: 249.99,
        quantity: 15,
        minStock: 3,
        categoryId: electronics.id,
        supplierId: supplier.id,
      },
      {
        name: "USB-C Cable",
        sku: "CABLE-001",
        description: "1 meter USB-C cable",
        price: 29.99,
        quantity: 4,
        minStock: 10,
        categoryId: accessories.id,
        supplierId: supplier.id,
      },
    ],
  });

  console.log("Database seeded successfully.");
  console.log("Admin login:");
  console.log("Email: admin@example.com");
  console.log("Password: 123456");
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });