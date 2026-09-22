/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Railway runs `next start`, so the optimizer can emit a Retina srcset.
    // Hero source is 3840×2160 — include 1600/2880 steps so phone DPR3 and
    // large Retina desktops pick a width ≤ intrinsic (never upscale past 3840).
    qualities: [75, 85, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 2560, 2880, 3840],
    formats: ["image/webp"],
  },
}

export default nextConfig
