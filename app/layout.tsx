import type { Metadata, Viewport } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
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
  metadataBase: new URL("https://eirikkvam.no"),
  title: {
    default: "Eirik Kvam | Portfolio",
    template: "%s | Eirik Kvam",
  },
  description:
    "Portfolio of Eirik Kvam, a software developer based in Trondheim, Norway. Experience with React, Next.js, TypeScript, Azure, Docker and modern web development. Explore projects, work experience, certifications and technical skills.",
  applicationName: "Eirik Kvam Portfolio",
  authors: [{ name: "Eirik Engen Kvam", url: "https://eirikkvam.no" }],
  creator: "Eirik Engen Kvam",
  publisher: "Eirik Engen Kvam",
  keywords: [
    "Eirik Kvam",
    "Eirik Engen Kvam",
    "software developer Trondheim",
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
    canonical: "https://eirikkvam.no",
    languages: {
      "en-US": "https://eirikkvam.no",
    },
  },
  openGraph: {
    type: "profile",
    url: "https://eirikkvam.no",
    title: "Eirik Kvam | Portfolio",
    description:
      "Software developer based in Trondheim, Norway. Explore projects, work experience, Microsoft certifications and technical skills.",
    siteName: "Eirik Kvam Portfolio",
    locale: "en_US",
    firstName: "Eirik",
    lastName: "Engen Kvam",
    images: [
      {
        url: "https://eirikkvam.no/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Eirik Kvam software developer portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eirik Kvam | Portfolio",
    description:
      "Software developer based in Trondheim, Norway. Explore projects, experience, certifications and technical skills.",
    images: ["https://eirikkvam.no/opengraph-image"],
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
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
        {children}
      </body>
    </html>
  );
}
