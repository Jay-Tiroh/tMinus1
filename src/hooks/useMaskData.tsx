type MaskDataParams = {
  type: "email" | "phone";
  value: string;
};

export const useMaskData = () => {
  const maskEmail = (email: string) => {
    const [username, domain] = email.split("@");

    if (!username || !domain) return email;

    if (username.length <= 2) {
      return `${username.charAt(0)}***@${domain}`;
    }

    const maskedUsername =
      username.charAt(0) +
      username.charAt(1) +
      "*".repeat(username.length - 3) +
      username.slice(-1);

    return `${maskedUsername}@${domain}`;
  };

  const maskPhone = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, "");

    if (cleaned.length <= 4) {
      return "*".repeat(cleaned.length);
    }

    const firstPart = cleaned.slice(0, 3);
    const lastPart = cleaned.slice(-2);
    const maskedPart = "*".repeat(cleaned.length - 5);

    return `${firstPart}${maskedPart}${lastPart}`;
  };

  const maskData = ({ type, value }: MaskDataParams) => {
    if (type === "email") {
      return maskEmail(value);
    }

    return maskPhone(value);
  };

  return {
    maskData,
    maskEmail,
    maskPhone,
  };
};
