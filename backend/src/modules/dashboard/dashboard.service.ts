import { OrderStatus } from "@prisma/client";
import prisma from "../../db/prisma";

export const getDashboardSummary = async () => {
  const [
    totalProducts,
    totalCategories,
    totalSuppliers,
    totalOrders,
    allProducts,
    approvedOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.supplier.count(),
    prisma.order.count(),
    prisma.product.findMany(),
    prisma.order.findMany({
      where: {
        status: {
          in: [OrderStatus.APPROVED, OrderStatus.SHIPPED],
        },
      },
      select: {
        totalPrice: true,
      },
    }),
  ]);

  const lowStockProductsCount = allProducts.filter(
    (product) => product.quantity <= product.minStock
  ).length;

  const totalRevenue = approvedOrders.reduce((sum, order) => {
    return sum + Number(order.totalPrice);
  }, 0);

  return {
    totalProducts,
    totalCategories,
    totalSuppliers,
    totalOrders,
    lowStockProducts: lowStockProductsCount,
    totalRevenue,
  };
};

export const getLowStockProducts = async () => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      supplier: true,
    },
    orderBy: {
      quantity: "asc",
    },
  });

  return products.filter((product) => product.quantity <= product.minStock);
};

export const getRecentOrders = async () => {
  return prisma.order.findMany({
    take: 5,
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

export const getRecentStockMovements = async () => {
  return prisma.stockMovement.findMany({
    take: 5,
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