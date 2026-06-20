import { contact, layers, type LayerId, type PortfolioBody } from "@/lib/portfolioData";

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/certifications", label: "Certifications" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

function itemLabel(item: PortfolioBody) {
  return `${item.name}${item.meta ? `, ${item.meta}` : ""}`;
}

function itemUrl(url: string) {
  return url === "#" ? "/" : url;
}

export function SeoContentPage({
  active,
  title,
  intro,
}: {
  active: LayerId | "contact";
  title: string;
  intro: string;
}) {
  const layer = active === "contact" ? null : layers.find((item) => item.id === active);

  return (
    <main className="seo-page">
      <div className="seo-page__inner">
        <nav className="seo-page__nav" aria-label="Portfolio pages">
          {pageLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={
                (active === "contact" && link.href === "/contact") ||
                link.href === `/${active}`
                  ? "page"
                  : undefined
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        <header className="seo-page__header">
          <p className="seo-page__eyebrow">Eirik Engen Kvam Portfolio</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </header>

        {layer ? (
          <section className="seo-page__section" aria-label={layer.title}>
            {layer.bodies.map((item) => (
              <article className="seo-page__item" key={item.id}>
                <h2>{itemLabel(item)}</h2>
                <p>{item.description}</p>
                {item.tags?.length ? (
                  <ul className="seo-page__tags" aria-label={`${item.name} technologies and topics`}>
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                ) : null}
                {item.link ? <a href={itemUrl(item.link.url)}>{item.link.label}</a> : null}
              </article>
            ))}
          </section>
        ) : (
          <section className="seo-page__section" aria-label="Contact Eirik Engen Kvam">
            <article className="seo-page__item">
              <h2>Contact Eirik Engen Kvam</h2>
              <p>
                Eirik Kvam is available through email, LinkedIn and GitHub for software
                development, portfolio and web project enquiries.
              </p>
              <ul className="seo-page__links">
                <li>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
                <li>
                  <a href={contact.linkedin}>LinkedIn profile</a>
                </li>
                <li>
                  <a href={contact.github}>GitHub profile</a>
                </li>
                <li>
                  <a href={contact.cv}>Download CV</a>
                </li>
              </ul>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}
