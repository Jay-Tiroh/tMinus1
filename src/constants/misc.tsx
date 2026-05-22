import { useProfileQuery } from "@/store/services/profileApi";

type DetailsType = {
  name: string;
  label: string;
  value: string | undefined;
};

const useMisc = () => {
  const { data: profile, isLoading, isError, error } = useProfileQuery();
  const { fullName, email, phone } = profile?.data || {};
  const profileData = { fullName, email, phone };
  const displayName = fullName ? fullName.split(" ")[0] : "User123";
  const details: DetailsType[] = [
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

  return { details, displayName, isLoading, isError, error, profileData };
};

export default useMisc;
