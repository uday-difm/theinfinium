import { withCMS } from "@yourcompany/global-backend-next";

/** @type {import('next').NextConfig} */
const nextConfig = withCMS({
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
});

export default nextConfig;
