import { Experience } from "@/components/Experience";
import { contact, layers } from "@/lib/portfolioData";
import { absoluteUrl, defaultDescription, defaultTitle, siteUrl } from "@/lib/seo";

export default function Home() {
  const projects = layers.find((layer) => layer.id === "projects")?.bodies ?? [];
  const projectUrl = (url?: string) => (url === "#" || !url ? siteUrl : url);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: defaultTitle,
        alternateName: ["Eirik Kvam Portfolio", "eirikkvam.no"],
        description: defaultDescription,
        inLanguage: "en",
        author: { "@id": `${siteUrl}/#person` },
        publisher: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Eirik Engen Kvam",
        alternateName: ["Eirik Kvam", contact.name],
        url: siteUrl,
        email: `mailto:${contact.email}`,
        jobTitle: ["Software Developer", "Full-Stack Developer"],
        description:
          "Eirik Engen Kvam is a software developer based in Trondheim, Norway, working with modern web development, cloud platforms and digital solutions.",
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
        worksFor: { "@id": `${siteUrl}/#hoggorm-design` },
        knowsLanguage: ["English", "Norwegian"],
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
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: defaultTitle,
        description: defaultDescription,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#person` },
        mainEntity: { "@id": `${siteUrl}/#person` },
        inLanguage: "en",
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#hoggorm-design`,
        name: "Hoggorm Design",
        founder: { "@id": `${siteUrl}/#person` },
        member: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#portfolio`,
        url: siteUrl,
        name: "Eirik Kvam | Portfolio",
        isPartOf: { "@id": `${siteUrl}/#website` },
        description:
          "Projects, experience, certifications and technical skills of software developer Eirik Engen Kvam.",
        mainEntity: { "@id": `${siteUrl}/#person` },
        breadcrumb: { "@id": `${siteUrl}/#breadcrumb` },
        hasPart: projects.map((project) => ({
          "@type": "CreativeWork",
          name: project.name,
          description: project.description,
          url: projectUrl(project.link?.url),
          creator: { "@id": `${siteUrl}/#person` },
          keywords: project.tags?.join(", "),
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Eirik Engen Kvam",
            item: siteUrl,
          },
        ],
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
      <aside className="semantic-portfolio" aria-label="Portfolio index">
        <header>
          <h1>Eirik Engen Kvam - Software Developer in Trondheim, Norway</h1>
          <p>
            Eirik Kvam builds websites and digital products with React, Next.js,
            TypeScript, Azure, Docker and Sanity CMS.
          </p>
        </header>

        <nav aria-label="Portfolio sections">
          <a href={absoluteUrl("/projects")}>Projects by Eirik Kvam</a>
          <a href={absoluteUrl("/experience")}>Experience</a>
          <a href={absoluteUrl("/certifications")}>Certifications</a>
          <a href={absoluteUrl("/skills")}>Skills</a>
          <a href={absoluteUrl("/contact")}>Contact</a>
        </nav>

        {layers.map((layer) => (
          <section id={layer.id} key={layer.id}>
            <h2>{layer.title}</h2>
            {layer.bodies.map((body) => (
              <article key={body.id}>
                <h3>{body.name}</h3>
                {body.meta && <p>{body.meta}</p>}
                <p>{body.description}</p>
                {body.link && <a href={projectUrl(body.link.url)}>{body.link.label}</a>}
              </article>
            ))}
          </section>
        ))}

        <section id="contact">
          <h2>Contact Eirik Engen Kvam</h2>
          <a href={`mailto:${contact.email}`}>Email</a>
          <a href={contact.linkedin}>LinkedIn</a>
          <a href={contact.github}>GitHub</a>
          <a href={contact.cv}>CV</a>
        </section>
      </aside>
    </>
  );
}
