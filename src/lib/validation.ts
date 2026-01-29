import { z } from "zod";

export const SignupSchema = z.object({
  businessName: z.string().min(2).max(80),
  email: z.string().email().max(120),
  password: z.string().min(8).max(72),
});

export const LoginSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(8).max(72),
});

export const CreateCustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  phoneE164: z
    .string()
    .min(8, "Phone must be at least 8 characters")
    .startsWith("+", "Phone must start with +"),
  notes: z.string().max(500).optional(),
});

export const CreateOrderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  status: z.string().default("new"),
  itemName: z.string().min(1, "Item name is required"),
  qty: z.coerce.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.coerce.number().min(0, "Price must be positive"),
});

