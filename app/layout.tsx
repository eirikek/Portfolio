import type { Metadata, Viewport } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import { BrowserFavicon } from "@/components/BrowserFavicon";
import { defaultDescription, defaultTitle, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-heading",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Eirik Kvam",
  },
  description: defaultDescription,
  applicationName: `${siteName} Portfolio`,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  keywords: [
    "Eirik Kvam",
    "Eirik Engen Kvam",
    "Eirik Engen Kvam portfolio",
    "software developer Trondheim",
    "software developer Ålesund",
    "full-stack developer Norway",
    "React developer",
    "Next.js developer",
    "TypeScript developer",
    "Azure",
    "Docker",
    "Sanity CMS",
    "web development",
    "software developer portfolio",
  ],
  category: "technology",
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
    },
  },
  openGraph: {
    type: "profile",
    url: siteUrl,
    title: defaultTitle,
    description: defaultDescription,
    siteName: `${siteName} Portfolio`,
    locale: "en_US",
    firstName: "Eirik",
    lastName: "Engen Kvam",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Eirik Engen Kvam software developer portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [`${siteUrl}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#03040c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${spaceGrotesk.variable}`}>
        <BrowserFavicon />
        {children}
      </body>
    </html>
  );
}
