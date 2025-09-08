import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardLayout } from "@/layout/dashboard/layout";
import { Providers } from "./providers";
import AuthGuard from "@/auth/guard/auth-guard";
import "./globals.css";
import { paths } from "@/routes/paths";
// import { ProgressBar } from "@/components/progress-bar/progress-bar";

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "Dashboard application with Next.js",
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Suspense>
        <AuthGuard
          allowedRoles={["admin", "panitia", "bendahara", "kepala", "operator"]}
          loginPath={paths.authDashboard.signIn}
        >
          {/* <ProgressBar /> */}
          <DashboardLayout>{children}</DashboardLayout>
        </AuthGuard>
      </Suspense>
    </Providers>
  );
}
