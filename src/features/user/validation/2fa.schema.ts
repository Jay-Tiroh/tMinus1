import { z } from "zod";

export const passwordValidationSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one symbol");

export const disable2faSchema = z.object({
  password: passwordValidationSchema,
  code: z.string().optional(),
  recoveryCode: z.string().optional(),
});

export type Disable2faFormValues = z.infer<typeof disable2faSchema>;
