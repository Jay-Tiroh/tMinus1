export interface SubmitKYCRequest {
  legalName: string;
  country: string;
  documentType: "national_id" | "passport" | "drivers_license";
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
  fileName: string;
  contentType: string;
  documentKind: string;
}

export interface KYCUploadInstructionData {
  uploadId: string;
  provider: string;
  cloudName: string;
  storageKey: string;
  folder: string;
  publicId: string;
  uploadUrl: string;
  publicUrl: string;
  method: string;
  headers: Record<string, string>;
  formFields: Record<string, string | number>;
  expiresAt: string;
}

export interface KYCUploadInstructionResponse {
  data: KYCUploadInstructionData;
}

export type KycDocumentCategory = "identity" | "address";

export type KycDocumentType = "national_id" | "passport" | "drivers_license";

export interface KycDocumentOption {
  label: string;
  type: KycDocumentType;
  category: KycDocumentCategory;
  acceptedMimeTypes: string[];
  acceptedExtensions: string[];
}

const STANDARD_IMAGE_AND_PDF_MIMES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];
const STANDARD_IMAGE_AND_PDF_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"];

export const KYC_DOCUMENT_TYPES: KycDocumentOption[] = [
  {
    label: "National ID",
    type: "national_id",
    category: "identity",
    acceptedMimeTypes: STANDARD_IMAGE_AND_PDF_MIMES,
    acceptedExtensions: STANDARD_IMAGE_AND_PDF_EXTENSIONS,
  },
  {
    label: "Passport",
    type: "passport",
    category: "identity",
    acceptedMimeTypes: STANDARD_IMAGE_AND_PDF_MIMES,
    acceptedExtensions: STANDARD_IMAGE_AND_PDF_EXTENSIONS,
  },
  {
    label: "Driver's License",
    type: "drivers_license",
    category: "identity",
    acceptedMimeTypes: STANDARD_IMAGE_AND_PDF_MIMES,
    acceptedExtensions: STANDARD_IMAGE_AND_PDF_EXTENSIONS,
  },
];

export const KYC_DOCUMENT_LABELS = KYC_DOCUMENT_TYPES.map((doc) => doc.label);
export const getDocumentByType = (
  type: string,
): KycDocumentOption | undefined => {
  return KYC_DOCUMENT_TYPES.find((doc) => doc.type === type);
};
export const getDocumentByLabel = (
  label: string,
): KycDocumentOption | undefined => {
  return KYC_DOCUMENT_TYPES.find((doc) => doc.label === label);
};
