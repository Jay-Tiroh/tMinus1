import { signupSchema } from "@/schemas/authSchemas";
import { z } from "zod";

export const editProfileSchema = signupSchema
  .pick({
    email: true,
    phone: true,
  })
  .extend({
    // Adding username specifically for this page
    username: z
      .string()
      .min(3, "Username is required")
      .max(15, "Username is too long"),
  })
  .partial();
export type EditProfileFormData = z.infer<typeof editProfileSchema>;
