import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardLayout } from "@/layout/dashboard/layout";
import { DashboardLoadingFallback } from "@/components/loading";
import { SimpleProgressBar } from "@/components/simple-progress-bar";
import { Providers } from "./providers";
import AuthGuard from "@/auth/guard/auth-guard";
import "./globals.css";
import { paths } from "@/routes/paths";

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
      <SimpleProgressBar height={3} color="#3b82f6" />
      <Suspense fallback={<DashboardLoadingFallback />}>
        <AuthGuard allowedRoles={["admin", "user"]} loginPath={paths.authDashboard.signIn}>
          <DashboardLayout>{children}</DashboardLayout>
        </AuthGuard>
      </Suspense>
    </Providers>
  );
}
