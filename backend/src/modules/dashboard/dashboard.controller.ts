import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import {
  getDashboardSummary,
  getLowStockProducts,
  getRecentOrders,
  getRecentStockMovements,
} from "./dashboard.service";

export const getDashboardSummaryController = asyncHandler(
  async (req: Request, res: Response) => {
    const summary = await getDashboardSummary();

    res.status(200).json({
      status: "success",
      summary,
    });
  }
);

export const getLowStockProductsController = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await getLowStockProducts();

    res.status(200).json({
      status: "success",
      results: products.length,
      products,
    });
  }
);

export const getRecentOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await getRecentOrders();

    res.status(200).json({
      status: "success",
      results: orders.length,
      orders,
    });
  }
);

export const getRecentStockMovementsController = asyncHandler(
  async (req: Request, res: Response) => {
    const movements = await getRecentStockMovements();

    res.status(200).json({
      status: "success",
      results: movements.length,
      movements,
    });
  }
);