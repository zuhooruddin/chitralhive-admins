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

  // Disable ESLint during builds to avoid warnings (warnings won't block build anyway)
  eslint: {
    ignoreDuringBuilds: true,
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

