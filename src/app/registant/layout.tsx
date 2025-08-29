import AuthGuard from "@/auth/guard/auth-guard";
import { Providers } from "../dashboard/providers";
import { Suspense } from "react";
import { RegistantLayout } from "@/layout/dashboard_user";

export const metadata = {
  title: "User Dashboard",
  description: "Dashboard for users",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Suspense>
        <AuthGuard allowedRoles={["user"]} loginPath="/auth/auth-user">
          <RegistantLayout>{children}</RegistantLayout>
        </AuthGuard>
      </Suspense>
    </Providers>
  );
}
