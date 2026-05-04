import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/AppError";
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
} from "./supplier.service";

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

export const createSupplierController = asyncHandler(
  async (req: Request, res: Response) => {
    const supplier = await createSupplier(req.body);

    res.status(201).json({
      status: "success",
      message: "Supplier created successfully",
      supplier,
    });
  }
);

export const getAllSuppliersController = asyncHandler(
  async (req: Request, res: Response) => {
    const suppliers = await getAllSuppliers();

    res.status(200).json({
      status: "success",
      results: suppliers.length,
      suppliers,
    });
  }
);

export const getSupplierByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const supplier = await getSupplierById(getIdParam(req));

    res.status(200).json({
      status: "success",
      supplier,
    });
  }
);

export const updateSupplierController = asyncHandler(
  async (req: Request, res: Response) => {
    const supplier = await updateSupplier(getIdParam(req), req.body);

    res.status(200).json({
      status: "success",
      message: "Supplier updated successfully",
      supplier,
    });
  }
);

export const deleteSupplierController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteSupplier(getIdParam(req));

    res.status(204).send();
  }
);