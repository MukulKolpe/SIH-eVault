/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "ipfs.io"],
  },
};

module.exports = nextConfig;
