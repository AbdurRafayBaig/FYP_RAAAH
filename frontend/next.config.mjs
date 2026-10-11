/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server in .next/standalone for the Web Server container (Deployment Diagram, Fig. 45).
  // Vercel builds the app with its own output format, so it is left alone there.
  output: process.env.VERCEL ? undefined : 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'thumb.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
};

export default nextConfig;
