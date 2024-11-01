/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        dns: false,
        tls: false,
        fs: false,
        dgram: false,
        'utf-8-validate': false,
        'bufferutil': false,
        'supports-color': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig