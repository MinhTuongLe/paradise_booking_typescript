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
    ENDPOINT: "https://paradiseopenaichat.openai.azure.com/",
    AZURE_KEY: "b314afb1f39841eab1303ee588358e60",
    BOT_ID: "app_v82fpgox6xuu",
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
