// src/utils/errors.ts
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

function isSerializedError(error: unknown): error is SerializedError {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    !("status" in error)
  );
}

function extractMessageFromData(data: unknown): string | undefined {
  if (typeof data === "string") return data;
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.error === "object" && obj.error !== null) {
      const nested = obj.error as Record<string, unknown>;
      if (typeof nested.message === "string") return nested.message;
    }
    if (typeof obj.error === "string") return obj.error;
  }
  return undefined;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (!error) return fallback;

  if (isFetchBaseQueryError(error)) {
    if ("data" in error) {
      const msg = extractMessageFromData(error.data);
      if (msg) return msg;
    }
    if ("error" in error && typeof error.error === "string") {
      return error.error;
    }
    return fallback;
  }

  if (isSerializedError(error)) {
    return error.message ?? fallback;
  }

  return fallback;
}
