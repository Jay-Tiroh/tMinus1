import { AuthResponseData } from "@/types/auth";

// ── Setup 2FA ──────────────────────────────────────────────────────────────
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

// ── Enable 2FA ─────────────────────────────────────────────────────────────
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

// ── Verify 2FA ─────────────────────────────────────────────────────────────
export interface Verify2FARequest {
  challengeId: string;
  code?: string;
  recoveryCode?: string;
}

export interface Verify2FAResponse {
  data: AuthResponseData;
}

// ── Regenerate Recovery Codes ──────────────────────────────────────────────
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

// ── Disable 2FA ────────────────────────────────────────────────────────────
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

// Status
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
