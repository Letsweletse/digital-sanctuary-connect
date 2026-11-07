/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: { unoptimized: true },
  async redirects() {
    return [{ source: '/conference', destination: '/events', permanent: true }];
  },
};
export default nextConfig;
