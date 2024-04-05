/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

const nextConfig = {
    reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com", "localhost"],
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
