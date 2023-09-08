/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["utfs.io"],
  },
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig
