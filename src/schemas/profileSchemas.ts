import { z } from "zod";

export const editProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username is required")
    .max(15, "Username is too long"),
  email: z
    .string()
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "Enter a valid email address",
    })
    .optional(),
  phone: z
    .string()
    .refine((val) => val === "" || /^\+[1-9]\d{6,14}$/.test(val), {
      message:
        "Enter a valid international mobile number (e.g., +2347059233891)",
    })
    .optional(),
});
export type EditProfileFormData = z.infer<typeof editProfileSchema>;
