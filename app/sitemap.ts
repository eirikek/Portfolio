import type { MetadataRoute } from "next";
import { absoluteUrl, contentLastModified } from "@/lib/seo";

const routes = [
  { path: "/", priority: 1 },
  { path: "/projects", priority: 0.85 },
  { path: "/experience", priority: 0.85 },
  { path: "/certifications", priority: 0.75 },
  { path: "/skills", priority: 0.75 },
  { path: "/contact", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: contentLastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
