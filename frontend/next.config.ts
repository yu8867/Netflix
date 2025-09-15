import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false, // LightningCSS を切って PostCSS を利用
  },
};

export default nextConfig;
