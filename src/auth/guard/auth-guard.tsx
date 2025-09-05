"use client";
import SplashScreen from "@/components/splash-screen";
import { useAuth } from "../hooks/use-check-auth";

export default function AuthGuard({
  children,
  allowedRoles,
  loginPath,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
  loginPath: string; // path login berbeda
}) {
  const { loading, isAuthenticated } = useAuth({
    redirectTo: loginPath,
    allowedRoles,
  });

  if (loading)
    return (
      <SplashScreen>
        <div />
      </SplashScreen>
    );
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
