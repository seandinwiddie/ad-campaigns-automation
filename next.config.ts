import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["sharp", "canvas"],
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_POLLINATIONS_API_KEY: process.env.NEXT_PUBLIC_POLLINATIONS_API_KEY ?? process.env.POLLINATIONS_API_KEY,
    NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN ?? process.env.DROPBOX_ACCESS_TOKEN,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
