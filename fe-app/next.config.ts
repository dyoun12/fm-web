import type { NextConfig } from "next";

// Static export for S3 hosting
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Ensure next/image works in static export
    unoptimized: true,
  },
  // Force Webpack bundler to avoid Turbopack port-binding issues in sandboxed CI
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
