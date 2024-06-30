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
    DEPLOYMENT_NAME: "paradisebookingchat",
    ENDPOINT: "https://bookingparadiseapp.openai.azure.com/",
    AZURE_KEY: "b50093f8b2fe4d4581346879dc211701",
    SEARCH_INDEX_NAME: "paradiseindextest",
    SEARCH_ENDPOINT: "https://paradisebookingsearchservice.search.windows.net",
    SEARCH_AUTHENTICATION:
      "HKsrgqFUNvw24Qr93E61ttI39I7tGSO8bhfsrj5pXiAzSeD8wf0E",
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
