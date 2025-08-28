"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "@/styles/nprogress.css";

export default function ProgressBarProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // Start progress bar ketika path berubah
    NProgress.start();
    // Setelah render selesai → stop progress bar
    NProgress.done();
  }, [pathname]);

  return null;
}
