import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Three.js / React Three Fiber
  transpilePackages: ['three', 'makerjs'],
  turbopack: {},
  // Standalone output for Docker (minimal image, no full node_modules)
  output: 'standalone',
};

export default nextConfig;
