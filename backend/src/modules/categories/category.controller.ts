import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/AppError";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "./category.service";

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

export const createCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await createCategory(req.body);

    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      category,
    });
  }
);

export const getAllCategoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await getAllCategories();

    res.status(200).json({
      status: "success",
      results: categories.length,
      categories,
    });
  }
);

export const getCategoryByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await getCategoryById(getIdParam(req));

    res.status(200).json({
      status: "success",
      category,
    });
  }
);

export const updateCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await updateCategory(getIdParam(req), req.body);

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      category,
    });
  }
);

export const deleteCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteCategory(getIdParam(req));

    res.status(204).send();
  }
);