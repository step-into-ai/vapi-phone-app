import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd()
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: false
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'microphone=(self), camera=(self), geolocation=(self)'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          },
          {
            key: 'Cross-Origin-Opener-Policy', 
            value: 'same-origin-allow-popups'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
