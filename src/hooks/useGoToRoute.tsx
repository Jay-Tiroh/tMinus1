import { Href, useRouter } from "expo-router";
import { useCallback } from "react";

type NavigationType = "push" | "replace" | "back";

export const useGoToRoute = (href?: Href, type: NavigationType = "push") => {
  const router = useRouter();

  const handlePress = useCallback(() => {
    if (type === "back") {
      if (router.canGoBack()) {
        router.back();
      }
      return;
    }

    if (href) {
      if (type === "replace") {
        router.replace(href);
      } else {
        router.push(href);
      }
    }
  }, [href, type, router]);

  return handlePress;
};
