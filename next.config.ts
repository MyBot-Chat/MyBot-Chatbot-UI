import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: {
    BASE_URL: process.env.BASE_URL,
    API_TOKEN: process.env.API_TOKEN,
    CHATBOT_ID: process.env.CHATBOT_ID,
  },
};

export default nextConfig;