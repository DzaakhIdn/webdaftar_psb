import type { Metadata } from "next";
import { ToastProvider } from "@/components/providers/toast-provider";

export const metadata: Metadata = {
  title: "Pendaftaran - HSI Boarding School",
  description: "Halaman pendaftaran HSI Boarding School",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
