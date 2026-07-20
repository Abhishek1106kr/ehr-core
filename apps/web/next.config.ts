import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // This app lives inside an npm workspace monorepo; anchor Turbopack's
    // root explicitly instead of letting it guess from lockfile location.
    root: path.join(__dirname, "..", ".."),
  },
};

export default nextConfig;
