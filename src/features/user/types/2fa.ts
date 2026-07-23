import { AuthResponseData } from "@/features/auth";

export interface Setup2FAResponseData {
  secret: string;
  otpauthUri: string;
  enabled: boolean;
}

export interface Setup2FAResponse {
  data: Setup2FAResponseData;
  meta?: {
    requestId: string;
  };
}

export interface Enable2FARequest {
  code: string;
}

export interface Enable2FAResponseData {
  enabled: boolean;
  recoveryCodes: string[];
  recoveryCodeCount: number;
}

export interface Enable2FAResponse {
  data: Enable2FAResponseData;
}

export interface Verify2FARequest {
  challengeId: string;
  code?: string;
  recoveryCode?: string;
}

export interface Verify2FAResponse {
  data: AuthResponseData;
}

export interface RegenerateRecoveryCodesRequest {
  password: string;
  code: string;
}

export interface RegenerateRecoveryCodesResponseData {
  recoveryCodes: string[];
  recoveryCodeCount: number;
}

export interface RegenerateRecoveryCodesResponse {
  data: RegenerateRecoveryCodesResponseData;
}

export interface Disable2FARequest {
  password: string;
  code?: string;
  recoveryCode?: string;
}

export interface Disable2FAResponseData {
  enabled: boolean;
  recoveryCodeCount: number;
}

export interface Disable2FAResponse {
  data: Disable2FAResponseData;
}

export interface TwoFactorStatusResponseData {
  twoFactorEnabled: boolean;
  twoFactorSetupStarted: boolean;
  recoveryCodesConfigured: boolean;
  recoveryCodesRemaining: number;
}

export interface TwoFactorStatusResponseMeta {
  requestId: string;
}

export interface TwoFactorStatusResponse {
  data: TwoFactorStatusResponseData;
  meta: TwoFactorStatusResponseMeta;
}
