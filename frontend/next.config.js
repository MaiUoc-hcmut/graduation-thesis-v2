/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/study365-a3ffe.appspot.com/o/**',
      },
    ],
  },
};

// const withVideos = require('next-videos');

// module.exports = withVideos({
//   assetPrefix: 'https://www.youtube.com',
//   basePath: '/watch',

//   webpack(config, options) {
//     return config;
//   },
// });

module.exports = nextConfig;
