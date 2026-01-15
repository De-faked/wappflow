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
