import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/admin/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
