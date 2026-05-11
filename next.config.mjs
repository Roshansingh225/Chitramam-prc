const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "16mb"
    }
  }
};

export default nextConfig;
