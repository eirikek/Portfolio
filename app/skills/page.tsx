import type { Metadata } from "next";
import { SeoContentPage } from "@/components/SeoContentPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Skills | Eirik Engen Kvam",
  description:
    "Technical skills used by Eirik Engen Kvam, including React, Next.js, TypeScript, Python, C#, Azure, Docker, Sanity CMS, WordPress and Microsoft 365.",
  path: "/skills",
  keywords: ["Eirik Kvam skills", "React developer", "Next.js developer", "Azure developer"],
});

export default function SkillsPage() {
  return (
    <SeoContentPage
      active="skills"
      title="Eirik Engen Kvam Skills"
      intro="Technical skills and tools used by Eirik Kvam across frontend, backend, databases, DevOps, CMS platforms and IT operations."
    />
  );
}
