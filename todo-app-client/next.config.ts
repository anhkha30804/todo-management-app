import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: process.env.VERCEL ? undefined : 'standalone',
};

export default nextConfig;
