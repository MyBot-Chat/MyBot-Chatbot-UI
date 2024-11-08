import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
    NEXT_PUBLIC_CHATBOT_ID: process.env.NEXT_PUBLIC_CHATBOT_ID,
  },
  async headers() {
    return [
      {
        source: '/api/:path*', // Match all routes under "/about"
        headers: [
          {
            key: 'Authorization',
            value: 'Bearer 22205ac9-9f48-447d-9b16-e0bb88c2812c', // Set your auth token here
          },
        ],
      },
    ];
  },
};

export default nextConfig;
