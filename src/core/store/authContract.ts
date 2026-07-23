// core/store/authContract.ts
// Zero feature imports. This is the seam core/store uses to talk to
// whichever feature owns session state, without knowing it's "auth".

export interface AuthSession {
  user: unknown;
  token: string;
  refreshToken: string;
}

export interface AuthBridge {
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

let bridge: AuthBridge | null = null;

export const registerAuthBridge = (b: AuthBridge) => {
  bridge = b;
};

export const getAuthBridge = (): AuthBridge => {
  if (!bridge) {
    throw new Error(
      "AuthBridge not registered — call registerAuthBridge() during app bootstrap before any API calls fire.",
    );
  }
  return bridge;
};
