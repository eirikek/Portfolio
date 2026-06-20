import type { Metadata } from "next";
import { SeoContentPage } from "@/components/SeoContentPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Certifications | Eirik Engen Kvam",
  description:
    "Microsoft certifications earned by Eirik Engen Kvam across Azure, Microsoft 365, security, compliance, identity, AI and data fundamentals.",
  path: "/certifications",
  keywords: ["Eirik Kvam certifications", "Microsoft certifications", "Azure certifications"],
});

export default function CertificationsPage() {
  return (
    <SeoContentPage
      active="certifications"
      title="Eirik Engen Kvam Certifications"
      intro="Microsoft certifications and credentials covering Azure, Microsoft 365, security, compliance, identity, artificial intelligence and data fundamentals."
    />
  );
}
