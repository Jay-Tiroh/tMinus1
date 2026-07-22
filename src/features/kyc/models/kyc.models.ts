import { KycDocumentType } from "@/features/kyc/types/kyc.types";

export type KycPhase = "inProgress" | "approved" | "failed";

export type KycStatusPhaseConfig = {
  phase: KycPhase;
  title: string;
  description: string;
  cta: string;
};

export type KycStep2Phase = 1 | 2;

export type KycPhaseDetails = {
  title: string;
  body: string;
};

export type KycSubmissionPayload = {
  legalName: string;
  country: string;
  documentType: KycDocumentType;
  documentNumber: string;
  documentImageUrl: string;
  selfieImageUrl: string;
  idempotencyKey: string;
};
