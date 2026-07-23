import { z } from "zod";

export const editProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  avatarUrl: z.string().optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
