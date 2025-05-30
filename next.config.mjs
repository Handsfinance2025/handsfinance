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
  // Add any other Next.js configurations here if you have them
  // For example:
  // reactStrictMode: true,
};

export default nextConfig; 