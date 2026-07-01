/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  transpilePackages: ["@yourcompany/global-backend-next"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: `${process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000"}/login`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
