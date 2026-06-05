// store/slices/kycSlice.ts
import { RootState } from "@/store";
import { SubmitKYCRequest } from "@/types/kyc";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as DocumentPicker from "expo-document-picker";

export type KycFilesState = {
  document_front?: DocumentPicker.DocumentPickerAsset;
  document_back?: DocumentPicker.DocumentPickerAsset;
  passport?: DocumentPicker.DocumentPickerAsset;
  selfie?: DocumentPicker.DocumentPickerAsset;
};

interface KycState extends SubmitKYCRequest {
  selectedFiles: KycFilesState;
}

const initialState: KycState = {
  legalName: "",
  country: "Nigeria",
  documentType: "",
  documentNumber: "",
  selfieImageUrl: "",
  documentImageUrl: "", // Note: API expects a single URL, we will likely map front/passport here.
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
        file: DocumentPicker.DocumentPickerAsset;
      }>,
    ) => {
      state.selectedFiles[action.payload.key] = action.payload.file;
    },

    // Saves the remote publicUrls AFTER the pre-signed upload completes
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
