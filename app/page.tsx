import { Experience } from "@/components/Experience";
import { contact, layers } from "@/lib/portfolioData";

const siteUrl = "https://eirikkvam.no";

export default function Home() {
  const projects = layers.find((layer) => layer.id === "projects")?.bodies ?? [];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Eirik Kvam | Portfolio",
        description:
          "Portfolio of software developer Eirik Engen Kvam, based in Trondheim, Norway.",
        inLanguage: "en",
        author: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Eirik Engen Kvam",
        alternateName: contact.name,
        url: siteUrl,
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
        worksFor: { "@id": `${siteUrl}/#hoggorm-design` },
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
        hasPart: projects.map((project) => ({
          "@type": "CreativeWork",
          name: project.name,
          description: project.description,
          url: project.link?.url,
          creator: { "@id": `${siteUrl}/#person` },
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
      <aside className="semantic-portfolio" aria-label="Portfolio index">
        <nav aria-label="Portfolio sections">
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#certifications">Certifications</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>

        {layers.map((layer) => (
          <section id={layer.id} key={layer.id}>
            <h2>{layer.title}</h2>
            {layer.bodies.map((body) => (
              <article key={body.id}>
                <h3>{body.name}</h3>
                {body.meta && <p>{body.meta}</p>}
                <p>{body.description}</p>
                {body.link && <a href={body.link.url}>{body.link.label}</a>}
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
