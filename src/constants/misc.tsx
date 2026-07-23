import { useProfileQuery } from "@/features/user";

type DetailsType = {
  name: string;
  label: string;
  value: string | undefined | null;
};

const useMisc = () => {
  const { data: profile, isLoading, isError, error } = useProfileQuery();
  const { fullName, email, phone, avatarUrl } = profile?.data || {};
  const profileData = { fullName, email, phone, avatarUrl };
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
    {
      name: "avatarUrl",
      label: "Avatar URL",
      value: avatarUrl,
    },
  ] as const;

  return { details, displayName, isLoading, isError, error, profileData };
};

export default useMisc;
