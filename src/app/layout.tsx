
import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
  ),

  title: {
    default: "Ezzyshop | Multi-Vendor Marketplace",
    template: "%s | Ezzyshop",
  },

  description:
    "Discover products from independent sellers in one marketplace. Shop unique products and support independent businesses.",

  applicationName: "Ezzyshop",

  manifest: "/manifest.json",

  openGraph: {
    title: "Ezzyshop | Multi-Vendor Marketplace",
    description:
      "Discover unique products from independent sellers.",
    siteName: "Ezzyshop",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#132c49",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
