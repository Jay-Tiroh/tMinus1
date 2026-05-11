import { z } from "zod";

const fullNameSchema = z
  .string()
  .min(1, "Full name is required")
  .max(100, "Full name must be at most 100 characters")
  .regex(/^[a-zA-Z]+(\s[a-zA-Z]+)+$/, "Enter at least a first and last name");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one symbol");

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address");

const phoneSchema = z
  .string()
  .min(1, "Mobile number is required")
  .max(15, "Mobile number must be at most 15 characters")
  .regex(/^\+?[0-9]{7,15}$/, "Enter a valid mobile number");

export const signupSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export const emailPasswordSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const mobilePasswordSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
});

export const phoneSchema_ = z.object({
  phone: phoneSchema,
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type EmailPasswordFormData = z.infer<typeof emailPasswordSchema>;
export type MobilePasswordFormData = z.infer<typeof mobilePasswordSchema>;
export type PhoneFormData = z.infer<typeof phoneSchema_>;
