import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["pg"],
  agentRules: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "260mb",
    },
    proxyClientMaxBodySize: 260 * 1024 * 1024,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
