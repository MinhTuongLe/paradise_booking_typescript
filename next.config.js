/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: false,
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
    GOOGLE_OAUTH_CLIENT_ID:
      "831989111939-4ejcpi2h7nlrbe07pddu42dje2ors07j.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "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",
    DEPLOYMENT_NAME: "paradisechat",
    ENDPOINT: "https://paradiseopenai.openai.azure.com/",
    AZURE_KEY: "93643d8426ae4c57883a377bd8a1d697",
    BOT_ID: "app_39mlvb432qbb",
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
};

module.exports = nextConfig;
