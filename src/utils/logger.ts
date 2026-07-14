// src/utils/logger.ts
const SENSITIVE_KEYS = [
  "token",
  "accesstoken",
  "refreshtoken",
  "pin",
  "otp",
  "democode",
  "recoverycodes",
  "password",
  "publicurl",
  "walletaddress",
];

function redact(value: unknown, seen = new WeakSet<object>()): unknown {
  if (Array.isArray(value)) return value.map((v) => redact(v, seen));

  if (value && typeof value === "object") {
    if (seen.has(value)) return "[CIRCULAR]";
    seen.add(value);

    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => {
        const isSensitive = SENSITIVE_KEYS.some((s) =>
          k.toLowerCase().includes(s),
        );
        return [k, isSensitive ? "[REDACTED]" : redact(v, seen)];
      }),
    );
  }

  return value;
}

export const logger = {
  log: (...args: unknown[]) => {
    if (__DEV__) console.log(...args.map((a) => redact(a)));
  },
  warn: (...args: unknown[]) => {
    if (__DEV__) console.warn(...args.map((a) => redact(a)));
  },
  error: (...args: unknown[]) => {
    if (__DEV__) console.error(...args.map((a) => redact(a)));
    // later: forward sanitized errors to Sentry/Crashlytics in prod
  },
};
