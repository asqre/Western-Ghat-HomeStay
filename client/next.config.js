const webpack = require("webpack");
const { parsed: myEnv } = require("dotenv").config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "img.youtube.com"],
  },
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
    return config;
  },
};

module.exports = nextConfig;
