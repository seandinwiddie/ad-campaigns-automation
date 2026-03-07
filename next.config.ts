import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["sharp", "canvas"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
