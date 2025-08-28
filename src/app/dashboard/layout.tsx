import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardLayout } from "@/layout/dashboard/layout";
import { Providers } from "./providers";
import AuthGuard from "@/auth/guard/auth-guard";
import "./globals.css";
import { paths } from "@/routes/paths";
import ProgressBarProvider from "@/components/nprogress/nprogress-provider";

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
      <Suspense fallback={<div>Loading...</div>}>
        <AuthGuard
          allowedRoles={["admin", "user"]}
          loginPath={paths.authDashboard.signIn}
        >
          <DashboardLayout>{children}</DashboardLayout>
        </AuthGuard>
      </Suspense>
    </Providers>
  );
}
