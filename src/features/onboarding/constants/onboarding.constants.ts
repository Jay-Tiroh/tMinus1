import Ill1 from "@/assets/images/onboard1.svg";
import Ill2 from "@/assets/images/onboard2.svg";
import Ill3 from "@/assets/images/onboard3.svg";
import type { OnboardingPageConfig } from "../types/onboarding.types";

export const ONBOARDING_PAGES: OnboardingPageConfig[] = [
  {
    id: 1,
    image: Ill1,
    title: "Trade anytime anywhere",
    subtitle:
      "Access the market 24/7 and execute trades instantly with a seamless, secure, and reliable platform built for speed.",
  },
  {
    id: 2,
    image: Ill2,
    title: "Save and invest at the same time",
    subtitle:
      "Grow your money effortlessly by saving and investing in one place, with smart tools that help you plan and stay consistent.",
  },
  {
    id: 3,
    image: Ill3,
    title: "Transact fast and easy",
    subtitle:
      "Send, receive, and manage transactions in seconds with a simple interface designed to make every payment smooth and stress-free.",
  },
];
