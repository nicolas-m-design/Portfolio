/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.cosmicjs.com'
      },
      {
        protocol: 'https',
        hostname: 'imgix.cosmicjs.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/experiments/animated-wordmark',
        destination: '/experiments/animated-wordmark/index.html',
      },
      {
        source: '/experiments/token-brand-system',
        destination: '/experiments/token-brand-system/index.html',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      },
      {
        source: '/experiments/animated-wordmark/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' }
        ]
      },
      {
        source: '/experiments/token-brand-system/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' }
        ]
      }
    ]
  },
  // Vercel optimizations
  experimental: {
    optimizePackageImports: ['@vercel/speed-insights']
  },
  // Ensure static generation works properly
  output: 'standalone',
}

module.exports = nextConfig