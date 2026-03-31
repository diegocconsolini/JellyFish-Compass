import type { NextConfig } from "next";
import webpack from "next/dist/compiled/webpack/webpack-lib.js";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // pptxgenjs uses node: protocol imports that don't exist in browser
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource: { request: string }) => {
            resource.request = resource.request.replace(/^node:/, "");
          },
        ),
      );
      config.resolve.fallback = {
        ...config.resolve.fallback,
        https: false,
        http: false,
        fs: false,
        url: false,
        zlib: false,
        stream: false,
        buffer: false,
        util: false,
        assert: false,
        "image-size": false,
        express: false,
      };
    }
    return config;
  },
};

export default nextConfig;
