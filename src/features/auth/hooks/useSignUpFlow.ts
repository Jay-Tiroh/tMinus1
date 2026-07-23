import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { showErrorToast } from "@/shared/hooks/showToast";
import { useValidateSignupMutation } from "../api/authApi";
import { signupSchema } from "../validation/authSchemas";

const signUpFormSchema = signupSchema
  .extend({
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export const useSignUpFlow = () => {
  const router = useRouter();

  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
    },
    mode: "onChange",
  });

  const [validateSignup, { isLoading: isValidating }] =
    useValidateSignupMutation();

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const validationResult = await validateSignup({
        email: data.email,
        phone: data.phone.replace(/\s/g, ""),
      }).unwrap();

      if (!validationResult.canRegister) {
        const emailError = !validationResult.email?.available
          ? validationResult.email?.message
          : null;
        const phoneError = !validationResult.phone?.available
          ? validationResult.phone?.message
          : null;

        showErrorToast({
          title: "Registration Unavailable",
          message:
            emailError ||
            phoneError ||
            "These details cannot be used to register.",
        });
        return;
      }

      router.replace({
        pathname: "/verify",
        params: { email: data.email },
      });
    } catch (error: any) {
      showErrorToast({
        title: "Registration Failed",
        message:
          error?.data?.message ||
          "An unexpected error occurred. Please try again.",
      });
    }
  };

  return {
    control,
    isLoading: isValidating,
    handleSubmit: handleSubmit(onSubmit),
  };
};
