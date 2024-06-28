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
    DEPLOYMENT_NAME: "ParadiseBookingApp",
    ENDPOINT: "https://bookingparadiseapp.openai.azure.com/",
    AZURE_KEY: "3fc67155d00646efb59723dcefc551f5",
    SEARCH_INDEX_NAME: "paradisebookingwebapp",
    SEARCH_ENDPOINT: "https://paradisebookingsearch.search.windows.net",
    SEARCH_AUTHENTICATION:
      "PY8AxaiqTOSFOg9jEg93nPMJYeg0zTTi4o6UHM3suJAzSeB5b1Nc",
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
