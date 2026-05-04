import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/AppError";
import {
  addStock,
  adjustStock,
  getAllStockMovements,
  getProductStockMovements,
  removeStock,
  returnStock,
} from "./stock.service";

const getUserId = (req: Request): string => {
  if (!req.user) {
    throw new AppError("You are not logged in", 401);
  }

  return req.user.id;
};

const getIdParam = (req: Request): string => {
  const id = req.params.id;

  if (!id) {
    throw new AppError("ID parameter is required", 400);
  }

  if (Array.isArray(id)) {
    throw new AppError("Invalid ID parameter", 400);
  }

  return id;
};

export const addStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await addStock({
      ...req.body,
      userId: getUserId(req),
    });

    res.status(200).json({
      status: "success",
      message: "Stock added successfully",
      ...result,
    });
  }
);

export const removeStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await removeStock({
      ...req.body,
      userId: getUserId(req),
    });

    res.status(200).json({
      status: "success",
      message: "Stock removed successfully",
      ...result,
    });
  }
);

export const returnStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await returnStock({
      ...req.body,
      userId: getUserId(req),
    });

    res.status(200).json({
      status: "success",
      message: "Stock returned successfully",
      ...result,
    });
  }
);

export const adjustStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await adjustStock({
      ...req.body,
      userId: getUserId(req),
    });

    res.status(200).json({
      status: "success",
      message: "Stock adjusted successfully",
      ...result,
    });
  }
);

export const getAllStockMovementsController = asyncHandler(
  async (req: Request, res: Response) => {
    const movements = await getAllStockMovements();

    res.status(200).json({
      status: "success",
      results: movements.length,
      movements,
    });
  }
);

export const getProductStockMovementsController = asyncHandler(
  async (req: Request, res: Response) => {
    const movements = await getProductStockMovements(getIdParam(req));

    res.status(200).json({
      status: "success",
      results: movements.length,
      movements,
    });
  }
);