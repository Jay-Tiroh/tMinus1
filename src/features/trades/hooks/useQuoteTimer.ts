import { useEffect, useState } from "react";

export const useQuoteTimer = (
  initialTimeRemaining: number,
  isQuoteExpired: boolean,
) => {
  const [localTimeLeft, setLocalTimeLeft] = useState(initialTimeRemaining);

  useEffect(() => {
    setLocalTimeLeft(initialTimeRemaining);
  }, [initialTimeRemaining]);

  useEffect(() => {
    if (localTimeLeft <= 0 || isQuoteExpired) return;
    const timer = setInterval(() => {
      setLocalTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [localTimeLeft, isQuoteExpired]);

  const isExpired = isQuoteExpired || localTimeLeft === 0;

  return { localTimeLeft, isExpired };
};
