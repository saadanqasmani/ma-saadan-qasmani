import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Portraits and covers uploaded through the dashboard are served from
    // the project's Supabase storage bucket.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "*.supabase.in", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
