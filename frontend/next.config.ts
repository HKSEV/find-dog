import type { NextConfig } from "next";
import { APP_BASE_PATH } from "./lib/deploymentPath";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true
  },
  output: "export",
  basePath: APP_BASE_PATH,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  turbopack: {}
};

export default nextConfig;
