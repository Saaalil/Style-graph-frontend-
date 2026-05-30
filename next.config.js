/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'saaalil-ml-contextual-search-prod.hf.space',
      },
    ],
  },
}

module.exports = nextConfig
