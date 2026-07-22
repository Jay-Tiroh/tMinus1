import AccountLimits from "@/features/kyc/components/AccountLimits";
import IndexPage from "@/features/kyc/components/IndexPage";
import { useKyc } from "@/features/kyc/hooks/useKyc";
import KycStatusScreen from "@/features/kyc/screens/KycStatusScreen";
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
