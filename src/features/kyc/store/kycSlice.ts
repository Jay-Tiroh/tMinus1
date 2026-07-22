// store/slices/kycSlice.ts
import {
  KycDocumentType,
  KycFileAsset,
  SubmitKYCRequest,
} from "@/features/kyc/types/kyc.types";
import { RootState } from "@/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type KycFilesState = {
  document_front?: KycFileAsset;
  document_back?: KycFileAsset;
  selfie?: KycFileAsset;
};

interface KycState extends SubmitKYCRequest {
  selectedFiles: KycFilesState;
}

const initialState: KycState = {
  legalName: "",
  country: "Nigeria",
  documentType: "" as KycDocumentType,
  documentNumber: "",
  selfieImageUrl: "",
  documentImageUrl: "",
  selectedFiles: {},
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    setStep1Data: (
      state,
      action: PayloadAction<
        Pick<
          SubmitKYCRequest,
          "legalName" | "country" | "documentType" | "documentNumber"
        >
      >,
    ) => {
      state.legalName = action.payload.legalName;
      state.country = action.payload.country;
      state.documentType = action.payload.documentType;
      state.documentNumber = action.payload.documentNumber;
    },

    // Saves the raw local file selected via expo-document-picker/camera
    setKycFile: (
      state,
      action: PayloadAction<{
        key: keyof KycFilesState;
        file: KycFileAsset;
      }>,
    ) => {
      state.selectedFiles[action.payload.key] = action.payload.file;
    },

    // Saves the remote publicUrls AFTER the API upload completes
    setUploadedUrls: (
      state,
      action: PayloadAction<
        Pick<SubmitKYCRequest, "selfieImageUrl" | "documentImageUrl">
      >,
    ) => {
      state.selfieImageUrl = action.payload.selfieImageUrl;
      state.documentImageUrl = action.payload.documentImageUrl;
    },

    updateKycData: (
      state,
      action: PayloadAction<Partial<SubmitKYCRequest>>,
    ) => {
      return { ...state, ...action.payload };
    },
    resetKycData: () => initialState,
  },
});

export const {
  setStep1Data,
  setKycFile,
  setUploadedUrls,
  updateKycData,
  resetKycData,
} = kycSlice.actions;

export const selectKycData = (state: RootState) => state.kyc;
export const selectKycFiles = (state: RootState) => state.kyc.selectedFiles;

export default kycSlice.reducer;
