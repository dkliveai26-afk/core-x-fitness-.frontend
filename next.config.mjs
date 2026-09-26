/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  async redirects() {
    return [
      // Legacy admin aliases redirect to official /admin/dashboard
      {
        source: '/corexfitness-admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
      {
        source: '/corexfitness-admin/:path*',
        destination: '/admin/:path*',
        permanent: false,
      },
      {
        source: '/corex-admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
      {
        source: '/corexfitnessadmin',
        destination: '/admin/dashboard',
        permanent: false,
      },

      // Common typo /dite -> /diet
      {
        source: '/dite',
        destination: '/diet',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
