import { useUser } from "@/hooks/useUser";

const useMisc = () => {
  const { fullName, email, phone } = useUser();

  const details = [
    {
      name: "username",
      label: "Username",
      value: fullName,
    },
    {
      name: "email",
      label: "Email",
      value: email,
    },
    {
      name: "phone",
      label: "Mobile Number",
      value: phone,
    },
  ] as const;

  return { details };
};

export default useMisc;
