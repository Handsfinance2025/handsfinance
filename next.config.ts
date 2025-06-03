/**
 * @type {import('next').NextConfig}
 */
const nextConfig: import('next').NextConfig = {
   
    env: {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    },
  }
  export default nextConfig;