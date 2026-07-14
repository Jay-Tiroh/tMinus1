

let pendingRecoveryCodes: string[] | null = null;

export const setPendingRecoveryCodes = (codes: string[]) => {
  pendingRecoveryCodes = codes;
};

export const consumePendingRecoveryCodes = (): string[] | null => {
  const codes = pendingRecoveryCodes;
  pendingRecoveryCodes = null;
  return codes;
};
