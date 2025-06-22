import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["bucket-production-7d13.up.railway.app", "localhost"],
  },
};

export default nextConfig;
