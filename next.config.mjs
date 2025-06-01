/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'http://handsfinance.my.id',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      }
      // You can add other hostnames here if needed
    ],
  },
  // webpack: (
  //   config,
  //   { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  // ) => {
  //   // Note: This function is executed three times:
  //   // - twice for the server (nodejs / edge runtime)
  //   // - once for the client
  //   //
  //   // Important: return the modified config
  //   //
  //   // Add your custom webpack configurations here. For example:
  //   // config.module.rules.push({
  //   //   test: /\.svg$/,
  //   //   use: ['@svgr/webpack'],
  //   // });

  //   return config;
  // },
  // Add any other Next.js configurations here if you have them
  // For example:
  // reactStrictMode: true,
};

export default nextConfig;