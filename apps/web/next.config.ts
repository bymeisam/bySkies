import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@repo/ui", "@repo/types"],
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  webpack(config, { isServer }) {
    // SVGR configuration for UI package SVGs (source only, not dist)
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      include: [
        path.resolve(__dirname, "../../packages/ui/src"),
        path.resolve(__dirname, "./components"),
      ],
      exclude: [
        path.resolve(__dirname, "../../packages/ui/dist"),
      ],
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            typescript: true,
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });

    // Handle other SVG imports (for static assets), excluding UI package src and dist
    config.module.rules.push({
      test: /\.svg$/i,
      type: "asset/resource",
      issuer: (file: string) => !file.includes("packages/ui"),
    });

    return config;
  },
};

export default nextConfig;
