import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "@byskies/ui",
    "@byskies/utils",
    "@byskies/types",
    "@byskies/tsconfig",
  ],
};

export default nextConfig;
