const nextIntlPlugin = require('next-intl/plugin');

const withNextIntl = nextIntlPlugin('./i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = withNextIntl(nextConfig);
