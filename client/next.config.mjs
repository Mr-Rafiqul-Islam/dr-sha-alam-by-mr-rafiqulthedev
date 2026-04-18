import { withNextVideo } from "next-video/process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    qualities: [75, 80, 85, 90, 95, 100],
  },
};

export default withNextVideo(nextConfig, {
  mux: {
    proxy: false,
    fetch: false,
  },
});
