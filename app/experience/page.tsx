import type { Metadata } from "next";
import { SeoContentPage } from "@/components/SeoContentPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Experience | Eirik Engen Kvam",
  description:
    "Work experience, education and technical background for Eirik Engen Kvam, software developer in Trondheim, Norway.",
  path: "/experience",
  keywords: ["Eirik Kvam experience", "software developer Trondheim", "NTNU"],
});

export default function ExperiencePage() {
  return (
    <SeoContentPage
      active="experience"
      title="Eirik Engen Kvam Experience"
      intro="Work experience, education and technical background for Eirik Kvam, a software developer based in Trondheim, Norway."
    />
  );
}
