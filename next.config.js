/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'saalil-ml-contextual-search.hf.space',
      },
    ],
  },
}

module.exports = nextConfig
