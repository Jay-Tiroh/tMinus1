import { useRequestOTPMutation } from "@/store/services/authApi";
import { logger } from "@/utils/logger";
import { useEffect, useRef, useState } from "react";

export const useRequestOtp = () => {
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCooldown = () => {
    // Clear any existing timer to prevent race conditions
    if (timerRef.current) clearInterval(timerRef.current);

    setCountdown(60);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const [requestOtp, { isLoading, error }] = useRequestOTPMutation();

  const handleRequestOtp = async (email: string) => {
    // Prevent execution if the cooldown timer is still active
    if (countdown > 0) return;

    try {
       await requestOtp(email).unwrap();
      startCooldown();
    } catch (err) {
      logger.error("Failed to dispatch OTP", err);
    }
  };

  // Cleanup interval on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { handleRequestOtp, isLoading, error, countdown };
};
