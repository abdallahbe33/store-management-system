import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const createOrderSchema = z.object({
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  items: z
    .array(
      z.object({
        productId: z.string().uuid("Invalid product ID"),
        quantity: z.number().int().positive("Quantity must be positive"),
      })
    )
    .min(1, "Order must contain at least one item"),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});