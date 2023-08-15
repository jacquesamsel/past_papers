const withTM = require('next-transpile-modules')(['@piwikpro/next-piwik-pro'])

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = withTM(nextConfig)
