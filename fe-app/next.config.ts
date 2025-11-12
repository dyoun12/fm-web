import type { NextConfig } from "next";

// Static export for S3 hosting
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Ensure next/image works in static export
    unoptimized: true,
  },
};

export default nextConfig;
