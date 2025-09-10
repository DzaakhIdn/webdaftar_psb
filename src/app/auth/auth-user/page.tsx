import { Suspense } from "react";
import SignPage from "./sign";

export default function AuthPage() {
  return (
    <Suspense>
      <SignPage />
    </Suspense>
  );
}
