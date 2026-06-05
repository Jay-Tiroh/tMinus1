import { z } from "zod";

export const kycStep1Schema = z.object({
  legalName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be at most 100 characters")
    .regex(/^[a-zA-Z]+(\s[a-zA-Z]+)+$/, "Enter at least a first and last name"),
  country: z.string().min(1, "Country is required"),
  documentType: z.string().min(1, "Document type is required"),
  documentNumber: z
    .string()
    .min(1, "Document number is required")
    .regex(/\d/, "Document number must contain at least one number"),
});

export type KycStep1FormValues = z.infer<typeof kycStep1Schema>;
