import { OrderStatus, Prisma, StockMovementType } from "@prisma/client";
import prisma from "../../db/prisma";
import AppError from "../../utils/AppError";

type CreateOrderInput = {
  customerName: string;
  createdById: string;
  items: {
    productId: string;
    quantity: number;
  }[];
};

export const createOrder = async (data: CreateOrderInput) => {
  return prisma.$transaction(async (tx) => {
    const productIds = data.items.map((item) => item.productId);

    const products = await tx.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      throw new AppError("One or more products were not found", 404);
    }

    let totalPrice = new Prisma.Decimal(0);

    const orderItemsData = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      const itemTotal = product.price.mul(item.quantity);
      totalPrice = totalPrice.add(itemTotal);

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    const order = await tx.order.create({
      data: {
        customerName: data.customerName,
        createdById: data.createdById,
        totalPrice,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return order;
  });
};

export const getAllOrders = async () => {
  return prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      createdBy: {
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

export const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
  userId: string
) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new AppError("Cancelled orders cannot be updated", 400);
    }

    if (order.status === OrderStatus.SHIPPED) {
      throw new AppError("Shipped orders cannot be updated", 400);
    }

    if (order.status === OrderStatus.APPROVED && status === OrderStatus.APPROVED) {
      throw new AppError("Order is already approved", 400);
    }

    if (status === OrderStatus.APPROVED && order.status === OrderStatus.PENDING) {
      for (const item of order.items) {
        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },
        });

        if (!product) {
          throw new AppError("Product not found", 404);
        }

        if (product.quantity < item.quantity) {
          throw new AppError(
            `Not enough stock for product ${product.name}`,
            400
          );
        }

        await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            quantity: product.quantity - item.quantity,
          },
        });

        await tx.stockMovement.create({
          data: {
            productId: product.id,
            userId,
            type: StockMovementType.OUT,
            quantity: item.quantity,
            note: `Order approved: ${order.id}`,
          },
        });
      }
    }

    const updatedOrder = await tx.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return updatedOrder;
  });
};

export const deleteOrder = async (id: string) => {
  const order = await getOrderById(id);

  if (order.status === OrderStatus.APPROVED || order.status === OrderStatus.SHIPPED) {
    throw new AppError("Approved or shipped orders cannot be deleted", 400);
  }

  return prisma.order.delete({
    where: {
      id,
    },
  });
};