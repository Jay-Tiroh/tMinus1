import React from "react";

export type OnboardingPageConfig = {
  id: number;
  image: React.FC<{ style?: any }>;
  title: string;
  subtitle: string;
};
