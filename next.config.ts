import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deployed as a normal Next app on Vercel: pages are still statically
  // prerendered, but we keep a server runtime so /api/refresh can re-read the
  // live drinks sheet on demand (the "Refresh" button). Previously this was a
  // pure static export (`output: "export"`), which has no server and so can't
  // host an API route.
  // next/image optimization isn't needed; signage uses plain <img>, so opt out.
  images: { unoptimized: true },
};

export default nextConfig;
