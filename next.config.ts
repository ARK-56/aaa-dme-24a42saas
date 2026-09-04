import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A stray lockfile in the parent directory makes Next infer the wrong root.
  outputFileTracingRoot: path.join(__dirname),
  // theme/ holds the original static site; it is reference only, never built
  eslint: { dirs: ["src"] },
};

export default nextConfig;
