import { z } from "zod";

const fullNameSchema = z
  .string()
  .min(1, "Full name is required")
  .max(22, "Full name must be at most 22 characters")
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
  .max(16, "Mobile number must be at most 16 characters")
  .regex(
    /^\+[1-9]\d{6,14}$/,
    "Enter a valid international mobile number (e.g., +2347059233891)",
  );

const secureUrlSchema = z
  .string()
  .optional()
  .refine(
    (val) =>
      !val ||
      (val.startsWith("https://") && z.string().url().safeParse(val).success),
    "URL must be a valid https:// address",
  );
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
export const emailSchema_ = z.object({
  email: emailSchema,
});
export const editProfileSchema = z.object({
  fullName: fullNameSchema,
  avatarUrl: secureUrlSchema,
});
export type EditProfileFormData = z.infer<typeof editProfileSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type EmailPasswordFormData = z.infer<typeof emailPasswordSchema>;
export type MobilePasswordFormData = z.infer<typeof mobilePasswordSchema>;
export type PhoneFormData = z.infer<typeof phoneSchema_>;
export type EmailFormData = z.infer<typeof emailSchema_>;
