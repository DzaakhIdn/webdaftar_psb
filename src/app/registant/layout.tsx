import AuthGuard from "@/auth/guard/auth-guard";
import { Providers } from "../dashboard/providers";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { RegistantLayout } from "@/layout/dashboard_user";
// import { ProgressBar } from "@/components/progress-bar/progress-bar";
import "./globals.css";

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
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <AuthGuard allowedRoles={["user"]} loginPath="/auth/auth-user">
          {/* <ProgressBar /> */}
          <RegistantLayout>{children}</RegistantLayout>
        </AuthGuard>
      </Suspense>
    </Providers>
  );
}
