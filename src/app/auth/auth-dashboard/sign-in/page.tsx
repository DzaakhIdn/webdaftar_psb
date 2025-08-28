import { CONFIG } from "@/global-config";
import { SignInView } from "@/auth/view/centered-sign-in-view";
import { ToastProvider } from "@/components/providers/toast-provider";

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | ${CONFIG.appName}` };

export default function Page() {
  return (
    <ToastProvider>
      <SignInView />
    </ToastProvider>
  );
}
