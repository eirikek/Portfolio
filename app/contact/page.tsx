import type { Metadata } from "next";
import { SeoContentPage } from "@/components/SeoContentPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact | Eirik Engen Kvam",
  description:
    "Contact Eirik Engen Kvam, software developer in Trondheim, Norway, through email, LinkedIn, GitHub or CV.",
  path: "/contact",
  keywords: ["contact Eirik Kvam", "Eirik Engen Kvam email", "Eirik Kvam LinkedIn"],
});

export default function ContactPage() {
  return (
    <SeoContentPage
      active="contact"
      title="Contact Eirik Engen Kvam"
      intro="Contact details and professional profiles for Eirik Kvam, software developer in Trondheim, Norway."
    />
  );
}
