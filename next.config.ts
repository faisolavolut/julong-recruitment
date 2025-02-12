import type { NextConfig } from "next";
import dotenv from "dotenv";

dotenv.config();
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false, // Abaikan module 'canvas' yang tidak dibutuhkan
    };
    return config;
  },
};

export default nextConfig;
