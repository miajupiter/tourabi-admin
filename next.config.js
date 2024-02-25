/** @type {import('next').NextConfig} */

// const withMDX=require('@next/mdx')

const nextConfig = {
  transpilePackages: ['@mdxeditor/editor'],
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tourabi.s3.eu-central-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "miajupiter.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gstatic.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  pageExtensions: ['ts', 'tsx', 'jsx', 'mdx'],
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, topLevelAwait: true }
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config
  },
}

// const withPWA = require("next-pwa")({
//   dest: "public", // Destination directory for the PWA files
//   disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
//   register: true, // Register the PWA service worker
//   skipWaiting: true, // Skip waiting for service worker activation
//   cacheOnFrontEndNav: true,

// })

// module.exports = withPWA(nextConfig)
module.exports = nextConfig

