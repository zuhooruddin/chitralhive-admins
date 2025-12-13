// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

// module.exports = nextConfig

module.exports = {
  // Set basePath if the app is deployed at /admin/ path
  // Uncomment the line below if your app is served at https://chitralhive.com/admin/
  // basePath: '/admin',

  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. Use with caution.
    ignoreDuringBuilds: false, // Set to true if you want to ignore ESLint errors during builds
  },
  
  devIndicators: {},
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
  },
  images: {
    domains: ["https://chitralhive.com/api/"],
  },
};

