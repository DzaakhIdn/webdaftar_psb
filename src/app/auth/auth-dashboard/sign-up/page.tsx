import { SignUpView } from "@/auth/view/sign-up-view";
import { ToastProvider } from "@/components/providers/toast-provider";

export default function Page() {
  return (
    <ToastProvider>
      <SignUpView />
    </ToastProvider>
  );
}
