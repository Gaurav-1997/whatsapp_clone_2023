/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

const nextConfig = {
    reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.example.com",
        port: "",
        pathname: "/account123/**",
      },
    ],
  },
};

module.exports = nextConfig;
