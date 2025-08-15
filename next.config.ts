// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    typedRoutes: true,
    optimizePackageImports: [
      "lucide-react",
      // Tambah paket lain kalau sering dipakai
      // "date-fns",
      // "@/components/ui", // hati-hati: hanya jika struktur ekspornya mendukung
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // { protocol: "https", hostname: "cdn.padma.co.id" },
    ],
  },
};

export default nextConfig;
