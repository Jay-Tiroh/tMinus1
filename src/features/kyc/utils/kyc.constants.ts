import { KycDocumentOption } from "../types/kyc.types";

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
