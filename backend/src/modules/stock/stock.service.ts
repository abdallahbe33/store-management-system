import { StockMovementType } from "@prisma/client";
import prisma from "../../db/prisma";
import AppError from "../../utils/AppError";

type StockMovementInput = {
  productId: string;
  quantity: number;
  note?: string;
  userId: string;
};

type StockAdjustmentInput = {
  productId: string;
  newQuantity: number;
  note?: string;
  userId: string;
};

export const addStock = async (data: StockMovementInput) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const updatedProduct = await tx.product.update({
      where: {
        id: data.productId,
      },
      data: {
        quantity: product.quantity + data.quantity,
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        type: StockMovementType.IN,
        quantity: data.quantity,
        note: data.note,
      },
    });

    return {
      product: updatedProduct,
      movement,
    };
  });
};

export const removeStock = async (data: StockMovementInput) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.quantity < data.quantity) {
      throw new AppError("Not enough stock available", 400);
    }

    const updatedProduct = await tx.product.update({
      where: {
        id: data.productId,
      },
      data: {
        quantity: product.quantity - data.quantity,
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        type: StockMovementType.OUT,
        quantity: data.quantity,
        note: data.note,
      },
    });

    return {
      product: updatedProduct,
      movement,
    };
  });
};

export const returnStock = async (data: StockMovementInput) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const updatedProduct = await tx.product.update({
      where: {
        id: data.productId,
      },
      data: {
        quantity: product.quantity + data.quantity,
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        type: StockMovementType.RETURN,
        quantity: data.quantity,
        note: data.note,
      },
    });

    return {
      product: updatedProduct,
      movement,
    };
  });
};

export const adjustStock = async (data: StockAdjustmentInput) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const difference = data.newQuantity - product.quantity;

    const updatedProduct = await tx.product.update({
      where: {
        id: data.productId,
      },
      data: {
        quantity: data.newQuantity,
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        type: StockMovementType.ADJUSTMENT,
        quantity: Math.abs(difference),
        note: data.note,
      },
    });

    return {
      product: updatedProduct,
      movement,
    };
  });
};

export const getAllStockMovements = async () => {
  return prisma.stockMovement.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const getProductStockMovements = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return prisma.stockMovement.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};