import { Prisma } from "@prisma/client";
import prisma from "../../db/prisma";
import AppError from "../../utils/AppError";

type ProductInput = {
  name?: string;
  sku?: string;
  description?: string;
  price?: number;
  quantity?: number;
  minStock?: number;
  categoryId?: string;
  supplierId?: string;
};

export const createProduct = async (data: ProductInput) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      sku: data.sku as string,
    },
  });

  if (existingProduct) {
    throw new AppError("Product SKU already exists", 409);
  }

  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId as string,
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (data.supplierId) {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id: data.supplierId,
      },
    });

    if (!supplier) {
      throw new AppError("Supplier not found", 404);
    }
  }

  return prisma.product.create({
    data: {
      name: data.name as string,
      sku: data.sku as string,
      description: data.description,
      price: new Prisma.Decimal(data.price as number),
      quantity: data.quantity ?? 0,
      minStock: data.minStock ?? 0,
      categoryId: data.categoryId as string,
      supplierId: data.supplierId,
    },
    include: {
      category: true,
      supplier: true,
    },
  });
};

export const getAllProducts = async (query: {
  search?: string;
  categoryId?: string;
  supplierId?: string;
  lowStock?: string;
}) => {
  const where: Prisma.ProductWhereInput = {};

  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        sku: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.supplierId) {
    where.supplierId = query.supplierId;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      supplier: true,
    },
  });

  if (query.lowStock === "true") {
    return products.filter((product) => product.quantity <= product.minStock);
  }

  return products;
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      supplier: true,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

export const updateProduct = async (id: string, data: ProductInput) => {
  await getProductById(id);

  if (data.sku) {
    const existingProduct = await prisma.product.findUnique({
      where: {
        sku: data.sku,
      },
    });

    if (existingProduct && existingProduct.id !== id) {
      throw new AppError("Product SKU already exists", 409);
    }
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }
  }

  if (data.supplierId) {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id: data.supplierId,
      },
    });

    if (!supplier) {
      throw new AppError("Supplier not found", 404);
    }
  }

  const updateData: Prisma.ProductUpdateInput = {
    name: data.name,
    sku: data.sku,
    description: data.description,
    quantity: data.quantity,
    minStock: data.minStock,
  };

  if (data.price !== undefined) {
    updateData.price = new Prisma.Decimal(data.price);
  }

  if (data.categoryId) {
    updateData.category = {
      connect: {
        id: data.categoryId,
      },
    };
  }

  if (data.supplierId) {
    updateData.supplier = {
      connect: {
        id: data.supplierId,
      },
    };
  }

  return prisma.product.update({
    where: {
      id,
    },
    data: updateData,
    include: {
      category: true,
      supplier: true,
    },
  });
};

export const deleteProduct = async (id: string) => {
  await getProductById(id);

  return prisma.product.delete({
    where: {
      id,
    },
  });
};