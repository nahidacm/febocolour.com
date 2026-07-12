import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: meaningfully smaller than WebP for photographic content (product
    // photos are the bulk of image weight here), Next falls back to WebP/original
    // per-browser automatically based on the request's Accept header.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
