import { Request, Response } from "express";
import { OrderStatus } from "@prisma/client";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/AppError";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "./order.service";

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

export const createOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await createOrder({
      customerName: req.body.customerName,
      items: req.body.items,
      createdById: getUserId(req),
    });

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      order,
    });
  }
);

export const getAllOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await getAllOrders();

    res.status(200).json({
      status: "success",
      results: orders.length,
      orders,
    });
  }
);

export const getOrderByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await getOrderById(getIdParam(req));

    res.status(200).json({
      status: "success",
      order,
    });
  }
);

export const updateOrderStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await updateOrderStatus(
      getIdParam(req),
      req.body.status as OrderStatus,
      getUserId(req)
    );

    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      order,
    });
  }
);

export const deleteOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteOrder(getIdParam(req));

    res.status(204).send();
  }
);