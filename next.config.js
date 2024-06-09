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
    GOOGLE_OAUTH_CLIENT_SECRET:
      "831989111939-4ejcpi2h7nlrbe07pddu42dje2ors07j.apps.googleusercontent.com",
    DEPLOYMENT_NAME: "ParadiseBookingApp",
    ENDPOINT: "https://leminhtuong091202.openai.azure.com/",
    AZURE_KEY: "374f5e650a354f30bb9b71e07e9fd4bb",
    SEARCH_INDEX_NAME: "paradisebookingwebapp",
    SEARCH_ENDPOINT: "https://paradisesearch.search.windows.net",
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
  reactStrictMode: false,
};

module.exports = nextConfig;
