import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: process.env.REMOTE_IMG_PROTOCOL as "https" | "http",
        hostname: process.env.REMOTE_IMG_HOSTNAME as string,
        port: process.env.REMOTE_IMG_PORT,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
