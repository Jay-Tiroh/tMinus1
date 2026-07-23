import { z } from "zod";

export const pinSchema = z
  .object({
    currentPin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must contain only numbers"),
    newPin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must contain only numbers"),
    confirmPin: z.string().length(4, "PIN must be exactly 4 digits"),
  })
  .refine((data) => data.newPin === data.confirmPin, {
    message: "New PINs do not match",
    path: ["confirmPin"],
  });

export type PinFormValues = z.infer<typeof pinSchema>;
