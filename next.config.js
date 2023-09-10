/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["utfs.io", "pbs.twimg.com"],
  },
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig
