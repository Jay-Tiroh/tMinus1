// ── Submit KYC ─────────────────────────────────────────────────────────────
export interface SubmitKYCRequest {
  legalName: string;
  country: string;
  documentType: string;
  documentNumber: string;
  selfieImageUrl: string;
  documentImageUrl: string;
  idempotencyKey?: string; // Used for the header, omitted from the body payload
}

export interface KYCSubmissionData {
  id: string;
  userId: string;
  legalName: string;
  country: string;
  documentType: string;
  documentNumber: string;
  selfieImageUrl: string;
  documentImageUrl: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt: string | null;
  reviewerNote: string | null;
}

export interface SubmitKYCResponse {
  data: KYCSubmissionData;
  meta?: {
    requestId: string;
  };
}

// ── KYC Upload Instructions ────────────────────────────────────────────────
export interface KYCUploadInstructionRequest {
  fileName: string;
  contentType: string;
  documentKind: string; // e.g., "document_front", "document_back", "selfie"
}

export interface KYCUploadInstructionData {
  uploadId: string;
  provider: string;
  storageKey: string;
  uploadUrl: string;
  publicUrl: string;
  method: string;
  headers: Record<string, string>;
  expiresAt: string;
}

export interface KYCUploadInstructionResponse {
  data: KYCUploadInstructionData;
}
