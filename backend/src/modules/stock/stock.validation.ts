import { z } from "zod";

export const stockMovementSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().positive("Quantity must be positive"),
  note: z.string().optional(),
});

export const stockAdjustmentSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  newQuantity: z.number().int().min(0, "New quantity cannot be negative"),
  note: z.string().optional(),
});