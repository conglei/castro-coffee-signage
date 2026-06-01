import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site (HTML/CSS/JS) into ./out — drop straight onto
  // Vercel (or any static host). No server runtime needed for this signage.
  output: "export",
  // next/image optimization needs a server; signage uses plain <img>, so opt out.
  images: { unoptimized: true },
};

export default nextConfig;
