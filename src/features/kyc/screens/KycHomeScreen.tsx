import { AccountLimits, IndexPage, KycStatusScreen } from "@/features/kyc";
import { useKyc } from "@/features/kyc/hooks/useKyc";
import React, { useState } from "react";

export const KycHomeScreen = () => {
  const [step, setStep] = useState<number>(0);
  const { kycStatus } = useKyc();

  if (
    kycStatus === "approved" ||
    kycStatus === "rejected" ||
    kycStatus === "pending"
  ) {
    return <KycStatusScreen />;
  }

  return (
    <>
      {step === 0 ? (
        <IndexPage handlePress={setStep} />
      ) : (
        <AccountLimits handlePress={setStep} />
      )}
    </>
  );
};
