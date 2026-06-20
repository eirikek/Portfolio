import type { Metadata } from "next";

export const siteUrl = "https://eirikkvam.no";
export const siteName = "Eirik Engen Kvam";
export const shortName = "Eirik Kvam";
export const defaultTitle = "Eirik Engen Kvam | Software Developer";
export const defaultDescription =
  "Eirik Engen Kvam is a software developer in Trondheim, Norway, building websites and digital products with React, Next.js, TypeScript, Azure, Docker and Sanity CMS.";
export const contentLastModified = new Date("2026-06-21");

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      "Eirik Kvam",
      "Eirik Engen Kvam",
      "software developer",
      "Trondheim",
      "Norway",
      ...keywords,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: `${siteName} Portfolio`,
      locale: "en_US",
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: "Eirik Engen Kvam software developer portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
  };
}
