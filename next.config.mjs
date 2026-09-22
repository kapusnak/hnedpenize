/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Railway runs `next start`, so the optimizer can emit a Retina srcset.
    // unoptimized:true was leftover from the old static export and served the
    // 1280px WebP as-is — jagged on 2x Mac displays.
    qualities: [75, 85],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    formats: ["image/webp"],
  },
}

export default nextConfig
