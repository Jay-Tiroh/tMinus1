import { useKyc } from "@/features/kyc/hooks/useKyc";
import { useGoToRoute } from "@/shared/hooks/useGoToRoute";
import { useMemo } from "react";

export type KycPhase = "inProgress" | "approved" | "failed";

const STATUS_CONFIG: Record<
  KycPhase,
  { phase: KycPhase; title: string; description: string; cta: string }
> = {
  inProgress: {
    phase: "inProgress",
    title: "Review in progress",
    description: "Your identity submission has been sent for manual review.",
    cta: "Back to home",
  },
  approved: {
    phase: "approved",
    title: "Verification approved",
    description: "Your account limits have been upgraded.",
    cta: "Start trading",
  },
  failed: {
    phase: "failed",
    title: "Review needs attention",
    description: "Compliance could not approve your submission yet.",
    cta: "Resubmit documents",
  },
};

export const useKycStatus = () => {
  const { kycStatus } = useKyc();

  const goHome = useGoToRoute("/(tabs)/home");
  const goTrade = useGoToRoute("/(tabs)/markets");
  const goKyc = useGoToRoute("/kyc/step1");

  const phase: KycPhase = useMemo(() => {
    if (kycStatus === "approved") return "approved";
    if (kycStatus === "rejected") return "failed";
    return "inProgress";
  }, [kycStatus]);

  const currentConfig = STATUS_CONFIG[phase];

  const handlePress = () => {
    if (phase === "inProgress") goHome();
    if (phase === "approved") goTrade();
    if (phase === "failed") goKyc();
  };

  return {
    phase,
    currentConfig,
    handlePress,
  };
};
