import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import prisma from "./db/prisma";
import errorMiddleware from "./middleware/error.middleware";
import categoryRoutes from "./modules/categories/category.routes";
import supplierRoutes from "./modules/suppliers/supplier.routes";
import productRoutes from "./modules/products/product.routes";
import stockRoutes from "./modules/stock/stock.routes";
import orderRoutes from "./modules/orders/order.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";


// Initialize  Express app 
const app = express();
// Use security middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    status: "error",
    message: "Too many requests, please try again later",
  },
});

app.use("/api", apiLimiter);
app.use(express.json());
app.get("/api/health", (req, res) => {
  res.status(200).json({    
    status: "ok",
    message: "Store Management API is running",
  });
});

// Test route to check database connection
app.get("/api/db-test", async (req, res) => {
  const users = await prisma.user.findMany();

  res.status(200).json({
    status: "ok",
    users,
  });
});

// Register auth routes
app.use("/api/auth", authRoutes);
// Use error handling middleware
app.use(errorMiddleware);
// Register category routes
app.use("/api/categories", categoryRoutes);
// Register supplier routes
app.use("/api/suppliers", supplierRoutes);
// Register product routes
app.use("/api/products", productRoutes);
// Register stock routes
app.use("/api/stock", stockRoutes); 
// Register order routes
app.use("/api/orders", orderRoutes);
// Register dashboard routes
app.use("/api/dashboard", dashboardRoutes);

export default app;