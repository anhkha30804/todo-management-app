import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: process.env.VERCEL ? undefined : 'standalone',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/board',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
