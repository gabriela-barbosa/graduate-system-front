const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = {
  ...withBundleAnalyzer({}),
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    GRADUATE_API: process.env.GRADUATE_API,
  },
  devIndicators: {
    buildActivity: false,
  },
}
