import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const hostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const nextConfig: NextConfig = {
  devIndicators: false,

  images: {
    remotePatterns: hostname
      ? [
          {
            protocol: "https",
            hostname,
          },
        ]
      : [],
  },
};

export default nextConfig;
