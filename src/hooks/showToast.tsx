import Toast, { ToastPosition } from "react-native-toast-message";

interface ToastOptions {
  title: string;
  message?: string;
  position?: ToastPosition;
  visibilityTime?: number;
}

export const showSuccessToast = ({
  title,
  message,
  position = "top",
  visibilityTime = 4000,
}: ToastOptions) => {
  Toast.show({
    type: "success",
    text1: title,
    text2: message,
    position,
    visibilityTime,
    autoHide: true,
  });
};

export const showErrorToast = ({
  title,
  message,
  position = "top",
  visibilityTime = 4000,
}: ToastOptions) => {
  Toast.show({
    type: "error",
    text1: title,
    text2: message,
    position,
    visibilityTime,
    autoHide: true,
  });
};
