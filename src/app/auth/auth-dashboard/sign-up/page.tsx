import { SignUpView } from "@/auth/view/sign-up-view";
import { AlertProvider } from "@/components/providers/alert-provider";

export default function Page() {
  return (
    <AlertProvider>
      <SignUpView />
    </AlertProvider>
  );
}
