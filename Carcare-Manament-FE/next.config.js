/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['khoa-luan.s3.ap-southeast-1.amazonaws.com','firebasestorage.googleapis.com'],
  },
}

module.exports = nextConfig
