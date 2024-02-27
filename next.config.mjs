/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  devIndicators:{
    buildActivity:true,
    buildActivityPosition:'bottom-right'
  },
  output: "standalone",
  basePath:"",

  images: {
    unoptimized: true,
    disableStaticImages: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 768],
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

}

export default nextConfig
