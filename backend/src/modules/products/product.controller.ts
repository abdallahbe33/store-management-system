import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/AppError";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "./product.service";

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

export const createProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await createProduct(req.body);

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      product,
    });
  }
);

export const getAllProductsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getAllProducts({
      search: req.query.search as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      supplierId: req.query.supplierId as string | undefined,
      lowStock: req.query.lowStock as string | undefined,
      page: req.query.page as string | undefined,
      limit: req.query.limit as string | undefined,
    });

    res.status(200).json({
      status: "success",
      results: result.products.length,
      pagination: result.pagination,
      products: result.products,
    });
  }
);
export const getProductByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await getProductById(getIdParam(req));

    res.status(200).json({
      status: "success",
      product,
    });
  }
);

export const updateProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await updateProduct(getIdParam(req), req.body);

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      product,
    });
  }
);

export const deleteProductController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteProduct(getIdParam(req));

    res.status(204).send();
  }
);