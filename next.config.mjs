/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude test files from webpack build
  webpack: (config) => {
    config.module.rules.push({
      test: /\.test\.(ts|tsx)$/,
      use: 'ignore-loader',
    });
    return config;
  },
};

export default nextConfig;
