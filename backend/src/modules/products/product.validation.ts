import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  sku: z.string().min(2, "SKU must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().min(0, "Quantity cannot be negative").optional(),
  minStock: z.number().int().min(0, "Minimum stock cannot be negative").optional(),
  categoryId: z.string().uuid("Invalid category ID"),
  supplierId: z.string().uuid("Invalid supplier ID").optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").optional(),
  sku: z.string().min(2, "SKU must be at least 2 characters").optional(),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive").optional(),
  quantity: z.number().int().min(0, "Quantity cannot be negative").optional(),
  minStock: z.number().int().min(0, "Minimum stock cannot be negative").optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  supplierId: z.string().uuid("Invalid supplier ID").optional(),
});