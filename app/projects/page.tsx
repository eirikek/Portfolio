import type { Metadata } from "next";
import { SeoContentPage } from "@/components/SeoContentPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projects | Eirik Engen Kvam",
  description:
    "Selected web development projects by Eirik Engen Kvam, including Next.js, React, TypeScript, Sanity CMS, PWA, SEO and cloud integrations.",
  path: "/projects",
  keywords: ["Eirik Kvam projects", "Next.js portfolio", "React projects", "Sanity CMS"],
});

export default function ProjectsPage() {
  return (
    <SeoContentPage
      active="projects"
      title="Eirik Engen Kvam Projects"
      intro="A crawlable overview of websites, apps and digital products built by Eirik Kvam with React, Next.js, TypeScript, Sanity CMS and cloud platforms."
    />
  );
}
