import { z } from "zod";

export const simulateDepositSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "Must be a positive number",
    ),
  delay: z
    .string()
    .min(1, "Delay is required")
    .refine(
      (v) =>
        !isNaN(Number(v)) &&
        Number.isInteger(Number(v)) &&
        Number(v) >= 0 &&
        Number(v) <= 60,
      "Must be a whole number between 0 and 60",
    ),
});

export type SimulateDepositFormValues = z.infer<typeof simulateDepositSchema>;
