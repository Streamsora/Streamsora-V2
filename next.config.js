/** @type {import('next').NextConfig} */
// const nextSafe = require("next-safe");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.*.*",
      },
      {
        protocol: "https",
        hostname: "**.**.*.*",
      },
      {
        protocol: "https",
        hostname: "simkl.in",
      },
      {
        protocol: "https",
        hostname: "tenor.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/donate",
        destination: "https://ko-fi.com/",
        permanent: false,
        basePath: false,
      },
    ];
  },
});
