import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one symbol");

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address");

const mobileNumberSchema = z
  .string()
  .min(1, "Mobile number is required")
  .regex(/^\+?[0-9]{7,15}$/, "Enter a valid mobile number");

export const emailPasswordSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const mobilePasswordSchema = z.object({
  mobileNumber: mobileNumberSchema,
  password: passwordSchema,
});

export const mobileNumberSchema_ = z.object({
  mobileNumber: mobileNumberSchema,
});

export type EmailPasswordFormData = z.infer<typeof emailPasswordSchema>;
export type MobilePasswordFormData = z.infer<typeof mobilePasswordSchema>;
export type MobileNumberFormData = z.infer<typeof mobileNumberSchema_>;
