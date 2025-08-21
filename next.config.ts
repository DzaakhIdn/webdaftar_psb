import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [], // Disable ESLint completely
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
