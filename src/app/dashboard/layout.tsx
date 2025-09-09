import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardLayout } from "@/layout/dashboard/layout";
import { Providers } from "./providers";
import AuthGuard from "@/auth/guard/auth-guard";
import "./globals.css";
import { paths } from "@/routes/paths";

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "Dashboard application with Next.js",
};

const allowedRoles = [
  "admin",
  "panitia",
  "bendahara",
  "kepala",
  "operator",
  "admin_ikhwan",
  "admin_akhwat",
  "panitia_ikhwan",
  "panitia_akhwat",
  "bendahara_ikhwan",
  "bendahara_akhwat",
];

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Suspense>
        <AuthGuard
          allowedRoles={allowedRoles}
          loginPath={paths.authDashboard.signIn}
        >
          <DashboardLayout>{children}</DashboardLayout>
        </AuthGuard>
      </Suspense>
    </Providers>
  );
}
