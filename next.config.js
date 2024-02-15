/** @type {import('next').NextConfig} */

const withMDX=require('@next/mdx')

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  pageExtensions: ['ts', 'tsx', 'jsx', 'mdx']
}

const withPWA = require("next-pwa")({
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
  cacheOnFrontEndNav: true,

})

module.exports = withPWA(nextConfig)

