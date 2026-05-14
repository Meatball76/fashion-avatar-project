import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // All routes (same intent as `/(.*)` in path-matching terms)
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
