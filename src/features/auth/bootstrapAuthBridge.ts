// features/auth/bootstrapAuthBridge.ts
import { store } from "@/core/store";
import { AuthSession, registerAuthBridge } from "@/core/store/authContract";
import { User } from "@/features/user";
import { clearCredentials, setCredentials } from "./store/authSlice";

registerAuthBridge({
  setSession: (session: AuthSession) => {
    store.dispatch(
      setCredentials({
        user: session.user as User,
        token: session.token,
        refreshToken: session.refreshToken,
      }),
    );
  },
  clearSession: () => {
    store.dispatch(clearCredentials());
  },
});
