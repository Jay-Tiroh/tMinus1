import { useUser } from "@/hooks/useUser";

const useMisc = () => {
  const { fullName, email, phone } = useUser();
  const displayName = fullName ? fullName.split(" ")[0] : "User123";
  const details = [
    {
      name: "username",
      label: "Username",
      value: displayName,
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

  return { details, displayName };
};

export default useMisc;
