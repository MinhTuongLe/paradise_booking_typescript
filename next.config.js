/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    GOOGLE_OAUTH_CLIENT_SECRET: "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",
    GOOGLE_OAUTH_ENDPOINT: "http://localhost:3000",
    GOOGLE_OAUTH_REDIRECT: "http://localhost:3000",
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      ...[
        {
          test: /\.yml$/,
          type: "json",
          use: "yaml-loader",
        },
        {
          test: /\.svg$/,
          use: "@svgr/webpack",
        },
      ]
    );
    return config;
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
