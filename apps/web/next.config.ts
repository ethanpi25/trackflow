import type { NextConfig } from "next";

const API_URL = process.env.API_URL;

const nextConfig: NextConfig = {
  // Only proxy to external backend when API_URL is set (local dev with separate backend)
  // On Vercel, built-in API Routes handle /api/* directly
  ...(API_URL
    ? {
        async rewrites() {
          return [
            {
              source: "/api/:path*",
              destination: `${API_URL}/api/:path*`,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
