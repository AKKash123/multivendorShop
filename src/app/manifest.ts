import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MarketHub Marketplace",
    short_name: "MarketHub",
    description: "Multi-vendor shopping marketplace",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f8fb",
    theme_color: "#132c49",
    icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }]
  };
}
