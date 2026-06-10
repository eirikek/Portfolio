import { Experience } from "@/components/Experience";
import { contact, layers } from "@/lib/portfolioData";

export default function Home() {
  const projects = layers.find((layer) => layer.id === "projects")?.bodies ?? [];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://eirikkvam.dev/#website",
        url: "https://eirikkvam.dev",
        name: "Eirik Kvam | Portfolio",
        description:
          "Portfolio of software developer Eirik Kvam, based in Trondheim, Norway.",
        inLanguage: "en",
        author: { "@id": "https://eirikkvam.dev/#person" },
      },
      {
        "@type": "Person",
        "@id": "https://eirikkvam.dev/#person",
        name: contact.name,
        url: "https://eirikkvam.dev",
        email: `mailto:${contact.email}`,
        jobTitle: "Software Developer",
        description:
          "Software developer based in Trondheim, Norway, working with modern web development, cloud platforms and digital solutions.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Trondheim",
          addressCountry: "NO",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Norwegian University of Science and Technology",
          alternateName: "NTNU",
          url: "https://www.ntnu.edu/",
        },
        sameAs: [contact.linkedin, contact.github],
        knowsAbout: [
          "React",
          "Next.js",
          "TypeScript",
          "JavaScript",
          "Azure",
          "Docker",
          "Sanity CMS",
          "Web Development",
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": "https://eirikkvam.dev/#portfolio",
        url: "https://eirikkvam.dev",
        name: "Eirik Kvam | Portfolio",
        isPartOf: { "@id": "https://eirikkvam.dev/#website" },
        description:
          "Projects, experience, certifications and technical skills of software developer Eirik Kvam.",
        mainEntity: { "@id": "https://eirikkvam.dev/#person" },
        hasPart: projects.map((project) => ({
          "@type": "CreativeWork",
          name: project.name,
          description: project.description,
          url: project.link?.url,
          creator: { "@id": "https://eirikkvam.dev/#person" },
          keywords: project.tags?.join(", "),
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Experience />
    </>
  );
}
