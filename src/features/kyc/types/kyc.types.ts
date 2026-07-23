export type KycDocumentCategory = "identity" | "address";

export type KycDocumentType = "national_id" | "passport" | "drivers_license";

export interface SubmitKYCRequest {
  legalName: string;
  country: string;
  documentType: KycDocumentType;
  documentNumber: string;
  selfieImageUrl?: string;
  documentImageUrl?: string;
  idempotencyKey?: string;
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

export interface KycFileAsset {
  uri: string;
  name: string;
  mimeType: string;
  size: number;
  lastModified?: number;
}

export interface SubmitKYCResponse {
  data: KYCSubmissionData;
  meta?: {
    requestId: string;
  };
}

export interface KYCUploadInstructionRequest {
  file: File | Blob | any;
  documentKind: "selfie" | "document_front" | "document_back";
}

export interface KYCUploadInstructionData {
  uploadId: string;
  provider: string;
  cloudName?: string;
  storageKey: string;
  folder?: string;
  publicId: string;
  uploadUrl?: string;
  publicUrl: string;
  method?: string;
  headers?: Record<string, string>;
  formFields?: Record<string, string | number>;
  expiresAt?: string;
  uploaded: boolean;
  directUpload: boolean;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface KYCUploadInstructionResponse {
  data: KYCUploadInstructionData;
  meta?: {
    requestId: string;
  };
}

export interface KycDocumentOption {
  label: string;
  type: KycDocumentType;
  category: KycDocumentCategory;
  acceptedMimeTypes: string[];
  acceptedExtensions: string[];
}
