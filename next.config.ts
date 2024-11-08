import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
    NEXT_PUBLIC_CHATBOT_ID: process.env.NEXT_PUBLIC_CHATBOT_ID,
  },
};

export default nextConfig;
