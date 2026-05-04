import prisma from "../../db/prisma";
import AppError from "../../utils/AppError";

type CategoryInput = {
  name: string;
};

export const createCategory = async (data: CategoryInput) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingCategory) {
    throw new AppError("Category already exists", 409);
  }

  return prisma.category.create({
    data: {
      name: data.name,
    },
  });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const updateCategory = async (id: string, data: CategoryInput) => {
  await getCategoryById(id);

  const existingCategory = await prisma.category.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingCategory && existingCategory.id !== id) {
    throw new AppError("Category already exists", 409);
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      name: data.name,
    },
  });
};

export const deleteCategory = async (id: string) => {
  await getCategoryById(id);

  return prisma.category.delete({
    where: {
      id,
    },
  });
};